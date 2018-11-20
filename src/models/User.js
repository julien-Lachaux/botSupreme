import Sequelize from 'sequelize'
import { Db }    from './../class/Db'

const db = Db.getInstance()

export const User = db.define('user', {

    id: {
        type:         Sequelize.UUID,
        primaryKey:   true,
        defaultValue: Sequelize.UUIDV1,
    },
    firstname: {
        type: Sequelize.STRING
    },
    lastname: {
        type: Sequelize.STRING
    },
    email: {
        type: Sequelize.STRING
    },
    password: {
        type: Sequelize.STRING
    }

})