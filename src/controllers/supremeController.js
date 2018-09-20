import { webScrapper } from '@julien-lachaux/webscrapper'
import { jsonCache } from '@julien-lachaux/jsoncache'

export const supremeController = {

    async getSupremeArticles() {
       console.log('init scrapping')
       webScrapper.setUrl('https://www.supremenewyork.com/shop/all')
       await webScrapper.init()
       let supremeArticles = await webScrapper.getElementsArray('#container article')
   
       let result = []
       for (let i=0; i < supremeArticles.length; i++) {
           console.log('article ' + (i + 1) + ' on ' + (supremeArticles.length + 1) + '\r')
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
   
           if (articleSoldOut !== undefined) {
               var article = {
                   name:       articleName,
                   model:      articleModel,
                   img:        articleImg,
                   url:        articleUrl,
                   sold_out:   true
               }
               await webScrapper.destroySub()
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
               
               if(articleSizes.length === 0) {
                   articleSizes.push('Unique')
               }
       
               await webScrapper.destroySub()
       
               var article = {
                   name:           articleName,
                   model:          articleModel,
                   description:    articleDescription,
                   url:            articleUrl,
                   img:            articleImg,
                   price:          articlePrice,
                   priceUnit:      articlePriceUnit,
                   sizes :         articleSizes
               }
           }
   
           result.push(article)
           article = {}
       }
   
        await webScrapper.end()
   
        await jsonCache.write(result, 'articles')
   
       return result
   }
}