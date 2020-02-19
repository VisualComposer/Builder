import { getStorage, getService } from 'vc-cake'
import React from 'react'
import TreeViewElement from './lib/treeViewElement'
import TreeViewDndManager from './lib/treeViewDndManager'
import Scrollbar from '../../scrollbar/scrollbar.js'
import lodash from 'lodash'
import PropTypes from 'prop-types'
import classNames from 'classnames'

const elementsStorage = getStorage('elements')
const workspaceStorage = getStorage('workspace')
const layoutStorage = getStorage('layout')
const workspaceSettings = getStorage('workspace').state('settings')

const documentManager = getService('document')
const cook = getService('cook')

export default class TreeViewLayout extends React.Component {
  static propTypes = {
    scrollValue: PropTypes.any,
    treeViewId: PropTypes.string,
    visible: PropTypes.bool,
    isAttribute: PropTypes.bool,
    element: PropTypes.object
  }

  layoutContainer = null
  scrollbar = null
  scrollTimeout = 0

  constructor (props) {
    super(props)
    this.updateElementsData = lodash.debounce(this.updateElementsData.bind(this), 250)
    this.handleScrollToElement = this.handleScrollToElement.bind(this)
    this.interactWithContent = this.interactWithContent.bind(this)
    this.handleAddElement = this.handleAddElement.bind(this)
    this.handleAddTemplate = this.handleAddTemplate.bind(this)
    this.checkShowOutlineCallback = this.checkShowOutlineCallback.bind(this)
    this.handleElementMount = this.handleElementMount.bind(this)
    this.handleElementUnmount = this.handleElementUnmount.bind(this)
    this.scrollBarMounted = this.scrollBarMounted.bind(this)
    this.getScrollbarContent = this.getScrollbarContent.bind(this)
    this.dnd = new TreeViewDndManager()
    this.state = {
      data: [],
      selectedItem: null,
      outlineElementId: false
    }
  }

  componentDidUpdate (prevProps) {
    if (this.props.visible !== prevProps.visible) {
      const data = this.props.isAttribute ? documentManager.children(this.props.element.get('id')) : documentManager.children(false)
      this.setState({
        data: data
      })
    }
  }

  updateElementsData (data, singleElement = false) {
    let newData
    if (singleElement && singleElement === 'singleElement') {
      const currentData = this.state.data
      const newDataIndex = currentData.findIndex(element => element.id === data.id)
      currentData[newDataIndex] = data
      newData = currentData
    } else {
      newData = data
    }

    if (this.props.isAttribute) {
      newData = documentManager.children(this.props.element.get('id'))
    }
    this.setState({ data: newData })
  }

  componentDidMount () {
    elementsStorage.state('document').onChange(this.updateElementsData)
    layoutStorage.state('userInteractWith').onChange(this.interactWithContent)
    const data = this.props.isAttribute ? documentManager.children(this.props.element.get('id')) : documentManager.children(false)
    if (this.props.isAttribute) {
      elementsStorage.on(`element:${this.props.element.get('id')}`, this.updateElementsData)
    }
    this.setState({
      header: document.querySelector('.vcv-ui-navbar-container'),
      data: data
    })
    this.scrollTimeout = setTimeout(() => {
      this.handleScrollToElement(this.props.treeViewId)
    }, 1)
    workspaceStorage.state('content').onChange(this.onContentChangeHandleScroll)
  }

  onContentChangeHandleScroll = (value, treeViewId) => {
    const timeout = setTimeout(() => {
      treeViewId && this.handleScrollToElement(treeViewId)
      clearTimeout(timeout)
    }, 1)
  }

  componentWillUnmount () {
    this.updateElementsData.cancel()
    elementsStorage.state('document').ignoreChange(this.updateElementsData)
    layoutStorage.state('userInteractWith').ignoreChange(this.interactWithContent)
    workspaceStorage.state('content').ignoreChange(this.onContentChangeHandleScroll)
    if (this.scrollTimeout) {
      window.clearTimeout(this.scrollTimeout)
      this.scrollTimeout = 0
    }
    if (this.props.isAttribute) {
      elementsStorage.off(`element:${this.props.element.get('id')}`, this.updateElementsData)
    }
  }

  interactWithContent (id = false) {
    this.setState({ outlineElementId: id })
  }

  expandTree (element) {
    if (!element.classList.contains('vcv-ui-tree-layout')) {
      if (element.classList.contains('vcv-ui-tree-layout-node-child') && !element.classList.contains('vcv-ui-tree-layout-node-expand')) {
        element.querySelector('.vcv-ui-tree-layout-node-expand-trigger').click()
      }
      this.expandTree(element.parentElement)
    }
  }

  getExistingParent (id) {
    const parentId = documentManager.get(id).parent
    const parentElement = this.layoutContainer.querySelector(`[data-vcv-element="${parentId}"]`)

    if (parentElement) {
      return parentElement
    } else {
      return this.getExistingParent(parentId)
    }
  }

  scrollBarMounted (scrollbar) {
    this.scrollbar = scrollbar
    this.handleScrollToElement(this.props.treeViewId)
  }

