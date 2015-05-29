(function(factory) {

  define([
    'reactjs'
  ], factory);

})(function(React) {
  'use strict';

  class Player extends React.Component {
    render() {
      return (
        <div className="AudioPlayer">
          <div className="AudioPlayer-albumPic">
            <img src="img/cover.jpg" />
          </div>
          <div className="AudioPlayer-detail">
            <div className="AudioPlayer-info">
              <div className="AudioPlayer-trackName">猫侍の逆襲</div>
              <div className="AudioPlayer-artist">猫叉Master</div>
              <div className="AudioPlayer-album">猫叉Master 4th Album『follow slowly』</div>
            </div>
            <div className="AudioPlayer-controller">
              <div className="AudioPlayer-progress">
                <i className="ion-play"></i>
                <div className="AudioPlayer-progressBar">
                  <canvas id="canvas-progress"></canvas>
                </div>
              </div>
              <div className="AudioPlayer-volume">
                <i className="ion-volume-high"></i>
                <div className="AudioPlayer-volumeBar">
                  <canvas id="canvas-volume"></canvas>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }
  }

  React.render(<Player name="World" />, document.getElementById('app'));

});
