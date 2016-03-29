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
        entry: [
          'jquery/',
          //'bootstrap-loader/extractStyles',
          './client/client.js',
        ],
        // target: 'web', // by default
        output: {
          path: path.join(__dirname, 'public', 'build'),
          filename: 'app.js',
        },
        // resolve: {
        //     alias: {
        //         jquery: "jquery/src/jquery"
        //     }
        // },
        externals: nodeModules,
        module: {
          loaders: [
            // {
            //   test:/bootstrap-sass[\/\\]assets[\/\\]javascripts[\/\\]/,
            //   loader: 'imports?jQuery=jquery'
            // },

            // Extract css files
            {
                test: /\.css$/,
                loader: extractTextPlugin.extract("style-loader", "css-loader")
            },

            // ES2015
            {
              test: /\.js$/,
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
            },

            {
              test: /\.woff2?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
              loader: "url?limit=10000"
            },

            {
              test: /\.(ttf|eot|svg)(\?[\s\S]+)?$/,
              loader: 'file'
            }

          ]
        },
        plugins: [
          // new webpack.ProvidePlugin({
          //     $: "jquery",
          //     jQuery: "jquery",
          //     "window.jQuery": "jquery"
          // }),
          new extractTextPlugin("app.css", {
            allChunks: true
          })
        ]
    }
];

