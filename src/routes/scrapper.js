import { scrapperController }   from './../controllers/scrapperController'
import express                  from 'express'

let router = express.Router()
router.get('/supreme-dashboard', scrapperController.GET_dashboard)
router.get('/supreme-manualScrapping', scrapperController.GET_manualScrapping)

module.exports = router