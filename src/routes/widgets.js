import { displaySupremeController }     from '../controllers/displaySupremeController'
import { scrapperSupremeController }    from '../controllers/scrapperSupremeController'
import { panierController }             from '../controllers/panierController'
import express                          from 'express'
import bodyParser                       from 'body-parser'

let router = express.Router()

// configuration
router.get('/get_configuration/:id', displaySupremeController.GET_Config)
router.post('/update_configuration/:id', displaySupremeController.POST_Config)

// commande manuel
router.get('/manualReload/:action', displaySupremeController.GET_manualScrapping)
router.get('/buyArticles', scrapperSupremeController.buyArticles)

// drops
router.get('/get_drops', displaySupremeController.GET_DropsArticle)

// panier
router.get('/getPanier', panierController.GET_Panier)
router.get('/getSizePanier', panierController.GET_sizePanier)
router.get('/getTotalPrice', panierController.GET_totalPricePanier)
router.get('/removePanier', panierController.GET_removePanier)
router.get('/addArticle/:id', panierController.GET_addArticle)
router.get('/removeArticle/:id', panierController.GET_removeArticle)

// controlPanel
router.get('/get_login', displaySupremeController.GET_Login)
router.get('/get_register', displaySupremeController.GET_Register)
router.get('/get_controlPanel', displaySupremeController.GET_ControlePanel)

module.exports = router