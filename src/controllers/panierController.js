import fs from 'fs'

export const panierController = {
    async GET_addArticle(request, response) {
        let cachePath   = await jsonCache.getMostRecentFile('drops')
        let drops       = JSON.parse(fs.readFileSync(`${jsonCache.path}drops/${cachePath}`))
        
        response.render('components/panier', { drops: drops })
    }
}