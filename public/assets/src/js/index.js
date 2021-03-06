import './../scss/defaultStyle.scss';

const app       = require('./components/app')
const panier    = require('./components/panier')
const alerte    = require('./components/alerte')

var currentPage     = app.getCurrentPage()
var endpoint        = ''

switch (currentPage) {
    default:
        endpoint = `/widgets/get_${currentPage}`
        break;
}
app.get(endpoint, (response) => {
    $('.content').html(response)
    if (
        currentPage    !== 'login'
        && currentPage !== 'register'
    ) {
        panier.activePanier()
        $('.carousel').each((i, carousel) => {
            $(carousel).carousel({
                interval: false,
                ride:     false
            })
        })
        app.activeAjaxLink((response) => {
            if (response.success) {
                alerte.success(response.message)
            } else {
                alerte.error(response.message)
            }
        })
    }
    if (currentPage === 'configuration') {
        $('#configForm').submit((e) => {
            let payload = app.serializeForm('#configForm', 'id')
            app.post(`/widgets/update_configuration`, payload, (response2) => {
                if(response2.success) {
                    alerte.success('Configuration mis à jour avec succès !')
                } else {
                    alerte.error('Echec de la mise à jour de la configuration !')
                }
            })
            e.preventDefault()
        })
    }
})