(function(factory) {

  define([
    'reactjs',
    'actions/AudioActions',
    'stores/TrackStore'
  ], factory);

})(function(React, AudioActions, TrackStore) {
  'use strict';

  var durationFormat = function(duration) {
    var regExp = /(\d[^\D]*)/g,
        matches = duration.match(regExp),
        ret = '';

    switch (matches.length) {
      case 2:
        ret = matches[0] + ':' + matches[1];
        break;
      case 3:
        ret = matches[0] + ':' + matches[1] + ':' + matches[2];
        break;
      default:
        ret = 'NaN';
    }

    return ret;
  }

  class TrackList extends React.Component {

    constructor() {
      var tracks = {};
      this.state = {tracks: tracks};
    }

    componentDidMount() {
      TrackStore.addChangeListener(this.update, this);
    }

    update() {
      this.setState({tracks: TrackStore.getAllTracks()});
    }

    DoubleClickHandler(trackId) {
      AudioActions.playTrack(trackId);
    }

    render() {
      return (
        <div className="AudioPlayer-Tracks">
          <ul className="AudioPlayer-TrackList">

            {Object.keys(this.state.tracks).map(function(trackId) {
              if (trackId != 'nowPlaying') {
                var track = this.state.tracks[trackId],
                    itemClass = 'AudioPlayer-TrackItem g',
                    duration = (! _.isUndefined(track.duration)) ? durationFormat(track.duration) : false;

                if (this.state.tracks.nowPlaying === trackId) itemClass += ' is-playing';

                return (
                  <li
                    className={itemClass}
                    key={trackId}
                    onDoubleClick={this.DoubleClickHandler.bind(null, trackId)}
                    onTouchEnd={this.DoubleClickHandler.bind(null, trackId)}
                  >
                    <span className="AudioPlayer-TrackPlaying g-b--1of12"></span>
                    <span className="AudioPlayer-TrackName g-b--9of12">{track.name}</span>
                    <span className="AudioPlayer-TrackDuration g-b--2of12">{duration}</span>
                  </li>
                )
              }
            }, this)}
          </ul>
        </div>
      )
    }

  }

  return TrackList;

});
