import { Panier }   from '../class/Panier'

export const panierController = {
    
    async GET_sizePanier(request, response) {
        var size = 0

        if (Panier.checkIfExist()) {
            size = Panier.getSize()
        }
        
        response.send(JSON.stringify({ panier: { size: size } }))
    },

    async GET_Panier(request, response) {
        var data = {}

        if (Panier.checkIfExist()) {
            data.panier = Panier.getPanier()
        } else {
            data.panier = {
                empty: true
            }
        }

        response.render('components/panier', data)
    },

    async GET_removePanier(request, response) {
        var success = false

        if (Panier.checkIfExist()) {
            success = Panier.removePanier()
        }
        
        response.send(JSON.stringify({ success: success }))
    },

    async GET_addArticle(request, response) {
        var success         = false
        var articleId       = request.params.id

        if (!Panier.checkIfArticleExist(articleId)) {
            var articleAdded    = await Panier.addArticle(articleId)
            
            if (articleAdded) {
                success = true
            }
        }
        
        response.send(JSON.stringify({ success: success }))
    },

    async GET_removeArticle(request, response) {
        var success = false
        var articleId = request.param('id')

        if (Panier.checkIfExist()) {
            if (Panier.removeArticle(articleId)) {
                success = true
            }
        }
        
        response.send(JSON.stringify({ success: success }))
    }
}