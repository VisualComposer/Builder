import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import { getService, getStorage } from 'vc-cake'

const settingsStorage = getStorage('settings')
const dataManager = getService('dataManager')
const roleManager = getService('roleManager')

export default class HubTemplateControl extends React.Component {
  static propTypes = {
    data: PropTypes.object,
    id: PropTypes.string,
    name: PropTypes.string.isRequired,
    applyTemplate: PropTypes.func.isRequired,
    removeTemplate: PropTypes.func.isRequired,
    spinner: PropTypes.bool,
    type: PropTypes.string,
    description: PropTypes.string,
    preview: PropTypes.string,
    thumbnail: PropTypes.string,
    handleApplyTemplate: PropTypes.func.isRequired,
    handleRemoveTemplate: PropTypes.func.isRequired,
    showPreview: PropTypes.func.isRequired,
    hidePreview: PropTypes.func.isRequired,
    previewStyle: PropTypes.object.isRequired,
    previewVisible: PropTypes.bool.isRequired
  }

  render () {
    const { name, spinner, thumbnail, preview, description, handleApplyTemplate, handleRemoveTemplate, showPreview, hidePreview, previewVisible, previewStyle, handleUpdatePreviewPosition } = this.props
    const localizations = dataManager.get('localizations')
    const nameClasses = classNames({
      'vcv-ui-item-badge vcv-ui-badge--success': false,
      'vcv-ui-item-badge vcv-ui-badge--warning': false
    })

    const spinnerClasses = classNames({
      'vcv-ui-item-control vcv-ui-icon vcv-ui-wp-spinner-light': true,
      'vcv-ui-state--hidden': !spinner
    })

    const applyClasses = classNames({
      'vcv-ui-item-control vcv-ui-icon vcv-ui-icon-add': true,
      'vcv-ui-state--hidden': spinner
    })

    const removeClasses = classNames({
      'vcv-ui-item-control vcv-ui-icon vcv-ui-icon-close-thin vcv-ui-form-attach-image-item-control-state--danger': true,
      'vcv-ui-state--hidden': spinner
    })

    const overlayClasses = classNames({
      'vcv-ui-item-overlay': true,
      'vcv-ui-item-overlay--visible': spinner,
      'vcv-ui-item-control--visible': this.props.isRemoveStateActive
    })

    const disablePreview = settingsStorage.state('itemPreviewDisabled').get()
    let previewBox = ''
    if (!disablePreview && previewVisible) {
      previewBox = (
        <figure className='vcv-ui-item-preview-container' style={previewStyle}>
          <img
            className='vcv-ui-item-preview-image'
            src={preview}
            alt={name}
            onLoad={handleUpdatePreviewPosition}
          />
          <figcaption className='vcv-ui-item-preview-caption'>
            <div className='vcv-ui-item-preview-text'>
              {description}
            </div>
          </figcaption>
        </figure>
      )
    }

    const overlayProps = {}
    let itemButton = null
    if (this.props.isRemoveStateActive) {
      const isAbleToRemove = roleManager.can('editor_content_user_templates_management', roleManager.defaultTrue())
      if (isAbleToRemove) {
        itemButton = (
          <span
            className={removeClasses}
            onClick={handleRemoveTemplate}
            title={localizations.removePlaceholder.replace('%', name)}
          />
        )
      } else {
        overlayProps.style = {
          cursor: 'not-allowed'
        }
      }
    } else {
      itemButton = roleManager.can('editor_content_template_add', roleManager.defaultTrue()) ? (
        <span
          className={applyClasses}
          onClick={handleApplyTemplate}
          title={localizations.addPlaceholder.replace('%', name)}
        />
      ) : null
    }

    return (
      <div className='vcv-ui-item-list-item'>
        <span
          className='vcv-ui-item-element'
          onMouseEnter={!disablePreview ? showPreview : null}
          onMouseLeave={!disablePreview ? hidePreview : null}
        >
          <span className='vcv-ui-item-element-content'>
            <img
              className='vcv-ui-item-element-image'
              src={thumbnail}
              alt={name}
            />
            <span className={overlayClasses} {...overlayProps}>
              {itemButton}
              <span className={spinnerClasses} />
            </span>
          </span>
          <span className='vcv-ui-item-element-name'>
            <span className={nameClasses}>
              {name}
            </span>
          </span>
          {previewBox}
        </span>
      </div>
    )
  }
}
