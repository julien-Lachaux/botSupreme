const app       = require('./app')
const alerte    = require('./alerte')

/**
 * permet d'intéragir avec le panier et sa modal
 * 
 * @author Julien Lachaux
 */
const panier = {
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
    MODALS_CONTAINER:   'section.modals',
    DOM_ELEMENT:        'div#panier',

    /**
     * constantes de messages d'erreurs
     * 
     * @property {object}   ERRORS_MESSAGES             - tableau de message d'erreurs
     * @property {string}   ERRORS_MESSAGES.DEFAULT     - message d'erreur par defaut
     */
    ERRORS_MESSAGES:    {
                            DEFAULT:        'Une erreur s\'est produite !'
                        },

    /**
     * constantes de messages de succes
     * 
     * @property {object}   SUCCESS_MESSAGES                    - tableau de message de succes
     * @property {string}   SUCCESS_MESSAGES.ADD_ARTICLE        - message de succes de l'ajout d'un article dans le panier
     * @property {string}   SUCCESS_MESSAGES.REMOVE_ARTICLE     - message de succes de la suppression d'un article dans le panier
     */
    SUCCESS_MESSAGES:   {
                            ADD_ARTICLE:    'Article ajouté au panier =)',
                            REMOVE_ARTICLE: 'Article supprimé du panier'
                        },

    /**
     * @name activePanier
     * @description active le système de panier
     */
    activePanier() {
        // activation bouton ajout article dans le panier
        $('button.ajoutPanier').each((index, element) => {
            element = $(element)
            element.click((e) => {
                e = $(e.target)
                panier.addArticle(e.attr('id'))
            })
        })

        // activation du boutons panier + recupération de la size du panier
        this.getSizePanier()
        $('button.panierBtn').click((e) => {
            this.getPanier()
        })
    },

    /**
     * @name getPanier
     * @description ouvre la modal de panier
     */
    getPanier() {
        app.get('/widgets/getPanier', (response) => {
            $(this.MODALS_CONTAINER).append(response)
            $(this.DOM_ELEMENT).modal('show')

            this.activerRemovePanier()
            this.activerRemoveArticle()
        })
    },

    /**
     * @name getSizePanier
     * @description met à jour la taille du panier dans la navbar
     */
    getSizePanier() {
        app.get('/widgets/getSizePanier', (response) => {
            response = JSON.parse(response)
            $('span.panierSize').html(response.panier.size)
        })
    },

    /**
     * @name getTotalPrice
     * @description met à jour le prix total du panier /!\ ( en euros ) /!\
     */
    getTotalPrice() {
        app.get('/widgets/getTotalPrice', (response) => {
            response = JSON.parse(response)
            $('span.total').html(response.panier.total)
        })
    },

    /**
     * @name activerRemovePanier
     * @description active les boutons de sortie de la modal panier
     */
    activerRemovePanier() {
        $(this.DOM_ELEMENT).on('hidden.bs.modal', (e) => {
            this.removePanier()
        })

        $('.removePanier').each((index, element) => {
            element = $(element)
            element.click(e => {
                panier.removePanier()
            })
        })
    },

    /**
     * @name removePanier
     * @description supprime la modal panier
     */
    removePanier() {
        $(this.DOM_ELEMENT).remove()
    },

    /**
     * @name addArticle
     * @description ajoute un article au panier
     * 
     * @param {number} id 
     */
    addArticle(id) {
        app.get('/widgets/addArticle/' + id, (response) => {
            response = JSON.parse(response)

            if (response.success) {
                alerte.success(this.SUCCESS_MESSAGES.ADD_ARTICLE)
                this.getSizePanier()
                this.getTotalPrice()
            } else {
                alerte.error(this.ERRORS_MESSAGES.DEFAULT)
            }
        })
    },

    /**
     * @name activerRemoveArticle
     * @description active les boutons de suppression de l'article du panier
     */
    activerRemoveArticle() {
        $('.removeArticle').each((index, element) => {
            element = $(element)
            element.click(e => {
                e = $(e.target)
                this.removeArticle(e.attr('data-id'))
            })
        })
    },

    /**
     * @name removeArticle
     * @description supprime un article du panier
     * 
     * @param {number} id 
     */
    removeArticle(id) {
        app.get('/widgets/removeArticle/' + id, (response) => {
            response = JSON.parse(response)

            if (response.success) {
                alerte.success(this.SUCCESS_MESSAGES.REMOVE_ARTICLE)
                $('[data-ligne="' + id + '"]').remove()
                this.getSizePanier()
                this.getTotalPrice()
            } else {
                alerte.error(this.ERRORS_MESSAGES.DEFAULT)
            }
        })
    }

}
module.exports = panier