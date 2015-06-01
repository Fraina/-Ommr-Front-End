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
        progressWidth: 0,
        playerStatus: 'ion-play'
      };
    }

    componentDidMount() {
      TrackStore.addChangeListener(this.update, this);
      TrackStore.addEventListener(AudioConstants.AUDIO_UPDATE_CURRENT_TIME, this.updateCurrentTime, this);
    }

    update() {
      var nowPlayingTrack = TrackStore.getNowTrack(),
          isTrackChange = (_.isUndefined(this.state.nowPlaying) || this.state.nowPlaying === nowPlayingTrack.trackId) ? false : true,
          ret = {
            playerStatus: 'ion-pause',
            nowPlaying: String(nowPlayingTrack.trackId),
            trackAudio: nowPlayingTrack.audio
          };

      if (! isTrackChange) ret = _.omit(ret, 'playerStatus');

      this.setState(ret)
    }

    updateCurrentTime() {
      var progressCurrentTime = TrackStore.updateCurrentTime(),
          progressBarWrapper = React.findDOMNode(this.refs.progressBar),
          progressBarWidth = progressBarWrapper.offsetWidth,
          isAvaliable = true;

      // hack firefox can't get current duration while using Laima proxy server
      if (String(this.state.trackAudio.duration) === 'Infinity') {
        isAvaliable = false;
        TrackStore.removeEvent(AudioConstants.AUDIO_UPDATE_CURRENT_TIME);
        progressBarWrapper.removeEventListener('click', this.changeCurrentTime, false);

        this.setState({ progressWidth: progressBarWidth + 'px' });

        return false;
      }

      if (isAvaliable) {
        var widthPerPercent = progressBarWidth / 100,
            progressPercent = (progressCurrentTime * 100) / this.state.trackAudio.duration;
        this.setState({ progressWidth: progressPercent * widthPerPercent + 'px' });
      }
    }

    togglePlayerStatus(e) {
      var nowPlayerStatus = this.state.playerStatus;
      if (nowPlayerStatus === 'ion-play') {
        actions.playTrack(this.state.nowPlaying);
        this.setState({ playerStatus: 'ion-pause' })
      } else {
        this.state.trackAudio.pause();
        this.setState({ playerStatus: 'ion-play' })
      }
    }

    changeCurrentTime(e) {
      var status = (TrackStore.getNowTrack().isPlaying === 'playing') ? true : false,
          available = true;

      // hack firefox can't get current duration while using Laima proxy server
      if (String(this.state.trackAudio.duration) === 'Infinity') available = false;

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
            <i className={this.state.playerStatus} onClick={this.togglePlayerStatus.bind(this)}></i>
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
