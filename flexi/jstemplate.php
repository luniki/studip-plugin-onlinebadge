<script id="online-badge-single-title" type="text/x-jquery-tmpl">
{{username}} <?= _("ist jetzt online.") ?>
</script>

<script id="online-badge-single-text" type="text/x-jquery-tmpl">
     <a href="<?= URLHelper::getLink('about.php') ?>?username={{id}}"
        title="<?= _("Profil aufrufen") ?>"
        class="profile">Profil</a>
     <a href="<?= URLHelper::getLink('sms_send.php',
                                    array('sms_source_page' => URLHelper::getURL('TODO'))) ?>&amp;rec_uname={{id}}"
        title="<?= _("Nachricht an Benutzer verschicken") ?>"
        class="mail">Nachricht</a>
     <a href="<?= PluginEngine::getLink('blubber', null, 'streams/global', true) ?>?mention={{id}}"
        title="<?= _("Blubbern") ?>"
        class="blubber">Blubbern</a>
</script>

<script id="online-badge-multi-text" type="text/x-jquery-tmpl">
{{usernames}} <?= _("sind online.") ?>
</script>
