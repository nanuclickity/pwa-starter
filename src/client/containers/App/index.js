import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
// import classnames from 'classnames'

import { connect } from 'react-redux'
import Header from 'components/Header'

import getRoutes from 'routes/index'

// Overlays should be rendered aside to routes,
// so user can always have an option to go back
// to whatever page they were on

class App extends Component {
  static propTypes = {
    location: PropTypes.object,
    auth: PropTypes.any,
  }

  render() {
    const { location, auth } = this.props
    const routes = getRoutes(location, auth)
    return (
      <Fragment>
        <Header />
        {routes}
      </Fragment>
    )
  }
}

const mapStateToProps = (state) => ({
  location: state.router.location,
  auth: state.Auth,
})

export default connect(mapStateToProps)(App)
