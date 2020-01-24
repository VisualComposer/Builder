import React from 'react'
import lodash from 'lodash'
import classNames from 'classnames'
import Attribute from '../attribute'
import Toggle from '../toggle/Component'

class BoxModel extends Attribute {
  static defaultProps = {
    fieldType: 'boxModel'
  }

  static defaultState = {
    combined: '',
    margin: '',
    marginTop: '',
    marginRight: '',
    marginBottom: '',
    marginLeft: '',
    padding: '',
    paddingTop: '',
    paddingRight: '',
    paddingBottom: '',
    paddingLeft: '',
    borderWidth: '',
    borderTopWidth: '',
    borderRightWidth: '',
    borderBottomWidth: '',
    borderLeftWidth: '',
    borderRadius: '',
    borderTopRightRadius: '',
    borderBottomRightRadius: '',
    borderBottomLeftRadius: '',
    borderTopLeftRadius: ''
  }

  constructor (props) {
    super(props)

    this.simplifyControlsHandler = this.simplifyControlsHandler.bind(this)
    this.handleBoxInputChange = this.handleBoxInputChange.bind(this)
    this.handleBoxInputBlur = this.handleBoxInputBlur.bind(this)
  }

  /**
   * Prepare data for state
   * @param props
   * @returns {{}}
   */
  updateState (props) {
    let newState = {}
    // data came from props if there is set value
    if (props.value) {
      newState = lodash.defaultsDeep({}, props.value, BoxModel.defaultState)
      if (props.value.combined === undefined || props.value.combined === '') {
        newState.combined = (newState.margin !== '' || newState.padding !== '' || newState.borderWidth !== '' || newState.borderRadius !== '')
      }
    } else {
      // data came from state update
      newState = lodash.defaultsDeep({}, props, BoxModel.defaultState)
    }
    newState = lodash.defaultsDeep({}, this.getCombinedFields(newState), this.getSimplifiedFields(newState), newState)
    return newState
  }

  /**
   * Get combined fields
   * @param state
   * @returns {}
   */
  getCombinedFields (state) {
    // prepare values
    let combinedFields = {
      margin: state.margin,
      padding: state.padding,
      borderWidth: state.borderWidth,
      borderRadius: state.borderRadius
    }
    // if simplify changed
    if (!state.combined) {
      combinedFields = {
        margin: state.marginTop,
        padding: state.paddingTop,
        borderWidth: state.borderTopWidth,
        borderRadius: state.borderTopRightRadius
      }
    }
    return combinedFields
  }

  /**
   * Get simplified fields
   * @param state
   * @returns {}
   */
  getSimplifiedFields (state) {
    let simpleFields = {
      // margin
      marginTop: state.marginTop,
      marginRight: state.marginRight,
      marginBottom: state.marginBottom,
      marginLeft: state.marginLeft,
      // padding
      paddingTop: state.paddingTop,
      paddingRight: state.paddingRight,
      paddingBottom: state.paddingBottom,
      paddingLeft: state.paddingLeft,
      // border width
      borderTopWidth: state.borderTopWidth,
      borderRightWidth: state.borderRightWidth,
      borderBottomWidth: state.borderBottomWidth,
      borderLeftWidth: state.borderLeftWidth,
      // border radius
      borderTopRightRadius: state.borderTopRightRadius,
      borderBottomRightRadius: state.borderBottomRightRadius,
      borderBottomLeftRadius: state.borderBottomLeftRadius,
      borderTopLeftRadius: state.borderTopLeftRadius
    }
    if (state.combined) {
      simpleFields = {
        // margin
        marginTop: state.margin,
        marginRight: state.margin,
        marginBottom: state.margin,
        marginLeft: state.margin,
        // padding
        paddingTop: state.padding,
        paddingRight: state.padding,
        paddingBottom: state.padding,
        paddingLeft: state.padding,
        // border width
        borderTopWidth: state.borderWidth,
        borderRightWidth: state.borderWidth,
        borderBottomWidth: state.borderWidth,
        borderLeftWidth: state.borderWidth,
        // border radius
        borderTopRightRadius: state.borderRadius,
        borderBottomRightRadius: state.borderRadius,
        borderBottomLeftRadius: state.borderRadius,
        borderTopLeftRadius: state.borderRadius
      }
    }
    return simpleFields
  }

  /**
   * Update value
   * @param newState
   */
  updateValue (newState) {
    // update value
    const newValue = {}
    let checkFields = []

    // prepare data for state
    newState = this.updateState(newState)
    // prepare data to save
    if (newState.combined) {
      checkFields = Object.keys(this.getCombinedFields(newState))
    } else {
      checkFields = Object.keys(this.getSimplifiedFields(newState))
    }

    newValue.combined = newState.combined

    // save only needed data
    checkFields.forEach((field) => {
      if (newState[field] !== '') {
        newValue[field] = newState[field]
      }
    })

    this.setFieldValue(newValue)
    this.setState(newState)
  }

