import { supremeController }    from './supremeController';
import { jsonCache }            from '@julien-lachaux/jsoncache'
import fs                       from 'fs'

export const scrapperController = {

    async getArticlesList(request, response) {
        let cachePath = await jsonCache.getMostRecentFile('articles')
        let articlesBrut = JSON.parse(fs.readFileSync(`${jsonCache.path}articles/${cachePath}`))

        var categories = []
        var articles = []

        articlesBrut.forEach(articleBrut => {
            let articleData = articles.find(e => {
                return e.name === articleBrut.name
            })
            if (articleData !== undefined) {
                let model = {
                    model: articleBrut.model,
                    img: articleBrut.img,
                    url: articleBrut.url,
                    sizes: articleBrut.sizes,
                    sold_out: articleBrut.sold_out
                }
                if (articles.find(e => {
                    return ((e.name === articleBrut.name) && (e.sold_out === false))
                }) === undefined) {
                    articleData.isFullSoldOut = true
                } else {
                    articleData.isFullSoldOut = true
                }
                articleData.models.push(model)
            } else {
                let article = {
                    name: articleBrut.name,
                    category: articleBrut.category,
                    sold_out: articleBrut.sold_out,
                    price: articleBrut.price,
                    priceUnit: articleBrut.priceUnit,
                    models: new Array({
                        model: articleBrut.model,
                        img: articleBrut.img,
                        url: articleBrut.url,
                        sizes: articleBrut.sizes,
                        sold_out: articleBrut.sold_out,
                        isFullSoldOut: articleBrut.sold_out ? true : false
                    })
                }

                let category = categories.find(e => {
                    return e.name === article.category
                })
                if (category === undefined) {
                    categories.push({
                        name: article.category,
                        articles: []
                    })
                }
                articles.push(article)
            }
        })

        categories.forEach(element => {
            console.log(element)
            element.articles = articles.filter(e => {
                return e.category === element.name
            })
        });

        let data = {
            categories: categories
        }

        console.log(categories.length)

        response.render('components/articlesList', data)
    },

    async GET_manualScrapping(request, response) {
        supremeController.getArticlesList()
        response.render('components/manualReload', {})
    }
}