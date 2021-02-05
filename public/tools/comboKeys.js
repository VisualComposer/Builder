import Combokeys from 'combokeys'
import { getStorage, getService } from 'vc-cake'

const PostData = getService('wordpress-post-data')

export function bindEditorKeys (document) {
  const workspaceStorage = getStorage('workspace')
  const wordpressDataStorage = getStorage('wordpressData')
  const historyStorage = getStorage('history')

  let combokeysInstance = new Combokeys(document)
  combokeysInstance.bind([ 'command+z', 'ctrl+z' ], (e) => {
    e.preventDefault()
    historyStorage.state('canUndo').get() && historyStorage.trigger('undo')
    return false
  })
  combokeysInstance.bind([ 'command+shift+z', 'ctrl+shift+z' ], (e) => {
    e.preventDefault()
    historyStorage.state('canRedo').get() && historyStorage.trigger('redo')
    return false
  })
  combokeysInstance.bind('shift+a', (e) => {
    e.preventDefault()
    let settings = workspaceStorage.state('settings').get()
    if (settings && settings.action === 'add') {
      workspaceStorage.state('settings').set(false)
    } else {
      workspaceStorage.trigger('add')
    }
  })
  combokeysInstance.bind('shift+t', (e) => {
    e.preventDefault()
    let settings = workspaceStorage.state('content').get()
    if (settings === 'treeView') {
      workspaceStorage.state('content').set(false)
    } else {
      workspaceStorage.state('content').set('treeView')
    }
  })
  combokeysInstance.bind([ 'command+s', 'ctrl+s' ], (e) => {
    e.preventDefault()
    if (PostData.canPublish()) {
      wordpressDataStorage.trigger('save', {
        options: {}
      }, 'postSaveControl')
    }
    return false
  })
  combokeysInstance.bind([ 'command+shift+p', 'ctrl+shift+p' ], () => {
    workspaceStorage.state('shortcutPreview').set(true)
    return false
  })
  combokeysInstance.bind('esc', (e) => {
    e.preventDefault()
    workspaceStorage.state('settings').set(false)
  }, 'keyup')
  combokeysInstance.bind('shift+s', (e) => {
    e.preventDefault()
    workspaceStorage.state('content').set('settings')
    workspaceStorage.state('settings').set({ action: 'settings' })
  })
}
