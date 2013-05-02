jQuery(function($) {
    var a = $('#barTopMenu li#nav_community a');
    if (a.length === 0) {
        return;
    }
    
        
    var li = a.parent()
    // insert hidden badge
    , badge = $('<span id="online_badge">').appendTo(li).hide()
    , templates = {};

    $.each('single-title single-text multi-text'.split(" "), function (i, name) {
        templates[name] = $.trim($("#online-badge-" + name).html());
    });

    resyncSessionStorage();

    // add class to parent li and redirect to the a's href on click
    li.addClass("online_container")
        .bind('click', function(event) {
            if (!event.ctrlKey && !event.metaKey) {
                location = STUDIP.ABSOLUTE_URI_STUDIP + a.attr('href');
            }
        });


    // update badge and repeat it every so often
    updateBadge();
    setInterval(updateBadge, 30 * 1000);


    function resyncSessionStorage() {
        if (hasSessionStorage()) {
            // no state set yet or
            // last sync time at least 5 minutes ago (in ms)
            if (!sessionStorage.onlineBadgeBuddies ||
                sessionStorage.onlineBadgeSyncTime < new Date().getTime() - 300000) {
                sessionStorage.onlineBadgeBuddies = "{}";
            }
        }
    }

    function updateBadge() {
        $.getJSON(pluginUrl(),
                  function (data, textStatus, xhr) {

                      // ignore errors
                      if (textStatus !== "success") {
                          return;
                      }

                      a.attr("title", data.title);

                      if (data.online > 0) {
                          var title = getBadgeTitle(data.online);
                          if (badge) {
                              badge.html(data.online).show().attr('title', title);
                          }
                      } else {
                          if (badge) {
                              badge.hide();
                          }
                      }

                      notifyBuddyActivities(data.buddies);
                  });
    }

    function notifyBuddyActivities(current) {

        if (!hasSessionStorage()) {
            return;
        }

        var buddies = JSON.parse(sessionStorage.onlineBadgeBuddies);

        // set last sync time
        sessionStorage.onlineBadgeSyncTime = new Date().getTime();

        syncBuddies(buddies, current);
        announce(current);

        sessionStorage.onlineBadgeBuddies = JSON.stringify(buddies);
    }

    function getBadgeTitle(num) {
        return num + " Buddies";
    }

    function hasSessionStorage() {
        try {
            return ('sessionStorage' in window) &&
                window.sessionStorage !== null;
        } catch(e){
            return false;
        }
    }

    function syncBuddies(buddies, current) {
        // check old status
        $.each(buddies, function (id, name) {

            // buddy still online
            if (id in current) {
                delete current[id];
            }
            // buddy left
            else {
                delete buddies[id];
            }
        });
        // add new arrivals
        $.each(current, function (id, name) {
            buddies[id] = name;
        });
     }

    function announce(buddies) {
        var length = 0;
        $.each(buddies, function () { length += 1; });

        // announce noone
        if (length === 0) {
            return;
        // announce only a few arrived buddies
        } else if (length <= 3) {
            announceBuddy(buddies);
        // announce a lot buddies
        } else {
            announceBuddies(buddies);
        }
    }

    function announceBuddy(buddies) {
        $.each(buddies, function (id, username) {

            var title = $.mustache(templates["single-title"],  {id: id, username: username});
            var text = $.mustache(templates["single-text"],  {id: id, username: username});

            $.gritter.add({
                title: title
                , text: text
                , image: pluginUrl('avatar/' + id)
            });
        });
    }

    function announceBuddies(buddies) {
        var usernames = [];
        $.each(buddies, function (id, username) {
            usernames.push(username);
        });
        
        $.gritter.add({
            title: "Folgende Buddies sind online"
            , text: $.mustache(templates["multi-text"], {usernames: usernames.join(', ')})
        });
    }

    function pluginUrl(path) {
        return STUDIP.ABSOLUTE_URI_STUDIP + 'plugins.php/onlinebadge/' + (path || '');
    }
});
