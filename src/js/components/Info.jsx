(function(factory) {

  define([
    'reactjs',
  ], factory);

})(function(React) {
  'use strict';

  class Info extends React.Component {
    render() {
      return (
        <div className="AudioPlayer-info">
          <div className="AudioPlayer-trackName">猫侍の逆襲</div>
          <div className="AudioPlayer-artist">猫叉Master</div>
          <div className="AudioPlayer-album">猫叉Master 4th Album『follow slowly』</div>
        </div>
      )
    }
  }

  return Info;

});
