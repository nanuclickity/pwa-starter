import React from 'react'
import { Link } from 'react-router-dom'

export default class Header extends React.Component {
  render() {
    return (
      <div>
        Header
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
      </div>
    )
  }
}
