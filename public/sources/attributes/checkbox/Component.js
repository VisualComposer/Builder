import React from 'react'
import Attribute from '../attribute'

export default class Checkbox extends Attribute {
  static defaultProps = {
    fieldType: 'checkbox'
  }

  handleChange (event) {
    const value = event.target.value
    var values = this.state.value
    if (event.target.checked) {
      values.push(value)
    } else {
      values.splice(values.indexOf(value), 1)
    }
    this.setFieldValue(values)
  }

  getValues () {
    const { props } = this
    let { values } = props.options || {}
    const { global } = props.options || {}
    if (global && (!values || !values.length)) {
      if (typeof window[global] === 'function') {
        values = window[global]()
      } else {
        values = window[global] || []
      }
    }

    return values
  }

  render () {
    const { fieldKey } = this.props
    const optionElements = []
    const values = this.getValues()
    const currentValues = this.state.value
    for (const key in values) {
      const value = values[key].value
      const checked = currentValues && currentValues.indexOf(value) !== -1 ? 'checked' : ''
      optionElements.push(
        <label key={fieldKey + ':' + key + ':' + value} className='vcv-ui-form-checkbox' htmlFor={fieldKey + '-' + key + '-' + value}>
          <input type='checkbox' onChange={this.handleChange} checked={checked} value={value} id={fieldKey + '-' + key + '-' + value} />
          <span className='vcv-ui-form-checkbox-indicator' />
          {values[key].label}
        </label>
      )
    }

    let classNames = 'vcv-ui-form-checkboxes'
    if (this.props.options && this.props.options.listView) {
      classNames += ' vcv-ui-form-checkboxes--list'
    }
    return (
      <div className={classNames}>
        {optionElements}
      </div>)
  }
}
