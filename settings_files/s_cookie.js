// ==ClosureCompiler==
// @compilation_level SIMPLE_OPTIMIZATIONS
// @warning_level VERBOSE
// @jscomp_warning missingProperties
// @output_file_name s_cookie.min.js
// @check_types
// ==/ClosureCompiler==

/**
 * Mail.Ru S-cookie parser plugin
 * Copyright (c) 2012 Mail.Ru
 */
(function(global) {

/**
 * @private
 * @param {string} field Field name in 'S' cookie
 * @param {(string|*)=} value if value === null - remove cookie field, if value === undefined - get field value
 * @return {(string|undefined|*)}
 */
function S_cookie_set_get_remove(field, value) {
	var cookie = global.m$portal.cookie,
		currentCookie
	  , currentCookieValue
	  , d = ".mail.ru"//window.location.hostname
	  , p = "/"
	  , RE_cookieField_find = new RegExp("(^|\\|)(" + field + "=)(.*?)(\\||$)")
	;

	if (field) {
		currentCookie = cookie("s") || '';
		currentCookieValue = (currentCookie.match(RE_cookieField_find) || [])[3];

		if(value !== void 0) {
			// Write
			cookie(
				"s",
				currentCookieValue || value === null ?
					currentCookie.replace(RE_cookieField_find,
						value === null ?
							function() {return arguments[6].indexOf(arguments[0]) === 0 ? '' : arguments[4];} : //remove field
							"$1$2" + value + "$4"				//rewrite field
					)
					:
					(currentCookie ?
						currentCookie + "|" :
						"") +
					field + "=" + value,
				{
					domain : d,//".mail.ru" most of the time
					expires : 365,
					path : p
				}
			);
		}
		else {
			// Read
			value = currentCookieValue;
		}

		// Return
		return value;
	}
	return;
}

/**
 * @const
 * @enum(string)
 */
var PROJECTS_MAP = {
	"splash" : "s",	//Главная
	"news" : "n",	//Новости
	"afisha" : "a",	//Афиша
	"auto" : "av",	//Авто
	"lady" : "l",	//Леди
	"horo" : "h",	//Гороскопы
	"pogoda" : "p",	//Погода
	"mail" : "m",	//Почта
	"promail" : "pm",//Про-почта
	"blogs" : "b",	//Блоги
	"foto" : "f",	//Фото
	"video" : "v",	//Видео
	"my" : "my",	//Мой мир
	"agent" : "ag",	//Агент
	"torg" : "t",	//Торг
	"love" : "lv",	//Знакомства
	"game" : "g",	//Игры
	"hi-tech" : "ht",//Hi-tech
	"maps" : "map"	//Карты
};

var instance;

function S_Cookie(projectName) {
	if(!instance) {
		projectName = PROJECTS_MAP[projectName];

		instance = new /** @constructor */function() {
			function _throw_noProject_Error() {
				throw new Error("project must be set");
			}

			function _throw_noValue_Error() {
				throw new Error("need value");
			}

			function _getLocal(fieldName) {
				if(!projectName)_throw_noProject_Error();

				return S_cookie_set_get_remove(projectName + "_" + fieldName);
			}
			this["getLocal"] = _getLocal;

			this["setLocal"] = function(fieldName, fieldValue) {
				if(!projectName)_throw_noProject_Error();
				if(fieldValue == void 0)_throw_noValue_Error();

				S_cookie_set_get_remove(projectName + "_" + fieldName, fieldValue);

				return _getLocal(fieldName);
			};

			this["removeLocal"] = function(fieldName) {
				if(!projectName)_throw_noProject_Error();

				var result = _getLocal(fieldName);

				S_cookie_set_get_remove(projectName + "_" + fieldName, null);

				return result;
			};

			function _getGlobal(fieldName) {
				return S_cookie_set_get_remove(fieldName);
			}
			this["getGlobal"] = _getGlobal;

			this["setGlobal"] = function(fieldName, fieldValue) {
				if(fieldValue == void 0)_throw_noValue_Error();

				S_cookie_set_get_remove(fieldName, fieldValue);

				return _getGlobal(fieldName);
			};

			this["removeGlobal"] = function(fieldName) {
				var result = _getGlobal(fieldName);

				S_cookie_set_get_remove(fieldName, null);

				return result;
			};
		};
	}

	return instance;
}

//export
var mail_global_namespace = global["m$portal"];
if(!mail_global_namespace)mail_global_namespace = global["m$portal"] = {};

mail_global_namespace["S_Cookie"] = S_Cookie;


})(window);
