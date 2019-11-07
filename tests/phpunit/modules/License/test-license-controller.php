<?php

class LicenseControllerTest extends WP_UnitTestCase
{
    public function testHubDownload()
    {
        $this->assertTrue(vcvenv('VCV_ENV_HUB_DOWNLOAD'));
    }

    public function testAccountId()
    {
        $this->assertEquals('account', vcvenv('VCV_ENV_ADDONS_ID'));
    }

    public function testHubUrl()
    {
        $this->assertEquals('https://account.visualcomposer.io', vcvenv('VCV_HUB_URL'));
    }

    public function testTokenUrl()
    {
        $this->assertEquals('https://account.visualcomposer.io/authorization-token', vcvenv('VCV_TOKEN_URL'));
    }
    
    public function testLicenseActivateUrl()
    {
        $this->assertEquals('https://account.visualcomposer.io/activation', vcvenv('VCV_FREE_ACTIVATE_URL'));
    }

}
