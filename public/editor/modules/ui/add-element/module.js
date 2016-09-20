import vcCake from 'vc-cake'
import {default as AddElement} from './lib/add-element'
import AddElementControl from './lib/navbar-control'
import './css/init.less'

vcCake.add('ui-add-element', (api) => {
  // get get Parrent
  let currentParentElement = null
  api.addAction('setParent', (parent) => {
    currentParentElement = parent
  })
  api.addAction('getParent', () => {
    return currentParentElement
  })
  // subscribe to global events
  api
    .reply('app:add', (parent = null, tag = null) => {
      !tag && api.notify('show', parent)
    })
    .reply('data:add', () => {
      api.notify('hide')
    })
    .reply('data:remove', (id) => {
      if (id === api.actions.getParent()) {
        api.notify('hide')
      }
    })

  // subscribe to local events
  api
    .on('hide', () => {
      api.actions.setParent(null)
      api.module('ui-layout-bar').do('setEndContent', null)
      api.module('ui-layout-bar').do('setEndContentVisible', false)
    })
    .on('show', (parent = null) => {
      api.actions.setParent(parent)
      api.module('ui-layout-bar').do('setEndContent', AddElement, {
        api: api,
        parent: parent
      })
      api.module('ui-layout-bar').do('setEndContentVisible', true)
    })

  api.module('ui-navbar').do('addElement', 'Add element', AddElementControl, { pin: 'visible', api: api })
})
