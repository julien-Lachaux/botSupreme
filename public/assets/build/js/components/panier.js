'use strict';

var app = require('./app');
var alerte = require('./alerte');

/**
 * permet d'intéragir avec le panier et sa modal
 * 
 * @author Julien Lachaux
 */
var panier = {
    /**
     * ============
     * CONSTANTES *
     * ============
     * 
     * constantes de ciblage des elements du dom
     * 
     * @property MODALS_CONTAINER   - container des modals
     * @property DOM_ELEMENT        - panier
     */
    MODALS_CONTAINER: 'section.modals',
    DOM_ELEMENT: 'div#panier',

    /**
     * constantes de messages d'erreurs
     * 
     * @property {object}   ERRORS_MESSAGES             - tableau de message d'erreurs
     * @property {string}   ERRORS_MESSAGES.DEFAULT     - message d'erreur par defaut
     */
    ERRORS_MESSAGES: {
        DEFAULT: 'Une erreur s\'est produite !'
    },

    /**
     * constantes de messages de succes
     * 
     * @property {object}   SUCCESS_MESSAGES                    - tableau de message de succes
     * @property {string}   SUCCESS_MESSAGES.ADD_ARTICLE        - message de succes de l'ajout d'un article dans le panier
     * @property {string}   SUCCESS_MESSAGES.REMOVE_ARTICLE     - message de succes de la suppression d'un article dans le panier
     */
    SUCCESS_MESSAGES: {
        ADD_ARTICLE: 'Article ajouté au panier =)',
        REMOVE_ARTICLE: 'Article supprimé du panier'
    },

    /**
     * @name activePanier
     * @description active le système de panier
     */
    activePanier: function activePanier() {
        var _this = this;

        // activation bouton ajout article dans le panier
        $('button.ajoutPanier').each(function (index, element) {
            element = $(element);
            element.click(function (e) {
                e = $(e.target);
                panier.addArticle(e.attr('id'));
            });
        });

        // activation du boutons panier + recupération de la size du panier
        this.getSizePanier();
        $('button.panierBtn').click(function (e) {
            _this.getPanier();
        });
    },


    /**
     * @name getPanier
     * @description ouvre la modal de panier
     */
    getPanier: function getPanier() {
        var _this2 = this;

        app.get('/widgets/getPanier', function (response) {
            $(_this2.MODALS_CONTAINER).append(response);
            $(_this2.DOM_ELEMENT).modal('show');

            _this2.activerRemovePanier();
            _this2.activerRemoveArticle();
        });
    },


    /**
     * @name getSizePanier
     * @description met à jour la taille du panier dans la navbar
     */
    getSizePanier: function getSizePanier() {
        app.get('/widgets/getSizePanier', function (response) {
            response = JSON.parse(response);
            $('span.panierSize').html(response.panier.size);
        });
    },


    /**
     * @name getTotalPrice
     * @description met à jour le prix total du panier /!\ ( en euros ) /!\
     */
    getTotalPrice: function getTotalPrice() {
        app.get('/widgets/getTotalPrice', function (response) {
            response = JSON.parse(response);
            $('span.total').html(response.panier.total);
        });
    },


    /**
     * @name activerRemovePanier
     * @description active les boutons de sortie de la modal panier
     */
    activerRemovePanier: function activerRemovePanier() {
        var _this3 = this;

        $(this.DOM_ELEMENT).on('hidden.bs.modal', function (e) {
            _this3.removePanier();
        });

        $('.removePanier').each(function (index, element) {
            element = $(element);
            element.click(function (e) {
                panier.removePanier();
            });
        });
    },


    /**
     * @name removePanier
     * @description supprime la modal panier
     */
    removePanier: function removePanier() {
        $(this.DOM_ELEMENT).remove();
    },


    /**
     * @name addArticle
     * @description ajoute un article au panier
     * 
     * @param {number} id 
     */
    addArticle: function addArticle(id) {
        var _this4 = this;

        app.get('/widgets/addArticle/' + id, function (response) {
            response = JSON.parse(response);

            if (response.success) {
                alerte.success(_this4.SUCCESS_MESSAGES.ADD_ARTICLE);
                _this4.getSizePanier();
                _this4.getTotalPrice();
            } else {
                alerte.error(_this4.ERRORS_MESSAGES.DEFAULT);
            }
        });
    },


    /**
     * @name activerRemoveArticle
     * @description active les boutons de suppression de l'article du panier
     */
    activerRemoveArticle: function activerRemoveArticle() {
        var _this5 = this;

        $('.removeArticle').each(function (index, element) {
            element = $(element);
            element.click(function (e) {
                e = $(e.target);
                _this5.removeArticle(e.attr('data-id'));
            });
        });
    },


    /**
     * @name removeArticle
     * @description supprime un article du panier
     * 
     * @param {number} id 
     */
    removeArticle: function removeArticle(id) {
        var _this6 = this;

        app.get('/widgets/removeArticle/' + id, function (response) {
            response = JSON.parse(response);

            if (response.success) {
                alerte.success(_this6.SUCCESS_MESSAGES.REMOVE_ARTICLE);
                $('[data-ligne="' + id + '"]').remove();
                _this6.getSizePanier();
                _this6.getTotalPrice();
            } else {
                alerte.error(_this6.ERRORS_MESSAGES.DEFAULT);
            }
        });
    }
};
module.exports = panier;