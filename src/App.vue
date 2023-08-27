<script setup lang="ts">
import { computed } from 'vue';
import { type RouteLocationNormalizedLoaded as LoadedRouteLocation, RouterView, useRoute } from 'vue-router';

import { assert } from '~/utils/misc.ts';

const route = useRoute();

const handleModalRoute = (route: LoadedRouteLocation): LoadedRouteLocation => {
	// on modal routes, we only want the actual modal itself to be rendered
	return { ...route, matched: route.matched.slice(-1) };
};

const resolvedRoute = computed((): [bg: LoadedRouteLocation, fg: LoadedRouteLocation | null] => {
	const meta = route.meta;

	if (meta && meta.defaultBackgroundRoute) {
		const resolved = meta._bgRoute;
		assert(resolved != null);

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
