jQuery(function($) {
    var a = $('#barTopMenu li a[href="online.php"]')
    , li = a.parent()
    // insert hidden badge
    , badge = $('<span id="online_badge">').appendTo(li).hide()
    , onlineTemplate = $("#online-badge-template-online").text().trim();

    // supports session storage
    if (hasSessionStorage()) {
        // no state set yet or
        // last sync time at least 5 minutes ago (in ms)
        if (!sessionStorage.onlineBadgeBuddies || 
            sessionStorage.onlineBadgeSyncTime < new Date().getTime() - 300000) {
            //console.log("clear state");
            sessionStorage.onlineBadgeBuddies = "{}";
        }
    }

    // add class to parent li and redirect to the a's href on click
    li.addClass("online_container")
        .bind('click', function() {
            location = STUDIP.ABSOLUTE_URI_STUDIP + a.attr('href');
        });

    // update badge and repeat it every 60s
    update();
    var timer = setInterval(update, 5 * 1000);

    function update() {
        $.getJSON(STUDIP.ABSOLUTE_URI_STUDIP + 'plugins.php/onlinebadge',
                  function (data, textStatus, xhr) {

                      // ignore errors
                      if (textStatus !== "success") {
                          return;
                      }

                      if (data.online > 0) {
                          // TODO fix title attribute in webservice
                          badge.html(data.online).show().attr("title", a.attr("title"));
                      } else {
                          badge.hide();
                      }

                      if (hasSessionStorage()) {
                          notifyBuddyActivities(data.buddies);
                      }
                  });
    }

    function notifyBuddyActivities(current) {

        var buddies = JSON.parse(sessionStorage.onlineBadgeBuddies);
        //       console.log("notifyStart", sessionStorage.onlineBadgeBuddies, buddies);

        // set last sync time
        sessionStorage.onlineBadgeSyncTime = new Date().getTime();

        // check old status
        $.each(buddies, function (key, value) {

            // buddy still online
            if (key in current) {
                delete current[key];
            }
            // buddy left
            else {
                delete buddies[key];
            }
        });

        // announce new arrivals
        $.each(current, function (key, value) {
            buddies[key] = value;
            var text = $.mustache(onlineTemplate,  {name: value});
            $.pnotify({
                pnotify_title: key,
                pnotify_text: text,
                pnotify_nonblock: true,
                pnotify_nonblock_opacity: .1
            });
        });
        sessionStorage.onlineBadgeBuddies = JSON.stringify(buddies);
        //        console.log("notifyEnd", sessionStorage.onlineBadgeBuddies, buddies);
    }

    function hasSessionStorage() {
        try {
            return ('sessionStorage' in window) &&
                window.sessionStorage !== null;
        } catch(e){
            return false;
        }
    }

});
