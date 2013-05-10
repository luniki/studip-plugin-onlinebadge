STUDIP.OnlineBadge = {
    templates: {},
    init: function () {
        var a = jQuery('#barTopMenu li#nav_community a');
        if (a.length === 0) {
            return;
        }
            
        var li = a.parent(),
            // insert hidden badge
            badge = jQuery('<span id="online_badge">').appendTo(li).hide();
            STUDIP.OnlineBadge.templates = {};

        jQuery.each('single-title single-text multi-text'.split(" "), function (i, name) {
            STUDIP.OnlineBadge.templates[name] = jQuery.trim($("#online-badge-" + name).html());
        });

        STUDIP.OnlineBadge.resyncSessionStorage();

        // add class to parent li and redirect to the a's href on click
        li.addClass("online_container")
            .bind('click', function() {
                location = STUDIP.ABSOLUTE_URI_STUDIP + a.attr('href');
            });
    },
    /**
     * called periodically
     */
    update: function  (data) {
        jQuery('#barTopMenu li#nav_community a').attr("title", data.title);

        if (data.online > 0) {
            var title = STUDIP.OnlineBadge.getBadgeTitle(data.online);
            jQuery("#online_badge").html(data.online).show().attr('title', title);
        } else {
            jQuery("#online_badge").hide();
        }
        STUDIP.OnlineBadge.notifyBuddyActivities(data.buddies);
    },
    resyncSessionStorage: function() {
        if (STUDIP.OnlineBadge.hasSessionStorage()) {
            // no state set yet or
            // last sync time at least 5 minutes ago (in ms)
            if (!sessionStorage.onlineBadgeBuddies) {
                sessionStorage.onlineBadgeBuddies = "{}";
            }
        }
    },
    hasSessionStorage: function() {
        try {
            return ('sessionStorage' in window) &&
                window.sessionStorage !== null;
        } catch(e){
            return false;
        }
    },
    notifyBuddyActivities: function(current) {
        if (!STUDIP.OnlineBadge.hasSessionStorage()) {
            return;
        }
        if (sessionStorage.onlineBadgeBuddies) {
            var buddies = JSON.parse(sessionStorage.onlineBadgeBuddies);
        }
        
        STUDIP.OnlineBadge.syncBuddies(buddies, current);
        STUDIP.OnlineBadge.announce(current);

        sessionStorage.onlineBadgeBuddies = JSON.stringify(buddies);
    },
    syncBuddies: function(buddies, current) {
        // check old status
        jQuery.each(buddies, function (id, name) {

            // buddy still online
            if (id in current) {
                delete current[id];
            } else {
                delete buddies[id];
            }
        });
        // add new arrivals
        jQuery.each(current, function (id, name) {
            buddies[id] = name;
        });
     },
     announce: function(buddies) {
        var length = 0;
        jQuery.each(buddies, function () { length += 1; });

        // announce noone
        if (length === 0) {
            return;
        // announce only a few arrived buddies
        } else if (length <= 3) {
            STUDIP.OnlineBadge.announceBuddy(buddies);
        // announce a lot buddies
        } else {
            STUDIP.OnlineBadge.announceBuddies(buddies);
        }
    },
    announceBuddy: function(buddies) {
        jQuery.each(buddies, function (id, username) {

            var title = jQuery.mustache(STUDIP.OnlineBadge.templates["single-title"],  {id: id, username: username});
            var text = jQuery.mustache(STUDIP.OnlineBadge.templates["single-text"],  {id: id, username: username});

            jQuery.gritter.add({
                title: title,
                text: text,
                image: STUDIP.OnlineBadge.pluginUrl('avatar/' + id)
            });
        });
    },
    announceBuddies: function(buddies) {
        var usernames = [];
        jQuery.each(buddies, function (id, username) {
            usernames.push(username);
        });
        
        jQuery.gritter.add({
            title: "Folgende Buddies sind online",
            text: jQuery.mustache(STUDIP.OnlineBadge.templates["multi-text"], {usernames: usernames.join(', ')})
        });
    },
    getBadgeTitle: function(num) {
        return num + " Buddies";
    },
    pluginUrl: function(path) {
        return STUDIP.ABSOLUTE_URI_STUDIP + 'plugins.php/onlinebadge/' + (path || '');
    }
};

jQuery(STUDIP.OnlineBadge.init);

