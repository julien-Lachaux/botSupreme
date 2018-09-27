'use strict';

var _pagesController = require('./../controllers/pagesController');

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();
router.get('/articlesList', _pagesController.pagesController.GET_articlesList);

module.exports = router;