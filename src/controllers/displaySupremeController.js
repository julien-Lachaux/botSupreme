import fs                              from 'fs'
import { scrapperSupremeController }   from './scrapperSupremeController';
import { Config }                       from './../class/Config';
import { Utils }                       from '../class/Utils';
import { Drop } from '../models/Drop';
import { Article } from '../models/Article';

export const displaySupremeController = {

    async GET_manualScrapping(request, response) {
        switch (request.params.action) {
            case 'drops':
                scrapperSupremeController.getDropsList()
                break;
            
            case 'articles':
                scrapperSupremeController.getArticlesList()
                break;
        }
        response.send(JSON.stringify({
            success: true,
            message: `Scrapping ${request.params.action} list starting`
        }))
    },

    async GET_DropsArticle(request, response) {
        let data = {
            drops: await Drop.findAll({
                include: [{
                    model: Article
                }],
                order: [['week', 'DESC']]
            })
        }
        
        response.render('components/drops', data)
    },

    async GET_Config(request, response) {
        let configId            = request.params.id
        let config              = Config.get(configId)
        let deliveryCountries  = Utils.getDeliveryCountries()
        let paymentMethods     = Utils.getPaymentMethods()

        deliveryCountries.forEach((currentCountry) => {
            if (currentCountry.value === config.livraison.pays) {
                currentCountry.selected = true
            }

            if (currentCountry.value === 'FR') {
                currentCountry.default = true
            }
        })

        paymentMethods.forEach((paymentMethod) => {
            if (paymentMethod.value === config.CB.typeCB) {
                paymentMethod.selected = true
            }

            if (paymentMethod.value === 'master') {
                paymentMethod.default = true
            }
        })

        let data    = {
                        config:                 config,
                        deliveryCountries:     deliveryCountries,
                        paymentMethods:        paymentMethods,
                    }

        response.render('components/config', data)
    },

    async POST_Config(request, response) {
        let configId    = request.params.id
        let payload    = request.body
        let success    = Config.update(configId, payload)


        response.send(JSON.stringify({success: success}))
    },

    async GET_ControlePanel(request, response) {

        response.render('components/controlPanel', {})
    },

    async GET_Login(request, response) {
        response.render('components/userLoginForm', {})
    },

    async GET_Register(request, response) {
        response.render('components/userRegisterForm', {})
    },
    
}