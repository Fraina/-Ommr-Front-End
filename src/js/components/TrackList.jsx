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

    DoubleClickHandler(key, e) {
      var trackId = key,
          node = e.currentTarget,
          regExp = /\S+$/;

      _.each(e.currentTarget.parentElement.childNodes, function(node) {
        if (node.className.match(regExp) == 'is-playing') {
          node.className = node.className.replace(regExp, '')
        }
      })
      node.className += ' is-playing';

      AudioActions.playTrack(key);
    }

    render() {
      return (
        <div className="AudioPlayer-Tracks">
          <ul className="AudioPlayer-TrackList">
            {Object.keys(this.state.tracks).map(function(key) {
              var track = this.state.tracks[key],
                  duration = durationFormat(track.duration)
              return (
                <li
                  className="AudioPlayer-TrackItem g"
                  key={key}
                  onDoubleClick={this.DoubleClickHandler.bind(this, key)}
                  onTouchEnd={this.DoubleClickHandler.bind(this, key)}
                >
                  <span className="AudioPlayer-TrackPlaying g-b--1of12"></span>
                  <span className="AudioPlayer-TrackName g-b--9of12">{track.name}</span>
                  <span className="AudioPlayer-TrackDuration g-b--2of12">{duration}</span>
                </li>
              )
            }, this)}
          </ul>
        </div>
      )
    }

  }

  return TrackList;

});
