/* global React, vcvAPI */
/* eslint no-unused-vars: 0 */
class Component extends vcvAPI.elementComponent {
  static unique = 0

  componentDidMount () {
    let { customOptions, timelineUrl, tweetCount, tweetTheme } = this.props.atts
    if (!customOptions) {
      tweetCount = '20'
      tweetTheme = 'light'
    }

    if (timelineUrl) {
      this.insertTwitter(timelineUrl, tweetCount, tweetTheme)
    }
  }

  componentWillReceiveProps (nextProps) {
    let { customOptions, timelineUrl, tweetCount, tweetTheme } = this.props.atts
    if (!customOptions) {
      tweetCount = '20'
      tweetTheme = 'light'
    }
    let elementKey = `customProps:${this.props.id}-${timelineUrl}-${tweetCount}-${tweetTheme}`

    let nextAtts = nextProps.atts
    if (!nextAtts.customOptions) {
      nextAtts.tweetCount = '20'
      nextAtts.tweetTheme = 'light'
    }
    let nextElementKey = `customProps:${nextProps.id}-${nextAtts.timelineUrl}-${nextAtts.tweetCount}-${nextAtts.tweetTheme}`

    if (nextAtts.timelineUrl && elementKey !== nextElementKey) {
      this.insertTwitter(nextAtts.timelineUrl, nextAtts.tweetCount, nextAtts.tweetTheme)
    }
  }

  loadJSONP (url, callback, context) {
    let name = '_jsonp_twitterTimeline_' + Component.unique++
    if (url.indexOf('?') >= 0) {
      url += '&callback=' + name
    } else {
      url += '?callback=' + name
    }

    let script = document.createElement('script')
    script.type = 'text/javascript'
    script.async = true
    script.src = url

    let clearScript = () => {
      document.getElementsByTagName('head')[ 0 ].removeChild(script)
      script = null
      delete window[ name ]
    }

    let timeout = 10 // 10 second by default
    let timeoutTrigger = window.setTimeout(() => {
      clearScript()
    }, timeout * 1000)

    window[ name ] = function (data) {
      window.clearTimeout(timeoutTrigger)
      callback.call((context || window), data)
      clearScript()
    }

    document.getElementsByTagName('head')[ 0 ].appendChild(script)
  }

  insertTwitter (url, tweetCount, tweetTheme) {
    let createdUrl = 'https://publish.twitter.com/oembed.json?url=' + url + '&theme=' + tweetTheme + '&limit=' + tweetCount + '&widget_type=timeline'
    this.loadJSONP(
      createdUrl,
      (data) => {
        this.appendTwitter(data.html)
      }
    )
  }

  appendTwitter (tagString = '') {
    const component = this.getDomNode().querySelector('.vce-twitter-timeline-inner')
    component.innerHTML = ''

    if (this.props.editor) {
      let range = document.createRange()
      let documentFragment = range.createContextualFragment(tagString)
      component.appendChild(documentFragment)
    } else {
      component.innerHTML = tagString
    }
  }

  render () {
    let { id, atts, editor } = this.props
    let { designOptions, customClass, alignment, width, customOptions } = atts
    let classes = 'vce-twitter-timeline vce'
    let innerClasses = 'vce-twitter-timeline-inner'
    let customProps = {}
    let innerCustomProps = {}

    if (typeof customClass === 'string' && customClass) {
      classes += ' ' + customClass
    }

    if (alignment && customOptions) {
      classes += ` vce-twitter-timeline--align-${alignment}`
    }

    if (width) {
      let mixinData = this.getMixinData('timelineWidth')
      if (mixinData) {
        innerClasses += ` vce-twitter-timeline--width-${mixinData.selector}`
      }
    }

    customProps.key = `customProps:${id}`

    let devices = designOptions.visibleDevices ? Object.keys(designOptions.visibleDevices) : []
    let animations = []
    devices.forEach((device) => {
      let prefix = designOptions.visibleDevices[ device ]
      if (designOptions[ device ].animation) {
        if (prefix) {
          prefix = `-${prefix}`
        }
        animations.push(`vce-o-animate--${designOptions[ device ].animation}${prefix}`)
      }
    })
    if (animations.length) {
      customProps[ 'data-vce-animate' ] = animations.join(' ')
    }

    if (editor) {
      innerClasses += ' vce-twitter-timeline-disabled'
    }

    return <div {...customProps} className={classes} id={'el-' + id} {...editor}>
      <div className={innerClasses} {...innerCustomProps} />
    </div>
  }
}
