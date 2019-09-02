/**
 * Allow for advanced deployments
 *
 * This intends to support multiple prod-like environments
 */
const isDevelopment = process.env.NODE_ENV === 'development'
const isProdLike = process.env.NODE_ENV === 'production'

const isStaging = isProdLike && process.env.TRACK === 'staging'
const isProduction = isProdLike && process.env.TRACK === 'production'

module.exports = {
  isDevelopment,
  isProdLike,
  isStaging,
  isProduction,
  TRACK: process.env.TRACK,
  NODE_ENV: process.env.NODE_ENV
}
