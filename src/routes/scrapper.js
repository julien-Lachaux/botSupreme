import { scrapperController }   from './../controllers/scrapperController'
import express                  from 'express'

let router = express.Router()
router.get('/get_articlesList', scrapperController.getArticlesList)
router.get('/get_manualScrapping', scrapperController.GET_manualScrapping)

module.exports = router