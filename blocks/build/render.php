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
	'ajax_url' => admin_url('admin-ajax.php'),
	'nonce' => wp_create_nonce('pagespeedapp'),
));


// Local Context
$context = array(
	'url' => isset($attributes['sites'][0]) ? $attributes['sites'][0] : '',
	'device' => 'mobile',
	'post_types' => array('page', 'post', 'custom_post_type'),
	'category' => array('performance', 'accessibility', 'best-practices', 'seo'),
	'processing' => false,
	'submitBtnText' => 'Submit',
	'pagespeedResults' => array(),
	'status' => array(
		'page' => array(
			'text' => 'Waiting...',
			'page' => 1,
			'totalPages' => 1,
			'totalEntries' => 0,
			'isDone' => false,
			'processing' => false,
		),
		'post' => array(
			'text' => 'Waiting...',
			'page' => 1,
			'totalPages' => 1,
			'totalEntries' => 0,
			'isDone' => false,
			'processing' => false,
		),
		'cpts' => array(
			'text' => 'Waiting...',
			'page' => 1,
			'totalPages' => 1,
			'totalEntries' => 0,
			'isDone' => false,
			'processing' => false,
		)
	),
	'totalLinks' => 0,
	'completed' => array(), // post types that are completed
	'error_message' => ''
);
error_log(print_r($attributes, true));
?>

