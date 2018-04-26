import React, { Component } from 'react'
import classnames from 'classnames'

import PlayerControls from './PlayerControls'

import AlbumView from './AlbumView'

import s from './MusicPage.styl'

export default class MusicPage extends Component {
  render() {
    const cx = classnames(s.container)
    return (
      <div className={cx}>
        <AlbumView />
        <PlayerControls />
      </div>
    )
  }
}
