$(function() {
  $("#search").tokenInput("/search", {
    crossDomain: false,
    searchDelay: 500,
    minChars: 3,
    hintText: "Start typing...",
    tokenLimit: 1,
    theme: "facebook"
  });
  
  $(".add_to_playlist").click(function() {
    $.ajax({  
      type: "POST",  
      url: "add/",  
      data: 'id=' + $('input#search').val(),
      success: function() {
        $('input#search').tokenInput("clear");
      }
    });
    return false; 
  });

  $.each($('#my-playlist').data('ids'), function(index, value) { 
    $.ajax({
      type: "POST", 
      url: "add/",
      data: 'id=' + value,
      cache: false,
      beforeSend: function() {
        $('#my-playlist').append('<img src="/images/loader.gif" class="loader" id="loader-' + value + '" />');
      }
    });
  });
});