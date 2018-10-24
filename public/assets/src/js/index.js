import './../scss/defaultStyle.scss';
const app       = require('./components/app')
const panier    = require('./components/panier')

var currentPage = app.getCurrentPage()
app.get(`/widgets/get_${currentPage}`, (response) => {
    $('.content').html(response)
    panier.activePanier()
})