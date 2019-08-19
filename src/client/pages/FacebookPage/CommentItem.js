import React, { Component } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'

import NewComment from './NewComment'

export default class CommentItem extends Component {
  state = {
    isLoading: false,
    isReplyActive: false
  }

  onReplyClick = () => {
    this.setState({ isReplyActive: true })
  }

  onLikeClick = () => {
    if (this.state.isLoading) {
      return
    }

    const { id, user } = this.props
    this.setState({ isLoading: true })
    this.props
      .onLikeClick(id, user)
      .then(() => {
        this.setState({ isLoading: false })
      })
      .catch(err => {
        this.setState({ isLoading: false })
      })
  }

  render() {
    const { id, user, message, children, likesCount, updatedAt } = this.props

    const commentLikes = this.state.isLoading ? (
      <div className="comment-likes rotating-loader" />
    ) : (
      <div className="comment-likes">
        <i className="material-icons">thumb_up</i> &nbsp; {likesCount}
      </div>
    )

    return (
      <div className="comment-item">
        <div className="comment-block">
          <div className="comment-user">
            <div className="user-avatar" />
            <div className="user-name">{user}</div>
          </div>
          <div className="comment-message">{message}</div>
          {commentLikes}
        </div>
        <div className="comment-actions-block">
          <div className="comment-action-btn" onClick={this.onLikeClick}>
            Like
          </div>
          <div className="comment-action-btn" onClick={this.onReplyClick}>
            Reply
          </div>
          <div className="timestamp">{moment(updatedAt).fromNow()}</div>
        </div>
        {children}
        {this.state.isReplyActive && (
          <NewComment onRequestAdd={msg => this.props.onRequestAdd(msg, id)} />
        )}
      </div>
    )
  }
}

CommentItem.propTypes = {
  id: PropTypes.any,
  user: PropTypes.any,
  message: PropTypes.any,
  children: PropTypes.any,
  likesCount: PropTypes.any,
  updatedAt: PropTypes.any,
  onLikeClick: PropTypes.any,
  onRequestAdd: PropTypes.any
}
