
/**
 * tester
 *
 * @author Artem Shalaev <artem.shalaev@gmail.com>, Jun 22, 2011 6:01:12 PM
 * @copyright MegaGroup © 2011, megagroup.ru
 * @access 
 * @package 
 * @version 1.0.0
 */

var data = {
	letters: {
		a: 1,
		b: 2,
		c: 3,
		d: 4,
		e: 5
	},
	empty: {},
	undefinedVar: undefined,
	nullVar: null,
	languages: {
		worldDefault: 'english',
		english: {
			learning: 'normal',
			country: 'World'
		},
		spanish: {
			learning: 'easy',
			country: 'Spain'
		},
		japanese: {
			learning: 'difficult',
			country: 'Japan'
		}
	},
	array: [ 'a', 'b', 'c' ],
	unescaped: {
		quotes: "qwe' qwe\' qwe\\'"
	}
},
testCaseCounter = 0,
tester = function(testName, testSuite){
	var testPos;
	QUnit.expect(testSuite.length);
	for( var i = 0; i < testSuite.length; i++ )
		try{
			smarty.Template(testCaseCounter += i, testPos = testSuite[i].shift()).exec(data, function(result){
				QUnit[testName](result,	testSuite[i].shift(), testPos);
			});		
		} catch(e) {
			console.error(e);
		}
};

/*
 * Variables tests
 */

QUnit.module('Variables');

QUnit.test('Simple variable', function(){		
	tester('equal', [
		[ "{$languages.english.learning}", 'normal' ],
		[ "{$languages['spanish'].country}", 'Spain' ],
		[ "{$languages['spanish']['country']}", 'Spain' ],
		[ "{$languages.japanese['country']}", 'Japan' ],
		[ "{$languages[$languages.worldDefault].country}", 'World' ],
		[ "{$languages[$languages['worldDefault']].country}", 'World' ]
		]);
});

QUnit.test('Complex variable', function(){		
	tester('equal', [
		[ "{$languages[$languages.worldDefault].country}", 'World' ],
		[ "{$languages[$languages['worldDefault']].country}", 'World' ]
		]);
});

/*
 * Modifiers
 */

QUnit.module('Modifiers');

QUnit.test('Simple modifiers', function(){		
	tester('equal', [
		[ "{$languages|length}", '4' ],
		[ "{$array|length}", '3' ],
		[ "{$languages.english.country|upper}", 'WORLD' ],
		[ "{$languages.english.country|lower}", 'world' ],
		]);
});

QUnit.test('Modifiers with params', function(){		
	tester('equal', [
		[ "{$undefinedVar|default:'trololo'}", 'trololo' ],
		[ "{$languages.english.learning|substr:2:3}", 'rma' ],		
		[ "{$languages.english.learning|cat:' test'}", 'normal test' ],
		[ "{$languages.english.learning|cat:'\'|:$'}", 'normal\'|:$' ],
		[ "{$array|join:','}", 'a,b,c' ],
		[ "{$array|join:','|split:','|length}", '3' ],
		[ "{$array|empty}", 'false' ],
		[ "{$empty|empty}", 'true' ],
		[ "{$array|isset}", 'true' ],
		[ "{$empty|isset}", 'true' ],
		[ "{$undefinedVar|isset}", 'false' ],
		[ "{$nullVar|isset}", 'false' ]
		]);
});

QUnit.test('Escape modifier', function(){		
	tester('equal', [
		[ "{$unescaped.quotes|escape:'quotes'}", "qwe\\\' qwe\\\' qwe\\\\\'" ]
		]);
});

QUnit.test('Two or more modifiers', function(){		
	tester('equal', [
		[ "{$languages.english.learning|substr:'2':'3'|length}", '3' ]
		]);
});

/*
 * Operators
 */

QUnit.module('Operators');

QUnit.test('If', function(){
	tester('equal', [
		[ "{if true}Passed{/if}", 'Passed' ],
		[ "{if 1 == 1}Passed{/if}", 'Passed' ],
		[ "{if 2 * 2 == 4}Passed{/if}", 'Passed' ],
		[ "{if $languages.english.learning === 'normal'}Passed{/if}", 'Passed' ],
		[ "{if $languages['spanish']['country'] === 'Spain'}Passed{/if}", 'Passed' ],
		[ "{if $languages['spanish'].country === 'Spain'}Passed{/if}", 'Passed' ],
		[ "{if $languages.japanese['country'] === 'Japan'}Passed{/if}", 'Passed' ],
		[ "{if $languages[$languages.worldDefault].country === 'World'}Passed{/if}", 'Passed' ]
		]);
});

QUnit.test('If-Else', function(){
	tester('equal', [
		[ "{if false}Invalid{else}Valid{/if}", 'Valid' ]
		]);
});

QUnit.test('If-Elseif', function(){
	tester('equal', [
		[ "{if false}Invalid{elseif true}Valid{/if}", 'Valid' ]
		]);
});

QUnit.test('Foreach', function(){
	tester('equal', [
		[ "{foreach from=$letters item=number}{$number} {/foreach}", '1 2 3 4 5 ' ],
		[ "{foreach from=$letters item='number'}{$number} {/foreach}", '1 2 3 4 5 ' ],
		[ "{foreach from=$letters item=\"number\"}{$number} {/foreach}", '1 2 3 4 5 ' ],
		[ "{foreach from=$letters item=number key=letter}{$letter}: {$number}, {/foreach}", 'a: 1, b: 2, c: 3, d: 4, e: 5, ' ],
		[ "{foreach from=$letters item=number name=myFor}{$myFor.key} {/foreach}", 'a b c d e ' ],
		[ "{foreach from=$letters item=number}{$number}{break}{/foreach}", '1' ],
		[ "{foreach from=$empty item=item}{$item}{foreachelse}else!{/foreach}", 'else!' ]
		]);
});

/*
 * Functions
 */

QUnit.module('Functions');

QUnit.test('Assign', function(){
	tester('equal', [
		[ "{assign var='test' value='qwe'}{$test}", 'qwe' ],
		[ "{assign var='test' value=123}{$test}", '123' ],
		[ "{assign var='test' value=true}{$test}", 'true' ],
		[ "{assign var='test' value='qwe'}{assign var='test2' value=$test|length}{$test2}", '3' ]
		]);
});

/*
 * Special entities
 */

QUnit.module('Special entities');

QUnit.test('Capture', function(){
	tester('equal', [
		[ "{capture assign='captured'}Trololo{/capture}LOOOOL: {$captured}", 'LOOOOL: Trololo' ]
		]);
});

var templates = {
	a: "a {include file='b'}",
	b: "b {include file='c'} {include file='d'}",
	c: "c {include file='e'}",
	d: "d {include file='e'}",
	e: "e"
};

smarty.configure({
	includeHandler: function(includes){
		includes.forEach(function(id){
			smarty.Template(id, templates[id]);
		});
	}
});

QUnit.test('Includes', function(){		
	smarty.Template('a').exec({}, function(result){
		QUnit.equal(result,	'a b c e d e');
	});	
});

/*
 * Special
 */

QUnit.module('Special');

QUnit.test('Comments', function(){
	tester('equal', [
		[ "{*123*}", '' ],
		[ "{* \
				123 \
			*}", '' ],
		[ "{*  {$someVar}  *}", '' ]
		]);
});