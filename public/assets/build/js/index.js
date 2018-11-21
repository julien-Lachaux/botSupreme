/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./public/assets/src/js/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./public/assets/src/js/components/alerte.js":
/*!***************************************************!*\
  !*** ./public/assets/src/js/components/alerte.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar app = __webpack_require__(/*! ./app */ \"./public/assets/src/js/components/app.js\");\n\nvar alerte = {\n\n    /**\n     * ============\n     * CONSTANTES *\n     * ============\n     * \n     * @description les différents timers avant la disparition automatique de l'alertes /!\\ ( en miliseconde ) /!\\\n     * \n     * @property {number} DEFAULT_TIMER  temps par defaut\n     * @property {number} SHORT_TIMER    temps court\n     * @property {number} LONG_TIMER     temps long\n     * @property {number} NO_TIMER       infini ( desactive la disparition automatique )\n     */\n    DEFAULT_TIMER: 2500,\n    SHORT_TIMER: 1500,\n    LONG_TIMER: 5000,\n\n    create: function create(typeAlerte, message) {\n        var title = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;\n        var close = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;\n\n        var body = '';\n        var options = [];\n        var classes = [];\n\n        // on ajoute les classes\n        classes.push('alert-' + typeAlerte);\n        if (close !== false) {\n            classes.push('alert-dismissible');\n        }\n        // on ajoute un titre si besoin\n        // et on formatte le html du message en consequence\n        if (title !== false) {\n            body = '<h4 class=\"alert-heading\">' + title + '</h4><p>' + message + '</p>';\n        } else {\n            body = message;\n        }\n\n        // on ajoute la croix pour close l'alerte\n        if (close !== false) {\n            options.push('<button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button>');\n        }\n\n        // on transforme le tout en stringHTML puis on le retourne\n        var classesHtml = classes.join(' ');\n        var optionsHtml = options.join('');\n        var html = '<div class=\"alert ' + classesHtml + ' show fade\" role=\"alert\">' + body + optionsHtml + '</div>';\n\n        return html;\n    },\n    setTimer: function setTimer(alerte, timer) {\n        window.setTimeout(function () {\n            console.log(alerte);\n            alerte.alert('close');\n        }, timer);\n    },\n    success: function success(message) {\n        var title = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;\n        var timer = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this.DEFAULT_TIMER;\n\n        var alerteHtml = this.create('success', message, title, true);\n        var alerte = $(alerteHtml);\n\n        $('section.alertes').prepend(alerte);\n        alerte.alert();\n\n        if (timer != 0) {\n            this.setTimer(alerte, timer);\n        }\n    },\n    error: function error(message) {\n        var title = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;\n        var timer = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this.DEFAULT_TIMER;\n\n        var alerteHtml = this.create('danger', message, title, true);\n        var alerte = $(alerteHtml);\n\n        $('section.alertes').prepend(alerte);\n        alerte.alert();\n\n        if (timer != 0) {\n            this.setTimer(alerte, timer);\n        }\n    }\n};\nmodule.exports = alerte;\n\n//# sourceURL=webpack:///./public/assets/src/js/components/alerte.js?");

/***/ }),

/***/ "./public/assets/src/js/components/app.js":
/*!************************************************!*\
  !*** ./public/assets/src/js/components/app.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar app = {\n\n    /**\n     * get\n     * @description effectue une requete ajax get avec la gestion d'erreur\n     * @param {string} url url à appelé en ajax\n     * @param {funtion} callback fonction de callback\n     */\n    get: function get(url) {\n        var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};\n\n        $.ajax({\n            url: url,\n            method: 'GET'\n        }).done(callback).fail(app.ajaxError);\n    },\n\n\n    /**\n     * post\n     * @description effectue une requete ajax post avec la gestion d'erreur\n     * @param {strin} url url à appelé en ajax\n     * @param {object} data data envoyé avec la requete POST\n     * @param {function} callback fonction de callback\n     */\n    post: function post(url, data) {\n        var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function () {};\n        var dataTpe = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'json';\n\n        $.post(url, data, function (response) {\n            callback(response);\n        }, dataTpe);\n    },\n\n\n    /**\n     * activeAjaxLink\n     * @description actives les ajax-link\n     * @param {function} callback fonction executer au retour de l'appel ajax\n     */\n    activeAjaxLink: function activeAjaxLink() {\n        var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};\n\n        $('.ajaxLink').each(function (i, link) {\n            link = $(link);\n            link.click(function (event) {\n                var element = event.target;\n                event.preventDefault();\n                element = $(element);\n                app.get(element.attr('href'), callback);\n            });\n        });\n    },\n\n\n    /**\n     * serializeForm\n     * @description serialize un formulaire en un tableau clé - valeur\n     * @param {string} form selecteur css pour cibler le formulaire a serializer\n     */\n    serializeForm: function serializeForm(form) {\n        var champAttr = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'name';\n\n        var formData = {};\n        $(form).find('.form-control').each(function (key, input) {\n            var champ = $(input).attr(champAttr);\n            var valeur = $(input).val();\n            formData[champ] = valeur;\n        });\n        return formData;\n    },\n\n\n    /**\n     * ajaxError\n     * @description affiche un message d'erreur en cas d'echec q'un appel ajax\n     * @param {object} error \n     */\n    ajaxError: function ajaxError(error) {\n        console.log(error);\n    },\n\n\n    /**\n     * getCurrentPage\n     * @description recupere la page courante dans l'url\n     */\n    getCurrentPage: function getCurrentPage() {\n        var CheminComplet = document.location.href;\n        var hash = CheminComplet.substring(CheminComplet.lastIndexOf(\"/\") + 1);\n\n        return hash;\n    }\n};\n\nmodule.exports = app;\n\n//# sourceURL=webpack:///./public/assets/src/js/components/app.js?");

/***/ }),

