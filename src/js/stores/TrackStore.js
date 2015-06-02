(function(factory) {

  define([
    'underscore',
    'constants/AudioConstants',
    'dispatcher/AppDispatcher',
    'eventEmitter',
    'object-assign',
    'ommr',
    'Ajax'
  ], factory);

}) (function(_, AudioConstants, AppDispatcher, EventEmitter, assign, Ommr, Ajax) {

  var audio = new Ommr(),
      ajax = new Ajax(),

      tracks = {},
      nowPlaying = 0,
      nowPlayMode = 'normal',
      loop = false,
      shuffle = false,

      MODE_CHANGE_EVENT = AudioConstants.MODE_CHANGE,
      CHANGE_EVENT = 'change';

  var TrackStore = assign({}, EventEmitter.prototype, {
    init: function() {
      var self = this,
          audioConfig = {
            'volume': 0.7,
            'callbacks': {
              playing: function() {self.emit(AudioConstants.AUDIO_PLAYING)},
              pause: function() {self.emit(AudioConstants.AUDIO_PAUSE)},
              ended: function() {self.emit(AudioConstants.AUDIO_ENDED)},
              volumechange: function() {self.emit(AudioConstants.AUDIO_CHANGE_VOLUME)},
              timeupdate: function() {self.emit(AudioConstants.AUDIO_UPDATE_CURRENT_TIME)},
              durationchange: function() {self.emit(AudioConstants.AUDIO_DURATION_CHANGE)}
            }
          };

      ajax.get('trackList.json').done(function(res) {
        audioConfig['path'] = res.path || 'sound/';
        audioConfig['sounds'] = (_.isUndefined(res.tracks) || _.isEmpty(res.tracks)) ? null : {};
        (! _.isUndefined(res.type)) ? audioConfig['type'] = res.type : false;
        (! _.isUndefined(res.preload)) ? audioConfig['preload'] = res.preload : false;

        _.each(res.tracks, function(value, key) {
          var ret = {}
          ret['file'] = value.fileName || '';
          if (! _.isUndefined(value.type)) ret.type = value.type;
          audioConfig['sounds'][key] = ret;

          return tracks[key] = value.info;
        })

        audio.init(audioConfig);
        self.emit(CHANGE_EVENT);
      })

      return this;
    },

    getAllTracks: function() {
      return tracks;
    },

    getNowTrack: function() {
      var temp = (! _.isNull(audio.status())) ? audio.status().status : null;
      var trackId = nowPlaying,
          isPlaying = (! _.isNull(audio.status())) ? audio.status().status : 'stop',
          volume = (! _.isNull(audio.status())) ? audio.status().volume : 0,
          muted = (! _.isNull(audio.status())) ? audio.status().muted : false,
          ret = {};

      ret['trackId'] = trackId;
      ret['audio'] = audio.trackList[trackId].audio;
      ret['info'] = tracks[trackId];
      ret['isPlaying'] = isPlaying;
      ret['volume'] = volume;
      ret['muted'] = muted;
      ret['mode'] = nowPlayMode;

      return ret;
    },

    updatePlayingTrack: function(id) {
      nowPlaying = id;
      this.emit(CHANGE_EVENT);
    },

    updateCurrentTime: function() {
      var nowTrackStatus = audio.status(),
          ret =  nowTrackStatus.currentTime;

      return ret;
    },

    toggleMode: function(mode) {
      (mode === 0) ? loop = ! loop : shuffle = ! shuffle;
      switch (true) {
        case (! loop && shuffle):
          nowPlayMode = 'shuffle';
          break;
        case (loop && ! shuffle):
          nowPlayMode = 'loop';
          break;
        case (loop && shuffle):
          nowPlayMode = 'shuffle_loop';
          break;
        default:
          nowPlayMode = 'normal';
      }

      this.emit(MODE_CHANGE_EVENT);
    },

    addEventListener: function(event, callback, objectItSelf) {
      this.on(event, callback.bind(objectItSelf));
    },

    removeEventListener: function(event, callback) {
      this.removeListener(event, callback);
    },

    addChangeListener: function(callback, objectItSelf) {
      this.on(CHANGE_EVENT, callback.bind(objectItSelf));
    },

    removeChangeListener: function(callback) {
      this.removeListener(CHANGE_EVENT, callback);
    }

  });


// Register callback to handle all updates
  AppDispatcher.register(function(action) {
    switch (action.actionType) {
      case AudioConstants.PLAY_APPOINTED_TRACK:
        var id = action.trackId,
            actionTrigger = action.actionTrigger;
        if (! _.isUndefined(actionTrigger)) {
          audio.stopAll();
          TrackStore.emit(AudioConstants.RESET_PLAYED_TRACKLIST);
        }
        audio.play(id);
        TrackStore.updatePlayingTrack(id);
        break;

      case AudioConstants.AUDIO_CHANGE_CURRENT_TIME:
        var appointedPercent = action.appointedPercent,
            oldDuration = audio.status().duration,
            newDuration = (oldDuration / 100) * appointedPercent;
        audio.changeProgress(newDuration);
        break;

      case AudioConstants.AUDIO_CHANGE_VOLUME:
        var appointedPercent = action.appointedPercent,
            newVolume = appointedPercent / 100;
        audio.setVolume(newVolume);
        break;

      case AudioConstants.AUDIO_TOGGLE_MUTE:
        audio.toggleMuted();
        break;

      case AudioConstants.TOGGLE_LOOP_MODE:
        TrackStore.toggleMode(0);
        break;

      case AudioConstants.TOGGLE_SHUFFLE_MODE:
        TrackStore.toggleMode(1);
        break;

      default:
        return false;
    }
  });

  return TrackStore;

});
