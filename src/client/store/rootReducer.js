import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'

import Facebook from './Facebook'

export default function createRootReducer(history) {
  return combineReducers({
    router: connectRouter(history),
    Facebook
  })
}
