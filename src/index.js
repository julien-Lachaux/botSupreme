import cron                          from 'node-cron'
import dotenv                        from 'dotenv'
import bcrypt                        from 'bcrypt'
import express                       from 'express'
import session                       from 'express-session'
import mustacheExpress               from 'mustache-express'
import { Db }                        from './class/Db';
import { Log }                       from './class/Log'
import { User }                      from './models/User'
import { Drop }                      from './models/Drop';
import { Article }                   from './models/Article';
import { Panier }                    from './models/Panier';
import { LignePanier }               from './models/LignePanier';
import { scrapperSupremeController } from './controllers/scrapperSupremeController';


/****** Activation des logs ******/
Log.init()
Log.title("INIT GLOBAL SYSTEM")
Log.success(' * logs system activated')

/****** Récupération des variables d'environnement ******/
const loadConfig = dotenv.config()
if (loadConfig.error) {
    Log.error(loadConfig.error)
} else {
    Log.success(' * environment variables')
}

/****** Definition des constantes necésaires ******/
const app        = express()
const bodyParser = require('body-parser')

/****** Initialisation de la base de données ******/
Log.title("INIT DATABASE")

Db.init()
Log.success(" * mysql Database Instance")

/****** Définitions des relations ******/
Article.belongsTo(Drop, { foreignKey: 'drop_id', targetKey: 'id', constraints: false })
Drop.hasMany(Article, { foreignKey: 'drop_id', sourceKey: 'id', constraints: false })
Panier.belongsTo(User, { foreignKey: 'user_id', targetKey: 'id', constraints: false })
Panier.belongsTo(Drop, { foreignKey: 'drop_id', targetKey: 'id', constraints: false })
Panier.hasMany(LignePanier, { foreignKey: 'panier_id', sourceKey: 'id', constraints: false })
LignePanier.belongsTo(Article, { foreignKey: 'article_id', targetKey: 'id', constraints: false })
LignePanier.belongsTo(Panier, { foreignKey: 'panier_id', targetKey: 'id', constraints: false })
Log.success(" * relations")

const dbForceCreate = process.env.ORM_FORCE_CREATE_TABLE === 'true' ? true : false
/**
 * @table users
 */
User.sync({force: dbForceCreate})
    .then(() => {
        if (dbForceCreate) {
            bcrypt.hash(process.env.DEFAULT_ADMIN_PASSWORD, parseInt(process.env.BCRYP_SALT), (err, hash) => {
                User.create({
                    firstname:  process.env.DEFAULT_ADMIN_FIRSTNAME,
                    lastname:  process.env.DEFAULT_ADMIN_LASTNAME,
                    email:     process.env.DEFAULT_ADMIN_EMAIL,
                    password:  hash,
                    createdAt: new Date(),
                    updatedAt: new Date()
                })
            })
        }
    })
Log.success(" * table users")

/**
 * @table drops
 */
Drop.sync({force: dbForceCreate})
Log.success(" * table drops")

/**
 * @table paniers
 */
Panier.sync({force: dbForceCreate})
Log.success(" * table paniers")

/**
 * @table articles
 */
Article.sync({force: dbForceCreate})
Log.success(" * table articles")

/**
 * @table lignes_paniers
 */
LignePanier.sync({force: dbForceCreate})
Log.success(" * table lignes_paniers")

/****** Paramétrage du serveur express.js ******/
Log.title("INIT EXPRESS.JS")

app.engine('html', mustacheExpress())
app.set('view engine', 'html')
app.set('views', 'src/views/')
Log.success(" * template engine")

app.use('/public', express.static('public'));
Log.success(" * static file")

app.use(session({
    secret: "cats",
    resave: true,
    saveUninitialized: true
}))
Log.success(" * server session")

/****** ajout de la gestion des formats de payload ******/
/**
 * @format formulaire application/x-www-form-urlencoded
 * @format json       application/json
 */
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
Log.success(" * payloads parser")

/****** Configuration de passport.js ******/
Log.title("INIT PASSPORT.JS")

var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy

Log.success(" * passport conf")

