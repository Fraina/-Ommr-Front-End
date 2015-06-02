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

  var getCoordYPercent = function(e) {
    var pageX = e.pageX,
        elementLeft = e.currentTarget.getBoundingClientRect().left,
        elementWidth = e.currentTarget.offsetWidth,
        perPercentWidth = elementWidth / 100,
        appointedPercent = ((pageX - elementLeft) / perPercentWidth);

    return appointedPercent;
  }

  class Controller extends React.Component {
    constructor() {
      this.state = {
        progressWidth: 0,
        playerStatus: 'ion-play',
        volumeStatus: 'ion-volume-medium'
      };
    }

    componentDidMount() {
      TrackStore.addChangeListener(this.update, this);
      TrackStore.addEventListener(AudioConstants.AUDIO_UPDATE_CURRENT_TIME, this.updateCurrentTime, this);
      TrackStore.addEventListener(AudioConstants.AUDIO_CHANGE_VOLUME, this.updateVolume, this);
      TrackStore.addEventListener(AudioConstants.AUDIO_PLAYING, this.updatePlayerStatusAsPlaying, this);
      TrackStore.addEventListener(AudioConstants.AUDIO_PAUSE, this.updatePlayerStatusAsPause, this);
    }

    update() {
      var nowPlaying = TrackStore.getNowTrack(),
          isTrackChange = (_.isUndefined(this.state.playingTrack) || this.state.playingTrack.trackId === nowPlaying.trackId) ? false : true,
          ret = {
            playingTrack: nowPlaying,
            playerStatus: 'ion-pause'
          };
      if (! isTrackChange) ret = _.omit(ret, 'playerStatus');

      this.updateVolume();
      this.setState(ret);
    }

    updateCurrentTime() {
      var progressCurrentTime = TrackStore.updateCurrentTime(),
          progressBarWrapper = React.findDOMNode(this.refs.progressBar),
          progressBarWidth = progressBarWrapper.offsetWidth,
          isAvaliable = true;

      // hack firefox can't get current duration while using Laima proxy server
      if (String(this.state.playingTrack.audio.duration) === 'Infinity') {
        isAvaliable = false;
        TrackStore.removeEvent(AudioConstants.AUDIO_UPDATE_CURRENT_TIME);
        progressBarWrapper.removeEventListener('click', this.changeCurrentTime, false);

        this.setState({ progressWidth: progressBarWidth + 'px' });

        return false;
      }

      if (isAvaliable) {
        var widthPerPercent = progressBarWidth / 100,
            progressPercent = (progressCurrentTime * 100) / this.state.playingTrack.audio.duration;
        this.setState({ progressWidth: progressPercent * widthPerPercent + 'px' });
      }
    }

    changeCurrentTime(e) {
      var status = (TrackStore.getNowTrack().isPlaying === 'playing') ? true : false,
          available = true;

      // hack firefox can't get current duration while using Laima proxy server
      if (String(this.state.playingTrack.audio.duration) === 'Infinity') available = false;

      if (available && status) {
        var percent = getCoordYPercent(e);
        actions.changeCurrentTime(percent);
      }
    }

    updateVolume() {
      var isMuted = TrackStore.getNowTrack().muted,
          volumeInt = TrackStore.getNowTrack().volume,
          volumeBarWrapper = React.findDOMNode(this.refs.volumeBar),
          volumeBarWidth = volumeBarWrapper.offsetWidth,
          widthPerPercent = volumeBarWidth / 100,
          ret = {
            volumeWidth: (widthPerPercent * volumeInt) * 100 + 'px'
          };

      switch (true) {
        case (!isMuted && volumeInt > 0.7):
          ret['volumeStatus'] = 'ion-volume-high';
          break;
        case (!isMuted && volumeInt <= 0.7 && volumeInt >= 0.3):
          ret['volumeStatus'] = 'ion-volume-medium';
          break;
        case (!isMuted && volumeInt < 0.3):
          ret['volumeStatus'] = 'ion-volume-low';
          break;
        default:
          ret['volumeStatus'] = 'ion-volume-mute';
          ret['volumeWidth'] = '0px';
      }

      this.setState(ret);
    }

    changeVolume(e) {
      var percent = getCoordYPercent(e);
      actions.changeVolume(percent);
    }

    updatePlayerStatusAsPlaying() {
      this.setState({ playerStatus: 'ion-pause' })
    }

    updatePlayerStatusAsPause() {
      this.setState({ playerStatus: 'ion-play' })
    }

    togglePlayerStatus(e) {
      var playerStatus = this.state.playerStatus;
      if (playerStatus === 'ion-play') {
        var trackId = String(this.state.playingTrack.trackId);
        actions.playTrack({ trackId: trackId });
      } else {
        this.state.playingTrack.audio.pause();
      }
    }

    toggleVolumeStatus(e) {
      var status = (TrackStore.getNowTrack().isPlaying === 'playing') ? true : false;
      if (status) {
        actions.toggleMute()
      }
    }

    render() {
      var progressWidthStyle = {width: this.state.progressWidth},
          volumeWidthStyle = {width: this.state.volumeWidth};
      return (
        <div className="AudioPlayer-controller">
          <div className="AudioPlayer-progress">
            <i className={this.state.playerStatus} onClick={this.togglePlayerStatus.bind(this)}></i>
            <div className="AudioPlayer-progressBar" ref="progressBar" onClick={this.changeCurrentTime.bind(this)}>
              <canvas id="canvas-progress" style={progressWidthStyle}></canvas>
            </div>
          </div>
          <div className="AudioPlayer-volume">
            <i className={this.state.volumeStatus} onClick={this.toggleVolumeStatus.bind(this)}></i>
            <div className="AudioPlayer-volumeBar" ref="volumeBar" onClick={this.changeVolume.bind(this)}>
              <canvas id="canvas-volume" style={volumeWidthStyle}></canvas>
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
