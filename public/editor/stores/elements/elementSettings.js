import { defaultsDeep } from 'lodash'
import { addStorage, getStorage, getService } from 'vc-cake'
import { getAttributeType } from '../../services/cook/lib/tools'

const fieldOptionsStorage = getStorage('fieldOptions')

const items = {}

addStorage('elementSettings', (storage) => {
  const dataManager = getService('dataManager')

  storage.on('add', (settings, componentCallback, cssSettings, modifierOnCreate) => {
    const allElementsSettings = getStorage('hubElements').state('elements').get() || dataManager.get('hubGetElements')
    let settingsCloneJsonString = JSON.stringify(settings)

    if (allElementsSettings[settings.tag.value]) {
      settingsCloneJsonString = settingsCloneJsonString.replace('[assetsPath]/', allElementsSettings[settings.tag.value].assetsPath).replace('[assetsPath]', allElementsSettings[settings.tag.value])
    }

    const dataSettings = JSON.parse(settingsCloneJsonString)
    Object.keys(dataSettings).forEach((attrKey) => {
      if (dataSettings[attrKey].type === 'designOptionsAdvanced' || dataSettings[attrKey].type === 'designOptions') {
        dataSettings[attrKey].options.tooltip = 'Apply the most common style properties and effects to content elements with <a href="https://visualcomposer.com/help/design-options/">Design Options</a>.'
      }
    })

    // Change elements initial values from storage
    const elementInitialValues = fieldOptionsStorage.state('elementInitialValue').get()
    if (elementInitialValues) {
      const currentElementValues = elementInitialValues[dataSettings.tag.value]
      if (dataSettings.tag.value && currentElementValues) {
        Object.keys(currentElementValues).forEach((attrKey) => {
          if (dataSettings[attrKey] && Object.prototype.hasOwnProperty.call(dataSettings[attrKey], 'value')) {
            dataSettings[attrKey].value = currentElementValues[attrKey]
          }
        })
      }
    }

    for (const k in dataSettings) {
      if (Object.prototype.hasOwnProperty.call(dataSettings, k)) {
        dataSettings[k].attrSettings = getAttributeType(k, dataSettings)
      }
    }

    items[settings.tag.value] = {
      settings: dataSettings,
      component: componentCallback,
      cssSettings: cssSettings,
      modifierOnCreate: modifierOnCreate
    }
  })

  storage.on('remove', (tag) => {
    delete items[tag]
  })

  storage.registerAction('get', (tag) => {
    return items[tag] ? defaultsDeep({}, items[tag]) : null
  })

  storage.registerAction('findTagByName', (name) => {
    return Object.keys(items).find((key) => {
      return items[key].settings && items[key].settings.name && items[key].settings.name.value === name
    })
  })

  storage.registerAction('getAttributeType', (tag, key) => {
    const settings = items[tag].settings[key]
    return settings || undefined
  })

  storage.registerAction('all', () => {
    return items
  })

  storage.registerAction('list', () => {
    return Object.keys(items).map((k) => {
      return items[k]
    })
  })
})
