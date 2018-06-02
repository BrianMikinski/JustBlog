$(function () {

    $('#search-form').submit(function () {
        if ($("#s").val().trim())
            return true;
        return false;
    });

    //Handle Twitter Links
    !function (d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0], p = /^http:/.test(d.location) ? 'http' : 'https';
        if (!d.getElementById(id)) {
            js = d.createElement(s);
            js.id = id; js.src = p + '://platform.twitter.com/widgets.js';
            fjs.parentNode.insertBefore(js, fjs);
        }
    }(document, 'script', 'twitter-wjs');

});


$(document).ready(function () {

    /* Sidebar height set */
    $('.sidebar').css('min-height', $(document).height());

    /* Secondary contact links */
    var scontacts = $('#contact-list-secondary');
    var contact_list = $('#contact-list');

    scontacts.hide();

    contact_list.mouseenter(function () { scontacts.fadeIn(); });

    contact_list.mouseleave(function () { scontacts.fadeOut(); });

});
