jQuery(function($) {
    var a = $('#barTopMenu li a[href="online.php"]')
    , li = a.parent()
    // insert hidden badge
    , badge = $('<span id="online_badge">').appendTo(li).hide()
    , templates = {};

    $.each('single-title single-text'.split(" "), function (i, name) {
        templates[name] = $("#online-badge-" + name).text().trim();
    });

announce({"root@studip": "Prof. Dr. Root"});

    resyncSessionStorage();

    // add class to parent li and redirect to the a's href on click
    li.addClass("online_container")
        .bind('click', function() {
            location = STUDIP.ABSOLUTE_URI_STUDIP + a.attr('href');
        });

    // update badge and repeat it every so often
    updateBadge();
    setInterval(updateBadge, 5 * 1000);


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
                          badge.html(data.online).show().attr('title', title);
                      } else {
                          badge.hide();
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
                , sticky: true
            });
        });
    }

    function announceBuddies(buddies) {
        var text = '';
        $.each(buddies, function (id, username) {
            text += $.mustache(onlineTemplate,  {name: username});
        });

        $.gritter.add({
            title: "blurb"
            , text: text
        });
    }

    function pluginUrl(path) {
        return STUDIP.ABSOLUTE_URI_STUDIP + 'plugins.php/onlinebadge/' + (path || '');
    }
});
