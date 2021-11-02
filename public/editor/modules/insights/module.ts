// @ts-ignore
import {getStorage, env, add} from 'vc-cake'
import {debounce} from 'lodash'
import InsightsChecks from './lib/InsightsChecks'

const insightsStorage = getStorage('insights')
const historyStorage = getStorage('history')
const settingsStorage = getStorage('settings')
const workspaceStorage = getStorage('workspace')
const elementsStorage = getStorage('elements')

add('insights', () => {
  if (env('VCV_FT_INSIGHTS')) {
    const insightsChecksInstance = new InsightsChecks()
    const runChecksCallback = debounce(() => {
      const iframeDomNode = document.querySelector<HTMLIFrameElement>('.vcv-layout-iframe')
      if (!iframeDomNode || !iframeDomNode.contentWindow) {
        return // editor reload
      }
      // clear previous <Insights>
      insightsStorage.trigger('reset')
      insightsChecksInstance.isImagesSizeLarge = false

      // Do all checks
      const isEmptyContent: boolean = insightsChecksInstance.checkForEmptyContent()
      if (!isEmptyContent) {
        insightsChecksInstance.checkForHeadings()
        insightsChecksInstance.checkForAlt()
        insightsChecksInstance.checkForImagesSize()
        insightsChecksInstance.checkParagraphsLength()
        insightsChecksInstance.checkTitleLength()
        insightsChecksInstance.checkNoIndex()
        insightsChecksInstance.checkPostContentLength()
        insightsChecksInstance.checkForGA()
        insightsChecksInstance.checkLinks()
        insightsChecksInstance.contrast()
      }
    }, 5000)
    historyStorage.on('init add undo redo', runChecksCallback)
    settingsStorage.state('pageTitleDisabled').onChange(runChecksCallback)
    settingsStorage.state('pageTitle').onChange(runChecksCallback)
    workspaceStorage.state('iframe').onChange(({type}: { type: string }) => {
      if (type === 'loaded') {
        runChecksCallback()
      }
    })
    elementsStorage.on('elementsRenderDone', runChecksCallback)
  }
})
