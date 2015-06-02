(function(factory) {

  define([
    'reactjs',
    'stores/TrackStore'
  ], factory);

})(function(React, TrackStore) {
  'use strict';

  class Cover extends React.Component {
    constructor() {
      var defaultCoverSrc = 'default.png';
      this.state = {
        defaultCover: defaultCoverSrc,
        trackCover: defaultCoverSrc
      };
    }

    componentDidMount() {
      TrackStore.addChangeListener(this.update, this);
    }

    update() {
      var nowTrackCover = TrackStore.getNowTrack().info.cover || this.state.defaultCover;
      this.setState({ trackCover: nowTrackCover });
    }

    render() {
      var path = 'img/' + this.state.trackCover;
      return (
        <div className="AudioPlayer-cover">
          <img src={path} />
        </div>
      )
    }
  }

  return Cover;

});
