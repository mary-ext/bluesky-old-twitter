<script lang="ts">
import { shallowReactive } from 'vue';

const cachedHeights = shallowReactive<Record<string, number>>({});
</script>

<script setup lang="ts">
import { ref } from 'vue';

import { scheduleIdleTask } from '~/utils/idle.ts';
import { getRectFromEntry, scrollObserver } from '~/utils/intersection-observer.ts';

let height: number | undefined;
let entry: IntersectionObserverEntry | undefined;

const props = defineProps<{
	id: string;
	estimateHeight?: number;
}>();

const intersecting = ref(false);

const calculateHeight = () => {
	const next = getRectFromEntry(entry!).height;

	if (next !== height) {
		height = next;
		cachedHeights[props.id] = height;
	}
};

const handleIntersect = (next: IntersectionObserverEntry) => {
	const intersect = next.isIntersecting;

	entry = next;

	if (intersect && !intersecting.value) {
		scheduleIdleTask(calculateHeight);
	}

	intersecting.value = intersect;
};

const measure = (node: any) => {
	return scrollObserver.observe(node);
};

const cachedHeight = () => {
	return cachedHeights[props.id] ?? props.estimateHeight;
};

const shouldHide = () => {
	return !intersecting.value && cachedHeight() !== undefined;
};
</script>

<template>
	<article
		:ref="measure"
		:style="{ height: shouldHide() ? `${height || cachedHeight()}px` : undefined }"
		.$onintersect="handleIntersect"
	>
		<slot v-if="!shouldHide()"></slot>
	</article>
</template>
