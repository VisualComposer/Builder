import React from 'react'
import ReactDOM from 'react-dom'
import vcCake from 'vc-cake'
import Layout from '../../sources/attributes/rowLayout/Component'

const elementsStorage = vcCake.getStorage('elements')
const layoutStorage = vcCake.getStorage('layout')
let previousLayoutCustomMode = false

export default class ColumnResizer extends React.Component {
  static defaultGridPercentage = [20, 25, 33.33, 50, 66.66, 75]

  static deviceViewports = {
    xs: 0,
    sm: 544,
    md: 768,
    lg: 992,
    xl: 1200
  }

  resizerData = {
    rowId: null,
    rowData: null,
    rowWidth: null,
    helper: null,
    rightColumn: null,
    leftColumn: null,
    bothColumnsWidth: null,
    bothColumnsWidthPx: null,
    columnGap: null,
    mousePosition: null,
    resizerPositions: null,
    snapWidth: 7,
    leftColumnIndex: null
  }

  constructor (props) {
    super(props)
    this.state = {
      dragging: false,
      leftColPercentage: this.props.leftColumnSize,
      rightColPercentage: this.props.rightColumnSize,
      labelPosition: null,
      isVisible: true
    }
    this.handleMouseDown = this.handleMouseDown.bind(this)
    this.handleMouseUp = this.handleMouseUp.bind(this)
    this.handleMouseMove = this.handleMouseMove.bind(this)
    this.handleLayoutCustomModeChange = this.handleLayoutCustomModeChange.bind(this)
  }

  componentDidMount () {
    vcCake.onDataChange('vcv:layoutCustomMode', this.handleLayoutCustomModeChange)
  }

  componentWillUnmount () {
    vcCake.ignoreDataChange('vcv:layoutCustomMode', this.handleLayoutCustomModeChange)
  }

  componentDidUpdate (props, state) {
    const ifameDocument = document.querySelector('#vcv-editor-iframe').contentWindow
    let data = {}
    if (this.state.dragging && !state.dragging) {
      previousLayoutCustomMode = vcCake.getData('vcv:layoutCustomMode') && vcCake.getData('vcv:layoutCustomMode').mode
      data = {
        mode: 'columnResizer',
        options: {}
      }
      vcCake.setData('vcv:layoutCustomMode', data)
      ifameDocument.addEventListener('mousemove', this.handleMouseMove)
      ifameDocument.addEventListener('mouseup', this.handleMouseUp)
      vcCake.setData('vcv:layoutColumnResize', this.resizerData.rowId)
    } else if (!this.state.dragging && state.dragging) {
      const newLayoutMode = previousLayoutCustomMode === 'contentEditable' ? previousLayoutCustomMode : null
      data = {
        mode: newLayoutMode,
        options: {}
      }
      vcCake.setData('vcv:layoutCustomMode', newLayoutMode ? data : null)
      vcCake.setData('vcv:layoutColumnResize', null)
      ifameDocument.removeEventListener('mousemove', this.handleMouseMove)
      ifameDocument.removeEventListener('mouseup', this.handleMouseUp)
    }
  }

  handleLayoutCustomModeChange (data) {
    if (data === 'contentEditable') {
      this.hide()
    } else {
      this.show()
    }
  }

  getRowData (e) {
    const $helper = ReactDOM.findDOMNode(this)
    let $tempRightCol = $helper.nextElementSibling
    let $rightCol = null
    let $leftCol = null

    // Search for next visible column
    while (!$tempRightCol.offsetParent) {
      $tempRightCol = $tempRightCol.nextElementSibling
    }

    let $tempLeftCol = $helper.previousElementSibling

    while (!$tempLeftCol.offsetParent) {
      $tempLeftCol = $tempLeftCol.nextElementSibling
    }

    if ($tempLeftCol.getBoundingClientRect().left > $tempRightCol.getBoundingClientRect().left) {
      $rightCol = $tempLeftCol
      $leftCol = $tempRightCol
    } else {
      $rightCol = $tempRightCol
      $leftCol = $tempLeftCol
    }

    const rightColId = $rightCol ? $rightCol.id.replace('el-', '') : null
    const leftColId = $leftCol ? $leftCol.id.replace('el-', '') : null
    const rowId = vcCake.getService('document').get(rightColId || leftColId).parent
    const rowData = vcCake.getService('document').get(rowId)
    const columnGap = rowData.columnGap ? parseInt(rowData.columnGap) : 0
    const rowWidth = $helper.parentElement.getBoundingClientRect().width + columnGap - parseFloat(window.getComputedStyle($helper.parentElement).paddingLeft) - parseFloat(window.getComputedStyle($helper.parentElement).paddingRight)
    const bothColumnsWidth = ($leftCol.getBoundingClientRect().width + $rightCol.getBoundingClientRect().width + columnGap * 2) / rowWidth
    const bothColumnsWidthPx = $leftCol.getBoundingClientRect().width + $rightCol.getBoundingClientRect().width
    const allColIds = vcCake.getService('document').children(rowId)
    const allColumns = []
    allColIds.forEach((col) => {
      const colElement = $helper.parentElement.querySelector(`#el-${col.id}`)
      if (colElement) {
        allColumns.push(colElement)
      }
    })
    const leftColumnIndex = allColumns.indexOf($leftCol)
    const rightColumnIndex = allColumns.indexOf($rightCol)

    this.resizerData.rowId = rowId
    this.resizerData.rowData = rowData
    this.resizerData.rowWidth = rowWidth
    this.resizerData.helper = $helper
    this.resizerData.rightColumn = $rightCol
    this.resizerData.leftColumn = $leftCol
    this.resizerData.bothColumnsWidth = bothColumnsWidth
    this.resizerData.bothColumnsWidthPx = bothColumnsWidthPx
    this.resizerData.columnGap = columnGap
    this.resizerData.mousePosition = e.clientX
    this.resizerData.leftColumnIndex = leftColumnIndex
    this.resizerData.rightColumnIndex = rightColumnIndex
    this.resizerData.currentDevice = this.getCurrentDevice()
  }

