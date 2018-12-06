import fs   from 'fs'

export const Config = {

    DIRECTORY_PATH: 'data/configs',

    get(id) {
        const path       = `${this.DIRECTORY_PATH}/user_${id}.json`
        const configExist = fs.existsSync(path)

        var config = {}

        if (configExist) {
            config = JSON.parse(fs.readFileSync(path))
        } else {
            config = {
                id: id,
                updated: false,
                nom: "",
                prenom: "",
                email: "",
                tel: "",
                livraison: {
                    pays: "",
                    code_postal: "",
                    ville: "",
                    adresse: "",
                    complement_1: "",
                    complement_2: ""
                },
                CB: {
                    typeCB: "",
                    numero: "",
                    exp_mois: "",
                    exp_annee: "",
                    visuel: ""
                }
            }
            this.update(id, config)
        }

        return config
    },

    update(id, payload) {
        let path = `${this.DIRECTORY_PATH}/user_${id}.json`
        fs.writeFileSync(path, JSON.stringify(payload))
    },

    isUpdated(id) {
        const config = this.get(id)
        if (config.updated) {
            return true
        }
        return false
    },

    formatPayload(payload) {
        console.log(payload)
        let date = payload.exp_mois !== '' ? payload.exp_mois.split('-') : ['', '']
        let parsedPayload = {
            id:         payload.id,
            nom:        payload.nom,
            updated:    payload.updated,
            prenom:     payload.prenom,
            email:      payload.email,
            tel:        payload.tel,
            livraison:  {
                            pays:             payload.pays,
                            code_postal:      payload.code_postal,
                            ville:            payload.ville,
                            adresse:          payload.rue,
                            complement_1:     payload.complement_1,
                            complement_2:     payload.complement_2
                        },
            CB:         {
                            "typeCB":       payload.typeCB,
                            "numero":       payload.numero,
                            "exp_mois":     date[1],
                            "exp_annee":    date[0],
                            "visuel":       payload.visuel
                        }
        }

        return parsedPayload
    }

}