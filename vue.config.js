module.exports = {
  css: {
    loaderOptions: {
      css: {
        url: {
          filter: url => !url.startsWith('/'),
        }
      },
    },
  },
};
