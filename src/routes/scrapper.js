import { displaySupremeController }   from './../controllers/displaySupremeController'
import express                  from 'express'

let router = express.Router()
router.get('/get_articlesList', displaySupremeController.GET_ArticlesList)
router.get('/get_manualScrapping', displaySupremeController.GET_manualScrapping)

module.exports = router