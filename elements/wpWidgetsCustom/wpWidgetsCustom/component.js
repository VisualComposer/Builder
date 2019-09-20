import React from 'react'
import { getService } from 'vc-cake'

const vcvAPI = getService('api')

export default class WpWidgetsCustom extends vcvAPI.elementComponent {
  componentDidMount () {
    super.updateShortcodeToHtml(WpWidgetsCustom.getShortcode(this.props.atts), this.refs.vcvhelper)
  }

  componentDidUpdate (props) {
    // update only if shortcode field did change
    if (WpWidgetsCustom.getShortcode(this.props.atts) !== WpWidgetsCustom.getShortcode(props.atts)) {
      super.updateShortcodeToHtml(WpWidgetsCustom.getShortcode(this.props.atts), this.refs.vcvhelper)
    }
  }

  static getShortcode (atts) {
    const widgetAtts = {
      before_title: atts.customWidgetHtml ? atts.atts_before_title : '',
      after_title: atts.customWidgetHtml ? atts.atts_after_title : '',
      before_widget: atts.customWidgetHtml ? atts.atts_before_widget : '',
      after_widget: atts.customWidgetHtml ? atts.atts_after_widget : ''
    }

    const widgetKey = window.encodeURIComponent(atts.widgetKey)
    const instance = window.encodeURIComponent(JSON.stringify(atts.widget))
    const args = window.encodeURIComponent(JSON.stringify(widgetAtts))

    return `[vcv_widgets tag="${atts.tag}" key="${widgetKey}" instance="${instance}" args="${args}"]`
  }

  render () {
    const { id, atts, editor } = this.props
    const { customClass, metaCustomId } = atts
    let containerClasses = [ 'vce-widgets-container' ]

    let customProps = {}
    if (customClass) {
      containerClasses.push(customClass)
    }
    if (metaCustomId) {
      customProps.id = metaCustomId
    }

    const doAll = this.applyDO('all')

    return (
      <div className={containerClasses.join(' ')} {...customProps} {...editor}>
        <div className='vce vce-widgets-wrapper' id={'el-' + id} {...doAll}>
          <div className='vcvhelper' ref='vcvhelper' data-vcvs-html={WpWidgetsCustom.getShortcode(this.props.atts)} />
        </div>
      </div>
    )
  }
}
