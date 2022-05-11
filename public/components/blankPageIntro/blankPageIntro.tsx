import React, { useRef, useState } from 'react'
import classNames from 'classnames'
import { getStorage, getService } from 'vc-cake'
import Sidebar from './lib/sidebar'
import LayoutsSection from './lib/layoutsSection'
// @ts-ignore
import Tooltip from 'public/components/tooltip/tooltip'
// @ts-ignore
import PageSettingsTitle from 'public/sources/attributes/pageSettingsTitle/Component'
// @ts-ignore
import Scrollbar from 'public/components/scrollbar/scrollbar'

const workspaceStorage = getStorage('workspace')
const settingsStorage = getStorage('settings')
const dataManager = getService('dataManager')
const localizations = dataManager.get('localizations')

interface Props {
    unmountBlankPage: any
}

const BlankPageIntro: React.FC<Props> = ({unmountBlankPage}) => {
  const [isSidebarOpened, setIsSidebarOpened] = useState(false)
  const scrollbarsRef = useRef(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const settings = {
      action: 'add',
      element: {},
      tag: '',
      options: {}
    }
    workspaceStorage.state('settings').set(settings)
    unmountBlankPage()
  }

  const toggleSettings = () => {
    setIsSidebarOpened(!isSidebarOpened)
  }

  const blankPageClasses = classNames({
    'blank-page-container': true,
    'blank-page-settings--active': isSidebarOpened
  })

  const url = new URL(window.location.href)
  const postOptionsText = url.searchParams.get('post_type') === 'page' ? localizations.pageSettings || 'Page Options' : localizations.postOptions || 'Post Options'
  const getStartedText = localizations.getStartedText || 'GET STARTED'

  return (
    <div className={blankPageClasses}>
      <Sidebar toggleSettings={toggleSettings} />
      <form onSubmit={handleSubmit} className='blank-page-form'>
        <div className='blank-page-input-container'>
          <PageSettingsTitle
            key='pageSettingsTitle'
            fieldKey='pageSettingsTitle'
            updater={() => {}} // required for attributes
            value='' // required for attributes
          />
          <button
            className='blank-button settings-btn vcv-ui-icon vcv-ui-icon-cog'
            aria-label={postOptionsText}
            title={postOptionsText}
            type='button'
            onClick={toggleSettings}
          />
        </div>
        <div className='template-groups-container'>
          <Scrollbar ref={scrollbarsRef}>
            <LayoutsSection sectionType='layout' />
            <LayoutsSection sectionType='content' />
          </Scrollbar>
        </div>
        <button className='blank-button blank-page-submit-button' type='submit'>{getStartedText}</button>
      </form>
    </div>
  )
}

export default BlankPageIntro