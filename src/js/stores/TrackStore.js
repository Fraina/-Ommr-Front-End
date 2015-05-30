(function(factory) {

  define([
    'constants/AudioConstants',
    'dispatcher/AppDispatcher',
    'eventEmitter',
    'object-assign'
  ], factory);

}) (function(Constants, AppDispatcher, EventEmitter, assign) {

  var tracks = {};

  var TrackStore = {
    // store method
  };

  AppDispatcher.register(function(action) {
    // Register callback to handle all updates
  });

  return TrackStore;

});
