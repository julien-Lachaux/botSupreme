import './../scss/defaultStyle.scss';
const app       = require('./components/app')
const panier    = require('./components/panier')
const alerte    = require('./components/alerte')

var currentPage     = app.getCurrentPage()
var endpoint        = ''

switch (currentPage) {
    case 'configuration':
        endpoint = `/widgets/get_${currentPage}/420`
        break;

    default:
        endpoint = `/widgets/get_${currentPage}`
        break;
}
app.get(endpoint, (response) => {
    $('.content').html(response)
    panier.activePanier()
    $('#configForm').submit((e) => {
        let payload = app.serializeForm('#configForm', 'id')
        console.log(payload.id)
        app.post(`/widgets/update_configuration/${payload.id}`, payload, (response2) => {
            if(response2.success) {
                alerte.success('Configuration mis à jour avec succès !')
            } else {
                alerte.error('Echec de la mise à jour de la configuration !')
            }
        })
        e.preventDefault()
    })
})