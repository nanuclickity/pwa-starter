import React from 'react'
import PropTypes from 'prop-types'
import { Provider } from 'react-redux'
import { hot } from 'react-hot-loader'
import { ConnectedRouter } from 'connected-react-router'
import App from '../App'
import './Root.scss'

const RootContainer = ({ store, history, routes, overlays, location }) => (
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <App />
      {/* <Switch location={location}>{overlays}</Switch> */}
    </ConnectedRouter>
  </Provider>
)

RootContainer.propTypes = {
  store: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
}

export default hot(module)(RootContainer)
