import vcCake from 'vc-cake'
import React from 'react'
import ReactDOM from 'react-dom'
import classNames from 'classnames'
import PropTypes from 'prop-types'

const sharedAssetsLibraryService = vcCake.getService('sharedAssetsLibrary')

export default class TemplateControl extends React.Component {
  static propTypes = {
    data: PropTypes.object,
    id: PropTypes.string,
    name: PropTypes.string.isRequired,
    addClick: PropTypes.func.isRequired,
    spinner: PropTypes.bool,
    type: PropTypes.string,
    description: PropTypes.string,
    preview: PropTypes.string,
    thumbnail: PropTypes.string,
    blank: PropTypes.bool
  }

  constructor (props) {
    super(props)
    this.state = {
      letter: this.props.name.charAt(0).toUpperCase(),
      previewVisible: false,
      previewStyle: {}
    }
    this.handleAddClick = this.handleAddClick.bind(this)
    this.showPreview = this.showPreview.bind(this)
    this.hidePreview = this.hidePreview.bind(this)
  }

  componentDidMount () {
    this.ellipsize('.vcv-ui-item-element-name')
  }

  showPreview () {
    if (!this.props.blank) {
      if (this.updatePreviewPosition()) {
        this.setState({
          previewVisible: true
        })
      }
    }
  }

  hidePreview () {
    if (!this.props.blank) {
      this.setState({
        previewVisible: false
      })
    }
  }

  getClosest (el, selector) {
    let matchesFn;
    // find vendor prefix
    ['matches', 'webkitMatchesSelector', 'mozMatchesSelector', 'msMatchesSelector', 'oMatchesSelector'].some(function (fn) {
      if (typeof document.body[fn] === 'function') {
        matchesFn = fn
        return true
      }
      return false
    })
    let parent
    // traverse parents
    while (el) {
      parent = el.parentElement
      if (parent && parent[matchesFn](selector)) {
        return parent
      }
      el = parent
    }
    return null
  }

  updatePreviewPosition () {
    const element = ReactDOM.findDOMNode(this)

    let container
    if (element.closest === undefined) {
      container = this.getClosest(element, '.vcv-ui-item-list')
    } else {
      container = element.closest('.vcv-ui-item-list')
    }
    const firstElement = container.querySelector('.vcv-ui-item-list-item')
    const trigger = element.querySelector('.vcv-ui-item-element-content')
    const preview = element.querySelector('.vcv-ui-item-preview-container')

    const triggerSizes = trigger.getBoundingClientRect()
    const firsElementSize = firstElement.getBoundingClientRect()
    const previewSizes = preview.getBoundingClientRect()
    const windowSize = {
      height: window.innerHeight,
      width: window.innerWidth
    }

    // default position
    let posX = triggerSizes.left + triggerSizes.width
    let posY = triggerSizes.top
    // position if no place to show on a right side
    if (posX + previewSizes.width > windowSize.width) {
      posX = triggerSizes.left - previewSizes.width
    }
    // position if no place to show on left side (move position down)
    if (posX < 0) {
      posX = triggerSizes.left
      posY = triggerSizes.top + triggerSizes.height
    }
    // position if no place to show on right side
    if (posX + previewSizes.width > windowSize.width) {
      posX = triggerSizes.left + triggerSizes.width - previewSizes.width
    }
    // position if no place from left and right
    if (posX < 0) {
      posX = firsElementSize.left
    }
    // don't show if window size is smaller than preview
    if (posX + previewSizes.width > windowSize.width) {
      return false
    }

    // position if no place to show on bottom
    if (posY + previewSizes.height > windowSize.height) {
      posY = triggerSizes.top + triggerSizes.height - previewSizes.height
      // position if preview is above element
      if (posX === triggerSizes.left || posX === firsElementSize.left) {
        posY = triggerSizes.top - previewSizes.height
      }
    }
    // don't show if window size is smaller than preview
    if (posY < 0) {
      return false
    }

    this.setState({
      previewStyle: {
        left: posX,
        top: posY
      }
    })
    return true
  }

  handleAddClick (e) {
    e && e.preventDefault()
    this.props.addClick(this.props)
  }

  ellipsize (selector) {
    const element = ReactDOM.findDOMNode(this).querySelector(selector)
    const wordArray = element.innerHTML.split(' ')
    while (element.scrollHeight > element.offsetHeight && wordArray.length > 0) {
      wordArray.pop()
      element.innerHTML = wordArray.join(' ') + '...'
    }
    return this
  }

  render () {
    const localizations = window.VCV_I18N && window.VCV_I18N()
    const addText = localizations ? localizations.add : 'Add'

    const { name, thumbnail, preview, description } = this.props
    const { previewVisible, previewStyle } = this.state

    const applyClasses = classNames({
      'vcv-ui-item-control vcv-ui-icon vcv-ui-icon-add': true
    })

    const overlayClasses = classNames({
      'vcv-ui-item-overlay': true
    })

    const elementContentClasses = classNames({
      'vcv-ui-item-element-content': true,
      'vcv-ui-item-blank-page': this.props.blank
    })

    let previewClasses = ''
    let figure = ''
    let thumbnailImage = ''
    let blankOverlay = ''

    if (!this.props.blank) {
      previewClasses = classNames({
        'vcv-ui-item-preview-container': true,
        'vcv-ui-state--visible': previewVisible
      })

      figure = (
        <figure className={previewClasses} style={previewStyle}>
          <img
            className='vcv-ui-item-preview-image'
            src={sharedAssetsLibraryService.getSourcePath(preview)}
            alt={name}
          />
          <figcaption className='vcv-ui-item-preview-caption'>
            <div className='vcv-ui-item-preview-text'>
              {description}
            </div>
          </figcaption>
        </figure>
      )

      thumbnailImage = (
        <img
          className='vcv-ui-item-element-image'
          src={sharedAssetsLibraryService.getSourcePath(thumbnail)}
          alt={name}
        />
      )
    } else {
      blankOverlay = (
        <span className='vcv-ui-item-blank-page-icon vcv-ui-icon vcv-ui-icon-add' />
      )
    }

    return (
      <li className='vcv-ui-item-list-item'>
        <span
          className='vcv-ui-item-element'
          title={`${addText} ${name}`}
          onClick={this.handleAddClick.bind(this)}
          onMouseEnter={this.showPreview}
          onMouseLeave={this.hidePreview}
        >
          <span className={elementContentClasses}>
            {thumbnailImage}
            <span className={overlayClasses}>
              <span className={applyClasses} />
            </span>
            {blankOverlay}
          </span>
          <span className='vcv-ui-item-element-name'>
            {name}
          </span>
          {figure}
        </span>
      </li>
    )
  }
}
