import { displaySupremeController }     from '../controllers/displaySupremeController'
import { panierController }             from '../controllers/panierController'
import express                          from 'express'

let router = express.Router()
// commande manuel
router.get('/get_manualReload', displaySupremeController.GET_manualScrapping)

// article supreme
router.get('/get_articlesList', displaySupremeController.GET_ArticlesList)

// drops
router.get('/get_drops', displaySupremeController.GET_DropsArticle)

// panier
router.get('/getPanier', panierController.GET_Panier)
router.get('/getSizePanier', panierController.GET_sizePanier)
router.get('/removePanier', panierController.GET_removePanier)
router.get('/addArticle/:id', panierController.GET_addArticle)
router.get('/removeArticle/:id', panierController.GET_removeArticle)

module.exports = router