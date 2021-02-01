import { addStorage, getService, getStorage } from 'vc-cake'

const createKey = getService('utils').createKey
const cacheStorage = getStorage('cache')

addStorage('workspace', (storage) => {
  const elementsStorage = getStorage('elements')
  const documentManager = getService('document')
  const notificationsStorage = getStorage('notifications')
  const cook = getService('cook')
  const dataManager = getService('dataManager')
  const isElementOneRelation = (parent) => {
    const children = cook.getContainerChildren(parent.tag)
    if (children.length === 1) {
      return children[0].tag
    }
    return false
  }
  storage.on('add', (id, tag, options) => {
    let element = false
    if (id) {
      element = documentManager.get(id)
    }
    if (element) {
      const oneTag = isElementOneRelation(element)
      if (oneTag) {
        const data = cook.get({ tag: oneTag, parent: id })
        elementsStorage.trigger('add', data.toJS(), true, options)
        return
      }
    }
    storage.state('settings').set({
      action: 'add',
      element: element,
      tag: tag,
      options: options
    })
  })
  storage.on('edit', (id, activeTab, options) => {
    if (!id) {
      return
    }
    const elementAccessPointService = getService('elementAccessPoint')
    let elementAccessPoint = elementAccessPointService.getInstance(id)

    if (options && options.nestedAttr) {
      // Trigger edit inside nestedAttr
      elementAccessPoint = options.parentElementAccessPoint
    }

    storage.state('settings').set({
      action: 'edit',
      elementAccessPoint: elementAccessPoint,
      activeTab: activeTab,
      options: options
    })
  })
  storage.on('remove', (id) => {
    const settings = storage.state('settings').get()
    elementsStorage.trigger('remove', id)

    // Close editForm if edit form is opened and element doesnt exist anymore
    if (settings && settings.action === 'edit' && settings.elementAccessPoint) {
      if (!documentManager.get(settings.elementAccessPoint.id)) {
        storage.state('settings').set(false)
      }
    }
  })
  storage.on('clone', (id) => {
    elementsStorage.trigger('clone', id)
    const metaCustomId = cook.getById(id).get('metaCustomId')
    if (metaCustomId) {
      const localizations = dataManager.get('localizations')
      const successMessage = localizations.cloneElementWithId || 'The element was cloned without a unique Element ID. Adjust the Element ID by editing the element.'
      notificationsStorage.trigger('add', {
        position: 'bottom',
        transparent: true,
        rounded: true,
        text: successMessage,
        time: 5000
      })
    }
  }, {
    debounce: 250
  })
  storage.on('copy', (id, tag, options) => {
    const localizations = dataManager.get('localizations')
    const successMessage = localizations.copyElementWithId || 'The element was copied without a unique Element ID. Adjust the Element ID by editing the element.'
    const element = documentManager.copy(id)
    const metaCustomId = cook.getById(id).get('metaCustomId')
    const copyData = {
      element,
      options
    }
    storage.state('copyData').set(copyData)
    if (window.localStorage) {
      window.localStorage.setItem('vcv-copy-data', JSON.stringify(copyData))
    }
    cacheStorage.trigger('clear', 'controls')
    if (metaCustomId) {
      notificationsStorage.trigger('add', {
        position: 'bottom',
        transparent: true,
        rounded: true,
        text: successMessage,
        time: 5000
      })
    }
  })
  const markLastChild = (data) => {
    if (data.children.length) {
      const lastChildIndex = data.children.length - 1
      data.children[lastChildIndex] = markLastChild(data.children[lastChildIndex])
    } else {
      data.lastItem = true
    }
    return data
  }
  const pasteElementAndChildren = (data, parentId, options = {}) => {
    const elementId = createKey()
    options = {
      ...options,
      silent: !data.lastItem,
      skipInitialExtraElements: true
    }
    const element = cook.get({
      ...data.element,
      id: elementId,
      parent: parentId
    })
    const elementData = element.toJS()
    elementsStorage.trigger('add', elementData, true, options)
    data.children.forEach(child => {
      pasteElementAndChildren(child, elementId)
    })
  }
  const pasteAfter = (data, parentId, options = {}) => {
    const elementId = createKey()
    const parentEl = cook.getById(parentId).toJS()
    options = {
      ...options,
      insertAfter: parentId,
      silent: !data.lastItem,
      skipInitialExtraElements: true
    }
    const element = cook.get({
      ...data.element,
      id: elementId,
      parent: parentEl.parent
    })
    const elementData = element.toJS()
    elementsStorage.trigger('add', elementData, true, options)
    data.children.forEach(child => {
      pasteElementAndChildren(child, elementId)
    })
  }
  const pasteEnd = (data, parentId, options = {}) => {
    const elementId = createKey()
    options = {
      ...options,
      silent: !data.lastItem,
      skipInitialExtraElements: true
    }
    const element = cook.get({
      ...data.element,
      id: elementId,
      parent: false
    })
    const elementData = element.toJS()
    elementsStorage.trigger('add', elementData, true, options)
    data.children.forEach(child => {
      pasteElementAndChildren(child, elementId)
    })
  }
  storage.on('paste', (id) => {
    let copyData = (window.localStorage && window.localStorage.getItem('vcv-copy-data')) || storage.state('copyData').get()
    if (!copyData) {
      return
    } else if (copyData.constructor === String) {
      try {
        copyData = JSON.parse(copyData)
      } catch (err) {
        return
      }
    }
    copyData.element = markLastChild(copyData.element)
    pasteElementAndChildren(copyData.element, id, copyData.options)
  })
  storage.on('pasteAfter', (id) => {
    let copyData = (window.localStorage && window.localStorage.getItem('vcv-copy-data')) || storage.state('copyData').get()
    if (!copyData) {
      return
    } else if (copyData.constructor === String) {
      try {
        copyData = JSON.parse(copyData)
      } catch (err) {
        return
      }
    }
    copyData.element = markLastChild(copyData.element)
    pasteAfter(copyData.element, id, copyData.options)
  })
  storage.on('pasteEnd', (id) => {
    let copyData = (window.localStorage && window.localStorage.getItem('vcv-copy-data')) || storage.state('copyData').get()
    if (!copyData) {
      return
    } else if (copyData.constructor === String) {
      try {
        copyData = JSON.parse(copyData)
      } catch (err) {
        return
      }
    }
    copyData.element = markLastChild(copyData.element)
    pasteEnd(copyData.element, id, copyData.options)
  })
  storage.on('move', (id, settings) => {
    elementsStorage.trigger('move', id, settings)
  })
  storage.on('drop', (id, settings) => {
    const relatedElement = settings.related ? cook.get(documentManager.get(settings.related)) : false
    const elementSettings = settings.element

    if (relatedElement) {
      elementSettings.parent = relatedElement.get('parent')
    }
    const data = cook.get(elementSettings)
    elementsStorage.trigger('add', data.toJS())
    let movingID = data.get('id')
    if (settings.action !== 'append' && relatedElement && relatedElement.relatedTo(['RootElements']) && !data.relatedTo(['RootElements'])) {
      movingID = documentManager.getTopParent(movingID)
    }
    elementsStorage.trigger('move', movingID, settings)
    storage.trigger('edit', data.toJS().id, '')
  })
  storage.on('start', () => {
    storage.state('app').set('started')
  })
  storage.on('addTemplate', () => {
    storage.state('settings').set({
      action: 'addTemplate',
      element: false,
      tag: false,
      options: {}
    })
  })
  storage.on('hide', (id, options) => {
    if (!id) {
      return
    }
    const element = documentManager.get(id)
    if (!element) {
      return
    }

    const newElement = element
    newElement.hidden = !element.hidden
    elementsStorage.trigger('update', id, newElement, '', { hidden: element.hidden, action: 'hide' })
  })
  storage.on('lock', (id, options = {}) => {
    if (!id) {
      return
    }
    const element = documentManager.get(id)
    if (!element) {
      return
    }

    const newElement = element
    newElement.metaIsElementLocked = options.action ? (options.action === 'lock') : !element.metaIsElementLocked
    elementsStorage.trigger('update', id, newElement, '', { metaIsElementLocked: element.metaIsElementLocked, action: 'lock' })

    if (options.lockInnerElements) {
      documentManager.children(id).forEach((child) => {
        storage.trigger('lock', child.id, { lockInnerElements: true, action: options.action, isChild: true })
      })
    }

    let messageText
    const localizations = dataManager.get('localizations')
    const lockElementMessage = localizations.lockElementNotificationText || 'The element has been locked and can be edited only by the Administrator role.'
    const unlockElementMessage = localizations.unlockElementNotificationText || 'The element has been unlocked and can be edited by all roles with the edit option.'
    const lockContainerMessage = localizations.lockContainerNotificationText || 'The element and all inner elements have been locked and can be edited only by the Administrator role.'
    const unlockContainerMessage = localizations.unlockContainerNotificationText || 'The element and all inner elements have been unlocked and can be edited by all roles with the edit option.'

    if (!options.isChild) {
      if (newElement.metaIsElementLocked) {
        messageText = options.lockInnerElements ? lockContainerMessage : lockElementMessage
      } else {
        messageText = options.lockInnerElements ? unlockContainerMessage : unlockElementMessage
      }
      notificationsStorage.trigger('add', {
        position: 'bottom',
        transparent: true,
        rounded: true,
        text: messageText,
        time: 5000
      })
    }
  })

  async function updateLockChunk (allElements, elementIds, locked) {
    return new Promise(resolve => {
      setTimeout(() => {
        elementIds.forEach((id) => {
          allElements[id].metaIsElementLocked = locked
          documentManager.update(id, allElements[id])
        })
        resolve()
      }, 60)
    })
  }

  const updateDocumentLockState = (locked) => {
    const allElements = documentManager.all()
    const elementIds = Object.keys(allElements)
    const perChunk = 20 // items per chunk
    const elementIdChunks = elementIds.reduce((resultArray, item, index) => {
      const chunkIndex = Math.floor(index / perChunk)
      if (!resultArray[chunkIndex]) {
        resultArray[chunkIndex] = [] // start a new chunk
      }
      resultArray[chunkIndex].push(item)

      return resultArray
    }, [])
    elementIdChunks.forEach(async (elementIds) => {
      await updateLockChunk(allElements, elementIds, locked)
    })

    window.setTimeout(() => {
      elementsStorage.trigger('updateTimeMachine') // save undo/redo
      const localizations = dataManager.get('localizations')
      const lockAllMessage = localizations.lockAllNotificationText || 'All elements on the page have been locked. Only the Administrator role can edit the content.'
      const unlockAllMessage = localizations.unlockAllNotificationText || 'All elements on the page have been unlocked. All users with the edit option can edit the content.'
      notificationsStorage.trigger('add', {
        position: 'bottom',
        transparent: true,
        rounded: true,
        text: locked ? lockAllMessage : unlockAllMessage,
        time: 5000
      })
      storage.state('lockUnlockDone').set(true)
    }, 1000)
  }
  storage.on('lockAll', () => {
    updateDocumentLockState(true)
  })
  storage.on('unlockAll', () => {
    updateDocumentLockState(false)
  })
  storage.state('navbarBoundingRect').set({
    resizeTop: 0,
    resizeLeft: 0
  })
  storage.on('removeFromDownloading', (tag) => {
    let downloadingItems = storage.state('downloadingItems').get() || []
    downloadingItems = downloadingItems.filter(downloadingTag => downloadingTag !== tag)
    storage.state('downloadingItems').set(downloadingItems)
  })
})
