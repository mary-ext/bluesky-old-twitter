<script lang="ts">
const MAX_ANCESTORS = 10;
const MAX_DESCENDANTS = 4;
</script>

<script setup lang="ts">
import { computed, toRef } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import type { DID } from '@intrnl/bluesky-client/atp-schema';
import { useQuery } from '@tanstack/vue-query';

import { getPostThread, getPostThreadKey } from '~/api/queries/get-post-thread.ts';

import Dialog from '~/components/Dialog.vue';

import PlPost from './posts/PlPost.vue';

const router = useRouter();
const route = useRoute();

const uid = toRef(() => route.params.uid as DID);
const actor = toRef(() => route.params.actor as string);
const tid = toRef(() => route.params.tid as string);

const { data: thread, error } = useQuery({
	queryKey: computed(() =>
		getPostThreadKey(uid.value, actor.value, tid.value, MAX_DESCENDANTS + 1, MAX_ANCESTORS + 1),
	),
	queryFn: getPostThread,
	staleTime: 10_000,
	refetchOnMount: true,
	refetchOnReconnect: false,
	refetchOnWindowFocus: false,
});

const handleClose = () => {
	if (!history.state || !history.state.back) {
		router.push(`/u/${uid.value}/profile/${actor.value}`);
	} else {
		router.back();
	}
};
</script>

<template>
	<Dialog open @close="handleClose">
		<template v-if="error">
			<div class="pl-modal">Something went wrong, please try again later</div>
		</template>
		<template v-else-if="thread">
			<div class="pl-modal">
				<PlPost :uid="uid" :post="thread.post" />
			</div>
		</template>
		<template v-else>
			<div class="pl-modal">Loading</div>
		</template>
	</Dialog>
</template>

<style scoped>
.dialog {
	overflow-y: scroll;
}

.pl-modal {
	margin: 60px 0;
	border-radius: 8px;
	background-color: #ffffff;
	width: 100%;
	max-width: 640px;
}
</style>
