(function(factory) {

  define([
    'underscore',
    'reactjs',
    'actions/AudioActions',
    'stores/TrackStore'
  ], factory);

})(function(_, React, AudioActions, TrackStore) {
  'use strict';

  var durationFormat = function(duration) {
    if (! _.isFinite(duration)) return false;
    var floorDuration = Math.floor(duration),
        second = (String(floorDuration % 60).length === 1) ? '0' + (floorDuration % 60) : (floorDuration % 60),
        minute = (floorDuration - second) / 60;

    return minute + 'm' + second;
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
      this.setState({
        tracks: TrackStore.getAllTracks(),
        nowPlaying: TrackStore.getNowTrack().trackId
      });
    }

    DoubleClickHandler(trackId) {
      var ret = {
        actionTrigger: 'trackList',
        trackId: trackId
      }
      AudioActions.playTrack(ret);
    }

    render() {
      return (
        <div className="AudioPlayer-Tracks">
          <ul className="AudioPlayer-TrackList">

            {Object.keys(this.state.tracks).map(function(trackId) {
              var track = this.state.tracks[trackId],
                  itemClass = 'AudioPlayer-TrackItem g',
                  // hack firefox can't get current duration while using Laima proxy server
                  duration = (! _.isFinite(duration)) ? durationFormat(track.duration) : false;
              if (this.state.nowPlaying === trackId) itemClass += ' is-playing';

              return (
                <li className={itemClass}
                  key={trackId}
                  onDoubleClick={this.DoubleClickHandler.bind(null, trackId)}
                  onTouchEnd={this.DoubleClickHandler.bind(null, trackId)}
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
