# web-parser

This is a simple tool to parse websites using the jQuery interface, see [cheerio API](https://cheerio.js.org/classes/Cheerio.html).

## Simple usage

Print all `<p>` contents on the page:

```javascript
const { parse } = require('web-parser');

const [$, $elements] = await parse('http://sample.com', 'p');
$elements.each((index, element) => {
  const $element = $(element);
  console.log(`index: ${index}, text: ${$element.text()}`);
});
```

## Examples

Check examples folder!
