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
function j(l){throw l;}var m=!0,n=null,o=!1;function p(l){return function(){return this[l]}}function q(l){return function(){return l}}
(function(l){if(void 0===a){Function.prototype.bind||(Function.prototype.bind=function(c){function a(){return g.apply(this instanceof e?this:c||l,b.concat(Array.prototype.slice.call(arguments)))}function e(){}"function"!==typeof this&&j(new TypeError("Function.prototype.bind - what is trying to be fBound is not callable"));var b=Array.prototype.slice.call(arguments,1),g=this;e.prototype=this.prototype;a.prototype=new e;return a});Array.prototype.forEach||(Array.prototype.forEach=function(c,a){var e,
b;this==n&&j(new TypeError(" this is null or not defined"));var g=Object(this),i=g.length>>>0;"[object Function]"!={}.toString.call(c)&&j(new TypeError(c+" is not a function"));a&&(e=a);for(b=0;b<i;){var h;b in g&&(h=g[Pk],c.call(e,h,b,g));b++}});String.prototype.trim||(String.prototype.trim=function(){return this.replace(/^\s+|\s+$/g,"")});var a={entities:{},r:{},K:{Ma:o,ta:function(){j(new a.c("Method isn't implemented yet!"))},Wa:3E3},Ua:function(c){this.K=a.a.extend(this.K,c||{});return this},
h:function(c,a){this.a.z(a)||j(new this.c("Parameter 'modifier' must be callable!"));this.r[c]=a;return this},Sa:function(c,a){this.e(c,{start:a});return this},Ta:function(c,a,e){this.e(c,{start:a,end:e});return this},e:function(c,d){d=this.a.extend({attributes:{l:[]},start:q(""),end:void 0,oa:[],o:[]},d||{});this.a.z(d.start)||j(new this.c("Callback [options.start] must be callable!"));!this.a.J(d.end)&&!this.a.z(d.end)&&j(new this.c("Callback [options.end] must be callable or [undefined]!"));(!this.a.isArray(d.oa)||
!this.a.isArray(d.o))&&j(new this.c("[options.after] and [options.depends] must be an [Array]!"));this.a.X(d.attributes)||j(new this.c("[options.attributes] must be an [Object]!"));a.a.isArray(d.attributes.l)||j(new a.c("[options.attributes._required] must be an [Array]!"));d.attributes.l.forEach(function(c){c in d.attributes||j(new a.c("'{0}' is defined in require list, but isn't defined in attributes list!",c))});this.entities[c]=d;return this}};a.a={types:{},b:function(c){var a=c;Array.prototype.slice.call(arguments,
1).forEach(function(c,b){a=a.replace(RegExp("\\{"+b+"}","g"),c)});return a},extend:function(a){Array.prototype.slice.call(arguments,1).forEach(function(d){for(var b in d)void 0!==d[b]&&(a[b]=d[b])});return a},w:function(c,d,b){function f(){}var g;g=d&&d.hasOwnProperty("constructor")?d.constructor:function(){return c.apply(this,arguments)};a.a.extend(g,c);f.prototype=c.prototype;g.prototype=new f;d&&a.a.extend(g.prototype,d);b&&a.a.extend(g,b);g.prototype.constructor=g;g.Ra=c.prototype;return g},W:function(a){return n==
a?""+a:this.types[Object.prototype.toString.call(a)]||"object"},z:function(a){return"function"===this.W(a)},J:function(a){return void 0===a},X:function(a){return"object"===this.W(a)},q:function(a){return"string"===this.W(a)},isArray:function(a){return"array"===this.W(a)},pa:function(a){if(this.J(a)||n===a)return 0;if(this.isArray(a))return a.length;if(this.X(a)){var d=0,b;for(b in a)a.hasOwnProperty(b)&&d++;return d}return 1}};a.Ja={aa:o,Z:function(){return a.K.Ma&&l.console},ja:function(c){var d=
new Date;return a.a.b("[DEBUG] {0}:{1}:{2}.{3}\t{4}",d.getHours(),d.getMinutes(),d.getSeconds(),d.getMilliseconds(),c)},log:function(){var c=a.a.b.apply(a.a,arguments);return this.Z()&&console.log(this.aa?c:this.ja(c)),this},ra:function(a,d){var b=this.ja(a);this.aa=m;return this.Z()&&(d?console.Va(b):console.ra(b)),this},sa:function(){this.aa=o;return this.Z()&&console.sa(),this}};a.c=a.a.w(Error,a.c={constructor:function(){this.name="Smarty.Exception";this.message=a.a.b.apply(a.a,Array.prototype.slice.call(arguments))}});
a.n=a.a.w(a.c,a.n={constructor:function(c){c instanceof a.A||j(new a.c("[compiler] must be instance of [smarty.Compiler]!"));this.name="Smarty.CompileException";this.message=a.a.b("[{0}:{1}] {2}",c.ca.getName(),c.D,a.a.b.apply(a.a,Array.prototype.slice.call(arguments,1)))}});a.za=a.a.w(a.c,a.za={constructor:function(){this.name="Smarty.RuntimeException";this.message=a.a.b.apply(a.a,Array.prototype.slice.call(arguments))}});var b={bind:function(a,d,b){var f=this.P||(this.P={});(f[a]||(f[a]=[])).push([d,
b]);return this},xa:function(a,d){var b;if(a){if(b=this.P)if(d){b=b[a];if(!b)return this;for(var f=0,g=b.length;f<g;f++)if(b[f]&&d===b[f][0]){b[f]=n;break}}else b[a]=[]}else this.P={};return this},wa:function(a){var d,b,f,g,i=2;if(!(b=this.P))return this;for(;i--;)if(d=i?a:"all",d=b[d])for(var h=0,k=d.length;h<k;h++)(f=d[h])?(g=i?Array.prototype.slice.call(arguments,1):arguments,f[0].apply(f[1]||this,g)):(d.splice(h,1),h--,k--);return this}};a.d=function(c){(a.a.J(c)||n===c||""==(""+c).trim())&&j(new a.c("Invalid template name '{0}'!",
c));if(!(this instanceof a.d))return a.d.factory.apply(a.d,arguments);a.d.I(c)&&j(new a.c("Template with name '{0}' already exists!",c));this.j=c;this.H="";this.v=n;this.B=[];this.ba=[];this.$={};return a.d.set(this)};a.d.prototype={constructor:a.d,Fa:function(a){a in this.$&&(this.ba.push(a),delete this.$[a],this.ua()&&b.wa("load:"+this.j,this.j).xa("load:"+this.j))},Ea:function(){var c=[],d={};this.B.forEach(function(e){e in d||(d[e]=m,a.d.I(e)?this.ba.push(e):(c.push(e),this.$[e]=m,b.bind("load:"+
e,function(a){this.Fa(a)}.bind(this))))}.bind(this));c.length?this.na(c):b.wa("load:"+this.j,this.j).xa("load:"+this.j)},na:function(c){a.a.z(a.K.ta)||j(new a.c("[smarty.settings.includeHandler] must be callable!"));c.length&&a.K.ta(c)},exec:function(c,d){a.a.z(d)||j(new a.c("Parameter 'callback' must be callable!"));var e=function(){d(this.v.call(c instanceof a.N?c:new a.N(c)))}.bind(this);!this.ua()||!this.fa()?(b.bind("load:"+this.j,e),this.fa()||this.na([this.j])):e()},remove:function(){a.d.remove(this.j)},
fa:function(){return n!==this.v},ua:function(){return this.fa()&&this.B.length===this.ba.length},compile:function(c){c||j(new a.c("Empty [source] parameter!"));this.H=c;a.A(this);return this},load:function(c,d){a.a.z(c)||j(new a.c("Parameter 'closure' must be callable!"));this.v=c;this.B=d||[];this.Ea();return this},getName:p("j")};a.d.Y=[];a.d.I=function(a){return this.Y.hasOwnProperty(a)};a.d.get=function(c){this.I(c)||j(new a.c("Template with name '{0}' doesn't exist!",c));return this.Y[c]};a.d.set=
function(c){c instanceof this||j(new a.c("Only instances of [smarty.Template] can be added!"));return this.Y[c.getName()]=c};a.d.remove=function(c){this.I(c)||j(new a.c("Template with name '{0}' doesn't exist!",c));delete this.Y[c]};a.d.factory=function(c,d,b){d=d||n;c=a.d.I(c)?a.d.get(c):new a.d(c);a.a.q(d)?c.compile(d):a.a.z(d)&&c.load(d,a.a.isArray(b)?b:[]);return c};a.N=function(a){this.i=a;this.ma="root";this.la=[this.ma];this.R={};this.R[this.ma]=this.i};a.N.prototype={constructor:a.N,La:function(c){var d=
c.keys||[],b=d.length;b||j(new a.c("Invalid variable data!"));for(var f=0,g=d[f++],c=c.r||{},i="",h=function(c){if(f<b&&c.hasOwnProperty){var g=d[f++];a.a.X(g)&&(g=this.La(g));return""===g||a.a.J(c=c[g])||n===c?"":h(c)}return c}.bind(this),k,l=this.la.length;0<l--;)if(k=this.la[l],this.R[k]&&this.R[k].hasOwnProperty(g)){i=h(this.R[k][g]);break}if(n!==c)for(var r in c)r in a.r&&(i=a.r[r].apply(this,[i].concat(c[r])));return i}};a.A=function(c){if(this instanceof a.A)this.v=this.ca=n,this.H="",this.C=
[],this.B=[],this.D=1,this.i={},this.u=this.m("cap_");else{c instanceof a.d||j(new a.c("[template] must be instance of [smarty.Template]!"));var d=new a.A;d.ca=c;d.H=c.H;d.Ca();c.load(d.v,d.B)}};a.A.prototype={constructor:a.A,Ca:function(){var c=[];this.H.replace(/\r/g,"").replace(/{\*[\d\D]*?\*}/g,function(a){return"{@comment "+(a.split("\n").length-1)+"}"}.bind(this)).split("\n").forEach(function(a){a=this.Da(a);c.push(a);this.D++},this);for(var d=n;0<this.C.length;)d=this.C.pop(),d.qa.end&&j(new a.n(this,
"Open tag '{0}' at line {1} doesn't have close tag!",d.name,d.Na));d=a.a.b("try{\t\t\t\tvar {0} = [];\t\t\t\t{1}\t\t\t\treturn {0}.join('');\t\t\t} catch( ex ){\t\t\t\tthrow new smarty.RuntimeException(ex.message);\t\t\t}",this.u,c.join("\n"));this.v=Function(d);a.Ja.ra("Compiled source: "+this.ca.getName(),m).log(this.v.toString()).sa()},m:function(a){for(var d=6,a=a||"var_",b;0<d--;)b=Math.floor(62*Math.random()),a+="0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz".substring(b,b+1);
return a},Da:function(c){var d,b=[],f=function(c){return a.a.b("{0}.push('{1}');",this.u,c.replace(/'/g,"\\'"))}.bind(this),g=function(c,b){var d=new a.M(b),f=d.p,e;for(e in c.attributes)if("_required"===e)c.attributes[e].forEach(function(c){c in f||j(new a.n(this,"Required attribute '{0}' not exists!",c))}.bind(this));else if(f[e]){var g=c.attributes[e];a.a.isArray(g)||j(new a.n(this,"Invalid attribute's meta definition!"));var h=o;g.forEach(function(a){f[e]instanceof a&&(h=m)});h||j(new a.n(this,
"Invalid attribute type '{0}'!",e))}return d}.bind(this);for(;n!==(d=/{([$\/@])?([\w][\w\d]*)([^}]*)}/.exec(c));){var i=d[0],h=d[1],k=d[2];d=d[3].trim();var c=c.split(i),l=c.shift();""!==l&&b.push(f(l));c=c.join(i);if("$"===h)d="variable="+h+k+d,k="var";else if("@"===h&&"comment"===k)return this.D+=parseInt(d),"";if(i=a.entities[k])if("/"===h)if(i.end){for(h=o;d=this.C.pop();)if(d.qa.end&&d.name===k){h=m;break}h||j(new a.n(this,"Unexpected close tag '{0}'!",k));b.push(i.end.call(this,d.Ka))}else j(new a.n(this,
"Tag '{0}' hasn't need close tag!",k));else{if(i.o.length){h=o;for(l=this.C.length;!h&&0<l;)0<=i.o.indexOf(this.C[--l].name)&&(h=m);h||j(new a.n(this,"Tag '{0}' must be specified within the following tags: '{1}'!",k,i.o))}h=g(i,d);this.C.push({name:k,body:d,Ka:h,qa:i,Na:this.D});b.push(i.start.call(this,h))}else j(new a.n(this,"Undefined entity '{0}'!",k))}""!==c&&b.push(f(c));return b.join("")}};a.M=function(a){this.U=a||"";this.k=-1;this.S=0;this.G="";this.p={};this.Ha()};a.M.prototype={constructor:a.M,
s:{O:256,ha:257,ga:258},toString:p("G"),T:function(a){this.S=0;return this.U.charAt(a?this.k+=a:++this.k)||o},F:function(a){this.S=0;return this.U.charAt(a?this.k-=a:--this.k)||o},Ia:function(a){this.k=a||-1},Ga:function(){return this.U.charAt(this.k+ ++this.S)},ka:function(){return this.U.charAt(this.k+--this.S)},Q:function(a,b){for(var e=0;(b?this.Ga():this.ka())===(a||"\\");)e++;return e},ia:function(c){var b,e,f=0,g,i=0,h="",k={keys:[],r:{}};a:for(;b=this.T();){switch(m){case /\s|\)/.test(b)&&
!f:this.F();break a;case /\$/.test(b):e=this.s.ha;break;case /\./.test(b):if(1===e)continue;e=2;break;case /\[/.test(b):i++;e=1;break;case /]/.test(b):--i;if(0>i){this.F();break a}e=1;break;case /['"]/.test(b):f&1&&g===b?this.Q()&1||f--:(f++,g=b);continue;case "|"===b:e=this.s.ga;break;default:e=this.s.O}if(f)e=this.s.O;switch(e){case 2:case 1:h.length&&k.keys.push(h)&&(h="");break;case this.s.ha:k.keys.push(this.ia(m));break;case this.s.ga:b=this.Ba();a.a.extend(k.r,b);break;default:h+=b}}h.length&&
k.keys.push(h);if(c)return k;this.G+=a.a.b("this.gv({0})",JSON.stringify(k))},Ba:function(){var c,b=0,e,f=1,g="",i=n,h=[];a:for(;c=this.T();){switch(m){case /\s|\)|\|/.test(c)&&!b:this.F();break a;case /['"]/.test(c):b&1&&e===c?this.Q()&1||b--:(b++,e=c);continue;case /:/.test(c):f=2;break;case 1===f&&/[^\w]/.test(c):j(new a.c("Invalid modifier name!"));case 2===f:f=3}b&&(f=3);switch(f){case 1:g+=c;break;case 2:n!==i&&h.push(i);i="";break;case 3:i+=c}}n!==i&&h.push(i);g in a.r||j(new a.c("Undefined modifier '{0}'!",
g));c={};c[g]=h;return c},Aa:function(){var c,b=1,e="",f="",g=0,i;this.F();var h=this.k;a:for(;c=this.T();){switch(m){case /\s|\)/.test(c)&&!g:this.F();break a;case /['"]/.test(c):g&1&&i===c?this.Q()&1||g--:(g++,i=c);break;case "="===c:b=2;continue;case 1===b&&/[^\w]/.test(c):break a;case 2!==b&&/\s/.test(c):break a}g&&(b=2);switch(b){case 1:e+=c;break;case 2:f+=c}}!e.length||!f.length?this.Ia(h):this.p[e]=a.ya(f)},Ha:function(){for(var a,b=0,e,f;a=this.T();){var g=this.ka();switch(m){case /['"]/.test(a):b&
1&&e===a?this.Q()&1||b--:(b++,e=a);break;case /\$/.test(a):f=1;break;case /\w/.test(a)&&(""===g||/\s/.test(g))&&2!==f:f=2;break;default:f=this.s.O}if(b)f=this.s.O;switch(f){case 1:this.ia();break;case 2:this.Aa();break;default:this.G+=a}}}};a.ya=function(b){var d,e={t:/^(-?\d*\.?\d+)$/,L:/^(true|false)$/,g:/^\$\w.*$/,f:/^.*$/},f;for(f in e)if(e[f].test(b)){d=new a[f](b);break}return d};a.t=function(a){this.value=+a};a.L=function(a){this.value="true"===a?m:o};a.f=function(a){this.value=""+a.replace(/^['"]|['"]$/g,
"")};a.g=function(b){this.value=new a.M(b)};a.t.prototype={constructor:a.t,toString:p("value")};a.L.prototype={constructor:a.L,toString:p("value")};a.f.prototype={constructor:a.f,toString:function(){return"'"+this.value+"'"}};a.g.prototype={constructor:a.g,toString:function(){return this.value.toString()}};"Boolean,Number,String,Function,Array,Date,RegExp,Object".split(",").forEach(function(b){a.a.types["[object "+b+"]"]=b.toLowerCase()});[a.d].forEach(function(b){b.w=function(b,c){var f=a.a.w(this,
b,c);f.w=this.w;return f}});l.va=a}})(window);
(function(l){var a=l.va;a.e("var",{attributes:{l:["variable"],Qa:[a.g]},start:function(b){return a.a.b("{0}.push({1});",this.u,b.p.Qa)}});a.e("if",{start:function(b){return a.a.b("/* IF */ if({0}){",b)},end:q("} /* ENDIF */")});a.e("else",{start:q("} /* ELSE */ else{"),oa:["elseif"],o:["if"]});a.e("elseif",{start:function(b){return a.a.b("} /* ELSEIF */ else if({0}){",b)},o:["if"]});a.e("break",{start:q("/* BREAK */ break;"),o:["foreach","while"]});a.e("continue",{start:q("/* CONTINUE */ continue;"),
o:["foreach","while"]});a.e("foreach",{attributes:{l:["from","item"],ea:[a.g],item:[a.f],key:[a.f],name:[a.f]},start:function(b){b=b.p;this.i.V=this.m();var c=this.m(),d=this.m(),e=a.a.b("/* FOREACH */\t\t\tvar {0} = {1}, {2} = { key: null, iteration: 0 };\t\t\tthis.sn('{3}');",c,b.ea,this.i.V,this.m("ns_"));b.name&&(e+=a.a.b("this.sv({0}, {1});",b.name,this.i.V));e+=a.a.b("\t\t\tif( smarty.utils.isObject({1}) || smarty.utils.isArray({1}) )\t\t\t\tfor(var {0} in {1}){\t\t\t\t\tif(!{1}.hasOwnProperty({0})) continue;\t\t\t\t\t{2}.iteration++, smarty.utils.extend({2}, {\t\t\t\t\t\tkey: {0}\t\t\t\t\t});\t\t\t\t\tthis.sv({3}, {1}[{0}]);",
d,c,this.i.V,b.item);b.key&&(e+=a.a.b("this.sv({0}, {1});",b.key,d));return e},end:q("}this.en(); /* ENDFOREACH */")});a.e("foreachelse",{start:function(){return a.a.b("} /* FOREACHELSE */ if({0}.iteration === 0){",this.i.V)},o:["foreach"]});a.e("for",{attributes:{l:["from","to"],ea:[a.g,a.t],Pa:[a.g,a.t],step:[a.g,a.t],name:[a.f]},start:function(b){var b=b.p,c=this.m(),d=this.m(),e=this.m(),f=a.a.b("/* FOR */\t\t\tvar {0} = { index: 0, iteration: 0 };\t\t\tthis.sn('{1}');",c,this.m("ns_"));b.name&&
(f+=a.a.b("this.sv({0}, {1});",b.name,c));return f+=a.a.b("for(var {0} = {1}, {2} = {3}; {0} <= {2}; {0} += {4}){\t\t\t{5}.iteration++, smarty.utils.extend({5}, { index: {0} });",d,b.ea,e,b.Pa,b.step||1,c)},end:q("}this.en(); /* ENDFOR */")});a.e("while",{start:function(b){return a.a.b("/* WHILE */ while({0}){",b)},end:q("} /* ENDWHILE */")});a.e("capture",{attributes:{l:["assign"],assign:[a.f]},start:function(){this.i.da=this.m("cap_");this.i.Oa=this.u;this.u=this.i.da;return a.a.b("/* CAPTURE */ var {0} = [];",
this.i.da)},end:function(b){b=b.p;this.u=this.i.Oa;return a.a.b("this.sv({0}, {1}); /* ENDCAPTURE */",b.assign,this.i.da)}});a.e("include",{attributes:{l:["file"],file:[a.f,a.g],assign:[a.f]},start:function(b){b=b.p;this.B.push(b.file.value);var c=a.a.b("/* INCLUDE */ this.sn({0});",b.file),d;for(d in b)b.hasOwnProperty(d)&&!(d in a.entities.include.attributes)&&(c+=a.a.b("this.sv('{0}', {1});",d,b[d]));c=b.assign?c+a.a.b("this.sv({0}, this.inc({1}));",b.assign,b.file):c+a.a.b("{0}.push(this.inc({1}));",
this.u,b.file);return c+a.a.b("this.en({0}); /* ENDINCLUDE */",b.file)}});a.e("dump",{start:function(b){return a.a.b("console.log({0});",b)}});a.e("html_options",{attributes:{l:["options"],options:[a.g],selected:[a.f,a.g]},start:q("")});a.e("html_radios",{attributes:{l:["options"],options:[a.g],selected:[a.f,a.g],separator:[a.f,a.g],name:[a.f]},start:q("")});a.e("assign",{attributes:{l:["var","value"],"var":[a.f],value:[a.f,a.g,a.t,a.L]},start:function(b){b=b.p;return a.a.b("/* ASSIGN */ this.sv({0}, {1}); /* ENDASSIGN */",
b["var"],b.value)}});a.h("default",function(b,c){return a.r.empty(b)?c:b});a.h("length",function(b){return a.a.q(b)?b.length:a.a.pa(b)});a.h("substr",function(b,c,d){return!a.a.q(b)?"":b.substr(c,d)});a.h("upper",function(b){return!a.a.q(b)?"":b.toUpperCase()});a.h("lower",function(b){return!a.a.q(b)?"":b.toLowerCase()});a.h("cat",function(b,c){return!a.a.q(b)?"":b+(c||"")});a.h("nl2br",function(b){return!a.a.q(b)?"":b.replace(/\n/,"<br />")});a.h("date_format",function(a){return a});a.h("truncate",
function(a,c,d){return a.substr(0,c)+(d||"")});a.h("split",function(b,c,d){return!a.a.q(b)?[]:b.split(c,d)});a.h("join",function(b,c){return!a.a.isArray(b)?"":b.join(c)});a.h("isset",function(b){return a.a.J(b)||n===b?o:m});a.h("empty",function(b){return!b?m:a.a.isArray(b)||a.a.X(b)?0===a.a.pa(b):o});l.va.h("escape",function(a,c){switch(""+c){case "html":var d=document.createElement("div");d.appendChild(document.createTextNode(a));a=d.innerHTML;break;case "url":a=encodeURI(a);break;case "urlpathinfo":a=
encodeURI(a).replace("%2F","/");break;case "quotes":a=a.replace(/(['"])/g,"\\$1")}return a})})(window);
