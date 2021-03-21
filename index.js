const path = require('path');
const fs = require('fs');
const ejs_default = require('ejs');


const computeOptionValue = (opt, that, ...args) =>
  typeof opt === 'function' ? opt.call(that, ...args) : opt;

const getAbsolutePath = x => path.isAbsolute(x) ? path.normalize(x) : path.join(process.cwd(), x);


module.exports = function (rawSnowpackConfig, rawPluginOptions) {
  const snowpackConfig = rawSnowpackConfig;

  // trim pluginOptions and append default values
  const pluginOptions = {
    ejsModule: ejs_default,
    renderOptions: {},
    renderData: {},
    ...rawPluginOptions,
  };

  const ejs = pluginOptions.ejsModule;

  const fileLoaderTracker = new Set();
  const prevFileLoader = ejs.fileLoader;

  // rewrite file loader to track included files
  ejs.fileLoader = function (filePath) {
    fileLoaderTracker.add(getAbsolutePath(filePath));
    return prevFileLoader.apply(this, arguments);
  };

  // wrap ejs.renderFile as a Promise
  function renderFile(...args) {
    return new Promise((resolve, reject) => {
      ejs.renderFile(...args, (err, str) => err ? reject(err) : resolve(str));
    });
  }

  // record the include links
  const includeMap = new Map();

  return {
    name: 'snowpack-ejs-plugin',
    resolve: { input: ['.ejs'], output: ['.html'] },

    onChange({ filePath }) {
      includeMap.forEach((v, k) => {
        if (v.has(getAbsolutePath(filePath))){
          this.markChanged(k);
        }
      });
    },

    async load (hookParams) {
      if (!hookParams.filePath) return;

      const filePath = getAbsolutePath(hookParams.filePath);

      if (path.basename(filePath).startsWith('_')) return;

      const renderData = computeOptionValue(pluginOptions.renderData, pluginOptions, hookParams);
      const renderOptions = computeOptionValue(pluginOptions.renderOptions, pluginOptions, hookParams);

      fileLoaderTracker.clear();

      const renderResult = await renderFile(filePath, renderData, renderOptions);

      fileLoaderTracker.delete(filePath); // omit the root files itself
      includeMap.set(filePath, new Set(fileLoaderTracker));

      return renderResult;
    },
  };
};

