const app = require('./components/app')
var currentPage = app.getCurrentPage()
app.get(`/scrapper/get_${currentPage}`, (response) => {
    console.log(response)
    document.querySelector('.content').innerHTML = response.responseText
})