# snowpack-plugin-ejs
Bring the power of EJS to Snowpack.

--------

## Quick Start

This plugin adds support for the EJS template engine to Snowpack.

Use `npm` to install it first.

```bash
npm i -D snowpack-plugin-ejs
```

Modify your snowpack config file to enable `snowpack-plugin-ejs`. You can also add plugin options if you want.

```javascript
{
  plugins: [
    ['snowpack-plugin-ejs'],
  ],
}

// or...  assign render data
{
  plugins: [
    ['snowpack-plugin-ejs', {
      renderData: {
        nickname: 'Calf',
      },
    }],
  ],
}

```

## Example

There is [an example](./example/snowpack.config.js) about how to use `snowpack-plugin-ejs` in `./example` directory.


## Plugin Options

#### `ejsModule`

*optional*

Assign this option to use your own ejs module.

This option would be useful when you have to rewrite some members of ejs module.

```javascript
let ejs = require('ejs'),
ejs.cache = require('lru-cache')(100);

module.exports = {
  plugins: [
    ['snowpack', { ejsModule: ejs }],
  ],
};
```

#### `renderOptions`

`Object` | `Function`: *optional*

Provide options which EJS renderer uses. See [EJS's document](https://ejs.co/#docs) for all acceptable items.
```js
{  
  renderOptions: { rmWhitespace: true },
}
```
A function can also be provided, whose first argument is same to that of [Snowpack's `load` hook](https://www.snowpack.dev/guides/plugins#example%3A-build-from-source). This function should return the actually option value.
```js
{  
  renderOptions: ({ filePath }) => ({
    delimiter: filePath.includes('.obs.ejs') ? '?' : undefined,
  }),
}
```

#### `renderData`

`Object` | `Function`: *optional*

Assign data to render templates. The data will only be passed to the *root* template, that is, the data cannot inject into the *included* templates.
```js
{
  renderData: { nickname: 'Calf' },
}
```
A function can also be provided, whose first argument is same to that of [Snowpack's `load` hook](https://www.snowpack.dev/guides/plugins#example%3A-build-from-source). This function should return the actually option value.
