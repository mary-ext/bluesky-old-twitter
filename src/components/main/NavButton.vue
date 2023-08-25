<script setup lang="ts">
import { type RouteLocationRaw, RouterLink } from 'vue-router';

import Icon from '~/components/Icon.vue';

const props = defineProps<{
	to: RouteLocationRaw;
	glyph: 'home' | 'notifications' | 'me';
	exact?: boolean;
	unread?: boolean;
}>();
</script>

<template>
	<RouterLink :to="props.to" :exact="props.exact" class="nav-button" v-slot="{ isActive, isExactActive }">
		<Icon
			size="lg"
			:glyph="(props.glyph + ((props.exact ? isExactActive : isActive) ? 'Filled' : '')) as any"
			class="nav-button__icon"
		/>
		<span class="nav-button__text">
			<slot />
		</span>

		<template v-if="props.unread">
			<div class="nav-button__dot"></div>
		</template>
	</RouterLink>
</template>

<style scoped>
.nav-button {
	display: flex;
	position: relative;
	padding: 0 14px 0 4px;
	height: 46px;
	color: inherit;
	font-weight: bold;
	font-size: 13px;
	line-height: 1;
}

.nav-button:hover {
	color: #1b95e0;
}

.nav-button:where(:hover, .router-link-active[exact='false'], .router-link-exact-active) {
	box-shadow: 0px -7px 0px -4px #1b95e0 inset;
	color: #1b95e0;
}

.nav-button__icon {
	float: left;
	margin: 11px 0 0 10px;
	width: 23px;
	height: 23px;
}

.nav-button__text {
	float: left;
	margin-top: 17px;
	margin-left: 6px;
	padding: 0;
}

.nav-button__badge {
	position: absolute;
	top: calc(0px + (24px * 0.5));
	left: calc(14px + (23px * 0.5));
	border: 2px solid #fff;
	border-radius: 100%;
	background-color: #1b95e0;
	width: 8px;
	height: 8px;
}
</style>
