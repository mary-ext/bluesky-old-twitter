<script setup lang="ts">
import { computed, toRef } from 'vue';
import { useRoute } from 'vue-router';

import type { DID } from '@intrnl/bluesky-client/atp-schema';
import { useInfiniteQuery } from '@tanstack/vue-query';

import { type FeedPageParam, getTimelineKey, getTimeline } from '~/api/queries/get-timeline.ts';

import Post, { createPostKey } from '~/components/Post.vue';
import PaneContainer from '~/components/PaneContainer.vue';
import SelfProfileCard from '~/components/main/home/SelfProfileCard.vue';
import VirtualContainer from '~/components/VirtualContainer.vue';

const route = useRoute();
const uid = toRef(() => route.params.uid as DID);

const { data } = useInfiniteQuery({
	queryKey: computed(() => getTimelineKey(uid.value, { type: 'home', algorithm: 'reverse-chronological' })),
	queryFn: getTimeline,
	getNextPageParam: (l) => ({ cursor: l.cursor, remainingSlices: l.remainingSlices }) as FeedPageParam,
	refetchOnMount: true,
	refetchOnReconnect: false,
	refetchOnWindowFocus: false,
});

const flattenedSlices = computed(() => {
	const $data = data.value;

	if (!$data) {
		return [];
	}

	return $data.pages.flatMap((page) => page.slices);
});
</script>

<template>
	<PaneContainer>
		<template #left>
			<SelfProfileCard :uid="uid" />
		</template>

		<template #default>
			<div class="timeline-container">
				<div class="compose-container"></div>
				<div>
					<template
						v-for="slice of flattenedSlices"
						v-memo="[slice.items.length, slice.items[0].post.cid.value]"
					>
						<template v-for="(item, idx) of slice.items">
							<VirtualContainer
								:id="
									createPostKey(
										item.post.cid.value,
										(!!item.reply?.parent && idx === 0) || !!item.reason,
										idx !== slice.items.length - 1,
									)
								"
								:estimate-height="88.05"
							>
								<Post
									:uid="uid"
									:post="item.post"
									:parent="item.reply?.parent"
									:reason="item.reason"
									:prev="idx !== 0"
									:next="idx !== slice.items.length - 1"
								/>
							</VirtualContainer>
						</template>
					</template>
				</div>
			</div>
		</template>
	</PaneContainer>
</template>

<style scoped>
.timeline-container {
	background-color: #ffffff;
}

.compose-container {
	position: relative;
	z-index: 0;
	border-bottom: 1px solid #e6ecf0;
	background-color: #1b95e0;
	padding: 9px 12px;
}

.compose-container::before {
	position: absolute;
	z-index: -10;
	inset: 0px;
	background-color: rgb(255 255 255 / 0.92);
	content: '';
}
</style>
