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
        if (!$GLOBALS["user"]->id) {
            return;
        }

        if (UpdateInformation::isCollecting()) {
            $data = $this->getData();
            UpdateInformation::setInformation('OnlineBadge.update', $data);
        }

        parent::__construct();
        PageLayout::addHeadElement('link', array(
            'rel' => 'stylesheet',
            'href' => $this->getPluginUrl() . '/stylesheets/online_badge.css'));

        PageLayout::addHeadElement('script', array(
            'src' => $this->getPluginUrl() . '/javascripts/application.js'), '');

        // gritter
        PageLayout::addHeadElement('link', array(
            'rel' => 'stylesheet',
            'href' => $this->getPluginUrl() . '/stylesheets/jquery.gritter.css'));
        PageLayout::addHeadElement('script', array(
            'src' => $this->getPluginUrl() . '/javascripts/jquery.gritter.min.js'), '');

        // mustache
        PageLayout::addHeadElement('script', array(
            'src' => $this->getPluginUrl() . '/javascripts/jquery.mustache.js'), '');

        // add template
        $factory = new Flexi_TemplateFactory(dirname(__FILE__) . "/flexi/");
        PageLayout::addBodyElements($factory->render("jstemplate"));
    }

    protected function getData()
    {
        global $my_messaging_settings;
        $active_time = $my_messaging_settings['active_time'];

        $users = get_users_online($active_time ? $active_time : 5, 'no_title');

        $buddies = array();
        foreach ($users as $id => $user) {
            if ($user['is_buddy']) {
                $buddies[$id] = $user['name'];
            }
        }

        $online = sizeof($users);
        if ($online === 0) {
            $title = _('Nur Sie sind online');
        } else if ($online === 1) {
            $title = _('Außer Ihnen ist eine Person online');
        } else {
            $title = sprintf(_('Es sind außer Ihnen %d Personen online'), $online);
        }

        $result = array(
            'online' => sizeof($buddies),
            'title' => $title,
            'buddies' => $buddies
        );

        return $result;
    }

    function avatar_action($username)
    {
        $id = get_userid($username);
        header("Location: " . Avatar::getAvatar($id)->getURL(Avatar::MEDIUM), true, 302);
    }
}
