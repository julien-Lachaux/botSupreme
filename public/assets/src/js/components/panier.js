const app = require('./app')

const panier = {

    addArticle(id) {
        app.get('/widget/addArticle', (response) => {
            console.log(response)
        })
    }

}
module.exports = panier