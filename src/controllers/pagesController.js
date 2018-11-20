export const pagesController = {

    async GET_drops(request, response) {
        const currentUser = request.user
        response.render('base_template', {
            currentUser: currentUser
        })
    },

    async GET_manualReload(request, response) {
        const currentUser = request.user
        response.render('base_template', {
            currentUser: currentUser
        })
    },

    async GET_configuration(request, response) {
        const currentUser = request.user
        response.render('base_template', {
            currentUser: currentUser
        })
    },

    async GET_controlePanel(request, response) {
        const currentUser = request.user
        response.render('base_template', {
            currentUser: currentUser
        })
    },

    async GET_login(request, response) {
        response.render('base_template', {
            currentUser: false
        })
    },

    async GET_register(request, response) {
        response.render('base_template', {
            currentUser: false
        })
    },
}