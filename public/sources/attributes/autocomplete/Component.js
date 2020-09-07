import React from 'react'

import Attribute from '../attribute'
import TokenizationList from './lib/tokenizationList'
import PropTypes from 'prop-types'

export default class AutoComplete extends Attribute {
  static propTypes = {
    updater: PropTypes.func.isRequired,
    onDynamicFieldOpen: PropTypes.func,
    onDynamicFieldChange: PropTypes.func,
    onDynamicFieldClose: PropTypes.func,
    fieldKey: PropTypes.string.isRequired,
    fieldType: PropTypes.string,
    value: PropTypes.any.isRequired,
    defaultValue: PropTypes.any,
    options: PropTypes.object.isRequired,
    elementAccessPoint: PropTypes.object.isRequired,
    description: PropTypes.string
  }

  static defaultProps = {
    fieldType: 'autocomplete'
  }

  constructor (props) {
    super(props)

    this.handleTokenizationListChange = this.handleTokenizationListChange.bind(this)
  }

  validate (state) {
    return state
  }

  handleTokenizationListChange (value) {
    super.setFieldValue(value)
  }

  render () {
    const { value, fieldKey, elementAccessPoint, options, extraClass, description } = this.props
    const { validation, action, single, labelAction, returnValue, tokenLabel } = options

    return (
      <TokenizationList
        onChange={this.handleTokenizationListChange}
        value={value}
        fieldKey={fieldKey}
        elementAccessPoint={elementAccessPoint}
        validator={this.validate}
        validation={validation}
        action={action}
        single={single}
        labelAction={labelAction}
        returnValue={returnValue}
        extraClass={extraClass}
        description={description}
        tokenLabel={tokenLabel}
      />
    )
  }
}
