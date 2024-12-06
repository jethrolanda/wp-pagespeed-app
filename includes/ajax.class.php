<?php

namespace WPA\Plugin;

/**
 * Plugins custom settings page that adheres to wp standard
 * see: https://developer.wordpress.org/plugins/settings/custom-settings-page/
 *
 * @since   1.0
 */

defined('ABSPATH') || exit;

/**
 * WP Settings Class.
 */
class Ajax
{
  /**
   * The single instance of the class.
   *
   * @since 1.0
   */
  protected static $_instance = null;

  /**
   * Class constructor.
   *
   * @since 1.0.0
   */
  public function __construct()
  {
    add_action("wp_ajax_wpa_generate_pagespeed_report", array($this, 'wpa_generate_pagespeed_report'));
    add_action("wp_ajax_nopriv_wpa_generate_pagespeed_report", array($this, 'wpa_generate_pagespeed_report'));
  }

  /**
   * Main Instance.
   * 
   * @since 1.0
   */
  public static function instance()
  {
    if (is_null(self::$_instance)) {
      self::$_instance = new self();
    }
    return self::$_instance;
  }

  /** 
   * 
   * @since 1.0
   */
  public function wpa_generate_pagespeed_report()
  {

    if (!defined('DOING_AJAX') || !DOING_AJAX) {
      wp_die();
    }

    /**
     * Verify nonce
     */
    if (isset($_POST['nonce']) && !wp_verify_nonce($_POST['nonce'], 'pagespeedapp')) {
      wp_die();
    }

    try {
      $post_types = get_post_types(array('public' => true));

      $posts = get_posts(array(
        'post_type' => $post_types,
        'post_status' => 'publish',
        'numberposts' => -1,
      ));

      error_log(print_r(count($posts), true));

      $url_params = $this->get_url_params($_POST);

      // if (isset($_POST['post_types'])) {
      //   $post_types = '';
      //   foreach (explode($_POST['post_types'], ',') as $type) {
      //     $post_types .= '&category=' . $type;
      //   }
      //   $url_params = $post_types;
      // }

      error_log('https://www.googleapis.com/pagespeedonline/v5/runPagespeed?key=AIzaSyBEQiaTL4wMnMCQA2WABjuIAOXLaL5LUo0' . $url_params);
      $response = wp_remote_get(
        'https://www.googleapis.com/pagespeedonline/v5/runPagespeed?key=AIzaSyBEQiaTL4wMnMCQA2WABjuIAOXLaL5LUo0' . $url_params,
        array(
          'timeout' => 300
        )
      );
      $data = json_decode($response['body']);
      error_log(print_r($data->lighthouseResult->categories->performance->score, true));

      wp_send_json(array(
        'status' => 'success',
        'data' => array(),
      ));
    } catch (\Exception $e) {
      wp_send_json(array(
        'status' => 'error',
        'message' => $e->getMessage()
      ));
    }
  }

  private function get_url_params($post)
  {
    $url_params = '';
    if (isset($post['url'])) {
      $url_params .= '&url=' . $post['url'];
    }

    if (isset($post['device'])) {
      $url_params .= '&strategy=' . $post['device'];
    }

    if (isset($post['category'])) {
      $category = '';
      if (strpos($post['category'], ',') !== false) {
        $categories = explode($post['category'], ',');
        foreach ($categories as $cat) {
          $category .= '&category=' . $cat;
        }
      } else {
        $category = '&category=' . $post['category'];
      }

      $url_params .= $category;
    }

    return $url_params;
  }
}
