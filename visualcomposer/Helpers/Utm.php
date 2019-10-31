<?php

namespace VisualComposer\Helpers;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Illuminate\Support\Helper;

class Utm implements Helper
{
    /**
     * @return array
     */
    public function all()
    {
        $utm = [
            'updatesChangelogAuthorLink' => 'https://visualcomposer.com/?utm_medium=wp-dashboard&utm_source=plugins-page&utm_campaign=vcwb&utm_content=changelog-author',
            'updatesChangelogHomepageLink' => 'https://visualcomposer.com/?utm_medium=wp-dashboard&utm_source=plugins-page&utm_campaign=vcwb&utm_content=changelog',
            'feBlankPagePremiumTemplates' => 'https://visualcomposer.com/premium/?utm_medium=frontend-editor&utm_source=blank-page-wizard&utm_campaign=gopremium',
            'feAddTemplateSearchPremiumTemplates' => 'https://visualcomposer.com/premium/?utm_medium=frontend-editor&utm_source=add-template&utm_campaign=gopremium&utm_content=search',
            'feAddElementSearchPremiumVersion' => 'https://visualcomposer.com/premium/?utm_medium=frontend-editor&utm_source=add-element&utm_campaign=gopremium&utm_content=search',
            'feHubTeaserPremiumVersion' => 'https://visualcomposer.com/premium/?utm_medium=frontend-editor&utm_source=hub&utm_campaign=gopremium',
            'goPremiumElementDownload' => 'https://visualcomposer.com/premium?utm_medium=frontend-editor&utm_source=hub&utm_campaign=gopremium&utm_content=locked-item',
            'getting-started' => '&utm_medium=wp-dashboard&utm_source=getting-started&utm_campaign=gopremium',
        ];

        return $utm;
    }

    public function get($key)
    {
        $all = $this->all();

        return isset($all[ $key ]) ? $all[ $key ] : '';
    }
}
