import React from 'react'
import classnames from 'classnames'

export default function MusicButton(props) {
  const { className, icon = null, ...otherProps } = props

  const cx = classnames('music-button', className)

  return (
    <button className={cx} {...otherProps}>
      {icon}
    </button>
  )
}