  handleMouseDown (e) {
    if (e.nativeEvent.which === 1) {
      this.getRowData(e)
      this.getResizerPositions(e)
      this.createWrapBlockers()
      this.setResizeLabelsPosition(e)
      const colSizes = this.getResizedColumnsWidth(e)

      this.setState({
        dragging: true,
        leftColPercentage: colSizes.leftCol,
        rightColPercentage: colSizes.rightCol
      })
      layoutStorage.state('resizeColumns').set(true)
    }
  }

  getResizerPositions (e) {
    const positions = []
    const currentResizer = e.currentTarget
    const currentResizerClientRect = currentResizer.getBoundingClientRect()

    let allResizers = document.querySelector('#vcv-editor-iframe').contentWindow.document.querySelectorAll('.vce-column-resizer-handler')
    allResizers = [].slice.call(allResizers)

    const resizerRow = currentResizer.parentElement.parentElement
    // row first and last column position
    let firstInRow, lastInRow
    for (let i = 0; i < resizerRow.childNodes.length; i++) {
      const elementClasses = resizerRow.childNodes[i].classList
      if (elementClasses.contains('vce-col--all-first') || elementClasses.contains('vce-col--' + this.resizerData.currentDevice + '-first')) {
        firstInRow = resizerRow.childNodes[i].getBoundingClientRect()
      }
      if (elementClasses.contains('vce-col--all-last') || elementClasses.contains('vce-col--' + this.resizerData.currentDevice + '-last')) {
        lastInRow = resizerRow.childNodes[i].getBoundingClientRect()
      }
      if (firstInRow && lastInRow) {
        i = resizerRow.childNodes.length
      }
    }
    // get content part position and width relative to window,
    const rowContentWidth = lastInRow.left + lastInRow.width - firstInRow.left + currentResizerClientRect.width
    ColumnResizer.defaultGridPercentage.forEach((percentage) => {
      const position = firstInRow.left - currentResizerClientRect.width / 2 + rowContentWidth * (percentage / 100)
      positions.push((Math.round(position * 100) / 100))

      const leftPosition = this.resizerData.leftColumn.getBoundingClientRect().left - currentResizerClientRect.width / 2 + rowContentWidth * (percentage / 100)
      positions.push((Math.round(leftPosition * 100) / 100))

      const rightColClientRect = this.resizerData.rightColumn.getBoundingClientRect()
      const rightPosition = rightColClientRect.left + rightColClientRect.width + currentResizerClientRect.width / 2 - rowContentWidth * (percentage / 100)
      positions.push((Math.round(rightPosition * 100) / 100))
    })
    // get default grid snap points and add them to positions []
    allResizers.forEach((resizer) => {
      if (resizer !== currentResizer && window.getComputedStyle(resizer.parentElement).getPropertyValue('display') !== 'none') {
        const resizerClientRect = resizer.getBoundingClientRect()
        const position = resizerClientRect.left + resizerClientRect.width / 2
        if (positions.indexOf(position) < 0) {
          positions.push((Math.round(position * 100) / 100))
        }
      }
    })
    this.resizerData.resizerPositions = positions
  }

  handleMouseUp () {
    this.setState({ dragging: false })
    this.removeWrapBlockers()
    this.rebuildRowLayout()
    this.removeTemporaryColStyles()
    layoutStorage.state('resizeColumns').set(false)
  }

  handleMouseMove (e) {
    if (!this.state.dragging) {
      return
    }
    this.renderTemporaryColStyles(e)
    this.setResizeLabelsPosition(e)
  }

