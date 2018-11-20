import Sequelize from 'sequelize'
import dotenv    from 'dotenv'

dotenv.config()

export const Db = {

    dbInstance: null,

    init() {
        this.getInstance()
        this.checkConnection()
    },

    checkConnection() {
        /****** verification de la connection avec la bdd ******/
        const db = this.getInstance()
        db.authenticate()
        .then(() => {
            console.log('Connection has been established successfully.');
        })
        .catch(err => {
            console.error('Unable to connect to the database:', err);
        })
    },

    /**
     * retourne une instance de Sequelize pre-configurer
     */
    getInstance() {
        if (this.dbInstance === null) {
            this.dbInstance = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
                dialect: process.env.DB_DIALECT,
                host: process.env.DB_HOST,
                port: process.env.DB_PORT,
                logging: (process.env.DB_LOGGING === 'true') ? true : false,
                operatorsAliases: false,
                pool: {
                    max: 5,
                    min: 0,
                    acquire: 30000,
                    idle: 10000
                }
            })
        }

        return this.dbInstance
    }

}