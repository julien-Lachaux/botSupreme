import moment           from 'moment'
import { webScrapper }  from '@julien-lachaux/webscrapper'
import { Utils }        from '../class/Utils';
import { Config }        from '../class/Config';
import { Drop }         from '../models/Drop';
import { Article }      from '../models/Article';
import { Log }          from '../class/Log'
import { Panier } from '../models/Panier';
import { LignePanier } from '../models/LignePanier';

export const scrapperSupremeController = {

    /**
     * get the drops list from supremecommunity
     * 
     * @return array of drop
     */
    async getDropsList() {
        Log.title('SCRAPPING DROPS')

        webScrapper.setUrl('https://www.supremecommunity.com/season/fall-winter2018/droplists/')
        await webScrapper.init(true)

        let dropsScrap = await webScrapper.getElementsArray('div.app-lr-pad-2')
        let drops = []

        Log.notice((dropsScrap.length - 2) + ' drops found')

        // i = 1 car doublon sur le site du latest drop
        for (let i = 1; i < dropsScrap.length; i++) {
            if (i <= 2) {
                let drop = {
                    url:          await webScrapper.getElementData(dropsScrap[i], 'a.block', 'href'),
                    display_week: await webScrapper.getElementData(dropsScrap[i], 'h2')
                }
                drop.display_date = await webScrapper.getElementData(dropsScrap[i], 'h4')
                drop.week         = drop.display_week.substring(5)
                
                let dateArray = drop.display_date.split(' ')
                let day       = dateArray[0].slice(0, -2)
                let months    = Utils.getMonths()
                let month     = months.find((element) => {
                    return element.english === dateArray[1]
                }).number
                let year      = '20' + dateArray[2]
                drop.date     = new Date(year + '-' + month + '-' + day)
                
                try {
                    Log.success(i + ' drop scrapped on ' + (dropsScrap.length - 2))
                    await Drop.findOne({ where: { date: drop.date } })
                    .then((dropFromDb, err) => {
                        if (dropFromDb) {
                            Log.warning(' * drop already in db')
                        } else {
                            Drop.create(drop)
                            Log.notice(' * drop added to db')
                        }
                        drops.push(dropFromDb)
                    })
                }  catch (error) {
                    Log.error('drop: ' + i + ' on ' + (dropsScrap.length - 1) + ' failed')
                }
            }
        }
        webScrapper.end()
        Log.blankLine()
        Log.success('all drops scrapped with success')

        return drops
    },

    /**
     * get the articles list from supremecommunity
     * 
     * @return array of article
     */
    async getArticlesList() {
        Log.title('SCRAPPING ARTICLES')
        let drops = await Drop.findAll()

        for (let index = 0; index < drops.length; index++) {
            if (index > 0) {
                Log.blankLine()
            }
            Log.notice('drop for week ' + drops[index].week)

            webScrapper.setUrl(drops[index].url)
            await webScrapper.init()

            let articlesScrap     = await webScrapper.getElementsArray('div.masonry__item')
            drops[index].articles = []
            
            for (let i = 0; i < articlesScrap.length; i++) {
                let displayI         = i + 1
                let articleId        = await articlesScrap[i].$eval('div.card-details', element => element.getAttribute('data-itemid'))
                let dropId           = drops[index].id
                let articleCat       = await articlesScrap[i].$eval('p.category', element => element.innerText)
                let articleDetailUrl = 'https://www.supremecommunity.com/season/itemdetails/' + articleId
                

                await webScrapper.subScrapping(articleDetailUrl)

                // on récupères les details
                let details = await webScrapper.sub.page.evaluate(() => {
                    // nom + category + description
                    let articleName        = document.querySelector('h4').innerText
                    let articleDescription = document.querySelector('p.detail-desc i').innerText

                    // options
                    let optionsContainer  = document.querySelectorAll('ul.sc-tabs li')
                    let optionsContainers = {
                        notes:  optionsContainer[0],
                        prices: optionsContainer[1],
                        colors: optionsContainer[2],
                        sizes:  optionsContainer[3]
                    }

                    // notes
                    let articleNotesPositive = parseInt(optionsContainers.notes.querySelector('p.upvotes').innerText)
                    let articleNotesNegative = parseInt(optionsContainers.notes.querySelector('p.downvotes').innerText)
                    let articleNotesRatio    = parseInt(articleNotesPositive / articleNotesNegative)
                    
                    // prices
                    let priceDollars = optionsContainers.prices.querySelector('span.price-label:nth-child(1)')
                    let priceEuros   = optionsContainers.prices.querySelector('span.price-label:nth-child(3)')

                    if (priceDollars !== null) {
                        priceDollars = priceDollars.innerText.substring(2)
                    } else {
                        priceDollars = ''
                    }
                    if (priceEuros !== null) {
                        priceEuros = priceEuros.innerText.substring(2)
                    } else {
                        priceEuros = ''
                    }

                    // colors
                    var colors = []
                    let colorsContainer = optionsContainers.colors.querySelectorAll('span.label')
                    colorsContainer.forEach((element) => {
                        colors.push(element.innerText)
                    })
                    colors = colors.join('|')

                    // sizes
                    var sizes = []
                    let sizesContainer = optionsContainers.sizes.querySelectorAll('th')
                    sizesContainer.forEach((element, index) => {
                        if (index > 0) { sizes.push(element.innerText) }
                    })
                    sizes = sizes.join('|')

                    // images
                    var images = []
                    document.querySelectorAll('img').forEach((element) => {
                        images.push(element.getAttribute('src'))
                    })
                    images = images.join('|')

                    return {
                        articleName:          articleName,
                        articleDescription:   articleDescription,
                        articleColors:        colors !== '' ? colors : null,
                        articleSizes:         sizes !== '' ? sizes : null,
                        articleImages:        images !== '' ? images : null,
                        articlePriceEuros:    priceEuros !== '' ? priceEuros : null,
                        articlePriceDollars:  priceDollars !== '' ? priceDollars : null,
                        articleNotesPositive: articleNotesPositive,
                        articleNotesNegative: articleNotesNegative,
                        articleNotesRatio:    articleNotesRatio
                    }
                })
                await webScrapper.destroySub()

                // on met en forme l'article
                let article     = {
                    name:          details.articleName,
                    category:      articleCat,
                    description:   details.articleDescription,
                    supreme_id:    articleId,
                    drop_id:       dropId,
                    detail_url:    'https://www.supremecommunity.com/season/itemdetails/' + articleId,
                    images:        details.articleImages,
                    colors:        details.articleColors,
                    sizes:         details.articleSizes,
                    note_negative: details.articleNotesNegative,
                    note_positive: details.articleNotesPositive,
                    note_ratio:    details.articleNotesRatio,
                    price_euros:   details.articlePriceEuros,
                    price_dollars: details.articlePriceDollars
                }

                try {
                    await Article.findOne({ where: { supreme_id: article.supreme_id } })
                    .then(async (articleFromDb) => {
                        Log.success('article: ' + displayI + ' scrapped on ' + articlesScrap.length + ' success')
                        if (article.price_euros === null) {
                            Log.warning(' * no price found')
                        }
                        if (articleFromDb) {
                            Log.warning(' * already in db')
                            await Article.update(article, { where: { supreme_id: article.supreme_id } })
                                         .then(async (result) => {
                                             if (result) {
                                                 Log.notice(' * article data updated')
                                             } else {
                                                 Log.err(' * article date update failed')
                                             }
                                         })
                        } else {
                            Article.create(article)
                            Log.notice(' * added to db')
                        }
                    })
                } catch (error) {
                    console.log(error)
                    Log.error('article: ' + displayI + ' on ' + articlesScrap.length + ' failed')
                }
            }
            webScrapper.end()
        }
    },

    /**
     * buy articles from users basket on supreme online shop
     * 
     * @return object
     */
    async buyArticles(userId) {
        // init
        Log.title('BUYING ARTICLES')

        // panier + lignes panier
        var panier = await Panier.findOne({
            where: {
                user_id: userId
            },
            include: [{
                model: LignePanier
            }]
        })
        if (panier === false) {
            Log.error('scrapping failed, basket not found')
            return 'Le panier est vide'
        }

        Log.success('articles to buy loaded')

        // articles cibles
        Log.notice(`${panier.lignes_paniers.length} articles to buy`)

        await panier.lignes_paniers.forEach(async (ligne) => {
            let article = await Article.findOne({ where: { supreme_id: ligne.article_id } })
            this.buyOneArticle(article, userId)
        })

        return true
    },

    async buyOneArticle(article, userId) {
        Log.notice(article.category + ' : ' + article.name)

        let category = article.category === 'tops-sweaters' ? 'tops_sweaters' : article.category
        webScrapper.setUrl('https://www.supremenewyork.com/shop/all/' + category)
        await webScrapper.init()

        let articles = await webScrapper.page.evaluate(() => {
            var articlesScrapped = []
            let articlesDomElements = document.querySelectorAll('article')
            articlesDomElements.forEach(article => {
                articlesScrapped.push({
                    name: article.querySelector('h1 a').innerText,
                    color: article.querySelector('p a').innerText,
                    link: article.querySelector('h1 a').getAttribute('href')
                })
            })
            
            return articlesScrapped
        })

        await webScrapper.end()

        articles = articles.filter(a => a.name === article.name)

        let colors = article.colors.split('|')
        var sizes  = false

        if (article.sizes !== null && article.sizes !== undefined && article.sizes !== '') {
            sizes = article.sizes.replace(/\s+/g, '').split('|')
        }

        for (const i in colors) {
            var color        = colors[i]
            var articleCible = articles.find(a => a.color === color)
            
            if (articleCible !== undefined) {
                if (sizes !== false) {
                    for (const u in sizes) {
                        let size = sizes[u]
                        let currentProcess = i + '-' + u
        
                        this.buy_final(articleCible.link, color, size, currentProcess, userId)
                    }
                } else {
                    this.buy_final(articleCible.link, color, false, currentProcess, userId)
                }
            } else {
                Log.error('Article pas encore disponible')
            }
        }
        
        return 0;
    },

    async buy_final(articleUrl, color, size, processId, userId) {
        const config       = Config.get(userId)
        const displaySize = size !== false ? size : 'unique'
        const displayName = ` [${processId}] (${color} - ${displaySize}) `

        var timeStart = moment()
        var soldOut = false

        switch (displaySize) {
            case 'S':
                size = 'Small'
                break;
        
            case 'M':
                size = 'Medium'
                break;

            case 'L':
                size = 'Large'
                break;

            case 'XL':
                size = 'XLarge'
                break;
        }

        function bestCopyEver(src) {
            return Object.assign({}, src);
        }
        var scrapper = bestCopyEver(webScrapper)

        scrapper.setUrl('https://www.supremenewyork.com' + articleUrl)
        await scrapper.init()

        // ajout au panier
        try {
            await scrapper.page.waitFor(100)
            let inputValue = await scrapper.page.evaluate((displaySize) => {
                let sizeInput    = document.querySelector('#size')
                let sizesOptions = document.querySelectorAll('#size option')
                
                let valueInput   = sizesOptions.find(e => e.innerText === displaySize)

                if (valueInput !== undefined) {
                    sizeInput.value = valueInput.value
                }

                return {
                    value: sizeInput.value,
                    input: valueInput
                }
            }, displaySize)
            await scrapper.page.click('form.add input[type="submit"]')
            Log.success(displayName + ' -- article Ajouter au panier ')
        } catch (error) {
            soldOut = true
            Log.error(displayName + ' -- article SOLDOUT ')
        }

        if (soldOut === false) {
            await scrapper.page.waitFor(100)
    
            // on verifie le panier
            await scrapper.goto('https://www.supremenewyork.com/shop/cart')
    
            var panierSiteArticles = await scrapper.getElementsArray('#cart-body tr', false)
            if (panierSiteArticles.length > 0) {
                // phase de paiement
                await scrapper.goto('https://www.supremenewyork.com/checkout')
                await scrapper.page.waitFor(100)

                let form = await scrapper.page.evaluate((config) => {
                    // contourner le captcha
                    document.querySelector('div.g-recaptcha').remove()

                    // remplir formulaire de paiement
                    let form = {
                        livraison: {
                            name:        document.querySelector('input[name="order[billing_name]"]'),
                            mail:        document.querySelector('input[name="order[email]"]'),
                            tel:         document.querySelector('input[name="order[tel]"]'),
                            adresse_1:   document.querySelector('input[name="order[billing_address]"]'),
                            adresse_2:   document.querySelector('input[name="order[billing_address_2]"]'),
                            adresse_3:   document.querySelector('input[name="order[billing_address_3]"]'),
                            ville:       document.querySelector('#order_billing_city'),
                            code_postal: document.querySelector('#order_billing_zip'),
                            pays:        document.querySelector('#order_billing_country')
                        },
                        paiement: {
                            CB_type:   document.querySelector('#credit_card_type'),
                            CB_numero: document.querySelector('#cnb'),
                            visuel:    document.querySelector('#vval'),
                            expiration: {
                                mois:  document.querySelector('#credit_card_month'),
                                annee: document.querySelector('#credit_card_year')
                            }
                        },
                        terms:           document.querySelector('#order_terms'),
                        termsValidation: document.querySelector('input[name="order[terms]"]')
                    }
                    // on saisie les informations de livraison
                    form.livraison.name.value        = config.nom + ' ' + config.prenom
                    form.livraison.tel.value         = config.tel
                    form.livraison.mail.value        = config.email
                    form.livraison.pays.value        = config.livraison.pays
                    form.livraison.ville.value       = config.livraison.ville
                    form.livraison.adresse_1.value   = config.livraison.adresse
                    form.livraison.adresse_2.value   = config.livraison.complement_1
                    form.livraison.adresse_3.value   = config.livraison.complement_2
                    form.livraison.code_postal.value = config.livraison.code_postal
    
                    // puis les informations de paiement
                    form.paiement.CB_type.value          = config.CB.typeCB
                    form.paiement.CB_numero.value        = config.CB.numero
                    form.paiement.visuel.value           = config.CB.visuel
                    form.paiement.expiration.mois.value  = config.CB.exp_mois
                    form.paiement.expiration.annee.value = config.CB.exp_annee
    
                    // on coche les termes et condiftions
                    form.terms.value           = 1
                    form.termsValidation.value = 1
                    
                    return {
                        livraison: {
                            name:        form.livraison.name.value,
                            mail:        form.livraison.mail.value,
                            tel:         form.livraison.tel.value,
                            adresse_1:   form.livraison.adresse_1.value,
                            adresse_2:   form.livraison.adresse_2.value,
                            adresse_3:   form.livraison.adresse_3.value,
                            ville:       form.livraison.ville.value,
                            code_postal: form.livraison.code_postal.value,
                            pays:        form.livraison.pays.value
                        },
                        paiement: {
                            CB_type:   form.paiement.CB_type.value,
                            CB_numero: form.paiement.CB_numero.value,
                            visuel:    form.paiement.visuel.value,
                            expiration: {
                                mois:  form.paiement.expiration.mois.value,
                                annee: form.paiement.expiration.annee.value
                            }
                        }
                    }
                }, config)
    
                // pour controler les valeurs rentrer dans le form de paiement
                // Utils.log(form)
    
                // validation de la commande
                await scrapper.page.click('#pay input[type="submit"]')
                try {
                    await scrapper.page.waitFor(100)
                } catch (error) {
                    Log.error(error.message)
                }
                Log.success(displayName + ' -- article buy')
            } else {
                Log.error(displayName + ' -- article not buy')
            }
            await scrapper.page.screenshot({ path: "temp/screenshot_" + processId + "_.png" })
        }

        let timeEnd           = moment()
        let scrappingDuration = moment.duration(timeEnd.diff(timeStart)).asSeconds()

        Log.notice(displayName + ' -- finished: ' + scrappingDuration + ' secondes')
        
        await scrapper.end()

        return scrappingDuration
    }
}