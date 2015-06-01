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
      ajax = new Ajax();

  var tracks = {},
      CHANGE_EVENT = 'change';

  var TrackStore = assign({}, EventEmitter.prototype, {
    init: function() {
      var self = this,
          audioConfig = {
            'callbacks': {
              ended: function() {self.emit(AudioConstants.AUDIO_ENDED)},
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
          (! _.isUndefined(value.loop)) ? ret['loop'] = value.loop : false;
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
      var trackId = tracks.nowPlaying || 0,
          isPlaying = (! _.isNull(audio.status())) ? audio.status().status : false,
          ret = {};
      ret['trackId'] = trackId;
      ret['audio'] = audio.trackList[trackId].audio;
      ret['info'] = tracks[trackId];
      ret['isPlaying'] = isPlaying;

      return ret;
    },

    updatePlayingTrack: function(id) {
      tracks['nowPlaying'] = id;
      this.emit(CHANGE_EVENT);
    },

    updateCurrentTime: function() {
      var nowTrackStatus = audio.status(),
          ret =  nowTrackStatus.currentTime;

      return ret;
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
        var id = action.trackId;
        audio.play(id);
        TrackStore.updatePlayingTrack(id);
        break;

      case AudioConstants.AUDIO_CHANGE_CURRENT_TIME:
        var appointedPercent = action.appointedPercent,
            oldDuration = audio.status().duration,
            newDuration = (oldDuration / 100) * appointedPercent;
        audio.changeProgress(newDuration);
        break;

      default:
        return false;
    }
  });

  return TrackStore;

});
