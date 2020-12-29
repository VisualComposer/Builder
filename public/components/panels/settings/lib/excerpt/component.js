import React from 'react'
import { getStorage, getService } from 'vc-cake'

const dataManager = getService('dataManager')
const localizations = dataManager.get('localizations')
const settingsStorage = getStorage('settings')

export default class Excerpt extends React.Component {
  constructor (props) {
    super(props)
    const current = settingsStorage.state('excerpt').get() || dataManager.get('excerpt') || ''

    this.state = {
      current: current
    }

    settingsStorage.state('excerpt').set(current)
    this.handleChangeText = this.handleChangeText.bind(this)
  }

  handleChangeText (event) {
    const newValue = event.target.value
    this.setState({
      current: newValue
    })
    settingsStorage.state('excerpt').set(newValue)
  }

  render () {
    const settingName = localizations ? localizations.excerpt : 'Excerpt'

    return (
      <div className='vcv-ui-form-group vcv-ui-form-group-style--inline'>
        <span className='vcv-ui-form-group-heading'>{settingName}</span>
        <textarea className='vcv-ui-form-input' value={this.state.current} onChange={this.handleChangeText} />
      </div>
    )
  }
}
