<?php
/*
 * main.php - main controller
 * Copyright (c) 2010  André Klaßen
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License as
 * published by the Free Software Foundation; either version 2 of
 * the License, or (at your option) any later version.
 */

require_once 'app/controllers/studip_controller.php';

class MainController extends StudipController
{
    /**
     * Common code for all actions: set default layout and page title.
     */
    function before_filter(&$action, &$args)
    {
        $this->flash = Trails_Flash::instance();
    }

    /**
     * This is the default action of this controller.
     */
    function buddies_online_action()
    {
       $active_time = $my_messaging_settings['active_time'];
       $user_count = get_users_online_count($active_time ? $active_time : 5);
       $this->render_text($user_count);
    }

    
}
?>
