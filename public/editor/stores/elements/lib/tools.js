import vcCake from 'vc-cake'
import lodash from 'lodash'
const elementsStorage = vcCake.getStorage('elements')

export const rebuildRawLayout = (id, data = {}, documentManager, options) => {
  const elements = []
  const columns = documentManager.children(id)
  const newColumns = []
  const devices = ['all', 'defaultSize', 'xs', 'sm', 'md', 'lg', 'xl']
  let layouts = data.layout
  const defaultColumnData = { tag: 'column', parent: id, designOptionsAdvanced: {}, customClass: '', customHeaderTitle: '', metaCustomId: '', dividers: {}, sticky: {}, lastInRow: {}, firstInRow: {}, size: {} }
  const createdColumns = []
  const disableStacking = data && data.hasOwnProperty('disableStacking') ? data.disableStacking : false
  let lastColumnObject = null

  if (!layouts) {
    layouts = {}

    const rowChildren = documentManager.children(id)
    let customDevices = false
    rowChildren.forEach((element) => {
      if (element.size.hasOwnProperty('xs')) {
        customDevices = true
      }
    })

    // Get layout for 'all'
    rowChildren.forEach((element) => {
      if (!customDevices && element.size.all) {
        if (!layouts.hasOwnProperty('all')) {
          layouts.all = []
        }
        layouts.all.push(element.size.all)
      }

      if (element.size.defaultSize) {
        if (!layouts.hasOwnProperty('defaultSize')) {
          layouts.defaultSize = []
        }
        layouts.defaultSize.push(element.size.defaultSize)
      }
    })

    if (!layouts.hasOwnProperty('all')) { // Get layout for devices, if 'all' is not defined
      devices.forEach((device) => {
        if (device !== 'defaultSize' && device !== 'all') {
          rowChildren.forEach((element) => {
            if (element.size[device]) {
              if (!layouts.hasOwnProperty(device)) {
                layouts[device] = []
              }
              layouts[device].push(element.size[device])
            }

            if (customDevices && element.size.hasOwnProperty('all')) {
              if (!layouts.hasOwnProperty(device)) {
                layouts[device] = []
              }
              if (device === 'xs' || device === 'sm') {
                layouts[device].push('100%')
              } else {
                layouts[device].push(element.size.all)
              }
            }
          })
        }
      })
    }
  } else {
    if (layouts.hasOwnProperty('all') && !layouts.hasOwnProperty('defaultSize')) {
      layouts.defaultSize = layouts.all
    }
  }

  Object.keys(layouts).forEach((device) => {
    const layout = layouts[device]
    const lastColumns = getRowData(layout).lastColumnIndex
    let createdColCount = 0
    layout.forEach((size, i) => {
      const lastInRow = lastColumns.indexOf(i) > -1
      const firstInRow = i === 0 || lastColumns.indexOf(i - 1) > -1

      if (columns[i] !== undefined) {
        lastColumnObject = columns[i]
        lastColumnObject.size[device] = size
        if (device !== 'defaultSize') {
          lastColumnObject.lastInRow[device] = lastInRow
          lastColumnObject.firstInRow[device] = firstInRow
        }
        lastColumnObject.disableStacking = disableStacking
        let oldCol = false
        newColumns.forEach((newCol, index) => {
          if (lastColumnObject.id === newCol.id) {
            newColumns[index] = lastColumnObject
            oldCol = true
          }
        })
        if (!oldCol) {
          newColumns.push(lastColumnObject)
        }
      } else {
        if (!createdColumns[createdColCount]) {
          const createdColumnData = lodash.defaultsDeep({}, defaultColumnData)
          createdColumnData.size[device] = size
          if (device !== 'defaultSize') {
            createdColumnData.lastInRow[device] = lastInRow
            createdColumnData.firstInRow[device] = firstInRow
          }
          createdColumnData.disableStacking = disableStacking
          createdColumns.push(createdColumnData)
        } else {
          const createdColumnData = createdColumns[createdColCount]
          createdColumnData.size[device] = size
          if (device !== 'defaultSize') {
            createdColumnData.lastInRow[device] = lastInRow
            createdColumnData.firstInRow[device] = firstInRow
          }
          createdColumnData.disableStacking = disableStacking
        }
        createdColCount += 1
      }
    })
  })

  newColumns.forEach((col) => {
    if (!layouts.hasOwnProperty('all')) {
      delete col.size.all
    } else {
      delete col.size.xs
      delete col.size.sm
      delete col.size.md
      delete col.size.lg
      delete col.size.xl
    }
    documentManager.update(col.id, col)
    elements.push([col, 'update'])
  })

  createdColumns.forEach((newCol) => {
    const createdCol = documentManager.create(newCol)
    elements.push([createdCol, 'add'])
  })

  const defaultLayout = layouts.all || layouts.xs

  if (defaultLayout && (columns.length > defaultLayout.length)) {
    const removingColumns = columns.slice(defaultLayout.length)
    removingColumns.forEach((column) => {
      const childElements = documentManager.children(column.id)
      childElements.forEach((el) => {
        el.parent = lastColumnObject.id
        documentManager.update(el.id, el)
      })
      documentManager.delete(column.id)
      elements.push([column, 'remove'])
    })
  }
  elementsStorage.state('rebuildRow').set(true)
  return elements
}
export const addRowColumnBackground = (id, element, documentManager, options) => {
  const rowSettings = documentManager.get(element.parent)
  const colSettings = element
  const rowChildren = documentManager.children(rowSettings.id)

  const columnBackgrounds = []

  const pushBackground = (element) => {
    const designOptions = element.designOptionsAdvanced
    let backgroundUsed = false
    const elementBackground = {}
    if (designOptions && designOptions.device) {
      let hasDeviceSettings = false

      for (const prop in designOptions.device) {
        if (designOptions.device.hasOwnProperty(prop)) {
          hasDeviceSettings = true
        }
      }

      if (!hasDeviceSettings) {
        return
      }

      if (designOptions.device.hasOwnProperty('all')) {
        const allSettings = designOptions.device.all
        if (allSettings.backgroundColor || typeof allSettings.images === 'string' || (allSettings.images && allSettings.images.urls && allSettings.images.urls.length)) {
          elementBackground.all = true
          backgroundUsed = true
        }
      } else {
        for (const device in designOptions.device) {
          if (designOptions.device.hasOwnProperty(device)) {
            const deviceSettings = designOptions.device[device]
            if (deviceSettings.backgroundColor || typeof deviceSettings.images === 'string' || (deviceSettings.images && deviceSettings.images.urls && deviceSettings.images.urls.length)) {
              elementBackground[device] = true
              backgroundUsed = true
            }
          }
        }
      }

      if (backgroundUsed) {
        columnBackgrounds.push(elementBackground)
      }
    }
  }

  rowChildren.forEach((column) => {
    if (colSettings && column.id === colSettings.id) {
      pushBackground(colSettings)
    } else {
      pushBackground(column)
    }
  })

  const reducedColBackgrounds = columnBackgrounds.reduce(function (result, currentObject) {
    for (const key in currentObject) {
      if (currentObject.hasOwnProperty(key)) {
        result[key] = currentObject[key]
      }
    }
    return result
  }, {})

  rowSettings.columnBackground = reducedColBackgrounds
  documentManager.update(rowSettings.id, rowSettings)
}

