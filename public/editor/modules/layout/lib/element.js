import vcCake from 'vc-cake'
import React from 'react'
import ReactDOM from 'react-dom'
import ContentControls from 'public/components/layoutHelpers/contentControls/component'
import ColumnResizer from 'public/components/columnResizer/columnResizer'
import { isEqual, defer } from 'lodash'
import PropTypes from 'prop-types'

const elementsStorage = vcCake.getStorage('elements')
const assetsStorage = vcCake.getStorage('assets')
const cook = vcCake.getService('cook')
const DocumentData = vcCake.getService('document')

const {
  updateDynamicComments,
  cleanComments
} = cook.dynamicFields

export default class Element extends React.Component {
  static propTypes = {
    element: PropTypes.object.isRequired,
    api: PropTypes.object.isRequired
  }

  constructor (props) {
    super(props)
    this.dataUpdate = this.dataUpdate.bind(this)
    this.cssJobsUpdate = this.cssJobsUpdate.bind(this)
    this.elementComponentTransformation = this.elementComponentTransformation.bind(this)
    this.getEditorProps = this.getEditorProps.bind(this)
    this.elementComponentRef = React.createRef()
    this.state = {
      element: props.element,
      cssBuildingProcess: true,
      isRendered: false,
      currentContent: null
    }
  }

  /* eslint-disable */
  UNSAFE_componentWillReceiveProps (nextProps) {
    if (!isEqual(this.state.element, nextProps.element)) {
      assetsStorage.trigger('updateElement', this.state.element.id)
    }
    this.setState({ element: nextProps.element })
  }
  /* eslint-enable */

  componentDidMount () {
    this.props.api.notify('element:mount', this.state.element.id)
    elementsStorage.trigger('addRef', this.state.element.id, this.elementComponentRef.current)
    elementsStorage.on(`element:${this.state.element.id}`, this.dataUpdate)
    elementsStorage.on(`element:${this.state.element.id}:assets`, this.cssJobsUpdate)
    elementsStorage.state('elementComponentTransformation').onChange(this.elementComponentTransformation)
    if (this.elementComponentRef && this.elementComponentRef.current) {
      const cookElement = cook.get(this.state.element)
      updateDynamicComments(this.elementComponentRef.current, this.state.element.id, cookElement)
    }
    defer(() => {
      assetsStorage.trigger('addElement', this.state.element.id)
    })
  }

  componentWillUnmount () {
    this.props.api.notify('element:unmount', this.state.element.id)
    elementsStorage.trigger('removeRef', this.state.element.id)
    elementsStorage.off(`element:${this.state.element.id}`, this.dataUpdate)
    elementsStorage.off(`element:${this.state.element.id}:assets`, this.cssJobsUpdate)
    elementsStorage.state('elementComponentTransformation').ignoreChange(this.elementComponentTransformation)
    // Clean everything before/after
    if (!this.elementComponentRef || !this.elementComponentRef.current) {
      return
    }
    const el = ReactDOM.findDOMNode(this.elementComponentRef.current)
    cleanComments(el, this.state.element.id)
  }

  componentDidUpdate () {
    this.props.api.notify('element:didUpdate', this.props.element.id)
    elementsStorage.trigger('addRef', this.state.element.id, this.elementComponentRef.current)
    if (this.elementComponentRef && this.elementComponentRef.current) {
      const cookElement = cook.get(this.state.element)
      updateDynamicComments(this.elementComponentRef.current, this.state.element.id, cookElement)
    }
  }

  dataUpdate (data, source, options) {
    const { disableUpdateAssets, disableUpdateComponent } = options || {}
    if (disableUpdateAssets !== true) {
      assetsStorage.trigger('updateElement', this.state.element.id, options)
    }
    if (disableUpdateComponent !== true) {
      this.setState({ element: data || this.props.element })
    }
  }

