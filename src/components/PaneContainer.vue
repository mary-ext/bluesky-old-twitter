<script setup lang="ts">
import { useMediaQuery } from '~/utils/media-query';

const isWidescreen = useMediaQuery('(min-width: 1236px)');
</script>

<template>
	<div class="pane">
		<div class="left">
			<slot name="left" :constrained="!isWidescreen"></slot>
		</div>

		<div class="main">
			<slot></slot>
		</div>

		<div v-if="isWidescreen" class="right">
			<slot name="right"></slot>
		</div>
	</div>
</template>

<style scoped>
.pane {
	display: grid;
	grid-template-columns: minmax(0, 290px) minmax(0, 2fr);
	gap: 10px;
	margin: 0 auto;
	padding: 10px 5px;
	max-width: 890px;
}

@media (min-width: 1236px) {
	.pane {
		grid-template-columns: minmax(0, 290px) minmax(0, 4fr) minmax(0, 290px);
		max-width: 1190px;
	}
}
</style>
