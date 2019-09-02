import React from 'react'
import { Route } from 'react-router-dom'

import Home from './Home'
import NotFound from './NotFound'

export default function createRoutes(location, auth) {
  return (
    <>
      <Route path="/" component={Home} />
      <Route component={NotFound} />
    </>
  )
}
