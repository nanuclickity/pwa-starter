import { create } from 'apisauce'
import { getConfig } from 'utils/config'

import { store } from 'store/index' //eslint-disable-line no-unused-vars

const debug = require('debug')('app:api:base')

const api = create({
  baseURL: getConfig('API_BASE'),
  headers: {
    Accept: 'application/json'
  }
})

const rejectIfResponseNotOK = response => {
  return response.ok
    ? Promise.resolve(response)
    : Promise.reject(new Error(response.data.message))
}

export const formAPI = function(createRequestPromise) {
  if (typeof createRequestPromise !== 'function') {
    throw new Error('Callback should be a function')
  }

  // Ensure that form api gets executed as multipart
  api.setHeader('Content-Type', 'multipart/form-data')

  // If needed, you can set authentication headers with jwt tokens here
  // const authToken = store.getState().Auth.authToken
  // if (authToken) {
  //   api.setHeader('Authorization', authToken)
  // }

  debug('Loader Start')
  return Promise.resolve(api)
    .then(createRequestPromise)
    .then(response => {
      debug('Loader stop')
      return rejectIfResponseNotOK(response)
    })
}

export const jsonAPI = function(createRequestPromise) {
  if (typeof createRequestPromise !== 'function') {
    throw new Error('Callback should be a function')
  }

  api.setHeader('Content-Type', 'application/json')

  // const authToken = store.getState().Auth.authToken
  // if (authToken) {
  //   api.setHeader('Authorization', authToken)
  // }

  debug('Loader start')
  return Promise.resolve(api)
    .then(createRequestPromise)
    .then(response => {
      debug('Loader stop')
      return rejectIfResponseNotOK(response)
    })
}

/*
 * Use this wrapper to call apis safely and,
 * ensure proper actions are dispatched while still returning original promise
 * content to return value on mapDispatchToProps
 *
 * e.g. api as a function
 * const createFetchJobsAction = ()=> dispatch=> {
 *    return DispatchAPI(dispatch, fetchJobs, {
 *      success: fetchJobsSuccess,
 *      failure: fetchJobsFailure
 *    })
 * }
 *
 * e.g api as a function with arguments
 * const createFetchJobsAction = (username)=> dispatch => {
 *    return DispatchAPI(dispatch, [fetchJobs, username], {
 *       success: fetchJobsSuccess,
 *       failure: fetchJobsFailure
 *    })
 * }
 *
 * e.g. api as a promise
 * const createFetchJobsAction = (username)=> dispatch => {
 *    return DispatchAPI(dispatch, fetchJobs(username), {
 *       success: fetchJobsSuccess,
 *       failure: fetchJobsFailure
 *    })
 * }
 *
 */
export const DispatchAPI = (dispatchFn, promiseFn, options = {}) => {
  if (typeof options.success !== 'function') {
    throw new Error(`DispatchAPI: 'options.success' should be a function`)
  }

  if (typeof options.failure !== 'function') {
    throw new Error(`DispatchAPI: 'options.failure' should be a function`)
  }

  // Hold the final promise here
  var promise

  // If promise function is an array
  // treat the first item as function, and rest it's args
  if (Array.isArray(promiseFn)) {
    let [fn, ...args] = promiseFn
    promise = fn(...args)
  } else if (typeof promiseFn.then === 'function') {
    // If promise function is an executed promise
    // use it directly
    promise = promiseFn
  } else if (typeof promiseFn === 'function') {
    // If promiseFn is a function, execute it
    promise = promiseFn()
  } else {
    // If nothing matches, throw error
    throw new Error(`'promiseFn' argument to 'DispatchAPI' is invalid`)
  }

  return promise
    .then(response => {
      dispatchFn(options.success(response))
      return Promise.resolve(response)
    })
    .catch(err => {
      dispatchFn(options.failure(err))
      return Promise.reject(err)
    })
}

export default api
