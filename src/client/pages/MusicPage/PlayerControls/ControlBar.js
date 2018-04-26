import React from 'react'
import PropTypes from 'prop-types'

import MusicButton from './MusicButton'

import noop from 'lodash/noop'

export default function ControlBar(props) {
  return (
    <div className="control-bar flex-horizontal">
      <MusicButton
        onClick={props.onPrevClick}
        className="play-prev"
        icon={<i className="material-icons">skip_previous</i>}
      />
      <MusicButton
        onClick={props.onPlayPauseClick}
        className="play-pause"
        icon={<i className="material-icons">play_arrow</i>}
      />
      <MusicButton
        onClick={props.onNextClick}
        className="play-next"
        icon={<i className="material-icons">skip_next</i>}
      />
    </div>
  )
}

ControlBar.propTypes = {
  onPrevClick: PropTypes.func.isRequired,
  onPlayPauseClick: PropTypes.func.isRequired,
  onNextClick: PropTypes.func.isRequired
}

ControlBar.defaultProps = {
  onPrevClick: noop,
  onPlayPauseClick: noop,
  onNextClick: noop
}
