import React from 'react'
import { Route, Switch } from 'react-router-dom'

import Home from './Home'
import NotFound from './NotFound'

export default function createRoutes(location, auth) {
  return (
    <Switch location={location}>
      <Route path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  )
}
