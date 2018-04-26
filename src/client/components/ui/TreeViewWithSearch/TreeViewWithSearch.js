import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import TreeView from 'components/ui/TreeView'

import s from './TreeViewWithSearch.styl'

export const flattenChildren = items => {
  return (items || []).reduce(accumulator => {
    if (Array.isArray(x.children) && x.children.length) {
    }

    return res
  })
}

export default class TreeViewWithSearch extends Component {
  static propTypes = {
    queryKey: PropTypes.string
  }

  state = {
    searchQuery: ''
  }

  buildSearchableList = () => {
    const { items = [] } = this.props
    const list = []

    items.forEach(item => {})
  }

  queryResults = () => {
    const { queryKey, items } = this.props
    const { searchQuery } = this.state
  }

  render() {
    const { className } = this.props

    const cx = classnames(s.container, 'ui-tree-view-with-search', className)

    return <div className={cx} />
  }
}
