import React from 'react'
import classNames from 'classnames'
import { getService, getStorage } from 'vc-cake'
import ElementControl from '../../addElement/lib/elementControl'

const hubElementsStorage = getStorage('hubElements')
const workspaceStorage = getStorage('workspace')
const dataManager = getService('dataManager')
const localizations = dataManager.get('localizations')
const hubElementsState = hubElementsStorage.state('elements')

export default class HubElementControl extends ElementControl {
  constructor (props) {
    super(props)
    this.state = {
      isNew: this.props.isNew
    }
    this.isHubInWpDashboard = workspaceStorage.state('isHubInWpDashboard').get()

    this.addElement = this.addElement.bind(this)
    this.downloadElement = this.downloadElement.bind(this)
  }

  downloadElement () {
    const { element, onDownloadItem } = this.props
    const errorMessage = localizations.elementDownloadRequiresUpdate || 'Update Visual Composer plugin to the most recent version to download this content element.'

    const allowDownload = onDownloadItem(errorMessage)
    if (allowDownload) {
      hubElementsStorage.trigger('downloadElement', element)
    }
  }

  addElement () {
    this.props.addElement(this.props.element)
  }

  render () {
    const { name, element, isDownloading, tag } = this.props
    const { previewVisible, previewStyle, isNew } = this.state

    let elementState = 'downloading'
    if (!isDownloading) {
      elementState = typeof hubElementsState.get()[tag] !== 'undefined' ? 'success' : 'inactive'
    }

    const lockIcon = (!element.allowDownload && elementState === 'inactive') || !dataManager.get('isAnyActivated')
    const itemElementClasses = classNames({
      'vcv-ui-item-element': true,
      'vcv-ui-item-element-inactive': elementState !== 'success',
      'vcv-ui-item-element-inactive--locked': lockIcon
    })

    const listItemClasses = classNames({
      'vcv-ui-item-list-item': true,
      'vcv-ui-item-list-item--inactive': false
    })
    const nameClasses = classNames({
      'vcv-ui-item-badge vcv-ui-badge--success': false,
      'vcv-ui-item-badge vcv-ui-badge--warning': false
    })

    const previewClasses = classNames({
      'vcv-ui-item-preview-container': true,
      'vcv-ui-state--visible': previewVisible
    })

    const itemOverlayClasses = classNames({
      'vcv-ui-item-overlay': true,
      'vcv-ui-item-downloading': elementState === 'downloading'
    })

    const publicPathThumbnail = element.thumbnailUrl || element.metaThumbnailUrl
    const publicPathPreview = element.previewUrl || element.metaPreviewUrl

    const iconClasses = classNames({
      'vcv-ui-item-add': true,
      'vcv-ui-item-add-hub': true,
      'vcv-ui-icon': true,
      'vcv-ui-icon-download': elementState === 'inactive',
      'vcv-ui-wp-spinner-light': elementState === 'downloading',
      'vcv-ui-icon-lock': lockIcon,
      'vcv-ui-icon-add': elementState === 'success' && !this.isHubInWpDashboard
    })

    let action = this.isHubInWpDashboard ? null : this.addElement
    if (elementState !== 'success') {
      if (lockIcon) {
        action = this.props.onClickGoPremium
      } else {
        action = this.downloadElement
      }
    }

    const overlayOutput = <span className={iconClasses} onClick={action} />
    let previewOutput = null
    let newBadge = null

    if (isNew) {
      const newText = localizations.new || 'New'
      newBadge = <span className='vcv-ui-hub-item-badge vcv-ui-hub-item-badge--new'>{newText}</span>
    }

    if (previewVisible) {
      previewOutput = (
        <figure className={previewClasses} style={previewStyle}>
          <img className='vcv-ui-item-preview-image' src={publicPathPreview} alt={name} />
          <figcaption className='vcv-ui-item-preview-caption'>
            <div className='vcv-ui-item-preview-text'>
              {element.description || element.metaDescription}
            </div>
            {newBadge}
          </figcaption>
        </figure>
      )
    }

    return (
      <div className={listItemClasses}>
        <span
          className={itemElementClasses}
          onMouseEnter={this.handleMouseEnterShowPreview}
          onMouseLeave={this.handleMouseLeaveHidePreview}
          title={name}
        >
          {newBadge}
          <span className='vcv-ui-item-element-content'>
            <img className='vcv-ui-item-element-image' src={publicPathThumbnail} alt={name} />
            <span className={itemOverlayClasses}>
              {overlayOutput}
            </span>
          </span>
          <span className='vcv-ui-item-element-name'>
            <span className={nameClasses}>
              {name}
            </span>
          </span>
          {previewOutput}
        </span>
      </div>
    )
  }
}
