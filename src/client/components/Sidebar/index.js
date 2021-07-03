import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import s from './Sidebar.scss'

export default function Sidebar({ className }) {
  const cx = classnames(s.container, className)
  return (
    <div className={cx}>
      <div className="sidebar-header">Sidebar Header</div>
      <div className="sidebar-body">Sidebar Body</div>
      <div className="sidebar-footer">Sidebar Footer</div>
    </div>
  )
}

Sidebar.propTypes = {
  className: PropTypes.string,
}