  setResizeLabelsPosition (e) {
    const labelPosition = e.clientY - this.resizerData.helper.getBoundingClientRect().top
    this.setState({ labelPosition: labelPosition })
  }

  renderTemporaryColStyles (e) {
    const columnGap = this.resizerData.columnGap
    const colSizes = this.getResizedColumnsWidth(e)
    let resizerPercentages = colSizes.leftCol
    let rightResizerPercentages = colSizes.rightCol

    let equalSpace = columnGap * (resizerPercentages * 100 - 1)
    let rightEqualSpace = columnGap * (rightResizerPercentages * 100 - 1)
    const gapSpace = columnGap * (100 - 1)

    const rowWidth = this.resizerData.rowWidth - this.resizerData.columnGap

    const mouseLeftPosition = e.clientX
    this.resizerData.resizerPositions.forEach((position) => {
      const minPosition = Math.round(position) - this.resizerData.snapWidth
      const maxPosition = Math.round(position) + this.resizerData.snapWidth
      if (mouseLeftPosition > minPosition && mouseLeftPosition < maxPosition) {
        const fullRowWidth = this.resizerData.rowWidth
        const resizerWidth = position - this.resizerData.leftColumn.getBoundingClientRect().left + this.resizerData.columnGap / 2
        const leftCol = resizerWidth / fullRowWidth

        resizerPercentages = leftCol
        rightResizerPercentages = this.resizerData.bothColumnsWidth - leftCol
        equalSpace = columnGap * (resizerPercentages * 100 - 1)
        rightEqualSpace = columnGap * (rightResizerPercentages * 100 - 1)
      }
    })

    const leftWidth = `calc((100% - ${gapSpace}px) * ${resizerPercentages} + ${equalSpace}px)`
    const rightWidth = `calc((100% - ${gapSpace}px) * ${rightResizerPercentages} + ${rightEqualSpace}px)`

    if (this.resizerData.mousePosition > e.clientX) {
      const left = (rowWidth - gapSpace) * resizerPercentages + equalSpace
      const right = this.resizerData.rightColumn.getBoundingClientRect().width

      if ((left + right) < this.resizerData.bothColumnsWidthPx) {
        this.resizerData.leftColumn.style.flexBasis = leftWidth
        this.resizerData.leftColumn.style.maxWidth = leftWidth

        this.resizerData.rightColumn.style.flexBasis = this.resizerData.bothColumnsWidthPx - this.resizerData.leftColumn.getBoundingClientRect().width + 'px'
        this.resizerData.rightColumn.style.maxWidth = this.resizerData.bothColumnsWidthPx - this.resizerData.leftColumn.getBoundingClientRect().width + 'px'
      }
    } else if (this.resizerData.mousePosition < e.clientX) {
      const left = this.resizerData.leftColumn.getBoundingClientRect().width
      const right = (rowWidth - gapSpace) * rightResizerPercentages + rightEqualSpace
      if ((left + right) < this.resizerData.bothColumnsWidthPx) {
        this.resizerData.rightColumn.style.flexBasis = rightWidth
        this.resizerData.rightColumn.style.maxWidth = rightWidth

        this.resizerData.leftColumn.style.flexBasis = this.resizerData.bothColumnsWidthPx - this.resizerData.rightColumn.getBoundingClientRect().width + 'px'
        this.resizerData.leftColumn.style.maxWidth = this.resizerData.bothColumnsWidthPx - this.resizerData.rightColumn.getBoundingClientRect().width + 'px'
      }
    }

    const columnCalc = (100 * columnGap) + (rowWidth - gapSpace)
    const leftCol = columnGap + this.resizerData.leftColumn.getBoundingClientRect().width
    const rightCol = columnGap + this.resizerData.rightColumn.getBoundingClientRect().width
    const leftPercentage = leftCol / columnCalc
    const rightPercentage = rightCol / columnCalc

    this.setLabelPercentages(leftPercentage, rightPercentage)

    this.resizerData.mousePosition = e.clientX
  }

  removeTemporaryColStyles () {
    this.resizerData.leftColumn.removeAttribute('style')
    this.resizerData.rightColumn.removeAttribute('style')
  }

  createWrapBlockers () {
    const $resizer = this.resizerData.helper
    const firstRowElement = this.getSibling($resizer, 'prev', 'vce-col--all-first') || this.getSibling($resizer, 'prev', 'vce-col--' + this.resizerData.currentDevice + '-first')
    const blockElement = document.createElement('div')
    blockElement.className = 'vce-column-wrap-blocker'

    if (firstRowElement) {
      firstRowElement.parentNode.insertBefore(blockElement, firstRowElement)
    }
  }

