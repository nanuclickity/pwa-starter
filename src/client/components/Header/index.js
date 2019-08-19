import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { connect } from 'react-redux'
// import { Link } from 'react-router-dom'

import Logo from 'components/ui/Logo'
import Navigation from './Navigation'

import s from './Header.styl'

class Header extends Component {
  static defaultProps = {
    sticky: false,
    fixed: false
  }

  render() {
    const { className, fixed, transparent } = this.props

    const cx = classnames(
      s.container,
      'app-header flex-horizontal a-center',
      className,
      {
        'is-fixed': fixed,
        'is-transparent': transparent
      }
    )

    return (
      <header className={cx}>
        <Logo
          className="header-logo"
          primaryText="REAC1T"
          secondaryText="APP"
          onClick={this.props.onMenuClick}
        />
        <div className="flex-1" />
        <Navigation />
      </header>
    )
  }
}

Header.propTypes = {
  sticky: PropTypes.bool,
  fixed: PropTypes.bool,
  onMenuClick: PropTypes.func,
  className: PropTypes.string,
  transparent: PropTypes.bool
}

const mapStateToProps = state => ({
  pathname: state.router.location.pathname
})

const mapDispatchToProps = dispatch => ({})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Header)
