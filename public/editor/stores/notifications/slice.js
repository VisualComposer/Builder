import { createSlice, current } from '@reduxjs/toolkit'
import { getService } from 'vc-cake'

const slice = createSlice({
  name: 'notifications',
  initialState: {
    list: [],
    queue: [],
    portal: ''
  },
  reducers: {
    notificationAdded: (notifications, action) => {
      const Utils = getService('utils')
      const createKey = Utils.createKey
      const data = action.payload
      const limit = 5

      if (!data) {
        return
      }

      if (data.cookie) {
        let cookieName = ''
        if (data.cookie.constructor === Object && data.cookie.name) {
          cookieName = data.cookie.name
        } else if (data.cookie.constructor === String) {
          cookieName = data.cookie
        }
        if (Utils.getCookie(cookieName)) {
          return
        }
      }

      if (!data.id) {
        data.id = createKey()
      } else if (notifications.list.find(item => item.id === data.id)) { // Already added notification
        return
      }

      notifications.list.length >= limit
        ? notifications.queue.push(action.payload)
        : notifications.list.push(action.payload)
    },
    notificationRemoved: (notifications, action) => {
      const Utils = getService('utils')
      const index = notifications.list.findIndex((item) => item.id === action.payload)
      if (index >= 0) {
        const cookie = notifications.list[index].cookie
        if (cookie) {
          if (cookie.constructor === Object) {
            Utils.setCookie(cookie.name, true, cookie.expireInDays)
          } else if (cookie.constructor === String) {
            Utils.setCookie(cookie, true)
          }
        }

        notifications.list.splice(index, 1)

        if (current(notifications).queue[0]) {
          const clone = { ...current(notifications).queue[0] }
          notifications.queue.splice(0, 1)
          notifications.list.push(clone)
        }
      }
    },
    portalChanged: (notifications, action) => {
      notifications.portal = action.payload
    }
  }
})

export const { notificationAdded, notificationRemoved, portalChanged } = slice.actions
export default slice.reducer
