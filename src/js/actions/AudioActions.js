(function(factory) {

  define([
    'constants/AudioConstants',
    'dispatcher/AppDispatcher'
  ], factory);

})(function(AudioConstants, AppDispatcher) {

  var AudioActions = {
    playTrack: function(trackId) {
      AppDispatcher.dispatch({
        actionType: AudioConstants.PLAY_APPOINTED_TRACK,
        trackId: trackId
      })
    }
  }

  return AudioActions;

});