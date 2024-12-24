const path = require('path');

const config = {  
  mode: 'production',
  entry: './src/dropMenu.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'bundle.js',
    libraryTarget: 'commonjs2'
    
  },
  module:{
    rules: [
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ]
      }
    ]
  }
}

module.exports = config;