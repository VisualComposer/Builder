import vcCake from 'vc-cake'
import React from 'react'
import classNames from 'classnames'
import NavbarContent from '../navbarContent'

const PostData = vcCake.getService('wordpress-post-data')
const dataManager = vcCake.getService('dataManager')
const wordpressDataStorage = vcCake.getStorage('wordpressData')
const workspaceStorage = vcCake.getStorage('workspace')
const workspaceIFrame = workspaceStorage.state('iframe')
const SAVED_TIMEOUT = 3000

export default class WordPressPostSaveControl extends NavbarContent {
  static isMacLike = /(Mac|iPhone|iPod|iPad)/i.test(window.navigator.platform)

  timer = 0

  constructor (props) {
    super(props)
    this.state = {
      saving: false,
      loading: false,
      status: dataManager.get('editorType') === 'vcv_tutorials' ? 'disabled' : '',
      isOptionsActive: false
    }
    this.updateControlOnStatusChange = this.updateControlOnStatusChange.bind(this)
    this.handleClickSaveData = this.handleClickSaveData.bind(this)
    this.handleIframeChange = this.handleIframeChange.bind(this)
    this.handleClickSaveDraft = this.handleClickSaveDraft.bind(this)
    this.handleSave = this.handleSave.bind(this)
  }

  updateControlOnStatusChange (data, source = '') {
    const status = data.status
    if (status === 'saving' && source !== 'postSaveControl') {
      this.handleClickSaveData({ options: data.options }, {}, {}, true)
      return
    }
    if (status === 'success') {
      this.setState({
        status: 'success',
        isOptionsActive: false
      })
      this.clearTimer()
      // Show success at least for 3 secs
      this.timer = setTimeout(
        () => {
          this.setState({
            saving: false,
            status: ''
          })
        },
        SAVED_TIMEOUT
      )
    } else if (status === 'failed') {
      this.setState({
        status: 'error'
      })
      this.clearTimer()
      // Show error at least for 3 secs
      this.timer = setTimeout(
        () => {
          this.setState({
            saving: false,
            status: ''
          })
        },
        SAVED_TIMEOUT
      )
    }
  }

  componentDidMount () {
    wordpressDataStorage.state('status').onChange(this.updateControlOnStatusChange)
    workspaceIFrame.onChange(this.handleIframeChange)
  }

  componentWillUnmount () {
    wordpressDataStorage.state('status').ignoreChange(this.updateControlOnStatusChange)
    workspaceIFrame.ignoreChange(this.handleIframeChange)
  }

  handleIframeChange (data) {
    if (data && data.type === 'reload') {
      this.setState({ loading: true })
    } else if (data && (data.type === 'layoutLoaded' || data.type === 'loaded')) {
      this.setState({ loading: false })
      if (this.state.status === 'saving') {
        this.setState({ status: '' })
        this.handleClickSaveData()
      }
    }
  }

  clearTimer () {
    if (this.timer) {
      window.clearTimeout(this.timer)
      this.timer = 0
    }
  }

  handleClickSaveData (e, _, __, noStorageRequest = false) {
    e && e.preventDefault && e.preventDefault()

    if (this.state.status === 'saving' || this.state.status === 'disabled' || !e) {
      return
    }
    this.clearTimer()
    this.setState({
      status: 'saving'
    })
    if (this.state.loading) {
      return
    }
    window.setTimeout(() => {
      const sourceID = dataManager.get('sourceID')
      let urlQuery = `post.php?post=${sourceID}&action=edit&vcv-action=frontend&vcv-source-id=${sourceID}`
      if (window.location.href.indexOf('vcv-editor-type') !== -1) {
        // we have editor type. so add it always
        const urlObject = new URL(window.location.href)
        urlQuery += '&vcv-editor-type=' + urlObject.searchParams.get('vcv-editor-type')
      }
      window.history.replaceState({}, '', urlQuery)
      // Check Save option from other modules
      !noStorageRequest && wordpressDataStorage.trigger('save', {
        options: e ? e.options : {}
      }, 'postSaveControl')
    }, 1)
  }

  handleClickSaveDraft (e) {
    e && e.preventDefault && e.preventDefault()
    wordpressDataStorage.trigger('save', { draft: true }, 'wordpressAdminControl')
  }

  handleSave (e) {
    if (!PostData.isDraft()) {
      this.handleClickSaveData(e)
    }
  }

  render () {
    const localizations = dataManager.get('localizations')
    const saveButtonClasses = classNames({
      'vcv-ui-navbar-control': true,
      'vcv-ui-navbar-dropdown-trigger': true,
      'vcv-ui-state--success': this.state.status === 'success',
      'vcv-ui-state--error': this.state.status === 'error',
      'vcv-ui-state--disabled': this.state.status === 'disabled'
    })
    const saveIconClasses = classNames({
      'vcv-ui-navbar-control-icon': true,
      'vcv-ui-wp-spinner-light': this.state.status === 'saving',
      'vcv-ui-icon': this.state.status !== 'saving',
      'vcv-ui-icon-save': this.state.status !== 'saving'
    })
    const saveControlClasses = classNames({
      'vcv-ui-navbar-dropdown': true,
      'vcv-ui-navbar-save': true,
      'vcv-ui-pull-end': true,
      'vcv-ui-navbar-dropdown--active': this.state.isOptionsActive
    })
    const publishingOptions = localizations.publishingOptions
    let saveText = localizations.publish
    if (!PostData.canPublish()) {
      saveText = localizations.submitForReview
    }
    if (PostData.isPublished()) {
      saveText = localizations.update
    }

    const titleText = WordPressPostSaveControl.isMacLike ? saveText + ' (⌘S)' : saveText + ' (Ctrl + S)'
    let controlTitle = titleText

    let saveDraftOptions = null
    if (PostData.isDraft()) {
      const navbarContentClasses = classNames({
        'vcv-ui-navbar-dropdown-content': true,
        'vcv-ui-navbar-show-labels': true,
        'vcv-ui-navbar-dropdown-content--save': true
      })
      controlTitle = publishingOptions
      saveDraftOptions = (
        <dd className={navbarContentClasses}>
          <span
            className='vcv-ui-navbar-control'
            title={localizations.saveDraft}
            onClick={this.handleClickSaveDraft}
            data-href={PostData.permalink()}
            data-vcv-control='saveDraft'
          >
            <span className='vcv-ui-navbar-control-content'>{localizations.saveDraft}</span>
          </span>
          <span
            className='vcv-ui-navbar-control'
            title={titleText}
            onClick={this.handleClickSaveData}
            data-href={PostData.permalink()}
            data-vcv-control='publish'
          >
            <span className='vcv-ui-navbar-control-content'>{saveText}</span>
          </span>
        </dd>
      )
    }

    return (
      <dl
        className={saveControlClasses}
        data-vcv-guide-helper='save-control'
      >
        <dt
          className={saveButtonClasses}
          title={controlTitle}
          onClick={this.handleSave}
          data-vcv-control='publish'
        >
          <span className='vcv-ui-navbar-control-content'>
            <i className={saveIconClasses} />
            <span>{controlTitle}</span>
          </span>
        </dt>
        {saveDraftOptions}
      </dl>
    )
  }
}
