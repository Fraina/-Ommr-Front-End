(function(factory) {

  define([
    'reactjs',
    'stores/TrackStore'
  ], factory);

})(function(React, TrackStore) {
  'use strict';

  class Cover extends React.Component {
    constructor() {
      var trackCover = 'default.jpg';
      this.state = {trackCover: trackCover};
    }

    componentDidMount() {
      TrackStore.addChangeListener(this.update, this);
    }

    update() {
      var nowTrackCover = TrackStore.getNowTrack().info.cover || 'default.jpg';
      this.setState({trackCover: nowTrackCover});
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
