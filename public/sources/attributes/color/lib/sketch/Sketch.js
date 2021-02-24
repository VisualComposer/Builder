'use strict'

import React from 'react'
import reactCSS from 'reactcss'
import shallowCompare from 'react-addons-shallow-compare'
import { ColorWrap, Saturation, Hue, Alpha, Checkboard } from 'react-color/es/components/common'
import SketchFields from './SketchFields'
import SketchPresetColors from './SketchPresetColors'
import UsedStack from './UsedStack'

export class Sketch extends React.Component {
  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare.bind(this, this, nextProps, nextState)
  }

  handleChange = (data) => {
    this.props.onChange(data)
  }

  render () {
    const rgb = this.props.rgb
    const styles = reactCSS({
      default: {
        saturation: {
          width: '100%',
          paddingBottom: '75%',
          position: 'relative',
          overflow: 'hidden'
        },
        Saturation: {
          radius: '3px',
          shadow: 'inset 0 0 0 1px rgba(0,0,0,.15), inset 0 0 4px rgba(0,0,0,.25)'
        },
        controls: {
          display: 'flex'
        },
        sliders: {
          padding: '4px 0',
          flex: '1'
        },
        color: {
          width: '24px',
          height: '24px',
          position: 'relative',
          marginTop: '4px',
          marginLeft: '4px',
          borderRadius: '3px'
        },
        activeColor: {
          absolute: '0px 0px 0px 0px',
          borderRadius: '2px',
          background: `rgba(${rgb.r},${rgb.g},${rgb.b},${rgb.a})`,
          boxShadow: 'inset 0 0 0 1px rgba(0,0,0,.15), inset 0 0 4px rgba(0,0,0,.25)'
        },
        hue: {
          position: 'relative',
          height: '10px',
          overflow: 'hidden'
        },
        Hue: {
          radius: '2px',
          shadow: 'inset 0 0 0 1px rgba(0,0,0,.15), inset 0 0 4px rgba(0,0,0,.25)'
        },
        alpha: {
          position: 'relative',
          height: '10px',
          marginTop: '4px',
          overflow: 'hidden'
        },
        Alpha: {
          radius: '2px',
          shadow: 'inset 0 0 0 1px rgba(0,0,0,.15), inset 0 0 4px rgba(0,0,0,.25)'
        }
      },
      disableAlpha: {
        color: {
          height: '10px'
        },
        hue: {
          height: '10px'
        },
        alpha: {
          display: 'none'
        }
      }
    }, this.props)

    return (
      <div className='vcv-ui-color-picker-panel' style={styles.picker}>
        <div className='vcv-ui-color-picker-custom-color'>
          <div style={styles.saturation}>
            <Saturation
              style={styles.Saturation}
              {...this.props}
              onChange={this.handleChange}
            />
          </div>
          <div style={styles.controls}>
            <div style={styles.sliders}>
              <div style={styles.hue}>
                <Hue style={styles.Hue} {...this.props} onChange={this.handleChange} />
              </div>
              <div style={styles.alpha}>
                <Alpha style={styles.Alpha} {...this.props} onChange={this.handleChange} />
              </div>
            </div>
            <div style={styles.color}>
              <Checkboard />
              <div style={styles.activeColor} />
            </div>
          </div>

          <SketchFields
            {...this.props}
            onChange={this.handleChange}
            disableAlpha={this.props.disableAlpha}
          />
        </div>
        <UsedStack colors={this.props.usedStack} onClick={this.handleChange} />
        <SketchPresetColors colors={this.props.presetColors} onClick={this.handleChange} />
      </div>
    )
  }
}

Sketch.defaultProps = {
  presetColors: ['#D0021B', '#F5A623', '#F8E71C', '#8B572A', '#7ED321', '#417505', '#BD10E0',
    '#9013FE', '#4A90E2', '#50E3C2', '#B8E986', '#000000', '#4A4A4A', '#9B9B9B', '#FFFFFF']
}

export default ColorWrap(Sketch)
