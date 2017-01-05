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
      './client/client.js',
    ],
    // target: 'web', // by default
    output: {
      path: path.join(__dirname, 'public', 'build'),
      filename: 'app.js',
    },
    resolve: {
      extensions: ['', '.js', '.vue', '.json'],
      fallback: [path.join(__dirname, './node_modules')],

      alias: {
        'vue$': path.join(__dirname, './node_modules/vue/dist/vue.common.js'),
        'vue-router$': path.join(__dirname, './node_modules/vue-router/dist/vue-router.common.js'),
      }
    },
    module: {
      preLoaders: [
        { test: /\.css$/, loader: 'stylelint' }
      ],
      loaders: [
        // {
        //   test:/bootstrap-sass[\/\\]assets[\/\\]javascripts[\/\\]/,
        //   loader: 'imports?jQuery=jquery'
        // },
        {
          test: /\.vue$/,
          loader: 'vue',
          options: {
            // vue-loader options go here
          }
        },

        // Extract css files
        {
            test: /\.css$/,
            loader: extractTextPlugin.extract("style-loader", "css-loader!postcss")
        },

        // ES2015
        {
          test: /\.js$/,
          loader: 'babel',
          exclude: /node_modules/
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
      }),
      postcssURL(),
      require('postcss-hexrgba')(),
      cssnext()
    ]
  }
];
