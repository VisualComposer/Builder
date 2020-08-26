import React from 'react'
import StockMedia from './stockMedia'
import PropTypes from 'prop-types'
import unsplashLogo from 'public/sources/images/unsplashLogo.raw'

const unsplashImages = ['https://cdn.hub.visualcomposer.com/plugin-assets/unsplash-1.jpg', 'https://cdn.hub.visualcomposer.com/plugin-assets/unsplash-2.jpg', 'https://cdn.hub.visualcomposer.com/plugin-assets/unsplash-3.jpg', 'https://cdn.hub.visualcomposer.com/plugin-assets/unsplash-4.jpg', 'https://cdn.hub.visualcomposer.com/plugin-assets/unsplash-5.jpg']

export default class UnsplashContainer extends React.Component {
  static propTypes = {
    scrolledToBottom: PropTypes.bool,
    scrollTop: PropTypes.number
  }

  randomImage = this.getRandomImage()

  getRandomImage () {
    return unsplashImages[Math.floor(Math.random() * unsplashImages.length)]
  }

  render () {
    const localizations = window.VCV_I18N && window.VCV_I18N()
    const stockMediaLocalizations = {
      searchText: localizations ? localizations.searchPhotosOnUnsplash : 'Search free high-resolution photos on Unsplash',
      getMediaText: localizations ? localizations.getPhotosText : 'Download and Add Free Beautiful Photos to Your Site',
      getMediaWithPremiumText: localizations ? localizations.getPhotosWithPremiumText : 'Download and Add Free Beautiful Photos to Your Site With Visual Composer Premium',
      noConnectionToStockMediaText: `${localizations.noConnectionToUnsplash} #10088` || 'Could not connect to Unsplash Server! #10088',
      downloadText: localizations ? localizations.downloadImageFromUnsplash : 'Download images from Unsplash to your Media Library',
      unlockText: localizations ? localizations.activatePremiumToUnlockStockImages : 'Activate Premium to Unlock Stock Images',
      searchResultKey: localizations ? localizations.images : 'images'
    }

    return (
      <StockMedia
        stockMediaLogo={unsplashLogo}
        backgroundImage={`url(${this.randomImage})`}
        stockMediaLocalizations={stockMediaLocalizations}
        upgradeUrl={window.vcvUpgradeUrlUnsplash}
        vcvAuthorApiKey={window.VCV_LICENSE_UNSPLASH_AUTHOR_API_KEY && window.VCV_LICENSE_UNSPLASH_AUTHOR_API_KEY()}
        apiUrlKey='unsplash'
        {...this.props}
      />
    )
  }
}
