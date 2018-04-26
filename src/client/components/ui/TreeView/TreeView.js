import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import cloneDeep from 'lodash/cloneDeep'
import isEqual from 'lodash/isEqual'

import { flattenTree } from './utils'

import TreeItem from './TreeItem'

// [TODO] this is temporary just for testing
import ITEMS from './sample.tree'

import s from './index.styl'

const debug = require('debug')('react-app:component:TreeView')

export const TreeItemShape = PropTypes.shape({
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  children: PropTypes.array
})

export default class TreeView extends Component {
  static propTypes = {
    items: PropTypes.arrayOf(TreeItemShape),
    className: PropTypes.string,
    itemClassName: PropTypes.string
  }

  static defaultProps = {
    items: [],
    className: '',
    itemClassName: ''
  }

  state = {
    items: [],
    isTreeOpen: true,
    searchQuery: ''
  }

  componentDidMount = () => {
    // Usually you'd inject from props here
    this.useItems(ITEMS)
  }

  // We're going to handle tree updates from a parent here
  componentWillReceiveProps = nextProps => {
    // If items are equal, don't do anything
    // but remember to compare with internal state,
    // not the state which we modify for closing opening subtree
    if (
      !nextProps.items.length ||
      isEqual(this._loadedItems, nextProps.items)
    ) {
      return
    } else {
      this.useItems(nextProps.items)
    }
  }

  useItems = items => {
    this._loadedItems = cloneDeep(items)
    this.setState({ items: cloneDeep(items) })

    debug('using items: ', items)
  }

  toggleTreeOpen = () => {
    this.setState({ isTreeOpen: !this.state.isTreeOpen })
  }

  handleItemClick = (item, index, e) => {
    // stop the event from bubbling
    // otherwise this will fire for all parents as well
    e.stopPropagation()

    // handle the click
    debug('item clicked', item, index, e)
    console.log(e.currentTarget)

    // if you want to highlight the currently selected
    // with this data structure, it will be hard to pinpoint the selected one.
    // so, check all instances of .tree-leaf through dom, and mutate through dom
    // same can be done in componentDidMount for reloads

    // however, i should point out that, rather than nesting objects
    // to achieve this structure, a better strategy would be to use a flat
    // array, and identifiers of each item should be scoped with parent/child relationships,
    // with their ids.

    // this solves lot of problems
    //  - you don't need to stopPropagation
    //  - you can set active state in list itself and re-render that
    //  - static analysis of tree objects
    //  - easily count all descendents of a node etc.
    //  - leaf open/close state can be handled inside object itself rather than state
  }

  /**
   * renders tree items recursively
   * digs into `children` array of each item
   */
  renderOneTreeItem = (item, index) => {
    const totalChildrenCount = this.countAllChildren(item)
    return (
      <TreeItem
        id={item.id}
        title={item.name}
        subtitle={`${totalChildrenCount} Members`}
        key={item.id} // try to keep this unique
        className={this.props.itemClassName}
        onItemClick={e => this.handleItemClick(item, index, e)}>
        {item.children &&
          item.children.length &&
          item.children.map(this.renderOneTreeItem)}
      </TreeItem>
    )
  }

  countAllChildren = item => {
    let count = (item.children || []).length

    let finalCount = (item.children || []).reduce((nextCount, subitem) => {
      if (Array.isArray(subitem.children)) {
        nextCount += this.countAllChildren(subitem)
      }
      return nextCount
    }, count)

    return finalCount
  }

  /**
   * What to show when no items are available in tree
   */
  renderNoItems = () => {
    return (
      <div className="no-tree-items">
        <h3> This tree is empty </h3>
      </div>
    )
  }

  renderTree = () => {
    const { items } = this.state
    return !items.length
      ? this.renderNoItems()
      : items.map(this.renderOneTreeItem)
  }

  renderSearchResults = () => {
    const { items, searchQuery } = this.state
    const flatResults = flattenTree(items)
    const matchedResults = flatResults.filter(x => x.name.includes(searchQuery))

    return matchedResults.map(this.renderOneSearchResult)
  }

  renderOneSearchResult = (item, index) => {
    return (
      <div
        key={item.id}
        className="ui-tree-view-search-result"
        onClick={e => this.handleItemClick(item, index, e)}>
        <div className="tree-leaf-inner">
          <div className="leaf-image" />
          <div className="leaf-details">
            <div className="leaf-title">{item.name}</div>
          </div>
        </div>
      </div>
    )
  }

  handleSearchChange = e => {
    const searchQuery = e.target.value
    this.setState({ searchQuery })
  }

  render() {
    const { items, searchQuery } = this.state
    debug('will be rendering items: ', items, s)

    // allow composition in to different pages or projects.
    const rootCx = classnames(
      s.container,
      'ui-tree-view',
      this.props.className,
      {
        'is-open': this.state.isTreeOpen
      }
    )

    return (
      <div className={rootCx}>
        <div className="ui-tree-view-toggle" onClick={this.toggleTreeOpen}>
          <i className="material-icons">menu</i>
        </div>
        <div className="ui-tree-view-list">
          <div className="ui-tree-view-search">
            <input
              className="ui-tree-view-search-input"
              placeholder="Search"
              onChange={this.handleSearchChange}
              value={this.state.searchQuery}
            />
          </div>
          {!searchQuery ? this.renderTree() : this.renderSearchResults()}
        </div>
      </div>
    )
  }
}