/***/ "./public/assets/src/js/components/panier.js":
/*!***************************************************!*\
  !*** ./public/assets/src/js/components/panier.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar app = __webpack_require__(/*! ./app */ \"./public/assets/src/js/components/app.js\");\nvar alerte = __webpack_require__(/*! ./alerte */ \"./public/assets/src/js/components/alerte.js\");\n\n/**\n * permet d'intéragir avec le panier et sa modal\n * \n * @author Julien Lachaux\n */\nvar panier = {\n    /**\n     * ============\n     * CONSTANTES *\n     * ============\n     * \n     * constantes de ciblage des elements du dom\n     * \n     * @property MODALS_CONTAINER   - container des modals\n     * @property DOM_ELEMENT        - panier\n     */\n    MODALS_CONTAINER: 'section.modals',\n    DOM_ELEMENT: 'div#panier',\n\n    /**\n     * constantes de messages d'erreurs\n     * \n     * @property {object}   ERRORS_MESSAGES             - tableau de message d'erreurs\n     * @property {string}   ERRORS_MESSAGES.DEFAULT     - message d'erreur par defaut\n     */\n    ERRORS_MESSAGES: {\n        DEFAULT: 'Une erreur s\\'est produite !'\n    },\n\n    /**\n     * constantes de messages de succes\n     * \n     * @property {object}   SUCCESS_MESSAGES                    - tableau de message de succes\n     * @property {string}   SUCCESS_MESSAGES.ADD_ARTICLE        - message de succes de l'ajout d'un article dans le panier\n     * @property {string}   SUCCESS_MESSAGES.REMOVE_ARTICLE     - message de succes de la suppression d'un article dans le panier\n     */\n    SUCCESS_MESSAGES: {\n        ADD_ARTICLE: 'Article ajouté au panier =)',\n        REMOVE_ARTICLE: 'Article supprimé du panier'\n    },\n\n    /**\n     * @name activePanier\n     * @description active le système de panier\n     */\n    activePanier: function activePanier() {\n        var _this = this;\n\n        // activation bouton ajout article dans le panier\n        $('button.ajoutPanier').each(function (index, element) {\n            element = $(element);\n            element.click(function (e) {\n                e = $(e.target);\n                panier.addArticle(e.attr('id'));\n            });\n        });\n\n        // activation du boutons panier + recupération de la size du panier\n        this.getSizePanier();\n        $('button.panierBtn').click(function (e) {\n            _this.getPanier();\n        });\n    },\n\n\n    /**\n     * @name getPanier\n     * @description ouvre la modal de panier\n     */\n    getPanier: function getPanier() {\n        var _this2 = this;\n\n        app.get('/widgets/getPanier', function (response) {\n            $(_this2.MODALS_CONTAINER).append(response);\n            $(_this2.DOM_ELEMENT).modal('show');\n\n            _this2.activerRemovePanier();\n            _this2.activerRemoveArticle();\n        });\n    },\n\n\n    /**\n     * @name getSizePanier\n     * @description met à jour la taille du panier dans la navbar\n     */\n    getSizePanier: function getSizePanier() {\n        app.get('/widgets/getSizePanier', function (response) {\n            response = JSON.parse(response);\n            $('span.panierSize').html(response.panier.size);\n        });\n    },\n\n\n    /**\n     * @name getTotalPrice\n     * @description met à jour le prix total du panier /!\\ ( en euros ) /!\\\n     */\n    getTotalPrice: function getTotalPrice() {\n        app.get('/widgets/getTotalPrice', function (response) {\n            response = JSON.parse(response);\n            $('span.total').html(response.panier.total);\n        });\n    },\n\n\n    /**\n     * @name activerRemovePanier\n     * @description active les boutons de sortie de la modal panier\n     */\n    activerRemovePanier: function activerRemovePanier() {\n        var _this3 = this;\n\n        $(this.DOM_ELEMENT).on('hidden.bs.modal', function (e) {\n            _this3.removePanier();\n        });\n\n        $('.removePanier').each(function (index, element) {\n            element = $(element);\n            element.click(function (e) {\n                panier.removePanier();\n            });\n        });\n    },\n\n\n    /**\n     * @name removePanier\n     * @description supprime la modal panier\n     */\n    removePanier: function removePanier() {\n        $(this.DOM_ELEMENT).remove();\n    },\n\n\n    /**\n     * @name addArticle\n     * @description ajoute un article au panier\n     * \n     * @param {number} id \n     */\n    addArticle: function addArticle(id) {\n        var _this4 = this;\n\n        app.get('/widgets/addArticle/' + id, function (response) {\n            response = JSON.parse(response);\n\n            if (response.success) {\n                alerte.success(_this4.SUCCESS_MESSAGES.ADD_ARTICLE);\n                _this4.getSizePanier();\n                _this4.getTotalPrice();\n            } else {\n                alerte.error(_this4.ERRORS_MESSAGES.DEFAULT);\n            }\n        });\n    },\n\n\n    /**\n     * @name activerRemoveArticle\n     * @description active les boutons de suppression de l'article du panier\n     */\n    activerRemoveArticle: function activerRemoveArticle() {\n        var _this5 = this;\n\n        $('.removeArticle').each(function (index, element) {\n            element = $(element);\n            element.click(function (e) {\n                e = $(e.target);\n                _this5.removeArticle(e.attr('data-id'));\n            });\n        });\n    },\n\n\n    /**\n     * @name removeArticle\n     * @description supprime un article du panier\n     * \n     * @param {number} id \n     */\n    removeArticle: function removeArticle(id) {\n        var _this6 = this;\n\n        app.get('/widgets/removeArticle/' + id, function (response) {\n            response = JSON.parse(response);\n\n            if (response.success) {\n                alerte.success(_this6.SUCCESS_MESSAGES.REMOVE_ARTICLE);\n                $('[data-ligne=\"' + id + '\"]').remove();\n                _this6.getSizePanier();\n                _this6.getTotalPrice();\n            } else {\n                alerte.error(_this6.ERRORS_MESSAGES.DEFAULT);\n            }\n        });\n    }\n};\nmodule.exports = panier;\n\n//# sourceURL=webpack:///./public/assets/src/js/components/panier.js?");

