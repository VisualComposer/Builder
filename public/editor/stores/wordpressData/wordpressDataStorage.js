import { addStorage, getStorage, getService, getData } from 'vc-cake'
import SaveController from './lib/saveController'
import { getResponse } from 'public/tools/response'
import Permalink from 'public/components/permalink/permalink'

addStorage('wordpressData', (storage) => {
  const controller = new SaveController()
  const elementsStorage = getStorage('elements')
  const workspaceStorage = getStorage('workspace')
  const settingsStorage = getStorage('settings')
  const hubTemplatesStorage = getStorage('hubTemplates')
  const migrationStorage = getStorage('migration')
  const documentManager = getService('document')
  const wordpressDataStorage = getStorage('wordpressData')

  storage.on('start', () => {
    // Here we call data load
    if (window.vcvSourceID) {
      // Fix trigger.start on initial post update action (performance)
      controller.load(window.vcvSourceID, {}, storage.state('status'))
    }
  })

  let lockData = {
    locked: false,
    status: true
  }
  storage.on('save', (data, source = '', options = {}) => {
    if (lockData.locked) { return }
    const next = () => {
      // Reset lockData to default
      lockData = {
        locked: false,
        status: true
      }
      const status = options && typeof options.status !== 'undefined' ? options.status : storage.state('status')
      status && status.set({ status: 'saving' }, source)
      settingsStorage.state('status').set({ status: 'ready' })
      const documentData = options && options.documentData ? options.documentData : documentManager.all()
      storage.trigger('wordpress:beforeSave', {
        pageElements: documentData
      })
      data = Object.assign({}, {
        elements: documentData
      }, data)
      const id = options && options.id ? options.id : window.vcvSourceID
      controller.save(id, data, status, options)
    }
    if (getData('wp-preview') === 'dopreview') {
      next()
      return
    }
    storage.trigger('wordpress:beforeSaveLock', lockData)
    const timeoutCheck = () => {
      if (lockData.locked) {
        window.setTimeout(timeoutCheck, 30)
      } else {
        if (lockData.status) {
          next()
        } else {
          const status = options && typeof options.status !== 'undefined' ? options.status : storage.state('status')
          status && status.set({ status: 'failed' }, source)
        }
      }
    }
    window.setTimeout(timeoutCheck, 5)
  })

  storage.state('status').set('init')
  storage.state('status').onChange((data) => {
    const { status, request } = data
    if (status === 'loadSuccess') {
      // setData('app:dataLoaded', true) // all call of updating data should goes through data state :)
      /**
       * @typedef {Object} responseData parsed data from JSON
       * @property {Array} globalElements list of global elements
       * @property {string} data saved data
       */
      const responseData = getResponse(request)
      const pageTitleData = responseData.pageTitle ? responseData.pageTitle : {}
      const pageTemplateData = window.VCV_PAGE_TEMPLATES ? window.VCV_PAGE_TEMPLATES() : ''
      const initialContent = responseData.post_content
      if ((!responseData.data || !responseData.data.length) && initialContent && initialContent.length) {
        elementsStorage.trigger('reset', {})
        migrationStorage.trigger('migrateContent', {
          _migrated: false,
          content: initialContent
        })
      } else if (responseData.data) {
        let data = { elements: {} }
        try {
          data = JSON.parse(responseData.data ? decodeURIComponent(responseData.data) : '{}')
        } catch (e) {
          console.warn('Failed to parse page elements', e)
          data = { elements: {} }
          // TODO: Maybe attempt to repair truncated js (like loose but not all?)
        }
        elementsStorage.trigger('reset', data.elements || {})
      } else {
        elementsStorage.trigger('reset', {})
      }
      if (responseData.cssSettings && Object.prototype.hasOwnProperty.call(responseData.cssSettings, 'custom')) {
        settingsStorage.state('customCss').set(responseData.cssSettings.custom || '')
      }
      if (responseData.cssSettings && Object.prototype.hasOwnProperty.call(responseData.cssSettings, 'global')) {
        settingsStorage.state('globalCss').set(responseData.cssSettings.global || '')
      }
      // JS Settings local/global @since v11 splitted into two parts
      if (responseData.jsSettings && Object.prototype.hasOwnProperty.call(responseData.jsSettings, 'localJsHead')) {
        settingsStorage.state('localJsHead').set(responseData.jsSettings.localJsHead || '')
      }
      if (responseData.jsSettings && Object.prototype.hasOwnProperty.call(responseData.jsSettings, 'localJsFooter')) {
        settingsStorage.state('localJsFooter').set(responseData.jsSettings.localJsFooter || '')
      }
      if (responseData.jsSettings && Object.prototype.hasOwnProperty.call(responseData.jsSettings, 'globalJsHead')) {
        settingsStorage.state('globalJsHead').set(responseData.jsSettings.globalJsHead || '')
      }
      if (responseData.jsSettings && Object.prototype.hasOwnProperty.call(responseData.jsSettings, 'globalJsFooter')) {
        settingsStorage.state('globalJsFooter').set(responseData.jsSettings.globalJsFooter || '')
      }
      if (responseData.templates) {
        hubTemplatesStorage.state('templates').set(responseData.templates)
      }
      if (Object.prototype.hasOwnProperty.call(pageTitleData, 'current')) {
        settingsStorage.state('pageTitle').set(pageTitleData.current)
      }
      if (Object.prototype.hasOwnProperty.call(pageTitleData, 'disabled')) {
        settingsStorage.state('pageTitleDisabled').set(pageTitleData.disabled)
      }
      if (pageTemplateData && pageTemplateData.current) {
        settingsStorage.state('pageTemplate').set(pageTemplateData.current)
      }
      if (Object.prototype.hasOwnProperty.call(responseData, 'itemPreviewDisabled')) {
        settingsStorage.state('itemPreviewDisabled').set(!!responseData.itemPreviewDisabled)
      }
      if (Object.prototype.hasOwnProperty.call(responseData, 'permalinkHtml')) {
        settingsStorage.state('permalinkHtml').set(responseData.permalinkHtml)

        const permalinkData = responseData.permalinkHtml ? Permalink.getPermalinkData(responseData.permalinkHtml) : null
        if (permalinkData) {
          settingsStorage.state('postName').set(permalinkData.permalinkFull)
        }
      }
      let postData = {}
      if (Object.prototype.hasOwnProperty.call(responseData, 'postData')) {
        postData = responseData.postData
      }
      if (Object.prototype.hasOwnProperty.call(responseData, 'postFields')) {
        const postFields = responseData.postFields
        if (Object.prototype.hasOwnProperty.call(postFields, 'dynamicFieldCustomPostData')) {
          const customPostData = postFields.dynamicFieldCustomPostData
          Object.keys(customPostData).forEach((key) => {
            const item = customPostData[key]
            postData[key] = item.postData
            postFields[key] = item.postFields
          })
        }
        settingsStorage.state('postFields').set(postFields)
      }
      settingsStorage.state('postData').set(postData)

      storage.state('status').set({ status: 'loaded' })
      settingsStorage.state('status').set({ status: 'ready' })
      workspaceStorage.state('app').set('started')
      window.onbeforeunload = () => {
        const isContentChanged = wordpressDataStorage.state('status').get().status === 'changed'
        const settingsStorageStateGet = settingsStorage.state('status').get()
        const isCssChanged = settingsStorageStateGet &&
          settingsStorageStateGet.status &&
          settingsStorageStateGet.status === 'changed'
        if (isContentChanged || isCssChanged) {
          return 'Changes that you made may not be saved.'
        }
      }
    } else if (status === 'loadFailed') {
      storage.state('status').set({ status: 'loaded' })
      throw new Error('Failed to load loaded')
    } else if (status === 'success') {
      const responseData = getResponse(request)
      if (responseData.postData) {
        if (Object.prototype.hasOwnProperty.call(responseData.postData, 'permalink')) {
          settingsStorage.state('permalink').set(responseData.postData.permalink)
        }
        if (Object.prototype.hasOwnProperty.call(responseData.postData, 'previewUrl')) {
          settingsStorage.state('previewUrl').set(responseData.postData.previewUrl)
        }
        if (Object.prototype.hasOwnProperty.call(responseData, 'permalinkHtml')) {
          settingsStorage.state('permalinkHtml').set(responseData.permalinkHtml)
        }
      }
    }
  })

  const workspaceIFrame = workspaceStorage.state('iframe')
  const workspaceContentState = workspaceStorage.state('content')
  storage.state('status').onChange((data) => {
    const { status } = data
    if (status === 'loadSuccess') {
      onIframeChange()
    }
  })
  settingsStorage.state('pageTitle').onChange(setTitle)
  settingsStorage.state('pageTitleDisabled').onChange(setTitle)
  workspaceIFrame.onChange(onIframeChange)
  let titles = []

  function onIframeChange (data = {}) {
    const { type = 'loaded' } = data
    if (type === 'loaded') {
      const iframe = document.getElementById('vcv-editor-iframe')
      if (iframe) {
        titles = [].slice.call(iframe.contentDocument.querySelectorAll('vcvtitle'))
        if (!titles.length) {
          titles = [].slice.call(iframe.contentDocument.querySelectorAll('h1.entry-title'))
        }
        if (!titles.length) {
          titles = [].slice.call(iframe.contentDocument.querySelectorAll('h1[class*="title"]'))
        }
        setTitle()
      }
    }
  }

  function setTitle () {
    if (!titles.length) {
      return
    }
    const current = settingsStorage.state('pageTitle').get()
    if (typeof current === 'undefined') {
      return
    }
    const disabled = settingsStorage.state('pageTitleDisabled').get()

    titles.forEach(title => {
      title.innerText = current
      title.style.display = disabled ? 'none' : ''
      title.onclick = () => {
        workspaceContentState.set('settings')
      }
    })
  }

  // postUpdate event
  storage.on('rebuild', (postId) => {
    storage.state('id').set(postId)
    postId && controller.load(postId, {}, storage.state('status'))
  })
})
