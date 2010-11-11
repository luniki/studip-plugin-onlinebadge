<?php
/*
 * OnlineBadge.class.php - A notifier for count of online users
 * Copyright (c) 2010  André Klaßen
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License as
 * published by the Free Software Foundation; either version 2 of
 * the License, or (at your option) any later version.
 */

class OnlineBadge extends StudipPlugin implements SystemPlugin
{
    /**
     * Initialize a new instance of the plugin.
     */
    function __construct()
    {
        parent::__construct();
        PageLayout::addHeadElement('link', array(
            'rel' => 'stylesheet',
            'href' => $this->getPluginUrl() . '/stylesheets/online_badge.css'));

        PageLayout::addHeadElement('script', array(
            'src' => $this->getPluginUrl() . '/javascripts/application.js'), '');

        // pnotify
        PageLayout::addHeadElement('link', array(
            'rel' => 'stylesheet',
            'href' => $this->getPluginUrl() . '/stylesheets/jquery.pnotify.default.css'));
        PageLayout::addHeadElement('script', array(
            'src' => $this->getPluginUrl() . '/javascripts/jquery.pnotify.min.js'), '');

        // jquery-tmpl
        PageLayout::addHeadElement('script', array(
            'src' => $this->getPluginUrl() . '/javascripts/jquery.mustache.js'), '');

        // add template
        $factory = new Flexi_TemplateFactory(dirname(__FILE__) . "/flexi/");
        PageLayout::addBodyElements($factory->render("jstemplate"));
    }

    function show_action()
    {
        $active_time = $my_messaging_settings['active_time'];

        $users = get_users_online($active_time ? $active_time : 5, 'no_title');


        $result = array(
            'online' => (int) sizeof($users)
          , 'buddies' => array()
        );

        foreach ($users as $id => $user) {
            if ($user['is_buddy']) {
                // TODO utf-8
                $result['buddies'][utf8_encode($id)] = utf8_encode($user['name']);
            }
        }

        header('Content-Type: application/json; charset=UTF-8');
        echo json_encode($result);

        // hack to prevent meddling with presence of users
        exit;
    }
}
