/*eslint-env browser*/
import React from 'react'
import ReactDOM from 'react-dom'

//eslint-disable-next-line no-unused-vars
import { configureStore } from './store/index'
import { saveState, loadState } from './store/local-state'

import { createBrowserHistory as createHistory } from 'history'

import Root from './containers/Root'

//eslint-disable-next-line no-unused-vars
// import registerServiceWorker from './register-service-worker'

// Create Initial History Object
const history = createHistory()

// Check if server sent a dehydrated state
const initialState = window.INITIAL_STATE || {}

// Combine the final state
const finalState = {
  ...loadState(),
  ...initialState
}

// Initialize our store
const store = configureStore(finalState, history)

// Save a local copy whenever store changes
store.subscribe(() => {
  saveState(store.getState())
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
  const renderFn = !!module.hot ? ReactDOM.render : ReactDOM.hydrate
  console.time('react:rendered-in')
  renderFn(
    <React.StrictMode>
      <Component history={history} store={store} />
    </React.StrictMode>,
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

if (__DEV__) {
  localStorage.debug = 'app:*'
}
