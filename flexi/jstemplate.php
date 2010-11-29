<script id="online-badge-single-title" type="text/x-jquery-tmpl">
{{username}} <?= _("ist jetzt online.") ?>
</script>

<script id="online-badge-single-text" type="text/x-jquery-tmpl">
     <a href="<?= URLHelper::getURL('about.php') ?>?username={{id}}"
        title="<?= _("Profil aufrufen") ?>"
        class="profile">Profil</a>
     <a href="<?= URLHelper::getURL('sms_send.php',
                                    array('sms_source_page' => URLHelper::getURL('TODO'))) ?>&amp;rec_uname={{id}}"
        title="<?= _("Nachricht an Benutzer verschicken") ?>"
        class="mail">Nachricht</a>
</script>
