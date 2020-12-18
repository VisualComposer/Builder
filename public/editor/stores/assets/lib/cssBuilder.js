import { getService, getStorage, env } from 'vc-cake'

const cook = getService('cook')
const assetsStorage = getStorage('assets')
const elementsStorage = getStorage('elements')

export default class CssBuilder {
  constructor (globalAssetsStorageService, elementAssetsLibrary, stylesManager, windowObject, slugify) {
    Object.defineProperties(this, {
      /**
       * @memberOf! CssBuilder
       */
      loadedJsFiles: {
        configurable: false,
        enumerable: false,
        value: [],
        writable: true
      },
      /**
       * @memberOf! CssBuilder
       */
      addedEditorStylesTagList: {
        configurable: false,
        enumerable: false,
        value: [],
        writable: true
      },
      /**
       * @memberOf! CssBuilder
       */
      addedBaseStylesTagList: {
        configurable: false,
        enumerable: false,
        value: [],
        writable: true
      },
      /**
       * @memberOf! CssBuilder
       */
      loadedCssFiles: {
        configurable: false,
        enumerable: false,
        value: [],
        writable: true
      },
      /**
       * @memberOf! CssBuilder
       */
      globalAssetsStorageService: {
        configurable: false,
        enumerable: false,
        value: globalAssetsStorageService,
        writable: false
      },
      /**
       * @memberOf! CssBuilder
       */
      elementAssetsLibrary: {
        configurable: false,
        enumerable: false,
        value: elementAssetsLibrary
      },
      /**
       * @memberOf! CssBuilder
       */
      stylesManager: {
        configurable: false,
        enumerable: false,
        value: stylesManager
      },
      /**
       * @memberOf! CssBuilder
       */
      window: {
        configurable: false,
        enumerable: false,
        value: windowObject,
        writable: true
      },
      /**
       * @memberOf! CssBuilder
       */
      jobs: {
        configurable: false,
        enumerable: false,
        value: [],
        writable: true
      },
      /**
       * @memberOf! CssBuilder
       */
      slugify: {
        configurable: false,
        enumerable: false,
        value: slugify,
        writable: true
      }
    })
    this.resetJobs = this.resetJobs.bind(this)
  }

  add (data, force = false) {
    if (!data) {
      return
    }

    // TODO: Build only on update? [see git history]
    this.updateStyleDomNodes(data)
    this.addCssElementBaseByElement(data)
    this.addElementEditorFiles(data)
    this.addElementGlobalAttributesCssMixins(data) // designOptions!
    this.addElementLocalAttributesCssMixins(data) // local element cssMixins folder
    this.addElementFiles(data, force)

    this.doJobs(data).then(() => {
      this.addElementJobsToStorage(data, false)
      const jobsElements = (assetsStorage.state('jobs').get() && assetsStorage.state('jobs').get().elements) || []
      elementsStorage.trigger(`element:${data.id}:assets`, { elements: jobsElements })
      this.window.vcv.trigger('ready', 'add', data.id, {}, data.tag)
    })
  }

  update (data, options) {
    // const changedAttributeOptions = options && cook.getSettings(data.tag).settings[ options.changedAttribute ] && cook.getSettings(data.tag).settings[ options.changedAttribute ].options
    // let shouldStop = options && (options.changedAttributeType !== 'rowLayout' && options.changedAttributeType !== 'paramsGroup' && options.changedAttributeType !== 'designOptions' && options.changedAttributeType !== 'designOptionsAdvanced' && options.changedAttributeType !== 'element' && options.changedAttribute !== 'rowWidth')
    //
    // if (shouldStop && (!changedAttributeOptions || !changedAttributeOptions.cssMixin)) {
    //   return
    // }

    if (!data) {
      return
    }
    const dataStorageState = getStorage('wordpressData').state('status').get().status

    this.updateStyleDomNodes(data)
    if (dataStorageState === 'loadSuccess' && env('VCV_FT_INITIAL_CSS_LOAD')) {
      this.addElementEditorFiles(data)
    } else {
      this.addCssElementBaseByElement(data)
      this.addElementEditorFiles(data)
      this.addElementGlobalAttributesCssMixins(data) // designOptions!
      this.addElementLocalAttributesCssMixins(data) // local element cssMixins folder
      this.addElementFiles(data)
    }
    this.doJobs(data).then(() => {
      this.addElementJobsToStorage(data, false)
      const jobsElements = (assetsStorage.state('jobs').get() && assetsStorage.state('jobs').get().elements) || []
      elementsStorage.trigger(`element:${data.id}:assets`, { elements: jobsElements })
      this.window.vcv.trigger('ready', 'update', data.id, options, data.tag)
    })
  }

  destroy (id, tag) {
    this.removeCssElementMixinByElement(id)
    this.removeAttributesCssByElement(id)
    this.window.vcv.trigger('ready', 'destroy', id, {}, tag)
    this.removeElementJobsFromStorage(id)
  }

