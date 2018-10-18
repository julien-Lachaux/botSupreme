import { webScrapper }  from '@julien-lachaux/webscrapper'
import { jsonCache }    from '@julien-lachaux/jsoncache'
import { Utils }        from '../class/Utils';

export const scrapperSupremeController = {

    /**
     * Ge articles from supreme website
     * 
     * @return array of articles group by categories
     */
    async getArticlesList() {
        Utils.log('init scrapping articles')
        webScrapper.setUrl('https://www.supremenewyork.com/shop/all')
        await webScrapper.init()
        let supremeArticles = await webScrapper.getElementsArray('#container article')

        let result = []
        for (let i = 0; i < supremeArticles.length; i++) {
            Utils.log('article ' + (i + 1) + ' on ' + supremeArticles.length + '\r')
            let articleUrl = await webScrapper.getElementData(supremeArticles[i], '.inner-article a', 'href')
            let articleImg = await webScrapper.getElementData(supremeArticles[i], '.inner-article img', 'src')

            try {
                var articleSoldOut = (await webScrapper.getElementData(supremeArticles[i], '.sold_out_tag'))
            } catch (error) {
                // DEBUG
                // console.log(error)
                articleSoldOut = undefined
            }

            await webScrapper.subScrapping(articleUrl)

            let articleDetail = (await webScrapper.getElementsArray('#container', true))[0]

            let articleName = await webScrapper.getElementData(articleDetail, 'h1.protect')
            let articleModel = await webScrapper.getElementData(articleDetail, 'p[itemprop="model"]')
            let articleCategory = articleUrl.split('/')[4]

            if (articleSoldOut !== undefined) {
                var article = {
                    name: articleName,
                    model: articleModel,
                    img: articleImg,
                    url: articleUrl,
                    category: articleCategory,
                    sold_out: true
                }
            } else {
                let articleDescription = await webScrapper.getElementData(articleDetail, 'p[itemprop="description"]')
                let articlePriceBrut = await webScrapper.getElementData(articleDetail, 'p[itemprop="offers"] span')
                let articlePrice = articlePriceBrut.substring(1)
                let articlePriceUnit = articlePriceBrut.substring(0, 1)

                let articleSizes = (await webScrapper.sub.page.evaluate(() => {
                    let sizes = []
                    let sizesDomArray = document.querySelectorAll('#size option')
                    if (sizesDomArray.length !== 0) {
                        sizesDomArray.forEach(option => {
                            sizes.push(option.innerText)
                        })
                    }
                    return sizes
                }))

                if (articleSizes.length === 0) {
                    articleSizes.push('Unique')
                }

                var article = {
                    name: articleName,
                    category: articleCategory,
                    model: articleModel,
                    description: articleDescription,
                    url: articleUrl,
                    img: articleImg,
                    price: articlePrice,
                    priceUnit: articlePriceUnit,
                    sizes: articleSizes,
                    sold_out: false
                }
            }
            await webScrapper.destroySub()
            result.push(article)
            article = {}
        }

        await webScrapper.end()
        await jsonCache.write(result, 'articles')

        return result
    },

    /**
     * get the drop's articles from spremecommunity website
     * 
     * @return array of articles group by drop
     */
    async getDropsList() {
        Utils.log('init scrapping drops articles')

        webScrapper.setUrl('https://www.supremecommunity.com/season/fall-winter2018/droplists/')
        await webScrapper.init()

        let dropsScrap = await webScrapper.getElementsArray('div.app-lr-pad-2')
        let drops = []

        Utils.log(dropsScrap.length + ' drops found')

        // i = 1 car doublon sur le site du latest drop
        for (let i = 1; i < dropsScrap.length; i++) {
            let displayI = i
            let drop = {
                url:    await webScrapper.getElementData(dropsScrap[i], 'a.block', 'href'),
                week:   await webScrapper.getElementData(dropsScrap[i], 'h2')
            }
            if (i === 1) { drop.latest = true }
            drop.displayDate    = await webScrapper.getElementData(dropsScrap[i], 'h4')
            drop.weekNumber     = drop.week.substring(5)
            
            let dateArray   = drop.displayDate.split(' ')
            let day         = dateArray[0].slice(0, -2)
            let months      = Utils.getMonths()
            let month       = months.find((element) => {
                return element.english === dateArray[1]
            }).number
            let year        = '20' + dateArray[2]
            
            drop.date       = day + '-' + month + '-' + year
            drop.name       = 'drop_' + drop.date
            
            drops.push(drop)
            Utils.log(displayI + ' drop scrapped on ' + (dropsScrap.length - 1))
        }
        webScrapper.end()

        for (let index = 0; index < drops.length; index++) {
            Utils.log('drop: ' + drops[index].week + ' init scrapping articles')

            webScrapper.setUrl(drops[index].url)
            await webScrapper.init()

            let articlesScrap       = await webScrapper.getElementsArray('div.masonry__item')
            drops[index].articles   = []

            for (let i = 0; i < articlesScrap.length; i++) {
                let displayI    = i + 1
                let articleId   = await articlesScrap[i].$eval('div.card-details', element => element.getAttribute('data-itemid'))

                let article = {
                    id:         articleId,
                    category:   await webScrapper.getElementData(articlesScrap[i], 'p.category'),
                    name:       await webScrapper.getElementData(articlesScrap[i], 'h5.name.item-details'),
                    img:        await webScrapper.getElementData(articlesScrap[i], 'img', 'src'),
                    detailUrl:  'https://www.supremecommunity.com/season/itemdetails/' + articleId,
                    price:      {
                                    euros:      null,
                                    dollars:    await webScrapper.getElementData(articlesScrap[i], 'p.priceusd')
                                },
                    like:       {
                                    positive:   parseInt(await webScrapper.getElementData(articlesScrap[i], 'p.upvotes')),
                                    negative:   parseInt(await webScrapper.getElementData(articlesScrap[i], 'p.downvotes')),
                                    ratio:      parseInt(await webScrapper.getElementData(articlesScrap[i], 'p.upvotesratio')),
                                }
                }

                await webScrapper.subScrapping(article.detailUrl)

                try {
                    let articleDetails      = (await webScrapper.getElementsArray('.detail-row', true))[0]
                    let articlePriceEuros   = await webScrapper.getElementData(articleDetails, 'div.price-grid :nth-child(3)')
                    article.description     = await webScrapper.getElementData(articleDetails, 'p.detail-desc i')
                    article.price.euros     = articlePriceEuros.substring(2)
                } catch (error) {
                    console.log(error)
                    article.price = false
                }

                await webScrapper.destroySub()

                drops[index].articles.push(article)
                Utils.log('article: ' + displayI + ' scrapped on ' + articlesScrap.length)
            }

            webScrapper.end()
        }

        Utils.log('all drops scrapped with success')
        await jsonCache.write(drops, 'drops')

        return drops
    }
}