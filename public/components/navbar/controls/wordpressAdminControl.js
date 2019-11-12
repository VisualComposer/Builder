/* global setUserSetting */
import React from 'react'
import NavbarContent from '../navbarContent'

import { setData, getService, getStorage, env } from 'vc-cake'

const PostData = getService('wordpress-post-data')
const wordpressDataStorage = getStorage('wordpressData')
const workspaceStorage = getStorage('workspace')

export default class WordPressAdminControl extends NavbarContent {
  previewWindow = false
  previewWindowTarget = false

  constructor (props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
    this.saveDraft = this.saveDraft.bind(this)
    this.savePreview = this.savePreview.bind(this)
    this.triggerPreviewClick = this.triggerPreviewClick.bind(this)
    this.updateButtons = this.updateButtons.bind(this)
    this.handleViewPageClick = this.handleViewPageClick.bind(this)
  }

  componentDidMount () {
    wordpressDataStorage.state('status').onChange(this.updateButtons)
    workspaceStorage.state('shortcutPreview').onChange(this.triggerPreviewClick)
  }

  updateButtons (data) {
    if (data && data.status === 'success') {
      this.forceUpdate()
    }
  }

  handleClick (e) {
    e && e.preventDefault && e.preventDefault()
    const target = e.currentTarget
    const isBackendEditor = target.dataset.backendEditor && target.dataset.backendEditor === 'backendEditor'
    if (isBackendEditor) {
      setUserSetting('vcvEditorsBackendLayoutSwitcher', '1') // Enable backend editor
    }
    window.open(
      target.dataset.href,
      target.dataset.target ? target.dataset.target : '_self'
    )
  }

  saveDraft (e) {
    e && e.preventDefault && e.preventDefault()
    wordpressDataStorage.trigger('save', { draft: true }, 'wordpressAdminControl')
    // this.props.api.request('wordpress:data:saving', { draft: true })
  }

  savePreview (e) {
    e && e.preventDefault && e.preventDefault()
    setData('wp-preview', 'dopreview')

    wordpressDataStorage.state('status').ignoreChange(this.afterSaveChangeUrl)
    wordpressDataStorage.state('status').onChange(this.afterSaveChangeUrl)
    const previewUrl = PostData.previewUrl()

    if (!this.previewWindow || this.previewWindow.closed) {
      this.previewWindow = window.open(
        '',
        previewUrl
      )
    }
    this.previewWindowTarget = previewUrl

    let loadingView = '<style>\n' +
      '.vcv-loading-overlay {\n' +
      '  position: absolute;\n' +
      '  top: 0;\n' +
      '  left: 0;\n' +
      '  bottom: 0;\n' +
      '  right: 0;\n' +
      '  overflow: hidden;\n' +
      '  background: #fff;\n' +
      '  display: -webkit-box;\n' +
      '  display: -ms-flexbox;\n' +
      '  display: flex;\n' +
      '  -webkit-box-orient: vertical;\n' +
      '  -webkit-box-direction: normal;\n' +
      '      -ms-flex-direction: column;\n' +
      '          flex-direction: column;\n' +
      '  -webkit-box-pack: center;\n' +
      '      -ms-flex-pack: center;\n' +
      '          justify-content: center;\n' +
      '}\n' +
      '.vcv-loading-overlay-inner {\n' +
      '  display: -webkit-box;\n' +
      '  display: -ms-flexbox;\n' +
      '  display: flex;\n' +
      '  -webkit-box-orient: vertical;\n' +
      '  -webkit-box-direction: normal;\n' +
      '      -ms-flex-direction: column;\n' +
      '          flex-direction: column;\n' +
      '  -ms-flex-line-pack: center;\n' +
      '      align-content: center;\n' +
      '  -webkit-box-align: center;\n' +
      '      -ms-flex-align: center;\n' +
      '          align-items: center;\n' +
      '}\n' +
      '.vcv-loading-dots-container {\n' +
      '  width: 60px;\n' +
      '  height: 60px;\n' +
      '  text-align: center;\n' +
      '  -webkit-animation: vcvDotsRotate 2s infinite linear;\n' +
      '          animation: vcvDotsRotate 2s infinite linear;\n' +
      '}\n' +
      '.vcv-loading-dots-container .vcv-loading-dot {\n' +
      '  width: 60%;\n' +
      '  height: 60%;\n' +
      '  display: inline-block;\n' +
      '  position: absolute;\n' +
      '  top: 0;\n' +
      '  background-color: #eee;\n' +
      '  border-radius: 100%;\n' +
      '  -webkit-animation: vcvDotsBounce 2s infinite ease-in-out;\n' +
      '          animation: vcvDotsBounce 2s infinite ease-in-out;\n' +
      '}\n' +
      '.vcv-loading-dots-container .vcv-loading-dot-2 {\n' +
      '  top: auto;\n' +
      '  bottom: 0;\n' +
      '  -webkit-animation-delay: -1s;\n' +
      '          animation-delay: -1s;\n' +
      '}\n' +
      '@-webkit-keyframes vcvDotsRotate {\n' +
      '  100% {\n' +
      '    -webkit-transform: rotate(360deg);\n' +
      '            transform: rotate(360deg);\n' +
      '  }\n' +
      '}\n' +
      '@keyframes vcvDotsRotate {\n' +
      '  100% {\n' +
      '    -webkit-transform: rotate(360deg);\n' +
      '            transform: rotate(360deg);\n' +
      '  }\n' +
      '}\n' +
      '@-webkit-keyframes vcvDotsBounce {\n' +
      '  0%,\n' +
      '  100% {\n' +
      '    -webkit-transform: scale(0);\n' +
      '            transform: scale(0);\n' +
      '  }\n' +
      '  50% {\n' +
      '    -webkit-transform: scale(1);\n' +
      '            transform: scale(1);\n' +
      '  }\n' +
      '}\n' +
      '@keyframes vcvDotsBounce {\n' +
      '  0%,\n' +
      '  100% {\n' +
      '    -webkit-transform: scale(0);\n' +
      '            transform: scale(0);\n' +
      '  }\n' +
      '  50% {\n' +
      '    -webkit-transform: scale(1);\n' +
      '            transform: scale(1);\n' +
      '  }\n' +
      '}\n' +
      '</style>\n' +
      '<div class="vcv-loading-overlay">\n' +
      '                        <div class="vcv-loading-overlay-inner">\n' +
      '                            <div class="vcv-loading-dots-container">\n' +
      '                                <div class="vcv-loading-dot vcv-loading-dot-1"></div>\n' +
      '                                <div class="vcv-loading-dot vcv-loading-dot-2"></div>\n' +
      '                            </div>\n' +
      '                        </div>\n' +
      '                    </div>'

    this.previewWindow.document.write(loadingView)
    wordpressDataStorage.trigger('save', { inherit: true }, 'wordpressAdminControl')
  }

