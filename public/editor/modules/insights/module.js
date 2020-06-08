import { getStorage, getService, env, add } from 'vc-cake'
import { debounce, memoize } from 'lodash'

const insightsStorage = getStorage('insights')
const historyStorage = getStorage('history')
const settingsStorage = getStorage('settings')
const workspaceStorage = getStorage('workspace')
const cookService = getService('cook')

add('insights', () => {
  // VC: Insights
  class InsightsChecks {
    isImagesSizeLarge = false
    localizations = window.VCV_I18N ? window.VCV_I18N() : {}

    checkForHeadings () {
      if (window.VCV_EDITOR_TYPE) {
        return
      }
      const headings = env('iframe').document.body.querySelectorAll('h1')
      let visibleHeadings = 0
      for (let i = 0; i < headings.length; i++) {
        const heading = headings[i]
        if (heading.offsetParent !== null) {
          // we found at least one <h1>, done!
          visibleHeadings++
          break
        }
      }
      if (visibleHeadings === 0) {
        const h1MissingTitle = this.localizations.insightsH1MissingTitle
        const h1MissingDescription = this.localizations.insightsH1MissingDescription
        insightsStorage.trigger('add', {
          state: 'critical',
          type: 'noH1',
          title: h1MissingTitle,
          groupDescription: h1MissingDescription
        })
      } else {
        const insightsH1ExistsTitle = this.localizations.insightsH1ExistsTitle
        const insightsH1ExistsDescription = this.localizations.insightsH1ExistsDescription
        insightsStorage.trigger('add', {
          state: 'success',
          type: 'existH1',
          title: insightsH1ExistsTitle,
          groupDescription: insightsH1ExistsDescription
        })
      }
    }

    checkForEmptyContent () {
      const elements = getStorage('elements').state('document').get() || []
      if (!elements.length) {
        // There are no elements on a page
        insightsStorage.trigger('add', {
          state: 'critical',
          type: 'noElementsOnPage',
          title: this.localizations.insightsNoContentOnPageTitle,
          groupDescription: this.localizations.insightsNoContentOnPageDescription
        })
      }
    }

    checkForAlt () {
      const images = env('iframe').document.body.querySelectorAll('img')
      let allImagesHasAlt = true
      images.forEach((image) => {
        if (!image.alt || image.alt === '') {
          const altMissingTitle = this.localizations.insightsImageAltAttributeMissingTitle
          const description = this.localizations.insightsImageAltAttributeMissingDescription
          const elementId = InsightsChecks.getElementId(image)
          const position = InsightsChecks.getNodePosition(image)
          allImagesHasAlt = false
          insightsStorage.trigger('add', {
            state: 'critical',
            type: `altMissing${position}`,
            thumbnail: image.src,
            title: position !== 'Content' ? `${position}: ${altMissingTitle}` : altMissingTitle,
            groupDescription: description,
            description: 'Alt attribute is empty %s'.replace('%s', elementId ? `(${cookService.getById(elementId).getName()})` : '').trim(),
            elementID: elementId,
            domNode: image
          })
        }
      })
      if (images.length && allImagesHasAlt) {
        const altExistsTitle = this.localizations.insightsImageAltAttributeExistsTitle
        const altExistsDescription = this.localizations.insightsImageAltAttributeExistsDescription
        insightsStorage.trigger('add', {
          state: 'success',
          type: 'altExists',
          title: altExistsTitle,
          groupDescription: altExistsDescription
        })
      }
    }

    checkForImageSize () {
      const images = env('iframe').document.body.querySelectorAll('img')
      const promises = []
      images.forEach((image) => {
        promises.push(this.getImageSize(image.src, image))
      })
      return promises
    }

    checkForBgImageSize () {
      function getBgImgs (doc) {
        const srcChecker = /url\(\s*?['"]?\s*?(\S+?)\s*?["']?\s*?\)/i
        return Array.from(
          Array.from(doc.querySelectorAll('*')).reduce((collection, node) => {
            const prop = window.getComputedStyle(node, null)
              .getPropertyValue('background-image')
            const match = srcChecker.exec(prop)
            if (match) {
              collection.add({ src: match[1], domNode: node })
            }
            return collection
          }, new Set())
        )
      }

      const bgImages = getBgImgs(env('iframe').document)
      const promises = []
      bgImages.forEach((data) => {
        promises.push(this.getImageSize(data.src, data.domNode, 'background'))
      })
      return promises
    }

    async checkForImagesSize () {
      const promises = this.checkForImageSize()
      promises.concat(this.checkForBgImageSize())
      await Promise.all(promises)

      if (promises.length && !this.isImagesSizeLarge) {
        const imageSizeProperTitle = this.localizations.insightsImagesSizeProperTitle
        const imageSizeProperDescription = this.localizations.insightsImagesSizeProperDescription
        insightsStorage.trigger('add', {
          state: 'success',
          type: 'imgSizeProper',
          title: imageSizeProperTitle,
          groupDescription: imageSizeProperDescription
        })
      }
    }

    async getImageSize (src, domNode, type = '') {
      const imageSizeBytes = await InsightsChecks.getImageSizeRequest(src)
      if (imageSizeBytes && imageSizeBytes >= 1024 * 1024) {
        const imageSizeBigTitle = type === 'background' ? this.localizations.insightsBgImageSizeBigTitle : this.localizations.insightsImageSizeBigTitle
        let description = this.localizations.insightsImageSizeBigDescription
        const position = InsightsChecks.getNodePosition(domNode)
        const elementId = InsightsChecks.getElementId(domNode)
        const imageSizeInMB = imageSizeBytes / 1024 / 1024
        description = description.replace('%s', '1 MB')
        this.isImagesSizeLarge = true
        insightsStorage.trigger('add', {
          state: 'critical',
          type: `imgSize1MB${position}`,
          thumbnail: src,
          title: position !== 'Content' ? `${position}: ${imageSizeBigTitle}` : imageSizeBigTitle,
          groupDescription: description,
          description: 'Image size is' + ` ${imageSizeInMB.toFixed(2)} MB`,
          elementID: elementId,
          domNode: domNode
        })
      } else if (imageSizeBytes && imageSizeBytes >= 500 * 1024) {
        const imageSizeBigTitle = type === 'background' ? this.localizations.insightsBgImageSizeBigTitle : this.localizations.insightsImageSizeBigTitle
        let description = this.localizations.insightsImageSizeBigDescription
        const position = InsightsChecks.getNodePosition(domNode)
        const elementId = InsightsChecks.getElementId(domNode)
        description = description.replace('%s', '500 KB')
        this.isImagesSizeLarge = true
        insightsStorage.trigger('add', {
          state: 'warning',
          type: `imgSize500KB${position}`,
          thumbnail: src,
          title: position !== 'Content' ? `${position}: ${imageSizeBigTitle}` : imageSizeBigTitle,
          groupDescription: description,
          description: 'Image size is' + ` ${parseInt(imageSizeBytes / 1024)} KB`,
          elementID: elementId,
          domNode: domNode
        })
      }
    }

    static getImageSizeRequest = memoize((imageUrl) => {
      return new Promise((resolve, reject) => {
        const xhr = new window.XMLHttpRequest()
        xhr.open('HEAD', imageUrl, true)
        xhr.onload = function () {
          if (!(this.status >= 200 && this.status < 300)) {
            reject(new Error(`Wrong network status received: ${this.status} ${imageUrl}`))
          }
        }
        xhr.onreadystatechange = function () {
          if (xhr.readyState === 4 && xhr.status === 200) {
            resolve(xhr.getResponseHeader('Content-Length'))
          }
        }
        xhr.onerror = function (error) {
          reject(new Error(`Wrong network response received:${error}`))
        }
        xhr.send(null)
      })
    })

    static getElementId (domNode) {
      if (domNode.hasAttribute('data-vcv-element')) {
        return domNode.getAttribute('data-vcv-element')
      } else {
        const closestParent = domNode.closest('[data-vcv-element]')
        return closestParent ? closestParent.getAttribute('data-vcv-element') : false
      }
    }

    static getNodePosition (domNode) {
      const contentRoot = env('iframe').document.getElementById('vcv-editor')
      const documentPosition = domNode.compareDocumentPosition(contentRoot)
      if (documentPosition & window.Node.DOCUMENT_POSITION_CONTAINS) {
        return 'Content'
      } else if (documentPosition & window.Node.DOCUMENT_POSITION_FOLLOWING) {
        // Left Sidebar
        return domNode.closest('[data-vcv-layout-zone="sidebar"]') ? 'Left Sidebar' : 'Header'
      } else if (documentPosition & window.Node.DOCUMENT_POSITION_PRECEDING) {
        // Right Sidebar
        return domNode.closest('[data-vcv-layout-zone="sidebar"]') ? 'Right Sidebar' : 'Footer'
      }
    }
  }

  if (env('VCV_FT_INSIGHTS')) {
    const insightsStorageInstance = new InsightsChecks()
    const runChecksCallback = debounce(() => {
      // clear previous <Insights>
      insightsStorage.trigger('reset')
      insightsStorageInstance.isImagesSizeLarge = false

      // Do all checks
      insightsStorageInstance.checkForHeadings()
      insightsStorageInstance.checkForAlt()
      insightsStorageInstance.checkForImagesSize()
      insightsStorageInstance.checkForEmptyContent()
    }, 5000)
    historyStorage.on('init add undo redo', runChecksCallback)
    settingsStorage.state('pageTitleDisabled').onChange(runChecksCallback)
    workspaceStorage.state('iframe').onChange(({ type }) => {
      if (type === 'loaded') {
        runChecksCallback()
      }
    })
  }
})
