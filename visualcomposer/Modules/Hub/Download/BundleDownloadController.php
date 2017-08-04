<?php

namespace VisualComposer\Modules\Hub\Download;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Filters;
use VisualComposer\Helpers\Hub\Bundle;
use VisualComposer\Helpers\Traits\EventsFilters;

class BundleDownloadController extends Container /*implements Module*/
{
    use EventsFilters;

    public function __construct()
    {
        if (vcvenv('VCV_ENV_HUB_DOWNLOAD!!!!')) {
            $this->addFilter(
                'vcv:activation:success vcv:hub:bundle:update:adminNonce',
                'prepareBundleDownload',
                50
            );
        }
    }

    protected function prepareBundleDownload($response, Bundle $hubHelper, Filters $filterHelper)
    {
        $status = $response;
        if ($response !== false && !is_array($response)) {
            $hubHelper->removeTempBundleFolder();
            $archive = $hubHelper->requestBundleDownload();
            $archive = $this->readBundleJson($archive);
            if ($archive) {
                $status = $filterHelper->fire('vcv:hub:download:bundle', true, ['archive' => $archive]);
            }
            $hubHelper->removeTempBundleFolder();
        }

        return $status;
    }

    protected function readBundleJson($archive)
    {
        $result = false;
        if (!is_wp_error($archive)) {
            $hubHelper = vchelper('HubBundle');
            $result = $hubHelper->unzipDownloadedBundle($archive);
            if (!is_wp_error($result)) {
                return $hubHelper->readBundleJson($hubHelper->getTempBundleFolder('bundle.json'));
            }
        }

        return $result;
    }
}