  addElementJobsToStorage (data, status) {
    const { id } = data
    const storageElements = (assetsStorage.state('jobs').get() && assetsStorage.state('jobs').get().elements) || []
    let element
    if (storageElements.length) {
      element = storageElements.find(element => element.id === id)
    }
    if (element) {
      element.jobs = status
    } else {
      const cookElement = cook.get(data)
      const element = {
        jobs: status,
        id: id,
        hidden: cookElement.get('hidden')
      }
      storageElements.push(element)
    }
    assetsStorage.state('jobs').set({ elements: storageElements })
  }

  removeElementJobsFromStorage (id) {
    let storageElements = (assetsStorage.state('jobs').get() && assetsStorage.state('jobs').get().elements) || []
    storageElements = storageElements.filter((element) => {
      return element.id !== id
    })
    assetsStorage.state('jobs').set({ elements: storageElements })
  }

  updateStyleDomNodes (data) {
    const id = data.id
    const elementTags = this.globalAssetsStorageService.getElementTagsByData(data)
    const baseStylesDom = this.window.document.getElementById('vcv-element-css-styles--base')
    const editorStylesDom = this.window.document.getElementById('vcv-element-css-styles--editor')
    const mixinsStylesDom = this.window.document.getElementById('vcv-element-css-styles--mixins')
    elementTags.forEach((tag) => {
      if (!this.window.document.getElementById(`vcv-base-css-styles-${tag}`)) {
        const baseStyleElement = this.window.document.createElement('style')
        baseStyleElement.id = `vcv-base-css-styles-${tag}`
        this.window.document.body.insertBefore(baseStyleElement, baseStylesDom)
      }
      if (!this.window.document.getElementById(`vcv-css-editor-styles-${tag}`)) {
        const editorStyleElement = this.window.document.createElement('style')
        editorStyleElement.id = `vcv-css-editor-styles-${tag}`
        this.window.document.body.insertBefore(editorStyleElement, editorStylesDom)
      }
    })

    if (!this.window.document.getElementById(`vcv-css-styles-${id}`)) {
      const styleElement = this.window.document.createElement('style')
      styleElement.id = `vcv-css-styles-${id}`
      this.window.document.body.insertBefore(styleElement, mixinsStylesDom)
    }
    if (!this.window.document.getElementById(`vcv-do-styles-${id}`)) {
      const doStyleElement = this.window.document.createElement('style')
      doStyleElement.id = `vcv-do-styles-${id}`
      this.window.document.body.insertBefore(doStyleElement, mixinsStylesDom)
    }

    // Inner element css-styles and do
    const elementObject = cook.get(data)
    const settings = elementObject.get('settings')
    for (const key in settings) {
      // If found element than get actual tags form element
      if (settings[key].type === 'element') {
        // we can get globalAttributesCssMixins for inner element
        const innerData = elementObject.get(key)
        const checksum = this.checksum(JSON.stringify(innerData))
        if (!this.window.document.getElementById(`vcv-css-styles-${id}-${checksum}`)) {
          const innerCssStyleElement = this.window.document.createElement('style')
          innerCssStyleElement.id = `vcv-css-styles-${id}-${checksum}`
          this.window.document.body.insertBefore(innerCssStyleElement, mixinsStylesDom)
        }
        if (!this.window.document.getElementById(`vcv-do-styles-${id}-${checksum}`)) {
          const innerDoStyleElement = this.window.document.createElement('style')
          innerDoStyleElement.id = `vcv-do-styles-${id}-${checksum}`
          this.window.document.body.insertBefore(innerDoStyleElement, mixinsStylesDom)
        }
      }
    }
  }

  addElementFiles (data, force) {
    if (force) {
      this.loadedCssFiles = []
      this.loadedJsFiles = []
    }
    const cookElement = cook.get(data)
    const elementAssetsFiles = this.elementAssetsLibrary.getAssetsFilesByElement(cookElement)
    const doc = this.window.document
    elementAssetsFiles.cssBundles.forEach((file) => {
      const slug = this.slugify(file)
      if (this.loadedCssFiles.indexOf(slug) === -1) {
        this.loadedCssFiles.push(slug)
        const cssLink = doc.createElement('link')
        cssLink.setAttribute('rel', 'stylesheet')
        cssLink.setAttribute('href', file)
        doc.head.appendChild(cssLink)
      }
    })

    elementAssetsFiles.jsBundles.forEach(
      (file) => {
        const slug = this.slugify(file)
        if (this.loadedJsFiles.indexOf(slug) === -1) {
          this.loadedJsFiles.push(slug)
          const scriptPromise = new Promise(
            (resolve, reject) => {
              this.window.jQuery.getScript(file).done(
                () => {
                  resolve(true)
                }
              ).fail(
                () => {
                  reject(new Error())
                }
              )
            }
          )
          this.addJob(scriptPromise)
        }
      }
    )
  }

  addElementEditorFiles (data) {
    const elementTags = this.globalAssetsStorageService.getElementTagsByData(data) || []
    elementTags.forEach((tag) => {
      if (this.addedEditorStylesTagList.indexOf(tag) === -1) {
        const elementEditorCss = this.globalAssetsStorageService.elementCssEditor(tag)
        if (elementEditorCss.length) {
          this.addedEditorStylesTagList.push(tag)

          const file = this.window.document.getElementById(`vcv-css-editor-styles-${tag}`)
          if (file) {
            file.innerHTML = elementEditorCss[0].src
          }
        }
      }
    })
  }

