import passport from 'passport'
import bcrypt   from 'bcrypt'
import { User } from './../models/User'
import { Log }  from './../class/Log'

export const usersController = {

    async POST_login(request, response, next) {
        passport.authenticate('local', (err, user, info) => {
            if (err) { return next(err) }
            if (!user) {
                return response.redirect('/supreme/login')
            }

            request.login(user, (err) => {
                if (err) { return next(err) }
                return response.redirect('/supreme/drops')
            });
        })(request, response, next)
    },

    async POST_register(request, response, next) {
        User.findOne({where: { email: request.params.email }})
        .then((user, err) => {
            if (err) { return done(err) }
            if (!user) { return done(null, false, { message: 'Incorrect email.' }) }
            bcrypt.hash(process.env.DEFAULT_ADMIN_PASSWORD, parseInt(process.env.BCRYP_SALT), (error, hash) => {
                if (error) { Log.error(error) }
                User.create({
                    firstname:  request.params.firstname,
                    lastname:  request.params.lastname,
                    email:     request.params.email,
                    password:  hash,
                    createdAt: new Date(),
                    updatedAt: new Date()
                })
            })
        })
        response.redirect('/supreme/login')
    },

    async GET_logout(request, response, next) {
        request.logout()
        response.redirect('/supreme/login')
    },

    async GET_loginSuccess(request, response) {
        return response.send(JSON.stringify({ status: 'user login success' }))
    },

    async GET_loginFailure(request, response) {
        return response.send(JSON.stringify({ status: 'user login failure' }))
    }

}