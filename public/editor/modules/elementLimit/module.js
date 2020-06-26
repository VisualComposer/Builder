import { getStorage, getService } from 'vc-cake'

const elementsStorage = getStorage('elements')
const notificationsStorage = getStorage('notifications')
const wordpressDataStorage = getStorage('wordpressData')
const documentManager = getService('document')
const cook = getService('cook')

const localizations = window.VCV_I18N ? window.VCV_I18N() : {}
const limitTexts = {
  elementLimit1: localizations.onlyOneElementCanBeAddedToPage || 'Only one %element element can be added to the page.',
  elementLimit2: localizations.onlyTwoElementsCanBeAddedToPage || 'Only two %element elements can be added to the page.',
  elementLimit3: localizations.onlyThreeElementsCanBeAddedToPage || 'Only three %element elements can be added to the page.',
  elementLimit4: localizations.onlyFourElementsCanBeAddedToPage || 'Only four %element elements can be added to the page.',
  elementLimit5: localizations.onlyFiveElementsCanBeAddedToPage || 'Only five %element elements can be added to the page.',
  elementLimitDefault: localizations.elementLimitDefaultText || 'Only %count %element elements can be added to the page.'
}

const triggerNotification = (type, elementName, limit) => {
  let limitText = limitTexts.elementLimitDefault
  if (limit < 6) {
    limitText = limitTexts[`elementLimit${limit}`]
  } else {
    limitText = limitText.replace('%count', limit)
  }
  limitText = limitText.replace('%element', elementName)

  notificationsStorage.trigger('add', {
    position: 'top',
    transparent: false,
    rounded: false,
    type: type,
    text: limitText,
    time: 5000,
    showCloseButton: true
  })
}

const getElementExceededLimitStatus = (element) => {
  const limitData = {}
  if (Object.prototype.hasOwnProperty.call(element, 'metaElementLimit')) {
    const limit = parseInt(element.metaElementLimit)
    const limitedElements = documentManager.getByTag(element.tag) || {}
    if (limit > 0 && Object.keys(limitedElements).length > limit) {
      limitData.hasExceeded = true
      limitData.limit = limit
    }
  }
  return limitData
}

elementsStorage.on('add', (element) => {
  const elementLimitData = getElementExceededLimitStatus(element)
  if (elementLimitData.hasExceeded) {
    const cookElement = cook.get(element)
    triggerNotification('warning', cookElement.get('name'), elementLimitData.limit)
  }
})

elementsStorage.on('clone', (elementID) => {
  const element = documentManager.get(elementID)
  const elementLimitData = getElementExceededLimitStatus(element)
  if (elementLimitData.hasExceeded) {
    const cookElement = cook.get(element)
    triggerNotification('warning', cookElement.get('name'), elementLimitData.limit)
  }
})

wordpressDataStorage.on('wordpress:beforeSaveLock', (data) => {
  data.status = true
  const allElements = documentManager.all()
  const exceededElements = {}

  Object.keys(allElements).forEach((key) => {
    if (!exceededElements[key]) {
      const elementLimitData = getElementExceededLimitStatus(allElements[key])
      if (elementLimitData.hasExceeded) {
        const cookElement = cook.get(allElements[key])
        exceededElements[allElements[key].tag] = {
          limit: elementLimitData.limit,
          name: cookElement.get('name')
        }
      }
    }
  })

  if (Object.keys(exceededElements).length) {
    data.status = false
    Object.keys(exceededElements).forEach((key) => {
      triggerNotification('error', exceededElements[key].name, exceededElements[key].limit)
    })
  }
})
