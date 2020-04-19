import React from 'react'
// import classnames from 'classnames'
import Attribute from '../attribute'
import GutenbergModal from './lib/gutenbergModal'
import { iframeControlStyles } from './lib/iframeControlStyles'
/* Working prototype */
export default class GutenbergEditorComponent extends Attribute {
  static defaultProps = {
    fieldType: 'gutenbergEditor'
  }

  constructor (props) {
    super(props)
    this.handleEditorOpen = this.handleEditorOpen.bind(this)
    this.handleIframeLoad = this.handleIframeLoad.bind(this)
    this.updateValueFromIframe = this.updateValueFromIframe.bind(this)
    this.closeEditor = this.closeEditor.bind(this)
    this.updateEditor = this.updateEditor.bind(this)

    this.state = {
      showEditor: false,
      loadingEditor: false,
      value: props.value
    }
  }

  handleEditorOpen (e) {
    e.preventDefault()
    this.setState({
      showEditor: true,
      loadingEditor: true
    })
  }

  closeEditor () {
    this.setState({
      showEditor: false,
      loadingEditor: false
    })
  }

  updateEditor () {
    this.updateValueFromIframe()
    this.closeEditor()
  }

  handleIframeLoad () {
    const { value } = this.state
    const window = this.iframe.contentWindow
    const wpData = window.wp ? window.wp.data : false
    if (!wpData) {
      const localizations = window.VCV_I18N && window.VCV_I18N()

      const alertNotice = localizations ? localizations.gutenbergDoesntWorkProperly : "Gutenberg plugin doesn't work properly. Please check Gutenberg plugin."
      window.alert(alertNotice)
      this.closeEditor()
    }
    // Set current content
    // Editor settings
    const postIdInput = this.iframe.contentWindow.document.getElementById('post_ID')
    const id = postIdInput ? postIdInput.value : ''
    const newPost = {
      id: id,
      guid: { raw: '/?', rendered: '/?' },
      title: { raw: '' },
      content: { raw: value, rendered: value },
      type: 'vcv_gutenberg_attr',
      slug: '',
      status: 'publish',
      link: '/?',
      format: 'standard',
      categories: [],
      _links: []
    }
    const editor = wpData.dispatch('core/editor')
    const postEdit = wpData.dispatch('core/edit-post')
    // selectEditor.isPublishSidebarOpened = () => { return true }
    editor.setupEditor(newPost)
    editor.disablePublishSidebar()
    editor.lockPostSaving()
    postEdit.closeGeneralSidebar()
    if (!!editor.autosave && typeof editor.autosave === 'function') {
      editor.autosave = () => {}
    }
    const originalOpenGeneralSidebar = postEdit.openGeneralSidebar
    postEdit.openGeneralSidebar = function (block) {
      if (block !== 'edit-post/document') {
        originalOpenGeneralSidebar(block)
      }
    }

    wpData.subscribe(() => {
      if (!wpData.select('core/block-editor').getBlockSelectionStart()) {
        postEdit.closeGeneralSidebar()
      }
    })
    const postTitle = window.document.querySelector('.editor-post-title')
    const notice = window.document.querySelector('.components-notice-list')
    if (postTitle) {
      postTitle.classList.add('hidden')
    }
    if (notice) {
      notice.classList.add('hidden')
    }
    this.renderGutenbergControls(window)
    this.setState({ loadingEditor: false })
  }

  getControlsHTML () {
    const localizations = window.VCV_I18N && window.VCV_I18N()
    const gutenbergEditorUpdateButton = localizations.gutenbergEditorUpdateButton ? localizations.gutenbergEditorUpdateButton : 'Update'
    return `
      <div class="vcv-gutenberg-controls-container">
          ${iframeControlStyles()}
          <button class="vcv-gutenberg-modal-update-button">${gutenbergEditorUpdateButton}</button>
          <button class="vcv-gutenberg-modal-close-button">
            <i class="vcv-ui-icon-close-thin"></i>
          </button>
      </div>
    `
  }

  renderGutenbergControls (iframe) {
    const postToolbar = iframe.document.querySelector('.edit-post-header-toolbar')
    const controlHTML = this.getControlsHTML()
    postToolbar.insertAdjacentHTML('afterend', controlHTML)
    const updateButton = iframe.document.querySelector('.vcv-gutenberg-modal-update-button')
    const closeButton = iframe.document.querySelector('.vcv-gutenberg-modal-close-button')
    updateButton.addEventListener('click', this.updateEditor)
    closeButton.addEventListener('click', this.closeEditor)
  }

  updateValueFromIframe () {
    if (!this.iframe || !this.iframe.contentWindow || !this.iframe.contentWindow.wp) {
      return
    }
    const wpData = this.iframe.contentWindow.wp.data
    if (wpData) {
      const value = wpData.select('core/editor').getEditedPostContent()
      this.setFieldValue(value)
    }
  }

  render () {
    const { showEditor, loadingEditor } = this.state
    let loadingOverlay = null
    if (loadingEditor) {
      loadingOverlay = (
        <div className='vcv-loading-overlay'>
          <div className='vcv-loading-dots-container'>
            <div className='vcv-loading-dot vcv-loading-dot-1' />
            <div className='vcv-loading-dot vcv-loading-dot-2' />
          </div>
        </div>
      )
    }

    const editor = () => {
      if (showEditor) {
        const iframeURL = window.vcvGutenbergEditorUrl ? window.vcvGutenbergEditorUrl : '/wp-admin/post-new.php?post_type=vcv_gutenberg_attr' // change with vcv action
        return (
          <GutenbergModal>
            {loadingOverlay}
            <div className='vcv-gutenberg-modal-inner'>
              <iframe id='vcv-gutenberg-attribute-modal-iframe' ref={(iframe) => { this.iframe = iframe }} src={iframeURL} onLoad={this.handleIframeLoad} />
            </div>
          </GutenbergModal>
        )
      }
    }
    return (
      <>
        <button className='vcv-ui-form-button vcv-ui-form-button--action' onClick={this.handleEditorOpen}>
          Open Gutenberg
        </button>
        {editor()}
      </>
    )
  }
}
