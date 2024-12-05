<?php

/**
 * Plugin Name: WP Pagespeed App
 * Description: WP Pagespeed App.
 * Version: 1.0
 * Author: Xammis
 * Author URI: https://xammis.com/
 * Text Domain: wp-pagespeed-app
 * Domain Path: /languages/
 * Requires at least: 5.7
 * Requires PHP: 7.2
 */

defined('ABSPATH') || exit;

// Path Constants ======================================================================================================

define('WPA_PLUGIN_URL',             plugins_url() . '/wp-pagespeed-app/');
define('WPA_PLUGIN_DIR',             plugin_dir_path(__FILE__));
define('WPA_CSS_ROOT_URL',           WPA_PLUGIN_URL . 'css/');
define('WPA_JS_ROOT_URL',            WPA_PLUGIN_URL . 'js/');
define('WPA_TEMPLATES_ROOT_URL',     WPA_PLUGIN_URL . 'templates/');
define('WPA_TEMPLATES_ROOT_DIR',     WPA_PLUGIN_DIR . 'templates/');
define('WPA_BLOCKS_ROOT_URL',        WPA_PLUGIN_URL . 'blocks/');
define('WPA_BLOCKS_ROOT_DIR',        WPA_PLUGIN_DIR . 'blocks/');

// Require autoloader
require_once 'inc/autoloader.php';


// Run
require_once 'wp-pagespeed-app.plugin.php';
$GLOBALS['wpa'] = new WP_Pagespeed_App();
