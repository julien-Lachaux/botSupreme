import Sequelize from 'sequelize'
import { Db }    from '../class/Db'

const db = Db.getInstance()

export const Drop = db.define('drops', {

    id: {
        type:         Sequelize.UUID,
        primaryKey:   true,
        defaultValue: Sequelize.UUIDV1,
    },
    week:         { type: Sequelize.INTEGER },
    display_week: { type: Sequelize.STRING },
    date:         { type: Sequelize.DATEONLY },
    display_date: { type: Sequelize.STRING },
    url:          { type: Sequelize.STRING }
    
})