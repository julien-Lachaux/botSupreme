import cron                          from 'node-cron'
import dotenv                        from 'dotenv'
import bcrypt                        from 'bcrypt'
import express                       from 'express'
import session                       from 'express-session'
import mustacheExpress               from 'mustache-express'
import { Db }                        from './class/Db';
import { Log }                       from './class/Log';
import { Restaurant }                from './models/Restaurant';;
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

const dbForceCreate = process.env.ORM_FORCE_CREATE_TABLE === 'true' ? true : false

/**
 * @table restaurants
 */
Restaurant.sync({force: dbForceCreate})
Log.success(" * table restaurants")

// Start scrapping
scrapperSupremeController.getListeRestaurants();