export const isElementOneRelation = (parent, documentManager, cook) => {
  const element = documentManager.get(parent)
  const children = cook.getContainerChildren(element.tag)
  if (children.length === 1) {
    return children[0].tag
  }
  return false
}

export const getRowData = (layout) => {
  const lastColumnIndex = []
  let rowValue = 0
  let autoCount = 0
  const columnValues = []
  let isColumnsEqual = true
  const layoutCopy = layout.slice()

  // Remove last hide values
  while (layoutCopy.lastIndexOf('hide') === layoutCopy.length - 1 && layoutCopy.length) {
    isColumnsEqual = false
    layoutCopy.splice(layoutCopy.lastIndexOf('hide'), 1)
  }

  layoutCopy.forEach((col, index) => {
    let colValue = 0
    if (col === 'hide') {
      isColumnsEqual = false
    } else if (col === 'auto' || col === '') {
      colValue = 0.01
      columnValues.push('auto')
      autoCount++
    } else {
      if (col.indexOf('%') > -1) {
        colValue = parseFloat(col.replace('%', '').replace(',', '.')) / 100
      } else {
        const column = col.split('/')
        const numerator = column[0]
        const denominator = column[1]
        colValue = numerator / denominator
      }
      columnValues.push(colValue)
    }

    const newRowValue = Math.floor((rowValue + colValue) * 1000) / 1000

    if (newRowValue > 1 || (newRowValue === 1 && col === 'hide')) {
      isColumnsEqual = false
      lastColumnIndex.push(index - 1)
      rowValue = 0
    }
    if (layoutCopy[index + 1] === undefined) {
      lastColumnIndex.push(index)
    }
    rowValue += colValue
  })

  let rowFullValue = 0

  const newRowValue = rowValue - (autoCount * 0.01)
  const autoValue = (1 - newRowValue) / autoCount

  columnValues.forEach((size, index) => {
    if (size === 'auto') {
      columnValues[index] = autoValue
      rowFullValue += autoValue
    } else {
      rowFullValue += size
    }
  })

  columnValues.forEach((size) => {
    if (columnValues[0] !== size && size !== 1) {
      isColumnsEqual = false
    }
  })

  return {
    lastColumnIndex: lastColumnIndex,
    isColumnsEqual: isColumnsEqual,
    rowValue: rowFullValue
  }
}
