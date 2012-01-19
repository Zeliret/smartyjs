/*
 Smarty templater

 @author Artem Shalaev <artem.shalaev@gmail.com>, Sep 27, 2011 1:51:28 PM
 @copyright MegaGroup ? 2011, megagroup.ru
 @access public
 @package Smarty.js
 @version 1.0.1

 [~] - switched off, [-] - removed, [+] - added, [*] - modified

 [~] Literal support

 Supports: if, else, elseif, foreach, foreachelse, break, continue, while, capture, include

 @todo Parser exceptions with position
 @todo Parser support for screened quotes
 @todo Parsing expression into indexed array
 @todo Custom user functions
*/
(function(l){if(void 0===b){Function.prototype.bind||(Function.prototype.bind=function(a){if("function"!==typeof this)throw new TypeError("Function.prototype.bind - what is trying to be fBound is not callable");var b=Array.prototype.slice.call(arguments,1),j=this,c=function(){},f=function(){return j.apply(this instanceof c?this:a||l,b.concat(Array.prototype.slice.call(arguments)))};c.prototype=this.prototype;f.prototype=new c;return f});Array.prototype.forEach||(Array.prototype.forEach=function(a,
b){var j,c;if(null==this)throw new TypeError(" this is null or not defined");var f=Object(this),h=f.length>>>0;if("[object Function]"!={}.toString.call(a))throw new TypeError(a+" is not a function");b&&(j=b);for(c=0;c<h;){var i;c in f&&(i=f[c],a.call(j,i,c,f));c++}});String.prototype.trim||(String.prototype.trim=function(){return this.replace(/^\s+|\s+$/g,"")});var b=l.smarty={entities:{},modifiers:{},settings:{isDebug:!1,includeHandler:function(){throw new b.Exception("Method 'includeHandler' isn't implemented yet!");
},includeTimeout:3E3},configure:function(a){this.settings=b.utils.extend(this.settings,a||{});return this},addModifier:function(a,b){if(!this.utils.isFunction(b))throw new this.Exception("Parameter 'modifier' must be callable!");this.modifiers[a]=b;return this},addFunction:function(a,b){this.addEntity(a,{start:b});return this},addOperator:function(a,b,j){this.addEntity(a,{start:b,end:j});return this},addEntity:function(a,d){d=this.utils.extend({attributes:{_required:[]},start:function(){return""},
end:void 0,after:[],depends:[]},d||{});if(!this.utils.isFunction(d.start))throw new this.Exception("Callback [options.start] must be callable!");if(!this.utils.isUndefined(d.end)&&!this.utils.isFunction(d.end))throw new this.Exception("Callback [options.end] must be callable or [undefined]!");if(!this.utils.isArray(d.after)||!this.utils.isArray(d.depends))throw new this.Exception("[options.after] and [options.depends] must be an [Array]!");if(!this.utils.isObject(d.attributes))throw new this.Exception("[options.attributes] must be an [Object]!");
if(!b.utils.isArray(d.attributes._required))throw new b.Exception("[options.attributes._required] must be an [Array]!");d.attributes._required.forEach(function(a){if(!(a in d.attributes))throw new b.Exception("'{0}' is defined in require list, but isn't defined in attributes list!",a);});this.entities[a]=d;return this}};b.utils={types:{},getenv:function(a){return!this.php_js||!this.php_js.ENV||!this.php_js.ENV[a]?!1:this.php_js.ENV[a]},setlocale:function(a,b){var c="",e=[],f=0,f=l.document,h=function n(a){if(a instanceof
RegExp)return RegExp(a);if(a instanceof Date)return new Date(a);var b={},d;for(d in a)b[d]="object"===typeof a[d]?n(a[d]):a[d];return b},i=function(a){return 1!==a?1:0},k=function(a){return 1<a?1:0},g=this.php_js=this.php_js||{};if(!g.locales)g.locales={},g.locales.en={LC_COLLATE:function(a,b){return a==b?0:a>b?1:-1},LC_CTYPE:{an:/^[A-Za-z\d]+$/g,al:/^[A-Za-z]+$/g,ct:/^[\u0000-\u001F\u007F]+$/g,dg:/^[\d]+$/g,gr:/^[\u0021-\u007E]+$/g,lw:/^[a-z]+$/g,pr:/^[\u0020-\u007E]+$/g,pu:/^[\u0021-\u002F\u003A-\u0040\u005B-\u0060\u007B-\u007E]+$/g,
sp:/^[\f\n\r\t\v ]+$/g,up:/^[A-Z]+$/g,xd:/^[A-Fa-f\d]+$/g,CODESET:"UTF-8",lower:"abcdefghijklmnopqrstuvwxyz",upper:"ABCDEFGHIJKLMNOPQRSTUVWXYZ"},LC_TIME:{a:"Sun,Mon,Tue,Wed,Thu,Fri,Sat".split(","),A:"Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday".split(","),b:"Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec".split(","),B:"January,February,March,April,May,June,July,August,September,October,November,December".split(","),c:"%a %d %b %Y %r %Z",p:["AM","PM"],P:["am","pm"],r:"%I:%M:%S %p",x:"%m/%d/%Y",
X:"%r",alt_digits:"",ERA:"",ERA_YEAR:"",ERA_D_T_FMT:"",ERA_D_FMT:"",ERA_T_FMT:""},LC_MONETARY:{int_curr_symbol:"USD",currency_symbol:"$",mon_decimal_point:".",mon_thousands_sep:",",mon_grouping:[3],positive_sign:"",negative_sign:"-",int_frac_digits:2,frac_digits:2,p_cs_precedes:1,p_sep_by_space:0,n_cs_precedes:1,n_sep_by_space:0,p_sign_posn:3,n_sign_posn:0},LC_NUMERIC:{decimal_point:".",thousands_sep:",",grouping:[3]},LC_MESSAGES:{YESEXPR:"^[yY].*",NOEXPR:"^[nN].*",YESSTR:"",NOSTR:""},nplurals:i},
g.locales.en_US=h(g.locales.en),g.locales.en_US.LC_TIME.c="%a %d %b %Y %r %Z",g.locales.en_US.LC_TIME.x="%D",g.locales.en_US.LC_TIME.X="%r",g.locales.en_US.LC_MONETARY.int_curr_symbol="USD ",g.locales.en_US.LC_MONETARY.p_sign_posn=1,g.locales.en_US.LC_MONETARY.n_sign_posn=1,g.locales.en_US.LC_MONETARY.mon_grouping=[3,3],g.locales.en_US.LC_NUMERIC.thousands_sep="",g.locales.en_US.LC_NUMERIC.grouping=[],g.locales.en_GB=h(g.locales.en),g.locales.en_GB.LC_TIME.r="%l:%M:%S %P %Z",g.locales.en_AU=h(g.locales.en_GB),
g.locales.C=h(g.locales.en),g.locales.C.LC_CTYPE.CODESET="ANSI_X3.4-1968",g.locales.C.LC_MONETARY={int_curr_symbol:"",currency_symbol:"",mon_decimal_point:"",mon_thousands_sep:"",mon_grouping:[],p_cs_precedes:127,p_sep_by_space:127,n_cs_precedes:127,n_sep_by_space:127,p_sign_posn:127,n_sign_posn:127,positive_sign:"",negative_sign:"",int_frac_digits:127,frac_digits:127},g.locales.C.LC_NUMERIC={decimal_point:".",thousands_sep:"",grouping:[]},g.locales.C.LC_TIME.c="%a %b %e %H:%M:%S %Y",g.locales.C.LC_TIME.x=
"%m/%d/%y",g.locales.C.LC_TIME.X="%H:%M:%S",g.locales.C.LC_MESSAGES.YESEXPR="^[yY]",g.locales.C.LC_MESSAGES.NOEXPR="^[nN]",g.locales.fr=h(g.locales.en),g.locales.fr.nplurals=k,g.locales.fr.LC_TIME.a="dim,lun,mar,mer,jeu,ven,sam".split(","),g.locales.fr.LC_TIME.A="dimanche,lundi,mardi,mercredi,jeudi,vendredi,samedi".split(","),g.locales.fr.LC_TIME.b="jan,f\u00e9v,mar,avr,mai,jun,jui,ao\u00fb,sep,oct,nov,d\u00e9c".split(","),g.locales.fr.LC_TIME.B="janvier,f\u00e9vrier,mars,avril,mai,juin,juillet,ao\u00fbt,septembre,octobre,novembre,d\u00e9cembre".split(","),
g.locales.fr.LC_TIME.c="%a %d %b %Y %T %Z",g.locales.fr.LC_TIME.p=["",""],g.locales.fr.LC_TIME.P=["",""],g.locales.fr.LC_TIME.x="%d.%m.%Y",g.locales.fr.LC_TIME.X="%T",g.locales.fr_CA=h(g.locales.fr),g.locales.fr_CA.LC_TIME.x="%Y-%m-%d";if(!g.locale)if(g.locale="en_US",f.getElementsByTagNameNS&&f.getElementsByTagNameNS("http://www.w3.org/1999/xhtml","html")[0])if(f.getElementsByTagNameNS("http://www.w3.org/1999/xhtml","html")[0].getAttributeNS&&f.getElementsByTagNameNS("http://www.w3.org/1999/xhtml",
"html")[0].getAttributeNS("http://www.w3.org/XML/1998/namespace","lang"))g.locale=f.getElementsByTagName("http://www.w3.org/1999/xhtml","html")[0].getAttributeNS("http://www.w3.org/XML/1998/namespace","lang");else{if(f.getElementsByTagNameNS("http://www.w3.org/1999/xhtml","html")[0].lang)g.locale=f.getElementsByTagNameNS("http://www.w3.org/1999/xhtml","html")[0].lang}else if(f.getElementsByTagName("html")[0]&&f.getElementsByTagName("html")[0].lang)g.locale=f.getElementsByTagName("html")[0].lang;g.locale=
g.locale.replace("-","_");if(!(g.locale in g.locales)&&g.locale.replace(/_[a-zA-Z]+$/,"")in g.locales)g.locale=g.locale.replace(/_[a-zA-Z]+$/,"");if(!g.localeCategories)g.localeCategories={LC_COLLATE:g.locale,LC_CTYPE:g.locale,LC_MONETARY:g.locale,LC_NUMERIC:g.locale,LC_TIME:g.locale,LC_MESSAGES:g.locale};if(null===b||""===b)b=this.getenv(a)||this.getenv("LANG");else if("[object Array]"===Object.prototype.toString.call(b))for(f=0;f<b.length;f++)if(b[f]in this.php_js.locales){b=b[f];break}else if(f===
b.length-1)return!1;if("0"===b||0===b){if("LC_ALL"===a){for(c in this.php_js.localeCategories)e.push(c+"="+this.php_js.localeCategories[c]);return e.join(";")}return this.php_js.localeCategories[a]}if(!(b in this.php_js.locales))return!1;if("LC_ALL"===a)for(c in this.php_js.localeCategories)this.php_js.localeCategories[c]=b;else this.php_js.localeCategories[a]=b;return b},strftime:function(a,b){this.php_js=this.php_js||{};this.setlocale("LC_ALL","en");for(var c=this.php_js,e=function(a,b,d){for("undefined"===
typeof d&&(d=10);parseInt(a,10)<d&&1<d;d/=10)a=b.toString()+a;return a.toString()},f=c.locales[c.localeCategories.LC_TIME].LC_TIME,h={a:function(a){return f.a[a.getDay()]},A:function(a){return f.A[a.getDay()]},b:function(a){return f.b[a.getMonth()]},B:function(a){return f.B[a.getMonth()]},C:function(a){return e(parseInt(a.getFullYear()/100,10),0)},d:["getDate","0"],e:["getDate"," "],g:function(a){return e(parseInt(this.G(a)/100,10),0)},G:function(a){var b=a.getFullYear(),d=parseInt(h.V(a),10),a=parseInt(h.W(a),
10);a>d?b++:0===a&&52<=d&&b--;return b},H:["getHours","0"],I:function(a){a=a.getHours()%12;return e(0===a?12:a,0)},j:function(a){var b=a-new Date(""+a.getFullYear()+"/1/1 GMT"),b=b+6E4*a.getTimezoneOffset(),a=parseInt(b/6E4/60/24,10)+1;return e(a,0,100)},k:["getHours","0"],l:function(a){a=a.getHours()%12;return e(0===a?12:a," ")},m:function(a){return e(a.getMonth()+1,0)},M:["getMinutes","0"],p:function(a){return f.p[12<=a.getHours()?1:0]},P:function(a){return f.P[12<=a.getHours()?1:0]},s:function(a){return Date.parse(a)/
1E3},S:["getSeconds","0"],u:function(a){a=a.getDay();return 0===a?7:a},U:function(a){var b=parseInt(h.j(a),10),a=6-a.getDay(),b=parseInt((b+a)/7,10);return e(b,0)},V:function(a){var b=parseInt(h.W(a),10),d=(new Date(""+a.getFullYear()+"/1/1")).getDay(),b=b+(4<d||1>=d?0:1);53===b&&4>(new Date(""+a.getFullYear()+"/12/31")).getDay()?b=1:0===b&&(b=h.V(new Date(""+(a.getFullYear()-1)+"/12/31")));return e(b,0)},w:"getDay",W:function(a){var b=parseInt(h.j(a),10),a=7-h.u(a),b=parseInt((b+a)/7,10);return e(b,
0,10)},y:function(a){return e(a.getFullYear()%100,0)},Y:"getFullYear",z:function(a){var a=a.getTimezoneOffset(),b=e(parseInt(Math.abs(a/60),10),0),d=e(a%60,0);return(0<a?"-":"+")+b+d},Z:function(a){return a.toString().replace(/^.*\(([^)]+)\)$/,"$1")},"%":function(){return"%"}},i="undefined"==typeof b?new Date:"object"==typeof b?new Date(b):new Date(1E3*b),k={c:"locale",D:"%m/%d/%y",F:"%y-%m-%d",h:"%b",n:"\n",r:"locale",R:"%H:%M",t:"\t",T:"%H:%M:%S",x:"locale",X:"locale"};a.match(/%[cDFhnrRtTxX]/);)a=
a.replace(/%([cDFhnrRtTxX])/g,function(a,b){var d=k[b];return"locale"===d?f[b]:d});return a.replace(/%([aAbBCdegGHIjklmMpPsSuUVwWyYzZ%])/g,function(a,b){var d=h[b];return"string"===typeof d?i[d]():"function"===typeof d?d(i):"object"===typeof d&&"string"===typeof d[0]?e(i[d[0]](),d[1]):b})},htmlspecialchars:function(a,b,c,e){var f=c=0,h=!1;if("undefined"===typeof b||null===b)b=2;a=a.toString();!1!==e&&(a=a.replace(/&/g,"&amp;"));a=a.replace(/</g,"&lt;").replace(/>/g,"&gt;");e={ENT_NOQUOTES:0,ENT_HTML_QUOTE_SINGLE:1,
ENT_HTML_QUOTE_DOUBLE:2,ENT_COMPAT:2,ENT_QUOTES:3,ENT_IGNORE:4};0===b&&(h=!0);if("number"!==typeof b){b=[].concat(b);for(f=0;f<b.length;f++)0===e[b[f]]?h=!0:e[b[f]]&&(c|=e[b[f]]);b=c}b&e.ENT_HTML_QUOTE_SINGLE&&(a=a.replace(/'/g,"&#039;"));h||(a=a.replace(/"/g,"&quot;"));return a},format:function(a){var b=a;Array.prototype.slice.call(arguments,1).forEach(function(a,c){b=b.replace(RegExp("\\{"+c+"}","g"),a)});return b},extend:function(a){Array.prototype.slice.call(arguments,1).forEach(function(b){for(var c in b)void 0!==
b[c]&&(a[c]=b[c])});return a},inherit:function(a,d,c){var e,f=function(){};e=d&&d.hasOwnProperty("constructor")?d.constructor:function(){return a.apply(this,arguments)};b.utils.extend(e,a);f.prototype=a.prototype;e.prototype=new f;d&&b.utils.extend(e.prototype,d);c&&b.utils.extend(e,c);e.prototype.constructor=e;e.__super__=a.prototype;return e},getType:function(a){return null==a?""+a:this.types[Object.prototype.toString.call(a)]||"object"},isFunction:function(a){return"function"===this.getType(a)},
isUndefined:function(a){return void 0===a},isObject:function(a){return"object"===this.getType(a)},isString:function(a){return"string"===this.getType(a)},isNumber:function(a){return"number"===this.getType(a)},isBoolean:function(a){return"boolean"===this.getType(a)},isArray:function(a){return"array"===this.getType(a)},count:function(a){if(this.isUndefined(a)||null===a)return 0;if(this.isArray(a))return a.length;if(this.isObject(a)){var b=0,c;for(c in a)a.hasOwnProperty(c)&&b++;return b}return 1}};b.debug=
{_isGroup:!1,_canDebug:function(){return b.settings.isDebug&&l.console},_formatMessage:function(a){var d=new Date,c=d.getHours(),e=d.getMinutes(),f=d.getSeconds(),d=d.getMilliseconds();return b.utils.format("[DEBUG] {0}:{1}:{2}.{3}\t{4}",c,e,f,d,a)},log:function(){var a=b.utils.format.apply(b.utils,arguments);return this._canDebug()&&console.log(this._isGroup?a:this._formatMessage(a)),this},group:function(a,b){var c=this._formatMessage(a);this._isGroup=!0;return this._canDebug()&&(b?console.groupCollapsed(c):
console.group(c)),this},groupEnd:function(){this._isGroup=!1;return this._canDebug()&&console.groupEnd(),this}};b.Exception=b.utils.inherit(Error,b.Exception={constructor:function(){this.name="Smarty.Exception";this.message=b.utils.format.apply(b.utils,Array.prototype.slice.call(arguments))}});b.CompileException=b.utils.inherit(b.Exception,b.CompileException={constructor:function(a){if(!(a instanceof b.Compiler))throw new b.Exception("[compiler] must be instance of [smarty.Compiler]!");this.name=
"Smarty.CompileException";this.message=b.utils.format("[{0}:{1}] {2}",a.getTemplate().getName(),a.getLine(),b.utils.format.apply(b.utils,Array.prototype.slice.call(arguments,1)))}});b.RuntimeException=b.utils.inherit(b.Exception,b.RuntimeException={constructor:function(){this.name="Smarty.RuntimeException";this.message=b.utils.format.apply(b.utils,Array.prototype.slice.call(arguments))}});var c={bind:function(a,d,c){var e=this._callbacks||(this._callbacks={});(e[a]||(e[a]=[])).push([d,c]);b.debug.log("Eventmanager: the [{0}] event is listened now.",
a);return this},unbind:function(a,b){var c;if(a){if(c=this._callbacks)if(b){c=c[a];if(!c)return this;for(var e=0,f=c.length;e<f;e++)if(c[e]&&b===c[e][0]){c[e]=null;break}}else c[a]=[]}else this._callbacks={};return this},trigger:function(a){var d,c,e,f,h,i=2;if(!(c=this._callbacks))return this;for(;i--;)if(e=i?a:"all",d=c[e])for(var k=0,g=d.length;k<g;k++)(f=d[k])?(b.debug.log("Eventmanager: the [{0}] event is triggered.",e),h=i?Array.prototype.slice.call(arguments,1):arguments,f[0].apply(f[1]||this,
h)):(d.splice(k,1),k--,g--);return this}};b.Template=function(a){if(b.utils.isUndefined(a)||null===a||""==(""+a).trim())throw new b.Exception("Invalid template name '{0}'!",a);if(!(this instanceof b.Template))return b.Template.factory.apply(b.Template,arguments);if(b.Template.isExists(a))throw new b.Exception("Template with name '{0}' already exists!",a);this._name=a;this._source="";this._closure=null;this._includes=[];this._loadedIncludes=[];this._includesMap={};return b.Template.set(this)};b.Template.prototype=
{constructor:b.Template,_loadHandler:function(a){a&&a in this._includesMap&&(this._loadedIncludes.push(a),delete this._includesMap[a]);this.isReady()&&c.trigger("load:"+this._name,this._name).unbind("load:"+this._name)},_dispatch:function(){var a=[];this._includes.forEach(function(d){b.Template.isExists(d)?this._loadedIncludes.push(d):(a.push(d),this._includesMap[d]=!0,c.bind("load:"+d,function(a){this._loadHandler(a)}.bind(this)))}.bind(this));a.length?this._triggerIncludesHandler(a):this._loadHandler()},
_triggerIncludesHandler:function(a){if(!b.utils.isFunction(b.settings.includeHandler))throw new b.Exception("[smarty.settings.includeHandler] must be callable!");a.length&&b.settings.includeHandler(a)},exec:function(a,d){if(!b.utils.isFunction(d))throw new b.Exception("Parameter 'callback' must be callable!");b.debug.log("Template: the [{0}] template is trying to execute asynchronously.",this._name);var j=function(){d(this._closure.call(a instanceof b.Sandbox?a:new b.Sandbox(a)));b.debug.log("Template: the [{0}] template executed successfully.",
this._name)}.bind(this);this.isReady()?j():(c.bind("load:"+this._name,j),this.isCompiled()||this._triggerIncludesHandler([this._name]))},execSync:function(a){if(!this.isReady())throw new b.Exception("Template isn't ready for execution!");b.debug.log("Template: the [{0}] template is trying to execute synchronously.",this._name);a=this._closure.call(a instanceof b.Sandbox?a:new b.Sandbox(a));b.debug.log("Template: the [{0}] template executed successfully.",this._name);return a},remove:function(){b.Template.remove(this._name)},
isCompiled:function(){return null!==this._closure},isReady:function(){return this.isCompiled()&&this._includes.length===this._loadedIncludes.length},compile:function(a){if(!a)throw new b.Exception("Empty [source] parameter!");this._source=a;b.Compiler(this);return this},load:function(a,d){if(!b.utils.isFunction(a))throw new b.Exception("Parameter 'closure' must be callable!");b.utils.isArray(d)||(d=[""+d]);this._closure=a;this._includes=[];for(var c={},e=0;e<d.length;e++){var f=""+d[e];f in c||(this._includes.push(f),
c[f]=!0)}this._dispatch();return this},getIncludes:function(){return this._includes},getClosure:function(){return this._closure},getName:function(){return this._name},getSource:function(){return this._source}};b.Template.templates=[];b.Template.isExists=function(a){return this.templates.hasOwnProperty(a)};b.Template.get=function(a){if(!this.isExists(a))throw new b.Exception("Template with name '{0}' doesn't exist!",a);return this.templates[a]};b.Template.set=function(a){if(!(a instanceof this))throw new b.Exception("Only instances of [smarty.Template] can be added!");
return this.templates[a.getName()]=a};b.Template.remove=function(a){if(!this.isExists(a))throw new b.Exception("Template with name '{0}' doesn't exist!",a);delete this.templates[a]};b.Template.factory=function(a,d,c){d=d||null;a=b.Template.isExists(a)?b.Template.get(a):new b.Template(a);a.isCompiled()||(b.utils.isString(d)?a.compile(d):b.utils.isFunction(d)&&a.load(d,b.utils.isArray(c)?c:[]));return a};b.Sandbox=function(a){this._data=a;this._rootNamespace="root";this._namespaces=[this._rootNamespace];
this._localVars={};this._localVars[this._rootNamespace]=this._data};b.Sandbox.prototype={constructor:b.Sandbox,gv:function(a){var d=a.keys||[],c=d.length;if(!c)throw new b.Exception("Invalid variable data!");for(var e=0,f=d[e++],a=a.modifiers||{},h="",i=function(a){if(e<c&&a&&a.hasOwnProperty){var f=d[e++];b.utils.isObject(f)&&(f=this.gv(f));return""===f||b.utils.isUndefined(a=a[f])||null===a?"":i(a)}return a}.bind(this),k,g=this._namespaces.length;0<g--;)if(k=this._namespaces[g],this._localVars[k]&&
this._localVars[k].hasOwnProperty(f)){h=i(this._localVars[k][f]);break}if(null!==a)for(var m in a)m in b.modifiers&&(h=b.modifiers[m].apply(this,[h].concat(a[m])));return h},sv:function(a,b){this._localVars[this._namespaces[this._namespaces.length-1]][a]=b;return this},sn:function(a){if(0<=this._namespaces.indexOf(a))throw new b.Exception("Namespace '{0}' already exists!",a);this._namespaces.push(a);this._localVars[a]={};return this},en:function(a){if(!a||0>this._namespaces.indexOf(a))a=this._namespaces[this._namespaces.length-
1];if(a!==this._rootNamespace)for(;0<this._namespaces.length;){var b=this._namespaces.pop();delete this._localVars[b];if(b===a)break}return this},inc:function(a){return!b.Template.isExists(a)?"":b.Template.get(a).execSync(this)}};b.Compiler=function(a){if(this instanceof b.Compiler)this._closure=this._template=null,this._source="",this._stack=[],this._includes=[],this._line=1,this._data={},this._captureName=this.uniqueName("cap_");else{if(!(a instanceof b.Template))throw new b.Exception("[template] must be instance of [smarty.Template]!");
var d=new b.Compiler;d._template=a;d._source=a.getSource();d._compile();a.load(d._closure,d._includes)}};b.Compiler.prototype={constructor:b.Compiler,getLine:function(){return this._line},getTemplate:function(){return this._template},_compile:function(){var a=[];this._source.replace(/\r/g,"").replace(/{\*[\d\D]*?\*}/g,function(a){return"{@comment "+(a.split("\n").length-1)+"}"}.bind(this)).split("\n").forEach(function(b){b=this._compileString(b);a.push(b);this._line++},this);for(var d=null;0<this._stack.length;)if(d=
this._stack.pop(),d.entity.end)throw new b.CompileException(this,"Open tag '{0}' at line {1} doesn't have close tag!",d.name,d.line);d=b.utils.format("try{\t\t\t\tvar {0} = [];\t\t\t\t{1}\t\t\t\treturn {0}.join('');\t\t\t} catch( ex ){\t\t\t\tthrow new smarty.RuntimeException(ex.message);\t\t\t}",this._captureName,a.join("\n"));this._closure=Function(d);b.debug.group("Compiled source: "+this.getTemplate().getName(),!0).log(this._closure.toString()).groupEnd()},uniqueName:function(a){for(var b=6,a=
a||"var_",c;0<b--;)c=Math.floor(62*Math.random()),a+="0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz".substring(c,c+1);return a},_compileString:function(a){var d,c=[],e=function(a){return b.utils.format("{0}.push('{1}');",this._captureName,a.replace(/'/g,"\\'"))}.bind(this),f=function(a,d){var c=new b.Expression(d),e=c.getAttributes(),f;for(f in a.attributes)if("_required"===f)a.attributes[f].forEach(function(a){if(!(a in e))throw new b.CompileException(this,"Required attribute '{0}' not exists!",
a);}.bind(this));else if(e[f]){var g=a.attributes[f];if(!b.utils.isArray(g))throw new b.CompileException(this,"Invalid attribute's meta definition!");var h=!1;g.forEach(function(a){e[f]instanceof a&&(h=!0)});if(!h)throw new b.CompileException(this,"Invalid attribute type '{0}'!",f);}return c}.bind(this);for(;null!==(d=/{([$\/@])?([\w][\w\d]*)([^}]*)}/.exec(a));){var h=d[0],i=d[1],k=d[2];d=d[3].trim();var a=a.split(h),g=a.shift();""!==g&&c.push(e(g));a=a.join(h);if("$"===i)d="variable="+i+k+d,k="var";
else if("@"===i&&"comment"===k)return this._line+=parseInt(d),"";if(h=b.entities[k])if("/"===i)if(h.end){for(i=!1;d=this._stack.pop();)if(d.entity.end&&d.name===k){i=!0;break}if(!i)throw new b.CompileException(this,"Unexpected close tag '{0}'!",k);c.push(h.end.call(this,d.expression))}else throw new b.CompileException(this,"Tag '{0}' hasn't need close tag!",k);else{if(h.depends.length){i=!1;for(g=this._stack.length;!i&&0<g;)0<=h.depends.indexOf(this._stack[--g].name)&&(i=!0);if(!i)throw new b.CompileException(this,
"Tag '{0}' must be specified within the following tags: '{1}'!",k,h.depends);}i=f(h,d);this._stack.push({name:k,body:d,expression:i,entity:h,line:this._line});c.push(h.start.call(this,i))}else throw new b.CompileException(this,"Undefined entity '{0}'!",k);}""!==a&&c.push(e(a));return c.join("")}};b.Expression=function(a){this._origin=a||"";this._pos=-1;this._look=0;this._result="";this._attributes={};this._parse()};b.Expression.prototype={constructor:b.Expression,states:{TEXT:256,VAR:257,MODIFIER:258},
toString:function(){return this.getResult()},getOrigin:function(){return this._origin},getResult:function(){return this._result},getPosition:function(){return this._pos},getAttributes:function(){return this._attributes},_next:function(a){this._look=0;return this._origin.charAt(a?this._pos+=a:++this._pos)||!1},_prev:function(a){this._look=0;return this._origin.charAt(a?this._pos-=a:--this._pos)||!1},_rewind:function(a){this._pos=a||-1},_lookForward:function(){return this._origin.charAt(this._pos+ ++this._look)},
_lookBackward:function(){return this._origin.charAt(this._pos+--this._look)},_countChar:function(a,b){for(var c=0;(b?this._lookForward():this._lookBackward())===(a||"\\");)c++;return c},_caseVar:function(a){var c,j,e=0,f,h=0,i="",k={keys:[],modifiers:{}};a:for(;c=this._next();){switch(!0){case /\s|\)/.test(c)&&!e:this._prev();break a;case /\$/.test(c):j=this.states.VAR;break;case /\./.test(c):if(1===j)continue;j=2;break;case /\[/.test(c):h++;j=1;break;case /]/.test(c):--h;if(0>h){this._prev();break a}j=
1;break;case /['"]/.test(c):e&1&&f===c?this._countChar()&1||e--:(e++,f=c);continue;case "|"===c:j=this.states.MODIFIER;break;default:j=this.states.TEXT}if(e)j=this.states.TEXT;switch(j){case 2:case 1:i.length&&k.keys.push(i)&&(i="");break;case this.states.VAR:k.keys.push(this._caseVar(!0));break;case this.states.MODIFIER:c=this._caseModifier();b.utils.extend(k.modifiers,c);break;default:i+=c}}i.length&&k.keys.push(i);if(a)return k;this._result+=b.utils.format("this.gv({0})",JSON.stringify(k))},_caseModifier:function(){var a,
c=0,j,e=1,f="",h=null,i=[];a:for(;a=this._next();){switch(!0){case /\s|\)|\|/.test(a)&&!c:this._prev();break a;case /['"]/.test(a):c&1&&j===a?this._countChar()&1||c--:(c++,j=a);continue;case /:/.test(a):e=2;break;case 1===e&&/[^\w]/.test(a):throw new b.Exception("Invalid modifier name!");case 2===e:e=3}c&&(e=3);switch(e){case 1:f+=a;break;case 2:null!==h&&i.push(h);h="";break;case 3:h+=a}}null!==h&&i.push(h);if(!(f in b.modifiers))throw new b.Exception("Undefined modifier '{0}'!",f);a={};a[f]=i;return a},
_caseAttribute:function(){var a,c=1,j="",e="",f=0,h;this._prev();var i=this.getPosition();a:for(;a=this._next();){switch(!0){case /\s|\)/.test(a)&&!f:this._prev();break a;case /['"]/.test(a):f&1&&h===a?this._countChar()&1||f--:(f++,h=a);break;case "="===a:c=2;continue;case 1===c&&/[^\w]/.test(a):break a;case 2!==c&&/\s/.test(a):break a}f&&(c=2);switch(c){case 1:j+=a;break;case 2:e+=a}}!j.length||!e.length?this._rewind(i):this._attributes[j]=b.AttrTypeFactory(e)},_parse:function(){for(var a,b=0,c,
e;a=this._next();){var f=this._lookBackward();switch(!0){case /['"]/.test(a):b&1&&c===a?this._countChar()&1||b--:(b++,c=a);break;case /\$/.test(a):e=1;break;case /\w/.test(a)&&(""===f||/\s/.test(f))&&2!==e:e=2;break;default:e=this.states.TEXT}if(b)e=this.states.TEXT;switch(e){case 1:this._caseVar();break;case 2:this._caseAttribute();break;default:this._result+=a}}}};b.AttrTypeFactory=function(a){var c,j={Number:/^(-?\d*\.?\d+)$/,Boolean:/^(true|false)$/,Variable:/^\$\w.*$/,String:/^.*$/},e;for(e in j)if(j[e].test(a)){c=
new b[e](a);break}return c};b.Number=function(a){this.value=+a};b.Boolean=function(a){this.value="true"===a?!0:!1};b.String=function(a){this.value=""+a.replace(/^['"]|['"]$/g,"")};b.Variable=function(a){this.value=new b.Expression(a)};b.Number.prototype={constructor:b.Number,toString:function(){return this.value}};b.Boolean.prototype={constructor:b.Boolean,toString:function(){return this.value}};b.String.prototype={constructor:b.String,toString:function(){return"'"+this.value+"'"}};b.Variable.prototype=
{constructor:b.Variable,toString:function(){return this.value.toString()}};"Boolean,Number,String,Function,Array,Date,RegExp,Object".split(",").forEach(function(a){b.utils.types["[object "+a+"]"]=a.toLowerCase()});[b.Template].forEach(function(a){a.inherit=function(a,c){var e=b.utils.inherit(this,a,c);e.inherit=this.inherit;return e}})}})(window);
(function(l){var b=l.smarty;b.addEntity("var",{attributes:{_required:["variable"],variable:[b.Variable]},start:function(c){c=c.getAttributes();return b.utils.format("{0}.push({1});",this._captureName,c.variable)}});b.addEntity("if",{start:function(c){return b.utils.format("/* IF */ if({0}){",c)},end:function(){return"} /* ENDIF */"}});b.addEntity("else",{start:function(){return"} /* ELSE */ else{"},after:["elseif"],depends:["if"]});b.addEntity("elseif",{start:function(c){return b.utils.format("} /* ELSEIF */ else if({0}){",
c)},depends:["if"]});b.addEntity("break",{start:function(){return"/* BREAK */ break;"},depends:["foreach","while"]});b.addEntity("continue",{start:function(){return"/* CONTINUE */ continue;"},depends:["foreach","while"]});b.addEntity("foreach",{attributes:{_required:["from","item"],from:[b.Variable],item:[b.String],key:[b.String],name:[b.String]},start:function(c){c=c.getAttributes();this._data.foreachMeta=this.uniqueName();var a=this.uniqueName(),d=this.uniqueName(),j=this.uniqueName("ns_"),j=b.utils.format("/* FOREACH */\t\t\tvar {0} = {1}, {2} = { key: null, iteration: 0, total: smarty.utils.count({0}), first: true, last: false };\t\t\tthis.sn('{3}');",
a,c.from,this._data.foreachMeta,j);c.name&&(j+=b.utils.format("this.sv({0}, {1});",c.name,this._data.foreachMeta));j+=b.utils.format("\t\t\tif( smarty.utils.isObject({1}) || smarty.utils.isArray({1}) )\t\t\t\tfor(var {0} in {1}){\t\t\t\t\tif(!{1}.hasOwnProperty({0})) continue;\t\t\t\t\tsmarty.utils.extend({2}, {\t\t\t\t\t\tkey: {0},\t\t\t\t\t\tfirst: {2}.iteration == 0,\t\t\t\t\t\tlast: {2}.iteration == {2}.total - 1\t\t\t\t\t}), {2}.iteration++;\t\t\t\t\tthis.sv({3}, {1}[{0}]);",d,a,this._data.foreachMeta,
c.item);c.key&&(j+=b.utils.format("this.sv({0}, {1});",c.key,d));return j},end:function(){return"}this.en(); /* ENDFOREACH */"}});b.addEntity("foreachelse",{start:function(){return b.utils.format("} /* FOREACHELSE */ if({0}.iteration === 0){",this._data.foreachMeta)},depends:["foreach"]});b.addEntity("for",{attributes:{_required:["from","to"],from:[b.Variable,b.Number],to:[b.Variable,b.Number],step:[b.Variable,b.Number],name:[b.String]},start:function(c){var c=c.getAttributes(),a=this.uniqueName(),
d=this.uniqueName("ns_"),j=this.uniqueName(),e=this.uniqueName(),d=b.utils.format("/* FOR */\t\t\tvar {0} = { index: 0, iteration: 0 };\t\t\tthis.sn('{1}');",a,d);c.name&&(d+=b.utils.format("this.sv({0}, {1});",c.name,a));return d+=b.utils.format("for(var {0} = {1}, {2} = {3}; {0} <= {2}; {0} += {4}){\t\t\t{5}.iteration++, smarty.utils.extend({5}, { index: {0} });",j,c.from,e,c.to,c.step||1,a)},end:function(){return"}this.en(); /* ENDFOR */"}});b.addEntity("while",{start:function(c){return b.utils.format("/* WHILE */ while({0}){",
c)},end:function(){return"} /* ENDWHILE */"}});b.addEntity("capture",{attributes:{_required:["assign"],assign:[b.String]},start:function(){this._data.captureName=this.uniqueName("cap_");this._data.oldCaptureName=this._captureName;this._captureName=this._data.captureName;return b.utils.format("/* CAPTURE */ var {0} = [];",this._data.captureName)},end:function(c){c=c.getAttributes();this._captureName=this._data.oldCaptureName;return b.utils.format("this.sv({0}, {1}); /* ENDCAPTURE */",c.assign,this._data.captureName)}});
b.addEntity("include",{attributes:{_required:["file"],file:[b.String,b.Variable],assign:[b.String]},start:function(c){c=c.getAttributes();this._includes.push(c.file.value);var a=b.utils.format("/* INCLUDE */ this.sn({0});",c.file),d;for(d in c)c.hasOwnProperty(d)&&!(d in b.entities.include.attributes)&&(a+=b.utils.format("this.sv('{0}', {1});",d,c[d]));a=c.assign?a+b.utils.format("this.sv({0}, this.inc({1}));",c.assign,c.file):a+b.utils.format("{0}.push(this.inc({1}));",this._captureName,c.file);
return a+b.utils.format("this.en({0}); /* ENDINCLUDE */",c.file)}});b.addEntity("dump",{start:function(c){return b.utils.format("console.log({0});",c)}});b.addEntity("html_options",{attributes:{_required:["options"],options:[b.Variable],selected:[b.String,b.Variable]},start:function(){return""}});b.addEntity("html_radios",{attributes:{_required:["options"],options:[b.Variable],selected:[b.String,b.Variable],separator:[b.String,b.Variable],name:[b.String]},start:function(){return""}});b.addEntity("assign",
{attributes:{_required:["var","value"],"var":[b.String],value:[b.String,b.Variable,b.Number,b.Boolean]},start:function(c){c=c.getAttributes();return b.utils.format("/* ASSIGN */ this.sv({0}, {1}); /* ENDASSIGN */",c["var"],c.value)}});b.addModifier("default",function(c,a){return b.modifiers.empty(c)?a:c});b.addModifier("length",function(c){return b.utils.isString(c)?c.length:b.utils.count(c)});b.addModifier("substr",function(c,a,d){if(b.utils.isNumber(c)||b.utils.isBoolean(c))c=c.toString();return!b.utils.isString(c)?
"":c.substr(a,d)});b.addModifier("upper",function(c){return!b.utils.isString(c)?c:c.toUpperCase()});b.addModifier("lower",function(c){return!b.utils.isString(c)?c:c.toLowerCase()});b.addModifier("cat",function(c,a){if(b.utils.isNumber(c)||b.utils.isBoolean(c))c=c.toString();return!b.utils.isString(c)?"":c+(a||"")});b.addModifier("nl2br",function(c){return!b.utils.isString(c)?c:c.replace(/\n/g,"<br />")});b.addModifier("truncate",function(b,a,d){return(""+b).substr(0,a)+(d||"")});b.addModifier("split",
function(c,a,d){return!b.utils.isString(c)?[]:c.split(a,d)});b.addModifier("join",function(c,a){return!b.utils.isArray(c)?"":c.join(a)});b.addModifier("isset",function(c){return b.utils.isUndefined(c)||null===c?!1:!0});b.addModifier("empty",function(c){return!c?!0:b.utils.isArray(c)||b.utils.isObject(c)?0===b.utils.count(c):!1});b.addModifier("escape",function(c,a){if(!b.utils.isString(c))return c;var d=encodeURI;switch(a){case "html":return b.utils.htmlspecialchars(c,"ENT_QUOTES");case "url":return d(c);
case "urlpathinfo":return d(c).replace("%2F","/");case "quotes":return c.replace(/(['"])/g,"\\$1")}return c});b.addModifier("date_format",function(c,a){var d;d=(d=/(\d{4})-(\d{2})-(\d{2})\s(\d{2}):(\d{2}):(\d{2})/.exec(c))?new Date(d[1],d[2]-1,d[3],d[4],d[5],d[6]):new Date(c);return!isNaN(+d)?b.utils.strftime(a,d):""})})(window);
