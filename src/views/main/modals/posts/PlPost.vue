<script lang="ts"></script>

<script setup lang="ts">
import { toRef } from 'vue';

import type { SignalizedPost } from '~/api/cache/posts.ts';

import * as reltime from '~/utils/intl/reltime.ts';

import Button from '~/components/Button.vue';
import Icon from '~/components/Icon.vue';

import DefaultAvatar from '~/assets/default-avatar.png';

const props = defineProps<{
	post: SignalizedPost;
}>();

const post = toRef(props, 'post');
const author = toRef(() => post.value.author);
const record = toRef(() => post.value.record.value);
</script>

<template>
	<div class="plpost">
		<div class="plpost-header">
			<img :src="author.avatar.value || DefaultAvatar" class="plpost-header__avatar" />

			<a class="plpost-author">
				<span dir="auto" class="plpost-author__name">{{ author.displayName.value }}</span>
				<span class="plpost-author__handle">@{{ author.handle.value }}</span>
			</a>

			<div class="plpost-header__spacer"></div>

			<Button :variant="author.viewer.following.value ? 'secondary' : 'primary'" size="md">
				{{ author.viewer.following.value ? `Following` : `Follow` }}
			</Button>
		</div>

		<p class="plpost-body plpost-body--2xl">{{ record.text }}</p>

		<div class="plpost-blurb">
			<span class="plpost-blurb__timestamp">
				{{ reltime.formatAbsWithTime(record.createdAt) }}
			</span>
		</div>

		<div class="plpost-stats">
			<a class="plpost-stat">
				<strong>{{ post.repostCount.value }}</strong> Reposts
			</a>
			<a class="plpost-stat">
				<strong>{{ post.likeCount.value }}</strong> Likes
			</a>
		</div>

		<div class="plpost-actions">
			<button type="button" title="Reply" class="plpost-action plpost-action--reply">
				<Icon size="md" glyph="reply" />
				<span class="plpost-action__count">{{ post.replyCount.value }}</span>
			</button>

			<button
				type="button"
				title="Repost"
				class="plpost-action plpost-action--repost"
				:class="{ 'action--self': post.viewer.repost.value }"
			>
				<Icon size="md" glyph="retweet" />
				<span class="plpost-action__count">{{ post.repostCount.value }}</span>
			</button>

			<button
				type="button"
				title="Like"
				class="plpost-action plpost-action--like"
				:class="{ 'action--self': post.viewer.like.value }"
			>
				<Icon size="md" :glyph="post.viewer.like.value ? 'heartBadge' : 'heart'" />
				<span class="plpost-action__count">{{ post.likeCount.value }}</span>
			</button>
		</div>
	</div>
</template>

<style scoped>
.plpost {
	padding: 30px 40px;
}

.plpost-header {
	display: flex;
	align-items: center;
	gap: 10px;
	margin: 0 0 15px 0;
}
.plpost-header__avatar {
	border-radius: 9999px;
	width: 48px;
	height: 48px;
}
.plpost-header__spacer {
	flex-grow: 1;
}

.plpost-author {
	display: flex;
	flex-direction: column;
}
.plpost-author__name,
.plpost-author__handle {
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 1;
	display: -webkit-box;
	overflow: hidden;
	word-break: break-all;
}
.plpost-author__name {
	color: #14171a;
	font-weight: 700;
	font-size: 18px;
}
.plpost-author__handle {
	color: #657786;
}
.plpost-author:hover .plpost-author__name {
	color: #1b95e0;
	text-decoration: underline;
}

.plpost-body {
	font-size: 14px;
	line-height: 20px;
	white-space: pre-wrap;
	overflow-wrap: break-word;
}
.plpost-body--md {
	font-size: 14px;
	line-height: 20px;
}
.plpost-body--lg {
	font-size: 18px;
	line-height: 24px;
}
.plpost-body--xl {
	font-size: 21px;
	line-height: 28px;
}
.plpost-body--2xl {
	font-size: 27px;
	line-height: 32px;
	letter-spacing: 0.01em;
}

.plpost-blurb {
	margin-top: 10px;
}
.plpost-blurb__timestamp {
	color: #657786;
	line-height: 24px;
}

.plpost-stats {
	display: flex;
	align-items: center;
	gap: 10px;
	margin-top: 10px;
	border-top: 1px solid #e6ecf0;
	height: 46px;
}
.plpost-stat {
	color: #657786;
}
.plpost-stat strong {
	color: #14171a;
}
.plpost-stat:hover,
.plpost-stat:hover strong {
	color: #1c94e0;
}

.plpost-actions {
	display: flex;
	gap: 9px;
	border-top: 1px solid #e6ecf0;
	padding: 15px 0 0 0;
}

.plpost-action {
	display: flex;
	align-items: center;
	width: 72px;
	color: #657786;
}
.plpost-action:hover {
	color: #1b95e0;
}
.plpost-action.plpost-action--repost:is(:hover, .action--self) {
	color: #17bf63;
}
.plpost-action.plpost-action--like:is(:hover, .action--self) {
	color: #e0245e;
}

.plpost-action .icon {
	top: -2px;
}

.plpost-action__count {
	margin: 0 0 0 9px;
	font-weight: 700;
	font-size: 0.75rem;
}
</style>
