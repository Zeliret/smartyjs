
/**
 * @preserve Smarty templater
 *
 * @author Artem Shalaev <artem.shalaev@gmail.com>, Sep 27, 2011 1:51:28 PM
 * @copyright MegaGroup © 2011, megagroup.ru
 * @access public
 * @package Smarty.js
 * @version 1.0.1
 * 
 * [~] - switched off, [-] - removed, [+] - added, [*] - modified 
 * 
 * [~] Literal support 
 * 
 * Supports: if, else, elseif, foreach, foreachelse, break, continue, while, capture, include
 * 
 * @todo Parser exceptions with position
 * @todo Parser support for screened quotes
 * @todo Parsing expression into indexed array
 * @todo Custom user functions
 */

(function(window){
	'use strict';
	
	if( void 0 !== smarty )
		return;
	
	/*******************************************************************
	 *
	 * Helpful prototype extendings
	 * 
	 *******************************************************************/
	
	/*
	 * Function.bind()
	 */
	Function.prototype.bind || (Function.prototype.bind = function(oThis){  
		if (typeof this !== "function") // closest thing possible to the ECMAScript 5 internal IsCallable function  
			throw new TypeError("Function.prototype.bind - what is trying to be fBound is not callable");  
  
		var aArgs = Array.prototype.slice.call(arguments, 1),   
		fToBind = this,   
		fNOP = function () {},  
		fBound = function () {  
			return fToBind.apply(this instanceof fNOP ? this : oThis || window, aArgs.concat(Array.prototype.slice.call(arguments)));      
		};  
  
		fNOP.prototype = this.prototype;  
		fBound.prototype = new fNOP();  
  
		return fBound;  
	});
	
	/*
	 * Array.forEach()
	 */
	Array.prototype.forEach || (Array.prototype.forEach = function(callback, thisArg){    
		var T, k;    
		if ( this == null ) 
			throw new TypeError( " this is null or not defined" );
  
		// 1. Let O be the result of calling ToObject passing the |this| value as the argument.  
		var O = Object(this);  
  
		// 2. Let lenValue be the result of calling the Get internal method of O with the argument "length".  
		// 3. Let len be ToUint32(lenValue).  
		var len = O.length >>> 0;  
  
		// 4. If IsCallable(callback) is false, throw a TypeError exception.  
		// See: http://es5.github.com/#x9.11  
		if ( {}.toString.call(callback) != "[object Function]" ) 
			throw new TypeError( callback + " is not a function" );  
  
		// 5. If thisArg was supplied, let T be thisArg; else let T be undefined.  
		if ( thisArg ) 
			T = thisArg;  
  
		// 6. Let k be 0  
		k = 0;  
  
		// 7. Repeat, while k < len  
		while( k < len ) {   
			var kValue;  
  
			// a. Let Pk be ToString(k).  
			//   This is implicit for LHS operands of the in operator  
			// b. Let kPresent be the result of calling the HasProperty internal method of O with argument Pk.  
			//   This step can be combined with c  
			// c. If kPresent is true, then  
			if ( k in O ) {  
  
				// i. Let kValue be the result of calling the Get internal method of O with argument Pk.  
				kValue = O[ Pk ];  
  
				// ii. Call the Call internal method of callback with T as the this value and  
				// argument list containing kValue, k, and O.  
				callback.call( T, kValue, k, O );  
			}  
			// d. Increase k by 1.  
			k++;  
		}  
	// 8. return undefined  
	});
	
	/*
	 * ECMAScript 5th Edition: String.trim()
	 */
	String.prototype.trim || (String.prototype.trim = function(){
		return this.replace(/^\s+|\s+$/g, '');
	});		
	
	/*******************************************************************
	 *
	 * Base smarty namespace
	 * 
	 *******************************************************************/
	
	var smarty = window['smarty'] = {
		entities: {},
		modifiers: {},
		settings: {
			isDebug: false,
			includeHandler: function(){
				throw new smarty.Exception("Method isn't implemented yet!");
			},
			includeTimeout: 3000
		},
		
		/**
		 * Configure smarty library
		 * @param {Object} settings		Configuration settings
		 * @type {smarty}
		 */
		configure: function(settings){
			this.settings = smarty.utils.extend(this.settings, settings || {}); 
			
			return this;
		},

		/**
		 * Add modifier to engine
		 * @param {String} name			A name of modifier
		 * @param {Function} modifier	Function that describe logic of modifier
		 * @type {smarty}
		 */
		addModifier: function(name, modifier){
			if( !this.utils.isFunction(modifier) )
				throw new this.Exception("Parameter 'modifier' must be callable!");
			
			this.modifiers[name] = modifier;
			
			return this;
		},

		/**
		 * Add function to engine
		 * @param {String} name			A name of function
		 * @param {Function} func		Function that is called at begin
		 * @type {smarty}
		 */
		addFunction: function(name, func){
			this.addEntity(name, {
				start: func
			});
			
			return this;
		},

		/**
		 * Add operator to engine
		 * @param {String}		name	A name of operator
		 * @param {Function}	start	Function that is called at begin
		 * @param {Function}	end		Function that is called at end
		 * @type {smarty}
		 */
		addOperator: function(name, start, end){
			this.addEntity(name, {
				start: start,
				end: end
			});
			
			return this;
		},
		
		/**
		 * Add custom entity to engine
		 * @param {String} name		A name of entity
		 * @param {Object} options	Options
		 */
		addEntity: function(name, options){
			options = this.utils.extend({	
				attributes: {
					_required: []
				},
				/**
				 * Method is called after open tag is parsed
				 * @param {smarty.Expression} expression	Parsed expression
				 */
				start: function(expression){
					return '';
				},
				end: void 0,	
				after: [],
				depends: []
			}, options || {});
			
			if( !this.utils.isFunction(options.start) )
				throw new this.Exception("Callback [options.start] must be callable!");
			
			if( !this.utils.isUndefined(options.end) && !this.utils.isFunction(options.end) )
				throw new this.Exception("Callback [options.end] must be callable or [undefined]!");
		
			if( !this.utils.isArray(options.after) || !this.utils.isArray(options.depends) )
				throw new this.Exception("[options.after] and [options.depends] must be an [Array]!");
			
			if( !this.utils.isObject(options.attributes) )
				throw new this.Exception("[options.attributes] must be an [Object]!");
			
			if( !smarty.utils.isArray(options.attributes._required) )
				throw new smarty.Exception("[options.attributes._required] must be an [Array]!");
			
			options.attributes._required.forEach(function(name){
				if( !(name in options.attributes) )
					throw new smarty.Exception("'{0}' is defined in require list, but isn't defined in attributes list!", name);
			});

			this.entities[name] = options;
			
			return this;
		}
	};
	
	/*******************************************************************
	 *
	 * Utility methods
	 * 
	 *******************************************************************/
	
	smarty.utils = {
		types: {},
		
		getenv: function(varname) {
			// http://kevin.vanzonneveld.net
			// +   original by: Brett Zamir (http://brett-zamir.me)
			// %        note 1: We are not using $_ENV as in PHP, you could define
			// %        note 1: "$_ENV = this.php_js.ENV;" and get/set accordingly
			// %        note 2: Returns e.g. 'en-US' when set global this.php_js.ENV is set
			// %        note 3: Uses global: php_js to store environment info
			// *     example 1: getenv('LC_ALL');
			// *     returns 1: false
			if (!this.php_js || !this.php_js.ENV || !this.php_js.ENV[varname]) {
				return false;
			}

			return this.php_js.ENV[varname];
		},
		
		setlocale: function(category, locale) {
			// http://kevin.vanzonneveld.net
			// +   original by: Brett Zamir (http://brett-zamir.me)
			// +   derived from: Blues at http://hacks.bluesmoon.info/strftime/strftime.js
			// +   derived from: YUI Library: http://developer.yahoo.com/yui/docs/YAHOO.util.DateLocale.html
			// -    depends on: getenv
			// %          note 1: Is extensible, but currently only implements locales en,
			// %          note 1: en_US, en_GB, en_AU, fr, and fr_CA for LC_TIME only; C for LC_CTYPE;
			// %          note 1: C and en for LC_MONETARY/LC_NUMERIC; en for LC_COLLATE
			// %          note 2: Uses global: php_js to store locale info
			// %          note 3: Consider using http://demo.icu-project.org/icu-bin/locexp as basis for localization (as in i18n_loc_set_default())
			// *     example 1: setlocale('LC_ALL', 'en_US');
			// *     returns 1: 'en_US'
			var categ = '',
			cats = [],
			i = 0,
			d = window.document;

			// BEGIN STATIC
			var _copy = function _copy(orig) {
				if (orig instanceof RegExp) {
					return new RegExp(orig);
				} else if (orig instanceof Date) {
					return new Date(orig);
				}
				var newObj = {};
				for (var i in orig) {
					if (typeof orig[i] === 'object') {
						newObj[i] = _copy(orig[i]);
					} else {
						newObj[i] = orig[i];
					}
				}
				return newObj;
			};

			// Function usable by a ngettext implementation (apparently not an accessible part of setlocale(), but locale-specific)
			// See http://www.gnu.org/software/gettext/manual/gettext.html#Plural-forms though amended with others from
			// https://developer.mozilla.org/En/Localization_and_Plurals (new categories noted with "MDC" below, though
			// not sure of whether there is a convention for the relative order of these newer groups as far as ngettext)
			// The function name indicates the number of plural forms (nplural)
			// Need to look into http://cldr.unicode.org/ (maybe future JavaScript); Dojo has some functions (under new BSD),
			// including JSON conversions of LDML XML from CLDR: http://bugs.dojotoolkit.org/browser/dojo/trunk/cldr
			// and docs at http://api.dojotoolkit.org/jsdoc/HEAD/dojo.cldr
			var _nplurals1 = function (n) { // e.g., Japanese
				return 0;
			};
			var _nplurals2a = function (n) { // e.g., English
				return n !== 1 ? 1 : 0;
			};
			var _nplurals2b = function (n) { // e.g., French
				return n > 1 ? 1 : 0;
			};
			var _nplurals2c = function (n) { // e.g., Icelandic (MDC)
				return n % 10 === 1 && n % 100 !== 11 ? 0 : 1;
			};
			var _nplurals3a = function (n) { // e.g., Latvian (MDC has a different order from gettext)
				return n % 10 === 1 && n % 100 !== 11 ? 0 : n !== 0 ? 1 : 2;
			};
			var _nplurals3b = function (n) { // e.g., Scottish Gaelic
				return n === 1 ? 0 : n === 2 ? 1 : 2;
			};
			var _nplurals3c = function (n) { // e.g., Romanian
				return n === 1 ? 0 : (n === 0 || (n % 100 > 0 && n % 100 < 20)) ? 1 : 2;
			};
			var _nplurals3d = function (n) { // e.g., Lithuanian (MDC has a different order from gettext)
				return n % 10 === 1 && n % 100 !== 11 ? 0 : n % 10 >= 2 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2;
			};
			var _nplurals3e = function (n) { // e.g., Croatian
				return n % 10 === 1 && n % 100 !== 11 ? 0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2;
			};
			var _nplurals3f = function (n) { // e.g., Slovak
				return n === 1 ? 0 : n >= 2 && n <= 4 ? 1 : 2;
			};
			var _nplurals3g = function (n) { // e.g., Polish
				return n === 1 ? 0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2;
			};
			var _nplurals3h = function (n) { // e.g., Macedonian (MDC)
				return n % 10 === 1 ? 0 : n % 10 === 2 ? 1 : 2;
			};
			var _nplurals4a = function (n) { // e.g., Slovenian
				return n % 100 === 1 ? 0 : n % 100 === 2 ? 1 : n % 100 === 3 || n % 100 === 4 ? 2 : 3;
			};
			var _nplurals4b = function (n) { // e.g., Maltese (MDC)
				return n === 1 ? 0 : n === 0 || (n % 100 && n % 100 <= 10) ? 1 : n % 100 >= 11 && n % 100 <= 19 ? 2 : 3;
			};
			var _nplurals5 = function (n) { // e.g., Irish Gaeilge (MDC)
				return n === 1 ? 0 : n === 2 ? 1 : n >= 3 && n <= 6 ? 2 : n >= 7 && n <= 10 ? 3 : 4;
			};
			var _nplurals6 = function (n) { // e.g., Arabic (MDC) - Per MDC puts 0 as last group
				return n === 0 ? 5 : n === 1 ? 0 : n === 2 ? 1 : n % 100 >= 3 && n % 100 <= 10 ? 2 : n % 100 >= 11 && n % 100 <= 99 ? 3 : 4;
			};
			// END STATIC
			// BEGIN REDUNDANT
			this.php_js = this.php_js || {};

			var phpjs = this.php_js;

			// Reconcile Windows vs. *nix locale names?
			// Allow different priority orders of languages, esp. if implement gettext as in
			//     LANGUAGE env. var.? (e.g., show German if French is not available)
			if (!phpjs.locales) {
				// Can add to the locales
				phpjs.locales = {};

				phpjs.locales.en = {
					'LC_COLLATE': // For strcoll


					function (str1, str2) { // Fix: This one taken from strcmp, but need for other locales; we don't use localeCompare since its locale is not settable
						return (str1 == str2) ? 0 : ((str1 > str2) ? 1 : -1);
					},
					'LC_CTYPE': { // Need to change any of these for English as opposed to C?
						an: /^[A-Za-z\d]+$/g,
						al: /^[A-Za-z]+$/g,
						ct: /^[\u0000-\u001F\u007F]+$/g,
						dg: /^[\d]+$/g,
						gr: /^[\u0021-\u007E]+$/g,
						lw: /^[a-z]+$/g,
						pr: /^[\u0020-\u007E]+$/g,
						pu: /^[\u0021-\u002F\u003A-\u0040\u005B-\u0060\u007B-\u007E]+$/g,
						sp: /^[\f\n\r\t\v ]+$/g,
						up: /^[A-Z]+$/g,
						xd: /^[A-Fa-f\d]+$/g,
						CODESET: 'UTF-8',
						// Used by sql_regcase
						lower: 'abcdefghijklmnopqrstuvwxyz',
						upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
					},
					'LC_TIME': { // Comments include nl_langinfo() constant equivalents and any changes from Blues' implementation
						a: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
						// ABDAY_
						A: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
						// DAY_
						b: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
						// ABMON_
						B: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
						// MON_
						c: '%a %d %b %Y %r %Z',
						// D_T_FMT // changed %T to %r per results
						p: ['AM', 'PM'],
						// AM_STR/PM_STR
						P: ['am', 'pm'],
						// Not available in nl_langinfo()
						r: '%I:%M:%S %p',
						// T_FMT_AMPM (Fixed for all locales)
						x: '%m/%d/%Y',
						// D_FMT // switched order of %m and %d; changed %y to %Y (C uses %y)
						X: '%r',
						// T_FMT // changed from %T to %r  (%T is default for C, not English US)
						// Following are from nl_langinfo() or http://www.cptec.inpe.br/sx4/sx4man2/g1ab02e/strftime.4.html
						alt_digits: '',
						// e.g., ordinal
						ERA: '',
						ERA_YEAR: '',
						ERA_D_T_FMT: '',
						ERA_D_FMT: '',
						ERA_T_FMT: ''
					},
					// Assuming distinction between numeric and monetary is thus:
					// See below for C locale
					'LC_MONETARY': { // Based on Windows "english" (English_United States.1252) locale
						int_curr_symbol: 'USD',
						currency_symbol: '$',
						mon_decimal_point: '.',
						mon_thousands_sep: ',',
						mon_grouping: [3],
						// use mon_thousands_sep; "" for no grouping; additional array members indicate successive group lengths after first group (e.g., if to be 1,23,456, could be [3, 2])
						positive_sign: '',
						negative_sign: '-',
						int_frac_digits: 2,
						// Fractional digits only for money defaults?
						frac_digits: 2,
						p_cs_precedes: 1,
						// positive currency symbol follows value = 0; precedes value = 1
						p_sep_by_space: 0,
						// 0: no space between curr. symbol and value; 1: space sep. them unless symb. and sign are adjacent then space sep. them from value; 2: space sep. sign and value unless symb. and sign are adjacent then space separates
						n_cs_precedes: 1,
						// see p_cs_precedes
						n_sep_by_space: 0,
						// see p_sep_by_space
						p_sign_posn: 3,
						// 0: parentheses surround quantity and curr. symbol; 1: sign precedes them; 2: sign follows them; 3: sign immed. precedes curr. symbol; 4: sign immed. succeeds curr. symbol
						n_sign_posn: 0 // see p_sign_posn
					},
					'LC_NUMERIC': { // Based on Windows "english" (English_United States.1252) locale
						decimal_point: '.',
						thousands_sep: ',',
						grouping: [3] // see mon_grouping, but for non-monetary values (use thousands_sep)
					},
					'LC_MESSAGES': {
						YESEXPR: '^[yY].*',
						NOEXPR: '^[nN].*',
						YESSTR: '',
						NOSTR: ''
					},
					nplurals: _nplurals2a
				};
				phpjs.locales.en_US = _copy(phpjs.locales.en);
				phpjs.locales.en_US.LC_TIME.c = '%a %d %b %Y %r %Z';
				phpjs.locales.en_US.LC_TIME.x = '%D';
				phpjs.locales.en_US.LC_TIME.X = '%r';
				// The following are based on *nix settings
				phpjs.locales.en_US.LC_MONETARY.int_curr_symbol = 'USD ';
				phpjs.locales.en_US.LC_MONETARY.p_sign_posn = 1;
				phpjs.locales.en_US.LC_MONETARY.n_sign_posn = 1;
				phpjs.locales.en_US.LC_MONETARY.mon_grouping = [3, 3];
				phpjs.locales.en_US.LC_NUMERIC.thousands_sep = '';
				phpjs.locales.en_US.LC_NUMERIC.grouping = [];

				phpjs.locales.en_GB = _copy(phpjs.locales.en);
				phpjs.locales.en_GB.LC_TIME.r = '%l:%M:%S %P %Z';

				phpjs.locales.en_AU = _copy(phpjs.locales.en_GB);
				phpjs.locales.C = _copy(phpjs.locales.en); // Assume C locale is like English (?) (We need C locale for LC_CTYPE)
				phpjs.locales.C.LC_CTYPE.CODESET = 'ANSI_X3.4-1968';
				phpjs.locales.C.LC_MONETARY = {
					int_curr_symbol: '',
					currency_symbol: '',
					mon_decimal_point: '',
					mon_thousands_sep: '',
					mon_grouping: [],
					p_cs_precedes: 127,
					p_sep_by_space: 127,
					n_cs_precedes: 127,
					n_sep_by_space: 127,
					p_sign_posn: 127,
					n_sign_posn: 127,
					positive_sign: '',
					negative_sign: '',
					int_frac_digits: 127,
					frac_digits: 127
				};
				phpjs.locales.C.LC_NUMERIC = {
					decimal_point: '.',
					thousands_sep: '',
					grouping: []
				};
				phpjs.locales.C.LC_TIME.c = '%a %b %e %H:%M:%S %Y'; // D_T_FMT
				phpjs.locales.C.LC_TIME.x = '%m/%d/%y'; // D_FMT
				phpjs.locales.C.LC_TIME.X = '%H:%M:%S'; // T_FMT
				phpjs.locales.C.LC_MESSAGES.YESEXPR = '^[yY]';
				phpjs.locales.C.LC_MESSAGES.NOEXPR = '^[nN]';

				phpjs.locales.fr = _copy(phpjs.locales.en);
				phpjs.locales.fr.nplurals = _nplurals2b;
				phpjs.locales.fr.LC_TIME.a = ['dim', 'lun', 'mar', 'mer', 'jeu', 'ven', 'sam'];
				phpjs.locales.fr.LC_TIME.A = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
				phpjs.locales.fr.LC_TIME.b = ['jan', 'f\u00E9v', 'mar', 'avr', 'mai', 'jun', 'jui', 'ao\u00FB', 'sep', 'oct', 'nov', 'd\u00E9c'];
				phpjs.locales.fr.LC_TIME.B = ['janvier', 'f\u00E9vrier', 'mars', 'avril', 'mai', 'juin', 'juillet', 'ao\u00FBt', 'septembre', 'octobre', 'novembre', 'd\u00E9cembre'];
				phpjs.locales.fr.LC_TIME.c = '%a %d %b %Y %T %Z';
				phpjs.locales.fr.LC_TIME.p = ['', ''];
				phpjs.locales.fr.LC_TIME.P = ['', ''];
				phpjs.locales.fr.LC_TIME.x = '%d.%m.%Y';
				phpjs.locales.fr.LC_TIME.X = '%T';

				phpjs.locales.fr_CA = _copy(phpjs.locales.fr);
				phpjs.locales.fr_CA.LC_TIME.x = '%Y-%m-%d';
			}
			if (!phpjs.locale) {
				phpjs.locale = 'en_US';
				var NS_XHTML = 'http://www.w3.org/1999/xhtml';
				var NS_XML = 'http://www.w3.org/XML/1998/namespace';
				if (d.getElementsByTagNameNS && d.getElementsByTagNameNS(NS_XHTML, 'html')[0]) {
					if (d.getElementsByTagNameNS(NS_XHTML, 'html')[0].getAttributeNS && d.getElementsByTagNameNS(NS_XHTML, 'html')[0].getAttributeNS(NS_XML, 'lang')) {
						phpjs.locale = d.getElementsByTagName(NS_XHTML, 'html')[0].getAttributeNS(NS_XML, 'lang');
					} else if (d.getElementsByTagNameNS(NS_XHTML, 'html')[0].lang) { // XHTML 1.0 only
						phpjs.locale = d.getElementsByTagNameNS(NS_XHTML, 'html')[0].lang;
					}
				} else if (d.getElementsByTagName('html')[0] && d.getElementsByTagName('html')[0].lang) {
					phpjs.locale = d.getElementsByTagName('html')[0].lang;
				}
			}
			phpjs.locale = phpjs.locale.replace('-', '_'); // PHP-style
			// Fix locale if declared locale hasn't been defined
			if (!(phpjs.locale in phpjs.locales)) {
				if (phpjs.locale.replace(/_[a-zA-Z]+$/, '') in phpjs.locales) {
					phpjs.locale = phpjs.locale.replace(/_[a-zA-Z]+$/, '');
				}
			}

			if (!phpjs.localeCategories) {
				phpjs.localeCategories = {
					'LC_COLLATE': phpjs.locale,
					// for string comparison, see strcoll()
					'LC_CTYPE': phpjs.locale,
					// for character classification and conversion, for example strtoupper()
					'LC_MONETARY': phpjs.locale,
					// for localeconv()
					'LC_NUMERIC': phpjs.locale,
					// for decimal separator (See also localeconv())
					'LC_TIME': phpjs.locale,
					// for date and time formatting with strftime()
					'LC_MESSAGES': phpjs.locale // for system responses (available if PHP was compiled with libintl)
				};
			}
			// END REDUNDANT
			if (locale === null || locale === '') {
				locale = this.getenv(category) || this.getenv('LANG');
			} else if (Object.prototype.toString.call(locale) === '[object Array]') {
				for (i = 0; i < locale.length; i++) {
					if (!(locale[i] in this.php_js.locales)) {
						if (i === locale.length - 1) {
							return false; // none found
						}
						continue;
					}
					locale = locale[i];
					break;
				}
			}

			// Just get the locale
			if (locale === '0' || locale === 0) {
				if (category === 'LC_ALL') {
					for (categ in this.php_js.localeCategories) {
						cats.push(categ + '=' + this.php_js.localeCategories[categ]); // Add ".UTF-8" or allow ".@latint", etc. to the end?
					}
					return cats.join(';');
				}
				return this.php_js.localeCategories[category];
			}

			if (!(locale in this.php_js.locales)) {
				return false; // Locale not found
			}

			// Set and get locale
			if (category === 'LC_ALL') {
				for (categ in this.php_js.localeCategories) {
					this.php_js.localeCategories[categ] = locale;
				}
			} else {
				this.php_js.localeCategories[category] = locale;
			}
			return locale;
		},
		
		strftime: function(fmt, timestamp) {
			// http://kevin.vanzonneveld.net
			// +      original by: Blues (http://tech.bluesmoon.info/)
			// + reimplemented by: Brett Zamir (http://brett-zamir.me)
			// +   input by: Alex
			// +   bugfixed by: Brett Zamir (http://brett-zamir.me)
			// +   improved by: Brett Zamir (http://brett-zamir.me)
			// -       depends on: setlocale
			// %        note 1: Uses global: php_js to store locale info
			// *        example 1: strftime("%A", 1062462400); // Return value will depend on date and locale
			// *        returns 1: 'Tuesday'
			// BEGIN REDUNDANT
			this.php_js = this.php_js || {};
			this.setlocale('LC_ALL', 'en'); // ensure setup of localization variables takes place
			// END REDUNDANT
			var phpjs = this.php_js;

			// BEGIN STATIC
			var _xPad = function (x, pad, r) {
				if (typeof r === 'undefined') {
					r = 10;
				}
				for (; parseInt(x, 10) < r && r > 1; r /= 10) {
					x = pad.toString() + x;
				}
				return x.toString();
			};

			var locale = phpjs.localeCategories.LC_TIME;
			var locales = phpjs.locales;
			var lc_time = locales[locale].LC_TIME;

			var _formats = {
				a: function (d) {
					return lc_time.a[d.getDay()];
				},
				A: function (d) {
					return lc_time.A[d.getDay()];
				},
				b: function (d) {
					return lc_time.b[d.getMonth()];
				},
				B: function (d) {
					return lc_time.B[d.getMonth()];
				},
				C: function (d) {
					return _xPad(parseInt(d.getFullYear() / 100, 10), 0);
				},
				d: ['getDate', '0'],
				e: ['getDate', ' '],
				g: function (d) {
					return _xPad(parseInt(this.G(d) / 100, 10), 0);
				},
				G: function (d) {
					var y = d.getFullYear();
					var V = parseInt(_formats.V(d), 10);
					var W = parseInt(_formats.W(d), 10);

					if (W > V) {
						y++;
					} else if (W === 0 && V >= 52) {
						y--;
					}

					return y;
				},
				H: ['getHours', '0'],
				I: function (d) {
					var I = d.getHours() % 12;
					return _xPad(I === 0 ? 12 : I, 0);
				},
				j: function (d) {
					var ms = d - new Date('' + d.getFullYear() + '/1/1 GMT');
					ms += d.getTimezoneOffset() * 60000; // Line differs from Yahoo implementation which would be equivalent to replacing it here with:
					// ms = new Date('' + d.getFullYear() + '/' + (d.getMonth()+1) + '/' + d.getDate() + ' GMT') - ms;
					var doy = parseInt(ms / 60000 / 60 / 24, 10) + 1;
					return _xPad(doy, 0, 100);
				},
				k: ['getHours', '0'],
				// not in PHP, but implemented here (as in Yahoo)
				l: function (d) {
					var l = d.getHours() % 12;
					return _xPad(l === 0 ? 12 : l, ' ');
				},
				m: function (d) {
					return _xPad(d.getMonth() + 1, 0);
				},
				M: ['getMinutes', '0'],
				p: function (d) {
					return lc_time.p[d.getHours() >= 12 ? 1 : 0];
				},
				P: function (d) {
					return lc_time.P[d.getHours() >= 12 ? 1 : 0];
				},
				s: function (d) { // Yahoo uses return parseInt(d.getTime()/1000, 10);
					return Date.parse(d) / 1000;
				},
				S: ['getSeconds', '0'],
				u: function (d) {
					var dow = d.getDay();
					return ((dow === 0) ? 7 : dow);
				},
				U: function (d) {
					var doy = parseInt(_formats.j(d), 10);
					var rdow = 6 - d.getDay();
					var woy = parseInt((doy + rdow) / 7, 10);
					return _xPad(woy, 0);
				},
				V: function (d) {
					var woy = parseInt(_formats.W(d), 10);
					var dow1_1 = (new Date('' + d.getFullYear() + '/1/1')).getDay();
					// First week is 01 and not 00 as in the case of %U and %W,
					// so we add 1 to the final result except if day 1 of the year
					// is a Monday (then %W returns 01).
					// We also need to subtract 1 if the day 1 of the year is
					// Friday-Sunday, so the resulting equation becomes:
					var idow = woy + (dow1_1 > 4 || dow1_1 <= 1 ? 0 : 1);
					if (idow === 53 && (new Date('' + d.getFullYear() + '/12/31')).getDay() < 4) {
						idow = 1;
					} else if (idow === 0) {
						idow = _formats.V(new Date('' + (d.getFullYear() - 1) + '/12/31'));
					}
					return _xPad(idow, 0);
				},
				w: 'getDay',
				W: function (d) {
					var doy = parseInt(_formats.j(d), 10);
					var rdow = 7 - _formats.u(d);
					var woy = parseInt((doy + rdow) / 7, 10);
					return _xPad(woy, 0, 10);
				},
				y: function (d) {
					return _xPad(d.getFullYear() % 100, 0);
				},
				Y: 'getFullYear',
				z: function (d) {
					var o = d.getTimezoneOffset();
					var H = _xPad(parseInt(Math.abs(o / 60), 10), 0);
					var M = _xPad(o % 60, 0);
					return (o > 0 ? '-' : '+') + H + M;
				},
				Z: function (d) {
					return d.toString().replace(/^.*\(([^)]+)\)$/, '$1');
				/*
            // Yahoo's: Better?
            var tz = d.toString().replace(/^.*:\d\d( GMT[+-]\d+)? \(?([A-Za-z ]+)\)?\d*$/, '$2').replace(/[a-z ]/g, '');
            if(tz.length > 4) {
                tz = Dt.formats.z(d);
            }
            return tz;
            */
				},
				'%': function (d) {
					return '%';
				}
			};
			// END STATIC
			/* Fix: Locale alternatives are supported though not documented in PHP; see http://linux.die.net/man/3/strptime
Ec
EC
Ex
EX
Ey
EY
Od or Oe
OH
OI
Om
OM
OS
OU
Ow
OW
Oy
*/

			var _date = ((typeof(timestamp) == 'undefined') ? new Date() : // Not provided
				(typeof(timestamp) == 'object') ? new Date(timestamp) : // Javascript Date()
				new Date(timestamp * 1000) // PHP API expects UNIX timestamp (auto-convert to int)
				);

			var _aggregates = {
				c: 'locale',
				D: '%m/%d/%y',
				F: '%y-%m-%d',
				h: '%b',
				n: '\n',
				r: 'locale',
				R: '%H:%M',
				t: '\t',
				T: '%H:%M:%S',
				x: 'locale',
				X: 'locale'
			};


			// First replace aggregates (run in a loop because an agg may be made up of other aggs)
			while (fmt.match(/%[cDFhnrRtTxX]/)) {
				fmt = fmt.replace(/%([cDFhnrRtTxX])/g, function (m0, m1) {
					var f = _aggregates[m1];
					return (f === 'locale' ? lc_time[m1] : f);
				});
			}

			// Now replace formats - we need a closure so that the date object gets passed through
			var str = fmt.replace(/%([aAbBCdegGHIjklmMpPsSuUVwWyYzZ%])/g, function (m0, m1) {
				var f = _formats[m1];
				if (typeof f === 'string') {
					return _date[f]();
				} else if (typeof f === 'function') {
					return f(_date);
				} else if (typeof f === 'object' && typeof(f[0]) === 'string') {
					return _xPad(_date[f[0]](), f[1]);
				} else { // Shouldn't reach here
					return m1;
				}
			});
			return str;
		},
		
		/**
		 * Format string. Replace placeholders {0} {1} etc., with values from arguments
		 * @param {String} format	Input string with format
		 * @type {String}
		 */
		format: function(format){
			var result = format, params = Array.prototype.slice.call(arguments, 1);
			params.forEach(function(param, i){
				result = result.replace(new RegExp('\\{' + i + '}', 'g'), param);
			});
			
			return result;
		},
	
		/**
		 * Extend first param object with other objects
		 * @param {Object} obj	Object to extend
		 */
		extend: function(obj){
			Array.prototype.slice.call(arguments, 1).forEach(function(source) {
				for( var prop in source )
					if( void 0 !== source[prop] ) 
						obj[prop] = source[prop];
			});
			
			return obj;
		},
	
		/**
		 * Inherit 'class'
		 * @param {Object} parent			Parent 'class'
		 * @param {Object} protoProps		Prototype properties
		 * @param {Object} staticProps		Constructor properties
		 * @type {Object}					Child 'class'
		 */	
		inherit: function(parent, protoProps, staticProps){
			var child, dummy = function(){};

			// The constructor function for the new subclass is either defined by you
			// (the "constructor" property in your `extend` definition), or defaulted
			// by us to simply call `super()`.
			if (protoProps && protoProps.hasOwnProperty('constructor'))
				child = protoProps.constructor;
			else 
				child = function(){
					return parent.apply(this, arguments);
				};

			// Inherit class (static) properties from parent.
			smarty.utils.extend(child, parent);

			// Set the prototype chain to inherit from `parent`, without calling
			// `parent`'s constructor function.
			dummy.prototype = parent.prototype;
			child.prototype = new dummy();

			// Add prototype properties (instance properties) to the subclass,
			// if supplied.
			protoProps && smarty.utils.extend(child.prototype, protoProps);

			// Add static properties to the constructor function, if supplied.
			staticProps && smarty.utils.extend(child, staticProps);

			// Correctly set child's `prototype.constructor`.
			child.prototype.constructor = child;

			// Set a convenience property in case the parent's prototype is needed later.
			child.__super__ = parent.prototype;

			return child;
		},
	
		/**
		 * Get type of object
		 * @param {Object} obj
		 * @type {String}
		 */
		getType: function(obj){		
			return null == obj ? String(obj) : (this.types[Object.prototype.toString.call(obj)] || 'object');
		},
	
		/**
		 * Detect if object is function
		 * @param {Object} obj
		 * @type {Boolean}
		 */
		isFunction: function(obj){
			return this.getType(obj) === 'function';
		},
	
		/**
		 * Detect if object is undefined
		 * @param {Object} obj	
		 * @type {Boolean}
		 */
		isUndefined: function(obj){
			return void 0 === obj;
		},
	
		/**
		 * Detect if object is raw object
		 * @param {Object} obj	
		 * @type {Boolean}
		 */
		isObject: function(obj){
			return this.getType(obj) === 'object';
		},
		
		/**
		 * Detect if object is string
		 * @param {Object} obj	
		 * @type {Boolean}
		 */
		isString: function(obj){
			return this.getType(obj) === 'string';
		},
		
		/**
		 * Detect if object is array
		 * @param {Object} obj	
		 * @type {Boolean}
		 */
		isArray: function(obj){
			return this.getType(obj) === 'array';
		},
	
		/**
		 * Counts elements in array or object. 
		 * If 'obj' undefined or null then 0 returns, 1 - otherwise.
		 * @param {Object} obj
		 * @type {Number}
		 */
		count: function(obj){
			if( this.isUndefined(obj) || null === obj )
				return 0;
			
			if( this.isArray(obj) )
				return obj.length;
			
			if( this.isObject(obj) ){
				var count = 0;
				for( var n in obj ) if( obj.hasOwnProperty(n) )
					count++;
				
				return count;
			}
			
			return 1;
		}
	};
	
	/*******************************************************************
	 *
	 * Debugger
	 * 
	 *******************************************************************/
	
	smarty.debug = {
		_isGroup: false,
		_canDebug: function(){
			return smarty.settings.isDebug && window.console;
		},
		
		_formatMessage: function(msg){
			var date = new Date(), time = {
				h: date.getHours(),
				m: date.getMinutes(),
				s: date.getSeconds(),
				ms: date.getMilliseconds()
			};
			
			return smarty.utils.format("[DEBUG] {0}:{1}:{2}.{3}\t{4}", time.h, time.m, time.s, time.ms, msg);
		},
		
		log: function(){
			var formattedMsg = smarty.utils.format.apply(smarty.utils, arguments);
			return this._canDebug() && console.log(this._isGroup ? formattedMsg : this._formatMessage(formattedMsg)), this;
		},
		
		group: function(title, isCollapsed){
			var formattedTitle = this._formatMessage(title);
			this._isGroup = true;
			return this._canDebug() && (isCollapsed ? console.groupCollapsed(formattedTitle) : console.group(formattedTitle)), this;
		},
		
		groupEnd: function(){
			this._isGroup = false;
			return this._canDebug() && console.groupEnd(), this;
		}
	};
	
	/*******************************************************************
	 *
	 * Exception class
	 * 
	 *******************************************************************/
	
	/**
	 * Exception
	 * @constructor
	 * @todo add parser pos
	 */
	smarty.Exception = smarty.utils.inherit(Error, smarty.Exception = {
		constructor: function(){
			this.name = 'Smarty.Exception';
			this.message = smarty.utils.format.apply(smarty.utils, Array.prototype.slice.call(arguments));		
		}
	});
	
	smarty.CompileException = smarty.utils.inherit(smarty.Exception, smarty.CompileException = {
		constructor: function(compiler){
			if( !(compiler instanceof smarty.Compiler) )
				throw new smarty.Exception("[compiler] must be instance of [smarty.Compiler]!");
			
			this.name = 'Smarty.CompileException';
			this.message = smarty.utils.format("[{0}:{1}] {2}", 
				compiler.getTemplate().getName(), compiler.getLine(),
				smarty.utils.format.apply(smarty.utils, Array.prototype.slice.call(arguments, 1)));			
		}
	});
	
	smarty.RuntimeException = smarty.utils.inherit(smarty.Exception, smarty.RuntimeException = {
		constructor: function(){
			this.name = 'Smarty.RuntimeException';
			this.message = smarty.utils.format.apply(smarty.utils, Array.prototype.slice.call(arguments));			
		}
	});
	
	// TODO: RuntimeException, ParserException
	
	/*******************************************************************
	 *
	 * Template class
	 * 
	 *******************************************************************/
	
	var eventManager = {
		// Bind an event, specified by a string name, `ev`, to a `callback` function.
		// Passing `"all"` will bind the callback to all events fired.
		bind : function(ev, callback, context) {
			var calls = this._callbacks || (this._callbacks = {});
			var list  = calls[ev] || (calls[ev] = []);
			list.push([callback, context]);
			return this;
		},

		// Remove one or many callbacks. If `callback` is null, removes all
		// callbacks for the event. If `ev` is null, removes all bound callbacks
		// for all events.
		unbind : function(ev, callback) {
			var calls;
			if (!ev) {
				this._callbacks = {};
			} else if ( (calls = this._callbacks) ) {
				if (!callback) {
					calls[ev] = [];
				} else {
					var list = calls[ev];
					if (!list) return this;
					for (var i = 0, l = list.length; i < l; i++) {
						if (list[i] && callback === list[i][0]) {
							list[i] = null;
							break;
						}
					}
				}
			}
			return this;
		},

		// Trigger an event, firing all bound callbacks. Callbacks are passed the
		// same arguments as `trigger` is, apart from the event name.
		// Listening for `"all"` passes the true event name as the first argument.
		trigger : function(eventName) {
			var list, calls, ev, callback, args;
			var both = 2;
			if (!(calls = this._callbacks)) return this;
			while (both--) {
				ev = both ? eventName : 'all';
				if ( (list = calls[ev]) ) {
					for (var i = 0, l = list.length; i < l; i++) {
						if (!(callback = list[i])) {
							list.splice(i, 1);
							i--;
							l--;
						} else {
							args = both ? Array.prototype.slice.call(arguments, 1) : arguments;
							callback[0].apply(callback[1] || this, args);
						}
					}
				}
			}
			return this;
		}
	};
	
	/**
	 * Create template instance
	 * @constructor
	 * @param {String} name	Template name
	 */
	smarty.Template = function(name){
		if( smarty.utils.isUndefined(name) || null === name || '' == ('' + name).trim() )
			throw new smarty.Exception("Invalid template name '{0}'!", name);
		
		// If called without 'new' goto factory
		if( !(this instanceof smarty.Template) )		
			return smarty.Template.factory.apply(smarty.Template, arguments);

		if( smarty.Template.isExists(name) )
			throw new smarty.Exception("Template with name '{0}' already exists!", name);
		
		// Template name
		this._name = name;
		// Template source
		this._source = '';		
		
		this._closure = null;
		this._includes = [];
		this._loadedIncludes = [];
		this._includesMap = {};
		
		return smarty.Template.set(this);
	};
	
	smarty.Template.prototype = {
		constructor: smarty.Template,	
		
		/**
		 * Template load handler
		 * @param {String} name	Loaded template name
		 */
		_loadHandler: function(name){
			if( name in this._includesMap ){
				this._loadedIncludes.push(name);
				delete this._includesMap[name];
				
				if( this.isReady() )
					eventManager.trigger('load:' + this._name, this._name).unbind('load:' + this._name);
			}
		},
		
		/**
		 * Dispatch template. Preload includes, etc...
		 */
		_dispatch: function(){	
			var toLoad = [], uniqueMap = {};
			this._includes.forEach(function(name){
				if( !(name in uniqueMap) ){
					uniqueMap[name] = true;
					if( !(smarty.Template.isExists(name)) ){
						toLoad.push(name);
						this._includesMap[name] = true;
						eventManager.bind('load:' + name, function(name){
							this._loadHandler(name);
						}.bind(this));
					} else 
						this._loadedIncludes.push(name);
				}					
			}.bind(this));
				
			if( toLoad.length )
				this._triggerIncludesHandler(toLoad);
			else				
				eventManager.trigger('load:' + this._name, this._name).unbind('load:' + this._name);
		},
		
		/**
		 * Trigger includes handler
		 * @param {Array}	includes	Array of includes
		 * @todo Timeout
		 */
		_triggerIncludesHandler: function(includes){
			if( !smarty.utils.isFunction(smarty.settings.includeHandler) )
				throw new smarty.Exception("[smarty.settings.includeHandler] must be callable!");
			
			if( includes.length ){
				smarty.settings.includeHandler(includes);
			//				clearTimeout(includesTimeoutHandler);
			//				includesTimeoutHandler = window.setTimeout(function(){
			//					throw new smarty.Exception("Template loading timeout is exceeded for the folowings templates: '{0}'", includes);
			//				}, includesTimeout);
			}
		},
		
		/**
		 * Execute rendering compiled template asynchronous
		 * @param {Object}			data		JSON data for template
		 * @param {Function}		callback	Callback that is called when template rendering is finished
		 */
		exec: function(data, callback){
			if( !smarty.utils.isFunction(callback) )
				throw new smarty.Exception("Parameter 'callback' must be callable!");
			
			var cb = function(){
				callback(this._closure.call(data instanceof smarty.Sandbox ? data : new smarty.Sandbox(data)));				
			}.bind(this);
			
			if( !this.isReady() || !this.isCompiled() ){
				eventManager.bind('load:' + this._name, cb);	

				if( !this.isCompiled() )
					this._triggerIncludesHandler([this._name]);
			} else
				cb();			
		},
		
		/**
		 * Execute template synchronous
		 * @param {Object}			data	Template data
		 * @type {String}
		 * @throws {smarty.Exception}
		 */
		execSync: function(data){
			if( !this.isReady() || !this.isCompiled() )
				throw new smarty.Exception("Template isn't ready for execution!");
			
			return this._closure.call(data instanceof smarty.Sandbox ? data : new smarty.Sandbox(data));
		},
		
		/**
		 * Remove template object
		 */
		remove: function(){			
			smarty.Template.remove(this._name);
		},
		
		/**
		 * Check if template is compiled
		 * @type {Boolean}
		 */
		isCompiled: function(){
			return null !== this._closure;
		},
		
		/**
		 * Check if template is ready to render
		 * @type {Boolean}
		 */
		isReady: function(){
			return this.isCompiled() && this._includes.length === this._loadedIncludes.length;
		},
		
		/**
		 * Compile template from string
		 * @param {String} source	Template string
		 * @type {Template}
		 */
		compile: function(source){
			if( !source )
				throw new smarty.Exception("Empty [source] parameter!");
				
			this._source = source;			
			smarty.Compiler(this);	
			
			return this;
		},
		
		/**
		 * Load template from compiled source
		 * @param {Function} closure	Compiled lambda
		 * @param {Array} includes			Array of includes
		 * @type {Template}
		 */
		load: function(closure, includes){
			if( !smarty.utils.isFunction(closure) )
				throw new smarty.Exception("Parameter 'closure' must be callable!");
			
			this._closure = closure;
			this._includes = includes || [];			
			this._dispatch();
			
			return this;
		},
		
		/**
		 * Return array of includes used in template
		 * @type {Array}
		 */
		getIncludes: function(){
			return this._includes;
		},
		
		/**
		 * Return compiled lambda
		 * @type {Function}
		 */
		getClosure: function(){
			return this._closure;
		},
		
		/**
		 * Return template name
		 * @type {String}
		 */
		getName: function(){
			return this._name;
		},
		
		/**
		 * Return template source
		 * @type {String}
		 */
		getSource: function(){
			return this._source;
		}
	};
	
	/**
	 * Templates register
	 * @type {Array}
	 * @static
	 */
	smarty.Template.templates = [];
	
	/**
	 * Check if exists template with specified name
	 * @param {String} name	Template object name
	 * @type {Boolean}
	 * @static
	 */
	smarty.Template.isExists = function(name){
		return this.templates.hasOwnProperty(name);
	};

	/**
	 * Get template by name
	 * @param {String} name	Template name
	 * @type {smarty.Template}
	 * @static
	 */
	smarty.Template.get = function(name){
		if( !this.isExists(name) )
			throw new smarty.Exception("Template with name '{0}' doesn't exist!", name);
		
		return this.templates[name];
	};

	/**
	 * Register template
	 * @param {smarty.Template} template
	 * @type {smarty.Template}
	 * @static
	 */
	smarty.Template.set = function(template){
		if( !(template instanceof this) )
			throw new smarty.Exception("Only instances of [smarty.Template] can be added!");
		
		return this.templates[template.getName()] = template;
	};
	
	/**
	 * Remove template by name
	 * @param {String} name	Template name
	 * @static
	 */
	smarty.Template.remove = function(name){		
		if( !this.isExists(name) )
			throw new smarty.Exception("Template with name '{0}' doesn't exist!", name);
		
		delete this.templates[name];
	};
	
	/**
	 * Always returns template object. 
	 * If template isn't exists it will be created.
	 * @param {String} name		Template name
	 * @example 
	 * smarty.Template.factory('a');
	 * smarty.Template.factory('b', templateSource);
	 * smarty.Template.factory('c', compiledClosure, arrayOfIncludes);
	 * @type {smarty.Template}
	 */
	smarty.Template.factory = function(name){
		var instance, source = arguments[1] || null;
		if( smarty.Template.isExists(name) )
			instance = smarty.Template.get(name);
		else
			instance = new smarty.Template(name);
			
		if( smarty.utils.isString(source) )
			instance.compile(source);
		else if( smarty.utils.isFunction(source) )
			instance.load(source, smarty.utils.isArray(arguments[2]) ? arguments[2] : []);
			
		return instance;
	};
	
	/*******************************************************************
	 *
	 * Template sandbox class
	 * 
	 *******************************************************************/
	
	/**
	 * Smarty sandbox that is used as context of a compiled template
	 * @param {Object} data	Template data
	 * @constructor
	 */
	smarty.Sandbox = function(data){
		// JSON data to use with template
		this._data = data;		
		// Root namespace name
		this._rootNamespace = "root";
		// Namespaces storage
		this._namespaces = [this._rootNamespace];
		// List of local variables in template
		this._localVars = {};	
		this._localVars[this._rootNamespace] = this._data;
	};
	
	smarty.Sandbox.prototype = {
		constructor: smarty.Sandbox,
		
		/**
		 * Get variable
		 * @param {Object} meta		Variable data
		 * @type {Object}
		 */
		gv: function(meta){		
			var keys = meta.keys || [], len = keys.length;
			if( !len )
				throw new smarty.Exception("Invalid variable data!");
			
			var pos = 0, first = keys[pos++], mods = meta.modifiers || {}, result = '',
			evaluator = function(variable){
				if( pos < len && variable.hasOwnProperty ){
					var key = keys[pos++];
					if( smarty.utils.isObject(key) )
						key = this.gv(key);
					
					if( '' === key || smarty.utils.isUndefined(variable = variable[key]) || null === variable )
						return '';
				
					return evaluator(variable);
				}
				
				return variable;						
			}.bind(this);
			
			var ns, i = this._namespaces.length;
			while( i --> 0 ){
				ns = this._namespaces[i];
				if( this._localVars[ns] && this._localVars[ns].hasOwnProperty(first) ){
					result = evaluator(this._localVars[ns][first]);
					break;
				}
			}
			
			// TODO: Check params for type and implement variables in mod params
			if( null !== mods )
				for( var n in mods )
					if( n in smarty.modifiers )
						result = smarty.modifiers[n].apply(this, [result].concat(mods[n]));		

			return result;
		},

		/**
		 * Set local variable
		 * @param {String}	varname		Name of variable
		 * @param {Mixed}	value		Value
		 * @type {smarty.Sandbox}
		 */
		sv: function(varname, value){
			var namespace = this._namespaces[this._namespaces.length - 1];
			this._localVars[namespace][varname] = value;	
			
			return this;
		},

		/**
		 * Start namespace
		 * @param {String} namespace	Namespace name
		 * @type {smarty.Sandbox}
		 */
		sn: function(namespace){			
			if( this._namespaces.indexOf(namespace) >= 0 )
				throw new smarty.Exception("Namespace '{0}' already exists!", namespace);

			this._namespaces.push(namespace);
			this._localVars[namespace] = {};
			
			return this;
		},

		/**
		 * End namespace
		 * @param {String}	namespace	Namespace to close
		 * @type {smarty.Sandbox}
		 */
		en: function(namespace){			
			if( !namespace || this._namespaces.indexOf(namespace) < 0 )
				namespace = this._namespaces[this._namespaces.length - 1];
			
			if( namespace !== this._rootNamespace )
				while( this._namespaces.length > 0 ){
					var ns = this._namespaces.pop();					
					delete this._localVars[ns];
					if( ns === namespace ) 
						break;
				}
			
			return this;
		},
		
		/**
		 * Include template
		 * @param {String}	name		Template name to include
		 * @type {String}
		 */
		inc: function(name){
			if( !(smarty.Template.isExists(name)) )
				return '';
			
			return smarty.Template.get(name).execSync(this);
		}
	};
	
	/*******************************************************************
	 *
	 * Smarty compiler object
	 * 
	 *******************************************************************/
	
	/**
	 * Compiler
	 * @param {smarty.Template} template	Template
	 * @constructor
	 */
	smarty.Compiler = function(template){
		if( !(this instanceof smarty.Compiler) ){
			if( !(template instanceof smarty.Template) )
				throw new smarty.Exception("[template] must be instance of [smarty.Template]!");
			
			var compiler = new smarty.Compiler();
			compiler._template = template;
			compiler._source = template.getSource();			
			compiler._compile();
			template.load(compiler._closure, compiler._includes);
		} else {
			this._template = null;
			this._closure = null;
			this._source = '';
			this._stack = [];
			this._includes = [];
			this._line = 1;
			this._data = {};
			this._captureName = this.uniqueName('cap_');
		}		
	};
	
	smarty.Compiler.prototype = {
		constructor: smarty.Compiler,
		
		getLine: function(){
			return this._line;
		},
		
		/**
		 * Return assigned template object
		 * @type {smarty.Template}
		 */
		getTemplate: function(){
			return this._template;
		},
		
		/**
		 * Compile template
		 */
		_compile: function(){			
			// Remove comments
			var template = this._source.replace(/\r/g, '').replace(/{\*[\d\D]*?\*}/g, function(full){
				var count = full.split('\n').length - 1;
				return '{@comment ' + count + '}';
			}.bind(this)).split('\n');
			
			var	parsedTpl = [];
			// Iterate over template array and parse strings
			template.forEach(function(string){				
				var parsedString = this._compileString(string);
				parsedTpl.push(parsedString);			
				this._line++;
			}, this);				
			
			// Check all tags to be closed
			var last = null;
			while( this._stack.length > 0 ){	
				last = this._stack.pop();
				if( last.entity.end )
					throw new smarty.CompileException(this, "Open tag '{0}' at line {1} doesn't have close tag!", last.name, last.line);									
			}
			
			//window.console.log(parsedTpl);
			
			// Wrap template compiled code			
			var codeStr = smarty.utils.format("try{\
				var {0} = [];\
				{1}\
				return {0}.join('');\
			} catch( ex ){\
				throw new smarty.RuntimeException(ex.message);\
			}", this._captureName, parsedTpl.join('\n') );			
			
			this._closure = Function(codeStr);	
			
			smarty.debug
			.group('Compiled source: ' + this.getTemplate().getName(), true)
			.log(this._closure.toString())
			.groupEnd();
		},
		
		/**
		 * Generate unique name
		 * @param {String} prefix	Prefix
		 * @type {String}
		 */
		uniqueName: function(prefix){
			var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz',
			length = 6,
			result = prefix || 'var_',
			rnum;

			while( length --> 0 ){
				rnum = Math.floor(Math.random() * (chars.length + 1));
				result += chars.substring(rnum, rnum + 1);
			}

			return result;
		},
		
		/**
		 * Parse template string
		 * @param {String} string	Template string
		 * @type {String}
		 * @todo Add 'after' options support
		 */
		_compileString: function(string){
			// Escape string
			//string = escape(string);
			
			var match, result = [],
			// Helper function
			wrapData = function(data){
				return smarty.utils.format("{0}.push('{1}');", this._captureName, data.replace(/'/g, "\\'"));
			}.bind(this), processExpression = function(entity, body){
				var expression = new smarty.Expression(body), attributes = expression.getAttributes();
				for( var name in entity.attributes )					
					if( name === '_required' ){
						entity.attributes[name].forEach(function(require){
							if( !(require in attributes) )
								throw new smarty.CompileException(this, "Required attribute '{0}' not exists!", require);
						}.bind(this));	
					} else if( attributes[name] ) {
						var types = entity.attributes[name];
						if( !smarty.utils.isArray(types) )
							throw new smarty.CompileException(this, "Invalid attribute's meta definition!");	
						
						var validType = false;
						types.forEach(function(type){
							if( attributes[name] instanceof type )
								validType = true;
						});
						
						if( !validType )
							throw new smarty.CompileException(this, "Invalid attribute type '{0}'!", name);
					}	
					
				return expression;
			}.bind(this);
			
			// Iterate over string with regular expression
			while( null !== (match = /{([$\/@])?([\w][\w\d]*)([^}]*)}/.exec(string)) ){
				// Define entity object
				var entity = {
					full: match[0],
					typeBit: match[1],
					name: match[2],
					body: match[3].trim()
				};					
				
				// Store raw data in result array
				var parts = string.split(entity.full), first = parts.shift();
				if( '' !== first )
					result.push(wrapData(first));
				string = parts.join(entity.full);	
				
				// Preprocessing
				if( entity.typeBit === '$' ){					
					entity.body = 'variable=' + entity.typeBit + entity.name + entity.body;
					entity.name = 'var';
				} else if ( entity.typeBit === '@' ) {	// System token
					if( entity.name === 'comment' )
						return this._line += parseInt(entity.body), '';
				}
								
				var entityData = smarty.entities[entity.name];
					
				// Begin parsing entity					
				if( entityData ) { // Function exists							
					if( entity.typeBit === '/' ) { // It is closing tag		
						if( entityData.end ) {	// Function requires closing tag							
							var prev, passed = false;
							while( (prev = this._stack.pop()) ){
								if( !prev.entity.end )
									continue;

								if( prev.name === entity.name ){
									passed = true;
									break;	
								}
							}								
								
							if( !passed ) // Not found open tag
								throw new smarty.CompileException(this, "Unexpected close tag '{0}'!", entity.name);
								
							// Push instructions in output array
							result.push(entityData.end.call(this, prev.expression));
						} else 
							throw new smarty.CompileException(this, "Tag '{0}' hasn't need close tag!", entity.name);
					} else { // It is opening tag
						if( entityData.depends.length ){ // Check function dependency
							var passed = false, i = this._stack.length;							
							while( !passed && i > 0 )
								if( entityData.depends.indexOf(this._stack[--i].name) >= 0 )
									passed = true;
							
							if( !passed )
								throw new smarty.CompileException(this, "Tag '{0}' must be specified within the following tags: '{1}'!", 
									entity.name, 
									entityData.depends);
						}
						
						var expression = processExpression(entityData, entity.body);
						this._stack.push({
							name: entity.name,		
							body: entity.body,	
							expression: expression,
							entity: entityData,				
							line: this._line
						});
							
						result.push(entityData.start.call(this, expression));
					}
				}
				else
					throw new smarty.CompileException(this, "Undefined entity '{0}'!", entity.name);
			}
			
			// Store input string tail
			if( string !== '' )
				result.push(wrapData(string));
			
			return result.join('');
		}
	};
	
	/**
	 * Expression parser
	 * @param {String} origin	Origin string to parse
	 * @constructor
	 */
	smarty.Expression = function(origin){
		this._origin = origin || '';
		this._pos = -1;
		this._look = 0;
		this._result = '';
		this._attributes = {};
		
		this._parse();
	};
	
	smarty.Expression.prototype = {
		constructor: smarty.Expression,
		
		states: {
			TEXT: 0x100,
			VAR: 0x101,
			MODIFIER: 0x102
		},
		
		toString: function(){
			return this.getResult();
		},
		
		getOrigin: function(){
			return this._origin;
		},
		
		getResult: function(){			
			return this._result;
		},
		
		getPosition: function(){
			return this._pos;
		},
		
		getAttributes: function(){
			return this._attributes;
		},
		
		_next: function(steps){
			this._look = 0;
			return this._origin.charAt(steps ? this._pos += steps : ++this._pos) || false;
		},
		
		_prev: function(steps){
			this._look = 0;
			return this._origin.charAt(steps ? this._pos -= steps : --this._pos) || false;
		},
		
		_rewind: function(pos){
			this._pos = pos || -1;
		},
		
		_lookForward: function(){
			return this._origin.charAt(this._pos + ++this._look);
		},
		
		_lookBackward: function(){
			return this._origin.charAt(this._pos + --this._look);
		},
		
		_countChar: function(ch, forward){
			var count = 0;
			while( (forward ? this._lookForward() : this._lookBackward()) === (ch || '\\') )
				count++;
			
			return count;
		},
		
		/**
		 *
		 */
		_caseVar: function(req){
			var ch, states = {
				BRACKET: 0x1,
				DOT: 0x2
			}, state, quotes = 0, quote, brackets = 0, temp = '', data = {
				keys: [],
				modifiers: {}
			};
				cycle: while( (ch = this._next()) ){
					switch( true ){
						// Exit rule 
						// TODO: Check for [^\w] symbols...
						// TODO: Refactor this method
						// TODO: Add exceptions
						case (/\s|\)/).test(ch) && !quotes:
							this._prev();
							break cycle;
						//					case (/[^\w]/).test(ch) && result.length === 0:
						//						this._error('Variable name must begins only with "\w" characters!');
						//						break;
						//					case (/[^\w\d]/).test(ch) && info.state === 'name':
						//						this._error('Only "\w\d" characters are allowed to use in variable name!');
						//						break;
						// $
						case (/\$/).test(ch):
							//if( info.state !== 'bracket' )
							//this._error('Invalid using of inner variable!');
						
							state = this.states.VAR;
							break;
						// .
						case (/\./).test(ch):	
							if( state === states.BRACKET )
								continue;
						
							state = states.DOT;			
							break;
						// [
						case (/\[/).test(ch):							
							brackets++;
							state = states.BRACKET;							
							break;		
						// ]
						case (/]/).test(ch):	
							--brackets;		
							if( brackets < 0 ){
								this._prev();
								break cycle;
							}
							state = states.BRACKET;							
							break;	
						// quotes
						case (/['"]/).test(ch):
							if( (quotes & 1) && quote === ch ){
								if( !(this._countChar() & 1) )							
									quotes--;
							} else {
								quotes++;
								quote = ch;
							}
							continue;
						case '|' === ch:
							state = this.states.MODIFIER;
							break;
						// text chars
						default:
							state = this.states.TEXT;
							break;
					}
				
					if( quotes )
						state = this.states.TEXT;				
														
					switch( state ){
						case states.DOT:		
						case states.BRACKET:
							temp.length && data.keys.push(temp) && (temp = '');
							break;
						case this.states.VAR:
							data.keys.push(this._caseVar(true));
							break;	
						case this.states.MODIFIER:
							var modifier = this._caseModifier();
							smarty.utils.extend(data.modifiers, modifier);
							break;
						default:
							temp += ch;
							break;
					}
				}
			
			temp.length && data.keys.push(temp);
			
			if( req )
				return data;
			
			this._result += smarty.utils.format("this.gv({0})", JSON.stringify(data));
		},
		
		_caseModifier: function(){
			var ch, quotes = 0, quote, states = {
				NAME: 0x1,
				COLON: 0x2,
				PARAM: 0x3
			}, state = states.NAME, name = '', param = null, params = [];
			
				cycle: while( (ch = this._next()) ){
					switch( true ){	
						// Exit rule
						case (/\s|\)|\|/).test(ch) && !quotes:
							this._prev();
							break cycle;
						// Quotes
						case (/['"]/).test(ch):
							if( (quotes & 1) && quote === ch ){
								if( !(this._countChar() & 1) )							
									quotes--;
							} else {
								quotes++;
								quote = ch;
							}
							continue;
						// Params delimeter
						case (/:/).test(ch):						
							state = states.COLON;
							break;	
						// Check modifier name
						case state === states.NAME && (/[^\w]/).test(ch):
							throw new smarty.Exception("Invalid modifier name!");												
						case state === states.COLON:
							state = states.PARAM;
							break;
					}
				
					if( quotes )
						state = states.PARAM;
					
					switch( state ){
						case states.NAME:
							name += ch;
							break;
						case states.COLON:
							if( null !== param )
								params.push(param);
							
							param = '';
							break;
						case states.PARAM:
							param += ch;
							break;
					}				
				}	
			
			null !== param && params.push(param);
			
			if( !(name in smarty.modifiers) )
				throw new smarty.Exception("Undefined modifier '{0}'!", name);
			
			var result = {};
			result[name] = params;
			//console.dir(result);
			return result;
		},
		
		_caseAttribute: function(){
			var ch, states = {
				KEY: 0x1,
				VALUE: 0x2		
			}, state = states.KEY, key = '', value = '', quotes = 0, quote;
				
			this._prev();
			var prevPos	= this.getPosition();
			
				cycle: while( (ch = this._next()) ){
					switch( true ){
						case (/\s|\)/).test(ch) && !quotes:
							this._prev();
							break cycle;
						case (/['"]/).test(ch):
							if( (quotes & 1) && quote === ch ){
								if( !(this._countChar() & 1) )							
									quotes--;
							} else {
								quotes++;
								quote = ch;
							}
							break;
						case '=' === ch:
							state = states.VALUE;
							continue;
						case state === states.KEY && (/[^\w]/).test(ch):
							break cycle;
						case state !== states.VALUE && (/\s/).test(ch):
							break cycle;	
					}
					
					if( quotes )
						state = states.VALUE;
				
					switch( state ){
						case states.KEY:
							key += ch;
							break;
						case states.VALUE:
							value += ch;
							break;
					}
				}
				
			if( !key.length || !value.length )
				this._rewind(prevPos);
			else
				this._attributes[key] = smarty.AttrTypeFactory(value);				
		},
		
		_parse: function(){			
			var ch, quotes = 0, quote, state, states = {
				VAR: 0x1,
				ATTRIBUTE: 0x2
			};
			while( (ch = this._next()) ) {
				var prevCh = this._lookBackward();
				switch( true ){
					case (/['"]/).test(ch):
						if( (quotes & 1) && quote === ch ){
							if( !(this._countChar() & 1) )							
								quotes--;
						} else {
							quotes++;
							quote = ch;
						}
						break;
					case (/\$/).test(ch):
						state = states.VAR;
						break;
					case (/\w/).test(ch) && ('' === prevCh || /\s/.test(prevCh)) && state !== states.ATTRIBUTE:
						state = states.ATTRIBUTE;
						break;
					default:
						state = this.states.TEXT;
						break;
				}
				
				if( quotes )
					state = this.states.TEXT;
				
				switch( state ){
					case states.VAR:
						this._caseVar()
						break;
					case states.ATTRIBUTE:
						this._caseAttribute();
						break;
					default:
						this._result += ch;
						break;
				}
			}
		}
	};
	
	/*******************************************************************
	 *
	 * Smarty types
	 * 
	 *******************************************************************/
	
	smarty.AttrTypeFactory = function(value){
		var instance, types = {
			Number: /^(-?\d*\.?\d+)$/,						
			Boolean: /^(true|false)$/,			
			Variable: /^\$\w.*$/,
			String: /^.*$/
		};
		
		for( var type in types )
			if( types[type].test(value) ){
				instance = new smarty[type](value);
				break;	
			}
		
		return instance;
	};
	
	smarty.Number = function(value){
		this.value = +value;
	}
	
	smarty.Boolean = function(value){
		this.value = value === 'true' ? true : false;
	}
	
	smarty.String = function(value){
		this.value = '' + value.replace(/^['"]|['"]$/g, '');
	}
	
	smarty.Variable = function(value){
		this.value = new smarty.Expression(value);
	}

	smarty.Number.prototype = {
		constructor: smarty.Number,
		toString: function(){
			return this.value;
		}
	};
	smarty.Boolean.prototype = {
		constructor: smarty.Boolean,
		toString: function(){
			return this.value;
		}
	};
	smarty.String.prototype = {
		constructor: smarty.String,
		toString: function(){
			return "'" + this.value + "'";
		}
	};
	smarty.Variable.prototype = {
		constructor: smarty.Variable,
		toString: function(){
			return this.value.toString();
		}
	};
	
	/*******************************************************************
	 *	Some dark magic! ,O
	 *******************************************************************/
	
	"Boolean,Number,String,Function,Array,Date,RegExp,Object".split(',').forEach(function(item){
		smarty.utils.types[ "[object " + item + "]" ] = item.toLowerCase();
	});
	
	// We are summoning Diablo in this row...:E
	[smarty.Template].forEach(function(obj){
		obj.inherit = function(protoProps, staticProps){
			var child = smarty.utils.inherit(this, protoProps, staticProps);
			child.inherit = this.inherit;
			return child;
		};
	});
	
})(window);

/*******************************************************************
*
* Entities
* 
*******************************************************************/

(function(window){
	var smarty = window.smarty;
	
	/*
	 * OPERATORS
	 */

	/*
	 * SYSTEM: var
	 */
	smarty.addEntity('var', {
		attributes: {
			_required: ['variable'],
			variable: [smarty.Variable]
		},
		start: function(expression){
			var attr = expression.getAttributes();
			return smarty.utils.format('{0}.push({1});', this._captureName, attr.variable);
		}
	});

	/*
	 * IF operator
	 */
	smarty.addEntity('if', {
		start: function(expression){
			return smarty.utils.format("/* IF */ if({0}){", expression);
		},
	
		end: function(){
			return '} /* ENDIF */';
		}
	});

	/*
	 * ELSE operator
	 */
	smarty.addEntity('else', {
		start: function(){
			return '} /* ELSE */ else{';
		},
		after: ['elseif'],
		depends: ['if']
	});

	/*
	 * ELSEIF operator
	 */
	smarty.addEntity('elseif', {
		start: function(expression){
			return smarty.utils.format("} /* ELSEIF */ else if({0}){", expression);
		},
		depends: ['if']
	});

	/*
	 * BREAK operator
	 */
	smarty.addEntity('break', {
		start: function(){
			return '/* BREAK */ break;'
		},
		depends: ['foreach', 'while']
	});

	/*
	 * CONTINUE operator
	 */
	smarty.addEntity('continue', {
		start: function(){
			return '/* CONTINUE */ continue;'
		},
		depends: ['foreach', 'while']
	});

	/*
	 * FOREACH operator
	 */
	smarty.addEntity('foreach', {
		attributes: {
			_required: ['from', 'item'],
			from: [smarty.Variable],
			item: [smarty.String],
			key: [smarty.String],
			name: [smarty.String]
		},
		start: function(expression){
			var attr = expression.getAttributes();
		
			this._data.foreachMeta = this.uniqueName();
		
			var obj = this.uniqueName(), key = this.uniqueName(), ns = this.uniqueName('ns_'),
			result = smarty.utils.format("/* FOREACH */\
			var {0} = {1}, {2} = { key: null, iteration: 0, total: smarty.utils.count({0}), first: true, last: false };\
			this.sn('{3}');", obj, attr.from, this._data.foreachMeta, ns);
		
			if( attr.name )
				result += smarty.utils.format("this.sv({0}, {1});", attr.name, this._data.foreachMeta);
				
			result += smarty.utils.format("\
			if( smarty.utils.isObject({1}) || smarty.utils.isArray({1}) )\
				for(var {0} in {1}){\
					if(!{1}.hasOwnProperty({0})) continue;\
					smarty.utils.extend({2}, {\
						key: {0},\
						first: {2}.iteration == 0,\
						last: {2}.iteration == {2}.total - 1\
					}), {2}.iteration++;\
					this.sv({3}, {1}[{0}]);",			
				key, obj, this._data.foreachMeta, attr.item );
			
			if( attr.key )
				result += smarty.utils.format("this.sv({0}, {1});", attr.key, key);
		
			return result;
		},
		end: function() {
			return "}this.en(); /* ENDFOREACH */";
		}
	});

	/*
	 * FOREACHELSE operator
	 */
	smarty.addEntity('foreachelse', {
		start: function(){
			return smarty.utils.format("} /* FOREACHELSE */ if({0}.iteration === 0){", this._data.foreachMeta);
		},
		depends: ['foreach']
	});

	/*
	 * FOR operator
	 */

	smarty.addEntity('for', {
		attributes: {
			_required: ['from', 'to'],
			from: [smarty.Variable, smarty.Number],
			to: [smarty.Variable, smarty.Number],
			step: [smarty.Variable, smarty.Number],
			name: [smarty.String]
		},
		start: function(expression){
			var attr = expression.getAttributes();
		
		
			var meta = this.uniqueName(), ns = this.uniqueName('ns_'), start = this.uniqueName(), end = this.uniqueName(),		
			result = smarty.utils.format("/* FOR */\
			var {0} = { index: 0, iteration: 0 };\
			this.sn('{1}');", meta, ns);
		
			if( attr.name )
				result += smarty.utils.format("this.sv({0}, {1});", attr.name, meta);
		
			result += smarty.utils.format("for(var {0} = {1}, {2} = {3}; {0} <= {2}; {0} += {4}){\
			{5}.iteration++, smarty.utils.extend({5}, { index: {0} });", start, attr.from, end, attr.to, attr.step || 1, meta);
		
			return result;
		},
		end: function(){
			return "}this.en(); /* ENDFOR */";
		}
	});

	/*
	 * WHILE operator
	 */
	smarty.addEntity('while', {
		start: function(expression){
			return smarty.utils.format("/* WHILE */ while({0}){", expression);
		},
		end: function(){
			return "} /* ENDWHILE */";
		}
	});

	/*
	 * CAPTURE operator
	 */
	smarty.addEntity('capture', {
		attributes: {
			_required: ['assign'],
			assign: [smarty.String]
		},
		start: function(){
			this._data.captureName = this.uniqueName('cap_');	
			this._data.oldCaptureName = this._captureName;
			this._captureName = this._data.captureName;
		
			return smarty.utils.format("/* CAPTURE */ var {0} = [];", this._data.captureName);	
		},
	
		end: function(expression){
			var attr = expression.getAttributes();		
			this._captureName = this._data.oldCaptureName;
		
			return smarty.utils.format("this.sv({0}, {1}); /* ENDCAPTURE */", attr.assign, this._data.captureName);
		}
	});

	/*
	 * FUNCTIONS
	 */

	/*
	 * INCLUDE function
	 */
	smarty.addEntity('include', {
		attributes: {
			_required: ['file'],
			file: [smarty.String, smarty.Variable],
			assign: [smarty.String]
		},
		start: function(expression){
			var attr = expression.getAttributes();
		
			this._includes.push(attr.file.value);
		
			var result = smarty.utils.format("/* INCLUDE */ this.sn({0});", attr.file);		
			for( var key in attr )
				if( attr.hasOwnProperty(key) && !(key in smarty.entities['include'].attributes) )
					result += smarty.utils.format("this.sv('{0}', {1});", key, attr[key]);
		
			if( attr.assign )	
				result += smarty.utils.format("this.sv({0}, this.inc({1}));", attr.assign, attr.file);
			else
				result += smarty.utils.format("{0}.push(this.inc({1}));", this._captureName, attr.file);
			
			return result += smarty.utils.format("this.en({0}); /* ENDINCLUDE */", attr.file);
		}
	});

	smarty.addEntity('dump', {
		start: function(expression){
			return smarty.utils.format("console.log({0});", expression);
		}
	});

	smarty.addEntity('html_options', {
		attributes: {
			_required: ['options'],
			options: [smarty.Variable],
			selected: [smarty.String, smarty.Variable]
		},
		start: function(expression){
			// TODO: Implement it
			return "";
		}
	});

	smarty.addEntity('html_radios', {
		attributes: {
			_required: ['options'],
			options: [smarty.Variable],
			selected: [smarty.String, smarty.Variable],
			separator: [smarty.String, smarty.Variable],
			name: [smarty.String]
		},
		start: function(expression){
			// TODO: Implement it
			return "";
		}
	});

	smarty.addEntity('assign', {
		attributes: {
			_required: ['var', 'value'],
			'var': [smarty.String],
			value: [smarty.String, smarty.Variable, smarty.Number, smarty.Boolean]
		},
		start: function(expression){
			var attr = expression.getAttributes();
		
			return smarty.utils.format("/* ASSIGN */ this.sv({0}, {1}); /* ENDASSIGN */", attr['var'], attr.value);
		}
	});

	/*******************************************************************
	*
	* Modifiers
	* 
	*******************************************************************/

	/**
	 * Return default value if var is empty
	 * @param {Object}	input	Origin variable value
	 * @param {String}	value	Default variable value if its empty
	 * @example {$balalaika|default:'broken'}
	 */
	smarty.addModifier('default', function(input, value){
		if( smarty.modifiers.empty(input) )
			return value;
	
		return input;
	});

	/**
	 * Return length (count) of an object or an array
	 * @param {Object|Array} input
	 * @type {Number}
	 * @example {$vodka|length}
	 */
	smarty.addModifier('length', function(input){
		if( smarty.utils.isString(input) )
			return input.length;
	
		return smarty.utils.count(input);
	});

	/**
	 * Returns substring from 'start' and to 'start' + 'length'
	 * @param {String}	input	Input string
	 * @param {Number}	start	Index to start from
	 * @param {Number}	length	Length of substring
	 * @type {String}
	 * @example {$matryoshka|substr:0:2}
	 */
	smarty.addModifier('substr', function(input, start, length){
		if( !smarty.utils.isString(input) )
			return '';
	
		return input.substr(start, length);
	});

	/**
	 * Returns string transformed to upper case
	 * @param {String} input	Origin string
	 * @type {String}
	 * @example {$shapkaUshanka|upper}
	 */
	smarty.addModifier('upper', function(input){
		if( !smarty.utils.isString(input) )
			return '';
	
		return input.toUpperCase();
	});

	/**
	 * Returns string transformed to lower case
	 * @param {String} input	Origin string
	 * @type {String}
	 * @example {$shapkaUshanka|lower}
	 */
	smarty.addModifier('lower', function(input){
		if( !smarty.utils.isString(input) )
			return '';
	
		return input.toLowerCase();
	});

	/**
	 * Returns origin string with appended 'value' at the end
	 * @param {String}	input	Origin string
	 * @param {String}	value	String to append
	 * @type {String}
	 * @example {$medvedi|cat:' on a becycle'}
	 */
	smarty.addModifier('cat', function(input, value){
		if( !smarty.utils.isString(input) )
			return '';
	
		return input + (value || '');
	});

	/**
	 * Replace '\n' with '<br />'
	 * @param {String} input	Origin string
	 * @type {String}
	 * @example {$babushka|nl2br}
	 */
	smarty.addModifier('nl2br', function(input){
		if( !smarty.utils.isString(input) )
			return '';
	
		return input.replace(/\n/, '<br />');
	});

	smarty.addModifier('date_format', function(input){
		// TODO: Implement
		return input;
	});

	smarty.addModifier('truncate', function(input, length, tail){
		return input.substr(0, length) + (tail || '');
	});

	smarty.addModifier('split', function(input, separator, limit){
		if( !smarty.utils.isString(input) )
			return [];
	
		return input.split(separator, limit);
	});

	smarty.addModifier('join', function(input, separator){
		if( !smarty.utils.isArray(input) )
			return '';
	
		return input.join(separator);
	});

	smarty.addModifier('isset', function(input){
		if( smarty.utils.isUndefined(input) || null === input )
			return false;
	
		return true;
	});

	smarty.addModifier('empty', function(input){
		if( !input )
			return true;

		if( smarty.utils.isArray(input) || smarty.utils.isObject(input) )
			return smarty.utils.count(input) === 0;			
	
		return false;
	});

	// TODO: add test
	smarty.addModifier('escape', function(input, type){
		var doc = document, eu = encodeURI;
		switch( '' + type ){
			case 'html':
				var div = doc.createElement('div'), text = doc.createTextNode(input);
				div.appendChild(text);
				input = div.innerHTML;		
				break;
			case 'url':
				input = eu(input);
				break;
			case 'urlpathinfo':
				input = eu(input).replace('%2F', '/');
				break;
			case 'quotes':
				input = input.replace(/(['"])/g, "\\$1");
				break;
			case 'hex':
				break;
			case 'hexentity':
				break;
			case 'javascript':
				break;
			case 'mail':
				break;
		}
	
		return input;
	});
	
	// TODO: add test
	smarty.addModifier('date_format', function(input, format){
		var date;
		// Mysql datetime format
		if( (date = /(\d{4})-(\d{2})-(\d{2})\s(\d{2}):(\d{2}):(\d{2})/.exec(input)) )
			date = new Date(date[1], date[2], date[3], date[4], date[5], date[6]);
		else
			date = new Date(input);
		
		return !isNaN(+date) ? smarty.utils.strftime(format, date) : '';
	});

// TODO strtotime, date_format
})(window);