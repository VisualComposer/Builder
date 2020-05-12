<?php

if (!defined('VCV_E2E')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

function e2e_create_post($data)
{
    $data = array_merge_recursive(
        [
            'meta_input' => [
                '_e2e-generated-test' => 1, // required for cleanDb
            ],
        ],
        $data
    );

    return wp_insert_post($data);
}

function e2e_clean_posts()
{
    $args = [
        'post_type' => array_keys(get_post_types()),
        'post_status' => 'any',
        'meta_query' => [
            [
                'key' => '_e2e-generated-test',
                'value' => '1',
                'compare' => '=',
            ],
        ],
        'posts_per_page' => '-1',
    ];
    $query = new WP_Query($args);
    if (is_array($query->posts) && !empty($query->posts)) {
        foreach ($query->posts as $post) {
            wp_delete_post($post->ID, true);
        }
    }
}

function e2e_add_rewrite_rules()
{
    add_filter(
        'pre_option_rewrite_rules',
        function () {
            return [
                'wp-content/plugins/' . VCV_PLUGIN_DIRNAME . '/tests/php-e2e-actions/init.php' => '',
                'wp-contentplugins' . VCV_PLUGIN_DIRNAME . 'testsphp-e2e-actionsinit\.php' => '',
            ];
        }
    );
}
