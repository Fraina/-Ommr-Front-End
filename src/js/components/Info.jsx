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
      var nowPlaying = this.state.trackInfo,
          coverPath = 'img/',
          coverFileName = (nowPlaying.cover) ? nowPlaying.cover : 'default.png';

      // replace favicon as cover, also the track name.
      var link = document.createElement('link'),
          oldLink = document.getElementById('dynamic-favicon');
      link.id = 'dynamic-favicon';
      link.rel = 'shortcut icon';
      link.href = coverPath + coverFileName;
      if (oldLink) document.getElementsByTagName('head')[0].removeChild(oldLink);
      document.getElementsByTagName('head')[0].appendChild(link);
      document.title = nowPlaying.name + ' - ♪Ommr Front-End';

      return (
        <div className="AudioPlayer-info">
          <div className="AudioPlayer-trackName">{nowPlaying.name}</div>
          <div className="AudioPlayer-artist">{nowPlaying.artist}</div>
          <div className="AudioPlayer-album">{nowPlaying.album}</div>
        </div>
      )
    }
  }

  return Info;

});
