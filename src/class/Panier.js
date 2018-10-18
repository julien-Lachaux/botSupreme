import fs from 'fs'

export const Panier = {

    path: './../../data/panier.json',

    getPanier() {
        return JSON.parse(fs.readFileSync(this.path))
    },

    removePanier() {
        fs.unlinkSync(this.path)
        return true
    },

    addArticle(article) {
        try {
            let panier = JSON.parse(fs.readFileSync(this.path))
            panier.push(article)
        } catch (error) {
            panier = []
            panier.push(article)
            fs.writeFileSync(cachePath, JSON.stringify(article))
        }
        return panier
    },

    removeArticle(article) {
        let panier = JSON.parse(fs.readFileSync(this.path)).filter(element => element.id !== article.id)
        fs.writeFileSync(cachePath, JSON.stringify(article))
        
        return panier
    }

}