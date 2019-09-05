/*eslint-env browser*/
import React from 'react'
import { render, hydrate } from 'react-dom'

//eslint-disable-next-line no-unused-vars
import { configureStore, saveLocalState, loadLocalState } from './store/index'

import { createBrowserHistory as createHistory } from 'history'

import Root from './containers/Root'

//eslint-disable-next-line no-unused-vars
// import registerServiceWorker from './register-service-worker'

// Create Initial History Object
const history = createHistory()

// Check if server sent a dehydrated state
const initialState = window.INITIAL_STATE || {}

// Check if a localState is present
const localState = loadLocalState() || {}

// Combine the final state
const finalState = {
  ...localState,
  ...initialState
}

// Initialize our store
const store = configureStore(finalState, history)

// Save a local copy whenever store changes
store.subscribe(() => {
  saveLocalState(store.getState())
})

const onRenderComplete = () => {
  console.timeEnd('react:rendered-in')
  console.log('renderCount: ', renderCounter)

  // Delete the server generated styles to avoid conflicts in hmr
  if (__DEV__) {
    let css = document.getElementById('server-css')
    setTimeout(() => {
      css && css.remove()
    }, 0)
  }
}

var renderCounter = 0
const renderApp = Component => {
  const renderFn = !!module.hot ? render : hydrate
  console.time('react:rendered-in')
  renderFn(
    <Component history={history} store={store} />,
    document.getElementById('root'),
    onRenderComplete
  )
}

// Render the app for first time
renderApp(Root)

if (module.hot) {
  module.hot.accept('./containers/Root', () => {
    renderApp(Root)
  })
}
