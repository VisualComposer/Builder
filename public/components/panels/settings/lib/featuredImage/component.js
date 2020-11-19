import React from 'react'
import { getStorage, getService } from 'vc-cake'
import AttachImage from 'public/sources/attributes/attachimage/Component'

const dataManager = getService('dataManager')
const settingsStorage = getStorage('settings')
const localizations = dataManager.get('localizations')
const featuredImage = localizations ? localizations.featuredImage : 'Featured Image'

export default class FeaturedImage extends React.Component {
  constructor (props) {
    super(props)
    const data = dataManager.get('featuredImage')

    this.state = {
      data: data
    }

    settingsStorage.state('featuredImage').set(data.ids[0])
    this.valueChangeHandler = this.valueChangeHandler.bind(this)
  }

  valueChangeHandler (fieldKey, value) {
    this.setState({
      data: value
    })
    settingsStorage.state('featuredImage').set(value.ids[0])
  }

  render () {
    return (
      <>
        <div className='vcv-ui-edit-form-section-header vcv-ui-wordpress-setting-header'>
          <span className='vcv-ui-edit-form-section-header-title'>{featuredImage}</span>
        </div>
        <div className='vcv-ui-form-group'>
          <span className='vcv-ui-form-group-heading'>
            {featuredImage}
          </span>
          <AttachImage
            key='attachImage'
            fieldKey='featuredImage'
            updater={this.valueChangeHandler} // required for attributes
            options={{
              dynamicField: false,
              url: false,
              multiple: false,
              imageFilter: true
            }} // required for attributes
            value={this.state.data} // required for attributes
          />
        </div>
      </>
    )
  }
}
