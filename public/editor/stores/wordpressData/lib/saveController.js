import vcCake from 'vc-cake'
import { getResponse } from 'public/tools/response'
import { getPopupDataFromElement } from 'public/tools/popup'

const dataProcessor = vcCake.getService('dataProcessor')
const elementAssetsLibrary = vcCake.getService('elementAssetsLibrary')
const stylesManager = vcCake.getService('stylesManager')
const modernAssetsStorage = vcCake.getService('modernAssetsStorage')
const utils = vcCake.getService('utils')
const settingsStorage = vcCake.getStorage('settings')
const cook = vcCake.getService('cook')
const renderProcessor = vcCake.getService('renderProcessor')

export default class SaveController {
  ajax (data, successCallback, failureCallback) {
    dataProcessor.appAllDone().then(() => {
      dataProcessor.appAdminServerRequest(data).then(successCallback, failureCallback)
    })
  }

  /**
   * Send data to server
   * @param id
   * @param data
   * @param status
   * @param options
   * @private
   */
  save (id, data, status, options) {
    let globalStylesCompiled = ''
    let pageStylesCompiled = ''
    const promises = []
    const assetsStorageInstance = modernAssetsStorage.create()
    const globalStylesManager = stylesManager.create()
    const globalCss = settingsStorage.state('globalCss').get() || ''
    globalStylesManager.add([{
      src: globalCss
    }])
    promises.push(globalStylesManager.compile().then((result) => {
      globalStylesCompiled = result
    }))
    const localStylesManager = stylesManager.create()
    const customCss = settingsStorage.state('customCss').get() || ''
    localStylesManager.add([{
      src: customCss
    }])
    // localStylesManager.add(globalAssetsStorageInstance.getPageCssDataNG())
    promises.push(localStylesManager.compile().then((result) => {
      pageStylesCompiled = result
    }))
    const assetsFiles = {
      jsBundles: [],
      cssBundles: []
    }
    const elementsCss = {}
    const extraArgs = {}
    if (vcCake.env('VCV_POPUP_BUILDER')) {
      extraArgs['vcv-popup-data'] = []
    }
    Object.keys(data.elements).forEach((key) => {
      const cookElement = cook.get(data.elements[key])
      const tag = cookElement.get('tag')
      elementsCss[key] = {
        tag: tag
      }
      const elementAssetsFiles = elementAssetsLibrary.getAssetsFilesByElement(cookElement)
      assetsFiles.cssBundles = assetsFiles.cssBundles.concat(elementAssetsFiles.cssBundles)
      assetsFiles.jsBundles = assetsFiles.jsBundles.concat(elementAssetsFiles.jsBundles)
      const elementBaseStyleManager = stylesManager.create()
      const elementAttributesStyleManager = stylesManager.create()
      const elementMixinsStyleManager = stylesManager.create()
      const { tags: baseCss, attributeMixins, cssMixins } = assetsStorageInstance.getCssDataByElement(data.elements[key], {
        tags: true,
        attributeMixins: true,
        cssMixins: true,
        skipOnSave: true
      })
      promises.push(elementBaseStyleManager.add(baseCss).compile().then((result) => {
        elementsCss[key].baseCss = result
      }))
      promises.push(elementAttributesStyleManager.add(attributeMixins).compile().then((result) => {
        elementsCss[key].attributesCss = result
      }))
      promises.push(elementMixinsStyleManager.add(cssMixins).compile().then((result) => {
        elementsCss[key].mixinsCss = result
      }))

      if (vcCake.env('VCV_POPUP_BUILDER')) {
        extraArgs['vcv-popup-data'] = getPopupDataFromElement(cookElement)
      }
    })

    promises.push(renderProcessor.appAllDone())
    promises.push(dataProcessor.appAllDone())

    assetsFiles.cssBundles = [...new Set(assetsFiles.cssBundles)]
    assetsFiles.jsBundles = [...new Set(assetsFiles.jsBundles)]
    return Promise.all(promises).then(() => {
      const iframe = document.getElementById('vcv-editor-iframe')
      const contentLayout = iframe ? iframe.contentWindow.document.querySelector('[data-vcv-module="content-layout"]') : false
      const content = contentLayout ? utils.normalizeHtml(contentLayout.innerHTML) : ''
      const requestData = {
        'vcv-action': 'setData:adminNonce',
        'vcv-source-id': id,
        'vcv-ready': '1', // Used for backend editor when post being saved
        'vcv-content': '<!--vcv no format-->' + content + '<!--vcv no format-->',
        'vcv-data': encodeURIComponent(JSON.stringify(data)),
        'vcv-global-css-compiled': globalStylesCompiled,
        'vcv-elements-css-data': encodeURIComponent(JSON.stringify(elementsCss)),
        'vcv-source-assets-files': encodeURIComponent(JSON.stringify(assetsFiles)),
        'vcv-source-css-compiled': pageStylesCompiled,
        'vcv-settings-source-custom-css': customCss,
        'vcv-settings-global-css': globalCss,
        'vcv-settings-source-local-head-js': settingsStorage.state('localJsHead').get() || '',
        'vcv-settings-source-local-footer-js': settingsStorage.state('localJsFooter').get() || '',
        'vcv-settings-global-head-js': settingsStorage.state('globalJsHead').get() || '',
        'vcv-settings-global-footer-js': settingsStorage.state('globalJsFooter').get() || '',
        'vcv-be-editor': 'fe',
        'wp-preview': vcCake.getData('wp-preview'),
        'vcv-updatePost': '1'
      }
      const pageTemplateData = settingsStorage.state('pageTemplate').get()
      if (pageTemplateData) {
        if (pageTemplateData.stretchedContent) {
          // Due to browsers converts Boolean TRUE to string "true"
          pageTemplateData.stretchedContent = 1
        } else {
          pageTemplateData.stretchedContent = 0
        }
        requestData['vcv-page-template'] = pageTemplateData
      }
      const title = options && options.title ? options.title : settingsStorage.state('pageTitle').get() || ''
      requestData['vcv-page-title'] = title
      requestData['vcv-page-title-disabled'] = settingsStorage.state('pageTitleDisabled').get() || ''
      requestData['vcv-post-name'] = settingsStorage.state('postName').get() || ''

      const extraRequestData = settingsStorage.state('saveExtraArgs').get() || {}
      requestData['vcv-extra'] = Object.assign(extraArgs, extraRequestData)

      const itemPreviewDisabled = settingsStorage.state('itemPreviewDisabled').get() || ''
      requestData['vcv-item-preview-disabled'] = itemPreviewDisabled
      this.ajax(
        requestData,
        options && options.successCallback ? options.successCallback : this.saveSuccess.bind(this, status),
        options && options.errorCallback ? options.errorCallback : this.saveFailed.bind(this, status)
      )
    })
  }

