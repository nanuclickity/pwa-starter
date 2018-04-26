import React, { Component } from 'react'
import classnames from 'classnames'

const debug = require('debug')('react-app:music:track-bar')

export default class TrackBar extends Component {
  onTrackSeek = () => {
    debug('seeking track')
  }

  render() {
    const cx = classnames('track-bar')

    return (
      <div className={cx}>
        <div className="track-inner">
          <div
            className="track-bar"
            onClick={this.onTrackSeek}
            ref={node => (this.seekbar = node)}
          />
        </div>
      </div>
    )
  }
}
