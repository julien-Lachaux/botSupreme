import { Log }          from '../class/Log';
import { Restaurant }    from '../models/Restaurant';
import { webScrapper }  from '@julien-lachaux/webscrapper'
import { readlink } from 'fs';

export const scrapperSupremeController = {

    async getListeRestaurants() {
        Log.title('SCRAPPING REESTAURANTS')

        webScrapper.setUrl('https://deliveroo.fr/fr/sitemap')
        await webScrapper.init(true)

        let restaurantsScrap = await webScrapper.getElementsArray('ul.sitemap--zone-restaurants ul.no-ui li')
        let restaurants = []

        Log.notice((restaurantsScrap.length - 1) + ' restaurant found')

        function cleanString(input) {
            var output = "";
            for (var i=0; i<input.length; i++) {
                if (input.charCodeAt(i) <= 127) {
                    output += input.charAt(i);
                }
            }
            return output;
        }
        // i = 1 car doublon sur le site du latest restaurant
        for (let i = 0; i < restaurantsScrap.length; i++) {
            let restaurant = {
                name: cleanString(await webScrapper.getElementData(restaurantsScrap[i], 'a')),
                detail_url:  await webScrapper.getElementData(restaurantsScrap[i], 'a', 'href'),
            }
            restaurants.push(restaurant)
            //break;
        }
        
        for (let i = 0; i < restaurants.length; i++) {
            await webScrapper.subScrapping(restaurants[i].detail_url)

            let details = await webScrapper.sub.page.evaluate(() => {
                function tryGetValue(selector) {
                    try {
                        var value = document.querySelector(selector).innerText
                    } catch (error) {
                        var value = null
                    }
                    return value
                }
                let address     = tryGetValue('.address')
                let description = tryGetValue('.restaurant__description span')
                let stars       = tryGetValue('.restaurant__details div div:nth-child(6n) span')

                return {
                    address:     address,
                    description: description,
                    stars:       stars,
                }
            })

            await webScrapper.sub.page.$eval('.restaurant__info-link button', elem => elem.click());

            let phone = await webScrapper.sub.page.evaluate(() => {
                try {
                    var value = document.querySelectorAll('.ReactModalPortal')[1].querySelectorAll('div div:nth-child(2) a')[1].innerText
                } catch (error) {
                    var value = null
                }
                return value
            })

            restaurants[i].deliveroo_id      = restaurants[i].detail_url.split('/')[7]
            restaurants[i].deliveroo_subarea = restaurants[i].detail_url.split('/')[6]
            restaurants[i].deliveroo_area    = restaurants[i].detail_url.split('/')[5]
            restaurants[i].adresse           = details.address
            restaurants[i].description       = cleanString(details.description)
            restaurants[i].stars             = details.stars
            restaurants[i].phone_number      = phone

            //console.log(restaurants[i])

            await webScrapper.destroySub()

            try {
                await Restaurant.findOne({ where: { deliveroo_id: restaurants[i].deliveroo_id } })
                .then(async (restaurantFromDb) => {
                    if (restaurantFromDb) {
                        Log.warning(' * already in db')
                        //await Restaurant.update(restaurants[i], { where: { deliveroo_id: restaurants[i].deliveroo_id } })
                        //             .then(async (result) => {
                        //                 if (result) {
                        //                     Log.notice(' * restaurant data updated')
                        //                 } else {
                        //                     Log.err(' * restaurant date update failed')
                        //                 }
                        //             })
                    } else {
                        Restaurant.create(restaurants[i])
                        Log.notice(' * added to db')
                    }
                })
            } catch (error) {
                console.log(error)
            }

            //break
        }

        webScrapper.end()
        Log.blankLine()
        Log.success('all restaurants scrapped with success')
    }
}