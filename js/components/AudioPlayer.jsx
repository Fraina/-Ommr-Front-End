(function(factory) {

  define([
    'reactjs',
    'jsx!components/Cover',
    'jsx!components/AudioDetail',
    'jsx!components/TrackList',
    'stores/TrackStore'
  ], factory);

})(function(React, Cover, AudioDetail, TrackList, TrackStore) {
  'use strict';

  class Player extends React.Component {
    componentDidMount() {
      TrackStore.init();
    }

    render() {
      return (
        <div className="AudioPlayer">
          <Cover />
          <AudioDetail />
          <TrackList />
        </div>
      )
    }
  }

  React.render(<Player name="World" />, document.getElementById('app'));

});
