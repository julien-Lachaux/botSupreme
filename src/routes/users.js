import { usersController }      from './../controllers/usersController'
import express                  from 'express'

let router = express.Router()

// connexion et inscription
router.post('/login', usersController.POST_login)
router.post('/register', usersController.POST_register)
router.get('/logout', usersController.GET_logout)
router.get('/loginSuccess', usersController.GET_loginSuccess)
router.get('/loginFailure', usersController.GET_loginFailure)

module.exports = router