  saveSuccess (status, responseText) {
    try {
      const data = getResponse(responseText || '{}')
      if (!data || !data.status) {
        console.warn('save failed, no status')
        this.saveFailed(status, responseText)
      } else {
        if (data && data.postData) {
          window.vcvPostData = data.postData
        }
        status && status.set({
          status: 'success',
          request: responseText
        })
      }
    } catch (e) {
      console.warn('save failed', e)
      this.saveFailed(status, responseText)
    }
    // this.props.api.request('wordpress:data:saved', {
    //   status: 'success',
    //   request: responseText
    // })
  }

  saveFailed (status, request) {
    try {
      const data = getResponse(request)
      if (data && data.postData) {
        window.vcvPostData = data.postData
      }
      status && status.set({
        status: 'failed',
        request: request
      })
      return
    } catch (e) {
      console.warn(e)
    }
    status && status.set({
      status: 'failed',
      request: request
    })
    // this.props.api.request('wordpress:data:saved', {
    //   status: 'failed',
    //   request: request
    // })
  }

  load = (id, data, status) => {
    this.ajax(
      {
        'vcv-action': 'getData:adminNonce',
        'vcv-source-id': id,
        'vcv-data': encodeURIComponent(JSON.stringify(data))
      },
      this.loadSuccess.bind(this, status),
      this.loadFailed.bind(this, status)
    )
  }

  loadSuccess = (status, request) => {
    status.set({
      status: 'loadSuccess',
      request: request
    })
    // this.props.api.request('wordpress:data:loaded', {
    //   status: 'success',
    //   request: request
    // })
  }

  loadFailed = (status, request) => {
    status.set({
      status: 'loadFailed',
      request: request
    })
    // this.props.api.request('wordpress:data:loaded', {
    // status: 'failed',
    // request: request
    // })
  }
}
