jQuery(function($) {
    var a = $('#barTopMenu li a[href="online.php"]')
      , li = a.parent()
      // insert hidden badge
      , badge = $('<span id="online_badge">').appendTo(li).hide();

    // add class to parent li and redirect to the a's href on click
    li.addClass("online_container")
      .bind('click', function() { 
            location = STUDIP.ABSOLUTE_URI_STUDIP + a.attr('href');
      });
    
    function update() {
        $.get(STUDIP.ABSOLUTE_URI_STUDIP + '/plugins.php/onlinebadge',
              function (data) {
                  if (data > 0) {
                      badge.html(data).show().attr("title", a.attr("title"));
                  } else {
                      badge.hide();
                  }
              });
    }

    update();
    var timer = setInterval(update, 60 * 1000);
});
