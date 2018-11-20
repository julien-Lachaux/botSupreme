import { Panier } from '../models/Panier';
import { LignePanier } from '../models/LignePanier';
import { Article } from '../models/Article';

export const panierController = {
    
    async GET_sizePanier(request, response) {
        const currentUser = request.user
        const panier = await Panier.findOne({
            where: { user_id: currentUser.id },
            include: [{
                model: LignePanier
            }]
        })

        let data = {
            panier: {
                size: panier.lignes_paniers.length
            }
        }
        
        response.send(JSON.stringify(data))
    },

    async GET_totalPricePanier(request, response) {
        var totalPrice = 0

        if (PanierStore.checkIfExist()) {
            totalPrice = PanierStore.getTotalPrice()
        }
        
        response.send(JSON.stringify({ panier: { total: totalPrice } }))
    },

    async GET_Panier(request, response) {
        var data = {}

        if (PanierStore.checkIfExist()) {
            data.panier = PanierStore.getPanier()
        } else {
            data.panier = {
                empty: true
            }
        }

        response.render('components/panier', data)
    },

    async GET_removePanier(request, response) {
        var success = false

        if (PanierStore.checkIfExist()) {
            success = PanierStore.removePanier()
        }
        
        response.send(JSON.stringify({ success: success }))
    },

    async GET_addArticle(request, response) {
        const currentUser = request.user
        const articleId   = request.params.id
        const article     = await Article.findOne({ where: { supreme_id: articleId } })
        const lignePanier = await LignePanier.findOne({ where: { article_id: articleId } })
        var success       = false

        // la ligne n'existe pas on doit verifier si un panier existe deja
        if (lignePanier === null) {
            const panier = await Panier.findOne({ where: { user_id: currentUser.id } })

            // le panier existe on doit simplement créer la ligne
            if (panier !== null) {
                await LignePanier.create({
                    status:     'en attente',
                    createdAt:  new Date(),
                    updatedAt:  new Date(),
                    panier_id:  panier.id,
                    article_id: article.id
                })
            } else {
                // le panier n'existe pas on doit le créer puis créer la ligne
                await Panier.create({
                    status:    'en attente',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    user_id:   currentUser.id,
                    drop_id:   article.drop_id
                })

                const newPanier = await Panier.findOne({ where: { user_id: currentUser.id } })
                await LignePanier.create({
                    status:     'en attente',
                    createdAt:  new Date(),
                    updatedAt:  new Date(),
                    panier_id:  newPanier.id,
                    article_id: articleId
                })
            }
            success = true
        }
        
        response.send(JSON.stringify({ success: success }))
    },

    async GET_removeArticle(request, response) {
        var success     = false
        var articleId   = request.params.id

        if (PanierStore.checkIfExist()) {
            if (PanierStore.removeArticle(articleId)) {
                success = true
            }
        }
        
        response.send(JSON.stringify({ success: success }))
    }
}