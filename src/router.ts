import { shallowRef } from 'vue';
import { type HistoryState, createRouter, createWebHistory, loadRouteLocation } from 'vue-router';

import type { DID } from '@externdefs/bluesky-client/atp-schema';

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

							return `/u/${uid}/profile/${actor}`;
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
let first = true;

router.beforeResolve(async (to, from) => {
	const meta = to.meta;

	if (meta.defaultBackgroundRoute) {
		if (first) {
			const bg = meta.defaultBackgroundRoute(to);
			const resolved = router.resolve(bg);

			await loadRouteLocation(resolved);

			meta._bgRoute = resolved;
		} else if (from.meta._bgRoute) {
			meta._bgRoute = from.meta._bgRoute;
		} else {
			meta._bgRoute = from;
		}
	}

	first = false;
});

declare module 'vue-router' {
	interface RouteMeta {
		/**
		 * Indicates that this route is a modal route, it will try to use the route
		 * it was transitioning from as the background view, but if it can't, it
		 * will call this function to get the "default" background view for use
		 */
		defaultBackgroundRoute?: (to: RouteLocationNormalized) => RouteLocationRaw;

		/**
		 * @internal
		 * This is an internal property for our navigation guards to attach the
		 * appropriate background view to use for a modal route.
		 */
		_bgRoute?: RouteLocation;
	}
}
