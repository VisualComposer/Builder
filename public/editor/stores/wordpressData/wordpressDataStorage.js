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
  const dataManager = getService('dataManager')
  const wordpressDataStorage = getStorage('wordpressData')
  const popupStorage = getStorage('popup')
  const notificationsStorage = getStorage('notifications')
  const cacheStorage = getStorage('cache')
  const localizations = dataManager.get('localizations')

  storage.on('start', () => {
    if (window.vcvPostUpdateAction && window.vcvPostUpdateAction === 'updatePosts') {
      // Skip initial editor loading for posts update actions
      return
    }
    if (dataManager.get('sourceID')) {
      // Fix trigger.start on initial post update action (performance)
      controller.load(dataManager.get('sourceID'), {}, storage.state('status'))
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
      const id = options && options.id ? options.id : dataManager.get('sourceID')
      controller.save(id, data, status, options)
    }
    if (getData('wp-preview') === 'dopreview') {
      next()
      return
    }
    storage.trigger('wordpress:beforeSaveLock', lockData, options.id)
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
      const pageTemplateData = dataManager.get('pageTemplates')
      const initialContent = responseData.post_content
      const featuredImageData = dataManager.get('featuredImage')
      const categoriesData = dataManager.get('categories') || []
      const authorData = dataManager.get('authorList')
      const commentStatusData = dataManager.get('commentStatus') || 'closed'
      const pingStatusData = dataManager.get('pingStatus') || 'closed'
      const excerptData = dataManager.get('excerpt') || ''
      const parentPageData = dataManager.get('pageList')
      let tagsData = dataManager.get('tags') || []
      let empty = false
      if (featuredImageData) {
        featuredImageData.initialSet = true
      }
      if ((!responseData.data || !responseData.data.length) && initialContent && initialContent.length) {
        elementsStorage.trigger('reset', {})
        empty = true
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
        }
        elementsStorage.trigger('reset', data.elements || {})
        if (!data.elements) {
          empty = true
        }
      } else {
        elementsStorage.trigger('reset', {})
        empty = true
      }
      if (responseData.elementsCssData) {
        cacheStorage.state('elementsCssCache').set(responseData.elementsCssData)
      }
      // fix for post update on empty templates
      if (empty) {
        elementsStorage.trigger('elementsRenderDone')
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
      if (responseData.templates && !Array.isArray(responseData.templates)) {
        hubTemplatesStorage.state('templates').set(responseData.templates)
      }
      if (responseData.templatesGroupsSorted) {
        hubTemplatesStorage.state('templatesGroupsSorted').set(responseData.templatesGroupsSorted)
      }
      if (responseData.popups) {
        popupStorage.state('popups').set(responseData.popups)
      }
      if (responseData.settingsPopup) {
        settingsStorage.state('settingsPopup').set(responseData.settingsPopup)
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
      if (featuredImageData && featuredImageData.urls && featuredImageData.urls.length) {
        settingsStorage.state('featuredImage').set(featuredImageData)
      }
      if (categoriesData && categoriesData.length) {
        settingsStorage.state('categories').set(categoriesData)
      }
      if (authorData && authorData.current) {
        settingsStorage.state('author').set(authorData.current)
      }
      if (commentStatusData) {
        settingsStorage.state('commentStatus').set(commentStatusData)
      }
      if (pingStatusData) {
        settingsStorage.state('pingStatus').set(pingStatusData)
      }
      if (excerptData) {
        settingsStorage.state('excerpt').set(excerptData)
      }
      if (parentPageData && parentPageData.current) {
        settingsStorage.state('parentPage').set(parentPageData.current)
      }
      if (tagsData && tagsData.length) {
        tagsData = tagsData.map(tag => tag.name)
        const parsedCurrentTags = settingsStorage.state('tags').get() || tagsData
        settingsStorage.state('tags').set(parsedCurrentTags)
      }
      if (Object.prototype.hasOwnProperty.call(responseData, 'outputEditorLayoutDesktop')) {
        settingsStorage.state('outputEditorLayoutDesktop').set(responseData.outputEditorLayoutDesktop)
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
  settingsStorage.state('featuredImage').onChange(setFeaturedImage)
  workspaceIFrame.onChange(onIframeChange)
  let titles = []
  let featuredImage
  let featuredImageNotification = false

  function onIframeChange (data = {}) {
    const { type = 'loaded' } = data
    if (type === 'loaded') {
      const iframe = document.getElementById('vcv-editor-iframe')
      if (iframe) {
        titles = [].slice.call(iframe.contentDocument.querySelectorAll('vcvtitle'))
        featuredImage = iframe.contentDocument.querySelector('.wp-post-image')
        if (!titles.length) {
          titles = [].slice.call(iframe.contentDocument.querySelectorAll('h1.entry-title'))
        }
        if (!titles.length) {
          titles = [].slice.call(iframe.contentDocument.querySelectorAll('h1[class*="title"]'))
        }
        setTitle()
        setFeaturedImage()
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

  function setFeaturedImage () {
    const current = settingsStorage.state('featuredImage').get()
    if (!featuredImage) {
      if (!featuredImageNotification && current && !current.initialSet && current.urls && current.urls[0] && (current.urls[0].full || current.urls[0].large)) {
        featuredImageNotification = true
        notificationsStorage.trigger('add', {
          position: 'bottom',
          transparent: true,
          rounded: true,
          text: localizations.featuredImageSet || 'Featured image is set. Save page and reload editor to see changes.',
          time: 8000
        })
      }
      return
    }
    if (typeof current === 'undefined') {
      return
    }
    if (current && current.urls && !current.urls.length) {
      notificationsStorage.trigger('add', {
        position: 'bottom',
        transparent: true,
        rounded: true,
        text: localizations.featuredImageRemoved || 'Featured image is removed. Save page and reload editor to see changes.',
        time: 8000
      })
    }
    const imageSource = current && current.urls && current.urls[0] && (current.urls[0].full || current.urls[0].large)
    featuredImage.src = imageSource || ''
    featuredImage.style.display = imageSource ? '' : 'none'
    featuredImage.hasAttribute('srcset') && featuredImage.removeAttribute('srcset')
  }

  // postUpdate event
  storage.on('rebuild', (postId) => {
    storage.state('id').set(postId)
    postId && controller.load(postId, {}, storage.state('status'))
  })
})
