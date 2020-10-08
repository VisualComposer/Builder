<?php

namespace VisualComposer\Modules\Editors\Favorites;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Framework\Container;
use VisualComposer\Helpers\Options;
use VisualComposer\Helpers\Request;
use VisualComposer\Helpers\Traits\EventsFilters;

class Controller extends Container implements Module
{
    use EventsFilters;

    public function __construct()
    {
        $this->addFilter('vcv:ajax:favoriteItems:updateUsage:adminNonce', 'updateItemUsage');
    }

    protected function updateItemUsage(
        $response,
        Request $requestHelper,
        Options $optionsHelper
    ) {
        $itemTag = $requestHelper->input('vcv-item-tag');
        if ($itemTag) {
            $favoriteItems = $optionsHelper->get('favoriteItems', []);
            if (isset($favoriteItems[ $itemTag ])) {
                $favoriteItems[ $itemTag ] += 1;
            } else {
                $favoriteItems[ $itemTag ] = 1;
            }
            $optionsHelper->set('favoriteItems', $favoriteItems);
        }

        return ['status' => true];
    }
}
