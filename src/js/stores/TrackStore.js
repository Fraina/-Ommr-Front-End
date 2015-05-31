(function(factory) {

  define([
    'constants/AudioConstants',
    'dispatcher/AppDispatcher',
    'eventEmitter',
    'object-assign',
    'ommr',
    'Ajax'
  ], factory);

}) (function(AudioConstants, AppDispatcher, EventEmitter, assign, Ommr, Ajax) {

  var audio = new Ommr(),
      ajax = new Ajax();

  var tracks = {},
      CHANGE_EVENT = 'change';

  var TrackStore = assign({}, EventEmitter.prototype, {
    init: function() {
      var audioConfig = {},
          self = this;

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

    addChangeListener: function(callback, objectItSelf) {
      this.on(CHANGE_EVENT, callback.bind(objectItSelf));
    },

    removeChangeListener: function(callback, objectItSelf) {
      this.removeListener(CHANGE_EVENT, callback.bind(objectItSelf));
    }

  });


// Register callback to handle all updates
  AppDispatcher.register(function(action) {
    switch (action.actionType) {
      case AudioConstants.PLAY_APPOINTED_TRACK:
        audio.play(action.trackId);
        break;

      default:
        return false;
    }
  });

  return TrackStore;

});