  cssJobsUpdate (data) {
    const elementJob = data.elements.find(element => element.id === this.state.element.id)
    if (!elementJob) {
      console.warn('Failed to find element', data, this.state.element)
      return
    }
    if (this.state.cssBuildingProcess !== elementJob.jobs) {
      this.setState({ cssBuildingProcess: elementJob.jobs })
    }
    if (!this.state.cssBuildingProcess && !elementJob.jobs && !this.state.isRendered) {
      this.setState({ isRendered: true })
    }
  }

  elementComponentTransformation (data) {
    if (data && data.transformed) {
      this.props.api.notify('element:didUpdate', this.props.element.id)
    }
  }

  getContent (content) {
    let returnData = null
    const currentElement = cook.get(this.state.element) // optimize
    const elementsList = DocumentData.children(currentElement.get('id')).map((childElement) => {
      const elements = [<Element element={childElement} key={childElement.id} api={this.props.api} />]
      if (childElement.tag === 'column') {
        if (!vcCake.env('VCV_ADDON_ROLE_MANAGER_ENABLED') || window.vcvManageOptions || !this.state.element.metaIsElementLocked) {
          // Calculate columns sizes for initial state of resizer
          let leftColumnSize = childElement.size.defaultSize
          let rightColumnSize
          const columns = DocumentData.children(childElement.parent)
          const rightColumn = columns.find(column => column.order === childElement.order + 1)
          if (rightColumn) {
            rightColumnSize = rightColumn.size.defaultSize
          }
          if (leftColumnSize === 'auto') {
            leftColumnSize = 100 / columns.length
          }
          if (rightColumnSize === 'auto') {
            rightColumnSize = 100 / columns.length
          }
          leftColumnSize = parseFloat(leftColumnSize) / 100
          rightColumnSize = parseFloat(rightColumnSize) / 100
          elements.push(
            <ColumnResizer
              key={`columnResizer-${childElement.id}`} linkedElement={childElement.id}
              api={this.props.api}
              leftColumnSize={leftColumnSize}
              rightColumnSize={rightColumnSize}
            />
          )
        }
      }
      return elements
    })
    const visibleElementsList = DocumentData.children(currentElement.get('id')).filter(childElement => childElement.hidden !== true)
    if (visibleElementsList.length) {
      returnData = elementsList
    } else {
      if (currentElement.containerFor().length > 0) {
        if (vcCake.env('VCV_ADDON_ROLE_MANAGER_ENABLED') && !window.vcvManageOptions && currentElement.get('metaIsElementLocked')) {
          returnData = null
        } else {
          returnData = <ContentControls api={this.props.api} id={currentElement.get('id')} />
        }
      } else {
        returnData = content
      }
    }
    return returnData
  }

  getEditorProps (id, cookElement) {
    if (!cookElement) {
      cookElement = cook.getById(id)
    }
    const editor = {
      'data-vcv-element': id
    }
    if (cookElement.get('metaDisableInteractionInEditor')) {
      editor['data-vcv-element-disable-interaction'] = true
    }
    if (vcCake.env('VCV_ADDON_ROLE_MANAGER_ENABLED') && !window.vcvManageOptions && cookElement.get('metaIsElementLocked')) {
      editor['data-vcv-element-locked'] = true
    }
    return editor
  }

  render () {
    if (this.state.cssBuildingProcess && !this.state.isRendered) {
      return null
    }
    const { api, ...other } = this.props
    const element = this.state.element
    const cookElement = cook.get(element)
    if (!cookElement) {
      return null
    }
    if (element && element.hidden) {
      return null
    }
    const id = cookElement.get('id')
    const ContentComponent = cookElement.getContentComponent()
    if (!ContentComponent) {
      return null
    }
    const editor = this.getEditorProps(id, cookElement)

    return (
      <ContentComponent
        ref={this.elementComponentRef}
        id={id}
        key={'vcvLayoutContentComponent' + id}
        atts={cook.visualizeAttributes(cookElement, api)}
        rawAtts={cookElement.getAll(false)}
        api={api}
        editor={editor}
        getEditorProps={this.getEditorProps}
        {...other}
      >
        {this.getContent()}
      </ContentComponent>
    )
  }
}
