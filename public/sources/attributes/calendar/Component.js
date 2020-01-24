import React from 'react'
import Attribute from '../attribute'
import DatePicker from 'react-datepicker'

import 'react-datepicker/dist/react-datepicker.css'

export default class CalendarAttribute extends Attribute {
  static defaultProps = {
    fieldType: 'calendar'
  }

  updateState (props) {
    let newDate = new Date()
    if (props.options.addDays) {
      newDate = new Date(newDate.setDate(newDate.getDate() + props.options.addDays))
    }
    return {
      value: props.value ? new Date(props.value) : newDate
    }
  }

  handleChange (date) {
    this.setFieldValue(date)
  }

  handleChangeRaw = (date) => {
    const newDate = new Date(date.target.value)
    if (date.target && !isNaN(newDate)) {
      this.handleChange(newDate)
    }
  }

  getCalendarProps () {
    const props = {
      selected: this.state.value,
      onChange: this.handleChange,
      onChangeRaw: this.handleChangeRaw,
      disabledKeyboardNavigation: true,
      calendarClassName: 'vcv-ui-form-datepicker',
      className: 'vcv-ui-form-input',
      popperClassName: 'vcv-ui-form-datepicker-popper',
      dateFormat: 'MMMM d, yyyy',
      popperPlacement: 'bottom-start',
      popperModifiers: {
        flip: {
          behavior: ['bottom']
        },
        preventOverflow: {
          enabled: false
        },
        hide: {
          enabled: false
        }
      }
    }
    if (this.props.options.hasOwnProperty('time') && this.props.options.time) {
      props.calendarClassName = 'vcv-ui-form-datepicker vcv-ui-form-datepicker-time'
      props.showTimeSelect = true
      props.timeIntervals = this.props.options.timeIntervals || 10
      props.timeFormat = 'h:mm aa'
      props.dateFormat = 'MMMM d, yyyy h:mm aa'
      props.timeCaption = 'Time'
    }
    return props
  }

  render () {
    return <DatePicker {...this.getCalendarProps()} />
  }
}
