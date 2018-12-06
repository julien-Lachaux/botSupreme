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
        User.findOne({where: { email: request.body.email }})
        .then((user, err) => {
            if (err) { Log.error(error) }
            if (user === null) {
                bcrypt.hash(request.body.password, parseInt(process.env.BCRYP_SALT), (error, hash) => {
                    if (error) { return Log.error(error) }
                    User.create({
                        firstname:  request.body.firstname,
                        lastname:  request.body.lastname,
                        email:     request.body.email,
                        password:  hash,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    })
                    Log.success('User created: ' + request.body.email)
                    response.redirect('/supreme/login')
                })
            } else {
                Log.warning('User already exist: ' + request.body.email)
                response.redirect('supreme/register')
            }
        })
        
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