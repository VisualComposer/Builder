import React from 'react'
import ReactDOM from 'react-dom'
import vcCake from 'vc-cake'
import HfsPanelContent from './lib/hsfPanelContent'
import PagePanelContent from './lib/pagePanelContent'
import PropTypes from 'prop-types'

const workspaceStorage = vcCake.getStorage('workspace')
const workspaceSettings = workspaceStorage.state('settings')
const elementsStorage = vcCake.getStorage('elements')
const cook = vcCake.getService('cook')

export default class startBlank extends React.Component {
  static propTypes = {
    unmountStartBlank: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props)
    this.handleMouseUp = this.handleMouseUp.bind(this)
    this.handleStartClick = this.handleStartClick.bind(this)
    this.openEditForm = this.openEditForm.bind(this)
  }

  componentDidMount () {
    ReactDOM.findDOMNode(this).classList.add('vcv-ui-state--visible')
  }

  handleMouseUp () {
    const dragState = workspaceStorage.state('drag')
    if (dragState.get() && dragState.get().active) {
      dragState.set({ active: false })
    }
  }

  handleStartClick () {
    const editorType = window.VCV_EDITOR_TYPE ? window.VCV_EDITOR_TYPE() : 'default'
    if (editorType === 'popup') {
      const cookElement = cook.get({ tag: 'popupRoot' }).toJS()
      const rowElement = cook.get({ tag: 'row', parent: cookElement.id }).toJS()
      elementsStorage.trigger('add', cookElement)
      elementsStorage.trigger('add', rowElement)
      this.addedId = cookElement.id
      const iframe = document.getElementById('vcv-editor-iframe')
      this.iframeWindow = iframe && iframe.contentWindow && iframe.contentWindow.window
      this.iframeWindow.vcv && this.iframeWindow.vcv.on('ready', this.openEditForm)
    } else {
      const settings = {
        action: 'add',
        element: {},
        tag: '',
        options: {}
      }
      workspaceSettings.set(settings)
    }
    this.props.unmountStartBlank()
  }

  openEditForm (action, id) {
    if (action === 'add' && id === this.addedId) {
      workspaceStorage.trigger('edit', this.addedId, '')
      this.iframeWindow.vcv.off('ready', this.openEditForm)
    }
  }

  render () {
    const localizations = window.VCV_I18N && window.VCV_I18N()
    let headingPart1
    let headingPart2

    let startBlankContent
    if (window.VCV_EDITOR_TYPE && !vcCake.env('VCV_JS_ARCHIVE_TEMPLATE')) {
      let type = window.VCV_EDITOR_TYPE().replace('vcv_', '')
      type = type.charAt(0).toUpperCase() + type.slice(1)
      headingPart1 = `${localizations ? localizations.blankPageTitleHeadingPart1 : 'Name Your '} ${type}`
      headingPart2 = localizations ? localizations.blankPageTitleHeadingPart2 : 'and Start Building'
      startBlankContent = (
        <HfsPanelContent
          type={type}
          onClick={this.handleStartClick}
        />
      )
    } else {
      headingPart1 = localizations ? localizations.blankPageHeadingPart1 : 'Name Your Page, Select'
      headingPart2 = localizations ? localizations.blankPageHeadingPart2 : 'Layout and Start Building'
      startBlankContent = (
        <PagePanelContent />
      )
    }

    return (
      <div className='vcv-start-blank-container' onMouseUp={this.handleMouseUp}>
        <div className='vcv-start-blank-scroll-container'>
          <div className='vcv-start-blank-inner'>
            <div className='vcv-start-blank-heading-container'>
              <div className='vcv-start-blank-page-heading'>{headingPart1}</div>
              <div className='vcv-start-blank-page-heading'>{headingPart2}</div>
            </div>
            {startBlankContent}
          </div>
        </div>
      </div>
    )
  }
}
