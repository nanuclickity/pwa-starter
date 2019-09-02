import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
// import classnames from 'classnames'

import { connect } from 'react-redux'

// Overlays should be rendered aside to routes,
// so user can always have an option to go back
// to whatever page they were on

class App extends Component {
  static propTypes = {
    location: PropTypes.object,
    auth: PropTypes.any,
    routes: PropTypes.object.isRequired,
    overlays: PropTypes.object.isRequired
  }

  render() {
    const { routes, overlays } = this.props
    return (
      <Fragment>
        {routes}
        {overlays}
      </Fragment>
    )
  }
}

const mapStateToProps = state => ({
  location: state.router.location,
  auth: state.Auth
})

export default connect(mapStateToProps)(App)
