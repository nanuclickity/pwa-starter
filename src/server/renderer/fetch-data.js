/**
 * Use match to match routes statically without going through a render-pass
 * Only one limitation here is that, your router config should be in nested object form
 *
 * Define fetchData method
 *  - in the outermost component within a route
 *  - preferably in the component provided to route itself
 *  - watch out for HOCs like connect(), withRouter()
 *
 * As soon as route is matched, get the matched components,
 * drill into component's children till you find a fetchData method
 *
 */

export default function fetchData(context) {
  return Promise.resolve(context)
}
