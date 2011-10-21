
/**
 * jquery.smarty
 *
 * @author Artem Shalaev <artem.shalaev@gmail.com>, Jun 2, 2011 5:52:01 PM
 * @copyright MegaGroup © 2011, megagroup.ru
 * @access 
 * @package 
 * @version 1.0.0
 */

(function( $ ){
	
	/*
	 * Check if plugin already initialized
	 */
	if( $.Smarty || $.fn.Smarty )
		return;

	var tplCounter = 0,
	isLoading = false,
	isLoaded = false,
	methods = {
		init: function(options){
			// Default options
			var settings = {
				coreScript: 'smarty.js',
				debugMode: false,
				onIncludes: function(){}
			};
			
			// Options
			$.extend(settings, options);
			
			isLoading = true;
			$.getScript(settings.coreScript, function(){
				isLoading = false;
				isLoaded = !!window.Smarty;
			});
		},
		
		exec: function(data, callback){
			var name = this.attr('id') || 'template_' + tplCounter++;
			
			Smarty.create(name).compile(this.contents()).exec(data, callback);
		}
	};

	/*
	 * jQuery plugin setup
	 */
	
	$.Smarty = methods.init;

	$.fn.Smarty = function(method) {		
		if( methods[method] ){
			
			if( !isLoaded ){
				
			}
			
			
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
			
		}
		else
			return $.error( 'Method ' +  method + ' does not exist on jQuery.Smarty!' ), null;
	};
	
})( jQuery );