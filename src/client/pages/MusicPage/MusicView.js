import React, { Component } from 'react'
import classnames from 'classnames'

export default class MusicView extends Component {
  render() {
    const { className, title, children } = this.props

    const cx = classnames('music-view', className)

    return (
      <div className={cx}>
        <div className="view-title">{title}</div>
        <div className="view-content">{children}</div>
      </div>
    )
  }
}
