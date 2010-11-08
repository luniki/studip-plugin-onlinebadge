
jQuery(document).ready(function(){
    var url;
    jQuery('#barTopMenu').children().each(function(index) {
        if (jQuery(this).children().attr('href') == 'online.php') {
        
            url = jQuery(this).children().attr('href');
            jQuery(this).children().wrap('<div class="online_container" />');
        }
    }
    );
    jQuery('.online_container').append('<div id="online_badge" />');
    jQuery('.online_container').bind('click', function(){
        window.location = STUDIP.ABSOLUTE_URI_STUDIP + url;
    });
    jQuery('.online_container').bind('mouseover', function(){
        jQuery('.online_container').children().css('color', 'white');
        jQuery('.online_container').children().children().css('background-position', '-32px 0');
    });
    jQuery('.online_container').bind('mouseout', function(){
        jQuery('.online_container').children().css('color', '#ABB7CE');
        jQuery('.online_container').children().children().css('background-position', '0 0');
         jQuery('#online_badge').css('color','white');
    });
    jQuery('#online_badge').css('cursor', 'pointer');
    
    jQuery('#online_badge').load(STUDIP.ABSOLUTE_URI_STUDIP + '/plugins.php/onlinebadge/main/buddies_online');
    
});