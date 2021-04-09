import React from 'react'
import StockMedia from './stockMedia'
import PropTypes from 'prop-types'
import unsplashLogo from 'public/sources/images/unsplashLogo.raw'
import { getService } from 'vc-cake'
const dataManager = getService('dataManager')
const unsplashImages = ['https://cdn.hub.visualcomposer.com/plugin-assets/unsplash-1.jpg', 'https://cdn.hub.visualcomposer.com/plugin-assets/unsplash-2.jpg', 'https://cdn.hub.visualcomposer.com/plugin-assets/unsplash-3.jpg', 'https://cdn.hub.visualcomposer.com/plugin-assets/unsplash-4.jpg', 'https://cdn.hub.visualcomposer.com/plugin-assets/unsplash-5.jpg']
const roleManager = getService('roleManager')

export default class UnsplashContainer extends React.Component {
  static propTypes = {
    scrolledToBottom: PropTypes.bool,
    scrollTop: PropTypes.number,
    namespace: PropTypes.string,
    filterType: PropTypes.string
  }

  randomImage = this.getRandomImage()

  getRandomImage () {
    return unsplashImages[Math.floor(Math.random() * unsplashImages.length)]
  }

  render () {
    const localizations = dataManager.get('localizations')
    const stockMediaLocalizations = {
      searchText: localizations ? localizations.searchPhotosOnUnsplash : 'Search for free high-resolution photos on Unsplash',
      getMediaText: localizations ? localizations.getPhotosText : 'Download and Add Free Beautiful Photos to Your Site',
      getMediaWithPremiumText: localizations ? localizations.getPhotosWithPremiumText : 'Download and Add Free Beautiful Photos to Your Site With Visual Composer Premium',
      noConnectionToStockMediaText: `${localizations.noConnectionToUnsplash} #10088` || 'Could not connect to Unsplash Server. #10088',
      downloadText: localizations ? localizations.downloadImageFromUnsplash : 'Download images from Unsplash to the Media Library',
      unlockText: localizations ? localizations.activatePremiumToUnlockStockImages : 'Activate Premium to Unlock Unsplash',
      searchResultKey: localizations ? localizations.images : 'images',
      hasBeenDownloadedText: localizations ? localizations.imageDownloadedToMediaLibrary : 'The image has been downloaded to the Media Library.'
    }

    const sizes = [
      {
        size: 400,
        title: localizations ? localizations.small : 'Small'
      },
      {
        size: 800,
        title: localizations ? localizations.medium : 'Medium'
      },
      {
        size: 1600,
        title: localizations ? localizations.large : 'Large'
      }
    ]

    return (
      <StockMedia
        stockMediaLogo={unsplashLogo}
        backgroundImage={`url(${this.randomImage})`}
        stockMediaLocalizations={stockMediaLocalizations}
        vcvAuthorApiKey={dataManager.get('licenseUnsplashAuthorApiKey')}
        apiUrlKey='unsplash'
        sizes={sizes}
        previewImageSize='small'
        isAllowedForThisRole={roleManager.can('hub_unsplash', roleManager.defaultTrue())}
        {...this.props}
      />
    )
  }
}
