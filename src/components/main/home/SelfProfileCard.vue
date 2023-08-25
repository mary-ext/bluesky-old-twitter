<script lang="ts">
const shortform = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 });
const longform = new Intl.NumberFormat('en-US');

const formatStat = (value: number) => {
	return (value >= 10_000 ? shortform : longform).format(value);
};
</script>

<script setup lang="ts">
import { computed } from 'vue';

import type { DID } from '@intrnl/bluesky-client/atp-schema';
import { useQuery } from '@tanstack/vue-query';

import { getProfile, getProfileKey } from '~/api/queries/get-profile.ts';

import DefaultAvatar from '~/assets/default-avatar.png';

const props = defineProps<{
	uid: DID;
}>();

const { data: profile } = useQuery({
	queryKey: computed(() => getProfileKey(props.uid, props.uid)),
	queryFn: getProfile,
	staleTime: 60_000,
});
</script>

<template>
	<div class="card">
		<template v-if="profile && profile.banner.value">
			<img class="banner" :src="profile.banner.value" />
		</template>
		<template v-else>
			<div class="banner" />
		</template>

		<div class="info">
			<img class="avatar" :src="(profile && profile.avatar.value) || DefaultAvatar" />

			<div class="user">
				<p class="user__name">{{ profile ? profile.displayName.value || profile.handle.value : '-' }}</p>
				<p class="user__handle">{{ profile ? `@${profile.handle.value}` : '-' }}</p>
			</div>
		</div>

		<div class="stats">
			<div class="stat">
				<p class="stat__title">Posts</p>
				<p class="stat__count">{{ profile ? formatStat(profile.postsCount.value) : '-' }}</p>
			</div>
			<div class="stat">
				<p class="stat__title">Following</p>
				<p class="stat__count">{{ profile ? formatStat(profile.followsCount.value) : '-' }}</p>
			</div>
			<div class="stat">
				<p class="stat__title">Followers</p>
				<p class="stat__count">{{ profile ? formatStat(profile.followersCount.value) : '-' }}</p>
			</div>
		</div>
	</div>
</template>

<style scoped>
.card {
	background-color: #ffffff;
}

.banner {
	background-color: #1a75b4;
	height: 100px;
	object-fit: cover;
}

.info {
	display: flex;
	gap: 8px;
	padding: 8px 8px 0;
}

.avatar {
	margin-top: -45px;
	border: 4px solid #ffffff;
	border-radius: 9999px;
	width: 78px;
	height: 78px;
}
.user__name {
	color: #14171a;
	font-weight: 700;
	font-size: 1.25rem;
	line-height: 1.75rem;
}
.user__handle {
	color: #657786;
	font-size: 0.875rem;
	line-height: 1.25rem;
}

.stats {
	display: flex;
	padding: 10px 15px;
}
.stat {
	flex: 1 0 0px;
}
.stat__title {
	margin: 0 0 2px 0;
	color: #657786;
	font-weight: 700;
	font-size: 0.875rem;
	line-height: 1.25rem;
}
.stat__count {
	color: #1b95e0;
	font-weight: 700;
	font-size: 1.25rem;
	line-height: 1.75rem;
}
</style>
