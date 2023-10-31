<script setup lang="ts">
import { computed, toRef } from 'vue';
import { RouterView, useRoute } from 'vue-router';

import type { DID } from '@externdefs/bluesky-client/atp-schema';
import { useQuery } from '@tanstack/vue-query';

import { getProfileKey, getProfile } from '~/api/queries/get-profile';

import Button from '~/components/Button.vue';
import NavButton from '~/components/main/NavButton.vue';
import SearchBluesky from '~/components/main/SearchBluesky.vue';

import DefaultAvatar from '~/assets/default-avatar.png';

const route = useRoute();
const uid = toRef(() => route.params.uid as DID);

const { data: profile } = useQuery({
	queryKey: computed(() => getProfileKey(uid.value, uid.value)),
	queryFn: getProfile,
	staleTime: 60_000,
	refetchOnWindowFocus: false,
});
</script>

<template>
	<div class="layout">
		<div class="header">
			<div class="header__inner">
				<div class="header__nav">
					<NavButton :to="`/u/${uid}`" glyph="home" exact>Home</NavButton>
					<NavButton :to="`/u/${uid}/notifications`" glyph="notifications">Notifications</NavButton>
					<NavButton :to="`/u/${uid}/profile/${uid}`" glyph="me">Me</NavButton>
				</div>

				<div class="header__spacer" />

				<div class="header__side">
					<SearchBluesky />

					<img :src="(profile && profile.avatar.value) || DefaultAvatar" class="avatar" />

					<Button variant="primary">Post</Button>
				</div>
			</div>
		</div>

		<div class="main">
			<RouterView />
		</div>
	</div>
</template>

<style scoped>
.header {
	border-bottom: 1px solid rgba(0, 0, 0, 0.15);
	background-color: #fff;
	height: 46px;
	color: #66757f;
}

.header__inner {
	display: flex;
	align-items: center;
	margin: 0 auto;
	max-width: 890px;
	height: 100%;
}

@media screen and (min-width: 1236px) {
	.header__inner {
		max-width: 1190px;
	}
}

.header__spacer {
	flex-grow: 1;
}

.header__nav {
	display: flex;
}

.header__side {
	display: flex;
	gap: 15px;
}

.avatar {
	border-radius: 9999px;
	width: 32px;
	height: 32px;
}
</style>
