<?php
if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

$activeTab = '';

if (isset($_GET['page'])) {
    $activeTab = esc_attr($_GET['page']);
}

$tabsHelper = vchelper('SettingsTabsRegistry');
$tabs = vcfilter('vcv:settings:tabs', $tabsHelper->all());

$tabsHtml = '';
$tabsMobileHtml = '';

foreach ($tabs as $tabKey => $tab) {
    $activeClass = $tabKey === $activeTab ? ' vcv-dashboard-tab--active' : '';
    $selectedOption = $tabKey === $activeTab ? ' selected' : '';
    $tabsHtml .= '<a href="?page=' . esc_attr($tabKey) . '" class="vcv-dashboard-tab' . esc_attr($activeClass) . '" data-value="' . esc_attr($tabKey) . '">'
        . esc_html__($tab['name'], 'visualcomposer') . '</a>';
    $tabsMobileHtml .= '<option value="' . esc_attr($tabKey) . '" ' . $selectedOption . '>' . esc_html__($tab['name'], 'visualcomposer') . '</option>';
}

$variables = vcfilter(
    'vcv:wp:dashboard:variables',
    [
        [
            'key' => 'VCV_SLUG',
            'value' => $slug,
            'type' => 'constant',
        ],
    ],
    ['slug' => $slug]
);
if (is_array($variables)) {
    foreach ($variables as $variable) {
        if (is_array($variable) && isset($variable['key'], $variable['value'])) {
            $type = isset($variable['type']) ? $variable['type'] : 'variable';
            evcview('partials/variableTypes/' . $type, $variable);
        }
    }
    unset($variable);
}
?>
<div class="wrap vcv-settings">
    <section class="vcv-dashboard-container">
        <aside class="vcv-dashboard-sidebar">
            <header class="vcv-dashboard-sidebar-header">
                <a class="vcv-dashboard-logo" href="https://visualcomposer.com/" rel="home">
                    <svg class="vcv-dashboard-logo-img" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 1000 110.1" xml:space="preserve">
                        <style type="text/css">
                            .st0{fill:#0584B5;}
                            .st1{fill:#09AEEF;}
                            .st2{fill:#AED13B;}
                            .st3{fill:#B9880C;}
                            .st4{fill:#B76800;}
                            .st5{fill:#FDB715;}
                            .st6{fill:#7F9E2E;}
                            .st7{fill:#FFFFFF;}
                        </style>
                        <g>
                            <g>
                                <polygon class="st0" points="4,24.9 4,65.2 38.9,85.3 38.9,45   "/>
                                <g>
                                    <polygon class="st1" points="38.9,4.7 4,24.9 38.9,45 73.8,24.9    "/>
                                    <polygon class="st2" points="108.7,4.7 73.8,24.9 108.7,45 143.6,24.9    "/>
                                </g>
                                <g>
                                    <polygon class="st3" points="73.8,24.9 73.8,65.2 108.7,85.3 108.7,45    "/>
                                    <polygon class="st4" points="38.9,45 38.9,85.3 73.8,65.2 73.8,24.9    "/>
                                    <polygon class="st5" points="73.8,65.2 38.9,85.3 73.8,105.5 108.7,85.3    "/>
                                </g>
                                <polygon class="st6" points="108.7,45 108.7,85.3 143.6,65.2 143.6,24.9   "/>
                            </g>
                            <path class="st7" d="M248.5,4.6c5.2,0,9.4,3.9,9.4,9.1c0,5.1-4.2,9-9.4,9c-5.2,0-9.3-3.9-9.3-9C239.2,8.5,243.3,4.6,248.5,4.6z    M241.3,31.6h14.6v53.7h-14.6V31.6z"/>
                            <path class="st7" d="M270.8,67.3c4.7,4.9,9.8,7.3,15.1,7.3c3.9,0,6.8-1.5,6.8-4.4c0-2.3-1.5-3.1-5.5-4.9l-5.7-2.4   c-9.9-4-14.6-8.5-14.6-16.4c0-10.1,8-16,19.7-16c8,0,14.4,2.7,19.3,8l-7.4,9c-3.6-3.4-7.6-5.1-12-5.1c-3.6,0-5.7,1.3-5.7,3.8   c0,2.1,1.4,3,5.6,4.8l5.2,2.2c10.4,4.2,15.1,8.5,15.1,16.4c0,5.3-2,9.5-6,12.6c-3.9,3-8.9,4.6-15,4.6c-9.4,0-17.4-3.9-22.2-10.4   L270.8,67.3z"/>
                            <path class="st7" d="M314.9,31.6h14.6v31.2c0,6.2,4.2,10.3,10.2,10.3c5.6,0,10-4.1,10-10.3V31.6h14.6v30c0,15-10.6,24.9-24.6,24.9   c-14.3,0-24.8-10-24.8-24.9V31.6z"/>
                            <path class="st7" d="M421.2,85.3h-13.4v-5.2c-3.9,4-9.5,6.5-16.4,6.5c-11.4,0-18.5-6.6-18.5-16c0-9.7,7.8-15.6,20.3-15.6h13.4v-2.4   c0-6-3.5-9.4-10-9.4c-5.5,0-9.4,2.3-14.2,7.4l-7.6-9c6.2-7.4,14-11.1,23.4-11.1c14,0,23,8.1,23,23V85.3z M406.5,64.6h-11.5   c-4.8,0-7.5,1.8-7.5,5.4s3,5.9,7.7,5.9c6.4,0,11.3-4.4,11.3-10.6V64.6z"/>
                            <path class="st7" d="M432.1,4.6h14.6v80.6h-14.6V4.6z"/>
                            <path class="st7" d="M508.7,30.4c10.5,0,18.7,5,23.3,13.2l-10.2,7.9c-3.4-4.9-7.3-7.8-12.9-7.8c-8.2,0-14.1,6.3-14.1,14.6   c0,8.6,5.9,14.7,14.1,14.7c5.5,0,9.4-2.8,12.9-7.7l10.2,7.8c-4.7,8.2-12.9,13.3-23.3,13.3c-15.7,0.3-29-12.7-28.7-28.2   C480,42.7,492.7,30.4,508.7,30.4z"/>
                            <path class="st7" d="M565.3,30.4c15.7-0.2,29.2,12.7,28.8,28c0.3,15.3-13.2,28.4-29,28.1c-15.7,0.3-29-12.8-28.6-28.1   C536.2,43.1,549.6,30.1,565.3,30.4z M565.3,43.7c-8.1,0-13.9,6.2-13.9,14.7c0,8.4,5.7,14.5,13.9,14.5c7.9,0,13.9-6.2,13.9-14.5   C579.2,50.1,573.2,43.7,565.3,43.7z"/>
                            <path class="st7" d="M685.2,85.3h-14.6V54c0-6.4-3.8-10.4-9.5-10.4c-5.7,0-9.9,4.1-9.9,10.1v31.6h-14.6V54c0-6.4-3.8-10.4-9.5-10.4   c-6,0-9.9,4-9.9,10.4v31.2h-14.6V31.6h13.4v4.8c3.6-3.8,9-6,15.2-6c7,0,12.4,2.6,15.9,7.7c4.2-4.8,10.5-7.7,17.9-7.7   c12.6,0,20.3,8.6,20.3,21.6V85.3z"/>
                            <path class="st7" d="M726.7,86.6c-6.5,0-12.1-2.3-16-6.5v25.4H696V31.6h13.4v6.7c3.6-5.1,9.9-7.9,17.2-7.9c15,0,26,11.9,26,28   C752.7,74.4,741.7,86.6,726.7,86.6z M724,43.6c-7.4,0-13.6,5.1-13.6,14.7c0,9.5,6.1,14.9,13.6,14.9c7.8,0,13.9-6,13.9-14.7   C737.9,49.5,731.9,43.6,724,43.6z"/>
                            <path class="st7" d="M787.8,30.4c15.7-0.2,29.2,12.7,28.8,28c0.3,15.3-13.2,28.4-29,28.1c-15.7,0.3-29-12.8-28.6-28.1   C758.7,43.1,772,30.1,787.8,30.4z M787.8,43.7c-8.1,0-13.9,6.2-13.9,14.7c0,8.4,5.7,14.5,13.9,14.5c7.9,0,13.9-6.2,13.9-14.5   C801.6,50.1,795.7,43.7,787.8,43.7z"/>
                            <path class="st7" d="M828.3,67.3c4.7,4.9,9.8,7.3,15.1,7.3c3.9,0,6.8-1.5,6.8-4.4c0-2.3-1.5-3.1-5.5-4.9l-5.7-2.4   c-9.9-4-14.6-8.5-14.6-16.4c0-10.1,8-16,19.7-16c8,0,14.4,2.7,19.3,8l-7.4,9c-3.6-3.4-7.6-5.1-12-5.1c-3.6,0-5.7,1.3-5.7,3.8   c0,2.1,1.4,3,5.6,4.8l5.2,2.2c10.4,4.2,15.1,8.5,15.1,16.4c0,5.3-2,9.5-6,12.6c-3.9,3-8.9,4.6-15,4.6c-9.4,0-17.4-3.9-22.2-10.4   L828.3,67.3z"/>
                            <path class="st7" d="M883.4,63.4c1.7,6.8,7.3,10.6,15.1,10.6c5.3,0,10.3-1.8,15-5.4l6.1,10c-6.4,5.3-13.6,8-21.5,8   c-16.6,0.3-29.7-12.6-29.4-28.1c-0.3-15.5,12.6-28.4,28.1-28.1c14.9,0,25.3,11,25.3,24.9c0,2.6-0.3,5.3-1,8H883.4z M907.8,53.1   c-0.1-6.6-5.2-10.8-11.6-10.8c-6.2,0-11.2,4.2-12.8,10.8H907.8z"/>
                            <path class="st7" d="M963.3,44.5h-3.9c-8.8,0-14.4,4.8-14.4,14v26.8h-14.6V31.6h13.4V38c3.6-4.4,8.8-7,14.7-7   c1.8,0,3.4,0.2,4.8,0.7V44.5z"/>
                            <polygon class="st7" points="208.9,85.3 234.9,31.6 219.4,31.6 205.8,62 192.3,31.6 176.9,31.6 202.8,85.3  "/>
                            <path class="st7" d="M711.7,104.8"/>
                            <g>
                                <polygon class="st7" points="967.4,19.9 971.8,19.9 971.8,30.9 975.3,30.9 975.3,19.9 979.6,19.9 979.6,16.7 967.4,16.7   "/>
                                <polygon class="st7" points="994.7,16.7 988.9,24 983,16.7 981.7,16.7 981.7,30.9 985.2,30.9 985.2,24.6 988.3,28.4 989.4,28.4     992.5,24.6 992.5,30.9 996,30.9 996,16.7   "/>
                            </g>
                        </g>
                    </svg>
                </a>
                <button class="vcv-dashboard-nav-toggle" aria-label="Navigation toggle" aria-expanded="false">
                    <span class="vcv-dashboard-nav-toggle-hamburger"></span>
                </button>
            </header>
            <div class="vcv-dashboard-sidebar-navigation-container">
                <nav class="vcv-dashboard-sidebar-navigation vcv-dashboard-sidebar-navigation--main">
                    <a class="vcv-dashboard-sidebar-navigation-item vcv-dashboard-sidebar-navigation-item--active vcv-ui-icon-dashboard vcv-ui-icon-dashboard-hub-shop" href="#">Visual Composer Hub</a>
                    <a class="vcv-dashboard-sidebar-navigation-item vcv-ui-icon-dashboard vcv-ui-icon-dashboard-settings" href="#">Settings</a>
                    <a class="vcv-dashboard-sidebar-navigation-item vcv-ui-icon-dashboard vcv-ui-icon-dashboard-css" href="#">CSS, HTML & JavaScript</a>
                </nav>
                <nav class="vcv-dashboard-sidebar-navigation vcv-dashboard-sidebar-navigation--bottom">
                    <a class="vcv-dashboard-sidebar-navigation-item vcv-ui-icon-dashboard vcv-ui-icon-dashboard-star" href="#">Go Premium</a>
                </nav>
            </div>
        </aside>
        <main class="vcv-dashboard-main">
            <div>
                <h1>Settings</h1>
                <div class="vcv-dashboards-section-navigation">
                    <div class="vcv-dashboard-tabs">
                        <?php echo $tabsHtml ?>
                    </div>
                    <div class="vcv-dashboard-dropdown">
                        <select class="vcv-dashboard-dropdown-select" name="" id="">
                            <?php echo $tabsMobileHtml ?>
                        </select>
                    </div>
                </div>
                <div class="vcv-dashboards-section-content">
                    <?php
                    // @codingStandardsIgnoreLine
                    echo $content;
                    ?>
                </div>
            </div>
        </main>
    </section>
    <script>
      const dashboardNavigationToggle = document.querySelector('.vcv-dashboard-nav-toggle')
      const dashboardNavigationMenu = document.querySelector('.vcv-dashboard-sidebar-navigation-container')

      const handleNavigationToggle = () => {
        dashboardNavigationMenu.classList.toggle('vcv-is-navigation-visible')
        const ariaExpandedAttr = dashboardNavigationToggle.getAttribute('aria-expanded')
        const newAriaExpandedAttr = ariaExpandedAttr === 'true' ? 'false' : 'true'
        dashboardNavigationToggle.setAttribute('aria-expanded', newAriaExpandedAttr)
      }

      dashboardNavigationToggle.addEventListener('click', handleNavigationToggle)
    </script>
</div>
