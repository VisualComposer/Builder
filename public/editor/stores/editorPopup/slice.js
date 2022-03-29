import { createSlice } from '@reduxjs/toolkit'
import { getService } from 'vc-cake'

const dataManager = getService('dataManager')

const getActivePopup = (popupData) => {
  const popupDataByPriority = []
  for (const popupName in popupData) {
    if (Object.prototype.hasOwnProperty.call(popupData, popupName)) {
      popupDataByPriority.push({ popupName: popupName, popupData: popupData[popupName] })
    }
  }

  popupDataByPriority.sort((a, b) => a.priority - b.priority)
  const firstVisible = popupDataByPriority.findIndex((item) => item.popupData.visible)

  let activePopup = null
  if (firstVisible >= 0 && popupDataByPriority[firstVisible]) {
    activePopup = popupDataByPriority[firstVisible].popupName
  }
  return activePopup
}
const slice = createSlice({
  name: 'editorPopup',
  initialState: {
    popups: {
      votePopup: {
        visible: dataManager?.get('showFeedbackForm'),
        priority: 1
      },
      reviewPopup: {
        visible: false,
        priority: 2
      },
      dataCollectionPopup: {
        visible: dataManager?.get('showDataCollectionPopup'),
        priority: 3
      },
      pricingPopup: {
        visible: !!dataManager?.get('showPricingPopup'),
        priority: 4
      },
      premiumPromoPopup: {
        visible: dataManager?.get('showPremiumPromoPopup'),
        priority: 5
      }
    },
    fullScreenPopupData: {},
    activeFullPopup: '',
    activePopup: ''
  },
  reducers: {
    popupShown: (data, action) => {
      const popupName = action.payload
      if (popupName && data.popups[popupName]) {
        data.popups[popupName].visible = true
      }
      data.activePopup = getActivePopup(data.popups)
    },
    popupHidden: (data, action) => {
      const popupName = action.payload
      if (popupName && data.popups[popupName]) {
        data.popups[popupName].visible = false
      }
      data.activePopup = getActivePopup(data.popups)
    },
    allPopupsHidden: (data, action) => {
      Object.keys(data.popups).forEach((popupName) => {
        data[popupName].visible = false
      })
      data.activePopup = getActivePopup(data.popups)
    },
    popupsSet: (data, action) => {
      data.popups = action.payload
      data.activePopup = getActivePopup(data.popups)
    },
    activeFullPopupSet: (data, action) => {
      data.activeFullPopup = action.payload
    },
    fullScreenPopupDataSet: (data, action) => {
      data.fullScreenPopupData = action.payload
    }
  }
})

export const { popupShown, popupHidden, allPopupsHidden, popupsSet, activeFullPopupSet, fullScreenPopupDataSet } = slice.actions
export default slice.reducer
