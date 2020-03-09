import { addService, getService, getStorage, env } from 'vc-cake'
import { getResponse } from 'public/tools/response'
import ReactDOM from 'react-dom'

const utils = getService('utils')
const documentManager = getService('document')
const getType = {}.toString
const elementsStorage = getStorage('elements')

const processRequest = (action, key, data, successCallback, errorCallback) => {
  const ajax = getService('utils').ajax

  return ajax({
    'vcv-action': `editorTemplates:${action}:adminNonce`,
    'vcv-nonce': window.vcvNonce,
    'vcv-template-type': (window.VCV_EDITOR_TYPE && window.VCV_EDITOR_TYPE()) || 'default',
    [key]: data
  }, (result) => {
    const response = getResponse(result.response)
    if (response && response.status) {
      successCallback && typeof successCallback === 'function' && successCallback(response)
    } else {
      errorCallback && typeof errorCallback === 'function' && errorCallback(response)
    }
  }, errorCallback)
}

addService('myTemplates', {
  add (name, data, html, successCallback, errorCallback, isElementLayout = false) {
    if (this.findBy('name', name)) {
      return false
    }
    getStorage('wordpressData').trigger('save', {}, '', {
      id: 'template',
      title: name,
      status: false,
      documentData: isElementLayout ? data : false,
      successCallback: (responseText) => {
        try {
          const response = getResponse(responseText)
          if (!response.status || !response.postData || !response.postData.id) {
            console.warn('Failed to save template, no ID', responseText)
            errorCallback && typeof errorCallback === 'function' && errorCallback()
          } else {
            const id = response.postData.id
            const templateData = { id: id.toString(), name: name, data: data, html: html }
            getStorage('hubTemplates').trigger('add', 'custom', templateData)
            successCallback && typeof successCallback === 'function' && successCallback()
          }
        } catch (e) {
          console.warn('Failed to save template', e, responseText)
          errorCallback && typeof errorCallback === 'function' && errorCallback()
        }
      },
      errorCallback: () => {
        errorCallback && typeof errorCallback === 'function' && errorCallback()
      }
    })

    return true
  },
  addElementTemplate (id, name, successCallback, errorCallback) {
    const currentLayout = documentManager.getDescendants(id)
    const elementRefs = elementsStorage.state('elementRefs').get()
    const elementNode = ReactDOM.findDOMNode(elementRefs[id])
    const currentLayoutHtml = elementNode ? utils.normalizeHtml(elementNode.parentElement.innerHTML) : ''
    currentLayout[id].parent = false
    if (getType.call(name) === '[object String]' && name.length) {
      return this.add(name, currentLayout, currentLayoutHtml, successCallback, errorCallback, true)
    }
    return false
  },
  addCurrentLayout (name, successCallback, errorCallback) {
    const currentLayout = documentManager.all()
    const iframe = document.getElementById('vcv-editor-iframe')
    const contentLayout = iframe ? iframe.contentWindow.document.querySelector('[data-vcv-module="content-layout"]') : false
    const currentLayoutHtml = contentLayout ? utils.normalizeHtml(contentLayout.innerHTML) : ''
    if (getType.call(name) === '[object String]' && name.length) {
      return this.add(name, currentLayout, currentLayoutHtml, successCallback, errorCallback)
    }
    return false
  },
  remove (id, successCallback, errorCallback) {
    processRequest('delete', 'vcv-template-id', id, (response) => {
      getStorage('hubTemplates').trigger('remove', 'custom', id)
      successCallback && typeof successCallback === 'function' && successCallback(response)
    }, errorCallback)
  },
  load (id, successCallback, errorCallback) {
    processRequest('read', 'vcv-template-id', id, (response) => {
      successCallback && typeof successCallback === 'function' && successCallback(response)
    }, errorCallback)
  },
  get (id) {
    const myTemplates = this.all()
    return myTemplates.find((template) => {
      return template.id === id
    })
  },
  findBy (key, value) {
    return this.getAllTemplates().find((template) => {
      return template[key] && template[key] === value
    })
  },
  all (filter = null, sort = null, data) {
    const storageData = getStorage('hubTemplates').state('templates').get()
    let custom
    if (data && data.custom) {
      custom = data.custom
    } else {
      custom = storageData && storageData.custom ? storageData.custom : false
    }
    let myTemplates
    if (env('VCV_JS_THEME_EDITOR')) {
      const customTemplates = custom && custom.templates ? custom.templates : []
      const customHeader = this.customHeader(data)
      const customFooter = this.customFooter(data)
      const customSidebar = this.customSidebar(data)
      const customHeaderTemplates = customHeader && customHeader.templates ? customHeader.templates : []
      const customFooterTemplates = customFooter && customFooter.templates ? customFooter.templates : []
      const customSidebarTemplates = customSidebar && customSidebar.templates ? customSidebar.templates : []

      myTemplates = customTemplates.concat(customHeaderTemplates, customFooterTemplates, customSidebarTemplates)
    } else {
      myTemplates = custom && custom.templates ? custom.templates : []
    }
    if (filter && filter.constructor === Function) {
      myTemplates = myTemplates.filter(filter)
    }
    if (sort && sort.constructor === Function) {
      myTemplates.sort(sort)
    } else if (sort === 'name') {
      myTemplates.sort((a, b) => {
        return a.name ? a.name.localeCompare(b.name, { kn: true }, { sensitivity: 'base' }) : -1
      })
    }
    return myTemplates
  },
  predefined (data) {
    const predefinedTemplates = data || getStorage('hubTemplates').state('templates').get().predefined
    return predefinedTemplates && predefinedTemplates.templates ? predefinedTemplates.templates : []
  },
  hub (data) {
    const hubTemplates = data || getStorage('hubTemplates').state('templates').get().hub
    return hubTemplates && hubTemplates.templates ? hubTemplates.templates : []
  },
  findTemplateByBundle (bundle) {
    const allTemplates = getStorage('hubTemplates').state('templates').get() || {}
    delete allTemplates.custom
    let template = false
    const templatesTypes = Object.keys(allTemplates)
    for (let i = 0; i < templatesTypes.length; i++) {
      const type = templatesTypes[i]
      const hubTemplates = allTemplates[type] || []
      if (hubTemplates.templates) {
        template = hubTemplates.templates.find((hubTemplate) => {
          return hubTemplate.bundle === bundle ? hubTemplate : false
        })
        if (template) {
          break
        }
      }
    }
    return template
  },
  hubAndPredefined (data) {
    const hubAndPredefined = data && this.hub(data.hub).concat(this.predefined(data.predefined))
    return hubAndPredefined || []
  },
  hubHeader (data) {
    const hubHeaderTemplates = data
    return hubHeaderTemplates && hubHeaderTemplates.templates ? hubHeaderTemplates.templates : []
  },
  hubFooter (data) {
    const hubFooterTemplates = data
    return hubFooterTemplates && hubFooterTemplates.templates ? hubFooterTemplates.templates : []
  },
  hubSidebar (data) {
    const hubSidebarTemplates = data
    return hubSidebarTemplates && hubSidebarTemplates.templates ? hubSidebarTemplates.templates : []
  },
  hubBlock (data) {
    const hubBlockTemplates = data
    return hubBlockTemplates && hubBlockTemplates.templates ? hubBlockTemplates.templates : []
  },
  customHeader (data) {
    const customHeaderTemplates = data && data.customHeader
    return customHeaderTemplates && customHeaderTemplates.templates ? customHeaderTemplates.templates : []
  },
  customFooter (data) {
    const customFooterTemplates = data && data.customFooter
    return customFooterTemplates && customFooterTemplates.templates ? customFooterTemplates.templates : []
  },
  customSidebar (data) {
    const customSidebaremplates = data && data.customSidebar
    return customSidebaremplates && customSidebaremplates.templates ? customSidebaremplates.templates : []
  },
  getAllTemplates (filter = null, sort = null, data) {
    const allTemplatesGroups = data || getStorage('hubTemplates').state('templates').get()
    let allTemplates = []
    for (const key in allTemplatesGroups) {
      allTemplates = allTemplates.concat(allTemplatesGroups[key].templates)
    }
    if (filter && filter.constructor === Function) {
      allTemplates = allTemplates.filter(filter)
    }
    if (sort && sort.constructor === Function) {
      allTemplates.sort(sort)
    } else if (sort === 'name') {
      allTemplates.sort((a, b) => {
        return a.name ? a.name.localeCompare(b.name, { kn: true }, { sensitivity: 'base' }) : -1
      })
    }
    return allTemplates
  },
  getTemplateData () {
    const data = {}
    const storageData = getStorage('hubTemplates').state('templates').get()
    if (storageData) {
      data.getAllTemplates = this.getAllTemplates(null, null, storageData)
      data.all = this.all(null, null, storageData)
      data.hubAndPredefined = this.hubAndPredefined(storageData)
      data.hubHeader = this.hubHeader(storageData.hubHeader)
      data.hubFooter = this.hubFooter(storageData.hubFooter)
      data.hubSidebar = this.hubSidebar(storageData.hubSidebar)
      data.block = this.hubBlock(storageData.block)
    }
    return data
  },
  getLiteVersionTemplates () {
    // TODO get lite version templates from hub
    return this.getAllTemplates()
  }
})
