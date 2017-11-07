import React from 'react'
import classNames from 'classnames'
import {getData, getStorage, env} from 'vc-cake'

const settingsStorage = getStorage('settings')
const workspaceStorage = getStorage('workspace')
const workspaceIFrame = workspaceStorage.state('iframe')
export default class SettingsFooter extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      saving: false,
      saved: false
    }
  }

  onSave = () => {
    let { actions } = this.props
    actions.forEach(action => {
      settingsStorage.state(action.state).set(getData(action.getData))
    })
    if (env('IFRAME_RELOAD')) {
      let lastLoadedPageTemplate = window.vcvLastLoadedPageTemplate || window.VCV_PAGE_TEMPLATES && window.VCV_PAGE_TEMPLATES() && window.VCV_PAGE_TEMPLATES().current
      let lastSavedPageTemplate = settingsStorage.state('pageTemplate').get()
      if (lastLoadedPageTemplate && lastLoadedPageTemplate !== lastSavedPageTemplate) {
        window.vcvLastLoadedPageTemplate = lastSavedPageTemplate
        workspaceIFrame.set({type: 'reload', template: lastSavedPageTemplate})
      }
    }
    this.effect()
  }

  componentDidMount () {
    this.canceled = false
  }

  componentWillUnmount () {
    this.canceled = true
  }

  effect () {
    this.setState({ 'saving': true })
    setTimeout(() => {
      this.setState({ 'saving': false })
      this.setState({ 'saved': true })
      setTimeout(() => {
        !this.canceled && this.setState({ 'saved': false })
      }, 1000)
    }, 500)
  }

  render () {
    const localizations = window.VCV_I18N && window.VCV_I18N()
    const saveText = localizations ? localizations.save : 'Save'

    let saveButtonClasses = classNames({
      'vcv-ui-settings-action': true,
      'vcv-ui-state--success': this.state.saved
    })
    let saveIconClasses = classNames({
      'vcv-ui-settings-action-icon': true,
      'vcv-ui-wp-spinner': this.state.saving,
      'vcv-ui-icon': !this.state.saving,
      'vcv-ui-icon-save': !this.state.saving
    })

    return (
      <div className='vcv-ui-settings-content-footer'>
        <div className='vcv-ui-settings-actions'>
          <span className={saveButtonClasses} title={saveText} onClick={this.onSave}>
            <span className='vcv-ui-settings-action-content'>
              <i className={saveIconClasses} />
              <span>{saveText}</span>
            </span>
          </span>
        </div>
      </div>
    )
  }
}

