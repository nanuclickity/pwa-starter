import React from 'react'
import PropTypes from 'prop-types'
import { Provider } from 'react-redux'

import { ConnectedRouter } from 'connected-react-router'
import { Switch } from 'react-router-dom'

import './Root.scss'

const RootContainer = ({ store, history, routes, overlays, location }) => (
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <Switch location={location}>{routes}</Switch>
      <Switch location={location}>{overlays}</Switch>
    </ConnectedRouter>
  </Provider>
)

RootContainer.propTypes = {
  store: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  routes: PropTypes.object.isRequired,
  overlays: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired
}

export default RootContainer
