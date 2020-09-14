import React from 'react'
import PopupInner from '../popupInner'

import { getStorage } from 'vc-cake'

const editorPopupStorage = getStorage('editorPopup')

export default class ReviewPopup extends React.Component {
  render () {
    const localizations = window.VCV_I18N && window.VCV_I18N()
    const positiveReviewHeadingText = localizations ? localizations.thankYouText : 'Thank you!'
    const negativeReviewHeadingText = localizations ? localizations.negativeReviewHeadingText : 'How can we become better?'
    const positiveReviewText = localizations ? localizations.positiveReviewText : 'Thanks for your feedback. Please rate us on WordPress.org and help others to discover Visual Composer.'
    const negativeReviewText = localizations ? localizations.negativeReviewText : 'Your opinion matters. Help us to improve by taking a quick survey.'
    const positiveReviewButtonText = localizations ? localizations.positiveReviewButtonText : 'Write Your Review'
    const negativeReviewButtonText = localizations ? localizations.negativeReviewButtonText : 'Leave Your Feedback'

    const popupState = editorPopupStorage.state('popups').get()
    let reviewType = '3' // If not provided for some reason
    if (popupState && popupState.votePopup) {
      reviewType = popupState.votePopup.voteValue
    }

    const isPositiveReview = reviewType === '1' || reviewType === '2'
    const headingText = isPositiveReview ? positiveReviewHeadingText : negativeReviewHeadingText
    const reviewText = isPositiveReview ? positiveReviewText : negativeReviewText
    const buttonText = isPositiveReview ? positiveReviewButtonText : negativeReviewButtonText

    const feedbackLink = isPositiveReview
      ? 'https://wordpress.org/support/plugin/visualcomposer/reviews/?filter=5#new-topic-0'
      : 'https://my.visualcomposer.com/feedback/visualcomposer?utm_medium=frontend-editor&utm_source=editor&utm_campaign=feedback'

    const customButtonProps = {
      target: '_blank',
      rel: 'noopener noreferrer',
      href: feedbackLink
    }

    return (
      <PopupInner
        {...this.props}
        headingText={headingText}
        buttonText={buttonText}
        popupName='reviewPopup'
        customButtonProps={customButtonProps}
      >
        <p className='vcv-feedback-review-text'>{reviewText}</p>
      </PopupInner>
    )
  }
}
