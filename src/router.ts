import { shallowRef } from 'vue';
import { type HistoryState, createRouter, createWebHistory, loadRouteLocation } from 'vue-router';

import type { DID } from '@intrnl/bluesky-client/atp-schema';

import { isDid } from '~/api/utils.ts';
import { multiagent } from '~/globals/agent.ts';

export const router = createRouter({
	history: createWebHistory(),
	routes: [
		{
			path: '/',
			component: () => import('~/views/FrontPage.vue'),
		},
		{
			path: '/u/:uid',
			component: () => import('~/views/main/MainLayout.vue'),
			beforeEnter(to) {
				const uid = to.params.uid as string;
				const $accounts = multiagent.accounts;

				if (!$accounts || !isDid(uid) || !$accounts[uid]) {
					const path = to.path.slice(4 + uid.length);

					return {
						path: '/',
						query: {
							to: `@uid/${path}`,
						},
					};
				}
			},
			children: [
				{
					path: '',
					component: () => import('~/views/main/home/HomePage.vue'),
				},
				{
					path: 'notifications',
					component: () => import('~/views/main/notifications/NotificationsPage.vue'),
				},

				{
					path: 'profile/:actor',
					component: () => import('~/views/main/profile/ProfileLayout.vue'),
					children: [
						{
							path: '',
							component: () => import('~/views/main/profile/ProfileTimelinePage.vue'),
						},
					],
				},

				{
					path: 'profile/:actor/post/:tid',
					component: () => import('~/views/main/modals/PostsModal.vue'),
					meta: {
						defaultBackgroundRoute(to) {
							const uid = to.params.uid as DID;
							const actor = to.params.actor as string;

							return { path: `/u/${uid}/profile/${actor}` };
						},
					},
				},
			],
		},

		{
			path: '/:rest(.*)*',
			component: () => import('~/views/NotFoundPage.vue'),
		},
	],
});

// Modal route handling
export const backgroundId = Date.now().toString(36);
export const historyState = shallowRef(history.state as HistoryState);

router.afterEach(() => {
	historyState.value = history.state || {};
});

router.beforeResolve(async (to) => {
	const state = historyState.value;
	const meta = to.meta;

	// NOTE: this code should be matched with the one in `src/App.vue`

	// TODO: there's currently an issue where going back and forth after reloading
	// in a modal route results in the background view getting changed, it should
	// reuse the view instead.

	if (state && state.bg_id === backgroundId) {
		const resolved = router.resolve(state.bg_route!);

		await loadRouteLocation(resolved);
	} else if (meta && meta.defaultBackgroundRoute) {
		const bg = meta.defaultBackgroundRoute(to);
		const resolved = router.resolve(bg);

		await loadRouteLocation(resolved);
	}
});

declare module 'vue-router' {
	interface HistoryState {
		/** Ensures  we're only using `bg_route` if it matches with our random ID */
		bg_id?: string;
		/** Route path to use as background view for modal routes */
		bg_route?: RouteLocationRaw;
	}

	interface RouteMeta {
		/**
		 * Indicates that this route is a modal-only route, it will try to use the
		 * previous route as the background view, but if it can't, it will call this
		 * function to get the "default" background view
		 */
		defaultBackgroundRoute?: (to: RouteLocationNormalized) => RouteLocationRaw;
	}
}
