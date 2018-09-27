'use strict';

var app = {

    /**
     * get
     * @description effectue une requete ajax get avec la gestion d'erreur
     * @param {string} url url à appelé en ajax
     * @param {funtion} callback fonction de callback
     */
    get: function get(url) {
        var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};

        $.ajax({
            url: url,
            method: 'GET'
        }).done(callback).fail(app.ajaxError);
    },


    /**
     * post
     * @description effectue une requete ajax post avec la gestion d'erreur
     * @param {strin} url url à appelé en ajax
     * @param {object} data data envoyé avec la requete POST
     * @param {function} callback fonction de callback
     */
    post: function post(url, data) {
        var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function () {};

        $.post(url, data, function (response) {
            callback(response);
        });
    },


    /**
     * serializeForm
     * @description serialize un formulaire en un tableau clé - valeur
     * @param {string} form selecteur css pour cibler le formulaire a serializer
     */
    serializeForm: function serializeForm(form) {
        var formData = {};
        $(form).find('.form-control').each(function (key, input) {
            var champ = $(input).attr('name');
            var valeur = $(input).val();
            formData[champ] = valeur;
        });
        return formData;
    },


    /**
     * ajaxError
     * @description affiche un message d'erreur en cas d'echec q'un appel ajax
     * @param {object} error 
     */
    ajaxError: function ajaxError(error) {
        console.log(error);
    },


    /**
     * getCurrentPage
     * @description recupere la page courante dans l'url
     */
    getCurrentPage: function getCurrentPage() {
        var CheminComplet = document.location.href;
        var hash = CheminComplet.substring(CheminComplet.lastIndexOf("/") + 1);

        return hash;
    }
};

module.exports = app;