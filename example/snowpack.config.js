module.exports = {
  plugins: [
    ['../', {
      renderData: {
        // nickname: 'Super Calf',
        nickname: 'Snowpack + EJS',
      },
      renderOptions: ({ filePath }) => {
        return {
          rmWhitespace: true,
          delimiter: filePath.includes('copyright.ejs') ? '?' : undefined,
        };
      },
    }],
  ],
};
