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

This option can be useful when you have to rewrite some members of ejs module.

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

Provide options which EJS renderer uses. See [EJS's document](https://ejs.co/#docs) for details.

A function can also be provided, whose first argument is same to that of Snowpack's `load` hook.

#### `renderData`

`Object` | `Function`: *optional*

Use assigned data to render templates.

A function can also be provided, whose first argument is same to that of Snowpack's `load` hook.
