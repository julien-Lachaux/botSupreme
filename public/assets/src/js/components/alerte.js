const app = require('./app')

const alerte = {

    /**
     * ============
     * CONSTANTES *
     * ============
     * 
     * @description les différents timers avant la disparition automatique de l'alertes /!\ ( en miliseconde ) /!\
     * 
     * @property {number} DEFAULT_TIMER  temps par defaut
     * @property {number} SHORT_TIMER    temps court
     * @property {number} LONG_TIMER     temps long
     * @property {number} NO_TIMER       infini ( desactive la disparition automatique )
     */
    DEFAULT_TIMER:  2500,
    SHORT_TIMER:    1500,
    LONG_TIMER:     5000,

    create(typeAlerte, message, title = false, close = false) {
        let body    = ''
        let options = []
        let classes = []

        // on ajoute les classes
        classes.push(`alert-${typeAlerte}`)
        if (close !== false) {
            classes.push('alert-dismissible')
        }
        // on ajoute un titre si besoin
        // et on formatte le html du message en consequence
        if (title !== false) {
            body = `<h4 class="alert-heading">${title}</h4><p>${message}</p>`
        } else {
            body = message
        }

        // on ajoute la croix pour close l'alerte
        if (close !== false) {
            options.push('<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>')
        }

        // on transforme le tout en stringHTML puis on le retourne
        let classesHtml = classes.join(' ')
        let optionsHtml = options.join('')
        let html        = `<div class="alert ${classesHtml} show fade" role="alert">${body}${optionsHtml}</div>`

        return html
    },

    setTimer(alerte, timer) {
        window.setTimeout(() => {
            console.log(alerte)
            alerte.alert('close')
        }, timer)
    },

    success(message, title = false, timer = this.DEFAULT_TIMER) {
        let alerteHtml  = this.create('success', message, title, true)
        let alerte      = $(alerteHtml)

        $('section.alertes').prepend(alerte)
        alerte.alert()

        if (timer != 0) {
            this.setTimer(alerte, timer)
        }
    },

    error(message, title = false, timer = this.DEFAULT_TIMER) {
        let alerteHtml  = this.create('danger', message, title, true)
        let alerte      = $(alerteHtml)

        $('section.alertes').prepend(alerte)
        alerte.alert()

        if (timer != 0) {
            this.setTimer(alerte, timer)
        }
    }

}
module.exports = alerte