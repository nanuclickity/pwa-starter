import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import { routerMiddleware } from 'connected-react-router'
import createRootReducer from './rootReducer'

const debug = require('debug')('app:store')

// Placeholder for redux store
export var store

export function configureStore(initialState = {}, history) {
  // Include all middlewares here
  const middlewares = [thunk, routerMiddleware(history)]

  // Devtools for development mode on client
  const devTools =
    !__SERVER__ && window.__REDUX_DEVTOOLS_EXTENSION__
      ? window.__REDUX_DEVTOOLS_EXTENSION__()
      : f => f

  // Composed store enhancer
  const composed = compose(
    applyMiddleware(...middlewares),
    devTools
  )

  // Create the store
  store = createStore(createRootReducer(history), initialState, composed)

  // Easier debugging in dev mode
  if (process.env.NODE_ENV === 'development' && !__SERVER__) {
    window._STORE = store
  }

  // Handle hot updates
  if (__DEV__ && module.hot) {
    module.hot.accept('./rootReducer', () => {
      store.replaceReducer(createRootReducer(history))
    })
  }

  debug('Store Configured')

  return store
}
