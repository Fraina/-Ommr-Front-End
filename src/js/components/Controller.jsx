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
        mode: '',
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
      TrackStore.addEventListener(AudioConstants.AUDIO_ENDED, this.playNextTrack, this);
      TrackStore.addEventListener(AudioConstants.MODE_CHANGE, this.updateMode, this);
      TrackStore.addEventListener(AudioConstants.RESET_PLAYED_TRACKLIST, this.updateMode, this);
    }

    update() {
      var nowPlaying = TrackStore.getNowTrack(),
          isTrackChange = (_.isUndefined(this.state.playingTrack) || this.state.playingTrack.trackId === nowPlaying.trackId) ? false : true,
          hasLoadTrackListIds = (_.isUndefined(this.state.trackListIds)) ? false : true,
          ret = {
            playingTrack: nowPlaying,
            playerStatus: 'ion-pause'
          };

      if (! isTrackChange) ret = _.omit(ret, 'playerStatus');
      if (! hasLoadTrackListIds) ret['trackListIds'] = _.allKeys(TrackStore.getAllTracks());

      this.setState(ret);
      this.updateVolume();
    }

    // progressBar

    updateCurrentTime() {
      var progressCurrentTime = TrackStore.updateCurrentTime(),
          progressBarWrapper = React.findDOMNode(this.refs.progressBar),
          progressBarWidth = progressBarWrapper.offsetWidth,
          duration = this.state.playingTrack.audio.duration,
          isAvaliable = true;

      // hack firefox can't get current duration while using Laima proxy server
      if (! _.isFinite(duration)) {
        isAvaliable = false;
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
      // hack firefox can't get current duration while using Laima proxy server
      var duration = this.state.playingTrack.audio.duration,
          isPlaying = TrackStore.getNowTrack().isPlaying;
      if (_.isFinite(duration) && isPlaying) {
        var percent = getCoordYPercent(e);
        actions.changeCurrentTime(percent);
      }
    }

    // volumeBar

    updateVolume() {
      var nowTrackInfo = TrackStore.getNowTrack(),
          isMuted = nowTrackInfo.muted,
          volumeInt = nowTrackInfo.volume,
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

    toggleVolumeStatus(e) {
      var nowTrackInfo = TrackStore.getNowTrack();
      if (nowTrackInfo.isPlaying) {
        actions.toggleMute()
      }
    }

    changeVolume(e) {
      var percent = getCoordYPercent(e);
      actions.changeVolume(percent);
    }

    // player status

    updatePlayerStatusAsPlaying() {
      this.setState({ playerStatus: 'ion-pause' })
    }

    updatePlayerStatusAsPause() {
      this.setState({ playerStatus: 'ion-play' })
    }

    togglePlayerStatus(e) {
      var playerStatus = this.state.playerStatus,
          trackId = String(this.state.playingTrack.trackId);
      if (playerStatus === 'ion-play') {
        actions.playTrack({ trackId: trackId });
      } else {
        this.state.playingTrack.audio.pause();
      }
    }

    updateMode() {
      var mode = TrackStore.getNowTrack().mode,
          nowPlaying = this.state.playingTrack.trackId,
          ret = {};
      if (mode === 'shuffle') this.resetCloneList();
      this.setState({ mode: mode });
    }

    resetCloneList() {
      this.setState({ cloneList: _.clone(this.state.trackListIds) });
    }

    playNextTrack() {
      var mode = this.state.mode,
          trackListIds = this.state.trackListIds,
          tracksNotPlayYet = this.state.cloneList || null,
          nowPlaying = this.state.playingTrack.trackId,
          hasNext = (_.last(trackListIds) === nowPlaying) ? false : true;

      switch(mode) {
        case 'loop':
          if (hasNext) {
            actions.playTrack({ trackId: trackListIds[parseInt(nowPlaying) + 1] });
          } else {
            actions.playTrack({ trackId: _.first(trackListIds) });
          };
          break;
        case 'shuffle':
          if (! tracksNotPlayYet.length) {
            this.resetCloneList();
            return false;
          }

          var leftCount = tracksNotPlayYet.length,
              randomNum = Math.floor(Math.random() * leftCount),
              updatedCloneList = _.without(tracksNotPlayYet, tracksNotPlayYet[randomNum]);
          actions.playTrack({ trackId: tracksNotPlayYet[randomNum] });
          this.setState({ cloneList: updatedCloneList });
          break;
        case 'shuffle_loop':
           var randomNum = Math.floor(Math.random() * trackListIds.length);
           actions.playTrack({ trackId: trackListIds[randomNum] });
           break;
        default:
          if (hasNext) actions.playTrack({ trackId: trackListIds[parseInt(nowPlaying) + 1] });
          return false;
      }
    }

    render() {
      var progressWidthStyle = {width: this.state.progressWidth},
          volumeWidthStyle = {width: this.state.volumeWidth},
          mode = this.state.mode,
          toggleLoopStyle = (mode.match(/loop/) != null) ? 'ion-loop is-active' : 'ion-loop',
          toggleShuffleStyle = (mode.match(/shuffle/) != null) ? 'ion-shuffle is-active' : 'ion-shuffle';

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
            <i className={toggleLoopStyle} onClick={actions.toggleLoopMode}></i>
            <i className={toggleShuffleStyle} onClick={actions.toggleShuffleMode}></i>
          </div>
        </div>
      )
    }
  }

  return Controller;

});
