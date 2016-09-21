// ==ClosureCompiler==
// @compilation_level SIMPLE_OPTIMIZATIONS
// @warning_level VERBOSE
// @jscomp_warning missingProperties
// @output_file_name cookie.min.js
// @check_types
// ==/ClosureCompiler==

/**
 * Mail.Ru S-cookie parser plugin
 * Copyright (c) 2012 Mail.Ru
 */
(function(global) {

/**
 * @param {string} name cookie name
 * @param {(string|*)=} value cookie value
 * @param {Object=} options Options
 * @return {(string|undefined)}
 */
function cookie(name, value, options) {
	if(value !== void 0) {
		var date;
		
		options = options || {};
		if (value === null) {
			value = '';
			options.expires = -1;
		}
		
		value = value + "";
		//value = encodeURIComponent(value + "");
		
		document.cookie = 
			name + '=' + value + 
			(options.expires &&
				(date =
					typeof options.expires == 'number' &&
						(date = new Date()),
						date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000)),
						date
					||
					"toUTCString" in options.expires &&
						options.expires
				) && ('; expires=' + date.toUTCString()) || "") +
			(options.path ? ('; path=' + options.path) : "") +
			(options.domain ? ('; domain=' + options.domain) : "") +
			(options.secure ? '; secure' : '');
			
		return value;
	}
	else {
		if ((document.cookie || "") !== "") {
			value = (document.cookie.match(new RegExp("(?:^| )" + name + "\\=(\\S*)(?:; |$)")) || [])[1];
			return value === void 0 ? void 0 : value /*decodeURIComponent(value)*/;
		}
	}

}

//export
var mail_global_namespace = global["m$portal"];
if(!mail_global_namespace)mail_global_namespace = global["m$portal"] = {};

mail_global_namespace["cookie"] = cookie;


})(window);
