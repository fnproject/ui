var webpack = require('webpack');
var path = require('path');
var fs = require('fs');
var extractTextPlugin = require("extract-text-webpack-plugin");

var nodeModules = {};
fs.readdirSync('node_modules')
  .filter(function(x) {
    return ['.bin'].indexOf(x) === -1;
  })
  .forEach(function(mod) {
    nodeModules[mod] = 'commonjs ' + mod;
  });

module.exports = [
    {
        name: 'server',
        entry: './server/server.js',
        target: 'node',
        output: {
          path: path.join(__dirname, 'build'),
          filename: 'backend.js'
        },
        externals: nodeModules
    },
    {
        name: 'client',
        entry: './client/client.js',
        // target: 'web', // by default
        output: {
          path: path.join(__dirname, 'public', 'build'),
          filename: 'app.js',
        },
        externals: nodeModules,
        module: {
          loaders: [
            // Extract css files
            {
                test: /\.css$/,
                loader: extractTextPlugin.extract("style-loader", "css-loader")
            },

            // ES2015
            {
              test: /\.jsx$/,
              loader: 'babel',
              exclude: /node_modules/,
              query: {
                presets: ['es2015']
              }
            },

            // SASS
            {
              test: /\.scss$/,
              loader: extractTextPlugin.extract("style-loader", "css-loader!sass-loader")
            }

          ]
        },
        plugins: [
          new extractTextPlugin("[name].css", {
            allChunks: false
          })
        ]
    }
];

