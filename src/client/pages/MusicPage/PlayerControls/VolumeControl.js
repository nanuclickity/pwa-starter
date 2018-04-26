import React from 'react'
import PropTypes from 'prop-types'

import MusicButton from './MusicButton'

export default function VolumeControl(props) {
  const { volume } = props

  let icon

  if (volume === 0) {
    icon = 'volume_mute'
  } else if (volume <= 0.5 && volume > 0) {
    icon = 'volume_down'
  } else if (volume > 0.5) {
    icon = 'volume_up'
  }

  return (
    <div className="volumne-control">
      <MusicButton
        className="volumne-control-btn"
        icon={<i className="material-icons">{icon}</i>}
      />
    </div>
  )
}

VolumeControl.propTypes = {
  volume: PropTypes.number.isRequired
}

VolumeControl.defaultProps = {
  volume: 1
}
