<?php

class AutoloadTest extends WP_UnitTestCase
{
    public function testGetComponents()
    {
        $autoload = new \ComposerHooks\Hooks\Autoload();
        $autoload::$app = vcapp();
        $components = $autoload->getComponents();
        $this->assertTrue(is_array($components));
        $this->assertTrue(is_array($components['helpers']));
        $this->assertTrue(is_array($components['modules']));

        $this->assertTrue(!empty($components['helpers']));
        $this->assertTrue(!empty($components['modules']));
        foreach ($components['helpers'] as $helper) {
            $helperObj = vchelper(preg_replace('/Helper$/', '', $helper['name']));
            $helperObjFromApp = vcapp($helper['name']);
            $this->assertEquals(
                $helperObj,
                $helperObjFromApp,
                'Checking that helper is accessable: ' . $helper['name']
            );
        }

        foreach ($components['modules'] as $module) {
            $moduleObj = vcapp($module['name']);
            $this->assertTrue(is_object($moduleObj), 'module should be an object:' . $module['name']);
        }
    }

    public function testInitComponents()
    {
        $hookAutoload = new \ComposerHooks\Hooks\Autoload();
        $hookAutoload::$app = vcapp();
        /** @var \VisualComposer\Framework\Autoload $app */
        $app = vcapp('VisualComposer\Framework\Autoload');
        $app2 = vcapp('Autoload');
        $components = $hookAutoload->getComponents();
        $this->assertTrue($app->initComponents($components));
        $this->assertFalse($app->initComponents(false));
        $this->assertTrue($app->useCache());
        $this->assertEquals($app, $app2);
        $app->init();
    }

    public function testInitCache()
    {
        /** @var \VisualComposer\Framework\Autoload $app */
        $app = $this->getMockBuilder('\VisualComposer\Framework\Autoload')->disableOriginalConstructor()->setMethods(
            ['useCache']
        )->getMock();
        $app->expects($this->once())->method('useCache')->will($this->returnValue(true));

        $app->init();
    }

    public function testIsHelper()
    {
        $app = new \ComposerHooks\Hooks\Autoload();
        $this->assertTrue($app->isHelper('Helper'));
        $this->assertTrue($app->isHelper('\VisualComposer\Framework\Illuminate\Support\Helper'));
        $this->assertTrue($app->isHelper('\\VisualComposer\\Framework\\Illuminate\\Support\\Helper'));

        // Wrong values
        $this->assertFalse($app->isHelper(''));
        $this->assertFalse($app->isHelper('Module'));
    }

    public function testIsModule()
    {
        $app = new \ComposerHooks\Hooks\Autoload();
        $this->assertTrue($app->isModule('Module'));
        $this->assertTrue($app->isModule('\VisualComposer\Framework\Illuminate\Support\Module'));
        $this->assertTrue($app->isModule('\\VisualComposer\\Framework\\Illuminate\\Support\\Module'));

        // Wrong values
        $this->assertFalse($app->isModule(''));
        $this->assertFalse($app->isModule('Helper'));
    }

    public function testGetName()
    {
        $app = new \ComposerHooks\Hooks\Autoload();

        /** @see \VisualComposer\Helpers\Str */
        /** @see \VisualComposer\Helpers\Token */
        /** @see \VisualComposer\Modules\Site\Controller */
        /** @see \VisualComposer\Modules\License\Controller */
        /** @see \VisualComposer\Modules\Editors\PageEditable\Controller */

        $this->assertEquals(
            'StrHelper',
            $app->getHelperName(
                [
                    'namespace' => 'VisualComposer\Helpers',
                    'class' => 'Str',
                ]
            )
        );
        $this->assertEquals(
            'TokenHelper',
            $app->getHelperName(
                [
                    'namespace' => 'VisualComposer\Helpers',
                    'class' => 'Token',
                ]
            )
        );

        $this->assertEquals(
            'SiteController',
            $app->getModuleName(
                [
                    'namespace' => 'VisualComposer\Modules\Site',
                    'class' => 'Controller',
                ]
            )
        );
        $this->assertEquals(
            'LicenseController',
            $app->getModuleName(
                [
                    'namespace' => 'VisualComposer\Modules\License',
                    'class' => 'Controller',
                ]
            )
        );
        $this->assertEquals(
            'EditorsPageEditableController',
            $app->getModuleName(
                [
                    'namespace' => 'VisualComposer\Modules\Editors\PageEditable',
                    'class' => 'Controller',
                ]
            )
        );
    }
}
