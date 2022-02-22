import React, { useState, useEffect, useRef } from 'react'
import { getStorage, getService } from 'vc-cake'
import Control from './control'
import ControlAction from './controlAction'
import CenterControls from './centerControls'
import { ControlHelpers } from './controlHelpers'

const layoutStorage = getStorage('layout')
const iframe = document.getElementById('vcv-editor-iframe')
const dataManager = getService('dataManager')

const getContainerPosition = (data, iframeDocument, controlsContainer) => {
  if (!controlsContainer.current) {
    return false
  }
  const contentElement = iframeDocument.querySelector(`[data-vcv-element="${data.vcElementId}"]:not([data-vcv-interact-with-controls="false"])`)
  const elementRect = contentElement.getBoundingClientRect()
  const controls = controlsContainer.current.firstElementChild
  let controlsHeight = 0
  if (controls) {
    controlsHeight = controls.getBoundingClientRect().height
  }
  const position = {}
  // set sticky controls
  position.top = elementRect.top
  if (position.top - controlsHeight < 0) {
    controlsContainer.current.classList.add('vcv-ui-controls-o-inset')
    position.top = controlsHeight
  } else {
    controlsContainer.current.classList.remove('vcv-ui-controls-o-inset')
  }
  position.left = elementRect.left
  if (iframe.tagName.toLowerCase() !== 'iframe') {
    const iframeRect = iframe.getBoundingClientRect()
    position.top -= iframeRect.top
    position.left -= iframeRect.left
  }
  if (position.left < 0) {
    position.left = 0
  }

  position.width = elementRect.width
  position.height = elementRect.height
  position.realTop = elementRect.top

  return position
}

const getControlsPosition = (data, iframeDocument, controlsContainer) => {
  if (!controlsContainer.current) {
    return false
  }
  const contentElement = iframeDocument.querySelector(`[data-vcv-element="${data.vcElementId}"]:not([data-vcv-interact-with-controls="false"])`)
  const elementRect = contentElement.getBoundingClientRect()
  const controlsList = controlsContainer.current.querySelector('.vcv-ui-outline-controls')
  const controlsListPos = controlsList.getBoundingClientRect()
  const iframeRect = iframe.getBoundingClientRect()
  return {
    isControlsRight: elementRect.left + controlsListPos.width > iframeRect.width,
    controlsListWidth: controlsListPos.width
  }
}

const getVisibleControls = (elementIds, controls) => {
  controls = controls.current
  if (!controls) {
    return false
  }
  const controlsRect = controls.getBoundingClientRect()
  const controlsDropdown = controls.querySelector('.vcv-ui-outline-control-dropdown')
  if (!controlsDropdown) {
    return false
  }
  const controlWidth = controlsDropdown.getBoundingClientRect().width
  const iframeRect = iframe.getBoundingClientRect()
  const isWider = iframeRect.width - controlsRect.width < controlWidth
  if (isWider) {
    const difference = Math.abs(iframeRect.width - controlsRect.width)
    const elementsOverlap = Math.ceil(difference / controlWidth)
    elementIds.splice(elementIds.length - elementsOverlap)
    return elementIds
  }

  return false
}

function ControlItems (props) {
  const { data, visibleControls } = props
  const { vcvDraggableIds, vcvEditableElements } = data
  const controls = []
  const allControls = [...vcvEditableElements]
  const iterableControls = visibleControls || allControls
  const copiedControls = [...iterableControls]
  const localizations = dataManager.get('localizations')
  const firstElement = ControlHelpers.getVcElement(copiedControls[0])
  if (firstElement && firstElement.containerFor().length < 1) {
    copiedControls.splice(0, 1)
    allControls.splice(0, 1)
  }
  copiedControls.forEach((id, i) => {
    if (i === copiedControls.length - 1 && visibleControls) {
      const treeViewText = localizations ? localizations.treeView : 'Tree View'
      const options = {
        title: treeViewText,
        icon: 'vcv-ui-icon-layers',
        classes: 'vcv-ui-outline-control-more',
        data: {
          vcControlEvent: 'treeView'
        }
      }
      controls.push(<ControlAction id={id} options={options} key={`element-control-tree-view-${id}`} />)
    } else {
      controls.push(<Control id={id} key={`element-control-${id}`} isDraggable={vcvDraggableIds.includes(id)} />)
    }
    if (i < allControls.length - 1) {
      controls.push(
        <i className='vcv-ui-outline-control-separator vcv-ui-icon vcv-ui-icon-arrow-right' key={`element-delimiter-${id}-${i}`} />)
    }
  })

  return controls.reverse()
}

export default function Controls (props) {
  const controlsContainer = useRef()
  const controls = useRef()
  const { vcvEditableElements } = props.data
  const [containerPos, setContainerPos] = useState(getContainerPosition(props.data, props.iframeDocument, controlsContainer))
  const [controlsPos, setControlsPos] = useState(getControlsPosition(props.data, props.iframeDocument, controlsContainer))
  const [visibleControls, setVisibleControls] = useState(false)

  useEffect(() => {
    if (!containerPos) {
      setContainerPos(getContainerPosition(props.data, props.iframeDocument, controlsContainer))
    }
    setControlsPos(getControlsPosition(props.data, props.iframeDocument, controlsContainer))
    if (!visibleControls) {
      setVisibleControls(getVisibleControls(vcvEditableElements, controls))
    }
  }, [])

  const handleMouseEnter = () => {
    layoutStorage.state('interactWithControls').set({
      type: 'mouseEnterContainer',
      vcElementId: props.data.vcElementId
    })
  }

  const handleMouseLeave = (e) => {
    // Check if mouse is leaving from container
    // Don't call if mouse leaving from dropdown (still needs to show controls)
    if (!e.target.closest('.vcv-ui-outline-control-dropdown-content')) {
      layoutStorage.state('interactWithControls').set({
        type: 'mouseLeaveContainer',
        vcElementId: props.data.vcElementId
      })
    }
  }

  let styles = {}
  if (containerPos) {
    styles = {
      top: `${containerPos.top}px`,
      left: `${containerPos.left}px`,
      width: `${containerPos.width}px`
    }
  }

  let containerClasses = [
    'vcv-ui-outline-controls-container',
    controlsPos.isControlsRight ? 'vcv-ui-controls-o-controls-right' : ''
  ]

  containerClasses = containerClasses.join(' ')

  let centerControls = null
  const firstElement = ControlHelpers.getVcElement(vcvEditableElements[0])
  if (firstElement && firstElement.containerFor().length < 1) {
    centerControls = (
      <CenterControls
        id={vcvEditableElements[0]}
        containerPos={containerPos}
        controlsListWidth={controlsPos.controlsListWidth}
      />
    )
  }

  return (
    <>
      <div className={containerClasses} ref={controlsContainer} style={{ ...styles }} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <nav className='vcv-ui-outline-controls' ref={controls}>
          <ControlItems data={props.data} visibleControls={visibleControls} />
        </nav>
      </div>
      {centerControls}
    </>
  )
}
