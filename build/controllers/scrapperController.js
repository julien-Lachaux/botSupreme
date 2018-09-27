'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.scrapperController = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _supremeController = require('./supremeController');

var _jsoncache = require('@julien-lachaux/jsoncache');

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var scrapperController = exports.scrapperController = {
    getArticlesList: function getArticlesList(request, response) {
        var _this = this;

        return (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
            var cachePath, articlesBrut, articles, data;
            return _regenerator2.default.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _context.next = 2;
                            return _jsoncache.jsonCache.getMostRecentFile('articles');

                        case 2:
                            cachePath = _context.sent;
                            articlesBrut = JSON.parse(_fs2.default.readFileSync(_jsoncache.jsonCache.path + 'articles/' + cachePath));
                            articles = [];


                            articlesBrut.forEach(function (articleBrut) {
                                var articleData = articles.find(function (e) {
                                    return e.name === articleBrut.name;
                                });
                                if (articleData !== undefined) {
                                    var model = {
                                        model: articleBrut.model,
                                        img: articleBrut.img,
                                        url: articleBrut.url,
                                        sizes: articleBrut.sizes,
                                        sold_out: articleBrut.sold_out
                                    };
                                    if (articles.find(function (e) {
                                        return e.name === articleBrut.name && e.sold_out === false;
                                    }) === undefined) {
                                        articleData.isFullSoldOut = true;
                                    } else {
                                        articleData.isFullSoldOut = true;
                                    }
                                    articleData.models.push(model);
                                } else {
                                    var article = {
                                        name: articleBrut.name,
                                        sold_out: articleBrut.sold_out,
                                        price: articleBrut.price,
                                        priceUnit: articleBrut.priceUnit,
                                        models: new Array({
                                            model: articleBrut.model,
                                            img: articleBrut.img,
                                            url: articleBrut.url,
                                            sizes: articleBrut.sizes,
                                            sold_out: articleBrut.sold_out,
                                            isFullSoldOut: articleBrut.sold_out ? true : false
                                        })
                                    };
                                    articles.push(article);
                                }
                            });

                            data = {
                                articles: articles
                            };


                            console.log(articles.length);

                            response.render('components/articlesList', data);

                        case 9:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, _this);
        }))();
    },
    GET_manualScrapping: function GET_manualScrapping(request, response) {
        var _this2 = this;

        return (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
            return _regenerator2.default.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            _supremeController.supremeController.getSupremeArticles();
                            response.render('manualScrapping', {});

                        case 2:
                        case 'end':
                            return _context2.stop();
                    }
                }
            }, _callee2, _this2);
        }))();
    }
};