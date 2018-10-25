import { pagesController }      from './../controllers/pagesController'
import express                  from 'express'

let router = express.Router()
router.get('/articlesList', pagesController.GET_articlesList)
router.get('/drops', pagesController.GET_drops)
router.get('/manualReload', pagesController.GET_manualReload)
router.get('/configuration', pagesController.GET_configuration)

module.exports = router