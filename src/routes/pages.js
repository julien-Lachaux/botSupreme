import { pagesController }      from './../controllers/pagesController'
import express                  from 'express'

let router = express.Router()
// les pages
router.get('/drops', pagesController.GET_drops)
router.get('/configuration', pagesController.GET_configuration)
router.get('/controlPanel', pagesController.GET_controlePanel)
router.get('/login', pagesController.GET_login)
router.get('/register', pagesController.GET_register)

module.exports = router