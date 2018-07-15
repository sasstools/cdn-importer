[![Build Status](https://travis-ci.org/sasstools/cdn-importer.svg?branch=master)](https://travis-ci.org/sasstools/cdn-importer)

# cdn-importer

>Node Sass importer for resolving from a CDN

## Disclaimer

This is ALPHA software.

It's messy. It's probably slow. It's probably buggy.

Give it a shot. File bugs. Be patient.

## Support

- Node >= 6
- node-sass >= 4.9.0

## Install

This package has a peer dependency on Node Sass for ensure import API compatibility.

```sh
npm install @node-sass/cdn-importer node-sass
```

## Usage

When Node Sass parses an `@import` with a URL prefixed by `cdn:` it will attempt to resolve the URL against following URL. This can be useful for directly consuming files from [UNPKG][] or [jsDelivr][]

```scss
@import "cdn:https://unpkg.com/normalize.css@8.0.0/normalize.css";
```

As a convenience if an `@import` URL is prefixed by `unpgk:` the importer will resolve [UNPKG][] short-hand syntax.

```scss
@import "unpkg:normalize.css@8.0.0/normalize.css";
```

### Node Sass API

```js
var sass = require('node-sass');
var cdnImporter = require('@node-sass/cdn-importer');

sass.render({
  file: 'index.scss',
  importer: [cdnImporter],
}, function (err, result) {
  if (err) throw err;
  console.log(result.css.toString());
});
```

### Node Sass CLI

```sh
$ node-sass index.scss --importer node_modules/@node-sass/cdn-importer/index.js
```

## Caveats

### Asynchronous only

Because of how inefficient synchronous network requests are this importer does not work with `renderSync`.

### Single files only

Since `@import`s in the resolved file won't have the `cdn:` prefix this impoter is only useful for single file packages like [normalize.css][]


[UNPKG]: https://unpkg.com/#/
[normalize.css]: https://github.com/necolas/normalize.css/
[jsDelivr]: https://www.jsdelivr.com
