import './../scss/defaultStyle.scss';
const app = require('./components/app')

var currentPage = app.getCurrentPage()
app.get(`/scrapper/get_${currentPage}`, (response) => {
    $('.content').html(response)
})