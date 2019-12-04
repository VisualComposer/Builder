<?php

class TestVariables extends WP_UnitTestCase
{
    public function testEnvVariables()
    {
        $dataHelper = vchelper('Data');
        $variables = vcfilter('vcv:editor:variables', []);
        $this->assertIsArray($variables);

        $variableKeys = $dataHelper->arrayColumn($variables, 'key');
        $this->assertIsArray($variableKeys);
        $this->assertContains('VCV_ENV', $variableKeys, 'VCV_ENV');
        $this->assertContains('VCV_SITE_URL', $variableKeys, 'VCV_SITE_URL');
        $keyEnv = array_search('VCV_ENV', $variableKeys);

        $this->assertNotEmpty($keyEnv);
        $this->assertTrue(isset($variables[ $keyEnv ]));
        $this->assertTrue(isset($variables[ $keyEnv ]['value']));
        $this->assertContains('VCV_HUB_URL', $variables[ $keyEnv ]['value']);
        $this->assertEquals(\VcvEnv::all(), $variables[ $keyEnv ]['value']);
    }

    public function testAddonsVariables()
    {
        $dataHelper = vchelper('Data');
        $variables = vcfilter('vcv:editor:variables', []);

        $variableKeys = $dataHelper->arrayColumn($variables, 'key');
        $this->assertContains('VCV_HUB_GET_ADDONS', $variableKeys, 'VCV_HUB_GET_ADDONS');
        $key = array_search('VCV_HUB_GET_ADDONS', $variableKeys);

        $this->assertNotEmpty($key);
        $this->assertTrue(isset($variables[ $key ]));
        $this->assertTrue(isset($variables[ $key ]['value']));
        $hubHelper = vcapp('\VisualComposer\Helpers\Hub\Addons');
        $this->assertEquals($hubHelper->getAddons(false), $variables[ $key ]['value']);
    }

    public function testKeysVariables()
    {
        $dataHelper = vchelper('Data');
        $variables = vcfilter('vcv:editor:variables', []);

        $variableKeys = $dataHelper->arrayColumn($variables, 'key');
        $this->assertContains(
            'VCV_PAGE_TEMPLATES_LAYOUTS_CURRENT',
            $variableKeys,
            'VCV_PAGE_TEMPLATES_LAYOUTS_CURRENT'
        );
        $this->assertContains(
            'VCV_PAGE_TEMPLATES_LAYOUTS',
            $variableKeys,
            'VCV_PAGE_TEMPLATES_LAYOUTS'
        );
        $this->assertContains(
            'VCV_PAGE_TEMPLATES_LAYOUTS_THEME',
            $variableKeys,
            'VCV_PAGE_TEMPLATES_LAYOUTS_THEME'
        );
        $this->assertContains(
            'VCV_HUB_GET_ADDONS',
            $variableKeys,
            'VCV_HUB_GET_ADDONS'
        );
        $this->assertContains(
            'VCV_HUB_GET_ADDON_TEASER',
            $variableKeys,
            'VCV_HUB_GET_ADDON_TEASER'
        );
        $this->assertContains(
            'VCV_HUB_GET_TEMPLATES_TEASER',
            $variableKeys,
            'VCV_HUB_GET_TEMPLATES_TEASER'
        );
        $this->assertContains(
            'VCV_PLUGIN_UPDATE',
            $variableKeys,
            'VCV_PLUGIN_UPDATE'
        );
    }

    public function testErrorReporingVariables()
    {
        $dataHelper = vchelper('Data');
        $variables = vcfilter('vcv:editor:variables', []);

        $variableKeys = $dataHelper->arrayColumn($variables, 'key');
        $this->assertContains('VCV_ERROR_REPORT_URL', $variableKeys, 'VCV_ERROR_REPORT_URL');
    }

