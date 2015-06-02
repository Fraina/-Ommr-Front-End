(function(factory) {

  define([
    'reactjs',
    'stores/TrackStore'
  ], factory);

})(function(React, TrackStore) {
  'use strict';

  class Info extends React.Component {
    constructor() {
      var trackInfo = {};
      this.state = {trackInfo: trackInfo};
    }

    componentDidMount() {
      TrackStore.addChangeListener(this.update, this);
    }

    update() {
      var nowTrackInfo = TrackStore.getNowTrack().info;
      this.setState({ trackInfo: nowTrackInfo });
    }

    render() {
      return (
        <div className="AudioPlayer-info">
          <div className="AudioPlayer-trackName">{this.state.trackInfo.name}</div>
          <div className="AudioPlayer-artist">{this.state.trackInfo.artist}</div>
          <div className="AudioPlayer-album">{this.state.trackInfo.album}</div>
        </div>
      )
    }
  }

  return Info;

});
