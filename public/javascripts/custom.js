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
});