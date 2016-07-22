const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const extractTextPlugin = require("extract-text-webpack-plugin");

// style
const postcssImport         = require('postcss-import');
const postcssURL            = require('postcss-url');
const cssnext               = require('postcss-cssnext');
const cssnano               = require('cssnano');
const fontMagician          = require('postcss-font-magician');


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
      'angular/',
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
      preLoaders: [
        { test: /\.css$/, loader: 'stylelint' }
      ],
      loaders: [
        // {
        //   test:/bootstrap-sass[\/\\]assets[\/\\]javascripts[\/\\]/,
        //   loader: 'imports?jQuery=jquery'
        // },

        // Extract css files
        {
            test: /\.css$/,
            loader: extractTextPlugin.extract("style-loader", "css-loader!postcss-loader")
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
    ],
    stylelint: {
      configFile: path.join(__dirname, './stylelint.config.js'),
      configOverrides: {
        rules: {
            // Your rule overrides here
        }
      }
    },
    postcss: [
      // inline @import need to merge vars
      postcssImport(),
      fontMagician({
        hosted: path.join(__dirname, './public/fonts/Roboto')
        // hosted: './public/fonts/Roboto'
      }),
      postcssURL(),
      require('postcss-hexrgba')(),
      cssnext()
    ]
  }
];
