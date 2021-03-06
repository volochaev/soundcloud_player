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
      data: 'id=' + ($('input#search').val() || $(this).data('id')),
      success: function() {
        $('input#search').tokenInput("clear");
      }
    });
    return false; 
  });

  if ($('#my-playlist').data('ids')) {
    $.each($('#my-playlist').data('ids'), function(index, value) { 
      $.ajax({
        type: "POST", 
        url: "add/",
        data: 'id=' + value,
        beforeSend: function() {
          $('#my-playlist').append('<img src="/images/loader.gif" class="loader" id="loader-' + value + '" />');
        }
      });
    });
  };
});