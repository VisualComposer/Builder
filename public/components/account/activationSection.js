import React from 'react'
import LoadingScreen from './loadingScreen'
import InitialScreen from './initialScreen'
import FeatureScreen from './featureScreen'
import ActivatePremiumScreen from './activatePremiumScreen'
import PostUpdater from './postUpdate'
import OopsScreenController from './oopsScreenController'
import ThankYouScreen from './thankYouScreen'
import { log as logError, send as sendErrorReport } from './logger'
import { getResponse } from '../../tools/response'

const $ = window.jQuery
const ActivationSectionContext = React.createContext()

export default class ActivationSectionProvider extends React.Component {
  static localizations = window.VCV_I18N && window.VCV_I18N()
  static texts = {
    sendingErrorReport: ActivationSectionProvider.localizations ? ActivationSectionProvider.localizations.sendingErrorReport : 'Sending Error Report',
    doNotCloseWhileSendingErrorReportText: ActivationSectionProvider.localizations ? ActivationSectionProvider.localizations.doNotCloseWhileSendingErrorReportText : 'Don\'t close this window while sending error is in the progress.'
  }

  static authorApiKey = window.VCV_AUTHOR_API_KEY && window.VCV_AUTHOR_API_KEY()

  doUpdatePostAction = async (postUpdater) => {
    const { postUpdateActions, activePostUpdate } = this.state
    const postData = postUpdateActions[activePostUpdate]
    const posts = postUpdateActions

    let ready = false
    const to = window.setTimeout(() => {
      this.setState({ showSkipPostButton: true })
    }, 60 * 1000)

    try {
      await postUpdater.update(postData)
      ready = true
    } catch (e) {
      logError('Failed Update Post', {
        code: 'doAction-updatePosts-1',
        codeNum: '000003',
        action: postUpdateActions,
        postData: postData,
        error: e
      })

      this.setError({
        errorAction: this.doPostUpdate,
        errorReportAction: this.sendErrorReport
      })
      console.warn(e)
    }
    window.clearTimeout(to)
    this.setState({ showSkipPostButton: false })

    if (ready === false) {
      return
    }

    if (activePostUpdate + 1 < posts.length) {
      this.setState({ activePostUpdate: activePostUpdate + 1 })
      return this.doUpdatePostAction(postUpdater)
    } else {
      this.doneActions()
    }
  }

  constructor (props) {
    super(props)

    const updateActions = window.VCV_UPDATE_ACTIONS()
    const assetsActions = updateActions && updateActions.actions
    const postUpdateActions = updateActions && updateActions.posts
    const isLoadingFinished = !assetsActions.length && !postUpdateActions.length
    const activePage = window.VCV_SLUG && window.VCV_SLUG()

    ActivationSectionProvider.shouldDoUpdate = activePage === 'vcv-update' || activePage === 'vcv-update-fe'

    this.state = {
      activePage: activePage,
      assetsActions: assetsActions,
      postUpdateActions: postUpdateActions,
      activeAssetsAction: 0,
      activePostUpdate: 0,
      error: null,
      showSkipPostButton: false,
      assetsActionsDone: !assetsActions.length,
      postUpdateDone: !postUpdateActions.length,
      actionsStarted: ActivationSectionProvider.shouldDoUpdate,
      isLoadingFinished: isLoadingFinished,
      sendingErrorReport: false,
      errorReported: false,
      loadingText: null,
      loadingDescription: null
    }

    this.doAction = this.doAction.bind(this)
    this.doneActions = this.doneActions.bind(this)
    this.doPostUpdate = this.doPostUpdate.bind(this)
    this.doUpdatePostAction = this.doUpdatePostAction.bind(this)
    this.setError = this.setError.bind(this)
    this.sendErrorReport = this.sendErrorReport.bind(this)
    this.sendErrorCallback = this.sendErrorCallback.bind(this)
    this.setActiveScreen = this.setActiveScreen.bind(this)
  }

  componentDidMount () {
    const { isLoadingFinished, assetsActions, postUpdateActions } = this.state
    const { shouldDoUpdate } = ActivationSectionProvider
    if (shouldDoUpdate && !isLoadingFinished) {
      const cnt = assetsActions.length

      if (!cnt) {
        if (postUpdateActions) {
          this.doPostUpdate()
        }
      } else {
        this.doAction()
      }
    }
  }

