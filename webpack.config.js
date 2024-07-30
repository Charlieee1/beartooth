const path = require('path');

module.exports = {
  entry: './src/script.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'script.js',
    webassemblyModuleFilename: '8ab0cd5fbeada24959ae.module.wasm',
  },
  experiments: {
    asyncWebAssembly: true,
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      minSize: Infinity,
    },
  },
};
