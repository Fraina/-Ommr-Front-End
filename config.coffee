module.exports =
  rjs:
    options:
      name: 'main'
      out: 'app.js'
      paths:
        jquery: '../bower/jquery/dist/jquery.min'
        underscore: '../bower/underscore/underscore-min'
        i18n: '../bower/requirejs-i18n/i18n'
        text: '../bower/requirejs-text/text'
        reactjs: '../bower/react/react-with-addons'
        JSXTransformer: '../bower/react/JSXTransformer'
        flux: '../bower/flux/dist/Flux'
        jsx: 'vendor/jsx'
        eventEmitter: '../bower/eventEmitter/EventEmitter.min'
        'object-assign': 'vendor/object-assign'
  docco:
    layout: 'linear'
  remarkable:
    remarkableOptions:
      html: true
  deploy:
    cacheDir: '.cache'
