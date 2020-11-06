<?php

namespace VisualComposer\Helpers;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Helper;

class Localizations extends Container implements Helper
{
    /**
     * @param $locale array
     *
     * @return array
     */
    public function getLocalizations()
    {
        $wpHelper = vchelper('Wp');
        $locale = [
            'addElement' => __('Add Element', 'visualcomposer'),
            'addContent' => __('Add Content', 'visualcomposer'),
            'addPremiumElement' => __('Visual Composer Hub', 'visualcomposer'),
            'addTemplate' => __('Add Template', 'visualcomposer'),
            'treeView' => __('Tree View', 'visualcomposer'),
            'undo' => __('Undo', 'visualcomposer'),
            'redo' => __('Redo', 'visualcomposer'),
            'responsiveView' => __('Responsive View', 'visualcomposer'),
            'desktop' => __('Desktop', 'visualcomposer'),
            'tabletLandscape' => __('Tablet Landscape', 'visualcomposer'),
            'tabletPortrait' => __('Tablet Portrait', 'visualcomposer'),
            'mobileLandscape' => __('Mobile Landscape', 'visualcomposer'),
            'mobilePortrait' => __('Mobile Portrait', 'visualcomposer'),
            'settings' => __('Settings', 'visualcomposer'),
            'layout' => __('Layout', 'visualcomposer'),
            'update' => __('Update', 'visualcomposer'),
            'menu' => __('Menu', 'visualcomposer'),
            'viewPage' => __('View Page', 'visualcomposer'),
            'backToWordpress' => __('Back to WordPress', 'visualcomposer'),
            'wordPressDashboard' => __('WordPress Dashboard', 'visualcomposer'),
            'publish' => __('Publish', 'visualcomposer'),
            'submitForReview' => __('Submit for Review', 'visualcomposer'),
            'saveDraft' => __('Save Draft', 'visualcomposer'),
            'activationButtonTitle' => vchelper('License')->activationButtonTitle(),
            'goPremium' => __('Go Premium', 'visualcomposer'),
            'getFreeLicense' => __('Get Free License', 'visualcomposer'),
            'activated' => __('Activated', 'visualcomposer'),
            'close' => __('Close', 'visualcomposer'),
            'emptyTreeView' => __(
                'There is no content on the page - start by adding an element or template.',
                'visualcomposer'
            ),
            'customCSS' => __('Custom CSS', 'visualcomposer'),
            'localCSS' => __('Local CSS', 'visualcomposer'),
            'localCSSLabel' => __('Local CSS will be applied to this particular page only.', 'visualcomposer'),
            'globalCSS' => __('Global CSS', 'visualcomposer'),
            'globalCSSLabel' => __('Global CSS will be applied sitewide.', 'visualcomposer'),
            'customJS' => __('Custom JavaScript', 'visualcomposer'),
            'localJS' => __('Local JavaScript', 'visualcomposer'),
            'localJSLabel' => __('Local JavaScript will be applied to this particular page only.', 'visualcomposer'),
            'globalJS' => __('Global JavaScript', 'visualcomposer'),
            'globalJSLabel' => __('Apply custom Global Javascript code sitewide.', 'visualcomposer'),
            'save' => __('Save', 'visualcomposer'),
            'templateName' => __('Template Name', 'visualcomposer'),
            'saveTemplate' => __('Save Template', 'visualcomposer'),
            'removeTemplate' => __('Remove Template', 'visualcomposer'),
            'templateSaveFailed' => __('Failed to save the template.', 'visualcomposer'),
            'downloadMoreTemplates' => __('Download More Templates', 'visualcomposer'),
            'getMoreElements' => __('Get More Elements', 'visualcomposer'),
            'getMoreTemplates' => __('Get More Templates', 'visualcomposer'),
            'noTemplatesFound' => __(
            // @codingStandardsIgnoreLine
                'There are no templates yet. Save the current layout as a template or download templates from Visual Composer Hub.',
                'visualcomposer'
            ),
            'notRightTemplatesFound' => __(
                'Didn\'t find the right template? Check out Visual Composer Hub for more templates.',
                'visualcomposer'
            ),
            'accessVisualComposerHubToDownload' => __(
                'Access the Visual Composer Hub - download additional elements, blocks, templates, and addons.',
                'visualcomposer'
            ),
            'removeTemplateWarning' => __('Do you want to delete this template?', 'visualcomposer'),
            'removeElementPresetWarning' => __('Do you want to delete this element preset?', 'visualcomposer'),
            'templateRemoveFailed' => __('Failed to remove the template', 'visualcomposer'),
            'blankPageHeadingSelect' => __('Name Your Page, Select', 'visualcomposer'),
            'blankPageHeadingPart1' => __('Name The Page', 'visualcomposer'),
            'blankPageHeadingPart2' => __('Layout and Start Building', 'visualcomposer'),
            'blankPageTitleHeadingPart1' => __('Name Your ', 'visualcomposer'),
            'blankPageTitleHeadingPart2' => __('and Start Building', 'visualcomposer'),
            'blankPageHelperText' => __(
            // @codingStandardsIgnoreLine
                'Start by adding an element to the layout or select one of the pre-defined templates.',
                'visualcomposer'
            ),
            'blankPageInputPlaceholderText' => __('Page title', 'visualcomposer'),
            'addTemplateHelperText' => __(
            // @codingStandardsIgnoreLine
                'Didn\'t find a perfect template? Get a premium license to download templates from the Visual Composer Hub.',
                'visualcomposer'
            ),
            'addElementHelperText' => __(
            // @codingStandardsIgnoreLine
                'Didn\'t find an element? Get a premium license to download elements from the Visual Composer Hub.',
                'visualcomposer'
            ),
            'hubHelperText' => __(
            // @codingStandardsIgnoreLine
                'Get a premium license to access Visual Composer Hub. Download professionally designed templates, more content elements, extensions, and more.',
                'visualcomposer'
            ),
            'add' => __('Add', 'visualcomposer'),
            'rowLayout' => __('Row Layout', 'visualcomposer'),
            'edit' => __('Edit', 'visualcomposer'),
            'designOptions' => __('Design Options', 'visualcomposer'),
            'clone' => __('Clone', 'visualcomposer'),
            'copy' => __('Copy', 'visualcomposer'),
            'paste' => __('Paste', 'visualcomposer'),
            'pasteAfter' => __('Paste After', 'visualcomposer'),
            'remove' => __('Remove', 'visualcomposer'),
            'move' => __('Move', 'visualcomposer'),
            'searchContentElements' => __('Search for content elements', 'visualcomposer'),
            'searchContentElementsAndTemplates' => __('Search for content elements and templates', 'visualcomposer'),
            'searchContentTemplates' => __('Search templates', 'visualcomposer'),
            'templateAlreadyExists' => __(
                'A template with this name already exists. Choose a different template name.',
                'visualcomposer'
            ),
            'templateContentEmpty' => __('There is no content on the page to be saved.', 'visualcomposer'),
            'specifyTemplateName' => __('Enter the template name to save this page as a template.', 'visualcomposer'),
            'addOneColumn' => __('Add one column', 'visualcomposer'),
            'addTwoColumns' => __('Add two columns', 'visualcomposer'),
            'addThreeColumns' => __('Add three columns', 'visualcomposer'),
            'addFourColumns' => __('Add four columns', 'visualcomposer'),
            'addFiveColumns' => __('Add five columns', 'visualcomposer'),
            'addCustomRowLayout' => __('Add custom row layout', 'visualcomposer'),
            'addTextBlock' => __('Add a text block', 'visualcomposer'),
            'frontendEditor' => __('Edit with Visual Composer', 'visualcomposer'),
            'classicEditor' => __('Classic Editor', 'visualcomposer'),
            'openFrontendEditorFromClassic' => __(
            // @codingStandardsIgnoreLine
                'You are switching to Visual Composer. Visual Composer will load the latest version of the content created with the website builder.',
                'visualcomposer'
            ),
            'enableClassicEditorConfirmMessage' => __(
            // @codingStandardsIgnoreLine
                'You are switching to the Classic Editor. The content created with Visual Composer will be copied to Classic Editor (style changes may apply). Any changes made in the Classic Editor will not be synced with the Visual Composer layout. Do you want to proceed?',
                'visualcomposer'
            ),
            'blankPage' => __('Blank Page', 'visualcomposer'),
            'searchTemplates' => __('Search for templates by name and description', 'visualcomposer'),
            'noResultOpenHub' => __('Open Visual Composer Hub', 'visualcomposer'),
            'notRightElementsFound' => __(
                'Didn\'t find an element? Check the Visual Composer Hub for more elements.',
                'visualcomposer'
            ),
            'activationFailed' => __(
                'An error occurred during the Visual Composer extension download process.
<ul><li>- Check if your server has a connection to the Internet.</li><li>- Check if your server proxy has proper configuration settings.</li><li>- Check your server firewall settings and access to https://account.visualcomposer.io</li><li>- Check if your server has access to the <a href="https://aws.amazon.com/ru/premiumsupport/knowledge-center/s3-find-ip-address-ranges/" target="_blank" rel="noopener noreferrer">Amazon AWS Region: `us-west-2` IP</a></li></ul>',
                'visualcomposer'
            ),
            'alreadyHaveALicenseText' => __(
                'Already have a license? Log in to <a href="{link}" class="vcv-activation-input-field-forgot-license-link" target="_blank" rel="noopener noreferrer">My Visual Composer</a> to find it.',
                'visualcomposer'
            ),
            'doMoreWithVcText' => __(
                'Do more with the Visual Composer Hub',
                'visualcomposer'
            ),
            'nothingFound' => __('Nothing found', 'visualcomposer'),
            'addImage' => __('Add an image', 'visualcomposer'),
            'removeImage' => __('Remove the image', 'visualcomposer'),
            'moveImage' => __('Move the image', 'visualcomposer'),
            'editReplaceImage' => __('Edit or replace the image', 'visualcomposer'),
            'addLink' => __('Add a link', 'visualcomposer'),
            'selectUrl' => __('Select a URL', 'visualcomposer'),
            'insertEditLink' => __('Insert or edit a link', 'visualcomposer'),
            'urlInputPlaceholder' => __('Enter the destination URL', 'visualcomposer'),
            'linkToExistingContent' => __('Or link to an existing content', 'visualcomposer'),
            'searchExistingContent' => __('Search existing content', 'visualcomposer'),
            'popup' => __('Popup', 'visualcomposer'),
            'selectPopupTemplate' => __('Select a popup template', 'visualcomposer'),
            'onPageLoad' => __('Popup on every page load', 'visualcomposer'),
            'onExitIntent' => __('Popup on exit-intent', 'visualcomposer'),
            'onElementId' => __('Popup on element ID', 'visualcomposer'),
            'delayInSeconds' => __('Delay (seconds)', 'visualcomposer'),
            'showEveryDays' => __('Show every (days)', 'visualcomposer'),
            'popupOpenOnPageLoad' => __('The popup will open once the page is loaded.', 'visualcomposer'),
            'popupOpenOnExitIntent' => __('The popup will load if a user tries to exit the page.', 'visualcomposer'),
            'popupOpenOnElementId' => __(
                'The popup will appear when an element with a unique Element ID will be displayed (scrolled to) on the page.',
                'visualcomposer'
            ),
            'onClickAction' => __('OnClick action', 'visualcomposer'),
            'noExistingContentFound' => __('Nothing found', 'visualcomposer'),
            'openLinkInTab' => __('Open the link in a new tab', 'visualcomposer'),
            'addNofollow' => __('Add "nofollow" option to the link', 'visualcomposer'),
            'enterDestinationUrl' => __('Enter the destination URL', 'visualcomposer'),
            'titleAttributeText' => __('The title attribute will be displayed on the link hover.', 'visualcomposer'),
            'title' => __('Title', 'visualcomposer'),
            'bundleUpdateFailed' => __('Visual Composer Hub update failed, try again.', 'visualcomposer'),
            'preview' => __('Preview', 'visualcomposer'),
            'previewChanges' => __('Preview Changes', 'visualcomposer'),
            'savingResults' => __('Saving Results', 'visualcomposer'),
            'hideOff' => __('Hide Element', 'visualcomposer'),
            'hideOn' => __('Show Element', 'visualcomposer'),
            'elementIsHidden' => __('Element is Hidden', 'visualcomposer'),
            'editFormSettingsText' => __('Element Settings', 'visualcomposer'),
            'presetsHelperText' => __(
                'Change default parameters to create a unique element. The new element will be added to the Element Library.',
                'visualcomposer'
            ),
            'saveAsPreset' => __('Save as a Preset', 'visualcomposer'),
            'saveAsTemplate' => __('Save as a Template', 'visualcomposer'),
            'downloadingInitialExtensions' => __('Downloading initial extensions', 'visualcomposer'),
            'downloadingAssets' => __('Downloading assets {i} of {cnt}: {name}', 'visualcomposer'),
            'downloading' => __('Downloading', 'visualcomposer'),
            'postUpdateText' => __('Updating posts {i} in {cnt}: {name}', 'visualcomposer'),
            'postUpdateAjaxRequestError' => __('Failed to load: {file}', 'visualcomposer') . ' #10077',
            'none' => __('None', 'visualcomposer'),
            'mobileTooltipText' => __(
            // @codingStandardsIgnoreLine
                'Double-tap on an element to open the edit window. Tap and hold to initiate drag and drop.',
                'visualcomposer'
            ),
            'template' => __('Template', 'visualcomposer'),
            'defaultTemplate' => __('Theme Default', 'visualcomposer'),
            'pageTemplateDescription' => __(
                'To apply a template save changes and reload the page.',
                'visualcomposer'
            ),
            'pageTemplateReloadDescription' => __(
                'To apply title, save changes, and reload the page.',
                'visualcomposer'
            ),
            'pageTitleDescription' => __(
                'To apply title changes save changes and reload the page',
                'visualcomposer'
            ),
            'pageTitleDisableDescription' => __('Disable the page title', 'visualcomposer'),
            'successElementDownload' => __(
                '{name} has been successfully downloaded from the Visual Composer Hub and added to the Element Library.',
                'visualcomposer'
            ),
            'successAddonDownload' => __(
                '{name} has been successfully downloaded from the Visual Composer Hub and added to the Element Library. To finish the installation process reload the page.',
                'visualcomposer'
            ),
            'copyElementWithId' => __(
                'The element was copied without a unique Element ID. Adjust the Element ID by editing the element.',
                'visualcomposer'
            ),
            'cloneElementWithId' => __(
                'The element was cloned without a unique Element ID. Adjust the Element ID by editing the element.',
                'visualcomposer'
            ),
            'licenseErrorElementDownload' => __(
                'Failed to download the element (license expired or request timed out)',
                'visualcomposer'
            ),
            'defaultErrorElementDownload' => __('Failed to download the element', 'visualcomposer'),
            'feOopsMessageDefault' => __(
            // @codingStandardsIgnoreLine
                'It seems that something went wrong with loading the content. Make sure you are loading the correct content and try again.',
                'visualcomposer'
            ),
            'feOopsButtonTextDefault' => __('Return to WordPress dashboard', 'visualcomposer'),
            'feOopsTryAgainButtonText' => __('Try Again', 'visualcomposer'),
            'feOopsReportAnIssueButtonText' => __('Report an Issue', 'visualcomposer'),
            'feOopsMessagePageForPosts' => __(
            // @codingStandardsIgnoreLine
                'It seems you are trying to edit the archive page which displays post archives instead of content. Before the edit, make sure to convert it to a static page via your WordPress admin.',
                'visualcomposer'
            ),
            'feOopsButtonTextPageForPosts' => __('Return to WordPress dashboard', 'visualcomposer'),
            'replaceElementText' => __(
                'Replace the {elementLabel} within this element with another {elementLabel} from the Element Library.',
                'visualcomposer'
            ),
            'replaceElementEditForm' => __(
                'Replace the element with a different element from the same category.',
                'visualcomposer'
            ),
            'errorReportSubmitted' => __(
                'We have received your request - the ticket has been created. Our support representative will contact you shortly.',
                'visualcomposer'
            ),
            'backToWpAdminText' => __(
                'Return to WordPress dashboard',
                'visualcomposer'
            ),
            'thankYouText' => __(
                'Thank You!',
                'visualcomposer'
            ),
            'newPluginVersionIsAvailable' => sprintf(
                __(
                    'There is a new version of Visual Composer Website Builder available. <a href="%s">Update now</a> to version %s.',
                    'visualcomposer'
                ),
                self_admin_url('plugins.php'),
                $wpHelper->getUpdateVersionFromWordpressOrg()
            ),
            'chooseHFS' => sprintf(
                __(
                    'Select a %s or %screate a new one%s.',
                    'visualcomposer'
                ),
                '{name}',
                '<a href="{link}" target="_blank" rel="noopener noreferrer">',
                '</a>'
            ),
            'selectHFS' => __(
                'Default',
                'visualcomposer'
            ),
            'selectHFSGlobal' => __(
                'Global Default',
                'visualcomposer'
            ),
            'selectHFSLayout' => __(
                'Layout Default',
                'visualcomposer'
            ),
            'elementDownloadRequiresUpdate' => __(
                'Update Visual Composer plugin to the most recent version to download this content element.',
                'visualcomposer'
            ),
            'templateDownloadRequiresUpdate' => __(
                'Update Visual Composer plugin to the most recent version to download this template.',
                'visualcomposer'
            ),
            'addonDownloadRequiresUpdate' => __(
                'Update Visual Composer plugin to the most recent version to download this addon.',
                'visualcomposer'
            ),
            'startBuildingHFSButton' => __('Start Building', 'visualcomposer'),
            'startPageHFSInputPlaceholder' => sprintf(
                __(
                    '%s Name',
                    'visualcomposer'
                ),
                '{name}'
            ),
            'themeDefaultDescription' => __(
                'WordPress theme defined layout for a specific page, post, or custom post type.',
                'visualcomposer'
            ),
            'vcBoxedDescription' => __(
                'A blank page layout with a boxed content area in the middle of the page without header, footer, or sidebar.',
                'visualcomposer'
            ),
            'vcBlankDescription' => __(
                'A full-width blank page without header, footer, or sidebar.',
                'visualcomposer'
            ),
            'vcDefaultDescription' => __(
                'A default layout for the post type created in the Visual Composer Theme Builder.',
                'visualcomposer'
            ),
            'vcThemeHeaderFooterDescription' => __(
                'A default layout with custom header, content, and footer area.',
                'visualcomposer'
            ),
            'vcThemeHeaderFooterSidebarDescription' => __(
                'A default layout with custom header, content, footer, and sidebar area on the right.',
                'visualcomposer'
            ),
            'vcThemeHeaderFooterLeftSidebarDescription' => __(
                'A default layout with custom header, content, footer, and sidebar area on the left.',
                'visualcomposer'
            ),
            'availableInPremium' => __(
                'Available in the Premium version.',
                'visualcomposer'
            ),
            'gutenbergDoesntWorkProperly' => __(
                "Gutenberg plugin doesn't work properly. Check the Gutenberg plugin.",
                'visualcomposer'
            ),
            'free' => __('Free', 'visualcomposer'),
            'premium' => __('Premium', 'visualcomposer'),
            'removeAll' => __('Remove All', 'visualcomposer'),
            'continueImport' => __('Continue importing', 'visualcomposer'),
            'backToImport' => __('Back to import', 'visualcomposer'),
            'startingImportProcess' => __('Starting import process...', 'visualcomposer'),
            'backToParent' => __('Back to parent', 'visualcomposer'),
            'editorSettings' => __('Editor Settings', 'visualcomposer'),
            'clickToEditColumnValue' => __('Click to edit column value', 'visualcomposer'),
            'addOn' => __('Addon', 'visualcomposer'),
            'doNotCloseWhileUpdateText' => __(
                'Don\'t close this window while the download is in progress.',
                'visualcomposer'
            ),
            'createYourWordpressWebsite' => __('Create Your WordPress Website.', 'visualcomposer'),
            'anyLayoutFastAndEasy' => __('Any Layout. Fast and Easy.', 'visualcomposer'),
            'skipThisPostText' => __('Skip this post', 'visualcomposer'),
            'getMoreText' => __('Connect to Visual Composer Hub.', 'visualcomposer'),
            'getMoreTextSubText' => __('Do More.', 'visualcomposer'),
            'downloadFromHubText' => vchelper('License')->hubActivationText(),
            'getStartedText' => __('Get Started', 'visualcomposer'),
            'sendingErrorReport' => __('Sending Error Report', 'visualcomposer'),
            'doNotCloseWhileSendingErrorReportText' => __(
                'Don\'t close this window while sending an error is in the process.',
                'visualcomposer'
            ),
            'somethingWentWrong' => __('Oops ... Something Went Wrong', 'visualcomposer'),
            'goToHubButtonDescription' => __(
                'Access the Visual Composer Hub - download additional elements, blocks, templates, and addons.',
                'visualcomposer'
            ),
            'settingsGlobalTemplateCustomJsLocal' => __(
                'Add custom JavaScript code to insert it locally on this page in <footer>. Insert Google Analytics, Tag Manager, Kissmetrics, or other JavaScript code snippets.',
                'visualcomposer'
            ),
            'settingsCustomJsLocal' => __(
                'Add custom JavaScript code to insert it locally on this page in <header> or <footer>. Insert Google Analytics, Tag Manager, Kissmetrics, or other JavaScript code snippets.',
                'visualcomposer'
            ),
            'settingsCustomJsGlobal' => __(
                'Add custom JavaScript code to insert it globally on every page in <header> or <footer>. Insert Google Analytics, Tag Manager, Kissmetrics, or other JavaScript code snippets.',
                'visualcomposer'
            ),
            'openEditForm' => __('Open the Edit Form', 'visualcomposer'),
            'shortcode' => __(
                'Shortcode',
                'visualcomposer'
            ),
            'shortcodeElementAttrDescription' => __(
                'Paste shortcode with all the parameters. The shortcode must be installed on your WordPress site via a plugin or theme.',
                'visualcomposer'
            ),
            'activatePremium' => __(
                'Activate Premium',
                'visualcomposer'
            ),
            'searchPhotosOnUnsplash' => __(
                'Search for free high-resolution photos on Unsplash',
                'visualcomposer'
            ),
            'getPhotosWithPremiumText' => __(
                'Download and Add Free Beautiful Photos to Your Site With Visual Composer Premium',
                'visualcomposer'
            ),
            'getPhotosText' => __(
                'Download and Add Free Beautiful Photos to Your Site',
                'visualcomposer'
            ),
            'noAccessCheckLicence' => __(
                'No access, check your license.',
                'visualcomposer'
            ),
            'noConnectionToUnsplash' => __(
                'Could not connect to Unsplash Server.',
                'visualcomposer'
            ),
            'imageDownloadedToMediaLibrary' => __(
                'The image has been downloaded to the Media Library.',
                'visualcomposer'
            ),
            'couldNotParseData' => __(
                'Could not parse data from the server.',
                'visualcomposer'
            ),
            'small' => __(
                'Small',
                'visualcomposer'
            ),
            'medium' => __(
                'Medium',
                'visualcomposer'
            ),
            'large' => __(
                'Large',
                'visualcomposer'
            ),
            'images' => __(
                'images',
                'visualcomposer'
            ),
            'downloadImageFromUnsplash' => __(
                'Download images from Unsplash to the Media Library',
                'visualcomposer'
            ),
            'permalink' => __(
                'Permalink',
                'visualcomposer'
            ),
            'spreadTheWordText' => __(
                'Enjoying Visual Composer Website Builder? Let your friends know about it - spread the word.',
                'visualcomposer'
            ),
            'dynamicFieldsOpenText' => __(
                'Insert dynamic content',
                'visualcomposer'
            ),
            'dynamicFieldsEditText' => __(
                'Edit dynamic content',
                'visualcomposer'
            ),
            'dynamicFieldsCloseText' => __(
                'Remove dynamic content',
                'visualcomposer'
            ),
            'dynamicAutocompleteDescription' => __(
                'Select page, post, or custom post type.',
                'visualcomposer'
            ),
            'dynamicAutocompleteToggleDescription' => __(
                'By default, dynamic content is taken from the current post.',
                'visualcomposer'
            ),
            'dynamicAutocompleteToggleLabel' => __(
                'Set custom post source',
                'visualcomposer'
            ),
            'dynamicSelectCustomField' => __(
                'Select a custom field',
                'visualcomposer'
            ),
            'dynamicContent' => __(
                'Dynamic Content',
                'visualcomposer'
            ),
            'noValueSet' => __(
                'No value set',
                'visualcomposer'
            ),
            'activatePremiumToUnlockStockImages' => __(
                'Activate Premium to Unlock Unsplash',
                'visualcomposer'
            ),
            'getAccessToTheVisualComposerHub' => __(
                'Get Access to the Visual Composer Hub',
                'visualcomposer'
            ),
            'freeLicense' => __(
                'Free License',
                'visualcomposer'
            ),
            'themeBuilderWithHFS' => __(
                'A theme builder with Header, Footer, and Sidebar editor',
                'visualcomposer'
            ),
            'wooCommerceCompatibility' => __(
                'WooCommerce compatibility',
                'visualcomposer'
            ),
            'premiumSupportAndUpdates' => __(
                'Premium support and updates',
                'visualcomposer'
            ),
            'premiumSupport' => __(
                'Premium support',
                'visualcomposer'
            ),
            'regularUpdates' => __(
                'Regular updates',
                'visualcomposer'
            ),
            'activateFree' => __(
                'I Want a Free License',
                'visualcomposer'
            ),
            'premiumLicense' => __(
                'Premium License',
                'visualcomposer'
            ),
            'unlimitedAccessToExtensions' => __(
                'Unlimited access to the Visual Composer Hub of elements, templates, and addons',
                'visualcomposer'
            ),
            'limitedAccessToExtensions' => __(
                'Limited access to the Visual Composer Hub of elements, templates, and addons',
                'visualcomposer'
            ),
            'iWantToGoPremium' => __(
                'I want to go premium',
                'visualcomposer'
            ),
            'editThemeTemplate' => sprintf(
                __(
                    '%sEdit%s this %s.%s',
                    'visualcomposer'
                ),
                '<div class="vcv-custom-page-templates-edit-link"><a href="{link}" target="_blank" rel="noopener noreferrer">',
                '</a>',
                '{editLinkTitle}',
                '</div>'
            ),
            'enterYourLicenseKey' => __(
                'Enter your license key',
                'visualcomposer'
            ),
            'elementHasBeenSaved' => __(
                'The element has been successfully saved.',
                'visualcomposer'
            ),
            'elementNameAlreadyExists' => __(
                'The element with such a name already exists!',
                'visualcomposer'
            ),
            'enterPresetNameToSave' => __(
                'Enter a preset name to save the element as a preset!',
                'visualcomposer'
            ),
            'templateSaved' => __(
                'The template has been successfully saved.',
                'visualcomposer'
            ),
            'templateHelperText' => __(
                'Change the default parameters of sections and their content to create a unique block template. The new block template will be added to your library.',
                'visualcomposer'
            ),
            'presetRemovedText' => __(
                'Element preset has been removed.',
                'visualcomposer'
            ),
            'feedbackVoteHeadingText' => __(
                'How disappointed would you be if this product no longer existed tomorrow?',
                'visualcomposer'
            ),
            'veryDisappointed' => __(
                'Very disappointed',
                'visualcomposer'
            ),
            'somewhatDisappointed' => __(
                'Somewhat disappointed',
                'visualcomposer'
            ),
            'disappointed' => __(
                'Not disappointed (it really isn’t that useful)',
                'visualcomposer'
            ),
            'feedbackVoteButtonText' => __(
                'Submit Your Feedback',
                'visualcomposer'
            ),
            'negativeReviewHeadingText' => __(
                'How can we become better?',
                'visualcomposer'
            ),
            'positiveReviewText' => __(
                'Thanks for your feedback. Please rate us on WordPress.org and help others to discover Visual Composer.',
                'visualcomposer'
            ),
            'negativeReviewText' => __(
                'Your opinion matters. Help us to improve by taking a quick survey.',
                'visualcomposer'
            ),
            'positiveReviewButtonText' => __(
                'Write Your Review',
                'visualcomposer'
            ),
            'negativeReviewButtonText' => __(
                'Leave Your Feedback',
                'visualcomposer'
            ),
            'likeText' => __(
                'Like',
                'visualcomposer'
            ),
            'dislikeText' => __(
                'Dislike',
                'visualcomposer'
            ),
            'replacePopupTemplateText' => __(
                'The current popup will be replaced with the popup template.',
                'visualcomposer'
            ),
            // Plugin deactivation popup section
            'quickFeedback' => __(
                'QUICK FEEDBACK',
                'visualcomposer'
            ),
            'pleaseShareWhy' => __(
                'If you have a moment, please share why you are deactivating Visual Composer:',
                'visualcomposer'
            ),
            'noLongerNeed' => __(
                'I no longer need the plugin',
                'visualcomposer'
            ),
            'foundABetterPlugin' => __(
                'I found a better plugin',
                'visualcomposer'
            ),
            'pleaseShareWhichPlugin' => __(
                'Please share which plugin',
                'visualcomposer'
            ),
            'couldntGetThePluginToWork' => __(
                'I couldn\'t get the plugin to work',
                'visualcomposer'
            ),
            'itsATemporaryDeactivation' => __(
                'It\'s a temporary deactivation',
                'visualcomposer'
            ),
            'other' => __(
                'Other',
                'visualcomposer'
            ),
            'pleaseShareTheReason' => __(
                'Please share the reason',
                'visualcomposer'
            ),
            'submitAndDeactivate' => __(
                'Submit &amp; Deactivate',
                'visualcomposer'
            ),
            'skipAndDeactivate' => __(
                'Skip &amp; Deactivate',
                'visualcomposer'
            ),
            'downloadAddonText' => __(
                'Download Addon',
                'visualcomposer'
            ),
            'installedText' => __(
                'Installed',
                'visualcomposer'
            ),
            'availableInPremiumText' => __(
                'Available in Premium',
                'visualcomposer'
            ),
            'dontForgetToTweetText' => __(
                'Don\'t forget to tweet about Visual Composer Website Builder. Thanks!',
                'visualcomposer'
            ),
            'download' => __(
                'Download',
                'visualcomposer'
            ),
            'install' => __(
                'Install',
                'visualcomposer'
            ),
            'activate' => __(
                'Activate',
                'visualcomposer'
            ),
            'takeTutorialTemplate' => __(
                'Try The Tutorial Template',
                'visualcomposer'
            ),
            'createNewPage' => __(
                'Create a new page',
                'visualcomposer'
            ),
            'buildYourSiteWithDragAndDrop' => __(
                'Build your site with the help of the drag and drop builder straight from the frontend editor - it\'s that easy.',
                'visualcomposer'
            ),
            'bundledInAThemeText' => __(
                'It seems that your copy of Visual Composer was bundled in a theme - use your Envato purchase key to activate Visual Composer Premium. You can also activate Visual Composer with a free or premium license.',
                'visualcomposer'
            ),
            'lockElementText' => __(
                'Lock Element',
                'visualcomposer'
            ),
            'url' => __(
                'URL',
                'visualcomposer'
            ),
            'openPopup' => __(
                'Open Popup',
                'visualcomposer'
            ),
            'closePopup' => __(
                'Close Popup',
                'visualcomposer'
            ),
            'closingThePopupDescription' => __(
                'Closing the popup option will close the current popup.',
                'visualcomposer'
            ),
            'lockedElementText' => __(
                'The element has been locked by your site Administrator.',
                'visualcomposer'
            ),
            'elementsLock' => __(
                'Element lock',
                'visualcomposer'
            ),
            'lockAllText' => __(
                'Lock All Elements',
                'visualcomposer'
            ),
            'unlockAllText' => __(
                'Unlock All Elements',
                'visualcomposer'
            ),
            'lockAllDescriptionText' => __(
                'Lock or unlock all elements on the page. Users with Administrator role access will be able to edit elements.',
                'visualcomposer'
            ),
            'lockSpecificDescriptionText' => __(
                'Lock or unlock specific elements under the element edit window.',
                'visualcomposer'
            ),
            'lockAllNotificationText' => __(
                'All elements on the page have been locked. Only the Administrator role can edit the content.',
                'visualcomposer'
            ),
            'unlockAllNotificationText' => __(
                'All elements on the page have been unlocked. All users with the edit option can edit the content.',
                'visualcomposer'
            ),
            'lockElementNotificationText' => __(
                'The element has been locked and can be edited only by the Administrator role.',
                'visualcomposer'
            ),
            'unlockElementNotificationText' => __(
                'The element has been unlocked and can be edited by all roles with the edit option.',
                'visualcomposer'
            ),
            'lockContainerNotificationText' => __(
                'The element and all inner elements have been locked and can be edited only by the Administrator role.',
                'visualcomposer'
            ),
            'unlockContainerNotificationText' => __(
                'The element and all inner elements have been unlocked and can be edited by all roles with the edit option.',
                'visualcomposer'
            ),
            'unsavedChangesText' => __(
                'Changes may not be saved.',
                'visualcomposer'
            ),
            'VCInsights' => __(
                'Visual Composer Insights',
                'visualcomposer'
            ),
            'all' => __(
                'All',
                'visualcomposer'
            ),
            'critical' => __(
                'Critical',
                'visualcomposer'
            ),
            'warnings' => __(
                'Warnings',
                'visualcomposer'
            ),
            'success' => __(
                'Success',
                'visualcomposer'
            ),
            'insightsImageSizeBigTitle' => __(
                'Image size exceeded',
                'visualcomposer'
            ),
            'insightsBgImageSizeBigTitle' => __(
                'Background Image size exceeded',
                'visualcomposer'
            ),
            'insightsImageSizeBigDescription' => __(
                'The image size exceeds %s. This may impact the page\'s performance and SEO ranking.',
                'visualcomposer'
            ),
            'insightsImageAltAttributeMissingTitle' => __(
                'The image ALT attribute is missing',
                'visualcomposer'
            ),
            'insightsImageAltAttributeMissingDescription' => __(
                'Missing the ALT attribute for the image. This may impact the SEO ranking of the page.',
                'visualcomposer'
            ),
            'insightsH1MissingTitle' => __(
                'H1 title missing on the page',
                'visualcomposer'
            ),
            'insightsH1MissingDescription' => __(
                'The page is missing the H1 tag. This may impact the SEO ranking of the page.',
                'visualcomposer'
            ),
            'insightsH1ExistsTitle' => __(
                'H1 title exists on the page',
                'visualcomposer'
            ),
            'insightsH1ExistsDescription' => __(
                'The page has an H1 tag. Great job!',
                'visualcomposer'
            ),
            'insightsMultipleH1Title' => __(
                'More than one H1 tag found',
                'visualcomposer'
            ),
            'insightsMultipleH1Description' => __(
                'You have more than one H1 tag on your page which is bad for SEO ranking. Make sure to keep only one H1 and use lower-level headings (H2, H3, etc.) to structure your content.',
                'visualcomposer'
            ),
            'insightsImageAltAttributeExistsTitle' => __(
                'All images have ALT attributes',
                'visualcomposer'
            ),
            'insightsImageAltAttributeExistsDescription' => __(
                'All images have ALT attributes. Great Job!',
                'visualcomposer'
            ),
            'insightsImagesSizeProperTitle' => __(
                'All images have optimal sizes',
                'visualcomposer'
            ),
            'insightsImagesSizeProperDescription' => __(
                'All images have optimal sizes. Awesome!',
                'visualcomposer'
            ),
            'insightsNoContentOnPageTitle' => __(
                'No content found',
                'visualcomposer'
            ),
            'insightsNoContentOnPageDescription' => __(
                'It seems this page has no content. Make sure to add elements or templates.',
                'visualcomposer'
            ),
            'insightsNoCriticalIssuesFoundTitle' => __(
                'No Critical Issues Found',
                'visualcomposer'
            ),
            'insightsNoCriticalIssuesFoundDescription' => __(
                'There are no critical issues on the page. Congratulations and keep up the good work!',
                'visualcomposer'
            ),
            'insightsNoWarningsFoundTitle' => __(
                'No Warnings Found',
                'visualcomposer'
            ),
            'insightsNoWarningsFoundDescription' => __(
                'There are no warnings on the page. Congratulations and keep up the good work!',
                'visualcomposer'
            ),
            'insightsParagraphLengthTitle' => __(
                'Paragraph length',
                'visualcomposer'
            ),
            'insightsParagraphLengthDescription' => __(
                'Paragraph word count is',
                'visualcomposer'
            ),
            'insightsParagraphLengthDescriptionOk' => __(
                'You set a proper length for the paragraphs. Great job!',
                'visualcomposer'
            ),
            'insightsParagraphLengthDescription150' => __(
                'The paragraph contains more than 150 words. This may affect readability.',
                'visualcomposer'
            ),
            'insightsParagraphLengthDescription200' => __(
                'The paragraph contains more than 200 words. This may affect readability.',
                'visualcomposer'
            ),
            'insightsTitleTooLong' => __(
                'The page title is too long.',
                'visualcomposer'
            ),
            'insightsTitleTooLong60' => __(
                'The page title exceeds 60 characters which are considered too long. Make sure to adjust it between 10 to 60 characters.',
                'visualcomposer'
            ),
            'insightsTitleTooLong100' => __(
                'The page title contains more than 100 characters and will be cut off by search engines. Shorten your page title!',
                'visualcomposer'
            ),
            'insightsTitleTooShort' => __(
                'The page title is too short.',
                'visualcomposer'
            ),
            'insightsTitleTooShortDescription' => __(
                'The page title is too short. Make sure to adjust the title between 10 to 60 characters.',
                'visualcomposer'
            ),
            'insightsTitleGood' => __(
                'The page title length is optimal.',
                'visualcomposer'
            ),
            'noIndexMetaTag' => __(
                'It seems that this page is set to "noindex" directive.',
                'visualcomposer'
            ),
            'noIndexMetaTagDescription' => __(
                'Using "noindex" will exclude this page from search results. If you have set "noindex" on purpose, ignore this warning.',
                'visualcomposer'
            ),
            'insightsGAMissingTitle' => __(
                'Google Analytics Tag is missing.',
                'visualcomposer'
            ),
            'insightsGAMissingTitleOK' => __(
                'Google Analytics Tag is added to the page.',
                'visualcomposer'
            ),
            'insightsGAMissingDescription' => __(
                'It seems Google Analytics Tags is not added to the page.',
                'visualcomposer'
            ),
            'insightsGAMissingDescriptionOK' => __(
                'Google Analytics Tag is added to the page. Great job!',
                'visualcomposer'
            ),
            'insightsContentLengthTitle' => __(
                'Text length',
                'visualcomposer'
            ),
            'insightsContentLengthDescription300' => __(
                'The text contains %length words. This is far below the recommended minimum of 300 words.',
                'visualcomposer'
            ),
            'insightsContentLengthDescriptionOk' => __(
                'The text contains %length words. Good job!',
                'visualcomposer'
            ),
            'noInboundLinks' => __(
                'No internal links appear on the page.',
                'visualcomposer'
            ),
            'noInboundLinksDescription' => __(
                'There are no internal links on the page. Add some!',
                'visualcomposer'
            ),
            'noOutboundLinks' => __(
                'No external links appear on the page.',
                'visualcomposer'
            ),
            'noOutboundLinksDescription' => __(
                'There are no external links to the page. Add some!',
                'visualcomposer'
            ),
            'onlyOneElementCanBeAddedToPage' => __(
                'Only one %element element can be added to the page.',
                'visualcomposer'
            ),
            'onlyTwoElementsCanBeAddedToPage' => __(
                'Only two %element elements can be added to the page.',
                'visualcomposer'
            ),
            'onlyThreeElementsCanBeAddedToPage' => __(
                'Only three %element elements can be added to the page.',
                'visualcomposer'
            ),
            'onlyFourElementsCanBeAddedToPage' => __(
                'Only four %element elements can be added to the page.',
                'visualcomposer'
            ),
            'onlyFiveElementsCanBeAddedToPage' => __(
                'Only five %element elements can be added to the page.',
                'visualcomposer'
            ),
            'elementLimitDefaultText' => __(
                'Only %count %element elements can be added to the page.',
                'visualcomposer'
            ),
            'contentAreaPlaceholderText' => __(
                'This is a default WordPress content area where the post or page content will be displayed.',
                'visualcomposer'
            ),
            'activateHub' => __(
                'Activate Hub',
                'visualcomposer'
            ),
            'activateVisualComposerHub' => __(
                'Activate Visual Composer Hub',
                'visualcomposer'
            ),
            'makeTheFinalStep' => __(
                'Make the final step! Enter your license key to activate Visual Composer Hub and start creating the website right away.',
                'visualcomposer'
            ),
            'commentsAreaPlaceholderText' => __(
                'Define a comments area for a post or page layout.',
                'visualcomposer'
            ),
            'contentElementMissingNotification' => __(
                'The content area is missing for your layout. Make sure to add the Content Area element to specify the place in your layout where the page or post content will be displayed.',
                'visualcomposer'
            ),
            'templateContainsLimitElement' => __(
                'The template you want to add contains %element element. You already have %element element added - remove it before adding the template.',
                'visualcomposer'
            ),
            'getGiphiesWithPremiumText' => __(
                'Download and Add Free Animated GIFs to Your Site With Visual Composer Premium',
                'visualcomposer'
            ),
            'getGiphiesText' => __(
                'Download and Add Free Animated GIFs to Your Site',
                'visualcomposer'
            ),
            'noConnectionToGiphy' => __(
                'Could not connect to Giphy Server!',
                'visualcomposer'
            ),
            'discoverGifAnimationsText' => __(
                'Discover the best GIF animations from Giphy.',
                'visualcomposer'
            ),
            'downloadAnimationsFromGiphy' => __(
                'Download animations from Giphy to your Media Library',
                'visualcomposer'
            ),
            'activatePremiumToUnlockGiphy' => __(
                'Activate Premium to Unlock Giphy Integration',
                'visualcomposer'
            ),
            'gifAnimations' => __(
                'GIF animations',
                'visualcomposer'
            ),
            'gifAnimationDownloadedToMediaLibrary' => __(
                'GIF animation has been downloaded to your Media Library.',
                'visualcomposer'
            ),
            'regular' => __(
                'Regular',
                'visualcomposer'
            ),
            'full' => __(
                'Full',
                'visualcomposer'
            ),
            'poweredBy' => __(
                'Powered by',
                'visualcomposer'
            ),
            'substituteElement' => __(
                'Substitute Element',
                'visualcomposer'
            ),
            'manageYourSiteMenu' => __(
                'Manage your site menus',
                'visualcomposer'
            ),
            'viaWPAdminMenu' => __(
                'in the WordPress dashboard.',
                'visualcomposer'
            ),
            'dataCollectionHeadingText' => __(
                'Help us make Visual Composer better',
                'visualcomposer'
            ),
            'dataCollectionText' => __(
                'Help us to improve the plugin by sharing anonymous data about Visual Composer usage. We appreciate your help!',
                'visualcomposer'
            ),
            'readMoreText' => __(
                'Read more',
                'visualcomposer'
            ),
            'yesIWouldLikeToHelpText' => __(
                'Yes, I would like to help',
                'visualcomposer'
            ),
            'submit' => __(
                'Submit',
                'visualcomposer'
            ),
            'new' => __(
                'New',
                'visualcomposer'
            ),
            'elements' => __(
                'Elements',
                'visualcomposer'
            ),
            'templates' => __(
                'Templates',
                'visualcomposer'
            ),
            'getFullAccessToTheVisualComposerHub' => __(
                'Get full access to the Visual Composer Hub',
                'visualcomposer'
            ),
            'downloadAllExclusiveText' => __(
                'Download all exclusive elements, templates, and extensions with Visual Composer Premium.',
                'visualcomposer'
            ),
            'tutorialPageNotification' => __(
                'This page can not be saved, because it is made for the demo purposes only.',
                'visualcomposer'
            ),
            'reset' => __(
                'Reset',
                'visualcomposer'
            ),
            'welcome' => __(
                'welcome',
                'visualcomposer'
            ),
            'discoverVC' => __(
                'Discover visual editor that gives everything to create a website you are proud of.',
                'visualcomposer'
            ),
            'done' => __(
                'Done',
                'visualcomposer'
            ),
            'nextTip' => __(
                'Next Tip',
                'visualcomposer'
            ),
            'clickHereToSkip' => __(
                'Click here to skip',
                'visualcomposer'
            ),
            'elementControls' => __(
                'Element Controls',
                'visualcomposer'
            ),
            'quickActions' => __(
                'Quick Actions',
                'visualcomposer'
            ),
            'insights' => __(
                'Insights',
                'visualcomposer'
            ),
            'onPageSettings' => __(
                'On-Page Settings',
                'visualcomposer'
            ),
            'publishingOptions' => __(
                'Publishing Options',
                'visualcomposer'
            ),
            'thisIsYourContentLibrary' => __(
                'This is your content library. <a href="https://visualcomposer.com/help/content-elements-structure/add-content-element/" target="_blank" rel="noopener noreferrer">Add an element</a> by dragging or clicking on it and find templates you have created or downloaded from the <a href="https://visualcomposer.com/help/visual-composer-hub/" target="_blank" rel="noopener noreferrer">Hub</a>.',
                'visualcomposer'
            ),
            'useElementControls' => __(
                'Use <a href="https://visualcomposer.com/help/interface/element-controls/" target="_blank" rel="noopener noreferrer">element controls</a> to see your <a href="https://visualcomposer.com/help/content-elements-structure/grid-layout-row-column/" target="_blank" rel="noopener noreferrer">layout structure</a> or modify the particular row, column, or content element.',
                'visualcomposer'
            ),
            'useQuickActions' => __(
                'Use <a href="https://visualcomposer.com/help/content-elements-structure/add-content-element/" target="_blank" rel="noopener noreferrer">quick actions</a> at the bottom of the page to add the most popular row/column layouts and elements.',
                'visualcomposer'
            ),
            'validateYourPage' => __(
                '<a href="https://visualcomposer.com/help/visual-composer-insights-assistant/" target="_blank" rel="noopener noreferrer">Validate your page</a> for SEO and performance to speed up your site and rank higher.',
                'visualcomposer'
            ),
            'checkHowYourPageLooksOnDifferentDevices' => __(
                'Check how your page looks on different devices. Select the device type to <a href="https://visualcomposer.com/help/responsive-design/" target="_blank" rel="noopener noreferrer">preview your layout responsiveness</a>.',
                'visualcomposer'
            ),
            'accessVisualComposerHub' => __(
                'Access <a href="https://visualcomposer.com/help/visual-composer-hub/" target="_blank" rel="noopener noreferrer">Visual Composer Hub</a> in-built cloud library to download additional elements, templates, add-ons, stock images, and more.',
                'visualcomposer'
            ),
            'changeSettingsOfYourPageOrPost' => __(
                'Change <a href="https://visualcomposer.com/help/settings/" target="_blank" rel="noopener noreferrer">settings of your page or post</a>, modify the layout, control popups, add custom CSS, and Javascript.',
                'visualcomposer'
            ),
            'previewSaveAndPublish' => __(
                'Preview, save, and publish your content.',
                'visualcomposer'
            ),
        ];

        return vcfilter('vcv:helpers:localizations:i18n', $locale);
    }
}
