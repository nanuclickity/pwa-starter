import { DispatchAPI } from 'api/index'
import * as LibraryAPIs from 'api/library'

const createAction = str => `LIBRARY_${str}`

const INITIAL_STATE = {
  list: [],
  isLoading: false,
  hasError: false,
  meta: {
    // use this for pagination etc.
  }
}

const FETCH = createAction('FETCH')
const fetch = (trackId = false) => dispatch => {
  dispatch({ type: FETCH })

  const api = [LibraryAPIs.fetchTracks, trackId].filter(x => x)

  return DispatchAPI(dispatch, api, {
    success: fetchSuccess,
    failure: fetchFailure
  })
}

const FETCH_SUCCESS = createAction('FETCH_SUCCESS')
const fetchSuccess = fetchResponse => {
  return {
    type: FETCH_SUCCESS
  }
}

const FETCH_FAILURE = createAction('FETCH_FAILURE')
const fetchFailure = err => {
  return {
    type: FETCH_FAILURE,
    error: err.message
  }
}

export const actions = {
  fetch
}

export default function LibraryReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH:
      return { ...state, isLoading: true, hasError: false }
    case FETCH_SUCCESS:
      return { ...state, isLoading: false }
    case FETCH_FAILURE:
      return { ...state, isLoading: false, hasError: action.error }
    default:
      return state
  }
}