  /**
   * Used in inner elements without ID for css styles
   * @param s
   * @return {string}
   */
  checksum (s) {
    let chk = 0x12345678
    const len = s.length
    for (let i = 0; i < len; i++) {
      chk += (s.charCodeAt(i) * (i + 1))
    }

    return (chk & 0xffffffff).toString(16)
  }

  addElementLocalAttributesCssMixins (data) {
    const styles = this.stylesManager.create()
    const localElementStyles = this.globalAssetsStorageService.getElementLocalAttributesCssMixins(data)
    styles.add(localElementStyles)

    const attributesStylesPromise = styles.compile().then((result) => {
      const style = this.window.document.getElementById(`vcv-css-styles-${data.id}`)
      if (style) {
        style.innerHTML = result
      }
    })
    this.addJob(attributesStylesPromise)

    const elementObject = cook.get(data)
    const settings = elementObject.get('settings')
    for (const key in settings) {
      // If found element than get actual tags form element
      if (settings[key].type === 'element') {
        // we can get localCss for inner element
        const innerData = elementObject.get(key)
        const checksum = this.checksum(JSON.stringify(innerData))
        const innerElementLocalAttributesCssMixins = this.globalAssetsStorageService.getElementLocalAttributesCssMixins(innerData)
        const innerStyles = this.stylesManager.create()
        innerStyles.add(innerElementLocalAttributesCssMixins)
        const innerStylesPromise = innerStyles.compile().then((result) => {
          const style = this.window.document.getElementById(`vcv-css-styles-${data.id}-${checksum}`)
          if (style) {
            style.innerHTML = result
          }
        })
        this.addJob(innerStylesPromise)
      }
    }
  }

  removeAttributesCssByElement (id) {
    const node = this.window.document.getElementById(`vcv-css-styles-${id}`)
    node && node.remove()
  }

  addCssElementBaseByElement (data) {
    const elementTags = this.globalAssetsStorageService.getElementTagsByData(data) || []
    elementTags.forEach((tag) => {
      if (this.addedBaseStylesTagList.indexOf(tag) === -1) {
        const elementCssBase = this.globalAssetsStorageService.elementCssBase(tag)
        if (elementCssBase.length) {
          this.addedBaseStylesTagList.push(tag)

          const style = this.window.document.getElementById(`vcv-base-css-styles-${tag}`)
          if (style) {
            style.innerHTML = elementCssBase[0].src
          }
        }
      }
    })
  }

  addElementGlobalAttributesCssMixins (data) {
    const styles = this.stylesManager.create()
    const elementGlobalAttributesCssMixins = this.globalAssetsStorageService.getElementGlobalAttributesCssMixins(data)

    styles.add(elementGlobalAttributesCssMixins)
    const stylesPromise = styles.compile().then((result) => {
      const style = this.window.document.getElementById(`vcv-do-styles-${data.id}`)
      if (style) {
        style.innerHTML = result
      }
    })
    this.addJob(stylesPromise)

    const elementObject = cook.get(data)
    const settings = elementObject.get('settings')
    for (const key in settings) {
      // If found element than get actual tags form element
      if (settings[key].type === 'element') {
        // we can get globalAttributesCssMixins for inner element
        const innerData = elementObject.get(key)
        const checksum = this.checksum(JSON.stringify(innerData))
        const innerElementGlobalAttributesCssMixins = this.globalAssetsStorageService.getElementGlobalAttributesCssMixins(innerData)
        const innerStyles = this.stylesManager.create()
        innerStyles.add(innerElementGlobalAttributesCssMixins)
        const innerStylesPromise = innerStyles.compile().then((result) => {
          const style = this.window.document.getElementById(`vcv-do-styles-${data.id}-${checksum}`)
          if (style) {
            style.innerHTML = result
          }
        })
        this.addJob(innerStylesPromise)
      }
    }
  }

  removeCssElementMixinByElement (id) {
    const node = this.window.document.getElementById(`vcv-do-styles-${id}`)
    node && node.remove()
  }

  buildStylesContainers () {
    const ids = ['vcv-settings-css-styles', 'vcv-element-css-styles--base', 'vcv-element-css-styles--editor', 'vcv-element-css-styles--mixins']
    ids.forEach(id => {
      const container = this.window.document.getElementById(id)
      if (container) {
        return container
      }
      const styleElement = this.window.document.createElement('style')
      styleElement.id = id
      this.window.document.body.appendChild(styleElement)
    })

    return ids[0]
  }

  updateSettingsStyles (cssStyles) {
    const container = this.window.document.querySelector('#vcv-settings-css-styles')
    container.innerHTML = cssStyles
  }

  addJob (job) {
    this.jobs.push(job)
  }

  doJobs (data) {
    this.addElementJobsToStorage(data, true)
    return Promise.all(this.jobs).catch(this.resetJobs).then(this.resetJobs)
  }

  resetJobs () {
    this.jobs.length = 0
  }
}
