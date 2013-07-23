/* 2013-07-16 19:50:42 */


// data/ru/images/js/ru/build/core.js start

// @build
// @build-minify
// @deploy-wait-for: http://js.imgsmail.ru/u/js/ru/build/core.js

if( typeof window.mailru !== 'object' ){
	// Create global namespace
	window.mailru = { ui: {} };
}


// ./data/common/js/ajs/Array.js start

/**
 * @author				Egor Halimonenko <termi1uc1@gmail.com>
 * @compatibility		JavaScript 1.5+
 * http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Global_Objects:Array
 * Polyfills from https://github.com/termi/ES5-DOM-SHIM
 */

void function(){

"use strict";

var NEED_PREPARE_STRING = (function(strObj) {
		// Check failure of by-index access of string characters (IE < 9)
		// and failure of `0 in strObj` (Rhino)
		return strObj[0] != "a" || !(0 in strObj);
	})(Object("a"))

	/**
	 * @const
	 * @param {Object} obj
	 */
	, _toObject = function(obj) {
		if (obj == null) // this matches both null and undefined
			throw new TypeError("Not an object");

		// If the implementation doesn't support by-index access of
		// string characters (ex. IE < 9), split the string
		if (NEED_PREPARE_STRING && typeof obj == "string" && obj)
			return String.prototype.split.call(obj, "");

		return Object(obj);
	}

	/** @const */
	, _Function_apply_ = Function.prototype.apply
	/** @const */
	, _Array_slice_ = Array.prototype.slice

	/**
	 * Call _function
	 * @const
	 * @param {Function} _function function to call
	 * @param {*} context
	 * @param {...} var_args
	 * @return {*} mixed
	 * @version 2
	 */
	, _call_function = function(_function, context, var_args) {
		// If no callback function or if callback is not a callable function
		// it will throw TypeError
		return _Function_apply_.call(_function, context, _Array_slice_.call(arguments, 2))
	}

	, _Array_indexOf_ = Array.prototype.indexOf

	, _Array_lastIndexOf_ = Array.prototype.lastIndexOf

	, _Array_forEach_ = Array.prototype.forEach

	, _Array_every_ = Array.prototype.every

	, _Array_some_ = Array.prototype.some

	, _Array_filter_ = Array.prototype.filter

	, _Array_map_ = Array.prototype.map

	, _Array_reduce_ = Array.prototype.reduce

	, _Array_reduceRight_ = Array.prototype.reduceRight

	, _Array_contains_ = Array.prototype["contains"]

	, array_some_or_every
;

/**
 * Array.prototype.indexOf
 * ES5 15.4.4.14
 * http://es5.github.com/#x15.4.4.14
 * https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/indexOf
 *
 * https://gist.github.com/1034425
 *
 * Returns the first index at which a given element can be found in the array, or -1 if it is not present.
 *
 * @param {Object} array
 * @param {*} searchElement Element to locate in the array.
 * @param {number} fromIndex The index at which to begin the search. Defaults to 0, i.e. the whole array will be searched. If the index is greater than or equal to the length of the array, -1 is returned, i.e. the array will not be searched. If negative, it is taken as the offset from the end of the array. Note that even when the index is negative, the array is still searched from front to back. If the calculated index is less than 0, the whole array will be searched.
 * @return {number}
 */
if(!Array["indexOf"]) {
	Array["indexOf"] = _Array_indexOf_ ?
		function(array, searchElement, fromIndex) {
			return _Array_indexOf_.apply(array, _Array_slice_.call(arguments, 1));
		}
		:
		function(array, searchElement, fromIndex) {
			var thisArray = _toObject(array)
				, length = thisArray.length >>> 0
			;

			if(!length || (fromIndex = ~~fromIndex) >= length)return -1;

			for (
				// initialize counter (allow for negative startIndex)
				fromIndex = (length + fromIndex) % length ;
				// loop if index is smaller than length,
				// index is set in (possibly sparse) array
				// and item at index is not identical to the searched one
				fromIndex < length && (!(fromIndex in thisArray) || thisArray[fromIndex] !== searchElement) ;
				// increment counter
				fromIndex++
				){}

			// if counter equals length (not found), return -1, otherwise counter
			return fromIndex ^ length ? fromIndex : -1;
		}
	;
}

/**
 * Array.prototype.lastIndexOf
 * ES5 15.4.4.15
 * http://es5.github.com/#x15.4.4.15
 * https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/lastIndexOf
 * Returns the last index at which a given element can be found in the array, or -1 if it is not present. The array is searched backwards, starting at fromIndex.
 * @param {Object} array
 * @param {*} searchElement Element to locate in the array.
 * @param {number} fromIndex The index at which to start searching backwards. Defaults to the array's length, i.e. the whole array will be searched. If the index is greater than or equal to the length of the array, the whole array will be searched. If negative, it is taken as the offset from the end of the array. Note that even when the index is negative, the array is still searched from back to front. If the calculated index is less than 0, -1 is returned, i.e. the array will not be searched.
 * @return {number}
 */
if(!Array["lastIndexOf"]) {
	Array["lastIndexOf"] = _Array_lastIndexOf_ ?
		function(array, searchElement, fromIndex) {
			return _Array_lastIndexOf_.apply(array, _Array_slice_.call(arguments, 1));
		}
		:
		function(array, searchElement, fromIndex) {
			var thisArray = _toObject(array)
				, length = thisArray.length >>> 0
				, i
			;

			if(!length)return -1;

			i = length - 1;
			if(fromIndex !== void 0)i = Math.min(i, +fromIndex);

			// handle negative indices
			i = i >= 0 ? i : length - Math.abs(i);

			for (; i >= 0; i--) {
				if (i in thisArray && thisArray[i] === searchElement) {
					return i;
				}
			}
			return -1;
		}
	;
}

/**
 * Array.prototype.forEach
 * ES5 15.4.4.18
 * http://es5.github.com/#x15.4.4.18
 * https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/array/forEach
 * Executes a provided function once per array element.
 * @param {Object} array
 * @param {Function} iterator Function to execute for each element.
 * @param {Object} context Object to use as this when executing callback.
 */
if(!Array["forEach"]) {
	Array["forEach"] = _Array_forEach_ ?
		function(array, iterator, context) {
			return _Array_forEach_.apply(array, _Array_slice_.call(arguments, 1));
		}
		:
		function(array, iterator, context) {
			var thisArray = _toObject(array)
				, length = thisArray.length >>> 0
				, i = -1
			;

			while (++i < length) {
				if (i in thisArray) {
					_call_function(iterator, context, thisArray[i], i, thisArray);
				}
			}
		}
	;
}

array_some_or_every = _Array_every_ ?
	null
	:
	function(array, callback, thisObject, _option_isAll) {
		if(_option_isAll === void 0)_option_isAll = true;//Default value = true

		var result = _option_isAll;

		Array["forEach"](array, function(value, index) {
			if(result == _option_isAll) {
				result = !!_call_function(callback, thisObject, value, index, this);
			}
		}, array);

		return result;
	}
;

/**
 * Array.prototype.every
 * ES5 15.4.4.16
 * http://es5.github.com/#x15.4.4.16
 * https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/every
 * Tests whether all elements in the array pass the test implemented by the provided function.
 * @param {Object} array
 * @param {Function} callback Function to test for each element.
 * @param {Object=} thisObject Object to use as this when executing callback.
 * @return {boolean}
 */
if(!Array["every"]) {
	Array["every"] = _Array_every_ ?
		function(array, callback, thisObject) {
			return _Array_every_.apply(array, _Array_slice_.call(arguments, 1));
		}
		:
		function(array, callback, thisObject) {
			return array_some_or_every(array, callback, thisObject);
		}
	;
}
/**
 * Array.prototype.some
 * ES5 15.4.4.17
 * http://es5.github.com/#x15.4.4.17
 * https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/some
 * Tests whether some element in the array passes the test implemented by the provided function.
 * @param {Function} callback Function to test for each element.
 * @param {Object=} thisObject Object to use as this when executing callback.
 * @return {boolean}
 */
if(!Array["some"]) {
	Array["some"] = _Array_some_ ?
		function(array, callback, thisObject) {
			return _Array_some_.apply(array, _Array_slice_.call(arguments, 1));
		}
		:
		function(array, callback, thisObject) {
			return array_some_or_every(array, callback, thisObject, false);
		}
	;
}

/**
 * Array.prototype.filter
 * http://es5.github.com/#x15.4.4.17
 * https://developer.mozilla.org/en/JavaScript/Reference/global_Objects/Array/filter
 * Creates a new array with all elements that pass the test implemented by the provided function.
 * @param {Function} callback Function to test each element of the array.
 * @param {Object=} thisObject Object to use as this when executing callback.
 * @return {boolean}
 */
if(!Array["filter"]) {
	Array["filter"] = _Array_filter_ ?
		function(array, callback, thisObject) {
			return _Array_filter_.apply(array, _Array_slice_.call(arguments, 1));
		}
		:
		function(array, callback, thisObject) {
			var thisArray = _toObject(array)
				, len = thisArray.length >>> 0
				, result = []
				, val
			;

			for (var i = 0; i < len; i++)
				if (i in thisArray) {
					val = thisArray[i];// in case callback mutates this
					if(_call_function(callback, thisObject, val, i, thisArray))result.push(val);
				}

			return result;
		}
	;
}
/**
 * Array.prototype.map
 * http://es5.github.com/#x15.4.4.19
 * https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/map
 * Creates a new array with the results of calling a provided function on every element in this array.
 * @param {Function} callback Function that produces an element of the new Array from an element of the current one.
 * @param {Object?} thisArg Object to use as this when executing callback.
 * @return {Array}
 */
if(!Array["map"]) {
	Array["map"] = _Array_map_ ?
		function(array, callback, thisArg) {
			return _Array_map_.apply(array, _Array_slice_.call(arguments, 1));
		}
		:
		function(array, callback, thisArg) {
			var thisArray = _toObject(array)
				, len = thisArray.length >>> 0
				, result = []
			;

			for (var i = 0; i < len; i++)
				if (i in thisArray) {
					result[i] = _call_function(callback, thisArg, thisArray[i], i, this);
				}

			return result;
		}
	;
}

/**
 * Array.prototype.reduce
 * https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/Reduce
 *
 * Apply a function against an accumulator and each value of the array (from left-to-right) as to reduce it to a single value.
 * @param {Object} array
 * @param {Function} accumulator Function to execute on each value in the array, taking four arguments:
 *	previousValue The value previously returned in the last invocation of the callback, or initialValue, if supplied. (See below.)
 *	currentValue The current element being processed in the array.
 *	index The index of the current element being processed in the array.
 *	array The array reduce was called upon.
 * @param {*=} initialValue Object to use as the first argument to the first call of the callback.
 * @return {*} single value
 */
if(!Array["reduce"]) {
	Array["reduce"] = _Array_reduce_ ?
		function(array, accumulator, initialValue) {
			return _Array_reduce_.apply(array, _Array_slice_.call(arguments, 1));
		}
		:
		function(array, accumulator, initialValue) {
			var thisArray = _toObject(array)
				, l = thisArray.length >>> 0
				, i = 0
			;

			if(l === 0 && arguments.length <= 1) {// == on purpose to test 0 and false.// no value to return if no initial value, empty array
				throw new TypeError("Array length is 0 and no second argument");
			}

			if(initialValue === void 0) {
				initialValue = (++i, thisArray[0]);
			}

			for( ; i < l ; ++i ) {
				if(i in thisArray) {
					initialValue = accumulator.call(void 0, initialValue, thisArray[i], i, thisArray);
				}
			}

			return initialValue;
		}
	;
}

/**
 * Array.prototype.reduceRight
 * https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/reduceRight
 *
 Apply a function simultaneously against two values of the array (from right-to-left) as to reduce it to a single value.
 reduceRight executes the callback function once for each element present in the array, excluding holes in the array, receiving four arguments: the initial value (or value from the previous callback call), the value of the current element, the current index, and the array over which iteration is occurring.

 The call to the reduceRight callback would look something like this:
 array.reduceRight(function(previousValue, currentValue, index, array) {
 // ...
 });

 The first time the function is called, the previousValue and currentValue can be one of two values. If an initialValue was provided in the call to reduceRight, then previousValue will be equal to initialValue and currentValue will be equal to the last value in the array. If no initialValue was provided, then previousValue will be equal to the last value in the array and currentValue will be equal to the second-to-last value.

 * @param {Object} array
 * @param {Function} accumulator Function to execute on each value in the array.
 * @param {*=} initialValue Object to use as the first argument to the first call of the callback.
 */
if(!Array["reduceRight"]) {
	Array["reduceRight"] = _Array_reduceRight_ ?
		function(array, accumulator, initialValue) {
			return _Array_reduceRight_.apply(array, _Array_slice_.call(arguments, 1));
		}
		:
		function(array, accumulator, initialValue) {
			var thisArray = _toObject(array)
				, l = thisArray.length >>> 0
			;

			if(l === 0 && arguments.length <= 1) {// == on purpose to test 0 and false.// no value to return if no initial value, empty array
				throw new TypeError("Array length is 0 and no second argument");
			}

			--l;
			if(initialValue === void 0) {
				initialValue = (--l, thisArray[l + 1]);
			}

			for( ; l >= 0 ; --l) {
				if(l in thisArray) {
					initialValue = _call_function(accumulator, void 0, initialValue, thisArray[l], l, thisArray);
				}
			}

			return initialValue;
		}
	;
}

if(!Array["contains"]) {
	Array["contains"] = _Array_contains_ ?
		function(array, item) {
			return _Array_contains_.call(array, item);
		}
		:
		function(array, item) {
			return !!~Array["indexOf"](array, item);
		}
	;
}

// ------------------=================== Non-standard ===================------------------

/**
 * Функция возвращающая пересечение множеств (в качестве множества выступает массив).
 * Это нестандартная функция и ее реализация не полифил.
 * В функцию можно передать произвольное количество аргументов — мы рекурсивно строим пересечение попарно по первым двум
 * @param {Array} left
 * @param {...Array=} var_args
*/
if(!Array["intersect"]) {
	Array["intersect"] = function(left, var_args) {
		var rights = Array.prototype.slice.call(arguments, 1)
			, intersection
			, right
			, leftLength
			, rightLength
			, i
			, j
		;

		// пересечение имеет смысл строить только если слева не пустое множество
		// и справа есть множества...
		if(left.length && rights.length) {
			intersection = [];
			right = rights[0];

			// ... первое из которых не пусто
			if(right.length) {
				leftLength = left.length;
				rightLength = right.length;
				i = 0;

				while( i < leftLength ) {
					j = 0;

					while( j < rightLength ) {
						if( left[i] == right[j] ) {
							intersection.push(left[i]);
						}

						j++;
					}

					i++;
				}

				// рекурсивное пересечение с остальными множествами
				return Array["intersect"].apply( null, [intersection].concat( rights.slice( 1 ) ) );

			}
			else {
				return [];
			}

		}
		else {
			return left;
		}
	}
}

/**
 * Функция добавляющая переданные элементы в конец массива. Аргументы работают аналогично функции [].concat
 * Это нестандартная функция и ее реализация не полифил.
 * От Array.prototype.concat отличается тем, что изменяет первый массив, и не создает новый
 * От Array.prototype.push отличается тем, что может получать на вход как массивы так и элементы
 * @param {Array} array
 * @param {...{Array|*}} var_args
 * @return {Array} array
*/
if(!Array["append"]) {
	Array["append"] = function(array, var_args) {
		if( arguments.length > 2 ) {
			var_args = array.concat.apply([], _Array_slice_.call(arguments, 1));
		}
		array.push.apply(array, var_args);
		return array;
	}
}

/**
 * Функция добавляющая переданные элементы в начало массива. Аргументы работают аналогично функции [].concat
 * Это нестандартная функция и ее реализация не полифил.
 * От Array.prototype.unshift отличается тем, что может получать на вход как массивы так и элементы
 * @param {Array} array
 * @param {...{Array|*}} var_args
 * @return {Array} array
*/
if(!Array["prepend"]) {
	Array["prepend"] = function(array, var_args) {
		if( arguments.length > 2 ) {
			var_args = array.concat.apply([], _Array_slice_.call(arguments, 1));
		}
		array.unshift.apply(array, var_args);
		return array;
	}
}

/**
 * Функция возвращающая уникальные элементы в массиве
 * Это нестандартная функция и ее реализация не полифил.
 *
 * Чтобы функция быстро работала со списками объектов нужно
 * предварительно разметить объекты уникальными идентификаторами,
 * используя свойство __uniqueId объекта
 *
 * @param {Array} array
 * @return {Array} array with unique items
*/
Array["unique"] = function(array) {
	var result = []
		, used = {}
		, item
		, i = 0
		, l = array.length
		, itemKey
	;

	for( ; i < l ; ++i ) if( i in array ) {
		item = array[i];

		if( typeof item === "object" ) {
			// чтобы быстро искать уникальные значения среди объектов,
			// эти объекты нужно предварительно разметить уникальными идентификаторами

			if( (itemKey = item["__uniqueId"]) === void 0 ) { // У объекта нету свойства __uniqueId - быстрый поиск не возможен - используем indexOf
				if( Array["indexOf"](array, item, i + 1) < 0 ) {
					result.push(item);
				}
				continue;
			}
		}
		else {
			itemKey = item;
		}

		if(used[itemKey] !== void 0) {
			continue;
		}

		used[itemKey] = null;
		result.push(item);
	}

	return result;
};
Array["uniq"] = Array["unique"];//alias

/**
 * Функция удаляет элементы массива в диапазане от start до start + count, включительно.
 * end можно не указывать, тогда удалится только элемент под индексом start
 * Это нестандартная функция и ее реализация не полифил.
 * @param {Array} array
 * @param {number} start
 * @param {number=} count По-умолчанию 1
 * @return {Array} array вернёт изменённый массив
 */
if(!Array["removeAt"]) {
	Array["removeAt"] = function(array, start, count) {
		if( start >= 0 ) {
			array.splice(start, count === void 0 ? 1 : count | 0);
		}

		return array;
	};
}
/**
 * Функция находит и удаляет переданные элементы массива
 * Это нестандартная функция и ее реализация не полифил.
 * @param {Array} array
 * @param {...*} var_args
 * @return {Array} array вернёт изменённый массив
 */
if(!Array["remove"]) {
	Array["remove"] = function(array, var_args) {
		var length = arguments.length
			, index
		;

		while( --length ) {
			while( (index = Array["indexOf"](array, arguments[length])) != -1 ) {
				array.splice(index, 1);
			}
		}

		return array;
	};
}



// LEGACY | TODO: выпилить
Array["search"] = function (er, fn, ctx){
	for( var i = 0, n = er.length; i < n; i++ )
		if( fn.apply(ctx, [er[i], i]) )
			return i;
	return -1;
};

}();

// ./data/common/js/ajs/Array.js end

// data/ru/images/js/ru/jsCore/jquery/jquery.js start

/*!
 * jQuery JavaScript Library v1.5.1
 * http://jquery.com/
 *
 * Copyright 2011, John Resig
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 * Copyright 2011, The Dojo Foundation
 * Released under the MIT, BSD, and GPL Licenses.
 *
 * Date: Wed Feb 23 13:55:29 2011 -0500
 */
(function(a,b){function cg(a){return d.isWindow(a)?a:a.nodeType===9?a.defaultView||a.parentWindow:!1}function cd(a){if(!bZ[a]){var b=d("<"+a+">").appendTo("body"),c=b.css("display");b.remove();if(c==="none"||c==="")c="block";bZ[a]=c}return bZ[a]}function cc(a,b){var c={};d.each(cb.concat.apply([],cb.slice(0,b)),function(){c[this]=a});return c}function bY(){try{return new a.ActiveXObject("Microsoft.XMLHTTP")}catch(b){}}function bX(){try{return new a.XMLHttpRequest}catch(b){}}function bW(){d(a).unload(function(){for(var a in bU)bU[a](0,1)})}function bQ(a,c){a.dataFilter&&(c=a.dataFilter(c,a.dataType));var e=a.dataTypes,f={},g,h,i=e.length,j,k=e[0],l,m,n,o,p;for(g=1;g<i;g++){if(g===1)for(h in a.converters)typeof h==="string"&&(f[h.toLowerCase()]=a.converters[h]);l=k,k=e[g];if(k==="*")k=l;else if(l!=="*"&&l!==k){m=l+" "+k,n=f[m]||f["* "+k];if(!n){p=b;for(o in f){j=o.split(" ");if(j[0]===l||j[0]==="*"){p=f[j[1]+" "+k];if(p){o=f[o],o===!0?n=p:p===!0&&(n=o);break}}}}!n&&!p&&d.error("No conversion from "+m.replace(" "," to ")),n!==!0&&(c=n?n(c):p(o(c)))}}return c}function bP(a,c,d){var e=a.contents,f=a.dataTypes,g=a.responseFields,h,i,j,k;for(i in g)i in d&&(c[g[i]]=d[i]);while(f[0]==="*")f.shift(),h===b&&(h=a.mimeType||c.getResponseHeader("content-type"));if(h)for(i in e)if(e[i]&&e[i].test(h)){f.unshift(i);break}if(f[0]in d)j=f[0];else{for(i in d){if(!f[0]||a.converters[i+" "+f[0]]){j=i;break}k||(k=i)}j=j||k}if(j){j!==f[0]&&f.unshift(j);return d[j]}}function bO(a,b,c,e){if(d.isArray(b)&&b.length)d.each(b,function(b,f){c||bq.test(a)?e(a,f):bO(a+"["+(typeof f==="object"||d.isArray(f)?b:"")+"]",f,c,e)});else if(c||b==null||typeof b!=="object")e(a,b);else if(d.isArray(b)||d.isEmptyObject(b))e(a,"");else for(var f in b)bO(a+"["+f+"]",b[f],c,e)}function bN(a,c,d,e,f,g){f=f||c.dataTypes[0],g=g||{},g[f]=!0;var h=a[f],i=0,j=h?h.length:0,k=a===bH,l;for(;i<j&&(k||!l);i++)l=h[i](c,d,e),typeof l==="string"&&(!k||g[l]?l=b:(c.dataTypes.unshift(l),l=bN(a,c,d,e,l,g)));(k||!l)&&!g["*"]&&(l=bN(a,c,d,e,"*",g));return l}function bM(a){return function(b,c){typeof b!=="string"&&(c=b,b="*");if(d.isFunction(c)){var e=b.toLowerCase().split(bB),f=0,g=e.length,h,i,j;for(;f<g;f++)h=e[f],j=/^\+/.test(h),j&&(h=h.substr(1)||"*"),i=a[h]=a[h]||[],i[j?"unshift":"push"](c)}}}function bo(a,b,c){var e=b==="width"?bi:bj,f=b==="width"?a.offsetWidth:a.offsetHeight;if(c==="border")return f;d.each(e,function(){c||(f-=parseFloat(d.css(a,"padding"+this))||0),c==="margin"?f+=parseFloat(d.css(a,"margin"+this))||0:f-=parseFloat(d.css(a,"border"+this+"Width"))||0});return f}function ba(a,b){b.src?d.ajax({url:b.src,async:!1,dataType:"script"}):d.globalEval((b.text||b.textContent||b.innerHTML||"").replace(/^\s*<!(?:\[CDATA\[|\-\-)/,"/*$0*/")),b.parentNode&&b.parentNode.removeChild(b)}function _(a){return"getElementsByTagName"in a?a.getElementsByTagName("*"):"querySelectorAll"in a?a.querySelectorAll("*"):[]}function $(a,b){if(b.nodeType===1){var c=b.nodeName.toLowerCase();b.clearAttributes(),b.mergeAttributes(a);if(c==="object")b.outerHTML=a.outerHTML;else if(c!=="input"||a.type!=="checkbox"&&a.type!=="radio"){if(c==="option")b.selected=a.defaultSelected;else if(c==="input"||c==="textarea")b.defaultValue=a.defaultValue}else a.checked&&(b.defaultChecked=b.checked=a.checked),b.value!==a.value&&(b.value=a.value);b.removeAttribute(d.expando)}}function Z(a,b){if(b.nodeType===1&&d.hasData(a)){var c=d.expando,e=d.data(a),f=d.data(b,e);if(e=e[c]){var g=e.events;f=f[c]=d.extend({},e);if(g){delete f.handle,f.events={};for(var h in g)for(var i=0,j=g[h].length;i<j;i++)d.event.add(b,h+(g[h][i].namespace?".":"")+g[h][i].namespace,g[h][i],g[h][i].data)}}}}function Y(a,b){return d.nodeName(a,"table")?a.getElementsByTagName("tbody")[0]||a.appendChild(a.ownerDocument.createElement("tbody")):a}function O(a,b,c){if(d.isFunction(b))return d.grep(a,function(a,d){var e=!!b.call(a,d,a);return e===c});if(b.nodeType)return d.grep(a,function(a,d){return a===b===c});if(typeof b==="string"){var e=d.grep(a,function(a){return a.nodeType===1});if(J.test(b))return d.filter(b,e,!c);b=d.filter(b,e)}return d.grep(a,function(a,e){return d.inArray(a,b)>=0===c})}function N(a){return!a||!a.parentNode||a.parentNode.nodeType===11}function F(a,b){return(a&&a!=="*"?a+".":"")+b.replace(r,"`").replace(s,"&")}function E(a){var b,c,e,f,g,h,i,j,k,l,m,n,o,q=[],r=[],s=d._data(this,"events");if(a.liveFired!==this&&s&&s.live&&!a.target.disabled&&(!a.button||a.type!=="click")){a.namespace&&(n=new RegExp("(^|\\.)"+a.namespace.split(".").join("\\.(?:.*\\.)?")+"(\\.|$)")),a.liveFired=this;var t=s.live.slice(0);for(i=0;i<t.length;i++)g=t[i],g.origType.replace(p,"")===a.type?r.push(g.selector):t.splice(i--,1);f=d(a.target).closest(r,a.currentTarget);for(j=0,k=f.length;j<k;j++){m=f[j];for(i=0;i<t.length;i++){g=t[i];if(m.selector===g.selector&&(!n||n.test(g.namespace))&&!m.elem.disabled){h=m.elem,e=null;if(g.preType==="mouseenter"||g.preType==="mouseleave")a.type=g.preType,e=d(a.relatedTarget).closest(g.selector)[0];(!e||e!==h)&&q.push({elem:h,handleObj:g,level:m.level})}}}for(j=0,k=q.length;j<k;j++){f=q[j];if(c&&f.level>c)break;a.currentTarget=f.elem,a.data=f.handleObj.data,a.handleObj=f.handleObj,o=f.handleObj.origHandler.apply(f.elem,arguments);if(o===!1||a.isPropagationStopped()){c=f.level,o===!1&&(b=!1);if(a.isImmediatePropagationStopped())break}}return b}}function C(a,c,e){var f=d.extend({},e[0]);f.type=a,f.originalEvent={},f.liveFired=b,d.event.handle.call(c,f),f.isDefaultPrevented()&&e[0].preventDefault()}function w(){return!0}function v(){return!1}function g(a){for(var b in a)if(b!=="toJSON")return!1;return!0}function f(a,c,f){if(f===b&&a.nodeType===1){f=a.getAttribute("data-"+c);if(typeof f==="string"){try{f=f==="true"?!0:f==="false"?!1:f==="null"?null:d.isNaN(f)?e.test(f)?d.parseJSON(f):f:parseFloat(f)}catch(g){}d.data(a,c,f)}else f=b}return f}var c=a.document,d=function(){function I(){if(!d.isReady){try{c.documentElement.doScroll("left")}catch(a){setTimeout(I,1);return}d.ready()}}var d=function(a,b){return new d.fn.init(a,b,g)},e=a.jQuery,f=a.$,g,h=/^(?:[^<]*(<[\w\W]+>)[^>]*$|#([\w\-]+)$)/,i=/\S/,j=/^\s+/,k=/\s+$/,l=/\d/,m=/^<(\w+)\s*\/?>(?:<\/\1>)?$/,n=/^[\],:{}\s]*$/,o=/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,p=/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,q=/(?:^|:|,)(?:\s*\[)+/g,r=/(webkit)[ \/]([\w.]+)/,s=/(opera)(?:.*version)?[ \/]([\w.]+)/,t=/(msie) ([\w.]+)/,u=/(mozilla)(?:.*? rv:([\w.]+))?/,v=navigator.userAgent,w,x=!1,y,z="then done fail isResolved isRejected promise".split(" "),A,B=Object.prototype.toString,C=Object.prototype.hasOwnProperty,D=Array.prototype.push,E=Array.prototype.slice,F=String.prototype.trim,G=Array.prototype.indexOf,H={};d.fn=d.prototype={constructor:d,init:function(a,e,f){var g,i,j,k;if(!a)return this;if(a.nodeType){this.context=this[0]=a,this.length=1;return this}if(a==="body"&&!e&&c.body){this.context=c,this[0]=c.body,this.selector="body",this.length=1;return this}if(typeof a==="string"){g=h.exec(a);if(!g||!g[1]&&e)return!e||e.jquery?(e||f).find(a):this.constructor(e).find(a);if(g[1]){e=e instanceof d?e[0]:e,k=e?e.ownerDocument||e:c,j=m.exec(a),j?d.isPlainObject(e)?(a=[c.createElement(j[1])],d.fn.attr.call(a,e,!0)):a=[k.createElement(j[1])]:(j=d.buildFragment([g[1]],[k]),a=(j.cacheable?d.clone(j.fragment):j.fragment).childNodes);return d.merge(this,a)}i=c.getElementById(g[2]);if(i&&i.parentNode){if(i.id!==g[2])return f.find(a);this.length=1,this[0]=i}this.context=c,this.selector=a;return this}if(d.isFunction(a))return f.ready(a);a.selector!==b&&(this.selector=a.selector,this.context=a.context);return d.makeArray(a,this)},selector:"",jquery:"1.5.1",length:0,size:function(){return this.length},toArray:function(){return E.call(this,0)},get:function(a){return a==null?this.toArray():a<0?this[this.length+a]:this[a]},pushStack:function(a,b,c){var e=this.constructor();d.isArray(a)?D.apply(e,a):d.merge(e,a),e.prevObject=this,e.context=this.context,b==="find"?e.selector=this.selector+(this.selector?" ":"")+c:b&&(e.selector=this.selector+"."+b+"("+c+")");return e},each:function(a,b){return d.each(this,a,b)},ready:function(a){d.bindReady(),y.done(a);return this},eq:function(a){return a===-1?this.slice(a):this.slice(a,+a+1)},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},slice:function(){return this.pushStack(E.apply(this,arguments),"slice",E.call(arguments).join(","))},map:function(a){return this.pushStack(d.map(this,function(b,c){return a.call(b,c,b)}))},end:function(){return this.prevObject||this.constructor(null)},push:D,sort:[].sort,splice:[].splice},d.fn.init.prototype=d.fn,d.extend=d.fn.extend=function(){var a,c,e,f,g,h,i=arguments[0]||{},j=1,k=arguments.length,l=!1;typeof i==="boolean"&&(l=i,i=arguments[1]||{},j=2),typeof i!=="object"&&!d.isFunction(i)&&(i={}),k===j&&(i=this,--j);for(;j<k;j++)if((a=arguments[j])!=null)for(c in a){e=i[c],f=a[c];if(i===f)continue;l&&f&&(d.isPlainObject(f)||(g=d.isArray(f)))?(g?(g=!1,h=e&&d.isArray(e)?e:[]):h=e&&d.isPlainObject(e)?e:{},i[c]=d.extend(l,h,f)):f!==b&&(i[c]=f)}return i},d.extend({noConflict:function(b){a.$=f,b&&(a.jQuery=e);return d},isReady:!1,readyWait:1,ready:function(a){a===!0&&d.readyWait--;if(!d.readyWait||a!==!0&&!d.isReady){if(!c.body)return setTimeout(d.ready,1);d.isReady=!0;if(a!==!0&&--d.readyWait>0)return;y.resolveWith(c,[d]),d.fn.trigger&&d(c).trigger("ready").unbind("ready")}},bindReady:function(){if(!x){x=!0;if(c.readyState==="complete")return setTimeout(d.ready,1);if(c.addEventListener)c.addEventListener("DOMContentLoaded",A,!1),a.addEventListener("load",d.ready,!1);else if(c.attachEvent){c.attachEvent("onreadystatechange",A),a.attachEvent("onload",d.ready);var b=!1;try{b=a.frameElement==null}catch(e){}c.documentElement.doScroll&&b&&I()}}},isFunction:function(a){return d.type(a)==="function"},isArray:Array.isArray||function(a){return d.type(a)==="array"},isWindow:function(a){return a&&typeof a==="object"&&"setInterval"in a},isNaN:function(a){return a==null||!l.test(a)||isNaN(a)},type:function(a){return a==null?String(a):H[B.call(a)]||"object"},isPlainObject:function(a){if(!a||d.type(a)!=="object"||a.nodeType||d.isWindow(a))return!1;if(a.constructor&&!C.call(a,"constructor")&&!C.call(a.constructor.prototype,"isPrototypeOf"))return!1;var c;for(c in a){}return c===b||C.call(a,c)},isEmptyObject:function(a){for(var b in a)return!1;return!0},error:function(a){throw a},parseJSON:function(b){if(typeof b!="string"||!b)return null;b=d.trim(b);if(a.JSON&&a.JSON.parse)return a.JSON.parse(b);if(n.test(b.replace(o,"@").replace(p,"]").replace(q,"")))return(new Function("return "+b))();d.error("Invalid JSON: "+b)},parseXML:function(b,c,e){a.DOMParser?(e=new DOMParser,c=e.parseFromString(b,"text/xml")):(c=new ActiveXObject("Microsoft.XMLDOM"),c.async="false",c.loadXML(b)),e=c.documentElement,(!e||!e.nodeName||e.nodeName==="parsererror")&&d.error("Invalid XML: "+b);return c},noop:function(){}
,globalEval:function(d){
	try {
		if(d&&i.test(d)){
			(window.execScript||function(d){window[ "eval" ].call(window, d);})(d);
		}
	} catch( err ){
		if( window.mailru && mailru.saveError ){
			mailru.saveError('js7', ['JQUERY.EVAL', encodeURIComponent(err.message || err)]);
		}
	}
},nodeName:function(a,b){return a.nodeName&&a.nodeName.toUpperCase()===b.toUpperCase()},each:function(a,c,e){var f,g=0,h=a.length,i=h===b||d.isFunction(a);if(e){if(i){for(f in a)if(c.apply(a[f],e)===!1)break}else for(;g<h;)if(c.apply(a[g++],e)===!1)break}else if(i){for(f in a)if(c.call(a[f],f,a[f])===!1)break}else for(var j=a[0];g<h&&c.call(j,g,j)!==!1;j=a[++g]){}return a},trim:F?function(a){return a==null?"":F.call(a)}:function(a){return a==null?"":(a+"").replace(j,"").replace(k,"")},makeArray:function(a,b){var c=b||[];if(a!=null){var e=d.type(a);a.length==null||e==="string"||e==="function"||e==="regexp"||d.isWindow(a)?D.call(c,a):d.merge(c,a)}return c},inArray:function(a,b){if(b.indexOf)return b.indexOf(a);for(var c=0,d=b.length;c<d;c++)if(b[c]===a)return c;return-1},merge:function(a,c){var d=a.length,e=0;if(typeof c.length==="number")for(var f=c.length;e<f;e++)a[d++]=c[e];else while(c[e]!==b)a[d++]=c[e++];a.length=d;return a},grep:function(a,b,c){var d=[],e;c=!!c;for(var f=0,g=a.length;f<g;f++)e=!!b(a[f],f),c!==e&&d.push(a[f]);return d},map:function(a,b,c){var d=[],e;for(var f=0,g=a.length;f<g;f++)e=b(a[f],f,c),e!=null&&(d[d.length]=e);return d.concat.apply([],d)},guid:1,proxy:function(a,c,e){arguments.length===2&&(typeof c==="string"?(e=a,a=e[c],c=b):c&&!d.isFunction(c)&&(e=c,c=b)),!c&&a&&(c=function(){return a.apply(e||this,arguments)}),a&&(c.guid=a.guid=a.guid||c.guid||d.guid++);return c},access:function(a,c,e,f,g,h){var i=a.length;if(typeof c==="object"){for(var j in c)d.access(a,j,c[j],f,g,e);return a}if(e!==b){f=!h&&f&&d.isFunction(e);for(var k=0;k<i;k++)g(a[k],c,f?e.call(a[k],k,g(a[k],c)):e,h);return a}return i?g(a[0],c):b},now:function(){return(new Date).getTime()},_Deferred:function(){var a=[],b,c,e,f={done:function(){if(!e){var c=arguments,g,h,i,j,k;b&&(k=b,b=0);for(g=0,h=c.length;g<h;g++)i=c[g],j=d.type(i),j==="array"?f.done.apply(f,i):j==="function"&&a.push(i);k&&f.resolveWith(k[0],k[1])}return this},resolveWith:function(d,f){if(!e&&!b&&!c){c=1;try{while(a[0])a.shift().apply(d,f)}catch(g){throw g}finally{b=[d,f],c=0}}return this},resolve:function(){f.resolveWith(d.isFunction(this.promise)?this.promise():this,arguments);return this},isResolved:function(){return c||b},cancel:function(){e=1,a=[];return this}};return f},Deferred:function(a){var b=d._Deferred(),c=d._Deferred(),e;d.extend(b,{then:function(a,c){b.done(a).fail(c);return this},fail:c.done,rejectWith:c.resolveWith,reject:c.resolve,isRejected:c.isResolved,promise:function(a){if(a==null){if(e)return e;e=a={}}var c=z.length;while(c--)a[z[c]]=b[z[c]];return a}}),b.done(c.cancel).fail(b.cancel),delete b.cancel,a&&a.call(b,b);return b},when:function(a){var b=arguments.length,c=b<=1&&a&&d.isFunction(a.promise)?a:d.Deferred(),e=c.promise();if(b>1){var f=E.call(arguments,0),g=b,h=function(a){return function(b){f[a]=arguments.length>1?E.call(arguments,0):b,--g||c.resolveWith(e,f)}};while(b--)a=f[b],a&&d.isFunction(a.promise)?a.promise().then(h(b),c.reject):--g;g||c.resolveWith(e,f)}else c!==a&&c.resolve(a);return e},uaMatch:function(a){a=a.toLowerCase();var b=r.exec(a)||s.exec(a)||t.exec(a)||a.indexOf("compatible")<0&&u.exec(a)||[];return{browser:b[1]||"",version:b[2]||"0"}},sub:function(){function a(b,c){return new a.fn.init(b,c)}d.extend(!0,a,this),a.superclass=this,a.fn=a.prototype=this(),a.fn.constructor=a,a.subclass=this.subclass,a.fn.init=function b(b,c){c&&c instanceof d&&!(c instanceof a)&&(c=a(c));return d.fn.init.call(this,b,c,e)},a.fn.init.prototype=a.fn;var e=a(c);return a},browser:{}}),y=d._Deferred(),d.each("Boolean Number String Function Array Date RegExp Object".split(" "),function(a,b){H["[object "+b+"]"]=b.toLowerCase()}),w=d.uaMatch(v),w.browser&&(d.browser[w.browser]=!0,d.browser.version=w.version),d.browser.webkit&&(d.browser.safari=!0),G&&(d.inArray=function(a,b){return G.call(b,a)}),i.test(" ")&&(j=/^[\s\xA0]+/,k=/[\s\xA0]+$/),g=d(c),c.addEventListener?A=function(){c.removeEventListener("DOMContentLoaded",A,!1),d.ready()}:c.attachEvent&&(A=function(){c.readyState==="complete"&&(c.detachEvent("onreadystatechange",A),d.ready())});return d}();(function(){d.support={};var b=c.createElement("div");b.style.display="none",b.innerHTML="   <link/><table></table><a href='/a' style='color:red;float:left;opacity:.55;'>a</a><input type='checkbox'/>";var e=b.getElementsByTagName("*"),f=b.getElementsByTagName("a")[0],g=c.createElement("select"),h=g.appendChild(c.createElement("option")),i=b.getElementsByTagName("input")[0];if(e&&e.length&&f){d.support={leadingWhitespace:b.firstChild.nodeType===3,tbody:!b.getElementsByTagName("tbody").length,htmlSerialize:!!b.getElementsByTagName("link").length,style:/red/.test(f.getAttribute("style")),hrefNormalized:f.getAttribute("href")==="/a",opacity:/^0.55$/.test(f.style.opacity),cssFloat:!!f.style.cssFloat,checkOn:i.value==="on",optSelected:h.selected,deleteExpando:!0,optDisabled:!1,checkClone:!1,noCloneEvent:!0,noCloneChecked:!0,boxModel:null,inlineBlockNeedsLayout:!1,shrinkWrapBlocks:!1,reliableHiddenOffsets:!0},i.checked=!0,d.support.noCloneChecked=i.cloneNode(!0).checked,g.disabled=!0,d.support.optDisabled=!h.disabled;var j=null;d.support.scriptEval=function(){if(j===null){var b=c.documentElement,e=c.createElement("script"),f="script"+d.now();try{e.appendChild(c.createTextNode("window."+f+"=1;"))}catch(g){}b.insertBefore(e,b.firstChild),a[f]?(j=!0,delete a[f]):j=!1,b.removeChild(e),b=e=f=null}return j};try{delete b.test}catch(k){d.support.deleteExpando=!1}!b.addEventListener&&b.attachEvent&&b.fireEvent&&(b.attachEvent("onclick",function l(){d.support.noCloneEvent=!1,b.detachEvent("onclick",l)}),b.cloneNode(!0).fireEvent("onclick")),b=c.createElement("div"),b.innerHTML="<input type='radio' name='radiotest' checked='checked'/>";var m=c.createDocumentFragment();m.appendChild(b.firstChild),d.support.checkClone=m.cloneNode(!0).cloneNode(!0).lastChild.checked,d(function(){var a=c.createElement("div"),b=c.getElementsByTagName("body")[0];if(b){a.style.width=a.style.paddingLeft="1px",b.appendChild(a),d.boxModel=d.support.boxModel=a.offsetWidth===2,"zoom"in a.style&&(a.style.display="inline",a.style.zoom=1,d.support.inlineBlockNeedsLayout=a.offsetWidth===2,a.style.display="",a.innerHTML="<div style='width:4px;'></div>",d.support.shrinkWrapBlocks=a.offsetWidth!==2),a.innerHTML="<table><tr><td style='padding:0;border:0;display:none'></td><td>t</td></tr></table>";var e=a.getElementsByTagName("td");d.support.reliableHiddenOffsets=e[0].offsetHeight===0,e[0].style.display="",e[1].style.display="none",d.support.reliableHiddenOffsets=d.support.reliableHiddenOffsets&&e[0].offsetHeight===0,a.innerHTML="",b.removeChild(a).style.display="none",a=e=null}});var n=function(a){var b=c.createElement("div");a="on"+a;if(!b.attachEvent)return!0;var d=a in b;d||(b.setAttribute(a,"return;"),d=typeof b[a]==="function"),b=null;return d};d.support.submitBubbles=n("submit"),d.support.changeBubbles=n("change"),b=e=f=null}})();var e=/^(?:\{.*\}|\[.*\])$/;d.extend({cache:{},uuid:0,expando:"jQuery"+(d.fn.jquery+Math.random()).replace(/\D/g,""),noData:{embed:!0,object:"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",applet:!0},hasData:function(a){a=a.nodeType?d.cache[a[d.expando]]:a[d.expando];return!!a&&!g(a)},data:function(a,c,e,f){if(d.acceptData(a)){var g=d.expando,h=typeof c==="string",i,j=a.nodeType,k=j?d.cache:a,l=j?a[d.expando]:a[d.expando]&&d.expando;if((!l||f&&l&&!k[l][g])&&h&&e===b)return;l||(j?a[d.expando]=l=++d.uuid:l=d.expando),k[l]||(k[l]={},j||(k[l].toJSON=d.noop));if(typeof c==="object"||typeof c==="function")f?k[l][g]=d.extend(k[l][g],c):k[l]=d.extend(k[l],c);i=k[l],f&&(i[g]||(i[g]={}),i=i[g]),e!==b&&(i[c]=e);if(c==="events"&&!i[c])return i[g]&&i[g].events;return h?i[c]:i}},removeData:function(b,c,e){if(d.acceptData(b)){var f=d.expando,h=b.nodeType,i=h?d.cache:b,j=h?b[d.expando]:d.expando;if(!i[j])return;if(c){var k=e?i[j][f]:i[j];if(k){delete k[c];if(!g(k))return}}if(e){delete i[j][f];if(!g(i[j]))return}var l=i[j][f];d.support.deleteExpando||i!=a?delete i[j]:i[j]=null,l?(i[j]={},h||(i[j].toJSON=d.noop),i[j][f]=l):h&&(d.support.deleteExpando?delete b[d.expando]:b.removeAttribute?b.removeAttribute(d.expando):b[d.expando]=null)}},_data:function(a,b,c){return d.data(a,b,c,!0)},acceptData:function(a){if(a.nodeName){var b=d.noData[a.nodeName.toLowerCase()];if(b)return b!==!0&&a.getAttribute("classid")===b}return!0}}),d.fn.extend({data:function(a,c){var e=null;if(typeof a==="undefined"){if(this.length){e=d.data(this[0]);if(this[0].nodeType===1){var g=this[0].attributes,h;for(var i=0,j=g.length;i<j;i++)h=g[i].name,h.indexOf("data-")===0&&(h=h.substr(5),f(this[0],h,e[h]))}}return e}if(typeof a==="object")return this.each(function(){d.data(this,a)});var k=a.split(".");k[1]=k[1]?"."+k[1]:"";if(c===b){e=this.triggerHandler("getData"+k[1]+"!",[k[0]]),e===b&&this.length&&(e=d.data(this[0],a),e=f(this[0],a,e));return e===b&&k[1]?this.data(k[0]):e}return this.each(function(){var b=d(this),e=[k[0],c];b.triggerHandler("setData"+k[1]+"!",e),d.data(this,a,c),b.triggerHandler("changeData"+k[1]+"!",e)})},removeData:function(a){return this.each(function(){d.removeData(this,a)})}}),d.extend({queue:function(a,b,c){if(a){b=(b||"fx")+"queue";var e=d._data(a,b);if(!c)return e||[];!e||d.isArray(c)?e=d._data(a,b,d.makeArray(c)):e.push(c);return e}},dequeue:function(a,b){b=b||"fx";var c=d.queue(a,b),e=c.shift();e==="inprogress"&&(e=c.shift()),e&&(b==="fx"&&c.unshift("inprogress"),e.call(a,function(){d.dequeue(a,b)})),c.length||d.removeData(a,b+"queue",!0)}}),d.fn.extend({queue:function(a,c){typeof a!=="string"&&(c=a,a="fx");if(c===b)return d.queue(this[0],a);return this.each(function(b){var e=d.queue(this,a,c);a==="fx"&&e[0]!=="inprogress"&&d.dequeue(this,a)})},dequeue:function(a){return this.each(function(){d.dequeue(this,a)})},delay:function(a,b){a=d.fx?d.fx.speeds[a]||a:a,b=b||"fx";return this.queue(b,function(){var c=this;setTimeout(function(){d.dequeue(c,b)},a)})},clearQueue:function(a){return this.queue(a||"fx",[])}});var h=/[\n\t\r]/g,i=/\s+/,j=/\r/g,k=/^(?:href|src|style)$/,l=/^(?:button|input)$/i,m=/^(?:button|input|object|select|textarea)$/i,n=/^a(?:rea)?$/i,o=/^(?:radio|checkbox)$/i;d.props={"for":"htmlFor","class":"className",readonly:"readOnly",maxlength:"maxLength",cellspacing:"cellSpacing",rowspan:"rowSpan",colspan:"colSpan",tabindex:"tabIndex",usemap:"useMap",frameborder:"frameBorder"},d.fn.extend({attr:function(a,b){return d.access(this,a,b,!0,d.attr)},removeAttr:function(a,b){return this.each(function(){d.attr(this,a,""),this.nodeType===1&&this.removeAttribute(a)})},addClass:function(a){if(d.isFunction(a))return this.each(function(b){var c=d(this);c.addClass(a.call(this,b,c.attr("class")))});if(a&&typeof a==="string"){var b=(a||"").split(i);for(var c=0,e=this.length;c<e;c++){var f=this[c];if(f.nodeType===1)if(f.className){var g=" "+f.className+" ",h=f.className;for(var j=0,k=b.length;j<k;j++)g.indexOf(" "+b[j]+" ")<0&&(h+=" "+b[j]);f.className=d.trim(h)}else f.className=a}}return this},removeClass:function(a){if(d.isFunction(a))return this.each(function(b){var c=d(this);c.removeClass(a.call(this,b,c.attr("class")))});if(a&&typeof a==="string"||a===b){var c=(a||"").split(i);for(var e=0,f=this.length;e<f;e++){var g=this[e];if(g.nodeType===1&&g.className)if(a){var j=(" "+g.className+" ").replace(h," ");for(var k=0,l=c.length;k<l;k++)j=j.replace(" "+c[k]+" "," ");g.className=d.trim(j)}else g.className=""}}return this},toggleClass:function(a,b){var c=typeof a,e=typeof b==="boolean";if(d.isFunction(a))return this.each(function(c){var e=d(this);e.toggleClass(a.call(this,c,e.attr("class"),b),b)});return this.each(function(){if(c==="string"){var f,g=0,h=d(this),j=b,k=a.split(i);while(f=k[g++])j=e?j:!h.hasClass(f),h[j?"addClass":"removeClass"](f)}else if(c==="undefined"||c==="boolean")this.className&&d._data(this,"__className__",this.className),this.className=this.className||a===!1?"":d._data(this,"__className__")||""})},hasClass:function(a){var b=" "+a+" ";for(var c=0,d=this.length;c<d;c++)if((" "+this[c].className+" ").replace(h," ").indexOf(b)>-1)return!0;return!1},val:function(a){if(!arguments.length){var c=this[0];if(c){if(d.nodeName(c,"option")){var e=c.attributes.value;return!e||e.specified?c.value:c.text}if(d.nodeName(c,"select")){var f=c.selectedIndex,g=[],h=c.options,i=c.type==="select-one";if(f<0)return null;for(var k=i?f:0,l=i?f+1:h.length;k<l;k++){var m=h[k];if(m.selected&&(d.support.optDisabled?!m.disabled:m.getAttribute("disabled")===null)&&(!m.parentNode.disabled||!d.nodeName(m.parentNode,"optgroup"))){a=d(m).val();if(i)return a;g.push(a)}}if(i&&!g.length&&h.length)return d(h[f]).val();return g}if(o.test(c.type)&&!d.support.checkOn)return c.getAttribute("value")===null?"on":c.value;return(c.value||"").replace(j,"")}return b}var n=d.isFunction(a);return this.each(function(b){var c=d(this),e=a;if(this.nodeType===1){n&&(e=a.call(this,b,c.val())),e==null?e="":typeof e==="number"?e+="":d.isArray(e)&&(e=d.map(e,function(a){return a==null?"":a+""}));if(d.isArray(e)&&o.test(this.type))this.checked=d.inArray(c.val(),e)>=0;else if(d.nodeName(this,"select")){var f=d.makeArray(e);d("option",this).each(function(){this.selected=d.inArray(d(this).val(),f)>=0}),f.length||(this.selectedIndex=-1)}else this.value=e}})}}),d.extend({attrFn:{val:!0,css:!0,html:!0,text:!0,data:!0,width:!0,height:!0,offset:!0},attr:function(a,c,e,f){if(!a||a.nodeType===3||a.nodeType===8||a.nodeType===2)return b;if(f&&c in d.attrFn)return d(a)[c](e);var g=a.nodeType!==1||!d.isXMLDoc(a),h=e!==b;c=g&&d.props[c]||c;if(a.nodeType===1){var i=k.test(c);if(c==="selected"&&!d.support.optSelected){var j=a.parentNode;j&&(j.selectedIndex,j.parentNode&&j.parentNode.selectedIndex)}if((c in a||a[c]!==b)&&g&&!i){h&&(c==="type"&&l.test(a.nodeName)&&a.parentNode&&d.error("type property can't be changed"),e===null?a.nodeType===1&&a.removeAttribute(c):a[c]=e);if(d.nodeName(a,"form")&&a.getAttributeNode(c))return a.getAttributeNode(c).nodeValue;if(c==="tabIndex"){var o=a.getAttributeNode("tabIndex");return o&&o.specified?o.value:m.test(a.nodeName)||n.test(a.nodeName)&&a.href?0:b}return a[c]}if(!d.support.style&&g&&c==="style"){h&&(a.style.cssText=""+e);return a.style.cssText}h&&a.setAttribute(c,""+e);if(!a.attributes[c]&&(a.hasAttribute&&!a.hasAttribute(c)))return b;var p=!d.support.hrefNormalized&&g&&i?a.getAttribute(c,2):a.getAttribute(c);return p===null?b:p}h&&(a[c]=e);return a[c]}});var p=/\.(.*)$/,q=/^(?:textarea|input|select)$/i,r=/\./g,s=/ /g,t=/[^\w\s.|`]/g,u=function(a){return a.replace(t,"\\$&")};d.event={add:function(c,e,f,g){if(c.nodeType!==3&&c.nodeType!==8){try{d.isWindow(c)&&(c!==a&&!c.frameElement)&&(c=a)}catch(h){}if(f===!1)f=v;else if(!f)return;var i,j;f.handler&&(i=f,f=i.handler),f.guid||(f.guid=d.guid++);var k=d._data(c);if(!k)return;var l=k.events,m=k.handle;l||(k.events=l={}),m||(k.handle=m=function(){return typeof d!=="undefined"&&!d.event.triggered?d.event.handle.apply(m.elem,arguments):b}),m.elem=c,e=e.split(" ");var n,o=0,p;while(n=e[o++]){j=i?d.extend({},i):{handler:f,data:g},n.indexOf(".")>-1?(p=n.split("."),n=p.shift(),j.namespace=p.slice(0).sort().join(".")):(p=[],j.namespace=""),j.type=n,j.guid||(j.guid=f.guid);var q=l[n],r=d.event.special[n]||{};if(!q){q=l[n]=[];if(!r.setup||r.setup.call(c,g,p,m)===!1)c.addEventListener?c.addEventListener(n,m,!1):c.attachEvent&&c.attachEvent("on"+n,m)}r.add&&(r.add.call(c,j),j.handler.guid||(j.handler.guid=f.guid)),q.push(j),d.event.global[n]=!0}c=null}},global:{},remove:function(a,c,e,f){if(a.nodeType!==3&&a.nodeType!==8){e===!1&&(e=v);var g,h,i,j,k=0,l,m,n,o,p,q,r,s=d.hasData(a)&&d._data(a),t=s&&s.events;if(!s||!t)return;c&&c.type&&(e=c.handler,c=c.type);if(!c||typeof c==="string"&&c.charAt(0)==="."){c=c||"";for(h in t)d.event.remove(a,h+c);return}c=c.split(" ");while(h=c[k++]){r=h,q=null,l=h.indexOf(".")<0,m=[],l||(m=h.split("."),h=m.shift(),n=new RegExp("(^|\\.)"+d.map(m.slice(0).sort(),u).join("\\.(?:.*\\.)?")+"(\\.|$)")),p=t[h];if(!p)continue;if(!e){for(j=0;j<p.length;j++){q=p[j];if(l||n.test(q.namespace))d.event.remove(a,r,q.handler,j),p.splice(j--,1)}continue}o=d.event.special[h]||{};for(j=f||0;j<p.length;j++){q=p[j];if(e.guid===q.guid){if(l||n.test(q.namespace))f==null&&p.splice(j--,1),o.remove&&o.remove.call(a,q);if(f!=null)break}}if(p.length===0||f!=null&&p.length===1)(!o.teardown||o.teardown.call(a,m)===!1)&&d.removeEvent(a,h,s.handle),g=null,delete t[h]}if(d.isEmptyObject(t)){var w=s.handle;w&&(w.elem=null),delete s.events,delete s.handle,d.isEmptyObject(s)&&d.removeData(a,b,!0)}}},trigger:function(a,c,e){var f=a.type||a,g=arguments[3];if(!g){a=typeof a==="object"?a[d.expando]?a:d.extend(d.Event(f),a):d.Event(f),f.indexOf("!")>=0&&(a.type=f=f.slice(0,-1),a.exclusive=!0),e||(a.stopPropagation(),d.event.global[f]&&d.each(d.cache,function(){var b=d.expando,e=this[b];e&&e.events&&e.events[f]&&d.event.trigger(a,c,e.handle.elem)}));if(!e||e.nodeType===3||e.nodeType===8)return b;a.result=b,a.target=e,c=d.makeArray(c),c.unshift(a)}a.currentTarget=e;var h=d._data(e,"handle");h&&h.apply(e,c);var i=e.parentNode||e.ownerDocument;try{e&&e.nodeName&&d.noData[e.nodeName.toLowerCase()]||e["on"+f]&&e["on"+f].apply(e,c)===!1&&(a.result=!1,a.preventDefault())}catch(j){}if(!a.isPropagationStopped()&&i)d.event.trigger(a,c,i,!0);else if(!a.isDefaultPrevented()){var k,l=a.target,m=f.replace(p,""),n=d.nodeName(l,"a")&&m==="click",o=d.event.special[m]||{};if((!o._default||o._default.call(e,a)===!1)&&!n&&!(l&&l.nodeName&&d.noData[l.nodeName.toLowerCase()])){try{l[m]&&(k=l["on"+m],k&&(l["on"+m]=null),d.event.triggered=!0,l[m]())}catch(q){}k&&(l["on"+m]=k),d.event.triggered=!1}}},handle:function(c){var e,f,g,h,i,j=[],k=d.makeArray(arguments);c=k[0]=d.event.fix(c||a.event),c.currentTarget=this,e=c.type.indexOf(".")<0&&!c.exclusive,e||(g=c.type.split("."),c.type=g.shift(),j=g.slice(0).sort(),h=new RegExp("(^|\\.)"+j.join("\\.(?:.*\\.)?")+"(\\.|$)")),c.namespace=c.namespace||j.join("."),i=d._data(this,"events"),f=(i||{})[c.type];if(i&&f){f=f.slice(0);for(var l=0,m=f.length;l<m;l++){var n=f[l];if(e||h.test(n.namespace)){c.handler=n.handler,c.data=n.data,c.handleObj=n;var o=n.handler.apply(this,k);o!==b&&(c.result=o,o===!1&&(c.preventDefault(),c.stopPropagation()));if(c.isImmediatePropagationStopped())break}}}return c.result},props:"altKey attrChange attrName bubbles button cancelable charCode clientX clientY ctrlKey currentTarget data detail eventPhase fromElement handler keyCode layerX layerY metaKey newValue offsetX offsetY pageX pageY prevValue relatedNode relatedTarget screenX screenY shiftKey srcElement target toElement view wheelDelta which".split(" "),fix:function(a){if(a[d.expando])return a;var e=a;a=d.Event(e);for(var f=this.props.length,g;f;)g=this.props[--f],a[g]=e[g];a.target||(a.target=a.srcElement||c),a.target.nodeType===3&&(a.target=a.target.parentNode),!a.relatedTarget&&a.fromElement&&(a.relatedTarget=a.fromElement===a.target?a.toElement:a.fromElement);if(a.pageX==null&&a.clientX!=null){var h=c.documentElement,i=c.body;a.pageX=a.clientX+(h&&h.scrollLeft||i&&i.scrollLeft||0)-(h&&h.clientLeft||i&&i.clientLeft||0),a.pageY=a.clientY+(h&&h.scrollTop||i&&i.scrollTop||0)-(h&&h.clientTop||i&&i.clientTop||0)}a.which==null&&(a.charCode!=null||a.keyCode!=null)&&(a.which=a.charCode!=null?a.charCode:a.keyCode),!a.metaKey&&a.ctrlKey&&(a.metaKey=a.ctrlKey),!a.which&&a.button!==b&&(a.which=a.button&1?1:a.button&2?3:a.button&4?2:0);return a},guid:1e8,proxy:d.proxy,special:{ready:{setup:d.bindReady,teardown:d.noop},live:{add:function(a){d.event.add(this,F(a.origType,a.selector),d.extend({},a,{handler:E,guid:a.handler.guid}))},remove:function(a){d.event.remove(this,F(a.origType,a.selector),a)}},beforeunload:{setup:function(a,b,c){d.isWindow(this)&&(this.onbeforeunload=c)},teardown:function(a,b){this.onbeforeunload===b&&(this.onbeforeunload=null)}}}},d.removeEvent=c.removeEventListener?function(a,b,c){a.removeEventListener&&a.removeEventListener(b,c,!1)}:function(a,b,c){a.detachEvent&&a.detachEvent("on"+b,c)},d.Event=function(a){if(!this.preventDefault)return new d.Event(a);a&&a.type?(this.originalEvent=a,this.type=a.type,this.isDefaultPrevented=a.defaultPrevented||a.returnValue===!1||a.getPreventDefault&&a.getPreventDefault()?w:v):this.type=a,this.timeStamp=d.now(),this[d.expando]=!0},d.Event.prototype={preventDefault:function(){this.isDefaultPrevented=w;var a=this.originalEvent;a&&(a.preventDefault?a.preventDefault():a.returnValue=!1)},stopPropagation:function(){this.isPropagationStopped=w;var a=this.originalEvent;a&&(a.stopPropagation&&a.stopPropagation(),a.cancelBubble=!0)},stopImmediatePropagation:function(){this.isImmediatePropagationStopped=w,this.stopPropagation()},isDefaultPrevented:v,isPropagationStopped:v,isImmediatePropagationStopped:v};var x=function(a){var b=a.relatedTarget;try{if(b!==c&&!b.parentNode)return;while(b&&b!==this)b=b.parentNode;b!==this&&(a.type=a.data,d.event.handle.apply(this,arguments))}catch(e){}},y=function(a){a.type=a.data,d.event.handle.apply(this,arguments)};d.each({mouseenter:"mouseover",mouseleave:"mouseout"},function(a,b){d.event.special[a]={setup:function(c){d.event.add(this,b,c&&c.selector?y:x,a)},teardown:function(a){d.event.remove(this,b,a&&a.selector?y:x)}}}),d.support.submitBubbles||(d.event.special.submit={setup:function(a,b){if(this.nodeName&&this.nodeName.toLowerCase()!=="form")d.event.add(this,"click.specialSubmit",function(a){var b=a.target,c=b.type;(c==="submit"||c==="image")&&d(b).closest("form").length&&C("submit",this,arguments)}),d.event.add(this,"keypress.specialSubmit",function(a){var b=a.target,c=b.type;(c==="text"||c==="password")&&d(b).closest("form").length&&a.keyCode===13&&C("submit",this,arguments)});else return!1},teardown:function(a){d.event.remove(this,".specialSubmit")}});if(!d.support.changeBubbles){var z,A=function(a){var b=a.type,c=a.value;b==="radio"||b==="checkbox"?c=a.checked:b==="select-multiple"?c=a.selectedIndex>-1?d.map(a.options,function(a){return a.selected}).join("-"):"":a.nodeName.toLowerCase()==="select"&&(c=a.selectedIndex);return c},B=function B(a){var c=a.target,e,f;if(q.test(c.nodeName)&&!c.readOnly){e=d._data(c,"_change_data"),f=A(c),(a.type!=="focusout"||c.type!=="radio")&&d._data(c,"_change_data",f);if(e===b||f===e)return;if(e!=null||f)a.type="change",a.liveFired=b,d.event.trigger(a,arguments[1],c)}};d.event.special.change={filters:{focusout:B,beforedeactivate:B,click:function(a){var b=a.target,c=b.type;(c==="radio"||c==="checkbox"||b.nodeName.toLowerCase()==="select")&&B.call(this,a)},keydown:function(a){var b=a.target,c=b.type;(a.keyCode===13&&b.nodeName.toLowerCase()!=="textarea"||a.keyCode===32&&(c==="checkbox"||c==="radio")||c==="select-multiple")&&B.call(this,a)},beforeactivate:function(a){var b=a.target;d._data(b,"_change_data",A(b))}},setup:function(a,b){if(this.type==="file")return!1;for(var c in z)d.event.add(this,c+".specialChange",z[c]);return q.test(this.nodeName)},teardown:function(a){d.event.remove(this,".specialChange");return q.test(this.nodeName)}},z=d.event.special.change.filters,z.focus=z.beforeactivate}c.addEventListener&&d.each({focus:"focusin",blur:"focusout"},function(a,b){function c(a){a=d.event.fix(a),a.type=b;return d.event.handle.call(this,a)}d.event.special[b]={setup:function(){this.addEventListener(a,c,!0)},teardown:function(){this.removeEventListener(a,c,!0)}}}),d.each(["bind","one"],function(a,c){d.fn[c]=function(a,e,f){if(typeof a==="object"){for(var g in a)this[c](g,e,a[g],f);return this}if(d.isFunction(e)||e===!1)f=e,e=b;var h=c==="one"?d.proxy(f,function(a){d(this).unbind(a,h);return f.apply(this,arguments)}):f;if(a==="unload"&&c!=="one")this.one(a,e,f);else for(var i=0,j=this.length;i<j;i++)d.event.add(this[i],a,h,e);return this}}),d.fn.extend({unbind:function(a,b){if(typeof a!=="object"||a.preventDefault)for(var e=0,f=this.length;e<f;e++)d.event.remove(this[e],a,b);else for(var c in a)this.unbind(c,a[c]);return this},delegate:function(a,b,c,d){return this.live(b,c,d,a)},undelegate:function(a,b,c){return arguments.length===0?this.unbind("live"):this.die(b,null,c,a)},trigger:function(a,b){return this.each(function(){d.event.trigger(a,b,this)})},triggerHandler:function(a,b){if(this[0]){var c=d.Event(a);c.preventDefault(),c.stopPropagation(),d.event.trigger(c,b,this[0]);return c.result}},toggle:function(a){var b=arguments,c=1;while(c<b.length)d.proxy(a,b[c++]);return this.click(d.proxy(a,function(e){var f=(d._data(this,"lastToggle"+a.guid)||0)%c;d._data(this,"lastToggle"+a.guid,f+1),e.preventDefault();return b[f].apply(this,arguments)||!1}))},hover:function(a,b){return this.mouseenter(a).mouseleave(b||a)}});var D={focus:"focusin",blur:"focusout",mouseenter:"mouseover",mouseleave:"mouseout"};d.each(["live","die"],function(a,c){d.fn[c]=function(a,e,f,g){var h,i=0,j,k,l,m=g||this.selector,n=g?this:d(this.context);if(typeof a==="object"&&!a.preventDefault){for(var o in a)n[c](o,e,a[o],m);return this}d.isFunction(e)&&(f=e,e=b),a=(a||"").split(" ");while((h=a[i++])!=null){j=p.exec(h),k="",j&&(k=j[0],h=h.replace(p,""));if(h==="hover"){a.push("mouseenter"+k,"mouseleave"+k);continue}l=h,h==="focus"||h==="blur"?(a.push(D[h]+k),h=h+k):h=(D[h]||h)+k;if(c==="live")for(var q=0,r=n.length;q<r;q++)d.event.add(n[q],"live."+F(h,m),{data:e,selector:m,handler:f,origType:h,origHandler:f,preType:l});else n.unbind("live."+F(h,m),f)}return this}}),d.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error".split(" "),function(a,b){d.fn[b]=function(a,c){c==null&&(c=a,a=null);return arguments.length>0?this.bind(b,a,c):this.trigger(b)},d.attrFn&&(d.attrFn[b]=!0)}),function(){function u(a,b,c,d,e,f){for(var g=0,h=d.length;g<h;g++){var i=d[g];if(i){var j=!1;i=i[a];while(i){if(i.sizcache===c){j=d[i.sizset];break}if(i.nodeType===1){f||(i.sizcache=c,i.sizset=g);if(typeof b!=="string"){if(i===b){j=!0;break}}else if(k.filter(b,[i]).length>0){j=i;break}}i=i[a]}d[g]=j}}}function t(a,b,c,d,e,f){for(var g=0,h=d.length;g<h;g++){var i=d[g];if(i){var j=!1;i=i[a];while(i){if(i.sizcache===c){j=d[i.sizset];break}i.nodeType===1&&!f&&(i.sizcache=c,i.sizset=g);if(i.nodeName.toLowerCase()===b){j=i;break}i=i[a]}d[g]=j}}}var a=/((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g,e=0,f=Object.prototype.toString,g=!1,h=!0,i=/\\/g,j=/\W/;[0,0].sort(function(){h=!1;return 0});var k=function(b,d,e,g){e=e||[],d=d||c;var h=d;if(d.nodeType!==1&&d.nodeType!==9)return[];if(!b||typeof b!=="string")return e;var i,j,n,o,q,r,s,t,u=!0,w=k.isXML(d),x=[],y=b;do{a.exec(""),i=a.exec(y);if(i){y=i[3],x.push(i[1]);if(i[2]){o=i[3];break}}}while(i);if(x.length>1&&m.exec(b))if(x.length===2&&l.relative[x[0]])j=v(x[0]+x[1],d);else{j=l.relative[x[0]]?[d]:k(x.shift(),d);while(x.length)b=x.shift(),l.relative[b]&&(b+=x.shift()),j=v(b,j)}else{!g&&x.length>1&&d.nodeType===9&&!w&&l.match.ID.test(x[0])&&!l.match.ID.test(x[x.length-1])&&(q=k.find(x.shift(),d,w),d=q.expr?k.filter(q.expr,q.set)[0]:q.set[0]);if(d){q=g?{expr:x.pop(),set:p(g)}:k.find(x.pop(),x.length===1&&(x[0]==="~"||x[0]==="+")&&d.parentNode?d.parentNode:d,w),j=q.expr?k.filter(q.expr,q.set):q.set,x.length>0?n=p(j):u=!1;while(x.length)r=x.pop(),s=r,l.relative[r]?s=x.pop():r="",s==null&&(s=d),l.relative[r](n,s,w)}else n=x=[]}n||(n=j),n||k.error(r||b);if(f.call(n)==="[object Array]")if(u)if(d&&d.nodeType===1)for(t=0;n[t]!=null;t++)n[t]&&(n[t]===!0||n[t].nodeType===1&&k.contains(d,n[t]))&&e.push(j[t]);else for(t=0;n[t]!=null;t++)n[t]&&n[t].nodeType===1&&e.push(j[t]);else e.push.apply(e,n);else p(n,e);o&&(k(o,h,e,g),k.uniqueSort(e));return e};k.uniqueSort=function(a){if(r){g=h,a.sort(r);if(g)for(var b=1;b<a.length;b++)a[b]===a[b-1]&&a.splice(b--,1)}return a},k.matches=function(a,b){return k(a,null,null,b)},k.matchesSelector=function(a,b){return k(b,null,null,[a]).length>0},k.find=function(a,b,c){var d;if(!a)return[];for(var e=0,f=l.order.length;e<f;e++){var g,h=l.order[e];if(g=l.leftMatch[h].exec(a)){var j=g[1];g.splice(1,1);if(j.substr(j.length-1)!=="\\"){g[1]=(g[1]||"").replace(i,""),d=l.find[h](g,b,c);if(d!=null){a=a.replace(l.match[h],"");break}}}}d||(d=typeof b.getElementsByTagName!=="undefined"?b.getElementsByTagName("*"):[]);return{set:d,expr:a}},k.filter=function(a,c,d,e){var f,g,h=a,i=[],j=c,m=c&&c[0]&&k.isXML(c[0]);while(a&&c.length){for(var n in l.filter)if((f=l.leftMatch[n].exec(a))!=null&&f[2]){var o,p,q=l.filter[n],r=f[1];g=!1,f.splice(1,1);if(r.substr(r.length-1)==="\\")continue;j===i&&(i=[]);if(l.preFilter[n]){f=l.preFilter[n](f,j,d,i,e,m);if(f){if(f===!0)continue}else g=o=!0}if(f)for(var s=0;(p=j[s])!=null;s++)if(p){o=q(p,f,s,j);var t=e^!!o;d&&o!=null?t?g=!0:j[s]=!1:t&&(i.push(p),g=!0)}if(o!==b){d||(j=i),a=a.replace(l.match[n],"");if(!g)return[];break}}if(a===h)if(g==null)k.error(a);else break;h=a}return j},k.error=function(a){throw"Syntax error, unrecognized expression: "+a};var l=k.selectors={order:["ID","NAME","TAG"],match:{ID:/#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,CLASS:/\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,NAME:/\[name=['"]*((?:[\w\u00c0-\uFFFF\-]|\\.)+)['"]*\]/,ATTR:/\[\s*((?:[\w\u00c0-\uFFFF\-]|\\.)+)\s*(?:(\S?=)\s*(?:(['"])(.*?)\3|(#?(?:[\w\u00c0-\uFFFF\-]|\\.)*)|)|)\s*\]/,TAG:/^((?:[\w\u00c0-\uFFFF\*\-]|\\.)+)/,CHILD:/:(only|nth|last|first)-child(?:\(\s*(even|odd|(?:[+\-]?\d+|(?:[+\-]?\d*)?n\s*(?:[+\-]\s*\d+)?))\s*\))?/,POS:/:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^\-]|$)/,PSEUDO:/:((?:[\w\u00c0-\uFFFF\-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/},leftMatch:{},attrMap:{"class":"className","for":"htmlFor"},attrHandle:{href:function(a){return a.getAttribute("href")},type:function(a){return a.getAttribute("type")}},relative:{"+":function(a,b){var c=typeof b==="string",d=c&&!j.test(b),e=c&&!d;d&&(b=b.toLowerCase());for(var f=0,g=a.length,h;f<g;f++)if(h=a[f]){while((h=h.previousSibling)&&h.nodeType!==1){}a[f]=e||h&&h.nodeName.toLowerCase()===b?h||!1:h===b}e&&k.filter(b,a,!0)},">":function(a,b){var c,d=typeof b==="string",e=0,f=a.length;if(d&&!j.test(b)){b=b.toLowerCase();for(;e<f;e++){c=a[e];if(c){var g=c.parentNode;a[e]=g.nodeName.toLowerCase()===b?g:!1}}}else{for(;e<f;e++)c=a[e],c&&(a[e]=d?c.parentNode:c.parentNode===b);d&&k.filter(b,a,!0)}},"":function(a,b,c){var d,f=e++,g=u;typeof b==="string"&&!j.test(b)&&(b=b.toLowerCase(),d=b,g=t),g("parentNode",b,f,a,d,c)},"~":function(a,b,c){var d,f=e++,g=u;typeof b==="string"&&!j.test(b)&&(b=b.toLowerCase(),d=b,g=t),g("previousSibling",b,f,a,d,c)}},find:{ID:function(a,b,c){if(typeof b.getElementById!=="undefined"&&!c){var d=b.getElementById(a[1]);return d&&d.parentNode?[d]:[]}},NAME:function(a,b){if(typeof b.getElementsByName!=="undefined"){var c=[],d=b.getElementsByName(a[1]);for(var e=0,f=d.length;e<f;e++)d[e].getAttribute("name")===a[1]&&c.push(d[e]);return c.length===0?null:c}},TAG:function(a,b){if(typeof b.getElementsByTagName!=="undefined")return b.getElementsByTagName(a[1])}},preFilter:{CLASS:function(a,b,c,d,e,f){a=" "+a[1].replace(i,"")+" ";if(f)return a;for(var g=0,h;(h=b[g])!=null;g++)h&&(e^(h.className&&(" "+h.className+" ").replace(/[\t\n\r]/g," ").indexOf(a)>=0)?c||d.push(h):c&&(b[g]=!1));return!1},ID:function(a){return a[1].replace(i,"")},TAG:function(a,b){return a[1].replace(i,"").toLowerCase()},CHILD:function(a){if(a[1]==="nth"){a[2]||k.error(a[0]),a[2]=a[2].replace(/^\+|\s*/g,"");var b=/(-?)(\d*)(?:n([+\-]?\d*))?/.exec(a[2]==="even"&&"2n"||a[2]==="odd"&&"2n+1"||!/\D/.test(a[2])&&"0n+"+a[2]||a[2]);a[2]=b[1]+(b[2]||1)-0,a[3]=b[3]-0}else a[2]&&k.error(a[0]);a[0]=e++;return a},ATTR:function(a,b,c,d,e,f){var g=a[1]=a[1].replace(i,"");!f&&l.attrMap[g]&&(a[1]=l.attrMap[g]),a[4]=(a[4]||a[5]||"").replace(i,""),a[2]==="~="&&(a[4]=" "+a[4]+" ");return a},PSEUDO:function(b,c,d,e,f){if(b[1]==="not")if((a.exec(b[3])||"").length>1||/^\w/.test(b[3]))b[3]=k(b[3],null,null,c);else{var g=k.filter(b[3],c,d,!0^f);d||e.push.apply(e,g);return!1}else if(l.match.POS.test(b[0])||l.match.CHILD.test(b[0]))return!0;return b},POS:function(a){a.unshift(!0);return a}},filters:{enabled:function(a){return a.disabled===!1&&a.type!=="hidden"},disabled:function(a){return a.disabled===!0},checked:function(a){return a.checked===!0},selected:function(a){a.parentNode&&a.parentNode.selectedIndex;return a.selected===!0},parent:function(a){return!!a.firstChild},empty:function(a){return!a.firstChild},has:function(a,b,c){return!!k(c[3],a).length},header:function(a){return/h\d/i.test(a.nodeName)},text:function(a){return"text"===a.getAttribute("type")},radio:function(a){return"radio"===a.type},checkbox:function(a){return"checkbox"===a.type},file:function(a){return"file"===a.type},password:function(a){return"password"===a.type},submit:function(a){return"submit"===a.type},image:function(a){return"image"===a.type},reset:function(a){return"reset"===a.type},button:function(a){return"button"===a.type||a.nodeName.toLowerCase()==="button"},input:function(a){return/input|select|textarea|button/i.test(a.nodeName)}},setFilters:{first:function(a,b){return b===0},last:function(a,b,c,d){return b===d.length-1},even:function(a,b){return b%2===0},odd:function(a,b){return b%2===1},lt:function(a,b,c){return b<c[3]-0},gt:function(a,b,c){return b>c[3]-0},nth:function(a,b,c){return c[3]-0===b},eq:function(a,b,c){return c[3]-0===b}},filter:{PSEUDO:function(a,b,c,d){var e=b[1],f=l.filters[e];if(f)return f(a,c,b,d);if(e==="contains")return(a.textContent||a.innerText||k.getText([a])||"").indexOf(b[3])>=0;if(e==="not"){var g=b[3];for(var h=0,i=g.length;h<i;h++)if(g[h]===a)return!1;return!0}k.error(e)},CHILD:function(a,b){var c=b[1],d=a;switch(c){case"only":case"first":while(d=d.previousSibling)if(d.nodeType===1)return!1;if(c==="first")return!0;d=a;case"last":while(d=d.nextSibling)if(d.nodeType===1)return!1;return!0;case"nth":var e=b[2],f=b[3];if(e===1&&f===0)return!0;var g=b[0],h=a.parentNode;if(h&&(h.sizcache!==g||!a.nodeIndex)){var i=0;for(d=h.firstChild;d;d=d.nextSibling)d.nodeType===1&&(d.nodeIndex=++i);h.sizcache=g}var j=a.nodeIndex-f;return e===0?j===0:j%e===0&&j/e>=0}},ID:function(a,b){return a.nodeType===1&&a.getAttribute("id")===b},TAG:function(a,b){return b==="*"&&a.nodeType===1||a.nodeName.toLowerCase()===b},CLASS:function(a,b){return(" "+(a.className||a.getAttribute("class"))+" ").indexOf(b)>-1},ATTR:function(a,b){var c=b[1],d=l.attrHandle[c]?l.attrHandle[c](a):a[c]!=null?a[c]:a.getAttribute(c),e=d+"",f=b[2],g=b[4];return d==null?f==="!=":f==="="?e===g:f==="*="?e.indexOf(g)>=0:f==="~="?(" "+e+" ").indexOf(g)>=0:g?f==="!="?e!==g:f==="^="?e.indexOf(g)===0:f==="$="?e.substr(e.length-g.length)===g:f==="|="?e===g||e.substr(0,g.length+1)===g+"-":!1:e&&d!==!1},POS:function(a,b,c,d){var e=b[2],f=l.setFilters[e];if(f)return f(a,c,b,d)}}},m=l.match.POS,n=function(a,b){return"\\"+(b-0+1)};for(var o in l.match)l.match[o]=new RegExp(l.match[o].source+/(?![^\[]*\])(?![^\(]*\))/.source),l.leftMatch[o]=new RegExp(/(^(?:.|\r|\n)*?)/.source+l.match[o].source.replace(/\\(\d+)/g,n));var p=function(a,b){a=Array.prototype.slice.call(a,0);if(b){b.push.apply(b,a);return b}return a};try{Array.prototype.slice.call(c.documentElement.childNodes,0)[0].nodeType}catch(q){p=function(a,b){var c=0,d=b||[];if(f.call(a)==="[object Array]")Array.prototype.push.apply(d,a);else if(typeof a.length==="number")for(var e=a.length;c<e;c++)d.push(a[c]);else for(;a[c];c++)d.push(a[c]);return d}}var r,s;c.documentElement.compareDocumentPosition?r=function(a,b){if(a===b){g=!0;return 0}if(!a.compareDocumentPosition||!b.compareDocumentPosition)return a.compareDocumentPosition?-1:1;return a.compareDocumentPosition(b)&4?-1:1}:(r=function(a,b){var c,d,e=[],f=[],h=a.parentNode,i=b.parentNode,j=h;if(a===b){g=!0;return 0}if(h===i)return s(a,b);if(!h)return-1;if(!i)return 1;while(j)e.unshift(j),j=j.parentNode;j=i;while(j)f.unshift(j),j=j.parentNode;c=e.length,d=f.length;for(var k=0;k<c&&k<d;k++)if(e[k]!==f[k])return s(e[k],f[k]);return k===c?s(a,f[k],-1):s(e[k],b,1)},s=function(a,b,c){if(a===b)return c;var d=a.nextSibling;while(d){if(d===b)return-1;d=d.nextSibling}return 1}),k.getText=function(a){var b="",c;for(var d=0;a[d];d++)c=a[d],c.nodeType===3||c.nodeType===4?b+=c.nodeValue:c.nodeType!==8&&(b+=k.getText(c.childNodes));return b},function(){var a=c.createElement("div"),d="script"+(new Date).getTime(),e=c.documentElement;a.innerHTML="<a name='"+d+"'/>",e.insertBefore(a,e.firstChild),c.getElementById(d)&&(l.find.ID=function(a,c,d){if(typeof c.getElementById!=="undefined"&&!d){var e=c.getElementById(a[1]);return e?e.id===a[1]||typeof e.getAttributeNode!=="undefined"&&e.getAttributeNode("id").nodeValue===a[1]?[e]:b:[]}},l.filter.ID=function(a,b){var c=typeof a.getAttributeNode!=="undefined"&&a.getAttributeNode("id");return a.nodeType===1&&c&&c.nodeValue===b}),e.removeChild(a),e=a=null}(),function(){var a=c.createElement("div");a.appendChild(c.createComment("")),a.getElementsByTagName("*").length>0&&(l.find.TAG=function(a,b){var c=b.getElementsByTagName(a[1]);if(a[1]==="*"){var d=[];for(var e=0;c[e];e++)c[e].nodeType===1&&d.push(c[e]);c=d}return c}),a.innerHTML="<a href='#'></a>",a.firstChild&&typeof a.firstChild.getAttribute!=="undefined"&&a.firstChild.getAttribute("href")!=="#"&&(l.attrHandle.href=function(a){return a.getAttribute("href",2)}),a=null}(),c.querySelectorAll&&function(){var a=k,b=c.createElement("div"),d="__sizzle__";b.innerHTML="<p class='TEST'></p>";if(!b.querySelectorAll||b.querySelectorAll(".TEST").length!==0){k=function(b,e,f,g){e=e||c;if(!g&&!k.isXML(e)){var h=/^(\w+$)|^\.([\w\-]+$)|^#([\w\-]+$)/.exec(b);if(h&&(e.nodeType===1||e.nodeType===9)){if(h[1])return p(e.getElementsByTagName(b),f);if(h[2]&&l.find.CLASS&&e.getElementsByClassName)return p(e.getElementsByClassName(h[2]),f)}if(e.nodeType===9){if(b==="body"&&e.body)return p([e.body],f);if(h&&h[3]){var i=e.getElementById(h[3]);if(!i||!i.parentNode)return p([],f);if(i.id===h[3])return p([i],f)}try{return p(e.querySelectorAll(b),f)}catch(j){}}else if(e.nodeType===1&&e.nodeName.toLowerCase()!=="object"){var m=e,n=e.getAttribute("id"),o=n||d,q=e.parentNode,r=/^\s*[+~]/.test(b);n?o=o.replace(/'/g,"\\$&"):e.setAttribute("id",o),r&&q&&(e=e.parentNode);try{if(!r||q)return p(e.querySelectorAll("[id='"+o+"'] "+b),f)}catch(s){}finally{n||m.removeAttribute("id")}}}return a(b,e,f,g)};for(var e in a)k[e]=a[e];b=null}}(),function(){var a=c.documentElement,b=a.matchesSelector||a.mozMatchesSelector||a.webkitMatchesSelector||a.msMatchesSelector,d=!1;try{b.call(c.documentElement,"[test!='']:sizzle")}catch(e){d=!0}b&&(k.matchesSelector=function(a,c){c=c.replace(/\=\s*([^'"\]]*)\s*\]/g,"='$1']");if(!k.isXML(a))try{if(d||!l.match.PSEUDO.test(c)&&!/!=/.test(c))return b.call(a,c)}catch(e){}return k(c,null,null,[a]).length>0})}(),function(){var a=c.createElement("div");a.innerHTML="<div class='test e'></div><div class='test'></div>";if(a.getElementsByClassName&&a.getElementsByClassName("e").length!==0){a.lastChild.className="e";if(a.getElementsByClassName("e").length===1)return;l.order.splice(1,0,"CLASS"),l.find.CLASS=function(a,b,c){if(typeof b.getElementsByClassName!=="undefined"&&!c)return b.getElementsByClassName(a[1])},a=null}}(),c.documentElement.contains?k.contains=function(a,b){return a!==b&&(a.contains?a.contains(b):!0)}:c.documentElement.compareDocumentPosition?k.contains=function(a,b){return!!(a.compareDocumentPosition(b)&16)}:k.contains=function(){return!1},k.isXML=function(a){var b=(a?a.ownerDocument||a:0).documentElement;return b?b.nodeName!=="HTML":!1};var v=function(a,b){var c,d=[],e="",f=b.nodeType?[b]:b;while(c=l.match.PSEUDO.exec(a))e+=c[0],a=a.replace(l.match.PSEUDO,"");a=l.relative[a]?a+"*":a;for(var g=0,h=f.length;g<h;g++)k(a,f[g],d);return k.filter(e,d)};d.find=k,d.expr=k.selectors,d.expr[":"]=d.expr.filters,d.unique=k.uniqueSort,d.text=k.getText,d.isXMLDoc=k.isXML,d.contains=k.contains}();var G=/Until$/,H=/^(?:parents|prevUntil|prevAll)/,I=/,/,J=/^.[^:#\[\.,]*$/,K=Array.prototype.slice,L=d.expr.match.POS,M={children:!0,contents:!0,next:!0,prev:!0};d.fn.extend({find:function(a){var b=this.pushStack("","find",a),c=0;for(var e=0,f=this.length;e<f;e++){c=b.length,d.find(a,this[e],b);if(e>0)for(var g=c;g<b.length;g++)for(var h=0;h<c;h++)if(b[h]===b[g]){b.splice(g--,1);break}}return b},has:function(a){var b=d(a);return this.filter(function(){for(var a=0,c=b.length;a<c;a++)if(d.contains(this,b[a]))return!0})},not:function(a){return this.pushStack(O(this,a,!1),"not",a)},filter:function(a){return this.pushStack(O(this,a,!0),"filter",a)},is:function(a){return!!a&&d.filter(a,this).length>0},closest:function(a,b){var c=[],e,f,g=this[0];if(d.isArray(a)){var h,i,j={},k=1;if(g&&a.length){for(e=0,f=a.length;e<f;e++)i=a[e],j[i]||(j[i]=d.expr.match.POS.test(i)?d(i,b||this.context):i);while(g&&g.ownerDocument&&g!==b){for(i in j)h=j[i],(h.jquery?h.index(g)>-1:d(g).is(h))&&c.push({selector:i,elem:g,level:k});g=g.parentNode,k++}}return c}var l=L.test(a)?d(a,b||this.context):null;for(e=0,f=this.length;e<f;e++){g=this[e];while(g){if(l?l.index(g)>-1:d.find.matchesSelector(g,a)){c.push(g);break}g=g.parentNode;if(!g||!g.ownerDocument||g===b)break}}c=c.length>1?d.unique(c):c;return this.pushStack(c,"closest",a)},index:function(a){if(!a||typeof a==="string")return d.inArray(this[0],a?d(a):this.parent().children());return d.inArray(a.jquery?a[0]:a,this)},add:function(a,b){var c=typeof a==="string"?d(a,b):d.makeArray(a),e=d.merge(this.get(),c);return this.pushStack(N(c[0])||N(e[0])?e:d.unique(e))},andSelf:function(){return this.add(this.prevObject)}}),d.each({parent:function(a){var b=a.parentNode;return b&&b.nodeType!==11?b:null},parents:function(a){return d.dir(a,"parentNode")},parentsUntil:function(a,b,c){return d.dir(a,"parentNode",c)},next:function(a){return d.nth(a,2,"nextSibling")},prev:function(a){return d.nth(a,2,"previousSibling")},nextAll:function(a){return d.dir(a,"nextSibling")},prevAll:function(a){return d.dir(a,"previousSibling")},nextUntil:function(a,b,c){return d.dir(a,"nextSibling",c)},prevUntil:function(a,b,c){return d.dir(a,"previousSibling",c)},siblings:function(a){return d.sibling(a.parentNode.firstChild,a)},children:function(a){return d.sibling(a.firstChild)},contents:function(a){return d.nodeName(a,"iframe")?a.contentDocument||a.contentWindow.document:d.makeArray(a.childNodes)}},function(a,b){d.fn[a]=function(c,e){var f=d.map(this,b,c),g=K.call(arguments);G.test(a)||(e=c),e&&typeof e==="string"&&(f=d.filter(e,f)),f=this.length>1&&!M[a]?d.unique(f):f,(this.length>1||I.test(e))&&H.test(a)&&(f=f.reverse());return this.pushStack(f,a,g.join(","))}}),d.extend({filter:function(a,b,c){c&&(a=":not("+a+")");return b.length===1?d.find.matchesSelector(b[0],a)?[b[0]]:[]:d.find.matches(a,b)},dir:function(a,c,e){var f=[],g=a[c];while(g&&g.nodeType!==9&&(e===b||g.nodeType!==1||!d(g).is(e)))g.nodeType===1&&f.push(g),g=g[c];return f},nth:function(a,b,c,d){b=b||1;var e=0;for(;a;a=a[c])if(a.nodeType===1&&++e===b)break;return a},sibling:function(a,b){var c=[];for(;a;a=a.nextSibling)a.nodeType===1&&a!==b&&c.push(a);return c}});var P=/ jQuery\d+="(?:\d+|null)"/g,Q=/^\s+/,R=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,S=/<([\w:]+)/,T=/<tbody/i,U=/<|&#?\w+;/,V=/<(?:script|object|embed|option|style)/i,W=/checked\s*(?:[^=]|=\s*.checked.)/i,X={option:[1,"<select multiple='multiple'>","</select>"],legend:[1,"<fieldset>","</fieldset>"],thead:[1,"<table>","</table>"],tr:[2,"<table><tbody>","</tbody></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],col:[2,"<table><tbody></tbody><colgroup>","</colgroup></table>"],area:[1,"<map>","</map>"],_default:[0,"",""]};X.optgroup=X.option,X.tbody=X.tfoot=X.colgroup=X.caption=X.thead,X.th=X.td,d.support.htmlSerialize||(X._default=[1,"div<div>","</div>"]),d.fn.extend({text:function(a){if(d.isFunction(a))return this.each(function(b){var c=d(this);c.text(a.call(this,b,c.text()))});if(typeof a!=="object"&&a!==b)return this.empty().append((this[0]&&this[0].ownerDocument||c).createTextNode(a));return d.text(this)},wrapAll:function(a){if(d.isFunction(a))return this.each(function(b){d(this).wrapAll(a.call(this,b))});if(this[0]){var b=d(a,this[0].ownerDocument).eq(0).clone(!0);this[0].parentNode&&b.insertBefore(this[0]),b.map(function(){var a=this;while(a.firstChild&&a.firstChild.nodeType===1)a=a.firstChild;return a}).append(this)}return this},wrapInner:function(a){if(d.isFunction(a))return this.each(function(b){d(this).wrapInner(a.call(this,b))});return this.each(function(){var b=d(this),c=b.contents();c.length?c.wrapAll(a):b.append(a)})},wrap:function(a){return this.each(function(){d(this).wrapAll(a)})},unwrap:function(){return this.parent().each(function(){d.nodeName(this,"body")||d(this).replaceWith(this.childNodes)}).end()},append:function(){return this.domManip(arguments,!0,function(a){this.nodeType===1&&this.appendChild(a)})},prepend:function(){return this.domManip(arguments,!0,function(a){this.nodeType===1&&this.insertBefore(a,this.firstChild)})},before:function(){if(this[0]&&this[0].parentNode)return this.domManip(arguments,!1,function(a){this.parentNode.insertBefore(a,this)});if(arguments.length){var a=d(arguments[0]);a.push.apply(a,this.toArray());return this.pushStack(a,"before",arguments)}},after:function(){if(this[0]&&this[0].parentNode)return this.domManip(arguments,!1,function(a){this.parentNode.insertBefore(a,this.nextSibling)});if(arguments.length){var a=this.pushStack(this,"after",arguments);a.push.apply(a,d(arguments[0]).toArray());return a}},remove:function(a,b){for(var c=0,e;(e=this[c])!=null;c++)if(!a||d.filter(a,[e]).length)!b&&e.nodeType===1&&(d.cleanData(e.getElementsByTagName("*")),d.cleanData([e])),e.parentNode&&e.parentNode.removeChild(e);return this},empty:function(){for(var a=0,b;(b=this[a])!=null;a++){b.nodeType===1&&d.cleanData(b.getElementsByTagName("*"));while(b.firstChild)b.removeChild(b.firstChild)}return this},clone:function(a,b){a=a==null?!1:a,b=b==null?a:b;return this.map(function(){return d.clone(this,a,b)})},html:function(a){if(a===b)return this[0]&&this[0].nodeType===1?this[0].innerHTML.replace(P,""):null;if(typeof a!=="string"||V.test(a)||!d.support.leadingWhitespace&&Q.test(a)||X[(S.exec(a)||["",""])[1].toLowerCase()])d.isFunction(a)?this.each(function(b){var c=d(this);c.html(a.call(this,b,c.html()))}):this.empty().append(a);else{a=a.replace(R,"<$1></$2>");try{for(var c=0,e=this.length;c<e;c++)this[c].nodeType===1&&(d.cleanData(this[c].getElementsByTagName("*")),this[c].innerHTML=a)}catch(f){this.empty().append(a)}}return this},replaceWith:function(a){if(this[0]&&this[0].parentNode){if(d.isFunction(a))return this.each(function(b){var c=d(this),e=c.html();c.replaceWith(a.call(this,b,e))});typeof a!=="string"&&(a=d(a).detach());return this.each(function(){var b=this.nextSibling,c=this.parentNode;d(this).remove(),b?d(b).before(a):d(c).append(a)})}return this.pushStack(d(d.isFunction(a)?a():a),"replaceWith",a)},detach:function(a){return this.remove(a,!0)},domManip:function(a,c,e){var f,g,h,i,j=a[0],k=[];if(!d.support.checkClone&&arguments.length===3&&typeof j==="string"&&W.test(j))return this.each(function(){d(this).domManip(a,c,e,!0)});if(d.isFunction(j))return this.each(function(f){var g=d(this);a[0]=j.call(this,f,c?g.html():b),g.domManip(a,c,e)});if(this[0]){i=j&&j.parentNode,d.support.parentNode&&i&&i.nodeType===11&&i.childNodes.length===this.length?f={fragment:i}:f=d.buildFragment(a,this,k),h=f.fragment,h.childNodes.length===1?g=h=h.firstChild:g=h.firstChild;if(g){c=c&&d.nodeName(g,"tr");for(var l=0,m=this.length,n=m-1;l<m;l++)e.call(c?Y(this[l],g):this[l],f.cacheable||m>1&&l<n?d.clone(h,!0,!0):h)}k.length&&d.each(k,ba)}return this}}),d.buildFragment=function(a,b,e){var f,g,h,i=b&&b[0]?b[0].ownerDocument||b[0]:c;a.length===1&&typeof a[0]==="string"&&a[0].length<512&&i===c&&a[0].charAt(0)==="<"&&!V.test(a[0])&&(d.support.checkClone||!W.test(a[0]))&&(g=!0,h=d.fragments[a[0]],h&&(h!==1&&(f=h))),f||(f=i.createDocumentFragment(),d.clean(a,i,f,e)),g&&(d.fragments[a[0]]=h?f:1);return{fragment:f,cacheable:g}},d.fragments={},d.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(a,b){d.fn[a]=function(c){var e=[],f=d(c),g=this.length===1&&this[0].parentNode;if(g&&g.nodeType===11&&g.childNodes.length===1&&f.length===1){f[b](this[0]);return this}for(var h=0,i=f.length;h<i;h++){var j=(h>0?this.clone(!0):this).get();d(f[h])[b](j),e=e.concat(j)}return this.pushStack(e,a,f.selector)}}),d.extend({clone:function(a,b,c){var e=a.cloneNode(!0),f,g,h;if((!d.support.noCloneEvent||!d.support.noCloneChecked)&&(a.nodeType===1||a.nodeType===11)&&!d.isXMLDoc(a)){$(a,e),f=_(a),g=_(e);for(h=0;f[h];++h)$(f[h],g[h])}if(b){Z(a,e);if(c){f=_(a),g=_(e);for(h=0;f[h];++h)Z(f[h],g[h])}}return e},clean:function(a,b,e,f){b=b||c,typeof b.createElement==="undefined"&&(b=b.ownerDocument||b[0]&&b[0].ownerDocument||c);var g=[];for(var h=0,i;(i=a[h])!=null;h++){typeof i==="number"&&(i+="");if(!i)continue;if(typeof i!=="string"||U.test(i)){if(typeof i==="string"){i=i.replace(R,"<$1></$2>");var j=(S.exec(i)||["",""])[1].toLowerCase(),k=X[j]||X._default,l=k[0],m=b.createElement("div");m.innerHTML=k[1]+i+k[2];while(l--)m=m.lastChild;if(!d.support.tbody){var n=T.test(i),o=j==="table"&&!n?m.firstChild&&m.firstChild.childNodes:k[1]==="<table>"&&!n?m.childNodes:[];for(var p=o.length-1;p>=0;--p)d.nodeName(o[p],"tbody")&&!o[p].childNodes.length&&o[p].parentNode.removeChild(o[p])}!d.support.leadingWhitespace&&Q.test(i)&&m.insertBefore(b.createTextNode(Q.exec(i)[0]),m.firstChild),i=m.childNodes}}else i=b.createTextNode(i);i.nodeType?g.push(i):g=d.merge(g,i)}if(e)for(h=0;g[h];h++)!f||!d.nodeName(g[h],"script")||g[h].type&&g[h].type.toLowerCase()!=="text/javascript"?(g[h].nodeType===1&&g.splice.apply(g,[h+1,0].concat(d.makeArray(g[h].getElementsByTagName("script")))),e.appendChild(g[h])):f.push(g[h].parentNode?g[h].parentNode.removeChild(g[h]):g[h]);return g},cleanData:function(a){var b,c,e=d.cache,f=d.expando,g=d.event.special,h=d.support.deleteExpando;for(var i=0,j;(j=a[i])!=null;i++){if(j.nodeName&&d.noData[j.nodeName.toLowerCase()])continue;c=j[d.expando];if(c){b=e[c]&&e[c][f];if(b&&b.events){for(var k in b.events)g[k]?d.event.remove(j,k):d.removeEvent(j,k,b.handle);b.handle&&(b.handle.elem=null)}h?delete j[d.expando]:j.removeAttribute&&j.removeAttribute(d.expando),delete e[c]}}}});var bb=/alpha\([^)]*\)/i,bc=/opacity=([^)]*)/,bd=/-([a-z])/ig,be=/([A-Z])/g,bf=/^-?\d+(?:px)?$/i,bg=/^-?\d/,bh={position:"absolute",visibility:"hidden",display:"block"},bi=["Left","Right"],bj=["Top","Bottom"],bk,bl,bm,bn=function(a,b){return b.toUpperCase()};d.fn.css=function(a,c){if(arguments.length===2&&c===b)return this;return d.access(this,a,c,!0,function(a,c,e){return e!==b?d.style(a,c,e):d.css(a,c)})},d.extend({cssHooks:{opacity:{get:function(a,b){if(b){var c=bk(a,"opacity","opacity");return c===""?"1":c}return a.style.opacity}}},cssNumber:{zIndex:!0,fontWeight:!0,opacity:!0,zoom:!0,lineHeight:!0},cssProps:{"float":d.support.cssFloat?"cssFloat":"styleFloat"},style:function(a,c,e,f){if(a&&a.nodeType!==3&&a.nodeType!==8&&a.style){var g,h=d.camelCase(c),i=a.style,j=d.cssHooks[h];c=d.cssProps[h]||h;if(e===b){if(j&&"get"in j&&(g=j.get(a,!1,f))!==b)return g;return i[c]}if(typeof e==="number"&&isNaN(e)||e==null)return;typeof e==="number"&&!d.cssNumber[h]&&(e+="px");if(!j||!("set"in j)||(e=j.set(a,e))!==b)try{i[c]=e}catch(k){}}},css:function(a,c,e){var f,g=d.camelCase(c),h=d.cssHooks[g];c=d.cssProps[g]||g;if(h&&"get"in h&&(f=h.get(a,!0,e))!==b)return f;if(bk)return bk(a,c,g)},swap:function(a,b,c){var d={};for(var e in b)d[e]=a.style[e],a.style[e]=b[e];c.call(a);for(e in b)a.style[e]=d[e]},camelCase:function(a){return a.replace(bd,bn)}}),d.curCSS=d.css,d.each(["height","width"],function(a,b){d.cssHooks[b]={get:function(a,c,e){var f;if(c){a.offsetWidth!==0?f=bo(a,b,e):d.swap(a,bh,function(){f=bo(a,b,e)});if(f<=0){f=bk(a,b,b),f==="0px"&&bm&&(f=bm(a,b,b));if(f!=null)return f===""||f==="auto"?"0px":f}if(f<0||f==null){f=a.style[b];return f===""||f==="auto"?"0px":f}return typeof f==="string"?f:f+"px"}},set:function(a,b){if(!bf.test(b))return b;b=parseFloat(b);if(b>=0)return b+"px"}}}),d.support.opacity||(d.cssHooks.opacity={get:function(a,b){return bc.test((b&&a.currentStyle?a.currentStyle.filter:a.style.filter)||"")?parseFloat(RegExp.$1)/100+"":b?"1":""},set:function(a,b){var c=a.style;c.zoom=1;var e=d.isNaN(b)?"":"alpha(opacity="+b*100+")",f=c.filter||"";c.filter=bb.test(f)?f.replace(bb,e):c.filter+" "+e}}),c.defaultView&&c.defaultView.getComputedStyle&&(bl=function(a,c,e){var f,g,h;e=e.replace(be,"-$1").toLowerCase();if(!(g=a.ownerDocument.defaultView))return b;if(h=g.getComputedStyle(a,null))f=h.getPropertyValue(e),f===""&&!d.contains(a.ownerDocument.documentElement,a)&&(f=d.style(a,e));return f}),c.documentElement.currentStyle&&(bm=function(a,b){var c,d=a.currentStyle&&a.currentStyle[b],e=a.runtimeStyle&&a.runtimeStyle[b],f=a.style;!bf.test(d)&&bg.test(d)&&(c=f.left,e&&(a.runtimeStyle.left=a.currentStyle.left),f.left=b==="fontSize"?"1em":d||0,d=f.pixelLeft+"px",f.left=c,e&&(a.runtimeStyle.left=e));return d===""?"auto":d}),bk=bl||bm,d.expr&&d.expr.filters&&(d.expr.filters.hidden=function(a){var b=a.offsetWidth,c=a.offsetHeight;return b===0&&c===0||!d.support.reliableHiddenOffsets&&(a.style.display||d.css(a,"display"))==="none"},d.expr.filters.visible=function(a){return!d.expr.filters.hidden(a)});var bp=/%20/g,bq=/\[\]$/,br=/\r?\n/g,bs=/#.*$/,bt=/^(.*?):[ \t]*([^\r\n]*)\r?$/mg,bu=/^(?:color|date|datetime|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i,bv=/(?:^file|^widget|\-extension):$/,bw=/^(?:GET|HEAD)$/,bx=/^\/\//,by=/\?/,bz=/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,bA=/^(?:select|textarea)/i,bB=/\s+/,bC=/([?&])_=[^&]*/,bD=/(^|\-)([a-z])/g,bE=function(a,b,c){return b+c.toUpperCase()},bF=/^([\w\+\.\-]+:)\/\/([^\/?#:]*)(?::(\d+))?/,bG=d.fn.load,bH={},bI={},bJ,bK;try{bJ=c.location.href}catch(bL){bJ=c.createElement("a"),bJ.href="",bJ=bJ.href}bK=bF.exec(bJ.toLowerCase()),d.fn.extend({load:function(a,c,e){if(typeof a!=="string"&&bG)return bG.apply(this,arguments);if(!this.length)return this;var f=a.indexOf(" ");if(f>=0){var g=a.slice(f,a.length);a=a.slice(0,f)}var h="GET";c&&(d.isFunction(c)?(e=c,c=b):typeof c==="object"&&(c=d.param(c,d.ajaxSettings.traditional),h="POST"));var i=this;d.ajax({url:a,type:h,dataType:"html",data:c,complete:function(a,b,c){c=a.responseText,a.isResolved()&&(a.done(function(a){c=a}),i.html(g?d("<div>").append(c.replace(bz,"")).find(g):c)),e&&i.each(e,[c,b,a])}});return this},serialize:function(){return d.param(this.serializeArray())},serializeArray:function(){return this.map(function(){return this.elements?d.makeArray(this.elements):this}).filter(function(){return this.name&&!this.disabled&&(this.checked||bA.test(this.nodeName)||bu.test(this.type))}).map(function(a,b){var c=d(this).val();return c==null?null:d.isArray(c)?d.map(c,function(a,c){return{name:b.name,value:a.replace(br,"\r\n")}}):{name:b.name,value:c.replace(br,"\r\n")}}).get()}}),d.each("ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split(" "),function(a,b){d.fn[b]=function(a){return this.bind(b,a)}}),d.each(["get","post"],function(a,c){d[c]=function(a,e,f,g){d.isFunction(e)&&(g=g||f,f=e,e=b);return d.ajax({type:c,url:a,data:e,success:f,dataType:g})}}),d.extend({getScript:function(a,c){return d.get(a,b,c,"script")},getJSON:function(a,b,c){return d.get(a,b,c,"json")},ajaxSetup:function(a,b){b?d.extend(!0,a,d.ajaxSettings,b):(b=a,a=d.extend(!0,d.ajaxSettings,b));for(var c in {context:1,url:1})c in b?a[c]=b[c]:c in d.ajaxSettings&&(a[c]=d.ajaxSettings[c]);return a},ajaxSettings:{url:bJ,isLocal:bv.test(bK[1]),global:!0,type:"GET",contentType:"application/x-www-form-urlencoded",processData:!0,async:!0,accepts:{xml:"application/xml, text/xml",html:"text/html",text:"text/plain",json:"application/json, text/javascript","*":"*/*"},contents:{xml:/xml/,html:/html/,json:/json/},responseFields:{xml:"responseXML",text:"responseText"},converters:{"* text":a.String,"text html":!0,"text json":d.parseJSON,"text xml":d.parseXML}},ajaxPrefilter:bM(bH),ajaxTransport:bM(bI),ajax:function(a,c){function v(a,c,l,n){if(r!==2){r=2,p&&clearTimeout(p),o=b,m=n||"",u.readyState=a?4:0;var q,t,v,w=l?bP(e,u,l):b,x,y;if(a>=200&&a<300||a===304){if(e.ifModified){if(x=u.getResponseHeader("Last-Modified"))d.lastModified[k]=x;if(y=u.getResponseHeader("Etag"))d.etag[k]=y}if(a===304)c="notmodified",q=!0;else try{t=bQ(e,w),c="success",q=!0}catch(z){c="parsererror",v=z}}else{v=c;if(!c||a)c="error",a<0&&(a=0)}u.status=a,u.statusText=c,q?h.resolveWith(f,[t,c,u]):h.rejectWith(f,[u,c,v]),u.statusCode(j),j=b,s&&g.trigger("ajax"+(q?"Success":"Error"),[u,e,q?t:v]),i.resolveWith(f,[u,c]),s&&(g.trigger("ajaxComplete",[u,e]),--d.active||d.event.trigger("ajaxStop"))}}typeof a==="object"&&(c=a,a=b),c=c||{};var e=d.ajaxSetup({},c),f=e.context||e,g=f!==e&&(f.nodeType||f instanceof d)?d(f):d.event,h=d.Deferred(),i=d._Deferred(),j=e.statusCode||{},k,l={},m,n,o,p,q,r=0,s,t,u={readyState:0,setRequestHeader:function(a,b){r||(l[a.toLowerCase().replace(bD,bE)]=b);return this},getAllResponseHeaders:function(){return r===2?m:null},getResponseHeader:function(a){var c;if(r===2){if(!n){n={};while(c=bt.exec(m))n[c[1].toLowerCase()]=c[2]}c=n[a.toLowerCase()]}return c===b?null:c},overrideMimeType:function(a){r||(e.mimeType=a);return this},abort:function(a){a=a||"abort",o&&o.abort(a),v(0,a);return this}};h.promise(u),u.success=u.done,u.error=u.fail,u.complete=i.done,u.statusCode=function(a){if(a){var b;if(r<2)for(b in a)j[b]=[j[b],a[b]];else b=a[u.status],u.then(b,b)}return this},e.url=((a||e.url)+"").replace(bs,"").replace(bx,bK[1]+"//"),e.dataTypes=d.trim(e.dataType||"*").toLowerCase().split(bB),e.crossDomain||(q=bF.exec(e.url.toLowerCase()),e.crossDomain=q&&(q[1]!=bK[1]||q[2]!=bK[2]||(q[3]||(q[1]==="http:"?80:443))!=(bK[3]||(bK[1]==="http:"?80:443)))),e.data&&e.processData&&typeof e.data!=="string"&&(e.data=d.param(e.data,e.traditional)),bN(bH,e,c,u);if(r===2)return!1;s=e.global,e.type=e.type.toUpperCase(),e.hasContent=!bw.test(e.type),s&&d.active++===0&&d.event.trigger("ajaxStart");if(!e.hasContent){e.data&&(e.url+=(by.test(e.url)?"&":"?")+e.data),k=e.url;if(e.cache===!1){var w=d.now(),x=e.url.replace(bC,"$1_="+w);e.url=x+(x===e.url?(by.test(e.url)?"&":"?")+"_="+w:"")}}if(e.data&&e.hasContent&&e.contentType!==!1||c.contentType)l["Content-Type"]=e.contentType;e.ifModified&&(k=k||e.url,d.lastModified[k]&&(l["If-Modified-Since"]=d.lastModified[k]),d.etag[k]&&(l["If-None-Match"]=d.etag[k])),l.Accept=e.dataTypes[0]&&e.accepts[e.dataTypes[0]]?e.accepts[e.dataTypes[0]]+(e.dataTypes[0]!=="*"?", */*; q=0.01":""):e.accepts["*"];for(t in e.headers)u.setRequestHeader(t,e.headers[t]);if(e.beforeSend&&(e.beforeSend.call(f,u,e)===!1||r===2)){u.abort();return!1}for(t in {success:1,error:1,complete:1})u[t](e[t]);o=bN(bI,e,c,u);if(o){u.readyState=1,s&&g.trigger("ajaxSend",[u,e]),e.async&&e.timeout>0&&(p=setTimeout(function(){u.abort("timeout")},e.timeout));try{r=1,o.send(l,v)}catch(y){status<2?v(-1,y):d.error(y)}}else v(-1,"No Transport");return u},param:function(a,c){var e=[],f=function(a,b){b=d.isFunction(b)?b():b,e[e.length]=encodeURIComponent(a)+"="+encodeURIComponent(b)};c===b&&(c=d.ajaxSettings.traditional);if(d.isArray(a)||a.jquery&&!d.isPlainObject(a))d.each(a,function(){f(this.name,this.value)});else for(var g in a)bO(g,a[g],c,f);return e.join("&").replace(bp,"+")}}),d.extend({active:0,lastModified:{},etag:{}});var bR=d.now(),bS=/(\=)\?(&|$)|()\?\?()/i;d.ajaxSetup({jsonp:"callback",jsonpCallback:function(){return d.expando+"_"+bR++}}),d.ajaxPrefilter("json jsonp",function(b,c,e){var f=typeof b.data==="string";if(b.dataTypes[0]==="jsonp"||c.jsonpCallback||c.jsonp!=null||b.jsonp!==!1&&(bS.test(b.url)||f&&bS.test(b.data))){var g,h=b.jsonpCallback=d.isFunction(b.jsonpCallback)?b.jsonpCallback():b.jsonpCallback,i=a[h],j=b.url,k=b.data,l="$1"+h+"$2",m=function(){a[h]=i,g&&d.isFunction(i)&&a[h](g[0])};b.jsonp!==!1&&(j=j.replace(bS,l),b.url===j&&(f&&(k=k.replace(bS,l)),b.data===k&&(j+=(/\?/.test(j)?"&":"?")+b.jsonp+"="+h))),b.url=j,b.data=k,a[h]=function(a){g=[a]},e.then(m,m),b.converters["script json"]=function(){g||d.error(h+" was not called");return g[0]},b.dataTypes[0]="json";return"script"}}),d.ajaxSetup({accepts:{script:"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},contents:{script:/javascript|ecmascript/},converters:{"text script":function(a){d.globalEval(a);return a}}}),d.ajaxPrefilter("script",function(a){a.cache===b&&(a.cache=!1),a.crossDomain&&(a.type="GET",a.global=!1)}),d.ajaxTransport("script",function(a){if(a.crossDomain){var d,e=c.head||c.getElementsByTagName("head")[0]||c.documentElement;return{send:function(f,g){d=c.createElement("script"),d.async="async",a.scriptCharset&&(d.charset=a.scriptCharset),d.src=a.url,d.onload=d.onreadystatechange=function(a,c){if(!d.readyState||/loaded|complete/.test(d.readyState))d.onload=d.onreadystatechange=null,e&&d.parentNode&&e.removeChild(d),d=b,c||g(200,"success")},e.insertBefore(d,e.firstChild)},abort:function(){d&&d.onload(0,1)}}}});var bT=d.now(),bU,bV;d.ajaxSettings.xhr=a.ActiveXObject?function(){return!this.isLocal&&bX()||bY()}:bX,bV=d.ajaxSettings.xhr(),d.support.ajax=!!bV,d.support.cors=bV&&"withCredentials"in bV,bV=b,d.support.ajax&&d.ajaxTransport(function(a){if(!a.crossDomain||d.support.cors){var c;return{send:function(e,f){var g=a.xhr(),h,i;a.username?g.open(a.type,a.url,a.async,a.username,a.password):g.open(a.type,a.url,a.async);if(a.xhrFields)for(i in a.xhrFields)g[i]=a.xhrFields[i];a.mimeType&&g.overrideMimeType&&g.overrideMimeType(a.mimeType),(!a.crossDomain||a.hasContent)&&!e["X-Requested-With"]&&(e["X-Requested-With"]="XMLHttpRequest");try{for(i in e)g.setRequestHeader(i,e[i])}catch(j){}g.send(a.hasContent&&a.data||null),c=function(e,i){var j,k,l,m,n;try{if(c&&(i||g.readyState===4)){c=b,h&&(g.onreadystatechange=d.noop,delete bU[h]);if(i)g.readyState!==4&&g.abort();else{j=g.status,l=g.getAllResponseHeaders(),m={},n=g.responseXML,n&&n.documentElement&&(m.xml=n),m.text=g.responseText;try{k=g.statusText}catch(o){k=""}j||!a.isLocal||a.crossDomain?j===1223&&(j=204):j=m.text?200:404}}}catch(p){i||f(-1,p)}m&&f(j,k,m,l)},a.async&&g.readyState!==4?(bU||(bU={},bW()),h=bT++,g.onreadystatechange=bU[h]=c):c()},abort:function(){c&&c(0,1)}}}});var bZ={},b$=/^(?:toggle|show|hide)$/,b_=/^([+\-]=)?([\d+.\-]+)([a-z%]*)$/i,ca,cb=[["height","marginTop","marginBottom","paddingTop","paddingBottom"],["width","marginLeft","marginRight","paddingLeft","paddingRight"],["opacity"]];d.fn.extend({show:function(a,b,c){var e,f;if(a||a===0)return this.animate(cc("show",3),a,b,c);for(var g=0,h=this.length;g<h;g++)e=this[g],f=e.style.display,!d._data(e,"olddisplay")&&f==="none"&&(f=e.style.display=""),f===""&&d.css(e,"display")==="none"&&d._data(e,"olddisplay",cd(e.nodeName));for(g=0;g<h;g++){e=this[g],f=e.style.display;if(f===""||f==="none")e.style.display=d._data(e,"olddisplay")||""}return this},hide:function(a,b,c){if(a||a===0)return this.animate(cc("hide",3),a,b,c);for(var e=0,f=this.length;e<f;e++){var g=d.css(this[e],"display");g!=="none"&&!d._data(this[e],"olddisplay")&&d._data(this[e],"olddisplay",g)}for(e=0;e<f;e++)this[e].style.display="none";return this},_toggle:d.fn.toggle,toggle:function(a,b,c){var e=typeof a==="boolean";d.isFunction(a)&&d.isFunction(b)?this._toggle.apply(this,arguments):a==null||e?this.each(function(){var b=e?a:d(this).is(":hidden");d(this)[b?"show":"hide"]()}):this.animate(cc("toggle",3),a,b,c);return this},fadeTo:function(a,b,c,d){return this.filter(":hidden").css("opacity",0).show().end().animate({opacity:b},a,c,d)},animate:function(a,b,c,e){var f=d.speed(b,c,e);if(d.isEmptyObject(a))return this.each(f.complete);return this[f.queue===!1?"each":"queue"](function(){var b=d.extend({},f),c,e=this.nodeType===1,g=e&&d(this).is(":hidden"),h=this;for(c in a){var i=d.camelCase(c);c!==i&&(a[i]=a[c],delete a[c],c=i);if(a[c]==="hide"&&g||a[c]==="show"&&!g)return b.complete.call(this);if(e&&(c==="height"||c==="width")){b.overflow=[this.style.overflow,this.style.overflowX,this.style.overflowY];if(d.css(this,"display")==="inline"&&d.css(this,"float")==="none")if(d.support.inlineBlockNeedsLayout){var j=cd(this.nodeName);j==="inline"?this.style.display="inline-block":(this.style.display="inline",this.style.zoom=1)}else this.style.display="inline-block"}d.isArray(a[c])&&((b.specialEasing=b.specialEasing||{})[c]=a[c][1],a[c]=a[c][0])}b.overflow!=null&&(this.style.overflow="hidden"),b.curAnim=d.extend({},a),d.each(a,function(c,e){var f=new d.fx(h,b,c);if(b$.test(e))f[e==="toggle"?g?"show":"hide":e](a);else{var i=b_.exec(e),j=f.cur();if(i){var k=parseFloat(i[2]),l=i[3]||(d.cssNumber[c]?"":"px");l!=="px"&&(d.style(h,c,(k||1)+l),j=(k||1)/f.cur()*j,d.style(h,c,j+l)),i[1]&&(k=(i[1]==="-="?-1:1)*k+j),f.custom(j,k,l)}else f.custom(j,e,"")}});return!0})},stop:function(a,b){var c=d.timers;a&&this.queue([]),this.each(function(){for(var a=c.length-1;a>=0;a--)c[a].elem===this&&(b&&c[a](!0),c.splice(a,1))}),b||this.dequeue();return this}}),d.each({slideDown:cc("show",1),slideUp:cc("hide",1),slideToggle:cc("toggle",1),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"},fadeToggle:{opacity:"toggle"}},function(a,b){d.fn[a]=function(a,c,d){return this.animate(b,a,c,d)}}),d.extend({speed:function(a,b,c){var e=a&&typeof a==="object"?d.extend({},a):{complete:c||!c&&b||d.isFunction(a)&&a,duration:a,easing:c&&b||b&&!d.isFunction(b)&&b};e.duration=d.fx.off?0:typeof e.duration==="number"?e.duration:e.duration in d.fx.speeds?d.fx.speeds[e.duration]:d.fx.speeds._default,e.old=e.complete,e.complete=function(){e.queue!==!1&&d(this).dequeue(),d.isFunction(e.old)&&e.old.call(this)};return e},easing:{linear:function(a,b,c,d){return c+d*a},swing:function(a,b,c,d){return(-Math.cos(a*Math.PI)/2+.5)*d+c}},timers:[],fx:function(a,b,c){this.options=b,this.elem=a,this.prop=c,b.orig||(b.orig={})}}),d.fx.prototype={update:function(){this.options.step&&this.options.step.call(this.elem,this.now,this),(d.fx.step[this.prop]||d.fx.step._default)(this)},cur:function(){if(this.elem[this.prop]!=null&&(!this.elem.style||this.elem.style[this.prop]==null))return this.elem[this.prop];var a,b=d.css(this.elem,this.prop);return isNaN(a=parseFloat(b))?!b||b==="auto"?0:b:a},custom:function(a,b,c){function g(a){return e.step(a)}var e=this,f=d.fx;this.startTime=d.now(),this.start=a,this.end=b,this.unit=c||this.unit||(d.cssNumber[this.prop]?"":"px"),this.now=this.start,this.pos=this.state=0,g.elem=this.elem,g()&&d.timers.push(g)&&!ca&&(ca=setInterval(f.tick,f.interval))},show:function(){this.options.orig[this.prop]=d.style(this.elem,this.prop),this.options.show=!0,this.custom(this.prop==="width"||this.prop==="height"?1:0,this.cur()),d(this.elem).show()},hide:function(){this.options.orig[this.prop]=d.style(this.elem,this.prop),this.options.hide=!0,this.custom(this.cur(),0)},step:function(a){var b=d.now(),c=!0;if(a||b>=this.options.duration+this.startTime){this.now=this.end,this.pos=this.state=1,this.update(),this.options.curAnim[this.prop]=!0;for(var e in this.options.curAnim)this.options.curAnim[e]!==!0&&(c=!1);if(c){if(this.options.overflow!=null&&!d.support.shrinkWrapBlocks){var f=this.elem,g=this.options;d.each(["","X","Y"],function(a,b){f.style["overflow"+b]=g.overflow[a]})}this.options.hide&&d(this.elem).hide();if(this.options.hide||this.options.show)for(var h in this.options.curAnim)d.style(this.elem,h,this.options.orig[h]);this.options.complete.call(this.elem)}return!1}var i=b-this.startTime;this.state=i/this.options.duration;var j=this.options.specialEasing&&this.options.specialEasing[this.prop],k=this.options.easing||(d.easing.swing?"swing":"linear");this.pos=d.easing[j||k](this.state,i,0,1,this.options.duration),this.now=this.start+(this.end-this.start)*this.pos,this.update();return!0}},d.extend(d.fx,{tick:function(){var a=d.timers;for(var b=0;b<a.length;b++)a[b]()||a.splice(b--,1);a.length||d.fx.stop()},interval:13,stop:function(){clearInterval(ca),ca=null},speeds:{slow:600,fast:200,_default:400},step:{opacity:function(a){d.style(a.elem,"opacity",a.now)},_default:function(a){a.elem.style&&a.elem.style[a.prop]!=null?a.elem.style[a.prop]=(a.prop==="width"||a.prop==="height"?Math.max(0,a.now):a.now)+a.unit:a.elem[a.prop]=a.now}}}),d.expr&&d.expr.filters&&(d.expr.filters.animated=function(a){return d.grep(d.timers,function(b){return a===b.elem}).length});var ce=/^t(?:able|d|h)$/i,cf=/^(?:body|html)$/i;"getBoundingClientRect"in c.documentElement?d.fn.offset=function(a){var b=this[0],c;if(a)return this.each(function(b){d.offset.setOffset(this,a,b)});if(!b||!b.ownerDocument)return null;if(b===b.ownerDocument.body)return d.offset.bodyOffset(b);try{c=b.getBoundingClientRect()}catch(e){}var f=b.ownerDocument,g=f.documentElement;if(!c||!d.contains(g,b))return c?{top:c.top,left:c.left}:{top:0,left:0};var h=f.body,i=cg(f),j=g.clientTop||h.clientTop||0,k=g.clientLeft||h.clientLeft||0,l=i.pageYOffset||d.support.boxModel&&g.scrollTop||h.scrollTop,m=i.pageXOffset||d.support.boxModel&&g.scrollLeft||h.scrollLeft,n=c.top+l-j,o=c.left+m-k;return{top:n,left:o}}:d.fn.offset=function(a){var b=this[0];if(a)return this.each(function(b){d.offset.setOffset(this,a,b)});if(!b||!b.ownerDocument)return null;if(b===b.ownerDocument.body)return d.offset.bodyOffset(b);d.offset.initialize();var c,e=b.offsetParent,f=b,g=b.ownerDocument,h=g.documentElement,i=g.body,j=g.defaultView,k=j?j.getComputedStyle(b,null):b.currentStyle,l=b.offsetTop,m=b.offsetLeft;while((b=b.parentNode)&&b!==i&&b!==h){if(d.offset.supportsFixedPosition&&k.position==="fixed")break;c=j?j.getComputedStyle(b,null):b.currentStyle,l-=b.scrollTop,m-=b.scrollLeft,b===e&&(l+=b.offsetTop,m+=b.offsetLeft,d.offset.doesNotAddBorder&&(!d.offset.doesAddBorderForTableAndCells||!ce.test(b.nodeName))&&(l+=parseFloat(c.borderTopWidth)||0,m+=parseFloat(c.borderLeftWidth)||0),f=e,e=b.offsetParent),d.offset.subtractsBorderForOverflowNotVisible&&c.overflow!=="visible"&&(l+=parseFloat(c.borderTopWidth)||0,m+=parseFloat(c.borderLeftWidth)||0),k=c}if(k.position==="relative"||k.position==="static")l+=i.offsetTop,m+=i.offsetLeft;d.offset.supportsFixedPosition&&k.position==="fixed"&&(l+=Math.max(h.scrollTop,i.scrollTop),m+=Math.max(h.scrollLeft,i.scrollLeft));return{top:l,left:m}},d.offset={initialize:function(){var a=c.body,b=c.createElement("div"),e,f,g,h,i=parseFloat(d.css(a,"marginTop"))||0,j="<div style='position:absolute;top:0;left:0;margin:0;border:5px solid #000;padding:0;width:1px;height:1px;'><div></div></div><table style='position:absolute;top:0;left:0;margin:0;border:5px solid #000;padding:0;width:1px;height:1px;' cellpadding='0' cellspacing='0'><tr><td></td></tr></table>";d.extend(b.style,{position:"absolute",top:0,left:0,margin:0,border:0,width:"1px",height:"1px",visibility:"hidden"}),b.innerHTML=j,a.insertBefore(b,a.firstChild),e=b.firstChild,f=e.firstChild,h=e.nextSibling.firstChild.firstChild,this.doesNotAddBorder=f.offsetTop!==5,this.doesAddBorderForTableAndCells=h.offsetTop===5,f.style.position="fixed",f.style.top="20px",this.supportsFixedPosition=f.offsetTop===20||f.offsetTop===15,f.style.position=f.style.top="",e.style.overflow="hidden",e.style.position="relative",this.subtractsBorderForOverflowNotVisible=f.offsetTop===-5,this.doesNotIncludeMarginInBodyOffset=a.offsetTop!==i,a.removeChild(b),a=b=e=f=g=h=null,d.offset.initialize=d.noop},bodyOffset:function(a){var b=a.offsetTop,c=a.offsetLeft;d.offset.initialize(),d.offset.doesNotIncludeMarginInBodyOffset&&(b+=parseFloat(d.css(a,"marginTop"))||0,c+=parseFloat(d.css(a,"marginLeft"))||0);return{top:b,left:c}},setOffset:function(a,b,c){var e=d.css(a,"position");e==="static"&&(a.style.position="relative");var f=d(a),g=f.offset(),h=d.css(a,"top"),i=d.css(a,"left"),j=e==="absolute"&&d.inArray("auto",[h,i])>-1,k={},l={},m,n;j&&(l=f.position()),m=j?l.top:parseInt(h,10)||0,n=j?l.left:parseInt(i,10)||0,d.isFunction(b)&&(b=b.call(a,c,g)),b.top!=null&&(k.top=b.top-g.top+m),b.left!=null&&(k.left=b.left-g.left+n),"using"in b?b.using.call(a,k):f.css(k)}},d.fn.extend({position:function(){if(!this[0])return null;var a=this[0],b=this.offsetParent(),c=this.offset(),e=cf.test(b[0].nodeName)?{top:0,left:0}:b.offset();c.top-=parseFloat(d.css(a,"marginTop"))||0,c.left-=parseFloat(d.css(a,"marginLeft"))||0,e.top+=parseFloat(d.css(b[0],"borderTopWidth"))||0,e.left+=parseFloat(d.css(b[0],"borderLeftWidth"))||0;return{top:c.top-e.top,left:c.left-e.left}},offsetParent:function(){return this.map(function(){var a=this.offsetParent||c.body;while(a&&(!cf.test(a.nodeName)&&d.css(a,"position")==="static"))a=a.offsetParent;return a})}}),d.each(["Left","Top"],function(a,c){var e="scroll"+c;d.fn[e]=function(c){var f=this[0],g;if(!f)return null;if(c!==b)return this.each(function(){g=cg(this),g?g.scrollTo(a?d(g).scrollLeft():c,a?c:d(g).scrollTop()):this[e]=c});g=cg(f);return g?"pageXOffset"in g?g[a?"pageYOffset":"pageXOffset"]:d.support.boxModel&&g.document.documentElement[e]||g.document.body[e]:f[e]}}),d.each(["Height","Width"],function(a,c){var e=c.toLowerCase();d.fn["inner"+c]=function(){return this[0]?parseFloat(d.css(this[0],e,"padding")):null},d.fn["outer"+c]=function(a){return this[0]?parseFloat(d.css(this[0],e,a?"margin":"border")):null},d.fn[e]=function(a){var f=this[0];if(!f)return a==null?null:this;if(d.isFunction(a))return this.each(function(b){var c=d(this);c[e](a.call(this,b,c[e]()))});if(d.isWindow(f)){var g=f.document.documentElement["client"+c];return f.document.compatMode==="CSS1Compat"&&g||f.document.body["client"+c]||g}if(f.nodeType===9)return Math.max(f.documentElement["client"+c],f.body["scroll"+c],f.documentElement["scroll"+c],f.body["offset"+c],f.documentElement["offset"+c]);if(a===b){var h=d.css(f,e),i=parseFloat(h);return d.isNaN(i)?h:i}return this.css(e,typeof a==="string"?a:a+"px")}}),a.jQuery=a.$=d})(window);


var
	  $HTML	= jQuery( 'HTML' )
	, $WIN	= jQuery( window )
	, $DOC	= jQuery( document )
	, $HEAD	= jQuery( 'HEAD' )
	, $BODY	= jQuery( document.body )
;

(function (undef)
{
	var rl = /^\s+/, rs = /\S/;

	// Faster trim
	jQuery.trim = function (str)
	{
		if( str === undef || str === null ) return '';

		str = (str+'').replace(rl, '');

		for( var i = str.length - 1; i >= 0; i-- )
		{
			if( rs.test(str.charAt(i)) )
			{
				str	= str.substring(0, i + 1);
				break;
			}
		}

		return str;
	};
})();
 

// data/ru/images/js/ru/jsCore/jquery/jquery.js end

// @build-skip

/**
 * @author	RubaXa		<trash@rubaxa.org>
 * @created	2007-11-07 20:45
 */

/*global jsPlugins*/
var
	  RubaXa		= {}	// uniq namespace
	, jsCore		= { version: 3, build: window.jsBuild }	// tmp Object
	, returnTrue	= function(){ return true; }
	, returnFalse	= function(){ return false; }
	, _array_		= Array.prototype
	, _join_		= _array_.join
	, _slice_		= _array_.slice
;

(function (root){
	var DR = [];

	root.$R			= function(r/*RequireFiles*/, c/*Callback*/){ root.domReady(function(){jsLoader.require(r, c);}); };
	root.isDomReady	= false;
	root.domReady	= function(f/*Function*/){if( f ){root.isDomReady?f():root._drLength=DR.push(f);}else{jsCore.ready();root.isDomReady=true;for(var i=0;DR[i];i++)DR[i]();}};
})(window);


(function (_slice, _fn){
	if( !_fn.bind ) _fn.bind = function (T){
		var a = _slice.call(arguments, 1), S = this;
		return function (){ return S.apply(T, a.concat(_slice.call(arguments))); };
	};
})(Array.prototype.slice, Function.prototype);



var
	  HTML	= document.getElementsByTagName('HTML')[0]
	, HEAD	= HTML.firstChild
	, BODY	= null
	, undef, undefined
	, defined = function (val, def){
					return	(typeof def == 'undefined')
								? (typeof val != 'undefined')
								: (typeof val == 'undefined' ? def : val)
							;
				}
;


// JSON.unserialize
var unserialize	= function(v/*mixed*/, d/*decode*/){
	if( typeof v == 'undefined' || typeof v != 'string' || !v ) return	v;
	else if( d ) v = decodeURIComponent(v);

	if( window.JSON && 0 )	return	JSON.parse( v );
	else if( $B.gecko )	return	new Function( "return " + v )();
	else				return	eval("(" + v + ")");
};


// @alias userAgent
window.userAgent	= navigator.userAgent.toLowerCase();
var bVer			= (userAgent.match(/.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/) || [])[1];


/** @namespace window.IS_LOCAL */

/**
 * jsCore
 */
var jsCore = {

	// < Browsers
	browser: {
		  userAgent:	userAgent
		, ver:			parseInt(bVer)
		, version:		bVer
		, safari:		/webkit/.test(userAgent)
		, webkit:		/webkit/.test(userAgent)
		, opera:		/opera/.test(userAgent)
		, msie:			/msie/i.test(userAgent)
		, mozilla:		/mozilla/.test(userAgent) && !/(compatible|webkit)/.test(userAgent)
		, gecko:		/Gecko\//.test(userAgent)
	},
	// Browsers >


	// < properties
	F:				function (a){ return a; },
	random:			Math.random(),
	time:			+new Date(),
	version:		2,
	local:			!!window.IS_LOCAL,
	loaded:			false,
	disabled:		false,
	build:			jsCore.build,
	currentId:		0,
	unloadConfirm:	0,
	_wList:			{},
	emailRegExp:	/^.+@.+\..{2,4}$/i,
	saveMode:		false,
	// properties >


	getNextId:	function (){	return	jsCore.getCounter(); },
	getCounter:	function (){	return	jsCore.currentId++; },
	getUniqId:	function (o){	return	o ? (o.uniqId ? o.uniqId : (o.uniqId = this.getUniqId())) : this.time + this.getCounter(); },
	getTimer:	function (){	return	(new Date()).getTime() - this.time; },


	$: function (id){
		var	r = typeof id == 'string' ? document.getElementById(id.replace(/^#/, '')) : ((id && id.jquery) ? id[0] : id);
		return	jsCore.saveMode && (r === null || r === undefined) ? {} : r;
	},


	apply: function (ctx, fn, a){
		var r;

		switch( a.length ){
			case 1:	r = ctx[fn](a[0]); break;
			case 2:	r = ctx[fn](a[0], a[1]); break;
			case 3:	r = ctx[fn](a[0], a[1], a[2]); break;
			case 4:	r = ctx[fn](a[0], a[1], a[2], a[3]); break;
			case 5:	r = ctx[fn](a[0], a[1], a[2], a[3], a[4]); break;
			case 6:	r = ctx[fn](a[0], a[1], a[2], a[3], a[4], a[5]); break;
			case 7:	r = ctx[fn](a[0], a[1], a[2], a[3], a[4], a[5], a[6]); break;
			default: r = ctx[fn]();
		}

		return	r;
	},


	crc32: function (str/*String*/, c/*Int*/){
		var x = 0, y = 0, crc = 0 ^ (-1), table = "00000000 77073096 EE0E612C 990951BA 076DC419 706AF48F E963A535 9E6495A3 0EDB8832 79DCB8A4 E0D5E91E 97D2D988 09B64C2B 7EB17CBD E7B82D07 90BF1D91 1DB71064 6AB020F2 F3B97148 84BE41DE 1ADAD47D 6DDDE4EB F4D4B551 83D385C7 136C9856 646BA8C0 FD62F97A 8A65C9EC 14015C4F 63066CD9 FA0F3D63 8D080DF5 3B6E20C8 4C69105E D56041E4 A2677172 3C03E4D1 4B04D447 D20D85FD A50AB56B 35B5A8FA 42B2986C DBBBC9D6 ACBCF940 32D86CE3 45DF5C75 DCD60DCF ABD13D59 26D930AC 51DE003A C8D75180 BFD06116 21B4F4B5 56B3C423 CFBA9599 B8BDA50F 2802B89E 5F058808 C60CD9B2 B10BE924 2F6F7C87 58684C11 C1611DAB B6662D3D 76DC4190 01DB7106 98D220BC EFD5102A 71B18589 06B6B51F 9FBFE4A5 E8B8D433 7807C9A2 0F00F934 9609A88E E10E9818 7F6A0DBB 086D3D2D 91646C97 E6635C01 6B6B51F4 1C6C6162 856530D8 F262004E 6C0695ED 1B01A57B 8208F4C1 F50FC457 65B0D9C6 12B7E950 8BBEB8EA FCB9887C 62DD1DDF 15DA2D49 8CD37CF3 FBD44C65 4DB26158 3AB551CE A3BC0074 D4BB30E2 4ADFA541 3DD895D7 A4D1C46D D3D6F4FB 4369E96A 346ED9FC AD678846 DA60B8D0 44042D73 33031DE5 AA0A4C5F DD0D7CC9 5005713C 270241AA BE0B1010 C90C2086 5768B525 206F85B3 B966D409 CE61E49F 5EDEF90E 29D9C998 B0D09822 C7D7A8B4 59B33D17 2EB40D81 B7BD5C3B C0BA6CAD EDB88320 9ABFB3B6 03B6E20C 74B1D29A EAD54739 9DD277AF 04DB2615 73DC1683 E3630B12 94643B84 0D6D6A3E 7A6A5AA8 E40ECF0B 9309FF9D 0A00AE27 7D079EB1 F00F9344 8708A3D2 1E01F268 6906C2FE F762575D 806567CB 196C3671 6E6B06E7 FED41B76 89D32BE0 10DA7A5A 67DD4ACC F9B9DF6F 8EBEEFF9 17B7BE43 60B08ED5 D6D6A3E8 A1D1937E 38D8C2C4 4FDFF252 D1BB67F1 A6BC5767 3FB506DD 48B2364B D80D2BDA AF0A1B4C 36034AF6 41047A60 DF60EFC3 A867DF55 316E8EEF 4669BE79 CB61B38C BC66831A 256FD2A0 5268E236 CC0C7795 BB0B4703 220216B9 5505262F C5BA3BBE B2BD0B28 2BB45A92 5CB36A04 C2D7FFA7 B5D0CF31 2CD99E8B 5BDEAE1D 9B64C2B0 EC63F226 756AA39C 026D930A 9C0906A9 EB0E363F 72076785 05005713 95BF4A82 E2B87A14 7BB12BAE 0CB61B38 92D28E9B E5D5BE0D 7CDCEFB7 0BDBDF21 86D3D2D4 F1D4E242 68DDB3F8 1FDA836E 81BE16CD F6B9265B 6FB077E1 18B74777 88085AE6 FF0F6A70 66063BCA 11010B5C 8F659EFF F862AE69 616BFFD3 166CCF45 A00AE278 D70DD2EE 4E048354 3903B3C2 A7672661 D06016F7 4969474D 3E6E77DB AED16A4A D9D65ADC 40DF0B66 37D83BF0 A9BCAE53 DEBB9EC5 47B2CF7F 30B5FFE9 BDBDF21C CABAC28A 53B39330 24B4A3A6 BAD03605 CDD70693 54DE5729 23D967BF B3667A2E C4614AB8 5D681B02 2A6F2B94 B40BBE37 C30C8EA1 5A05DF1B 2D02EF8D";

		for( var i = 0, iTop = str.length; i < iTop; i++ ){
			y	= ( crc ^ str.charCodeAt( i ) ) & 0xFF;
			x	= "0x" + table.substr( y * 9, 8 );
			crc	= ( crc >>> 8 ) ^ x;
		}

		return crc ^ (-1) + '';

	},


	each: function (o/*Object*/, fn/*Function*/, a/*isArray*/){
		if( o ){
			if( (o.constructor == Array) || a )
				for( var i = 0, n = o.length; i < n; i+=1 ) fn(i, o[i], o);
			else
				for( var i in o ) fn(i, o[i], o);
		}
	},


	extend: function (d/*dstObject*/, s/*srcObject*/){
		var v, i = 1, n = arguments.length, p, a;
		for( ; i < n; i++ ) if( a = arguments[i] )
			for( p in a ){
				if( ((v = a[p]) != null) && (typeof v != 'undefined') ){
					d[p]	= v;
				}
			}
		v	= a = null;
		return	d;
	},

	cloneObject: function (o/*Object*/){
		var c	= {};

		for( var k in o ){
			c[k]	= o[k];
		}

		return	c;
	},

	delegate: function (ctx/*Object*/, fn/*Method*/){
		var ca = _slice_.call(arguments, 2);
		if( typeof(fn) == 'string' ) fn = ctx[fn];

		return	function (){ return	fn.apply(ctx, ca.concat( _slice_.call(arguments, 0) )); }
	},


	elm: function (e/*Node*/, a/*Attribute*/, v/*Value*/)/*Node OR False*/{
		if( e ){
			if( e.jquery ) 					e	= e[0];	// is jQuery
			if( e.target || e.srcElement )	e	= (e.target || e.srcElement);	// is Event
			if( !a || (e == document.body) || !e )	return	e;	// is Body

			var _a, _v, _r = v && v.test/*is regexp*/;

			do
			{
				_v	= typeof v != 'undefined';
				_a	= e[a] || (('getAttribute' in e) && e.getAttribute(a)) || '';

				if(
					   (_v && ((_a == v) || (_a == v) || (_r && v.test(_a))))
					|| (!_v && ((_a !== '') && (_a !== null)))
				)
				{
					return	e;
				}
			}
			while( e && (e = e.parentNode) && (e !== document.body) );
		}

		return	false;
	},

	hitTest: function (x/*Float*/, y/*Float*/, c/*Object*/)
	{
		return (x >= c.x1) && (c.y1 <= y) && (x <= c.x2) && (c.y2 >= y);
	},

	wait: function (w/*Array*/, c/*Callback*/){
		if( !c || c.constructor != Function ) throw new Error('Second argument must be function in jsCore.wait or jsCore.require');
		if( typeof w  == 'string' )	w = w.split(',');

		var
			  w	= Array.filter(w, function (v)
			  		{
						if( !this._wList[v=v.toLowerCase()] ) this._wList[v] = { r: 0, l: [] };
						return	!this._wList[v].r;
					}, this)
			, i		= 0
			, _i	= 0
			, _c	= w.length
			, n , p, wc
		;

		//var s = w.join(',');
		//debug.log(s);

		if( !_c )
		{
			c();
			return;
		}
		else wc = function(o)
		{
			if( ++_i >= _c )
			{
				c(o);
			}
		};


		for( ; w[i]; i++ ){
			p	= w[i].split(':');
			n	= w[i].toLowerCase();

			this._wList[n].l.push(wc);

			if( (p[0] == 'file') || (p[0] == 'include') || (p[0] == 'require') )
			{
				jsLoader.require(p[1], wc);
			}
		}
	},


	notify: function (w, o){
		if( typeof w == 'string' ) w = w.split(',');

		var j = 0, p, n, j = w.length, _wList = this._wList;

		while( j-- ){
			p	= w[j].split(':');
			n 	= w[j].toLowerCase();

			if( !(n in _wList) ){
				_wList[n] = { r: false, l: [] };
			}

			if( p[0] != 'event' ){
				_wList[n].r = true;
			}

			if( _wList[n].l ){
				for( var i = 0, ni = this._wList[n].l.length; i < ni; i++ ){
					_wList[n].l[i](o);
				}
			}
		}
	},


	confirmUnload: function (y/*yes:Bool*/, t/*text:String*/)
	{
		if( defined(y) )
		{
			this.unloadConfirm	= y;
			window.onbeforeunload	= y ? function (){ return	(t || false); } : null;
			jsCore.notify('event:confirmUnload', y);
		}

		return	this.unloadConfirm;
	},


	error: function (m/*String*/, u/*Url*/, l/*Number*/)
	{
		debug.log('<b style="color: red;">', m, u, l, '</b>');
	},


	ready: function (f)
	{
		if( f && f.constructor == Function )
		{
			jsCore.loaded
				? f()
				: jsCore.wait('jsCore:ready', f)
			;
		}
		else
		{
			if( jsCore.loaded )	return	true;
			if( !document.body ) return setTimeout(jsCore.ready, 13);

			BODY			 = document.body;
			jsCore.isReady	 = jsCore.loaded = true;
			HTML.id			 = 'jsHtml';
			HTML.className	+= ' jsHtml';

			jsCore.notify('jsCore:ready,jsCore:loaded,document:loaded'.split(','));
		}
	},


	unload: function (f)
	{
		if( f && f.constructor == Function )
		{
			jsCore.wait('jsCore:unload', f);
		}
		else
		{
			try
			{
				jsCore.notify('jsCore:unload');

				//noinspection JSUndeclaredVariable
				window.onerror = this.loaded = HTML = HEAD = $HEAD = BODY = $BODY = null;

				jsEvent.remove(window, 'unload', jsCore.unload);
				//Interval.destroy();
				jsCore.destroy(jsLoader);
				jsCore.destroy(Registry);
				jsCore.destroy();
			}
			catch( e )
			{
				// ...
			}
		}
	},


	destroy: function (o/*Mixed*/)
	{
		if( typeof o == undefined )
		{
			window['jsLoader']	= null;
			window['jsClass']	= null;
			window['jsCore']	= null;
		}
		else
		{
			for( var k in o )
			{
				o[k]	= null; delete	o[k];
			}
			k	= null; delete	k;
			o	= null; delete	o;
		}
	},


	isEmail: function (s/*String*/)
	{
		return	this.emailRegExp.test(s);
	},


	request: function (o)
	{
		o.data	= String.toQuery(o.data);
		o.pid		= o.pid || (o.cache ? this.crc32(o.data) : jsCore.getUniqId());
		var r		= 'request:'+o.pid;


		if( !o.cache ) this._wList[r]	= { r: 0, l: [] };
		if( o.success )
		{
			jsCore.wait(r, $D(null, function (R)
			{
				if( !o.cache || (o.cache && defined(R)) ) jsCore[o.pid]	= R;
				(o.success)(jsCore[o.pid]);
			}));
		}
		if( !this._wList[r] || !this._wList[r].r )
		{
			jsLoader.file(o.url+(/\?/.test(o.url) ? '&' : '?')+'pid='+o.pid+'&'+o.data+'&_sr_=Y'+(o.cache ? '' : '&_='+jsCore.getUniqId()));
		}
	},

	namespace:	function (name/*String*/)/*Object*/
	{
		name	= name.split('.');
		var o	= window, i = 0, n = name.length;

		for( i = 0; i < n; i++ )
		{
			if( o[name[i]] === undef )
				o[name[i]]	= {};
			o	= o[name[i]];
		}

		return	o;
	},

	file: function (file, require, func)
	{
		if( arguments.length === 2 )
		{
			require();
			jsLoader.loaded(file);
		}
		else
		{
			jsLoader.require(require, function ()
			{
				func();
				jsLoader.loaded(file);
			});
		}
	}


}; // jsCore;

(function () {

	var numberChars = "0123456789",
		lowerChars = "abcdefghijklmnopqrstuvwxyz",
		upperChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
		otherChars = "`~!@#$%^&*()-_=+[{]}\\|;:'\",<.>/? ";

	function getRandomNum (lbound, ubound) {
		return (Math.floor(Math.random() * (ubound - lbound)) + lbound);
	}

	function getRandomChar (number, lower, upper, other) {
		var charSet = '';
		if (number) charSet += numberChars;
		if (lower) charSet += lowerChars;
		if (upper) charSet += upperChars;
		if (other) charSet += otherChars;
		return charSet.charAt(getRandomNum(0, charSet.length));
	}

	jsCore.getRandomHash = function (length, number, lower, upper, other) {
		for (var l=0, s=''; l<length; ++l) s += getRandomChar(number, lower, upper, other);
		return s;
	};

})();

/**
 * @aliases
 */
var
	  $E			= jsCore.extend
	, $D			= jsCore.delegate
	, $B			= jsCore.browser
	, $G			= jsCore.elm
	, $SA			= function (N, a, v){ N[a] = v; a != 'className' && N.setAttribute ? N.setAttribute(a, v) : 0; return N; }
	, $AA			= function (N, a, v){ return $SA(N, a, $GA(N, a) + v); }
	, $RA			= function (N, a, r, v){ return $SA(N, a, $GA(N, a).replace(r, v)); }
	, $DA			= function (N, a){ N[a] = null; if( !N.nodeType ) delete N[a]; (N.removeAttribute ? N.removeAttribute(a) : 0); return N; }	// drop attrubute
	, $GA			= function (e, a){ if( e !== undef ) return (typeof e[a] == 'undefined') ? e.getAttribute && e.getAttribute(a) : e[a]; }
	, $F			= jsCore.$
	, $FS			= function (id){ return $F(id).style || {}; }
	, $clone		= jsCore.cloneObject
	, _apply_		= jsCore.apply
	, $onClick		= function (Node, save){ Node = $F(Node); var value = Node.onclick && Node.onclick(); if( !save ) $DA(Node, 'onclick'); return value; }
;

function $DS(obj, method)
{
	var id = jsCore.getUniqId(typeof method === 'string' ? obj[method] : method);
	if( !defined(obj[id]) ) obj[id] = $D.apply($D, arguments);
	return	obj[id];
}


jsCore.uniqId	= jsCore.getUniqId();
Object.extend	= $E;
Object.clone	= $clone;

/**
 * @expose
 */
Object.forEach = function(object, callback, context) {
	if (typeof callback !== 'function') {
		throw new TypeError(callback + ' is not a function');
	}

	var __own__ = Object.prototype.hasOwnProperty
		, key
	;

	if( object ) {
		for( key in object ) {
			if( __own__.call(object, key) ) {
				if( callback.call(context, object[key], key, object) === false ) {
					break;
				}
			}
		}
	}
};

// END: jsCore {};


var jsClass	= {

	classes:	{},
	__m:		{},
	methods:	{},
	dependence:	{},
	instance:	{},
	collector:	[],


	/**
	 * Create class
	 *
	 * @access	public
	 * @param	{String}	name
	 * @oarams	{Boolean}	singleton
	 * @return	{jsClass.Base}
	 */
	create: function (n, singleton)
	{
		var classUniqId		= jsCore.getUniqId();
		var NewClass 		= function()
		{
			var self = this.constructor;

			if( singleton && (self.instance !== undef) )
			{
				return	self.instance;
			}

			this.uniqId				= jsCore.getUniqId();
			this.uniqName			= (n||'').substr(7);
			this.parentClassUniqId	= 0;

			if( this.__construct )
				this.__construct.apply(this, arguments);

			if( singleton )
				self.instance	= this;
		};

		jsCore.each(jsClass.Base, function (k, m)
		{
			if( k != 'prototype' ){ NewClass[k]	= m; }
		});


		NewClass.uniqName				= n;
		NewClass.classUniqId			=
		NewClass.prototype.classUniqId	= classUniqId;


		jsClass.classes[classUniqId]	= NewClass;
		jsClass.__m[classUniqId]		= {};
		jsClass.methods[classUniqId]	= {};
		jsClass.dependence[classUniqId]	= [];


		NewClass.extend(jsClass.Base);

		NewClass.prototype.inherit		= function (K, m, args){ return	K.prototype[m].apply(this, args); };
		NewClass.prototype.constructor	= NewClass;
		NewClass.prototype.parent		= jsClass.Base.prototype.parent;


		if( n ){
			n = 'window.'+n;
			jsCore.namespace(n.substr(0, n.lastIndexOf('.')))[n.substr(n.lastIndexOf('.')+1)] = jsClass.classes[classUniqId];
		}

		return	jsClass.classes[classUniqId];
	},


	inherit: function (F/*From:jsClass*/, T/*To:jsClass*/, m/*method:String*/)/*:Mixed*/
	{
		return	F.prototype[m].apply(T, (_slice_.call(arguments, 3)||[]));
	},


	destroy: function ()
	{
		while( this.collector.length )
		{
			try
			{
				this.collector.shift()();
			} catch(e) {}
		}
		this.collector	= null;
	}

};
// END: jsClass{};


/**
 * @class	jsClass.Base
 * @version	1.0
 */
jsClass.Base				= function (){ };
jsClass.Base.classUniqId	= jsCore.getUniqId();
jsClass.Base.prototype		= {


	/**
	 * Constructor
	 *
	 * @access	public
	 * @return	{Void}
	 */
	//__construct: function (){ /* ... */ },


	/**
	 * @access	public
	 * @param	{String} name
	 * @return	{Mixed}
	 */
	parent: function (name/*:String*/)
	{
		var i = --jsClass.__m[this.classUniqId][name]
		, r = jsClass
					.classes[ jsClass.methods[this.classUniqId][name][ i < 0 ? jsClass.methods[this.classUniqId][name].length-1 : i ] ]
						.prototype[name]
						.apply( this, _slice_.call(arguments, 1) )
				;
		jsClass.__m[this.classUniqId][name]++;
		return	r;
	},


	/**
	 * Call method
	 *
	 * @param	{String} n
	 * @return	{Boolean}
	 */
	callMethod: function (n)
	{
		if( typeof this[n] != 'undefined' )	return	this[n].apply(this, _slice_.call(arguments, 1));
	},


	/**
	 * Destory
	 *
	 * @access	public
	 * @return	{Void}
	 */
	destroy: function (){  jsCore.destroy(this);  }


};
// END: jsClass.Base.prototype;


// jsClass.Base
$E(jsClass.Base, {

	// Singleton
	getInstance: function ()
	{
		if( !jsClass.instance[this.classUniqId] )
		{
			jsClass.instance[this.classUniqId]	= new this;
		}
		return	jsClass.instance[this.classUniqId];
	},


	extend: function (E/*jsClass.Base*/)
	{
		var c = 0, cId, eK, eP, P = this.prototype;

		for( ; eK = arguments[c]; c++ )
		{
			cId	= eK.classUniqId;
			eP	= eK.prototype;

			for( var m in eP )
			{
				if( (m != 'classUniqId') && (m != 'uniqId') && (m != 'parent') && (m != 'inherit') && (m != 'constructor') )
				{
					P[m]	= eP[m];


					if( !jsClass.methods[this.classUniqId][m] || jsClass.methods[this.classUniqId][m].constructor != Array )
					{
						jsClass.methods[this.classUniqId][m] = [];
					}

					if( jsClass.methods[cId] && jsClass.methods[cId][m] )
					{
						jsClass.methods[this.classUniqId][m] = Array.uniq( jsClass.methods[this.classUniqId][m].concat( jsClass.methods[cId][m] ) );
					}

					if( Array.indexOf(jsClass.methods[this.classUniqId][m], cId) == -1  )
					{
						jsClass.methods[this.classUniqId][m].push( cId );
					}

					jsClass.__m[this.classUniqId][m]	= jsClass.methods[this.classUniqId][m].length;
				}
			}

			this.Super = eP;
			P.parentClassUniqId	= cId;
	 	}

		return	this;
	},

	statics: function (m)
	{
		$E( this, m );
		return	this;
	},


	methods: function (m)
	{
		$E(this.prototype, m.constructor === Object ? m : m(this));
		return	this;
	}

});
// END: jsClass.Base();




/**
 * @extension	jsCustomEvents
 * @version		2
 */
var jsCEvents	=
{
	pool:	{},
	name:	function (n){	return	'on' + n.substr(0,1).toUpperCase() + n.substr(1); }
};


jsClass.Base.methods({


	/**
	 * @access	public
	 * @param	{String}	n
	 * @param	{Function}	h
	 * @return	{This}
	 */
	addEventListener: function (n, h)
	{
		n	= n.toLowerCase();

		if( !this.__ce_uniqId )						this.__ce_uniqId					= jsCore.getUniqId();
		if( !jsCEvents.pool[this.__ce_uniqId] )		jsCEvents.pool[this.__ce_uniqId]	= {};
		if( !jsCEvents.pool[this.__ce_uniqId][n] )	jsCEvents.pool[this.__ce_uniqId][n]	= [];

		jsCEvents.pool[this.__ce_uniqId][n].push(h);

		return	this;
	},


	/**
	 * @access	public
	 * @param	{String}	name
	 * @param	{Function}	handler
	 * @return	{This}
	 */
	removeEventListener: function (n, h)
	{	n	= n.toLowerCase();

		if(   jsCEvents.pool[this.__ce_uniqId]
			&& jsCEvents.pool[this.__ce_uniqId][n]
		){
			jsCEvents.pool[this.__ce_uniqId][n]	= Array.remove(jsCEvents.pool[this.__ce_uniqId][n], h, 1);
		}

		return	this;
	},


	/**
	 * @access	private
	 * @param	{String}		n
	 * @return	{Bool}
	 */
	dispatchEvent: function (n)
	{
		var r = 1, pN = jsCEvents.name(n), a;

		if( this[pN] && (this[pN].apply(this, a = _slice_.call(arguments, 1)) === false) )
		{
			r = 0;
		}
		else if( this.__ce_uniqId && jsCEvents.pool[this.__ce_uniqId][n = n.toLowerCase()] )
		{
			var i = 0, h = jsCEvents.pool[this.__ce_uniqId][n], il = h.length, a = a || _slice_.call(arguments, 1);
			try
			{
				for( ; i < il; i++ ) if( h[i] && h[i].apply(this, a) === false )
					r	= 0;
			}
			catch (e)
			{
				h[i] = null;
				debug.log('CE->dispatchEvent:', pN, a, e);
			}
		}

		return	!!r;
	}

});
// jsCustomEvents >




var jsLoader = {

	/* @public  */ cache:		true,
	/* @private */ script:		{},
	/* @private */ aliases:		{},
	/* @private */ css:			{},

	fL:		{},
	files:	{},


	file: function (u/*UrlString*/, t/*tagName*/, a/*Attributes*/)/*Void*/{
		if( !this.files[u] ){
			var	N	= document.createElement(t=t||'SCRIPT');

			try {
				a	= a||{};

				if( t == 'LINK' ) a.rel = 'stylesheet';

				if (t != 'LINK' && /win\d+.dev/.test(location.host)) {
					a.charset = 'windows-1251';
				}

				a.type						= t=='LINK' ? 'text/css' : 'text/javascript';
				a[t=='LINK'?'href':'src']	= u +(u.indexOf('?') == -1 ? '?' : '&')+ 'v='+jsCore.build + (this.cache ? '' : '&r='+jsCore.getUniqId());

				for( var k in a ) $SA(N, k, a[k]);

				HEAD.insertBefore(N, HEAD.firstChild);
				this.files[u]	= 1;
			}
			catch( e ){ }

			N = null;
		}
	},


	includeCSS: function (n/*String*/){
		this.file(this.getFileUrl(n) + '.css', 'LINK');
	},


	getFileUrl: function (n/*String*/){
		return	this.aliases[this.getAlias(n)] + this.getName(n);
	},


	addAlias: function (n/*String*/, p/*PathString*/, notify){
		if( !this.aliases[n] ){
			this.aliases[n]	= (n == 'jsCore' || (/^(http:\/\/|\/)/.test(p)) ? p : this.aliases['jsCore'] + p);
			if( notify ) jsCore.notify('alias:' + n);
		}
	},


	getAlias: function (n/*String*/, d/*DefAlias*/){
		if( this.aliases[n] ){
			return	n;
		}
		else {
			n = n.match(/\{([\w_.\/-]+)\}\.?/i);
			return	(n ? n[1] : defined(d, 'jsCore'));
		}
	},


	getName: function (name/*RequireString*/){
		return	name.replace(/\{[\w._\/-]+\}/ig, '');
	},


	_require: function (){ /*...*/ },

	require: function (list/*Array*/, fn/*Function*/, ready/*Bool*/){
		if( typeof list === 'string' )	list = list.split(',');

		list = Array.filter(list, function (name){
			if( !this.fL[name] ){
				this.fL[name] = 1;
				this.file(jsLoaderFiles[name] || (this.getFileUrl(name) + '.js'));
			}
			return	!this.isLoaded(name);
		}, this);

		if( !jsCore.loaded && ready ){
			if( ready != 'and' ){
				jsCore.ready(function (){
					jsLoader.require(list, fn);
				});
				return;
			}
			else {
				list.push('jsCore:ready');
			}
		}

		if( fn ){
			list.length ? jsCore.wait(list, fn) : fn();
		}
	},

	isLoaded: function (name){
		return this.fL[name] === 2;
	},

	loaded: function (name){
		this.fL[name] = 2;
		jsCore.notify(name);
	},

	use: function (fn){
		fn();
	}

};

function define(name, list, fn) {
	function _convert(str) {
		return str.replace(/^([^/]+)\/(.+)$/, '{$1}$2')
	}

	if(typeof fn === 'undefined') {
		fn = list;

		if(name instanceof Array) {
			list = name;
			name = null;

		} else {
			list = [];
		}
	}

	list = Array.map(list, _convert);
	name = _convert(name);

	var success = function() {
		fn();

		if(name) {
			jsLoader.loaded(name);
		}
	}

	if(list.length) {
		jsLoader.require(list, success);
	} else {
		success();
	}

}

if( !window.jsLoaderFiles ){
	window.jsLoaderFiles	= {};
}
// END: jsLoader{};



/**
 * @object	jsCookie
 * @author	RubaXa		<trash@rubaxa.org>
 */
var jsCookie  = {

	DAY:	86400,
	WEEK:	86400 * 7,
	MONTH:	86400 * 30,
	YEAR:	86400 * 365,

	set: function (k, v/*=null*/, e/*=0*/, p/*='/'*/)
	{
		if( !v ) v = 0;
		if( (typeof e != 'undefined') && (e !== true) ) e = 'expires=' + (new Date((new Date).getTime() + (e * 1000))).toGMTString() +';';
		else e = '';

		this.remove(k);
		document.cookie = k+'='+v+'; path='+(p||'/')+'; '+e;
		return	this;
	},


	get: function(k, d)
	{
		if( !k )	return	document.cookie;
		var re = new RegExp(k + '='), c = jsCookie.get().split(/;\s+/);
		for( var i = c.length; i --; ) if( re.test(c[i]) ) return c[i].split('=')[1];
		return	d;
	},


	has: function (k)
	{
		var v = this.get(k);
		return	(v && !((v == 'false') || (v == 'null') || (v == '')));
	},


	remove: function (k)
	{
		var e = (new Date(1)).toGMTString();
		document.cookie	= k + '=null; expires=' + e;
		document.cookie	= k + '=null; path=/; expires=' + e;
		return	this;
	}

};
// END: jsCookie




// < Debug
/** @namespace opera.postError */
/** @namespace window.CONSOLE_ON */
(function (win, debug, enabled){
	try {
		if( /debug/.test(location) ){
			enabled = !/debug=n/.test(location);
			if( win.localStorage ){
				localStorage.setItem('ajs.debug', +enabled);
			}
		}

		if( !enabled && win.localStorage ){
			enabled = localStorage.getItem('ajs.debug') == 1;
		}
	}
	catch (er){}

	var
		  _join = [].join
		, _console = enabled && (win.console || win.opera)
		, msie = _console && (typeof _console.log == 'object')
	;

	jsCore.debugMode = enabled;

	jsCore.each('log,info,warn,error,dir,assert,profile,profileEnd,clear,group,groupEnd,groupCollapsed'.split(','), function (i, method){
		if( _console ){
			if( _console[method] ){
				debug[method]	= msie
								? Function.prototype.call.bind(_console[method], _console)
								: function (){ _console[method].apply(_console, arguments); }
							;
			}
			else if( method == 'log' ){
				if( _console.postError ){
					debug.log = function (){
						_console.postError(_join.call(arguments, ' '));
					};
				}
				else {
					debug.log	= jsCore.F;
				}
			}
			else {
				debug[method]	= function (){
					debug.log.apply(ajs, arguments);
				};
			}
		}
		else {
			debug[method]	= jsCore.F;
		}
	});
})(window, window.debug = {}, jsCore.local || window.CONSOLE_ON);
// Debug >



/**
 * jsCore.Registry
 */
var Registry	= {

	_data:			{},

	has:	function(key){ return	typeof(this._data[key]) != 'undefined'; },
	get:	function(key){ return	this._data[key]; },
	put:	function(key, value){ this._data[key] = value; return this; },
	remove:	function(key){ delete this._data[key]; return this; },

	inc:		function (key, name, count){ this._data[key][name] = this._data[key][name] * 1 + (count || 1) * 1; return this; },
	dec:		function (key, name, count){ this._data[key][name] = this.inc(key, name, count || -1); return this; },

	destroy: function (){ jsCore.destroy(this._data); jsCore.destroy(this); }

};
// END: Registry{};


(function (w)
{
	var ids = {}, names = {};

	w.Timeout	= {
		count: 0,

		set: function (name, func, mSec, loop)
		{
			var id;

			if( typeof name === 'function')
			{
				if( mSec ) loop = mSec;
				mSec	= func;
				func	= name;
				name	= undefined;
			}
			else
				this.clear(name);

			if( typeof loop === 'number' )
			{
				var counter = 0;
				id = w.setInterval(function ()
				{
					if( loop ){ func(++counter); loop--; }
					if( !loop ) Timeout.clear( name || id );
				}, mSec||0);
			}
			else
				id = w[loop ? 'setInterval' : 'setTimeout'](func, mSec||0);

			w[loop ? 'Interval' : 'Timeout'].count++;

			names[id]	= name || id;
			name		= names[id] +''+ +Boolean(loop);
			ids[name]	= id;

			return	id;
		},

		clear: function (name)
		{
			if( name in names ) name = names[name];
			var n = name+'0', id;
			if( ids[n] )
			{
				Timeout.count--;
				w.clearTimeout( id = ids[n] );
				delete	ids[n];
			}
			else if( ids[n = name+'1'] )
			{
				Interval.count--;
				w.clearInterval( id = ids[n] );
				delete	ids[n];
			}
			if( id in names ) delete names[id];
		}
	};

	w.Interval = {
		  set:		function (name, func, mSec, count){ return Timeout.set(name, func, mSec, count || true); }
		, clear:	Timeout.clear
		, count:	0
	};

})(window);


/**
 * @object	jsEvent
 */
var jsEvent	= {

	invert: {
				  focus:		'blur'
				, keydown:		'keyup'
				, mouseover:	'mouseout'
				, mouseenter:	'mouseleave'
			},

	Key:	{
				  'up':			38
				, 'down':		40
				, 'left':		37
				, 'right':		39
				, 'esc':		27
				, 'home':		36
				, 'end':		35
				, 'pageup':		33
				, 'pagedown':	34
				, 'ins':		45
				, 'del':		46
				, 'insert':		45
				, 'delete':		46
				, 'back':		8
				, 'backspace':	8
				, 'space':		32
				, 'bar':		32
				, 'spacebar':	32
				, 'enter':		13
				, 'cmd':		224
				, 'pause':		19
				, 'break':		3
				, 'alt':		18
				, 'ctrl':		17
				, 'shift':		16
				, 'tab':		9
				, 'caps':		20
				, 'capslock':	20
				, 'plus':		107
				, 'minus':		109
				, isControl:	function (c/*Int*/)/*Bool*/{ return c < 47; }
			},

	Mouse:  {
		  isLeft: 	function (e){ return e.which < 2; }
		, isMiddle:	function (e){ return e.which == 2; }
		, isRight:	function (e){ return e.which > 2; }
	},


	add: function (o, name, listener, captures){
		if( o ){
			captures	= (captures ? true : false);
			o.attachEvent
				? o.attachEvent('on' + name, listener, captures)
				: o.addEventListener(name, listener, captures);
		}
	},


	remove: function (o, name, listener, captures){
		if( o ){
			captures	= (captures ? true : false);
			o.detachEvent
				? o.detachEvent('on' + name, listener, captures)
				: o.removeEventListener(name, listener, captures);
		}
	},

	fire: function (e, n)
	{
		do
		{
			jQuery(e).trigger(n);
		}
		while( (e = e.parentNode) && (e.parentNode != document) );
	}

};
Object.forEach(jsEvent.invert, function (v, k) { jsEvent.invert[v] = k; });
// END: jsEvent{};


// < alias: jsCore
if( typeof window.jsCoreAlias !== 'undefined' )
{
	if( typeof jsCoreAlias === 'string' )	jsCoreAlias	= { jsCore: jsCoreAlias };
	for( var a in jsCoreAlias )	jsLoader.addAlias(a, jsCoreAlias[a]);
}
else jsLoader.addAlias('jsCore', 'http://rubaxa.org/.jsCore/');
// alias: jsCore >

// Fast init jsLoader
jsCore.each(window.jsLoaderLoaded, function (i, v){ jsLoader.loaded(v, !0); });


jQuery(function () {
	jsCore.ready();
});


//
// Math
//
$E(Math, {

	KB: 1024,
	MB: Math.pow(1024, 2),
	GB: Math.pow(1024, 3),
	TB: Math.pow(1024, 4),

	sign: function (a)
	{
		return	(a >= 0) ? 1 : -1;
	},

	_round: Math.round,
	round: function (v, z)
	{
		return (z && (z = Math.pow(10, z)) ? Math._round(v*z)/z : Math._round(v));
	},

	rand: function (min, max)
	{
		if( defined(min) )
		{
			return	defined(max) ? min + Math.round(Math.random() * (max - min)) : Math.round(Math.random() * min);
		}
		return	Math.random();
	},

	min_max: function (v, m, M)
	{
		return	Math.max(m, Math.min(v, M));
	}

});


/**
 * Window
 */
$E(window,
{
	now: function (){ return (new Date).getTime(); },

	reload: function (){ location.href = location.href.split('#')[0]; }

});


jsLoader.loaded('{jQuery}jquery');

/**
 * @expose
 */
if (!Object.isObject) {
	Object.isObject = function(object) {
		return Object.prototype.toString.call(object) === "[object Object]";
	};
}

// ./data/common/js/ajs/String.js start

define('ajs/String', function() {
/**
 * Extensions for "String" object
 *
 * @author	RubaXa	<trash@rubaxa.org>
 * @version	1.0
 */

(function (undef)
{

	String._as	= {
					  "'":	new RegExp('(^|[^\\\\])((\\\\)*)\'', 'g')
					, '"':	new RegExp('(^|[^\\\\])((\\\\)*)"', 'g')
				};



	$.extend(String, {

		_hex: function (h){ return h.length < 2 ? h+''+h : h; },
		rgb2hex: function (c/*String|Array|object*/)
		{
			if( typeof c == 'string' )
			{
				if( c.indexOf(',') < 0 )	return	'#'+ c.replace('#','').replace(/^(\w)(\w)(\w)$/gi, '$1$1$2$2$3$3');
				c = c.replace(/(rgb\(|\)|\s+)/ig,'').split(',');
			}
			else if( c.red ) { c[0] = c.red; c[1] = c.green; c[2] = c.blue; }
			c = String._hex((c[0]*1).toString(16)) + String._hex((c[1]*1).toString(16)) + String._hex((c[2]*1).toString(16));
			return '#'+ c;
		},

		addSlashes: function (s, q)
		{
			return	String(s).replace(String._as[q=(q||"'")], "$1$2\\" + q);
		},

		padZero: function(n, l)
		{
			var s = '' + n;
			while (s.length < l) s = '0' + s;
			return s;
		},

		trim: function (s)
		{
			return	String(s).replace(/^([\s\r\n]+)|([\s\r\n]+)$/g, '');
		},

		num:	function (n, L, i)
		{
		  if( L == null ) return '';

			var x	= ((n%100 <= 10) || (n%100 >= 20)) ? n % 10 : 0;
			var l	= L.length;

			if( l == 2 && x == 1 )	x = 0;
			else if( l == 3 && x > 1 )
			{
				x = x < 5 ? 2 : 0;
			}

		  return   (i ? n + (i && (i!=1) ? i : '') : '') +
							(typeof(L) != 'string'
								? (L[x] ||  L[(x > 1 && x < 5) ? x : 0] || L[x > 1?1:0])
								: L
							)
						;
		},

		ucfirst: function (s)
		{
			return	s.charAt(0).toUpperCase() + s.substr(1);
		},


		repeat: function (s, n)
		{
			var r = '', i = 0;
			for( ; i < n; i++ ) r += s;
			return	r;
		},

		toQuery: function (o)
		{
			var s	= '', i = 0, k, kn, v;

			if( o )
			{
				if( typeof o != 'string' )
				{
					s	= [];
					for( var p in o ) if( p != '' )
					{
						v = defined(o[p], '');
						if( v && v.constructor === Array ){
							for( k = 0, kn = v.length; k < kn; k++ ){
								s[i++] = p +'='+ encodeURIComponent( defined(v[k], '') );
							}
						}
						else {
							s[i++] = p + (v != null && v !== '' ? '='+ encodeURIComponent( v ) : '');
						}
					}
					s	= s.join('&');
				}
				else s = o;
			}

			return	s;
		},


		toObject: function (s){
			var o = {};
			if( typeof s === 'object' ){
				o = s || o;
			}
			else if( s = String(s) )
			{
				if( s.indexOf('?') > -1 || /^http:/.test(s)) s = s.split('?')[1] || '';

				s	= s.split('&');
				for( var i = 0, n = s.length, v; i < n; i++ ) if( s[i] != '' )
				{
					s[i]	= s[i].split('=');
					v 		= s[i][1];

					if( typeof v == 'string' )
						try{ v = decodeURIComponent(v); } catch (e) { v = unescape(v); }
					else
						v	= '';

					o[s[i][0]]	= v;
				}
				return	o;
			}

			return	o;
		},


		html2text: function (h/*:html*/)
		{
			return	String(h)
							.replace(/&/g, '&amp;')
							.replace(/</g, '&lt;')
							.replace(/>/g, '&gt;')
							.replace(/"/g, '&quot;')
			;
		},


		nl2br: function (t)
		{
			return	String(t).replace(/[\r\n]/g, '<br />');
		},


		wordWrap: function (t/*:Text*/, m/*:MaxWord*/, l/*:MaxLength*/, e/*:End*/, spaceAfterMaxLength)
		{
			t	= String(t).replace(new RegExp('(\\S{'+(m||20)+'})', 'ig'), '$1 ');

			if( l && t.length > l ){
				if (spaceAfterMaxLength) {
					for( l--; l<t.length; l++) if( /\s/.test(t.charAt(l)) ){ break; }
				} else {
					for( l++; l--; ) if( /\s/.test(t.charAt(l)) ){ break; }
				}
				t	= t.substr(0, l) + e;
			}

			return	t;
		},

		supplant: function(str, o)
		{
			return str.replace(/#\{([^\{\}]*)\}/g,
				function(a, b) {
					var r = o[b];
					return typeof r === 'string' || typeof r === 'number' ? r : a;
				}
			);
		},

		numberFormat: function (n/*Number*/, d/*Int*/, f/*String*/, s/*String*/)
		{
			var n = Math.round(n, d).toString().split('.');
			if( s ) for( var i = n[0].length-3; i >= 0; i -= 3 ) n[0] = n[0].substr(0, i) + s + n[0].substr(i);
			return	n[0] + (n[1] ? f + n[1] : '');
		},

		sizeFormat: function(filesize){
			if (filesize >= Math.GB){
				filesize = String.numberFormat(filesize / Math.GB, 2, '.', '') + ' ' + Lang.get('Size').gb;
			} else {
				if (filesize >= Math.MB){
					filesize = String.numberFormat(filesize / Math.MB, 2, '.', '') + ' ' + Lang.get('Size').mb;
				} else {
					if (filesize >= Math.KB){
						filesize = String.numberFormat(filesize / Math.KB, 0) + ' ' + Lang.get('Size').kb;
					} else {
						filesize = String.numberFormat(filesize, 0) + ' ' + Lang.get('Size').bytes;
					}
				}
			}
			return filesize;
		},

		sprintf: function (txt/*[, args]*/){
			if( typeof txt === 'string' ){
				for( var i = 1, n = arguments.length; i < n; i++ )
					txt = txt.replace('%s', arguments[i]);
			}
			return	txt;
		},

		concat: function ()
		{
			return	Array.prototype.join.call(arguments, '');
		},

		preg_quote: function(str)
		{
			return (str || '').replace(/([\\\.\+\*\?\[\^\]\$\(\)\{\}\=\!<>\|\:])/g, '\\$1');
		}
	});

	var _String_split_ = String.prototype.split
		, _String_split_shim_isnonparticipating
	;

	/*
	 [BUGFIX, IE lt 9, old safari] http://blog.stevenlevithan.com/archives/cross-browser-split
	 More better solution:: http://xregexp.com/
	 Speed test: http://jsperf.com/js-split
	 */
	if('te'.split(/(s)*/)[1] != void 0 ||
		'1_1'.split(/(_)/).length != 3) {
		_String_split_shim_isnonparticipating = /()??/.exec("")[1] === void 0; // NPCG: nonparticipating capturing group

		String.prototype.split = function (separator, limit) {
			var str = this;
			// if `separator` is not a regex, use the native `split`
			if(!(separator instanceof RegExp)) {//if (Object.prototype.toString.call(separator) !== "[object RegExp]") {
				//http://es5.github.com/#x15.5.4.14
				//If separator is undefined, then the result array contains just one String, which is the this value (converted to a String). If limit is not undefined, then the output array is truncated so that it contains no more than limit elements.
				if(separator === void 0 && limit === 0)return [];

				return _String_split_.call(str, separator, limit);
			}

			var output = []
				, flags = (separator["ignoreCase"] ? "i" : "") +
					(separator["multiline"] ? "m" : "") +
					(separator["extended"] ? "x" : "") + // Proposed for ES6
					(separator["sticky"]   ? "y" : "") // Firefox 3+
				, lastLastIndex = 0
			// Make `global` and avoid `lastIndex` issues by working with a copy
				, separator2
				, match
				, lastIndex
				, lastLength
			;

			separator = new RegExp(separator.source, flags + "g");

			str += ""; // Type-convert
			if (!_String_split_shim_isnonparticipating) {
				// Doesn't need flags gy, but they don't hurt
				separator2 = new RegExp("^" + separator.source + "$(?!\\s)", flags);
			}

			/* Values for `limit`, per the spec:
			 * If undefined: 4294967295 // Math.pow(2, 32) - 1
			 * If 0, Infinity, or NaN: 0
			 * If positive number: limit = Math.floor(limit); if (limit > 4294967295) limit -= 4294967296;
			 * If negative number: 4294967296 - Math.floor(Math.abs(limit))
			 * If other: Type-convert, then use the above rules
			 */
			limit = limit === void 0 ?
				-1 >>> 0 : // Math.pow(2, 32) - 1
				limit >>> 0 // ToUint32(limit)
			;

			if (!limit) {
				return [];
			}

			while (match = separator.exec(str)) {
				// `separator.lastIndex` is not reliable cross-browser
				lastIndex = match.index + match[0].length;

				if (lastIndex > lastLastIndex) {
					output.push(str.slice(lastLastIndex, match.index));

					// Fix browsers whose `exec` methods don't consistently return `undefined` for
					// nonparticipating capturing groups
					// __ NOT WORKING __ !!!!
					if (!_String_split_shim_isnonparticipating && match.length > 1) {
						match[0].replace(separator2, function() {
							for (var i = 1, l = arguments.length - 2; i < l; i++) {
								if (arguments[i] === void 0) {
									match[i] = void 0;
								}
							}
						});
					}

					if (match.length > 1 && match.index < str.length) {
						output.push.apply(output, match.slice(1));
					}

					lastLength = match[0].length;
					lastLastIndex = lastIndex;

					if (output.length >= limit) {
						break;
					}
				}

				if (separator.lastIndex === match.index) {
					separator.lastIndex++; /// Avoid an infinite loop
				}
			}

			if (lastLastIndex === str.length) {
				if (lastLength || !separator.test("")) {
					output.push("");
				}
			} else {
				output.push(str.slice(lastLastIndex));
			}

			return output.length > limit ? output.slice(0, limit) : output;
		}
	}

})();
 
});

// ./data/common/js/ajs/String.js end

// data/ru/images/js/ru/jsCore/Date.js start

/**
 * Расширение класса Date
 * @author	"RubaXa"		<trash@rubaxa.org>
 */


// data/ru/images/js/ru/jsCore/utils/Lang.js start

/**
 * @object	Lang
 * @author	RubaXa	<trash@rubaxa.org>
 * @version	1.0
 * Объект для работы с разными языками.
 */


// data/ru/images/js/ru/jsCore/JSON.js start

/*
    http://www.JSON.org/json2.js
    2009-09-29

    Public Domain.

    NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.

    See http://www.JSON.org/js.html

    This file creates a global JSON object containing two methods: stringify
    and parse.

        JSON.stringify(value, replacer, space)
            value       any JavaScript value, usually an object or array.

            replacer    an optional parameter that determines how object
                        values are stringified for objects. It can be a
                        function or an array of strings.

            space       an optional parameter that specifies the indentation
                        of nested structures. If it is omitted, the text will
                        be packed without extra whitespace. If it is a number,
                        it will specify the number of spaces to indent at each
                        level. If it is a string (such as '\t' or '&nbsp;'),
                        it contains the characters used to indent at each level.

            This method produces a JSON text from a JavaScript value.

            When an object value is found, if the object contains a toJSON
            method, its toJSON method will be called and the result will be
            stringified. A toJSON method does not serialize: it returns the
            value represented by the name/value pair that should be serialized,
            or undefined if nothing should be serialized. The toJSON method
            will be passed the key associated with the value, and this will be
            bound to the value

            For example, this would serialize Dates as ISO strings.

                Date.prototype.toJSON = function (key) {
                    function f(n) {
                        // Format integers to have at least two digits.
                        return n < 10 ? '0' + n : n;
                    }

                    return this.getUTCFullYear()   + '-' +
                         f(this.getUTCMonth() + 1) + '-' +
                         f(this.getUTCDate())      + 'T' +
                         f(this.getUTCHours())     + ':' +
                         f(this.getUTCMinutes())   + ':' +
                         f(this.getUTCSeconds())   + 'Z';
                };

            You can provide an optional replacer method. It will be passed the
            key and value of each member, with this bound to the containing
            object. The value that is returned from your method will be
            serialized. If your method returns undefined, then the member will
            be excluded from the serialization.

            If the replacer parameter is an array of strings, then it will be
            used to select the members to be serialized. It filters the results
            such that only members with keys listed in the replacer array are
            stringified.

            Values that do not have JSON representations, such as undefined or
            functions, will not be serialized. Such values in objects will be
            dropped; in arrays they will be replaced with null. You can use
            a replacer function to replace those with JSON values.
            JSON.stringify(undefined) returns undefined.

            The optional space parameter produces a stringification of the
            value that is filled with line breaks and indentation to make it
            easier to read.

            If the space parameter is a non-empty string, then that string will
            be used for indentation. If the space parameter is a number, then
            the indentation will be that many spaces.

            Example:

            text = JSON.stringify(['e', {pluribus: 'unum'}]);
            // text is '["e",{"pluribus":"unum"}]'


            text = JSON.stringify(['e', {pluribus: 'unum'}], null, '\t');
            // text is '[\n\t"e",\n\t{\n\t\t"pluribus": "unum"\n\t}\n]'

            text = JSON.stringify([new Date()], function (key, value) {
                return this[key] instanceof Date ?
                    'Date(' + this[key] + ')' : value;
            });
            // text is '["Date(---current time---)"]'


        JSON.parse(text, reviver)
            This method parses a JSON text to produce an object or array.
            It can throw a SyntaxError exception.

            The optional reviver parameter is a function that can filter and
            transform the results. It receives each of the keys and values,
            and its return value is used instead of the original value.
            If it returns what it received, then the structure is not modified.
            If it returns undefined then the member is deleted.

            Example:

            // Parse the text. Values that look like ISO date strings will
            // be converted to Date objects.

            myData = JSON.parse(text, function (key, value) {
                var a;
                if (typeof value === 'string') {
                    a =
/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
                    if (a) {
                        return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
                            +a[5], +a[6]));
                    }
                }
                return value;
            });

            myData = JSON.parse('["Date(09/09/2001)"]', function (key, value) {
                var d;
                if (typeof value === 'string' &&
                        value.slice(0, 5) === 'Date(' &&
                        value.slice(-1) === ')') {
                    d = new Date(value.slice(5, -1));
                    if (d) {
                        return d;
                    }
                }
                return value;
            });


    This is a reference implementation. You are free to copy, modify, or
    redistribute.

    This code should be minified before deployment.
    See http://javascript.crockford.com/jsmin.html

    USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
    NOT CONTROL.
*/

/*jslint evil: true, strict: false */

/*members "", "\b", "\t", "\n", "\f", "\r", "\"", JSON, "\\", apply,
    call, charCodeAt, getUTCDate, getUTCFullYear, getUTCHours,
    getUTCMinutes, getUTCMonth, getUTCSeconds, hasOwnProperty, join,
    lastIndex, length, parse, prototype, push, replace, slice, stringify,
    test, toJSON, toString, valueOf
*/


// Create a JSON object only if one does not already exist. We create the
// methods in a closure to avoid creating global variables.

if (!this.JSON) {
    this.JSON = {};
}

(function () {

    function f(n) {
        // Format integers to have at least two digits.
        return n < 10 ? '0' + n : n;
    }

    if (typeof Date.prototype.toJSON !== 'function') {

        Date.prototype.toJSON = function (key) {

            return isFinite(this.valueOf()) ?
                   this.getUTCFullYear()   + '-' +
                 f(this.getUTCMonth() + 1) + '-' +
                 f(this.getUTCDate())      + 'T' +
                 f(this.getUTCHours())     + ':' +
                 f(this.getUTCMinutes())   + ':' +
                 f(this.getUTCSeconds())   + 'Z' : null;
        };

        String.prototype.toJSON =
        Number.prototype.toJSON =
        Boolean.prototype.toJSON = function (key) {
            return this.valueOf();
        };
    }

//	berkel Opera 9.26 на короткий синтаксис ругается
//	var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
//	var escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;

	var cx = new RegExp('[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]', 'g');
	var escapable = new RegExp('[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]', 'g');

    var gap,
        indent,
        meta = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        },
        rep;


    function quote(string) {

// If the string contains no control characters, no quote characters, and no
// backslash characters, then we can safely slap some quotes around it.
// Otherwise we must also replace the offending characters with safe escape
// sequences.

        escapable.lastIndex = 0;
        return escapable.test(string) ?
            '"' + string.replace(escapable, function (a) {
                var c = meta[a];
                return typeof c === 'string' ? c :
                    '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
            }) + '"' :
            '"' + string + '"';
    }


    function str(key, holder) {

// Produce a string from holder[key].

        var i,          // The loop counter.
            k,          // The member key.
            v,          // The member value.
            length,
            mind = gap,
            partial,
            value = holder[key];

// If the value has a toJSON method, call it to obtain a replacement value.

        if (value && typeof value === 'object' &&
                typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }

// If we were called with a replacer function, then call the replacer to
// obtain a replacement value.

        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }

// What happens next depends on the value's type.

        switch (typeof value) {
        case 'string':
            return quote(value);

        case 'number':

// JSON numbers must be finite. Encode non-finite numbers as null.

            return isFinite(value) ? String(value) : 'null';

        case 'boolean':
        case 'null':

// If the value is a boolean or null, convert it to a string. Note:
// typeof null does not produce 'null'. The case is included here in
// the remote chance that this gets fixed someday.

            return String(value);

// If the type is 'object', we might be dealing with an object or an array or
// null.

        case 'object':

// Due to a specification blunder in ECMAScript, typeof null is 'object',
// so watch out for that case.

            if (!value) {
                return 'null';
            }

// Make an array to hold the partial results of stringifying this object value.

            gap += indent;
            partial = [];

// Is the value an array?

            if (Object.prototype.toString.apply(value) === '[object Array]') {

// The value is an array. Stringify every element. Use null as a placeholder
// for non-JSON values.

                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || 'null';
                }

// Join all of the elements together, separated with commas, and wrap them in
// brackets.

                v = partial.length === 0 ? '[]' :
                    gap ? '[\n' + gap +
                            partial.join(',\n' + gap) + '\n' +
                                mind + ']' :
                          '[' + partial.join(',') + ']';
                gap = mind;
                return v;
            }

// If the replacer is an array, use it to select the members to be stringified.

            if (rep && typeof rep === 'object') {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    k = rep[i];
                    if (typeof k === 'string') {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            } else {

// Otherwise, iterate through all of the keys in the object.

                for (k in value) {
                    if (Object.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            }

// Join all of the member texts together, separated with commas,
// and wrap them in braces.

            v = partial.length === 0 ? '{}' :
                gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' +
                        mind + '}' : '{' + partial.join(',') + '}';
            gap = mind;
            return v;
        }
    }

// If the JSON object does not yet have a stringify method, give it one.

    if (typeof JSON.stringify !== 'function') {
        JSON.stringify = function (value, replacer, space) {

// The stringify method takes a value and an optional replacer, and an optional
// space parameter, and returns a JSON text. The replacer can be a function
// that can replace values, or an array of strings that will select the keys.
// A default replacer method can be provided. Use of the space parameter can
// produce text that is more easily readable.

            var i;
            gap = '';
            indent = '';

// If the space parameter is a number, make an indent string containing that
// many spaces.

            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }

// If the space parameter is a string, it will be used as the indent string.

            } else if (typeof space === 'string') {
                indent = space;
            }

// If there is a replacer, it must be a function or an array.
// Otherwise, throw an error.

            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                    (typeof replacer !== 'object' ||
                     typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }

// Make a fake root object containing our value under the key of ''.
// Return the result of stringifying the value.

            return str('', {'': value});
        };
    }


// If the JSON object does not yet have a parse method, give it one.

    if (typeof JSON.parse !== 'function') {
        JSON.parse = function (text, reviver) {

// The parse method takes a text and an optional reviver function, and returns
// a JavaScript value if the text is a valid JSON text.

            var j;

            function walk(holder, key) {

// The walk method is used to recursively walk the resulting structure so
// that modifications can be made.

                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }


// Parsing happens in four stages. In the first stage, we replace certain
// Unicode characters with escape sequences. JavaScript handles many characters
// incorrectly, either silently deleting them, or treating them as line endings.

            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' +
                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }

// In the second stage, we run the text against regular expressions that look
// for non-JSON patterns. We are especially concerned with '()' and 'new'
// because they can cause invocation, and '=' because it can cause mutation.
// But just to be safe, we want to reject all unexpected forms.

// We split the second stage into 4 regexp operations in order to work around
// crippling inefficiencies in IE's and Safari's regexp engines. First we
// replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
// replace all simple value tokens with ']' characters. Third, we delete all
// open brackets that follow a colon or comma or that begin the text. Finally,
// we look to see that the remaining characters are only whitespace or ']' or
// ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

			try {
//            if (/^[\],:{}\s]*$/.
//test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@').
//replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
//replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

// In the third stage we use the eval function to compile the text into a
// JavaScript structure. The '{' operator is subject to a syntactic ambiguity
// in JavaScript: it can begin a block or an object literal. We wrap the text
// in parens to eliminate the ambiguity.

                j = eval('(' + text + ')');

// In the optional fourth stage, we recursively walk the new structure, passing
// each name/value pair to a reviver function for possible transformation.

                return typeof reviver === 'function' ?
                    walk({'': j}, '') : j;
//            }
			} catch (er){};

// If the text is not JSON parseable, then a SyntaxError is thrown.

            throw new SyntaxError('JSON.parse');
        };
    }

}());


window.serialize	= JSON.stringify;
window.unserialize	= JSON.parse;

jsLoader.loaded('{jsCore}JSON', 1);


// data/ru/images/js/ru/jsCore/JSON.js end

window.Lang	= ({

		data:	{},
		vars:	{},
		locals:	[],
		def:	'',
		path:	'',


		init: function ()
		{
			//this.setDataPath(jsLoader.aliases['lang.data']||'');
			this.setLocal(window['LANG_DEFAULT'] || 'RU');	// установка дэвалтной локали
			return	this;
		},


		setDataPath: function (p){ this.path	= p; },


		addLocal: function (l, nl)	// добавить локаль
		{
			if( typeof(l) == 'string' )	l	= l.split(',');

			for( var i = 0; i < l.length; i++ )
			{
				if( !this.data[l[i] = l[i].toUpperCase()] )
				{
					this.locals.push(l[i]);
					this.data[l[i]]	= {};
				}
			}

			if( nl = defined(nl, true) ) this.load(false, nl.constructor === Function ? nl : 0);
			return	this;
		},


		setLocal: function (l)	// default
		{
			this.def	= l.toUpperCase();
			this.addLocal(l);
			return	this;
		},


		load: function (v, s)	// загрузить языковые блоки
		{
			if( v )
			{	// блоки
				if( typeof(v) == 'string' )	v	= v.split(',');
				for( var i = 0, n = v.length; i < n; i++ )
				{
					if( !this.vars[v[i]] )
					{	// отметим, что блок хочет грузидцо
						this.vars[v[i]]	= 1;
					}
				}
			}

			var r	= 0, w = '';
			for( var v in this.vars )
			{
				for( var j = 0, nl = this.locals.length; j < nl; j++ )
				{
					if( !this.data[this.locals[j]][v] )
					{
						this.data[this.locals[j]][v]	= 1;
						if( !r )	r = {};
						if( !r[this.locals[j]] )	r[this.locals[j]]	= [];
						r[this.locals[j]].push(v);
//						wId	= ',lang:'+this.locals[j]+'-'+v;
					}
				}
			}

			if( 0 && r )
			{
				jsCore.request({
					  url:		this.path
					, data:		'l=' + serialize(r)
					, cache:	1
					, success:	$D(this, 'add')
				});
//				if( s ) jsCore.wait(wId.substr(1), s);
			}
			else if( s )
			{
				s();
			}
		},


		add: function (d)
		{
			var n = [];
			for( var l in d )
			{
				for( var v in d[l] )
				{
					this.data[l][v]	= d[l][v];
					n.push('lang:'+l+'-'+v);
				}
			}
			jsCore.notify(n);
			return	this;
		},


		get: function (v, l)
		{
			if( v.indexOf('/') > -1 )
			{
				v = v.split('/');
				l = v[0];
				v = v[1]
			}
			return	defined(this.data[l||this.def][v], {});
		},


		str: function (key, def){
			var val	= Lang.data[Lang.def][key];
			return	typeof val === 'undefined'
						? (typeof def === 'undefined' ? '' : Lang.str(def))
						: (val + '')
					;
		},


		fileSize: function (s, L)
		{
			var x	= Math.floor(Math.log(s||1) / Math.log(1024));
			return	L ? String.num(Math.round(s/Math.pow(1024, x)), L[x], ' ') : x;
		}


	}).init();


	jsLoader.loaded('{utils}Lang', 1);

// data/ru/images/js/ru/jsCore/utils/Lang.js end

/** @namespace mailru.LANG */
	/** @namespace window.timeZone */
	/** @namespace window.TIMEZONE */

	$E(Date, {

		is: function (d)
		{
			if( d )
			{
				return	d.setTime || /(^\d+$|^((\d{1,4}[-:\s\/]?)+)$)/.test(d+'');
			}
			return	!1;
		},



		_timer:		(new Date()).getTime(),
		timeZone:	(window.timeZone || window.TIMEZONE || 4),

		getTime: function ()
		{
			return	this.changeNow().getNow().getTime();
		},

		getUnixtime: function ()
		{
			return	Math.round(this.getTime() / 1000);
		},


		setNow: function (time)
		{
			this._now_			= new Date(time);
			this._today_		= new Date(time);
			this._yesterday_	= new Date(time);

			this._today_.setHours(0);
			this._today_.setMinutes(0);

			this._yesterday_.setTime(this._today_.getTime());
			this._yesterday_.setDate(this._yesterday_.getDate()-1);

			return	this;
		},

		getNow: function ()
		{
			return	this.changeNow()._now_;
		},

		changeNow: function ()
		{
			var n = now();
			Date.setNow(Date._now_.getTime() + (n - Date._timer));
			Date._timer	= n;

			return	this;
		},

		_f:	function (n){ return	((n > 9) ? n : '0' + n); },


		_parse: Date.parse,
		parse: function (s/*StringOrInt*/)/*Date*/
		{
			if( s && s.setTime )	return	s;

			try
			{
				var D = /^\d+$/.test(s) ? new Date(s) : Date._parse( s );
				if( D.constructor != Date ) D = new Date(String(s).replace(/^(\d{4})-(\d{2})-(\d{2})/, '$2/$3/$1'));
			}
			catch( e )
			{
				debug.log('Date', e);
			}

			return	D;
		}

	});

	if( !Date.now ) {
		Date.now = function() {
			return Date.getTime();
		}
	}


	$E(Date.prototype, {


		timeZone:	Date.timeZone,

		getLocalToday: function () {
			var date = new Date();
			date.setHours(0);
			date.setMinutes(0);
			date.setSeconds(0);
			return date;
		},

		getLocalYesterday: function () {
			var date = this.getLocalToday();
			date.setDate(date.getDate() - 1);
			return date;
		},

		isNow: function (interval)
		{
			Date.changeNow();
			return	(Date._now_.getTime() - this.getTime()) <= interval;
		},

		isToday: function () {
			return this.toDateString() === this.getLocalToday().toDateString();
		},

		isYesterday: function () {
			return this.toDateString() === this.getLocalYesterday().toDateString();
		},

		isThisYear: function () {
			return this.getFullYear() === this.getLocalToday().getFullYear();
		},

		setTimeZone: function (z)
		{
			this.timeZone	= z * 1;
			return	this;
		},

		format: function (f)
		{
			var t = this.getTime(), r = '', f = f.split('');

			/* MAIL-7804
			this.setTime( t + (this.getTimezoneOffset() + this.timeZone*60) * 60000);
			*/

			for( var i = 0, n = f.length; i < n; i++ )
			{
				switch( f[i] )
				{
					case 'Y':	r += this.getFullYear(); break;
					case 'y':	r += Date._f(this.getFullYear() % 100); break;

					case 'N':	r += String.ucfirst(Lang.get('Date').months[1][this.getMonth()]); break;
					case 'n':	r += Lang.get('Date').months[1][this.getMonth()]; break;

					case 'M':	r += Date._f(this.getMonth()+1); break;
					case 'm':	r += this.getMonth()+1; break;

					case 'D':	r += Date._f(this.getDate()); break;
					case 'd':	r += this.getDate(); break;

					case 'H':	r += Date._f(this.getHours()); break;
					case 'h':	r += this.getHours(); break;

					case 'I':	r += Date._f(this.getMinutes()); break;
					case 'i':	r += this.getMinutes(); break;

					case 'S':	r += Date._f(this.getSeconds()); break;
					case 's':	r += this.getSeconds(); break;

					default:		r += f[i]; break;
				}
			}

			this.setTime(t);

			return	r;
		},

		getLocaleDateShort: function () {
			var str = '';
			if (this.isToday()) {
				str = this.getLocaleTime();
			} else if (this.isThisYear()) {
				str = this.getLocaleShortDayMonth();
			} else {
				str = this.getLocaleShortDayMonthYear();
			}
			return str;
		},

		getLocaleDateFull: function () {
			var str = '';
			if (this.isToday()) {
				str = this.getLocaleTodayTime();
			} else if (this.isYesterday()) {
				str = this.getLocaleYesterdayTime();
			} else if (this.isThisYear()) {
				str = this.getLocaleDayMonthTime();
			} else {
				str = this.getLocaleDayMonthYearTime();
			}
			return str;
		},

		getLocaleFullDate: function () {
			var day = String.ucfirst(Lang.get('Date').weekdays_full[this.getDay()]);
			var timezoneOffset = -this.getTimezoneOffset(), gmtStr = '';

			if (timezoneOffset > 0) {
				gmtStr += '+';
			} else if (timezoneOffset < 0) {
				gmtStr += '-';
			}

			gmtStr += Date._f(timezoneOffset / 60) + ':' + Date._f(timezoneOffset % 60);

			if (mailru.LANG == 'en_US') {
				return day + ', ' + this.format('n d, Y') + ' ' + this.getLocaleTime() + ' ' + gmtStr;
			}
			return day + ', ' + this.format('d n Y') + ', ' + this.getLocaleTime() + ' ' + gmtStr;
		},

		getLocaleTodayTime: function () {
			return String.ucfirst(Lang.get('Date').today) + ', ' + this.getLocaleTime();
		},

		getLocaleYesterdayTime: function () {
			return String.ucfirst(Lang.get('Date').yesterday) + ', ' + this.getLocaleTime();
		},

		getLocaleDayMonthTime: function () {
			if (mailru.LANG == 'en_US') {
				return this.format('N d') + ', ' + this.getLocaleTime();
			}
			return this.format('d n') + ', ' + this.getLocaleTime();
		},

		getLocaleDayMonthYearTime: function () {
			if (mailru.LANG == 'en_US') {
				return this.format('N d, Y') + ' ' + this.getLocaleTime();
			}
			return this.format('d n Y') + ', ' + this.getLocaleTime();
		},

		getLocaleTime: function () {
			if (mailru.LANG == 'en_US') {
				return (this.getHours() % 12 || 12) + ':' + this.format('I') + ' ' + (this.getHours() < 12 ? 'AM' : 'PM');
			}
			return this.format('h:I');
		},

		getLocaleShortDayMonth: function () {
			var month = Lang.get('Date').months[2][this.getMonth()];
			if (mailru.LANG == 'en_US') {
				return month + ' ' + this.format('d');
			}
			return this.format('d') + ' ' + month;
		},

		getLocaleShortDayMonthYear: function () {
			if (mailru.LANG == 'en_US') {
				return this.format('M/D/y');
			}
			return this.format('D.M.y');
		},

		diffYears: function (Y, M, D)
		{
			if( isNaN(Y) )
			{
				Y	= Date.parse(Y);
				D	= Y.getDate();
				M	= Y.getMonth() + 1;
				Y	= Y.getFullYear();
			}
			var cM	= this.getMonth()+1;

			Y	= this.getFullYear() - Y;

			if( (M > cM) || (D > this.getDate() && M == cM) ) Y--;

			return	Y;
		}

	});
	// END: Date();

	Date.setNow(window.time || window.TIME || now());

	setInterval(function (){
		Date.changeNow();
	}, 60000);

	jsLoader.loaded('{jsCore}Date', 1);

// data/ru/images/js/ru/jsCore/Date.js end

// data/ru/images/js/ru/jsCore/jsCore.ajs.js start

(function (global, _document, jsCore){
	var
	  _toString	= Object.prototype.toString
	, _Func		= Function.prototype
	, isCSS1	= _document.compatMode === "CSS1Compat"
	, docEl		= _document.documentElement

	// ajs object
	, ajs = jsCore.extend(global["ajs"] || {}, {
		  _clickFn: {}

		, F:			jsCore.F
		, Event:		jsEvent
		, Mouse:		jsEvent.Mouse

		, now:			function (){ return +new Date; }
		, uniqId:		function (){ return jsCore.getUniqId.apply(jsCore, arguments); }
		, wait:			function (){ jsCore.wait.apply(jsCore, arguments); }
		, notify:		function (){ jsCore.notify.apply(jsCore, arguments); }
		, extend:		jsCore.extend
		, clone:		function _clone(obj){
							var res = {}, key, val;
							for( key in obj ) if( obj.hasOwnProperty(key) ){
								val = obj[key];
								res[key] = val !== null && typeof val === 'object' ? _clone(val) : val;
							}
							return	res;
						}

		, encode:		function (s){ return encodeURIComponent(s); }
		, retFalse:		function(){ return false }
		, retTrue:		function(){ return true }
		, isset:		defined
		, unset:		function (obj, key){
							obj[key] = void 0;
							return delete obj[key];
						}
		, css:			function (node, css){ node && ajs.extend(node.style || {}, css); }

		, map:			Array.map
		, each:			function (o/*Object*/, I/*Function*/, a/*isArray*/)
						{
							if( o )
							{
								if( (o.constructor === Array) || a === true || a === 1 )
									for( var i = 0, n = o.length; i < n; i++ ) I.call(a, o[i], i, o);
								else
									for( var i in o ) I.call(a, o[i], i, o);
							}
						}
		, filter:		Array.filter
		, remove:		Array.remove
		, indexOf:		Array.indexOf

		, file:			jsCore.file
		, require:		function (){ jsLoader['require'].apply(jsLoader, arguments); }
		, loaded:		function (){ jsLoader['loaded'].apply(jsLoader, arguments); }
		, log:			debug.log
		, plural:		function (num, lang, glue){
			if( typeof lang == 'string' ) lang = Lang.get(lang);
			return	String.num(num, lang, glue);
		}

		, htmlEncode:	function(str){ return ajs.Html.escape(str) } // compatibility, TODO:: replace with htmlEncode:ajs.Html.escape after MAIL-12977

		, toObject:		String.toObject
		, toQuery:		String.toQuery

		, sleep:		Timeout.set
		, clearSleep:	Timeout.clear
		, loop:			Interval.set
		, clearLoop:	Interval.clear

		, createClass:	function (name, Ext, methods) {
			var NewClass;

			if( ajs.isObject(name) || ajs.isFunction(name) )
			{
				if( !name.classUniqId && (name.statics || name.methods) )
				{	// jsClass({ name: 'Class name', extend: [], statics: {}, methods: {} })
					NewClass	= jsClass.create(name.name, name);
				}
				else if( ajs.isFunction(name) || Array.isArray(name) )
				{	// jsClass([Extend], { methods })
					NewClass	= jsClass.create().extend( name ).methods( Ext );
				}
				else
				{	// jsClass({ methods })
					NewClass	= jsClass.create().methods( name );
				}
			}
			else
			{	// jsClass('Class name', [Extend], { methods })
				NewClass	= Array.isArray(name) ? jsClass.create(name[0], name[1]) : jsClass.create(name);

				if( methods ) NewClass.extend.apply(NewClass, Ext).methods(methods);
				else if( Ext ) NewClass.methods( Ext );
			}

			return	NewClass;
		}
	});


	if( _Func.gap === void 0 ) _Func.gap = function (context, delay)
	{
		if( context >= 0 )
		{
			delay	= context;
			context	= {};
		}

		var self = this;
		return	function ()
		{
			var a = arguments;
			setTimeout(function (){ self.apply(context, a); }, delay||0);
		};
	};


	Array.forEach(['String', 'Number', 'Array', 'Object', 'Function'], function (type){
		if( !ajs['is'+type] ) ajs['is'+type] = function(arg){
			return	_toString.call(arg) === '[object '+type+']';
		};
	});

	ajs.windowWidth = function ()/**Number*/{
		return	global.innerWidth
					? global.innerWidth
					: (docEl
						? (docEl.clientWidth || _document.body && _document.body.clientWidth || 0)
						: 0)
			;
	};

	ajs.windowHeight = function ()/**Number*/{
		return	global.innerHeight
					? global.innerHeight
					: (docEl
						? (docEl.clientHeight || _document.body && _document.body.clientHeight || 0)
						: 0)
				;
	};

	ajs.scrollTop = function (){
//		return	isCSS1 && $.browser.msie ? docEl.scrollTop : _document.body && _document.body.scrollTop || 0;
		return typeof pageYOffset !== 'undefined' ?
			pageYOffset :
			(docEl.clientHeight ? docEl : _document.body).scrollTop;
	};

	ajs.scrollLeft = function (){
//		return	isCSS1 && $.browser.msie ? docEl.scrollLeft : _document.body && _document.body.scrollLeft || 0;
		return typeof pageXOffset !== 'undefined' ?
			pageXOffset :
			(docEl.clientHeight ? docEl : _document.body).scrollLeft;
	};


	ajs.uuid = function(){
		var S4 = function (){
			return Math.floor(Math.random() * 0x10000 /* 65536 */).toString(16);
		};

		return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
	};


	ajs.openWindow = function (url, opts){
		opts = ajs.extend({
			  name:			'window'+ajs.now()
			, fullscreen:	0
			, location:		1
			, menubar:		1
			, resizable:	1
			, scrollbars:	1
			, status:		1
			, titlebar:		1
			, toolbar:		1
			, left:			''
			, top:			''
			, width:		''
			, height:		''
		}, opts);

		if( (opts.left == '') && (opts.width > 0) )	opts.left	= Math.max(0, (screen.width - opts.width)/2);
		if( (opts.top == '') && (opts.height > 0) )	opts.top	= Math.max(0, (screen.height - opts.height)/2);

		var _p = [];
		ajs.each(opts, function (v, k){ if( v !== '' ) _p.push(k+'='+v); });

		return	window.open(url, opts.name, _p.join(','));
	};


	ajs.openPopUp = function (url, opts){
		return	ajs.openWindow(url, ajs.extend({
			  location:		0
			, menubar:		0
			, resizable:	0
			, toolbar:		0
		}, opts));
	};


	ajs.click = function (name, fn){
		if( !fn ){
			fn   = name;
			name = 'default';
		}

		if( !ajs._clickFn[name] ) ajs._clickFn[name] = [];
		ajs._clickFn[name].push(fn);
	};


	$(document).click(function (evt){
		var node = evt.target, name, clickFn, res;

		if( node ) do {
			if( node.nodeType == 1 ){
				name = node.getAttribute('data-click');
				evt.currentTarget = node;

				if( name === null && node.tagName == 'A' ){
					name = 'default';
				}

				clickFn = ajs._clickFn[name];

				if( typeof clickFn !== 'undefined' ){
					for( var i = 0, n = clickFn.length; i < n; i++ ){
						res = clickFn[i].call(node, evt);

						if( evt.isImmediatePropagationStopped() ){
							return;
						}
					}

					if( evt.isPropagationStopped() ){
						return;
					}
				}
			}
		}
		while( (node = node.parentNode) && (node !== document.body) );
	});


	/**
	 * Experimental exports
	 *
	 * @param	{String}	filename -- which alias
	 * @param	{Object}	object
	 */
	ajs.exports = function (filename, object){
		var namespace = filename.replace(/^.+\}(.+\/)?/, '').split('.');

		if( namespace.length > 1 ){
			var name = namespace.pop();
			jsCore.namespace(namespace.join('.'))[name] = object;
		} else {
			window[namespace[0]] = object;
		}

		ajs.loaded(filename);
	};


	// @export
	global["ajs"] = ajs;
})(window, document, jsCore);

jsLoader.loaded('{jsCore}jsCore.ajs', 1);


// data/ru/images/js/ru/jsCore/jsCore.ajs.js end

// data/ru/images/js/ru/jsCore/swfobject.js start

/*	SWFObject v2.2 <http://code.google.com/p/swfobject/>
	is released under the MIT License <http://www.opensource.org/licenses/mit-license.php>
*/

if (!window.swfobject)
{
	var swfobject = function() {

		var UNDEF = "undefined",
			OBJECT = "object",
			SHOCKWAVE_FLASH = "Shockwave Flash",
			SHOCKWAVE_FLASH_AX = "ShockwaveFlash.ShockwaveFlash",
			FLASH_MIME_TYPE = "application/x-shockwave-flash",
			EXPRESS_INSTALL_ID = "SWFObjectExprInst",
			ON_READY_STATE_CHANGE = "onreadystatechange",

			win = window,
			doc = document,
			nav = navigator,

			plugin = false,
			domLoadFnArr = [main],
			regObjArr = [],
			objIdArr = [],
			listenersArr = [],
			storedAltContent,
			storedAltContentId,
			storedCallbackFn,
			storedCallbackObj,
			isDomLoaded = false,
			isExpressInstallActive = false,
			dynamicStylesheet,
			dynamicStylesheetMedia,
			autoHideShow = true,

		/* Centralized function for browser feature detection
			- User agent string detection is only used when no good alternative is possible
			- Is executed directly for optimal performance
		*/
		ua = function() {
			var w3cdom = typeof doc.getElementById != UNDEF && typeof doc.getElementsByTagName != UNDEF && typeof doc.createElement != UNDEF,
				u = nav.userAgent.toLowerCase(),
				p = nav.platform.toLowerCase(),
				windows = p ? /win/.test(p) : /win/.test(u),
				mac = p ? /mac/.test(p) : /mac/.test(u),
				webkit = /webkit/.test(u) ? parseFloat(u.replace(/^.*webkit\/(\d+(\.\d+)?).*$/, "$1")) : false, // returns either the webkit version or false if not webkit
				ie = !+"\v1", // feature detection based on Andrea Giammarchi's solution: http://webreflection.blogspot.com/2009/01/32-bytes-to-know-if-your-browser-is-ie.html
				playerVersion = [0,0,0],
				d = null;
			if (typeof nav.plugins != UNDEF && typeof nav.plugins[SHOCKWAVE_FLASH] == OBJECT) {
				d = nav.plugins[SHOCKWAVE_FLASH].description;
				if (d && !(typeof nav.mimeTypes != UNDEF && nav.mimeTypes[FLASH_MIME_TYPE] && !nav.mimeTypes[FLASH_MIME_TYPE].enabledPlugin)) { // navigator.mimeTypes["application/x-shockwave-flash"].enabledPlugin indicates whether plug-ins are enabled or disabled in Safari 3+
					plugin = true;
					ie = false; // cascaded feature detection for Internet Explorer
					d = d.replace(/^.*\s+(\S+\s+\S+$)/, "$1");
					playerVersion[0] = parseInt(d.replace(/^(.*)\..*$/, "$1"), 10);
					playerVersion[1] = parseInt(d.replace(/^.*\.(.*)\s.*$/, "$1"), 10);
					playerVersion[2] = /[a-zA-Z]/.test(d) ? parseInt(d.replace(/^.*[a-zA-Z]+(.*)$/, "$1"), 10) : 0;
				}
			}
			else if (typeof win.ActiveXObject != UNDEF) {
				try {
					var a = new ActiveXObject(SHOCKWAVE_FLASH_AX);
					if (a) { // a will return null when ActiveX is disabled
						d = a.GetVariable("$version");
						if (d) {
							ie = true; // cascaded feature detection for Internet Explorer
							d = d.split(" ")[1].split(",");
							playerVersion = [parseInt(d[0], 10), parseInt(d[1], 10), parseInt(d[2], 10)];
						}
					}
				}
				catch(e) {}
			}
			return { w3:w3cdom, pv:playerVersion, wk:webkit, ie:ie, win:windows, mac:mac };
		}(),

		/* Cross-browser onDomLoad
			- Will fire an event as soon as the DOM of a web page is loaded
			- Internet Explorer workaround based on Diego Perini's solution: http://javascript.nwbox.com/IEContentLoaded/
			- Regular onload serves as fallback
		*/
		onDomLoad = function() {
			if (!ua.w3) { return; }
			if ((typeof doc.readyState != UNDEF && doc.readyState == "complete") || (typeof doc.readyState == UNDEF && (doc.getElementsByTagName("body")[0] || doc.body))) { // function is fired after onload, e.g. when script is inserted dynamically
				callDomLoadFunctions();
			}
			if (!isDomLoaded) {
				if (typeof doc.addEventListener != UNDEF) {
					doc.addEventListener("DOMContentLoaded", callDomLoadFunctions, false);
				}
				if (ua.ie && ua.win) {
					doc.attachEvent(ON_READY_STATE_CHANGE, function() {
						if (doc.readyState == "complete") {
							doc.detachEvent(ON_READY_STATE_CHANGE, arguments.callee);
							callDomLoadFunctions();
						}
					});
					if (win == top) { // if not inside an iframe
						(function(){
							if (isDomLoaded) { return; }
							try {
								doc.documentElement.doScroll("left");
							}
							catch(e) {
								setTimeout(arguments.callee, 0);
								return;
							}
							callDomLoadFunctions();
						})();
					}
				}
				if (ua.wk) {
					(function(){
						if (isDomLoaded) { return; }
						if (!/loaded|complete/.test(doc.readyState)) {
							setTimeout(arguments.callee, 0);
							return;
						}
						callDomLoadFunctions();
					})();
				}
				addLoadEvent(callDomLoadFunctions);
			}
		}();

		function callDomLoadFunctions() {
			if (isDomLoaded) { return; }
			try { // test if we can really add/remove elements to/from the DOM; we don't want to fire it too early
				var t = doc.getElementsByTagName("body")[0].appendChild(createElement("span"));
				t.parentNode.removeChild(t);
			}
			catch (e) { return; }
			isDomLoaded = true;
			var dl = domLoadFnArr.length;
			for (var i = 0; i < dl; i++) {
				domLoadFnArr[i]();
			}
		}

		function addDomLoadEvent(fn) {
			if (isDomLoaded) {
				fn();
			}
			else {
				domLoadFnArr[domLoadFnArr.length] = fn; // Array.push() is only available in IE5.5+
			}
		}

		/* Cross-browser onload
			- Based on James Edwards' solution: http://brothercake.com/site/resources/scripts/onload/
			- Will fire an event as soon as a web page including all of its assets are loaded
		 */
		function addLoadEvent(fn) {
			if (typeof win.addEventListener != UNDEF) {
				win.addEventListener("load", fn, false);
			}
			else if (typeof doc.addEventListener != UNDEF) {
				doc.addEventListener("load", fn, false);
			}
			else if (typeof win.attachEvent != UNDEF) {
				addListener(win, "onload", fn);
			}
			else if (typeof win.onload == "function") {
				var fnOld = win.onload;
				win.onload = function() {
					fnOld();
					fn();
				};
			}
			else {
				win.onload = fn;
			}
		}

		/* Main function
			- Will preferably execute onDomLoad, otherwise onload (as a fallback)
		*/
		function main() {
			if (plugin) {
				testPlayerVersion();
			}
			else {
				matchVersions();
			}
		}

		/* Detect the Flash Player version for non-Internet Explorer browsers
			- Detecting the plug-in version via the object element is more precise than using the plugins collection item's description:
			  a. Both release and build numbers can be detected
			  b. Avoid wrong descriptions by corrupt installers provided by Adobe
			  c. Avoid wrong descriptions by multiple Flash Player entries in the plugin Array, caused by incorrect browser imports
			- Disadvantage of this method is that it depends on the availability of the DOM, while the plugins collection is immediately available
		*/
		function testPlayerVersion() {
			var b = doc.getElementsByTagName("body")[0];
			var o = createElement(OBJECT);
			o.setAttribute("type", FLASH_MIME_TYPE);
			var t = b.appendChild(o);
			if (t) {
				var counter = 0;
				(function(){
					if (typeof t.GetVariable != UNDEF) {
						var d = t.GetVariable("$version");
						if (d) {
							d = d.split(" ")[1].split(",");
							ua.pv = [parseInt(d[0], 10), parseInt(d[1], 10), parseInt(d[2], 10)];
						}
					}
					else if (counter < 10) {
						counter++;
						setTimeout(arguments.callee, 10);
						return;
					}
					b.removeChild(o);
					t = null;
					matchVersions();
				})();
			}
			else {
				matchVersions();
			}
		}

		/* Perform Flash Player and SWF version matching; static publishing only
		*/
		function matchVersions() {
			var rl = regObjArr.length;
			if (rl > 0) {
				for (var i = 0; i < rl; i++) { // for each registered object element
					var id = regObjArr[i].id;
					var cb = regObjArr[i].callbackFn;
					var cbObj = {success:false, id:id};
					if (ua.pv[0] > 0) {
						var obj = getElementById(id);
						if (obj) {
							if (hasPlayerVersion(regObjArr[i].swfVersion) && !(ua.wk && ua.wk < 312)) { // Flash Player version >= published SWF version: Houston, we have a match!
								setVisibility(id, true);
								if (cb) {
									cbObj.success = true;
									cbObj.ref = getObjectById(id);
									cb(cbObj);
								}
							}
							else if (regObjArr[i].expressInstall && canExpressInstall()) { // show the Adobe Express Install dialog if set by the web page author and if supported
								var att = {};
								att.data = regObjArr[i].expressInstall;
								att.width = obj.getAttribute("width") || "0";
								att.height = obj.getAttribute("height") || "0";
								if (obj.getAttribute("class")) { att.styleclass = obj.getAttribute("class"); }
								if (obj.getAttribute("align")) { att.align = obj.getAttribute("align"); }
								// parse HTML object param element's name-value pairs
								var par = {};
								var p = obj.getElementsByTagName("param");
								var pl = p.length;
								for (var j = 0; j < pl; j++) {
									if (p[j].getAttribute("name").toLowerCase() != "movie") {
										par[p[j].getAttribute("name")] = p[j].getAttribute("value");
									}
								}
								showExpressInstall(att, par, id, cb);
							}
							else { // Flash Player and SWF version mismatch or an older Webkit engine that ignores the HTML object element's nested param elements: display alternative content instead of SWF
								displayAltContent(obj);
								if (cb) { cb(cbObj); }
							}
						}
					}
					else {	// if no Flash Player is installed or the fp version cannot be detected we let the HTML object element do its job (either show a SWF or alternative content)
						setVisibility(id, true);
						if (cb) {
							var o = getObjectById(id); // test whether there is an HTML object element or not
							if (o && typeof o.SetVariable != UNDEF) {
								cbObj.success = true;
								cbObj.ref = o;
							}
							cb(cbObj);
						}
					}
				}
			}
		}

		function getObjectById(objectIdStr) {
			var r = null;
			var o = getElementById(objectIdStr);
			if (o && o.nodeName == "OBJECT") {
				if (typeof o.SetVariable != UNDEF) {
					r = o;
				}
				else {
					var n = o.getElementsByTagName(OBJECT)[0];
					if (n) {
						r = n;
					}
				}
			}
			return r;
		}

		/* Requirements for Adobe Express Install
			- only one instance can be active at a time
			- fp 6.0.65 or higher
			- Win/Mac OS only
			- no Webkit engines older than version 312
		*/
		function canExpressInstall() {
			return !isExpressInstallActive && hasPlayerVersion("6.0.65") && (ua.win || ua.mac) && !(ua.wk && ua.wk < 312);
		}

		/* Show the Adobe Express Install dialog
			- Reference: http://www.adobe.com/cfusion/knowledgebase/index.cfm?id=6a253b75
		*/
		function showExpressInstall(att, par, replaceElemIdStr, callbackFn) {
			isExpressInstallActive = true;
			storedCallbackFn = callbackFn || null;
			storedCallbackObj = {success:false, id:replaceElemIdStr};
			var obj = getElementById(replaceElemIdStr);
			if (obj) {
				if (obj.nodeName == "OBJECT") { // static publishing
					storedAltContent = abstractAltContent(obj);
					storedAltContentId = null;
				}
				else { // dynamic publishing
					storedAltContent = obj;
					storedAltContentId = replaceElemIdStr;
				}
				att.id = EXPRESS_INSTALL_ID;
				if (typeof att.width == UNDEF || (!/%$/.test(att.width) && parseInt(att.width, 10) < 310)) { att.width = "310"; }
				if (typeof att.height == UNDEF || (!/%$/.test(att.height) && parseInt(att.height, 10) < 137)) { att.height = "137"; }
				doc.title = doc.title.slice(0, 47) + " - Flash Player Installation";
				var pt = ua.ie && ua.win ? "ActiveX" : "PlugIn",
					fv = "MMredirectURL=" + win.location.toString().replace(/&/g,"%26") + "&MMplayerType=" + pt + "&MMdoctitle=" + doc.title;
				if (typeof par.flashvars != UNDEF) {
					par.flashvars += "&" + fv;
				}
				else {
					par.flashvars = fv;
				}
				// IE only: when a SWF is loading (AND: not available in cache) wait for the readyState of the object element to become 4 before removing it,
				// because you cannot properly cancel a loading SWF file without breaking browser load references, also obj.onreadystatechange doesn't work
				if (ua.ie && ua.win && obj.readyState != 4) {
					var newObj = createElement("div");
					replaceElemIdStr += "SWFObjectNew";
					newObj.setAttribute("id", replaceElemIdStr);
					obj.parentNode.insertBefore(newObj, obj); // insert placeholder div that will be replaced by the object element that loads expressinstall.swf
					obj.style.display = "none";
					(function(){
						if (obj.readyState == 4) {
							obj.parentNode.removeChild(obj);
						}
						else {
							setTimeout(arguments.callee, 10);
						}
					})();
				}
				createSWF(att, par, replaceElemIdStr);
			}
		}

		/* Functions to abstract and display alternative content
		*/
		function displayAltContent(obj) {
			if (ua.ie && ua.win && obj.readyState != 4) {
				// IE only: when a SWF is loading (AND: not available in cache) wait for the readyState of the object element to become 4 before removing it,
				// because you cannot properly cancel a loading SWF file without breaking browser load references, also obj.onreadystatechange doesn't work
				var el = createElement("div");
				obj.parentNode.insertBefore(el, obj); // insert placeholder div that will be replaced by the alternative content
				el.parentNode.replaceChild(abstractAltContent(obj), el);
				obj.style.display = "none";
				(function(){
					if (obj.readyState == 4) {
						obj.parentNode.removeChild(obj);
					}
					else {
						setTimeout(arguments.callee, 10);
					}
				})();
			}
			else {
				obj.parentNode.replaceChild(abstractAltContent(obj), obj);
			}
		}

		function abstractAltContent(obj) {
			var ac = createElement("div");
			if (ua.win && ua.ie) {
				ac.innerHTML = obj.innerHTML;
			}
			else {
				var nestedObj = obj.getElementsByTagName(OBJECT)[0];
				if (nestedObj) {
					var c = nestedObj.childNodes;
					if (c) {
						var cl = c.length;
						for (var i = 0; i < cl; i++) {
							if (!(c[i].nodeType == 1 && c[i].nodeName == "PARAM") && !(c[i].nodeType == 8)) {
								ac.appendChild(c[i].cloneNode(true));
							}
						}
					}
				}
			}
			return ac;
		}

		/* Cross-browser dynamic SWF creation
		*/
		function createSWF(attObj, parObj, id) {
			var r, el = getElementById(id);
			if (ua.wk && ua.wk < 312) { return r; }
			if (el) {
				if (typeof attObj.id == UNDEF) { // if no 'id' is defined for the object element, it will inherit the 'id' from the alternative content
					attObj.id = id;
				}
				if (ua.ie && ua.win) { // Internet Explorer + the HTML object element + W3C DOM methods do not combine: fall back to outerHTML
					var att = "";
					for (var i in attObj) {
						if (attObj[i] != Object.prototype[i]) { // filter out prototype additions from other potential libraries
							if (i.toLowerCase() == "data") {
								parObj.movie = attObj[i];
							}
							else if (i.toLowerCase() == "styleclass") { // 'class' is an ECMA4 reserved keyword
								att += ' class="' + attObj[i] + '"';
							}
							else if (i.toLowerCase() != "classid") {
								att += ' ' + i + '="' + attObj[i] + '"';
							}
						}
					}
					var par = "";
					for (var j in parObj) {
						if (parObj[j] != Object.prototype[j]) { // filter out prototype additions from other potential libraries
							par += '<param name="' + j + '" value="' + parObj[j] + '" />';
						}
					}
					el.outerHTML = '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"' + att + '>' + par + '</object>';
					objIdArr[objIdArr.length] = attObj.id; // stored to fix object 'leaks' on unload (dynamic publishing only)
					r = getElementById(attObj.id);
				}
				else { // well-behaving browsers
					var o = createElement(OBJECT);
					o.setAttribute("type", FLASH_MIME_TYPE);
					for (var m in attObj) {
						if (attObj[m] != Object.prototype[m]) { // filter out prototype additions from other potential libraries
							if (m.toLowerCase() == "styleclass") { // 'class' is an ECMA4 reserved keyword
								o.setAttribute("class", attObj[m]);
							}
							else if (m.toLowerCase() != "classid") { // filter out IE specific attribute
								o.setAttribute(m, attObj[m]);
							}
						}
					}
					for (var n in parObj) {
						if (parObj[n] != Object.prototype[n] && n.toLowerCase() != "movie") { // filter out prototype additions from other potential libraries and IE specific param element
							createObjParam(o, n, parObj[n]);
						}
					}
					el.parentNode.replaceChild(o, el);
					r = o;
				}
			}
			return r;
		}

		function createObjParam(el, pName, pValue) {
			var p = createElement("param");
			p.setAttribute("name", pName);
			p.setAttribute("value", pValue);
			el.appendChild(p);
		}

		/* Cross-browser SWF removal
			- Especially needed to safely and completely remove a SWF in Internet Explorer
		*/
		function removeSWF(id) {
			var obj = getElementById(id);
			if (obj && obj.nodeName == "OBJECT") {
				if (ua.ie && ua.win) {
					obj.style.display = "none";
					(function(){
						if (obj.readyState == 4) {
							removeObjectInIE(id);
						}
						else {
							setTimeout(arguments.callee, 10);
						}
					})();
				}
				else {
					obj.parentNode.removeChild(obj);
				}
			}
		}

		function removeObjectInIE(id) {
			var obj = getElementById(id);
			if (obj) {
				for (var i in obj) {
					if (typeof obj[i] == "function") {
						obj[i] = null;
					}
				}
				obj.parentNode.removeChild(obj);
			}
		}

		/* Functions to optimize JavaScript compression
		*/
		function getElementById(id) {
			var el = null;
			try {
				el = doc.getElementById(id);
			}
			catch (e) {}
			return el;
		}

		function createElement(el) {
			return doc.createElement(el);
		}

		/* Updated attachEvent function for Internet Explorer
			- Stores attachEvent information in an Array, so on unload the detachEvent functions can be called to avoid memory leaks
		*/
		function addListener(target, eventType, fn) {
			target.attachEvent(eventType, fn);
			listenersArr[listenersArr.length] = [target, eventType, fn];
		}

		/* Flash Player and SWF content version matching
		*/
		function hasPlayerVersion(rv) {
			var pv = ua.pv, v = rv.split(".");
			v[0] = parseInt(v[0], 10);
			v[1] = parseInt(v[1], 10) || 0; // supports short notation, e.g. "9" instead of "9.0.0"
			v[2] = parseInt(v[2], 10) || 0;
			return (pv[0] > v[0] || (pv[0] == v[0] && pv[1] > v[1]) || (pv[0] == v[0] && pv[1] == v[1] && pv[2] >= v[2])) ? true : false;
		}

		/* Cross-browser dynamic CSS creation
			- Based on Bobby van der Sluis' solution: http://www.bobbyvandersluis.com/articles/dynamicCSS.php
		*/
		function createCSS(sel, decl, media, newStyle) {
			if (ua.ie && ua.mac) { return; }
			var h = doc.getElementsByTagName("head")[0];
			if (!h) { return; } // to also support badly authored HTML pages that lack a head element
			var m = (media && typeof media == "string") ? media : "screen";
			if (newStyle) {
				dynamicStylesheet = null;
				dynamicStylesheetMedia = null;
			}
			if (!dynamicStylesheet || dynamicStylesheetMedia != m) {
				// create dynamic stylesheet + get a global reference to it
				var s = createElement("style");
				s.setAttribute("type", "text/css");
				s.setAttribute("media", m);
				dynamicStylesheet = h.appendChild(s);
				if (ua.ie && ua.win && typeof doc.styleSheets != UNDEF && doc.styleSheets.length > 0) {
					dynamicStylesheet = doc.styleSheets[doc.styleSheets.length - 1];
				}
				dynamicStylesheetMedia = m;
			}
			// add style rule
			if (ua.ie && ua.win) {
				if (dynamicStylesheet && typeof dynamicStylesheet.addRule == OBJECT) {
					dynamicStylesheet.addRule(sel, decl);
				}
			}
			else {
				if (dynamicStylesheet && typeof doc.createTextNode != UNDEF) {
					dynamicStylesheet.appendChild(doc.createTextNode(sel + " {" + decl + "}"));
				}
			}
		}

		function setVisibility(id, isVisible) {
			if (!autoHideShow) { return; }
			var v = isVisible ? "visible" : "hidden";
			if (isDomLoaded && getElementById(id)) {
				getElementById(id).style.visibility = v;
			}
			else {
				createCSS("#" + id, "visibility:" + v);
			}
		}

		/* Filter to avoid XSS attacks
		*/
		function urlEncodeIfNecessary(s) {
			var regex = /[\\\"<>\.;]/;
			var hasBadChars = regex.exec(s) != null;
			return hasBadChars && typeof encodeURIComponent != UNDEF ? encodeURIComponent(s) : s;
		}

		/* Release memory to avoid memory leaks caused by closures, fix hanging audio/video threads and force open sockets/NetConnections to disconnect (Internet Explorer only)
		*/
		var cleanup = function() {
			if (ua.ie && ua.win) {
				window.attachEvent("onunload", function() {
					try {
						// remove listeners to avoid memory leaks
						var ll = listenersArr.length;
						for (var i = 0; i < ll; i++) {
							listenersArr[i][0].detachEvent(listenersArr[i][1], listenersArr[i][2]);
						}
						// cleanup dynamically embedded objects to fix audio/video threads and force open sockets and NetConnections to disconnect
						var il = objIdArr.length;
						for (var j = 0; j < il; j++) {
							removeSWF(objIdArr[j]);
						}
						// cleanup library's main closures to avoid memory leaks
						for (var k in ua) {
							ua[k] = null;
						}
						ua = null;
						for (var l in swfobject) {
							swfobject[l] = null;
						}
					}
					catch (er){}
					
					swfobject = null;
				});
			}
		}();

		return {
			/* Public API
				- Reference: http://code.google.com/p/swfobject/wiki/documentation
			*/
			registerObject: function(objectIdStr, swfVersionStr, xiSwfUrlStr, callbackFn) {
				if (ua.w3 && objectIdStr && swfVersionStr) {
					var regObj = {};
					regObj.id = objectIdStr;
					regObj.swfVersion = swfVersionStr;
					regObj.expressInstall = xiSwfUrlStr;
					regObj.callbackFn = callbackFn;
					regObjArr[regObjArr.length] = regObj;
					setVisibility(objectIdStr, false);
				}
				else if (callbackFn) {
					callbackFn({success:false, id:objectIdStr});
				}
			},

			getObjectById: function(objectIdStr) {
				if (ua.w3) {
					return getObjectById(objectIdStr);
				}
			},

			embedSWF: function(swfUrlStr, replaceElemIdStr, widthStr, heightStr, swfVersionStr, xiSwfUrlStr, flashvarsObj, parObj, attObj, callbackFn) {
				var callbackObj = {success:false, id:replaceElemIdStr};
				if (ua.w3 && !(ua.wk && ua.wk < 312) && swfUrlStr && replaceElemIdStr && widthStr && heightStr && swfVersionStr) {
					setVisibility(replaceElemIdStr, false);
					addDomLoadEvent(function() {
						widthStr += ""; // auto-convert to string
						heightStr += "";
						var att = {};
						if (attObj && typeof attObj === OBJECT) {
							for (var i in attObj) { // copy object to avoid the use of references, because web authors often reuse attObj for multiple SWFs
								att[i] = attObj[i];
							}
						}
						att.data = swfUrlStr;
						att.width = widthStr;
						att.height = heightStr;
						var par = {};
						if (parObj && typeof parObj === OBJECT) {
							for (var j in parObj) { // copy object to avoid the use of references, because web authors often reuse parObj for multiple SWFs
								par[j] = parObj[j];
							}
						}
						if (flashvarsObj && typeof flashvarsObj === OBJECT) {
							for (var k in flashvarsObj) { // copy object to avoid the use of references, because web authors often reuse flashvarsObj for multiple SWFs
								if (typeof par.flashvars != UNDEF) {
									par.flashvars += "&" + k + "=" + flashvarsObj[k];
								}
								else {
									par.flashvars = k + "=" + flashvarsObj[k];
								}
							}
						}
						if (hasPlayerVersion(swfVersionStr)) { // create SWF
							var obj = createSWF(att, par, replaceElemIdStr);
							if (att.id == replaceElemIdStr) {
								setVisibility(replaceElemIdStr, true);
							}
							callbackObj.success = true;
							callbackObj.ref = obj;
						}
						else if (xiSwfUrlStr && canExpressInstall()) { // show Adobe Express Install
							att.data = xiSwfUrlStr;
							showExpressInstall(att, par, replaceElemIdStr, callbackFn);
							return;
						}
						else { // show alternative content
							setVisibility(replaceElemIdStr, true);
						}
						if (callbackFn) { callbackFn(callbackObj); }
					});
				}
				else if (callbackFn) { callbackFn(callbackObj);	}
			},

			switchOffAutoHideShow: function() {
				autoHideShow = false;
			},

			ua: ua,

			getFlashPlayerVersion: function() {
				return { major:ua.pv[0], minor:ua.pv[1], release:ua.pv[2] };
			},

			hasFlashPlayerVersion: hasPlayerVersion,

			createSWF: function(attObj, parObj, replaceElemIdStr) {
				if (ua.w3) {
					return createSWF(attObj, parObj, replaceElemIdStr);
				}
				else {
					return undefined;
				}
			},

			showExpressInstall: function(att, par, replaceElemIdStr, callbackFn) {
				if (ua.w3 && canExpressInstall()) {
					showExpressInstall(att, par, replaceElemIdStr, callbackFn);
				}
			},

			removeSWF: function(objElemIdStr) {
				if (ua.w3) {
					removeSWF(objElemIdStr);
				}
			},

			createCSS: function(selStr, declStr, mediaStr, newStyleBoolean) {
				if (ua.w3) {
					createCSS(selStr, declStr, mediaStr, newStyleBoolean);
				}
			},

			addDomLoadEvent: addDomLoadEvent,

			addLoadEvent: addLoadEvent,

			getQueryParamValue: function(param) {
				var q = doc.location.search || doc.location.hash;
				if (q) {
					if (/\?/.test(q)) { q = q.split("?")[1]; } // strip question mark
					if (param == null) {
						return urlEncodeIfNecessary(q);
					}
					var pairs = q.split("&");
					for (var i = 0; i < pairs.length; i++) {
						if (pairs[i].substring(0, pairs[i].indexOf("=")) == param) {
							return urlEncodeIfNecessary(pairs[i].substring((pairs[i].indexOf("=") + 1)));
						}
					}
				}
				return "";
			},

			// For internal usage only
			expressInstallCallback: function() {
				if (isExpressInstallActive) {
					var obj = getElementById(EXPRESS_INSTALL_ID);
					if (obj && storedAltContent) {
						obj.parentNode.replaceChild(storedAltContent, obj);
						if (storedAltContentId) {
							setVisibility(storedAltContentId, true);
							if (ua.ie && ua.win) { storedAltContent.style.display = "block"; }
						}
						if (storedCallbackFn) { storedCallbackFn(storedCallbackObj); }
					}
					isExpressInstallActive = false;
				}
			},

			callDomLoadFunctions: callDomLoadFunctions
		};
	}();

	var SWF	= {

		defParams: { allowScriptAccess: 'always', menu: false },

		build: function (Elm/*String*/, p/*Object*/)/*SWFNode*/
		{
			if( typeof Elm == 'string' )Elm = $F( Elm );	// by id
			else if( Elm.append )		Elm = Elm[0];		// jQuery

			var
				  m		= p.movie/*MovieParams*/
				, v		= p.vars || {}/*FlashVars*/
				, p		= $E(this.defParams, p.params)/*Params*/
				, fId	= m.name || jsCore.getUniqId()
				//, H		= document.createElement('B')
			;
			Elm.id			= jsCore.getUniqId();
			//Elm.innerHTML	= '';
			//Elm.appendChild( H );

//			v = $E(v, String.toObject(m.url.split('?')[1]) );
//			Object.forEach(v, function (x, k){ v[k] = encodeURIComponent(x); });

			swfobject.embedSWF(
				  m.url
				, Elm.id
				, m.width || '100%'
				, m.height || '100%'
				, m.ver || m.version || '9.0.0'
				, "expressInstall.swf"
				, v
				, p
				, { id: fId, name: fId, bgcolor: m.bg || m.bgColor || m.background }
			);

			return	$F('#'+fId);
		}
	};

	jsLoader.loaded('{jsCore}swfobject', 1);
};
 

// data/ru/images/js/ru/jsCore/swfobject.js end

if( 'jQuery' in window ) (function (jQuery, $) {

// data/ru/images/js/ru/jsCore/utils/jsHistory.js start


(function (w, d, l, $)
	{
		var RE_NORMALIZE_URL = new RegExp('^(https?://[^/]+)?/(.+?'+window.location.host+'/)?(cgi-bin/)?', 'g');

		var
			  pid
			, hash		= _hash()
			, iFrame	= $.browser.msie && (d.documentMode < 8 || !d.documentMode)
			, self		= {}
			, url		= (l.pathname + l.search).replace(/#.*/, '')
			, $win		= $(w)
			, evt		= false
			, evtName	= 'hashchange'
			, _listener	= []
			, _urlData	= {}
			, _urlLocalData	= {}
			, _useHistoryAPI = mailru.v2 && history.pushState
			, _hcf
		;


		function normalizeUrl(hash){
			hash = hash.replace(RE_NORMALIZE_URL, '');
			if( !/^\//.test(hash) ){
				hash = '/' + hash;
			}
			return hash;
		}


	// @private
		if( _useHistoryAPI ){
			window.addEventListener('popstate', _hcf = function (){
				_changed( l.toString() );
			}, false);
		}
		else if( ('on'+evtName in w) && !iFrame ){
		// support event
			evt	= true;

			_hcf = function (){
				_changed(_hash( l.toString() ));
			};

			jsEvent.add(w, evtName, _hcf, false);
			jsCore.unload(function (){ jsEvent.remove(w, evtName, _hcf, false); });
		}
		else
		{	if( $B.opera || iFrame )
			// Stupid
				jsCore.ready(function ()
				{
					iFrame	= iFrame ? $('<iframe src="javascript:0;" />').insertAfter('BODY')[0].contentWindow : false;
					if( iFrame ) _fixIE(hash, true);
					if( $B.opera )
					{
						history.navigationMode	= 'compatible';
						w.__jsHistory__	= function ()
						{
							_check();
							Interval.clear(pid);
							pid	= Interval.set(_check, 100);
						};
						$('<img src="javascript:location.href=\'javascript:window.__jsHistory__();\';" />')
							.css({ position: 'absolute', width: 1, height: 1 })
							.appendTo('BODY')
						;
					}
					pid	= Interval.set(_check, 100);
				});
			else
			// Normal browsers
				pid	= Interval.set(_check, 100);
		}


		function _hash(h){
			if( _useHistoryAPI ){
				h = h || normalizeUrl(l.toString());
			}
			else {
				h = ('#' + (h || normalizeUrl(l.toString())).replace(/^[^#]*#/, '').toString()).split('?');

				if( h[1] ){
					h = h[0]+'?'+ajs.toQuery(ajs.toObject(h[1]));

				} else {
					h = h[0];
				}
			}

			return	h;
		}


		function _unload()
		{
			var txt	= $win.triggerHandler('beforeunload');
			return	!txt || confirm(txt);
		}


		function _changed(h, f)
		{
			var local = _urlLocalData[self.get()];

			if( f || h !== hash )
			{
				if( f || local || _unload() )
				{
					if( !f ) self.previous	= self.get();
					if( h !== undefined ) hash = h;

					h = self.get();

					for( var i = _listener.length; i--; )
						_listener[i](h, f, _urlData[h], local);

					if( !evt ) $win.triggerHandler(evtName);
				}
				else
				{	// Restore Hash
					self.set( hash );
				}
			}
		}


		function _check()
		{
			var h = _hash();
			if( h !== hash )
			{
				_changed(h);
				if( iFrame ) _fixIE(h, true);
			}
			else if( iFrame && iFrame.document )
			{
				h	= _hash( iFrame.document.location.toString() );
				if( h !== hash )
				{
					l.hash = h;
					_changed(h);
				}
			}
		}


		function _fixIE(h, write)
		{
			try
			{
				var doc = iFrame.document;
				if( write ) doc.open().close();
				doc.location.hash	= _hash(h);
			}
			catch( err )
			{
				setTimeout(function(){ _fixIE(h, write); }, 10);
			}
		}

	// @public
		$E(self, {

			trust: { test: ajs.retTrue },
			setModifier: normalizeUrl,
			normalizeUrl: normalizeUrl,

			destroy: function() {
				_check = $.noop;
				jsEvent.remove(w, evtName, _hcf, false);
			},

			get: function (){
				var h = hash.replace(/^#/, '');
				return h != '' && self.trust.test(h) ? h : url;
			},

			setHard: function (nHash, data, local){
				self.previous = (self.previous === void 0) ? '' : self.get();
				if( iFrame ) _fixIE(nHash, true);
				hash = nHash;
				var s = nHash.replace(/^#/, '');
				if (data) {
					_urlData[s] = data;
				}
				if (local) {
					_urlLocalData[s] = 1;
				}

				_changed(nHash, true);

				if( _useHistoryAPI ){
					history.pushState(null, null, hash);
				}
				else {
					l.hash = hash;
				}
			},

			getData: function (hash){
				return	_urlData[_hash(normalizeUrl(hash))];
			},

			set: function (nHash, data, local){
				if( self.disabled ){
					l.href = nHash;
					return	false;
				}

				nHash	= _hash(normalizeUrl(nHash));

				if( hash == nHash ){
					return true;
				}
				else if( local || _unload() ){
					self.setHard(nHash, data, local);
					return true;
				}

				return	false;
			},


			realUrl: function ()
			{
				return url;
			},


			change: function (func, force)
			{
				if( !force ) func( this.get() );
				_listener.unshift(func);
				return	this;
			},


			unbind: function (func)
			{
				_listener	= Array.remove(_listener, func);
				return	this;
			},

			one: function (func)
			{
				return	this.change(function (hash)
				{
					func(hash);
					self.unbind(arguments.callee);
				}, true);
			},

			changeTop: function (func, force) {
				if( !force ) func( this.get() );
				_listener.push(func);
				return	this;
			},

			oneTop: function (func)
			{
				return	this.changeTop(function (hash)
				{
					func(hash);
					self.unbind(arguments.callee);
				}, true);
			},

			buildParams: function (add, remove){
				var params = ajs.toObject(this.get().split('?')[1] || '');
				if( remove ) ajs.each(remove, function (key){ delete params[key]; });
				return	ajs.toQuery(ajs.extend(params, add));
			},

			buildUrl: function (add, remove, url){
				return	(url || this.get().split('?')[0]) +'?'+ self.buildParams(add, remove);
			},

			build: function (add, remove, url){
				this.set(self.buildUrl(add, remove, url));
			},

			useHistoryAPI: _useHistoryAPI
		});


		// History methods
		Array.forEach(['go', 'back', 'forward'], function (n)
		{
			self[n] = function (x)
			{
				w.history[n](x);
				return	self;
			};
		});


		// GLOBALS
		w.jsHistory		= self;
	})(window, document, location, jQuery);

	jsLoader.loaded('{utils}jsHistory', 1);

// data/ru/images/js/ru/jsCore/utils/jsHistory.js end

// data/ru/images/js/ru/jsCore/utils/Counter.js start

/**
 * @class	Counter
 */
jsClass
	.create('Counter')
	.statics({

		// show
		d: function(i){
			this.count('//rs.' + mailru.SingleDomainName + '/d' + i + '.gif?rnd=' + Math.random());
		},

		// click
		sb: function(i){
			this.count('//rs.' + mailru.SingleDomainName + '/sb' + i + '.gif?rnd=' + Math.random());
		},

		gstat: function(str){
			this.count('//gstat.' + mailru.staticDomainName + '/gstat?' + str + '&rnd=' + Math.random());
		},

		count: function(src){
			new Image().src = src;
		}
	})
;

jsLoader.loaded('{utils}Counter', 1);
 

// data/ru/images/js/ru/jsCore/utils/Counter.js end

// data/ru/images/js/ru/jsCore/utils/HotKeys.js start

/**
 * @author	RubaXa	<trash@rubaxa.org>
 * @description
 *
 * 		$.hotkeys
 * 			.bind("ctrl+left esc B shift+N", listener);
 *
 * 		$.hotkeys
 * 			.unbind("esc", listener);
 */



(function ($){
		var _rplus = /\s*\+\s*/, keyCode = window.jsEvent && jsEvent.Key || {};

		// namespace
		var HK = $.hotkeys = {};

		function _toHotKey(str){
			var tmp = str.split( _rplus );
			var key	= (tmp[tmp.length-1]+'').toLowerCase();
			var res = {
						  'name':	key
						, 'meta':	(tmp[tmp.length-2] || '')
						, 'code':	(keyCode[key] || key.toUpperCase().charCodeAt(0))
					};
			res.combo = (res.meta ? res.meta +'+'+ key : key);
			res.mnemo = (res.meta ? res.meta +'+'+ res.code : res.code);
			return	res;
		}


		$.hotkeys.on = $.hotkeys.bind = function (keys, func){
			Array.forEach($.trim(keys).split(/\s+/), function (key){
				// Convert string to object
				key	= _toHotKey( key );
				if( !HK[key.mnemo] ){
					HK[key.mnemo]	= [];
				}
				HK[key.mnemo].push([key, func]);
			});
		};


		$.hotkeys.off = $.hotkeys.unbind = function (keys, func){
			Array.forEach($.trim(keys).split(/\s+/), function (key){
				key	= _toHotKey( key );
				var idx = Array.search(HK[key.mnemo] || [], function (X){ return X && X[1] === func; });
				if( idx > -1 ){
					HK[key.mnemo] = Array.removeAt(HK[key.mnemo], idx);
				}
			});
		};


		// Listen global key down
		$(document).keydown(function (evt){
			var
				  code	= evt.keyCode
				, meta	= ''
				, HK	= $.hotkeys
				, fire	= [code]
				, ret	= true
			;

			if( evt.ctrlKey )		meta = 'ctrl';
			else if( evt.shiftKey )	meta = 'shift';
			else if( evt.altKey )	meta = 'alt';
			else if( evt.metaKey )	meta = 'meta';

			if( meta ) fire.push(meta, meta+'+'+code);

			Array.forEach(fire, function (key){
				// Broadcats
				if( HK[key] ) for( var i = 0, n = HK[key].length, X; i < n; i++ ){
					// X[0] — key object
					// X[1] — listener
					X = HK[key][i];
					try {
						if( X[1](evt, X[0]) === false ){
							ret	= false;
						}
					}
					catch( err ){}
				}
			});

			if( !ret ){
				return	false;
			}
		});


		/**
		 * @deprecated
		 * @param	{String}	keys
		 * @param	{Function}	fn
		 */
		$.fn.setHotKey	= function (keys, fn){
			$.hotkeys.bind(keys, fn);
			return	this;
		};


		$.fn.hotKey	= function (keys, fn){
			var type;

			this.bind('focus blur', function (evt){
				if( type !== evt.type ){
					type = evt.type;
					$.hotkeys[evt.type == 'focus' ? 'on' : 'off'](keys, fn);
				}
			});

			return	this;
		};
	})(jQuery);

	jsLoader.loaded('{utils}HotKeys', 1);

// data/ru/images/js/ru/jsCore/utils/HotKeys.js end

// ./data/common/js/ajs/ajs.Router.min.js start

/**!
 * Application router
 * @author	RubaXa	<trash@rubaxa.org>
 *
 * @example
 * 	var Router = new ajs.Router;
 *
 * 	Router.createGroup('/', { id: 'home' })
 * 		.route('*', app.LeftCol)
 * 		.route('.', app.Index)
 * 		.createGroup('blog/', { id: 'blog' } )
 * 			.route('.', app.BlogPosts)
 * 			.route('post/:id', app.BlogPost, { id: 'blog-post' })
 * 			.closeGroup()
 * 		.route('about', { id: 'about' })
 * 	;
 *
 * 	Router.nav('/blog/');
 * 	// OR
 * 	Router.go('blog-post', { id: 2 });
 *
 * 	@todo
 * 		Роутинг на несущесвующий урл.
 */
(function(q,e){function f(a,b,d){if(a){var c=0,h=a.length;if(c in a&&h!==l)for(;c<h;c++)b.call(d,a[c],c,a);else for(c in a)a.hasOwnProperty(c)&&b.call(d,a[c],c,a)}}function j(a,b){var d=arguments,c=1,h=d.length,g;for(a=a||{};c<h;c++)if((b=d[c])&&"object"==typeof b)for(g in b)b.hasOwnProperty(g)&&(a[g]=b[g]);return a}function w(a,b,d,c){if(a instanceof RegExp)return a;e.isArray(a)&&(a="("+a.join("|")+")");a=a.concat(c?"":"/?").replace(/(\/\(|\(\/)/g,"(?:/").replace(/(\/)?(\.)?:(\w+)(?:(\([^?].*?\)))?(\?)?(\*)?/g,
function(a,c,d,e,k,n,f){b.push({name:e,optional:!!n});c=c||"";return""+(n?"":c)+"(?:"+(n?c:"")+(d||"")+(k||d&&"([^/.]+?)"||"([^/]+?)")+")"+(n||"")+(f?"(/*)?":"")}).replace(/([\/.])/g,"\\$1").replace(/\*/g,"(.*)");return RegExp("^"+a+"$",d?"":"i")}function s(a,b,d,c){if(d){var h=1,g,e=b.exec(a);if(!e)return!1;for(a=e.length;h<a;++h)b=d[h-1],g="string"==typeof e[h]?decodeURIComponent(e[h]):e[h],b?c[b.name]=g:c.push(g);return!0}return b.test(a)}var x=0,l=void 0,m=function(){},t=/^https?/i,u=function(a){var b=
function(){if(b.fn.singleton){if(b.__inst__)return b.__inst__;b.__inst__=this}this.uniqId=++x;this.__lego.apply(this,arguments)};b.fn=b.prototype=a||{};b.fn.__self=b.fn.constructor=b;b.extend=function(a){var c=u();m.prototype=this.fn;c.prototype=new m;j(c,this);j(c.fn=c.prototype,a);return c.fn.__self=b.fn.constructor=c};return b},p=u({__lego:function(){var a=e(this);f({on:"bind",off:"unbind",fire:"triggerHandler"},function(b,d){this[d]=function(){a[b].apply(a,arguments);return this}},this)},emit:function(a,
b){var d=("on-"+a).replace(/-(.)/g,function(a,b){return b.toUpperCase()}),c=e.Event(a.replace(/-/g,""));c.target=this;if((this[d]===l||!1!==this[d].apply(this,[c].concat(b)))&&!c.isImmediatePropagationStopped())return this.fire(c,b)}}),k=p.extend({__lego:function(a){p.fn.__lego.call(this);this.path=a||"/";this.items=[];this.itemsIdx={};this.request=this.referrer=this.__self.parseURL(location.toString());this.history=[];this.historyIdx=0},route:function(a,b,d,c,h){a=this.addRoute(a,b,d,c,h);return h?
a:this},addRoute:function(a,b,d,c,h){~"string regexp".indexOf(e.type(b))||(c=d,d=b,b=a,a=l);if(d&&!d.fn){var g=d;d=k.Unit.extend("function"!=typeof g?g:{init:function(){this.on("routestart routechange"+(!0===c?" routeend":""),g)}})}"regexp"!=e.type(b)&&(b=(this.path+("."==b?"":b)).replace(/\/\//,"/"));var r=[],f=this,j;h&&(f=new k(b),f.items=this.items,f.itemsIdx=this.itemsIdx,f.parentRouter=this,b+="*");d&&(j=this.items.push({id:a,path:b,keys:r,regexp:w(b,r),unit:d||k.View,options:c}),a&&(this.itemsIdx[a]=
j-1));return h?f:j},removeRoute:function(a){a=this.itemsIdx[a]||a;this.items.splice(a,1)},createGroup:function(a,b,d,c){return this.route(a,b,d,c,!0)},closeGroup:function(){return this.parentRouter||this},_getUnits:function(a,b){var d=[],c=[];f(b,function(b){var g=b.unit;s(a.path,b.regexp,b.keys,c)&&(g.__self===l&&(b.unit=g=new g(j({id:b.id,inited:!1},b.options))),g.requestParams=c,d.push(g))},this);return d},_loadUnits:function(a,b){var d=[],c;for(b=b.concat();c=b.shift();)c&&c.isActive()&&(f(c.units,
function(a){b.push(a)}),c.loadData&&(a.params=c.requestParams,c=c.loadData(a),delete a.params),e.isArray(c)?b.push.apply(b,c):c&&d.push(c));return e.when.apply(e,d)},_doRouteUnits:function(a,b){f(b,function(b){var c=b.unit,h=!0,g=[],f=j({},a);f.params=g;s(f.path,b.regexp,b.keys,g)?(c.request=f,!0!==c.inited&&c.__init(),!0!==c.active&&(h=!1,c.active=!0,c.emit("route-start",f)),c.emit("route",f),h&&c.emit("route-change",f)):!0===c.active&&!~e.inArray(c,this.activeUnits)&&(c.active=!1,c.request=f,c.emit("route-end",
f))},this)},_doRouteDone:function(a){if(this.activeRequest===a){this.request.url!=a.url&&(this.referrer=this.request);this.request=a;this._navByHistory||(this.history=this.history.slice(0,this.historyIdx+1),this.historyIdx=this.history.push(a.url)-1);this.items.length&&this._doRouteUnits(a,this.items);var b=new Date-this.__ts;this.emit("route",[a,b]);this.log("Router.nav:",b+"ms","("+a.url+")")}},_doRouteFail:function(a){this.activeRequest===a&&(this.activeRequest=null,this.emit("route-fail",a))},
log:function(){ajs.log&&ajs.log.apply(ajs,arguments)},get:function(a){return this.items[this.itemsIdx[a]]},getUrl:function(a,b){var d=this.get(a),c,e,g=0;d&&(b=b||{},c=d.keys,e=d.path.replace(/:(\w+)\??(\/?)/g,function(a,d,e,f){return(f=(d=c[g++])&&b[d.name])?f+(e||""):"("+a+")"}).replace(/\(.*?:[^)]+\)+\??/g,"").replace(/\(|\)\??/g,"").replace(/\/+/g,"/"));return e},nav:function(a,b,d){e.isFunction(b)&&(d=b,b=!1);a=this.__self.parseURL(a.href||a.url||a);if(b||!this.activeRequest||this.activeRequest.url!=
a.url)this.__ts=+new Date,this.emit("before-route",[a,this.__ts]),b=this._getUnits(a,this.items),a.referrer=this.request.url,this.activeUnits=b,this.activeRequest=a,b.length?this._loadUnits(a,b).done(this._doRouteDone.bind(this,a)).fail(this._doRouteFail.bind(this,a)).then(d,d):(this._doRouteDone(a),this.emit("404",a)),this._navByHistory=!1},go:function(a,b){var d=this.getUrl(a,b);d&&this.nav(d)},hasBack:function(){return 0<this.historyIdx},back:function(){this.hasBack()&&(this._navByHistory=!0,this.nav(this.history[--this.historyIdx]))},
hasForward:function(){return!!this.history[this.historyIdx+1]},forward:function(){this.hasForward()&&(this._navByHistory=!0,this.nav(this.history[++this.historyIdx]))}});k.parseURL=function(a){t.test(a)||(a="/"==a.charAt(0)?"//"+location.hostname+a:location.pathname.substr(0,location.pathname.lastIndexOf("/")+1)+a,a="//"==a.substr(0,2)?location.protocol+a:location.hostname+a,t.test(a)||(a=location.protocol+"//"+a));a=a.substr(0,7)+a.substr(7).replace(/\/+/g, '/');var b=(a.split("?")[1]||"").replace(/#.*/,""),d={},c=a.substr(a.indexOf("/",
8)).replace(/\?.*/,"");b&&f(b.split("&"),function(a,b){b=a.split("=");d[b[0]]=decodeURIComponent("undefined"===typeof b[1]?"":b[1])});return{url:a,query:d,search:b,path:c,pathname:c,hash:a.replace(/^[^#]+#/,"")}};var v=p.extend({units:{},boundAll:[],__lego:function(a){p.fn.__lego.call(this);j(this,a);f(this.boundAll,function(a){this[a]=this.bound(a)},this);!1!==this.inited&&this.__init()},__init:function(){this.inited=!0;this.init();this.emit("init")},_exception:function(a,b){throw"["+this.uniqId+
"."+a+"]: "+b;},isActive:function(){return!0},bound:function(a){"string"===typeof a&&(this[a]===l&&this._exception("bound",a+" -- method not found"),a=this[a]);return a.bind(this)},addUnit:function(a,b){a in this.units&&this._exception("addUnit",a+" -- exists");this.units[a]=b},getUnit:function(a){return this.units[a]},delUnit:function(a){a in this.units&&(this.units[a].destroy(),delete this.units[a])},init:m,loadData:m,destroy:m}),y=v.extend({el:null,$el:e("#"+Math.round(1E8*Math.random())),tagName:null,
className:"",parentNode:null,cached:!1,template:null,__init:function(){this.inited=!0;this.el?this.setElement(e(this.el,this.parentNode)):this.tagName&&(this.el=document.createElement(this.tagName),this.$el=e(this.el),this.className&&this.$el.addClass(this.className),this.parentNode&&(e.isReady?this.$el.appendTo(this.parentNode):e(function(){this.$el.appendTo(this.parentNode)}.bind(this))));this.on("routestart.view routeend.view",this.bound(function(a){this._toggleView("routeend"!=a.type)}));this.init();
this.emit("init")},_toggleView:function(a){this.$el&&this.$el.css("display",a?"":"none")},setElement:function(a){a?this.$el=a=e(a):(this.$el=a=e(),this.$el[0]=l,this.$el.length=0);this.el=a[0]},$:function(a){var b=this.$el;void 0!==a&&(b="string"==typeof a?b.find(a):e(a));return b},getTplData:m,getHtml:function(a){var b=this.request||{};return this.template(j({$URL:b.url,$GET:b.query,widget:this},a||this.getTplData()))},render:function(){var a=this.getHtml();"string"===typeof a&&(this.emit("before-render"),
this.$el.prop("innerHTML",a),this.emit("render"))}});k.Unit=v;k.View=y;q.ajs||(q.ajs={});q.ajs.Router=k})(window,jQuery);

ajs.loaded('{ajs}ajs.Router.min');

// ./data/common/js/ajs/ajs.Router.min.js end

// ./data/common/js/store/store.min.js start

define('store/store.min', function() {

var define = null; // FIXME

/* Copyright (c) 2010-2012 Marcus Westin */
(function(){var a={},d=window,i=d.document,c;a.disabled=!1;a.set=function(){};a.get=function(){};a.remove=function(){};a.clear=function(){};a.transact=function(b,e,c){var d=a.get(b);null==c&&(c=e,e=null);"undefined"==typeof d&&(d=e||{});c(d);a.set(b,d)};a.getAll=function(){};a.serialize=function(b){return JSON.stringify(b)};a.deserialize=function(b){return"string"!=typeof b?void 0:JSON.parse(b)};var j;try{j="localStorage"in d&&d.localStorage}catch(m){j=!1}if(j)c=d.localStorage,a.set=function(b,e){if(void 0===
e)return a.remove(b);c.setItem(b,a.serialize(e))},a.get=function(b){return a.deserialize(c.getItem(b))},a.remove=function(b){c.removeItem(b)},a.clear=function(){c.clear()},a.getAll=function(){for(var b={},e=0;e<c.length;++e){var d=c.key(e);b[d]=a.get(d)}return b};else{var k;try{k="globalStorage"in d&&d.globalStorage&&d.globalStorage[d.location.hostname]}catch(n){k=!1}if(k)c=d.globalStorage[d.location.hostname],a.set=function(b,e){if(void 0===e)return a.remove(b);c[b]=a.serialize(e)},a.get=function(b){return a.deserialize(c[b]&&
c[b].value)},a.remove=function(b){delete c[b]},a.clear=function(){for(var b in c)delete c[b]},a.getAll=function(){for(var b={},e=0;e<c.length;++e){var d=c.key(e);b[d]=a.get(d)}return b};else if(i.documentElement.addBehavior){var g,h;try{h=new ActiveXObject("htmlfile"),h.open(),h.write('<script>document.w=window<\/script><iframe src="/favicon.ico"></frame>'),h.close(),g=h.w.frames[0].document,c=g.createElement("div")}catch(o){c=i.createElement("div"),g=i.body}var d=function(b){return function(){var e=
Array.prototype.slice.call(arguments,0);e.unshift(c);g.appendChild(c);c.addBehavior("#default#userData");c.load("localStorage");e=b.apply(a,e);g.removeChild(c);return e}},l=RegExp("[!\"#$%&'()*+,/\\\\:;<=>?@[\\]^`{|}~]","g");a.set=d(function(b,e,c){e=e.replace(l,"___");if(void 0===c)return a.remove(e);b.setAttribute(e,a.serialize(c));b.save("localStorage")});a.get=d(function(b,e){e=e.replace(l,"___");return a.deserialize(b.getAttribute(e))});a.remove=d(function(b,a){a=a.replace(l,"___");b.removeAttribute(a);
b.save("localStorage")});a.clear=d(function(a){var c=a.XMLDocument.documentElement.attributes;a.load("localStorage");for(var d=0,f;f=c[d];d++)a.removeAttribute(f.name);a.save("localStorage")});a.getAll=d(function(b){var c=b.XMLDocument.documentElement.attributes;b.load("localStorage");for(var b={},d=0,f;f=c[d];++d)b[f]=a.get(f);return b})}}try{a.set("__storejs__","__storejs__"),"__storejs__"!=a.get("__storejs__")&&(a.disabled=!0),a.remove("__storejs__")}catch(p){c={},a.disabled=!0,a.get=function(a){return c[a]},
a.set=function(a,d){c[a]=d},a.remove=function(a){delete c[a]},a.getAll=function(){return c},c.clear=function(){c={}}}a.enabled=!a.disabled;"undefined"!=typeof module&&"function"!=typeof module?module.exports=a:"function"===typeof define&&define.amd?define(a):this.store=a})();

});
// ./data/common/js/store/store.min.js end

// ./data/common/js/Jinn/Jinn.min.js start

/**!
 * Jinn -- Notifications center
 * https://github.com/RubaXa/Jinn#readme
 *
 * @author	RubaXa	<trash@rubaxa.org>
 * @build	Jinn.OS, Jinn.bubble
 * @example
 *
 * 	Jinn
 * 		.bubble(10)
 * 		.scope('menu')
 * 			.bubble(5)
 * 			.say({ ... })
 * 		.store('key', '...') // set
 * 	;
 *
 *  // Jinn.access -- should be invoked on user action
 * 	Jinn.access(function (){
 * 		var notify = Jinn.say({ icon: '..', title: '...', text: '...' });
 * 		notify.onclick = function (){   };
 * 	});
 *
 * 	var val = Jinn.store('key'); // get
 * 	Jinn.store('key', null); // remove
 */
;(function(p,f,h){var l=function(){},g=function(b){this._api=b};f=navigator.userAgent.toLowerCase();var j={scope:"OS"},n={},a={},e,q,k=function(){q||(q=1,clearTimeout(e),e=setTimeout(t,10))},t=function(){var b,c,r;for(b in a){c=d.store("__event."+b);for(r=a[b].length;r--;)a[b][r](c)}q=0};g.ext=function(b){var c=function(){this.__lego.apply(this,arguments)},a;l.prototype=this.fn;c.prototype=c.fn=new l;c.ext=g.ext;c.methods=g.methods;for(a in b)c.fn[a]=b[a];return c};g.methods=function(b){for(var c in b)this.fn[c]=
b[c];return this};g.prototype=g.fn={ALLOWED:0,NOT_ALLOWED:1,DENIED:2,_opts:{},__lego:l,_check:function(){return this.ALLOWED},_request:function(b){b()},_ext:function(b){for(var c in this._opts)b[c]===h&&(b[c]=this._opts[c]);return b},opt:function(b,c){var a=this;if(c!==h)a._opts[b]=c;else if("object"==typeof b)for(c in b)a._opts[c]=b[c];else a=a._opts[b];return a},access:function(b){if(b){if(!b.j){var c=this;b.j=function(){b.call(c)}}this.hasRight()?b.j():this._request(b.j)}else return this._check()},
hasRight:function(){return this.access()==this.ALLOWED},hasAccessDenied:function(){return this.access()==this.DENIED},add:l,say:function(){return this.add.apply(this,arguments)},bubble:function(){},end:function(){return d}};var d={API:g,opt:function(b,c){if(c===h)return j[b];j[b]=c;return d},on:function(b,c){a[b]||(a[b]=[]);a[b].push(c);return d},off:function(b,c){if(b in a)for(var r=a[b],e=r.length;e--;)if(r[e]===c){r.splice(e,1);break}return d},emit:function(b,c){d.store("__event."+b,c);k()},scope:function(b,
c){var a=d;if(b==h)a=d.scope(j.scope);else if(c!==h)n[b]=c;else if(b in n)a=n[b];else throw'Jinn: scope "'+b+'" is undefined';return a},addEvent:function(b,c,a){if(b){var d=b.addEventListener?"":"on";b[d?"attachEvent":"addEventListener"](d+c,a,!1)}}},u="hasRight hasAccessDenied access bubble add say".split(" "),v=u.length;for(;v--;)(function(b){d[b]=function(){var c=d.scope(),a=c[b].apply(c,arguments);return a===c?d:a}})(u[v]);d.store=function(b,c){var a=d,e=d.scope("__store");null===c?e.remove("__jinn."+
b):c===h?a=e.get("__jinn."+b):e.set("__jinn."+b,c);return a};var m,s={};try{m=p.localStorage}catch(w){}d.scope("__store",{get:function(b){return m?m.getItem(b):s[b]},set:function(b,c){m?m.setItem(b,c):s[b]=c},remove:function(b){delete s[b];m&&m.removeItem(b)}});d[(f.match(/webkit/)||f.match(/opera/)||f.match(/msie/)||0>f.indexOf("compatible")&&f.match(/mozilla/)||[])[0]]=!0;d.webkit&&(d[(f.match(/chrome/)||f.match(/safari/)||[])[0]]=!0);d.addEvent(p,"storage",k);p.Jinn=d})(window,document);
(function(p,f,h,l){p=h.API.ext({_tpl:"#JinnOSTpl",_opts:{title:"",text:"",delay:60},tpl:function(a){this._tpl=a;return this},add:function(a){"string"==typeof a&&(a={title:a});this._ext(a);var e=this._create(a);e.show();a.delay&&setTimeout(function(){e.cancel()},1E3*a.delay);return e}});if(l)p.methods({_check:function(){return l.checkPermission()},_request:function(a){l.requestPermission(a)},_create:function(a){try{a=l.createNotification(a.icon,a.title,a.text)}catch(e){throw"Notifications.createNotification \u2014 access denied";
}return a}});else{var g=/\{\{(.*?)\}\}/g,j=[],n=function(a,e){if(/^#/.test(a)&&(a=f.getElementById(a.substr(1))))a=a.innerHTML;a&&(this.el=f.createElement("div"),this.el.innerHTML=a.replace(g,function(a,f){return(new Function("notify,v,u","try{v="+f+'}catch(e){} return v===u?"":v'))(e)}),f.body.appendChild(this.el))};n.redraw=function(){for(var a=5,e=0,f=j.length;e<f;e++)j[e].el.style.top=a+"px",a+=j[e].el.offsetHeight+5};n.prototype={show:function(){if(this.el){var a=this,e=a.el.style;j.push(a);
e.right="5px";e.position="fixed";e.display="block";n.redraw();a.el.onclick=function(){a.onclick.call(a,{type:"click",target:a,currentTarget:a})}}},cancel:function(){if(this.el){for(var a=0,e=j.length;a<e;a++)j[a]===this&&(j.splice(a,1),n.redraw());this.el.onclick=null;this.el.parentNode.removeChild(this.el);this.el=null}},onclick:function(){}};p.methods({hasRight:function(){return!!this._tpl},_create:function(a){return new n(this._tpl,a)}})}h.scope("OS",new (h.OS=p))})(window,document,Jinn,window.webkitNotifications);
(function(p,f,h,l){var g=function(){},j=/(^|\s)icon(\s|$)/,n=/^data/,a,e,q=null,k=new Image,t=0,d={val:q,fps:2,iconX:0,iconY:0,iconW:16,iconH:16},u=function(b){for(var a=f.getElementsByTagName("link"),d=a.length;d--;)if(j.test(a[d].getAttribute("rel"))&&!0===b(a[d]))return a[d]},v=function(c){b.init();u(function(b){b.parentNode.removeChild(b)});var a=f.createElement("link");a.rel="icon";a.type="image/png";a.href=c;f.getElementsByTagName("head")[0].appendChild(a)},m=f.createElement("canvas"),s;a:{try{s=
!!~m.toDataURL("image/png").indexOf("data:image/png");break a}catch(w){}s=void 0}d.shape=function(b,a,d){var e=15.5;a=99<a?(e+=0.5,"99+"):a;b.font=(h.webkit?"bold ":"")+"9px arial";b.shadowOffsetX=0;b.shadowOffsetY=0;b.shadowBlur=2;b.shadowColor="rgba(0,0,0,.5)";b.fillStyle=d?"#fc3":"#fff";b.textAlign="right";b.fillText(a,e,15);b.fillText(a,e,15);b.fillText(a,e,15)};var b={init:function(){b.init=g;b.ready=1;var a=u(function(){return!0});a&&(e=a.href,b.opt("src",d.src||e))},src:function(a){return b.opt("src",
a)},shape:function(a){b.opt("shape",a);return this},opt:function(c,e){var f=b.ready||d.val||"shape"==c;if("string"==typeof c){if(e===l)return d[c];d[c]=e}else for(var j in c)d[j]=c[j],f=f||"shape"==j;e=d.val;if(f){var g=e;if(s&&(k.src!=d.src||q!=g))if(b.init(),m.width=m.height=16,k.src=d.src,k.onload=function(){function b(){var a=m.getContext("2d");a.clearRect(0,0,16,16);a.drawImage(k,0,0,k.width,k.height,d.iconX,d.iconY,d.iconW,d.iconH);d.shape(a,g,t,d);v(m.toDataURL());d.fps<=++t&&(t=0)}clearInterval(a);
null===g||g===l||!d.fps?t=0:a=setInterval(b,~~(1E3/d.fps+0.5));null===g||g===l?v(d.src):b()},n.test(k.src)?(k.crossOrigin=null,k.removeAttribute("crossOrigin")):k.crossOrigin="anonymous",k.width)k.onload()}e!==q&&h.emit("bubble:val",e);q=e},set:function(a){b.init();b.opt("val",a)},revert:function(){b.opt("src",e)},reset:function(){b.opt({src:e,val:null})},clear:function(){b.opt("val",null)}};h.OS.Bubble=b;h.scope("OS").bubble=function(a,d){if("object"==typeof a&&null!==a)b.opt(a);else if(a in b)b[a](d);
else b.set(a);return h};h.on("bubble:val",function(a){b.set(a)})})(window,document,Jinn);"undefined"!==typeof ajs&&ajs.loaded&&ajs.loaded("{jinn}Jinn.min");"function"===typeof define&&define.amd&&define("Jinn",[],function(){return window.Jinn||{}});

// ./data/common/js/Jinn/Jinn.min.js end

// data/ru/images/js/ru/jsCore/plugins/jsPlugins.js start


// data/ru/images/js/ru/jsCore/jquery/extensions.js start

/**
 * Необходимые расширения для jQuery
 * @author	"RubaXa" <trash@rubaxa.org>
 */


// ./data/common/js/jquery/jquery.event.special.input.js start

define('jquery/jquery.event.special.input', function() {

/**
 * jQuery `input` special event v1.1
 *
 * http://whattheheadsaid.com/projects/input-special-event
 * 
 * (c) 2010-2011 Andy Earnshaw
 * MIT license
 * www.opensource.org/licenses/mit-license.php
 *
 * @editor: Alexander Abashkin <a.abashkin@corp.mail.ru>
*/

(function($) {
	if ('oninput' in document.documentElement)
		return 0;

	var input = 'input',

	ns = '.inputEvent ',

	// A bunch of data strings that we use regularly
	dataBnd = 'bound.inputEvent',
	dataVal = 'value.inputEvent',
	dataDlg = 'delegated.inputEvent',

	// Set up our list of events
	bindTo = ['textInput', 'propertychange', 'paste', 'cut', 'keydown', 'drop', ''].join(ns),

	// Events required for delegate, mostly for IE support
	dlgtTo = [ 'focusin', 'mouseover', 'dragstart', '' ].join(ns),

	// Elements supporting text input, not including contentEditable
	supported = {
		TEXTAREA: null,
		INPUT:    null
	},

	// Events that fire before input value is updated
	delay = {
		paste:     null,
		cut:       null,
		keydown:   null,
		drop:      null,
		textInput: null
	},

	timer = null;

	$.event.special[input] = {
		setup: function(data, namespaces, handler) {
			var bndCount,
				elem  = this,
				$elem = $(this),
				triggered = false;

			if (typeof handler !== 'function')
				return -1;

			if (supported[elem.tagName] !== void 0) {
				bndCount = $.data(elem, dataBnd) || 0;

				if (!bndCount)
					$elem.bind(bindTo, handler);

				$.data(elem, dataBnd, ++bndCount);
				$.data(elem, dataVal, elem.value);
			}
			else {
				$elem.bind(dlgtTo, function (e) {
					var target = e.target;

					if (supported[target.tagName] !== void 0 && !$.data(elem, dataDlg)) {
						bndCount = $.data(target, dataBnd) || 0;

						if (!bndCount)
							$(target).bind(bindTo, handler);

						// make sure we increase the count only once for each bound ancestor
						$.data(elem,   dataDlg, true);
						$.data(target, dataBnd, ++bndCount);
						$.data(target, dataVal, target.value);
					}
				});
			}
			function handler (e) {

				var elem = e.target;

				// Clear previous timers because we only need to know about 1 change
				window.clearTimeout(timer), timer = null;

				// Return if we've already triggered the event
				if (triggered)
					return;

				// paste, cut, keydown and drop all fire before the value is updated
				if (delay[e.type] !== void 0 && !timer) {
					// ...so we need to delay them until after the event has fired
					timer = window.setTimeout(function () {
						if (elem.value !== $.data(elem, dataVal)) {
							$(elem).trigger(input);
							$.data(elem, dataVal, elem.value);
						}
					}, 0);
				}
				else if (e.type == 'propertychange') {
					if (e.originalEvent.propertyName == 'value') {
						$(elem).trigger(input);
						$.data(elem, dataVal, elem.value);
						triggered = true;

						window.setTimeout(function () {
							triggered = false;
						}, 0);
					}
				}
				else {
					$(elem).trigger(input);
					$.data(elem, dataVal, elem.value);
					triggered = true;

					window.setTimeout(function () {
						triggered = false;
					}, 0);
				}
			}
		},
		teardown: function () {
			var elem = $(this), bndCount;

			elem.unbind(dlgtTo);

			elem.find('input, textarea').andSelf().each(function () {
				bndCount = $.data(this, dataBnd, ($.data(this, dataBnd) || 1) - 1);

				if (!bndCount)
					elem.unbind(bindTo);
			});
		}
	};
})(jQuery);

});
// ./data/common/js/jquery/jquery.event.special.input.js end

// ./data/common/js/jquery/jquery.iframe-transport.js start

define('jquery/jquery.iframe-transport', function() {

/*
 * jQuery Iframe Transport Plugin 1.5
 * https://github.com/blueimp/jQuery-File-Upload
 *
 * Copyright 2011, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 */

/*jslint unparam: true, nomen: true */
/*global define, window, document */

(function ($) {
	'use strict';

	// Helper variable to create unique names for the transport iframes:
	var counter = 0;

	// The iframe transport accepts three additional options:
	// options.fileInput: a jQuery collection of file input fields
	// options.paramName: the parameter name for the file form data,
	//  overrides the name property of the file input field(s),
	//  can be a string or an array of strings.
	// options.formData: an array of objects with name and value properties,
	//  equivalent to the return data of .serializeArray(), e.g.:
	//  [{name: 'a', value: 1}, {name: 'b', value: 2}]
	$.ajaxTransport('iframe', function (options) {
		if (options.async && (options.type === 'POST' || options.type === 'GET'))
		{
			var form, iframe;

			return {
				send: function (_, completeCallback) {
					form = $('<form style="display:none;"></form>');
					form.attr('accept-charset', options.formAcceptCharset);
					// javascript:false as initial iframe src
					// prevents warning popups on HTTPS in IE6.
					// IE versions below IE8 cannot set the name property of
					// elements that have already been added to the DOM,
					// so we set the name along with the iframe HTML markup:
					iframe = $(
						'<iframe src="javascript:false;" name="iframe-transport-' +
							(counter += 1) + '"></iframe>'
					);

					iframe.bind('load', function () {

/*
						iframe.bind('readystatechange', function() {
							var state = iframe[0].readyState;

							// https://bugzilla.mozilla.org/show_bug.cgi?id=776529
							if (state == 'loaded' || state == 'complete' || state == 'interactive') {

								alert(iframe.contents().find('body').text());

								//iframe[0].onreadystatechange = null;
							 }
						});
*/


						var fileInputClones,
							paramNames = $.isArray(options.paramName) ? options.paramName : [options.paramName];

						iframe
							.unbind('load')
							.bind('load', function () {
								//iframe[0].contentWindow.location.href != 'about:blank

								var response;
								// Wrap in a try/catch block to catch exceptions thrown
								// when trying to access cross-domain iframe contents:
								try {
									response = iframe.contents();
									// Google Chrome and Firefox do not throw an
									// exception when calling iframe.contents() on
									// cross-domain requests, so we unify the response:
									if (!response.length || !response[0].firstChild) {
										throw new Error();
									}
								} catch (e) {
									response = undefined;
								}

								// The complete callback returns the
								// iframe content document as response object:
								completeCallback(200, 'success', {'iframe': response});

								// Fix for IE endless progress bar activity bug
								// (happens on form submits to iframe targets):
								$('<iframe src="javascript:false;"></iframe>').appendTo(form);
								form.remove();
							});

						form
							.attr({
								target: iframe.attr('name'),
								action: options.url,
								method: options.type
							})

						if (options.formData) {
							var inputs = '';

							// Set params
							$.each(options.formData || {}, function(name, value) {
								inputs += '<input type="hidden" name="' + name + '"  value="' + value + '" />';
							});

							$(inputs).appendTo(form);
						}

						if (options.fileInput && options.fileInput.length && options.type === 'POST')
						{
							fileInputClones = options.fileInput.clone();
							// Insert a clone for each file input field:
							options.fileInput.after(function (index) {
								return fileInputClones[index];
							});

							if (options.paramName) {
								options.fileInput.each(function (index) {
									$(this).attr('name', paramNames[index] || options.paramName);
								});
							}
							// Appending the file input fields to the hidden form
							// removes them from their original location:
							form
								.append(options.fileInput)
								.attr('enctype', 'multipart/form-data')
								// enctype must be set as encoding for IE:
								.attr('encoding', 'multipart/form-data');
						}
						form.submit();
						// Insert the file input fields at their original location
						// by replacing the clones with the originals:
						if (fileInputClones && fileInputClones.length) {
							options.fileInput.each(function (index, input) {
								var clone = $(fileInputClones[index]);
								$(input).attr('name', clone.attr('name'));
								clone.replaceWith(input);
							});
						}
					});
					form.append(iframe).appendTo(document.body);
				},
				abort: function () {
					if (iframe) {
						// javascript:false as iframe src aborts the request
						// and prevents warning popups on HTTPS in IE6.
						// concat is used to avoid the "Script URL" JSLint error:
						iframe
							.unbind('load')
							.attr('src', 'javascript'.concat(':false;'));
					}
					if (form) {
						form.remove();
					}
				}
			};
		}
	});

	// The iframe transport returns the iframe content document as response.
	// The following adds converters from iframe to text, json, html, and script:
	$.ajaxSetup({
		converters: {
			'iframe text': function (iframe) {
				return $(iframe[0].body).text();
			},
			'iframe json': function (iframe) {
				return $.parseJSON($(iframe[0].body).text());
			},

			// Content-Type: text/javasript
			'iframe jsonp': function (iframe) {
				var match = $(iframe[0].body).text().match(/^[\w\d-]*\((\{.*\})\)$/);

				if (match)
					return $.parseJSON(match[1]);
			},
			'iframe html': function (iframe) {
				return $(iframe[0].body).html();
			},
			'iframe script': function (iframe) {
				return $.globalEval($(iframe[0].body).text());
			}
		}
	});
}(jQuery));

});

// ./data/common/js/jquery/jquery.iframe-transport.js end

(function ($) {
		$.browser.intVersion = parseInt($.browser.version, 10);

		$.each($.browser, function (name, val) {
			if (~'webkit opera mozilla msie'.indexOf(name) && val ) {
				$.browser.name = name;
			}
		});

		if (navigator.userAgent.match(/Opera (Mini|Mobi)[^;]*/)) {
			$.browser['opera' + RegExp.$1.toLowerCase()] = true;
		}

		if (navigator.userAgent.match(/iPhone|iPod|iPad|iOS/i)) {
			$.browser['iOS'] = true;
		}

		$.event.props.push('dataTransfer');

		$.support.cssPrefix	= ($.browser.webkit ? 'Webkit' :
								($.browser.mozilla ? 'Moz' :
								($.browser.opera ? 'O' :
								($.browser.msie ? 'ms' : '')
							)));

		$.support.dnd = (function (){
			var div = document.createElement('div');
			if( ('draggable' in div) || ('ondragstart' in div && 'ondrop' in div) ){
				$('html').addClass('draganddrop');
				return	true;
			}
		})();


		function makeUnselectable(on, node){
			if( node.nodeType == 1 ){
				var style = node.style;
				style['userSelect'] = style[$.support.cssPrefix +'UserSelect'] = on ? 'none' : '';
				node.setAttribute('unselectable', on ? 'on' : 'off');
			}

			if( $.browser.msie ){
				node = node.firstChild;

				while( node ){
					makeUnselectable(on, node);
					node = node.nextSibling;
				}
			}
		}

		// добавим новые методы
		$.fn.extend({

			F:		function (){ return	this; },
			elm:	function (n){ return $( this[0].elements[n] ); },

			css3: function (props){
				this.css(props);

				if( $.support.cssPrefix ){
					this.each(function (){
						for( var key in props ){
							this.style[$.camelCase($.support.cssPrefix +'-'+ key)] = isNaN(props[key]) ? props[key] : props[key]+'px';
						}
					});
				}

				return	this;
			},

			getSize: function (real){
				var rw, rh;
				if( real ){
					rw = this.width();
					rh = this.height();
					this.css({ width: '', height: '' });
				}
				var w = this.outerWidth(), h = this.outerHeight();
				if( real && (rw || rh) )
					this.css({ width: rw, height: rh });
				return	{ width: w, height: h };
			},

			replaceClass: function (s/*RegExp|String*/, r/*String*/){
				for( var i = 0, n = this.length; i < n; i++ )
					this[i].className = this[i].className.replace(s, r);
				return	this;
			},


			item: $.fn.eq,

			unselectable: function (on/*Bool*/){
				if( on !== undef ){
					return	this.each(function (){ makeUnselectable(on, this); });
				}
				else {
					return	(this.attr('unselectable')||'').toLowerCase() == 'on';
				}
			},


			hitTest: function (el/*Event,jQuery,CSSRule*/)/*Bool*/{
				if( typeof el == 'string' )	el = $(el)[0];
				else if( el[0] ) el = el[0];
				else if( el.target ) el = el.target;

				for( var i = 0, a, x; i < this.length; i++ ){
					a = this[i];
					x = el;
					do {
						if( a == x ){
							return	true;
						}
					}
					while( x = x.parentNode );
				}

				return	false;
			},


			insertFirst: $.fn.prependTo,

			toObject: function (f/*:Bool*/)/*Object*/{
				var data	= {};

				this.find('INPUT,TEXTAREA,SELECT').each(function (){
					try{
						if( this.name && (!this.disabled || f) ){
							switch( this.tagName ){
								case 'INPUT':
								case 'TEXTAREA':
								{
									if( this.type == 'checkbox' )
									{
										if( f || this.checked )
										{
											if( this.name.indexOf('[]') > 0 )
											{
												if( !data[this.name] )	data[this.name] = [];
												data[this.name].push(this.checked ? this.value : '');
											}
											else data[this.name] = this.checked ? this.value : '';
										}
									}
									else if( this.type == 'radio' )
									{
										if( this.checked )	data[this.name]	= this.value;
									}
									else
									{
										data[this.name]	= ((window.InputValidator ? InputValidator.get(this) : 0) || this).value;
									}
								}
								break;

								case 'SELECT':		data[this.name]	= this.options[this.selectedIndex].value; break;
							}
						}
					}
					catch( e ){ debug.log(e); }
				});

				return	data;
			},


			scrollWidth:	function (){ return	((this[0] && this[0].scrollWidth) ? this[0].scrollWidth : 0); },
			scrollHeight:	function (){ return	((this[0] && this[0].scrollHeight) ? this[0].scrollHeight : 0); },


			setPositionFixed: function (x, y)
			{
				if( ($.browser.msie && $.browser.version < 9) && (!$.boxModel || ($.browser.version < 7)) )	// то поехали
				{
					var c	= ('IEPositionFixed'+x+'x'+y).replace(/%/g, 'pr');

					if( !window[c] )
					{
						$.iePositionFixed = true;
						var prX = true, prY = true;

						if( (typeof x != 'number') && (x.indexOf('%') > 0) ) x = (parseFloat(x)/100); else { x = parseFloat(x); prX = false; }
						if( (typeof y != 'number') && (y.indexOf('%') > 0) ) y = (parseFloat(y)/100); else { y = parseFloat(y); prY = false; }

						window[c] = function (elm)
						{
							var S = elm.style;
							S.position = 'absolute';
							S.left	= Math.max(((prX ? ajs.windowWidth() : 1) * x + ajs.scrollLeft()), 0) + 'px';
							S.top	= Math.max(((prY ? ajs.windowHeight() : 1) * y + ajs.scrollTop()), 0) + 'px';
						};
					}

					this.removePositionFixed().each(function (){ this.ieFixed = 1; this.style.setExpression('wordWrap', c+"(this)"); });
				}
				else
				{
					this.css({
						  position:	'fixed'
						, top:		y
						, left:		x
					});
				}
				return	this;
			},


			removePositionFixed: function ()
			{
				return	this.each(function (){ if( this.ieFixed ) this.style.removeExpression('wordWrap'); this.ieFixed = 0; });
			},


			innerHTML: function (h)
			{
				if( h === undef )
					return	this.attr('innerHTML');
				else
					return	this.each(function (){ this.innerHTML = h; });
			},

			display: function (type)
			{
				if ((type !== undef) && (typeof type !== 'string')) {
					type = !type ? 'none' : '';
				}

				return	this.css('display', type);
			},

			findWithRoot: function(selector)
			{
				return this.filter(selector).add(this.find(selector));
			},

			form__select: function ()
			{
				return this.each(function () {
					var container = $(this);
					if (container.data('inited')) return;

					var select = container.find('select'),
						text = container.find('.js-text');

					select.bind('change keyup', function () {
						var option = select.children(':selected');
						text.text(option.attr('data-name') || option.text());
					});
					select.trigger('change');

					select.bind('focus', function () {
						container.addClass('form__select_focus');
					});
					select.bind('blur', function () {
						container.removeClass('form__select_focus');
					});

					container.data('inited', true);
				});
			},

			form__switcher: function () {
				return this.each(function () {
					var switcher = $(this),
						inputs = switcher.find('input');

					inputs.click(function () {
						switcher
							.find('.form__switcher')
							.replaceClass(/form__switcher_\w+_selected/, '');

						if (inputs.filter(':checked').val() === 'on') {
							switcher
								.find('.form__switcher_options_positive')
								.addClass('form__switcher_options_positive_selected');
						}
						else {
							switcher
								.find('.form__switcher_options_negative')
								.addClass('form__switcher_options_negative_selected');
						}
					});
				});
			},

			form__time: function () {
				return this.each(function () {
					$(this).find('.form__spinbox').form__spinbox();
				});
			},

			form__spinbox: function () {
				var repeatInterval = 250;

				return this.each(function () {
					function pad(value) {
						if (zeropad) {
							return ('000000' + value).slice(-zeropad);
						}
						else {
							return value;
						}
					}
					function increase() {
						var value = Number(input.val()) + step;
						if (value <= max)
							input.val(pad(value));
					}
					function decrease() {
						var value = Number(input.val()) - step;
						if (value >= min)
							input.val(pad(value));
					}
					function stop() {
						clearInterval(timer);
						timer = null;
					}

					var container = $(this),
						input = container.find('.js-number'),
						min = input.data('min') !== 'undefined' ? Number(input.data('min')) : -Infinity,
						max = input.data('max') !== 'undefined' ? Number(input.data('max')) : Infinity,
						step = Number(input.data('step') || 1),
						zeropad = Number(input.data('zeropad')),
						inc = container.find('.js-inc'),
						dec = container.find('.js-dec'),
						timer;

					inc.bind('mousedown', function () {
						if ($(this).attr('disabled')) return;
						increase();
						timer = setInterval(increase, repeatInterval);
						return false;
					});
					inc.bind('mouseup', stop);
					dec.bind('mousedown', function () {
						if ($(this).attr('disabled')) return;
						decrease();
						timer = setInterval(decrease, repeatInterval);
						return false;
					});
					dec.bind('mouseup', stop);
					input.bind('keydown', function (e) {
						if (e.keyCode === 38)
							increase();
						else if (e.keyCode === 40)
							decrease();
					});
				});
			},

			form__disable: function () {
				return this.each(function () {
					var container = $(this);
					container.addClass('form_disabled');
					container.findWithRoot('input,textarea,select,a').attr('disabled', 'disabled');
					container.findWithRoot('.form__field').addClass('form__field_disabled');
					container.findWithRoot('.form__field__wrapper').addClass('form__field__wrapper_disabled');
					container.findWithRoot('.form__select').addClass('form__select_disabled');
					container.findWithRoot('.form__spinbox').addClass('form__spinbox_disabled');
					container.findWithRoot('.form__button').addClass('form__button_disabled');
					container.delegate('a', 'click.form__disable', function() { return false; });
				});
			},

			form__enable: function () {
				return this.each(function () {
					var container = $(this);
					container.removeClass('form_disabled');
					container.findWithRoot('input,textarea,select,a').removeAttr('disabled');
					container.findWithRoot('.form__field').removeClass('form__field_disabled');
					container.findWithRoot('.form__field__wrapper').removeClass('form__field__wrapper_disabled');
					container.findWithRoot('.form__select').removeClass('form__select_disabled');
					container.findWithRoot('.form__spinbox').removeClass('form__spinbox_disabled');
					container.findWithRoot('.form__button').removeClass('form__button_disabled');
					container.undelegate('a', 'click.form__disable');
				});
			},

			form__toggle: function (condition) {
				var action = 'form__' + ( condition ? 'enable' : 'disable' );
				return this[action]();
			}
		});


		var _bind = $.fn.bind, qName = 'eventQueue'+ $.expando +'_';

		function _check($el, type, func){
			var queue	= $el.data(qName + type);
			if( queue ){
				var evt = $.Event( queue[0] );
				evt.preventDefault();
				evt.stopPropagation();
				func.call($el[0], evt, queue[1]);
			}
		}

		$.fn.dispatch = function (evt, data, queue){
			var key = qName + ($.type(evt) === 'string' ? evt : evt.type);

			if( queue ){
				this.data(key, [evt, data]);
			}
			else if( this.data(key) ){
				this.removeData(key);
			}

			return	this.triggerHandler(evt, data);
		};

		$.fn.bind = function (events, data, func){
			if( this[0] ){
				if( $.isFunction(data) ){
					func	= data;
					data	= undef;
				}

				if( $.type(events) !== 'object' ){
					var names = events.split(/\s+/), i = 0, n = names.length;
					for( ; i < n; i++ ) _check(this, names[i], func);
				}
			}

			return _bind.call(this, events, data, func);
		};

		ajs.offline = !!mailru['OfflineMode'];
		if (!mailru['ForceOfflineMode']) {
			$(window).bind('online offline', function (evt) {
				var offline = evt.type == 'offline';
				if (ajs.offline != offline) {
					$(window).triggerHandler('offlinechange', [ajs.offline = offline]);
				}
			});
		}

		/**
		 * Support visibilitychange event (Page Visibility API)
		 */
		(function() {
			var prop, eventName, vis = {
					hidden: "visibilitychange",
					mozHidden: "mozvisibilitychange",
					webkitHidden: "webkitvisibilitychange",
					msHidden: "msvisibilitychange",
					oHidden: "ovisibilitychange" /* not currently supported */
				};

			for (prop in vis) {
				if (vis.hasOwnProperty(prop) && prop in document) {
					eventName = vis[prop];
					break;
				}
			}

			if (eventName) {
				document.addEventListener(eventName, onchange);
			}
			else if (/*@cc_on!@*/false) { // IE 9 and lower
				$(document).bind('focusin focusout', onchange);

			}
			else {
				$(window).bind('focus blur', onchange);
			}

			function onchange (evt) {
				var hidden;

				if( evt.type == "focus" || evt.type == "focusin" ){
					hidden = false;
				}
				else if( evt.type == "blur" || evt.type == "focusout" ){
					hidden = true;
				}
				else {
					hidden = !!document[prop];
				}

				if( ajs.blurred !== hidden ){
					ajs.blurred = hidden;
					$(window).triggerHandler('visibilitychange', [hidden]);
				}
			}
		})();

	})(jQuery);

	jsLoader.loaded('{jQuery}extensions', 1);

// data/ru/images/js/ru/jsCore/jquery/extensions.js end

jsClass
		.create('jsPlugins')
		.statics({

		elms:		{},

		processing: function (e)
		{
			jQuery(e).find('.js-plugin')
				.removeClass('js-plugin')
				.each(function (){ jsPlugins.set(this, 'plugin'); })
			;
		},


		set: function (e, name, o)
		{
			if( !e ) return	 this;

			var uId	= jsCore.getUniqId(e = $F( e ));

			if( !this.elms[uId] )	this.elms[uId]	= {};

			var x	= e.onclick ? e.onclick() : 0;

			o	= o||{};
			if( typeof x == 'string' ) name	= x;
			else	o	= $E(x || {}, o);

			e.removeAttribute('click');
			e.onclick	= null;

			if( name == 'plugin' )
			{
				if( o.plugin )
				{	// return	{ plugin: 'Toggle', options: {} } OR return {  plugin: 'Toggle', ... }
					this.set(e, o.plugin, (o.options || o));
				}
				else if( o[0] )
				{	// return	[{ plugin: 'Toggle', options: {} }]
					for( var i = 0; o[i]; i++ )
					{
						this.set(e, o[i].plugin, o[i].options);
					}
				}
				else
				{	// return	{ 'Toggle': { } }
					for( var n in o ) this.set(e, n, o[n]);
				}
			}
			else
			{
				var
					  alias		= o.__pAlias || jsLoader.getAlias(name, 'plugins')
					, name		= jsLoader.getName(name)
					, require	= '{'+alias+'}'+name
					, i			= 0
					, n			= name.split('.')
					, Klass		= window
				;

				for( ; n[i] && (Klass = Klass[n[i]]); i++ ){ /*debug.log(n[i]);*/ }

				if( Klass && (Klass.constructor == Function) )
				{
					jsPlugins.elms[uId][name]	= new Klass(jQuery(e), o);
				}
				else
				{	// запомним алиас
					o.__pAlias	= alias;
					$R(require, function (){ jsPlugins.set(e, name, o); });
				}
			}

			return	this;
		},


		get: function (e, n)
		{
			var uId	= jsCore.getUniqId( e && $F(e) );
			return	this.elms[uId] && this.elms[uId][n];
		}

	});


	jQuery.fn.extend({

		setPlugin: function (n, o, e/*exists:Bool*/, r/*returnPlugin:Bool*/)
		{
			if( !e || !this.hasPlugin(n) ) jsPlugins.set(this[0], n, o);
			return	r ? this.getPlugin(n) : this;
		},

		getPlugin: function (n)
		{
			return	jsPlugins.get(this[0], jsLoader.getName(n));
		},

		hasPlugin: function (n)
		{
			return	!!jsPlugins.get(this[0], n);
		},

		processPlugins: function ()
		{
			for( var i = 0; this[i]; i++ )
				if( this[i].innerHTML.indexOf('js-plugin') != -1 )
					jsPlugins.processing(this);
			return	this;
		}

	});

	jsLoader.loaded('{plugins}jsPlugins', 1);

// data/ru/images/js/ru/jsCore/plugins/jsPlugins.js end

// data/ru/images/js/ru/jsCore/jquery/jquery.getCSS.js start

/**
 * jQuery.getCSS plugin
 * http://github.com/furf/jquery-getCSS
 *
 * Copyright 2010, Dave Furfero
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * Inspired by Julian Aubourg's Dominoes
 * http://code.google.com/p/javascript-dominoes/
 */


(function (window, document, jQuery) {

	  var head = document.getElementsByTagName('head')[0],
		  loadedCompleteRegExp = /loaded|complete/,
		  callbacks = {},
		  callbacksNb = 0,
		  timer,
		  cache = {};


		var _init = function()
		{
			_init = jQuery.noop;
			var s = document.styleSheets, i = s.length, h;
			for( ; i--; ) if( h = s[i].href ) cache[h.split('?')[0]] = true;
		};


	  jQuery.getCSS = function (url, options, callback) {

		  _init();

		if (jQuery.isFunction(options)) {
		  callback = options;
		  options  = {};
		}

		if( typeof url !== 'string' )
		{
			var i = 0, c = url.length, t = 0, func = function (){ if( ++t == c ) callback(); };
			for( ; i < c; i++ ) jQuery.getCSS(url[i], options, func);
			return;
		}

		var href = url.split('?')[0];
		if( !options.noCache && cache[href] )
		{
			callback();
			return;
		}

		cache[href] = true;

		var link = document.createElement('link');

		link.rel   = 'stylesheet';
		link.type  = 'text/css';
		link.media = options.media || 'screen';
		link.href  = url;

		if (options.charset) {
		  link.charset = options.charset;
		}

		if (options.title) {
		  callback = (function (callback) {
			return function () {
			  link.title = options.title;
			  callback(link, "success");
			};
		  })(callback);
		}

		// onreadystatechange
		if (link.readyState) {

		  link.onreadystatechange = function () {
			if (loadedCompleteRegExp.test(link.readyState)) {
			  link.onreadystatechange = null;
			  callback(link, "success");
			}
		  };

		// If onload is available, use it
		} else if (link.onload === null /* exclude Webkit => */ && link.all) {
		  link.onload = function () {
			link.onload = null;
			callback(link, "success");
		  };

		// In any other browser, we poll
		} else {

		  callbacks[link.href] = function () {
			callback(link, "success");
		  };

		  if (!callbacksNb++) {
			// poll(cssPollFunction);

			timer = window.setInterval(function () {

			  var callback,
				  stylesheet,
				  stylesheets = document.styleSheets,
				  href,
				  i = stylesheets.length;

			  while (i--) {
				stylesheet = stylesheets[i];
				if ((href = stylesheet.href) && (callback = callbacks[href])) {
				  try {
					// We store so that minifiers don't remove the code
					callback.r = stylesheet.cssRules;
					// Webkit:
					// Webkit browsers don't create the stylesheet object
					// before the link has been loaded.
					// When requesting rules for crossDomain links
					// they simply return nothing (no exception thrown)
					// Gecko:
					// NS_ERROR_DOM_INVALID_ACCESS_ERR thrown if the stylesheet is not loaded
					// If the stylesheet is loaded:
					//  * no error thrown for same-domain
					//  * NS_ERROR_DOM_SECURITY_ERR thrown for cross-domain
					throw 'SECURITY';
				  } catch(e) {
					// Gecko: catch NS_ERROR_DOM_SECURITY_ERR | SecurityError
					// Webkit: catch SECURITY
					if (/SECURITY/i.test(e)) {

					  // setTimeout(callback, 0);
					  callback(link, "success");

					  delete callbacks[href];

					  if (!--callbacksNb) {
						timer = window.clearInterval(timer);
					  }

					}
				  }
				}
			  }
			}, 13);
		  }
		}
		head.appendChild(link);
	  };

	})(this, this.document, this.jQuery);

	jsLoader.loaded('{jQuery}jquery.getCSS', 1);

// data/ru/images/js/ru/jsCore/jquery/jquery.getCSS.js end

// data/ru/images/js/ru/jsCore/jquery/jquery.xdr-transport.js start

/*
 * jQuery XDomainRequest Transport Plugin 1.1.1
 * https://github.com/blueimp/jQuery-File-Upload
 *
 * Copyright 2011, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 *
 * Based on Julian Aubourg's ajaxHooks xdr.js:
 * https://github.com/jaubourg/ajaxHooks/
 */

/*jslint unparam: true */
/*global define, window, XDomainRequest */

(function (factory) {
    'use strict';
	/** @namespace define.amd */
	if (typeof define === 'function' && define.amd) {
        // Register as an anonymous AMD module:
        define(['jquery'], factory);
    } else {
        // Browser globals:
        factory(window.jQuery);
	    jsLoader.loaded('{jQuery}jquery.xdr-transport');
    }
}(function ($) {
    'use strict';
    if (window.XDomainRequest && $.ajaxSettings.xhr().withCredentials === undefined) {
        $.ajaxTransport(function (s) {
            if (s.crossDomain && s.async) {
                if (s.timeout) {
                    s.xdrTimeout = s.timeout;
                    delete s.timeout;
                }
                var xdr;
                return {
                    send: function (headers, completeCallback) {
                        function callback(status, statusText, responses, responseHeaders) {
                            xdr.onload = xdr.onerror = xdr.ontimeout = $.noop;
                            xdr = null;
                            completeCallback(status, statusText, responses, responseHeaders);
                        }
                        xdr = new XDomainRequest();
                        // XDomainRequest only supports GET and POST:
                        if (s.type === 'DELETE') {
                            s.url = s.url + (/\?/.test(s.url) ? '&' : '?') +
                                '_method=DELETE';
                            s.type = 'POST';
                        } else if (s.type === 'PUT') {
                            s.url = s.url + (/\?/.test(s.url) ? '&' : '?') +
                                '_method=PUT';
                            s.type = 'POST';
                        }
                        xdr.open(s.type, s.url);
                        xdr.onload = function () {
                            callback(
                                200,
                                'OK',
                                {text: xdr.responseText},
                                'Content-Type: ' + xdr.contentType
                            );
                        };
                        xdr.onerror = function () {
                            callback(404, 'Not Found');
                        };
                        if (s.xdrTimeout) {
                            xdr.ontimeout = function () {
                                callback(0, 'timeout', 1);
                            };
                            xdr.timeout = s.xdrTimeout;
                        }
                        xdr.send((s.hasContent && s.data) || null);
                    },
                    abort: function () {
                        if (xdr) {
                            xdr.onerror = $.noop();
                            xdr.abort();
                        }
                    }
                };
            }
        });
    }
}));
 

// data/ru/images/js/ru/jsCore/jquery/jquery.xdr-transport.js end

// data/ru/images/js/ru/jsCore/jquery/jquery.tpl.js start


// Simple JavaScript Templating
	// John Resig - http://ejohn.org/ - MIT Licensed
	(function ($){
		var _func = {}, _ra = /'/g, _rtxt = /((^|%>).*?(<%|$))/g;

		function tmpl(str, id){
			var source = "with(ctx){__buf.push('" + str
				.replace(/[\r\t\n]/g, " ")
				.replace(_rtxt, function (a){ return a.replace(_ra, '\\\''); })
				.split("<%").join("\t")
				.replace(/\t=(.*?)%>/g, "', $1,'")
				.split("\t").join("');")
				.split("%>").join("__buf.push('")
				+ "');}"
			;

			return	new Function("ctx",
				  'var __buf=[]; try{'
				+ source
				+ '}catch(err){ ajs.log(\'[tpl.error] "'+id+'" -- runtime\'); ajs.log(err); } '
				+ 'return __buf.join("")'
			);
		}


		$.preloadTpl = function (id, html){
			if( !(id in _func) ){
				_func[id]	= $.noop;

				if( !html ){
					html = $(id).remove().attr('innerHTML');
				}
				else if( html.jquery ) {
					html = html.attr('innerHTML') || html.val();
				}

				if( html ){
					try {
						_func[id] = tmpl( html, id );
					} catch (err){
						ajs.log('[tpl.error]: "'+ id +'" -- compile fail');
						ajs.log(err);
					}
				} else {
					ajs.log('[tpl.error]: "'+ id +'" -- not found');
				}
			}
		};


		$.tpl = function (id, data){
			$.preloadTpl(id);
			return _func[id](data);
		};


		$.fn.tpl = function (id, data){
			return	this.innerHTML( $.tpl(id, data) );
		};
	})(jQuery);


	window.TPL	= {
		def: {},

		date: function (date, format){
			return	Date.parse(date).format(format);
		},

		or: function (x, t, f){
			return	!!x ? t : f
		},

		getDef: function (key, opts){
			return	ajs.extend(TPL.def[key] || {}, opts);
		}
	};


	jsLoader.loaded('{jQuery}jquery.tpl', 1);

// data/ru/images/js/ru/jsCore/jquery/jquery.tpl.js end

// data/ru/images/js/ru/jsCore/jquery/jquery.fest-x.js start


// ./data/common/js/jquery/jquery.fest.js start

define('jquery/jquery.fest', function() {
	// async & sync
	$.fest = function (url, data, callback){
		var success = function() {
			var html;

			if( window.fest[url] ){
				 html = window.fest[url](data);
			}
			else {
				$(window).triggerHandler('fest.notDefinedTemplateMethod', [url]);
			}

			if( typeof callback !== 'undefined' ){
				callback(html);
			}

			return	html;
		};

		if(window.fest && window.fest[url] !== undefined) {
			return	success();
		} else {
			var scriptUrl = '/fest/' + url + '.js';

			var ajaxOptions = {
				url: scriptUrl,
				loading: true,
				dataType: 'script'
			};

			$(window).triggerHandler('ajax.beforeSend', [ajaxOptions]);

			$.getScript(scriptUrl).done(function(script, textStatus, jqXHR) {
				$(window).triggerHandler('fest.successLoad', [ajaxOptions, script, textStatus, jqXHR]);

				success();

			}).fail(function(jqXHR, settings, exception) {
				$(window).triggerHandler('fest.failLoad', [ajaxOptions, jqXHR, settings, exception]);
			})
		}
	};

	// async
	$.fn.fest = function (url, data, callback){
		$.fest(url, data, function(html) {
			this.trigger('destroy.view');

			this.each(function() {
				while(this.firstChild) {
					this.removeChild(this.firstChild);
				}

				this.innerHTML = html;
			});

			if(callback && callback instanceof Function) {
				callback.call();
			}

		}.bind(this));

		return	this;
	};
});
// ./data/common/js/jquery/jquery.fest.js end

$(window).bind('fest.notDefinedTemplateMethod', function(url) {
		ajs.log('jQuery.fest.error: '+ url+' not found');
	});

	$(window).bind('fest.successLoad', function(ajaxOptions, script, textStatus, jqXHR) {
		ajs.require('{mailru}mailru.Ajax', function() {
			$(window).triggerHandler('ajax.complete', [new mailru.Ajax.Result('success', ajaxOptions, jqXHR, textStatus)]);
		});
	});

	$(window).bind('fest.failLoad', function(ajaxOptions, jqXHR, settings, exception) {
		ajs.require('{mailru}mailru.Ajax', function() {
			$(window).triggerHandler('ajax.complete', [new mailru.Ajax.Result('error', ajaxOptions, jqXHR, exception)]);
		});

		ajs.require('{mailru}mailru.Notify', function() {
			mailru.Notify.add('error', { text: exception.toString() })
		});
	});

	jsLoader.loaded('{jQuery}jquery.fest-x', 1);

// data/ru/images/js/ru/jsCore/jquery/jquery.fest-x.js end

// data/ru/images/js/ru/jsCore/jquery/autocomplete.js start

/*
 * Autocomplete - jQuery plugin 1.1pre
 *
 * Copyright (c) 2007 Dylan Verheul, Dan G. Switzer, Anjesh Tuladhar, J?rn Zaefferer
 *
 * Dual licensed under the MIT and GPL licenses:
 *	 http://www.opensource.org/licenses/mit-license.php
 *	 http://www.gnu.org/licenses/gpl.html
 *
 * Revision: $Id: jquery.autocomplete.js 5785 2008-07-12 10:37:33Z joern.zaefferer $
 *
 */


(function($) {

$.fn.extend({
	autocomplete: function(urlOrData, options) {
		var isUrl = typeof urlOrData == "string";
		options = $.extend({}, $.Autocompleter.defaults, {
			url: isUrl ? urlOrData : null,
			data: isUrl ? null : urlOrData,
			delay: isUrl ? $.Autocompleter.defaults.delay : 10,
			max: options && !options.scroll ? 10 : 150
		}, options);

		// if highlight is set to false, replace it with a do-nothing function
		options.highlight = options.highlight || function(value) { return value; };

		// if the formatMatch option is not specified, then use formatItem for backwards compatibility
		options.formatMatch = options.formatMatch || options.formatItem;

		return this.each(function() {
			new $.Autocompleter(this, options);
		});
	},
	result: function(handler) {
		return this.bind("result", handler);
	},
	search: function(handler) {
		return this.trigger("search", [handler]);
	},
	flushCache: function() {
		return this.trigger("flushCache");
	},
	setOptions: function(options){
		return this.trigger("setOptions", [options]);
	},
	setData: function(data) {
		return this.trigger("setData", [data]);
	},
	unautocomplete: function() {
		return this.trigger("unautocomplete");
	}
});

$.Autocompleter = function(input, options) {

	var KEY = {
		UP: 38,
		DOWN: 40,
		DEL: 46,
		TAB: 9,
		RETURN: 13,
		ESC: 27,
		COMMA: 188,
		PAGEUP: 33,
		PAGEDOWN: 34,
		BACKSPACE: 8
	};

	// Create $ object for input element
	var $input = $(input).attr("autocomplete", "off").addClass(options.inputClass);

	var timeout;
	var previousValue = "";
	var cache = $.Autocompleter.Cache(options);
	var hasFocus = 0;
	var caretPos = {start: 0, end: 0};
	var lastKeyPressCode;
	var config = {
		mouseDownOnSelect: false
	};
	var select = $.Autocompleter.Select(options, input, selectCurrent, config);

	// only opera doesn't trigger keydown multiple times while pressed, others don't work with keypress at all
	$input.bind("keydown.autocomplete", function(event) {
		// track last key pressed
		lastKeyPressCode = event.keyCode;

		switch(event.keyCode) {

			case KEY.UP:
				if ( select.visible() ) {
					event.preventDefault();
					select.prev();
				} else {
					onChange(0, true);
				}
				break;

			case KEY.DOWN:
				if ( select.visible() ) {
					event.preventDefault();
					select.next();
				} else {
					onChange(0, true);
				}
				break;

			case KEY.PAGEUP:
				if ( select.visible() ) {
					event.preventDefault();
					select.pageUp();
				} else {
					onChange(0, true);
				}
				break;

			case KEY.PAGEDOWN:
				if ( select.visible() ) {
					event.preventDefault();
					select.pageDown();
				} else {
					onChange(0, true);
				}
				break;

			// matches also semicolon
//			case options.multiple && $.trim(options.multipleSeparator) == "," && KEY.COMMA:
			case KEY.TAB:
			case KEY.RETURN:
				if( selectCurrent(event) ) {
					// stop default to prevent a form submit, Opera needs special handling
					event.preventDefault();
					return false;
				}
				break;

			case KEY.ESC:
				select.hide();
				break;

			default:
				caretPos = $.Autocompleter.getCaretPosition(input);
				clearTimeout(timeout);
				timeout = setTimeout(onChange, options.delay);
				break;
		}
	}).focus(function(){
		caretPos = $.Autocompleter.getCaretPosition(input);
		// track whether the field has focus, we shouldn't process any
		// results if the field no longer has focus
		hasFocus++;
		if (options.multiple) {
			var list = $.grep(trimWords($input.val()), $.trim);
			if (list.length) {
				var value = list.join(options.multipleSeparator);
				$input.val(value + options.multipleSeparator);
				if (caretPos.start == caretPos.end && caretPos.start == value.length) {
					caretPos.start = caretPos.end = caretPos.start + options.multipleSeparator.length;
				}
				$.Autocompleter.Selection(input, caretPos.start, caretPos.end);
				$input.change();
			}
		}
	}).blur(function() {
		hasFocus = 0;
		if (!config.mouseDownOnSelect) {
			hideResults();
		}
		if (options.multiple)
		{
			var list = $.grep(trimWords($input.val()), $.trim);
			$input.val(list.join(options.multipleSeparator)).change();
		}
	}).click(function() {
		caretPos = $.Autocompleter.getCaretPosition(input);
		// show select when clicking in a focused field
		if ( hasFocus++ > 1 && !select.visible() ) {
			onChange(0, true);
		}
	}).bind("search", function() {
		// TODO why not just specifying both arguments?
		var fn = (arguments.length > 1) ? arguments[1] : null;
		function findValueCallback(q, data) {
			var result;
			if( data && data.length ) {
				for (var i=0; i < data.length; i++) {
					if( data[i].result.toLowerCase() == q.toLowerCase() ) {
						result = data[i];
						break;
					}
				}
			}
			if( typeof fn == "function" ) fn(result);
			else $input.trigger("result", result && [result.data, result.value]);
		}
		$.each(trimWords($input.val()), function(i, value) {
			request(value, findValueCallback, findValueCallback);
		});
	}).bind("clearPreviousValue", function() {
		previousValue = "";
	}).bind("flushCache", function() {
		cache.flush();
	}).bind("setOptions", function() {
		$.extend(options, arguments[1]);
		// if we've updated the data, repopulate
		if ( "data" in arguments[1] )
			cache.populate();
		if (hasFocus)
			$input.click();
	}).bind("setData", function() {
		options.data = arguments[1];

		if(options.data.length) {
			cache.populate();
		} else {
			cache.flush();
		}

	}).bind("unautocomplete", function() {
		select.unbind();
		$input.unbind();
		$(input.form).unbind(".autocomplete");
	})
	;

	function selectCurrent(event) {
		var current = select.current();
		var selected = select.selected();

		if( !selected )
			return false;

		var v = selected.result;
		previousValue = v;

		var inputValue = $input.val();

		if (options.multiple)
		{
			var value = $input.val();
			var a = $.grep(trimWords(value.substr(0, caretPos.start)), $.trim);
			var b = $.grep(trimWords(value.substr(caretPos.end)), $.trim);
			a[a.length - 1] = v;
			var c = a.concat(b);
			v = c.join(options.multipleSeparator) + options.multipleSeparator;
		}

		$input.triggerHandler('selectvalue', [v, current]);
		$input.val(v);

		$.Autocompleter.Selection(input, input.value.length, input.value.length);
		hideResultsNow();
		$input.trigger("result", [selected.data, selected.value, event, inputValue]);
		return true;
	}

	function onChange(crap, skipPrevCheck) {

		if( lastKeyPressCode == KEY.DEL ) {
			select.hide();
			return;
		}

		var currentValue = $input.val();

		if ( !skipPrevCheck && currentValue == previousValue )
			return;

		previousValue = currentValue;

		if (options.multiple)
		{
			currentValue = lastWordByCaretPosition(currentValue);
		}
		else
		{
			currentValue = lastWord(currentValue);
		}

		if (currentValue && currentValue.length >= options.minChars) {
			$input.addClass(options.loadingClass);
			if (!options.matchCase)
				currentValue = currentValue.toLowerCase();
			request(currentValue, receiveData, hideResultsNow);

		} else {
			stopLoading();
			select.hide();
		}
	};

	function trimWords(value) {

		var a = value.match(/".*?"/g) || [];
		var r = [];
		var o, i, l;

		for (i=0, l=a.length; i<l; i++)
		{
			o = {'from': a[i], 'to': a[i].replace(options.multipleSeparatorPattern, '_')};
			value = value.replace(o.from, o.to);
			r.push(o);
		}

		var r2 = value.split(options.multipleSeparatorPattern);

		for (i=0, l=r2.length; i<l; i++)
		{
			for (var i2=0, l2=r.length; i2<l2; i2++)
			{
				r2[i] = r2[i].replace(r[i2].to, r[i2].from);
			}

			r2[i] = $.trim(r2[i]);
		}

		return r2;
	}

	$.Autocompleter.trimWords = trimWords;

	function lastWordByCaretPosition(value)
	{
		caretPos = $.Autocompleter.getCaretPosition(input);
		return lastWord(value.substr(0, caretPos.start));
	}

	function lastWord(value) {
		if ( !options.multiple )
			return value;
		var words = trimWords(value);
		return words[words.length - 1];
	}

	// fills in the input box w/the first match (assumed to be the best match)
	// q: the term entered
	// sValue: the first matching result
	function autoFill(q, sValue){
		// autofill in the complete box w/the first match as long as the user hasn't entered in more data
		// if the last user key pressed was backspace, don't autofill
		if( options.autoFill && (lastWord($input.val()).toLowerCase() == q.toLowerCase()) && lastKeyPressCode != KEY.BACKSPACE ) {
			// fill in the value (keep the case the user has typed)
			$input.val($input.val() + sValue.substring(lastWord(previousValue).length));
			// select the portion of the value not typed by the user (so the next character will erase)
			$.Autocompleter.Selection(input, previousValue.length, previousValue.length + sValue.length);
		}
	};

	function hideResults() {
		clearTimeout(timeout);
		timeout = setTimeout(hideResultsNow, 200);
	};

	function hideResultsNow() {
		var wasVisible = select.visible();
		select.hide();
		clearTimeout(timeout);
		stopLoading();
		if (options.mustMatch) {
			// call search and run callback
			$input.search(
				function (result){
					// if no value found, clear the input box
					if( !result ) {
						if (options.multiple) {
							var words = trimWords($input.val()).slice(0, -1);
							$input.val( words.join(options.multipleSeparator) + (words.length ? options.multipleSeparator : "") );
						}
						else
							$input.val( "" );
					}
				}
			);
		}

		if (hasFocus && wasVisible)
		{
			// position cursor at end of input field
//			$.Autocompleter.Selection(input, input.value.length, input.value.length);
		}
	};

	function receiveData(q, data) {
		if (data)
		{
			if (options.filter)
				data = $.grep(data, options.filter, false);
			if (data.length && hasFocus ) {
				stopLoading();
				select.display(data, q);
				autoFill(q, data[0].value);
				select.show();
			} else {
				hideResultsNow();
			}
		}
		else
		{
			hideResultsNow();
		}
	};

	function request(term, success, failure) {

		if (!options.matchCase)
			term = term.toLowerCase();
		var data = cache.load(term);

		$input.triggerHandler('beforesearch', [term, data]);

		// recieve the cached data
		if ($.isArray(data)) {
			success(term, data);
		// if an AJAX url has been supplied, try loading the data now
		} else if( (typeof options.url == "string") && (options.url.length > 0) ){

			var extraParams = {
				timestamp: +new Date()
			};
			$.each(options.extraParams, function(key, param) {
				extraParams[key] = typeof param == "function" ? param() : param;
			});

			var params = {
				// try to leverage ajaxQueue plugin to abort previous requests
				mode: "abort",
				// limit abortion to this input
				port: "autocomplete" + input.name,
				dataType: options.dataType,
				url: options.url,
				data: $.extend({
					limit: options.max
				}, extraParams),
				success: function(data) {
					var parsed = options.parse && options.parse(data) || parse(data);
					cache.add(term, parsed);
					success(term, parsed);
				}
			};

			params.data[options.queryVarName] = options.prepareQuery(lastWord(term));

			$.ajax(params);
		} else {
			// if we have a failure, we need to empty the list -- this prevents the the [TAB] key from selecting the last successful match
			select.emptyList();
			$input.triggerHandler('failsearch', [term]);
			failure(term);
		}
	}

	function parse(data) {
		var parsed = [];
		var rows = data.split("\n");
		for (var i=0; i < rows.length; i++) {
			var row = $.trim(rows[i]);
			if (row) {
				row = row.split("|");
				parsed[parsed.length] = {
					data: row,
					value: row[0],
					result: options.formatResult && options.formatResult(row, row[0]) || row[0]
				};
			}
		}
		return parsed;
	};

	function stopLoading() {
		$input.removeClass(options.loadingClass);
	};

};

$.Autocompleter.defaults = {
	prepareQuery: function(term) { return term; },
	queryVarName: 'q',
	parent: $(document.body),
	inputClass: "ac_input",
	resultsClass: "ac_results",
	resultListClass: '',
	resultListItem: '',
	resultsActiveClass: "ac_over",
	loadingClass: "ac_loading",
	minChars: 1,
	delay: 400,
	matchCase: false,
	matchSubset: true,
	matchContains: false,
	cacheLength: 10,
	max: 100,
	mustMatch: false,
	extraParams: {},
	selectFirst: true,
	formatItem: function(row) { return row[0]; },
	formatMatch: null,
	autoFill: false,
	width: 0,
	multiple: false,
	multipleSeparator: ", ",
	highlight: function(value, term) {
		return value.replace(new RegExp("(?![^&;]+;)(?!<[^<>]*)(" + String.preg_quote(term) + ")(?![^<>]*>)(?![^&;]+;)", "gi"), "<strong>$1</strong>");
	},
	scroll: true,
	scrollHeight: 180
};

$.Autocompleter.Cache = function(options) {

	var data = {}, length = 0;

	function matchSubset(s, sub) {

		if (!options.matchCase) {
			s = s.toLowerCase();
			sub = sub.toLowerCase();
		}

		var i = s.indexOf(sub);

		if (options.matchContains == 'word') {
			s.replace(/^"?(.*?)"?\s+<(.*?)>$/, function(m0, m1, m2) {
				var p = /[\.\s]/, a = m1.split(p).concat(m2.split(/@/)[0].split(p)).concat([m1, m2]);
				for (var l=a.length; l--; ) {
					if ((i = a[l].indexOf(sub)) === 0) {
						break;
					}
				}
			})
		}

		return i === 0;
	}

	function add(q, value) {
		if (length > options.cacheLength){
			flush();
		}
		if (!data[q]){
			length++;
		}
		data[q] = value;
	}

	function populate(){
		if( !options.data ) return false;

		// track the matches
		var stMatchSets = {},
			nullData = 0;

		// no url was specified, we need to adjust the cache length to make sure it fits the local data store
		if( !options.url ) options.cacheLength = 1;

		// track all options for minChars = 0
		stMatchSets[""] = [];

		// loop through the array and create a lookup structure
		for ( var i = 0, ol = options.data.length; i < ol; i++ ) {
			var rawValue = options.data[i];
			// if rawValue is a string, make an array otherwise just reference the array
			rawValue = (typeof rawValue == "string") ? [rawValue] : rawValue;

			var value = options.formatMatch(rawValue, i+1, options.data.length);
			if ( value === false )
				continue;

			var firstChar = value.charAt(0).toLowerCase();

			if (options.rawList) {
				firstChar = "_";
			}

			// if no lookup array for this character exists, look it up now
			if( !stMatchSets[firstChar] )
				stMatchSets[firstChar] = [];

			// if the match is a string
			var row = {
				value: value,
				data: rawValue,
				result: options.formatResult && options.formatResult(rawValue) || value
			};

			// push the current match into the set list
			stMatchSets[firstChar].push(row);

			// keep track of minChars zero items
			if ( nullData++ < options.max ) {
				stMatchSets[""].push(row);
			}
		};

		// add the data items to the cache
		$.each(stMatchSets, function(i, value) {
			// increase the cache size
			options.cacheLength++;
			// add to the cache
			add(i, value);
		});
	}

	// populate any existing data
	setTimeout(populate, 25);

	function flush(){
		data = {};
		length = 0;
	}

	return {
		flush: flush,
		add: add,
		populate: populate,
		load: function(q) {

			var result = [], c, k, i, regexp = $.Autocompleter.CreateFindRegExp(q);

			if (!options.cacheLength || !length) {
				return result;
			}

			/*
			 * if dealing w/local data and matchContains than we must make sure
			 * to loop through all the data collections looking for matches
			 */
			if (!options.url && options.matchContains ) {
				// loop through all the data grids for matches
				for (k in data ) {
					// don't search through the stMatchSets[""] (minChars: 0) cache
					// this prevents duplicates
					if (k.length > 0) {
						c = data[k];
						$.each(c, function(i, x) {
							if ($.Autocompleter.MatchSubsetByRegExp(x.value, regexp)) {
								result.push(x);
							}
						});
					}
				}
			} else if (data[q]) { // if the exact item exists, use it
				result = data[q];
			} else if (options.matchSubset) {
				for (i = q.length - 1; i >= options.minChars; i--) {
					c = data[q.substr(0, i)];
					if (c) {
						result = [];
						$.each(c, function(i, x) {
							if (matchSubset(x.value, q)) {
								result[result.length] = x;
							}
						});
					}
				}
			}

			return result;
		}
	};
};

$.Autocompleter.Select = function (options, input, select, config) {
	var listItems,
		active = -1,
		data,
		term = "",
		needsInit = true,
		element,
		list;

	// Create results
	function init() {
		if (!needsInit) {
			return;
		}

		element = $("<div/>").addClass(options.resultsClass).appendTo(options.parent);

		if (options.parent.is('BODY')) {
			element.css("position", "absolute").hide();
		} else {
			options.parent.hide();
		}

		list = $('<ul class="'+options.resultListClass+'"></ul>');
		list.appendTo(element);

		list.mouseover( function(event) {
			if(target(event).nodeName && target(event).nodeName.toUpperCase() == 'LI') {
				active = $("li", list).removeClass(options.resultsActiveClass).index(target(event));
				$(target(event)).addClass(options.resultsActiveClass);
			}

		}).click(function(event) {
			$(target(event)).addClass(options.resultsActiveClass);
			select(event);
			// TODO provide option to avoid setting focus again after selection? useful for cleanup-on-focus
			input.focus();
			return false;

		}).mousedown(function() {
			config.mouseDownOnSelect = true;

		}).mouseup(function() {
			config.mouseDownOnSelect = false;
		});

		if( options.width > 0 ) {
			element.css("width", options.width);
		}

		needsInit = false;
	}

	function target(event) {
		var element = event.target;
		while(element && element.tagName != "LI")
			element = element.parentNode;
		// more fun with IE, sometimes event.target is empty, just ignore it then
		if(!element)
			return [];
		return element;
	}

	function moveSelect(step) {
		listItems.slice(active, active + 1).removeClass(options.resultsActiveClass);
		movePosition(step);
		var activeItem = listItems.slice(active, active + 1).addClass(options.resultsActiveClass);
		if(options.scroll) {
			var offset = 0;
			listItems.slice(0, active).each(function() {
				offset += this.offsetHeight;
			});
			if((offset + activeItem[0].offsetHeight - list.scrollTop()) > list[0].clientHeight) {
				list.scrollTop(offset + activeItem[0].offsetHeight - list.innerHeight());
			} else if(offset < list.scrollTop()) {
				list.scrollTop(offset);
			}
		}
	};

	function movePosition(step) {
		active += step;
		if (active < 0) {
			active = listItems.size() - 1;
		} else if (active >= listItems.size()) {
			active = 0;
		}
	}

	function limitNumberOfItems(available) {
		return options.max && options.max < available
			? options.max
			: available;
	}

	function fillList() {
		list.empty();

		var max = limitNumberOfItems(data.length);
		for (var i=0; i < max; i++) {
			if (!data[i]) {
				continue;
			}

			var formatted = options.formatItem(data[i].data, i+1, max, data[i].value, term);
			if ( formatted === false ) {
				continue;
			}

			var li = $('<li class="'+options.resultListItem + ' ' + (i%2 == 0 ? "ac_even" : "ac_odd") + '">' + options.highlight(formatted, term) + '</li>');
			list.append(li);

			$.data(li[0], "ac_data", data[i]);
		}

		listItems = list.find("li");
		if ( options.selectFirst ) {
			listItems.slice(0, 1).addClass(options.resultsActiveClass);
			active = 0;
		}
		// apply bgiframe if available
		if ( $.fn.bgiframe ) {
			list.bgiframe();
		}
	}

	return {
		display: function(d, q) {
			init();
			data = d;
			term = q;
			fillList();
		},
		next: function() {
			moveSelect(1);
		},
		prev: function() {
			moveSelect(-1);
		},
		pageUp: function() {
			if (active != 0 && active - 8 < 0) {
				moveSelect( -active );
			} else {
				moveSelect(-8);
			}
		},
		pageDown: function() {
			if (active != listItems.size() - 1 && active + 8 > listItems.size()) {
				moveSelect( listItems.size() - 1 - active );
			} else {
				moveSelect(8);
			}
		},
		hide: function() {
			if (options.parent.is('BODY'))
				element && element.hide();
			else
				options.parent.hide();
			listItems && listItems.removeClass(options.resultsActiveClass);
			options.parent.parent().andSelf().css('zIndex', '');
			active = -1;
		},
		visible : function() {
			return element && element.is(":visible");
		},
		current: function() {
			return this.visible() && (listItems.filter("." + options.resultsActiveClass)[0] || options.selectFirst && listItems[0]);
		},
		show: function() {
			var offset = $(input).offset();
			if (options.parent.is('BODY'))
			{
				element.css({
					width: typeof options.width == "string" || options.width > 0 ? options.width : $(input).width(),
					top: offset.top + input.offsetHeight,
					left: offset.left
				}).show();
			}
			else
				options.parent.show();

			options.parent.parent().andSelf().css('zIndex', 30000);

			if(options.scroll) {
				list.scrollTop(0);
				list.css({
					maxHeight: options.scrollHeight,
					overflow: 'auto'
				});

				if($.browser.msie && typeof document.body.style.maxHeight === "undefined") {
					var listHeight = 0;
					listItems.each(function() {
						listHeight += this.offsetHeight;
					});
					var scrollbarsVisible = listHeight > options.scrollHeight;
					list.css('height', scrollbarsVisible ? options.scrollHeight : listHeight );
					if (!scrollbarsVisible) {
						// IE doesn't recalculate width when scrollbar disappears
						listItems.width( list.width() - parseInt(listItems.css("padding-left")) - parseInt(listItems.css("padding-right")) );
					}
				}

			}
		},
		selected: function() {
			var selected = listItems && listItems.filter("." + options.resultsActiveClass).removeClass(options.resultsActiveClass);
			return selected && selected.length && $.data(selected[0], "ac_data");
		},
		emptyList: function (){
			list && list.empty();
		},
		unbind: function() {
			element && element.remove();
		}
	};
};

$.Autocompleter.Selection = function(field, start, end) {
	if( end === undef ){
		end = start;
	}
	try {
		if( field.createTextRange ){
			var selRange = field.createTextRange();
			selRange.collapse(true);
			selRange.moveStart("character", start);
			selRange.moveEnd("character", end - start);
			selRange.select();
		} else if( field.setSelectionRange ){
			field.setSelectionRange(start, end);
		} else {
			if( field.selectionStart ){
				field.selectionStart = start;
				field.selectionEnd = end;
			}
		}
		field.focus();
	}
	catch (e){}
};

$.Autocompleter.getCaretPosition = function(field){

	var start = 0, end = 0;
	if (document.getSelection || window.getSelection)
	{
		start = field.selectionStart;
		end = field.selectionEnd;
	}
	else if (document.selection)
	{
		try
		{
			field.focus();

			var sel = document.selection.createRange();
			var clone = sel.duplicate();
			sel.collapse(true);
			clone.moveToElementText(field);
			clone.setEndPoint("EndToEnd", sel);
			start = clone.text.length;
			sel = document.selection.createRange();
			clone = sel.duplicate();
			sel.collapse(false);
			clone.moveToElementText(field);
			clone.setEndPoint("EndToEnd", sel);
			end = clone.text.length;
		}
		catch( er ) {}
	}
	return {start: start, end: end};
};

var _map;

$.Autocompleter.Translit = function(str) {
	if (!_map) {
		_map = {};
		var data = Lang.get('translit');
		$.each (data, function (k, v) {
			if ($.isArray(v)) {
				$.each (v, function (k2, v2) {
					_map[v2] = k;
				});
			} else {
				_map[v] = _map[k] = v;
			}
		});
	}
	var a = str.split('');
	for (var i=a.length; i--;) {
		a[i] = _map[a[i]] || a[i];
	}
	return a.join('');
};

var RegExpFinder = function () {

	var _translit_ru, _translit_en, _spliter = /[\.\s]/, _email_spliter = /@/;

	function getSubstrValues (str) {
		var isUpperCased
			, value = _translit_en[str] || _translit_ru[str] || (str = str.toLocaleLowerCase(), isUpperCased = true) && (_translit_en[str] || _translit_ru[str])
			, result = []
			, len
		;

		if (value) {
			result = result.concat(value, str);
		}
		else if (str.length == 1) {
			result.push(str);
		}

		for ( len = result.length ; len-- ; ) {
			str = result[len];
			if ($.trim(str)) {
				str = result[len] = String.preg_quote(str);
				if(isUpperCased) {
					str = str.charAt(0).toUpperCase() + str.substr(1, str.length);
					result[len] = str;
				}
			}
			else {
				result[len] = '\\s+';
			}
		}

		return result;
	}

	function createCondition (parts, and) {
		var result = parts.join(and ? '' : '|');
		if (parts.length > 1) {
			result = '(' + result + ')';
		}
		return result;
	}

	function createRegExp(str) {

		str = (str === undef || str === null) ? '' : str + '';

		if (!_translit_ru && !_translit_en) {
			var data = Lang.get('translit_smart');
			_translit_ru = data.ru;
			_translit_en = data.en;
		}

		var result = '';
		for (var i=0, l=str.length; i<l; i++) {
			for (var n=l; n>i; n--) {
				var parts = [];
				var values = getSubstrValues(str.substring(i, n));
				if (values.length) {
					parts.push(createCondition(values, 0));
					if (n - i > 1) {
						var letters_parts = [];
						for (var x=i; x<n; x++) {
							letters_parts.push(createCondition(getSubstrValues(str.charAt(x)), 0));
						}
						parts.push(createCondition(letters_parts, 1));
						i += n - i - 1;
					}
					result += createCondition(parts, 0);
				}
			}
		}
		return result;
	}

	function createFindRegExp (str) {
		return new RegExp('^' + createRegExp(str), 'i');
	}

	function createHighlightRegExp (str) {
		return new RegExp('(^|"|&lt;|\\s|\\.)(' + createRegExp(str) + ')', 'i');
	}

	function matchSubsetByRegExp(str, regexp) {
		var result = false;
		str.replace(/^(?:"?(.*?)"?\s+<)?(.*?)>?$/, function(m0, name, email) {
			var a = [];
			if (name) {
				a = a.concat(name, name.split(_spliter));
			}
			if (email) {
				a = a.concat(email, email.split(_email_spliter)[0].split(_spliter));
			}
			for (var l=a.length; l--; ) {
				if (result = regexp.test(a[l])) {
					break;
				}
			}
		});
		return result;
	}

	return {
		createRegExp: createRegExp,
		createFindRegExp: createFindRegExp,
		createHighlightRegExp: createHighlightRegExp,
		matchSubsetByRegExp: matchSubsetByRegExp
	};
}();

$.Autocompleter.CreateRegExpStr = function (str) {
	return RegExpFinder.createRegExp(str);
};

$.Autocompleter.CreateFindRegExp = function(str) {
	return RegExpFinder.createFindRegExp(str);
};

$.Autocompleter.CreateHighlightRegExp = function(str) {
	return RegExpFinder.createHighlightRegExp(str);
};

$.Autocompleter.MatchSubsetByRegExp = function(str, regexp) {
	return RegExpFinder.matchSubsetByRegExp(str, regexp);
};

var fields = [];

$.Autocompleter.abjs = function (field) {
	fields.push(field);
	$R('{mailru.utils}' + 'mailru.Utils', function() {
		mailru.Utils.getAddressBook();
	});
};

$(window).bind('success.abjs', function (evt, data) {
	$.each(fields, function (k, v) {
		$(v).setOptions({data: data});
	});
});

$.Autocompleter.addressbook = function (node, loadAbjs) {
	var $input = $(node);
	var options = {
		'parent': $('.ac-layer', $input.parent()),
		'multiple': true,
		'matchContains': 'word',
		'cacheLength': 1000,
		'delay': 100,
		'rawList': true,
		'max': 100,
		'multipleSeparatorPattern': /(?:\s)?[,;](?:\s)?/g,
		'highlight': function(str, sub) {
			str = str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
			sub = sub.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
			return str.replace($.Autocompleter.CreateHighlightRegExp(sub), '$1<strong>$2</strong>');
		},
		'filter': function(data) {
			var items = $.Autocompleter.trimWords($input.val());
			return $.inArray(data.value, $.map(items, $.trim)) === -1;
		}
	};

	// https://jira.mail.ru/browse/MAIL-6937
	var _startTS = 0, _selTS, _sel_pid, _val = '', _data, _fail_pid, _abjs;

	$input
		.autocomplete(null, options)
		.bind('keydown', function (){
			clearTimeout(_sel_pid);
			if( !_startTS ){
				_startTS = ajs.now();
			}
		})
		.bind('result', function() {
			setTimeout(function() {
				$(this).change();
				this.scrollTop = this.scrollHeight;
			}.bind(this), 10);
		})
		.bind('beforesearch', function (evt, val, res){
			_val	= val;
			_data	= res;
			_abjs	= $.isArray(mailru.abjsData) ? mailru.abjsData.length : 0;

			clearTimeout(_sel_pid);
			clearTimeout(_fail_pid);

			if( res.length == 0 ){
				_fail_pid	= setTimeout(_autoLog, 500);
			} else {
				_selTS		= ajs.now();
				_sel_pid	= setTimeout(_autoLog, 15000);
			}
		})
		.bind('selectvalue', function (evt, val, node){
			_suggestLog(val, $(node).index());
		})
	;


	function _suggestLog(val, idx){
		if( _startTS ){
			clearTimeout(_sel_pid);
			clearTimeout(_fail_pid);

			mailru.Utils.suggestLog('email', {
				  start_ts: _startTS
				, sel_ts:	_selTS
				, val:	_val
				, sel:	val
				, data: _data || []
				, idx:	idx
				, abjs: _abjs
			});

			_val = _startTS = _selTS = _data = 0;
		}
	}


	function _autoLog(){
		_suggestLog('');
	}


	if( loadAbjs ){
		this.abjs($input);
	}

	return $input;
};

})(jQuery);

jsLoader.loaded('{jQuery}autocomplete', 1);


// data/ru/images/js/ru/jsCore/jquery/autocomplete.js end

// ./data/common/js/jquery/jquery.event.fix.js start

// http://bitovi.com/blog/2012/04/faster-jquery-event-fix.html
// https://gist.github.com/2954434 (original: https://gist.github.com/2377196)

// IE 8 has Object.defineProperty but it only defines DOM Nodes. According to
// http://kangax.github.com/es5-compat-table/#define-property-ie-note
// All browser that have Object.defineProperties also support Object.defineProperty properly

Object.defineProperties && (function (document, $){
	var
		// Use defineProperty on an object to set the value and return it
		set = function (obj, prop, val) {
			if( val !== undefined ){
				Object.defineProperty(obj, prop, {
					value : val
				});
			}
			return val;
		},

		// special converters
		special = {
			pageX : function (evt) {
				var
					  eventDoc = this.target.ownerDocument || document
					, doc	= eventDoc.documentElement
					, body	= eventDoc.body
				;
				return evt === void 0 ? 0 : evt.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0 ) - ( doc && doc.clientLeft || body && body.clientLeft || 0);
			},

			pageY : function (evt) {
				var
					  eventDoc = this.target.ownerDocument || document
					, doc	= eventDoc.documentElement
					, body	= eventDoc.body
				;
				return evt === void 0 ? 0 : evt.clientY + (doc && doc.scrollTop || body && body.scrollTop || 0 ) - ( doc && doc.clientTop || body && body.clientTop || 0);
			},

			relatedTarget : function (evt) {
				if(!evt) {
					return;
				}
				return evt.fromElement === this.target ? evt.toElement : evt.fromElement;
			},

			metaKey : function (evt) {
				return evt && evt.ctrlKey;
			},

			which : function (evt) {
				return evt && (evt.charCode != null ? evt.charCode : evt.keyCode);
			}
		}
	;


	// support jQuery < 1.7
	if( !$.event.keyHooks )		$.event.keyHooks	= { props: [] };
	if( !$.event.mouseHooks )	$.event.mouseHooks	= { props: [] };


	// Get all properties that should be mapped
	$.each($.event.keyHooks.props.concat($.event.mouseHooks.props, $.event.props), function (i, prop) {
		if( prop !== "target" ){
			(function (){
				Object.defineProperty($.Event.prototype, prop, {
					get : function () {
						// get the original value, undefined when there is no original event
						var originalValue = this.originalEvent && this.originalEvent[prop];

						// overwrite getter lookup
						return this['_' + prop] !== undefined ? this['_' + prop] : set(this, prop,
							// if we have a special function and no value
							special[prop] && originalValue === undefined ?
								// call the special function
								special[prop].call(this, this.originalEvent) :
								// use the original value
								originalValue)
					},

					set : function (newValue) {
						// Set the property with underscore prefix
						this['_' + prop] = newValue;
					}
				});
			})();
		}
	});


	$.event.fix = function (evt) {
		if( evt[ $.expando ] ){
			return	evt;
		}

		// Create a jQuery event with at minimum a target and type set
		var original = evt, target = original.target;

		evt = $.Event(original);

		// Fix target property, if necessary (#1925, IE 6/7/8 & Safari2)
		if( !target ){
			target = original.srcElement || document;
		}

		// Target should not be a text node (#504, Safari)
		if( target.nodeType === 3 ){
			target = target.parentNode;
		}

		evt.target = target;

		return	evt;
	}
})(document, jQuery);

define('jquery/jquery.event.fix', jQuery.noop);

// ./data/common/js/jquery/jquery.event.fix.js end

// ./data/common/js/jquery/jquery.event.scroll.js start

/**
 * jQuery extension, add support `scrollstart` and `scrollend` events.
 *
 * @author	RubaXa	<trash@rubaxa.org>
 * @github	https://gist.github.com/RubaXa/5568964
 * @license	MIT
 *
 *
 * @settings
 * 		$.special.scrollend.delay = 300; // default ms
 *
 * @flags
 * 		$.isScrolled; // boolean
 *
 * @binding
 * 		$(window).bind('scrollstart scrollend', function (evt){
 * 			if( evt.type == 'scrollstart' ){
 * 				// logic
 * 			}
 * 		});
 *
 */
(function ($){
	var
		  ns		= (new Date).getTime()
		, special	= $.event.special
		, dispatch	= $.event.handle || $.event.dispatch

		, scroll		= 'scroll'
		, scrollStart	= scroll + 'start'
		, scrollEnd		= scroll + 'end'
		, nsScrollStart	= scroll +'.'+ scrollStart + ns
		, nsScrollEnd	= scroll +'.'+ scrollEnd + ns
	;

	special.scrollstart = {
		setup: function (){
			var pid, handler = function (evt/**$.Event*/){
				if( pid == null ){
					evt.type = scrollStart;
					dispatch.apply(this, arguments);
				}
				else {
					clearTimeout(pid);
				}

				pid = setTimeout(function(){
					pid = null;
				}, special.scrollend.delay);

			};

			$(this).bind(nsScrollStart, handler);
		},

		teardown: function (){
			$(this).unbind(nsScrollStart);
		}
	};

	special.scrollend = {
		delay: 300,

		setup: function (){
			var pid, handler = function (evt/**$.Event*/){
				var _this = this, args = arguments;

				clearTimeout(pid);
				pid = setTimeout(function(){
					evt.type = scrollEnd;
					dispatch.apply(_this, args);
				}, special.scrollend.delay);

			};

			$(this).bind(nsScrollEnd, handler);

		},

		teardown: function (){
			$(this).unbind(nsScrollEnd);
		}
	};


	$.isScrolled = false;
	$(window).bind(scrollStart+' '+scrollEnd, function (evt/**Event*/){
		$.isScrolled = (evt.type == scrollStart);
	});
})(jQuery);

define('jquery/jquery.event.scroll', jQuery.noop);

// ./data/common/js/jquery/jquery.event.scroll.js end

// ./data/common/js/jquery/jquery.classList.js start

/**
 * jQuery extension, add support `classList`.
 *
 * @author	RubaXa	<trash@rubaxa.org>
 * @license	MIT
 */

(function ($){
	var
		  _rspace = /\s+/
		, _$cache = $('<div/>')

		, _div = _$cache[0]
		, _classList = _div.classList
		, _supportsArgs
	;


	if( _classList ){
		_classList.add('-a', 'b-');
		_supportsArgs = /-a/.test(_div.className) && /b-/.test(_div.className);


		/**
		 * Has class
		 *
		 * @param {string} className
		 * @returns {boolean}
		 */
		$.fn.hasClass = function (className){
			className = $.trim(className);
			var i = this.length;

			while( i-- ){
				if( this[i].classList.contains(className) ){
					return	true;
				}
			}

			return	false;
		};


		/**
		 * Add class
		 *
		 * @param	{string|function}  value
		 * @returns	{jQuery}
		 */
		$.fn.addClass = _factory('add');


		/**
		 * Remove class
		 *
		 * @param	{string|function}  value
		 * @returns	{jQuery}
		 */
		$.fn.removeClass = _factory('remove');
	}


	function _factory(method){
		return function (value){
			var typeOf = typeof value, i = this.length;

			if( 'string' === typeOf ){
				value = $.trim(value);

				if( "" !== value ){
					value = value.split(_rspace);

					var j, n = value.length, list;

					while( i-- ){
						list = this[i].classList;

						if( 1 === n ){
							list[method](value[0]);
						}
						else if( _supportsArgs ){
							list[method].apply(list, value);
						}
						else {
							for( j = 0; j < n; j++ ){
								list[method](value[j]);
							}
						}
					}
				}
			}
			else if( (void 0 === value) && ('remove' === method) ){
				while( i-- ){
					this[i].className = '';
				}
			}
			else if( 'function' === typeOf ){
				_each(this, method + 'Class', value);
			}

			return	this;
		}
	}


	function _each($el, method, callback){
		$el.each(function (i){
			_$cache[0] = this;
			_$cache[method]( callback.call(this, i, _$cache.attr('class')) );
		});
	}


	// Cleanup
	_$cache[0] = _div = _classList = null;
})(jQuery);

define('jquery/jquery.classList', jQuery.noop);

// ./data/common/js/jquery/jquery.classList.js end

// data/ru/images/js/ru/jsCore/plugins/LightBox.js start

/**
 * @class   LightBox
 * @author  RubaXa 	<trash@rubaxa.org>
 */


jsClass
		.create('LightBox')
		.statics({
			  last:		0
			, open:		[]
			, count:	0
			, active:	0
			, hideAll:	function (){ Array.forEach(this.open, function (L) { L.isVisible() && L.hide(); }); }
		})
		.methods({

		// LEGO
		__construct: function ($Box, opts)/*Void*/
		{
			LightBox.count++;

			$E(this, {

				// �������� ���������
				  position:			'fixed'
				, pTop:				'50%'
				, pLeft:			'50%'
				, zIndex:			30000

				// ���������
				, fadeNode:			0			// ���������� ��� ��������� ��� CSS Rules,
													// ��� �� ������� �������� fadeColor, fadeOpacity ������������
				, fadeColor:		'#000'	// ���� �����������
				, fadeOpacity:		0.6		// ������������ ����������

				, scrollWidth:		0

				, hideSelects:		1			// �������� ��� SELECT'� ��� ����������� �����
				, hideObjects:		0			// �������� ��� OBJECT'� ��� ������������ �����

				, visible:			0			// �������� �� ��������, 0 - ������������, 1 - ����������
				, disabledHide:		0			// ��������� ����������� ������� ���������
				, disabledShow:		0			// ��������� ����������� ����������� ���������
				, disable:			0			// ��������/��������
				, controls:			0			// ������� ������� ��� ���������� (CSS Rules)
				, lbControls:		'.lb-controls'
			}, opts);

			this.top	= this.pTop;
			this.left	= this.pLeft;
			this._dFire	= $D(this, 'fireControl');


			// ��� ����������
			this.$Fade	= this.fadeNode
									? $(this.fadeNode)
									: $('<div></div>').css({
											  opacity:			this.fadeOpacity
											, backgroundColor:	this.fadeColor
											, width:			'100%'
											, height:			'100%'
											, marginLeft:		-this.scrollWidth
											, display:			'none'
										})
										.setPositionFixed(0, 0)
										.appendTo($(this.BODY)[0] || 'BODY')
							;


			// ��� ������
			this.$Box	= jQuery( $Box ).processPlugins();

			if( this.position == 'fixed' )
			{
				this.$Box.setPositionFixed(this.left, this.top);
			}
			else if( this.position )
			{
				this.$Box.css({ position: this.position, left: this.left, top: this.top });
			}


			if( this.controls )	this.initControls(this.controls.constructor == Array ? this.controls : jQuery(this.controls));
			this.initControls(this.$Box);

			if( $B.msie )	this.$BODY	= jQuery('BODY');

			if( this.showBy ) jQuery(this.showBy).click($D(this, function (){ this.show(); return false; }));
			if( this.hideBy ) jQuery(this.hideBy).click($D(this, function (){ this.hide(); return false; }));
			if( this.hideByFade ) this.$Fade.bind(this.hideByFade, $D(this, function (){ this.hide(); return false; }));

			this.callMethod('init');
			if( this.visible ) this.show(true);
		},

	/**
	 * @private
	 */
		custom: function ()
		{
			var p	= ['customFunc'];
			Array.prototype.push.apply(p, arguments);
			return	!(this.callMethod.apply(this, p) !== false);
		},


		initControls: function ($X, s)
		{
			for( var i = 0; $X[i]; i++ )
			{
				if( $X[i] && $X[i].getAttribute && (c = $GA($X[i], 'lightBox')) )
				{
					c	= c.indexOf('{') > -1 ? eval("(" + (c||'{}') + ")") : { m: c };
					if( c && c.m && this[c.m] )
					{
						$X[i].___c	= c;
						jQuery($X[i]).bind($X[i].tagName=='FORM'?'submit':'click', $D(this, this.fireControl));
					}
					$X[i].removeAttribute('lightBox');
					$X[i].lightBox	= null;
				}
			}
			if( !s && !this.lbFast && $X.find ) this.initControls($X.find('.lb-control,A'), true);
		},


		fireControl: function (e)
		{
			this.__e	= e;
			this.__c	= jsCore.elm(e, '___c');

			if(
				   !(this._cDisable || e.disabled)
				&& (this.__c.___c && this.__c.___c.m && this[this.__c.___c.m])
			){
				return	(this[this.__c.___c.m].apply(this, (this.__c.___c.p||[])/*.concat(e)*/) === true);
			}
		},


	/**
	 * @public
	 */
		getEvent:	function (){	return	this.__e; },
		getControl: function (){	return	this.__c; },

		resize: function (w, h, f, speed)
		{
			var s = this.$Box.getSize(true);
			this.fixPos();
			this.fixPos(!f, defined(w, s.width), defined(h, s.height), speed);
			return	this;
		},

		fixPos: function (anim, w, h, speed)
		{
			var s = {};

			$E(this, this.$Box.getSize());

			if( w || h )
			{
				this.$Box.css({ width: this.width, height: this.height });
				$E(s, { width: w, height: h });
				$E(this, s);
			}

			this.dw		= this.width / 2;
			this.dh		= this.height / 2;
			s.marginLeft	= -this.dw
			s.marginTop		= -this.dh;

			var
				  xH	= this.height > ajs.windowHeight()
				, xW	= this.width > ajs.windowWidth()
				, x		= xW || xH
			;

			if( jQuery.iePositionFixed === undef )	// extensions.js
			{
				this.left	= s.left = x ? (Math.max(this.dw, ajs.windowWidth()/2) + ajs.scrollLeft()) : ajs.windowWidth()/2;
				this.top 	= s.top  = x ? (Math.max(this.dh, ajs.windowHeight()/2) + ajs.scrollTop()) : ajs.windowHeight()/2;
				this.abs	= x;
				s.position	= x ? 'absolute' : this.position;
			}

			if( anim && this.isVisible() )
			{
				this.$Box.css('position', s.position);
				this.$Box.animate(s, speed || 'slow', $D(this, 'fixPos'));
			}
			else
				this.$Box.css(s);

			return	this;
		},


		controlDisable: function (s/*:Bool*/)
		{
			this._cDisable	= !!s;
			return	this;
		},

		isDisabled: function ()/*Bool*/
		{
			return	this._cDisable;
		},

		html: function (html)
		{
			$FS(this.$Box[0]).visibility	= 'hidden';

			this.$Box
					.html(html)
					.processPlugins()
			;

			this.initControls(this.$Box);
			this.fixPos();

			$FS(this.$Box[0]).visibility	= '';

			return	this;
		},


		isVisible: function (){ return this.visible; },


		toggle: function (f/*force:Bool = undefined*/, s/*show:Bool = undefined*/)
		{
			var
				  d	= defined(s, !this.visible) ? '' : 'none'
				, e = !d ? 'show' : 'hide'
			;

			if( this.dispatchEvent('before' + String.ucfirst(e), this) !== false )
			{
				/**
				 * @todo
				 * ���� ��� ��������, � �������� f(orce) �����
				 * ��� ���������� �������� ��� ��������
				 */
				$FS(this.$Box[0]).zIndex	= this.zIndex + (LightBox.active + 101);

				if( !this.$Fade[0].__lb || (this.$Fade[0].__lb == this.uniqId) )
				{
					this.$Fade[0].__lb = !d ? this.uniqId : 0;
					this.$Fade.css({ zIndex: this.zIndex + LightBox.active + 1, display: d });
				}

				LightBox.active	+= !d ? 1 : -1;
//				var top = this.abs ? window.scrollTop() : 0;

				if( !d )
				{
					//this.$Box.css({ display: '', visibility: 'hidden' });
					this.fixPos();
					//this.$Box
					//	.css({ top: top-this.dh, visibility: '' })
					//	.animate({ top: this.abs ? this.top : ajs.windowHeight()/2 }, 500, 'easeOutBack', $D(this, 'fixPos'))
					//;
					$FS(this.$Box[0]).display = '';
					LightBox.last = this;
					LightBox.open.push(this);

					if (this.$wrapper) {
						this.styleOverflow = this.$wrapper.css('overflow');
						this.$wrapper.css('overflow', 'hidden');
					}
				}
				else
				{
					//if( !this.abs ) this.$Box.css({ top: ajs.windowHeight()/2 });
					//this.$Box.animate({ top: top + ajs.windowHeight() + this.dh }, 500, 'easeInOutBack', function (){ $FS(this).display = 'none'; });
					$FS(this.$Box[0]).display = 'none';
					if( LightBox.open ) LightBox.open	= Array.remove(LightBox.open, this);
					LightBox.last	= LightBox.open[LightBox.active - 1];

					if (this.$wrapper) {
						this.$wrapper.css('overflow', this.styleOverflow);
					}
				}

				this._visible	= this.visible;	// ��������� ��������
				this.visible	= !d;	// ����� ��������

				if( this.$BODY )
				{
					if( this.hideSelects ) this.$BODY[this.visible?'addClass':'removeClass']('hidden-all-selects');
					if( this.hideObjects ) this.$BODY[this.visible?'addClass':'removeClass']('hidden-all-objects');
				}


				this.dispatchEvent(e, this);
			}

			return	this;
		},


		hide: function (f){ return	this.disabledHide ? this : this.toggle(f, false); },
		show: function (f){ return	this.disabledShow ? this : this.toggle(f, true); },


		destroy: function ()
		{
			LightBox.count--;
			LightBox.open	= Array.remove(LightBox.open, this, 1);
			if( this.isVisible )
				this.hide();
		}

	});


	jQuery.hotkeys.on('esc', function (){
		if( LightBox.active && LightBox.last && !LightBox.last.isDisabled() ){
			LightBox.last.hide();
		}
	});


	jQuery(window).resize(function (){
		if( LightBox.active && LightBox.last && LightBox.last.isVisible() ){
			Array.forEach(LightBox.open, function (L) { L.isVisible() && L.fixPos(); });
		}
	});

	jsLoader.loaded('{plugins}LightBox', 1);

// data/ru/images/js/ru/jsCore/plugins/LightBox.js end

// data/ru/images/js/ru/jsCore/plugins/Dropdown.js start

/**
 * @function $.fn.Dropdown
 * @object   Dropdown
 * @author  Stanislav Tugovikov  <s.tugovikov@corp.mail.ru>
 * @editor  Abashkin Alexander <a.abashkin@corp.mail.ru>
 */


// ./data/common/js/profiler/profiler.js start

define('profiler/profiler', function() {

/* JS PROFILER 
 *
 */
(function (){
	performance = window.performance || {};
	performance.now = (function() {
		return  performance.now || performance.mozNow || performance.msNow || performance.oNow || performance.webkitNow || function() {return new Date().getTime(); };
	})();

	var start;
	var result = [];

	var disabled = true;

	function add(state, str) {
		var finish = performance.now(); 

		if(!start) {
			start = finish;
		}

		result.push({
			state: state,
			str:str,
			duration: (finish - start)
		});

		start = finish;
	};

	function clear() {
		start = null;
		result = [];
	}

	/*
	var _retry = 0;
	function onready(callback) {
		var firstCorrectChild = document.body && document.body.firstChild;

		if( firstCorrectChild ){
			do {
				if( firstCorrectChild.nodeType == 1 ){
					callback(child);
					return;
				}

			} while( firstCorrectChild = firstCorrectChild.nextSibling )
		}

		if( _retry < 10 ){
			setTimeout(function() {
				onready(callback);

			}, ++_retry*50);
		}
	}
	*/

	var Profiler = {
		clear: clear,

		enable: function() {
			disabled = false;
		},

		disable: function() {
			disabled = true;
		},

		start: function(str) {
			if(disabled) {
				return;
			}

			add('start', str);
		},

		end: function(str) {
			if(disabled) {
				return;
			}

			add('end', str);
		},

		renderResult: function() {
			if(disabled) {
				return;
			}

			var tree    = [];
			var parents = [];

			function createRow(str, duration) {
				var row = {
					str: str,
					duration: duration || 0,
					parent: lastParent(),
					depth: parents.length,
					childs: []
				}

				tree.push(row);

				var parent = lastParent();
				if(parent) {
					parent.childs.push(row);
				}
				return row;
			}

			function createAnonim(duration) {
				return createRow('&lt;anonimous&gt;', duration)
			}

			function lastParent() {
				return parents[parents.length - 1] || null;
			}

			function lastRow() {
				return tree[tree.length - 1];
			}

			Array.forEach(result, function(res) {
				if(res.state == 'start') {
					if(res.duration) {
						createAnonim(res.duration);
					}

					var row = createRow(res.str);
					parents.push(row);
				}

				if(res.state == 'end') {
					var last = lastRow();

					if(res.duration) {
						if(last && last.str == res.str) {
							last.duration += res.duration;
						} else {
							createAnonim(res.duration);
						}
					}

					parents.pop();
				}
			})

			function getType(duration) {
				       if (duration <   1) { return '1';
				} else if (duration <  10) { return '2';
				} else if (duration <  30) { return '3';
				} else if (duration <  50) { return '4';
				} else if (duration < 100) { return '5';
				} else                     { return '6';
				}
			}

			var html = [
				'<style type="text/css">',
					'#profiler {background: white; border: 1px solid red;}',

					'#profiler .profiler__row {margin-left: 1em}',

					'#profiler .profiler__row__title {padding: 0.5em;} ',
					'#profiler .profiler__row__title:hover {background-color: yellow;} ',
					'#profiler .profiler__row__title_parent { cursor:pointer;}',

					'#profiler .profiler__row__title_1 {color:#ccc} ',
					'#profiler .profiler__row__title_2 {color:#999} ',
					'#profiler .profiler__row__title_3 {color:#666} ',
					'#profiler .profiler__row__title_4 {color:#000} ',
					'#profiler .profiler__row__title_5 {color:#f00} ',
					'#profiler .profiler__row__title_6 {color:#f00; font-weight: bold} ',


					'#profiler .profiler__row_collapse > .profiler__row__childs {display: none} ',
					'#profiler .profiler__row_collapse > .profiler__row__title_self {display: none} ',

					'#profiler .profiler__row_expand   > .profiler__row__title_depth {display: none} ',

					'#profiler .profiler__row__duration {float:right; padding-left: 0.5em} ',

					'#profiler .profiler__collapse_control {position: absolute; margin-left: -1em;}',
					'#profiler .profiler__close { display: block; margin: 5px; cursor: pointer;}',

				'</style>',
				'<div id="profiler">',
					'<span class="profiler__close" title="close">[ close ]</span>'
			];

			function rasterizeRowTitle(str, duration, hasChilds, depth) {
				html.push('<div class="');
						html.push(' profiler__row__title');
						html.push(' profiler__row__title_'+getType(duration));

						html.push(hasChilds ? ' profiler__row__title_parent' : '');
						html.push(depth     ? ' profiler__row__title_depth'  : ' profiler__row__title_self');
					html.push('">');

					if(duration) {
						html.push('<span class="profiler__row__duration">' + duration.toFixed(3) + '</span>');
					}

					if(hasChilds) {
						if(depth) {
							html.push('<b class="profiler__collapse_control profiler__collapse_plus">+</b>');
						} else {
							html.push('<b class="profiler__collapse_control profiler__collapse_minus">-</b>');
						}
					}

					html.push(str);
				html.push('</div>');
			}

			function depthDuration(res) {
				var duration = res.duration;

				Array.forEach(res.childs, function(child) {
					duration += depthDuration(child);
				})

				return duration;
			}

			function rasterizeRow(res) {
				html.push('<div class="profiler__row  profiler__row_'+(res.depth < 2 ? 'expand' : 'collapse')+'">');
					rasterizeRowTitle(res.str, res.duration, res.childs.length, false);

					rasterizeRowTitle(res.str, depthDuration(res), res.childs.length, true);

					if(res.childs.length) {
						html.push('<div class="profiler__row__childs">');
							Array.forEach(res.childs, function(child) {
								rasterizeRow(child);
							})

						html.push('</div>');
					}

				html.push('</div>');
			}

			Array.forEach(Array.filter(tree, function(res) {
				return res.parent == null;

			}), function(res) {
				rasterizeRow(res)
			})

			html.push('</div>')

			// нужно убедиться что dom загрузился
			$(function() {
				$(document.body).prepend(html.join(''));

				$('#profiler').each(function() {
					var profiler = $(this);

					profiler.find('.profiler__row__title_parent').click(function() {
						$(this.parentNode).toggleClass('profiler__row_expand profiler__row_collapse');
					});

					profiler.find('.profiler__close').click(function() {
						profiler.remove();
					});
				});
			})

			clear();
		}
	};

	// aliases
	Profiler.s = Profiler.start;
	Profiler.e = Profiler.end;

	window.profiler = Profiler
})(); 

});
// ./data/common/js/profiler/profiler.js end

var $P = profiler;

	(function($)
	{
		var namespace = 'dropdown.' + $.expando;

		/**
		 * @class Dropdown
		 */
		jsClass
		.create('Dropdown')
		.statics({
			add: function (D)
			{
				var g = D.options.group;

				if (!this[g]) {
					this[g] = [];
				}

				this[g].push(D);
			},

			remove: function(D)
			{
				var g = D.options.group;

				if (this[g] && this[g] instanceof Array) {
					this[g] = Array.filter(this[g], function(d) {
						return D !== d;
					})
				}
			},

			hide: function (name, uniqId)
			{
				if (name in this) {
					Array.forEach(this[name], function (D){
						(uniqId != D.uniqId) && D.hide();
					});
				}
			},

			destroy: function(name)
			{
				if (name in this) {
					Array.forEach(this[name], function (D){
						D.destroy()
					});

					delete this[name];
				}
			},

			defaultOptions: {
				  group:          'dropdown'
				, timeout:        500
				, onClick:        $.noop
				, onToggle:       $.noop
				, onClosed:       $.noop
				, orientation:    false
				, openInsideBody: false
				, lazy:           false
				, hideByMousedown: false
				, hideByBlur:	   false
				, wrapperWidth: function () { return ajs.windowWidth(); }
			}
		})
		.methods({

			_beforeAccess: function() {
				if(!this._isTouched) {
					this._isTouched = true;

					this.$link.bind('mouseenter.' + namespace, this._cancelTimer.bind(this));
					this.$link.bind('mouseleave.' + namespace, this._initTimer.bind(this));

					$P.s('bind container');
						$P.s('find container');
							this.$container = typeof this._container === 'string' ? this._node.find(this._container) : this._container;
						$P.e('find container');

						$P.s('click');
							this.$container.bind('click.'      + namespace, this._click.bind(this));
						$P.e('click');

						$P.s('mouseenter');
							this.$container.bind('mouseenter.' + namespace, this._cancelTimer.bind(this));
						$P.e('mouseenter');

						$P.s('mouseleave');
							this.$container.bind('mouseleave.' + namespace, this._initTimer.bind(this));
						$P.e('mouseleave');
					$P.e('bind container');
				}
			},

			__construct: function (link, container, options, node) {
				this.options = $.extend({}, Dropdown.defaultOptions, options);
				Dropdown.add(this);

				this._node = node;
				this._container = container;

				if (this.options.hideByMousedown) {
					this._documentMouseDownObserver = this._documentMouseDown.bind(this);
				}
				if (this.options.hideByBlur) {
					this._windowBlurObserver = this._windowBlur.bind(this);
				}

				$P.s('bind link');
					$P.s('find link');
						this.$link = typeof link === 'string' ? node.find(link) : link;
					$P.e('find link');

					$P.s('click');
						this.$link.bind('click.' + namespace, (function () {
							if(this.options.lazy) {
								this._beforeAccess();
							}

							if (!this.$link.closest('.form_disabled').length) {
								this.show();
							}
						}).bind(this));
					$P.e('click');

					if(!this.options.lazy) {
						this._beforeAccess();
					}

				$P.e('bind link');
			},

			_documentMouseDown: function (evt) {
				if (!this.$container.has(evt.target).length) {
					this.hide();
				}
			},

			_windowBlur: function (evt) {
				this.hide();
			},

			destroy: function()
			{
				if(this.__removed) {
					return;
				}

				this._cancelTimer();

				this.hide();
				if(this.$container) {
					this.$container.unbind('.' + namespace);
				}
				this.$link.unbind('.' + namespace);

				if (this.options.openInsideBody) {
					this.$container.remove();
				}

				delete this.$container;
				delete this.$link;
				delete this.$parent;

				Dropdown.remove(this);
				this.__removed = true;
			},

			_click: function (evt) {
				return	this.options.onClick(evt, this);
			},

			_resize: function ()
			{
				var o = this.options, or = o.orientation, $Box = this.$container;

				if (or)
				{
					$Box.replaceClass(/\s+dd-orientation-\w+/, '');

					if (or == 'auto'){
						or	= (o.wrapperWidth() - ($Box.offset().left + $Box.outerWidth()) < 50) ? 'left' : 'right';
					}

					$Box.addClass('dd-orientation-'+or);
				}
			},

			show: function()
			{
				this._cancelTimer();

				if (this.$container.is(':visible'))
				{
					this.options.onToggle(false, this);
					this.hide();
				}
				else
				{
					if (this.options.onToggle(true, this) !== false) {
						Dropdown.hide( this.options.group, this.uniqId );

						if (this.options.openInsideBody)
						{
							if (!this.$parent)
							{
								this.$parent = this.$container.parent();

								// чтобы корректно работало дублирование контролов
								this.$parent.append(this.$container.clone());
								$('body').append(this.$container);
							}

							var pos = this.$parent.offset();

							this.$container.css({
								'left': pos.left,
								'top': pos.top + this.$parent.height(),
								'min-width': this.$parent.width()
							});
						}

						if (this.options.hideByMousedown) {
							$(document).one('mousedown', this._documentMouseDownObserver);
						}
						if (this.options.hideByBlur) {
							$(window).one('blur', this._windowBlurObserver);
						}

						this.$container.show()
							.offsetParent()
							.andSelf()
								.css({ zIndex: 65002 })
						;

						$(window).bind('resize', $DS(this, '_resize'));
						this._resize();
					}
				}
			},

			hide: function(callback) {
				$(window).unbind('resize', $DS(this, '_resize'));

				if(this.$container && (this.options.onToggle(false, this) !== false) ) {
					this.$container
						.offsetParent()
						.andSelf()
							.css({ zIndex: '' })
					;
					this.$container.hide();

					if (this.options.hideByMousedown) {
						$(document).unbind('mousedown', this._documentMouseDownObserver);
					}
					if (this.options.hideByBlur) {
						$(window).unbind('blur', this._windowBlurObserver);
					}

					if (callback) {
						callback();
					}
				}
			},

			_cancelTimer: function() {
				Timeout.clear(this.uniqId);
			},

			_initTimer: function()
			{
				if (this.options.timeout) {
					Timeout.set(this.uniqId, (function () {
						this.options.onToggle(false, this);
						this.hide();

						this.options.onClosed();

					}).bind(this), this.options.timeout);
				}
			}
		});

		$.fn.dropdown = function (object)
		{
			if (!this.length) {
				return this;
			}

			if (typeof object == 'string') {
				var widget = this.data(namespace);
				if(widget) {
					widget._beforeAccess();
				}

				return object.toLowerCase() == 'widget' ? widget : this;
			}

			return this.each(function() {
				var self = $(this);

				$P.s('set data');
					self.data(namespace, new Dropdown(object.link, object.container, object, self));
				$P.e('set data');
			});
		};

	})(jQuery);

	jsLoader.loaded('{plugins}Dropdown', 1);

// data/ru/images/js/ru/jsCore/plugins/Dropdown.js end

// data/ru/images/js/ru/jsCore/plugins/LayerManager.js start


(function($) {

		function selectAuth(email) {
			$.ajax({
				url: '//swa.' + mailru.SingleDomainName + '/cgi-bin/auth?mac=1',
				data: {Login: email},
				dataType: 'jsonp',
				jsonp: 'JSONP_call',
				timeout: 5000,
				success: function(response) {
					if (response.status == 'ok') {
						location.href = '/messages/inbox';
					}
				}
			});
		}

		//<!--IF 0-->https://jira.mail.ru/browse/MAIL-8561<!-- /IF-->
		function formSubmitRadarLog(radarName, radarSection, onRadarDone) {
			var radarObj = mailru.radar(radarName, radarSection != void 0 ? radarSection : 1, radarSection != void 0 ? void 0 : 1)
			  , checkRadarObj = function checkRadarObj(onDone, forseOnDone) {
					if(!radarObj)return;

					if(radarObj.complete || forseOnDone) {
						onDone();
						radarObj.onload = radarObj.onerror = radarObj.onabort = null;
						radarObj = null;
					}
					else if((this.timeout -= this.step) > 0) {
						setTimeout(checkRadarObj.bind(this, onDone), this.step);
					}
					else {
						checkRadarObj(onDone, true);
					}
				}
			;

			setTimeout(
				radarObj.onload = radarObj.onerror = radarObj.onabort = checkRadarObj.bind({ timeout : 100,	step : 10}, onRadarDone, false)
				, 10
			);
		}//<!--IF 0-->https://jira.mail.ru/browse/MAIL-8561<!-- /IF-->

		/**
		 * @class LayerManager
		 */
		jsClass
		.create('LayerManager')
		.statics({

			show: function (name, vars) {
				if ($.isFunction(this[name])) {
					this[name](name, vars || {});
				}
			},

			isExpire: function (name, expire){
				var index = mailru.HelperIndex[name], lastTS = mailru.HelperTimestamp[index];
				return mailru.CurrentTimestamp - lastTS >= expire;
			},

			saveHelper: function (name){
				var index = mailru.HelperIndex[name], ts = mailru.HelperTimestamp[index] = mailru.CurrentTimestamp;
				$.post('/cgi-bin/ajax_helper?ajax_call=1&func_name=set_helper_timestamp', { helper: index, helper_timestamp: ts });
			},

			getMaxTimestamp: function () {
				var ts = 0, name;
				for (var i = arguments.length; i-- ; ) {
					name = arguments[i];
					if (name in mailru.HelperIndex) {
						ts = Math.max(ts, mailru.HelperTimestamp[mailru.HelperIndex[name]]);
					}
				}
				return ts;
			},

			verifyPhoneNotify: function (id){
				$R('{utils}'+'Counter', function (){
					Counter.d(606317);
					$(id).show().find('.js-act').click(function (evt){
						var $node = $(evt.currentTarget);

						if( !$node.hasClass('js-close') ){
							Counter.sb(606320);
							ajs.require('{mailru}mailru.PhoneManager', function (){
								var Manager = new mailru.PhoneManager({
									'user': {
										'name': mailru.username,
										'domain': mailru.userdomain
									}
								});

								Manager.bind('verifySuccess', function (){
									Counter.d(606322);
									if( mailru.isMailboxPage() ){
										LayerMainDiv.getInstance().hide();
									} else {
										location.reload();
									}
								});
								Manager.addPhone();
							});
						} else {
							Counter.sb(606318);
							this.saveHelper('VerifyPhoneNotify');
						}

						$node.closest('.js-parent').slideUp('fast');
					}.bind(this));
				}.bind(this));
			},

			noAuth: function (name, vars) {
				vars = vars || {};

				var _log_params = {
					  status: 'noauth'
					, username: mailru.username
					, userdomain: mailru.userdomain
					, useremail: mailru.useremail
				};

				var isChangeAccount = !!vars.changeAccount;

				if( vars.checkLayerMainDiv === true ) {
					delete vars.checkLayerMainDiv;
					ajs.require('{plugins}' + 'Layer', function() {
						if (!LayerMainDiv.getInstance().visible) {//FIXME: needs comment
							LayerManager.show('noAuth', vars);
						}
					});
					return;
				}

				if( mailru.phAuthFormEnabled ) {//MAIL-13474
					__PH.authForm.show(vars);

					if( !isChangeAccount ) {
						// MAIL-4097
						var timer = setInterval(function () {
							$.ajax({
								url: '//swa.' + mailru.SingleDomainName + '/cgi-bin/counters?mac=1',
								dataType: 'jsonp',
								jsonp: 'JSONP_call',
								success: function(response) {
									if (response.status == 'ok') {
										var data = response.data;
										if (data && data.email == mailru.useremail) {
											clearInterval(timer);

											var host = location.protocol + '//' + location.host;
											var currentUrl = jsHistory.get().replace(new RegExp('^' + String.preg_quote(host)), '');
											if (currentUrl.indexOf('/') === 0) {
												currentUrl = host + currentUrl;
											} else {
												currentUrl = host + '/' + currentUrl;
											}
											location.href = currentUrl;
										}
									}
								}
							});
						}, 20000);
					}

					$(window).unbind('beforeunload');

					new Image().src = '//gstat.' + mailru.staticDomainName + '/gstat?ph_noauth=1&logme=' + encodeURIComponent($.param(_log_params));

					return;
				}

				$R('{plugins}' + 'Layer', function () {
					Layer.get(name, function (layer) {

						var host = location.protocol + '//' + location.host;
						var currentUrl = jsHistory.get().replace(new RegExp('^' + String.preg_quote(host)), '');
						if (currentUrl.indexOf('/') === 0) {
							currentUrl = host + currentUrl;
						} else {
							currentUrl = host + '/' + currentUrl;
						}

						var defaultUrl = host + '/messages/inbox';

						var $form = $('form', layer.$div).unbind('submit');

						var $newOneEmailContainer = $('.js-newOneEmailContainer', layer.$div).hide();
						var $newOneEmailLink = $('.js-newEmail', $newOneEmailContainer);
						var $newMultiEmailContainer = $('.js-newMultiEmailContainer', layer.$div).hide();
						var $registerNewEmail = $('.js-registerNewEmail', layer.$div); // MAIL-10252
						var $newMultiEmailSelect = $('select', $newMultiEmailContainer).empty();

						var $domainSelect = $('select[name="Domain"]', layer.$div);
						var $domainSelectOption;
						var $login = $('input[name="Login"]', layer.$div);

						$('.js-messageNoAuth', layer.$div).toggle(!isChangeAccount);
						$('.js-messageChangeAccount', layer.$div).toggle(isChangeAccount);

						layer.one('show', function () {
							$newOneEmailContainer.bind('click.layer', function (evt) {
								selectAuth($newOneEmailLink.text());
								evt.preventDefault();
							});
							$newMultiEmailSelect.bind('change.layer', function () {
								var value = $newMultiEmailSelect.val();
								if (value) {
									selectAuth(value);
								}
							});
							$form.bind('submit.layer', function () {
								var email = $login.val();
								if (email.indexOf('@') === -1) {
									email += '@' + $domainSelect.val();
								}
								if (mailru.IS_PREVIEW) {
									defaultUrl += (defaultUrl.indexOf('?') === -1 ? '?' : '&') + 'hlpreview=1&preview=2';
								} else if (email == mailru.useremail) {
									defaultUrl = currentUrl;
								}

								$('input[name="page"]', this).val(defaultUrl);
							});
						});

						layer.one('hide', function () {
							$newOneEmailContainer.unbind('.layer');
							$newMultiEmailSelect.unbind('.layer');
							$form.unbind('.layer');
						});


						//MAIL-12783
						function changeDomainSelectOption(){
							$domainSelectOption = $('option[value="' + mailru.userdomain + '"]', $domainSelect);

							if (!$domainSelectOption.length) {
								$domainSelect.append('<option value="' + mailru.userdomain + '">@' + mailru.userdomain + '</option>');
							}
							
							$domainSelect.val(mailru.userdomain).triggerHandler('change');
						}

						$.ajax({
							url: '//swa.mail.ru/domains',
							dataType: 'jsonp',
							jsonp: 'JSONP_call',
							success: function(data) {
								$domainSelect.empty();
								Array.forEach(data.Domain, function (domain, k){
									$domainSelect.append('<option value="' + domain + '"'+(k == 0 ? ' selected':'')+'>@' + domain + '</option>');
								});

								changeDomainSelectOption();
							}
						});

						if (isChangeAccount) {
							layer.show();
						} else {
							$login.val(mailru.username);

							changeDomainSelectOption();

							if (mailru.OldMultiAuthLayerLogic || mailru.newMultiAuthLogic) {
								$.ajax({
									url: '//swa.' + mailru.SingleDomainName + '/cgi-bin/counters?mac=1',
									dataType: 'jsonp',
									jsonp: 'JSONP_call',
									success: function(layer, response) {
										if (response.status == 'ok') {
											var data = response.data;
											if (data && data.list && data.list.length) {
												if (data.list.length > 1) {
													$newMultiEmailSelect.append('<option value="">' + Lang.get('layers.choise') + '</option>');
													$.each(data.list, function (k, v) {
														$newMultiEmailSelect.append('<option value="' + v + '">' + v + '</option>');
													});
													$newMultiEmailSelect.trigger('change');
													$newMultiEmailContainer.show();
													$registerNewEmail.hide();// MAIL-10252
												} else {
													$newOneEmailLink.text(data.list[0]);
													$newOneEmailContainer.show();
													$registerNewEmail.hide();// MAIL-10252
												}
											}
										}
									}.bind(this, layer)
								});
							}

							layer.disableHide().show();

							// MAIL-4097
							var timer = setInterval(function () {
								$.ajax({
									url: '//swa.' + mailru.SingleDomainName + '/cgi-bin/counters?mac=1',
									dataType: 'jsonp',
									jsonp: 'JSONP_call',
									success: function(response) {
										if (response.status == 'ok') {
											var data = response.data;
											if (data && data.email == mailru.useremail) {
												clearInterval(timer);
												location.href = currentUrl;
											}
										}
									}
								});
							}, 20000);
						}

						$(window).unbind('beforeunload');

						new Image().src = '//gstat.' + mailru.staticDomainName + '/gstat?show_noauth=1&logme=' + encodeURIComponent($.param(_log_params));
					});
				});
			},

			changeAccount: function (name, vars) {

				var _log_params = {
					  email: vars.email
					, username: mailru.username
					, userdomain: mailru.userdomain
					, useremail: mailru.useremail
				};

				if( mailru.phAuthFormEnabled ) {//MAIL-13474
					vars.formType = "restore";
					__PH.authForm.show(vars);

					// MAIL-4097
					var timer = setInterval(function () {
						$.ajax({
							url: '//swa.' + mailru.SingleDomainName + '/cgi-bin/counters?mac=1',
							dataType: 'jsonp',
							jsonp: 'JSONP_call',
							success: function(response) {
								if (response.status == 'ok') {
									var data = response.data;
									if (data && data.email == mailru.useremail) {
										clearInterval(timer);

										var host = location.protocol + '//' + location.host;
										var currentUrl = jsHistory.get().replace(new RegExp('^' + String.preg_quote(host)), '');
										if (currentUrl.indexOf('/') === 0) {
											currentUrl = host + currentUrl;
										} else {
											currentUrl = host + '/' + currentUrl;
										}
										location.href = currentUrl;
									}
								}
							}
						});
					}, 30000);

					$(window).unbind('beforeunload');

					new Image().src = '//gstat.' + mailru.staticDomainName + '/gstat?ph_change_account=1&logme=' + encodeURIComponent($.param(_log_params));

					return;
				}

				$R('{plugins}' + 'Layer', function () {
					Layer.get(name, function (layer) {
						var host = location.protocol + '//' + location.host;
						var currentUrl = jsHistory.get().replace(new RegExp('^' + String.preg_quote(host)), '');
						if (currentUrl.indexOf('/') === 0) {
							currentUrl = host + currentUrl;
						} else {
							currentUrl = host + '/' + currentUrl;
						}
						$('input[name="Login"]', layer.$div).val(mailru.useremail);
						$('input[name="page"]', layer.$div).val(currentUrl);
						$('.js-oldEmail', layer.$div).text(mailru.useremail);

						$('.js-newEmail', layer.$div).text(vars.email);

						$('form', layer.$div).unbind('submit');
						layer.disableHide().show();

						// MAIL-4481
						var timer = setInterval(function () {
							$.ajax({
								url: '//swa.' + mailru.SingleDomainName + '/cgi-bin/counters?mac=1',
								dataType: 'jsonp',
								jsonp: 'JSONP_call',
								success: function(response) {
									if (response.status == 'ok') {
										var data = response.data;
										if (data && data.email == mailru.useremail) {
											clearInterval(timer);
											location.href = currentUrl;
										}
									}
								}
							});
						}, 30000);

						$(window).unbind('beforeunload');

						new Image().src = '//gstat.' + mailru.staticDomainName + '/gstat?show_change_account=1&logme=' + encodeURIComponent($.param(_log_params));
					});
				});
			},

			passexpire: function (name, vars) {

				var currentTime = mailru.CurrentTimestamp,
					ts = mailru.HelperTimestamp,
					index = mailru.HelperIndex.passExpire,
					lastShowTime = ts[index],
					lastShowTimeLimit = 60 * 60 * 24,
					expTime = mailru.PasswordExpireDate,
					expTimeLimit = 60 * 60 * 24 * 7,
					force = vars[0];

				if (force || ((lastShowTime < currentTime - lastShowTimeLimit) && (expTime && expTime < currentTime + expTimeLimit))) {
					$R('{plugins}' + 'Layer', function () {
						Layer.get(name, function (layer) {
							var date = Date.parse(expTime * 1000), dateFormat = date.format('d n');
							$('.js-PasswordExpireDate', layer.$div).html(dateFormat);
							layer.one('callback', function(evt, status) {
								if (status) {
									location.href = mailru.SettingsOn ? '/settings/security?changepass' : '/cgi-bin/editpass';
								}
							})[0].show();
							this.saveHelper('passExpire');
						}.bind(this));
					}.bind(this));
				}
			},

			phonesync: function (name, vars) {

				var currentTime = mailru.CurrentTimestamp,
					ts = mailru.HelperTimestamp,
					index = mailru.HelperIndex.phoneSync,
					lastShowTime = ts[index],
					lastShowTimeLimit = 60 * 60 * 24 * 5,
					force = vars[0];

				if (force || (lastShowTime < currentTime - lastShowTimeLimit)) {

					$R(['{plugins}' + 'Layer','{mailru}' + 'mailru.PhoneManager'], function () {

						Layer.get(name, function (layer) {

							var phoneManager = new mailru.PhoneManager({
								user: {
									name: mailru.username,
									domain: mailru.userdomain
								}
							});

							phoneManager.bind({
								verifySuccess: function(evt, data) {
									Layer.get('phoneaddsuccess', function (layer) {
										$('.js-RemindPhone', layer.$div).html(data.readable_phone);
										layer.unbind('.counters')[0].show();
										new Image().src = '//rs.' + mailru.SingleDomainName + '/d544944.gif?' + Math.random();
									});
								}
							});

							$('.js-RemindPhone', layer.$div).text(vars[1]);

							layer.one('callback', function(evt, status) {
								if (status === true) {
									phoneManager.check('', vars[1]);
									new Image().src = '//rs.' + mailru.SingleDomainName + '/sb544946.gif?' + Math.random();
								} else if (status === false) {
									Layer.get('phoneDeleteSuccess', function (layer) {
										$('.js-phone', layer.$div).text(vars[1]);
										layer.bind('callback', function (evt, status) {
											if (status) {
												phoneManager.addPhone();
												new Image().src = '//rs.' + mailru.SingleDomainName + '/sb544947.gif?' + Math.random();
											}
										})[0].show();
										phoneManager.deleteRemindPhone(vars[1]);
									});
								}
							});

							layer.bind('callback.counters', function (evt, status) {
								if (status === null && evt.target.type != 'is-phoneaddsuccess') {
									layer.unbind('.counters');
									new Image().src = '//rs.' + mailru.SingleDomainName + '/sb544945.gif?' + Math.random();
								}
							});

							layer.show();
							new Image().src = '//rs.' + mailru.SingleDomainName + '/d544943.gif?' + Math.random();

							this.saveHelper('phoneSync');
						}.bind(this));
					}.bind(this));
				}
			},

			noAuthOffline: function (name, options) {
				$R('{plugins}' + 'Layer', function () {
					Layer.get(name, function (layer) {
						var $form = $('form', layer.$div).unbind('submit');

						var $error = $('.js-formError', $form);
						var $login = $('.js-login', $form);
						var $domain = $('.js-domain', $form);
						var $password = $('.js-password', $form);

						layer.one('show', function () {
							var email = options.active_email;
							if ($.type(email) == 'string') {
								var parts = email.split('@');
								if (parts.length == 2) {
									$login.val(parts[0]);
									var $domainSelectOption = $('option[value="' + parts[1] + '"]', $domain);
									if (!$domainSelectOption.length) {
										$domain.append('<option value="' + parts[1] + '">@' + parts[1] + '</option>');
									}
									$domain.val(parts[1]).triggerHandler('change');
								}
							}
							$error.hide();
							$password.val('');
						});

						layer.func = function(status) {
							if (status) {
								var login = $login.val();
								var domain = $domain.val();
								var password = $password.val();
								var email = login;

								if (!~email.indexOf('@')) {
									email += '@' + domain;
								}

								return options.success(layer, email, password);
							}
						};

						layer.disableHide().show(options.layer_options);
					});
				});
			},

			enableOffline: function (name, options) {
				$R('{plugins}' + 'Layer', function () {
					Layer.get(name, function (layer) {

						var $form = $('form', layer.$div).unbind('submit');

						var $error = $('.js-formError', $form);
						var $password = $('.js-password', $form);

						layer.one('show', function () {
							$password.val('');
							$error.hide();
						});

						layer.func = function(status) {
							if (status) {
								var password = $password.val();
								if ($.trim(password)) {
									options.success(password);
								} else {
									$error.text(Lang.get('password.wrong')).show();
									return false;
								}
							}
						};
						layer.show();
					});
				});
			},

			disableOffline: function (name, opts) {
				$R('{plugins}' + 'Layer', function () {
					Layer.get(name, function (layer) {
						layer.func = function(status) {
							if (status) {
								if (opts.success) {
									opts.success();
								}
							}
						};
						layer.show();
					});
				});
			},

			removeMrimDisabled: function (name) {
				$R('{plugins}' + 'Layer', function () {
					Layer.get(name, function (layer) {
						layer.show();
					});
				});
			},

			changeLang: function (name, opts) {
				$R('{plugins}' + 'Layer', function () {
					Layer.get(name, function (layer) {
						var $lang = $('.js-langSelect', layer.$div).val(opts.lang || mailru.LANG);
						$lang.trigger('change');
						layer.func = function(status) {
							if (status) {
								var lang = $lang.val();
								if (opts.modifyprofile) {
									$R('{mailru}' + 'mailru.Ajax', function () {
										mailru.Ajax({
											type: 'POST',
											url: '/cgi-bin/ajax_modifyprofile?ajax_call=1&func_name=set_lang',
											data: {lang: lang},
											complete: function () {
												location.href = jsHistory.get().replace(/(^|(\?)|&)?(setLang|lang)=[^&]*/g, '$2');
											}
										});
									});
								} else {
									var url = jsHistory.get().replace(/(^|(\?)|&)?(setLang|lang)=[^&]*/g, '$2');
									url += (url.indexOf('?') === -1 ? '?' : '&') + 'lang=' + lang;
									location.href = url;
								}
								$(window).triggerHandler('langChange.lang', [lang]);
								return false;
							}
						};
						if (opts.setLang) {
							layer.one('hide', function () {
								location.href = jsHistory.get().replace(/(^|(\?)|&)?(setLang|lang)=[^&]*/g, '$2');
							});
						}
						layer.show();
					});
				});
			},

			settings__folders__edit: function (name, opts) {
				$R('{plugins}' + 'Layer', function () {
					Layer.get(name, function (layer) {
						var newFolder = typeof opts.folderName !== 'string';
						opts.parentId = parseInt(opts.parentId, 10);
						opts.isSecret = opts.isSecret || false;

						layer.$div.find('input[name="Name"]').form__enable();
						if (opts.folderId == 0 || opts.folderId == 950 || opts.folderId == 500000 || opts.folderId == 500001 || opts.folderId == 500002) {
							layer.$div.find('input[name="Name"]').form__disable();
						}


						function togglePopCheckbox(condition) {
							if (condition) {
								// mail-8902 always check pop3 checkbox with protected
								popUserValue = popCheckbox.attr('checked');
								popWrapper.form__disable();
								popCheckbox.attr('checked', 'checked');
							}
							else {
								popWrapper.form__enable();
								popCheckbox.attr('checked', popUserValue);
							}
						}

						var protectedCheckbox = layer.$div.find('input[name="secret"]')
							,popWrapper = layer.$div.find('.js-pop')
							,popCheckbox = popWrapper.find('input[name="pop"]')
							,popUserValue;
						var canHidePassword = !opts.isSecret; // mail-8530

						// Clean form
						layer.$div.find('input[type="text"],input[type="password"]').val('');
						layer.$div.find('input[type="checkbox"]').removeAttr('checked');

						// Data
						if (!newFolder) {
							layer.$div.find('.js-folder').text(opts.folderName);
							layer.$div.find('input[name="Name"]').val(opts.folderName);
							popCheckbox.attr('checked', opts.isPop ? '' : 'checked');
							protectedCheckbox.attr('checked', opts.isSecret ? 'checked' : '');
						}
						layer.$div.find('input[name="new"]').val(newFolder ? '1' : '');
						layer.$div.find('input[name="folder"]').val(opts.folderId);

						var parentSelect = layer.$div.find('select[name="parentid"]'),
							foldersList = opts.foldersList;


						if ($.isArray(foldersList)) {
							foldersList =
								'<option>'+ Lang.get('options.folders.topfolder') +'</option>' +

							ajs.map(foldersList, function (folder) {
								return '<option value="' + (folder.id || folder.Id) + '">' +
									ajs.Html.escape(folder.name || folder.Name) +'</option>';
							}).join('');
						}

						parentSelect.html(foldersList);

						parentSelect.val(isNaN(opts.parentId) ? '' : opts.parentId);
						parentSelect.triggerHandler('change');
						parentSelect.closest('.form__row').toggle(!opts.isParent && opts.canBeSubfolder);

						if (opts.secretQuestion) {
							layer.$div.find('input[name="secret_question"]').val(opts.secretQuestion);
							layer.$div.find('input[name="secret_answer"]').val('**********');
						}

						if (newFolder) {
							layer.$div.find('.js-new').show();
							layer.$div.find('.js-edit').hide();
							layer.$div.find('input[type="submit"]').val(Lang.get('options.folders.add'));
						}
						else {
							layer.$div.find('.js-edit').show();
							layer.$div.find('.js-new').hide();
							layer.$div.find('input[type="submit"]').val(Lang.get('options.folders.edit'));
						}

						var passwordContainer = canHidePassword? layer.$div.find('.js-password-container') : layer.$div.find('.js-folder-password-question');
						protectedCheckbox.unbind('.settings__folders__edit').bind('change.settings__folders__edit', function () {
							var isPasswordProtected = protectedCheckbox.attr('checked');

							if (isPasswordProtected) {
								passwordContainer.form__enable();
								layer.$div.find('.js-folder-password-question').toggle(true);
								layer.$div.find('.js-folder-password-question').form__toggle(true);
								passwordContainer.slideDown('fast', function() {
									layer.sizeChanged();
								});

								togglePopCheckbox(true);
							}
							else {
								passwordContainer.slideUp('fast', function() {
									passwordContainer.form__disable();
								});
								if(opts.isPopEditable !== false) {
									togglePopCheckbox(false);
								}
							}
						});

						passwordContainer.toggle(opts.isSecret);
						passwordContainer.form__toggle(opts.isSecret);
						togglePopCheckbox(opts.isPopEditable !== false? opts.isSecret : true); //mail-13418

						layer.func = function (status) {
							if (!status) {
								if ($.isFunction(opts.cancel))
									opts.cancel(form);
								return true;
							}

							var requiredFields = [{
									name: 'Name',
									prompt: Lang.get('options.folders.error.required')
								}
							];
							var patternFields = [];

							if (protectedCheckbox.attr('checked')) {
								requiredFields.push(
									{
										name: 'secret_question',
										prompt: Lang.get('options.folders.error.required')
									},
									{
										name: 'secret_answer',
										prompt: Lang.get('options.folders.error.required')
									},
									{
										name: 'Password',
										prompt: Lang.get('options.folders.error.required')
									}
								);

								var password = layer.$div.find('input[name="secret_password_new"]').val();
								if (newFolder || canHidePassword) {
									requiredFields.push(
										{
											name: 'secret_password_new',
											prompt: Lang.get('options.folders.error.required')
										},
										{
											name: 'secret_password_retype',
											prompt: Lang.get('options.folders.error.required')
										}
									);
									patternFields.push({
										name: 'secret_password_new',
										minLen: 4,
										error: Lang.get('options.folders.error.shortpassword')
										},
										{
											name: 'secret_password_retype',
											test: function(password2) {
												return password === password2;
											},
											error: Lang.get('options.folders.error.passwordsdontmatch')
										});
								}
							}
							else if (!canHidePassword) {
								requiredFields.push(
									{
										name: 'Password',
										prompt: Lang.get('options.folders.error.required')
									}
								);
							}

							var form = layer.$div.find('form');
							if (CheckForm(form[0], requiredFields, patternFields))
							{
								// mail-8902 enable checkbox before submit
								popWrapper.find('[disabled]').removeAttr('disabled');

								var token = opts.tokens;

								if ($.isArray(token))
								{
									layer.$div.find('input[name="form_sign"]') .val(token[0]);
									layer.$div.find('input[name="form_token"]').val(token[1]);
								}

								$R('{mailru}' + 'mailru.Ajax', function() {
									mailru.Ajax({
										type: 'POST',
										url: opts.url || 'ajax_settings?ajax_call=1&func_name=edit',
										data: form.serialize(),
										complete: function(data) {
											var responseData = data.getData();
											if (responseData && responseData.Error) {
												togglePopCheckbox(protectedCheckbox.attr('checked'));
												layer.showError(responseData.Error);
											}
											else {
												if ($.isFunction(opts.success))
													opts.success(form, (responseData? responseData.newfolderid : null));
												layer.hide();
											}
										}
									});
								});
							}
							return false;
						};

						layer.show();
					});
				});
			},

			settings__folders__delete_imap: function() {
				$R('{plugins}' + 'Layer', function() {
					Layer.get('settings__folders__delete_imap', function(layer) {
						layer.func = function(status) {
							if (!status)
								return true;
						};
						layer.show();
					});
				});
			},

			settings__folders__delete: function (name, opts) {
				// MAIL-13459
				if (mailru.EnableIMAP) {
					var collector = mailru.isCollectorFolder(opts.folderId);

					if (collector) {
						return this.settings__folders__delete_imap();
					}
				}

				function deleteFolder() {
					$R('{mailru}' + 'mailru.Ajax', function() {
						mailru.Ajax({
							type: 'POST',
							url: 'ajax_settings?ajax_call=1&func_name=delete',
							data: {
								folder: opts.folderId
							},
							complete: function(data) {
								if ($.isFunction(opts.success))
									opts.success();
							}
						});
					});
				}

				$R('{plugins}' + 'Layer', function() {
					Layer.get(name, function(layer) {
						layer.func = function(status) {
							if (!status)
								return true;

							var F = mailru.Folders.getSafe(parseInt(opts.folderId, 10));

							if (!F.isSecureOpen()) {
								layer.hide();

								mailru.Layers.secure(opts.folderId, function(status) {
									if (status) deleteFolder();
								});

								return false;
							}
							else {
								deleteFolder();
							}
							return true;
						};

						layer.$div.find('.js-folder')
							.text(opts.folderName);

						layer.show();
					});
				});
			},

			settings__folders__clear: function (name, opts) {
				function clearFolder() {
					mailru.Ajax({
						url: '/cgi-bin/clearfolder',
						type: 'POST',
						data: {
							ajax_call: 1,
							func_name: 'clear_folder',
							folder: opts.folderId
						},
						isUser: true,
						complete: function () {
							if ($.isFunction(opts.success)) {
								opts.success();
							}
						}
					});
				}

				$R('{plugins}' + 'Layer', function () {
					Layer.get(name, function (layer) {
						var isTrashFolder = (opts.folderId == 500002);

						layer.$div
							.find('.js-default-message')
							.toggle(!isTrashFolder)
							.end()
							.find('.js-trash-message')
							.toggle(isTrashFolder);

						layer.$div.find('.js-folder').text(opts.folderName);

						layer.func = function (status) {
							if (!status) return true;

							var F = mailru.Folders.getSafe(opts.folderId);
							if (!F.isSecureOpen()) {
								layer.hide();
								mailru.Layers.secure(opts.folderId, function(status) {
									if (status) clearFolder();
								});
								return false;
							}
							else {
								clearFolder();
							}
							return true;
						};

						layer.show();
					});
				});
			},

			settings__filters__delete: function (name, opts) {
				$R('{plugins}' + 'Layer', function () {
					Layer.get(name, function (layer) {
						layer.$div.find('.js-filter').html(opts.filterText);

						// MAIL-9641
						var isFwd = (!!opts.isFwd && opts.isFwd == "1");
						layer.$div.find('.js-title-filter').toggle(!isFwd);
						layer.$div.find('.js-text-filter').toggle(!isFwd);
						layer.$div.find('.js-title-fwd').toggle(isFwd);
						layer.$div.find('.js-text-fwd').toggle(isFwd);

						layer.func = function (status) {
							if (!status)
								return true;

							mailru.Ajax({
								type: 'POST',
								url: 'ajax_settings?ajax_call=1&func_name=delete_filter',
								data:  {
									id: opts.filterId
								},
								complete: function (data) {
									var responseData = data.getData();
									if (responseData && responseData.Error){
										layer.showError(responseData.Error);
									}
									else {
										if ($.isFunction(opts.success))
											opts.success();
										layer.hide();
									}
								}
							});

							return true;
						};

						layer.show();
					});
				});
			},

			settings__filters__confirmEmail: function (name, opts) {
				$R('{plugins}' + 'Layer', function () {

					Layer.get(name, function (layer) {

						function refreshCaptcha($captchaFrame) {
							if($captchaFrame)
								$captchaFrame.attr('src', mailru.captchaURL1 + '?' + Math.random());
						}

						var form = layer.$div.find('form')[0],
							$codeInput = layer.$div.find('input[name="code"]'),
							$codeContainer = layer.$div.find('.js-confirmCode'),
							$passInput = layer.$div.find('input[name="password"]'),
							$captchaContainer = layer.$div.find('.js-captchaRow'),
							$captchaInput = layer.$div.find('input[name="security_image_answer"]'),
							$resendLink = layer.$div.find('.js-resend'),
							$resendLinkOk = $resendLink.parent().find('.js-resend-ok');

						var useCaptcha = opts.useCaptcha;

						layer.$div.find('.js-email').html(opts.email);

						$codeInput.val('');
						$passInput.val('');
						$captchaInput.val('');

						$resendLinkOk.hide();
						$resendLink.show();

						if(opts.code) {
							$codeInput.val(opts.code);
							$codeContainer.hide();
							layer.$div.find('.js-desc').hide();
							layer.$div.find('.js-confirmCode-desc').show();
							setTimeout(function(){
								// layer will set focus in first element, we have to reset it
								$passInput.first().focus();
							},100);
						}
						else {
							$codeContainer.show();
							layer.$div.find('.js-desc').show();
							layer.$div.find('.js-confirmCode-desc').hide();
						}

						$captchaContainer.display(useCaptcha);

						layer.$div.delegate('.js-refresh-captcha', 'click', function(evt) {
							refreshCaptcha(layer.$div.find('#captcha_frame'));
							evt.preventDefault();
						});

						layer.func = function (status) {
							if (!status) return true;

							var requiredFields = [
								{
									name: 'code',
									prompt: Lang.get('options.folders.error.required')
								},
								{
									name: 'password',
									prompt: Lang.get('options.folders.error.required')
								}
							];
							if(useCaptcha) {
								requiredFields.push(
									{
										name: 'security_image_answer',
										prompt: Lang.get('options.folders.error.required')
									}
								);
							}
							if (!CheckForm(form, requiredFields))
								return false;

							var data = {
								id: opts.emailId,
								code: $codeInput.val(),
								password: $passInput.val()
							};
							if(useCaptcha) {
								// submit captcha
								data.security_image_answer = $captchaInput.val();
							}

							mailru.Ajax({
								type: 'POST',
								url: 'ajax_settings?ajax_call=1&func_name=confirm_filter_email',
								data: data ,
								complete: function (data) {
									var responseData = data.getData();

									if (responseData && responseData.Error){
										layer.showError(responseData.Error);

										var patternFields = [
											{
												name: 'code',
												test: function(val) { return responseData.What !== 'code'; },
												error: Lang.get('options.filters.errors.bad_code')
											},
											{
												name: 'password',
												test: function(val) { return responseData.What !== 'pwd'; },
												error: Lang.get('options.filters.errors.bad_password')
											}
										];
										CheckForm(form, [], patternFields);
									}
									else {
										if ($.isFunction(opts.success))
											opts.success();

										layer.hide();
									}

									if (useCaptcha){
										$captchaInput.val('');
										refreshCaptcha( layer.$div.find('#captcha_frame') );
									}
								}
							});
							return false;
						};

						layer.$div.find('.js-resend').unbind('click').click(function(e) {
							var link = $(e.target);

							mailru.Ajax({
								type: 'POST',
								url: 'ajax_settings?ajax_call=1&func_name=confirm_filter_email_resend',
								data:  {
									id: opts.emailId
								},
								complete: function (data) {
									var responseData = data.getData();
									if (responseData && responseData.Error){
										layer.showError(responseData.Error);
									}
									else {
										link.hide();
										link.parent().find('.js-resend-ok').show();
									}
								}
							});

							return false;
						});

						layer.show();
					});
				});
			},

			settings__filters__forceFilter: function (name, opts) {
				$R('{plugins}' + 'Layer', function () {
					Layer.get(name, function (layer) {
						layer.$div.find('.js-filter').html(opts.filterText);
						layer.$div.find('.js-folders').html(opts.foldersList);
						mailru.ui.Options.checkedDropdown({
							container: layer.$div.find('.js-checked-dropdown'),
							allText: Lang.get('options.filters.all_folders')
						});

						layer.func = function (status) {
							if (!status) return true;

							mailru.Ajax({
								type: 'POST',
								url: 'ajax_settings?ajax_call=1&func_name=force_filter',
								data:  {
									id: opts.filterId,
									folders: layer.$div.find('input[name="filters"]').val()
								},
								complete: function (data) {
									var responseData = data.getData();
									if (responseData && responseData.Error){
										layer.showError(responseData.Error);
									}
								}
							});

							if ($.isFunction(opts.success))
								opts.success();
							layer.hide();

							return true;
						};

						layer.show();
					});
				});
			},

			secureRestore: function (name) {
				$R('{plugins}' + 'Layer', function () {
					Layer.get(name, function (layer) {
						var step = 1;
						layer.func = function (status) {
							if (!status) return true;

							if (step === 1) {
								layer.$div.find('.js-step1').show();
								layer.$div.find('.js-step2').hide();

								var ok = true;  // @todo check question
								if (ok) {
									layer.$div.find('input[type="submit"]').val(Lang.get('layers.change'));
									layer.$div.find('.js-step1').hide();
									layer.$div.find('.js-step2').show();
									layer.$div.find('input[name="password"]').focus();
									step = 2;
								}
								else {
									layer.$div.find('input[name="secret_answer"]')
										.addClass('form__field_error')
										.focus();
									layer.$div.find('.js-error-container').show();
								}
								return false;
							}
							else {
								// @todo Save

								var requiredFields = [
									{
										name: 'password',
										prompt: Lang.get('options.folders.error.required')
									},
									{
										name: 'password2',
										prompt: Lang.get('options.folders.error.required')
									},
									{
										name: 'secret_question',
										prompt: Lang.get('options.folders.error.required')
									},
									{
										name: 'secret_answer',
										prompt: Lang.get('options.folders.error.required')
									},
									{
										name: 'Password',
										prompt: Lang.get('options.folders.error.required')
									}
								];
								var patternFields = [
									{
										name: 'password',
										minLen: 4,
										error: Lang.get('options.folders.error.shortpassword')
									},
									{
										name: 'password2',
										test: function(password2) {
											var password = layer.$div.find('input[type="password"]').val();
											return password === password2;
										},
										error: Lang.get('options.folders.error.passwordsdontmatch')
									}
								];
								return CheckForm(layer.$div.find('form')[0], requiredFields, patternFields);
							}
						};

						layer.show();
					});
				});
			},

			settings__security__password: function (name, opts) {
				$R('{plugins}' + 'Layer', function () {
					Layer.get(name, function (layer) {

						function refreshCaptcha($captchaFrame) {
							if($captchaFrame)
								$captchaFrame.attr('src', mailru.captchaURL1 + '?' + Math.random());
						}

						var $form = layer.$div.find('form'),
							formError = layer.$div.find('.js-formError'),
							pass = layer.$div.find('input[name="Password"]'),
							row = pass.closest('.form__row'),
							input = layer.$div.find('input[name="security_image_answer"]');

						// Clean form
						pass.val('');
						if(input)
							input.val('');
						layer.$div.find('input[name="oldPswd"]').val('');
						layer.$div.find('input[name="Password_Verify"]').val('');


						layer.$div.find('.js-mrimDisabled').display(opts.mrimDisabled && opts.mrimDisabled != 0);

						pass.bind('blur', function() {
							var bad = false;
							var value = pass.val();
							if (value == '**********') return;
							if (value == '') return;
							if (value.length < 6) bad = true;
							if (!bad){
								var chars = new Array();
								var i;
								for (i = 0; i < value.length; i++){
									var c = value.charAt(i);
									var j;
									for (j = 0; j < chars.length; j++){
										if (chars[j] == c) break;
									}
									if (j >= chars.length) chars[chars.length] = c;
								}
								if (chars.length < 3) bad = true;
							}

							if (bad){
								if (row.length) {
									if (pass.hasClass('form__field')) {
										pass.addClass('form__field_error');
									}

									var message = row.find('.form__message');
									if (message.length) {
										if (!message.hasClass('form__message_error')) {
											message.data('original-text', message.text());
										}
										message.html(Lang.get('settings.security.error.weakPassword'));
										//message.addClass('form__message_error');
										message.css('padding-bottom','4px');
									}
								}
							}
							else {
								if (row.length) {
									row.find('.form__field').removeClass('form__field_error');
									row.find('.form__select').removeClass('form__select_error');

									var message = row.find('.form__message');
									if (message.length) {
										var text = message.data('original-text');
										if (text !== undefined) {
											message.html(text);
										}
										//message.removeClass('form__message_error');
										message.css('padding-bottom','');
									}
								}
							}
						});

						layer.$div.find('.js-refresh-captcha').bind('click', function() {
							refreshCaptcha(layer.$div.find('#captcha_frame'));
							return false;
						});

						layer.func = function (status) {
							if (!status) return true;

							var requiredFields = [{
								name: 'oldPswd',
								prompt: Lang.get('settings.security.error.required')
							},

							{
								name: 'Password',
								prompt: Lang.get('settings.security.error.required')
							},

							{
								name: 'Password_Verify',
								prompt: Lang.get('settings.security.error.required')
							}
							];

							if (input) {
								requiredFields.push({
									name: 'security_image_answer',
									prompt: Lang.get('options.folders.error.required')
								});
							}

							layer.hideError();

							if (CheckForm($form[0], requiredFields, [])) {
								if (CheckPassword($form[0], true)) {

									if ( $.isFunction(opts.submit) ) {
										if ( !opts.submit(layer) )
											return;
									}

									var data = $form.toObject();

									if (mailru.JSTrapChangePassword) {
										if (mailru.tokens['ajax_settings']) {
											data['form_sign'] = mailru.tokens['ajax_settings']['form_sign'];
											data['form_token'] = mailru.tokens['ajax_settings']['form_token'];
										}

										mailru.JSTrapChangePassword(data);
									}

									//<!--IF 0 -->"var onRadarDone = $R.bind(null, " instead of "$R(" - https://jira.mail.ru/browse/MAIL-8561<!-- /IF -->

									var onRadarDone = $R.bind(null, '{mailru}' + 'mailru.Ajax', function () {
										mailru.Ajax({
											type: 'POST',
											url: 'ajax_settings?ajax_call=1&func_name=change_password',
											data:  data,
											saveTokens: !!mailru.JSTrapChangePassword,
											complete: function (data) {
												if (data.isOK()) {
													var responseData = data.getData();
													if (responseData && responseData.Error ) {
														if ( $.isFunction(opts.error) )
															opts.error(layer);
														layer.showError(responseData.Error);
													}
													else if (responseData && responseData.Error === null) {
														// has error but no error text
														if ( $.isFunction(opts.error) )
															opts.error(layer);
														layer.showError(Lang.get('settings.security.error.ajaxDefaultError'));
													}
													else if (responseData && responseData.Redirect) {
														location.href = responseData.Redirect + '?result=password';
													}
													else {
														location.href = location.pathname
															+ (location.search.match(/result=\w*\b/)
															? location.search.replace(/result=\w*\b/,'result=password')
															: ((location.search.substring(0,1) == "?") ? "&" : "?") + 'result=password' )
															+ location.hash;
														layer.hide();
													}
												}
												else {
													if ( $.isFunction(opts.error) )
														opts.error(layer);
													layer.showError(Lang.get('settings.security.error.ajaxDefaultError'));
												}
												if (input){
													input.val('');
													refreshCaptcha( layer.$div.find('#captcha_frame') );
												}
											}
										});
									});

									//<!--IF 0 -->https://jira.mail.ru/browse/MAIL-8561<!-- /IF-->
									formSubmitRadarLog("submit", "change_pass=1", onRadarDone);
								}
							}

							return false;
						};

						layer.show();
					});
				});
			},

			settings__security__additionalEmail: function (name, opts) {
				$R('{plugins}' + 'Layer', function () {
					Layer.get(name, function (layer) {

						function refreshCaptcha($captchaFrame) {
							if($captchaFrame)
								$captchaFrame.attr('src',  mailru.captchaURL1 + '?' + Math.random());
						}

						var $form = layer.$div.find('form'),
							email =  layer.$div.find('input[name="Email"]'),
							input = layer.$div.find('input[name="security_image_answer"]');

						email.val(opts.email);
						if(input)
							input.val('');
						layer.$div.find('input[name="oldPswd"]').val('');

						layer.$div.find('.js-refresh-captcha').bind('click', function() {
							refreshCaptcha(layer.$div.find('#captcha_frame'));
							return false;
						});

						layer.func = function (status) {
							if (!status) return true;

							var requiredFields = [
									{
										name: 'pswd',
										prompt: Lang.get('settings.security.error.required')
									}
								],
								patternFields = [
									{
										name: 'email',
										maxLen: 64,
										pattern: "^([-a-zA-Z0-9._+]+@[-_a-zA-Z0-9]+\.[-_a-zA-Z0-9.]+)?$",
										error: Lang.get('settings.security.error.invalidEmail')
									},

									{
										name: 'pswd',
										maxLen: 50,
										error: Lang.get('settings.security.error.pswd')
									}
								];

							if (input) {
								requiredFields.push({
									name: 'security_image_answer',
									prompt: Lang.get('options.folders.error.required')
								});
							}


							if (CheckForm($form[0], requiredFields, patternFields))
							{
								$R('{mailru}' + 'mailru.Ajax', function () {
									mailru.Ajax({
										type: 'POST',
										url: 'ajax_settings?ajax_call=1&func_name=change_additional_email',
										data:  $form.serialize(),
										complete: function (data) {
											if (data.isOK()) {
												var responseData = data.getData();
												if (responseData && responseData.Error){
													layer.showError(responseData.Error);
												}
												else if (responseData && responseData.Error === null) {
													// has error but no error text
													layer.showError(Lang.get('settings.security.error.ajaxDefaultError'));
												}
												else {
													opts.email = email.val();
													opts.success(email.val());
													if (input){
														input.val('');
														refreshCaptcha( layer.$div.find('#captcha_frame') );
													}
													layer.hide();
												}
											}
											else {
												layer.showError(Lang.get('settings.security.error.ajaxDefaultError'));
											}

											if (input){
												input.val('');
												refreshCaptcha( layer.$div.find('#captcha_frame') );
											}
										}
									});
								});
							}

							return false;
						};

						layer.show();
					});
				});
			},

			settings__security__addPasswordQuestion: function (name, opts) {
				$R('{plugins}' + 'Layer', function () {
					Layer.get(name, function (layer) {

						function refreshCaptcha($captchaFrame) {
							if($captchaFrame)
								$captchaFrame.attr('src',  mailru.captchaURL1 + '?' + Math.random());
						}

						function updateOpts() {
							opts.question = select.html();
							opts.questionVal = select.val();
							opts.customQuestion = customQuestion.val();
							opts.answer = answer.val();
						}

						function updateForm() {
							select.html(opts.question).change();
							if (opts.questionVal)
								select.val(opts.questionVal);
							select.triggerHandler('change');
							customQuestion.val(opts.customQuestion);
							answer.val(opts.answer);
						}

						function getCurrentQuestion() {
							if (select.val() != 'Custom' && select.val() != ''){
								// preset question
								return select.val();
							} else {
								// custom question
								return customQuestion.val();
							}
						}

						function checkQuestions() {
							layer.hideError();
							if ( answer.val() && answer.val() != '' && getCurrentQuestion() == '' ) {
								// we have an answer, but no question to answer to.
								layer.showError(Lang.get('settings.security.error.noQuestion'));
								return false;
							}
							return true;
						}

						var $form = layer.$div.find('form'),
							select = layer.$div.find('#passwordQuestionSelect'),
							customQuestion = layer.$div.find('#passwordCustomQuestion'),
							answer = layer.$div.find('#passwordAnswer'),
							input = layer.$div.find('input[name="security_image_answer"]');

						layer.$div.find('input[name="oldPswd"]').val('');
						if(input)
							input.val('');
						layer.$div.find('.form__select').form__select();
						updateForm();

						select.change(function() {
							if (select.val() != 'Custom') {
								customQuestion.val('');
								if (select.val() == '') {
									// clear answer
									answer.val('');
								}
							}
						});

						customQuestion.bind('input keyup', function() {
							if (customQuestion.val() != '') {
								select.val('Custom');
								select.triggerHandler('change');
							}
						});

						layer.$div.find('.js-refresh-captcha').bind('click', function() {
							refreshCaptcha(layer.$div.find('#captcha_frame'));
							return false;
						});

						layer.func = function (status) {
							if (!status) return true;

							var requiredFields = [
									{
										name: 'pswd',
										prompt: Lang.get('settings.security.error.required')
									}
								],
								patternFields = [
									{
										name: 'Password_CustomQuestion',
										maxLen: 64,
										error: Lang.get('settings.security.error.customQuestion')
									},

									{
										name: 'Password_Answer',
										maxLen: 64,
										error: Lang.get('settings.security.error.passwordAnswer')
									}
								];

							if (input) {
								requiredFields.push({
									name: 'security_image_answer',
									prompt: Lang.get('options.folders.error.required')
								});
							}

							if (CheckForm($form[0], requiredFields, patternFields) && checkQuestions()) {

								if(getCurrentQuestion() == customQuestion.val()) {
									select.val('Custom');
								}

								var data = $form.toObject();

								if (mailru.JSTrapChangePasswordQuestion) {

									if (mailru.tokens['ajax_settings']) {
										data['form_sign'] = mailru.tokens['ajax_settings']['form_sign'];
										data['form_token'] = mailru.tokens['ajax_settings']['form_token'];
									}

									mailru.JSTrapChangePasswordQuestion(data);
								}

								//<!--IF 0 -->"var onRadarDone = $R.bind(null, " instead of "$R(" - https://jira.mail.ru/browse/MAIL-8561<!-- /IF-->
								var onRadarDone = $R.bind(null, '{mailru}' + 'mailru.Ajax', function () {
									mailru.Ajax({
										type: 'POST',
										url: 'ajax_settings?ajax_call=1&func_name=change_password_question',
										data: data,
										saveTokens: !!mailru.JSTrapChangePasswordQuestion,
										complete: function (data) {
											if (data.isOK()) {
												var responseData = data.getData();
												if (responseData && responseData.Error){
													layer.showError(responseData.Error);
												}
												else if (responseData && responseData.Error === null) {
													// has error but no error text
													layer.showError(Lang.get('settings.security.error.ajaxDefaultError'));
												}
												else {
													updateOpts();
													opts.success(getCurrentQuestion());
													if (input){
														input.val('');
														refreshCaptcha( layer.$div.find('#captcha_frame') );
													}
													layer.hide();
												}
											}
											else {
												layer.showError(Lang.get('settings.security.error.ajaxDefaultError'));
											}

											if (input){
												input.val('');
												refreshCaptcha( layer.$div.find('#captcha_frame') );
											}
										}
									});
								});

								//<!--IF 0-->https://jira.mail.ru/browse/MAIL-8561<!-- /IF-->
								formSubmitRadarLog("submit", "change_secret=1", onRadarDone);
							}

							return false;
						};

						layer.show();
					});
				});
			},

			settings__security__acca: function (name, opts) {
				$R('{plugins}' + 'Layer', function () {
					Layer.get(name, function (layer) {

						function refreshCaptcha($captchaFrame) {
							if($captchaFrame)
								$captchaFrame.attr('src',  mailru.captchaURL1 + '?' + Math.random());
						}

						var $form = layer.$div.find('form'),
							password =  layer.$div.find('input[name="pswd"]'),
							input = layer.$div.find('input[name="security_image_answer"]');

						if(input)
							input.val('');
						password.val('');

						// show text
						layer.$div.find('.js-is-'+(opts.isOn? 'on' : 'off')).show();
						layer.$div.find('.js-is-'+(opts.isOn? 'off' : 'on')).hide();
						if (opts.error) {
							layer.$div.find('.js-error').html(opts.error).show();
						} else {
							layer.$div.find('.js-error').hide();
						}

						layer.$div.find('.js-refresh-captcha').bind('click', function() {
							refreshCaptcha(layer.$div.find('#captcha_frame'));
							return false;
						});

						layer.func = function (status) {
							if (!status) return true;

							var requiredFields = [
									{
										name: 'pswd',
										prompt: Lang.get('settings.security.error.required')
									}
								],
								patternFields = [
									{
										name: 'pswd',
										maxLen: 50,
										error: Lang.get('settings.security.error.pswd')
									}
								];

							if (input) {
								requiredFields.push({
									name: 'security_image_answer',
									prompt: Lang.get('options.folders.error.required')
								});
							}


							if (CheckForm($form[0], requiredFields, patternFields))
							{
								opts.success(layer);
							}

							return false;
						};

						layer.show();
					});
				});
			},

			confirmSpam: function(name, opts) {
				$R('{plugins}' + 'Layer', function () {
					Layer.get(name, function (layer) {
						var $users = layer.$div.find('.js-users'),
							$moreusers = layer.$div.find('.js-moreusers');
						var usersVisible = 10;

						if(opts.users && opts.users.length > 0) {
							if(opts.users.length == 1) {
								$users.html('&nbsp;'+opts.users.join(', '));
							}
							else if (opts.users.length <= usersVisible) {
								$users.html(':<br>'+opts.users.join('<br>'));
							}
							else { // too many users, show only first 10
								var numHidden = opts.users.length - usersVisible;
								$users.html(':<br>'+opts.users.slice(0,usersVisible).join('<br>'));
								$('.js-num', $moreusers).text(numHidden);
								$('.js-senders', $moreusers).text( ajs.plural(numHidden, Lang.get('checkspam.senders.plural'), '') );
								$moreusers.show();
							}
						}

						layer.func = function (status) {
							if ($.isFunction(opts.success))
								opts.success(status);
							layer.hide();

							return true;
						};

						layer.show();
					});
				});
			},

			listUnsubscribe: function(name, opts) {
				$R('{plugins}' + 'Layer', function () {
					Layer.get(name, function (layer) {
						var $from = layer.$div.find('.js-from');

						$from.text(opts.from || "");

						layer.func = function (status) {
							if ($.isFunction(opts.success))
								opts.success(status);
							layer.hide();

							return true;
						};

						layer.show();
					});
				});
			},

			collector_edit: function(name, options) {
				$R('{plugins}' + 'Layer', function() {
					Layer.get(name, function(layer) {
						var lang = Lang.get('Collector').edit;

						var toggle = {
							notify: function(name) {
								return info[!name ? 'hide': 'show']()
									.find('.js-colector__error-info').text(lang.error[name]);
							},

							state: function() {
								this.toggleClass('form__button_disabled');

								layer.$div.find('.popup-settings__controls_loading')
									.toggleClass('dn');
							},

							view: function(text) {
								layer.$div.find('.js-collector__form_edit__internal-error')
									.removeClass('dn')
									.find('.js-collector__form_edit__internal-info').html(text);

								layer.$div.find('.js-collector__form_edit__auth-error').addClass('dn');
							},

							icon: function(state) {
								layer.$div.find('.icon')
									.toggleClass('icon_tip-ok', state == 'ok');
							},

							title: function(title) {
								layer.$div.find('.js-colector__error-title').text(title);
							},

							email: function(email) {
								layer.$div.find('.js-collector__change-email').val(email);
							}
						};

						// Show layer
						layer.show();
						Counter.d(1672592);

						var collector = mailru.getCollectorInfoById(options.id);

						// Set layer title
						toggle.title(lang.title[collector.error]);
						toggle.email(collector.email);
						toggle.icon('error');

						if (collector.error == 'internal') {
							toggle.view(lang.info.fail);

							layer.$div.find('.js-collector__popup-status')
								.addClass('popup-settings__collector_box_error');
						}

						layer.$div.find('form').unbind('submit');

						var password = layer.$div.find('.js-collector__change-password');
						var info     = layer.$div.find('.form__top-message_error');

						// Close layer
						layer.$div.delegate('.form__button_reset, .js-collector__edit-close',
							'click', function(event) {
								layer.hide();
								event.preventDefault();
							}
						);

						// Submit
						layer.$div.delegate('.js-collector__edit-submit', 'click', function(event)
						{
							event.preventDefault();

							var $this = $(this);

							if (!password.val().trim()) {
								return toggle.notify('password');
							}

							if ($this.hasClass('form__button_disabled'))
								return 0;

							toggle.state.call($this);

							mailru.API.post('collectors/edit', {
								collect : [
									{
										id:       collector.id,
										email:    collector.email,
										password: password.val(),
										type:     collector.type
									}
								]
							},
							function(response) {
								toggle.state.call($this);

								if (response.isOk())
								{
									// Update collectors and stat
									mailru.Updater.cts = {};
									mailru.Updater.reload(true, {
										complete: function() {
											if (options.complete)
												options.complete(layer, response);

											Counter.sb(1672592);
										}
									});

									if (options.notify) {
										toggle.icon('ok');
										toggle.view(lang.info.complete);
										toggle.title(lang.title.complete);
									}
									else {
										layer.hide();
									}
								}
								else {
									var data = response.getData();
									var error = 'system';

									if (!data)
										return toggle.notify(error);

									Object.forEach(data, function(value, key) {
										if (value.error == 'invalid') {
											error = key;
											return false;
										}
									});

									try {
										switch(error.split('.')[1]) {
											case 'email' :
											case 'password' :
												error = 'auth';
												break;
											default:
												error = 'system';
											break;
										}
									}
									catch (error) {};

									return toggle.notify(error);
								}
							});

							toggle.notify();
						});
					},
					{
						isRefresh: 1,
						params: {
							collectorPopup: 1,
							change: options.change
						}
					});
				});
			},

			// MAIL-14378, MAIL-16044
			external_account_salute: function (name) {
				var counter = {
					'yandex.ru':   1702720,
					'gmail.com':   1703299,
					'inbox.ru':    1703327,
					'list.ru':     1703328,
					'bk.ru':       1703370,
					'rambler.ru':  1703374,
					'qip.ru':      1703376,
					'yahoo.com':   1703380,
					'hotmail.com': 1703381
				}[mailru.userdomain];

				$R('{plugins}' + 'Layer', function () {
					Layer.get(name, function(layer) {
						layer.$div.delegate('.js-external_account__layer_submit', 'click', function() {
							$.post('/cgi-bin/ajax_helper', {
								'x-email': mailru.useremail,
								func_name: 'user_license_accepted'
							},
							function() {
								layer.enableHide().hide({
									complete: function() {
										if (counter) {
											Counter.sb(counter);
										}
										Counter.sb(1703315);
									}
								});
							});
						});

						layer.disableHide().show({
							complete: function() {
								if (counter) {
									Counter.d(counter);
								}
								Counter.d(1703315);
							}
						});
					},
					{
						type: 'external'
					});
				});
			}
		});

	})(jQuery);

	jsLoader.loaded('{plugins}LayerManager', 1);

// data/ru/images/js/ru/jsCore/plugins/LayerManager.js end

// data/ru/images/js/ru/utils/mailru.Utils.js start


// GLOBALIZATION
	if( !mailru.Utils ) mailru.Utils = {};

	(function (win, Utils){
		var RE_EMAIL = /([\w.а-яё\-+]+)@([\w.а-яё\-]+)\.[\wа-яё]+/
			, RE_EMAILS = /[\w.а-яё\-+]+@[\w.а-яё\-]+\.[\wа-яё]+/gi
			, RE_NAME_AND_EMAIL_IN_LTGT = new RegExp("[\"']?(.*?)[\"']?\\s+(?:<|&lt;)(" + RE_EMAIL.source + ")(?:>|&gt;)")
			, _rebackgroundimage = /url\(["']?(.*?)["']?\)/
			, _re_email_matcher = /(.*?)\s<(.*?)>$/
			, _abjsTS = 0
		;

		Utils.abjsCountSuccess = Utils.abjsCountError = Utils.abjsTime = 0;

		Utils.extractEmails = function (str){
			return	(str+'').match(RE_EMAILS) || [];
		};

		/**
		 * Get address book for suggest
		 *
		 * @public
		 * @params	{Function}	[fn]  fn(error, data)
		 */
		Utils.getAddressBook = (function (){
			var _retryCount = 1, _xhr;

			return function (fn){
				fn = fn || ajs.F;

				if( !_abjsTS ) _abjsTS = Date.now();

				if( mailru.abjsData ){
					fn(null, mailru.abjsData);
					$(win).triggerHandler('success.abjs', [mailru.abjsData]);
				}
				else if( !_xhr ){
					// WARNING: Don't use mailru.Ajax
					_xhr = $.ajax({
						url: '/cgi-bin/abjs',
						type: 'GET',
						data: { nojs: 1, id: mailru.AbjsHash, r: Math.random(), show_version: true},
						dataType: 'text',
						timeout: 10000,
						complete: function(jXHR) {
							var response, data, newhash, retry, version = 0;

							try {
								response = $.parseJSON(jXHR.responseText);
							} catch (e) {}

							if( response ){
								if( response.version ) {
									data = response.contacts;
									mailru.abjsVersion = response.version;

								} else if( response.AbjsHash ){
									newhash = response.AbjsHash;

								} else if( Array.isArray(response) ){
									data = response;
								}
							}

							_xhr = null;
							Utils.abjsTime = Date.now() - _abjsTS;

							if( data ){
								Utils.abjsCountSuccess++;
								fn(false, data);
								$(win).triggerHandler('success.abjs', [mailru.abjsData = data]);
								ajs.notify('abjs:loaded');

							} else if( newhash ){
								Utils.abjsCountSuccess++;
								mailru.AbjsHash = newhash;

							} else {
								Utils.abjsCountError++;
							}

							if( !data ){
								if( retry = _retryCount-- > 0 ){
									Utils.getAddressBook(fn);
								}
								else {
									fn(true);
									$(win).triggerHandler('error.abjs');
								}
							}

							if( !retry ){
								_retryCount = 1;
							}

							ajs.notify('abjs:complete');
						}
					});
				}
			}
		})();

		/**
		 * Check if email is in addressbook
		 *
		 * @public
		 * @param {String} email
		 */
		Utils.isInAddressBook = function(email, callback) {
			$(window).one('success.abjs error.abjs', function (evt, data) {
				if (!Array.isArray(data)) data = [];

				if (Utils.inArray(email, data)) {
					callback(true);
				} else {
					callback(false);
				}
			});
			Utils.getAddressBook();
		};

		/**
		 * Check if some element of data array contains given string
		 *
		 * @public
		 * @param {String} str
		 * @param {Array} data
		 */
		Utils.inArray = function(str, data) {
			for (var i=data.length; i--; ) {
				if (data[i].indexOf(str) !== -1)
					return true;
			}
			return false;
		};


		/**
		 * Add email list in address book suggest
		 *
		 * @public
		 * @param {String|Array} list
		 */
		Utils.addToAddressBook = function (list){
			Utils.getAddressBook(function (err, data){
				if( !err ){
					if( typeof list == 'string' )
						//noinspection JSUnresolvedFunction
						list = list.split(',');

					var updated = false;

					//noinspection JSUnresolvedFunction
					list.reverse();

					Array.forEach(list, function (nameAndEmail) {
						var email, name;

						if( email = nameAndEmail.match(RE_NAME_AND_EMAIL_IN_LTGT) ) {
							name = email[1];
							email = email[2];
						}
						else if( email = nameAndEmail.match(RE_EMAIL) ) {
							name = email = email[0];
						}

						if( email ){
							var i, f = 1;

							email = email.toLowerCase();
							for( i = data.length; i--; ) if( ~data[i].toLowerCase().indexOf(email) ){
								f = 0;
								break;
							}

							if( f ){
								updated = true;
								data.unshift(name +' <'+ email +'>');
							}
						}
					});

					if( updated ){
						$(window).trigger('abjs:updated');
					}
				}
			});
		};


		Utils.openAddressbookPopup = function(addto) {
			var t = this, posX = (screen.width - 700) / 2, posY = (screen.height - 500) / 2;

			var url = mailru.abjsVersion < 2 ? '/cgi-bin/addressbook?template=quicklist.tmpl&from_sentmsg=1&addto=' + addto : '/addressbook/quicklist/' + addto;

			var w = window.open(url, 'sw_window', 'width=700,height=500,resizable=yes,scrollbars=yes,top=' + posY + ',left=' + posX);
			w.focus();
		};

		// https://jira.mail.ru/browse/MAIL-6937
		Utils.suggestLog = function (type, opts){
			if( !$.isArray(opts.data) ){
				opts.data = ajs.map(opts.data, function(X){
					/** @namespace X.word */
					return X.word;
				});
			}

			mailru.gstat({
				  time:		opts.start_ts ? ajs.now() - opts.start_ts : 0
				, sel_ts:	opts.sel_ts ? ajs.now() - opts.sel_ts : 0
				, email:	mailru.useremail
				, value:	opts.val
				, selected:	opts.sel
				, items:	Math.random() <= .01 ? opts.data.join('\t') : ''
				, count:	opts.data.length
				, index:	opts.idx > -1 ? opts.idx+1 : -1

				, abjs_time:	Utils.abjsTime
				, abjs_error:	mailru.Utils.abjsCountError
				, abjs_success:	mailru.Utils.abjsCountSuccess
				, abjs_length:	opts.abjs
				, press_enter:	+!!opts.enter

				, suggest: type
			}, true);
		};


		/**
		 * Ajax error handler
		 *
		 * @param {Event} event jQuery.Event
		 * @param {XMLHttpRequest} jqXHR
		 * @param {Object} options
		 * @param {Error} thrownError
		 */
		Utils.catchAjaxError = function (event, jqXHR, options, thrownError){
			if (thrownError && (options && options.url && options.dataType == 'json') && (jqXHR && jqXHR.status == 200 && jqXHR.readyState == 4)) {
				if (/(^|\/)abjs(\?|$)/.test(options.url)) {
					var txt = 'ajaxConvert: ', hdrs = '';
					txt += options.url + (options.data ? (/\?/.test(options.url) ? '&' : '?') + options.data : '');

					if (('mailru' in window)) {
						txt += ' ~ ' + (mailru.useremail || 'NotAuth');
					}

					txt += ' ~ ' + navigator.userAgent;

					if (jqXHR.getAllResponseHeaders) {
						hdrs = '<h>' + jqXHR.getAllResponseHeaders() + '</h>';
					}

					if (window.mailru && mailru.saveError) {
						mailru.saveError('json2', txt);
					}

					txt = '<q>' + txt + '</q>' + hdrs + '<r>' + jqXHR.responseText + '</r>';

					$.ajax({
						url: '/cgi-bin/logthis',
						type: 'POST',
						data: {'jQ.err': txt.replace(/[\r\n]/g, '\\n')},
						dataType: 'text'
					});
				}
				else if (options.sentmsg) {
					var log = {
						log: 'sentmsgparseerror5',
						readyState: jqXHR.readyState,
						status: jqXHR.status,
						statusText: jqXHR.statusText,
						error: thrownError.toString(),
						email: window.mailru && mailru.useremail ? mailru.useremail : '',
						responseText: jqXHR.responseText
					};
					(new Image).src = '//gstat.' + mailru.staticDomainName + '/gstat?ua=1&logme=' + encodeURIComponent($.param(log));
				}
			}
		};

		/**
		 *
		 * @param {boolean} supportMultiCharSearch [bounded] "sh", "shh", etc support
		 * @param {string} source input string
		 * @param {boolean} returnMultiply return {string} if returnMultiply == false and {Array.<Array.<string>|string>} if returnMultiply == true
		 *  For example: input = "unit" | output = returnMultiply ? [ "юнит", "унит" ] : "унит"
		 * @this {Object.<string, (string|Array.<string>)>} characters map - An object in which the keys are strings and the values are string or string array.
		 *
		 * @return {(string|Array.<Array.<string>|string>)}
		 * @private
		 */
		var __convertText = function(supportMultiCharSearch, source, returnMultiply) {
			var /** @type {Object.<string, (string|Array.<string>)>}*/table = this;
			var arrayResult = returnMultiply ? [] : null
				, stringResult = ""
			;

			var letters = String(source).toLowerCase().split('');
			var letter, nextLetter;

			for( var i = 0 , l = letters.length ; i < l ; i++ ) {
				letter = letters[i];

				if( supportMultiCharSearch ) {
					// "sh", "shh", etc support
					while( (nextLetter = letters[i + 1])
						&& table[nextLetter = letter + nextLetter] !== void 0
					) {
						letter = nextLetter;
						i++;
					}
					if( table[letter] === null ) {
						i -= (letter.length - 1);
						letter = letter.charAt(0);
					}
				}

				if( table[letter] !== void 0 ) {//letter found in characters map
					letter = table[letter];

					if( typeof letter !== "string" ) {//letter is Array
						if( !returnMultiply ) {
							stringResult += letter[0];
						}
						else {
							if( stringResult ) {
								arrayResult.push(stringResult);
							}
							stringResult = "";
							arrayResult.push(letter);
						}
					}
					else {//letter is string
						stringResult += letter;
					}
				}
				else {//letter is original letter
					stringResult += letter;
				}
			}

			if( returnMultiply ) {//last part of result
				if( stringResult ) {
					arrayResult.push(stringResult);
				}
			}

			return returnMultiply ? arrayResult : stringResult;
		};

		var _char, _value;

		/** @type {Object.<string, string>} An object in which the keys are strings and the values are string too */
		var _punto = {
			"`": "\u0451",//"ё"
			"q": "\u0439",//"й"
			"w": "\u0446",//"ц"
			"e": "\u0443",//"у"
			"r": "\u043a",//"к"
			"t": "\u0435",//"е"
			"y": "\u043d",//"н"
			"u": "\u0433",//"г"
			"i": "\u0448",//"ъ"
			"o": "\u0449",//"щ"
			"p": "\u0437",//"з"
			"[": "\u0445",//"х"
			"]": "\u044a",//"ъ"
			"a": "\u0444",//"ф"
			"s": "\u044b",//"ы"
			"d": "\u0432",//"в"
			"f": "\u0430",//"а"
			"g": "\u043f",//"п"
			"h": "\u0440",//"р"
			"j": "\u043e",//"о"
			"k": "\u043b",//"л"
			"l": "\u0434",//"д"
			";": "\u0436",//"ж"
			"'": "\u044d",//"э"
			"z": "\u044f",//"я"
			"x": "\u0447",//"ч"
			"c": "\u0441",//"с"
			"v": "\u043c",//"м"
			"b": "\u0438",//"и"
			"n": "\u0442",//"т"
			"m": "\u044c",//"ь"
			",": "\u0431",//"б"
			".": "\u044e"//'ю'
		};
		for( _char in _punto ) if(_punto.hasOwnProperty(_char)) {
			_value = _punto[_char];
			if( !(_value in _punto) ) {
				_punto[_value] = _char;
			}
		}
		Utils.punto = __convertText.bind(_punto, false);

		/** @type {Object.<string, (string|Array.<string>)>} An object in which the keys are strings and the values are string or string array. */
		var _translit = {
			'"': "\u044a",//"ъ"
			"'": "\u044c",//"ь"
			".": ":",
			"a": "\u0430",//"а"
			"b": "\u0431",//"б"
			"c": ["\u0446", "\u043a"],//"ц", "к"
			"ts": "\u0446",//"ц"
			"ch": "\u0447",//"ч"
			"d": "\u0434",//"д"
			"e": "\u0435",//"е"
			"je": "\u0435",//"е"
			"ye": ["\u0435", "\u0439\u0435"],//"е", "йе"
			"eh": "\u044d",//"э"
			"f": "\u0444",//"ф"
			"ph": "\u0444",//"ф"
			"g": "\u0433",//"г"//TODO:: в поиске вроде как ["г", "й"] - проверить
			"h": "\u0445",//"х"
			"i": ["\u0438", "\u0439", "\u044b"],//"и", "й", "ы"
			"j": ["\u0436", "\u0439"],//"ж", "й"
			"ja": ["\u044f", "\u0439\u044f"],//"я", "йя"
			"ya": ["\u044f", "\u0439\u044f"],//"я", "йя"
			"jj": "\u0439",//"й"
			"jo": "\u0451",//"ё"
			"yo": ["\u0451", "\u0439\u043e"],//"ё", "йо"
			"ju": "\u044e",//"ю"
			"yu": ["\u044e", "\u0439\u0443"],//"ю", "йу"
			"k": "\u043a",//"к"
			"kh": "\u0445",//"х"
			"l": "\u043b",//"л"
			"m": "\u043c",//"м"
			"n": "\u043d",//"н"
			"o": "\u043e",//"о"
			"p": "\u043f",//"п"
			"q": "\u043a",//"к"
			"r": "\u0440",//"р"
			"s": ["\u0441", "\u0437"],//"с", "з"
			"sc": null,// needs for "sch" find
			"sch": ["\u0448", "\u0449"],//"ш", "щ"
			"sh": "\u0448",//"ш"
			"shh": "\u0449",//"щ"
			"shc": null,// needs for "sch" find
			"shch": "\u0449",//"щ"
			"t": "\u0442",//"т"
			"u": ["\u0443", "\u044e"],//"у", "ю"
			"v": "\u0432",//"в"
			"\u0432": "v",//"в"
			"w": "\u0432",//"в"
			"x": "\u043a\u0441",//"кс"
			"y": ["\u044b", "\u0439", "\u044f", "\u0438\u0439"],//"ы", "й", "я", "ий"
			"\u0438\u0439": ["iy"],//"ий" Чтобы "ий"->"y" не перекрывала "ий"->"iy" ("Дмитрий" -> "Dmitriy")
			"z": "\u0437",//"з"
			"zh": "\u0436",//"ж"
			"\u0436": "zh"//"ж"
		};
		for( _char in _translit ) if( _translit.hasOwnProperty(_char) ) {
			_value = _translit[_char];

			if( Array.isArray(_value) ) {
				Array.forEach(_value, function(_value) {
					var chars;

					chars = this[_value];

					if( chars === void 0 ) {
						this[_value] = _char;
					}
					else if( Array.isArray(chars) ) {
						if( !Array.contains(chars, _char) ) {
							chars.push(_char);
						}
					}
					else if( chars !== _char ) {
						this[_value] = [chars, _char];
					}
				}, _translit);
			}
			else if( _translit[_value] ) {
				_value = _translit[_value];

				if( Array.isArray(_value) ) {
					if( !Array.contains(_value, _char) ) {
						_value.push(_char);
					}
				}
				else if( _value !== _char ) {
					_translit[_translit[_char]] = [_value, _char];
				}
			}
			else if( _value ) {
				_translit[_value] = _char;
			}
		}
		Utils.translit = __convertText.bind(_translit, true);

		_char = _value = _translit = _punto = __convertText = null;//cleanup

		/**
		 * Get avatar src by email and dimensions
		 *
		 * @param {String} email
		 * @param {String} name it can empty string or null
		 * @param {Number=} width
		 * @param {Number=} height
		 * @return {String}
		 */
		Utils.getAvatarSrc = function (email, name, width, height) {
			var src;

			email = encodeURIComponent(email);

			if( mailru.IsRetina && width == 32 ) {
				width = 45;
				height = 45;
			}
			/** @namespace mailru.avaHost */
			src = '//' + mailru.avaHost + '/pic?width=' + (width) + '&height=' + (height || width) + '&email=' + email;

			if( name ) {
				name = encodeURIComponent(name);
				src += ('&name=' + name);
			}

			src += ('&version=' + mailru['AvatarVersion'] + '&build=' + mailru['AvatarBuild']);

			return src;
		};

		Utils.getAvatarEmailByMessage = function (Message, onlyFrom) {
			var src = "", Folder, tmp;

			if( Message ) {
				Folder = mailru.Folders.getSafe(Message.FolderId);
				if( !onlyFrom && (Folder.isSent() || Folder.isDrafts()) ) {
					if( Message.Cc || Message.To.contains(',') ) {
						src = 'multicc@multicc.mail.ru';
					}
					else {
						src = ajs.Html.unescape(Message.To);
						if( tmp = src.match(_re_email_matcher) ) {
							src = tmp[2];
						}
					}
				}
				else {
					src = Message.From;
				}
			}

			return src;
		};

		/**
		 *
		 * @param {Object} Message
		 * @param {number} width
		 * @param {number} height
		 * @param {boolean=} onlyFrom
		 * @return {String}
		 */
		Utils.getAvatarSrcByMessage = function (Message, width, height, onlyFrom) {
			var src = ""
				, tmp
				, email
				, name
				, Folder
			;

			if( Object.isObject(Message) ) {
				email = Utils.getAvatarEmailByMessage(Message, onlyFrom);

				Folder = mailru.Folders.getSafe(Message.FolderId);
				if( !onlyFrom && (Folder.isSent() || Folder.isDrafts()) ) {
					if( !(Message.Cc || Message.To.contains(',')) ) {
						name = Message.ToList;
					}
				}
				else {
					name = Message.FromShort;
					if( name ) {
						name = ajs.Html.unescape($.trim(name));
					} else {
						name = Message.FromList;
						if( name ) {
							name = ajs.Html.unescape($.trim(name));
							if( tmp = name.match(_re_email_matcher) ) {
								name = tmp[1];
							}
						}
					}
				}

				src = Utils.getAvatarSrc(email, name, width, height);

				if( !Message.SPF ) {
					src += '&trust=false';
				}

				if( mailru.AvatarNoCache ) {
					src += ('&uid=' + Message.Id + mailru.CurrentTimestamp);
				}
			}

			return src;
		};

		/**
		 *
		 * @param {Object} Message
		 * @param {boolean=} onlyFrom
		 * @return {String}
		 */
		Utils.getAvatarUrlByMessage = function (Message, onlyFrom) {
			var url = '', email;
			if (Object.isObject(Message)) {
				email = Utils.getAvatarEmailByMessage(Message, onlyFrom);
				if (email != 'multicc@multicc.mail.ru') {
					url = mailru.getUserUrl(email, 'avatar');
				}
			}
			return url;
		};

		Utils.updateMessagelineAvatar = function (Message, id, onlyFrom) {
			var newSrc = Utils.getAvatarSrcByMessage(Message, 32, null, onlyFrom), image;
			image = new Image();
			image.onload = function () {
				$('#' + id).css('backgroundImage', 'url("' + newSrc + '")');
				image = image.onload = null;
			};
			image.src = newSrc;
		};

		/**
		 * Get avatar src for messageline with preload
		 *
		 * @param {Object} Message
		 * @param {String} id
		 * @return {String}
		 */
		Utils.getMessagelineAvatar = function (Message, id, onlyFrom) {
			var newSrc = Utils.getAvatarSrcByMessage(Message, 32, null, onlyFrom), image;
			var backgroundImage = $('#' + id).css('backgroundImage'), src = newSrc;
			if (backgroundImage) {
				Utils.updateMessagelineAvatar(Message, id, onlyFrom);
				src = backgroundImage.replace(_rebackgroundimage, '$1');
			} else {
				// MAIL-10457
				if (mailru && mailru.username && mailru.userdomain && mailru.NewMsglistAvatarStatistic) {
					image = new Image();
					image.onload = function () {
						var fileSize, _log;
						try {
							fileSize = image.fileSize;
						} catch (e) {}
						if (fileSize) {
							_log = {
								log: 'MAIL_13238_user_avatar_',
								useremail: mailru.useremail,
								from: Utils.getAvatarEmailByMessage(Message, onlyFrom),
								messageid: Message.Id
							};
							if (fileSize <= 650) {
								_log.log += 'default';
							} else {
								_log.log += 'custom';
							}
							mailru.gstat(_log, 'ua=1');
						}
						image = image.onload = null;
					};
					image.src = newSrc;
				}
			}
			return src;
		};
	})(window, mailru.Utils);

	jsLoader.loaded('{mailru.utils}mailru.Utils', 1);

// data/ru/images/js/ru/utils/mailru.Utils.js end

// data/ru/images/js/ru/mailru.API.js start


// data/ru/images/js/ru/mailru.core.js start

/*global createRadar*/

// data/ru/images/js/ru/mailru.Folders.js start


// data/ru/images/js/ru/model/mailru.Folder.js start


// data/ru/images/js/ru/model/mailru.Model.js start


(function (scope, _slice, undef){
		/**
		 * @class	mailru.Model
		 */
		var Model = function (){ this.__construct.apply(this, arguments); };


		Model.prototype = {
			constructor: Model,

			__self: Model,


			/**
			 * Id attribute name
			 * @param {String}
			 */
			idAttr: 'id',


			/**
			 * Default attributes
			 * @param {Object}
			 */
			defaults: {},


			/**
			 * @constructor
			 * @param	{Object}	[data]
			 * @param	{Object}	[options]
			 */
			__construct: function (data, options){
				options			= options || {};

				this._fns		= {};	// event listeners

				this.uid		= this.uniqId;
				this.attrs		= ajs.clone(this.defaults);
				this.changed	= {};
				this.prevAttrs	= {};

				if( data ){
					this.set(data, options.silent);
				}

				this.__lego();
			},


			/**
			 * @protected
			 */
			__lego: ajs.F,


			/**
			 * Get model id
			 *
			 * @public
			 * @return	{String}
			 */
			getId: function (){
				return	this.id;
			},


			/**
			 * Bind event listener
			 *
			 * @public
			 * @param	{String}	name
			 * @param	{Function}	fn
			 * @return	{mailru.Model}
			 */
			on: function (name, fn){
				if( !this._fns[name] ) this._fns[name] = [];
				this._fns[name].push(fn);
				return	this;
			},


			/**
			 * Unbind event listener
			 *
			 * @public
			 * @param	{String}	name
			 * @param	{Function}	fn
			 * @return	{mailru.Model}
			 */
			off: function (name, fn){
				if( name in this._fns ){
					this._fns[name]	= ajs.remove(this._fns[name], fn, true);
				}
				return	this;
			},


			/**
			 * Dispatch event
			 *
			 * @public
			 * @param	{String}	name
			 * @param	{Array}		[args]
			 * @return	{void}
			 */
			emit: function (name, args){
				if( name in this._fns ){
					var fns = this._fns[name], i = 0, n = fns.length;
					for( ; i < n; i++ ){
						fns[i].apply(this, args);
					}
				}
			},


			/**
			 * Trigger event
			 *
			 * @public
			 * @param	{String}	name
			 * @return	{mailru.Model}
			 */
			trigger: function (name/*, args*/){
				this.emit(name, _slice.call(arguments, 1));
				return	this;
			},


			/**
			 * Has attribute by name
			 *
			 * @public
			 * @param	{String}	name
			 * @return	{Boolean}
			 */
			has: function (name){
				return	this.attrs[name] !== undef;
			},


			/**
			 * Get attribute value by name
			 *
			 * @public
			 * @param	{String}	name
			 * @param	{*}	[def]
			 * @return	{*}
			 */
			get: function (name, def){
				var attrs = this.attrs;
				return	attrs[name] === undef ? def : attrs[name]
			},


			/**
			 * Set attributes
			 *
			 * @public
			 * @params	{*}	name
			 * @params	{*}	[val]
			 * @param	{Boolean}	[silent]
			 * @return	{mailru.Model}
			 */
			set: function (name, val, silent){
				var attrs;

				if( typeof name === 'string' ){
					attrs = {};
					attrs[name]	= val;
				}
				else {
					attrs	= name;
					silent	= val;
				}

				if( this._set(attrs, silent) ){
					this.id	= this.get(this.idAttr);
					!silent && this.emit('change', [this, this.changed]);
				}

				return	this;
			},


			/**
			 * Get previous attribute
			 *
			 * @public
			 * @param	{String}	name
			 * @return	{*}
			 */
			prev: function (name){
				return	this.prevAttrs[name];
			},


			/**
			 * @protected
			 * @param	{Object}	attrs
			 * @param	{Boolean}	[silent]
			 * @return	{Boolean}
			 */
			_set: function (attrs, silent){
				return	this._setter(this.attrs, attrs, this.changed = {}, this.prevAttrs = {});
			},


			/**
			 * Abstract setter
			 *
			 * @protected
			 * @param {Object} dst	target object
			 * @param {Object} src	source object
			 * @param {Object} changed	changed attributes
			 * @param {Object} prevAttrs  previous attributes
			 * @return {Boolean}
			 */
			_setter: function(dst, src, changed, prevAttrs){
				var
					  key
					, res = false
					, nVal
					, oVal
				;

				for( key in src ) if( src.hasOwnProperty(key) ){
					oVal	= dst[key];
					nVal	= src[key];

					if( _notEqual(oVal, nVal) ){
						res = true;
						dst[key] = nVal;
						changed[key] = nVal;
						prevAttrs[key] = oVal;
					}
				}

				return	res;
			},


			/**
			 * Convert model to JSON
			 *
			 * @public
			 * @return	{Object}
			 */
			toJSON: function (){
				return	ajs.clone(this.attrs);
			}

		};



		Model.extend = function (methods){
			var
				  Ext = function (){ this.__construct.apply(this, arguments); }
				, F = function (){}
			;

			F.prototype = this.prototype;
			Ext.prototype = new F;
			Ext.extend = this.extend;

			if( methods ){
				for( var key in methods ) if( methods.hasOwnProperty(key) ){
					Ext.prototype[key] = methods[key];
				}
			}

			Ext.prototype.__self = Ext;

			return	Ext;
		};


		function _notEqual(actual, expected){
			var
				  key
				, res	= false
				, eType = typeof expected
			;

			if( typeof actual !== eType && eType === 'object' ){
				res	= true;
			}
			else if( eType === 'object' ){
				for( key in expected ) if( expected.hasOwnProperty(key) ){
					if( _notEqual(actual[key], expected[key]) ){
						res	= true;
						break;
					}
				}
			}
			else {
				res	= actual != expected;
			}

			return	res;
		}


		// @export
		scope.Model = Model;


		/**
		 * @class	mailru.OldModel
		 * @export
		 */
		scope.OldModel = Model.extend({
			idAttr: 'Id',

			get: function (key){
				return	this[key];
			},

			getChanges: function (){
				return	this.changed;
			},

			inc: function (key, num){
				return	this.set(key, Math.max(~~this.get(key) + num, 0));
			},

			_set: function (attrs){
				return	this._setter(this, attrs, this.changed = {}, this.prevAttrs = {});
			},
			
			toJSON: function (){
				return	this;
			}
		});
	})(mailru, [].slice);


	jsLoader.loaded('{mailru.model}mailru.Model', 1);

// data/ru/images/js/ru/model/mailru.Model.js end

(function (){
		/**
		 * @class	mailru.Folder
		 * @author	RubaXa	<trash@rubaxa.org>
		 * @contributor Alexander Abashkin <a.abashkin@corp.mail.ru>
		 */
		var Folder	= mailru.OldModel.extend({
			__lego: function (){
				this.Name   = this.Name || Lang.str('folder.name.'+this.id);
			},

			transaction: function (start){
				if( start ){
					this.__copy	= {};
					ajs.each('Name Unread Messages Secure'.split(' '), function (key){
						this.__copy[key] = this.get(key);
					}, this);
				} else {
					delete this.__copy;
				}
				return this;
			},

			rollback: function () {
				if( this.__copy ){
					this.set(this.__copy);
				}
				return	this.transaction(false);
			},

			getRoot: function () {
				/** @namespace this.ParentId */
				return mailru.Folders.get(this.ParentId);
			},

			isRoot: function () {
				/** @namespace this.IsSubfolder */
				return !this.IsSubfolder;
			},

			isEmpty: function () {
				return !this.Messages;
			},

			inFolder: function (id){
				return	this.isRoot()
							? this.Id == id
							: ((this.ParentId == id) || mailru.Folders.getSafe(this.ParentId).inFolder(id))
						;
			},

			isSecure: function (){
				/** @namespace this.Secure */
				return this.Secure >= Folder.SECURE;
			},

			isSecureOpen: function (){
				return !this.isSecure() || (this.Secure == Folder.SECURE_OPEN);
			},

			isInbox: function (){
				return this.inFolder(Folder.INBOX);
			},

			isBulk: function (){
				return this.inFolder(Folder.BULK);
			},

			isSpam: function (){
				return	this.isBulk();
			},

			isSent: function (){
				return this.inFolder(Folder.SENT);
			},

			isDrafts: function (){
				return this.inFolder(Folder.DRAFTS);
			},

			isTrash: function (){
				return this.inFolder(Folder.TRASH);
			},

			isMRIM: function (){
				return this.inFolder(Folder.MRIM);
			},

			getType: function (){
				return Folder.TYPES[this.Id] || Folder.TYPES.USER;
			},

			getHash: function (){
				return [this.Id, this.Name, this.Secure, this.Unread, this.Messages, this.ParentId].join('');
			},

			_set: function (attrs, silent){
				var res = this._setter(this, attrs, this.changed = {}, this.prevAttrs = {});

				if( res ){
					this.id = this.Id; // force set

					if( this.id >= 0 && !silent ){
						(mailru.Events !== undef) && mailru.Events.fire('updated.folder', this);
						mailru.Folders.recalcCounters();
					}
				}

				return	res;
			},

			toJSON: function (){
				return	this;
			},

			clear: function (){
				var df = $.Deferred();

				this.emit('clear', this);
				$.event.trigger({ type: 'beforefolderclear', folder: this });

				if( !this.__clearDefer ){
					this.__clearDefer = df;

					if( !this.id ){
						df.reject();
					}
					else {
						mailru.Ajax({
							url: "/cgi-bin/clearfolder",
							type: "POST",
							data: { ajax_call: 1, func_name: 'clear_folder', folder: this.id },
							isUser: true,
							complete: function (R){
								this.__clearDefer = null;
								df[R.isOK() ? 'resolve' : 'reject'](R);
								if( R.isOK() ){
									this.set({ Unread: 0, Messages: 0 });
									mailru.Messages.set(this.id, [], ajs.now());
								}
								$.event.trigger({ type: 'folderclear', folder: this }, R);
							}.bind(this)
						});
					}
				}

				return	this.__clearDefer;
			},

			getUrl: function (){
				var type = Folder.TYPES[this.id];
				return	'/messages/' + (type ? type.toLowerCase() : 'folder/' + this.id) + '/';
			}
		});

		ajs.extend(Folder, {
			  INBOX:		0
			, BULK:			950
			, SPAM:			950
			, SENT:			500000
			, DRAFTS:		500001
			, TRASH:		500002
			, MRIM:			500003
			, MRIM_ARCH:	500005

			, UNREAD:		500006
			, FLAGGED:		500007
			, ATTACH:		500008

			, SECURE:		1
			, SECURE_OPEN:	2

			, FILESEARCH:	-2

			, TYPES:		{
				  0:		'Inbox'
				, 950:		'Spam'
				, 500000:	'Sent'
				, 500001:	'Drafts'
				, 500002:	'Trash'
				, 500003:	'MRIM'
				, USER:		'user'
			}
		});

		// @export
		mailru.Folder = Folder;
	})();

	jsLoader.loaded('{mailru.model}mailru.Folder', 1);

// data/ru/images/js/ru/model/mailru.Folder.js end

/**
	 * @class	mailru.Folders
	 * @author	RubaXa	<trash@rubaxa.org>
	 */

	jsClass
		.create('mailru.Folders')
		.statics({
			  ID:		0
			, List:		[]
			, Map:		{}
			, UNREAD:	0
			, MESSAGES:	0
		})
		.statics({

		setId: function (id, a){
			if( !this.isReady || (id !== void 0) && (this.ID != id) || a ){
				mailru.Events.fire('select.folder', [this.ID, this.ID = id]);
				return	true;
			}
			return	false;
		},

		upd: function (id, Data, force){
			if (!(id in this.Map)) {
				this.Map[id] = new mailru.Folder({
					Id: id,
					Unread: 0,
					Messages: 0
				},
				{
					silent: force
				});
			}

			this.Map[id].set(Data, force);
			return this.Map[id];
		},

		set: function (folders, hash, force) {
			var list = [];

			this.hash	= hash;
			this.COUNT	= folders.length;

			Array.forEach(folders, function (folder) {
				list.push(mailru.Folders.upd(folder.Id, folder, force));
			}, this);

			this.List = list;

			if (force !== 1) {
				mailru.Events.fire('update.folders', this.List);
			}
		},

		get: function (id, def) {
			return this.Map[id = defined(id, mailru.getFolderId())] || (def !==  void 0 ? this.make(def, id) : def);
		},

		getSafe: function (id) {
			return this.get(id, true);
		},

		getAll: function () {
			return this.List;
		},

		getHash: function () {
			return this.hash;
		},

		getSearch: function (id) {
			if( id ===  void 0 ) id = ~~GET.q_folder;
			return this.getSafe(-1 - (id >= 0 ? id : 0));
		},

		hasCache:	function (id, page){
			id		= Math.max(parseInt(id || 0), 0);
			page	= Math.max(parseInt(page || 0), 1);

			var F = mailru.Folders.get( id ), arM = mailru.Messages.getByFolder(id, page);
			return	F && (!F[mailru.threads ? 'Threads' : 'Messages'] || !!arM.length);
		},

		make: function (props, id){
			if( props === true ) props = {};
			if( props.Id === void 0 ) props.Id = id;

			return	new mailru.Folder(props, { silent: true });
		},

		recalcCounters: function (){
			var unread = 0
				, messages = 0
			;

			Object.forEach(this.Map, function (folder){
				if (!folder.isBulk()) {
					unread += folder.Unread;
				}

				messages += folder.Messages;
			});

			mailru.Folders.UNREAD = unread;
			mailru.Folders.MESSAGES = messages;

			$(window).triggerHandler('updatemessagescount', [ unread ]);
		},

		convertThreads: function (folders){
			return Array.map(folders, function (folder) {
				/** @namespace folder.security */
				/** @namespace folder.threads_total */
				/** @namespace folder.threads_unread */

				return {
					Id: folder.id,
					Name: folder.name || Lang.str('folder.name.'+folder.id),
					Unread: folder.messages_unread,
					Messages: folder.messages_total,
					Threads: folder.threads_total,
					ThreadsUnread: folder.threads_unread,
					Secure: +folder.security,
					ParentId: folder.parent,
					IsSubfolder: folder.parent != -1
				};
			});
		}
	});

	Array.forEach('transaction rollback'.split(' '), function (name) {
		mailru.Folders[name] = function (){
			var args = arguments;

			Array.forEach(this.getAll(), function (folder) {
				folder[name].apply(folder, args);
			});
		}
	});


	/* ~~~ MAILRU  -V2-  METHODS ~~~ */
	mailru.Folders.find = function (data){
		var defer = new $.Deferred;
		mailru.Folders.findAll().fail(defer.reject).done(function (){
			var folder = mailru.Folders.getSafe( Math.max(data.id|0, 0) );
			defer.resolve(folder);
		});
		return	defer.promise();
	};


	mailru.Folders.findAll = function (){
		var defer = this._deferAll, folders = mailru.Folders.getAll();

		if( !defer ){
			defer = this._deferAll = $.Deferred();

			if( folders.length ){
				defer.resolve(folders);
			}
			else {
				mailru.Events.one('stop.updater', function (){
					defer.resolve(mailru.Folders.getAll());
				});
			}
		}

		return	defer.promise();
	};


	mailru.Folders.findByMsgId = function (id, read){
		var df = $.Deferred();

		mailru.Messages
			.find({ id: id, sm: GET.sm, read: +!!read })
				.fail(df.reject)
				.done(function (){
					var msg = mailru.Messages.getSafe(id);
					mailru.Folders
						.find({ id: msg.folder || msg.FolderId })
							.done(df.resolve)
							.fail(df.reject)
					;
				})
		;

		return	df.promise();
	};

	mailru.Folders.findByThreadId = function (id){
		var df = $.Deferred();

		mailru.Threads
			.find({ id: id })
				.fail(df.reject)
				.done(function (thread){
					mailru.Folders
						.find({ id: thread.get('folder') })
							.done(df.resolve)
							.fail(df.reject)
					;
				})
		;

		return	df.promise();
	};

	jsLoader.loaded('{mailru}mailru.Folders', 1);

// data/ru/images/js/ru/mailru.Folders.js end

// data/ru/images/js/ru/mailru.Messages.js start

/**
 * @object	mailru.Messages
 * @author	RubaXa	<trash@rubaxa.org>
 */


// data/ru/images/js/ru/model/mailru.Message.js start


(function (){
		var Message	= mailru.OldModel.extend({

			getFolder: function (){
				return	mailru.Folders.get(this.FolderId);
			},

			inFolder: function (id){
				var F = this.getFolder();
				return	F && F.inFolder(id);
			},

			getIcon: function (){
				var i = 0;
				if( this.isForward() && this.isReply() ) i = 211;
				else if( this.isForward() ) i = 501;
				else if( this.isReply() ) i = 510;
				else if( this.isUnread() ) i = 500;
				return	i;
			},

			isLoaded: function (){
				return  this.Id && !!(this._loaded || this._static);
			},

			isLow: function (){
				return	Message.LOW == this.Priority;
			},

			isHigh: function (){
				return Message.HIGH == this.Priority;
			},

			isNormal: function (){
				return	Message.NORMAL == this.Priority;
			},

			isReadSet: function (){
				/** @namespace this.ReadSet -- флаг, говорящий о том, что нужно поменить это письмо прочитанным */
				return	1 == this.ReadSet;
			},

			isUnread: function (){
				return	1 == this.Unread;
			},

			isReply: function (){
				return 1 == this.Reply;
			},

			isForward: function (){
				return	1 == this.Forward;
			},

			isFlagged: function (){
				return	1 == this.Flagged;
			},

			getSubject: function (){
				return	this.Subject == '' ? ('&lt;' + Lang.str('message.email.untitled') + '&gt;') : this.Subject;
			},

			getWbrSubject: function (){
				/** @namespace this.WbrSubject */
				return	this.WbrSubject == '' ? ('&lt;' + Lang.str('message.email.untitled') + '&gt;') : this.WbrSubject;
			},

			getSnipletText: function (){
				/** @namespace this.SnipletText */
				return	this.SnipletText == '' ? '' : this.SnipletText;
			},

			getSearchSniplet: function (){
				/** @namespace this.SearchSnippet */
				return this.SearchSnippet ? this.SearchSnippet : mailru.MicroFormat.text(this);
			},

			getSearchSubject: function (){
				/** @namespace this.SearchSubject */
				return	this.SearchSubject ? this.SearchSubject : ('&lt;' + Lang.str('message.email.untitled') + '&gt;');
			},

			getSearchFrom: function (){
				/** @namespace this.SearchFrom */
				return	this.SearchFrom ? this.SearchFrom : ('&lt;' + Lang.str('message.email.unknown') + '&gt;');
			},

			setBody: function (html, text){
				this.let_body		= html;
				this.let_body_plain	= text;
			},

			getBody: function (type){
				var body = (!type || type == 'html') ? this.let_body : this.let_body_plain;
				return	body == null ? "" : body;
			},

			_set: function (attrs, silent){
				var res = this._setter(this, attrs, this.changed = {}, this.prevAttrs = {});

				if( res && !silent ){
					(mailru.Events !== undef) && mailru.Events.fire('updated.message', this);
				}

				return	res;
			},

			save: function (){
				var changed = this.changed;

				if( 'Flagged' in changed ){
					mailru.Messages.edit('mark', this.id, mailru.Message[changed.Flagged ? 'FLAG' : 'NOFLAG']);
				}
				else if( 'Unread' in changed ){
					mailru.Messages.edit('mark', this.id, mailru.Message[changed.Unread ? 'UNREAD' : 'READ']);
				}

				this.changed = {};
			}
		});


		ajs.extend(Message, {
			  READ:		2
			, UNREAD:	1

			, FLAG:		6
			, NOFLAG:	7

			, LOW:		5
			, HIGH:		1
			, NORMAL:	3
		});


		// @export
		mailru.Message	= Message;


		// Empty Message
		mailru.Message.Empty	= new mailru.Message({ Id: null }, { silent: true });
	})();


	jsLoader.loaded('{mailru.model}mailru.Message', 1);

// data/ru/images/js/ru/model/mailru.Message.js end

// data/ru/images/js/ru/mailru.Ajax.js start

/**
 * @object	mailru.Ajax
 * @alias	Ajax
 * @author	RubaXa	<trash@rubaxa.org>
 *
 * 	mailru.Ajax({ ... })
 *  mailru.Ajax.get()
 * 	mailru.Ajax.post
 *
 * mailru.Ajax.Result
 * 	getXHR()
 * 	getOpts()
 *  isSuccess()
 * 	isOK()
 * 	isNOP()
 * 	isNoAuth()
 * 	isGET()
 * 	isPOST()
 * 	isJSON()
 * 	getStatus()
 * 	getData()
 * 	isNoSDC()
 */



// data/ru/images/js/ru/mailru.Notify.js start


(function (){
		var
			  _sy = 24
			, _y = _sy
			, _idx = 30000
			, _queue = []
			, _groups = {}
		;

		/**
		 * @class   mailru.Notify
		 */
		var Notify = function (){ this.__construct.apply(this, arguments); };
		Notify.prototype = {
			constructor: Notify,

			/**
			 * @constructor
			 */
			__construct: function (){
				this.$Elm = $('#Notify').clone().prependTo('body');
				_queue.push(this);
			},

			// @private
			_type: function (type) {
				switch (type) {
					case 'load':
					case 'send':
					case 'move':
					case 'load.still':
					case 'send.still':
					case 'move.still':
							type = 'load';
						break;

					case 'error':
					case 'connection.error':
					case 'connection.still.error':
							type = 'error';
						break;
				}

				return	type;
			},

			// @public
			set: function (o){
				if( !this._exists ){
					this._exists = true;
					this.$Elm.css({ top: _y + 5, opacity: 0, zIndex: _idx++ })
				}

				var txt = o.text || Lang.str('notify.'+ o.type + (o.subtype ? '.'+o.subtype : ''));

				if( !txt || $.type(txt) != 'string' ){
					ajs.log('notify.error.empty.text:', o);
					return;
				}

				this.$Elm
					.unbind()
					.click(this.destroy.bind(this))
					.display(1)
					.children().display(0)
					.filter('.js-'+this._type(o.type))
						.display(1)
						.find('.js-txt').html(txt)
				;

				if( o.group ){
					_groups[o.group] = this;
				}

				ajs.clearSleep(this._pid);
				if( o.delay ){
					this._pid = ajs.sleep(this.destroy.bind(this), o.delay * 1000);
				}

				this._data = o;
				_redraw();
			},

			destroy: function (){
				_queue = ajs.remove(_queue, this, true);
				delete _groups[this._data.group];

				ajs.clearSleep(this._pid);

				this.$Elm.delay(200).animate({
					top: '-=5',
					opacity: 0
				},
				'fast', function () {
					$(this).remove();
				});

				_redraw();
			}
		};

		/**
		 * @static methods
		 */
		ajs.extend(Notify, {

			add: function (type, opts){
				if( typeof opts === 'string' ){
					opts = { text: opts };
				}

				/** @namespace mailru.isN */
				opts = ajs.extend({ type: type, delay: 3 }, opts);
				this.find(opts && opts.group).set(opts);
			},

			hide: function (id){
				if( id in _groups ){
					_groups[id].destroy();
				}
			},

			find: function (id){
				return	_groups[id] || new this;
			}

		});


		/**
		 * Redraw all notify
		 */
		function _redraw(){
			_y = _sy;
			ajs.each(_queue, function (notify){
				if( notify.__y !== _y ){
					notify.__y = _y;
					notify.$Elm.animate({ top: _y, opacity: 1 }, 'fast');
				}
				_y += notify.$Elm.outerHeight() + 2;
			});
		}


		/**
		 * Browser alert
		 *
		 * @param	{String|Boolean}	name	"string" -- show, false -- hide
		 */
		Notify.browserAlert = function (name){
			var $el = $('#browser-alert');
			if( name ){
				$el.find('.js-alert').hide().filter('.js-'+name).show();
				$el.slideDown(100).delegate('.js-close', 'click', Notify.browserAlert.bind(this, false));
			}
			else {
				$el.slideUp(100);
			}
		};

		Notify.collectorErrorAlert = function (collector) {
			var type;

			if (store.enabled) {
				switch (collector.error) {
					case 'blocked':
						type = collector.error;
						break;

					// extra_auth - more than 3 login attempts
					case 'extra_auth':
						type = 'noauth';
						break;
				}
			}
			if (type) {
				Notify.collectorErrorAlertByType(type, collector);
			}
		};

		Notify.collectorErrorAlertByType = function (type, collector) {
			var notify_id = 'collector-' + type,

				store_go_to_setting_key = 'collector.' + type + '.alert.go_to_setting',
				store_last_hide_key = 'collector.' + type + '.alert.last_hide',
				store_count_key = 'collector.' + type + '.alert.count',
				store_hide_key = 'collector.' + type + '.alert.hide',

				now = Math.round(new Date().getTime() / 1000),
				last_hide_expire = 86400,
				go_to_setting_expire = 3600,
				max_try_count_hide = 3,

				ts_go_to_setting = store.get(store_go_to_setting_key) || 0,
				ts_last_hide = store.get(store_last_hide_key) || 0,
				count_hide = store.get(store_count_key) || 0,
				hide = store.get(store_hide_key);

			if (ts_last_hide + last_hide_expire > now) {
				hide = true;
			}

			if (type == 'blocked') {
				if (ts_go_to_setting + go_to_setting_expire > now) {
					hide = true;
				}
			}

			if (!hide) {
				this.add(notify_id, {
					delay: 0,
					text: Lang.str('notify.collector.noauth')
						.replace('%s', collector.email),
					group: notify_id
				});

				if (type == 'noauth') {
					new Image().src = '//rs.' + mailru.SingleDomainName + '/d1544873.gif?' + Math.random();
					new Image().src = '//rs.' + mailru.SingleDomainName + '/d1544951.gif?' + Math.random();
				} else if (type == 'blocked') {
					new Image().src = '//rs.' + mailru.SingleDomainName + '/d1547999.gif?' + Math.random();
				}

				var $container = $('.js-' + notify_id, '#Notify');

				$('.js-dont-show', $container).toggle(count_hide > max_try_count_hide - 1);
				$('.js-remember-leter', $container).toggle(count_hide < max_try_count_hide);

				$container.delegate(
					'.js-change-password,' +
					'.js-dont-show,' +
					'.js-remember-leter,' +
					'.js-settings', 'click', function (evt) {

					var stop_event = true;
					var $target = $(evt.currentTarget);

					if ($target.hasClass('js-change-password')) {
						ajs.require('{plugins}' + 'LayerManager', function () {
							LayerManager.show('collector_edit', {
								id: collector.id,
								complete: function (layer, response) {
									if (response.isOk()) {
										mailru.Ajax({
											url: '/settings/collector?ajax_call=1&func_name=save',
											type: 'POST',
											data: {
												ID:          collector.id,
												IMAP:        collector.type == 'imap' ? 1 : 0,
												POPDisabled: 0,
												action:      'status'
											},
											complete: function () {
												mailru.Notify.add('ok', {
													text: Lang.str('notify.collector.noauth.success')
														.replace('%s', collector.email)
												});
												mailru.Notify.hide(notify_id);
												new Image().src = '//rs.' + mailru.SingleDomainName + '/sb1544951.gif?' + Math.random();
											}
										});

										layer.hide();

									} else {
										new Image().src = '//rs.' + mailru.SingleDomainName + '/sb1544954.gif?' + Math.random();
									}
								}
							});
							new Image().src = '//rs.' + mailru.SingleDomainName + '/sb1544873.gif?' + Math.random();
							new Image().src = '//rs.' + mailru.SingleDomainName + '/d1544954.gif?' + Math.random();
						});

					} else if ($target.hasClass('js-settings')) {

						store.set(store_go_to_setting_key, now);

						stop_event = false;

						new Image().src = '//rs.' + mailru.SingleDomainName + '/sb1547999.gif?' + Math.random();

					} else {

						if ($target.hasClass('js-remember-leter')) {

							store.set(store_count_key, ++count_hide);
							store.set(store_last_hide_key, now);

							if (type == 'noauth') {
								new Image().src = '//rs.' + mailru.SingleDomainName + '/sb1548021.gif?' + Math.random();
							} else if (type == 'blocked') {
								new Image().src = '//rs.' + mailru.SingleDomainName + '/sb1548008.gif?' + Math.random();
							}

						} else if ($target.hasClass('js-dont-show')) {

							store.set(store_hide_key, 1);

							if (type == 'noauth') {
								new Image().src = '//rs.' + mailru.SingleDomainName + '/sb1548028.gif?' + Math.random();
							} else if (type == 'blocked') {
								new Image().src = '//rs.' + mailru.SingleDomainName + '/sb1548011.gif?' + Math.random();
							}
						}

						mailru.Notify.hide(notify_id);
					}

					if (stop_event) {
						evt.stopPropagation();
						evt.preventDefault();
					}
				});
			}
		};

		// @export
		mailru.Notify	= Notify;
	})();

	jsLoader.loaded('{mailru}mailru.Notify', 1);

// data/ru/images/js/ru/mailru.Notify.js end

/** @namespace	this.isNOP() */
	/** @namespace	this.isNoSDC() */
	/** @namespace	this.isNoAuth() */
	/** @namespace	this.isNoToken() */
	/** @namespace	this.isBadToken() */
	/** @namespace	this.isRedirect() */
	/** @namespace	this.isAccessDenied() */
	/** @namespace	this.isInvalidPassword() */

	function getMailFromCookie() {
		var result, Mpop = jsCookie.get('Mpop');
		if (Mpop) {
			result = Mpop.split(':')[2];
		}
		return result;
	}

	function authUser() {
		$.ajax({
			url: '//swa.' + mailru.SingleDomainName + '/cgi-bin/auth?mac=1',
			dataType: 'jsonp',
			timeout: 5000,
			data: {Login: mailru.useremail},
			jsonp: 'JSONP_call',
			success: function (response) {
				$(window).triggerHandler('authUser.success', [response]);
			},
			complete: function () {
				$(window).triggerHandler('authUser.complete');
			}
		});
	}

	$.ajaxSetup({
		data: {
			ajax_call: 1,
			'x-email': function () {
				return mailru.userdomain && mailru.username && mailru.useremail ? mailru.useremail : '';
			}
		},
		traditional: true
	});

	/**
	 * @class	mailru.Ajax
	 * @param	{Object}	o
	 */
	mailru.Ajax = function (o) {

		var email = getMailFromCookie();

		if (!o.tryAuth && (mailru.OldMultiAuthLayerLogic || mailru.newMultiAuthLogic) && !ajs.blurred && email && mailru.username && mailru.userdomain && email != mailru.useremail) {

			$(window).one('authUser.complete', function (o, evt) {
				o.tryAuth = 1;
				mailru.Ajax(o);
			}.bind(this, o));

			authUser();
		}
		else {

			o.type			= (o.type || 'GET').toUpperCase();
			o.dataType		= (o.dataType || 'json').toLowerCase();
			o.timeout		= ajs.isset(o.timeout, 0);
			o.async			= ajs.isset(o.async, true);
			o.tokenRetry	= ajs.isset(o.tokenRetry, 1);

			$(window).triggerHandler('ajax.beforeSend', [o]);

			mailru.OfflineCache.ajax(o, {
				url:		o.url,
				type:		o.type,
				data:		o.data,
				dataType:	'text',
				timeout:	o.timeout,
				async:		o.async,
				complete:	function (jqXHR, textStatus) {
					mailru.Ajax.parse(jqXHR, textStatus, o);
				}
			}, doResult);
		}
	};

	mailru.Ajax.getSyncData = function (url, data){
		try {
			var
				  xhr	= $.ajax({ 'url': url, 'data': data, 'async': false, 'dataType': 'text' })
				, res	= $.parseJSON(xhr.responseText)
			;
			if( res && res.status == "OK" ){
				return	res.data;
			}
		}
		catch( e ){}
	};


	mailru.Ajax.byType	= function (t, u, d, s, e){
		var o = { url: u, data: d, type: t };
		if( e !== true ){ o.success = s; o.error = e; } else { o.complete = s; }
		return	mailru.Ajax(o);
	};

	Array.forEach(['get', 'post'], function (type){
		mailru.Ajax[type] = function (url, data, success, error){
			if( $.isFunction(data) ){
				success	= data;
				error	= success;
				data	= {};
			}

			return mailru.Ajax.byType(type, url, data, success, error);
		};
	});


	/**
	 * @class	mailru.Ajax.Result
	 */
	mailru.Ajax.Result = function(res, options, xhr, xhrStatus, xhrError){
		this._xhr			= xhr;
		this._options		= options || {};

		this.xhrError		= xhrError;
		this.xhrStatus		= xhr && xhr.status;
		this.xhrStatusText	= this.status = xhrStatus + '';

		if( this.isSuccess() ){
			if( this.isJSON() ){
				if( res && res[0] == 'AjaxResponse' ){
					res = { status: res[1], data: res[2] };
				}
				else if( $.isArray(res) ){
					res = { status: 'ok', data: res };
				}
				else if( !res ){
					res = { status: 'unknown' };
				}

				res.status = String(res.status).toLowerCase()
			}
			else {
				res = { status: 'ok', data: res };
			}

			if( xhr && xhr.getResponseHeader && xhr.getResponseHeader('X-NoSDC') == 1 ){
				res.status = 'NoSDC';
			}

			if( res && res.status == 'redirect' && res.data.indexOf('/cgi-bin/login') === 0 ){
				res.status = 'noauth';
			}

			ajs.extend(this, res);
		}
	};

	mailru.Ajax.Result.fn =
	mailru.Ajax.Result.prototype = {
		constructor: mailru.Ajax.Result,

		getXHR: function (){
			return this._xhr;
		},

		getResponseText: function (){
			return	this._xhr && this._xhr.responseText;
		},

		getOpts: function (){
			return	this._options;
		},

		isOK: function (){
			return this.status == 'ok' || this.status == 200;
		},

		isSuccess: function (){
			return	this.xhrStatusText == 'success' && this.status != 'error';
		},

		isError: function (){
			return this.hasNet()
				&& !(
						this.isOK()
					|| this.isNOP()
					|| this.isNoSDC()
					|| this.isNoAuth()
					|| this.isNoToken()
					|| this.isBadToken()
					|| this.isRedirect()
					|| this.isAccessDenied()
					|| this.isAbort()
					|| this.isInvalidPassword()
				)
			;
		},

		hasNet: function (){
			var xhr = this.getXHR();
			return this.isSuccess() || xhr && (xhr.readyState == 4 && (xhr.status > 99 && xhr.status < 600));
		},

		isGET: function (){
			return String(this._options.type || 'GET').toUpperCase() == 'GET';
		},

		isPOST: function (){
			return	String(this._options.type).toUpperCase() == 'POST';
		},

		isJSON: function (){
			return	String(this._options.dataType || 'json').toLowerCase() == 'json';
		},

		getStatus: function (){
			return this.status;
		},

		getError: function (){
			return this.xhrError;
		},

		setData: function (data){
			this.data = data;
			return	this;
		},

		getData: function (){
			return	this.data;
		},

		getBody: function (){
			return	this.getData();
		}
	};


	Array.forEach('NOP bad-token no-auth no-SDC no-token redirect access-denied invalid-password abort'.split(' '), function (name, status){
		status = name.replace(/-/g, '').toLowerCase();
		mailru.Ajax.Result.fn[$.camelCase('is-'+name)] = function (){
			return (this.status || '').toLowerCase() == status;
		};
	});


	function doResult (response, opts, xhr, s, status, error, old_answer) {
		if (s == 'success' && opts.convertResultToOldApi && !old_answer) {
			response = mailru.Utils.AjaxConverter.convert(response, opts);
		}

		var result = new mailru.Ajax.Result(response, opts, xhr, s, error);

		if( mailru['UseTokenAPIV1'] && result.isBadToken() && opts.tokenRetry-- > 0 ){
			mailru.API.post('tokens', function (Result){
				if (Result.isOk()) {
					var token = Result.getBody().token;
					if (token) {
						mailru.updateToken(token);
					}
				}
				mailru.Ajax(opts);
			});
		}
		else if( mailru['UseSDC'] && result.isNoSDC() && (opts.SDC === void 0) ){
			var doSDCFn = function (state){
				opts.SDC = state;

				if( state ){
					mailru.Ajax(opts);
				}
				else {
					result.status = 'noauth';
					(opts.error || ajs.F)(result, s);
					(opts.complete || ajs.F)(result, s);
				}
			};

			$.ajax({
				url: '//'+ mailru['UseSDC'] +'/sdc?JSONP_call=?&from=' + ajs.encode(ajs.Router.parseURL(jsHistory.get()).url),
				type: 'get',
				dataType: 'jsonp',
				timeout: 3000,
				error: function (){ doSDCFn(false); },
				success: function (state){ doSDCFn(state); }
			});
		}
		else {
			((result.isSuccess() ? opts.success : opts.error) || ajs.F)(result, s);
			(opts.complete || jsCore.F)(result, s);

			if (s == 'parsererror' && error) {
				$.event.trigger('ajaxError', [xhr, opts, error]);
			}

			if (mailru.Events) {
				if (result.isRedirect()) {
					mailru.Events.fire('redirect.ajax', result);
				} else if (s !== 'success') {
					/** @namespace	mailru.saveError */
					mailru.saveError(s, [status]);
					mailru.Events.fire('error.ajax', result);
				}
			}
		}

		$(window).triggerHandler('ajax.complete', [result]);
	}

	mailru.Ajax.parse = function (jqXHR, textStatus, o) {
		mailru.OfflineCache.parse(jqXHR, textStatus, o, doResult);
	};

	// @short
	window.Ajax	= mailru.Ajax;




	(function () {
		var
			  _rtype = /^(?:https?:\/\/[^/]+)?\/?(?:cgi-bin\/)?(\w+)/i
			, _log = function (txt){ window.console && console.log && console.log(txt) }
		;

		function _relPath(url) {
			var result = url.match(_rtype);
			return result ? result[1] : false;
		}

		$(window).bind({

			'ajax.beforeSend': function(evt, options, type) {
				try { _start(options); } catch (er){ }

				if ($.type(options.data) == 'string') {
					options.url += (~options.url.indexOf('?') ? '&' : '?') + 'x-email=' + mailru.useremail;
				}

				if (!(options.isAPIV1 || options.saveTokens) && mailru.tokens && (type = options.ref)) {
					var token_parts = mailru.tokens[type] || window['mailru_api_token_parts'];
					if (mailru['UseTokenAPIV1']) {
						token_parts = window['mailru_api_token_parts'] || token_parts;
					}
					if (token_parts) {
						if (options.data) {
							if ($.type(options.data) == 'string') {
								options.data = $.param(token_parts) + '&' + options.data.replace(/(^|&)(form_sign|form_token)=[^&]*/g, '');
							} else if ($.type(options.data) == 'object') {
								options.data = $.extend({}, options.data, token_parts);
							}
						} else {
							options.data = token_parts;
						}
					}
				}
			},


			'ajax.complete': function(evt, response) {
				var data = response.getData();
				var options = response.getOpts();
				var type = options.ref;

				try { _stop(options, response); } catch (er){ }

				if (response.isOK()) {

					if ($.type(data) == 'array') {
						data = data[0];
					}

					if ($.type(data) == 'object') {

						mailru.tokens = mailru.tokens || {};

						/** @namespace data.form_sign_movemsg */
						/** @namespace data.form_token_movemsg */
						/** @namespace data.form_sign_sentmsg */
						/** @namespace data.form_token_sentmsg */
						/** @namespace data.form_sign_bouncemsg */
						/** @namespace data.form_token_bouncemsg */
						/** @namespace data.form_sign_smsverificator */
						/** @namespace data.form_token_smsverificator */
						if (type == 'movemsg' && data.form_sign && data.form_token) {
							mailru.tokens['movemsg'] = {form_sign: data.form_sign, form_token: data.form_token};
						} else if (data.form_sign_movemsg && data.form_token_movemsg) {
							mailru.tokens['movemsg'] = {form_sign: data.form_sign_movemsg, form_token: data.form_token_movemsg};
						}

						if (type == 'sentmsg' && data.form_sign && data.form_token) {
							mailru.tokens['sentmsg'] = {form_sign: data.form_sign, form_token: data.form_token};
						} else if (data.form_sign_sentmsg && data.form_token_sentmsg) {
							mailru.tokens['sentmsg'] = {form_sign: data.form_sign_sentmsg, form_token: data.form_token_sentmsg};
						}

						if (type == 'bouncemsg' && data.form_sign && data.form_token) {
							mailru.tokens['bouncemsg'] = {form_sign: data.form_sign, form_token: data.form_token};
						} else if (data.form_sign_bouncemsg && data.form_token_bouncemsg) {
							mailru.tokens['bouncemsg'] = {form_sign: data.form_sign_bouncemsg, form_token: data.form_token_bouncemsg};
						}

						if (data.form_sign_smsverificator && data.form_token_smsverificator) {
							mailru.tokens['smsverificator'] = {form_sign: data.form_sign_smsverificator, form_token: data.form_token_smsverificator};
						}

						if (data.form_sign_api_v1 && data.form_token_api_v1) {
							mailru.updateToken(data.form_sign_api_v1 + ':' + data.form_token_api_v1);
						}
					}
				}

				checkActiveAccount(response);
			}
		});

		function checkLayer (name, vars) {

			if (mailru.DisabledNoAuthLayer) {
				return;
			}

			ajs.require('{plugins}' + 'LayerManager,{plugins}' + 'Layer', function (name, vars) {
				if ( !LayerMainDiv.getInstance().visible
					 && (
						!mailru.phAuthFormEnabled
						|| !__PH.authForm.isVisible()
					)
				) {
					if (mailru.OldMultiAuthLayerLogic || mailru.newMultiAuthLogic) {
						if (!ajs.blurred) {
							
							$(window).one('authUser.success', function (name, vars, evt, response) {
								if (response.status == 'ok') {
									debug.log('account EXISTS');
								} else {
									var data = response.data, list;
									if (data) {
										list = data.list;
									}
									if (Array.isArray(list)) {
										if (list.length == 1) {
											name = 'changeAccount';
											if( !mailru.phAuthFormEnabled ) {//MAIL-13474
												// only for old changeAccount Layer
												vars = {
													email: list[0]
												};
											}
										}
									}
									LayerManager.show(name, vars);
									debug.log('account NOT EXISTS');
								}
							}.bind(this, name, vars));
							authUser();
						}
					} else {
						LayerManager.show(name, vars);
					}
				}
			}.bind(this, name, vars));
		}

		function checkActiveAccount (response) {
			var data = response.getData();
			var options = response.getOpts();
			var type = options.ref, email;
			if (response && response.isNoAuth()) {
				checkLayer('noAuth');
			} else {
				if (type == 'checknew') {
					if (data && data.username && data.userdomain) {
						email = data.username + '@' + data.userdomain;
					}
				} else {
					email = getMailFromCookie();
				}
				if (email && email != mailru.useremail) {
					checkLayer('changeAccount', {email: email});
				}
			}
		}


		var _req = {}, _isConn = true;

		function _start(o){
			o.pid		= ajs.uniqId();
			o.ref		= _relPath(o.url);
			o.__ts		= ajs.now();
			o.loadPage	= o.loadPage && mailru._loadPageUrl;

			if( o.isUser || o.loading ){
				_req[o.pid] = ajs.sleep(function (){
					_notifyLog(o, 'notify.loading');
					if( o.loading ){
						mailru.Notify.add(typeof o.loading == 'string' ? o.loading : 'load', { delay: 0, group: 'ajax' });
					}

					_req[o.pid] = ajs.sleep(function (){
						_ping(o);
						_notifyLog(o, 'notify.connection.still');
						if( o.loading ){
							mailru.Notify.add((typeof o.loading == 'string' ? o.loading : 'load') + '.still', { delay: 0, group: 'ajax' });
						}

						_req[o.pid] = ajs.sleep(function (){
							_ping(o);
							_req[o.pid] = ajs.sleep(function (){
								_notifyLog(o, 'notify.connection.still.error');
								mailru.Notify.add('connection.still.error', { delay: 0, group: 'ajax' });
							}, 5*60*1000);
						}, 5*1000);
					}, 5*1000);
				}, 1*1000);
			} else {
				_req[o.pid] = ajs.sleep(function (){
					_ping(o);
				}, 8*1000);
			}
		}


		function _stop(o, R){
			ajs.clearSleep(_req[o.pid]);
			delete _req[o.pid];

			var s = R.getStatus(), dt = ajs.now() - o.__ts, _radar;


			// Ajax timing
			if( Math.random() < .1 && o.ref && /messages?|compose|osearch|readmsg|filesearch/.test(o.ref) ){
				mailru.radar('ajax', o.ref.replace(/[^a-z]+/g, '-')+'='+dt);
			}


			if( R.xhrStatus == 200 ){
				if( ~'error parseerror redirect unknown'.indexOf(s) ){
					_radar	= '200_' + s.substr(0, 5);
				}
			}
			else if( R.hasNet() ){
				_radar	= R.xhrStatus;
			}

			if( _radar ){

				mailru.radar('Ajax_error', _radar+'=1', 1);

				// MAIL-8246
				var _xhr = R.getXHR(), _opts = R.getOpts();
				var _log = {
					log: 'ajax_xhrStatus_' + _radar,
					url: _opts.url,
					data: JSON.stringify(_opts.data),
					dataType: _opts.dataType,
					type: _opts.type,
					xstatus: _xhr.status,
					xstate: _xhr.xstate,
					email: mailru.useremail
				};

				if (mailru.ips) {
					_log.ips = mailru.ips.join(',');
				}

				if (_radar == 503) {
					if (Math.rand(1, 100) == 1) {
						_log.ajax_xhrStatus_503_body = _xhr.responseText;
					}
				} else if (_radar == '200_error') {
					if (Math.rand(1, 100) == 1) {
						_log.ajax_xhrStatus_200_error_body = _xhr.responseText;
					}
				}

				if (_xhr.getAllResponseHeaders) {
					_log.headers = _xhr.getAllResponseHeaders();
				}

				new Image().src = '//gstat.' + mailru.staticDomainName + '/gstat?ua=1&logme=' + encodeURIComponent($.param(_log)) + '&r=' + Math.random();
			}

			ajs.log('[ajax.complete] error:', R.isError(), ', net:', R.hasNet(), ', isUser:', o.isUser || o.loading);

			if( o.loadPage && (R.isError() || !R.hasNet()) ){
				$(window).triggerHandler('errorloadpage', [o.loadPage]);
			}

			if( !R.isError() && R.hasNet() && (o.isUser || o.loading || !_isConn) ){
				_isConn = true;
				mailru.Notify.hide('ajax');
				if( !store.disabled ){
					var df = store.get('disconnectNotify');
					if( df > 0 ) (new Image).src = '//rs.' + mailru.SingleDomainName + '/d798187&r='+ajs.now();
					store.remove('disconnectNotify');
				}
			} else if( o.isUser || o.loading ){
				if( !R.hasNet() || s == 'timeout' ){
					mailru.Notify.hide('ajax');
					_ping(o);

				} else if( R.isError() && !o.hideAutoErrors){
					_notifyLog(o, 'notify.error');
					mailru.Notify.add('error', { delay: 10, group: 'ajax' });
				}
			}

			// MAIL-8645
			if( Math.random() < .01 ){
				mailru.gstat([
					  'AJAX_REQUEST'
					, location.protocol.replace(':', '')
					, mailru.realIP || '0.0.0.0'
					, o.ref
					, s
					, dt+'ms'
				].join('-'), 'ua=1');
			}

			// MAIL-4703
			if (R.isOK() && /sentmsg|compose/.test(o.ref) && o.url.indexOf('func_name=send') !== -1) {
				var log = {
					log: 'sentmsgtime',
					time: dt,
					email: mailru.useremail
				};
				new Image().src = '//gstat.' + mailru.staticDomainName + '/gstat?logme=' + encodeURIComponent($.param(log)) + '&r=' + Math.random();
			}
		}


		function _ping(o){
			if( o.loading || o.isUser ){
				$(new Image)
					.attr('src', '//img.' + mailru.staticDomainName + '/0.gif?'+Math.random())
					.bind('error load', function (evt){
						_isConn = evt.type == 'load';
						ajs.log('ping.status:', _isConn ? 'ok' : 'fail');

						if( !_isConn ){
							ajs.clearSleep(o.pid);

							_notifyLog(o, 'notify.connection.error');
							mailru.Notify.add('connection.error', { delay: 0, group: 'ajax' });
							_store(o);
							if( !store.disabled ) store.set('disconnectNotify', 1);
						}

						$(this).unbind();
					})
				;
			}
		}


		function _store(o){
			// < https://jira.mail.ru/browse/MAIL-5337
			if( !store.disabled && o.storeMe && (o.loading || o.isUser) && !o.__store ){
				var key = o.storeMe+'_fail_cnt', cnt = store.get(key)|0;
				o.__store = true;
				store.set(key, ++cnt);
				ajs.log('inc.'+key+':', cnt);
			}
			// https://jira.mail.ru/browse/MAIL-5337 >
		}


		function _notifyLog(o, name){
			var t = new Date;
			t.setTime(ajs.now() - o.__ts);
			_log(name+': '+t.format('I:S.')+t.getMilliseconds()+', '+o.pid+', '+o.url);
		}


		jsCore.ready(function () {

			if (mailru.OldMultiAuthLayerLogic) {
				$(window).bind('visibilitychange', function (evt, hidden) {
					if (!hidden) {
						checkLayer('noAuth');
					}
				});
			}
			// < https://jira.mail.ru/browse/MAIL-9474
			else if (mailru.newMultiAuthLogic && window.__PH) {
				__PH.on('authLost', function(/*e, next*/){
					checkLayer('noAuth', {
						closable: false,
						login: mailru.username,
						domain: mailru.userdomain,
						focus: 'password'
					});
				});

				__PH.on('loginRequest', function(/*e, next*/){
					LayerManager.show('noAuth', {
						changeAccount: true
						, checkLayerMainDiv: true
					});
				});

				__PH.on('authChange', function(){
					location.href = '/messages/inbox';
				});
			}
			// https://jira.mail.ru/browse/MAIL-9474 >
		});

		// alias
		window.Ajax	= mailru.Ajax;
	})();

	jsLoader.loaded('{mailru}mailru.Ajax', 1);

// data/ru/images/js/ru/mailru.Ajax.js end

// data/ru/images/js/ru/utils/mailru.Utils.FileSearch.js start


(function (){
		/**
		 * @class    mailru.Utils.FileSearch
		 */
		var Utils = {
			getTime: function (file){
				return	mailru.FilesSearchData.version ? file.DateShort : Date.parse(file.time * 1000).format('H:I')
			},


			getSubject: function (file){
				return	file.subject || '<'+ Lang.get('message.email.untitled') +'>';
			},


			canPreview: function (file){
				return	file.content_type_id == 1 && !/^tiff?$/i.test(this.getFileExtention(file));
			},

			isGraphicPreview: function (file) {
				var ext = this.getFileExtention(file);
				return (mailru['MRVMSGraphicPreview'] && (ext == "psd" || ext == "tga" || ext == "ai" || ext == "tif" || ext == "tiff" || ext == "eps"));
			},

			isOfficePreview: function(file) {
				var ext = this.getFileExtention(file);
				return ((mailru['MRVMSDocPreview'] || mailru['MRVMSPptPreview'] || mailru['MRVMSExcelPreview']) && (ext == 'doc' || ext == 'docx' || ext == 'xls' || ext == 'xlsx' || ext == 'ppt' || ext == 'pptx'));
			},

			getThumbnailSrc: function (file){
				var url = '';

				if (this.isGraphicPreview(file) || this.isOfficePreview(file)) {

					url = '//docs.' + (mailru.SingleDomainName || 'mail.ru') + '/preview/160x120/?' + ajs.toQuery({
						src: this.getDownloadUrl(file.Id, file.name)
					});

				} else if (this.canPreview(file)) {

					var params = {
						  id:		file.Id
						, fx:		160
						, fy:		120
						, mode:		'attachment'
						, channel:	''
						, preview:	1
					};

					if (mailru.exif) {
						params.exif = 1;
					}

					url = '//apf.'+ (mailru.SingleDomainName || 'mail.ru') +'/cgi-bin/readmsg/'+ encodeURIComponent(file.name) +'?'+ $.param(params);
				}

				return	url;
			},


			getFileExtention: function(file) {
				return	file.name.replace(/^(.*)\./, '').toLowerCase();
			},


			getPreviewHref: function (file){
				var result = '', params;

				/** @namespace mailru.NewAttachViewerPopup  --  открыть в попапе */
				if( mailru.NewAttachViewer && mailru.NewAttachViewerPopup ){
					if( file ){
						if( file.Id ){
							params = {
								  id:	file.Id.replace(/;\d+;\d+$/, '')
								, _av:	file.Id
								, file:	file.name
							};
							result = '/attaches-viewer/?' + $.param(params);
						}
					}
				}
				else {
					var ext = this.getFileExtention(file), type = '', mode = '';

					if( ext == 'doc' || ext == 'docx' || ext == 'wpd' || ext == 'wps' || ext == 'rtf' ){
						type = 'doc';
					}
					else if( ext == 'xls' || ext == 'xlsx' ){
						type = 'excel';
					}
					else if( ext == 'ppt' || ext == 'pptx' || ext == 'pps' ){
						type = 'pp';
					}

					if( type == 'doc' || type == 'excel' || type == 'pp' ){
						mode = 'msv';
					}
					else {
						mode = 'attachment';
					}

					if( mode ){
						params = {
							  id:		file.Id
							, type:		type
							, file:		file.name
							, mode:		mode
							, channel:	''
						};
						result = '/cgi-bin/getattach?' + $.param(params);
					}
				}

				return result;
			},


			getFilesSize: function (files){
				var size = 0;
				ajs.each(files, function (item){ size += item.size; });
				return	size;
			},


			getDownloadUrl: function (id, name){
				return location.protocol + '//' + mailru.MainMailHost + '/cgi-bin/getattach?' + $.param({
					  id:		id
					, file:		name
					, mode:		'attachment'
					, channel:	''
					, notype:	1
				});
			},


			download: function (files){
				/** @namespace mailru.FilesSearchData.attach_host */
				if (files.length) {
					var size = this.getFilesSize(files);

					if( size > mailru['MaxAttachmentSize'] ){
						var error = Lang.get('FileSearchDownloadSizeLimit');
						mailru.Notify.add('error', { text: error });
					}
					else {
						var params = {
							  partids:	ajs.map(files, function (file){ return file.id }).join('_')
							, mode:		'attachment'
							, fname:	'attachments_' + (new Date).format('D-M-Y_H-I-S')
						};
						var url = '//' + mailru.FilesSearchData.attach_host + '/cgi-bin/getattachment?' + $.param(params);
						window.open(url);
					}
				}
			},


			forward: function (files){
				/** @namespace mailru.v2 */
				if (files.length) {
					var ids = ajs.map(files, function (file){ return file.id });
					var url = mailru.getPageURL('compose', { id: ids, mode: 'forward' });
					var size = this.getFilesSize(files);
					if( size > mailru['MaxAttachmentSize'] ){
						var error = Lang.get('FileSearchForwardSizeLimit');
						mailru.Notify.add('error', { text: error });
					}
					else if( mailru.v2 ){
						jsHistory.set(url)
					}
				}
			},


			openViewer: function (fileId){
				var
					url = '/attaches-viewer/?' + $.param({
						  id: fileId.replace(/;\d+;\d+$/, '')
						, _av: fileId
						, 'x-email': mailru.useremail
					})
				;

				try {
					var w = open(url);
					w.focus();
				}
				catch(e){}
			}
		};


		// @export
		mailru.Utils.FileSearch = Utils;
	})();

	jsLoader.loaded('{mailru.utils}mailru.Utils.FileSearch', 1);

// data/ru/images/js/ru/utils/mailru.Utils.FileSearch.js end

jsClass
		.create('mailru.Messages')
		.statics({

		hash:	{},
		page:	{},
		data:	{},
		redraw:	{},
		onPage:	{},
		folder: {},
		radar:	createRadar('mailru_Messages'),
		_search:{},
		_fileSearch:{},

	// @private
		_cleanMemory: function ()
		{
			if( mailru.isMsgList && 0 )
			{
				var mId, fId, ids;
				for( mId in this.data )
				{
					fId	= this.data[mId].FolderId;
					ids	= this.onPage[fId];

					if( (ids === undef) || Array.indexOf(ids, mId) == -1 )
					{
						$('#MSG'+mId).remove();
						delete	this.data[mId];
					}
				}
			}
		},


	// @public
		set: function (fId, List, hash, force, fields){
			var onPage	= (this.folder[fId] || []).length;

			if( !force ){
				if( onPage != List.length ){
					force = true;
				}
				else {
					onPage = this.onPage[fId];
					for( var i = 0, n = List.length, M; i < n; i++ ){
						M	= this.get(onPage[i]);
						if( M === undef || List[i].Id != M.Id || List[i].FolderId != M.FolderId ){
							force	= true;
							break;
						}
					}
				}
			}

			this.hash[fId]	= hash;
			this.page[fId]	= Math.max(parseInt(GET.page || 1), 1);
			this.folder[fId] = [];
			this.onPage[fId] = []; // id message on page for garbage collector


			Array.forEach(List, function (X, i){
				this.folder[fId][i] = X = this.upd(X.Id, X, null, fields);
				this.onPage[fId][i]	= X.Id;

				delete	X._tcrc;
//				if( GET.id == X.Id ) mailru.Events.fire('update.message', [X.Id, X, GET]);
			}, this);


//			Timeout.set(this.classUniqId+'cleanMemory', $DS(this, '_cleanMemory'), 1000);

			if( force && (force !== 1) ) // 1 -- onlySet
			{
				mailru.Events.fire('update.messages', this.folder[fId], { FOLDER_ID: fId });
				return	true;
			}

			return	false;
		},

		setFilesSearch: function (fId, List, hash, force) {
			this.folder[fId] = [];
			this.hash[fId]	= hash;
			Array.forEach(List, function (X, i) {
				this.folder[fId][i] = this.upd(X.Id, X);
			}, this);
			mailru.Events.fire('update.messages', this.folder[fId], { FOLDER_ID: fId });
		},

		getByFolder: function (id, page){
			if( !(id in this.folder) ) this.folder[id] = [];
			if( page && page != this.page[id] ) return [];
			return	[].concat(this.folder[id]);
		},

		get: function (id, def)
		{
			if( id && (typeof id !== 'string') )
			{
				var models = Array.map(id, function (X){ return this.data[X]; }, this);
				return	Array.filter(models, function (X){ return (X && X.Id); });
			}
			return	this.data[id] || def;
		},

		getSafe: function (id){
			return  this.get(id, { Id: id });
		},

		upd: function (id, data, safe, fields){
			var M = this.get(id), radar = Math.random() < .2;

			if( data.PrevId === "" && radar ) mailru.radar('msgfail', 'PrevId_empty=1');
			else if( data.PrevId === void 0 && radar ) mailru.radar('msgfail', 'PrevId_undef=1');

			if( data.NextId === "" && radar ) mailru.radar('msgfail', 'NextId_empty=1');
			else if( data.NextId === void 0 && radar ) mailru.radar('msgfail', 'NextId_undef=1');

			if (M) {
				// MAIL-15389
				if (fields) {
					var extra_data = {};
					Array.forEach(fields, function (name) {
						extra_data[name] = data[name];
					});
					data = extra_data;
				} else if (M._load_by_message) {
					delete data.To;
					delete data.ToShort;
					delete data.ToList;
					delete data.From;
					delete data.FromShort;
					delete data.FromList;
				}
			} else {
				M = new mailru.Message({ Id: id }, { silent: true });
			}

			this.data[id] = M;

			M.set(data, false, safe);

			return	M;
		},


		getHash: function (fId){
			return	this.hash[fId];
		},


		load: function (params, preload, read){
			// @todo: Refactoring this method

			if( !(params && params.id) ) return;
			if( typeof params === 'string' ) params = { id: params };

			var Msg = this.get(params.id) || mailru.Message.Empty;
			var key = params.bulk_show_images+'';
			var doneFn = ajs.F;

			if( $.isFunction(preload) ){
				doneFn = preload;
				preload = void 0;
				if( Msg._loaded ){
					doneFn(null, Msg);
				}
			}


			/*
			if( Msg.thread && !mailru.Threads.get(Msg.thread) ){
				mailru.Threads.find({ id: Msg.thread }, function (){
					mailru.Messages.load(params, preload, read);
				});
				return;
			}
			*/

			if( params.force || (Msg._key != key) ){
				if( Msg._loaded ) preload = 0;
				Msg._key	= key;
				Msg._crc	= null;
				Msg._loaded	= 0;
			}

			if( !(Msg._loading || Msg._loaded) || (!preload && (preload !== void 0)) ){
				mailru.log('message.load', Msg.Id);
				mailru.ReadMsg.radar('request');

				this.upd(params.id, { _loading: 1, _preload: true });

				var ajaxData = {
					  url:		'/message/?ajax_call=1&func_name=get_messages_by_id&no_rnb=Y&now='+ now()
					, data:		ajs.extend({
									  multi_msg_prev:	0
									, multi_msg_past:	0
									, sortby:			mailru.messagesSort
									, NewAttachViewer:	+mailru.NewAttachViewer
									, AvStatusBar:		+mailru.AvStatusBar
									, let_body_type:	'let_body_plain'
									, log:				+(params.id == GET.id)
									, bulk_show_images:	~~params.bulk_show_images
									, folder:			mailru.getFolderId()
								}, params, { read: read ? params.id : 0 })
					, storeMe:  'readmsg'
					, loading:	(params.loading || params.id == GET.id) && 'load'
					, loadPage:	(params.id == GET.id)
					, complete:	this._messagesLoaded.bind(this, key, doneFn)
				};

				if (mailru.IsReadmsgToMessage) {
					mailru.API($.extend(true, ajaxData, {
						url: 'messages/message',
						convertResultToOldApi: true,
						data: {
							htmlencoded: false
						}
					}));
				} else {
					mailru.Ajax(ajaxData);
				}
			}
			else if( Msg._loaded && preload ){
				// Disabled preload
				for( var i = 0, id; i < preload; i++ ){
					Msg	= this.get(id = Msg[mailru.isClickOnPrev ? 'PrevId' : 'NextId']) || mailru.Message.Empty;
					if( Msg.Id && !Msg._loaded || (!Msg.Id && id) ){
						this.load($E({}, params, { id: Msg.Id || id, sm: 0 }), preload - (i + 1));
						break;
					}
				}
			}


			return	this.get(params.id);
		},

		_messagesLoaded: function (key, doneFn, R){
			var opts = R.getOpts().data;

			mailru.ReadMsg.radar('request', 1);

			if( R.isOK() ){
				var Messages = R.getData() || [], X = Messages[0];

				if( X ){
					if( X.AccountVerified == 0 && !this.__verifyPhoneNotify && mailru.VerifyPhoneNotify ){
						// https://jira.mail.ru/browse/MAIL-4527
						this.__verifyPhoneNotify = 1;
						ajs.require('{plugins}LayerManager', function(){
							LayerManager.verifyPhoneNotify('#VerifyPhoneNotify');
						});
					}

					if( X.NoMSG == 1 ){
						mailru.log('message.load.NoMSG', { id: opts.id, xhr: R.getResponseText() });
						mailru.Notify.add('error', { subtype: 'nomsg' });
						doneFn('nomsg', null, R);
					}
					else if( X.Id ){
						Array.forEach(Messages, function (data) {

							data.FromList = data.FromFull;

							var msg = this.upd(data.Id, data, GET.id != data.Id);

							if (/*MAIL-6195*/opts.sm || /*MAIL-4170*/opts.id.indexOf('f') === 0) {
								this.upd(opts.id, $.extend(msg, { _loaded: 1 }));
							}

							msg._key		= key;
							msg._loading	= 0;
							msg._load_by_message = 1;
							msg._loaded		= 1;

							mailru.log('message.load.success', opts.id);
							mailru.Events.fire('update.message', [msg.Id, msg, opts]);

							doneFn(null, msg, R);
						}, this);
					}
					else {
						this.upd(opts.id, { _loaded: 0 });
						mailru.log('message.load.unknown', { id: opts.id, xhr: R.getResponseText() });
						mailru.Notify.add('error');
						doneFn('error', null, R);
					}
				}
			}
			else {
				mailru.log('message.load.error', { id: opts.id, xhr: R.getResponseText() });
				doneFn('server_error', null, R);
				this.upd(opts.id, { _loaded: 0 });
			}

			this.isLoading	= false;
			this.upd(opts.id, { _loading: 0 });
			mailru.Events.fire('loaded.messages');
		},


		getSearchCacheKey: function (data){
			return	ajs.toQuery(data);
		},

		hasSearchCache: function (data){
			return	!!this.getSearchCache(data);
		},

		getSearchCache: function (data){
			return	this._search[this.getSearchCacheKey(data)];
		},

		addSearchCache: function (data, Data){
			this._search[this.getSearchCacheKey(data)]	= Data;
		},

		resetSearchCache: function (){
			this._search = {};
		},

		loadSearch: function (params, noCache, noLoading) {
			// https://jira.mail.ru/browse/MAIL-9629?focusedCommentId=523789&page=com.atlassian.jira.plugin.system.issuetabpanels:comment-tabpanel#comment-523789
			// MAIL-9629: q_query: '*' -> q_query: ''

			var df = $.Deferred();
			var query = ajs.toQuery(ajs.extend({ q_query: '' }, params));

			if( this._searchQ == query ){
				return this._searchDefer;
			}

			this._searchQ = query;
			this._searchDefer = df;

			var loaded = function (R){
				if( R ){
					this._searchQ = null;
					mailru.Events.fire('beforeloaded.search', R);

					if( R.isOK() ){
						var Data = mailru.SearchData = R.getData()
							, fId = mailru.Folders.getSearch(params.q_folder).Id
						;

						this.addSearchCache(params, R);
						this.set(fId, Data.messages, ajs.now(), true, ["SearchFrom", "SearchSubject", "SearchSnippet"]);

						if( mailru.isFilterFolder(fId) ){
							mailru.Folders.upd(fId, { Messages: Data.search.count });
						}

						df.resolve({ data: Data, models: this.getByFolder(fId) });
						documentView.redraw();
					}

					mailru.Events.fire('loaded.search', R);
				}
			}.bind(this);


			if( this._searchXHR ){
				this._searchXHR.abort();
			}

			this._searchXHR	= mailru.Ajax({
				  url:		'/search/?json=Y'
				, data:		ajs.toObject(query)
				, complete:	loaded
				, loading:	!noLoading && !this.hasSearchCache(params) && 'load'
			});

			if( !noCache ){
				loaded(this.getSearchCache(params));
			}

			return	df;
		},

		prepareFileSearchParams: function (data) {
			var params = {
				folder_id: 0,
				content_type_id: -1,
				offset: mailru.filesPerPage * ((data.page || 1) - 1),
				limit: mailru.filesPerPage,
				name_needle: data.q_query || ''
			};

			if (data.only_hidden != 1) {
				delete data['only_hidden'];
			}

			if (!defined(data.only_hidden) && !defined(data.q_query)) {
				params.folder_id = 0;
			}

			return $.extend(params, data);
		},

		getFilesSearchCacheKey: function (data){
			return ajs.toQuery(this.prepareFileSearchParams(data));
		},

		hasFilesSearchCache: function (data){
			return !!this.getFilesSearchCache(data);
		},

		getFilesSearchCache: function (data){
			return this._fileSearch[this.getFilesSearchCacheKey(data)];
		},

		addFilesSearchCache: function (data, Data){
			this._fileSearch[this.getFilesSearchCacheKey(data)]	= Data;
		},

		loadFilesSearch: function (params, noCache, noLoading) {
			params = this.prepareFileSearchParams(params);

			var df = $.Deferred();
			var query = ajs.toQuery(params);

			if( this._filesSearchQ == query ){
				return	this._filesSearchDefer;
			} else {
				this._filesSearchQ = query;
				this._filesSearchDefer = df;
			}

			var loaded = function (R){
				if( R ){
					this._filesSearchQ = null;
					mailru.Events.fire('beforeloaded.fileSearch', R);

					if( R.isOK() ){

						var folderId = mailru.Folder.FILESEARCH,
							Data = mailru.FilesSearchData = $.extend({
								total: 0,
								cnt: 0,
								list: []
							}, R.getData() || {});

						ajs.each(Data.list, function (file) {
							file.Id = [file.id].concat(file.n).join(';');
							file.FolderId = folderId;
						});

						this.addFilesSearchCache(params, R);
						this.setFilesSearch(folderId, Data.list, now(), true);

						df.resolve({ data: Data, models: this.getByFolder(folderId) });
						documentView.redraw();
					}

					mailru.Events.fire('loaded.fileSearch', R);
				}
			}.bind(this);

			if (this._fileSearchXHR) {
				this._fileSearchXHR.abort();
			}

			this._fileSearchXHR = mailru.Ajax({
				  url:		'/cgi-bin/filesearch_ajax?ajax_call=1&func_name=ajax_search'
				, data:		params
				, loading:	!noLoading && !this.hasFilesSearchCache(params) && 'load'
				, complete:	loaded
			});

			if( !noCache ){
				loaded(this.getFilesSearchCache(params));
			}

			return	df;
		},

		_moveTo: function(to, models, complete) {
			var $Form = mailru.View.Messages.getActive().getForm();

			if (mailru.isReadMsg)
				$Form.append('<input value="' + models[0].Id + '" name="id" type="hidden" />');

			if ( to == 'new' )
			{
				// MAIL-9803
				if (mailru.SettingsOn)
				{
					mailru.API.post('tokens', function (R)
					{
						var token = String(R.getBody().token).split(':');

						LayerManager.show('settings__folders__edit', {
							url: '/cgi-bin/settings/ajax_settings?ajax_call=1&func_name=edit',
							tokens: token,

							foldersList: ajs.filter(mailru.Folders.getAll(), function (folder) {
								return !folder.IsSubfolder;
							}),

							cancel: function (){
								(complete || ajs.F)(new mailru.Ajax.Result);
							},

							success: function($form, toFolderId){
								mailru.Folders.upd(toFolderId, { Name: $form.toObject().Name });
								mailru.Messages.edit('move', models, toFolderId, complete);
							}
						});
					});
				}

				//$Form.find('.js-InpToFolderId').val(to);
				//$Form.find('.js-MainMoveBtn:first').click();
			}
			else {
				$Form.find('.js-InpMoveTo').val(to);
				$Form.find('.js-MainBookfilterBtn:first').click();
			}

			return	true;
		},

		confirmSpam: function (id, data){
			// MAIL-10705 for emails from ab, show popup for confirmation
			var isInAb = false;
			var M = this.get(id); // get messages
			var defer = $.Deferred();

			if (mailru.isReadMsg && mailru.ListUnsubscribeEnabled && M[0].ListUnsubscribe) {
				// show popup unsubscripe or add to spam
				LayerManager.show('listUnsubscribe', { // ask for confirmation
					from: (M[0].FromName || M[0].From),
					success: function(status)
					{
						if (status == true) { // клик на "отписаться"
							mailru.Messages.edit('unsubscribe', id, data);
							Counter.sb(1611231);
						}
						else if (status === false) { // клик на "спам"
							mailru.Messages.edit('spam', id, data);
							Counter.sb(1678289);
						}
					}
				});
				Counter.d(1611231);
				Counter.d(1678289);
			}
			else {
				// check if some emails are in addressbook and show confirm popup for them
				// get addressbook
				$R('{mailru}' + 'mailru.Balloon', function() {
					mailru.Balloon.getAddressBookData(function(abdata) {
						var email;
						var users = [];

						var idToSpam = [],
							idConfirm = [];

						Array.forEach(M, function (X) { // check from email
							email = X.From;
							if (email != '' && mailru.Balloon.inArray(email, abdata)) {
								isInAb = true; // email is in adressbook
								idConfirm.push(X.Id);
								var isUnique = true;
								Array.forEach(users, function (X) { if(email == X.From){ isUnique = false; return; } });
								if (isUnique)
									users.push(X); // store unique emails
							}
							else {
								// move to spam immediately
								idToSpam.push(X.Id);
							}

						});

						if (isInAb) { // some email are in adressbook
							LayerManager.show('confirmSpam', { // ask for confirmation
								users: Array.map(users, function (X){ return X.FromFull || X.FromList; }),
								success: function(status)
								{
									if (status === false) { // mark as spam
										mailru.Messages.edit('spam', idConfirm, data);
										Counter.sb(1345884); // клик на "да"
									}
									else if (status == true) {
										Counter.sb(1345885); // клик на "нет"
									}
									else {
										Counter.sb(1345883); // закрытие попапа
									}
								}
							});
							Counter.d(1345881); // показ попапа
							if(idToSpam.length > 0) {
								mailru.Messages.edit('spam', idToSpam, data, defer.resolve);
							}
						}
						else { // mark as spam immediately
							mailru.Messages.edit('spam', id, data, defer.resolve);
						}
					});
				});
			}


			return defer;
		},

		edit: function (type, id, data, complete){
			if( typeof id === 'string' ) id = [id];

			if( id[0] && id[0].id ){
				id = Array.map(id, function (x){ return x.id });
			}

			var
				  u /* url */
				, d		= {} /* data */
				, r		= false /* Updater.reload */
				, M		= this.get(id) /* get messages */
				, _args	= arguments
				, sl = 0 /* statusLine */
				, View = mailru.View.Messages.getActive()
				, isUser = true // is user action
				, reloadBanners = false
			;

			var countProcessing = M && M.length;

			if( !countProcessing ){
				if( $.isFunction(complete) ){
					complete(new mailru.Ajax.Result);
				}
				return;
			}

			mailru.Folders.transaction(true);

			switch( type )
			{
				case 'redirect':
				{
					u	= '/cgi-bin/bouncemsg?func_name=ajax_bounce_msg';
					d	= data;
				}
				break;

				case 'bookfilter':
				{
					if( data == 'blist' ) return this._moveTo(data, M, complete);

					u				= '/cgi-bin/movemsg';
					sl				= 1;
					d.id			= id;
					d.moveto		= sl = 'abook';
					d.bookfilter	= 1;
				}
				break;

				case 'mark':
				case 'move':
				case 'spam':
				case 'unsubscribe':
				case 'read':
				case 'remove':
				{
					var F	= mailru.Folders.getSafe();

					if( type == 'read' ){
						// Mark as readed
						data	= mailru.Message.READ;
						isUser  = false;
					} else {
							reloadBanners	= true;
					}

					r	= true; // Updater.reload
					sl	= type; // Set status line by action

					if( !M.length ) return;
					if( data == 'new' ) return this._moveTo(data, M, complete);

					if( type == 'read' ){
						sl		= 0;
						type	= 'mark';
					}

					if( type == 'mark' ){
						var a = 0, um = 0, flag, unread, uf = 0;
						d.markmessage = data;

						Array.forEach(M, function (X)
						{
							switch( data )
							{
								case mailru.Message.FLAG:	if( !X.Flagged ){ uf++; X.set('Flagged', 1); flag = 1; } break;
								case mailru.Message.NOFLAG:	if( X.Flagged ){ uf++; X.set('Flagged', 0); flag = 0; } break;

								case mailru.Message.READ:
									if( X.isUnread() ){
										mailru.log('message.set.read', { id: X.id });
										um--;
										X.set('Unread', 0);
										unread = 0;
										if( mailru.Folders.getSafe().id == 950)
											Counter.sb(mailru.HideSpamCounterOnTheLeftCol ? 1563667 : 1563664);
									}
									break;
								case mailru.Message.UNREAD:	if( !X.isUnread() ){ um++; X.set('Unread', 1); unread = 1; } break;
							}
						});

						countProcessing	= Math.abs(um || uf);
						F.set('Unread', Math.max(F.Unread + um, 0));

						// Reload messages
						if( countProcessing > 0 )
						{
							//this.reload(F.Id, true);
						}
						else if( !mailru.isReadMsg )
						{
							return;
						}
					}
					else
					{
						View && (View._clearCBX = true);

						if( type == 'spam' || type == 'unsubscribe' )
						{
							if( data === false )
							{	// Is not spam
								type		= 'move';
								d.nospam	= 1;
								d.folder	= mailru.Folder.INBOX;
								if (mailru.isReadMsg && mailru.ListUnsubscribeEnabled && M[0].ListSubscribe)
									d.subscribe = 1;
							}
							else
							{	// Is spam
								$E(d, data);
								d.email		= '["'+ Array.map(M, function (X){ return X.From; }).join('","') +'"]';
								d.confirm	= 'on';
								d.folder	= F.isTrash() ? '' : ((d.delorig == 'on') ? mailru.Folder.BULK : M[0].FolderId);
								d.spamabuse	= 1;
								if (type == 'unsubscribe')
									d.unsubscribe = 1;
							}
						}
						else if( F.isTrash() && (data == F.getId()) )
						{	// Remove msg from Trash or Spam folder
							d.remove	= 1;
							d.folder	= -1;
						}
						else if ( type == 'remove' )
						{
							type = 'move';
							d.remove = 1; // MAIL-1867?
							d.folder = mailru.Folder.TRASH
						}
						else
						{
							d.folder	= data;
						}

						// MAIL-1867
						if (type == 'move' && data == mailru.Folder.TRASH) {
							d.remove = 1;
						}

						if( F.isTrash() ) d.confirm = 'on';

						var cm	= M.length;
						var um	= 0;

						// Change folderId and calc unread messages
						Array.forEach(M, function (X){
							if( d.folder !== '' ){
								X.FolderId	= (type == 'remove' && d.confirm == 'on') ? -1 : d.folder;
								um	+= X.isUnread();
							}
							View._scbx && (View._scbx[X.Id] = false); // @FixMe remove selected state
						});


						// Rebuild msg list by folderId
						var arr = [], i = 0, deleted = 0;
						if( this.folder[F.Id] && (mailru.isMsgListPage() || mailru.isReadMsgPage()) ){
							Array.forEach(this.folder[F.Id], function (X){
								if( X.FolderId == F.Id ){
									arr.push(X);
									if( i ){
										X.PrevId = arr[i-1].Id;
										arr[i-1].NextId = X.Id;
									}
									else {
										X.PrevId = X.NexId = 0;
									}
									i++;
								}
								else {
									deleted++;
								}
							});

							if( !mailru.v2 && false ){
								// false -- https://jira.mail.ru/browse/MAIL-15430
								// этот параметр должен обновлять checknew
								this.folder[F.Id] = arr;
							}
						}

						F.set({
							  'Unread':		Math.max(F.Unread - um, 0)
							, 'Messages':	Math.max(F.Messages - cm, 0)
						});

						var T = mailru.Folders.get( d.folder );
						if( T && (T.Id == M[0].FolderId) ){
							if( T.isBulk() || (mailru.readMsgAfterDelete && T.isTrash()) )
							 	um = 0;

							T.set({
								  'Unread':		Math.max(T.Unread + um, 0)
								, 'Messages':	Math.max(T.Messages + cm, 0)
							});
						}


						// Remove messages
						if( deleted ){
							if (mailru.isReadMsg) { // MAIL-12195
								Array.forEach(M, function (M) {
									$('#'+View.idMsgPrefix + M.Id.replace(/(:|;|\.)/g, '\\$1')).remove();
								});
							} else {
								if( View.$CurSelCBX ) Array.forEach(View.$CurSelCBX, function (cbx){
									$('#'+View.idMsgPrefix + cbx.value.replace(/(:|;|\.)/g, '\\$1')).addClass('messageline_disabled');
								});
							}
							View.show([F.Id, F.Id]);
						}

						// Set active folder
						mailru.Folders.setId( F.Id, true );

						if( mailru.isReadMsgPage() ){
							var nId = M[0].NextId, fId = mailru.getFolderId();

							setTimeout(function (){
								mailru.Updater.stop();
								var url = '/messages', id = fId;
								switch (parseInt(id,10)) {
									case 0	    : url += '/inbox'; break;
									case 950    : url += '/spam'; break;
									case 500000 : url += '/sent'; break;
									case 500001 : url += '/drafts'; break;
									case 500002 : url += '/trash'; break;
									case 500003 :
									case 500005 : url = '/agent/archive'; break;
									default     : url += '/folder/' + id;
								}
								/** @namespace mailru.msgListAfterDelete -- return to current folder */
								if( (type == 'spam' || type == 'unsubscribe') && (mailru.msgListAfterDelete || !nId) ){
									jsHistory.set(url);
								}
								else if( !nId || (type == 'move' && T && T.isTrash() && mailru.msgListAfterDelete) ){
									jsHistory.set(url);
								}
								else {
									jsHistory.set(mailru.getPageURL('readmsg', { id: nId }));
								}

								mailru.Updater.start();
							}, 5);
						}
					}

					if (data == 'fileInArchive') {
						u = '/cgi-bin/filesearch_ajax?func_name=ajax_hide';
					} else if (data == 'fileFromArchive') {
						u = '/cgi-bin/filesearch_ajax?func_name=ajax_unhide';
					} else {
						u = (type != 'spam' && type != 'unsubscribe') ? '/cgi-bin/movemsg' : '/cgi-bin/spamabuse';
					}

					d.id	= id;
					d[type]	= 1;
				}
				break;

				case 'ExpandMode':
					u	= '/cgi-bin/ajax_avatarstat/?func_name=set_expanded_msglist&data=["'+ +data +'"]';
					sl	= 0;
					r	= true;
				break;
			}

			if( u ){
				// Send ajax action
				if( sl == 'move' ){
					if( M[0].FolderId == mailru.Folder.TRASH ) sl = 'move2Trash';
					else if( M[0].FolderId == -1 ) sl = 'remove';
				} else if( sl == 'mark' && countProcessing < 2 ){
					sl	= 0;
				}

				var txt = countProcessing ? Lang.get('Messages').Actions[sl] : 0;

				if( txt && countProcessing ){
					if( sl == 'mark' ){
						txt = txt.replace('%s', String.num(countProcessing, Lang.get('Messages').letter, ' '));
					}
					else {
						if (data == 'fileInArchive' || data == 'fileFromArchive') {
							txt = String.num(countProcessing, Lang.get('Files').file, ' ') + ' ' +
								  String.num(countProcessing, Lang.get('Files').Actions[data]);
						}
						else if ( sl != 'unsubscribe' ) {
							var letters = String.num(countProcessing, Lang.get('Messages').letter, (sl != 'remove' && countProcessing == 1) ? false : ' ');

							txt = txt.replace('%s', String.ucfirst(letters));

							if ( sl == 'move' || sl == 'spam' ) {
								var folder = mailru.Folders.get(M[0].FolderId, {
									Name: Lang.get('folders.names')[sl]
								});

								txt = txt.replace('%s', ajs.Html.escape(folder.Name));
							}
						}

						View.statusLine('alert', txt);
					}
				}

				d.noredir	=
				d.ajaxmode	=
				d.ajax_call	= 1;

				if( r && mailru.Updater ){
					// Stop updater
					// MAIL-10755 (disabled) -- mailru.Updater.stop();
				}

				// Abort "Updater" if him running
				mailru.Updater.abort();

				mailru.API.ajax({
					  url: u
					, type: 'POST'
					, data: d
					, isUser: isUser
					, complete: this._editComplete.bind(this, {
									  ids: id
									, reload: r
									, text: txt
									, type: type
									, args: _args
									, bnrs: reloadBanners
									, complete: complete
								})
				});
			}

			return	countProcessing;
		},

		_editComplete: function (opts, R){
			if( opts.reload && mailru.Updater ){
				if( mailru.isMsgListPage() ){
					// Start updater
					clearTimeout(this._updaterId);
					this._updaterId = setTimeout(function (){
						if( ~'mark read'.indexOf(opts.type) ){
							mailru.Banners.View.reload();
						} else {
							mailru.Updater.start(mailru.isMsgListPage(), { bnrs: opts.bnrs ? 'Y' : 'N' });
						}
					}, 500);
				}

				if( mailru.isReadMsgPage() ){
					if( !mailru.threads && ~'move remove spam'.indexOf(opts.type) ){
						this.load(ajs.extend({ force: true }, GET));
					}
				}
				else if( (mailru.isSearchPage() || mailru.isFilterFolder()) && !mailru.v2 ){
					this.loadSearch(GET, true, true);
				}
				else if (mailru.isFileSearchPage()) {
					this.loadFilesSearch(GET, true, true);
				}
			}

			if( R.isAccessDenied() ){
				mailru.Layers.secure(R.getData().Folder, function (access){
					var $List = mailru.View.Messages.getActive().getView().find('.messageline_disabled');
					if( access ){
						// Retry request
						this.edit.apply(this, opts.args);
					} else {
						$List.removeClass('messageline_disabled');
					}
				}.bind(this));
			}
			else if( R.isOK() ) {
				mailru.Folders.transaction(false);

				if( opts.text ){
					mailru.Notify.add('ok', { text: opts.text, group: 'move' });
				}
			}

			mailru.Folders.rollback();

			(opts.complete || ajs.F).call(this, R);
			$(window).trigger('complete-movemsg.mailru', [R, opts]);
		},


		forEach: function (ids, func, This){
			var i = 0, n = ids.length, M;
			for( ; i < n; i++ ) if( M = mailru.Messages.get(ids[i]) ){
				func.call(This, M, i);
			}
		},

		map: function (ids, func, This){
			var result = [];
			this.forEach(ids, function (M){ result.push( func.call(This, M) ); });
			return	result;
		},

		hasCache: function (params){
			var M = this.get(params.id);
			return	M && M.isLoaded();
		},

		convertThreads: function (array){
			var ret = [], i = 0, n = array.length, msg, date, emails, flags;

			for( ; i < n; i += 1 ){
				msg		= array[i];
				date	= Date.parse(msg.date * 1000);
				flags	= msg.flags;
				emails	= msg.correspondents;

				ret[i] = {
					  Id:			msg.id
					, SPF:			ajs.isset(flags.spf, true)
					, FolderId:		msg.folder
					, PrevId:		msg.prev
					, NextId:		msg.next
					, Unread:		flags.unread
					, Flagged:		flags.flagged
					, Priority:		msg.priority || 3
					, Reply:		flags.reply
					, Forward:		flags.forward
					, Attachment:	flags.attach
					, From:			emails.from[0] && emails.from[0].email
					, FromList:		ajs.map(emails.from, function (item){ return item.name+' <'+item.email+'>'; }).join(', ')
					, FromShort:	ajs.map(emails.from, function (item){ return item.name || item.email; }).join(', ')
					, To:			emails.to[0] && emails.to[0].email
					, ToList:		ajs.map(emails.to, function (item){ return item.name+' <'+item.email+'>'; }).join(', ')
					, ToShort:		ajs.map(emails.to, function (item){ return item.name || item.email; }).join(', ')
					, Cc:			ajs.map(emails.cc, function (item){ return item.name+' <'+item.email+'>'; }).join(', ')
					, Date:			date.format('d n Y, H:I')
					, DateShort:	date.isToday() ? date.format('H:I') : date.format('d n')
					, DateUTS:		msg.date
					, Subject:		msg.subject
					, ReSentTo:		""
					, ReSentFrom:	""
					, ReSentDate:	""
					, ReSendComment:""
					, IcoFromWho:	""
					, Size:			msg.size
					, FilinN:		0
					, FilinEM:		0
					, Microformat:	{ text: msg.snippet }
					, AvatarUrl:	emails[0] && emails[0].avatars && emails[0].avatars['default']

					, thread:		msg.id
					, threadLength:	msg.length
				};
			}

			return	ret;
		}

	});
	// mailru.Messages



	mailru.Messages.saveCompactViewState = function (state){
		function saveCompactMode(mode, form_sign, form_token) {
			mailru.Ajax({
				url: '/settings/ajax_settings?ajax_call=1&func_name=set_msglistflags&flag=compact_msglist&val=' + mode,
				type: 'GET',
				data: { form_sign:  form_sign, form_token: form_token }
			});
		}

		var tokens = mailru.tokens['ajax_settings'];
		if( tokens && tokens['form_sign'] && tokens['form_token'] ){
			saveCompactMode(+!!state, tokens['form_sign'], tokens['form_token']);
		}
		else {
			mailru.API.post('tokens', function (result){
				if( result.isOK() ){
					var tokens = String(result.getBody().token).split(':');
					mailru.tokens['ajax_settings'] = { form_sign: tokens[0], form_token: tokens[1] };
					saveCompactMode(+!!state, tokens[0], tokens[1]);
				}
			});
		}

		$(window).triggerHandler('changeModeClick.msglist', [state]);
	};



	/* ~~~ MAILRU  -V2-  METHODS ~~~ */
	mailru.Messages.find = function (data){
		var
			  folderId = data.folder*1|0
			, page = Math.max(data.page*1|0, 1)
			, df = $.Deferred()
			, uid = ajs.uniqId()
		;

		if( data.id ){
			// Find by id
			var msg = mailru.Messages.get(data.id);
			if( msg && msg.isLoaded() ){
				df.resolve(msg);
			}
			else {
				mailru.Events
					.unbind('loaded.messages.'+uid)
					.bind('loaded.messages.'+uid, function (){
						var msg = mailru.Messages.get(data.id);

						if( msg && msg.isLoaded() ){
							df.resolve(msg);
							mailru.Events.unbind('loaded.messages.'+uid);
						}
					})
				;

				mailru.Messages.load( data, false, data.read );
			}
		}
		else {
			// Find messages
			if( !mailru.Folders.hasCache(folderId, page) ){
				mailru.Events
					.unbind('stop.updater.v2-messages-find')
					.one('stop.updater.v2-messages-find', function (){
						if( mailru.Folders.hasCache(folderId, page) ){
							df.resolve( mailru.Messages.getByFolder(folderId, page) );
						} else {
							df.reject();
						}
					})
				;

				if( !mailru.Updater.active ){
					mailru.Updater.reload(true);
				}
			} else {
				df.resolve(mailru.Messages.getByFolder(folderId, page));
			}
		}

		return	df;
	};


	jsLoader.loaded('{mailru}mailru.Messages', 1);

// data/ru/images/js/ru/mailru.Messages.js end

(function ($, mailru, undef){
		window.fixedDocumentWrite = function (d){
			if( d.parseWrite === undef ){
				d.close		= function (){};
				d.open		= function (html){
					var id		= 'u'+ now(), p = html.indexOf('<script');
					d.__write	= id;
					d[id]		= '';

					if( p !== -1 )
						html = html.substr(0, p) +'<span id="'+id+'"></span>' + html.substr(p);

					return	html;
				};

				d.write		=
				d.writeln	= function (str){
					var id = d.__write;
					d[id] += str;
					clearTimeout(d.__writeId);
					d.__writeId = setTimeout(function ()
					{
						$('#'+id).append(d[id]);
						d[id] = '';
					}, 50);
				};


				var
					_rscriptS = /(<script[^>]*>)\s*(<!--|\/\/\s*<!\[CDATA\[)/gi,
					_rscriptE = /\/\/\s*(-->|\]\]>)\s*(<\/script>)/gi
				;

				d.parseWrite = function (h){
					var u = 'u'+ ajs.now();

					h = h.replace(_rscriptS, '$1').replace(_rscriptE, '$2');
					h = ('<script>window.'+ u +' = "";</script>'
						+ h.replace(/\w+\.write(ln)?\(/ig, u+'+=(').replace(/<noscript>/ig, '<!--').replace(/<\/noscript>/ig, '-->')
						+ '<span id="'+u+'"></span><script>jQuery("#'+u+'").append('+u+');</script>');

					return	h;
				};
			}
		};


		var $Scroll = window.$Scroll = $(window); // Define global scroll

		window.replaceHash =
			{
				simb: {  quot: '"', amp: '&', lt: '<', gt: '>' },
				code: { '037': '%', '039': '\'', '39': '\'', '92' : '\\', '35' : '#' }
			};

		window.replaceEntity = function(str)
			{
				return str == null ? '' : str.toString()
					.replace(/(\&(quot|amp|lt|gt)\;)/g, function($0, $1, $2) {
						return replaceHash.simb[$2] != undef ? replaceHash.simb[$2] : $1;
					})
					.replace(/(\&\#(037|039|39|92|35)\;)/g, function($0, $1, $2) {
						return replaceHash.code[$2] != undef ? replaceHash.code[$2] : $1;
					});
			};

		window.returnEntity = function(str)
			{
				return str
					.replace(/&/g, "&amp;")
					.replace(/\#/g, "&#35;")
					.replace(/</g, "&lt;")
					.replace(/>/g, "&gt;")
					.replace(/"/g, "&quot;")
					.replace(/(\&lt\;wbr\/\&gt\;)/g, "<wbr/>")
					.replace(/(\&amp\;\&\#35\;8203\;)/g, "&#8203;")
					.replace(/\'/g, "&#039;")
					.replace(/\\/g, "&#92;")
					.replace(/\%/g, "&#37;");
			};

		window.wbrDelimeter = navigator.userAgent.indexOf('MSIE') != -1 && navigator.userAgent.indexOf('Trident') != -1 ? '&#8203;' : '<wbr/>';
		window.wbrSplit = function(str, period){
			var c = 0, r = [], i = 0, n = str.length, s;
			for( ; i < n; i++ )
			{
				s = str.charAt(i);
				if( s.match(/\s/) )	c = 0; else c++;
				if( c >= period )	{ s += wbrDelimeter; c = 0 }
				r[i] = s;
			}
			return	r.join('');
		};


		/**
		 * @private
		 * @deprecated
 		 */
		mailru._updIsPageVars = function (){
			mailru.isMsgList        = mailru.isMsgListPage();
			mailru.isReadMsg        = mailru.isReadMsgPage();
			mailru.isSentMsg        = mailru.isComposePage();
			mailru.isSendMsgOk      = mailru.isSendMsgOkPage();
			mailru.isMrimHistory    = mailru.isMRIMPage();
			mailru.isSearch         = mailru.isSearchPage();
			mailru.isFileSearch     = mailru.isFileSearchPage();
			mailru.isAddressbook    = mailru.isAddressbookPage();
		};


		/**
		 * @private
		 * @deprecated
		 */
		mailru._updGETVars = function (url){
			var matches, GET = {};

			if( ~url.indexOf('?') ){
				$.extend(GET, String.toObject(url));
			}

			if( matches = url.match(/messages\/([a-z]+)(?:\/(\d+))?\/?/) ){
				GET.folder = parseInt(matches[2] || mailru.Folder[matches[1].toUpperCase()], 10) | 0;
			}
			else if( matches = url.match(/(message|compose)\/([^\/]+)/) ){
				GET.id = matches[2];
				GET.folder = mailru.Messages.getSafe(GET.id).FolderId;
			}

			if( GET.id ){
				GET.id = (GET.id+'').replace(/&[^;]+;/g, '');
			}

			return window.GET = GET;
		};
		// init call
		mailru._updGETVars(jsHistory.get());


		var _rdomains = /@(corp\.mail|mail|inbox|bk|list)\.ru/i;

		var _isPage = function (val, url){
			url = url || jsHistory.get() || '';
			return url.match(val) != null;
		};


		mailru.domains = { 'corp.mail': 'corp', mail: 'mail', inbox: 'inbox', bk: 'bk', list: 'list' };
		mailru.isMailRuDomain = function (email){ return _rdomains.test(email); };


		var _pageURLS = {
			  'msglist': '/messages/:folder/'
			, 'readmsg': '/message/:id/'
			, 'compose': '/compose/:id/:mode/'
			, 'compose_key': '/compose/?_key_=:key'
			, 'search':  '/search/'
			, 'gosearch':  '/search/'
		};


		mailru.getPageURL = function (name, params){
			var url = _pageURLS[name].replace(/:(\w+)/g, function (_, key){
				return params && '/'+params[key] || '';
			});
			return	location.protocol +'//'+ location.host + url.replace(/\/+/g, '/');
		};


		var _pageLabels = {
			  messages:	'msglist'
			, message:	'readmsg'
			, compose:	'sentmsg'
			, search:	'gosearch'
		};
		mailru.getPageLabel = function (url){
			var match = (url || jsHistory.get() || '').match(/(messages?|msglist|readmsg|compose|filesearch|gosearch|search|sentmsg|sendmsgok|addressbook)/);
			return	match ? (_pageLabels[match[1]] || match[1]) : 'msglist';
		};


		mailru.getUserUrl = function (email, name){
			var url = '';
			if (mailru.isMailRuDomain(email)) {
				var part = ['http://'], i = 0;
				if( name == 'avatar' ) name ='my';
				part[++i] = name+'.mail.ru';
				part[++i] = email.indexOf('@corp') > 0 ? '/corp/' : '/'+email.match(/@([^.]+)/i)[1]+'/';
				part[++i] = email.match(/([^@]+)/i) ? RegExp.$1 : '';
				url = part.join('');
			}
			return url;
		};


		mailru.getAvatarSrc = function (email){
			var url = '//img.' + mailru.staticDomainName + '/r/msg/letter.gif', mathes = email.match(/(?:^|\s)(\w.+)@(.+)\.ru/i);
			if( mathes && mailru.domains[mathes[2]] ){
				// https://jira.mail.ru/browse/MAIL-5827?focusedCommentId=187501#comment-187501
				url = 'http://avt.foto.mail.ru/'+ mailru.domains[mathes[2]]+ '/'+ mathes[1]+ '/_avatar?'+ ajs.now();
			}
			return url;
		};


		// Global Event dispatcher
		mailru.Events = $({ removeEventListener: $.noop, detachEvent: $.noop });
		mailru.Events.fire = function (type, data, params){
			var evt		= $.Event(type);
			evt.TYPE	= type;
			evt.DATA	= data;
			if( params !== undef ) $.extend(evt, params);
			this.trigger( evt );
			return	evt.result;
		};


		mailru.setTitle	= function (title){
			setTimeout(function (){
				document.title = replaceEntity( title );
			}, 15);
		};


		mailru.hasCollectors = function () {
			var collectors = mailru.collectors;
			return Object.isObject(collectors) && Object.keys(collectors).length > 0;
		};


		mailru.isCollectorFolder = function (id) {
			var collector = mailru.getCollectorInfoByFolderId(id);

			return Object.keys(collector).length > 0;
		};


		mailru.getCollectorInfoByMessageId = function (id) {
			var result = {};

			if (mailru.hasCollectors()) {
				var message_id = mailru.Messages.get(id || GET.id);

				if (message_id && (message_id = message_id.collector)) {
					Object.forEach(mailru.collectors, function(collector) {
						if (collector && message_id == collector.id) {
							result = collector;
						}
					});
				}
			}

			return result;
		};


		mailru.getCollectorInfoByFolderId = function (id) {
			var result = {};

			if (mailru.hasCollectors()) {
				var folders = mailru.Folders.getAll();

				Array.some(folders, function(folder, collector) {
					if (folder.Id == id) {
						collector = mailru.collectors[!folder.IsSubfolder ? folder.Id : folder.ParentId];

						if (collector) {
							return result = collector;
						}
					}
				});
			}

			return result;
		};

		mailru.getCollectorInfoById = function (id) {
			var result = {};

			if (mailru.hasCollectors()) {
				Object.forEach(mailru.collectors, function(collector) {
					if (collector.id == id) {
						result = collector;
						return false;
					}
				});
			}

			return result;
		};

		mailru.getActiveFolderEmail = function() {
			return mailru.getCollectorInfoByFolderId(mailru.getFolderId()).email || mailru.useremail;
		};


		mailru.getFolderId	= function (){
			var id = GET.folder || mailru.folderId;

			if( mailru.isSearchPage() ){
				id	= GET.q_folder;
				return	-1 - (id >= 0 ? id : 0);
			}
			else if( mailru.isFileSearchPage() ){
				return	mailru.Folder.FILESEARCH;
			}

			return id >= 0 ? id : 0;
		};

		mailru.isEmptyCollectorFolder = function (){
			var id = mailru.getFolderId(),
				empty = false;

			// 1. Empty folders are not imported!
			// 2. System folders are combined
			// 3. The state 'create' or 'work' + any error are considered as 'create' state

			var collector = mailru.getCollectorInfoByFolderId(id);
			var folder = mailru.Folders.Map[id];

			if (folder && !folder.Messages) {
				// 4. There is only one collector and one folder (initially)
				if (mailru.IsExternalAccount && id == mailru.Folder.INBOX) {
					Object.forEach(mailru.collectors, function(collector) {
						if (collector.state == 'create' ||
							(collector.error && collector.state == 'work'))
						{
							empty = true;
						}
					});
				}
				// 5. System folder <Inbox> initially is not empty
				else if (collector.state == 'create' ||
					(collector.error && collector.state == 'work'))
				{
					return true;
				}
			}

			return empty;
		};

		mailru.getFolderData = function (id) {
			return mailru.Folders.Map[id] || null;
		};

		mailru.isComposePage = function (url){
			return _isPage('sentmsg', url) || _isPage('compose', url);
		};

		mailru.isSendMsgOkPage = function (url){
			return _isPage('sendmsgok', url);
		};

		mailru.isMsgListPage = function (url){
			return _isPage('msglist', url) || _isPage(/messages\//, url);
		};

		mailru.isReadMsgPage = function (url){
			return (_isPage('readmsg', url) || _isPage(/message\//, url)) && !mailru.isMRIMPage();
		};

		mailru.isSearchPage = function (url) {
			// MAIL-16450
			return _isPage('(^|go|\/)search', url) && !mailru.isMRIMPage();
		};

		mailru.isAddressbookPage = function (url) {
			return _isPage('addressbook', url);
		};

		mailru.isMRIMPage = function (url){
			return	_isPage('mrimhistory', url) || _isPage('agent', url);
		};

		mailru.isSearchNoResultPage = mailru.isSearchNoResultPage || ajs.retFalse;
		mailru.isAdvancedSearchPage = function (){
			return !!(mailru.isSearchPage() && GET.advanced);
		};


		/**
		 * Is filter
		 *
		 * @param {Number} [id]
		 * @return {Boolean}
		 */
		mailru.isFilterFolder = function (id){
			if( id === undef ) id = GET.folder;
			return id == mailru.Folder.UNREAD
				|| id == mailru.Folder.FLAGGED
				|| id == mailru.Folder.ATTACH;
		};


		mailru.isFileSearchPage = function (url){
			return _isPage('filesearch', url);
		};


		mailru.isMailboxPage = function (url){
			return (mailru.isMsgListPage(url) || mailru.isReadMsgPage(url) || mailru.isComposePage(url) || mailru.isSendMsgOkPage(url) || mailru.isSearchPage(url) || mailru.isFileSearchPage(url));
		};


		mailru.needReloadPage = function (key, val){
			if( (key == 'build') && val && (mailru.build != val) ){
				mailru.needReloadPage	= function (key, val){
					if( /^(fastanswer|compose|sendmsgok)$/i.test(key) ){
						location.reload();
						return	true;
					}
					else if( key == 'href' ){
						location.href	= val;
						return	true;
					}

					return	false;
				};
			}

			return	false;
		};


		mailru.isModernBrowser = function() {
			return !mailru.isAncientBrowser();
		};

		mailru.isAncientBrowser = function() {
			var b = $.browser;

			var oldIE      = b.msie    && b.intVersion < 8;
			var oldFirefox = b.mozilla && b.intVersion < 5;
			var oldOpera   = b.opera   && b.intVersion < 10;

			return oldIE || oldFirefox || oldOpera;
		};

		// Patch global scroll
		(function (_offsetFn){
			var
				  _scrollId
				, _scrollFn	= function (){
					$Scroll.top		= ajs.scrollTop();
					$Scroll.left	= ajs.scrollLeft();
				}
			;

			//noinspection JSUnresolvedVariable
			if( ($.browser.opera && parseFloat($.browser.version) < 10) || $.browser.iOS ){
				$Scroll[0] = $('html').removeClass('page-scroll')[0];
				$Scroll.fixed = true;
			}
			else if( jsHistory.useHistoryAPI ){
				$Scroll.normal = true;
				$('html').removeClass('page-scroll');
			}


			// DOMReady
			$(function (){
				$(window).add('#ScrollBody').scroll(function (){
					clearTimeout(_scrollId);
					_scrollId = setTimeout(_scrollFn, 30);
				});


				if( $Scroll.normal ){
					ajs.scrollTop	= function (y){ return $Scroll.scrollTop(y); };
					ajs.scrollLeft	= function (x){ return $Scroll.scrollLeft(x); };
				} else {
					$('#ScrollBody').bind('scrollstart scrollend', function (evt){
						$.isScrolled = evt.type != 'scrollend';
					});


					$Scroll.scrollTop = function (y){
						if( typeof y === 'undefined' ){
							return	this[0].scrollTop;
						}
						else {
							this[0].scrollTop = y;
							return	this;
						}
					};
				}

				if( $Scroll.fixed || $Scroll.normal ){
					//noinspection JSUnresolvedVariable
					if( $.browser.iOS ){
						$Scroll[0] = document.body;
					}
				} else {
					var
						  div = document.getElementById('ScrollBody')
						, _resizeFn = function (){ $Scroll.css('height', ajs.windowHeight()); }
					;

					if( div ){
						$Scroll[0] = div;
						div = null;

						/** @namespace $Scroll.scrollLeft */
						ajs.scrollTop	= function (y){ return $Scroll.scrollTop(y); };
						ajs.scrollLeft	= function (x){ return $Scroll.scrollLeft(x); };

						// Fixed jQuery offset method
						$.fn.offset = function (){
							var offset	= _offsetFn.apply(this, arguments);
							if( offset ){
								offset.top	+= $Scroll.scrollTop();
								offset.left	+= $Scroll.scrollLeft();
							}
							return	offset;
						};

						if ($.browser.msie && $.browser.version <= 7)
							_resizeFn();

//						Зачем это нужно никто не помнит, но даёт плохой эффект при ресайзе
//						$(window).resize(_resizeFn.debounce(10));
					}
				}

				window.$ScrollElement = $.isWindow($Scroll[0]) ? $('html,body') : $Scroll;

				_scrollFn();
			});
		})($.fn.offset);


		// UI radar
		(function (radars){
			mailru.uiRadar = function (name){
				if( name === false ){
					for( name in radars )//noinspection JSUnfilteredForInLoop
						radars[name]('clear');
				}
				else{
					if( !(name in radars) ){
						radars[name] = createRadar('mailru_UI_'+name);
					}
					return	radars[name];
				}
			};
		})({});


		// Global ajax-error handler
		$(document).ajaxError(function (event, jqXHR, options, thrownError){
			if( thrownError && (options && options.url && options.dataType == 'json') && (jqXHR && jqXHR.status == 200 && jqXHR.readyState == 4) ){
				if( /(^|\/)abjs(\?|$)/.test(options.url) ){
					var txt = 'ajaxConvert: ', hdrs = '';

					txt += options.url + (options.data ? (/\?/.test(options.url) ? '&' : '?') + options.data : '');

					if (('mailru' in window)) {
						txt += ' ~ ' + (mailru.useremail || 'NotAuth');
					}

					txt += ' ~ ' + navigator.userAgent;

					if (jqXHR.getAllResponseHeaders) {
						hdrs = '<h>' + jqXHR.getAllResponseHeaders() + '</h>';
					}

					/** @namespace mailru.saveError*/
					if( window.mailru && mailru.saveError ){
						mailru.saveError('json2', txt);
					}

					$.ajax({
						url: '/cgi-bin/logthis',
						type: 'POST',
						data: { 'jQ.err': ('<q>' + txt + '</q>' + hdrs + '<r>' + jqXHR.responseText + '</r>').replace(/[\r\n]/g, '\\n') },
						dataType: 'text'
					});
				}
				else if( options.sentmsg ){
					(new Image).src = '//gstat.' + mailru.staticDomainName + '/gstat?ua=1&logme=' + encodeURIComponent($.param({
						log: 'sentmsgparseerror5',
						readyState: jqXHR.readyState,
						status: jqXHR.status,
						statusText: jqXHR.statusText,
						error: thrownError.toString(),
						email: window.mailru && mailru.useremail ? mailru.useremail : '',
						responseText: jqXHR.responseText
					}));
				}
			}
		});


		/**
		 * labs.dnd.compose
		 */
		if( store.get('labs.dnd.compose') ){
			$R('{mailru.build}Compose');
		}
	})(jQuery, mailru);


	// initial call
	mailru._updIsPageVars();


	jsLoader.loaded('{mailru}mailru.core', 1);

// data/ru/images/js/ru/mailru.core.js end

// data/ru/images/js/ru/jsCore/Projects/mail.ru/Offline/mailru.OfflineCache.js start


// data/ru/images/js/ru/jsCore/utils/MD5.js start

if (!('ajs' in window)) {
	ajs = {};
}

/**
 * from http://md5x.ru/
 * @class ajs.MD5
 */
(function (ajs) {

	/*
	 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
	 * Digest Algorithm, as defined in RFC 1321.
	 * Copyright (C) Paul Johnston 1999 - 2000.
	 * Updated by Greg Holt 2000 - 2001.
	 * See http://pajhome.org.uk/site/legal.html for details.
	 */

	/*
	 * Convert a 32-bit number to a hex string with ls-byte first
	 */
	var hex_chr = "0123456789abcdef";

	function rhex (num) {
		var str = "", j;
		for (j = 0; j <= 3; j++)
			str += hex_chr.charAt((num >> (j * 8 + 4)) & 0x0F) +
			hex_chr.charAt((num >> (j * 8)) & 0x0F);
		return str;
	}

	/*
	 * Convert a string to a sequence of 16-word blocks, stored as an array.
	 * Append padding bits and the length, as described in the MD5 standard.
	 */
	function str2blks_MD5 (str) {
		var nblk = ((str.length + 8) >> 6) + 1, blks = new Array(nblk * 16), i;
		for (i = 0; i < nblk * 16; i++) blks[i] = 0;
		for (i = 0; i < str.length; i++) blks[i >> 2] |= str.charCodeAt(i) << ((i % 4) * 8);
		blks[i >> 2] |= 0x80 << ((i % 4) * 8);
		blks[nblk * 16 - 2] = str.length * 8;
		return blks;
	}

	/*
	 * Add integers, wrapping at 2^32. This uses 16-bit operations internally
	 * to work around bugs in some JS interpreters.
	 */
	function add (x, y) {
		var lsw = (x & 0xFFFF) + (y & 0xFFFF);
		var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
		return (msw << 16) | (lsw & 0xFFFF);
	}

	/*
	 * Bitwise rotate a 32-bit number to the left
	 */
	function rol (num, cnt) {
		return (num << cnt) | (num >>> (32 - cnt));
	}

	/*
	 * These functions implement the basic operation for each round of the
	 * algorithm.
	 */
	function cmn (q, a, b, x, s, t) {
		return add(rol(add(add(a, q), add(x, t)), s), b);
	}

	function ff (a, b, c, d, x, s, t) {
		return cmn((b & c) | ((~b) & d), a, b, x, s, t);
	}

	function gg (a, b, c, d, x, s, t) {
		return cmn((b & d) | (c & (~d)), a, b, x, s, t);
	}

	function hh (a, b, c, d, x, s, t) {
		return cmn(b ^ c ^ d, a, b, x, s, t);
	}

	function ii (a, b, c, d, x, s, t) {
		return cmn(c ^ (b | (~d)), a, b, x, s, t);
	}

	/*
	 * Take a string and return the hex representation of its MD5.
	 */
	function calcMD5 (str) {

		var x = str2blks_MD5(str),
			a = 1732584193,
			b = -271733879,
			c = -1732584194,
			d = 271733878,
			i, olda, oldb, oldc, oldd;

		for (i = 0; i < x.length; i += 16) {

			olda = a;
			oldb = b;
			oldc = c;
			oldd = d;

			a = ff(a, b, c, d, x[i+ 0], 7 , -680876936);
			d = ff(d, a, b, c, x[i+ 1], 12, -389564586);
			c = ff(c, d, a, b, x[i+ 2], 17,  606105819);
			b = ff(b, c, d, a, x[i+ 3], 22, -1044525330);
			a = ff(a, b, c, d, x[i+ 4], 7 , -176418897);
			d = ff(d, a, b, c, x[i+ 5], 12,  1200080426);
			c = ff(c, d, a, b, x[i+ 6], 17, -1473231341);
			b = ff(b, c, d, a, x[i+ 7], 22, -45705983);
			a = ff(a, b, c, d, x[i+ 8], 7 ,  1770035416);
			d = ff(d, a, b, c, x[i+ 9], 12, -1958414417);
			c = ff(c, d, a, b, x[i+10], 17, -42063);
			b = ff(b, c, d, a, x[i+11], 22, -1990404162);
			a = ff(a, b, c, d, x[i+12], 7 ,  1804603682);
			d = ff(d, a, b, c, x[i+13], 12, -40341101);
			c = ff(c, d, a, b, x[i+14], 17, -1502002290);
			b = ff(b, c, d, a, x[i+15], 22,  1236535329);

			a = gg(a, b, c, d, x[i+ 1], 5 , -165796510);
			d = gg(d, a, b, c, x[i+ 6], 9 , -1069501632);
			c = gg(c, d, a, b, x[i+11], 14,  643717713);
			b = gg(b, c, d, a, x[i+ 0], 20, -373897302);
			a = gg(a, b, c, d, x[i+ 5], 5 , -701558691);
			d = gg(d, a, b, c, x[i+10], 9 ,  38016083);
			c = gg(c, d, a, b, x[i+15], 14, -660478335);
			b = gg(b, c, d, a, x[i+ 4], 20, -405537848);
			a = gg(a, b, c, d, x[i+ 9], 5 ,  568446438);
			d = gg(d, a, b, c, x[i+14], 9 , -1019803690);
			c = gg(c, d, a, b, x[i+ 3], 14, -187363961);
			b = gg(b, c, d, a, x[i+ 8], 20,  1163531501);
			a = gg(a, b, c, d, x[i+13], 5 , -1444681467);
			d = gg(d, a, b, c, x[i+ 2], 9 , -51403784);
			c = gg(c, d, a, b, x[i+ 7], 14,  1735328473);
			b = gg(b, c, d, a, x[i+12], 20, -1926607734);

			a = hh(a, b, c, d, x[i+ 5], 4 , -378558);
			d = hh(d, a, b, c, x[i+ 8], 11, -2022574463);
			c = hh(c, d, a, b, x[i+11], 16,  1839030562);
			b = hh(b, c, d, a, x[i+14], 23, -35309556);
			a = hh(a, b, c, d, x[i+ 1], 4 , -1530992060);
			d = hh(d, a, b, c, x[i+ 4], 11,  1272893353);
			c = hh(c, d, a, b, x[i+ 7], 16, -155497632);
			b = hh(b, c, d, a, x[i+10], 23, -1094730640);
			a = hh(a, b, c, d, x[i+13], 4 ,  681279174);
			d = hh(d, a, b, c, x[i+ 0], 11, -358537222);
			c = hh(c, d, a, b, x[i+ 3], 16, -722521979);
			b = hh(b, c, d, a, x[i+ 6], 23,  76029189);
			a = hh(a, b, c, d, x[i+ 9], 4 , -640364487);
			d = hh(d, a, b, c, x[i+12], 11, -421815835);
			c = hh(c, d, a, b, x[i+15], 16,  530742520);
			b = hh(b, c, d, a, x[i+ 2], 23, -995338651);

			a = ii(a, b, c, d, x[i+ 0], 6 , -198630844);
			d = ii(d, a, b, c, x[i+ 7], 10,  1126891415);
			c = ii(c, d, a, b, x[i+14], 15, -1416354905);
			b = ii(b, c, d, a, x[i+ 5], 21, -57434055);
			a = ii(a, b, c, d, x[i+12], 6 ,  1700485571);
			d = ii(d, a, b, c, x[i+ 3], 10, -1894986606);
			c = ii(c, d, a, b, x[i+10], 15, -1051523);
			b = ii(b, c, d, a, x[i+ 1], 21, -2054922799);
			a = ii(a, b, c, d, x[i+ 8], 6 ,  1873313359);
			d = ii(d, a, b, c, x[i+15], 10, -30611744);
			c = ii(c, d, a, b, x[i+ 6], 15, -1560198380);
			b = ii(b, c, d, a, x[i+13], 21,  1309151649);
			a = ii(a, b, c, d, x[i+ 4], 6 , -145523070);
			d = ii(d, a, b, c, x[i+11], 10, -1120210379);
			c = ii(c, d, a, b, x[i+ 2], 15,  718787259);
			b = ii(b, c, d, a, x[i+ 9], 21, -343485551);

			a = add(a, olda);
			b = add(b, oldb);
			c = add(c, oldc);
			d = add(d, oldd);
		}
		return rhex(a) + rhex(b) + rhex(c) + rhex(d);
	}

	ajs.MD5 = calcMD5;

})(ajs);

jsLoader.loaded('{utils}MD5', 1);

// data/ru/images/js/ru/jsCore/utils/MD5.js end

// data/ru/images/js/ru/jsCore/plugins/jQueryEvent.js start


(function($)
	{
		/**
		 * @class jQueryEvent
		 */
		jsClass
		.create('jQueryEvent')
		.methods({

			one: function(type, data, fn)
			{
				return $(this).one(type, data, fn);
			},

			bind: function(type, data, fn)
			{
				return $(this).bind(type, data, fn);
			},

			unbind: function(type, fn)
			{
				return $(this).unbind(type, fn);
			},

			trigger: function (type, data){
				this.triggerHandler(type, data);
				return  this;
			},

			triggerHandler: function(type, data)
			{
				return $(this).triggerHandler(type, data);
			},

			removeEventListener: $.noop,
			detachEvent: $.noop
		});

	})(jQuery);

	jsLoader.loaded('{plugins}jQueryEvent', 1);

// data/ru/images/js/ru/jsCore/plugins/jQueryEvent.js end

// data/ru/images/js/ru/Views/mailru.View.Compose.js start


// data/ru/images/js/ru/jsCore/labs/jsView.js start

/**
 * @class	jsView
 * @author	RubaXa	<trash@rubaxa.org>
 * @version	0.1
 *
 * Root View
 * 		jsView.root
 * 		documentView
 */

(function (w)
{
	var VIEW = {}, timers = {}, _log = [], _indent = 0;

	jsClass
		.create('jsView')
		.methods({

		__construct: function (opts)
		{
			Object.extend(this, { id: this.uniqId, tag: 'view', _$P: false, onBeforeRedraw: ajs.retTrue, onRedraw: ajs.retTrue }, opts);

			if( VIEW[this.id] !== undef )
				throw(this.id +' - jsView.ID must by uniq.');
			else
				VIEW[this.id]	= this;

			this.__init		= {};
			this._changes	= {};
			this.__changes	= {};

			this.tag		= this.tag.toUpperCase();
			this.subviews	= [];
			this.changed	= false;

			if( !this.idView )
				this.idView	= '#'+this.id;

			this.$P('_lego');
			this._lego();
			this._first();
			$(this._onReady.bind(this));
			this.$P('_lego', 1);

			if( this.events ) this.listen(this.events);
		},

	// @private
		_init:		function (name, func)
					{
						if( !(name in this.__init) && (func !== undef) )
						{
							this.$P('_init.'+name);
							func.call(this);
							this.__init[name]	= 1;
							this.$P('_init.'+name, 1);
						}
						return	(name in this.__init);
					},


		_one:		$.noop,
		_lego:		$.noop,
		_first:		$.noop,
		_redraw:	function (r, a){},
		_onReady:	$.noop,

		_changed:	returnTrue,
		_active:	returnTrue,

		__redraw:	function (r, a)
		{
			if( this._one !== null )
			{
				this.$P('_one');
				this._one();
				this._one = null;
				this.$P('_one', 1);
			}
			this._redraw(r, a);
		},


		$P: function (name){
			if( this._$P ){
				name = '['+this.id+'].'+name;

				if( arguments.length == 2 ){
					_indent--;
					return	(timers[name] = ajs.now() - timers[name]);
				}
				else {
					timers[name] = ajs.now();
					_log.push({ name: name, indent: _indent++ });
				}
			}
		},

	// @public
		isChanged:	function (){ return this.changed; },
		isActive:	function (){ return this._active() && ((this.id === 'root') || !this.parentViewId || this.parentView().isActive()); },
		getMapper:	function (){
			/** @namespace this.mapper */
			return this.mapper;
		},

		isChange: function (name, value, noSet)
		{
			if( arguments.length === 1 )
			{
				return	!!this.__changes[name];
			}

			if( Array.isArray(value) ) value = value.join(',');

			var r = this._changes[name] !== value;
			if( !noSet )
			{
				this.__changes[name]	= r;
				this._changes[name] 	= value;
			}

			return	r;
		},

		redraw: function (){
			if( this.onBeforeRedraw() ){
				this.changed	= false; // Reset changes

				if( this.id === 'root' ){
//					console.profile();
					this.$P('TOTAL');
				}

				var a = this.isActive(), subviews = a;

				if( !(this.active === undef && !a) ){
					if( this.active !== a ){
						this.$P('active');
						subviews		= true;
						this.active		= a;
						this.__redraw(false, a);
						this.$P('active', 1);
					}

					if( a && this._changed() ){
						this.$P('redraw');
						this.changed	= true;
						this.__redraw(true, a);
						this.$P('redraw', 1);
					}

					if( subviews){
						for( var i = 0, views = this.subviews, n = views.length; i < n; i++ ){
							views[i].redraw();
						}
					}
				}

				if( this.id === 'root' ){
//					console.profileEnd();
					if( this.$P('TOTAL', 1) > 5 ){
						ajs.each(_log, function (log){
							var name = log.name, ts = timers[name];
							if( ts >= 1 ){
								ajs.log((new Array(log.indent)).join('  ') + name +': '+ ts +'ms');
								delete timers[name];
							}
						});
					}
					_log = [];
				}

				this.onRedraw();
				return	true;
			}

			return	false;
		},

		addSubView: function (View)
		{
			View.parentViewId	= this.id;
			this.subviews.push(View);
			return	this;
		},

		removeSubView: function (View)
		{
			delete	View.parentViewId;
			this.subviews	= Array.remove(this.subviews, View);
			return	this;
		},

		parentView: function ()
		{
			return	VIEW[this.parentViewId];
		},

		getViewsByTag: function (tag)
		{
			var result	= [];
			tag = tag.toUpperCase();

			Array.forEach(this.subviews, function (View) {
				if( (tag === '*') || (View.tag.toUpperCase() == tag) )
					result.push(View);
				result = result.concat(View.getViewsByTag(tag));
			});

			return	result;
		},

		getViewById: function (id)
		{
			return	VIEW[id];
		},

		listen: function (events)
		{
			mailru.Events.bind(events, $D(this, function ()
			{
				this.redraw()
			}));
			return	this;
		},

		group: function (opts, func)
		{
			var View = ('getViewById' in opts) ? opts : new jsView(opts);
			if( func !== undef ) func.call(View, View);
			return	this.addSubView(View);
		},

		getView: function (selector)
		{
			if( !this.$View )
			{
				var id = this.idView;
				this.$View = $( id, !ajs.isString(id) || /^#/.test(id) ? undef : this.parentView().getView() );
			}

			if( selector )
			{
				return	/^#/.test(selector) ? $(selector) : this.$View.find(selector);
			}

			return	this.$View;
		}

	});


	// ROOT VIEW
	jsView.root		=
	w.documentView	= new jsView({ id: 'root', tag: 'root', _$P: true });

	// Create View class
	jsView.get		= jsView.root.getViewById;
	jsView.create	= function (name){ return jsClass.create(name).extend(jsView); };
	jsView.getViewsByTag	= function (name){ return jsView.root.getViewsByTag(name); };
})(window);

jsLoader.loaded('{labs}jsView', 1);
 

// data/ru/images/js/ru/jsCore/labs/jsView.js end

/**
	 * @class mailru.View.Compose
	 */
	jsView
		.create('mailru.View.Compose')
		.statics({

			status:		-1,
			attempts:	2,

			isLoaded: function (){
				var href = location.href.split('?');
				href = href[0] + (href[1] ? '?'+jsHistory.buildParams() : '');
				return	mailru.isComposePage() && (href == jsHistory.get()) || this.status == 2;
			},

			loadFormHtml: function (formName, func){
				if( this.status == -1 ){
					$R('{mailru'+'.build}Compose'); // "+" -- need to get the js-builder skip this file
				}


				if( func ) jsCore.wait(this.classUniqId+'_HTML', function (){
					var html = this.__html.replace(/COMPOSE_FORM_NAME/g, formName);
					func(false, html);
				}.bind(this));


				if( this.status <= 0 ){
					this.status	= 1;

					mailru.Ajax({
						  url:      '/cgi-bin/lstatic?get=compose'
						, data: {
							  compose_name: 'COMPOSE_FORM_NAME'
							, modern: mailru['IsNewComposeDesign'] ? 1 : 0
						}
						, dataType: 'text'
						, type:     'GET'
						, complete: function (R){
							if( R.isOK() ){

								var html = R.getData();

								this.status	= 2; // loaded
								this.__html	= html;

								$(window).trigger('composeformloaded');

								if( html.match(/mailru_build=(\d+)/) ){
									mailru.needReloadPage('build', RegExp.$1 * 1);
									if( mailru.isSentMsg && mailru.needReloadPage('compose') ){
										return;
									}
								}

								jsCore.notify(this.classUniqId + '_HTML');
							}
							else if( this.attempts > 0 ){
								this.status	= 0;
								this.attempts--;

								setTimeout(mailru.View.Compose.loadFormHtml.bind(this), 5000);
								debug.log('mailru.View.Compose (%s): internal error'.replace('%s', formName));
/*
								var jqXHR = R.getXHR();

								var log = {
									log: 'sentmsgerror',
									readyState: jqXHR.readyState,
									status: jqXHR.status,
									statusText: jqXHR.statusText,
									email: window.mailru && mailru.useremail ? mailru.useremail : '',
									responseText: jqXHR.responseText
								};
								new Image().src = '//gstat.' + mailru.staticDomainName + '/gstat?ua=1&logme=' + encodeURIComponent($.param(log));
*/
							}
						}.bind(this)
					});
				}
			},


			renderTo: function ($el, fn, fast){
				var df = $el.data('compose');

				if( !df ){
					$el.data('compose', df = $.Deferred());

					var name = 'compose_'+ ($.guid++) +'_';
					var View = new mailru.View.Compose({
						  id:		name
						, idView:	$el
						, isFast:	fast
						, _active:	returnTrue
					});


					$(window).bind('init.'+name, function (){
						jsCore.wait(name+'.init', function (){
							View.getForm().bind('cancel', function () {
								$el.trigger('composecancel');
								return false;
							});


							View.getForm().parentHeight(function () {
//								// Set function for calc availableHeight
//								// debug.log('HEIGHT:', this.options.resizeDisabled, $('#LeftColEndAnchor').offset().top - this.getMainFrame().offset().top);
								return ajs.windowHeight() - 260;
//								return	$('#LeftColEndAnchor').offset().top - offset && offset.top;
							});

//							View.getForm().bind('inited', function (){
								df.resolve(View);
//							});
						});
					});


					View.redraw();
				}

				return	df.done(fn).promise();
			}

		})
		.methods({

		_first: function (){
			this.status		= this.active ? 2 : 0;
			this.__GET		= {};	// { "key": "queryString" }
			this.__html		= 0;
			this._signature	= '';

			this.active		= false;	// always unactive for call redraw

			this.isChange('hash', jsHistory.get());
		},

		_one: function (){
			this.$View		= $( this.idView );
			this.$Loader	= $();
		},

		_redraw: function (r, a){
			if( !r ){
				if( !a ){
					// setting this variable occurs "getSign"
					this.__signatureLoaded = false;
					this.isChange('hash', null);
				}

				if( 2 === this.status ){
//					this.$View.display(a);

					if( a && (0 !== this.__html) ){
						this.$View.innerHTML( this.__html );
						this.__html	= 0;
						$.globalEval( $('#SCRIPT_'+this.id).remove().innerHTML() );
					}
				}
				else if( 0 === this.status ){
					this.status	= 1; // loading
					mailru.View.Compose.loadFormHtml(this.id, function (error, html){
						if( !error ){
							var mode = this.isFast ? 'NORMAL' : 'FAST';
							this.__html	= html.replace(new RegExp('<!--BEGIN:'+mode+'-->[\\s\\S]+<!--END:'+mode+'-->'), '');
							this.status	= 2;
							this._redraw(0, this.isActive());
						}
					}.bind(this));
				}
				else if( this.status === 1  ){
					// try again
					mailru.View.Compose.loadFormHtml();
				}
			}
			else if( a ){
				var url = jsHistory.get();
				if( ~url.indexOf('action=') || (this.autoload && this.isChange('hash', url)) ){
					this.load( url );
				}
			}
		},

		_letBody: function (text, mode, Msg) {

			var let_body = Msg.let_body == null ? '' : Msg.let_body.toString();
			var let_body_plain = Msg.let_body_plain == null ? '' : Msg.let_body_plain.toString();
			var quote_string = Msg.quote_string == null ? '' : Msg.quote_string.toString();
			var index = (mode == 'forward' ? 'let_body_fwd' : 'let_body_re') + (text == 'plain' ? '_plain' : '');

			return	(Msg[index]).replace(/__LET_BODY_(QUOTE_PLAIN|PLAIN|HTML)__/, function (body, type) {
				if (type == 'HTML') {
					body = let_body;
				} else if (type == 'PLAIN') {
					body = let_body_plain;
				} else {
					body = quote_string + let_body_plain.replace(/[\r\n]/g, '\n' + quote_string);
				}
				return	body;
			});
		},

		_fix: function (){
			if( $.browser.webkit ){
				for( var i = 0, $V = this.$View, $S = $('<b>.</b>'); i < 3; i++ ){
					$S.clone().appendTo($V).remove();
					$V = $V.parent();
				}
			}
		},


		// @public
		getForm: function ()
		{
			return	mailru.Compose && mailru.Compose.Form && mailru.Compose.Form[this.id];
		},

		switchMode: function (mode, force) {

			var data = String.toObject(this._query);

			if ('replyall' in data) {
				delete data['reply'];
			}

			if (!(mode in data) || force) {

				delete data['reply'];
				delete data['replyall'];
				delete data['forward'];
				delete data['new'];

				var Msg	= mailru.Messages.get(data.id);
				var draftId = this._getDraftId(Msg, mode);

				if( !Msg || draftId || /forward|drafts/.test(mode + this.mode) )
				{
					this.load(String.toQuery(data), mode);
				}
				else
				{
					data[mode] = 1;

					this._query = String.toQuery(data);

					this.getForm()
						.setMode(mode, Msg.Id)
						.focus()
					;
				}
			}
		},

		load: function (data, mode, force){
			var options = [data, mode, force], actionId;

			data = String.toObject(this._toOldFormat(data));

			if (mailru.IsNewComposeDesign && (mailru.EnableIMAP || (mailru.IsExternalAccount && mailru.NeedMoreInfoForCompose))) {
				this.setFrom();
			}

			if( /^\d+(;\d+;\d+)?$/.test(data.id) )
			{	// Check messages id
				if( 'forward' in data ) mode = 'forward';
				else if( 'drafts' in data )  mode = 'drafts';
				else if( 'replyall' in data )  mode = 'replyall';
				else if( 'reply' in data )  mode = 'reply';
			}
			else if (mailru.OfflineCache.isAllowed() && data.action) {
				actionId = data.action;
			}
			else
			{
				mode	= 'new';
			}

			if( data._key_ )
			{	// Restore GET params by key
				data	= this.__GET[data._key_] || '';
				force	= true;

				if( /forward/.test(data) )			mode = 'forward';
				else if( /replyall/.test(data) )	mode = 'replyall';
				else if( /reply/.test(data) )		mode = 'reply';
				else mode = 'new';
			}
			else
			{
				data		= String.toQuery(data).replace(/(reply|replyall|drafts|forward)[=&\d]*/gi, '')+'&';
				this.mode	= mode;

				switch( mode )
				{
					case 'replyall': data += 'reply&replyall=1'; break;
					case 'forward': data += 'forward'; break;
					default: data += mode ? mode+'=1' : '';
				}
			}

			this.abort();

			// save url
			this._url	= '/compose/?'+data;
			this._query	= data;

			// Get current message
			var Msg	= mailru.Messages.get( String.toObject(this._url).id), draftId;

			if (Msg) {
				if (Msg.map_inline_img) {
					force = 1;
				// readmsg by AJAX or static link return Attachfiles_Items, not Attachment
				} else if (Msg.Attachment || Msg.Attachfiles_Items || Msg.Attachlinks_Items) {
					if (!(mode == 'reply' || mode == 'replyall')) {
						force = 1;
					}
				}

				draftId = this._getDraftId(Msg, mode);
				if (draftId) {
					this.mode = mode = 'drafts';
					data = 'id=' + draftId + '&' + mode + '=1';
				}
			}

			mailru.log('compose.msg:', this._url);
//			ajs.log('compose.msg:', Msg);
//			ajs.log('compose.data:', data);
//			ajs.log('compose.mode:', mode);
//			ajs.log('compose.url:', this._url);

			if( !force && (mode != 'new' && mode != 'drafts') && Msg && ('let_body_re' in Msg) ){

				jsCore.wait(this.id+'.init', function (){
					var Form = this.getForm(), data = Form.getData({ attachments: false });

					$.extend(data, {
						  mode:				mode
						, MessageId:		jsCore.getRandomHash(8, true, true, true)
						, HTMLCompose:		Msg.HTMLCompose
						, letbody_html:		this._letBody('html', mode, Msg)
						, letbody_plain:	this._letBody('plain', mode, Msg)
						, files_id:			''
						, files_ids:		''
						, actionId:			''
						, template_id:		''
						, HighPriority:		''
						, NeedRcpt:			''
						, remind:			''
						, LeftMailSize:		mailru.Compose.fileUploaderSettings.MaxAttachmentSize
						, map_inline_img:	Msg.map_inline_img
					}, Form.getFieldsByType(mode, Msg));

					Form
						.reset()
						.redraw( data )
					;

					this._fix();
				}.bind(this))
			}
			else if (actionId) {
				jsCore.wait(this.id+'.init', function () {
					mailru.OfflineCache.getAction(actionId).done(function (action) {
						if (action) {
							var actionParams = action.data.data;

							var Form = this.getForm(), data = Form.getData({ attachments: false });

							$.extend(data, {
								  letbody_html:		~~actionParams.HTMLMessage ? actionParams.Body : ''
								, letbody_plain:	~~actionParams.HTMLMessage ? '' : actionParams.Body
								, HTMLCompose:		~~actionParams.HTMLMessage
								, To:				''
								, CC:				''
								, BCC:				''
								, Subject:			''
								, draft_msg:		''
								, re_msg:			''
								, fwd_msg:			''
								, files_id:			''
								, template_id:		''
								, HighPriority:		''
								, NeedRcpt:			''
								, LeftMailSize:		mailru.Compose.fileUploaderSettings.MaxAttachmentSize
								, MessageId:		actionParams.message
							}, actionParams, {
								  actionId:			action.time
							});

							this.getForm()
								.reset()
								.redraw(data)
							;

							this._fix();
						}
					}.bind(this));
				}.bind(this));
			}
			else if( mode == 'new' ){
				jsCore.wait(this.id+'.init', function (){
					var Form = this.getForm(), data = Form.getData({ attachments: false });

					$.extend(data, {
						  letbody_html:		this.getSign('html')
						, letbody_plain:	this.getSign('text')
						, HTMLCompose:		mailru.HTMLCompose
						, To:				''
						, CC:				''
						, BCC:				''
						, Subject:			''
						, draft_msg:		''
						, re_msg:			''
						, fwd_msg:			''
						, files_id:			''
						, files_ids:		''
						, actionId:			''
						, template_id:		''
						, HighPriority:		''
						, remind:			''
						, NeedRcpt:			''
						, LeftMailSize:		mailru.Compose.fileUploaderSettings.MaxAttachmentSize
						, MessageId:		jsCore.getRandomHash(8, true, true, true)
					});

					this.getForm()
						.reset()
						.redraw(data)
					;

					this._fix();
				}.bind(this));
			}
			else {
				if( this.getForm() ){
					// If form exists, disabled it
					this.getForm()
						.reset()
						.disableEdit()
					;
				}

				mailru.Ajax.get('/compose/?ajax_call=1&func_name=get_params', data, function (url, result) {

					if (result.isOK() && this.isActive() && url == this._url) {

						jsCore.wait(this.id+'.init', function () {

							var data = result.getData(), draftMode = this.getForm()._getMessageMode();

							if (draftMode && draftId && data.NoMSG && Msg) {

								Msg[draftMode + '_draft'] = Msg.last_draft = Msg.last_draft_type = null;

								$.each(['reply','replyall','forward'], function (k, v) {
									if (Msg[v + '_draft']) {
										Msg.last_draft = Msg[v + '_draft'];
										Msg.last_draft_type = v;
									}
								});

								this.switchMode(draftMode, true);

							} else {

								this.getForm().enableEdit().redraw(data);
							}

							this._fix();

						}.bind(this));
					}

				}.bind(this, this._url));
			}
		},

		setFrom: function() {
			var email = mailru.getCollectorInfoByMessageId(GET.id).email;

			if (!email) {
				email = mailru.useremail;
			}

			if (mailru.hasCollectors()) {
				var bit = $('.js-dropdown__list__item_from').data('bit') || 4;

				this.$View.find('.js-compose__dropdown_email')
					.text(email);

				mailru.EditorFlags |= bit;
			}

			return email;
		},

		_getDraftId: function (Msg, mode) {
			var id;
			if (mailru.MessageFromDraft && mode && Msg && Msg.last_draft) {
				id = Msg[mode + '_draft'];
			}
			return id;
		},

		abort: function ()
		{	// Aborting "load" msg params
			if( this._xhr ) try
			{
				this._xhr.abort();
			}
			catch (er){}
		},

		getUrl: function ()
		{
			return	this._url;
		},

		getSign: function (type/*text OR html*/)
		{	// Get signature for new message
			var t = this._signature, s = mailru.UserSignature, dS = mailru.DefaultSignature;

			if( !this.__signatureLoaded )
			{
				this.__signatureLoaded	= true; // reset the variable in "_redraw"

				if( $.trim(s) == '' && !mailru.DisableReklama )
				{	// No signature and not disabled advertising, we get a ad
					if( !mailru.UserHasMy )
					{	// If the world was not created, then we get a defaultSlot
						if( dS ) t = Ajax.getSyncData('/tmpl/static', { getSlotById: dS }) || '';
					}
					else
					{
						t	= Ajax.getSyncData('/tmpl/static', { getSlotById: 563 }) || '';
					}

					t	= $.trim(t) != '' ? '--\n'+t : '';
				}
				else
				{	// Use signature user
					t	= s;
				}

				// If signature not empty, use it
				t	= $.trim(t) != '' ? '\n\n\n' + t : '';
			}

			// Save signature in "text" mode
			this._signature	= t;

			if( t != '')
			{
				if (type == 'html') {
					t = t.replace(/\r?\n/g, '<br/>');
				} else {
					t = window.replaceEntity(t);
				}
			}

			return	t;
		},


		open: function (params, load, disableHistory){
			params	= this._toOldFormat(params);

			// ПИЗДЕЦ!
			var ids = params.match(/id=/g), key, url;

			if( /replyall/.test(params) && !/reply[&=]/.test(params) ){
				params += '&reply';
			}

			if( ids && ids.length > 1 || /forward=attach|filesearch/.test(params) ){
				key	= ajs.now();
				this.__GET[key]	= params;
				if( disableHistory ){
					params = '_key_='+key;
				} else {
					jsHistory.set('/compose/?_key_='+key);
				}
			}

			load && this.load(params)
		},


		_toOldFormat: function (params){
			if( !~params.indexOf('id=') ){
				var match = params.match(/\/([\d,;]+)\/([^\/]+)/);
				if( match ){
					if( match[2] == 'draft' ){
						match[2] = 'drafts';
					}
					params = match[2].replace(/-/g, '=') +'&id='+ match[1].split(',').join('&id=');
				}
			}

			return	params;
		}

	});


	jsLoader.loaded('{mailru.view}mailru.View.Compose', 1);

// data/ru/images/js/ru/Views/mailru.View.Compose.js end

// data/ru/images/js/ru/jsCore/Projects/mail.ru/Offline/mailru.OfflineLogger.js start


var _performance = window['performance'] || {};
	_performance.now = function() {
		return _performance['now'] || _performance['mozNow'] || _performance['msNow'] || _performance['oNow'] || _performance['webkitNow'] || function() {
			return new Date().getTime();
		};
	}();

	var LoggerItemList = [];
	var LoggerItemListToConsole = [];

	var LoggerItem = function (name, message, start_time, args) {
		this.name = name;
		this.message = message;
		this.start_data = args.length > 1 ? args : args[0];
		this.start_date = new Date();
		this.start_time = start_time;
	};

	LoggerItem.prototype = {

		done: function (end_time, args) {
			this.time = end_time - this.start_time;
			this.end_data = args.length > 1 ? args : args[0];
		},

		toConsole: function () {

			var args = [this.toString()];

			if (this.start_data !== undefined) {
				args.push('[start data] ->', this.start_data);
			}

			if (this.end_data !== undefined) {
				args.push('[end data] ->', this.end_data);
			}

			ajs.log.apply(ajs.log, args);
		},

		toConsoleJSON: function () {

			function censor (key, value) {
				if (value) {
					if (typeof value == 'object') {
						if (value.nodeName) {
							return 'DOMElement ' + value.nodeName;
						}
					}
				}
				return value;
			}

			var args = [this.toString()];

			if (this.start_data !== undefined) {
				args.push('[start data] ->', JSON.stringify(this.start_data, censor));
			}

			if (this.end_data !== undefined) {
				args.push('[end data] ->', JSON.stringify(this.end_data, censor));
			}

			ajs.log.apply(ajs.log, args);
		},

		toString: function () {
			return '   ---> [' + this.name + ': ' + this.start_date.format('H:I:S') + '] ' + this.message + ': ' + this.time.toFixed(3);
		}
	};

	var LoggerInterface = $.noop;

	Array.forEach(['start', 'startAt', 'end', 'endAt', 'push'], function (name) {
		LoggerInterface.prototype[name] = $.noop;
	});

	Array.forEach(['toConsole', 'toConsoleJSON'], function (name) {
		LoggerInterface[name] = $.noop;
	});

	/**
	 * @class mailru.OfflineLogger
	 */
	var Logger = function (name) {
		this.inputToConsole = window['store'].get('offline.log_to_console');
		this.name = name;
		this.map = [];
		this.length = 0;
	};

	Logger.prototype = {

		start: function (message) {
			var args = Array.prototype.slice.call(arguments, 1);
			var item = new LoggerItem(this.name, message, _performance.now(), args);
			this.push(item);
			return item;
		},

		startAt: function (key, message) {
			return this.map[key] = this.start(message);
		},

		end: function (item) {
			var args = Array.prototype.slice.call(arguments, 1);
			item.done(_performance.now(), args);
			if (this.inputToConsole) {
				for (var itemToConsole, i = 0, l = LoggerItemListToConsole.length; i<l; i++) {
					itemToConsole = LoggerItemListToConsole[i];
					if ('time' in itemToConsole) {
						itemToConsole.toConsole();
						LoggerItemListToConsole.splice(i, 1);
						l--;
						i--;
					} else {
						break;
					}
				}
			}
		},

		endAt: function (key) {
			var item = this.map[key];
			if (item) {
				this.end(item);
			}
		},

		push: function (item) {
			if (LoggerItemList.length > 500) {
				LoggerItemList.shift();
			}
			LoggerItemList.push(item);

			if (this.inputToConsole) {
				LoggerItemListToConsole.push(item);
			}
		}
	};

	Logger.toConsole = function () {
		ajs.log('\n----------//----------//----------//----------//----------//----------//----------//----------\n');
		for (var i = 0, l = LoggerItemList.length; i<l; i++) {
			LoggerItemList[i].toConsole();
		}
	};

	Logger.toConsoleJSON = function () {
		ajs.log('\n----------//----------//----------//----------//----------//----------//----------//----------\n');
		for (var i = 0, l = LoggerItemList.length; i<l; i++) {
			LoggerItemList[i].toConsoleJSON();
		}
	};

	if (mailru['isC']) {
		mailru.OfflineLogger = Logger;
	} else {
		mailru.OfflineLogger = LoggerInterface;
	}

	jsLoader.loaded('{mailru.offline}mailru.OfflineLogger', 1);

// data/ru/images/js/ru/jsCore/Projects/mail.ru/Offline/mailru.OfflineLogger.js end

// data/ru/images/js/ru/jsCore/Projects/mail.ru/Offline/mailru.OfflineTransport.js start


var _log = new mailru.OfflineLogger('OfflineWebstoreTransport');

	/**
	 * @class mailru.OfflineWebstoreTransport
	 */
	jsClass
	.create('mailru.OfflineWebstoreTransport')
	.statics({
		defaultOptions: {
			timeout: 10000
		}
	})
	.methods({

		__construct: function (options) {

			this.options = $.extend({}, mailru.OfflineWebstoreTransport.defaultOptions, options);

			this.type = 'webstore';

			var webstoreHost = location.protocol + '//' + this.options.userMD5 + '.webstore.mail.ru';

			if (/((omega|alpha)\.test|win\d+\.dev)\.mail\.ru$/.test(location.host)) {
				webstoreHost = 'http://' + this.options.userMD5 + '.webstore.' + location.host;
			}

			this.readyTimerId = setTimeout(this._complete.bind(this, 'error'), this.options.timeout);

			var RpcConfig = {
				channel: 'webstore',
				remote: webstoreHost + '/cgi-bin/lstatic?' + $.param({
					get: 'webstore',
					offline_data_version: mailru['OfflineDataVersion'],
					offline_storage_version: mailru['OfflineStorageVersion'],
					messages_per_page: mailru['messagesPerPage'],
					nomanifest: +!mailru['OfflineManifest']
				}),
				props: {
					style: {
						display: 'none'
					}
				}
			};

			var RpcJsonRpcConfig = {
				local: {
					storageStatus: this._complete.bind(this)
				},
				remote: {
					post: {},
					dropAppCache: {},
					removeStorage: {}
				}
			};

			_log.startAt('transport', 'init storageTransport', RpcConfig, RpcJsonRpcConfig);

			this.transport = new mailru.OfflineCache.easyXDM.Rpc(RpcConfig, RpcJsonRpcConfig);
		},

		_complete: function (textStatus) {

			_log.endAt('transport', textStatus);

			if (textStatus == 'success') {
				clearTimeout(this.readyTimerId);
			}
			this.options.complete(textStatus);
		},

		post: function (url, data, complete) {

			var _li = _log.start('post', url, data);

			complete = complete || $.noop;

//			var success = function (response) {
//				_log.end(_li, 'success', response);
//				complete(response);
//			};
//
//			var error = function (response) {
//				if (response) {
//					_log.end(_li, 'error', response);
//				}
//				complete();
//			};

			var success = function (response) {
				_log.end(_li, 'success', response[0], response[1]);
				complete(response[1]);
			};

			var error = function (response) {
				_log.end(_li, 'error', response[0], response[1]);
				complete();
			};

			if (this.transport.post) {
				var parts = url.split('/');
				this.transport.post({
					object: parts.shift(),
					method: parts.join('/'),
					data: data
				}, success, error);
			} else {
				error();
			}
		},

		dropAppCache: function (successFn, errorFn) {
			this.transport.dropAppCache(successFn, errorFn);
		},

		removeStorage: function (successFn, errorFn) {
			this.transport.removeStorage(successFn, errorFn);
		},

		destroy: function () {
			this.transport.destroy();
		}
	});

	/**
	 * @class mailru.OfflinePluginTransport
	 */
	jsClass
	.create('mailru.OfflinePluginTransport')
	.methods({

		__construct: function (options) {
			this.options = $.extend({}, mailru.OfflinePluginTransport.defaultOptions, options);
			setTimeout(function () {
				this._complete('success');
			}.bind(this), 0);
		},

		_complete: function (textStatus) {
			this.options.complete(textStatus);
		},

		post: function (url, data, complete) {
			complete();
		},

		dropAppCache: function (successFn) {
			if (successFn) {
				successFn();
			}
		},

		removeStorage: function (successFn) {
			if (successFn) {
				successFn();
			}
		},

		destroy: function () {
		}
	});

	/**
	 * @class mailru.OfflineTransport
	 */
	jsClass
	.create('mailru.OfflineTransport')
	.methods({

		__construct: function (options) {
			if (0) {
				this.transport = new mailru.OfflinePluginTransport(options);
			} else {
				this.transport = new mailru.OfflineWebstoreTransport(options);
			}
		},

		getType: function () {
			return this.transport.type;
		},

		post: function (url, data, complete) {

			if ($.isFunction(data)) {
				complete = data;
				data = null;
			}

//			var _complete = complete;
//
//			complete = function (response) {
//
//				ajs.log('__REQUEST', url, data);
//				ajs.log('__RESPONSE', response);
//
//				if (_complete) {
//					_complete(response);
//				}
//			};

			this.transport.post(url, data, complete);
		},

		dropAppCache: function (complete) {
			this.transport.dropAppCache(complete, complete);
		},

		removeStorage: function (complete) {
			this.transport.removeStorage(complete, complete);
		},

		destroy: function () {
			this.transport.destroy();
		}
	});

	jsLoader.loaded('{mailru.offline}mailru.OfflineTransport', 1);

// data/ru/images/js/ru/jsCore/Projects/mail.ru/Offline/mailru.OfflineTransport.js end

// data/ru/images/js/ru/jsCore/Projects/mail.ru/Offline/mailru.OfflineActionManager.js start


var _log = new mailru.OfflineLogger('OfflineActionManager');

	/**
	 * @class mailru.OfflineActionManager
	 */
	jsClass
	.create('mailru.OfflineActionManager')
	.statics({
		defaultOptions: {
			actionsTemplateId: '#offline__actions_ejs',
			actionsContainerSelector: '#announcements__offline-actions'
		}
	})
	.methods({

		__construct: function (Transport, options) {
			var self = this;
			this.Transport = Transport;
			this.options = $.extend({}, mailru.OfflineActionManager.defaultOptions, options);
			this.actions = [];

			this.controlClickObserver = this._controlClick.bind(this);

			this.$container = $(this.options.actionsContainerSelector);
			this.$container.delegate('.js-control', 'click', this.controlClickObserver);

			$(window).bind('update.offlineActions', function () {
				self._updateActions();
			});
		},

		getActions: function () {

			var _li = _log.start('getActions');

			var self = this, deffered = $.Deferred();
			if (this.loaded) {

				_log.end(_li, 'loaded', this.actions);

				deffered.resolve(this.actions);
			} else {
				if (this.getActionsDeferred) {
					deffered = this.getActionsDeferred;
				} else {
					this.getActionsDeferred = deffered;
					this.Transport.post('messages/getActions', null, function (response) {
						self.loaded = true;
						if ($.isArray(response)) {

							_log.end(_li, 'done', response);

							deffered.resolve(self.actions = response);
						} else {

							_log.end(_li, 'fail', response);

							deffered.reject();
						}
					});
				}
			}
			return deffered.promise();
		},

		execActions: function () {

			var _li = _log.start('execActions');

			var self = this, deffered = $.Deferred();
			if (this.execActionDeferred) {
				deffered = this.execActionDeferred;
			} else {
				this.execActionDeferred = deffered;
				$.when(deffered.promise()).then(function () {

					_log.end(_li, 'done');

					delete self.execActionDeferred;
				}, function () {

					_log.end(_li, 'fail');

					delete self.execActionDeferred;
				});

				this.getActions().then(function (actions) {
					self._execActions(Array.prototype.concat(actions)).done(function () {
						if (mailru.Updater) {
							mailru.Updater.cts = {};
						}
						deffered.resolve();
					});
				}, function () {
					deffered.reject();
				});
			}
			return deffered.promise();
		},

		_updateActions: function () {
			var sendmsgActions = [];
			$.each(this.actions, function (k, action) {
				if (action.cmd == 'sentmsg') {
					sendmsgActions.push(action);
				}
			});
			this.$container.tpl(this.options.actionsTemplateId, {
				Actions: sendmsgActions
			});
			this.$container.toggle(sendmsgActions.length > 0);
		},

		_controlClick: function (evt) {
			var $control = $(evt.target).closest('.js-control', this.$container);
			if ($control.length) {
				if ($control.hasClass('js-close')) {
					var id = $control.data('id');
					this.deleteAction(parseInt(id));
					evt.preventDefault();
				}
			}
		},

		getActionCount: function () {
			return this.actions.length;
		},

		getAction: function (id) {
			var deffered = $.Deferred();
			this.getActions().done(function (actions) {
				var action, i = actions.length;
				for ( ; i--; ) {
					if (actions[i].time == id) {
						action = actions[i];
						break;
					}
				}
				deffered.resolve(action);
			});
			return deffered.promise();
		},

		putAction: function (cmd, data, id) {
			var action = {
				cmd: cmd,
				data: data,
				time: id || ajs.now()
			};
			var actions = this.actions, i = actions.length, find;
			for ( ; i--; ) {
				if (actions[i].time == action.time) {
					find = 1;
					break;
				}
			}
			if (find) {
				actions.splice(i, 1, action);
			} else {
				actions.push(action);
			}
			$(window).triggerHandler('update.offlineActions', [this.actions]);
			this.Transport.post('messages/putActions', [action]);
		},

		deleteAction: function (id) {
			var actions = this.actions, i = actions.length;
			for ( ; i--; ) {
				if (actions[i].time == id) {
					actions.splice(i, 1);
					break;
				}
			}
			$(window).triggerHandler('update.offlineActions', [this.actions]);
			this.Transport.post('messages/deleteActions', [id]);
		},

		_execActions: function (actions) {

//			ajs.log('__OFFLINE _execActions', actions, actions.length);

			var self = this, deferred = $.Deferred(), length = actions.length, count = 0;

			function complete() {
				if (++count >= length) {
					deferred.resolve();
				}
			}

			function doNext ()  {
				var action = actions.shift();
				if (action) {
					self._execAction(action).then(function () {
						self.deleteAction(action.time);
						complete();
						doNext();
					}, function () {
						deferred.resolve();
					});
				}
			}

			if (length > 0) {
				doNext();
			} else {
				deferred.resolve();
			}

			return deferred.promise();
		},

		_execAction: function (action) {

			var deferred = $.Deferred();

			mailru.API.ajax({
				url: action.data.url,
				type: 'POST',
				cacheRunning: 1,
				data: action.data.data,
				complete: function (result, textStatus) {
					if (textStatus == 'success') {
						deferred.resolve();
					} else {
						deferred.reject();
					}
				}
			});

			return deferred.promise();
		}
	});

	jsLoader.loaded('{mailru.offline}mailru.OfflineActionManager', 1);

// data/ru/images/js/ru/jsCore/Projects/mail.ru/Offline/mailru.OfflineActionManager.js end

var _log = new mailru.OfflineLogger('OfflineCacheManager');

	var AccountManager = function () {
		this.active_user_email = mailru['OfflineMode'] ? store.get('user_active') : mailru.useremail;
		this.map = {
			users_authorized: store.get('users_authorized')
		};
		this.map['users_' + this.active_user_email] = store.get('users_' + this.active_user_email);
	};

	AccountManager.prototype = {

		isAuth: function () {
			var users_authorized = this.map['users_authorized'];
			var user_active = this.active_user_email;
			if (user_active && $.isArray(users_authorized)) {
				for (var i = users_authorized.length; i--; ) {
					if (users_authorized[i] === user_active) {
						return true;
					}
				}
			}
			return false;
		},

		isEnableOfflineMode: function () {
			var user_data = this._getUserData();
			return user_data && user_data.offline && user_data.offline.enabled && user_data.offline.auth_key;
		},

		setOfflineModeStatus: function (enabled, password) {

			var user_data = this._getUserData();

			if (enabled) {

				user_data = $.extend(true, user_data, {
					offline: {
						enabled: true,
						auth_key: ajs.MD5(this.active_user_email + password)
					}
				});

			} else {

				if (user_data) {
					delete user_data['offline'];
				}
			}

			this.save('users_' + this.active_user_email, user_data);
		},

		auth: function (email, password) {
			var users_authorized = this.map['users_authorized'];
			var user_data = this._getUserData();
			var isAuth = user_data && user_data.offline && user_data.offline.auth_key == ajs.MD5(email + password);

			if (isAuth) {
				users_authorized.push(email);
				this.save('users_authorized', users_authorized);
			}

			return isAuth;
		},

		logout: function () {
			this.save('users_authorized', []);
		},

		save: function (key, data) {
			store.set(key, this.map[key] = data);
		},

		getActiveEmail: function () {
			return this.active_user_email;
		},

		_getUserData: function () {
			return this.map['users_' + this.active_user_email];
		}
	};

	var PreloadManager = function (Transport) {

		this.Transport = Transport;

		this.messagesData = [];
		this.foldersData = [];

		this.currentCount = this.allCount = 0;
		this.cacheFolders = {};

		this.$indicator = $('#OfflinePreloadIndicator').show();
		this.$indicatorPercentContainer = this.$indicator.find('.js-percent-container');
		this.$indicatorPercent = this.$indicatorPercentContainer.find('.js-percent');

		if ($.isArray(window.arMailRuFolders)) {
			Array.forEach(arMailRuFolders, function (folder) {
				this.cacheFolders[folder.Id] = folder;
			}, this);
		}
	};

	PreloadManager.MAX_CACHE_PAGE_COUNT = 2;

	PreloadManager.prototype = {

		preloadData: function () {

			if ($.isArray(window.arMailRuFolders)) {

				Array.forEach(arMailRuFolders, function (folder, index) {
					folder.Sort = index;
				});

				this.Transport.post('messages/clearAndPutFolders', arMailRuFolders);

				if (mailru['OfflinePreload']) {
					this.loadFoldersByList(arMailRuFolders);
				}
			}
		},

		preloadFolders: function (params, folders) {

//			ajs.log('preloadFolders', params, folders);

			var list = [];
			if ($.isArray(folders)) {
				Array.forEach(folders, function (folder) {
					if (folder.Id != params.folder) {
						var cacheFolder = this.cacheFolders[folder.Id];
						if (cacheFolder) {
							if (cacheFolder.Unread != folder.Unread || cacheFolder.Messages != folder.Messages) {
								list.push(folder);
							}
						}
					}
					this.cacheFolders[folder.Id] = folder;
				}, this);
			}

			this.loadFoldersByList(list);
		},

		preloadMessages: function (params, messages) {

//			ajs.log('preloadMessages', params, messages);

			if ($.isArray(messages) && messages.length > 0) {

				this.Transport.post('messages/putMessagesPreview', {
					folder: params.folder,
					limit: params.limit,
					offset: params.offset,
					messages: messages
				});

				if (params.page < PreloadManager.MAX_CACHE_PAGE_COUNT) {
					this.currentCount += mailru.messagesPerPage;
					this.allCount += mailru.messagesPerPage;
					this.checkMessages(messages);
				}
			}
		},

		loadFoldersByList: function (folders) {

//			ajs.log('loadFoldersByList', folders);

			var foldersData = [];
			for (var q=0, n=folders.length; q<n; q++) {
				for (var i=0, l=PreloadManager.MAX_CACHE_PAGE_COUNT; i<l; i++) {
					this.currentCount += mailru.messagesPerPage;
					this.allCount += mailru.messagesPerPage;
					foldersData[i * n + q] = [folders[q].Id, i + 1];
				}
			}
			this.updatePreloadInfo();
			this.loadFolders(foldersData);
		},

		updatePreloadInfo: function () {
//			ajs.log('updatePreloadInfo', this.currentCount, this.allCount);
			if (this.currentCount > 0 && this.currentCount < this.allCount) {
				var percent = Math.ceil(100 - (100 / this.allCount * this.currentCount));
				this.$indicatorPercentContainer.show();
				this.$indicatorPercent.text(percent);
			} else {
				this.$indicatorPercentContainer.hide();
			}

			if (this.currentCount <= 0) {
				this.currentCount = this.allCount = 0;
			}
		},

		loadNextFolder: function () {
			var self =this;
			var data = this.foldersData.shift();
			if (data) {
				this.doLoadFolder(data[0], data[1], function (result) {

					var hasMessages;

					if (result.isOK()) {
						var resultData = result.getData(), options = result.getOpts().data;
						if (resultData) {
							if ($.isArray(resultData.messages) && resultData.messages.length > 0) {
								hasMessages = 1;
								self.Transport.post('messages/putMessagesPreview', {
									folder: options.folder,
									limit: options.limit,
									offset: options.offset,
									messages: resultData.messages
								}, function () {
									setTimeout(function () {
										self.loadNextFolder();
									}, 500);
								});
								self.checkMessages(resultData.messages);
							}
						}
					}

					if (!hasMessages) {
						self.currentCount -= mailru.messagesPerPage;
						self.updatePreloadInfo();

						setTimeout(function () {
							self.loadNextFolder();
						}, 500);
					}
				});
			} else {
				this.preloadIsLoadedData = false;
			}
		},

		loadFolders: function (foldersData) {
			this.foldersData = this.foldersData.concat(foldersData);
			if (!this.preloadIsLoadedData) {
				this.preloadIsLoadedData = true;
				this.loadNextFolder();
			}
		},

		loadNextMessage: function () {
			var self = this;
			var data = this.messagesData.shift();
			if (data) {
				this.doLoadMessage(data, function (result) {

					var hasMessage;

					if (result.isOK()) {
						var resultData = result.getData();
						if (resultData && resultData[0]) {
							var message = resultData[0];
							if (message && !message['NoMSG']) {
								hasMessage = 1;
								self.Transport.post('messages/putMessages', [message], function () {
									setTimeout(function () {
										self.loadNextMessage();
									}, 500);
								});
							}
						}
					}

					self.currentCount--;
					self.updatePreloadInfo();

					if (!hasMessage) {
						setTimeout(function () {
							self.loadNextMessage();
						}, 500);
					}
				});
			} else {
				this.preloadIsLoadedMessage = false;
			}
		},

		loadMessages: function (messagesData) {
			this.messagesData = this.messagesData.concat(messagesData);
			if (!this.preloadIsLoadedMessage) {
				this.preloadIsLoadedMessage = true;
				this.loadNextMessage();
			}
		},

		checkMessages: function (messages) {

			var self = this, ids = [];

			$.each(messages, function (k, message) {
				ids.push(message.Id);
			});

			this.Transport.post('messages/hasMessages', ids, function (response) {
				if (response) {
					var presentIds = response[0], unpresentIds = response[1];
					self.currentCount -= (presentIds.length + (mailru.messagesPerPage - (presentIds.length + unpresentIds.length)));
					self.updatePreloadInfo();
					if ($.isArray(unpresentIds)) {
						self.loadMessages(unpresentIds);
					}
				}
			});
		},

		doLoadMessage: function (messageId, complete) {
			mailru.API.ajax({
				url: '/message/?func_name=get_messages_by_id',
				cacheRunning: 1,
				data: {
					id: messageId
				},
				complete: complete
			});
		},

		doLoadFolder: function (folderId, page, complete) {
			if (mailru['IsChecknewToStatus']) {
				mailru.API({
					url: 'messages/status',
					convertResultToOldApi: true,
					cacheRunning: 1,
					data: {
						// old params
						cts: ajs.now(),
						force: 1,
						now: ajs.now(),
						sortby: 'D',
						page: page,

						// new params
						sort: {
							type: 'date',
							order: 'desc'
						},
						folder: folderId,
						offset: mailru.messagesPerPage * (page - 1),
						limit: mailru.messagesPerPage,
						last_modified: ajs.now(),
						htmlencoded: false
					},
					complete: complete
				});
			} else {
				mailru.API.ajax({
					url: '/cgi-bin/checknew',
					cacheRunning: 1,
					data: {
						noF: 1,
						nolog: 1,
						force: 1,
						folder: folderId,
						sortby: 'D',
						page: page,
						limit: mailru.messagesPerPage,
						offset: mailru.messagesPerPage * (page - 1)
					},
					complete: complete
				});
			}
		}
	};


	/**
	 * @class mailru.OfflineCacheManager
	 */
	jsClass
	.create('mailru.OfflineCacheManager')
	.extend(jQueryEvent)
	.statics({
		defaultOptions: {
			offlineModeNoAuthClass: 'GlobalOfflineModeNoAuth',
			offlineModeClass: 'GlobalOfflineMode',
			onlineModeClass: 'GlobalOnlineMode',
			urlTypePattern: /^(?:https?:\/\/[^/]+)?\/?(?:cgi-bin\/)?([^?]+)/i
		}
	})
	.methods({

		__construct: function (options) {

			var _li = _log.start('__construct');

			this.options = $.extend({}, mailru.OfflineCacheManager.defaultOptions, options);

			this.AccountManager = new AccountManager();

			this.userMD5 = ajs.MD5(this.AccountManager.getActiveEmail());

			this.onFirstActionsExecuteObserver = this._onFirstActionsExecute.bind(this);
			this.onChangeOfflineModeObserver = this._onChangeOfflineMode.bind(this);

			_log.end(_li);
		},

		onDOMReady: function () {

			var self = this;

			this.$logoutLink = $('#PH_logoutLink');

			if (this.isEnabled()) {

				this.$logoutLink.bind('click', {scope: this}, function (evt) {
					evt.data.scope.AccountManager.logout();
					if (mailru['OfflineMode']) {
						evt.preventDefault();
						location.href = '/';
					}
				});
			}

			if (mailru['OfflineMode']) {

				if (this.isAuth() && this.isEnabled()) {

					$(document.body).removeClass(this.options.offlineModeNoAuthClass);

					this.setActivate(true);

				} else {

					this._complete('error');

					ajs.require('{plugins}' + 'LayerManager', function() {
						LayerManager.show('noAuthOffline', {
							active_email: self.AccountManager.getActiveEmail(),
							success: function (layer, email, password) {
								if (self.AccountManager.auth(email, password)) {
									location.href = '/';
								} else {
									$('.js-formError', layer.$div).text(Lang.get('password.wrong')).show();
								}
								return false;
							}
						});
					});

					this._complete('error');
				}

			} else {

				if (this.isEnabled()) {

					this.setActivate(true);
				}
			}

			_log.endAt('onDOMReady');
		},

		_initialize: function () {

			var _li_init = _log.start('_initialize');

			_log.startAt('complete', 'init offlineCacheComplete');

			var self = this;

			if (!mailru['OfflineMode']) {

				this.AccountManager.save('user_active', mailru.useremail);

				if (/win\d+\.dev\.mail\.ru$/.test(location.host)) {
					this.AccountManager.save('users_authorized', [mailru.useremail]);
				} else {
					__PH.loadAccountsList(function (list) {
						if (list && $.isArray(list.accounts)) {
							for (var accounts = [], i = list.accounts.length; i--; ) {
								if (list.accounts[i] && list.accounts[i].email) {
									accounts.push(list.accounts[i].email);
								}
							}
							this.AccountManager.save('users_authorized', accounts);
						}
					}.bind(this));
				}
			}

			var RpcConfig = {
				channel: 'appcache',
				remote: '/cgi-bin/lstatic?' + $.param({
					get: 'appcache',
					offline_data_version: mailru['OfflineDataVersion'],
					offline_storage_version: mailru['OfflineStorageVersion'],
					messages_per_page: mailru['messagesPerPage'],
					nomanifest: +!mailru['OfflineManifest']
				}),
				onReady: function () {
					_log.end(_li_appcacheTransport);
				},
				props: {
					style: {
						display: 'none'
					}
				}
			};

			var RpcJsonRpcConfig = {
				remote: {
					dropAppCache: {}
				}
			};

			var _li_appcacheTransport = _log.start('appcacheTransport', RpcConfig, RpcJsonRpcConfig);

			this.appcacheTransport = new mailru.OfflineCache.easyXDM.Rpc(RpcConfig, RpcJsonRpcConfig);

			var transportConfig = {
				userMD5: this.userMD5,
				complete: function (textStatus) {

					_log.endAt('storageTransport', textStatus);

					if (textStatus == 'success') {
						self.execActions().then(self.onFirstActionsExecuteObserver, self.onFirstActionsExecuteObserver);
					} else {
						self._complete('error');
					}
				}
			};

			_log.startAt('storageTransport', 'storageTransport complete', transportConfig);

			this.Transport = new mailru.OfflineTransport(transportConfig);

			this.PreloadManager = new PreloadManager(this.Transport);
			this.OfflineActionManager = new mailru.OfflineActionManager(this.Transport);

			_log.end(_li_init);
		},

		_complete: function (textStatus) {

			_log.endAt('complete', textStatus);

			this.isComplete = true;

			if (textStatus == 'success') {
				$(window).bind('offlinechange.offline', this.onChangeOfflineModeObserver);
				$(window).triggerHandler('offlinechange', [ajs.offline]);
			}

			this.triggerHandler('complete');
		},

		_onFirstActionsExecute: function () {

			if (mailru.Updater) {
				mailru.Updater.reload();
			}

			if (!ajs.offline) {
				this.PreloadManager.preloadData();
			}

			$(window).triggerHandler('update.offlineActions');

			this._complete('success');
		},

		ajax: function (o, ajaxData, callback) {

			var self = this;

			if (!o.cacheRunning && this.isAllowed()) {

				if (!this.isComplete) {

					var _li_complete = _log.start('ajax offlineCacheComplete');

					this.one('complete', function () {
						_log.end(_li_complete);

						self.ajax(o, ajaxData, callback);
					});

				} else if (!o.isExecActions && this.getActionCount()) {

					o.isExecActions = true;

					var _li_execActions = _log.start('ajax execActions');

					this.execActions().then(function () {
						_log.end(_li_execActions, 'done');
						self.ajax(o, ajaxData, callback);
					}, function () {
						_log.end(_li_execActions, 'fail');
						self.ajax(o, ajaxData, callback);
					});

				} else {

					if (mailru['ForceOfflineMode']) {
						this.getCache(o, !mailru['ForceOfflineMode'], function (response, old_answer) {
							callback(response, o, {status: 200, readyState: 4}, 'success', 200, '', old_answer);
						});
					} else if (mailru['EnableOfflineModeLoadFromCache']) {
						this.getCache(o, !mailru['ForceOfflineMode'], function (response, old_answer) {
							if (response) {
								callback(response, o, {status: 200, readyState: 4}, 'success', 200, '', old_answer);
							} else {
								$.ajax(ajaxData);
							}
						});
					} else {
						$.ajax(ajaxData);
					}
				}

			} else {
				$.ajax(ajaxData);
			}
		},

		parse: function (jqXHR, textStatus, o, callback) {

			if (typeof jqXHR == 'string' || jqXHR === undef) {
				jqXHR = {status: 200, responseText: jqXHR, readyState: 4};
			}

			var status, response, error = ''; try { status = jqXHR.status; } catch (er){ status = 403; textStatus = 'xhr_error'; }

			var useOfflineStorage = this.isAllowed() && !(o && o.cacheRunning);

			o = o || { dataType: 'json', type: 'GET' };

			if (status == 200) {
				response = jqXHR.responseText;
				if (textStatus == 'success' && (o.dataType == 'json' || o.dataType == 'text')) {
					if (o.dataType == 'json') {
						try {
							response = jQuery.parseJSON(response, o);
							if (useOfflineStorage) {
								try {
									this.setCache(o, response);
								} catch (e) {}
							}
						} catch (e) {
							if (useOfflineStorage && ~response.indexOf('__OFFLINE_MODE__')) {
								return this.getCache(o, false, function (response, old_answer) {
									if (response) {
										callback(response, o, {status: 200, readyState: 4}, 'success', 200, error, old_answer);
									} else {
										callback(response, o, jqXHR, 'parsererror', status, e);
									}
								});
							} else {
								return callback(response, o, jqXHR, 'parsererror', status, e);
							}
						}
					} else {
						if (useOfflineStorage) {
							if (~response.indexOf('__OFFLINE_MODE__')) {
								return this.getCache(o, false, function (response, old_answer) {
									if (response) {
										callback(response, o, {status: 200, readyState: 4}, 'success', 200, error, old_answer);
									} else {
										callback(response, o, jqXHR, 'error', status, error);
									}
								});
							} else {
								this.setCache(o, response);
							}
						}
					}
				}
			} else if (status == 302) {
				response = {status: 'redirect', data: jqXHR.getResponseHeader('Location')};
			} else if (useOfflineStorage && jqXHR.status == 0 && textStatus == 'error' && jqXHR.readyState == 0 && !jqXHR.responseText) {
				return this.getCache(o, false, function (response, old_answer) {
					if (response) {
						callback(response, o, {status: 200, readyState: 4}, 'success', 200, error, old_answer);
					} else {
						callback({status: 'error', data: status}, o, jqXHR, 'error', status, error);
					}
				});
			} else {
				response = {status: 'error', data: status};
			}

			return callback(response, o, jqXHR, textStatus, status, error);
		},

		setActivate: function (active) {

			var self = this;

			if (active) {

				$R('{easyXDM}' + 'easyXDM.min', function() {
					self.easyXDM = self.easyXDM || easyXDM.noConflict('mailru.OfflineCache');
					self._initialize();
				});

			} else {

				$(window).unbind('.offline', this.onChangeOfflineModeObserver);

				this.Transport.removeStorage(function () {
					self.Transport.dropAppCache(function () {
						self.Transport.destroy();
					});
				});

				this.appcacheTransport.dropAppCache(function () {
					self.appcacheTransport.destroy();
				});
			}
		},

		setEnable: function (enable, password) {
			this.AccountManager.setOfflineModeStatus(enable, password);
			this.setActivate(enable);
		},

		setCache: function (ajaxData, response) {
			this._syncData(ajaxData);
			this._setCache(ajaxData, response);
			if (!mailru['ForceOfflineMode']) {
				if (ajs.offline) {
					$(window).triggerHandler('offlinechange', [ajs.offline = false]);
				}
			}
		},

		getCache: function (ajaxData, beforeAjax, successFn) {

			var _li = _log.start('getCache', ajaxData, beforeAjax);

			var _successFn = function (response, oldAPIFormat) {

				_log.end(_li, response, oldAPIFormat);

				successFn(response, oldAPIFormat);
			};

			ajaxData = $.extend(true, {
				url: '',
				data: {}
			}, ajaxData);

			var self = this;
			var type = this._getUrlType(ajaxData.url), queryData = ajs.toObject(ajaxData.url);

			var statusParams = {
				sort: {
					type: 'date',
					order: 'desc'
				},
				username: mailru.username,
				userdomain: mailru.userdomain,
				folder: ajaxData.data.folder,
				offset: ajaxData.data.offset,
				limit: ajaxData.data.limit,
				before_ajax: beforeAjax
			};

			var messageParams = {
				id: ajaxData.data.id,
				before_ajax: beforeAjax
			};

			if (beforeAjax) {

				if (type == 'readmsg' && queryData.func_name == 'get_messages_by_id' && ajaxData.data.id) {
					this.Transport.post('messages/message', messageParams, function (response) {
						_successFn(response, self.Transport.getType() == 'webstore');
					});
				} else {
					_successFn();
				}

			} else {

				if (type == 'readmsg' && queryData.func_name == 'get_messages_by_id' && ajaxData.data.id) {

					this.Transport.post('messages/message', messageParams, function (response) {
						if (response) {
							var message = response[2];
							if (message.Unread && ajaxData.data.read) {
								message.Unread = 0;
								self.OfflineActionManager.putAction('mark', {
									url: '/cgi-bin/movemsg',
									data: {
										id: [message.Id],
										markmessage: mailru.Message.READ,
										mark: 1,
										ajaxmode: 1
									}
								});
								self.Transport.post('messages/putMessages', [message]);
							}
						}
						_successFn(response, self.Transport.getType() == 'webstore');
					});

				} else if (type == 'api/v1/messages/status' || type == 'checknew') {

					this.Transport.post('messages/status', statusParams, function (response) {
						_successFn(response, type == 'api/v1/messages/status' && self.Transport.getType() == 'webstore');
					});

				} else if (type == 'movemsg' || type == 'spamabuse' || type == 'clearfolder') {

					this._syncData(ajaxData).then(function (response) {

						_successFn(response);

						if (type == 'clearfolder') {
							self.OfflineActionManager.putAction('clear_folder', {
								url: ajaxData.url,
								data: ajaxData.data
							});
						} else if (ajaxData.data.mark) {
							self.OfflineActionManager.putAction('mark', {
								url: ajaxData.url,
								data: ajaxData.data
							});
						} else if (ajaxData.data.move) {
							self.OfflineActionManager.putAction('move', {
								url: ajaxData.url,
								data: ajaxData.data
							});
						} else if (ajaxData.data.spam) {
							self.OfflineActionManager.putAction('spamabuse', {
								url: ajaxData.url,
								data: ajaxData.data
							});
						}

					}, function () {
						_successFn();
					});

				} else if (type == 'sentmsg') {

					if (0 && queryData.func_name == 'message_to_draft') {

						this.OfflineActionManager.putAction('message_to_draft', {
							url: ajaxData.url,
							data: ajaxData.data
						});

						_successFn(['AjaxResponse', 'OK', {
							Id: ajs.now()
						}]);

					} else if (queryData.func_name == 'send') {

						this.OfflineActionManager.putAction('sentmsg', {
							url: ajaxData.url,
							data: ajaxData.data
						}, parseInt(ajaxData.data.actionId));

						_successFn(['AjaxResponse', 'OK', {
							redir_url: 'msglist',
							Ok: '1'
						}]);

					} else {
						_successFn();
					}

				} else if (type == 'lstatic') {

					if (queryData.get == 'compose') {
						mailru.API.ajax({
							url: '/offline/compose',
							type: 'GET',
							dataType: 'text',
							cacheRunning: 1,
							complete: function (result) {
								if (result.isOK()) {
									_successFn(result.getData());
								} else {
									_successFn();
								}
							}
						});
					} else {
						_successFn();
					}

				} else {
					_successFn();
				}

				if (!mailru['ForceOfflineMode']) {
					if (!ajs.offline) {
						$(window).triggerHandler('offlinechange', [ajs.offline = true]);
					}
				}
			}
		},

		getAction: function (id) {
			return this.OfflineActionManager.getAction(id);
		},

		getActionCount: function () {
			return this.OfflineActionManager.getActionCount();
		},

		execActions: function () {
			return this.OfflineActionManager.execActions();
		},

		_setCache: function (o, response) {

			var type = this._getUrlType(o.url);

			if (type != 'checknew' || response.status == 'OK') {

				if (type == 'readmsg') {

					if (response && response[2] && response[2][0]) {
						var message = response[2][0];
						if (message) {
							this.Transport.post('messages/putMessages', [message]);
						}
					}

				} else if (type == 'api/v1/messages/status' || type == 'checknew') {

					if (response) {

						if (type == 'api/v1/messages/status') {
							response = mailru.Utils.AjaxConverter.statusToChecknew(response, o);
						}

						if (response.data) {
							this.PreloadManager.preloadMessages(o.data, response.data.messages);
							this.PreloadManager.preloadFolders(o.data, response.data.folders);
						}
					}
				}
			}
		},

		_syncData: function (o) {

			var self = this;
			var deferred = $.Deferred();
			var trySetCommand = false;
			var type = this._getUrlType(o.url);

			if (type == 'movemsg' || type == 'spamabuse' || type == 'clearfolder') {
				if (o.data) {
					if (type == 'clearfolder') {
						trySetCommand = true;
						this.Transport.post('messages/clearFolder', o.data.folder, function (response) {
							deferred.resolve(response);
						});
					} else if (o.data.mark) {
						trySetCommand = true;
						this.Transport.post('messages/markMessages', {id: o.data.id, state: o.data.markmessage}, function (response) {
							deferred.resolve(response);
						});
					} else if (o.data.move || o.data.spam) {
						trySetCommand = true;
						this.Transport.post('messages/moveMessages', {id: o.data.id, folder: o.data.folder}, function (response) {
							if (o.data.folder == mailru.Folder.TRASH) {
								self.Transport.post('messages/markMessages', {id: o.data.id, state: mailru.Message.READ}, function (response) {
									deferred.resolve(response);
								});
							} else {
								deferred.resolve(response);
							}
						});
					}
				}
			}

			if (!trySetCommand) {
				deferred.reject();
			}

			return deferred.promise();
		},

		_getUrlType: function (url) {
			var result;
			if (typeof url == 'string') {
				var matches = url.match(this.options.urlTypePattern);
				if (matches) {
					result = matches[1];
				}
			}
			return result;
		},

		_onChangeOfflineMode: function (evt, offline) {

			var $body = $(document.body);

			if (offline) {
				$body.removeClass(this.options.onlineModeClass).addClass(this.options.offlineModeClass);
			} else {
				$body.removeClass(this.options.offlineModeClass).addClass(this.options.onlineModeClass);
			}

			if (mailru.ui) {
				var search = mailru.ui['PortalSearchSuggest'];
				if (search) {
					if (offline) {
						$(search.Search.$Input[0]).attr('disabled', 'disabled');
						$('.' + search.Search.opts.cnSectionLink, search.Search.$Form).hide();
					} else {
						$(search.Search.$Input[0]).removeAttr('disabled');
						$('.' + search.Search.opts.cnSectionLink, search.Search.$Form).show();
					}
				}
			}

			if (mailru.Updater) {
				mailru.Updater.cts = {};
			}
		},

		isSupported: function () {
			return !!(window['postMessage']
				&& window['applicationCache']
				&& (
					(window['indexedDB'] || window['webkitIndexedDB'] || window['mozIndexedDB'] || window['msIndexedDB'])
					|| ($.browser.webkit && window['openDatabase']))
				);
		},

		isAuth: function () {
			return !mailru['OfflineMode'] || this.AccountManager.isAuth();
		},

		isEnabled: function () {
			return !!(mailru.username && mailru.userdomain && mailru['EnableOfflineModeSwitcher'] && this.AccountManager.isEnableOfflineMode());
		},

		isAllowed: function () {
			return this.isEnabled() && this.isSupported() && this.isAuth();
		}
	});

	/**
	 * @class mailru.OfflineCache
	 */
	mailru.OfflineCache = new mailru.OfflineCacheManager();

	if (mailru.OfflineCache.isSupported()) {
		_log.startAt('onDOMReady', 'onDOMReady');

		$.isReady ? mailru.OfflineCache.onDOMReady() : $(function () {
			mailru.OfflineCache.onDOMReady();
		});
	}

	jsLoader.loaded('{mailru.offline}mailru.OfflineCache', 1);

// data/ru/images/js/ru/jsCore/Projects/mail.ru/Offline/mailru.OfflineCache.js end

// data/ru/images/js/ru/utils/mailru.Utils.AjaxConverter.js start


var _regexp_macros = /__(BODY|BODY_HTML|BODY_QUOTED|SIGN|SIGN_HTML)_PLACEHOLDER__/g;

	function getMessageEmailFields (toFieldName, data) {
		if ($.isArray(data)) {
			var sep = ', ',
				standartValue = [], shortValue = [], listValue = [],
				value, i = data.length;
			if (toFieldName == 'To') {
				standartValue[0] = shortValue[0] = '<' + Lang.get('readmsg.not_specified') + '>';
			}
			for ( ; i--; ) {
				value = data[i];
				standartValue[i] = value.email || '';
				shortValue[i] = value.name || standartValue[i];
				listValue[i] = value.name ? value.name + ' <' + standartValue[i] + '>' : standartValue[i];
			}
			return [ajs.Html.escape(standartValue.join(sep)), ajs.Html.escape(listValue.join(sep)), ajs.Html.escape(shortValue.join(sep))];
		}
		return null;
	}

	function replaceMacros (text) {
		var signature = mailru['UserSignature'];
		var signature_text = window.replaceEntity(signature), signature_html = signature.replace(/\r?\n/g, '<br/>');
		return text.replace(_regexp_macros, function (body, type) {
			if (type === 'BODY') {
				body = '__LET_BODY_PLAIN__';
			} else if (type === 'BODY_HTML') {
				body = '__LET_BODY_HTML__';
			} else if (type === 'BODY_QUOTED') {
				body = '__LET_BODY_QUOTE_PLAIN__';
			} else if (type === 'SIGN') {
				body = signature_text;
			} else if (type === 'SIGN_HTML') {
				body = signature_html;
			}
			return body;
		});
	}

	function fillEmailFields (from, to, toFieldPrefix, fromFields, toFields) {
		var toFieldName, fields, i = fromFields.length;
		for ( ; i--; ) {
			toFieldName = toFieldPrefix + toFields[i];
			fields = getMessageEmailFields(toFieldName, from[fromFields[i]]);
			if (fields) {
				to[toFieldName] = fields[0];
				to[toFieldName + 'List'] = fields[1];
				to[toFieldName + 'Short'] = to[toFieldName + 'Name'] = fields[2];
				if (toFieldName === 'Cc' || toFieldName === 'ReplyTo' || toFieldName === 'ReplyAllTo' || toFieldName === 'ReplyAllCC' || toFieldName === 'ReSentFrom' || toFieldName === 'ReSentTo') {
					to[toFieldName] = to[toFieldName + 'List'];
					delete to[toFieldName + 'List'];
					delete to[toFieldName + 'Short'];
					delete to[toFieldName + 'Name'];
				} else if (toFieldName === 'From') {
					to[toFieldName + 'Full'] = fields[1];
				}
			}
		}
	}

	function dateWithTimezoneOffset (timestamp) {
		var date = new Date(timestamp * 1000);
//		date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
//		date.setSeconds(date.getSeconds() + mailru['TimezoneOffset']);
		return date;
	}

	mailru.Utils.AjaxConverter = {

		convert: function (response, ajaxData) {
			if (ajaxData.url == '/api/v1/messages/status') {
				response = this.statusToChecknew(response, ajaxData);
			} else if (ajaxData.url == '/api/v1/messages/message') {
				response = this.messageToReadmsg(response, ajaxData);
			}
			return response;
		},

		messageToReadmsg: function (messageJSON, ajaxData) {
			var readmsgJSON = ['AjaxResponse'], response = ['Error'];
			if (messageJSON) {
				var body = messageJSON.body;
				if (messageJSON.status == 400) {
					if (body && body.id && body.id.error == 'not_exist') {
						if (ajaxData && ajaxData.data && ajaxData.data.sm) {
							response = ['Redirect', '/cgi-bin/msglist?folder=500000'];
						} else {
							response = ['OK', [{NoMSG: 1}]];
						}
					}
				} else if (messageJSON.status == 403) {
					if (messageJSON.body == 'token') {
						readmsgJSON = messageJSON;
					} else {
						response = ['Redirect', '/cgi-bin/login?noclear=1&page=mailbox'];
					}
				} else if (messageJSON.status == 200) {
					if (body) {
						response = ['OK', [this.messageToOldApi(body)]];
					}
				}
			}
			if ($.isArray(readmsgJSON)) {
				readmsgJSON = readmsgJSON.concat(response);
			}
			return readmsgJSON;
		},

		statusToChecknew: function (statusJSON, ajaxData) {

			var checknewJSON = {
				status: 'Error'
			};

			if (statusJSON) {

				if (statusJSON.status) {

					checknewJSON.status = 'OK';

					if (statusJSON.status == 304) {
						checknewJSON.status = 'NOP';
					} else if (statusJSON.status == 500) {
						checknewJSON.status = 'Error';
					} else if (statusJSON.status == 403) {
						if (statusJSON.body == 'folder') {
							checknewJSON.status = 'AccessDenied';
						} else if (statusJSON.body == 'token') {
							// MAIL-12297
							checknewJSON = statusJSON;
						} else {
							checknewJSON.status = 'NoAuth';
						}
					}
				}

				if (checknewJSON.status == 'OK' || checknewJSON.status == 'NOP') {

					var emailparts = statusJSON.email.split('@');
					checknewJSON.data = {
						username: emailparts[0],
						userdomain: emailparts[1]
					};

					if (checknewJSON.status == 'OK') {

						checknewJSON.data.build = mailru.build;
						checknewJSON.data.cts = statusJSON.last_modified + '';

						// MAIL-15984
						checknewJSON.data.sortBy = ajaxData.data.sortby || mailru.messagesSort /*|| 'D'*/;

						if (statusJSON.body) {

							if ($.isArray(statusJSON.body.folders)) {
								checknewJSON.data.folders = this.foldersToOldApi(statusJSON.body.folders);
								checknewJSON.data.folders_hash = checknewJSON.data.cts;
							}

							if ($.isArray(statusJSON.body.messages)) {
								checknewJSON.data.messages = this.statusMessagesToOldApi(statusJSON.body.messages);
								checknewJSON.data.messages_hash = checknewJSON.data.cts + checknewJSON.data.sortBy;
							}

							if (statusJSON.body.collectors) {
								checknewJSON.data.collectors = this.collectorsToOldApi(statusJSON.body.collectors);
							}

							checknewJSON.data.token = statusJSON.body.token;
							checknewJSON.data.tokens = statusJSON.body.tokens;
						}
					}
				}

				checknewJSON.token = statusJSON.token;
			}

			return checknewJSON;
		},

		collectorsToOldApi: function (collectors) {
			var newCollectors = {};

			if (Array.isArray(collectors)) {
				Array.forEach(collectors, function(collector) {
					var state = '',
						error = '';

					switch(collector.state) {
						case 'auth_error':
							error = 'auth';
							break;

						case 'extra_auth':
							error = 'extra_auth';
							break;

						case 'blocked':
							error = 'blocked';
							break;

						case 'overlimit_error':
							error = 'limit';
							break;

						case 'internal_error':
							error = 'internal';
							break;

						default:
							state = collector.state;
							break;
					}

					newCollectors[collector.folder] = {
						id:    collector.id,
						email: collector.email,
						type:  collector.type,
						state: state,
						error: error
					}
				});
			}
			return newCollectors;
		},

		foldersToOldApi: function (folders) {
			var newFolders = [];
			if ($.isArray(folders)) {
				for (var folder, i=0, l=folders.length; i<l; i++) {
					folder = folders[i];
					newFolders[i] = {
						Id: folder.id,
						IsSubfolder: folder.child,
						Messages: folder.messages_total,
						Name: folder.name,
						ParentId: folder.parent,
						Secure: folder.security ? (folder.open ? 2 : 1) : 0,
						Unread: folder.messages_unread
					};
				}
			}
			return newFolders;
		},

		statusMessagesToOldApi: function (messages) {
			var newMessages = [];
			if ($.isArray(newMessages)) {
				for (var i=0, l=messages.length; i<l; i++) {
					newMessages[i] = this.statusMessageToOldApi(messages[i]);
				}
			}
			return newMessages;
		},

		statusMessageToOldApi: function (message) {

			var newMessage = {
				Id: message.id,
				DateUTS: message.date,
				FolderId: message.folder,
				NextId: message.next,
				PrevId: message.prev,
				Priority: message.priority,
				Size: message.size + ' ' + Lang.get('Size').kb,
				Subject: ajs.Html.escape(message.subject || Lang.get('message.email.untitled')),
				Microformat: {
					text: message.snippet
				}
			};

			if (message.flags) {
				newMessage.Flagged = message.flags.flagged;
				newMessage.Forward = message.flags.forward;
				newMessage.Reply = message.flags.reply;
				newMessage.Unread = message.flags.unread;
				newMessage.SPF = message.flags.spf;
				newMessage.Attachment = message.flags.attach;
			}

			if (message.correspondents) {
				fillEmailFields(message.correspondents, newMessage, '', ['cc', 'from', 'to', 'bcc'], ['Cc', 'From', 'To', 'Bcc']);
			}

			var date = dateWithTimezoneOffset(message.date);
			newMessage.Date = date.getLocaleFullDate();
			newMessage.DateShort = date.getLocaleDateShort();
			newMessage.DateFull = date.getLocaleDateFull();

			return newMessage;
		},

		messageToOldApi: function (message) {
			var newMessage = this.statusMessageToOldApi(message);

			newMessage.SaveSent = 1;
			newMessage.HTMLCompose = mailru['HTMLCompose'];
			newMessage.AccountVerified = mailru['AccountVerified'];
			newMessage.quote_string = '> ';

			newMessage.MainMailHost = location.host;
			newMessage.MailAttachZipHost = '';
			newMessage.MailAttachPreviewHost = 'apf.' + (mailru.SingleDomainName || 'mail.ru');

			newMessage.AttachmentHost = 'af.attach' + (mailru.SingleDomainName || 'mail.ru');

			if (message.attaches) {

				var Attachments = [], Attachlinks = [], partIds = [], newAttach;

				if ($.isArray(message.attaches.list)) {

					for (var attach, i=0, l=message.attaches.list.length; i<l; i++) {
						attach = message.attaches.list[i];

						newAttach = {
							name: ajs.Html.escape(attach.name),
							size: Math.ceil(attach.size / Math.KB),
							ContentType: attach.content_type,
							avstatus: attach.scan
						};

						if (attach.id) {
							newAttach.PartID = message.id + ';' + attach.id;
							partIds.push(attach.id);
						}

						if (attach.flags) {
							newAttach.IsImage = attach.flags.image;
							newAttach.isTNEF = attach.flags.tnef;
							newAttach.isRFC822 = attach.flags.eml;
							newAttach.IsMp3 = attach.flags.mp3;
						}

						if (attach.href) {
							newAttach.downloadlink = attach.href.download;
						}

						if (attach.duedate) {
							newAttach.duedate = dateWithTimezoneOffset(attach.duedate).getLocaleFullDate();
						}

						if (attach.thumbnails) {
							if (attach.thumbnails.text) {
								newAttach.ContentText = attach.thumbnails.text.snippet;

								var snippetLength = attach.thumbnails.text.snippet.length;
								if (snippetLength < attach.thumbnails.text.length) {
									newAttach.ContentTextLen = snippetLength;
								}
							}

							if ($.isPlainObject(attach.thumbnails.eml)) {
								newAttach.Subject = attach.thumbnails.eml.subject;
							} else {
								newAttach.Subject = attach.thumbnails.eml;
							}

							if (attach.thumbnails.mp3 && attach.thumbnails.mp3.player) {
								var rehost = /^[^/]*\/\/([^/]+)/, matches;
								if (matches = attach.thumbnails.mp3.player.match(rehost)) {
									newMessage.MailAttachZipHost = matches[1];
								}
							}
						}

						if (attach.legacy) {
							newAttach.BodyStart = attach.legacy.BodyStart;
							newAttach.OriginalBodyLen = attach.legacy.OriginalBodyLen;
							newAttach.ContentName = attach.legacy.ContentName;
							newAttach.ContentEncoding = attach.legacy.ContentEncoding;
							newAttach.tnef_id = attach.legacy.tnef_id;
							newAttach.DontShow = attach.legacy.DontShow;
							newAttach.ForceAddNotype = attach.legacy.ForceAddNotype;
							newAttach.ShowThumbnail = attach.legacy.ShowThumbnail;
							newAttach.AddPhoto = attach.legacy.AddPhoto;
						}

						if (attach.type == 'link') {
							Attachlinks.push(newAttach);
						} else {
							Attachments.push(newAttach);
						}
					}
				}

				newMessage.Attachments = Attachments;
				newMessage.Attachfiles_Items = Attachments.length;

				newMessage.Attachlinks = Attachlinks;
				newMessage.Attachlinks_Items = Attachlinks.length;

				if (message.attaches.total) {
					var rehost = /^[^/]*\/\/([^/]+)/, matches;
					if (matches = message.attaches.total.href.match(rehost)) {
						newMessage.AttachAllfiles_AttachHost = matches[1];
						newMessage.AttachAllfiles_MsgId = message.id;
						newMessage.AttachAllfiles_name = message.attaches.total.name;
						newMessage.AttachAllfiles_PartsId = partIds.join('_');
					}
				}

				if (message.attaches.tnef) {
					var winmailData = String.toObject(message.attaches.tnef);
					newMessage.Winmail_name = unescape(winmailData.file);
					newMessage.Winmail_URLFileName = winmailData.file;
					newMessage.Winmail_PartID = winmailData.id;
					newMessage.Winmail_Channel = winmailData.channel;
				}
			}

			if (message.collector) {
				newMessage.collector = message.collector.id;
			}

			if (message.body) {

				newMessage.let_body = message.body.html;
				newMessage.let_body_plain = message.body.text;
			}

			if (message.templates) {

				if (message.templates.replay) {

					newMessage.SubjectRe = ajs.Html.escape(message.templates.replay.subject);
					newMessage.let_body_re = replaceMacros(message.templates.replay.body.html);
					newMessage.let_body_re_plain = replaceMacros(message.templates.replay.body.text);
				}

				if (message.templates.forward) {

					newMessage.SubjectFwd = ajs.Html.escape(message.templates.forward.subject);
					newMessage.let_body_fwd = replaceMacros(message.templates.forward.body.html);
					newMessage.let_body_fwd_plain = replaceMacros(message.templates.forward.body.text);
				}
			}

			if (message.resend) {

				fillEmailFields(message.resend, newMessage, 'ReSent', ['from', 'to'], ['From', 'To']);

				if (message.resend.date) {
					newMessage.ReSentDate = dateWithTimezoneOffset(message.resend.date).getLocaleFullDate();
				}

				newMessage.ReSendComment = message.resend.comment;
			}

			if (message.replies) {

				fillEmailFields(message.replies, newMessage, 'Reply', ['to'], ['To']);
				fillEmailFields(message.replies, newMessage, 'ReplyAll', ['all', 'cc'], ['To', 'CC']);
			}

			if (message.correspondents) {
				if (message.correspondents.from) {
					if (message.correspondents.from[0] && message.correspondents.from[0].avatars) {
						newMessage['Avatar.UrlAbsolute'] = message.correspondents.from[0].avatars['default'];
					}
				}
			}

			if (message.images) {

				if (message.images.attaches2cid) {
					var attaches2cidJSON = JSON.stringify(message.images.attaches2cid);
					newMessage.map_inline_img = attaches2cidJSON.substring(1, attaches2cidJSON.length - 1);
				}

				newMessage.MailWithImages = message.images.exists;
				newMessage.HasBannedImages = message.images.banned;
				newMessage.ImagesAreHidden = message.images.hidden;
			}

			if (message.flags) {

				if (message.flags.safe) {
					newMessage.files_status = 'clean';
				}

				newMessage.HideFastAnswer = message.flags.hide_fast_answers;
				newMessage.Receipt = message.flags.receipt;
				newMessage.x_spam = message.flags.probable_spam;
				newMessage.x_ubl_black = message.flags.blacklist_spam;
			}

			if (message.drafts) {

				newMessage.reply_draft = message.drafts.reply;
				newMessage.replyall_draft = message.drafts.replyall;
				newMessage.forward_draft = message.drafts.forward;

				newMessage.last_draft_type = message.drafts.last_type;

				if (newMessage.last_draft_type) {
					newMessage.last_draft = message.drafts[newMessage.last_draft_type];
				}
			}

			if (message.headers) {
				newMessage.ListUnsubscribe = message.headers['List-Unsubscribe'];
				newMessage.ListSubscribe = message.headers['List-Subscribe'];
			}

			return newMessage;
		}
	};

	jsLoader.loaded('{mailru.utils}mailru.Utils.AjaxConverter', 1);

// data/ru/images/js/ru/utils/mailru.Utils.AjaxConverter.js end

(function (undefined) {
		/** @namespace mailru.threads */
		if( mailru.threads ){
//			jsCookie.set('threads', 1, jsCookie.WEEK);
			jsCookie.remove('threads');
		}
		else {
			jsCookie.remove('threads');
		}


		/**
		 * @class	mailru.API.Result
		 * @param	{mailru.Ajax.Result} Res
		 * @constructor
		 */
		function Response(Res){
			for( var key in Res ) if( Res.hasOwnProperty(key) ){
				this[key] = Res[key];
			}
		}


		Response.fn =
		Response.prototype = (function (fn, F){
			F.prototype = fn;
			return	new F;
		})(mailru.Ajax.Result.fn, function (){});


		var _status = {
			  redirect: 302
			, 'access-denied': 403
		};

		ajs.extend(Response.fn, {
			isOk: function (){
				return	this.isOK();
			},

			getData: function (){
				return	this.body;
			}
		});

		Array.forEach(Object.keys(_status), function(statusName) {
			var statusValue = _status[statusName];

			statusName = $.camelCase('is-' + statusName);

			this[statusName] = Response.fn[statusName] = function () {
				return this.status == statusValue;
			};
		}, window);


		var Ajax = function (_options) {
			var _url = _options.baseUrl + 'v' + _options.version + '/',
				_tokenRetry = _options.tokenRetry, _badToken;

			function convertData(params) {
				var data = $.extend({}, params.data || params.formData, {
					api:   _options.version,
					token: _options.token,
					email: _options.email
				});

				$.each(data, function(field, value){
					if(typeof value === 'object') {
						data[field] = JSON.stringify(value);
					}
				});

				return data;
			}

			return {
				call: function (params) {
					if (mailru['OfflineMode'] || _options.token || params.method === 'tokens') {
						this.send(params);
					} else {
						this.token(params);
					}
				},

				send: function (params) {
					var url = _url + (params.method || params.url);
					if (/iframe/.test(params.dataType)) {
						return $.ajax({
							url:       url,
							type:      'POST',
							formData:  convertData(params),
							dataType:  params.dataType,
							fileInput: params.fileInput,
							success:   this.complete.bind(this, params)
						});
					} else {
						return mailru.Ajax({
							url:            		url,
							data:           		convertData(params),
							type:           		params.type,
							isUser:         		params.isUser,
							loading:        		params.loading,
							loadPage:        		params.loadPage && mailru._loadPageUrl,
							hideAutoErrors: 		params.hideAutoErrors,
							cacheRunning: 			params.cacheRunning,
							convertResultToOldApi: 	params.convertResultToOldApi,
							isAPIV1: 				true,
							complete:       		this.complete.bind(this, params)
						});
					}
				},

				complete: function (params, result) {
					var newResult = new Response(result);
					if (!_badToken && newResult.isAccessDenied() && newResult.getBody() === 'token') {
						_badToken = true;
						this.token(params);
					} else {
						if (params.method !== 'tokens') {
							_badToken = false;
						}
						if (params.convertResultToOldApi) {
							params.complete(result);
						} else {
							params.complete(newResult);
						}
					}
				},

				token: function (params) {
					if (_tokenRetry-- > 0) {
						this.send({
							type: 'post',
							method: 'tokens',
							complete: function (params, result) {
								if (result.isOK()) {
									_options.token = result.getBody().token;
									_tokenRetry = _options.tokenRetry;
									this.call(params);
								} else {
									params.complete(result);
								}
							}.bind(this, params)
						});
					} else {
						_tokenRetry = _options.tokenRetry;
						mailru.radar('API', 'TokensRecur=1');

						var parse = mailru.Ajax.parse({
							status: _status['access-denied']
						}, _status['access-denied']);

						var response = new Response(parse);

						params.complete(response);
					}
				}
			};
		};


		var API = function (_options) {
			_options = $.extend(true, {}, API.defaultOptions, _options);

			var _ajax	= new Ajax(_options);

			var _api	= function (request) {
				return _ajax.call(request);
			};


			_api.ajax = function (req){
				return	mailru.Ajax(req);
			};


			_api.upload = function(action, data, callback) {
				if (typeof action == 'string') {
					data.url      = action;
					data.complete = callback;
				}

				return _ajax.call(data);
			};


			_api.call = function (type, method, data, fn, loading, hideAutoErrors) {
				if ($.isFunction(data)) {
					fn = data;
					data = undefined;
				}

				return _ajax.call({
					type: type,
					method: method,
					data: data,
					loading: loading,
					complete: fn || $.noop,
					hideAutoErrors: hideAutoErrors
				});
			};

			$.each(['post', 'get'], function (k, type) {
				_api[type] = function (method, data, fn, loading, hideAutoErrors) {
					return _api.call(type, method, data, fn, loading, hideAutoErrors);
				}
			});

			return _api;
		};

		API.defaultOptions = {
			tokenRetry: 2,
			version: 1,
			baseUrl: '/api/',
			/** @namespace window.mailru_api_token */
			token: window.mailru_api_token || '',
			email: ''
		};


		mailru.API = new API({
			email: mailru.useremail
		});


		/**
		 * Временный код, после перехода на треды зачистить!
		 * https://jira.mail.ru/browse/MAIL-7895
		 */
		var _markState = {
			  2: ['unread', 'unset']
			, 1: ['unread', 'set']
			, 6: ['flagged', 'set']
			, 7: ['flagged', 'unset']
		};

		mailru.threads && (function (api){
			api.ajax = function (req){
				var url = req.url+'';

				if( ~url.indexOf('checknew') ){
					req.method = 'threads/status';
				}
				else if( ~url.indexOf('movemsg') ){
					var ids = [].concat(req.data.id);

					if( mailru.Messages.getSafe(ids[0]).thread ){
						if( req.data.mark ){
							var mark = req.data.markmessage;
							req.method		= 'threads/marks';
							req.data.marks	= [{ name: _markState[mark][0] }];
							req.data.marks[0][_markState[mark][1]] = ids;
							req.data.marks	= JSON.stringify(req.data.marks);
						}
						else {
							req.method		= 'threads/'+(req.data.remove && (req.data.folder != mailru.Folder.TRASH) ? 'remove' : 'move');
							req.data.ids	= JSON.stringify(ids);
						}
					}
				}

				if( req.method ){
					return api(req);
				}
				else {
					return mailru.Ajax(req);
				}
			};
		})(mailru.API);
	})();


	jsLoader.loaded('{mailru}mailru.API', 1);

// data/ru/images/js/ru/mailru.API.js end

// data/ru/images/js/ru/mailru.Ad.js start

/*global Ya*/

(function (win, doc, undef)
	{
		/** @namespace win.Ya */
		/** @namespace win.IS_UTF */
		/** @namespace win.MailRuTarget */

		var
			  ycc		= 'yandex_context_callbacks'
			, ts		= {}	// previous update time
			, ADS		= []
			, charset	= !!win.IS_UTF ? 'utf-8' : 'windows-1251'	// charset by frontend
			, MIN_DELAY	= 0	// min delay, before updating ad
			, _els		= {}
			, __AD__	= mailru.Ad	// saved current ads
		;

		/**
		 * @class   mailru.Ad
		 */
		jsClass
			.create('mailru.Ad')
			.statics({

			els: _els,

			getEl: function (id){
				// Находим element
				var el = document.getElementById(id);

				// Проверяем, виден ли он
				if( el && !el.offsetWidth && mailru.v2 ){
					// Если нет, ищем все видимые
					var tmpEl = $('#'+id+':visible', '#LEGO')[0];
					if( tmpEl ){
						el = tmpEl;
					}
				}

//				if( !el ){
//					el	= _els[id];
//				}
//				else if( _els[id] && (_els[id] !== el) ){
//					$(el).replaceWith(_els[id]);
//					el = _els[id];
//				}


//				var $el = $(_els[id] = el);
//				mailru.Ad.addStateClass($el.parent(), $el.attr('data-ad-state') || 'direct');

				return	$(el);
			},


			restore: function (){
				$.each(_els, function (id){
					mailru.Ad.getEl(id);
				});
			},

			priority: {
				'context': 1,
				'rbline': 2,
				'double': 3
			},

			urls: {
				'direct-left': function (url){
					return mailru.isMailboxPage(url) && !(mailru.isSendMsgOkPage(url) || mailru.isAddressbookPage(url));
				},
				'advertising-topline': function (url){
					return (mailru.isMailboxPage(url) && !(mailru.isComposePage(url) || mailru.isSendMsgOkPage(url))) ||
						mailru.isAddressbookPage(url);
				},
				'sendmsgok-bottom': mailru.isSendMsgOkPage,

				'msglist-double': mailru.isMsgListPage,
				'msglist-left': mailru.isMsgListPage,
				'msglist-topline': mailru.isMsgListPage,

				'readmsg-double': mailru.isReadMsgPage,
				'readmsg-left': mailru.isReadMsgPage,
				'readmsg-topline': mailru.isReadMsgPage,

				'gosearch-double': mailru.isSearchPage,
				'gosearch-left': mailru.isSearchPage,
				'gosearch-topline': mailru.isSearchPage,

				'filesearch-double': mailru.isFileSearchPage,
				'filesearch-left': mailru.isFileSearchPage,
				'filesearch-topline': mailru.isFileSearchPage,

				'addressbook-double': mailru.isAddressbookPage,
				'addressbook-left': mailru.isAddressbookPage,
				'addressbook-topline': mailru.isAddressbookPage
			},

			test: function (id, url){
				var testFn = mailru.Ad.urls[id];
				url = url || jsHistory.get() || '';
				return $.isFunction(testFn) ? testFn(url) : (url.match(testFn) != null);
			},

			// Publish context
			context: function(domId, ads)
			{
				var t = +new Date;

				if( !doc.getElementById(domId) )
				{
					debug.log('WARN: Ad.context', domId, 'not found');
				}
				else if( !ts[domId] || (t - ts[domId] > MIN_DELAY) )
				{
					ts[domId]	= t;
					this.direct(domId, ads[0]);
				}
			},

			// Publish Yandex.Direct
			direct: function (domId, o, id){
				/** @namespace o.partner_id */
				var $container = mailru.Ad.getEl(domId), $parent = $container.parent().show(),
					partnerId = o.partner_id, order = o.order;

				mailru.Ad.addStateClass($parent, 'direct');

				// Remove custom properties
				$.each(['partner_id', 'order'], function (i, k)
				{
					o[k] = undef;
					delete o[k];
				});

				// Set charset by frontend
				o.site_charset	= charset;

				// Register callback
				win[ycc] = win[ycc] || [];

				var i = win[ycc].push(function(){
					/** @namespace Ya.Direct */
					/** @namespace Ya.Direct.insertInto */

					Ya.Direct.insertInto(partnerId, domId, Object.extend({}, o), function () {

						if (/artamonova@corp|anti_gona@mail/i.test(mailru.useremail)) {
							$('#' + domId).html('#' + domId + ' -- yandex direct is empty!');
						}

						mailru.log('mailru.ad.warn', 'YaDirect #'+ domId +' -- empty!', true);
						(new Image).src	= '//gstat.' + mailru.staticDomainName + '/gstat?ua=1&clienterror.YaDirectEmpty=1&logme=YaDirectEmpty.'+mailru.useremail;

						if (id == 'direct-left') {
							$parent.hide()
						}
					});

					ajs.log('INFO: YaDirect #'+ domId +' -- published');

					if( id == 'advertising-topline' || id == 'readmsg-topline' || id == 'msglist-topline' ){
						(new Image).src = '//rs.' + mailru.SingleDomainName + '/d441593.gif?' + ajs.now();
					}

					$(window).triggerHandler('updateleftcolheight', ['direct']);
				});
				win[ycc][i-1].order = order;
				win[ycc].sort(function (a, b) {return b.order - a.order;});

				if( win.Ya && Ya.Direct && Ya.Direct.insertInto )
				{	// Ya.Direct is ready
					win[ycc].pop().call(win);
				}
				else if( !win.hasYandexContext )
				{
					win.hasYandexContext = true;
					var t = doc.documentElement.firstChild, s = doc.createElement('script');
					s.src	= '//an.yandex.ru/system/context.js';
					s.type	= 'text/javascript';
					s.setAttribute('async', 'true');
					s.setAttribute('defer', 'true');
					t.insertBefore(s, t.firstChild);
				}
			},

			// Publish mailru Target
			target: function (elId, opts, id){
				var $el = mailru.Ad.getEl(elId);
				if( $el[0] && win.MailRuTarget ){
					mailru.Ad.addStateClass($el.parent(), 'target');
					win.MailRuTarget.publish(elId, opts, function () {
						var direct = mailru.Ad.getById('direct-left');
						if (direct) {
							direct.publish();
						}
					});
					$(window).triggerHandler('updateleftcolheight', ['target']);
				}
			},

			doubleFormat: function(data) {
				$.each(data, function (key, value) {
					var $container = mailru.Ad.getEl(value.placeId), $parent = $container.parent();

					mailru.Ad.addStateClass($parent, 'double');

					if (value.html) {
						if (/-topline$/.test(value.id)) {
							$container.html(value.html);
						}
						else {
							$container.html('<div class="rb_banner">' + value.html + '</div>');
						}
					}
					else {

						var id = 'id' + jsCore.getUniqId();

						$container.css('height', value.height + 'px').html('<div class="rb_banner"><span id="' + id + '"/></div>');

						var params = $.extend({
							'wmode': 'opaque',
							'quality': 'high'
						}, value.params);

						/** @namespace value.fver */
						swfobject.embedSWF(
							value.swf,
							id,
							value.width,
							value.height,
							value.fver,
							null,
							value.vars,
							params,
							value.attrs,
							function () {
								setTimeout(function() {
									$container.css('height', '');
								}, 100);
							}
						);
					}

					ajs.log('INFO: doubleFormat #'+ value.placeId +' -- published');
				});

				$(window).triggerHandler('updateleftcolheight', ['doubleFormat']);
			},

			rbline: function(domId, o) {
				var $container = mailru.Ad.getEl(domId), $parent = $container.parent();
				mailru.Ad.addStateClass($parent, 'rbline');
				$container.html(o.html);
				ajs.log('INFO: rbline #'+ domId +' -- published');
			},

			addStateClass: function ($container, name) {
				mailru.Ad.clearStateClass($container);
				$container
					.addClass(name + '-state')
					.children()
						.attr('data-ad-state', name)
				;
			},

			clearStateClass: function ($container) {
				$container.removeClass(function (i, name) {
					return (name.match(/\w+-state/g) || []).join(' ');
				});
			},

			getById: function (id) {
				for ( var i = ADS.length; i--;  ) {
					if (ADS[i].id == id) {
						return ADS[i];
					}
				}
				return null;
			},

			push: function (){
				for( var i = 0, n = arguments.length; i < n; i++ ){
					ADS.push(new mailru.Ad(arguments[i]));
				}
			},

			find: function (fn){
				return  ajs.filter(ADS, fn);
			},

			pushDoubleFormat: function() {
				var args = Array.prototype.slice.call(arguments);

				var o = {
					'id': 'msglist-double',
					'placeId': 'ScrollBody',
					'type': 'double',
					'ads': []
				};

				var placeIds = {
					'readmsg-left': 'slot-container_2',
					'readmsg-topline': 'DoubleFormatLine',

					'msglist-left': 'slot-container_2',
					'msglist-topline': 'DoubleFormatLine',

					'gosearch-left': 'slot-container_2',
					'gosearch-topline': 'DoubleFormatLine',

					'filesearch-left': 'slot-container_2',
					'filesearch-topline': 'DoubleFormatLine',

					'addressbook-left': 'slot-container_2',
					'addressbook-topline': 'DoubleFormatLine'
				};

				for (var arg, i=0, l=args.length; i<l; i++) {
					arg = args[i];
					arg.placeId = placeIds[arg.id];
					if (arg.id) {
						o.id = arg.id.indexOf('readmsg-') === 0 ? 'readmsg-double' : 'msglist-double';
					}
					o.ads.push(arg);
				}

				this.push(o);
			},

			sort: function () {

				var t = this, map = {}, r = [];

				ADS.sort(function (a, b) {return t.priority[a.type] - t.priority[b.type];});

				for (var Ad, i=0, l=ADS.length; i<l; i++) {
					Ad = ADS[i];
					if (!Ad.disabled) {
						if (Ad.type == 'double') {
							for (var n=0, q=Ad.ads.length; n<q; n++) {
								delete map[Ad.ads[n].id];
							}
						}
						map[Ad.id] = Ad;
					}
				}

				for (var id in map) {
					r.push(map[id]);
				}

				return r;
			},

			refresh: function (force){
				if( !mailru.v2 || force ){
					var url = jsHistory.get(), GET = String.toObject(url), data = this.sort(), Ad, i, l;

					for( i = 0, l = data.length; i < l; i++ ){
						Ad = data[i];
						if( Ad.test(url, GET) ){
							Ad.publishFail = !Ad.publish();
						}
					}

					for( i = ADS.length; i--; ){
						Ad = ADS[i];
						if( !Ad.publishFail && Ad.reloadable ){
							ADS.splice(i, 1);
						}
						delete Ad.publishFail
					}
				}
			}

		}) // statics;
		.methods({

			__construct: function (opts)
			{
				var uid	= jsCore.getUniqId();

				Object.extend(this, {
					  id:		uid
					, type:		'context'
					, placeId:	uid
					, delay:	MIN_DELAY
					, disabled:	false
					, reloadable:	true
					, url:		ajs.retTrue
					, ads:		false
				}, opts);

				this._ts	= 0; // publish time
			},

		// @public
			getId: function ()
			{
				return	this.id;
			},

			// @return	jQuery
			getElm: function ()
			{
				return	mailru.Ad.getEl(this.placeId);
			},

			// @return	mailru.Ad
			toggle: function (s)
			{
				this.disabled	= !defined(s, this.disabled);
				this.getElm().display( !this.disabled );
				return	this;
			},

			// @return	bool
			test: function (url, GET){
				var ok = false;

				if( !this.disabled && (1 || ajs.now() - this._ts > this.delay) ){
					ok = mailru.Ad.test(this.id, url);
				}

				return	ok;
			},

			// @return	bool
			publish: function ()
			{
				if( this.ads && this.ads.length && this.getElm()[0] )
				{
					this._ts	= now();
					if( this.type == 'context' ) {
						mailru.Ad.direct(this.placeId, this.ads[0], this.id);
						return	true;
					}
					else if( this.type == 'target' ) {
						mailru.Ad.target(this.placeId, this.ads[0], this.id);
						return	true;
					}
					else if (this.type == 'double') {
						mailru.Ad.doubleFormat(this.ads);
						return	true;
					}
					else if (this.type == 'rbline') {
						mailru.Ad.rbline(this.placeId, this.ads[0]);
						return	true;
					}
				}
				return	false;
			}

		});
		// mailru.Ad


		// Wrap
		if( __AD__ ){
			if (__AD__.stack.length) {
				mailru.Ad.push.apply(mailru.Ad, __AD__.stack);
			}

			/** @namespace __AD__.doubleStack */
			if (__AD__.doubleStack.length) {
				mailru.Ad.pushDoubleFormat.apply(mailru.Ad, __AD__.doubleStack);
			}

			if( !mailru.v2 ){
				$(function (){ mailru.Ad.refresh() });
			}
			__AD__	= null;

//			// @todo: Исправь меня, молю!
//			var ad = mailru.Ad.getById('advertising-topline');
//			if( ad ){
//				ad.disabled = true;
//			}
		}

		// Refresh by event
		$(window).bind('refresh.ad', function ()
		{
			mailru.Ad.refresh();
		});

	})(window, document);

	jsLoader.loaded('{mailru}mailru.Ad', 1);

// data/ru/images/js/ru/mailru.Ad.js end

// data/ru/images/js/ru/mailru.Themes.js start

/*global chooseTheme*/

/** @namespace mailru.themes */

	mailru.Themes = {
		  _isCSSLoading: false
		, _isLoading: false
		, _checkTimeout: 60000
		, _themeIdEl: null
		, $ThemeCSS: null
		, disabled: !mailru.themes

		, URL_PATTERN: /(?:\?|&)setTheme=([^&]+)/i

		, init: function(){
			if( !this.disabled ){
				/** @namespace window.initThemeAutoUpdate */
				if( window.initThemeAutoUpdate ){
					setInterval(function (){
						mailru.Themes.check();
					}, this._checkTimeout);
				}
				this._initElements();
				this.adaptiveBackground(this.getCurrentThemeId());
				this.redrawThemeLink(this.getCurrentThemeId());
			}
		}

		, _initElements: function(){
			this._themeEl = $('#theme');
			this._themeIdEl = $('#themeId');
			this.$ThemeCSS = $('#ThemeCSS');
		}

		, checkThemeId: function(themeId){
			return /^(default|t\d{4})$/i.test(themeId);
		}

		, redrawThemeLink: function(themeId){
			var $link = this.$ThemeFooterLink || (this.$ThemeFooterLink = $('#ThemeFooterLink'));
			var themeConfig = this.getThemeConfig(themeId);
			var linkData = themeConfig && themeConfig.link;
			if (linkData) {
				$link.attr($.extend({
					  title: ''
					, href: ''
					, target: '_self'
				}, linkData)).css('display', 'block');
			} else {
				$link.hide();
			}
		}

		, getThemeIdByURL: function(url) {
			url = (url+'').match(this.URL_PATTERN);
			if( url && this.checkThemeId(url[1]) ){
				return  url[1];
			}
		}

		, isLoading: function(){
			return this._isLoading || this.isCSSLoading();
		}

		, isCSSLoading: function(){
			return this._isCSSLoading;
		}

		, getCurrentThemeId: function(){
			return mailru.currentTheme;
		}

		, getThemeConfig: function(themeId){
			/** @namespace mailru.themesConfig */
			var data = mailru.themesConfig[themeId];
			if (data) {
				if (!data.text) {
					data.text = String.sprintf(Lang.get('themes.default.text'), data.title);
				}
			}
			return data;
		}

		, getApplyedThemeId: function(){
			var ff = this._themeIdEl.css('font-family');
			var content = this._themeIdEl.css('content');
			return (content || ff).replace(/^['"]|['"]$/g, '');
		}

		, setTheme: function(themeId){
			if (!this.checkThemeId(themeId)){
				return;
			}
			$(window).triggerHandler('changeTheme.theme', [themeId]);
			this._isLoading = true;
			return $.when(
				  $.post('/settings/themes?ajax_call=1&func_name=set_theme', $.extend({ theme: themeId }, mailru.tokens['themes']))
				, this.switchThemeCss(themeId, this.choose(themeId))
			).done(jsCore.delegate(this, function(){
				mailru.currentTheme = themeId;
				this._isLoading = false;
			})).fail(jsCore.delegate(this, function(){
				this._isLoading = false;
			}));
		}

		, getCurrentThemeCssUrl: function(){
			return this.$ThemeCSS && this.$ThemeCSS.length ? this.$ThemeCSS.attr('href') : null;
		}

		, getThemeCssUrl: function(themeId, themeVariant){
			themeVariant = themeVariant || 'all';
			if (themeId === 'default'){
				return null;
			}
			/** @namespace mailru.themesCssPath */
			/** @namespace window.jsBuild */
			return [mailru.themesCssPath, themeId, '/', themeId, '.', themeVariant, '.css?v=', window.jsBuild].join('');
		}

		, switchThemeCss: function(themeId, themeVariant){
			var   url = this.getThemeCssUrl(themeId, themeVariant)
				, deferred = new $.Deferred();
			if (!url){
				this.$ThemeCSS.remove();
				this.$ThemeCSS = $();
				deferred.resolve(url);
				return deferred;
			}
			if (this.getThemeCssUrl(themeId, themeVariant) === this.getCurrentThemeCssUrl()){
				deferred.resolve(url);
				return deferred;
			}
			this._isCSSLoading = true;
			var oldThemeId = this.getApplyedThemeId();
			$.getCSS(
				  url
				, {noCache: true}
				, jsCore.delegate(this, function(link){
					var newThemeId = this.getApplyedThemeId();
					if (newThemeId !== oldThemeId){
						link.id = 'ThemeCSS';
						this.$ThemeCSS.remove();
						this.$ThemeCSS = $(link);
						this.redrawThemeLink(newThemeId);
						this.adaptiveBackground(newThemeId);
						deferred.resolve(link);
					} else {
						$(link).remove();
						deferred.reject();
					}
					this._isCSSLoading = false;
				})
			);

			return deferred;
		}

		, adaptiveBackground: function (themeId) {

			var $container = this._themeEl;

			$container.removeAttr('style');

			$(window).unbind('.adaptive_background');

			var themeConfig = this.getThemeConfig(themeId);

			if (themeConfig && themeConfig['adaptive_background']) {

				var folder = themeConfig['currentVariant'] == 'all' ? 'v1' : themeConfig['currentVariant'],
					path = '//img.' + mailru.staticDomainName + '/r/themes/' + themeId + '/bg/' + (folder ? folder + '/' : ''),
					prevfilename;

				function update_background () {

					var filename = '2560x1600.jpg', width = ajs.windowWidth(), height = ajs.windowHeight();

					if (width < 1050 && height < 656) {
						filename = '1050x656.jpg';
					} else if (width < 1280 && height < 800) {
						filename = '1280x800.jpg';
					} else if (width < 1440 && height < 900) {
						filename = '1440x900.jpg';
					} else if (width < 1680 && height < 1050) {
						filename = '1680x1050.jpg';
					} else if (width < 1920 && height < 1200) {
						filename = '1920x1200.jpg';
					}

					if (filename != prevfilename) {
						prevfilename = filename;
						var src = path + filename, image = new Image();
						image.onload = function () {
							$container.css('backgroundImage', 'url("' + src + '")');
							image = null;
						};
						image.src = src;
					}
				}

				update_background();

				$(window).bind('resize.adaptive_background', update_background.debounce(10));
			}
		}

		, choose: function (){
			var fn = (typeof chooseTheme != 'undefined' && $.isFunction(chooseTheme) ? chooseTheme : $.noop);
			return	fn.apply(this, arguments);
		}

		, check: function(){
			if (this.isLoading()){
				return;
			}
			var   themeId = this.getCurrentThemeId()
				, newThemeVariant = this.choose(themeId);
			this.switchThemeCss(themeId, newThemeVariant);
		}

		, showConfirmPopup: function(themeId){
			var themeConfig = this.getThemeConfig(themeId);
			if (!this.checkThemeId(themeId) || themeId === mailru.currentTheme || !themeConfig || ($.browser.msie && parseInt($.browser.version) < 7)){
				return;
			}

			ajs.require('{plugins}' + 'Layer', function(){
				Layer.get('setTheme', function(layer){
					var setThemeModal = layer.$div,
						setThemePreview = setThemeModal.find('#setThemePreview');

					layer.func = function(status) {
						if (status) {
							$(window).triggerHandler('beforeunloadTheme.theme', [themeId]);

							var inputs = layer.$div.find('input');
							inputs.attr('disabled', 'disabled');
							$.post('/settings/themes?ajax_call=1&func_name=set_theme', $.extend({ theme: themeId }, mailru.tokens['themes']), function () {
								location.reload();
							});
							return false;
						}
						else {
							$(window).triggerHandler('cancelLayerTheme.theme', [themeId]);
						}
					};

					if (themeConfig.text) {
						setThemeModal.find('#setThemeText').html(themeConfig.text);
					}

					setThemePreview.attr('src', String.sprintf(setThemePreview.data('path'), mailru.staticDomainName) + (themeConfig.preview ? themeConfig.preview : themeId + '/' + setThemePreview.data('image')) + '?v=' + window.jsBuild);
					layer.show();
				});
			});

			return  true;
		}
	};


	$(function (){
		mailru.Themes.init();
	});

	jsLoader.loaded('{mailru}mailru.Themes', 1);

// data/ru/images/js/ru/mailru.Themes.js end

// data/ru/images/js/ru/mailru.Balloon.js start

/**
mailru.Balloon.push({
	id: Number, // mailru.HelperIndex
	selector: '...',
	priority: 10, // 0 — min
	counters: {show: Number, close: Number}, // rb counter
	disposable: Boolean, // вывести один раз
 	timeLimit: sec // показывать балун, раз в N секунд
 	regTimeLimit: sec // через сколько секунд после регистрации показать балун
	test: function (jqDeferred){ }, // дополниьтельная проверка
	balloonOptions: {
		loadHTML: true // absolute котент через lstatic
	}
});
*/


// data/ru/images/js/ru/ui/mailru.ui.TipOfTheDay.js start

/**
 * @class	mailru.ui.TipOfTheDay
 * @version	1.2.3
 * @testBuild 0.2
 * @author	RubaXa	<trash@rubaxa.org>
 *
 * jQuery('...').TipOfTheDay({ ... });
 *
 *	Option			Default			Description
 * -----------------------------------------------------
 * 	idTpl			#TipOfTheDay	шиблон подсказки
 * 	text:			undefined		тест балуна
 *	html			undefined		html балуна
 * 	orientation		auto			пизиционирование подсказки (auto, top — над элементом, bottom — под элементом, default-top, default-bottom)
 *	margin			[30,5]			отступы по X и Y
 * 	width			auto			ширина подсказки
 * 	height			auto			высота
 *  cssTH			.th-place		элемент в который будет записан text, либо html
 * 	cssClose		.mlr-bln_close	элемент, кликая на который происходит закрытие
 * 	clOrientation	[...]			css selector'ы, которые отвечают за позиционирование угола
 * 	visible			true			статус отображения
 * 	zIndex			Int				z-index
 * 	maxShow			-1				максимальное кол-во показов, -1 — бесконечно
 * 	showBy			false			показать по ...
 * 	hideBy			false			скрыть по ...
 *
 * Написание правил для showBy и hideBy
 * 	ELM				элемент для которого создан балун
 *  BALLOON			балун
 * 	#Id .classes	элементы в документе
 * 	.classes		элементы в балуне
 *  timeout:mSec	выполнить событие через mSec
 *  eval:exresion	выполнить событие если  exresion === true
 *
 *  ELM:click		действие будет выполнено по клику на элемент
 *  BALLOON:click	по балуну
 *
 * 	Доступные события: click, mouseenter, mouseleave, focus, blur
 *
 *  Так же доступны и такие сочетания
 *		ELM:click:MyVar				событие click будет проигнорировано, если MyVar !== true
 *  	BALLOON:mouseleave:800		скрыть балун через 800 msec после срабатывания события mouseleave
 *
 * Пример
 * 	$('...').TipOfTheDay({
 * 		  idTpl:	'#MyBalloonTpl'
 * 		, text:		'...'
 * 		, visible:	false
 * 		, maxShow:	1		// показать только один раз
 * 		, showBy:	'eval:TipVisible elm:click timeout:10000'	// показать если TipVisible == true, при клике на эемент или через 10 sec
 * 		, hideBy:	'BALLOON:mouseleave:1000 timeout:15000'		// скрыть через секунду после срабатывания mouseleave или через 15 секунд
 * 	});
 */



jQuery(window).bind('resize scroll click', function (evt){
		mailru.ui.TipOfTheDay.change(evt);
	})


	jsEvent.invert = {
		  focus:		'blur'
		, keydown:		'keyup'
		, mouseover:	'mouseout'
		, mouseenter:	'mouseleave'
	};
	Object.forEach(jsEvent.invert, function (v, k) { jsEvent.invert[v] = k; });


	jsClass
		.create('mailru.ui.TipOfTheDay')
		.statics({
			  zIndex:	1000
			, items:	[]
			, change:	function (evt){ Array.forEach(this.items, function (Tip){ Tip._event(evt, 'change'); }, this); }
		})
		.methods({

		__construct: function ($Elm, opts)
		{
			$E(this, {
				  idTpl:			'#TipOfTheDay'	// шаблон
				, orientation:		'auto'	// auto, top, bottom пизиционирование подсказки
				, positionX:		'auto'
				, offset:			'auto'
				, margin:			[30, 5]
				, width:			0
				, height:			0
				, cssTH:			'.th-place'
				, cssClose:			'.balloon__icon'
				, clOrientation:	['balloon_tl', 'balloon_tr', 'balloon_br', 'balloon_bl', 'balloon_tc']
				, visible:			true
				, zIndex:			mailru.ui.TipOfTheDay.zIndex++
				, maxShow:			1
				, showBy:			0
				, hideBy:			0
				, absolute:				true
			}, opts);

			this.$Elm		= jQuery( $Elm );
			this.$Balloon	= jQuery( this.idTpl ).clone()
								.attr('id', '')
								.css({ zIndex: this.zIndex, position: 'absolute', display: 'none' })
							;

			if (this.className) {
				this.$Balloon.addClass(this.className);
			}

			if (this.absolute) {
				$('body,#ScrollBodyInner').last().append(this.$Balloon);
			} else {
				this.$Elm.append(this.$Balloon.css({left: '', top: ''}));
			}

			this.bStyle		= this.$Balloon[0].style;

			this._dEvent	= $D(this, '_event');
			this._eShow		= $D(this, function (evt){ this._event(evt, 'show'); });
			this._eHide		= $D(this, function (evt){ this._event(evt, 'hide'); });

			this._events(true, this.showBy, this._eShow);
			if( this.showBy ) this.showBy = this.showBy.replace(/([^:]|^)(eval|timeout):\w+/gi, '$1');

			if( this.cssClose ) this.$Balloon.find(this.cssClose).click($.proxy(function(evt) {
				this.dispatchEvent('close', this, evt);
				this._eHide();
			}, this));

			if( this.text )		this.setter('text', this.text);
			if( this.html )		this.setter('html', this.html);
			if( this.width )	this.setter('width', this.width);
			if( this.height )	this.setter('height', this.height);

			if( this.visible ){ this.visible = false; this._event(0, 'show'); }

			if (this.onInit) {
				this.onInit.call(this, this);
			}

			mailru.ui.TipOfTheDay.items.push(this);
		},

		_findElms: function (rules)
		{
			return	jQuery(rules.split(',')).map($D(this, function (i, rule)
			{
				return $(rule)[0];
//				if( rule == 'ELM' ) return this.$Elm[0];
//				else if( !rule || rule == 'BALLOON' ) this.$Balloon;
//				else return jQ(rule, rule.charAt(0) == '#' ? 0 : this.$Balloon)[0];
			}));
		},

		_events: function (bind, cmds, func)
		{
			var $elm, fId = jsCore.getUniqId(func);
			if( cmds ) Array.forEach(cmds.split(/,?\s+/g), function (cmd)
			{
				if( !cmd ) return;
				cmd		= cmd.split(':');
				$elm	= this._findElms(cmd[0]);

				if( (cmd[0] == 'eval') && !!eval(cmd[1]) )
				{
					func();
				}
				else if( cmd[0] == 'timeout' )
				{
					clearTimeout( this[fId] );
					if( bind )
						this[fId] = setTimeout(func, cmd[1]);
				}
				else
				{
					if( bind && (cmd[2] > 0) ) // timeout
					{
						$elm.bind(cmd[1], function ()
						{
							var
								  eId		= jsCore.getUniqId(this)
								, tId		= setTimeout(func, cmd[2])
								, invert	= jsEvent.invert[cmd[1]]
								, iFunc		= invert+'_'+eId
							;
							if( invert )
							{
								if( window[iFunc] )
								{
									window[iFunc]();
									$elm.unbind(invert, window[iFunc]);
								}
								$elm.bind(invert, window[iFunc] = function (){ clearTimeout(tId); });
							}
						});
					}
					else if( defined(cmd[2]) && !(cmd[2] > 0) )
					{
						var efunc = fId + cmd.join('');
						if( !window[efunc] )
							window[efunc] = function (evt){ setTimeout(function (){ if( !!eval(cmd[2]) ) func(evt); }, 5); };

						$elm[bind ? 'bind' : 'unbind'](cmd[1], window[efunc]);
					}
					else
					{
						$elm[bind ? 'bind' : 'unbind'](cmd[1], func);
					}
				}
			}, this);
		},


		_event: function (evt, type)
		{
			type = type || evt.type;

			switch( type )
			{
				case 'click':
				case 'change':
				case 'resize':
				{
					if( this.visible && (!this.$Elm[0].offsetWidth || this._bIsHide) )
					{
						this.$Balloon[(this._bIsHide = !this.$Elm[0].offsetWidth) ? 'hide' : 'show']();
						if( this._bIsHide ) return;
					}

					$E(this, this.$Elm.offset());

					this.eWidth		= this.$Elm.width();
					this.eHeight	= this.$Elm.height();

					this.bWidth		= this.$Balloon.width();
					this.bHeight	= this.$Balloon.height();

					this.wWidth		= ajs.windowWidth() - 40;
					this.wHeight	= ajs.windowHeight() - 20;
				}

				case 'scroll':
				{
					if( this.visible && !this._bIsHide )
					{
						this.wLeft	= ajs.scrollLeft();
						this.wTop	= ajs.scrollTop();
						this._pos();
					}
				}
				break;

				case 'show':
				{
					if( !this.visible )
					{
						if (this.maxShow > 0 || this.maxShow == -1) {

							if (this.maxShow > 0) {
								this.maxShow--;
							}

							if (window.jsHistory) {
								jsHistory.oneTop(function (evt) {
									this._event(evt, 'hide');
								}.bind(this));
							}

							jQuery(window).bind('resize scroll', this._dEvent);
							this.$Balloon.show();
							this.visible	= true;

							this._events(true, this.hideBy, this._eHide);
							this._events(false, this.showBy, this._eShow);
							this._event(evt, 'resize');
							this.dispatchEvent(type, this, evt);
						}
					}
				}
				break;

				case 'hide':
				{
					if( this.visible && (!evt || !this.$Balloon.has(evt.target).length))
					{
						jQuery(window).unbind('resize scroll', this._dEvent);
						this.$Balloon.hide();
						this.visible	= false;

//						if( (this.maxShow == -1) || this.maxShow ) this._events(true, this.showBy, this._eShow);
						this._events(false, this.hideBy, this._eHide);
						this.dispatchEvent(type, this, evt);
					}
				}
				break;
			}
		},

		_pos: function ()
		{
			var oT = this.orientation, pX = this.positionX, o = 0, x = this.left, y = this.top, margin;

			if (!this.absolute) {
				margin = this.margin;
				this.margin = [0, 0];
			}

			if (pX == 'right' || x + this.bWidth > (this.wLeft + this.wWidth) )
			{
				o	= 1;
				x	= x - (this.wLeft + this.bWidth) + this.margin[0];
			}
			else
			{
				x	-= this.margin[0];
			}

			if( oT == 'auto' || oT.match(/-(\w+)/) )
			{
				if( oT != 'auto' )
				{
					if( RegExp.$1 == 'top' ) {
						oT	= (y - this.bHeight - this.wTop > 0) ? 'top' : 'bottom';
					}
					else {
						oT	= (this.wHeight + this.wTop - y - this.bHeight > 0) ? 'bottom' : 'top';
					}
				}
				else {
					oT	= (y - this.bHeight - this.wTop > 0) ? 'top' : 'bottom';
				}
			}

			if( oT == 'top' )
			{
				y	-= this.bHeight - this.margin[1];
				o	 = o == 1 ? 2 : 3;
			}
			else
			{
				 y	+= this.eHeight - this.margin[1];
			}

			if (oT == 'center') {
				o = 4;
			}

			this.$Balloon
				.removeClass(this.clOrientation.join(' '))
				.addClass(this.clOrientation[o])
			;

			if( this.offset == 'auto' )
			{
				x += this.eWidth/2;
			}

			if (this.absolute) {
				this.bStyle.left	= x +'px';
				this.bStyle.top		= y +'px';
			} else {
				this.margin = margin;
				this.bStyle.marginLeft = this.margin[0] + 'px';
				this.bStyle.marginTop = this.margin[1] + 'px';
			}
		},


	// @public
		setter: function (key, value)
		{
			switch( key )
			{
				case 'text':
				case 'html': this.$Balloon.find(this.cssTH)[key]( value ); break;
				case 'visible': this._event(0, value ? 'show' : 'hide'); break;
				case 'width':
				case 'height': this.$Balloon.css(key, value); break;
				default: this[key] = value;
			}

			this._event(0, 'resize');
		},

		getter: function (key)
		{
			var r;
			switch( key )
			{
				case 'width':
				case 'height': r = this.$Balloon[key](); break;
				case 'balloon': r = this.$Balloon; break;
				default: r = this[key];
			}
			return	r;
		},

		hide: function (){
			this._eHide();
		}

	});


	//
	// jQuery
	//
	$.fn.TipOfTheDay = function (key, value) {

		var result = this, $this, Inst;

		this.each(function () {

			$this = $(this);

			Inst = $this.data('mailru.ui.TipOfTheDay');

			if (!defined(key) || $.isPlainObject(key)) {

				if (Inst) {
					Inst._eShow();
				} else {
					$this.data('mailru.ui.TipOfTheDay', new mailru.ui.TipOfTheDay(this, key));
				}

			} else {

				if (defined(value)) {
					Inst.setter(key, value);
				} else {
					result	= Inst.getter(key);
				}
			}
		});

		return result;
	};

	jsLoader.loaded('{mailru.ui}mailru.ui.TipOfTheDay', 1);

// data/ru/images/js/ru/ui/mailru.ui.TipOfTheDay.js end

/**
	 * @class mailru.Balloon
	 */
	jsClass
	.create('mailru.Balloon')
	.statics({

		SHOW_TIME_LIMIT: 60 * 60 * 12,

		items: [],

		defaultOptions: {
			counters: {},
			balloonOptions: {
				hideBy: 'body:mousedown',
				width: 280,
				orientation: 'bottom',
				positionX: 'right',
				maxShow: -1
			}
		},

		isLocked: function () {
			return mailru.notificationLocker().isLocked();
		},

		setLock: function (status) {
			mailru.notificationLocker().setLock(status);
		},

		isEnable: function () {
			return !($.browser.msie && parseInt($.browser.version) < 7) && !mailru.DisabledNoAuthLayer;
		},

		isValid: function () {
			var result = false, index = mailru.HelperIndex.validDataFlag;
			if (this.isClosed(index)) {
				result = true;
			} else {
				this.makeAsClosed(index);
			}
			return result;
		},

		push: function () {
			for (var data, i = arguments.length; i-- ; ) {
				if (this.test(data = arguments[i])) {
					this.items.push(new mailru.Balloon(data));
				}
			}
		},

		test: function (data) {
			var result = true;
			if( ('id' in data) && this.isClosed(data.id) ){
				result = false;
			}
			return result;
		},

		redraw: function () {
//			console.info('redraw', this.items);

			if (!this.isLocked()) {
				var i = 0, item;

				this.sortByPriority();

//				console.info(this.items);

				if (item = this.items[i]) {
					this.itemRedraw(item, i);
				}
			}
		},

		itemRedraw: function (item, i) {
//			console.info('itemRedraw', i);

			var doneCallback = this.itemRedrawDone.bind(this, item);
			var failCallback = this.itemRedrawFail.bind(this, item, i);
			var deferred = $.Deferred().done(doneCallback).fail(failCallback);
			item.redraw(deferred);
		},

		itemRedrawDone: function (item) {
//			console.info('show', item.options, item.$balloon);

			if (this.previos) {
				this.previos.hide();
			}
			this.previos = item;
			item.show();
		},

		itemRedrawFail: function (item, i) {
//			console.info('fail', item.options, item.$balloon);

			var nextItem;
			if (i !== undefined) { // in case we call itemRedraw for 1 item, we don't want the other items to be redrawn
				nextItem = this.items[++i];
			}
			if (nextItem) {
				this.itemRedraw(nextItem, i);
			} else if (this.previos) {
				this.previos.hide();
				this.previos = null;
			}
		},

		sortByPriority: function () {
			this.items.sort(function (a, b) {
				return a.options.priority - b.options.priority;
			});
		},

		makeAsShowed: function (index) {
			this.setTimestamp(index, this.getCurrentTimestamp());
		},

		makeAsClosed: function (index) {
			if (!this.isClosed(index)) {
				this.updateStatus(index);
				this.removeItemById(index);
			}
		},

		setTimestamp: function (index, time) {
			mailru.Ajax({
				type: 'POST',
				url: '/cgi-bin/ajax_helper?ajax_call=1&func_name=set_helper_timestamp',
				data: {helper: index, helper_timestamp: mailru.HelperTimestamp[index] = time}
			});
		},

		updateStatus: function (index, complete) {
			mailru.API.post('helper/set', {
				index: index
			}, function (result) {
				if( result.isOK() ){
					mailru.HelperStatus = result.getBody().status;
				}

				if (complete) {
					complete();
				}
			});
		},

		unsetIndex: function (index, complete) {
			mailru.API.post('helper/unset', {
				index: index
			}, function (result) {
				if( result.isOK() ){
					mailru.HelperStatus = result.getBody().status;
				}
				if (complete) {
					complete();
				}
			});
		},

		setStatus: function (status) {
			mailru.Ajax({
				type: 'POST',
				url: '/cgi-bin/ajax_helper?ajax_call=1&func_name=set_helper_status',
				data: {helper_mask: mailru.HelperStatus = status}
			});
		},

		isClosed: function (index) {
			var bit = 1 << index, status = mailru.HelperStatus;
			return (status & bit) === bit;
		},

		removeItemById: function (id) {
			for (var item, i = this.items.length; i-- ; ) {
				item = this.items[i];
				if (item.options.id == id) {
					this.items.splice(i, 1);
					break;
				}
			}
		},

		getItemById: function(id) {
			for (var item, i = this.items.length; i-- ; ) {
				item = this.items[i];
				if (item.options.id == id) {
					return item;
				}
			}
			return null;
		},

		inArray: function (str, data) {
			for (var i=data.length; i--; ) {
				if (data[i].indexOf(str) !== -1)
					return true;
			}
			return false;
		},

		getCurrentTimestamp: function () {
			return Math.round(new Date() / 1000 - mailru.CurrentTimestampOffset);
		},

		getLastShowTime: function () {
			var result = 0, timestamps = mailru.HelperTimestamp;
			for (var i = timestamps.length; i-- ; )
				result = Math.max(result, timestamps[i]);
			return result;
		},

		getAddressBookData: function (callback) {
			$(window).one('success.abjs error.abjs', function (evt, data) {
				if (!$.isArray(data)) data = [];
				callback(data);
			});
			$R('{mailru}' + 'mailru', function() {
				mailru.Utils.getAddressBook();
			});
		},

		checkAccess: function () {
			var result = true;
			for (var item, i = this.items.length; i-- ; ) {
				item = this.items[i];
				if (item.showed && !(item.closed || item.hided)) {
					result = false;
					break;
				}
			}
			return result;
		}
	})
	.methods({

		__construct: function (options) {
			this.$container = $();
			this.$balloon = $();
			this.options = $.extend(true, {},
				mailru.Balloon.defaultOptions,
				options,
				{balloonOptions: {
					onClose: this.close.bind(this),
					onHide: this.hide.bind(this)
				}}
			);

			if (this.options.event) {
				$(window).bind(this.options.event, {scope: this}, function (evt) {
					var scope = evt.data.scope;

					if( 'id' in scope.options ){
						mailru.Balloon.makeAsClosed(scope.options.id);
					}

					if (scope.options.counters.showAndDo && scope.showed) {
						Counter.d(scope.options.counters.showAndDo);
					}
				});
			}
		},

		redraw: function (deferred) {
			this.test(deferred);
		},

		show: function () {
			if (this.options.balloonOptions.loadHTML && !this.options.balloonOptions.html) {
				mailru.Ajax({
					url: '/cgi-bin/lstatic',
					dataType: 'text',
					data: {'get': 'balloon', name: this.options.id, lang: mailru.LANG, SpamBallonExp: mailru.SpamBallonExp, SettingsOn: mailru.SettingsOn ? 1 : 0, staticDomainName: mailru.staticDomainName},
					success: function (result) {
						if (result.isOK()) {
							this.options.balloonOptions.html = result.getData();
							this.showBalloon();
						}
					}.bind(this)
				});
			} else {
				this.showBalloon();
			}
		},

		showBalloon: function () {
			var $container = this.getContainer();
			this.$balloon = $container.TipOfTheDay(this.options.balloonOptions);
			this.showed = 1;

			if( 'id' in this.options ){
				mailru.Balloon.makeAsShowed(this.options.id);
			}

			$(window).bind('beforeunload.balloon', {scope: this}, function (evt) {
				var scope = evt.data.scope;
				if (evt.originalEvent) {
					if (scope.showed && !scope.closed && !scope.hided) {
						Counter.d(604800);
					}
				}
			});

			if (this.options.counters) {
				if (this.options.counters.show) {
					Counter.d(this.options.counters.show);
				}
			}

			var resolve = this.options.resolve;
			if ($.isFunction(resolve)) {
				resolve.call(this);
			}

			mailru.Balloon.setLock(true);
		},

		close: function () {
			this.closed = 1;

			if( 'id' in this.options ){
				mailru.Balloon.makeAsClosed(this.options.id);
			}

			if (this.options.counters.close) {
				Counter.sb(this.options.counters.close);
			}

			Counter.d(604797);
			$(window).unbind('.balloon');
		},

		hide: function () {
			this.hided = 1;
			var balloon = this.$balloon.data('mailru.ui.TipOfTheDay');
			if (balloon) {
				balloon._eHide();
			}
			Counter.d(604799);
			$(window).unbind('.balloon');

			mailru.Balloon.setLock(false);
		},

		test: function (deferred) {
			var result = true;
			var opts = this.options;
			var test = opts.test;
			var $container = this.getContainer();
			var currentTimestamp = mailru.Balloon.getCurrentTimestamp();
			var lastShowTimestamp = mailru.Balloon.getLastShowTime();

			if (!mailru.Balloon.test(opts)) {
				result = false;
//				console.info(opts.id, 1);
			} else if ((lastShowTimestamp > currentTimestamp - mailru.Balloon.SHOW_TIME_LIMIT) && !opts.ignorShowTimeLimit) {
				result = false;
//				console.info(opts.id, 2, lastShowTimestamp, currentTimestamp, mailru.Balloon.SHOW_TIME_LIMIT);
			} else if (opts.disposable && mailru.HelperTimestamp[opts.id] > 1) {
				result = false;
//				console.info(opts.id, 3);
			} else if (opts.regTimeLimit && mailru.RegTime > currentTimestamp - opts.regTimeLimit) {
				result = false;
//				console.info(opts.id, 4);
			} else if (opts.timeLimit && mailru.HelperTimestamp[opts.id] > currentTimestamp - opts.timeLimit) {
				result = false;
//				console.info(opts.id, 5);
			} else if (opts.selector && !($container.length > 0 && $container.is(':visible'))) {
				result = false;
//				console.info(opts.id, 6);
			}

			if (result) {
				if ($.isFunction(test)) {

/*					var dfd = new $.Deferred().done(function () {
						if ($container.length > 0 && $container.is(':visible')) {
							deferred.resolve();
						} else {
							deferred.reject();
						}
					}).fail(function () {
						deferred.reject();
					});*/

					test.call(this, deferred);
				} else {
					deferred.resolve();
				}
			} else {
				deferred.reject();
			}
		},

		getContainer: function () {
			var selector = this.options.selector;

			if ($.isFunction(selector)) {
				selector = selector.call(this);
			}

			return $(selector);
		}
	});

	if (defined(mailru.TestHelpersTimeLimit)) {
		mailru.Balloon.SHOW_TIME_LIMIT = mailru.TestHelpersTimeLimit;
	}

	if (mailru.TestHelpersClearAllStatus) {
		mailru.Balloon.setStatus(0);
	}

	if (mailru.TestHelpersClearAllShowTime) {
		$.each(mailru.HelperTimestamp, function (k) {
			mailru.Balloon.setTimestamp(k, 1);
		});
	}

	if (mailru.Balloon.isEnable()) {

		if (mailru.Balloon.isValid()) {

			var test_spam = mailru.SpamBallonExp;

			mailru.Balloon.push({
				id: mailru.HelperIndex.spam,
				selector: '#action_buttons a.url-spam',
				event: 'spamLinkClick.readmsg',
				priority: 20,
				timeLimit: 60 * 60 * 24 * 30,
				regTimeLimit: 60 * 60 * 24 * 30,
				counters: {
					show:      test_spam ? 1108777 : 427005,
					close:     427005,
					showAndDo: test_spam ? 1108777 : 604793
				},
				test: function (deferred) {
					if (mailru.isReadMsg) {
						$R('{mailru}' + 'mailru.Messages', function(deferred) {
							var success = false, email;
							if (GET.id) {
								var message = mailru.Messages.get(GET.id);
								if (message) {
									email = message.From;
								}
							}
							if (!email || email.indexOf('@corp.mail.ru') === -1) {
								success = true;
							}
							if (success) {
								if (email) {
									mailru.Balloon.getAddressBookData(function(data) {
										if (mailru.Balloon.inArray(email, data)) {
											deferred.reject();
										} else {
											deferred.resolve();
										}
									});
								} else {
									deferred.resolve();
								}
							} else {
								deferred.reject();
							}
						}.bind(this, deferred));
					} else {
						deferred.reject();
					}
				},
				balloonOptions: {
					loadHTML: true
				}
			}, {
				id: mailru.HelperIndex.nospam,
				selector: '#action_buttons a.url-nospam',
				event: 'nospamLinkClick.readmsg',
				priority: 30,
				timeLimit: 60 * 60 * 24 * 14,
				regTimeLimit: 60 * 60 * 24 * 14,
				counters: {show: 427007, close: 427007, showAndDo: 604794},
				test: function (deferred) {
					if (mailru.isReadMsg) {
						$R('{mailru}' + 'mailru.Messages', function(deferred) {
							var success = false, email;
							if (GET.id) {
								var message = mailru.Messages.get(GET.id);
								if (message) {
									email = message.From;
								}
							}
							if (!email || email.indexOf('@corp.mail.ru') === -1) {
								success = true;
							}
							if (success) {
								if (email) {
									mailru.Balloon.getAddressBookData(function(data) {
										if (mailru.Balloon.inArray(email, data)) {
											deferred.reject();
										} else {
											deferred.resolve();
										}
									});
								} else {
									deferred.resolve();
								}
							} else {
								deferred.reject();
							}
						}.bind(this, deferred));
					} else {
						deferred.reject();
					}
				},
				balloonOptions: {
					loadHTML: true
				}
			}, {
				id: mailru.HelperIndex.attachExcel,
				selector: function () {
					var params = String.toObject(jsHistory.get());
					if (params && params.id) {
						return $('.i-xlsx,.i-xls', '#ReadMsgAttachment' + params.id).first().parent().find('.js-viewWebApp');
					}
				},
				event: 'showExcel.officeWebApps clickExcelLink.officeWebApps',
				priority: 41,
				timeLimit: 60 * 60 * 24 * 14,
				regTimeLimit: 60 * 60 * 24 * 14,
				counters: {show: 464830, showAndDo: 604795},
				balloonOptions: {
					width: 300,
					orientation: 'top',
					positionX: 'left',
					margin: [34, -92],
					absolute: false,
					loadHTML: true
				}
			}, {
				id: mailru.HelperIndex.attachPowerPoint,
				selector: function () {
					var params = String.toObject(jsHistory.get());
					if (params && params.id) {
						return $('.i-pptx,.i-ppt', '#ReadMsgAttachment' + params.id).first().parent().find('.js-viewWebApp');
					}
				},
				event: 'showPowerPoint.officeWebApps clickPowerPointLink.officeWebApps',
				priority: 42,
				timeLimit: 60 * 60 * 24 * 14,
				regTimeLimit: 60 * 60 * 24 * 14,
				counters: {show: 464830, showAndDo: 604795},
				balloonOptions: {
					width: 300,
					orientation: 'top',
					positionX: 'left',
					margin: [34, -92],
					absolute: false,
					loadHTML: true
				}
			});

			// MAIL-13747
			if (mailru['IsShowAngryBirdsBalloon']) {
				(function (ts, id) {

					if (ts[id] < 1356984000) {

						mailru.HelperStatus &= ~(1 << id);

						mailru.Balloon.push({
							id: id,
							selector: function () {
								var selector = '#portal-menu__dropdown';
								if (mailru['IsThemeButton']) {
									var $themeButton = $('.portal-menu__buttons__item_themes', '#ddbuttons');
									if ($themeButton.is(':visible')) {
										selector = $themeButton;
									}
								}
								return $(selector);
							},
							test: function (deferred){
								if (mailru.currentTheme == 't1084' || mailru.currentTheme == 't1085') {
									deferred.reject();
								} else {
									deferred.resolve();
								}
							},
							priority: 10,
							timeLimit: 60 * 60 * 24 * 5,
							regTimeLimit: 60 * 60 * 24,
							counters: {
								show: 1497114,
								close: 1497112
							},
							balloonOptions: {
								className: 'balloon__AngryBirds',
								width: 240,
								orientation: 'center',
								positionX: 'left',
								margin: [-107, -10],
								absolute: false,
								loadHTML: true
							}
						});
					}

				})(mailru.HelperTimestamp, mailru.HelperIndex.moreThemes);
			}

			if (mailru.RegisterMailtoHandler) {
				mailru.Balloon.push({
					id: mailru.HelperIndex.mailtoObserver,
					priority: 11,
					timeLimit: 60 * 60 * 24 * 30,
					test: function (deferred) {
						// https://jira.mail.ru/browse/MAIL-6830?focusedCommentId=249476&page=com.atlassian.jira.plugin.system.issuetabpanels:comment-tabpanel#comment-249476
						var supported = !$.browser.opera && $.isFunction(navigator.registerProtocolHandler);
						if (supported) {
							deferred.resolve();
						} else {
							deferred.reject();
						}
					},
					resolve: function () {
						var url = mailru.getPageURL('compose') + '?mailto=%s';
						try {
							navigator.registerProtocolHandler('mailto', url, 'Mail.Ru');
						} catch (e) {}
					}
				});
			}

			// MAIL-7802
			// UPD: MAIL-8567
			mailru.Balloon.push({
				id: mailru.HelperIndex.filesearch,
				selector: function () {
					return $('.dd-filesearch', '#ddbuttons').parent();
				},
				priority: 60,
				timeLimit: 60 * 60 * 24 * 14,
				regTimeLimit: 60 * 60 * 24 * 14,
				counters: {show: 924461, close: 924461}, // new
				xcounters: {show: 874511, close: 874511}, // old
				balloonOptions: {
					onInit: function () {
						this.$Balloon.find(this.cssTH).css('cursor', 'pointer').click(function () {
							location.href = '/filesearch';
						});
					},
					width: 270,
					positionX: 'left',
					margin: [2, -6],
					absolute: false,
					loadHTML: true
				}
			});

			if( mailru.jinn && !(Jinn.hasAccessDenied() || Jinn.hasRight()) ){
				mailru.Balloon.push({
					// MAIL-8528: Notification API
					id: mailru.HelperIndex.notificationAPI,
					selector: '#portal-menu__dropdown',
					disposable: true,
					balloonOptions: {
						onInit: function (){
							this.$Balloon.delegate('a', 'click', function (evt){
								evt.preventDefault();
								this.hide();

								mailru.Notify.browserAlert('notifications-api');
								Jinn.access(function (){
									mailru.Notify.browserAlert(false);
								});

								$R('{mailru}'+'mailru.API', function (){
									mailru.API.post('tokens', function (R){
										var token = String(R.getBody().token).split(':');

										mailru.Ajax({
											url: '/settings/ajax_settings?ajax_call=1&func_name=set&name=BrowserNotification&val=1',
											type: 'GET',
											data: { form_sign:  token[0], form_token: token[1] },
											isUser: true
										})
									});
								});
							}.bind(this));
						},
						width: 270,
						orientation: 'center',
						positionX: 'left',
						margin: [145,0],
						loadHTML: true
					}
				});
			}

			if (!mailru.IsExternalAccount) {
				// MAIL-7753, MAIL-13776
				// mailru.HelperIndex.collectorFolderList

				mailru.Balloon.push({
					// Collector
					id: mailru.HelperIndex.collector,
					selector: '#portal-menu__dropdown',
					priority: 10,
					counters: {
						show: 816839,
						close: 816846
					},
					disposable: true,
					test: function (deferred) {
						if (!mailru.FromCollector && mailru.newreg) {
							deferred.resolve();
						} else {
							deferred.reject();
						}
					},
					balloonOptions: {
						onInit: function () {
							$('.js-hide', this.$Balloon).bind('click', function (evt) {
								this._eHide();
								evt.preventDefault();
							}.bind(this));
						},
						width: 480,
						orientation: 'center',
						positionX: 'left',
						margin: [-222, 0],
						absolute: false,
						loadHTML: true
					}
				});

				mailru.Balloon.push({
					// MAIL-7753: Collector Promo
					id: mailru.HelperIndex.collectorPromo,
					selector: '#portal-menu__dropdown',
					priority: 30,
					timeLimit: 60 * 60 * 24 * 30,
					regTimeLimit: 60 * 60 * 24 * 30,
					counters: {
						show:  1021005,
						close: 1021005
					},
					test: function (df){
						df[!mailru.IsCorpUser && !mailru.Balloon.isClosed(mailru.HelperIndex.collector) && mailru.isMsgListPage() ? 'resolve' : 'reject']();
					},
					balloonOptions: {
						onInit: function (){
							$('.js-hide', this.$Balloon).bind('click', function (evt) {
								this._eHide();
								evt.preventDefault();
							}.bind(this));
						},
						width: 240,
						orientation: 'bottom',
						positionX: 'left',
						margin: [0, 0],
						absolute: false,
						loadHTML: true
					}
				});
			}

			if (mailru['IsShowCalendarBalloon']) {
				(function (ts, id) {
					if (ts[id] < 1356984000) {

						mailru.HelperStatus &= ~(1 << id);

						mailru.Balloon.push({
							// MAIL-13256
							id: id,
							selector: '#portal-menu__dropdown',
							priority: 9,
							timeLimit: 60 * 60 * 24 * 30,
							regTimeLimit: 60 * 60 * 24 * 30,
							counters: {
								show:  1444397,
								close: 1444403
							},
							balloonOptions: {
								width: 240,
								orientation: 'center',
								positionX: 'left',
								margin: [-102, -10],
								absolute: false,
								loadHTML: true
							}
						});
					}

				})(mailru.HelperTimestamp, mailru.HelperIndex.neoDesign);
			}

			// MAIL-9955
			if (mailru.MultiAuthBalloonEnable) {
				mailru.Balloon.push({
					id: mailru.HelperIndex.multiAuth,
					event: "multiAuthCloseClick",
					selector: function () {
						return $('.w-portal-headline__auth__col_left', '#PH_authView');
					},
					priority: 12,
					timeLimit: 60 * 60 * 24 * 14,
					regTimeLimit: 60 * 60 * 24 * 30,
					counters: { show: 1161658, close: 1161658 },
					test: function (deferred){
						if (window.__PH && __PH.isMultiAuth()) {
							deferred.resolve();
						} else {
							deferred.reject();
						}
					},
					balloonOptions: {
						onInit: function () {
							this.$Balloon.css('right', 157).find(this.cssTH).css('cursor', 'pointer').click(function (evt) {
								this._eHide();
								evt.preventDefault();
								if (window.__PH && __PH.authMenu && __PH.authMenu.show) {
									__PH.authMenu.show();
								}
							}.bind(this));
						},
						width: 248,
						orientation: 'bottom',
						positionX: 'right',
						margin: [0, 20],
						absolute: false,
						loadHTML: true
					}
				});
			}
		}

		if( !mailru.Balloon.isClosed(mailru.HelperIndex.multiAuth) ) {
			$(function () {
				if (window.__PH && __PH.isMultiAuth()) {
					if (__PH.authMenu && __PH.authMenu.once) {
						__PH.authMenu.once('show', function() {
							mailru.Balloon.makeAsClosed(mailru.HelperIndex.multiAuth);
						});
					}
				}
			});
		}

		var __mediaId = mailru.HelperIndex.messagelineMedia
			, __mediaTimestamp
		;

		try {
			if( mailru.HelperStatus & (1 << __mediaId) ) {
				if( (__mediaTimestamp = mailru.HelperTimestamp[__mediaId]) && __mediaTimestamp < 1356984000/*+new Date("01.01.13") minus three last zero*/ ) {
					mailru.HelperStatus ^= (1 << __mediaId);
				}
				__mediaTimestamp = null;
			}
		}
		catch(e) {

		}

		mailru.Balloon.push({
			id: __mediaId,
			event: 'dropDownViewLinkClick.msglist',
			priority: 12,
			selector: function () {
				return $('.toolbar_top .toolbar__right', '#MsgListContent');
			},
			timeLimit: 60 * 60 * 24 * 7,
			regTimeLimit: 60 * 60 * 24 * 7,
			balloonOptions: {
				onInit: function () {
					this.$Balloon.css('right', 0);
				},
				onShow: function () {
					mailru.radar('MessageLineWithBal', 'balloonShow=1');
				},
				width: 270,
				positionX: 'right',
				margin: [0, -3],
				absolute: false,
				loadHTML: true
			}
		});

		if(mailru.IsNewComposeDesign) {
			// MAIL-12925
			mailru.Balloon.push({
				// compose select fields dropdown
				id: mailru.HelperIndex.composeSelectFields,
				selector: '#dropdown-select-fields',
				counters: {show: 1423988, close: 1423990},
				priority: 10,
				disposable: true,
				test: function (deferred) {
					if (mailru.isComposePage()) { // only on compose page
						deferred.resolve();
					} else {
						deferred.reject();
					}
				},
				balloonOptions: {
					onInit: function () {
						$('.js-hide', this.$Balloon).bind('click', function (evt) {
							this._eHide();
							evt.preventDefault();
						}.bind(this));
					},
					width: 300,
					orientation: 'bottom',
					positionX: 'left',
					margin: [6, 0],
					offset: 'none',
					absolute: true,
					loadHTML: true
				}
			});
		}
	}

	if (defined(mailru.TestHelpersAllRegTimeLimit)) {
		$.each(mailru.Balloon.items, function (k, v) {
			v.options.regTimeLimit = mailru.TestHelpersAllRegTimeLimit;
		});
	}

	if (defined(mailru.TestHelpersAllTimeLimit)) {
		$.each(mailru.Balloon.items, function (k, v) {
			v.options.timeLimit = mailru.TestHelpersAllTimeLimit;
		});
	}

	$(window).bind('showMessage.readmsg show.msglist', function () {
		mailru.Balloon.redraw();
	});

	jsLoader.loaded('{mailru}mailru.Balloon', 1);

// data/ru/images/js/ru/mailru.Balloon.js end

// data/ru/images/js/ru/mailru.PhoneManager.js start


// data/ru/images/js/ru/jsCore/plugins/Layer.js start


/**
	 * @class LayerFade
	 */
	jsClass
	.create('LayerFade')
	.extend(jQueryEvent)
	.methods({

		__construct: function() {
			this.hideObserver = this.hide.bind(this);
			this.resizeObserver = this._resize.bind(this);
			this.$window = $(window);
			this.$document = $(document);
			this.$container = $('body, #ScrollBodyInner').last();

			// Chrome has bug with double removing overflow: hidden
			this.$wrapper = $Scroll.normal ? $(document.body) : $ScrollElement ;

			this.$div = $('<div/>')
				.css({
					opacity: mailru.isDarkPopup ? 0.4 : 0.6,
					backgroundColor: mailru.isDarkPopup ? '#000' : '#fff',
					width: '100%',
					height: '100%',
					zIndex: 65001,
					position: this._hasPositionFixed() ? 'fixed' : 'absolute',
					top: 0,
					left: 0,
					display: 'none'
				})
				.appendTo(this.$container);
		},

		/*
		* IS_ELEMENT_TAGNAME_UPPERCASED
		* https://github.com/kangax/cft
		*/
		_hasPositionFixed: function() {
			var container = document.body;

			if (document.createElement && container && container.appendChild && container.removeChild) {
				var element = document.createElement('div');

				if (!element.getBoundingClientRect)
					return null;

				element.innerHTML = 'x';
				element.style.cssText = 'position:fixed;top:100px;';
				container.appendChild(element);

				var originalHeight = container.style.height,
				originalScrollTop = container.scrollTop;

				container.style.height = '3000px';
				container.scrollTop = 500;

				var elementTop = element.getBoundingClientRect().top;
				container.style.height = originalHeight;

				var isSupported = (elementTop === 100);
				container.removeChild(element);
				container.scrollTop = originalScrollTop;

				return isSupported;
			}
			return null;
		},

		_resize: function() {
			this.$div.hide();
			this._update();
			this.$div.show();
		},

		_getPageGeometry: function () {
			return [Math.max(
				(window.innerWidth || 0) + (window.scrollMaxX || 0),
				document.documentElement.clientWidth || 0,
				this.$container[0].clientWidth || 0,
				this.$container[0].scrollWidth || 0
			), Math.max(
				(window.innerHeight || 0) + (window.scrollMaxY || 0),
				document.documentElement.clientHeight || 0,
				this.$container[0].clientHeight || 0,
				this.$container[0].scrollHeight || 0
			)];
		},

		_update: function() {
			var pageGeometry = this._getPageGeometry();
			this.$div.css({height: pageGeometry[1]});
		},

		show: function(options) {

			options = options || {};

			if (!this.visible) {
				this.visible = 1;

				if (options.fill_fade) {

					this.$div.css({
						opacity: 1,
						backgroundColor: '#fff'
					});

				} else {

					this.$div.css({
						opacity: mailru.isDarkPopup ? 0.4 : 0.6,
						backgroundColor: mailru.isDarkPopup ? '#000' : '#fff'
					});
				}

				this.$div.show();

				this._update();
				this.$window.bind('resize', this.resizeObserver);
				this.triggerHandler('show');

				this.styleOverflow = this.$wrapper.css('overflow');
				this.$wrapper.css('overflow', 'hidden');
			}
		},

		hide: function() {
			if (this.visible) {
				this.visible = 0;
				this.$div.hide();
				this.$window.unbind('resize', this.resizeObserver);
				this.triggerHandler('hide');
				this.$wrapper.css('overflow', this.styleOverflow);
			}
		},

		update: function() {
			this._update();
		}
	});

	/**
	 * @class LayerMainDiv
	 */
	jsClass
	.create('LayerMainDiv')
	.extend(jQueryEvent)
	.methods({
		__construct: function () {
			this.fade = LayerFade.getInstance();

			this.hideObserver = this.hide.bind(this);
			this.resizeObserver = this._resize.bind(this);
			this.controlClickObserver = this._controlClick.bind(this);

			this.$window = $(window);
			this.$document = $(document);
			this.$div = $('#MailRuConfirm');
			this.$innerDiv = $('.alertDivSpan,.js-layer', this.$div);
			this.$close = $('.iDelBig,.js-cancel', this.$div).bind('click', this.controlClickObserver);

			if ($.browser.msie && parseInt($.browser.version) < 8) {
				this.$iFrame = $('<iframe frameborder="0" tabindex="-1" class="pAbs top0 left0 dB2" style="z-index:-1;" src="javascript:0;"/>').appendTo(this.$div);
			}

			this.fade.bind({
				hide: this.hideObserver
			});

			this.enableHide();
		},

		_resize: function() {
			this._update();
			this.triggerHandler('resize');
		},

		_update: function () {
			// MAIL-16393
			var scrollTop = ajs.scrollTop();
			var y = ($(window).height() - this.$div.height()) / 3 + scrollTop;

			this.$div.css({
				top: y + 'px'
			});

			if (this.$iFrame) {
				var position = this.$innerDiv.position();
				var inner = this.$innerDiv[0];

				this.$iFrame.css({
					width:  inner.offsetWidth,
					height: inner.offsetHeight,
					left:   position.left
				});
			}
		},

		_controlClick: function (evt) {
			this.triggerHandler('controlClick');
			this.hide();
		},

		show: function (options) {

			options = options || {};

			if (!this.visible) {
				this.visible = 1;
				this.$div.removePositionFixed().removeAttr('style').show();
				if (this.$iFrame) this.$iFrame.show();
				this.fade.show(options);
				this._update();
				this.$window.bind('resize', this.resizeObserver);
				this.triggerHandler('show');
			}
			return this;
		},

		hide: function () {
			if (this.visible && !this.fix) {
				this.visible = 0;
				if (this.$iFrame) this.$iFrame.hide();
				this.$div.hide();
				this.fade.hide();
				this.$window.unbind('resize', this.resizeObserver);
				this.triggerHandler('hide');
			}
			return this;
		},

		disableHide: function () {
			this.fix = 1;
			this.$close.hide();
			$.hotkeys.off('esc', this.hideObserver);
			return this;
		},

		enableHide: function () {
			this.fix = 0;
			this.$close.show();
			$.hotkeys.on('esc', this.hideObserver);
			return this;
		}
	});

	/**
	 * @class Layer
	 */
	jsClass
	.create('Layer')
	.extend(jQueryEvent)
	.statics({
		'prefix': function(name) {
			return 'is-' + name;
		},

		'cssClass': function(name) {
			return '.' + Layer.prefix(name) + '_in';
		},

		'isExternal': function() {
			return Layer.options && Layer.options.type == 'external';
		},

		'get': function (name, callback, options) {
			this.options = options || {};

			var mainDiv = LayerMainDiv.getInstance(), prefix = Layer.prefix(name);

			var $layer = $(Layer.cssClass(name) + ':first', mainDiv.$div);

			if (this.options.isRefresh) {
				if ($layer.length) {
					$layer.remove();
				}
			}

			if (!this.options.isRefresh && $layer.length) {
				callback(new Layer(prefix));
			} else {
				mailru.Ajax({
					url: '/cgi-bin/lstatic?get=layer&name=' + name,
					type: 'GET',
					dataType: 'text',
					data: $.extend(
						{
							EnableChangeAMLang: mailru.EnableChangeAMLang,
							EnableChangeESLang: mailru.EnableChangeESLang,
							EnableChangeKZLang: mailru.EnableChangeKZLang,
							EnableChangeEnglishLang: mailru.EnableChangeEnglishLang,
							EnableChangeBYLang: mailru.EnableChangeBYLang,
							NewMultiAuthLayerLogic: mailru.NewMultiAuthLayerLogic,
							HTTP_PROTOCOL: location.protocol,
							lang: mailru.LANG,
							SingleDomainName: mailru.SingleDomainName
						},

						this.options.params
					),

					complete: function (Result) {
						if (Result.isOK()) {
							mainDiv.$innerDiv.append(Result.getData());
							callback(new Layer(prefix));
						}
					}
				});
			}
		},

		'set': function(name, node) {
			var mainDiv = LayerMainDiv.getInstance(), prefix = Layer.prefix(name);

			if ($(Layer.cssClass(name) + ':first', mainDiv.$div).length) {
				$(Layer.cssClass(name), mainDiv.$div).replaceWith(node);

			} else {
				$(mainDiv.$innerDiv).append(node);
			}
		}
	})
	.methods({

		__construct: function (type, callback) {

			this.mainDiv = LayerMainDiv.getInstance();

			this.hideObserver = this.hide.bind(this);
			this.controlClickObserver = this._controlClick.bind(this);

			this.type = type;
			this.func = callback || $.noop;

			this.$div = $('.' + this.type + '_in:first', this.mainDiv.$div);

			$('.confirm-ok,.confirm-cancel', this.$div).unbind('.layer').bind('click.layer', this.controlClickObserver);

			this.mainDiv.bind({
				controlClick: this.controlClickObserver,
				hide: this.hideObserver
			});

			this.$div[this.$div.is('form') ? 'F' : 'find']('form').unbind('.layer').bind('submit.layer', function () {
				var r = this._execFunc(true);
				if ((r !== 1) && (r !== false)) {
					this.hide();
				}
				return false;
			}.bind(this));
			this.$div.find('.form__select').form__select();
		},

		_controlClick: function (evt) {
			var $target = $(evt.target), status = null;
			if (evt.target.nodeType) {
				status = $target.is('.confirm-ok');
			}
			var r = this._execFunc(status);
			if ((r !== 1) && (r !== false)) {
				this.hide();
			}
			evt.preventDefault();
		},

		_execFunc: function (status) {
			var r = this.func.call(this, status);
			this.triggerHandler('callback', [status]);
			return r;
		},

		show: function (options) {
			options = options || {};

			if (Layer.prev)
				Layer.prev.hide();

			Layer.prev = this;

			if (!this.visible) {
				if (Layer.isExternal()) {
					this.mainDiv.$innerDiv.addClass('popup_external');
				}

				this.hideAllErrors();
				this.visible = 1;
				this.$div.removeClass('dN').show();
				this.mainDiv.show(options);
				$(':input:visible:first', this.$div).focus();
				this.triggerHandler('show');

				if (options && typeof options.complete == 'function') {
					options.complete(this);
				}
			}

			return this;
		},

		hide: function (options) {
			if (this.visible && !this.fix) {
				if (Layer.isExternal()) {
					this.mainDiv.$innerDiv.removeClass('popup_external');
				}

				this.visible = 0;
				this.$div.hide();
				this.mainDiv.hide();
				this.triggerHandler('hide');

				if (options && typeof options.complete == 'function') {
					options.complete(this);
				}
			}

			return this;
		},

		disableHide: function () {
			this.fix = 1;
			this.mainDiv.disableHide();
			return this;
		},

		enableHide: function () {
			this.fix = 0;
			this.mainDiv.enableHide();
			return this;
		},

		showError: function(text) {
			try {
				$('.js-formError', this.$div)
					.html(text)
					.show();
			} catch(e) {
				alert(text);
			}
		},

		hideError: function () {
			$('.js-formError', this.$div).hide();
		},

		hideAllErrors: function () {
			this.hideError();
			this.$div.find('.form__field').removeClass('form__field_error');
			this.$div.find('.form__spinbox__field').removeClass('form__spinbox__field_error');
			this.$div.find('.form__select').removeClass('form__select_error');
			this.$div.find('.form__message').empty();
		},

		sizeChanged: function() {
			var fade = LayerFade.getInstance();
			fade.update();
		}
	});

	jsLoader.loaded('{plugins}Layer', 1);

// data/ru/images/js/ru/jsCore/plugins/Layer.js end

// data/ru/images/js/ru/jsCore/plugins/formatPhone.js start

/**
 * @object   formatPhone
 * @description Interactive phone formatting according to 000 000-00-00
 * @requires {function} $.fn.formatPhone
 * @author   Abashkin Alexander <a.abashkin@corp.mail.ru>
 * @date     19.09.2012
 */


(function($)
	{
		jsClass

		.create('formatPhone')

		.methods({
			/**
			 * @public
			 * @param {Object} input - DOM element
			 * @param {Number} subtract - subtract the number of characters from a phone number
			 * @this  {Object} formatPhone
			 * IMPORTANT: Do not interchange lines in the constructor!
			*/
			__construct: function (input, subtract)
			{
				this.value = input.value;
				this.subtract = subtract;

				var first = '^\\d{' + this.at(3) + '}',

				// Set the value's length
				length = this.erase().length;

				// Text selection
				if (this.selected(input))
					return 0;

				// All fine, continue
				if (RegExp(first + '\\s\\d{3}\\-\\d{2}\\-\\d{2}$').test(this.value))
					return 0;

				if (length <= this.at(10))
				{
					// Formatting
					if (length >= this.at(4) && RegExp(first).test(this.value))
						input.value = this.replace(first, '$& ', 1);

					if (length >= this.at(7))
					{
						if (RegExp(first + '\\s\\d{3}').test(this.value))
							input.value = this.replace(first + '\\s\\d{3}', '$&-');

						else if (length <= this.at(10))
							input.value = this.replace('(' + first + ')(\\d{3})(\\d{2})', '$1 $2-$3-');

						else
							this.clean(input);
					}

					// Remove delimiters
					var delimiter = input.value.match(/\-/g);

					if (delimiter && delimiter.length > 2)
						this.clean(input);

					if (length == this.at(10))
					{
						// The final formatting
						input.value = this.erase()
							.replace(RegExp('^\\d{' + this.at(3) + '}'),  '$& ') // 000
							.replace(/\s(\d{3})/, '$&-')                         // 000 000-
							.replace(/\-\d{2}/,   '$&-')                         // 000 000-00-
					}
				}

				// 000 000-00-000... -> 0000000000...
				else if (/\D/g.test(this.value))
					input.value = this.erase();

				// Backspace
				if (this.last('-') || this.last(' '))
					input.value = this.value.slice(0, -1);
			},

			/**
			 * @private
			 * @description Get position by country
			 * @param {Number} index
			 * @returns {Number}
			*/
			at: function(index)
			{
				return index - (this.subtract | 0);
			},

			/**
			 * @private
			 * @description Erases all non-digit characters
			 * @returns {String}
			*/
			erase: function() {
				return this.value.replace(/\D/g, '');
			},

			/**
			 * @private
			 * @description Replace specified characters
			 * @param {String} expression - Regular expression
			 * @param {String} item
			 * @param {Number} type
			 * @returns {String}
			*/
			replace: function(expression, item, type)
			{
				var type = [[/\-+/, '-'], [/\s+/, ' ']][type || 0];

				return this.value
					.replace(RegExp(expression), item)
					.replace(type[0], type[1]);
			},

			/**
			 * @private
			 * @description Getting the last characters
			 * @param {*} item
			 * @returns {Boolean}
			*/
			last: function(item)
			{
				return this.value.charAt(this.value.length - 1) == item;
			},

			/**
			 * @private
			 * @description Clean the value
			 * @param {Object} input - DOM element
			*/
			clean: function(input) {
				input.value = this.value.replace(/[\s\-]/g, '');
			},

			/**
			 * @private
			 * @description Detect text selection
			 * @name selected
			 * @param {Object} input - DOM element
			 * @returns {Boolean}
			*/
			selected: function(input)
			{
				if (!input)
					return -1;

				var selection = input.selectionStart;

				if (typeof selection == 'number')
					return selection != input.selectionEnd;

				else if (typeof (selection = document.selection) != 'undefined') {
					input.focus();
					return selection.createRange().text;
				}
			}
		});

		/**
		 * @function $.fn.formatPhone
		 * @see formatPhone
		 * @requires {Object} formatPhone
		 * @return {Object} JQuery object
		 * @param {Object} event - DOM event
		 * @param {Number} subtract - subtract the number of characters from a phone number
		 * @author Abashkin Alexander <a.abashkin@corp.mail.ru>
		 * @date 19.09.2012
		*/
		$.fn.formatPhone = function (event, subtract, options)
		{
			var which = event.which,
				input = this[0];

			// <this> must be DOM-object with value property
			if (!input || typeof event !== 'object' || typeof subtract !== 'number')
				return this;

			// Allows to use the < | >
			if (event.type == 'keyup' && (which == 37 || which == 39))
				return this;

			new formatPhone(input, subtract);

			return this;
		};

	})(jQuery);

	jsLoader.loaded('{plugins}formatPhone', 1);

// data/ru/images/js/ru/jsCore/plugins/formatPhone.js end

(function($) {

		/**
		 * @class mailru.PhoneManager
		 */
		jsClass
		.create('mailru.PhoneManager')
		.extend(jQueryEvent)
		.methods({

			__construct: function(options) {
				var t = this;
				t.options = {};
				t.data = {};
				t.xhrs = {};
				t.layers = {};
				t.prevLayer = null;
				t.setOptions(options);
			},

			_createLayer_singSMS: function() {
				var t = this;
				var layer = new Layer('is-signupsms', $.proxy(t._signupSmsCallback, t));

				layer.bind('show', function() {
					$('input[name="code"]', this.$div).val('');
				});

				$('a.nosmslink:first', layer.$div)
					.bind('click', $.proxy(t._getSMSStatusLinkClick, t));
				return layer;
			},

			_createLayer_addPasswordQuestion: function(callback) {
				Layer.get('addPasswordQuestion', function (layer) {
					layer.func = $.proxy(this._addPasswordQuestionCallback, this);
					layer.one('show', function() {
						var $form = $('form', layer.$div);
						$('.js-error', $form).hide();
						var $passwordQuestionSelect = $('.js-passwordQuestion', $form);
						var $passwordCustomQuestionContainer = $('.js-passwordCustomQuestionContainer', $form);
						$passwordQuestionSelect.change(function () {
							$passwordCustomQuestionContainer.toggle($passwordQuestionSelect.val() == 'Custom');
						});
					});
					callback(layer);
				}.bind(this));
			},

			_createLayer_verifySomePhoneSingSMS: function() {
				var t = this;
				var layer = new Layer('is-signupsms', $.proxy(t._verifySomePhoneSingSmsCallback, t));

				layer.bind('show', function() {
					$('input[name="code"]', this.$div).val('');
				});

				$('a.nosmslink:first', layer.$div)
					.bind('click', $.proxy(t._getSMSStatusLinkClick, t));
				return layer;
			},

			_createLayer_selectVerifySomePhone: function() {
				var t = this;
				var layer = new Layer('is-selectVerifySomePhone', $.proxy(t._selectVerifySomePhoneCallback, t));

				layer.bind('show', function() {
					var t = this;
					var $error = $('.js-error', t.$div);
					$error.hide();
				});

				$('.js-codeisset', layer.$div)
					.bind('click', $.proxy(function (evt) {
						var layer = this._getLayer('selectVerifySomePhone');
						var $phoneSelect = $('.js-phone', layer.$div);
						var phone = $phoneSelect.val();
						this.data = {
							'phonecode': '',
							'phone': phone
						};
						this._verifySomePhoneCodeIssetLinkClick(evt);
					}, t));

				$('.js-addPhone', layer.$div)
					.bind('click', $.proxy(function (evt) {
						this._verifySomePhoneAddPhoneLinkClick(evt);
					}, t));

				return layer;
			},

			_createLayer_addPhone: function()
			{
				var t = this, o = t.options;
				var layer = new Layer('is-newphone1', $.proxy(t._addPhoneCallback, t));

				if (t.options.passcheck) {
					$('input[name="ismobile"]', t.$div).parent().children().hide();
				}

				layer.bind('show', function() {
					var t = this;
					var $phone = $('input[name="phone"]', t.$div);
					var $ismobile = $('input[name="ismobile"]', t.$div);
					var $submit = $('.confirm-ok', t.$div);
					var $phoneCodeSelect = $('select[name="phonecode"]', t.$div);
					var $childs = $phoneCodeSelect.children();

					$('.js-defaultText,.js-editpassText', t.$div).hide()
						.filter(o.user.isDisabled ? '.js-editpassText' : '.js-defaultText').show();

					$ismobile.attr('checked', 'checked');
					$phone.val('');

					if ($childs.length)
						$phoneCodeSelect.val($childs.first().val()).change();

					if ($ismobile.is(':checked'))
						$submit.form__disable();
				})
				.one('show', function() {
					var t = this;

					function applyCountryList() {
						var t = this;
						var $prefix = $('.js-phonePrefix, .phonePrefix', t.$div);
						var $phoneCodeSelect = $('select[name="phonecode"]', t.$div).empty();
						var $phone = $('input[name="phone"]', t.$div);
						var countryData = {};

						$.each(window.CountryList, function(key, country) {
							$('<option/>').attr('value', country.Code).css('fontWeight', key < 4 ? 'bold' : '').text(country.Country).appendTo($phoneCodeSelect);
							countryData[country.Code] = country;
						});

						$phoneCodeSelect.bind('change', {'countryData': countryData, 'prefix': $prefix, 'phone': $phone, 'select': $phoneCodeSelect}, function(evt) {

							var $select = evt.data.select;
							var $prefix = evt.data.prefix;
							var $phone = evt.data.phone;
							var countryData = evt.data.countryData;
							var country = countryData[$select.val()];
							$prefix.css('backgroundImage', 'url("' + country.Icon + '")').text('+' + country.Code).show();
							t.countryCode = country.Code;

							var p = $prefix[0].offsetWidth + 10;

							$phone.css({
								paddingLeft: p   + 'px',
								width: (158 - p) + 'px'
							});

						}).change();
					}

					if (window.CountryList) {
						applyCountryList.call(t);
					} else {
						$.ajax({
							url: '/cgi-bin/lstatic',
							data: {
								get:  'countries-list',
								rnd:  jsCore.build,
								lang: mailru.LANG,
                                staticDomainName: mailru.staticDomainName
							},
							dataType: 'script',
							cache: true,
							context: t,
							success: applyCountryList
						});
					}
				})
				.one('show', function() {
					var t = this;
					var $phone = $('input[name="phone"]', t.$div);
					var $ismobile = $('input[name="ismobile"]', t.$div);

					function liveValidate(event)
					{
						var t = this;
						var $phone = $('input[name="phone"]', t.$div);
						var $error = $('div.red:first, .js-error', t.$div);
						var $ismobile = $('input[name="ismobile"]', t.$div);
						var $submit = $('.confirm-ok', t.$div);
						var value = $phone.val();
						var prepareValue = value.replace(/[\(\)\-\+\s]/g, "");
						var error = '';
						var correct = true;
						var valid = true;

						// Formatting the phone number
						switch (t.countryCode)
						{
							case '7':
								$phone.formatPhone(event, 0);
							break;
							case '380':
								$phone.formatPhone(event, 1);
							break;
						}

						if ($ismobile.is(':checked'))
						{
							if (prepareValue.length == 0) {
								valid = false;
								error = Lang.get('reg.phone_code_invalid');
							} else if (value.length < 3) {
								valid = false;
								error = Lang.get('reg.phone_code_incorrect');
							} else if (/[^\(\)\-\+\s0-9]/.test(value)) {
								correct = valid = false;
								error = Lang.get('reg.phone_sumbol_invalid');
							}
						}
						else {
							if (prepareValue.length == 0) {
								valid = false;
								error = Lang.get('reg.phone_code_invalid');
							} else if (prepareValue.length < 5 || prepareValue.length > 32 || value.length > 50) {
								valid = false;
								error = Lang.get('reg.phone_code_incorrect');
							} else if (!/^\d+$/.test(prepareValue)) {
								correct = valid = false;
								error = Lang.get('reg.phone_sumbol_invalid');
							}
						}

						if (correct) {
							$error.hide();
						} else {
							$error.html(error).show();
						}

						if (valid) {
							$submit.form__enable();
						} else {
							$submit.form__disable();
						}
					}

					function postValidate() {
						var t = this;
						var $phone = $('input[name="phone"]', t.$div);
						var $error = $('div.red:first, .js-error', t.$div);
						var $ismobile = $('input[name="ismobile"]', t.$div);
						var $submit = $('.confirm-ok', t.$div);
						var value = $.trim($phone.val());
						var prepareValue = value.replace(/[\(\)\-\+\s]/g, "");
						var error = '';
						var correct = true;
						var valid = true;

						if ($ismobile.is(':checked')) {
							if (prepareValue.length == 0) {
								valid = false;
								error = Lang.get('reg.phone_code_invalid');
							} else if (value.length < 3) {
								correct = valid = false;
								error = Lang.get('reg.phone_code_incorrect');
							} else if (/[^\(\)\-\+\s0-9]/.test(value)) {
								correct = valid = false;
								error = Lang.get('reg.phone_sumbol_invalid');
							}
						} else {
							if (prepareValue.length == 0) {
								valid = false;
								error = Lang.get('reg.phone_code_invalid');
							} else if (prepareValue.length < 5 || prepareValue.length > 32 || value.length > 50) {
								correct = valid = false;
								error = Lang.get('reg.phone_code_incorrect');
							} else if (!/^\d+$/.test(prepareValue)) {
								correct = valid = false;
								error = Lang.get('reg.phone_sumbol_invalid');
							}
						}

						if (correct) {
							$error.hide();
						} else {
							$error.html(error).show();
						}

						if (valid) {
							$submit.form__enable();
						} else {
							$submit.form__disable();
						}
					}

					$phone.bind({
						'keyup': $.proxy(liveValidate, t),
						'blur': $.proxy(function() {
							setTimeout($.proxy(postValidate, this), 100);
						}, t)
					});

					$ismobile.bind('click', $.proxy(liveValidate, t));
				});

				return layer;
			},

			_createLayer_signupPhone: function() {
				var t = this;
				var layer = new Layer('is-signupphone1', $.proxy(t._signupPhoneCallback, t));

				layer.bind('show', function() {
					var t = this;
					var $phone = $('input[name="phone"]', t.$div);
					var $ismobile = $('input[name="ismobile"]', t.$div);
					var $submit = $('.confirm-ok', t.$div);
					var $phoneCodeSelect = $('select[name="phonecode"]', t.$div);
					var $childs = $phoneCodeSelect.children();
					var $error = $('div.red:first, .js-error', t.$div);

					$error.hide();

					$ismobile.attr('checked', 'checked');
					$phone.val('');

					if ($childs.length)
						$phoneCodeSelect.val($childs.first().val()).change();

					if ($ismobile.is(':checked'))
						$submit.attr('disabled', 'disabled');
				})
				.one('show', function() {
					var t = this;

					function applyCountryList() {
						var t = this;
						var $prefix = $('.js-phonePrefix, .phonePrefix', t.$div);
						var $phoneCodeSelect = $('select[name="phonecode"]', t.$div).empty();
						var $phone = $('input[name="phone"]', t.$div);
						var countryData = {};

						$.each(window.CountryList, function(key, country) {
							$('<option/>').attr('value', country.Code).css('fontWeight', key < 4 ? 'bold' : '').text(country.Country).appendTo($phoneCodeSelect);
							countryData[country.Code] = country;
						});

						$phoneCodeSelect.bind('change', {'countryData': countryData, 'prefix': $prefix, 'phone': $phone, 'select': $phoneCodeSelect}, function(evt) {
							var $select = evt.data.select;
							var $prefix = evt.data.prefix;
							var $phone = evt.data.phone;
							var countryData = evt.data.countryData;
							var country = countryData[$select.val()];
							$prefix.css('backgroundImage', 'url("' + country.Icon + '")').text('+' + country.Code).show();
							var p = $prefix[0].offsetWidth + 5;
							$phone.css({
								'paddingLeft': p,
								'width': 158 - p
							});
						}).change();
					}

					if (window.CountryList) {
						applyCountryList.call(t);
					} else {
						$.ajax({
							url: '/cgi-bin/lstatic',
							data: {
								get:  'countries-list',
								rnd:  jsCore.build,
								lang: mailru.LANG,
								staticDomainName: mailru.staticDomainName
							},
							dataType: 'script',
							cache: true,
							context: t,
							success: applyCountryList
						});
					}
				})
				.one('show', function() {
					var t = this;
					var $phone = $('input[name="phone"]', t.$div);
					var $ismobile = $('input[name="ismobile"]', t.$div);

					function liveValidate() {
						var t = this;
						var $phone = $('input[name="phone"]', t.$div);
						var $error = $('div.red:first, .js-error', t.$div);
						var $ismobile = $('input[name="ismobile"]', t.$div);
						var $submit = $('.confirm-ok', t.$div);
						var value = $phone.val();
						var prepareValue = value.replace(/[\(\)\-\+\s]/g, "");
						var error = '';
						var correct = true;
						var valid = true;

						if ($ismobile.is(':checked')) {
							if (prepareValue.length == 0) {
								valid = false;
								error = Lang.get('reg.phone_code_invalid');
							} else if (value.length < 3) {
								valid = false;
								error = Lang.get('reg.phone_code_incorrect');
							} else if (/[^\(\)\-\+\s0-9]/.test(value)) {
								correct = valid = false;
								error = Lang.get('reg.phone_sumbol_invalid');
							}
						} else {
							if (prepareValue.length == 0) {
								valid = false;
								error = Lang.get('reg.phone_code_invalid');
							} else if (prepareValue.length < 5 || prepareValue.length > 32 || value.length > 50) {
								valid = false;
								error = Lang.get('reg.phone_code_incorrect');
							} else if (!/^\d+$/.test(prepareValue)) {
								correct = valid = false;
								error = Lang.get('reg.phone_sumbol_invalid');
							}
						}

						if (correct) {
							$error.hide();
						} else {
							$error.html(error).show();
						}

						if (valid) {
							$submit.attr('disabled', '');
						} else {
							$submit.attr('disabled', 'disabled');
						}
					}

					function postValidate() {
						var t = this;
						var $phone = $('input[name="phone"]', t.$div);
						var $error = $('div.red:first, .js-error', t.$div);
						var $ismobile = $('input[name="ismobile"]', t.$div);
						var $submit = $('.confirm-ok', t.$div);
						var value = $.trim($phone.val());
						var prepareValue = value.replace(/[\(\)\-\+\s]/g, "");
						var error = '';
						var correct = true;
						var valid = true;

						if ($ismobile.is(':checked')) {
							if (prepareValue.length == 0) {
								valid = false;
								error = Lang.get('reg.phone_code_invalid');
							} else if (value.length < 3) {
								correct = valid = false;
								error = Lang.get('reg.phone_code_incorrect');
							} else if (/[^\(\)\-\+\s0-9]/.test(value)) {
								correct = valid = false;
								error = Lang.get('reg.phone_sumbol_invalid');
							}
						} else {
							if (prepareValue.length == 0) {
								valid = false;
								error = Lang.get('reg.phone_code_invalid');
							} else if (prepareValue.length < 5 || prepareValue.length > 32 || value.length > 50) {
								correct = valid = false;
								error = Lang.get('reg.phone_code_incorrect');
							} else if (!/^\d+$/.test(prepareValue)) {
								correct = valid = false;
								error = Lang.get('reg.phone_sumbol_invalid');
							}
						}

						if (correct) {
							$error.hide();
						} else {
							$error.html(error).show();
						}

						if (valid) {
							$submit.attr('disabled', '');
						} else {
							$submit.attr('disabled', 'disabled');
						}
					}

					$phone.bind({
						'keyup': $.proxy(liveValidate, t),
						'blur': $.proxy(function() {
							setTimeout($.proxy(postValidate, this), 100);
						}, t)
					});

					$ismobile.bind('click', $.proxy(liveValidate, t));
				});

				return layer;
			},

			_createLayer_check: function() {
				var t = this;
				var layer = new Layer('is-phone_verify_check');
				$('input.confirm-return:first', layer.$div)
					.bind('click', $.proxy(t._editPhoneLinkClick, t));
				$('a.withoutphone:first', layer.$div)
					.bind('click', $.proxy(t._withoutPhoneLinkClick, t));
				$('input.confirm-ok:first', layer.$div)
					.bind('click', $.proxy(function() {
						t.check(t.data.phonecode, t.data.phone);
					}, t));

				layer.bind('show', function() {
					var t = this;
					$('.confirm-return', t.$div).show();
					$('.confirm-ok', t.$div).hide();
				});

				return layer;
			},

			_createLayer_noSMS1: function() {
				var t = this;
				var layer = new Layer('is-nosms1');
				$('a.editphone:first', layer.$div)
					.bind('click', $.proxy(t._editPhoneLinkClick, t));
				$('a.withoutphone:first', layer.$div)
					.bind('click', $.proxy(t._withoutPhoneLinkClick, t));
				$('input.confirm-return:first', layer.$div)
					.bind('click', $.proxy(t._returnLinkClick, t));
				return layer;
			},

			_createLayer_noSMS2: function() {
				var t = this;
				var layer = new Layer('is-nosms2', $.proxy(t._noSMS1LayerCallback, t));
				$('a.editphone:first', layer.$div)
					.bind('click', $.proxy(t._editPhoneLinkClick, t));
				$('a.withoutphone:first', layer.$div)
					.bind('click', $.proxy(t._withoutPhoneLinkClick, t));
				$('input.confirm-return:first', layer.$div)
					.bind('click', $.proxy(t._returnLinkClick, t));
				return layer;
			},

			_createLayer_genDel: function() {
				var t = this;
				var layer = new Layer('is-genDelPhone', $.proxy(t._genDelPhoneLayerCallback, t));

				$('a.nosmslink:first', layer.$div)
					.bind('click', $.proxy(t._getSMSStatusLinkClick, t));

				$('a.resendsms:first', layer.$div)
					.bind('click', $.proxy(t._genDelPhoneResendLinkClick, t));

				layer.bind('show', function() {
					var t = this;
					var $code = $('input[name="code"]', t.$div);
					var $error = $('div.red:first, .js-error', t.$div);
					var $info = $('div.info:first', t.$div);
					$error.add($info).hide();
					$code.val('');
				});

				return layer;
			},

			_createLayer_genDelPhoneConfirm: function() {
				var t = this;
				var layer = new Layer('is-genDelPhoneConfirm', $.proxy(t._genDelPhoneConfirmLayerCallback, t));

				$('a.codeisset:first', layer.$div)
					.bind('click', $.proxy(t._getDelCodeIssetLinkClick, t));

				return layer;
			},

			_createLayer_verifyPhoneConfirm: function() {
				var t = this;
				var layer = new Layer('is-verifyPhoneConfirm', $.proxy(t._verifyPhoneConfirmLayerCallback, t));

				$('a.codeisset:first', layer.$div)
					.bind('click', $.proxy(t._verifyPhoneCodeIssetLinkClick, t));

				return layer;
			},

			_createLayer_genDelPhoneSuccess: function() {
				var t = this;
				var layer = new Layer('is-genDelPhoneSuccess');
				return layer;
			},

			_createLayer_addPhoneAlreadyExists: function() {
				var t = this;
				var layer = new Layer('is-addPhoneAlreadyExists');
				return layer;
			},

			_send: function(o) {
				var t = this;

				if (t.xhrs[o.func_name])
					t.xhrs[o.func_name].abort();

				t.xhrs[o.func_name] = mailru.Ajax({
					type: 'POST',
					url: '/cgi-bin/smsverificator?&ajax_call=1&lang=' + mailru.LANG + '&func_name=' + o.func_name,
					data: $.extend({
						x_reg_id: t.options.x_reg_id,
						user: t.options.user.name,
						domain: t.options.user.domain
					}, o.data),
					timeout: o.timeout || 5000,
					complete: $.proxy(o.complete, t)
				});
			},

			_getLayer: function(name) {
				var t = this, l = t.layers;
				return l[name] ? l[name] : l[name] = t['_createLayer_' + name]();
			},

			_getLayerAsync: function (name, callback) {
				var t = this, l = t.layers;
				l[name] ? callback(l[name]) : t['_createLayer_' + name](function (layer) {
					callback(l[name] = layer);
				});
			},

			setOptions: function(o) {
				var t = this;
				t.options = $.extend({}, o);
			},

			check: function(phonecode, phone) {
				var t = this;
				var layer = t._getLayer('check');
				var $error = $('div.red:first, .js-error', layer.$div);
				var $load = $('div.inLoading:first', layer.$div);
				var $controls = $('div.controls:first', layer.$div);

				t.data = {
					'ismobile': 1,
					'phonecode': phonecode,
					'phone': phone
				};

				t._send({
					'func_name': (!this.options.isNeedMoreInfo) ? 'register' : 'addnew',
					'data': t.data,
					'complete': t._checkComplete
				});

				$error.hide();
				$load.show();
				$controls.hide();
				layer.show();
			},

			phoneStatus: function(phonecode, phone) {
				var t = this;
				var layer = t._getLayer('check');
				var $error = $('div.red:first, .js-error', layer.$div);
				var $load = $('div.inLoading:first', layer.$div);
				var $controls = $('div.controls:first', layer.$div);

				t.data = {
					'phonecode': phonecode,
					'phone': phone
				};

				t._send({
					'func_name': 'phone_status',
					'data': {'phone': phonecode + phone},
					'complete': t._phoneStatusComplete
				});

				$error.hide();
				$load.show();
				$controls.hide();
				layer.show();
			},

			_phoneStatusComplete: function(result) {
				var t = this;
				t.ajaxResult = null;

				if (result.isOK()) {
					t.ajaxResult = result.getData();
				}

				if (t.ajaxResult) {
					if (t.ajaxResult.status == 'error') {
						t.ajaxResult.text = Lang.get('phone_status_error');
						t._checkError();
					} else if (t.ajaxResult.status == 'latency') {
						var $c = t._getLayer('check').$div;
						var $controls = $('div.controls:first', $c);

						$('.confirm-return', $controls).hide();
						$('.confirm-ok', $controls).show();

						t.ajaxResult.text = Lang.get('phone_status_latency');
						t._checkError();
					} else {
						t.check(t.data.phonecode, t.data.phone);
					}
				} else {
					t.check(t.data.phonecode, t.data.phone);
				}
			},

			addPhone: function() {
				var t = this;
				var layer = t._getLayer('addPhone');
				var $error = $('div.red:first, .js-error', layer.$div);
				$error.hide();
				layer.show();
				layer.$div.find('.form__select').form__select();
			},

			signup: function() {
				var t = this;
				t._getLayer('signupPhone').show();
			},

			cancelDeletePhone: function(phone) {
				var t = this;

				t.data = {
					'phonecode': '',
					'phone': phone
				};

				t._send({
					'func_name': 'undelete',
					'data': t.data,
					'complete': t._cancelDeletePhoneComplete
				});
			},

			_cancelDeletePhoneComplete: function(result) {
				var t = this;
				t.ajaxResult = null;

				if (result.isOK()) {
					t.ajaxResult = result.getData();
				}

				if (t.ajaxResult) {
					t.triggerHandler('cancelDeletePhoneSuccess');
				}
			},

			changeFlag: function(phone, flag) {
				var t = this;

				t.data = {
					'phonecode': '',
					'phone': phone,
					'flags': flag
				};

				t._send({
					'func_name': 'chflags',
					'data': t.data,
					'complete': null
				});
			},

			deletePhone: function(phone, ismobile, verified) {
				var t = this;

				t.data = {
					'phonecode': '',
					'phone': phone.ID,
					'value': phone.Value
				};

				if (ismobile && verified) {
					var layer = t._getLayer('genDelPhoneConfirm');
					var $phone = $('span.phone:first', layer.$div);
					$phone.text(phone.Value);
					layer.show();
					t.triggerHandler('genDelPhoneConfirmShow', [t.data]);
				} else {
					t._send({
						'func_name': 'delete',
						'data': t.data,
						'complete': t._deletePhoneComplete
					});
				}
			},

			deleteRemindPhone: function (phone) {
				var t = this;
				t.data = {
					'phonecode': '',
					'phone': phone
				};
				t._send({
					'func_name': 'del_remind_phone',
					'data': t.data,
					'complete': t._deletePhoneComplete
				});
			},

			selectVerifySomePhone: function (phones) {
				var t = this;
				var layer = t._getLayer('selectVerifySomePhone');
				var $phoneSelect = $('.js-phone', layer.$div);
				var $phoneLabel = $('.js-phone-single', layer.$div);
				var html = '';

				$.each(phones, function (k, v) {
					html += '<option value="' + (v.ID? v.ID : v.Value) + '">' + v.Value + '</option>';
				});
				$phoneSelect.html(html);
				$phoneSelect.change();

				if (phones.length == 1){
					html = phones[0].Value;
					$phoneLabel.text(html);
					$phoneLabel.show();
					$('.js-phone-container', layer.$div).hide();
				}

				layer.show();
			},

			verifySomePhone: function(phonecode, phone) {
				var t = this;
				var layer = t._getLayer('check');
				var $error = $('div.red:first, .js-error', layer.$div);
				var $load = $('div.inLoading:first', layer.$div);
				var $controls = $('div.controls:first', layer.$div);

				t.data = {
					'phonecode': phonecode,
					'phone': phone
				};

				t._send({
					'func_name': 'send_auth_code',
					'data': t.data,
					'complete': t._verifySomePhoneComplete
				});

				$error.hide();
				$load.show();
				$controls.hide();

				layer.show();
			},

			verifyPhone: function(phonecode, phone) {
				var t = this;

				t.data = {
					'ismobile': 1,
					'phonecode': phonecode,
					'phone': phone.ID
				};

				var layer = t._getLayer('verifyPhoneConfirm');
				var $phone = $('span.phone:first', layer.$div);
				$phone.text(phone.Value);
				layer.show();
			},

			_genDelPhoneResendLinkClick: function(evt) {
				var t = this;
				t._genDelPhoneConfirmLayerCallback(1);
				evt.preventDefault();
			},

			_getDelCodeIssetLinkClick: function(evt) {
				var t = this;
				var layer = t._getLayer('genDel');
				var $code = $('input[name="code"]', layer.$div);
				var $error = $('div.red:first, .js-error', layer.$div);
				var $info = $('div.info:first', layer.$div);
				var $phone = $('span.phone:first', layer.$div);

				$error.add($info).hide();
				$code.val('');
				$phone.text(t.data.value);

				t.prevLayer = layer.show();

				evt.preventDefault();
			},

			_verifySomePhoneCodeIssetLinkClick: function (evt) {
				var t = this;
				var layer = t._getLayer('verifySomePhoneSingSMS');
				var $code = $('input[name="code"]', layer.$div);
				var $error = $('div.red:first, .js-error', layer.$div);
				var $info = $('div.info:first', layer.$div);
				var $phone = $('span.phone:first', layer.$div);

				$error.add($info).hide();
				$code.val('');
				$phone.text(t.data.phone);

				t.prevLayer = layer.show();

				evt.preventDefault();
			},

			_verifySomePhoneAddPhoneLinkClick: function(evt) {
				this.addPhone();
				evt.preventDefault();
			},

			_verifyPhoneCodeIssetLinkClick: function(evt) {
				var t = this;
				var layer = t._getLayer('singSMS');
				var $code = $('input[name="code"]', layer.$div);
				var $error = $('div.red:first, .js-error', layer.$div);
				var $info = $('div.info:first', layer.$div);
				var $phone = $('span.phone:first', layer.$div);
				var $password = $('.js-password', layer.$div);

				$error.add($info).add($password).hide();
				$code.val('');
				$phone.text(t.data.phone);

				if (t.options.AskPassword) {
					$password.show();
				}

				t.prevLayer = layer.show();

				evt.preventDefault();
			},

			_genDelPhoneConfirmLayerCallback: function(status) {
				var t = this;

				if (status) {

					var layer = t._getLayer('check');
					var $error = $('div.red:first, .js-error', layer.$div);
					var $load = $('div.inLoading:first', layer.$div);
					var $controls = $('div.controls:first', layer.$div);

					t._send({
						'func_name': 'gendel',
						'data': t.data,
						'complete': t._genDelPhoneComplete
					});

					$error.hide();
					$load.show();
					$controls.hide();

					layer.show();
				}
			},

			_verifyPhoneConfirmLayerCallback: function(status) {
				var t = this;
				if (status) {
					t.check(t.data.phonecode, t.data.phone);
				}
			},

			_genDelPhoneLayerCallback: function(status) {
				var t = this;
				var $c = t._getLayer('genDel').$div;

				if (status) {
					t.data.code = $.trim($('input[name="code"]', $c).val());

					t._send({
						'func_name': 'delete',
						'data': t.data,
						'complete': t._verifyGenDelComplete
					});

					return 1;
				} else {
					t.triggerHandler('genDelPhoneCancel');
				}
			},

			_verifyGenDelComplete: function(result) {
				var t = this;
				t.ajaxResult = null;

				if (result.isOK()) {
					t.ajaxResult = result.getData();
				}

				if (t.ajaxResult) {
					if (t.ajaxResult.error_type === 2) {
						t._verifyGenDelPhoneError();
					} else {
						t._verifyGenDelPhoneSuccess();
					}
				}
			},

			_verifyGenDelPhoneSuccess: function() {
				var t = this;

				var $c = t._getLayer('genDelPhoneSuccess').$div;
				var $phone = $('span.phone:first', $c);
				var readablephone = '';

				if (t.ajaxResult) {
					readablephone = t.ajaxResult.readable_phone;
				}

				$phone.text(readablephone);

				t._getLayer('genDelPhoneSuccess').show();

				t.triggerHandler('verifyGenDelSuccess', [t.data]);
			},

			_verifyGenDelPhoneError: function() {
				var t = this;
				var $c = t._getLayer('genDel').$div;
				var $error = $('div.red:first, .js-error', $c);
				var text = '';
				if (t.ajaxResult) {
					text = t.ajaxResult.text;
				}
				$error.html(text).show();
			},

			_genDelPhoneComplete: function(result) {
				var t = this;
				t.ajaxResult = null;

				if (result.isOK()) {
					t.ajaxResult = result.getData();
				}

				if (t.ajaxResult) {
					if (t.ajaxResult.error_type === 2) {
						t._genDelPhoneError();
					} else {
						t._genDelPhoneSuccess();
					}
				} else {
					t._genDelPhoneError();
				}
			},

			_genDelPhoneSuccess: function() {
				var t = this;
				var $c = t._getLayer('genDel').$div;
				var $phone = $('span.phone:first', $c);
				var $info = $('div.info:first', $c);
				var readablephone = '';

				t.prevLayer = t._getLayer('genDel').show();

				if (t.ajaxResult) {
					if (t.ajaxResult.text) {
						if (t.ajaxResult.error_type === 1) {
							$info.html(t.ajaxResult.text).show();
						}
					}

					readablephone = t.ajaxResult.readable_phone;
				}

				$phone.text(readablephone);
			},

			_genDelPhoneError: function() {
				var t = this;
				var $c = t._getLayer('check').$div;
				var $load = $('div.loadProgress:first, .js-loadProgress', $c);
				var $error = $('div.red:first, .js-error', $c);
				var $controls = $('div.controls:first', $c);
				var text = Lang.get('verify_phone_error');
				if (t.ajaxResult) {
					text = t.ajaxResult.text;
				}
				//$load.hide();
				$error.html(text).show();
				$controls.hide();
			},

			_deletePhoneComplete: function(result) {
				var t = this;
				t.ajaxResult = null;
				if (result.isOK()) {
					t.ajaxResult = result.getData();
				}
				if (t.ajaxResult) {
					// MAIL-5058 // MAIL-10740
					if (t.ajaxResult && (t.ajaxResult.result == 543709 || t.ajaxResult.result == 'PHONE_LAST_VERIFIED_WO_PWD_QSTN') ) {
						t._getLayerAsync('addPasswordQuestion', function (layer) {
							layer.show();
						});
					} else {
						t.triggerHandler('deletePhoneSuccess', [t.ajaxResult, t.data]);
				}
				}
			},

			_noSMS1LayerCallback: function(status) {
				var t = this;
				if (status) {
					if (t.options.user.isDisabled) {
						t.verifySomePhone(t.data.phonecode, t.data.phone);
					} else {
						t.check(t.data.phonecode, t.data.phone);
					}
				}
			},

			_returnLinkClick: function(evt) {
				var t = this;
				t.prevLayer.show();
				evt.preventDefault();
			},

			_withoutPhoneLinkClick: function(evt) {
				var t = this;
				t._getLayer('noSMS1').hide();
				t._getLayer('noSMS2').hide();
				t._getLayer('check').hide();
				evt.preventDefault();
				t.triggerHandler('withoutPhone');
			},

			_editPhoneLinkClick: function(evt) {
				var t = this;
				t._getLayer('noSMS1').hide();
				t._getLayer('noSMS2').hide();
				t._getLayer('check').hide();
				evt.preventDefault();
				t.triggerHandler('editPhone');
			},

			_getSMSStatusLinkClick: function(evt) {
				var t = this;
				t._getSMSStatus();
				evt.preventDefault();
			},

			_getSMSStatus: function() {
				var t = this;
				var layer = t._getLayer('check');
				var $error = $('div.red:first, .js-error', layer.$div);
				var $load = $('div.loadProgress:first', layer.$div);

				t._send({
					'func_name': 'get_status',
					'data': t.data,
					'complete': t._getSMSStatusComplete
				});

				$error.hide();
				$load.show();

				layer.show();
			},

			_getSMSStatusComplete: function(result) {
				var t = this;
				t.ajaxResult = null;

				if (result.isOK()) {
					t.ajaxResult = result.getData();
				}

				if (t.ajaxResult) {
					if (t.ajaxResult.status == 1) {
						t._noSMS1LayerShow();
					} else {
						t._noSMS2LayerShow();
					}
				}
			},

			_noSMS1LayerShow: function() {
				var t = this;
				var $c = t._getLayer('noSMS1').$div;
				var $phone = $('span.phone:first, .js-phone', $c);
				var $time = $('span.time:first, .js-time', $c);
				var readablephone = '';
				var minutes = 0;

				if (t.ajaxResult) {
					readablephone = t.ajaxResult.readable_phone;
					minutes = t.ajaxResult.time_passed;
				}

				$phone.text(readablephone);
				$time.text(t._getReadableTimeByMinutes(minutes));

				t._getLayer('noSMS1').show();
			},

			_getReadableTimeByMinutes: function(m) {
				var s = '';
				m = parseInt(m) || 0;
				if (m < 5) s = Lang.get('phonemanager.lt5min');
				else if (m < 10) s = Lang.get('phonemanager.lt10min');
				else if (m < 15) s = Lang.get('phonemanager.lt15min');
				else if (m < 20) s = Lang.get('phonemanager.lt20min');
				else if (m < 30) s = Lang.get('phonemanager.lt30min');
				else if (m < 60) s = Lang.get('phonemanager.lt60min');
				else s = Lang.get('phonemanager.gt60min');
				return s;
			},

			_noSMS2LayerShow: function() {
				var t = this;
				var layer = t._getLayer('noSMS2');
				var $phone = $('span.phone:first', layer.$div);
				var readablephone = '';

				if (t.ajaxResult) {
					readablephone = t.ajaxResult.readable_phone;
				}

				$phone.text(readablephone);
				layer.show();
			},

			_selectVerifySomePhoneCallback: function (status) {
				var t = this;
				var layer = t._getLayer('selectVerifySomePhone');
				if (status) {
					var $phoneSelect = $('.js-phone', layer.$div);
					var phone = $phoneSelect.val();
					t.verifySomePhone('', phone);
				}
			},

			_verifySomePhoneSingSmsCallback: function (status) {
				var t = this;
				var layer = t._getLayer('verifySomePhoneSingSMS');
				if (status) {
					t.data.code = $.trim($('input[name="code"]', layer.$div).val());
					if (t.data.code) {
						t._send({
							'func_name': 'send_auth_code',
							'data': t.data,
							'complete': t._verifySomePhoneSingSmsComplete
						});
					} else {
						t.ajaxResult = {text: Lang.get('captcha_invalid')};
						t._verifySomePhoneSingSmsError();
					}
					return 1;
				} else {
					t.triggerHandler('verifyPhoneCancel', [t.data]);
				}
			},

			_signupSmsCallback: function(status) {
				var t = this;
				var $c = t._getLayer('singSMS').$div;

				if (status) {
					t.data.code = $.trim($('input[name="code"]', $c).val());

					if (t.options.passcheck) {
						t._send({
							'func_name': 'verifyfromremind',
							'data': t.data,
							'complete': t._verifyComplete
						});
					} else {

						t.data.password = $.trim($('input[name="password"]', $c).val());

						t._send({
							'func_name': 'verify',
							'data': t.data,
							'complete': t._verifyComplete
						});
					}

					return 1;
				} else {
					t.triggerHandler('verifyPhoneCancel', [t.data]);
                    $(document).trigger("PhoneManager.verifyPhoneCancel");
				}
			},

			_signupPhoneCallback: function(status) {
				var t = this;
				var $c = t._getLayer('signupPhone').$div;

				if (status) {
					t.data.phonecode = $.trim($('select[name="phonecode"]', $c).val());
					t.data.phone = $.trim($('input[name="phone"]', $c).val());
					t.data.ismobile = $('input[name="ismobile"]:checked', $c).length;

					t._send({
						'func_name': 'addnew',
						'data': t.data,
						'complete': t._signupPhoneComplete
					});

					return 1;
				}
			},

			_signupPhoneComplete: function(result) {
				var t = this;
				t.ajaxResult = null;

				if (result.isOK()) {
					t.ajaxResult = result.getData();
				}

				if (t.ajaxResult) {
					if (t.ajaxResult.error_type === 2 || t.ajaxResult.error_type === 4) {
						t._signupPhoneError();
					} else {
						t._signupPhoneSuccess();
					}
				} else {
					t._signupPhoneError();
				}
			},

			_signupPhoneError: function() {
				var t = this;
				var $c = t._getLayer('signupPhone').$div;
				var $error = $('div.red:first, .js-error', $c);
				var text = '';
				if (t.ajaxResult) {
					text = t.ajaxResult.text;
				}
				$error.html(text).show();
			},

			_signupPhoneSuccess: function() {
				var t = this;
				var $c = t._getLayer('singSMS').$div;
				var $error = $('div.red:first, .js-error', $c);
				var $info = $('div.info:first', $c);
				var $mainText = $('div.mainText:first', $c);
				var $password = $('.js-password', $c);

				$error.add($info).add($mainText).add($password).hide();

				if (t.ajaxResult) {
					if (t.ajaxResult.text) {
						if (t.ajaxResult.error_type === 1) {
							$info.html(t.ajaxResult.text).show();
						} else {
							$mainText.html(t.ajaxResult.text).show();
						}
					}
				}

				if (t.data.ismobile) {
					t.prevLayer = t._getLayer('singSMS').show();
				} else {
					t._getLayer('signupPhone').hide();
				}

				t.triggerHandler('signupPhoneSuccess', [t.data]);
                $(document).trigger('PhoneManager.signupPhoneSuccess');
			},

			_addPasswordQuestionCallback: function (status) {
				var $form = $('form', this._getLayer('addPasswordQuestion').$div);
				if (status) {
					mailru.Ajax({
						type: 'POST',
						url: $form.attr('action'),
						data: $.extend({ajax_call: 1, func_name: 'pwd_question'}, $form.toObject()),
						complete: $.proxy(this._addPasswordQuestionComplete, this)
					});
					return 1;
				}
			},

			_addPasswordQuestionComplete: function (result) {

				var t = this, status, error, errorStr;
				t.ajaxResult = null;

				if (result.isOK()) {
					t.ajaxResult = result.getData();
				}

				if (t.ajaxResult) {
					status = t.ajaxResult.result;
				}

				if (status == 'OK') {
					this.deletePhone({ID:this.data.phone});
				} else {

					var $error = $('.js-error', this._getLayer('addPasswordQuestion').$div);

					if (t.ajaxResult) {
						error = t.ajaxResult.error;
					}

					if (error == 'NO_AUTH') {
						errorStr = Lang.get('delete_phone_error.NO_AUTH');
					} else if (error == 'EMPTY_QUESTION') {
						errorStr = Lang.get('delete_phone_error.EMPTY_QUESTION');
					} else if (error == 'EMPTY_ANSWER') {
						errorStr = Lang.get('delete_phone_error.EMPTY_ANSWER');
					} else if (error == 'HACKER') {
						errorStr = Lang.get('delete_phone_error.HACKER');
					} else {
						errorStr = Lang.get('delete_phone_error.DEFAULT');
					}

					$error.html(errorStr).show();
				}
			},

			_addPhoneCallback: function(status) {
				var t = this;
				var $c = t._getLayer('addPhone').$div;

				if (status) {
					t.data.phonecode = $.trim($('select[name="phonecode"]', $c).val());
					t.data.phone = $.trim($('input[name="phone"]', $c).val());
					t.data.ismobile = $('input[name="ismobile"]:checked', $c).length;

					if (t.options.passcheck) {
						t._send({
							'func_name': 'addfromremind',
							'data': t.data,
							'complete': t._addPhoneComplete
						});
					} else {
						t._send({
							'func_name': 'addnew',
							'data': t.data,
							'complete': t._addPhoneComplete
						});
					}

					return 1;
				}
			},

			_addPhoneComplete: function(result) {
				var t = this;
				t.ajaxResult = null;

				if (result.isOK()) {
					t.ajaxResult = result.getData();
				}

				if (t.ajaxResult) {
					if (t.ajaxResult.error_type === 2 || t.ajaxResult.error_type === 4) {
						t._addPhoneError();
					} else if (t.ajaxResult.error_type === 5) {
						if (t.options.user.isDisabled) {
							t.verifySomePhone(t.data.phonecode, t.data.phone);
						} else {
							t._addPhoneAlreadyExists();
						}
					} else {
						t._addPhoneSuccess();
					}
				} else {
					t._addPhoneError();
				}
			},

			_addPhoneAlreadyExistsCallback: function(evt, status) {
				this.triggerHandler('addPhoneAlreadyExistsSuccess', [this.ajaxResult, this.data]);
			},

			_addPhoneAlreadyExists: function () {
				var t = this;
				Layer.get('addPhoneAlreadyExists', function (layer) {
					var $phone = $('.js-phone', layer.$div);
					var readablephone = '';
					if (t.ajaxResult) {
						readablephone = t.ajaxResult.readable_phone;
					}
					$phone.text(readablephone);
					layer.one('callback', $.proxy(t._addPhoneAlreadyExistsCallback, t));
					layer.show();
				});
			},

			_addPhoneError: function() {
				var t = this;
				var layer = t._getLayer('addPhone');
				var $error = $('div.red:first, .js-error', layer.$div);
				var text = '';
				if (t.ajaxResult) {
					text = t.ajaxResult.text;
				}
				$error.html(text).show();
			},

			_addPhoneSuccess: function() {
				var t = this;
				var signLayer = t._getLayer('singSMS');
				var addPhoneLayer = t._getLayer('addPhone');
				var $error = $('div.red:first, .js-error', signLayer.$div);
				var $info = $('div.info:first', signLayer.$div);
				var $mainText = $('div.mainText:first', signLayer.$div);
				var $password = $('.js-password', signLayer.$div);

				$error.add($info).add($mainText).add($password).hide();

				if (t.ajaxResult) {
					if (t.ajaxResult.text) {
						if (t.ajaxResult.error_type === 1) {
							$info.html(t.ajaxResult.text).show();
						} else {
							$mainText.html(t.ajaxResult.text).show();
						}
					}
				}

				if (t.options.AskPassword) {
					$password.show();
				}

				if (t.data.ismobile) {
					t.prevLayer = signLayer.show();
				} else {
					addPhoneLayer.hide();
				}

				t.triggerHandler('addPhoneSuccess', [t.ajaxResult, t.data]);
			},

			_verifySomePhoneSuccess: function () {
				var t = this;
				var signLayer = t._getLayer('verifySomePhoneSingSMS');
				var $error = $('div.red:first, .js-error', signLayer.$div);
				var $info = $('div.info:first', signLayer.$div);
				var $mainText = $('div.mainText:first', signLayer.$div);

				$error.add($info).add($mainText).hide();

				if (t.ajaxResult && t.ajaxResult.text) {
					if (t.ajaxResult.error_type === 1) {
						$info.html(t.ajaxResult.text).show();
					} else {
						$mainText.html(t.ajaxResult.text).show();
					}
				}

				t.prevLayer = signLayer.show();

				t.triggerHandler('addPhoneSuccess', [t.ajaxResult, t.data]);
			},

			_verifySomePhoneSingSmsComplete: function (result) {
				var t = this;
				t.ajaxResult = null;

				if (result.isOK()) {
					t.ajaxResult = result.getData();
				}

				if (t.ajaxResult) {
					if (t.ajaxResult.error_type) {
						t._verifySomePhoneSingSmsError();
					} else {
						t._verifySuccess();
					}
				} else {
					t._verifySomePhoneSingSmsError();
				}
			},

			_verifySomePhoneSingSmsError: function () {
				var t = this;
				var layer = t._getLayer('verifySomePhoneSingSMS');
				var $error = $('div.red:first, .js-error', layer.$div);
				var text = '';
				if (t.ajaxResult) {
					text = t.ajaxResult.text;
				}
				$error.html(text).show();
			},

			_verifyComplete: function(result) {
				var t = this;
				t.ajaxResult = null;

				if (result.isOK()) {
					t.ajaxResult = result.getData();
				}

				if (t.ajaxResult) {
					if (t.ajaxResult.error_type) {
						t._verifyError();
					} else {
						t._verifySuccess();
					}
				} else {
					t._verifyError();
				}
			},

			_verifyError: function() {
				var t = this;
				var $c = t._getLayer('singSMS').$div;
				var $error = $('div.red:first, .js-error', $c);
				var text = '';
				if (t.ajaxResult) {
					text = t.ajaxResult.text;
				}
				$error.html(text).show();
			},

			_verifySuccess: function() {
				var t = this;
				t.triggerHandler('verifySuccess', [t.ajaxResult, t.data]);
			},

			_verifySomePhoneComplete: function (result) {
				var t = this;
				t.ajaxResult = null;

				if (result.isOK()) {
					t.ajaxResult = result.getData();
				}

				if (t.ajaxResult) {
					if (t.ajaxResult.error_type === 2) {
						t._checkError();
					} else {
						t._verifySomePhoneSuccess();
					}
				} else {
					t._checkError();
				}
			},

			_checkComplete: function(result)
			{
				var t = this;
				t.ajaxResult = null;

				if (result.isOK()) {
					t.ajaxResult = result.getData();
				}

				if (t.ajaxResult) {
					if (t.ajaxResult.verified) {
						t._verifySuccess();
					} else if (t.ajaxResult.error_type === 2) {
						t._checkError();
					} else {
						t._addPhoneSuccess();
					}
				} else {
					t._checkError();
				}
			},

			_checkError: function() {
				var t = this;
				var $c = t._getLayer('check').$div;
				var $load = $('div.loadProgress:first', $c);
				var $error = $('div.red:first, .js-error', $c);
				var $controls = $('div.controls:first', $c);
				var text = Lang.get('verify_phone_error');
				if (t.ajaxResult) {
					text = t.ajaxResult.text;
				}
				$load.hide();
				$error.html(text).show();
				$controls.show();
			}
		});

	})(jQuery);

	jsLoader.loaded('{mailru}mailru.PhoneManager', 1);

// data/ru/images/js/ru/mailru.PhoneManager.js end

// data/ru/images/js/ru/ui/mailru.ui.SearchSuggest.js start

/**
 * WARNING: this file use ajs.min.js
 */

// data/ru/images/js/ru/utils/mailru.Utils.Search.js start


var _cache = {
		delim: {},
		highlightReplace: {}
	};

	var _addParts = function(tokens, token, delim) {
		if (token.indexOf(delim) > -1) {
			if (_cache.delim[delim] === undefined) {
				_cache.delim[delim] = new RegExp(delim.replace(/\./g, '\\.') + '+');
			}

			var parts = token.split(_cache.delim[delim]);

			for (var i=0, l=parts.length; i<l; i++) {
				if(parts[i]) {
					tokens.push(parts[i]);
				}
			}
		}
	};

	function regExpEscape(str) {
		return str.replace(/[\\"\?\(\)\|!#\$%\^\*\+\-\[\]\.]/g, '\\$&');
	}

	var Search = mailru.Utils.Search = {
		queryToTokens: function(str, noNeedToEscape) {
			str = $.trim(str);

			if(!noNeedToEscape)str = regExpEscape(str);

			str = str.toLowerCase();

			var tokens = str.split(/[\s]+/), token;

			for(var i=0, l = tokens.length; i<l; i++) {
				token = tokens[i];

				if ( noNeedToEscape || token != "\\" ) {
					_addParts(tokens, token, noNeedToEscape ? '.' : '\\.');

					_addParts(tokens, token, '@');
				}
			}

			return tokens;
		},

		highlightReplace: function(filter, wrapperStart, wrapperEnd) {
			wrapperStart = wrapperStart || '<b>';
			wrapperEnd   = wrapperEnd   || '</b>';

			var cacheKey = filter + '|' + wrapperStart + '|' + wrapperEnd
				, choises
				, tokens
				, match
				, replace
				, filterObject
			;

			if( !_cache.highlightReplace[cacheKey] ) {
				choises = [];
				tokens = Search.queryToTokens(filter, true);

				Array.forEach(tokens, function(token) {
					choises.push(regExpEscape(token));
					choises.push(regExpEscape(mailru.Utils.punto(token)));

					// mailru.Utils.translit return multiply variants as Array.<Array.<string>|string> (with true as a second parameter)
					// For example for input = "unit" it can return "юнит", "унит"
					var translit = mailru.Utils.translit(token, true)
						, i
						, len
						, part
						, value
					;

					value = "";
					for( i = 0 , len = translit.length ; i < len ; i++ ) {
						part = translit[i];
						if( typeof part === "string" ) {
							value += regExpEscape(part);
						}
						else {//part MUST be Array
							value += "(?:" + Array.map(part, regExpEscape).join("|") + ")";
						}

					}

					choises.push(value);
				});

				filterObject = {};
				choises = Array.filter(choises, function(str) {
					var result = str && str.length && (filterObject[str] === void 0);

					if( result ) {
						filterObject[str] = null;
					}

					return result;
				});
				filterObject = null;

				// сначала пытаемся подсветить более длинный вариант
				choises.sort(function(a, b) {
					return a.length == b.length ? 0 :(a.length > b.length ? -1 : 1);
				});

				if( choises.length ) {
					match = new RegExp("(^|\\s|@|\\.)(" + ajs.HTML.escape(choises.join('|')) + ")", "gi");
					replace = '$1' + wrapperStart + '$2' + wrapperEnd;

					_cache.highlightReplace[cacheKey] = function(text) {
						return ajs.HTML.escape(text)
							.replace(/\\s/g, '&#32;')//TODO:: remove it if it not necessary
							.replace(match, replace)
						;
					};

				} else {
					_cache.highlightReplace[cacheKey] = function(text) {
						return text;
					}
				}
			}

			return _cache.highlightReplace[cacheKey];
		}
	};

	jsLoader.loaded('{mailru.utils}mailru.Utils.Search', 1);

// data/ru/images/js/ru/utils/mailru.Utils.Search.js end

var
		/** @const */
			RE_EMAIL = /([\w.а-яё\-+]+)@([\w.а-яё\-]+)\.[\wа-яё]+/
		/** @const */
		, RE_NAME_AND_EMAIL_IN_LTGT = new RegExp("[\"']?(.*?)[\"']?\\s+(?:<|&lt;)(" + RE_EMAIL.source + ")(?:>|&gt;)")
		/** @const */
		, RE_REGEXP_ESCAPE = /([.?*+^$[\]\\(){}|-])/g
		/** @const */
		, INPUT_EVENT_NAME = "oninput" in document ? "input" : "keyup"

		, OPERANDS_SEARCH_TYPES_MAP = {
			q_from: 1
			, q_to: 2
			, q_subj: 4
			, q_query: 8
		}

		, _HTML_escape_ = ajs.HTML.escape
	;

	OPERANDS_SEARCH_TYPES_MAP.ALL = OPERANDS_SEARCH_TYPES_MAP.q_from | OPERANDS_SEARCH_TYPES_MAP.q_to | OPERANDS_SEARCH_TYPES_MAP.q_subj | OPERANDS_SEARCH_TYPES_MAP.q_query;
	OPERANDS_SEARCH_TYPES_MAP.PEOPLE = OPERANDS_SEARCH_TYPES_MAP.q_from | OPERANDS_SEARCH_TYPES_MAP.q_to;
	OPERANDS_SEARCH_TYPES_MAP.TEXT = OPERANDS_SEARCH_TYPES_MAP.q_subj | OPERANDS_SEARCH_TYPES_MAP.q_query;

	(function ($){
		/**
		 * @class   mailru.ui.SearchSuggest
		 */
		mailru.ui.SearchSuggest = function (selector, opts){
			this._onPrint	= this._onPrint.bind(this);
			this._onSelect	= this._onSelect.bind(this);

			if(!mailru.isAddressbookPage()) {
				this._getData = this._getData.bind(this);
				this._request = this._request.bind(this);
			} else {
				this._request = function(val, fn) { fn([]); }
				this._getData = function(a) { return a; }
			}

			this._logUnlock	= function (){ this._logLock = 0; }.bind(this);

			this._go2Advanced	= this._go2Advanced.bind(this);
			this._advancedHide	= this._advanced.bind(this, false);
			this._onhashchange	= this._onhashchange.bind(this);

			Object.extend(opts.suggest, {
				  getData:    this._getData
				, request:    this._request
				, minLength:  2

				, onprint:    this._onPrint
				, onexpand:   function (state){
					this._onPrint();
					if( !state ) this._startTS = 0;
				}.bind(this)

				, multiSuggests: false
			});

			this.Search = ajs.ui.search(selector, opts);

			this.$Search = $("#portal-menu__search__form");

			if( mailru.isFileSearchPage() ) {//MAIL-12604 == MAIL-12235 5)
				this.disable();
			}
			else {
				this.enable();

				if(this.Search.$Operands) {
					Object.forEach(ajs.toObject(jsHistory.get()), function (val, name){
						if(val) {
							val = val.replace(/\+/g, " ");
							this.Search.$Operands.setOperandValue(name, val);
						}
					}, this);
				}
			}

            if(this.Search.$Operands) {// MAIL-8611

				//MAIL-12716
				this.Search.$Operands.addTrigger("operands:activeInputChange", function(e) {
					if( this.__doNotCountingOperandShow ) {
						this.__doNotCountingOperandShow = false;
						return;
					}

					var oldInput = e.oldInput
						, oldInputIsOperand
						, newInputIsOperand = e.isOperandInput
					;

					if( "length" in oldInput )oldInput = oldInput[0];

					if( !oldInput.getAttribute )return;

					oldInputIsOperand = !!oldInput.getAttribute("data-operand")

					if( !oldInputIsOperand && newInputIsOperand ) {
						Counter.d(1406752);//Показ операнда
					}
					else if( oldInput && oldInputIsOperand && newInputIsOperand ) {
						setTimeout(function() {
							if( !this.getAttribute("data-next-operand") && !this.getAttribute("data-next-operand") ) {
								//Старый операнд скрыт
								Counter.d(1406760);//Переключение операндов
							}
						}.bind(oldInput));
					}
					e = oldInput = null;
				}.bind(this));

				// MAIL-15168
				var RE_EMAIL_AND_SPACE_AND_SYMBOL = new RegExp(RE_EMAIL.source + "\\s.");
				this.Search.$Operands.addTrigger("operands:find", function(e) {
					var currentOperand = e["currentOperand"]
						, inputValue
						, spaceIndex
						, caret
					;

					if( (currentOperand === "q_from" || currentOperand === "q_to")
						&& (inputValue = e["inputValue"])
						&& (spaceIndex = inputValue.lastIndexOf(" ")) !== -1
						&& RE_EMAIL_AND_SPACE_AND_SYMBOL.test(inputValue)// correct email address + ' ' + any symbols
					) {
						caret = ajs.$.getCaretPosition(e["input"], true);
						inputValue = e["inputValue"];

						if( caret
							&& caret["start"] === caret["end"]
							&& caret["end"] >= inputValue.length - 1
						) {
							e["newOperand"] = "q_query";
							e["lastPrefixIndex"] = spaceIndex;
						}
					}
				});

				this.$Search.submit(function (){
					var operandInput;

					(operandInput = this.Search) && (operandInput = operandInput.$Operands) && (operandInput = operandInput.$Input);

					if( (operandInput = operandInput[0]) && operandInput.getAttribute("data-operand") && operandInput.style.display != "none" ) {
						Counter.sb(1406761);//Поиск по операндам
					}
				}.bind(this));

				if( this.Search.Suggest ) {
					// MAIL-12235 1) 2)
					this.__cache = {};//Организуем собственный кеш
					this.Search.Suggest
						.addTrigger("suggests:find suggests:rebuild", function(e) {
							var ajsSuggest = e.currentTarget
								, data = e.data
								, inputName = ajsSuggest.$Input.attr("name") + "|" + (ajsSuggest.$Input.attr("data-operand") || "")
								, localCache
								, suggestValue = e.suggestValue || e.val || e.suggest // TODO:: e.suggestValue only
							;

							if( !(localCache = this.__cache[inputName]) ) {
								localCache = this.__cache[inputName] = {};
							}

							if( e.type == "suggests:rebuild" && (!data.__inputName || data.__inputName == inputName) ) {
								localCache[suggestValue] = data;
								data.__inputName = inputName;//Привязываем массив-кеш к определённому inputName
							}
							else {
								e.data = localCache[suggestValue];
								ajsSuggest.reset();
							}
						}.bind(this))
					;
				}

				this._operandLinkedInputChange = function(evt) {
					var advancedSearchInput = evt.target
						, inputNodeName = advancedSearchInput.nodeName.toUpperCase()
						, operandName
						, operand
						, targetValue
						, oldTargetValue
					;

					if("value" in advancedSearchInput && (inputNodeName == "INPUT" || inputNodeName == "TEXTAREA")) {
						targetValue = advancedSearchInput.value;
						operandName = advancedSearchInput.name;
						oldTargetValue = advancedSearchInput.__oldValue;
						if(operandName && oldTargetValue != targetValue) {
							advancedSearchInput.__oldValue = targetValue;
							operand = this.operands && this.operands[operandName];

							if(!operand && !targetValue)return;

							this.setOperandValue(operandName, advancedSearchInput.value);
							if(!operand && !(operand = this.operands && this.operands[operandName]))return;

							if( operand.$Input[0] && operand.$Input[0].scrollIntoView ) {
								operand.$Input[0].scrollIntoView(false);
							}

							if( !operand["isOnInputBind"] ) {
								operand["isOnInputBind"] = true;

								$(operand.$Input[0]).bind(INPUT_EVENT_NAME, function(evt) {
									var target = evt.target
										, value = target.value
									;

									advancedSearchInput.value = value;
								});
							}
						}
					}
				}.bind(this.Search.$Operands)
            }

			if(this.Search.Suggest) {
				this.Search.Suggest
					.addTrigger("suggests:rebuild", function(e) {
						var data = e["details"] || e["data"];
						if(data && data.length == 1 && (data[0] + "") == e["val"]) {
							e["showInternet"] = e["showList"] = false;
						}
					})
					.addTrigger("suggests:select", this._onSelect)
				;
				this.Search.Suggest
					.addTrigger("suggests:find", function(e) {// MAIL-13870
						if( this.__suggestSelected && (!e.originalEvent || e.originalEvent.type != "focus") && e.val ) {
							this.$FromSuggestsInput.val("0");
							this.__suggestSelected = !e.val;
						}
					}.bind(this))
				;

				if(opts.suggest && opts.suggest.controlHeight) {
					this.Search.Suggest.addTrigger("suggests:show suggests:afterRebuild suggests:rebuild:after", this.setSuggestNodesVisibility.bind(this));
				}
			}

			this.Search.$Input.closest('form').bind('submit', function (){
				this._autoLogMe(true);
			}.bind(this));

			$(window)
				.bind('hashchange', this._advancedHide)
				.bind('abjs:updated', this.reset.bind(this))
			;

			if(opts.clearSearchResultBasedOnHash) {//MAIL-10709
				$(window).bind('hashchange', this._onhashchange);
			}

			$(function (){
				this.$AdvansedSearchLink =
					$('#search-result-advanced-link')
					.add(this.Search.$Elm.find('.js-section-link'))
					.bind('click', this._advanced.bind(this, null))
				;

				if( mailru.isFileSearchPage() ) {//MAIL-12235 5)
					this.disable();
				}
				else {
					this.enable();
				}
			}.bind(this));


			// MAIL-13870
			// Создаём скрытый инпут в который записываем, из саджеста ли выбранного мы производим поиск
			this.$FromSuggestsInput = $("<input type=hidden name=from_suggest value=0 />");
			this.$FromSuggestsInput.appendTo(this.$Search);
		};

		// MAIL-8308 <
		function regexpEscape(str) {
			return String(str || "").replace(RE_REGEXP_ESCAPE, "\\$1");
		}
		function GroupedSuggestItem(config, text, find, search, category, categoryIndex){
			this.config = config;

			this.category = category;
			this.categoryIndex = categoryIndex;
			this.html = text;
			this.search = search || text;

			this.find = regexpEscape(find);
		}
		GroupedSuggestItem.prototype.toString = function() {
			return  "" +
				(this.category && this.categoryIndex === 0 ?
					'<div class="' + this.config.cdGroupHeader + '">' +
						this.category +
					'</div>'
					: "") +
				this.html
			;
		};
		// > MAIL-8308

		mailru.ui.SearchSuggest.prototype = {
			constructor: mailru.ui.SearchSuggest,
			_onhashchange: function() {//MAIL-10709
				if( mailru.isFileSearchPage() || mailru.isMRIMPage() ) {//MAIL-12235 5)
					this.disable();
				}
				else { // MAIL-12604
					this.enable();

					var $Search = this.$Search;
					if(!$Search)$Search = this.$Search = $('#portal-menu__search__form');

					var layer_form = $Search[0]
						, layer_form_elements = layer_form.elements || []
						, hashParams = ajs.toObject(jsHistory.get())
						, operands = this.Search.$Operands && this.Search.$Operands.operands
						, operandKeys = (operands && Object.keys(operands)) || []
					;

					if(layer_form) {
						Array.forEach(layer_form_elements, function(el) {
							var elNN = el && el.nodeName
								, elType = el && (el.type + "").toUpperCase()
							;
							if(el.name && (elNN == "INPUT" && (elType == "TEXT" || elType === "") || elNN == "TEXTAREA")) {
								el.value = "";
							}
						});
					}

					Object.forEach(hashParams, function (val, name) {
						var target = layer_form_elements[name]
							, i
						;

						val = val ? val.replace(/\+/g, " ") : val;

						if(target) {
							target.value = val;
						}

						if(operandKeys.length && name in operands) {
							this.Search.$Operands.setOperandValue(name, val);

							i = Array.indexOf(operandKeys, name);

							if(i >= 0) {
								operandKeys.splice(i, 1);
							}
						}
					}, this);

					if(operandKeys.length) {
						Array.forEach(operandKeys, function(name) {
							try {//Remove try/catch after HOME-1353
								this.Search.$Operands.setOperandValue(name, this.Search.$Operands.getOperandValue(name) || "");
							}
							catch(e) {

							}
						}, this);
					}

					if( (layer_form = this.Search) && ("_placeholderCheck" in layer_form) ) {//MAIL-12604
						// Нужно проэмулировать placeholder, если поле ввода пустое
						layer_form._placeholderCheck();
					}
				}
			},

			_advanced: function (expand, evt){
				var self = this
					, $Layer = this.$Layer
				;
				if(!$Layer)$Layer = this.$Layer = $('#popup_advanced-search');

				if( expand == null ){
					expand	= !$Layer.is(':visible');
				}
				else if( !expand && evt.type != 'hashchange' ){
					if( !$(evt.currentTarget).is('.js-close') && $Layer.has(evt.target)[0] ){
						return;
					}
				}

				if( expand && !$Layer.data('inited') ){
					ajs.require('{jQuery}'+'jquery.mrcalendar', function (){
						$Layer
							.data('inited', true)
							.find('.form__select')
								.form__select()
								.end()
							.find('.js-date-from-calendar')
								.mrcalendar({
									toggle: '.js-date-from',
									linkoff: true,
									onclick: function(data, evt) {
										evt.preventDefault();
										$Layer.find('.js-date-from').val(data[2] + '.' + data[1] + '.' + data[0]);
									}
								});
							$('.js-calendar-link', $Layer)
								.click(function(evt) {
									$(this).siblings('input').focus();
									return false;
								});
					});


					var ajsSuggestsEvents = {// MAIL-13870
						events: {
							"suggests:select": function() {
								self.__suggestSelected = true;
							}
							, "suggests:find": function(e) {
								self.__suggestSelected = !e.val;
							}
						}
					};


					ajs.require('{jQuery}'+'expandField' + ( mailru.CanUseNewAddressbookSuggests ? ",{jQuery}addressbookSuggest" : "" ), function() {
						$('.js-ac-addressbook', $Layer).expandField({ parent: 'body' });
						if(mailru.CanUseNewAddressbookSuggests) {
							$('.js-ac-addressbook', $Layer).addressbookSuggest(Object.extend({
								onlyEmailAfterSelect: true
								, deleteLastComma: true
								, multiSuggests: false
								, updateOnMark: true
								, autoMarked: -1
							}, ajsSuggestsEvents));
						} else {
							$('.js-ac-addressbook', $Layer).bind('focus keyup', function _fn(){
								mailru.Utils.getAddressBook();
								$(this).unbind('focus keyup', _fn);
							})
							.each(function(){
								$.Autocompleter.addressbook(this, true);
							});
						}
					});

					ajs.require('{mailru.ui}'+'mailru.ui.SearchSuggest', function (){
						var opts = Object.extend({
							cnBlur: 'portal-menu__search_blur'
							, hideEmailList: true
							, autoTabIndex: false
							, suggest: {
								cnItem:       'portal-menu__search__suggest__item'
								, cnSelected:   'portal-menu__search__suggest__item_selected'
								, cnList: 'portal-menu__search__suggest__inner'
								, cnInternetCont: 'js-suggest-internet-cont'
								, cnInternet: 'portal-menu__search__suggest__item_internet-link'
								, template:     function (val, item){
									var text = (item instanceof Object && (item["word"] || item["text"]) || item || "") + "";
									val = _HTML_escape_(text).replace(new RegExp(val, 'i'), '<b>$&</b>');
									return '<div data-suggest=\'' + text + '\' class="' + this.opts.cnItem+'">'+val+'</div>';
								}
								, searchUrl:    'http://go.mail.ru/search?fr=mailsearch&q=#query#'
								, ajaxUrl:      '/cgi-bin/gosearch_ajax?ajax_call=1&func_name=ajax_suggest&data=["#query#"]'
								, autosubmit:   false
								, showInternet:	false
							}
						}, ajsSuggestsEvents);
						new mailru.ui.SearchSuggest('#adv-search-theme-name', opts);
						new mailru.ui.SearchSuggest('#adv-search-word-contain', opts);
					});

					ajsSuggestsEvents = null;

                    // MAIL-8611
                    if(this.Search.$Operands && !this.Search.$Operands["doOnce_pas_oprds"]) {
                        this.Search.$Operands["doOnce_pas_oprds"] = true;

                        $("#popup_advanced-search").find("form").bind(INPUT_EVENT_NAME + " change", this._operandLinkedInputChange)
                    }
				}

				if( expand ){
					// MAIL-9462 comment#3 2) START
					if(!$Layer.data("already_set_onsubmit")) {
						$Layer.data("already_set_onsubmit", true);
						$(this.$Search).bind("submit", function(evt) {
							var layer_form;
							if(evt.isDefaultPrevented()) {
								layer_form = ($Layer.find("form") || [])[0];
								if(layer_form)layer_form.reset();
							}
						});
					}
					// MAIL-9462 comment#3 2) END

                    if(this.Search.$Operands) {// MAIL-8611
                        Array.forEach(Object.keys(this.Search.$Operands.operands), function(name) {
                            $Layer.find('[name="'+name+'"]').val(this.Search.$Operands.getOperandValue(name)).trigger('change');
                        }, this);
                    }
                    else {
						Object.forEach(ajs.toObject(jsHistory.get()), function (val, name){
							$Layer.find('[name="'+name+'"]').val(val).trigger('change');
						});
                    }
				}

				$Layer
					.display(expand)
					[expand ? 'delegate' : 'undelegate']('.js-close', 'click', this._advancedHide)
					.find('form')
						[expand ? 'bind' : 'unbind']('submit', this._go2Advanced)
						[expand ? 'find' : 'F']('input[autofocus=true],textarea[autofocus=true]').focus()
				;

				(function (){
					$(document)[expand ? 'bind' : 'unbind']('click', this._advancedHide);
				}.gap(this))();

				if( evt ) evt.preventDefault();
			},

			_go2Advanced: function (evt){
				/** @namespace data.q_date */
				/** @namespace data.q_date_lapse */
				var
					  data	= $(evt.target).toObject()
					, lapse	= Math.max(~~data.q_date_lapse, 0) * jsCookie.DAY * 1000
					, time	= (new Date((data.q_date+'').replace(/(\d+)\.(\d+)\.(\d+)/, '$3/$2/$1'))).getTime()
					, bdate	= new Date(time - lapse)
					, edate	= new Date(time + lapse)
					, tmp
				;

				if( time ){
					data.ddb = bdate.getDate();
					data.dmb = bdate.getMonth() + 1;
					data.dyb = bdate.getFullYear();
					data.dde = edate.getDate();
					data.dme = edate.getMonth() + 1;
					data.dye = edate.getFullYear();
				}

				this._advancedHide(evt);

				// MAIL-13992 START
				if( (tmp = data["q_from"])
					&& (tmp = (tmp + "").trim()).charAt(tmp.length - 1) == ","
				) {
					data["q_from"] = tmp.substr(0, tmp.length - 1);
				}
				if( (tmp = data["q_to"])
					&& (tmp = (tmp + "").trim()).charAt(tmp.length - 1) == ","
					) {
					data["q_to"] = tmp.substr(0, tmp.length - 1);
				}
				// MAIL-13992 END

				data.from_search = mailru.isSearchPage() ? 1 : 0;// MAIL-13870

				jsHistory.set(mailru.getPageURL('gosearch')+'?'+ajs.toQuery(data));

				evt.preventDefault();
			},

			_onPrint: function (){
				this.__value = this.val();

				clearTimeout(this._autoLog_pid);
				if( !this._startTS ){
					this._startTS = ajs.now();
				}
			},

			_onSelect: function (evt) {
				var searchName
					, form
					, item
					, onSubmitCheck
					, originalInputValue
					, suggestObject = evt.target
				;

				// MAIL-13870
				this.__suggestSelected = true;
				this.$FromSuggestsInput.val("1");


				setTimeout(function() {
					jQuery(this.$Input[0]).change();
				}.bind(suggestObject));

				clearTimeout(this._autoLog_pid);
				this._logMe(evt.newSuggest, evt.newSuggestIndex);

				//MAIL-9462
				// internal evt.target["_select"] method triggered only for keyboard events
				/*if(evt.event && evt.target["_select"] && evt.target.getAttribute("data-suggest") != null) {
					evt.target.$Input[0].value = evt.target.getAttribute("data-suggest");
				}*/

				if( !this.Search.$Operands
					//&& evt["submitForm"] Такая проверка аффектит другим багом https://jira.mail.ru/browse/MAIL-11813
				) {
					// MAIL-8960, MAIL-9293 and MAIL-9306 <
					//MAIL-9293
					searchName = $(evt.newSuggestNode).data("search-name");
					if(searchName) {
						suggestObject["__original$InputName"] = suggestObject.$Input[0].name;
						suggestObject.$Input[0].name = searchName;
					}
					else {
						// Revert the original changed values
						// MAIL-9293
						if(suggestObject["__original$InputName"])suggestObject.$Input[0].name = suggestObject["__original$InputName"];
						suggestObject["__original$InputName"] = void 0;
					}

					//MAIL-9306
					originalInputValue = suggestObject.$Input[0].value;
					item = evt.newSuggestData || originalInputValue;

					//suggestObject.$Input[0].value = (typeof item == "object" && item.suggest || item) + "";
					//suggestObject.val(typeof item == "object" && item.suggest || item) + "";

					if(typeof item == "object" && item.search) {
						suggestObject["__original$InputValue"] = originalInputValue;
						evt["newSuggest"] = item.search;
					}
					else if(suggestObject["__original$InputValue"]) {
						evt["newSuggest"] = suggestObject["__original$InputValue"];
						delete suggestObject["__original$InputValue"];
					}

					form = suggestObject.$Elm.find("form");

					if(form && form.length) {
						if(!(onSubmitCheck = suggestObject["__isOnSubmitCheck"])) {
							onSubmitCheck = suggestObject["__isOnSubmitCheck"] = function(evt) {
								var tmp;
								if(evt.isDefaultPrevented()) {
									// Revert the original changed values
									// MAIL-9293
									if(tmp = this["__original$InputName"]) {
										this.$Input[0].name = tmp;
										this["__original$InputName"] = void 0;
									}
									// Revert the original input.value
									// MAIL-9306
									if(tmp = this["__original$InputValue"]) {
										this.$Input[0].value = tmp;
										this["__original$InputValue"] = void 0;
									}
								}
							}.bind(suggestObject);

							$(form).bind("submit", onSubmitCheck);
						}
					}
					else if(suggestObject["__original$InputName"]) {
						suggestObject.$Input[0].name = suggestObject["__original$InputName"];
						form = suggestObject.$Elm.find("form");
						if(form && suggestObject["__isOnSubmitCheck"]) {
							$(form).unbind("submit", suggestObject["__isOnSubmitCheck"]);
						}
					}
					// > MAIL-8960, MAIL-9293 and MAIL-9306
				}
			},


			_logMe: function (val, idx, useEnter){
				if( !this._logLock && this._startTS ){
					this._logLock = 1;

					var Suggest = this.Search.getSuggest(), _val = this.__value;

					mailru.Utils.suggestLog('search', {
						  start_ts:	this._startTS
						, sel_ts:	this._selTS
						, val:		_val
						, sel:		val
						, data:		Suggest._cache[_val] || []
						, idx:		idx
						, enter:	useEnter
						, abjs:		$.isArray(mailru.abjsData) ? mailru.abjsData.length : 0
					});

					this._selTS = this._startTS = 0;
					setTimeout(this._logUnlock, 100);
				}
			},

			_autoLogMe: function (useEnter){
				this._logMe('', -1, useEnter);
			},

			_request: function (url, fn){
				if( !mailru.abjsData ){
					var _fn = function (){
						var args = arguments;
						ajs.wait('abjs:complete', function (){ fn.apply(this, args); });
					};
					mailru.Utils.getAddressBook();
					$.get(url, _fn, 'json');
				} else {
					$.get(url, fn, 'json');
				}
			},

			/**
			 * @this {mailru.ui.SearchSuggest}
			 * */
			setSuggestNodesVisibility: function(evt) {
				var Suggest = this.Search && this.Search.Suggest;
				if( !Suggest ) {
					return;
				}

				var suggestNodes = Suggest.__ListItems // TODO:: replace __ListItems with public property
					, node
					, node_height
					, i = 0
					, l
					, k
					, halfWindowHeight
					, suggestNodes_height
					, suggestGroups = {}
					, suggestGroupsKeys = []
					, suggestGroup
				;

				function getHeight( node ) {
					var result = 0;
					if( node ) {
						result = node.getBoundingClientRect().height;
					}
					return result;
				}

				if(
					!Suggest.isExpanded() // suggests is hidden
					|| evt && (!evt["showContainer"] || !evt["showList"]) // suggests is hidden
					|| !suggestNodes // no suggests nodes
					|| !(suggestNodes_height = getHeight(Suggest.$List[0]) + getHeight(Suggest.$InternetCont[0])) // height is 0. Suggests is hidden?
				) {
					return;
				}

				halfWindowHeight = Math.floor( $(window).height() / 2 );

				while( node = suggestNodes[i++] ) { // fill the groups arrays
					suggestGroup = node.getAttribute("data-search-name") || "";
					if( !suggestGroups[suggestGroup] ) {
						suggestGroups[suggestGroup] = [];
						suggestGroupsKeys.push(suggestGroup);
					}
					suggestGroups[suggestGroup].push(node);

					if( node.style.display == "none" ) { // add node height to container height, if node is hidden
						suggestNodes_height += (node.__clientHeight || 0);
					}
				}

				i = l = suggestGroupsKeys.length;
				k = suggestNodes.length;

				while( k-- > 0 ) { // compute nodes visibility. We leave last node (at index 0) visible
					if( --i < 0 ) { // iterate through each group one by one
						i = l - 1;
					}

					suggestGroup = suggestGroups[ suggestGroupsKeys[i] ];
					node = suggestGroup.pop();

					if( !suggestGroup.length // leave at least one node in each group visible
						)continue;

					node_height = node.__clientHeight;
					if( node_height == void 0 ) { // First time. Node must not been hidden
						node.__clientHeight = node_height = node.clientHeight;
					}

					node.style.display = suggestNodes_height > halfWindowHeight ? "none" : "";

					suggestNodes_height -= node_height;
				}
			},

			_getData: function (res, val, _event) {
				if(res && Array.isArray(res) && res.length == 3 && (typeof res[0] + typeof res[1] + typeof res[2]) == "stringstringobject") {
					if(res[2] && res[2].response !== void 0) {
						res = res[2].response;
					}
					else if(res[0] && res[0].response !== void 0) {
						res = res[0].response;
					}
					else {
						res = null;
					}
				}

				res = res || [];
				val = val || val.suggestValue || this.Search.Suggest.val();

				var suggestOptions = this.Search.opts.suggest
					, suggestsMaxCount = 8
					, suggestsCount = 0
					, hideEmailList = this.Search.opts.hideEmailList
					, searchRegexp = $.Autocompleter.CreateFindRegExp(val)
					, emails = !hideEmailList && mailru.abjsData || []
					, findVal_replaceString_start
					, findVal_replaceString_end
					, createTick
					, groupsTitles = suggestOptions.groupsTitles || {}
					, searchType
					, needGroupHeader
				;

				if( (searchType = _event && _event.currentTarget) && (searchType = searchType.$Input) && (searchType = searchType.attr("data-operand")) ) {
					searchType = OPERANDS_SEARCH_TYPES_MAP[searchType] || OPERANDS_SEARCH_TYPES_MAP.ALL;
				}
				else {
					searchType = OPERANDS_SEARCH_TYPES_MAP.ALL;
				}

				emails = searchType & OPERANDS_SEARCH_TYPES_MAP.PEOPLE ?
					Array.filter(emails, function (email) {
						return (suggestsCount < suggestsMaxCount) && $.Autocompleter.MatchSubsetByRegExp(email, searchRegexp) && ++suggestsCount && !hideEmailList;
					})
					:
					[]
				;

				if( !(searchType & OPERANDS_SEARCH_TYPES_MAP.TEXT) ) {
					res = [];
				}

				suggestsCount = 0;

				if(!suggestOptions.grouping) {
					res = emails.concat(
						Array.map(res, function (item) {
							return _HTML_escape_(item.word || item.text || item + "");
						})
					);
				}
				else {
					findVal_replaceString_start = '<b class="' + (suggestOptions.cnItemTick || "") + '">';
					findVal_replaceString_end = "</b>";
					createTick = mailru.Utils.Search.highlightReplace(_HTML_escape_(val), findVal_replaceString_start, findVal_replaceString_end);
					needGroupHeader = searchType & (searchType - 1) || (searchType == OPERANDS_SEARCH_TYPES_MAP.PEOPLE);

					res = Array.map(res, function(_item, i) {
						if(++suggestsCount > suggestsMaxCount)return;

						var str = _item["word"] || _item["text"]
							, item = new GroupedSuggestItem(
								suggestOptions
								, str
								, val
								, null
								, needGroupHeader && groupsTitles["inLetter"] || ""
								, i
							)
						;

						item.html =
							'<div data-search-name="q_query" data-suggest="' + str + '" class="' + suggestOptions.cnItem + '">' +
								createTick(str) +
							'</div>'
						;

						return item;
					}, this);

					res = Array.filter(res, function(a) {
						return !!a;
					});

					emails = Array.map(emails, function (str, i) {
						var nameAndEmail_parts = str.match(RE_NAME_AND_EMAIL_IN_LTGT)
							, avatar = nameAndEmail_parts && mailru.Utils.getAvatarSrc(nameAndEmail_parts[2], nameAndEmail_parts[1], 32, null)
							, item = new GroupedSuggestItem(
								suggestOptions
								, str
								, val
								, nameAndEmail_parts && (suggestOptions.searchPeopleOnlyForEmail ? nameAndEmail_parts[2] : (nameAndEmail_parts[1] + " <" + nameAndEmail_parts[2] + ">"))
								, needGroupHeader && groupsTitles["peoples"]
								, i
							)
							, suggest
						;

						str = _HTML_escape_(str);
						if( suggestOptions.searchPeopleOnlyForEmail ) {
							suggest = _HTML_escape_(nameAndEmail_parts && nameAndEmail_parts[2]) || str;
						}
						else {
							suggest = str;
						}


						item.html =
							'<div style="position:relative;" data-search-name="q_from" data-suggest="' + suggest + '" class="' + suggestOptions.cnItem + ' ' + suggestOptions.cnItem + '_people">' +
								(
									nameAndEmail_parts ?
										createTick(nameAndEmail_parts[1]) +
											" <span class='" + suggestOptions.cdSuggestHint + "'>" +
												createTick(nameAndEmail_parts[2]) +
											"</span>"
										:
										createTick(str)
								) +
								(avatar ?
									"<img alt='' class=\"" + suggestOptions.cnItem + "_people__image\" style='float:right;position:absolute;right:8px;top:5px;' width=30 height=30 src='" + avatar + "' />"
									:
									""
								) +
							'</div>'
						;

						return item;
					}, this);

					if(emails && emails[0] && needGroupHeader) {
						emails[0].category = groupsTitles["peoples"] || "";
						if(res.length)res[0].category = groupsTitles["inLetter"] || "";
					}

					res = emails.concat(res);
				}

				if( res.length == 1 && res[0] ) {
					if( (	// MAIL-13891:2)
							typeof res[0] == "object"
							&& res[0].search == val
						)
						|| res[0] == val// MAIL-11648
					) {
						res = [];
					}
				}

				this._selTS = ajs.now();

				if( !res.length ){
					this._logMe('', -1);
				}
				else {
					clearTimeout(this._autoLog_pid);
					this._autoLog_pid = setTimeout(this._autoLogMe.bind(this), 15000);
				}

				searchRegexp = suggestOptions = emails = findVal_replaceString_start = findVal_replaceString_end = createTick = null;

				return res;
			},

			val: function (val){
				return	this.Search.getSuggest().val(val);
			},

			reset: function (){
				this.Search.getSuggest().reset();
			},

			disable: function () {//MAIL-12235 5)
				if( this.Search ) {
					this.Search.disable();
				}
				if( this.$AdvansedSearchLink ) {
					this.$AdvansedSearchLink.hide();
				}
			},

			enable: function () {//MAIL-12235 5)
				if( this.Search ) {
					this.Search.enable();
				}
				if( this.$AdvansedSearchLink ) {
					this.$AdvansedSearchLink.show();
				}
			}
		};

	})(jQuery);


	jsLoader.loaded('{mailru.ui}mailru.ui.SearchSuggest', 1);

// data/ru/images/js/ru/ui/mailru.ui.SearchSuggest.js end

// data/ru/images/js/ru/ui/mailru.ui.Suggest.js start


// data/ru/images/js/ru/utils/mailru.Utils.SearchIndex.js start


mailru.Utils.SearchIndex = function(tokenizer) {
		var cache = {};

		function normalize(str) {
			return $.trim(str).toLowerCase();
		}

		return {
			create: function(data) {
				cache = {};

				for(var i=0, l=data.length; i<l; i++) {
					var str = data[i];
					this.set([str], str);
				}
			},

			set: function(phrases, object) {
				var words = [];
				var phrase, tokens, token;

				for (var i=0, l = phrases.length; i<l; i++) {
					phrase = normalize(phrases[i]);

					if(phrase && phrase.length) {
						tokens = tokenizer(phrase);

						for(var j=0, k=tokens.length; j<k; j++) {
							token = tokens[j];

							words.push(
								token,
								mailru.Utils.punto(token),
								mailru.Utils.translit(token)
							);
						}
					}
				}

				var usedKeys = {}, word;

				for (var j = 0, k = words.length; j < k; j++) {
					word = words[j];

					if (!word) {
						continue;
					}

					for (var i = 0, l = word.length; i < l; i++) {
						var key = word.substr(0, i + 1);

						if (!usedKeys[key]) {
							usedKeys[key] = true;

							if (cache[key] === undefined) {
								cache[key] = [];
							}

							cache[key].push(object);
						}
					};
				}
			},

			find: function(query) {
				var results = [];

				Array.forEach(tokenizer(normalize(query)), function(token) {
					results.push(cache[token] || []);
				});

				// результатом поиска по нескольким словам является пересечение результатов поиска по отдельным словам
				return Array.intersect.apply(null, results);
			}
		}
	};

	jsLoader.loaded('{mailru.utils}mailru.Utils.SearchIndex', 1);

// data/ru/images/js/ru/utils/mailru.Utils.SearchIndex.js end

// ./data/common/js/ajs/ajs.Pager.js start

;define('ajs/ajs.Pager', function() {
	/**
	 * — list (array) список с данными, которые нужно разбить постранично
	 * — perPage (int) количество элементов на странице
	 * — page (int) текущая страница
	 * — singlePage (boolean) флаг, указывающий на то, что данные только загружаются "постранично", а отображаются на одной странице
	 *                        что влияет на поведение visible()
	 */

	var Pager = function(list, perPage, page, singlePage) {
		page = parseInt(page) || 1;
		var urlCreator = $.noop;

		function pageBorders() {
			return {
				from: (page - 1) * perPage,
				to: Math.min(page * perPage, list.length)
			};
		}

		function pagesCount() {
			return Math.ceil(list.length / perPage);
		}

		return {
			setUrlCreator: function(callback) {
				urlCreator = callback;
			},

			doesNeedWidget: function() {
				return !singlePage && pagesCount() > 1;
			},

			widgetParams: function() {
				var pages = pagesCount();
				var pList = [];

				var from = Math.max(page - (pages - page < 3 ? 5 - (pages - page) : 3), 0);
				var to = Math.min(from + 5, pages);

				for (var p = from + 1; p <= to; p++ ) {
					pList.push(p);
				}

				return {
					prevPage: (page > 1    ) ? page - 1 : null,
					nextPage: (page < pages) ? page + 1 : null,

					lastPage: pages,

					currentPage: page,

					doesNeed: {
						prevHellip: (page  > 4 && pages > 6),
						nextHellip: (pages > 6 && pages - page > 3),

						prevPage: (page > 1),
						nextPage: (page < pages),

						firstPage: (pages > 5 && page > 3),
						lastPage:  (pages > 5 && pages - page > 2)
					},

					getUrl: function(page) {
						return urlCreator(page);
					},

					pages: pList
				};
			},

			all: function() {
				return list;
			},

			total: function() {
				return list.length;
			},

			pageBorders: pageBorders,
			pagesCount: pagesCount,

			visible: function() {
				var borders = pageBorders();
				return list.slice(singlePage ? 0 : borders.from, borders.to);
			},

			slice: function() {
				var borders = pageBorders();
				return list.slice(borders.from, borders.to);
			},

			hasNext: function() {
				return page * perPage < list.length;
			},

			hasPrev: function() {
				return page > 1;
			},

			next: function() {
				page++;
			},

			prev: function() {
				page--;
			}
		};
	};

	// @export
	if (typeof module != 'undefined' && typeof module != 'function') { module.exports = Pager }
	else if (typeof define === 'function' && define.amd) { define(Pager) }

	if( !window.ajs ) window.ajs = {};
	window.ajs.Pager = Pager;
});


// ./data/common/js/ajs/ajs.Pager.js end

var defaultOpts = {
		cnSuggest:  'suggests__block',
		cnList:     'suggests__block__list',
		cnItem:     'suggests__block__item',
		cnSelected: 'suggests__block__item_hover',
		cnInput:    'suggests__input',

		internalSource: false,
		ignoreUsedData: false,

		templateInternetVal: function() {
			return false
		},

		searchIndexTokenizer: function(str) {
			return str.split(/\s+/);
		},


		afterSelect: function(val) {
			return val;
		},
		afterGetData: $.noop,
		filterUsed: function(data, usedMap) {
			var filteredData = [];

			for(var i=0, l=data.length; i<l; i++) {
				var row = data[i];

				if(usedMap[row] === undefined) {
					filteredData.push(row);
				}
			}

			return filteredData;
		},

		startFindSuggest: null,

		limit: 10,

		autoMarked: 0,

		updateOnMark: false
	};

	jsClass
		.create( 'mailru.ui.Suggest' )
		.methods({
			__construct: function(input, data, opts) {
				this.input = input;
				this.opts  = Object.extend({}, defaultOpts, opts);

				this.setData(data);
				this.ignoreUsed([]);

				this._initResultsList();
				this._initAjsSuggest();
			},

			_initResultsList: function() {
				var opts = this.opts;
				var inputName = this.input.attr('name') || this.input.attr('data-original-name') || "";
				this.block = $('<div style="display: none; position: absolute;" data-original-name="' + inputName  + '" class="' + opts.cnSuggest + '"></div>' );
				this.list = $('<div class="' + opts.cnList + '"></div>');
				this.block.append(this.list);

				// исправление проблемы с позиционированием
				this.block.appendTo($('#ScrollBodyInner')[0] || document.body);

				if( typeof opts.cnInput === 'string' ) {
					this.input.addClass( opts.cnInput );
				}
			},

			_initAjsSuggest: function() {
				var suggest = this
					, suggestOpts = this.opts
					, input   = this.input
					, block   = this.block
					, _fetch = suggestOpts.fetching
					, _events
				;

				if(suggestOpts.internalSource && !suggestOpts.request) {
					suggestOpts.request = function(url, fn, val) {
						fn();
					};
					suggestOpts.ajaxUrl = '#';
				}

				suggestOpts = Object.extend(suggestOpts, {
					  fetching: _fetch
					, expire: _fetch

					, cnSuggest: block[0]  // вместо имени класса передаем ссылку на блок
					, cnList: this.list[0] // вместо имени класса передаем ссылку на блок
				});


				this.ajsSuggest = ajs.ui.suggest(input.parent()[0], suggestOpts);

				if( Object.isObject(_events = suggestOpts["events"]) ) {
					Object.forEach(_events, function(eventHandler, eventName) {
						if( eventName.contains("suggests:") ) {// Другие компоненты пока не поддерживаются
							this.addTrigger(eventName, eventHandler);
						}
					}, this.ajsSuggest);

					delete suggestOpts["events"];
					_events = null;
				}

				this.ajsSuggest
					// если саджетсу нужен источник в сети. то в этом методе можно сделать обработку результатов запроса,
					// а если не нужен — то собственно и выполнить поиск
					.addTrigger("suggests:getData", function(e) {
						var data = e["data"]
							, suggestValue = e["suggestValue"]
						;

						// ищем локально, в случае соотвествующего флага
						if(suggestOpts.internalSource && suggest.localData) {
							data = suggest._getData(suggestValue);
						}

						if( data.length ) {
							// игнорируем уже использованные значения
							if(Object.keys(suggest.usedMap).length) {
								data = suggestOpts.filterUsed(data, suggest.usedMap);
							}

							if(this.opts.fetching) {
								suggest.pager = ajs.Pager(data, this.opts.fetchCount);
								data = suggest.pager.slice();
							}
							else {
								delete suggest.pager;

								if(suggestOpts.limit) {
									data = data.slice(0, suggestOpts.limit);
								}
							}

							//suggestOpts.afterGetData(e);
						}

						e["data"] = data;
					})

					// MAIL-11397 пункт 2)
					.addTrigger("suggests:mark", function(e) {
						var opts = this.opts;
						e['updateInputValue'] = e['updateInputValue'] && opts.updateOnMark;//https://jira.mail.ru/browse/MAIL-14798?focusedCommentId=661987&page=com.atlassian.jira.plugin.system.issuetabpanels:comment-tabpanel#comment-661987
					})

					// после выбора элемента можно изменить его значение
					.addTrigger("suggests:select", function(e) {
						var originalEvent = e["originalEvent"];
						if(originalEvent && originalEvent.type == "blur") {
							e['updateInputValue'] = false;
							return;
						}

						var sug = e["newSuggest"];

						if(sug) {
							e["newSuggest"] = suggestOpts.afterSelect(sug, e["newSuggestIndex"], e.inputValueLeftPart, e.inputValueRightPart)
						}

						e["inputSelectionStart"] = Infinity;
						e["inputSelectionEnd"] = Infinity;

						// Значение инпута изменено - вызовем тригер change для отлова этих изменений извне
						//  Вызываем с задержкой, чтобы другие обработчики "suggests:select" уже отработались при вызове change
						setTimeout(function(){ this.change() }.bind(jQuery(this["$Input"])));
					})

					// после создания списка саджестов, спозиционируем блок с саджестами
					.addTrigger("suggests:afterRebuild", function(e) {
						var /*value = (e["val"] || "").replace(/\s+/g, ' ')
							, list = e["data"]
							, */offset = input.offset()
							, width = typeof suggestOpts.width == "string" || suggestOpts.width > 0 ? suggestOpts.width : Math.max(input.width(), 100)
							, margin = suggestOpts.margin ? suggestOpts.margin : 7
						;

						block.css({
							width: width,
							top: offset.top + input.height() + margin,
							left: offset.left,
							zIndex: 40000
						});

						if( suggestOpts.afterRebuild ) {
							suggestOpts.afterRebuild(e, block);
						}
					})
				;

				//  TODO:: Можно выпилить эти три строчки после выкатки таска HOME-1537 в бой
				$(window).bind("hashchange popstate", function() {
					if(this.isExpanded()) {
						this.$Input.trigger("blur")
					}
				}.bind(this.ajsSuggest));

				if(_fetch) {
					this.ajsSuggest
						// "подсасывание" новых страниц в список
						.addTrigger('suggests:fetch', function(e) {
							var data = e["data"];

							if(data && suggest.pager && suggest.pager.hasNext()) {
								suggest.pager.next();
								data.splice.bind(data, e["fetchFrom"] + 1, 0).apply(null, suggest.pager.slice());
							}
						})
					;

					if( suggestOpts.ignoreUsedData ) {
						this.ajsSuggest
							// после скрытия списка
							.addTrigger("suggests:hide", function() {
								suggest.ignoreUsed(suggest.getSuggestWords());
							})
					}
				}

				if(suggestOpts.internalSource) {//До HOME-1708 пункт 2
					this.ajsSuggest
						// запрещаем ajs.ui.suggest кешировать данные и принуждаем его каждый раз вызывать getData
						.addTrigger("suggests:find", function(e) {
							e.expire = true;

							if( suggestOpts.startFindSuggest && e.originalEvent && e.originalEvent.type == "focus" ) {
								if( suggestOpts.startFindSuggest() === false ) {
									return false;
								}
							}
						})
					;
				}

				if( typeof suggestOpts.afterGetSuggestWords == "function" ) {
					this.ajsSuggest
						.addTrigger("suggests:getSuggestWords:after", function(event) {
							var ignoreAfter;
							ignoreAfter = (ignoreAfter = event.target) && (ignoreAfter = ignoreAfter.opts) && ignoreAfter.ignoreAfterGetSuggestWords;
							if( !ignoreAfter ) {
								event["data"] = this(event["data"])
							}
						}.bind(suggestOpts.afterGetSuggestWords))
					;
				}
			},

			_getData: function(suggestValue) {
 				return suggestValue ? this.localData.find(suggestValue) : this.localData.all();
			},

			setData: function(data) {
				// на вход получили источник данных
				if(data && 'find' in data && 'all' in data && $.isFunction(data.find) && $.isFunction(data.all)) {
					this.localData = data;

				// на вход получили массив записей, которые нужно отображать
				} else if(Array.isArray(data)) {
					var searchIndex = new mailru.Utils.SearchIndex(this.opts.searchIndexTokenizer);
					searchIndex.create(data);

					this.localData = {
						type: 'fromArray',

						all: function() {
							return data;
						},

						find: function(suggestValue) {
							return searchIndex.find(suggestValue);
						}
					};


				} else {
					throw new Error('Undefined type of data');
				}
			},

			isExpanded: function() {
				return this.ajsSuggest.isExpanded();
			},

			ignoreUsed: function(used) {
				this.usedMap = {};

				if(Array.isArray(used)) {
					for(var i=0, l=used.length; i<l; i++) {
						if(used[i]) {
							this.usedMap[used[i]] = true;
						}
					}
				}
			},

			showWholeList: function() {
				if( this.opts.internalSource ) {//До HOME-1708 пункт 2
					this.ajsSuggest.reset();
				}
				this.ajsSuggest.showSuggests("", false, this.data, true);
			},


			getSuggestWords: function(ignoreAfter) {
				var result;

				if( ignoreAfter ) {
					this.ajsSuggest.opts.ignoreAfterGetSuggestWords = true;
				}

				result = this.ajsSuggest.getSuggestWords();

				if( ignoreAfter ) {
					delete this.ajsSuggest.opts.ignoreAfterGetSuggestWords;
				}

				return result;
			},

			getCurrentFindValue: function() {
				return this.ajsSuggest.getCurrentFindValue();
			},

			rebuildSuggestsList: function() {
				if( this.opts.internalSource ) {//До HOME-1708 пункт 2
					this.ajsSuggest.reset();
				}
				this.ajsSuggest.showSuggests(this.getCurrentFindValue(), false);
			}
		})
	;

	jsLoader.loaded('{mailru.ui}mailru.ui.Suggest', 1);

// data/ru/images/js/ru/ui/mailru.ui.Suggest.js end

})(jQuery, jQuery);

// 110
	jsLoader.loaded('{mailru.build}core', 1);

// data/ru/images/js/ru/build/core.js end
