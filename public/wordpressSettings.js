import './sources/less/wpsettings-update/init.less'
import { hoverTooltip } from './components/wpVcSettings/helpTooltips'
import { checkStatus } from './components/wpVcSettings/statusCheck'
import { initEditors } from './components/wpVcSettings/editors'
import { hfSectionToggle } from './components/wpVcSettings/hfSectionToggle'
import { dropdownEditLink } from './components/wpVcSettings/dropdownEditLink'

(($) => {
  checkStatus()
  hoverTooltip()
  initEditors()
  hfSectionToggle()
  dropdownEditLink()
})(window.jQuery)
