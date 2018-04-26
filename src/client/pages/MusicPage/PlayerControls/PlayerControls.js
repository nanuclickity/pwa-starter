import React, { Component } from 'react'
import classnames from 'classnames'

import ControlBar from './ControlBar'
import TrackBar from './TrackBar'
import VolumeControl from './VolumeControl'
import NowPlayingInfo from './NowPlayingInfo'

import s from './PlayerControls.styl'

const debug = require('debug')('react-app:music:player-controls')

export default class PlayerControls extends Component {
  state = {
    isPlaying: false,
    nowPlayingTrack: {
      artist: 'Track Artist',
      album: 'Track Album',
      title: 'Track Title',
      duration: '2:34',
      cover: ''
    }
  }

  onPrevClick = () => {
    debug('Previous clicked')
  }

  onNextClick = () => {
    debug('Next clicked')
  }

  onPlayPauseClick = () => {
    debug('Play/Pause Clicked')
    // we should manage this state somewhere else
  }

  render() {
    const cx = classnames(s.container, 'player-controls')

    return (
      <div className={cx}>
        <div className="player-controls-inner flex-horizontal a-center j-between">
          <ControlBar
            onPrevClick={this.onPrevClick}
            onNextClick={this.onNextClick}
            onPlayPauseClick={this.onPlayPauseClick}
          />

          <NowPlayingInfo
            onAristClick={this.onAristClick}
            onAlbumClick={this.onAlbumClick}
          />

          <TrackBar onTrackSeek={this.onTrackSeek} />

          <VolumeControl volume={1} onChange={this.onVolumeChange} />
        </div>
      </div>
    )
  }
}
