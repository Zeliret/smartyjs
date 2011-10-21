
/**
 * Smarty templater
 *
 * @author Artem Shalaev <artem.shalaev@gmail.com>, Sep 27, 2011 1:51:28 PM
 * @copyright MegaGroup © 2011, megagroup.ru
 * @access public
 * @package Smarty.js
 * @version 1.0.0 beta
 * 
 * [~] - switched off, [-] - removed, [+] - added, [*] - modified 
 * 
 * [~] Literal support 
 * 
 * Supports: if, else, elseif, foreach, foreachelse, break, continue, while, capture, include
 * 
 * @todo Parser exceptions with position
 * @todo Parser support for screened quotes
 */

(function(window){
	'use strict';
	
	if( void 0 !== window.smarty )
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
	
	var smarty = {
		entities: {},
		modifiers: {},
		settings: {},
		
		configure: function(settings){
			this.settings = smarty.utils.extend({
				isDebug: false,
				includeHandler: function(){
					throw new smarty.Exception("Method isn't implemented yet!");
				},
				includeTimeout: 3000
			}, settings || {}); 
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
				throw new this.Exception("[options.after] and 'options.depends' must be an [Array]!");
			
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
	 * Exception class
	 * 
	 *******************************************************************/
	
	/**
	 * Exception
	 * @constructor
	 * @todo add parser pos
	 */
	smarty.Exception = smarty.utils.inherit(Error, smarty.Exception = {
		constructor: function(ex){
			this.name = 'SmartyException';

			if( ex instanceof Error ){
				this.message = ex.message;
			} else {
				this.message = smarty.utils.format("[{0}:{1}] {2} ", 
					smarty.Template.current ? smarty.Template.current.getName() : '*',
					smarty.Compiler.current ? smarty.Compiler.current.getLine() + 1 : 0,
					smarty.utils.format.apply(smarty.utils, Array.prototype.slice.call(arguments)));
			}			
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
	}, includesTimeoutHandler = null;
	
	var templateIdCounter = 0;
	
	/**
	 * Create template instance
	 * @constructor
	 * @param {String} name	Template name
	 */
	smarty.Template = function(name){
		name || (name = 'tpl_'+ templateIdCounter++);
		
		if( !(this instanceof smarty.Template) ){			
			var instance, source = arguments[1] || null;
			if( smarty.Template.isExists(name) )
				instance = smarty.Template.get(name);
			else
				instance = new smarty.Template(name);
			
			if( smarty.utils.isString(source) )
				instance.compile(source);
			else if( smarty.utils.isFunction(source) )
				instance.load(source, arguments[2] || []);
			else 
				throw new smarty.Exception("Invalid source type! Can't create instance of [smarty.Template]!");
			
			return instance;
		}
	
		if( smarty.Template.isExists(name) )
			throw new smarty.Exception("Template with name '{0}' already exists!", name);
		
		// Template name
		this._name = name;
		// Template source
		this._source = null;		
		
		this._closure = null;
		this._includes = [];
		this._loadedIncludes = [];
		this._includesMap = {};
		
		smarty.Template.current = this;
		
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
				throw new smarty.Exception("Empty 'source' parameter!");
				
			this._source = source;
			
			var compiler = new smarty.Compiler(this._source);	
			this._closure = compiler.getClosure();
			this._includes = compiler.getIncludes() || [];
			this._dispatch();	
			
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
				if( this._localVars[ns].hasOwnProperty(first) ){
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
	 * @param {String} source	Input template source
	 * @constructor
	 */
	smarty.Compiler = function(source){
		this._source = source;		
		this._stack = [];
		this._offset = 0;
		this._data = {};
		this._captureName = this.uniqueName('cap_');
		
		this._closure = null;
		this._line = 0;		
		this._includes = [];
		
		smarty.Compiler.current = this;
		
		this._compile();
	};
	
	smarty.Compiler.prototype = {
		constructor: smarty.Compiler,
		
		/**
		 * Get compiled closure
		 * @type {Function}
		 */
		getClosure: function(){
			return this._closure;
		},
		
		/**
		 * Get array of includes
		 * @type {Array}
		 */
		getIncludes: function(){
			return this._includes;
		},
		
		getLine: function(){
			return this._line;
		},
		
		/**
		 * Compile template
		 */
		_compile: function(){			
			// Remove comments
			var template = this._source.replace(/{\*[\d\D]*?\*}/g, function(full){
				this._offset += full.split('\n').length - 1;
				return '';
			}.bind(this)).split('\n');
			
			// Store current template line
			this._line = this._offset;
			
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
					throw new smarty.Exception("Unexpected close tag '/{0}'. Open tag specified at line {1}!", last.name, last.line);									
			}
			
			//window.console.log(parsedTpl);
			
			// Wrap template compiled code			
			var codeStr = smarty.utils.format("try{\
				var {0} = [];\
				{1}\
				return {0}.join('');\
			} catch( ex ){\
				throw new smarty.Exception('Template runtime error: ' + ex.message);\
			}", this._captureName, parsedTpl.join('') );			
			console.log(codeStr);
			this._closure = Function(codeStr);	
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
								throw new smarty.Exception("Required attribute '{0}' not exists!", require);
						});	
					} else if( attributes[name] ) {
						var types = entity.attributes[name];
						if( !smarty.utils.isArray(types) )
							throw new smarty.Exception("Invalid attribute's meta definition!");	
						
						var validType = false;
						types.forEach(function(type){
							if( attributes[name] instanceof type )
								validType = true;
						});
						
						if( !validType )
							throw new smarty.Exception("Invalid attribute type '{0}'!", name);
					}	
					
				return expression;
			};
			
			// Iterate over string with regular expression
			while( null !== (match = /{([$\/])?([\w][\w\d]*)([^}]*)}/.exec(string)) ){
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
				}
								
				var entityData = smarty.entities[entity.name];
					
				// Begin parsing entity					
				if( entityData ) { // Function exists							
					if( entity.typeBit === '/' ) { // It is closing tag		
						if( entityData.end ) {	// Function requires closing tag							
							var prev;
							while( (prev = this._stack.pop()) ){
								if( !prev.entity.end )
									continue;

								if( prev.name === entity.name ) // Invalid closing tag
									break;	
								
								throw new smarty.Exception("Unexpected close tag '{0}'!", entity.name);
							}								
								
							if( !prev ) // Not found closing tag
								throw new smarty.Exception("Unexpected open tag '{0}'!", entity.name);
								
							// Push instructions in output array
							result.push(entityData.end.call(this, prev.expression));
						} else 
							throw new smarty.Exception("Tag '{0}' hasn't need close tag!", entity.name);
					} else { // It is opening tag
						if( entityData.depends.length ){ // Check function depending
							var passed = false, i = this._stack.length;							
							while( !passed && i > 0 )
								if( entityData.depends.indexOf(this._stack[--i].name) >= 0 )
									passed = true;
							
							if( !passed )
								throw new smarty.Exception("Tag '{0}' must be specified within the following tags: '{1}'!", 
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
					throw new smarty.Exception("Undefined entity '{0}'!", entity.name);
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
			}, state = states.NAME, name = '', param = '', params = [];
			
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
							param.length && params.push(param) && (param = '');
							break;
						case states.PARAM:
							param += ch;
							break;
					}				
				}	
			
			param.length && params.push(param);
			
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
	
	window.smarty = smarty;
	
})(window);

/*******************************************************************
*
* Entities
* 
*******************************************************************/

/*
 * COMPILERS
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
			var {0} = {1}, {2} = { key: null, iteration: 0 };\
			this.sn('{3}');", obj, attr.from, this._data.foreachMeta, ns);
		
		if( attr.name )
			result += smarty.utils.format("this.sv({0}, {1});", attr.name, this._data.foreachMeta);
				
		result += smarty.utils.format("\
			if( smarty.utils.isObject({1}) || smarty.utils.isArray({1}) )\
				for(var {0} in {1}){\
					if(!{1}.hasOwnProperty({0})) continue;\
					{2}.iteration++, smarty.utils.extend({2}, {\
						key: {0}\
					});\
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
			
		return result += smarty.utils.format("this.en({0});", attr.file);
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

/*******************************************************************
*
* Modifiers
* 
*******************************************************************/

smarty.addModifier('default', function(input, value){
	if( !input )
		return value;
	
	return input;
});

smarty.addModifier('length', function(input){
	if( smarty.utils.isString(input) || smarty.utils.isArray(input) )
		return input.length;
	
	if( smarty.utils.isObject(input) ){
		var length = 0;
		for( var n in input )
			if( input.hasOwnProperty(n) )
				length++;
		
		return length;
	}
	
	return 0;
});

smarty.addModifier('substr', function(input, start, length){
	if( !smarty.utils.isString(input) )
		return '';
	
	return input.substr(start, length);
});

smarty.addModifier('upper', function(input){
	if( !smarty.utils.isString(input) )
		return '';
	
	return input.toUpperCase();
});

smarty.addModifier('lower', function(input){
	if( !smarty.utils.isString(input) )
		return '';
	
	return input.toLowerCase();
});

smarty.addModifier('cat', function(input, value){
	if( !smarty.utils.isString(input) )
		return '';
	
	return input + (value || '');
});

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
	return !smarty.modifiers.empty(input);
});

smarty.addModifier('empty', function(input){
	if( smarty.utils.isUndefined(input) || null === input || false == input )
		return true;

	if( smarty.utils.isArray(input) || smarty.utils.isObject(input) )
		return smarty.utils.count(input) > 0;			
	
	return false;
});

smarty.addModifier('escape', function(input, type){
	// TODO: Implement
	return input;
});

// TODO strtotime, date_format, escape