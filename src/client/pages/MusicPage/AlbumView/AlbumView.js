import React, { Component } from 'react'
import MusicView from '../MusicView'

export default class AlbumView extends Component {
  static propTypes = {}

  render() {
    return (
      <MusicView title="Albums" className="album-view">
        <h2> Something in albums </h2>
      </MusicView>
    )
  }
}
