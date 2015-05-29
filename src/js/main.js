/*global requirejs*/
requirejs.config({

  paths: {
    jquery: '../bower/jquery/dist/jquery.min',
    underscore: '../bower/underscore/underscore-min',
    i18n: '../bower/requirejs-i18n/i18n',
    text: '../bower/requirejs-text/text',
    reactjs: '../bower/react/react-with-addons',
    JSXTransformer: '../bower/react/JSXTransformer',
    jsx: 'vendor/jsx',
    mock: '../bower/mockjs/dist/mock'
  },

  shim: {
    underscore: {
      exports: '_'
    }
  },

  jsx: {
    // ES6 features supported
    harmony: true,
    fileExtension: '.jsx'
  }
});

require([
  'jquery',
  'underscore',
  'reactjs',
  'jsx!views/player'
], function ($, _, React, Player) {
  'use strict';

});
