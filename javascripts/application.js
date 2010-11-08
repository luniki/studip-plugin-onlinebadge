jQuery(function($) {
    var a = $('#barTopMenu li a[href="online.php"]')
      , url = STUDIP.ABSOLUTE_URI_STUDIP + a.attr('href');

    a.parent()
     .addClass("online_container")
     .bind('click', function() { location = url; })
     .append('<span id="online_badge"/>')
     .children(":last")
     .load(STUDIP.ABSOLUTE_URI_STUDIP + '/plugins.php/onlinebadge/main/buddies_online');
});