passport.use(new LocalStrategy(
    {
        usernameField: 'email',
        passwordField: 'password'
    },
    (email, password, done) => {
        User.findOne({where: { email: email }})
            .then((user, err) => {
                if (err) { return done(err) }
                if (!user) { return done(null, false, { message: 'Incorrect email.' }) }
                bcrypt.compare(password, user.password, (error, response) => {
                    console.log(response)
                    if (response) {
                        return done(null, user)
                    }

                    return done(null, false, { message: 'Incorrect password.' })
                })
            })
    }
))
Log.success(" * passport LocalStrategy")

passport.serializeUser((user, done) => {
    done(null, user.id)
})
Log.success(" * passport serializeUser")

passport.deserializeUser((id, done) => {
    User.findByPk(id)
        .then((user, err) => { done(err, user) })
})
Log.success(" * passport deserializeUser")

app.use(passport.initialize())
app.use(passport.session())
Log.success(" * passport session")

/****** Définitions des routes ******/
Log.title("DEFINE ROUTES")

/* Restriction au user connecté */
app.all('*', (request, response, next) => {
    if (request.isAuthenticated()
    || request.path === '/'
    || request.path === '/widgets/get_login'
    || request.path === '/widgets/get_register'
    || request.path === '/users/login'
    || request.path === '/users/register'
    || request.path === '/supreme/register'
    || request.path === '/supreme/login') {
        next()
    } else {
        response.redirect('/supreme/login')
    }
})

/* Redirection */
app.get('/', (request, response) => {
    response.redirect('/supreme/drops')
})
Log.success(" * routes redirections")
  
/* Routes des modules */
/* users */
let usersRoutes = require('./routes/users.js')
app.use('/users', usersRoutes)
Log.success(" * routes module users")

/* pages */
let pagesRoutes = require('./routes/pages.js')
app.use('/supreme', pagesRoutes)
Log.success(" * routes module pages")

/* widgets */
let widgetsRoute = require('./routes/widgets.js')
app.use('/widgets', widgetsRoute)
Log.success(" * routes module widgets")

/****** Mise en place des crons ******/
Log.title('DEFINE CRONS')

const cronsTable = {}

// scrappe la liste des drops
cronsTable.scrapSupremeDrops = cron.schedule('0 0 23 * * * *', () => {
    scrapperSupremeController.getDropsList()
}, {
    scheduled: false
})
Log.success(" * cron scrapping drops declared")

// scrappe la liste des articles
cronsTable.scrapSupremeArticles = cron.schedule('0 30 23 * * * *', () => {
    scrapperSupremeController.getArticlesList()
}, {
    scheduled: false
})
Log.success(" * cron scrapping articles declared")

// lance les achats au debut des drops
cronsTable.buyArticles = cron.schedule('0,1,2,3,4,5,6,7,8,9,10 0 12 * * 4', async () => {
    const paniers = await Panier.findAll()
    Log.title('CRON SCRAPPING ARTICLES FOR DROP')
    if (paniers.length === 0) {
        Log.warning('Nothing to buy')
    } else {
        Log.notice(`${paniers.length} paniers found`)
        paniers.forEach((panier) => {
            scrapperSupremeController.buyArticles(panier.user_id)
        })
    }
}, {
    scheduled: false
})
Log.success(" * cron buy articles declared")

Log.title('ACTIVE CRONS')

if (process.env.CRON_SCRAPPING_DROPS) {
    cronsTable.scrapSupremeDrops.start()
    Log.success(" * cron scrapping drops actived")
} else {
    Log.warning(" * cron scrapping drops desactivated")
}

if (process.env.CRON_SCRAPPING_ARTICLES) {
    cronsTable.scrapSupremeArticles.start()
    Log.success(" * cron scrapping articles actived")
} else {
    Log.warning(" * cron scrapping articles desactivated")
}

if (process.env.CRON_BUYING_ARTICLES) {
    cronsTable.buyArticles.start()
    Log.success(" * cron buy articles actived")
} else {
    Log.warning(" * cron buy articles desactivated")
}

/****** Mise en route du server ******/
Log.title('START SERVER')
app.listen(process.env.PORT, () => {
    Log.notice(`Server listening on port ${process.env.PORT}`)
    Log.notice(`User Base URL is http://${process.env.BASE_URL}:${process.env.PORT}`)
    Log.notice(`Admin Base URL is http://${process.env.BASE_URL}:${process.env.PORT}/${process.env.BASE_ADMIN_URL}`)
    Log.blankLine()
})