# smartyjs

Simple port of php lib Smarty 2 to js world.
Done a couple of years ago but now is open for all.

Docs: https://github.com/Zeliret/smartyjs/wiki

## Features

* Vanilla js with extra jquery support
* Not fully but tested
* You can easily add new entities, functions and modifiers
* Asynchronous includes

### Supported tags:

* `if, else, elseif`
* `foreach, foreachelse, break, continue`
* `for`
* `while`
* `capture`
* `include`
* `assign`
* `html_options`
* `html_radios`
* `dump`

### Supported modifiers: 

* `default`
* `length`
* `substr`
* `upper`
* `lower`
* `cat`
* `nl2br`
* `truncate`
* `split`
* `join`
* `isset`
* `empty`
* `escape`
* `date_format`

### Usage 

```javascript
smarty.configure({
  isDebug: true,
  includeHandler: function (includes) {
      _.each(includes, function (id) {
          $.getJson('/template/?id=' + encodeURIComponent(id)).done(function (json) {
              smarty.Template(id, json.data.content);
          });
      });
  }
});
// Custom modifier
smarty.addModifier('date_format', function (input, format) {
  return MyUtils.dateFormat(format, input);
});
```
