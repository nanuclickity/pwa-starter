import React, { Component } from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'

export default class TreeItem extends Component {
  state = {
    isOpen: false
  }

  toggleOpen = () => {
    this.setState({ isOpen: !this.state.isOpen })
  }

  render() {
    const { id, title, subtitle, children, className, onItemClick } = this.props

    const childCount = React.Children.count(children)

    const rootCx = classnames('tree-leaf', className, {
      'is-open': this.state.isOpen,
      'without-child': !childCount
    })
    const childrenCx = classnames('tree-leaf-children', {
      'is-open': this.state.isOpen
    })

    return (
      <div className={rootCx} data-id={id} onClick={e => onItemClick(e)}>
        <div className="tree-leaf-inner">
          {!!childCount && (
            <div className="tree-leaf-toggle" onClick={this.toggleOpen}>
              {this.state.isOpen ? ' - ' : ' + '}
            </div>
          )}
          <div className="leaf-image" />
          <div className="leaf-details">
            <div className="leaf-title">{title}</div>
            <div className="leaf-subtitle">{subtitle}</div>
          </div>
        </div>
        {!!children &&
          this.state.isOpen && <div className={childrenCx}>{children}</div>}
      </div>
    )
  }
}

TreeItem.propTypes = {
  // report an item click
  onItemClick: PropTypes.func,

  // [TODO] decide on only one type later on
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),

  // name to display
  title: PropTypes.string.isRequired,

  // additional classname to support composition outside tree component if required
  className: PropTypes.string,

  children: PropTypes.node,

  isOpen: PropTypes.bool
}
