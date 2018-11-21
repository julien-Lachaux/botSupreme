import Sequelize from 'sequelize'
import { Db }    from '../class/Db'
import { Drop }  from './Drop';

const db = Db.getInstance()

export const Article = db.define('articles', {

    id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV1
    },
    supreme_id:     {
        type: Sequelize.STRING(10),
        allowNull: false,
        unique: 'compositeIndex'
    },
    category:       { type: Sequelize.STRING },
    name:           { type: Sequelize.STRING },
    images:         { type: Sequelize.STRING },
    detail_url:     { type: Sequelize.STRING },
    description:    { type: Sequelize.TEXT },
    price_euros:    { type: Sequelize.INTEGER },
    price_dollars:  { type: Sequelize.INTEGER },
    colors:         { type: Sequelize.STRING },
    sizes:          { type: Sequelize.STRING },
    note_ratio:     { type: Sequelize.INTEGER },
    note_positive:  { type: Sequelize.INTEGER },
    note_negative:  { type: Sequelize.INTEGER }
    
})