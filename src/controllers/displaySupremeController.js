import fs                              from 'fs'
import { scrapperSupremeController }   from './scrapperSupremeController';
import { Config }                       from './../class/Config';
import { Utils }                       from '../class/Utils';
import { Drop }                        from '../models/Drop';
import { Article }                     from '../models/Article';

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

    async GET_buyArticles(request, response) {
        scrapperSupremeController.buyArticles(request.user.id)

        response.send(JSON.stringify({
            success: true,
            message: `Buy article process starting`
        }))
    },

    async GET_DropsArticle(request, response) {
        let drops = await Drop.findAll({
            include: [{
                model: Article
            }],
            order: [['week', 'DESC']]
        })
        let lastDrop = drops[0]
        lastDrop.articles.forEach((article) => {
            // les images
            let images = article.images.split('|')
            article.images = []
            images.forEach((image, index) => {
                article.images.push({
                    src: image,
                    active: index === 0 ? true : false,
                    index: index
                })
            })

            // colors
            console.log(article.colors)
            article.colors = article.colors !== null ? article.colors.split('|') : null
            console.log(article.colors)
            // sizes
            article.sizes = article.sizes !== null ? article.sizes.split('|') : null
        })

        // data object
        let data = {
            drop: lastDrop
        }
        
        response.render('components/drops', data)
    },

    async GET_Config(request, response) {
        let config              = Config.get(request.user.id)
        console.log(config)
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
        let payload    = request.body
        let success    = Config.update(request.user.id, Config.formatPayload(payload))

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