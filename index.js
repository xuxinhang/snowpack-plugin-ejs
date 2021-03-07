const path = require('path');
const fs = require('fs');
const ejs = require('ejs');

// wrap ejs.renderFile as a Promise
function renderFile(...args) {
  return new Promise((resolve, reject) => {
    ejs.renderFile(...args, (err, str) => err ? reject(err) : resolve(str));
  });
}


module.exports = function (snowpackConfig, pluginOptions) {

  // record the include links
  const includeMap = new Map();

  // track the files which are read
  const fileLoaderTracker = new Set();
  const prevFileLoader = ejs.fileLoader;
  ejs.fileLoader = function (path) {
    fileLoaderTracker.add(path);
    return prevFileLoader.apply(this, arguments);
  };

  return {
    name: 'snowpack-ejs-plugin',
    resolve: {
      input: ['.ejs'],
      output: ['.html'],
    },

    onChange({ filePath }) {
      includeMap.forEach((v, k) => {
        if (v.has(filePath)){
          this.markChanged(k);
        }
      });
    },
    
    async load ({ filePath }) {
      if (!filePath) return;
      if (path.basename(filePath).startsWith('_')) return;

      const renderData = {};
      const renderOptions = {};

      fileLoaderTracker.clear();
      const renderResult = await renderFile(filePath, renderData, renderOptions);
      fileLoaderTracker.delete(filePath); // omit the root files itself
      includeMap.set(filePath, new Set(fileLoaderTracker));

      return renderResult;
    },
  };
};

