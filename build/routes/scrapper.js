'use strict';

var _scrapperController = require('./../controllers/scrapperController');

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();
router.get('/get_articlesList', _scrapperController.scrapperController.getArticlesList);

module.exports = router;