import fs               from 'fs'
import cron             from 'node-cron'
import express          from 'express'
import mustacheExpress  from 'mustache-express'

const app = express()
const port = process.env.PORT || 8001;

app.engine('html', mustacheExpress())
app.set('view engine', 'html')
app.set('views', 'src/views/')
app.use('/public', express.static('public'));

app.get('/', (request, response) => {
  response.redirect('/supreme/articlesList')
})

let pagesRoutes = require('./routes/pages.js')
app.use('/supreme', pagesRoutes)

let widgetsRoute = require('./routes/widgets.js')
app.use('/widgets', widgetsRoute)

app.listen(port, function() {
    console.log('App listening on port ' + port)
})

require('dotenv').config()