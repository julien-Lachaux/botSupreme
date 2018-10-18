import { displaySupremeController }     from '../controllers/displaySupremeController'
import express                          from 'express'

let router = express.Router()
router.get('/get_manualReload', displaySupremeController.GET_manualScrapping)
router.get('/get_articlesList', displaySupremeController.GET_ArticlesList)
router.get('/get_drops', displaySupremeController.GET_DropsArticle)
router.get('/addArticle', panierController.GET_addArticle)

module.exports = router