  afterSaveChangeUrl = (data) => {
    const { status } = data
    if (status === 'saving' && this.previewOpened && !this.previewWindow.closed) {
      this.previewWindow.location.href = this.previewWindowTarget
      this.previewWindow.blur()
      this.previewWindow.focus()
    } else if (status === 'success') {
      this.previewWindow.location.href = this.previewWindowTarget
      wordpressDataStorage.state('status').ignoreChange(this.afterSaveChangeUrl)
      this.previewOpened = true
      setData('wp-preview', '')
    } else if (status === 'failed') {
      wordpressDataStorage.state('status').ignoreChange(this.afterSaveChangeUrl)
      setData('wp-preview', '')
    }
  }

  triggerPreviewClick (data) {
    if (data) {
      this.previewBtn.click()
      workspaceStorage.state('shortcutPreview').set(false)
    }
  }

  handleViewPageClick (e) {
    e && e.preventDefault && e.preventDefault()
    const viewUrl = PostData.permalink()
    window.open(viewUrl, '_blank')
  }

  render () {
    const localizations = window.VCV_I18N && window.VCV_I18N()
    const { backToWordpress, saveDraft, wordPressDashboard, preview, previewChanges } = localizations

    let saveDraftButton = ''
    if (PostData.isDraft()) {
      saveDraftButton = (
        <span
          className='vcv-ui-navbar-control'
          title={saveDraft}
          onClick={this.saveDraft}
          data-href={PostData.permalink()}
        >
          <span className='vcv-ui-navbar-control-content'>{saveDraft}</span>
        </span>
      )
    }

    let viewButton = ''
    if (PostData.isViewable() && PostData.isPublished()) {
      viewButton = (
        <span
          className='vcv-ui-navbar-control'
          title={PostData.viewText()}
          onClick={this.handleViewPageClick}
        >
          <span className='vcv-ui-navbar-control-content'>{PostData.viewText()}</span>
        </span>
      )
    }

    let previewText = PostData.isPublished() ? previewChanges : preview
    let previewButton = (
      <span
        className='vcv-ui-navbar-control'
        title={previewText}
        onClick={this.savePreview}
        ref={(previewBtn) => { this.previewBtn = previewBtn }}
      >
        <span className='vcv-ui-navbar-control-content'>{previewText}</span>
      </span>
    )

    let backendEditorButton = (
      <span
        className='vcv-ui-navbar-control'
        onClick={this.handleClick}
        title={backToWordpress}
        data-href={PostData.backendEditorUrl()}
        data-backend-editor='backendEditor'
      >
        <span className='vcv-ui-navbar-control-content'>{backToWordpress}</span>
      </span>
    )

    let wordpressDashboardButton = (
      <span
        className='vcv-ui-navbar-control'
        onClick={this.handleClick}
        title={wordPressDashboard}
        data-href={env('VCV_JS_THEME_EDITOR') ? PostData.adminDashboardPostTypeListUrl() : PostData.adminDashboardUrl()}
      >
        <span className='vcv-ui-navbar-control-content'>{wordPressDashboard}</span>
      </span>
    )
    if (!env('VCV_JS_THEME_EDITOR') && !env('VCV_JS_ARCHIVE_TEMPLATE')) {
      wordpressDashboardButton = null
    }

    return (
      env('VCV_JS_THEME_EDITOR') || env('VCV_JS_ARCHIVE_TEMPLATE') ? (
        <div className='vcv-ui-navbar-controls-set'>
          {saveDraftButton}
          {wordpressDashboardButton}
        </div>
      ) : (
        <div className='vcv-ui-navbar-controls-set'>
          {previewButton}
          {saveDraftButton}
          {viewButton}
          {backendEditorButton}
          {wordpressDashboardButton}
        </div>
      )
    )
  }
}
