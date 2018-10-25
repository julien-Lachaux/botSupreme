import { jsonCache }                    from '@julien-lachaux/jsoncache'
import fs                               from 'fs'

export const Panier = {

    path: 'data/panier.json',

    checkIfExist() {
        if (fs.existsSync(this.path)) {
            this.exist = true
        } else {
            this.exist = false
        }

        return this.exist
    },

    getSize() {
        var panier = []
        
        if (this.checkIfExist()) {
            panier = JSON.parse(fs.readFileSync(this.path))
        }

        return panier.length
    },

    getTotalPrice() {
        var panier      = JSON.parse(fs.readFileSync(this.path))
        var total       = 0

        if (this.checkIfExist()) {

            panier.forEach(article => {
                total += parseInt(article.price.euros)
            })
        }

        return total
    },

    getPanier() {
        var panier = false

        if (this.checkIfExist()) {
            var articles    = JSON.parse(fs.readFileSync(this.path))
            var total       = 0

            articles.forEach(article => {
                total += parseInt(article.price.euros)
            })

            panier = {
                articles:   articles,
                size:       articles.length,
                total:      total
            }
            
        }

        return panier
    },

    removePanier() {
        console.log('run test')
        if (this.checkIfExist()) {
            let test = fs.unlinkSync(this.path)
            console.log('test ok')
            console.log(test)
            return true
        }
        
        return false
    },

    async addArticle(id) {
        var panier      = []
        let cachePath   = await jsonCache.getMostRecentFile('drops')
        let drops       = JSON.parse(fs.readFileSync(`${jsonCache.path}drops/${cachePath}`))
        let article     = false

        if (this.checkIfExist()) {
            panier = JSON.parse(fs.readFileSync(this.path))
        }

        for (let i = 0; i < drops.length; i++) {
            const drop = drops[i];
            article = drop.articles.find((element => element.id === id))
            if (article !== false) {
                panier.push(article)
                fs.writeFileSync(this.path, JSON.stringify(panier))

                return true
            }
        }

        return false
    },

    removeArticle(id) {
        if (this.checkIfExist()) {
            let panier = JSON.parse(fs.readFileSync(this.path))

            panier = panier.filter((element) => {
                if (element.id !== id) {
                    return true
                }
                return false
            })

            if (panier.length === 0) {
                this.removePanier()
            } else {
                fs.writeFileSync(this.path, JSON.stringify(panier))
            }

            return true
        }

        return false
    },

    checkIfArticleExist(id) {
        if (this.checkIfExist()) {
            let testIfArticleExist = JSON.parse(fs.readFileSync(this.path)).filter(element => element.id === id)

            return (testIfArticleExist.length === 0) ? false : true
        }

        return false
    }

}