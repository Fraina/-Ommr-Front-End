(function(factory) {

  define([
    'constants/AudioConstants',
    'dispatcher/AppDispatcher',
    'eventEmitter',
    'object-assign',
    'ommr',
    'Ajax'
  ], factory);

}) (function(Constants, AppDispatcher, EventEmitter, assign, Ommr, Ajax) {

  var audio = new Ommr(),
      ajax = new Ajax();


  var tracks = {};

  var TrackStore = {
    // store method
  };

  AppDispatcher.register(function(action) {
    // Register callback to handle all updates
  });

  return TrackStore;

});
