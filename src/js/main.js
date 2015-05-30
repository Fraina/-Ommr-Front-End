/*global requirejs*/
requirejs.config({

  paths: {
    jquery: '../bower/jquery/dist/jquery.min',
    underscore: '../bower/underscore/underscore-min',
    i18n: '../bower/requirejs-i18n/i18n',
    text: '../bower/requirejs-text/text',
    reactjs: '../bower/react/react-with-addons',
    JSXTransformer: '../bower/react/JSXTransformer',
    flux: '../bower/flux/dist/Flux',
    jsx: 'vendor/jsx',
    eventEmitter: '../bower/eventEmitter/EventEmitter.min',
    mock: '../bower/mockjs/dist/mock',
    'object-assign': 'vendor/object-assign'
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
  'jsx!components/AudioPlayer'
], function ($, _, React, AudioPlayer) {
  'use strict';

});
