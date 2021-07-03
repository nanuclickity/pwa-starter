import debounce from 'lodash/debounce'

const debug = require('debug')('app:store')

// Persist store data under this key in localStorage
const LOCAL_STATE_KEY = 'app-state'

// save store state every n seconds
const SAVE_INTERVAL = 3000

function defaultCompress(data) {
  return Object.keys(data).reduce((final, k) => {
    if (k !== 'router') {
      final[k] = data[k]
    }
    return final
  }, {})
}

const Storage = {
  isSupported() {
    if (!localStorage) {
      return false
    }
    const key = `test-${Math.abs(Math.random() * 1000)}`
    localStorage.setItem(key, 'test')
    return localStorage.getItem(key) === 'test'
  },
  save(data, processor) {
    const fn = typeof processor === 'function' ? processor : defaultCompress
    const compressed = fn(data)
    localStorage.setItem(LOCAL_STATE_KEY, JSON.stringify(compressed))
    debug(`Persisted store to localStorage`)
  },
  load() {
    try {
      const str = localStorage.getItem(LOCAL_STATE_KEY) || '{}'
      const data = JSON.parse(str)
      debug(`Loaded local state`)
      return data
    } catch (err) {
      console.info(`Unable to load data from local storage: ${err.message}`)
      throw err
    }
  },
}

export function loadState() {
  return Storage.load()
}

export const saveState = debounce(Storage.save, SAVE_INTERVAL, {
  trailing: true,
})
