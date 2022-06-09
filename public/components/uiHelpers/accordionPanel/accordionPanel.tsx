import React, { useState } from 'react'
import classNames from 'classnames'
// @ts-ignore
import Tooltip from 'public/components/tooltip/tooltip'

interface Props {
  children: React.ReactNode,
  sectionTitle: string,
  tooltipText: string,
  isChevron: boolean,
  classes: string,
  isExpanded: boolean
}

const AccordionPanel: React.FC<Props> = ({ children, sectionTitle, tooltipText, isChevron = false, classes, isExpanded }) => {
  const [isActive, setIsActive] = useState(isExpanded)

  const handleClickToggleSection = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement
    if (e.currentTarget === e.target || (target && target.classList && target.classList.contains('vcv-ui-edit-form-section-header-title'))) {
      setIsActive(!isActive)
    }
  }

  let sectionClasses = classNames({
    'vcv-ui-edit-form-section': true,
    'vcv-ui-edit-form-section--opened': isActive,
    'vcv-ui-edit-form-section--closed': !isActive
  })

  if (classes) {
    sectionClasses += ` ${classes}`
  }

  let tooltip = null
  if (tooltipText) {
    tooltip = (
      <Tooltip>
        {tooltipText}
      </Tooltip>
    )
  }
  const chevron = isChevron ? <i className='vcv-ui-icon vcv-ui-icon-chevron-thick' /> : null

  return (
    <div className={sectionClasses}>
      <div className='vcv-ui-edit-form-section-header' onClick={handleClickToggleSection}>
        <span className='vcv-ui-edit-form-section-header-title'>
          {sectionTitle}
        </span>
        {tooltip}
        {chevron}
      </div>
      <div className='vcv-ui-edit-form-section-content'>
        {children}
      </div>
    </div>
  )
}

export default AccordionPanel
