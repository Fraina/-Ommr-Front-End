(function(factory) {

  define([
    'reactjs'
  ], factory);

})(function(React) {
  'use strict';

  class Controller extends React.Component {
    render() {
      return (
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
      )
    }
  }

  return Controller;

});
