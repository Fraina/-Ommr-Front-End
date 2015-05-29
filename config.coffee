module.exports =
  rjs:
    options:
      name: 'main'
      out: 'app.js'
      paths:
        jquery: '../bower/jquery/dist/jquery.min'
        underscore: '../bower/underscore/underscore-min'
        reactjs: '../bower/react/react-with-addons'
        JSXTransformer: '../bower/react/JSXTransformer'
        i18n: '../bower/requirejs-i18n/i18n'
        text: '../bower/requirejs-text/text'
  docco:
    layout: 'linear'
  remarkable:
    remarkableOptions:
      html: true
  deploy:
    cacheDir: '.cache'
