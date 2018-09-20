import { pagesController }      from './../controllers/pagesController'
import express                  from 'express'

let router = express.Router()
router.get('/articlesList', pagesController.GET_articlesList)

module.exports = router