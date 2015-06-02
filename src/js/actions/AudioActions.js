(function(factory) {

  define([
    'constants/AudioConstants',
    'dispatcher/AppDispatcher'
  ], factory);

})(function(AudioConstants, AppDispatcher) {

  var AudioActions = {
    playTrack: function(action) {
      AppDispatcher.dispatch({
        actionType: AudioConstants.PLAY_APPOINTED_TRACK,
        actionTrigger: action.actionTrigger,
        trackId: action.trackId
      })
    },

    changeCurrentTime: function(percent) {
      AppDispatcher.dispatch({
        actionType: AudioConstants.AUDIO_CHANGE_CURRENT_TIME,
        appointedPercent: percent
      })
    },

    changeVolume: function(percent) {
      AppDispatcher.dispatch({
        actionType: AudioConstants.AUDIO_CHANGE_VOLUME,
        appointedPercent: percent
      })
    },

    toggleMute: function() {
      AppDispatcher.dispatch({
        actionType: AudioConstants.AUDIO_TOGGLE_MUTE
      })
    }
  }

  return AudioActions;

});