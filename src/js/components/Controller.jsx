(function(factory) {

  define([
    'underscore',
    'reactjs',
    'stores/TrackStore',
    'actions/AudioActions',
    'constants/AudioConstants'
  ], factory);

})(function(_, React, TrackStore, actions, AudioConstants) {
  'use strict';

  class Controller extends React.Component {
    constructor() {
      var trackAudio = {};
      this.state = {
        trackAudio: trackAudio,
        progressWidth: 0
      };
    }

    componentDidMount() {
      TrackStore.addChangeListener(this.update, this);
      TrackStore.addEventListener(AudioConstants.AUDIO_UPDATE_CURRENT_TIME, this.updateCurrentTime, this);
    }

    update() {
      var nowPlayingAudio = TrackStore.getNowTrack().audio;
      this.setState({
        trackAudio: nowPlayingAudio
      });
    }

    updateCurrentTime() {
      var progressObject = TrackStore.updateCurrentTime(),
          progressBarWrapper = React.findDOMNode(this.refs.progressBar),
          progressBarWidth = progressBarWrapper.offsetWidth,
          isAvaliable = true;

      // hack firefox can't get current duration while using Laima proxy server
      if (String(progressObject.duration) === 'Infinity') {
        isAvaliable = false;
        this.setState({
          duration: 'Infinity',
          progressWidth: progressBarWidth + 'px'
        });
        TrackStore.removeEvent(AudioConstants.AUDIO_UPDATE_CURRENT_TIME);
        progressBarWrapper.removeEventListener('click', this.changeCurrentTime, false);
        return false;
      }

      if (isAvaliable) {
        var widthPerPercent = progressBarWidth / 100,
            progressPercent = (progressObject.currentTime * 100) / progressObject.duration;
        this.setState({
          progressWidth: progressPercent * widthPerPercent + 'px'
        });
      }
    }

    changeCurrentTime(e) {
      var status = (TrackStore.getNowTrack().isPlaying === 'playing') ? true : false,
          available = true;

      // hack firefox can't get current duration while using Laima proxy server
      if (this.state.duration == 'Infinity') {
        available = false;
      }

      if (available && status) {
        var ret = {
              pageX: e.pageX,
              elementLeft: e.currentTarget.getBoundingClientRect().left,
              elementWidth: e.currentTarget.offsetWidth
            };

        actions.changeCurrentTime(ret);
      }
    }

    render() {
      var progressWidthStyle = {width: this.state.progressWidth};
      return (
        <div className="AudioPlayer-controller">
          <div className="AudioPlayer-progress">
            <i className="ion-play"></i>
            <div className="AudioPlayer-progressBar" ref="progressBar" onClick={this.changeCurrentTime.bind(this)}>
              <canvas id="canvas-progress" style={progressWidthStyle}></canvas>
            </div>
          </div>
          <div className="AudioPlayer-volume">
            <i className="ion-volume-high"></i>
            <div className="AudioPlayer-volumeBar">
              <canvas id="canvas-volume"></canvas>
            </div>
          </div>
          <div className="AudioPlayer-mode">
            <i className="ion-loop"></i>
            <i className="ion-shuffle"></i>
          </div>
        </div>
      )
    }
  }

  return Controller;

});
