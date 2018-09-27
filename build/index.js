'use strict';

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _nodeCron = require('node-cron');

var _nodeCron2 = _interopRequireDefault(_nodeCron);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _mustacheExpress = require('mustache-express');

var _mustacheExpress2 = _interopRequireDefault(_mustacheExpress);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();
var port = process.env.PORT || 8001;

app.engine('html', (0, _mustacheExpress2.default)());
app.set('view engine', 'html');
app.set('views', 'src/views/');
app.use('/public', _express2.default.static('public'));

app.get('/', function (request, response) {
  response.redirect('/scrapper/articlesList');
});

var pagesRoutes = require('./routes/pages.js');
app.use('/supreme', pagesRoutes);

var scrapperRoute = require('./routes/scrapper.js');
app.use('/scrapper', scrapperRoute);

app.listen(port, function () {
  console.log('App listening on port ' + port);
});

require('dotenv').config();