  handleScrollToElement (scrollToElement) {
    if (scrollToElement && this.scrollbar && this.layoutContainer) {
      const container = this.layoutContainer.querySelector('.vcv-ui-tree-layout').getBoundingClientRect()
      let target = this.layoutContainer.querySelector(`[data-vcv-element="${scrollToElement}"]`)
      if (!target) {
        this.expandTree(this.getExistingParent(scrollToElement))
        target = this.layoutContainer.querySelector(`[data-vcv-element="${scrollToElement}"]`)
      }
      this.expandTree(target)
      const targetTop = target.getBoundingClientRect().top
      const offset = targetTop - container.top
      this.interactWithContent(scrollToElement)
      this.scrollbar.scrollTop(offset)
    }
  }

  checkShowOutlineCallback (id) {
    return this.state.outlineElementId === id
  }

  getElements () {
    let elementsList = []
    if (this.state.data) {
      elementsList = this.state.data.map((element) => {
        return (
          <TreeViewElement
            element={element}
            key={element.id}
            level={1}
            showOutlineCallback={this.checkShowOutlineCallback}
            onMountCallback={this.handleElementMount}
            onUnmountCallback={this.handleElementUnmount}
            scrollValue={this.props.scrollValue}
            isAttribute={this.props.isAttribute}
            updateElementsData={this.updateElementsData}
          />
        )
      }, this)
    }
    return elementsList
  }

  handleElementMount (id) {
    const cookElement = cook.getById(id)
    const isDraggable = cookElement.get('metaIsDraggable')
    if (isDraggable === undefined || isDraggable) {
      let containerSelector = ''
      const topParentId = documentManager.getTopParent(id)
      const isParentDraggable = cook.getById(topParentId).get('metaIsDraggable')
      if (isParentDraggable !== undefined && !isParentDraggable) {
        containerSelector = `[data-vcv-element="${topParentId}"]`
      }

      this.dnd.add(id, this.props.isAttribute, containerSelector)
    }
  }

  handleElementUnmount (id) {
    this.dnd.remove(id, this.props.isAttribute)
  }

  handleAddElement (e) {
    e && e.preventDefault()
    if (this.props.isAttribute) {
      workspaceStorage.trigger('add', this.props.element.get('id'), this.props.element.get('tag'))
    } else {
      workspaceStorage.trigger('add', null)
    }
  }

  handleRemoveAllElements (e) {
    e && e.preventDefault()
    const allElements = documentManager.children(false)
    allElements.forEach((row) => {
      workspaceStorage.trigger('remove', row.id)
    })
  }

  handleAddTemplate (e) {
    e && e.preventDefault()
    workspaceSettings.set({
      action: 'addTemplate',
      element: {},
      tag: '',
      options: {}
    })
  }

  getElementsOutput () {
    const localizations = window.VCV_I18N && window.VCV_I18N()
    const text = localizations ? localizations.emptyTreeView : 'There is no content on your page - start by adding element or template.'

    const elements = this.getElements()
    if (elements.length) {
      return (
        <ul className='vcv-ui-tree-layout'>
          {elements}
        </ul>
      )
    }
    return (
      <div className='vcv-ui-tree-layout-messages'>
        <p className='vcv-ui-tree-layout-message'>
          {text}
        </p>
      </div>
    )
  }

  getScrollbarContent () {
    const localizations = window.VCV_I18N && window.VCV_I18N()
    const addElementText = localizations ? localizations.addElement : 'Add Element'
    const removeAllText = localizations ? localizations.removeAll : 'Remove All'

    return (
      <>
        {this.getElementsOutput()}
        <div className='vcv-ui-tree-layout-actions'>
          <span
            className='vcv-ui-tree-layout-action'
            title={addElementText}
            onClick={this.handleAddElement}
          >
            <span className='vcv-ui-tree-layout-action-content'>
              <i className='vcv-ui-tree-layout-action-icon vcv-ui-icon vcv-ui-icon-add' />
              <span>{addElementText}</span>
            </span>
          </span>
          <span
            className='vcv-ui-tree-layout-action'
            title={removeAllText}
            onClick={this.handleRemoveAllElements}
          >
            <span className='vcv-ui-tree-layout-action-content'>
              <i className='vcv-ui-tree-layout-action-icon vcv-ui-icon vcv-ui-icon-trash' />
              <span>{removeAllText}</span>
            </span>
          </span>
        </div>
      </>
    )
  }

  render () {
    const treeLayoutClasses = classNames({
      'vcv-ui-tree-layout-container': true,
      'vcv-ui-state--hidden': !this.props.visible
    })

    let treeViewContent = ''

    if (!this.props.isAttribute) {
      treeViewContent = (
        <Scrollbar ref={this.scrollBarMounted}>
          {this.getScrollbarContent()}
        </Scrollbar>
      )
    } else {
      treeViewContent = this.getScrollbarContent()
    }

    return (
      <div
        className={treeLayoutClasses}
        ref={(layoutContainer) => { this.layoutContainer = layoutContainer }}
      >
        {treeViewContent}
      </div>
    )
  }
}
