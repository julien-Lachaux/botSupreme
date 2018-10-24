const app       = require('./app')
const alerte    = require('./alerte')

const panier = {

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

    getPanier() {
        app.get('/widgets/getPanier', (response) => {
            $('section.content').append(response)
            $('div#panier').modal('show')
            this.activerRemovePanier()
            this.activerRemoveArticle()
        })
    },

    getSizePanier() {
        app.get('/widgets/getSizePanier', (response) => {
            response = JSON.parse(response)
            $('span.panierSize').html(response.panier.size)
        })
    },

    activerRemovePanier() {
        $('div#panier').on('hidden.bs.modal', (e) => {
            removePanier.modal('dispose')
        })

        $('.removePanier').each((index, element) => {
            element = $(element)
            element.click(e => {
                this.removePanier()
            })
        })
    },

    removePanier() {
        $('div#panier').modal('dispose')
    },

    addArticle(id) {
        app.get('/widgets/addArticle/' + id, (response) => {
            response = JSON.parse(response)
            if (response.success) {
                alerte.success('Article ajouter avec success =)')
                this.getSizePanier()
            } else {
                alerte.error('Une erreur c\'est produite !')
            }
        })
    },

    activerRemoveArticle() {
        $('.removeArticle').each((index, element) => {
            element = $(element)
            element.click(e => {
                e = $(e.target)
                this.removeArticle(e.attr('data-id'))
            })
        })
    },

    removeArticle(id) {
        app.get('/widgets/removeArticle/' + id, (response) => {
            response = JSON.parse(response)
            $('[data-ligne="' + id + '"]').remove()
            this.getSizePanier()
        })
    }

}
module.exports = panier