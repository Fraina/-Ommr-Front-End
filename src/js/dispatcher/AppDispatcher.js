(function(factory) {

  define([
    'flux'
  ], factory);

})(function(Flux) {
  'use strict';

  var Dispatcher = new Flux.Dispatcher();

  return Dispatcher;

});
