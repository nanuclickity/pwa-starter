import v4 from 'uuid/v4'

// import sample from 'lodash/sample'

const createAction = str => `FACEBOOK_${str}`

const INITIAL_STATE = {
  isLoading: false,
  hasError: false,
  comments: []
}

function mockAPI(timeout = 1000) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve()
    }, timeout)
  })
}

function getLastCounter(list) {
  return list
    .map(x => x.user.replace('User ', ''))
    .map(Number)
    .sort()
    .reverse()[0]
}

function insertNewComment(list, message, parentId = null) {
  const userIdCount = list.length ? getLastCounter(list) + 1 : 1
  const comment = {
    id: parentId ? `${parentId}/${v4()}` : v4(),
    message,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    likes: [],
    user: `User ${userIdCount}`
  }

  return [comment, ...list]
}

function insertLike(list, commentId, user) {
  return list.map(comment => {
    // checks for target comment
    if (comment.id === commentId) {
      comment.likes.push(user)
      comment.updatedAt = Date.now()
    }
    return comment
  })
}

const ADD_COMMENT = createAction('ADD_COMMENT')
const ADD_COMMENT_SUCCESS = createAction('ADD_COMMENT_SUCCESS')
const ADD_COMMENT_FAILURE = createAction('ADD_COMMENT_FAILURE')
const addComment = (message, parentCommentId) => dispatch => {
  dispatch({ type: ADD_COMMENT })
  return mockAPI()
    .then(() =>
      dispatch({
        type: ADD_COMMENT_SUCCESS,
        comment: message,
        parentCommentId
      })
    )
    .catch(err => dispatch({ type: ADD_COMMENT_FAILURE, message: err.message }))
}

const ADD_LIKE = createAction('ADD_LIKE')
const ADD_LIKE_SUCCESS = createAction('ADD_LIKE_SUCCESS')
const ADD_LIKE_FAILURE = createAction('ADD_LIKE_FAILURE')
const addLike = (commentId, fromUser) => dispatch => {
  dispatch({ type: ADD_LIKE })
  return mockAPI(500)
    .then(() => dispatch({ type: ADD_LIKE_SUCCESS, commentId, fromUser }))
    .catch(err => dispatch({ type: ADD_LIKE_FAILURE, error: err.message }))
}

export const actions = {
  addComment,
  addLike
}

export default function FacebookReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case ADD_COMMENT:
    case ADD_LIKE:
      return { ...state, isLoading: true, hasError: false }

    case ADD_COMMENT_SUCCESS:
      return {
        ...state,
        comments: insertNewComment(
          state.comments,
          action.comment,
          action.parentCommentId
        )
      }
    case ADD_LIKE_SUCCESS:
      return {
        ...state,
        comments: insertLike(state.comments, action.commentId, action.fromUser)
      }

    case ADD_COMMENT_FAILURE:
    case ADD_LIKE_FAILURE:
      return { ...state, isLoading: false, hasError: action.error }

    default:
      return state
  }
}
