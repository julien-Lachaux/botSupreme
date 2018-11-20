import Sequelize from 'sequelize'
import { Db }    from './../class/Db'

const db = Db.getInstance()

export const Panier = db.define('paniers', {

    id: {
        type:         Sequelize.UUID,
        primaryKey:   true,
        defaultValue: Sequelize.UUIDV1,
    },
    status: {
        type: Sequelize.STRING
    }

})