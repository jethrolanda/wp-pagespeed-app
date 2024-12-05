<?php

/**
 * PHP file to use when rendering the block type on the server to show on the front end.
 *
 * The following variables are exposed to the file:
 *     $attributes (array): The block attributes.
 *     $content (string): The block default content.
 *     $block (WP_Block): The block instance.
 *
 * @see https://github.com/WordPress/gutenberg/blob/trunk/docs/reference-guides/block-api/block-metadata.md#render
 */

// Global State
wp_interactivity_state('pagespeed-app', array(
	'test' => 'test'
));

// Local Context
$context = array(
	'url' => '',
	'device' => 'mobile',
	'post_types' => array('page', 'post', 'custom_post_type'),
	'category' => array('performance')
);
?>

<div
	data-wp-interactive="pagespeed-app"
	<?php echo get_block_wrapper_attributes(); ?>
	<?php echo wp_interactivity_data_wp_context($context); ?>
	data-wp-watch="callbacks.logIsOpen">
	<input type="text" placeholder="Enter wp website url" data-wp-on--keyup="callbacks.setUrl">
	<div>
		<span>Device:</span>
		<input name="device" type="radio" id="mobile" value="mobile" checked data-wp-on--click="callbacks.setOptions">
		<label for="mobile">Mobile</label>
		<input name="device" type="radio" id="desktop" value="desktop" data-wp-on--click="callbacks.setOptions">
		<label for="desktop">Desktop</label>
	</div>
	<div>
		<span>Post Type:</span>
		<input type="checkbox" id="page" name="post_types" value="page" checked data-wp-on--click="callbacks.setOptions">
		<label for="page">Page</label>
		<input type="checkbox" id="post" name="post_types" value="post" checked data-wp-on--click="callbacks.setOptions">
		<label for="post">Post</label>
		<input type="checkbox" id="custom_post_type" name="post_types" value="custom_post_type" checked data-wp-on--click="callbacks.setOptions">
		<label for="custom_post_type">Custom Post Types</label>
	</div>
	<div>
		<span>Category:</span>
		<input type="checkbox" id="performance" name="category" value="performance" checked data-wp-on--click="callbacks.setOptions">
		<label for="performance">Performance</label>
		<input type="checkbox" id="accessibility" name="category" value="accessibility" data-wp-on--click="callbacks.setOptions">
		<label for="accessibility">Accessibility</label>
		<input type="checkbox" id="best_practices" name="category" value="best_practices" data-wp-on--click="callbacks.setOptions">
		<label for="best_practices">Best Practices</label>
		<input type="checkbox" id="seo" name="category" value="seo" data-wp-on--click="callbacks.setOptions">
		<label for="seo">SEO</label>
	</div>
	<button data-wp-on--click="actions.submit">Submit</button>
</div>