import Sequelize from 'sequelize'
import { Db }    from '../class/Db'

const db = Db.getInstance()

export const Restaurant = db.define('restaurants', {

    id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV1
    },
    deliveroo_id:     {
        type: Sequelize.STRING(45),
        allowNull: false,
        unique: 'compositeIndex'
    },
    name:              { type: Sequelize.STRING },
    detail_url:        { type: Sequelize.STRING },
    adresse:           { type: Sequelize.STRING },
    phone_number:      { type: Sequelize.STRING },
    stars:             { type: Sequelize.FLOAT },
    description:       { type: Sequelize.STRING },
    deliveroo_area:    { type: Sequelize.STRING },
    deliveroo_subarea: { type: Sequelize.STRING },
})