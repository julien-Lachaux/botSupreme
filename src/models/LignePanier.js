import Sequelize from 'sequelize'
import { Db }    from '../class/Db'

const db = Db.getInstance()

export const LignePanier = db.define('lignes_paniers', {

    id: {
        type:         Sequelize.UUID,
        primaryKey:   true,
        defaultValue: Sequelize.UUIDV1,
    },
    status: {
        type: Sequelize.STRING
    }

})