  /**
   * Push value to updater
   * @param value
   */
  setFieldValue (value) {
    const { updater, fieldKey } = this.props
    updater(fieldKey, value)
  }

  /**
   * Handle simplify toggle switch event
   * @param fieldKey
   * @param value
   */
  simplifyControlsHandler (fieldKey, value) {
    const newValue = lodash.defaultsDeep({}, { [fieldKey]: value }, this.state)
    this.updateValue(newValue)
  }

  /**
   * Handle box input change
   * @param e
   */
  handleBoxInputChange (e) {
    const field = e.currentTarget
    const newState = lodash.defaultsDeep({}, { [field.name]: field.value }, this.state)
    this.updateValue(newState)
  }

  handleBoxInputBlur (e) {
    const field = e.currentTarget
    // update value
    const units = ['px', 'em', 'rem', '%', 'vw', 'vh']
    const re = new RegExp('^-?\\d*(\\.\\d{0,9})?(' + units.join('|') + ')?$')

    if (field.value === '') {
      return
    }

    const match = field.value.match(re)
    if (match) {
      if (!match[2]) {
        const newState = lodash.defaultsDeep({}, { [field.name]: `${field.value}px` }, this.state)
        this.updateValue(newState)
      }
      return
    }

    // if validation fail leave field empty
    const newState = lodash.defaultsDeep({}, { [field.name]: '' }, this.state)
    this.updateValue(newState)
  }

  /**
   * Get box input render
   * @param name
   * @param position
   * @param isDisabled
   * @returns {JSX}
   */
  renderInput (name, position, isDisabled = false) {
    const classes = classNames([
      'vcv-ui-form-input',
      'vcv-ui-design-options-onion-control-position--' + position
    ])

    const defaultStyle = this.props.placeholder && this.props.placeholder[name]
    const placeholder = defaultStyle || '-'
    return (
      <input
        type='text'
        placeholder={placeholder}
        className={classes}
        name={name}
        value={this.state[name] || ''}
        onChange={this.handleBoxInputChange}
        onBlur={this.handleBoxInputBlur}
        disabled={isDisabled}
      />
    )
  }

  /**
   * Render component
   * @returns {JSX}
   */
  render () {
    return (
      <div>
        <div className='vcv-ui-form-group'>
          <div className='vcv-ui-design-options-onion'>
            <div className='vcv-ui-design-options-onion-layers'>
              <div className='vcv-ui-design-options-onion-layer--margin'>
                <span className='vcv-ui-form-group-heading'>
                  Margin
                </span>
                {this.renderInput(this.state.combined ? 'margin' : 'marginTop', 'top')}
                {this.renderInput('marginRight', 'right', this.state.combined)}
                {this.renderInput('marginBottom', 'bottom', this.state.combined)}
                {this.renderInput('marginLeft', 'left', this.state.combined)}
              </div>
              <div className='vcv-ui-design-options-onion-layer--padding'>
                <span className='vcv-ui-form-group-heading'>
                  Padding
                </span>
                {this.renderInput(this.state.combined ? 'padding' : 'paddingTop', 'top')}
                {this.renderInput('paddingRight', 'right', this.state.combined)}
                {this.renderInput('paddingBottom', 'bottom', this.state.combined)}
                {this.renderInput('paddingLeft', 'left', this.state.combined)}
              </div>
              <div className='vcv-ui-design-options-onion-layer--border'>
                <span className='vcv-ui-form-group-heading'>
                  Border
                </span>
                {this.renderInput(this.state.combined ? 'borderWidth' : 'borderTopWidth', 'top')}
                {this.renderInput('borderRightWidth', 'right', this.state.combined)}
                {this.renderInput('borderBottomWidth', 'bottom', this.state.combined)}
                {this.renderInput('borderLeftWidth', 'left', this.state.combined)}
              </div>
              <div className='vcv-ui-design-options-onion-layer--border-radius'>
                <span className='vcv-ui-form-group-heading'>
                  Radius
                </span>
                {this.renderInput(this.state.combined ? 'borderRadius' : 'borderTopRightRadius', 'top-right')}
                {this.renderInput('borderBottomRightRadius', 'bottom-right', this.state.combined)}
                {this.renderInput('borderBottomLeftRadius', 'bottom-left', this.state.combined)}
                {this.renderInput('borderTopLeftRadius', 'top-left', this.state.combined)}
              </div>
            </div>
          </div>
        </div>
        <div className='vcv-ui-form-group vcv-ui-form-group-style--inline'>
          <Toggle
            value={this.state.combined}
            fieldKey='combined'
            updater={this.simplifyControlsHandler}
            options={{ labelText: 'Simple controls' }}
            api={this.props.api}
          />
        </div>
      </div>
    )
  }
}

export default BoxModel