  doAction () {
    const cnt = this.state.assetsActions.length
    const action = this.state.assetsActions[this.state.activeAssetsAction]
    this.setState({ error: null })

    $.ajax(window.VCV_UPDATE_PROCESS_ACTION_URL(),
      {
        dataType: 'json',
        data: {
          'vcv-hub-action': action,
          'vcv-nonce': window.vcvNonce
        }
      }
    ).done((json) => {
      if (json && json.status) {
        if (this.state.activeAssetsAction === cnt - 1) {
          this.setState({ assetsActionsDone: true })
          if (this.state.postUpdateActions && this.state.postUpdateActions.length) {
            this.doPostUpdate()
          } else {
            this.doneActions()
          }
        } else {
          this.setState({ activeAssetsAction: this.state.activeAssetsAction + 1 })
          this.doAction()
        }
      } else {
        logError('Failed Update Action', {
          code: 'doAction-1',
          codeNum: '000004',
          action: action,
          error: json
        })

        this.setError({
          message: json && json.message ? json.message : '',
          errorAction: this.doAction,
          errorReportAction: this.sendErrorReport
        })
      }
    }).fail((jqxhr, textStatus, error) => {
      logError('Failed Update Action', {
        code: 'doAction-2',
        codeNum: '000005',
        action: action,
        jqxhr: jqxhr,
        textStatus: textStatus,
        error: error
      })

      try {
        const responseJson = JSON.parse(jqxhr.responseText ? jqxhr.responseText : '""')
        this.setError({
          message: responseJson && responseJson.message ? responseJson.message : '',
          errorAction: this.doAction,
          errorReportAction: this.sendErrorReport
        })
      } catch (e) {
        const Str = jqxhr.responseText
        try {
          const json = getResponse(Str)
          if (json && json.status) {
            if (this.state.activeAssetsAction === cnt - 1) {
              this.setState({ assetsActionsDone: true })
              if (this.state.postUpdateActions && this.state.postUpdateActions.length) {
                this.doPostUpdate()
              } else {
                this.doneActions()
              }
            } else {
              this.setState({ activeAssetsAction: this.state.activeAssetsAction + 1 })
              this.doAction()
            }
            return
          }
        } catch (pe) {
          console.warn('Actions failed', pe, jqxhr.responseText)
        }
        this.setError({
          errorAction: this.doAction,
          errorReportAction: this.sendErrorReport
        })
        console.warn('Update action failed', e, jqxhr.responseText)
      }
    })
  }

  doPostUpdate () {
    const postUpdater = new PostUpdater(window.VCV_UPDATE_GLOBAL_VARIABLES_URL(), window.VCV_UPDATE_VENDOR_URL(), window.VCV_UPDATE_WP_BUNDLE_URL())
    this.setState({ error: null })
    return this.doUpdatePostAction(postUpdater)
  }

  doneActions () {
    this.setState({
      postUpdateDone: true,
      isLoadingFinished: true
    })
  }

  redirect () {
    if (window.vcvPageBack && window.vcvPageBack.length) {
      window.location.href = window.vcvPageBack
    } else {
      window.location.reload()
    }
  }

  getActiveScreen () {
    const { activePage } = this.state
    const { shouldDoUpdate } = ActivationSectionProvider

    if (this.state.error) {
      return <OopsScreenController />
    }

    if (this.state.sendingErrorReport) {
      return <LoadingScreen />
    }

    if (this.state.errorReported) {
      return <ThankYouScreen />
    }

    if (shouldDoUpdate) {
      if (this.state.isLoadingFinished) {
        if (activePage === 'vcv-update-fe') { // Redirect to frontend editor after update is finished
          this.redirect()
        } else { // Show final screen if backend update
          return <InitialScreen />
        }
      } else {
        return <LoadingScreen />
      }
    } else if (activePage === 'vcv-about') {
      return <InitialScreen />
    } else if (activePage === 'vcv-license-options') {
      return <FeatureScreen setActiveScreen={this.setActiveScreen} />
    } else if (activePage === 'vcv-go-premium' || activePage === 'vcv-go-free' || activePage === 'vcv-theme-activation') {
      let activationType = 'free'
      if (activePage === 'vcv-go-premium') {
        activationType = 'premium'
      } else if (activePage === 'vcv-theme-activation') {
        activationType = 'author'
      }
      return <ActivatePremiumScreen activationType={activationType} />
    } else if (activePage === 'vcv-getting-started') {
      return <InitialScreen setActiveScreen={this.setActiveScreen} authorApiKey={ActivationSectionProvider.authorApiKey} />
    }
  }

  setActiveScreen (screenName) {
    this.setState({
      activePage: screenName
    })
  }

  sendErrorCallback () {
    this.setState({
      sendingErrorReport: false,
      errorReported: true
    })
  }

  sendErrorReport (e) {
    this.setState({
      error: null,
      sendingErrorReport: true,
      loadingText: ActivationSectionProvider.texts.sendingErrorReport,
      loadingDescription: ActivationSectionProvider.texts.doNotCloseWhileSendingErrorReportText
    })
    sendErrorReport(e, this.sendErrorCallback)
  }

  setError (errorData) { // message, errorAction, errorReportAction
    this.setState({
      error: {
        ...errorData,
        errorName: 'activation'
      }
    })
  }

  render () {
    return (
      <ActivationSectionContext.Provider
        value={{
          ...this.state
        }}
      >
        <div className='vcv-activation-section'>
          {this.getActiveScreen()}
        </div>
      </ActivationSectionContext.Provider>
    )
  }
}

export const ActivationSectionConsumer = ActivationSectionContext.Consumer
