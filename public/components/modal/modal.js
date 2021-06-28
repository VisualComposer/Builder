import React from 'react'
import PropTypes from 'prop-types'

export default class Modal extends React.Component {
  static propTypes = {
    closeOnOuterClick: PropTypes.bool,
    onClose: PropTypes.func.isRequired,
    show: PropTypes.bool.isRequired,
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ])
  }

  constructor (props) {
    super(props)
    this.state = {
      innerClick: false
    }
    this.handleHideOnOuterClick = this.handleHideOnOuterClick.bind(this)
    this.handleShowOnInnerClick = this.handleShowOnInnerClick.bind(this)
  }

  handleShowOnInnerClick (e) {
    this.setState({ innerClick: e.type === 'mousedown' })
  }

  handleHideOnOuterClick (event) {
    setTimeout(() => this.setState({ innerClick: false }), 0)
    if (this.props.closeOnOuterClick === false || this.state.innerClick) {
      return
    }
    if (event.target.dataset.modal && this.props.onClose instanceof Function) {
      this.props.onClose(event)
    }
  }

  render () {
    if (!this.props.show) {
      return null
    }

    return (
      <div className='vcv-ui-modal-overlay' onClick={this.handleHideOnOuterClick} data-modal='true'>
        <div className='vcv-ui-modal-container' onMouseDown={this.handleShowOnInnerClick} onMouseUp={this.handleShowOnInnerClick}>
          {this.props.children}
        </div>
      </div>
    )
  }
}
