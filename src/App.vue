<script setup lang="ts">
import { computed } from 'vue';
import {
	type RouteLocationNormalizedLoaded as LoadedRouteLocation,
	RouterView,
	useRoute,
	useRouter,
} from 'vue-router';

import { backgroundId, historyState } from './router.ts';

const router = useRouter();
const route = useRoute();

const handleModalRoute = (route: LoadedRouteLocation): LoadedRouteLocation => {
	// on modal routes, we only want the actual modal itself to be rendered
	return { ...route, matched: route.matched.slice(-1) };
};

const resolvedRoute = computed((): [bg: LoadedRouteLocation, fg: LoadedRouteLocation | null] => {
	const state = historyState.value;
	const meta = route.meta;

	route.path;

	if (state && state.bg_id === backgroundId) {
		const resolved = router.resolve(state.bg_route!);

		return [resolved, handleModalRoute(route)];
	} else if (meta && meta.defaultBackgroundRoute) {
		const to = meta.defaultBackgroundRoute(route);
		const resolved = router.resolve(to);

		return [resolved, handleModalRoute(route)];
	}

	return [route, null];
});
</script>

<template>
	<RouterView :route="resolvedRoute[0]" />

	<template v-if="resolvedRoute[1]">
		<RouterView :route="resolvedRoute[1]" />
	</template>
</template>