  removeWrapBlockers () {
    const blocker = this.resizerData.helper.parentNode.querySelector('.vce-column-wrap-blocker')
    blocker.parentNode.removeChild(blocker)
  }

  getSibling (element, direction, className) {
    let sibling = null
    if (direction === 'prev') {
      direction = 'previousElementSibling'
    } else if (direction === 'next') {
      direction = 'nextElementSibling'
    } else {
      return null
    }

    const getElementSibling = (element, dir) => {
      const siblingElement = element[dir]
      if (!siblingElement) {
        return null
      }
      const siblingClasses = element[dir].className.split(' ')
      if (siblingClasses.indexOf(className) > -1) {
        sibling = element[dir]
      } else {
        getElementSibling(element[dir], dir)
      }
    }
    getElementSibling(element, direction)
    return sibling
  }

  setLabelPercentages (left, right) {
    this.setState({
      leftColPercentage: left,
      rightColPercentage: right
    })
  }

  getResizedColumnsWidth (e, leftColumn) {
    const rowWidth = this.resizerData.rowWidth
    const resizerWidth = e.clientX - (leftColumn || this.resizerData.leftColumn.getBoundingClientRect().left) + this.resizerData.columnGap / 2
    const leftCol = resizerWidth / rowWidth
    return { leftCol: leftCol, rightCol: this.resizerData.bothColumnsWidth - leftCol }
  }

  rebuildRowLayout () {
    const parentRow = vcCake.getService('document').get(this.resizerData.rowId)
    const layoutData = this.getLayoutData(this.resizerData.rowId)

    let leftSize = (Math.round(this.state.leftColPercentage * 10000) / 10000) * 100
    leftSize = leftSize.toString().slice(0, leftSize.toString().indexOf('.') + 3)
    let rightSize = (Math.round(this.state.rightColPercentage * 10000) / 10000) * 100
    rightSize = rightSize.toString().slice(0, rightSize.toString().indexOf('.') + 3)

    const device = Object.prototype.hasOwnProperty.call(layoutData, 'all') ? 'all' : this.resizerData.currentDevice

    layoutData[device][this.resizerData.leftColumnIndex] = `${leftSize}%`
    layoutData[device][this.resizerData.rightColumnIndex] = `${rightSize}%`
    parentRow.layout.layoutData = layoutData
    elementsStorage.trigger('update', parentRow.id, parentRow, '', { changedAttributeType: 'rowLayout' })
  }

  getCurrentDevice () {
    const iframeDocument = document.querySelector('#vcv-editor-iframe').contentWindow
    const windowWidth = Math.max(iframeDocument.document.documentElement.clientWidth, iframeDocument.innerWidth || 0)
    let currentDevice = null

    Object.keys(ColumnResizer.deviceViewports).forEach((device) => {
      const viewport = ColumnResizer.deviceViewports[device]

      if (windowWidth >= viewport) {
        currentDevice = device
      }
    })

    return currentDevice
  }

  getLayoutData (rowId) {
    const deviceLayoutData = {}
    const rowChildren = vcCake.getService('document').children(rowId)

    // Get layout for 'all'
    rowChildren.forEach((element) => {
      if (element.size.all) {
        if (!Object.prototype.hasOwnProperty.call(deviceLayoutData, 'all')) {
          deviceLayoutData.all = []
        }
        deviceLayoutData.all.push(element.size.all)
      }
    })

    if (!Object.prototype.hasOwnProperty.call(deviceLayoutData, 'all')) { // Get layout for devices, if 'all' is not defined
      Layout.devices.forEach((device) => {
        rowChildren.forEach((element) => {
          if (element.size[device]) {
            if (!Object.prototype.hasOwnProperty.call(deviceLayoutData, device)) {
              deviceLayoutData[device] = []
            }
            deviceLayoutData[device].push(element.size[device])
          }
        })
      })
    }

    return deviceLayoutData
  }

  hide () {
    this.setState({ isVisible: false })
  }

  show () {
    this.setState({ isVisible: true })
  }

  render () {
    if (!this.state.isVisible) {
      return null
    }

    return (
      <div className='vcvhelper vce-column-resizer'>
        <div className='vce-column-resizer-handler' data-vcv-linked-element={this.props.linkedElement} onMouseDown={this.handleMouseDown} ref='resizerHandler'>
          <div className='vce-column-resizer-label-container'>
            <div className='vce-column-resizer-label vce-column-resizer-label-left'>
              <span className='vce-column-resizer-label-percentage'>
                {Math.round(this.state.leftColPercentage * 100) + '%'}
              </span>
            </div>
            <div className='vce-column-resizer-label vce-column-resizer-label-right'>
              <span className='vce-column-resizer-label-percentage'>
                {Math.round(this.state.rightColPercentage * 100) + '%'}
              </span>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
