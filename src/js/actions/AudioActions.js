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
    },

    changeCurrentTime: function(appointedPosition) {
      var perPercentWidth = appointedPosition.elementWidth / 100,
          appointedPercent = ((appointedPosition.pageX - appointedPosition.elementLeft) / perPercentWidth);

      AppDispatcher.dispatch({
        actionType: AudioConstants.AUDIO_CHANGE_CURRENT_TIME,
        appointedPercent: appointedPercent
      })
    }
  }

  return AudioActions;

});