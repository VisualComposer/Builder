import React from 'react'
import vcCake from 'vc-cake'
import striptags from 'striptags'
import PropTypes from 'prop-types'
import lodash from 'lodash'
import TinymceButtonsBuilder from './lib/tinymceButtonsBuilder'

const documentManager = vcCake.getService('document')
const elementsStorage = vcCake.getStorage('elements')
const wordpressDataStorage = vcCake.getStorage('wordpressData')
const shortcodesAssetsStorage = vcCake.getStorage('shortcodeAssets')
const workspaceStorage = vcCake.getStorage('workspace')
const { getShortcodesRegexp } = vcCake.getService('utils')
const dataProcessor = vcCake.getService('dataProcessor')

export default class ContentEditableComponent extends React.Component {
  static spinnerHTML = '<span class="vcv-ui-content-editable-helper-loader vcv-ui-wp-spinner"></span>'

  static propTypes = {
    api: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired,
    fieldKey: PropTypes.string.isRequired,
    paramField: PropTypes.string,
    paramIndex: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string
    ]),
    fieldType: PropTypes.string.isRequired,
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node,
      PropTypes.string
    ]),
    className: PropTypes.string,
    options: PropTypes.object,
    cook: PropTypes.object
  }

  constructor (props) {
    super(props)
    this.iframe = document.querySelector('#vcv-editor-iframe')
    this.layoutHeader = document.querySelector('#vcv-layout-header')
    this.iframeWindow = this.iframe && this.iframe.contentWindow
    this.iframeDocument = this.iframeWindow && this.iframeWindow.document
    this.globalEditor = this.iframeWindow.tinymce
    this.state = {
      contentEditable: false,
      trackMouse: false,
      html: ContentEditableComponent.spinnerHTML,
      realContent: this.props.children,
      mouse: null,
      overlayTimeout: null,
      allowInline: this.props.options.allowInline
    }
    this.handleLayoutModeChange = this.handleLayoutModeChange.bind(this)
    this.handleGlobalClick = this.handleGlobalClick.bind(this)
    this.handleMouseDown = this.handleMouseDown.bind(this)
    this.handleMouseMove = this.handleMouseMove.bind(this)
    this.handleMouseUp = this.handleMouseUp.bind(this)
    this.updateElementData = this.updateElementData.bind(this)
    this.handleMoreButtonClick = this.handleMoreButtonClick.bind(this)
    this.debouncedUpdateHtmlWithServer = lodash.debounce(this.updateHtmlWithServer, 500)
  }

  componentDidMount () {
    this.debouncedUpdateHtmlWithServer(this.props.children)
  }

  componentWillUnmount () {
    if (this.state.contentEditable) {
      this.iframeWindow.removeEventListener('click', this.handleGlobalClick)
      this.layoutHeader.removeEventListener('click', this.handleGlobalClick)
      this.editor && this.editor.remove()
      this.removeOverlay()
    }
    vcCake.setData('vcv:layoutCustomMode', null)
  }

  /* eslint-disable */
  UNSAFE_componentWillReceiveProps (nextProps) {
    if (this.state.contentEditable !== true && nextProps.children !== this.state.realContent) {
      this.setState({ realContent: nextProps.children })
      this.debouncedUpdateHtmlWithServer(nextProps.children)
    }
  }
  /* eslint-enable */

  handleLayoutModeChange (mode) {
    mode !== 'dnd' && this.setState({ contentEditable: mode === 'contentEditable', trackMouse: false })
    if (mode !== 'contentEditable') {
      this.iframeWindow.removeEventListener('click', this.handleGlobalClick)
      this.layoutHeader.removeEventListener('click', this.handleGlobalClick)
      this.editor && this.editor.remove()
      this.removeOverlay()
      // Save data to map to undo/Redo
      const data = documentManager.get(this.props.id)
      const element = this.props.cook.get(data)
      const content = this.editor ? this.state.realContent : this.ref.innerHTML
      let contentToSave = this.getInlineMode() === 'text'
        ? striptags(content) : content
      let fieldPathKey = this.props.fieldKey
      if (this.props.paramField && this.props.paramIndex >= 0) {
        contentToSave = this.getParamsGroupContent(element, contentToSave)
        fieldPathKey = `${this.props.fieldKey}:${this.props.paramIndex}:${this.props.paramField}`
      }

      if (this.props.fieldType === 'htmleditor') {
        const usedGoogleFonts = this.buttonBuilder.getUsedFonts(this.ref)
        if (usedGoogleFonts) {
          const sharedAssetsData = element.get('metaElementAssets')
          let sharedGoogleFonts = sharedAssetsData.googleFonts || {}
          sharedGoogleFonts[ fieldPathKey ] = usedGoogleFonts
          sharedAssetsData.googleFonts = sharedGoogleFonts
          element.set('metaElementAssets', sharedAssetsData)
        }
      }

      element.set(this.props.fieldKey, contentToSave)
      elementsStorage.trigger('update', element.get('id'), element.toJS(), `contentEditable:${element.get('tag')}:${this.props.fieldKey}`, { disableUpdateAssets: true })
      const workspaceStorageState = workspaceStorage.state('settings').get()

      if (workspaceStorageState && workspaceStorageState.action === 'edit') {
        const isSameElement = workspaceStorageState.elementAccessPoint && workspaceStorageState.elementAccessPoint.id === this.props.id
        if (isSameElement) {
          const options = workspaceStorageState.options && workspaceStorageState.options.nestedAttr ? workspaceStorageState.options : ''
          const activeTab = workspaceStorageState.options && workspaceStorageState.options.nestedAttr ? workspaceStorageState.options.activeTab : ''
          window.setTimeout(() => {
            workspaceStorage.trigger('edit', this.props.id, activeTab, options)
          }, 1)
        }
      }
    }
    // add overlay
    if (this.state.contentEditable) {
      this.drawOverlay()
    }
  }

  getParamsGroupContent (element, content) {
    const attrValue = element.get(this.props.fieldKey)
    const newValue = lodash.defaultsDeep({}, attrValue)
    newValue.value[ this.props.paramIndex ][ this.props.paramField ] = content
    return newValue
  }

  drawOverlay () {
    let elementOverlay = this.iframeDocument.querySelector('#vcv-ui-content-overlay')
    if (!elementOverlay) {
      elementOverlay = this.iframeDocument.createElementNS('http://www.w3.org/2000/svg', 'svg')
      elementOverlay.id = 'vcv-ui-content-overlay'
      elementOverlay.classList.add('vcv-ui-content-overlay-container')
      // todo: remove styles from js
      let styles = {
        position: 'fixed',
        top: 0,
        left: 0,
        opacity: 0,
        transition: 'opacity .2s ease-in-out',
        pointerEvents: 'none',
        zIndex: 1900
      }
      for (let prop in styles) {
        elementOverlay.style[ prop ] = styles[ prop ]
      }
      this.iframeDocument.body.appendChild(elementOverlay)
    }

    let overlay = elementOverlay.querySelector('.vcv-ui-content-overlay')
    if (!overlay) {
      overlay = this.iframeDocument.createElementNS('http://www.w3.org/2000/svg', 'path')
      overlay.classList.add('vcv-ui-content-overlay')
      overlay.setAttribute('fill', 'rgba(0, 0, 0, .6)')
      overlay.setAttribute('fill-rule', 'evenodd')
      // todo: remove styles from js
      let styles = {
        pointerEvents: 'all'
      }
      for (let prop in styles) {
        overlay.style[ prop ] = styles[ prop ]
      }
      elementOverlay.appendChild(overlay)
    }

    let overlayShadow = this.iframeDocument.querySelector('#vcv-ui-content-overlay-shadow')
    if (!overlayShadow) {
      overlayShadow = this.iframeDocument.createElement('div')
      overlayShadow.id = 'vcv-ui-content-overlay-shadow'
      overlayShadow.classList.add('vcv-ui-content-overlay-shadow')
      // todo: remove styles from js
      let styles = {
        pointerEvents: 'none',
        boxShadow: 'rgba(0, 0, 0, 0.3) 1px 0 10px 0',
        position: 'fixed'
      }
      for (let prop in styles) {
        overlayShadow.style[ prop ] = styles[ prop ]
      }
      this.iframeDocument.body.appendChild(overlayShadow)
    }

    let data = {
      domElement: this.ref,
      overlayContainer: elementOverlay,
      overlay: overlay,
      overlayShadow: overlayShadow
    }
    this.autoUpdateOverlayPosition(data)
  }

  removeOverlay () {
    this.stopAutoUpdateOverlayPosition()
    let elementOverlay = this.iframeDocument.querySelector('#vcv-ui-content-overlay')
    const clearAfterTransition = () => {
      let elementOverlay = this.iframeDocument.querySelector('#vcv-ui-content-overlay')
      if (elementOverlay) {
        elementOverlay.removeEventListener('transitionend', clearAfterTransition.bind(this))
        elementOverlay.parentNode.removeChild(elementOverlay)
      }
      let elementOverlayShadow = this.iframeDocument.querySelector('#vcv-ui-content-overlay-shadow')
      if (elementOverlayShadow) {
        elementOverlayShadow.parentNode.removeChild(elementOverlayShadow)
      }
    }
    if (elementOverlay) {
      // elementOverlay.addEventListener('transitionend', clearAfterTransition.bind(this))
      clearAfterTransition()
      elementOverlay.style.opacity = 0
    }
  }

  updateOverlayPosition (data) {
    let paddingSize = {
      horizontal: 15,
      vertical: 5
    }
    let domElement = data.domElement
    let overlayContainer = data.overlayContainer
    let overlay = data.overlay
    let overlayShadow = data.overlayShadow

    // set main svg width and height
    overlayContainer.style.width = `${this.iframeWindow.innerWidth}px`
    overlayContainer.style.height = `${this.iframeWindow.innerHeight}px`

    // draw overlay for svg
    let containerSize = `M 0 0 H ${this.iframeWindow.innerWidth} V ${this.iframeWindow.innerHeight} H 0 V 0`
    let elementPos = domElement.getBoundingClientRect()
    let elPos = {
      x: Math.ceil(elementPos.left - paddingSize.horizontal),
      y: Math.ceil(elementPos.top - paddingSize.vertical),
      width: Math.floor(elementPos.width + paddingSize.horizontal * 2),
      height: Math.floor(elementPos.height + paddingSize.vertical * 2)
    }
    let elementSize = `M ${elPos.x} ${elPos.y} h ${elPos.width} v ${elPos.height} h -${elPos.width} z`
    overlay.setAttribute('d', `${containerSize} ${elementSize}`)

    let shadowSize = {
      left: elPos.x,
      top: elPos.y,
      width: elPos.width,
      height: elPos.height
    }
    for (let prop in shadowSize) {
      overlayShadow.style[ prop ] = shadowSize[ prop ] + 'px'
    }
  }

  /**
   * Automatically update controls container position after timeout
   * @param data
   */
  autoUpdateOverlayPosition (data) {
    this.stopAutoUpdateOverlayPosition()
    if (!this.state.overlayTimeout) {
      this.updateOverlayPosition(data)
      data.overlayContainer.style.opacity = 1
      this.setState({
        overlayTimeout: this.iframeWindow.setInterval(this.updateOverlayPosition.bind(this, data), 16)
      })
    }
  }

  /**
   * Stop automatically update controls container position and clear timeout
   */
  stopAutoUpdateOverlayPosition () {
    if (this.state.overlayTimeout) {
      this.iframeWindow.clearInterval(this.state.overlayTimeout)
      this.setState({
        overlayTimeout: null
      })
    }
  }

  editorSetup (options) {
    let editorSettings = {
      target: this.ref,
      menubar: false,
      inline: true,
      plugins: 'lists',
      toolbar: [
        'formatselect | googleFonts | fontWeight | bold italic | numlist bullist | alignleft aligncenter alignright | dotButton'
      ],
      powerpaste_word_import: 'clean',
      powerpaste_html_import: 'clean',
      formats: {
        fontweight: {
          inline: 'span',
          toggle: false,
          styles: { fontWeight: '%value' },
          clear_child_styles: true
        },
        fontstyle: {
          inline: 'span',
          toggle: false,
          styles: { fontStyle: '%value' },
          clear_child_styles: true
        },
        defaultfont: {
          inline: 'span',
          toggle: false,
          styles: { fontFamily: '' },
          clear_child_styles: true
        }
      },
      init_instance_callback: (editor) => {
        editor.on('Change', (e) => {
          this.updateElementData(e.target.getContent())
        })
      },
      setup: (editor) => {
        editor.on('init', () => {
          this.editor = editor
          this.iframeDocument.body.setAttribute('vcv-tinymce-active', true)
          editor.fire('focusin')
          if (options.caretPosition) {
            this.setSelectionRange(this.ref, options.caretPosition)
          }
        })
        editor.on('remove', () => {
          this.iframeDocument.body.removeAttribute('vcv-tinymce-active')
        })
        this.buttonBuilder = new TinymceButtonsBuilder(editor, this.globalEditor, false)

        this.buttonBuilder.addButton('dotButton', {
          icon: 'vcv-ui-icon-more-dots',
          tooltip: 'Open Element in Edit Form',
          onclick: this.handleMoreButtonClick
        })

        this.buttonBuilder.addGoogleFontsDropdown('googleFonts', {
          type: 'listbox',
          text: 'Font Family',
          tooltip: 'Font Family',
          icon: false,
          fixedWidth: true
        })

        this.buttonBuilder.addFontWeightDropdown('fontWeight', {
          type: 'listbox',
          text: 'Font Weight',
          tooltip: 'Font Weight',
          icon: false,
          fixedWidth: true
        })
      }
    }
    if (this.iframeDocument.body && (this.iframeDocument.body.clientWidth < 768)) {
      editorSettings.toolbar = [
        'formatselect | googleFonts | fontWeight',
        'bold italic | numlist bullist | alignleft aligncenter alignright | dotButton'
      ]
    }
    if (this.globalEditor && this.globalEditor.init) {
      this.globalEditor.init(editorSettings)
    } else {
      console.warn('TinyMCE editor is not enqueued')
    }
  }

  handleMoreButtonClick () {
    this.editor && this.editor.remove()
    if (vcCake.getData('vcv:layoutCustomMode') !== null) {
      vcCake.setData('vcv:layoutCustomMode', null)
      window.setTimeout(() => {
        this.handleLayoutModeChange(null)
      }, 0)
    }
    this.debouncedUpdateHtmlWithServer(this.state.realContent)

    workspaceStorage.trigger('edit', this.props.id, '')
  }

  updateHtmlWithServer (content) {
    if (content && (content.match(getShortcodesRegexp()) || content.match(/https?:\/\//) || content.indexOf('<!-- wp') !== -1)) {
      this.ref && (this.ref.innerHTML = ContentEditableComponent.spinnerHTML)
      dataProcessor.appServerRequest({
        'vcv-action': 'elements:ajaxShortcode:adminNonce',
        'vcv-shortcode-string': content,
        'vcv-nonce': window.vcvNonce,
        'vcv-source-id': window.vcvSourceID
      }).then((data) => {
        let iframe = vcCake.env('iframe')
        let _this = this

        try {
          ((function (window, document) {
            let jsonData = JSON.parse(data)
            let { headerContent, shortcodeContent, footerContent } = jsonData
            _this.ref && (_this.ref.innerHTML = '')

            let headerDom = window.jQuery('<div>' + headerContent + '</div>', document)
            headerDom.context = document
            shortcodesAssetsStorage.trigger('add', { type: 'header', ref: _this.ref, domNodes: headerDom.children(), cacheInnerHTML: true, addToDocument: true })

            let shortcodeDom = window.jQuery('<div>' + shortcodeContent + '</div>', document)
            shortcodeDom.context = document
            shortcodesAssetsStorage.trigger('add', { type: 'shortcode', ref: _this.ref, domNodes: shortcodeDom.contents(), addToDocument: true })

            let footerDom = window.jQuery('<div>' + footerContent + '</div>', document)
            footerDom.context = document
            shortcodesAssetsStorage.trigger('add', { type: 'footer', ref: _this.ref, domNodes: footerDom.children(), addToDocument: true, ignoreCache: true })
          })(iframe, iframe.document))
        } catch (e) {
          console.warn('failed to parse json', e)
        }
      })
    } else {
      this.ref && (this.ref.innerHTML = content)
    }
  }

  updateElementData (content) {
    this.setState({ realContent: content })
    wordpressDataStorage.state('status').set({ status: 'changed' })
  }

  handleGlobalClick (e) {
    const $target = window.jQuery(e.target)
    const inlineEditorClick = $target.is('.mce-container') || $target.parents('.mce-container').length || ($target.attr('class') && ($target.attr('class').indexOf('mce-') > -1))
    if (!inlineEditorClick && !$target.is('[data-vcv-element="' + this.props.id + '"]') && !$target.parents('[data-vcv-element="' + this.props.id + '"]').length) {
      this.editor && this.editor.remove()
      if (vcCake.getData('vcv:layoutCustomMode') !== null) {
        vcCake.setData('vcv:layoutCustomMode', null)
        window.setTimeout(() => {
          this.handleLayoutModeChange(null)
        }, 0)
      }
      this.debouncedUpdateHtmlWithServer(this.state.realContent)
    }
  }

  handleMouseMove () {
    if (this.state.trackMouse === true) {
      this.setState({ trackMouse: false, contentEditable: false })
      this.editor && this.editor.remove()
    }
  }

  handleMouseDown () {
    if (this.state.trackMouse === false && this.state.contentEditable === false && this.state.allowInline) {
      this.setState({ trackMouse: true, contentEditable: true })
    }
  }

  handleMouseUp (e) {
    if (this.state.trackMouse === true) {
      const caretPosition = this.getCaretPosition(e.currentTarget)
      const isHtmlEditor = this.props.fieldType === 'htmleditor'
      if (isHtmlEditor) {
        this.editorSetup({ caretPosition })
      }
      const layoutCustomMode = vcCake.getData('vcv:layoutCustomMode') && vcCake.getData('vcv:layoutCustomMode').mode
      if (layoutCustomMode && layoutCustomMode !== 'contentEditable') {
        const data = {
          mode: 'contentEditable',
          options: {}
        }
        vcCake.setData('vcv:layoutCustomMode', data)
        this.handleLayoutModeChange('contentEditable')
      }
      this.iframeWindow.addEventListener('click', this.handleGlobalClick)
      this.layoutHeader.addEventListener('click', this.handleGlobalClick)
      this.ref && (this.ref.innerHTML = this.state.realContent)

      if (!isHtmlEditor) {
        this.setSelectionRange(this.ref, caretPosition)
      }
    }
  }

  getInlineMode () {
    let inlineMode = this.props.options && this.props.options.inlineMode
    if (this.props.paramField && this.props.paramIndex >= 0) {
      const { paramField } = this.props
      inlineMode = this.props.options.settings[ paramField ].options && this.props.options.settings[ paramField ].options.inlineMode
    }
    return inlineMode
  }

  getCaretPosition (element) {
    const doc = element.ownerDocument || element.document
    const win = doc.defaultView || doc.parentWindow
    let caretOffset = 0
    if (typeof win.getSelection !== 'undefined') {
      const sel = win.getSelection()
      if (sel.rangeCount) {
        const range = sel.getRangeAt(0)
        let preCaretRange = range.cloneRange()
        preCaretRange.selectNodeContents(element)
        preCaretRange.setEnd(range.endContainer, range.endOffset)
        const preCaretRangeString = preCaretRange.toString()
        const matchNewlines = preCaretRangeString.match(/(\r\n\t|\n|\r\t)/gm)
        caretOffset = preCaretRangeString.length
        if (matchNewlines && matchNewlines.length) {
          caretOffset -= matchNewlines.length
        }
      }
    }
    return caretOffset
  }

  setSelectionRange (element, start, end = start) {
    const doc = element.ownerDocument || element.document
    const win = doc.defaultView || doc.parentWindow
    if (doc.createRange && win.getSelection) {
      const range = doc.createRange()
      range.selectNodeContents(element)
      let textNodes = this.getTextNodesIn(element)
      let foundStart = false
      let charCount = 0
      let endCharCount = null

      for (let i = 0; i < textNodes.length; i++) {
        let textNode = textNodes[ i ]
        endCharCount = charCount + textNode.length
        if (!foundStart && start >= charCount && (start < endCharCount || (start === endCharCount && i <= textNodes.length))) {
          range.setStart(textNode, start - charCount)
          foundStart = true
        }
        if (foundStart && end <= endCharCount) {
          range.setEnd(textNode, end - charCount)
          break
        }
        charCount = endCharCount
      }

      let sel = win.getSelection()
      sel.removeAllRanges()
      sel.addRange(range)
    }
  }

  getTextNodesIn (node) {
    let textNodes = []
    if (node.nodeType === 3) {
      textNodes.push(node)
    } else {
      const children = node.childNodes
      for (let i = 0, len = children.length; i < len; ++i) {
        textNodes.push.apply(textNodes, this.getTextNodesIn(children[ i ]))
      }
    }
    return textNodes
  }

  render () {
    let CustomTag = this.props.fieldType === 'htmleditor' ? 'div' : 'span'
    const props = {
      className: this.props.className ? this.props.className + ' vcvhelper' : 'vcvhelper',
      contentEditable: this.state.contentEditable,
      onMouseDown: this.handleMouseDown,
      onMouseMove: this.handleMouseMove,
      onMouseUp: this.handleMouseUp,
      'data-vcvs-html': this.state.realContent,
      'data-vcv-content-editable-inline-mode': this.getInlineMode() || 'html'
    }
    props.ref = (ref) => { this.ref = ref }

    return <CustomTag {...props} />
  }
}