/***/ }),

/***/ "./public/assets/src/js/index.js":
/*!***************************************!*\
  !*** ./public/assets/src/js/index.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar app = __webpack_require__(/*! ./components/app */ \"./public/assets/src/js/components/app.js\");\nvar panier = __webpack_require__(/*! ./components/panier */ \"./public/assets/src/js/components/panier.js\");\nvar alerte = __webpack_require__(/*! ./components/alerte */ \"./public/assets/src/js/components/alerte.js\");\n\nvar currentPage = app.getCurrentPage();\nvar endpoint = '';\n\nswitch (currentPage) {\n    case 'configuration':\n        endpoint = '/widgets/get_' + currentPage + '/420';\n        break;\n\n    default:\n        endpoint = '/widgets/get_' + currentPage;\n        break;\n}\napp.get(endpoint, function (response) {\n    $('.content').html(response);\n    if (currentPage !== 'login' && currentPage !== 'register') {\n        panier.activePanier();\n        $('.carousel').each(function (i, carousel) {\n            $(carousel).carousel({\n                interval: false,\n                ride: false\n            });\n        });\n        app.activeAjaxLink(function (response) {\n            console.log(response);\n            if (response.success) {\n                alerte.success(response.message);\n            } else {\n                alerte.error(response.message);\n            }\n        });\n    }\n    if (currentPage === 'configuration') {\n        $('#configForm').submit(function (e) {\n            var payload = app.serializeForm('#configForm', 'id');\n            console.log(payload.id);\n            app.post('/widgets/update_configuration/' + payload.id, payload, function (response2) {\n                if (response2.success) {\n                    alerte.success('Configuration mis à jour avec succès !');\n                } else {\n                    alerte.error('Echec de la mise à jour de la configuration !');\n                }\n            });\n            e.preventDefault();\n        });\n    }\n});\n\n//# sourceURL=webpack:///./public/assets/src/js/index.js?");

/***/ })

/******/ });