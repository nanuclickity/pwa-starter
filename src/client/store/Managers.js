const createAction = str => `MANAGERS_${str}`

const INITIAL_STATE = {
  isLoading: false,
  list: [],
  hasError: false
}

const FETCH = createAction('FETCH')
const FETCH_SUCCESS = createAction('FETCH_SUCCESS')
const FETCH_FAILURE = createAction('FETCH_FAILURE')

export default function ManagersReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH:
      return { ...state, isLoading: true, hasError: false }
    case FETCH_SUCCESS:
      return { ...state, isLoading: false, list: [...action.list] }
    case FETCH_FAILURE:
      return { ...state, isLoading: false, error: action.error }
    default:
      return state
  }
}