    public function testUpdateVariablesAbout()
    {
        $dataHelper = vchelper('Data');
        $variables = vcfilter('vcv:editor:variables', [], ['slug' => 'vcv-about']);

        $variableKeys = $dataHelper->arrayColumn($variables, 'key');
        $this->assertContains('VCV_ACTIVE_PAGE', $variableKeys, 'VCV_ACTIVE_PAGE');
        $key = array_search('VCV_ACTIVE_PAGE', $variableKeys);

        $this->assertNotEmpty($key);
        $this->assertTrue(isset($variables[ $key ]));
        $this->assertTrue(isset($variables[ $key ]['value']));
        $this->assertEquals('last', $variables[ $key ]['value']);
    }

    public function testUpdateVariablesGettingStarted()
    {
        $dataHelper = vchelper('Data');
        $variables = vcfilter('vcv:editor:variables', [], ['slug' => 'vcv-getting-started']);

        $variableKeys = $dataHelper->arrayColumn($variables, 'key');
        $this->assertContains('VCV_ACTIVATION_SLIDES', $variableKeys, 'VCV_ACTIVATION_SLIDES');
        $this->assertContains('VCV_IS_FREE_ACTIVATED', $variableKeys, 'VCV_IS_FREE_ACTIVATED');
        $key = array_search('VCV_IS_FREE_ACTIVATED', $variableKeys);

        $this->assertNotEmpty($key);
        $this->assertTrue(isset($variables[ $key ]));
        $this->assertTrue(isset($variables[ $key ]['value']));
        $this->assertEquals(vchelper('License')->isFreeActivated(), $variables[ $key ]['value']);
    }

    public function testEditorVariables()
    {

        $dataHelper = vchelper('Data');

        wp_set_current_user(1);
        $postTypeHelper = vchelper('PostType');
        $postId = $postTypeHelper->create(
            [
                'post_type' => 'page',
                'post_content' => '',
            ]
        );
        $this->assertTrue(is_numeric($postId));
        $this->assertTrue($postId > 0);
        $postTypeHelper->setupPost($postId);

        $variables = vcfilter('vcv:editor:variables', [], ['sourceId' => $postId]);

        $variableKeys = $dataHelper->arrayColumn($variables, 'key');

        $this->assertContains('ajaxurl', $variableKeys, 'ajaxurl');
        $this->assertContains('vcvSourceID', $variableKeys, 'vcvSourceID');
        $this->assertContains('vcvAjaxUrl', $variableKeys, 'vcvAjaxUrl');
        $this->assertContains('vcvAdminAjaxUrl', $variableKeys, 'vcvAdminAjaxUrl');
        $this->assertContains('vcvNonce', $variableKeys, 'vcvNonce');
        $this->assertContains('vcvPageEditableNonce', $variableKeys, 'vcvPageEditableNonce');
        $this->assertContains('vcvPluginUrl', $variableKeys, 'vcvPluginUrl');
        $this->assertContains('vcvPluginSourceUrl', $variableKeys, 'vcvPluginSourceUrl');
        $this->assertContains('vcvPostData', $variableKeys, 'vcvPostData');
        $this->assertContains('vcvPostPermanentLink', $variableKeys, 'vcvPostPermanentLink');
        $this->assertContains('vcvIsPremiumActivated', $variableKeys, 'vcvIsPremiumActivated');
        $this->assertContains('vcvIsFreeActivated', $variableKeys, 'vcvIsFreeActivated');
        $this->assertContains('vcvGoPremiumUrl', $variableKeys, 'vcvGoPremiumUrl');
        $this->assertContains('vcvGettingStartedUrl', $variableKeys, 'vcvGettingStartedUrl');
        $this->assertContains('vcvGutenbergEditorUrl', $variableKeys, 'vcvGutenbergEditorUrl');
        $this->assertContains('vcvIsAnyActivated', $variableKeys, 'vcvIsAnyActivated');
        $this->assertContains('vcvUpgradeUrl', $variableKeys, 'vcvUpgradeUrl');
        $this->assertContains('vcvUpgradeUrlUnsplash', $variableKeys, 'vcvUpgradeUrlUnsplash');
    }
}
