import React from 'react'
import classNames from 'classnames'

class TreeViewNavbarControl extends React.Component {
  state = {
    controlActive: false,
    data: []
  }

  componentDidMount () {
    this.props.api
      .reply('bar-content-start:show', () => {
        this.setState({ controlActive: true })
      })
      .reply('bar-content-start:hide', () => {
        this.setState({ controlActive: false })
      })
  }

  toggleTreeView = (e) => {
    e && e.preventDefault()
    if (this.state.controlActive) {
      this.props.api.request('bar-content-start:hide')
    } else {
      this.props.api.request('bar-content-start:show')
    }
  }

  render () {
    let controlClass = classNames({
      'vcv-ui-navbar-control': true,
      'vcv-ui-state--active': this.state.controlActive
    })

    return (
      <a className={controlClass} title='Tree View' onClick={this.toggleTreeView}>
        <span className='vcv-ui-navbar-control-content'>
          <i className='vcv-ui-navbar-control-icon vcv-ui-icon vcv-ui-icon-layers' />
          <span>Tree View</span>
        </span>
      </a>
    )
  }
}
TreeViewNavbarControl.propTypes = {
  api: React.PropTypes.object.isRequired
}

export default TreeViewNavbarControl
