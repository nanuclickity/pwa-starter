import React from 'react'
import { Route, Switch } from 'react-router-dom'

import Home from './Home'
import NotFound from './NotFound'

const About = React.lazy(() => import('./About'))

// Doesn't break SSR
const SafeSuspense = ({ children, fallback }) =>
  __SERVER__ ? (
    fallback
  ) : (
    <React.Suspense fallback={fallback}>{children}</React.Suspense>
  )

export default function createRoutes(location, auth) {
  return (
    <SafeSuspense fallback={<h2> Loading ... </h2>}>
      <Switch location={location}>
        <Route path="/" exact component={Home} />
        <Route path="/about" component={About} />
        <Route component={NotFound} />
      </Switch>
    </SafeSuspense>
  )
}
