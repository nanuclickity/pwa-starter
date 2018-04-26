import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

export default class NowPlayingInfo extends Component {
  static propTypes = {
    title: PropTypes.string,
    artist: PropTypes.string,
    album: PropTypes.string,
    albumArt: PropTypes.string
  }

  render() {
    const { className, title, artist, album, albumArt } = this.props

    const cx = classnames(
      'now-playing-info flex-horizontal a-center',
      className
    )
    return (
      <div className={cx}>
        <div
          className="album-art"
          style={{ backgroundImage: `url('${albumArt}')` }}
        />
        <div className="now-playing-details">
          <div className="title">{title}</div>
          <div className="artist">{artist}</div>
          <div className="album">{album}</div>
        </div>
      </div>
    )
  }
}
