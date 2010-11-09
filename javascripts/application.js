jQuery(function($) {
    var a = $('#barTopMenu li a[href="online.php"]')
      , url = STUDIP.ABSOLUTE_URI_STUDIP + a.attr('href')
      , users = $.get(STUDIP.ABSOLUTE_URI_STUDIP + '/plugins.php/onlinebadge',
          function (data) {
              if (data) {
                  a.parent()
                   .addClass("online_container")
                   .bind('click', function() { location = url; })
                   .append(data);
              }
          });
});
