'use strict';

var app = require('./app');

var alerte = {

    /**
     * ============
     * CONSTANTES *
     * ============
     * 
     * @description les différents timers avant la disparition automatique de l'alertes /!\ ( en miliseconde ) /!\
     * 
     * @property {number} DEFAULT_TIMER  temps par defaut
     * @property {number} SHORT_TIMER    temps court
     * @property {number} LONG_TIMER     temps long
     * @property {number} NO_TIMER       infini ( desactive la disparition automatique )
     */
    DEFAULT_TIMER: 2500,
    SHORT_TIMER: 1500,
    LONG_TIMER: 5000,

    create: function create(typeAlerte, message) {
        var title = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
        var close = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

        var body = '';
        var options = [];
        var classes = [];

        // on ajoute les classes
        classes.push('alert-' + typeAlerte);
        if (close !== false) {
            classes.push('alert-dismissible');
        }
        // on ajoute un titre si besoin
        // et on formatte le html du message en consequence
        if (title !== false) {
            body = '<h4 class="alert-heading">' + title + '</h4><p>' + message + '</p>';
        } else {
            body = message;
        }

        // on ajoute la croix pour close l'alerte
        if (close !== false) {
            options.push('<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>');
        }

        // on transforme le tout en stringHTML puis on le retourne
        var classesHtml = classes.join(' ');
        var optionsHtml = options.join('');
        var html = '<div class="alert ' + classesHtml + ' show fade" role="alert">' + body + optionsHtml + '</div>';

        return html;
    },
    setTimer: function setTimer(alerte, timer) {
        window.setTimeout(function () {
            console.log(alerte);
            alerte.alert('close');
        }, timer);
    },
    success: function success(message) {
        var title = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
        var timer = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this.DEFAULT_TIMER;

        var alerteHtml = this.create('success', message, title, true);
        var alerte = $(alerteHtml);

        $('section.alertes').prepend(alerte);
        alerte.alert();

        if (timer != 0) {
            this.setTimer(alerte, timer);
        }
    },
    error: function error(message) {
        var title = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
        var timer = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this.DEFAULT_TIMER;

        var alerteHtml = this.create('danger', message, title, true);
        var alerte = $(alerteHtml);

        $('section.alertes').prepend(alerte);
        alerte.alert();

        if (timer != 0) {
            this.setTimer(alerte, timer);
        }
    }
};
module.exports = alerte;