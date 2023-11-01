<script setup lang="ts">
import { computed, toRef } from 'vue';
import { useRoute } from 'vue-router';

import type { DID } from '@externdefs/bluesky-client/atp-schema';
import { useQuery } from '@tanstack/vue-query';

import { createInitialProfileData, getProfile, getProfileKey } from '~/api/queries/get-profile.ts';
import { RouterLink } from 'vue-router';

const route = useRoute();
const uid = toRef(() => route.params.uid as DID);
const actor = toRef(() => route.params.actor as string);

const { data } = useQuery({
	queryKey: computed(() => getProfileKey(uid.value, actor.value)),
	queryFn: getProfile,
	initialData: createInitialProfileData(uid, actor),
	initialDataUpdatedAt: 0,
	staleTime: 30_000,
});

const resolvedActor = toRef(() => {
	const $data = data.value;
	return $data ? $data.did : actor.value;
});
</script>

<template>
	<div class="sticky">
		<div class="banner">
			<template v-if="data && data.banner.value">
				<img class="banner__img" :src="data.banner.value" />
			</template>
		</div>

		<div class="header">
			<div class="header__content">
				<div class="header__aside"></div>
				<div class="header__tabs">
					<RouterLink :to="`/u/${uid}/profile/${resolvedActor}`" class="tab" aria-label="Posts">
						<span class="tab__title">Posts</span>
						<span class="tab__count">{{ data ? data.postsCount : 0 }}</span>
					</RouterLink>
					<RouterLink :to="`/u/${uid}/profile/${resolvedActor}/follows`" class="tab" aria-label="Posts">
						<span class="tab__title">Follows</span>
						<span class="tab__count">{{ data ? data.followsCount : 0 }}</span>
					</RouterLink>
					<RouterLink :to="`/u/${uid}/profile/${resolvedActor}/followers`" class="tab" aria-label="Posts">
						<span class="tab__title">Followers</span>
						<span class="tab__count">{{ data ? data.followersCount : 0 }}</span>
					</RouterLink>
				</div>
			</div>
		</div>
	</div>

	<div style="height: 200vh"></div>
</template>

<style scoped>
.sticky {
	--banner-height: 200px;
	position: sticky;
	top: calc((-1 * var(--banner-height)) + 46px + 20px);
}

.banner {
	position: relative;
	background: #1b95e0;
	height: var(--banner-height);
}
.banner::before {
	position: absolute;
	inset: 0;
	box-shadow: inset 0 0 1px 1px rgba(0, 0, 0, 0.25);
	content: '';
}

.banner__img {
	width: 100%;
	height: 100%;
	object-fit: cover;
}

.header {
	box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.25);
	background: #ffffff;
}

.header__content {
	display: grid;
	grid-template-columns: minmax(0, 290px) minmax(0, 2fr);
	gap: 10px;
	margin: 0 auto;
	padding: 0 5px;
	max-width: 890px;
	height: 60px;
}

.header__tabs {
	display: flex;
}

.tab {
	display: flex;
	flex-direction: column;
	gap: 3px;
	box-sizing: border-box;
	padding: 14px 15px 7px 15px;
	height: 60px;
	line-height: 1;
	text-align: center;
}
.tab__title {
	color: #657786;
	font-weight: 700;
	font-size: 12px;
	letter-spacing: 0.02em;
}
.tab__count {
	color: #66757f;
	font-weight: 700;
	font-size: 18px;
}

.tab:hover,
.tab.router-link-exact-active {
	border-bottom: 2px solid #1b95e0;
}
.tab:hover .tab__count,
.tab.router-link-exact-active .tab__count {
	color: #1b95e0;
}

@media (min-width: 1236px) {
	.header__content {
		max-width: 1190px;
	}
}

/* NOTE(mary-ext): if only we knew why Twitter chose to have 5 breakpoints here */
@media (min-width: 1100px) {
	.sticky {
		--banner-height: 300px;
	}
}
@media (min-width: 1200px) {
	.sticky {
		--banner-height: 320px;
	}
}
@media (min-width: 1370px) {
	.sticky {
		--banner-height: 360px;
	}
}
@media (min-width: 1450px) {
	.sticky {
		--banner-height: 380px;
	}
}
@media (min-width: 1510px) {
	.sticky {
		--banner-height: 420px;
	}
}
</style>
