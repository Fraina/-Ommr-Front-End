(function(factory) {

  define([
    'constants/AudioConstants',
    'dispatcher/AppDispatcher'
  ], factory);

})(function(Constants, Dispatcher) {

  var AudioActions = {
    playTrack: function() {
      console.log('playTrack');
    }
  }

  return AudioActions;

});