<div class="pagespeed-app-wrapper-class">
	<div
		data-wp-interactive="pagespeed-app"
		<?php echo get_block_wrapper_attributes(); ?>
		<?php echo wp_interactivity_data_wp_context($context); ?>>
		<div class="mt-4 space-y-10">
			<select
				data-wp-on--change="callbacks.setUrl"
				class="w-full placeholder:text-slate-400 text-sm border bg-white border-slate-200 rounded-md pl-3 pr-8 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md appearance-none cursor-pointer">
				<?php
				if (!empty($attributes['sites'])) {
					foreach ($attributes['sites'] as $site) {
						echo '<option value="' . $site . '">' . $site . '</option>';
					}
				} else {
					echo '<option value="">No Sites</option>';
				}
				?>
			</select>
			<!-- <input type="text" placeholder="Site url. Example: https://www.fuellogic.net/" data-wp-on--keyup="callbacks.setUrl" class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"> -->
		</div>

		<div class="mt-4 space-y-10">
			<fieldset>
				<legend class="text-sm/6 font-semibold text-gray-900">Device</legend>
				<div class="mt-2 flex flex-row gap-4">
					<div class="flex items-center gap-2">
						<input name="device" type="radio" id="mobile" value="mobile" checked data-wp-on--click="callbacks.setOptions" class="relative size-4 appearance-none rounded-full border border-gray-300 bg-white before:absolute before:inset-1 before:rounded-full before:bg-white not-checked:before:hidden checked:border-indigo-600 checked:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:before:bg-gray-400 forced-colors:appearance-auto forced-colors:before:hidden">
						<label for="mobile" class="block text-sm/6 font-medium text-gray-900">Mobile</label>
					</div>
					<div class="flex items-center gap-2">
						<input name="device" type="radio" id="desktop" value="desktop" data-wp-on--click="callbacks.setOptions" class="relative size-4 appearance-none rounded-full border border-gray-300 bg-white before:absolute before:inset-1 before:rounded-full before:bg-white not-checked:before:hidden checked:border-indigo-600 checked:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:before:bg-gray-400 forced-colors:appearance-auto forced-colors:before:hidden">
						<label for="desktop" class="block text-sm/6 font-medium text-gray-900">Desktop</label>
					</div>
				</div>
			</fieldset>
		</div>

		<div class="mt-4 space-y-10">
			<fieldset class="flex flex-row gap-4">
				<legend class="text-sm/6 font-semibold text-gray-900">POST TYPE</legend>
				<div class="mt-2 space-y-6">
					<div class="flex gap-2">
						<div class="flex h-6 shrink-0 items-center">
							<div class="group grid size-4 grid-cols-1">
								<input type="checkbox" id="page" name="post_types" value="page" checked data-wp-on--click="callbacks.setOptions" class="col-start-1 row-start-1 appearance-none rounded border border-gray-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 indeterminate:border-indigo-600 indeterminate:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto">
								<svg class="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-[:disabled]:stroke-gray-950/25" viewBox="0 0 14 14" fill="none">
									<path class="opacity-0 group-has-[:checked]:opacity-100" d="M3 8L6 11L11 3.5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
									<path class="opacity-0 group-has-[:indeterminate]:opacity-100" d="M3 7H11" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
								</svg>
							</div>
						</div>
						<div class="text-sm/6">
							<label for="page" class="font-medium text-gray-900">Page</label>
						</div>
					</div>
				</div>
				<div class="mt-2 space-y-6">
					<div class="flex gap-2">
						<div class="flex h-6 shrink-0 items-center">
							<div class="group grid size-4 grid-cols-1">
								<input type="checkbox" id="post" name="post_types" value="post" checked data-wp-on--click="callbacks.setOptions" class="col-start-1 row-start-1 appearance-none rounded border border-gray-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 indeterminate:border-indigo-600 indeterminate:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto">
								<svg class="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-[:disabled]:stroke-gray-950/25" viewBox="0 0 14 14" fill="none">
									<path class="opacity-0 group-has-[:checked]:opacity-100" d="M3 8L6 11L11 3.5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
									<path class="opacity-0 group-has-[:indeterminate]:opacity-100" d="M3 7H11" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
								</svg>
							</div>
						</div>
						<div class="text-sm/6">
							<label for="post" class="font-medium text-gray-900">Post</label>
						</div>
					</div>
				</div>
				<div class="mt-2 space-y-6">
					<div class="flex gap-2">
						<div class="flex h-6 shrink-0 items-center">
							<div class="group grid size-4 grid-cols-1">
								<input type="checkbox" id="custom_post_type" name="post_types" value="custom_post_type" checked data-wp-on--click="callbacks.setOptions" class="col-start-1 row-start-1 appearance-none rounded border border-gray-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 indeterminate:border-indigo-600 indeterminate:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto">
								<svg class="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-[:disabled]:stroke-gray-950/25" viewBox="0 0 14 14" fill="none">
									<path class="opacity-0 group-has-[:checked]:opacity-100" d="M3 8L6 11L11 3.5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
									<path class="opacity-0 group-has-[:indeterminate]:opacity-100" d="M3 7H11" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
								</svg>
							</div>
						</div>
						<div class="text-sm/6">
							<label for="custom_post_type" class="font-medium text-gray-900">Custom Post Types</label>
						</div>
					</div>
				</div>
			</fieldset>
		</div>

		<div class="mt-4 space-y-10">
			<fieldset class="flex flex-row gap-4">
				<legend class="text-sm/6 font-semibold text-gray-900">CATEGORY</legend>
				<div class="mt-2 space-y-6">
					<div class="flex gap-2">
						<div class="flex h-6 shrink-0 items-center">
							<div class="group grid size-4 grid-cols-1">
								<input type="checkbox" id="performance" name="category" value="performance" checked data-wp-on--click="callbacks.setOptions" class="col-start-1 row-start-1 appearance-none rounded border border-gray-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 indeterminate:border-indigo-600 indeterminate:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto">
								<svg class="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-[:disabled]:stroke-gray-950/25" viewBox="0 0 14 14" fill="none">
									<path class="opacity-0 group-has-[:checked]:opacity-100" d="M3 8L6 11L11 3.5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
									<path class="opacity-0 group-has-[:indeterminate]:opacity-100" d="M3 7H11" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
								</svg>
							</div>
						</div>
						<div class="text-sm/6">
							<label for="performance" class="font-medium text-gray-900">Performance</label>
						</div>
					</div>
				</div>
				<div class="mt-2 space-y-6">
					<div class="flex gap-2">
						<div class="flex h-6 shrink-0 items-center">
							<div class="group grid size-4 grid-cols-1">
								<input type="checkbox" id="accessibility" name="category" value="accessibility" checked data-wp-on--click="callbacks.setOptions" class="col-start-1 row-start-1 appearance-none rounded border border-gray-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 indeterminate:border-indigo-600 indeterminate:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto">
								<svg class="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-[:disabled]:stroke-gray-950/25" viewBox="0 0 14 14" fill="none">
									<path class="opacity-0 group-has-[:checked]:opacity-100" d="M3 8L6 11L11 3.5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
									<path class="opacity-0 group-has-[:indeterminate]:opacity-100" d="M3 7H11" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
								</svg>
							</div>
						</div>
						<div class="text-sm/6">
							<label for="accessibility" class="font-medium text-gray-900">Accessibility</label>
						</div>
					</div>
				</div>
				<div class="mt-2 space-y-6">
					<div class="flex gap-2">
						<div class="flex h-6 shrink-0 items-center">
							<div class="group grid size-4 grid-cols-1">
								<input type="checkbox" id="best-practices" name="category" value="best-practices" checked data-wp-on--click="callbacks.setOptions" class="col-start-1 row-start-1 appearance-none rounded border border-gray-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 indeterminate:border-indigo-600 indeterminate:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto">
								<svg class="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-[:disabled]:stroke-gray-950/25" viewBox="0 0 14 14" fill="none">
									<path class="opacity-0 group-has-[:checked]:opacity-100" d="M3 8L6 11L11 3.5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
									<path class="opacity-0 group-has-[:indeterminate]:opacity-100" d="M3 7H11" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
								</svg>
							</div>
						</div>
						<div class="text-sm/6">
							<label for="best-practices" class="font-medium text-gray-900">Best Practices</label>
						</div>
					</div>
				</div>
				<div class="mt-2 space-y-6">
					<div class="flex gap-2">
						<div class="flex h-6 shrink-0 items-center">
							<div class="group grid size-4 grid-cols-1">
								<input type="checkbox" id="seo" name="category" value="seo" checked data-wp-on--click="callbacks.setOptions" class="col-start-1 row-start-1 appearance-none rounded border border-gray-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 indeterminate:border-indigo-600 indeterminate:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto">
								<svg class="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-[:disabled]:stroke-gray-950/25" viewBox="0 0 14 14" fill="none">
									<path class="opacity-0 group-has-[:checked]:opacity-100" d="M3 8L6 11L11 3.5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
									<path class="opacity-0 group-has-[:indeterminate]:opacity-100" d="M3 7H11" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
								</svg>
							</div>
						</div>
						<div class="text-sm/6">
							<label for="seo" class="font-medium text-gray-900">SEO</label>
						</div>
					</div>
				</div>
			</fieldset>
		</div>

		<button data-wp-on--click="actions.submit" data-wp-bind--disabled="context.processing" data-wp-text="context.submitBtnText" class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 mt-4">Submit</button>
		<!-- data-wp-bind--hidden="!context.processing"  -->
		<div data-wp-bind--hidden="!context.processing" class="bg-teal-100 mt-10">
			<div class="p-4 flex">
				<div class="w-full" data-wp-bind--hidden="!state.isPageSelected">
					<h2 class="text-lg font-bold text-gray-900">Page</h2>
					<p>Total Links: <span data-wp-text="context.status.page.totalEntries"></span></p>
					<p data-wp-text="context.status.page.text"></p>
					<div data-wp-text="state.getPageProgressPercentage" data-wp-bind--hidden="!context.status.page.processing">0%</div>
					<div class="loader" data-wp-bind--hidden="!context.status.page.processing"></div>

				</div>
				<div class="w-full" data-wp-bind--hidden="!state.isPostSelected">
					<h2 class="text-lg font-bold text-gray-900">Post</h2>
					<p>Total Links: <span data-wp-text="context.status.post.totalEntries"></span></p>
					<p data-wp-text="context.status.post.text"></p>
					<div data-wp-text="state.getPostProgressPercentage" data-wp-bind--hidden="!context.status.post.processing">0%</div>
					<div class="loader" data-wp-bind--hidden="!context.status.post.processing"></div>
				</div>
				<div class="w-full" data-wp-bind--hidden="!state.isCptsSelected">
					<h2 class="text-lg font-bold text-gray-900">Custom Post Types</h2>
					<p>Total Links: <span data-wp-text="context.status.cpts.totalEntries"></span></p>
					<p data-wp-text="context.status.cpts.text"></p>
					<div data-wp-text="state.getCptsProgressPercentage" data-wp-bind--hidden="!context.status.cpts.processing">0%</div>
					<div class="loader" data-wp-bind--hidden="!context.status.cpts.processing"></div>
				</div>
			</div>
		</div>



		<div class="w-ful mt-4" data-wp-bind--hidden="!state.isReportComplete">
			<button data-wp-bind--disabled="!state.isReportComplete" data-wp-on--click="callbacks.downloadCSV" class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded flex items-center gap-2"><img src="<?php echo WPA_BLOCKS_ROOT_URL; ?>assets/csv.png">Download CSV</button>
		</div>

		<h1 data-wp-bind--hidden="!state.isNotEmpty" class="text-lg font-bold text-gray-900 text-center p-4">Pagespeed Results: <span data-wp-text="context.totalLinks"></span> link(s)</h1>
		<div data-wp-bind--hidden="!state.isNotEmpty">
			<table class="w-full table-auto">
				<tbody>
					<tr>
						<th>URL</th>
						<th data-wp-bind--hidden="!state.isPerformanceSelected" data-wp-on--click="callbacks.sortPerformance" class="cursor-pointer">Performance</th>
						<th data-wp-bind--hidden="!state.isAccessibility" data-wp-on--click="callbacks.sortAccessibility" class="cursor-pointer">Accessibility</th>
						<th data-wp-bind--hidden="!state.isBestPracticesSelected" data-wp-on--click="callbacks.sortBestPractices" class="cursor-pointer">Best Practices</th>
						<th data-wp-bind--hidden="!state.isSeoSelected" data-wp-on--click="callbacks.sortSeo" class="cursor-pointer">SEO</th>
					</tr>
					<template data-wp-each="context.pagespeedResults">
						<tr class="even:bg-gray-50 odd:bg-white">
							<td data-wp-text="context.item.url"></td>
							<td data-wp-bind--hidden="!state.isPerformanceSelected" data-wp-text="context.item.performance"></td>
							<td data-wp-bind--hidden="!state.isAccessibility" data-wp-text="context.item.accessibility"></td>
							<td data-wp-bind--hidden="!state.isBestPracticesSelected" data-wp-text="context.item.best_practices"></td>
							<td data-wp-bind--hidden="!state.isSeoSelected" data-wp-text="context.item.seo"></td>
						</tr>
					</template>
				</tbody>
			</table>
		</div>
	</div>
</div>