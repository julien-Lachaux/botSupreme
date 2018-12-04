'use strict';

require('./../scss/defaultStyle.scss');

var app = require('./components/app');
var panier = require('./components/panier');
var alerte = require('./components/alerte');

var currentPage = app.getCurrentPage();
var endpoint = '';

switch (currentPage) {
    case 'configuration':
        endpoint = '/widgets/get_' + currentPage + '/420';
        break;

    default:
        endpoint = '/widgets/get_' + currentPage;
        break;
}
app.get(endpoint, function (response) {
    $('.content').html(response);
    if (currentPage !== 'login' && currentPage !== 'register') {
        panier.activePanier();
        $('.carousel').each(function (i, carousel) {
            $(carousel).carousel({
                interval: false,
                ride: false
            });
        });
        app.activeAjaxLink(function (response) {
            console.log(response);
            if (response.success) {
                alerte.success(response.message);
            } else {
                alerte.error(response.message);
            }
        });
    }
    if (currentPage === 'configuration') {
        $('#configForm').submit(function (e) {
            var payload = app.serializeForm('#configForm', 'id');
            console.log(payload.id);
            app.post('/widgets/update_configuration/' + payload.id, payload, function (response2) {
                if (response2.success) {
                    alerte.success('Configuration mis à jour avec succès !');
                } else {
                    alerte.error('Echec de la mise à jour de la configuration !');
                }
            });
            e.preventDefault();
        });
    }
});