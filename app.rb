require 'bundler/setup'
require 'sinatra'
require 'sinatra/reloader'
require 'sinatra/json'
require 'securerandom'
require 'soundcloud'
require 'dalli'
require 'slim'
require File.expand_path('../lib/helpers', __FILE__)

# -*- Session config -*-
use Rack::Session::Cookie,
  key: 'SESSION_ID',
  expire_after: 60*60*24*7, # one week
  secret: 'SoundCloud app secret token'
  
# -*- 
helpers do
  include Helpers
  include Rack::Utils  
  alias_method :h, :escape_html
end

# -*- 
enable :sessions
set :key, '9b630df88b31856647d3f010a562f4bb' # CHANGE THIS
set :cache, Dalli::Client.new
$connection = Soundcloud.new(client_id: settings.key)

before do
  session[:id] ||= SecureRandom.uuid
end

get '/' do
  unless settings.cache.get('top5')
    @top = settings.cache.set('top5', $connection.get('/tracks', limit: 5, order: 'hotness').to_a, ttl = 86400)
  end
  @top = settings.cache.get('top5')
  slim :index
end

post '/add/' do
  if request.xhr? && params[:id] && id = params[:id].gsub(/\D/, '')
    @track = $connection.get("/tracks/#{id}")
    content_type 'application/x-javascript', charset: 'utf-8'
    erb 'add/new.js'.to_sym
  else
    redirect '/'
  end
end

get '/search' do
  tracks = $connection.get('/tracks', q: params[:q], limit: 5, order: 'hotness').to_a
  json tracks.map{|t| {id: t.id, name: t.title}}
end

get '/play/:id' do
  # soundcloud-ruby doesn't work. overriding with gem defaults HTTParty.
  if request.xhr? && params[:id] && id = params[:id].gsub(/\D/, '')
    @track = $connection.get("/tracks/#{id}")
    data = HTTParty.get("http://api.soundcloud.com/tracks/#{id}/stream?client_id=#{settings.key}", follow_redirects: false)
    @url = data.headers['location']
    # binding.remote_pry
    content_type 'application/x-javascript', charset: 'utf-8'
    erb 'play.js'.to_sym
  else
    redirect '/'
  end
end
