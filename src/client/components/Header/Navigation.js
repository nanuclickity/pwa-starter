import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { Link } from 'react-router-dom'

const NAVIGATION_ITEMS = [
  { href: '/about', label: 'ABOUT' },
  { href: '/contact', label: 'CONTACT' },
  { href: '/fb-page', label: 'FACEBOOK' }
]

const Navigation = props => (
  <Fragment>
    {NAVIGATION_ITEMS.map((item, index) => (
      <Link
        key={index}
        className={classnames('header-link', props.itemClassName)}
        to={item.href}>
        {item.label}
      </Link>
    ))}
  </Fragment>
)

Navigation.propTypes = {
  itemClassName: PropTypes.string
}

export default Navigation
