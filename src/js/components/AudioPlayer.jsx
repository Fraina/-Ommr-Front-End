(function(factory) {

  define([
    'reactjs',
    'jsx!components/Cover',
    'jsx!components/AudioDetail'
  ], factory);

})(function(React, Cover, AudioDetail) {
  'use strict';

  class Player extends React.Component {
    render() {
      return (
        <div className="AudioPlayer">
          <Cover />
          <AudioDetail />
        </div>
      )
    }
  }

  React.render(<Player name="World" />, document.getElementById('app'));

});
