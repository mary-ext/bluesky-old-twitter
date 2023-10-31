<script lang="ts">
export const createPostKey = (cid: string, parent: boolean, next: boolean) => {
	return `posts/${cid}:${+parent}${+next}`;
};
</script>

<script setup lang="ts">
import { toRef } from 'vue';
import { useRouter } from 'vue-router';

import type { DID } from '@externdefs/bluesky-client/atp-schema';

import type { SignalizedPost, SignalizedTimelinePost } from '~/api/cache/posts.ts';
import { getRecordId } from '~/api/utils.ts';

import { isElementAltClicked, isElementClicked } from '~/utils/misc.ts';
import * as reltime from '~/utils/intl/reltime.ts';

import Icon from '~/components/Icon.vue';

import DefaultAvatar from '~/assets/default-avatar.png';

const router = useRouter();

const props = defineProps<{
	uid: DID;
	post: SignalizedPost;
	parent?: SignalizedPost;
	reason?: SignalizedTimelinePost['reason'];
	prev?: boolean;
	next?: boolean;
}>();

const author = toRef(() => props.post.author);
const record = toRef(() => props.post.record.value);

const handleClick = (ev: MouseEvent | KeyboardEvent) => {
	if (!isElementClicked(ev)) {
		return;
	}

	let path = `/u/${props.uid}/profile/${author.value.did}/post/${getRecordId(props.post.uri)}`;

	if (isElementAltClicked(ev)) {
		open(path, '_blank');
	} else {
		router.push(path);
	}
};
</script>

<template>
	<div
		@click="handleClick"
		@auxclick="handleClick"
		@keydown="handleClick"
		class="post"
		:class="{ 'post--end': !next }"
	>
		<div class="post__context">
			<!-- Repost context -->
			<template v-if="reason && reason.$type === 'app.bsky.feed.defs#reasonRepost'">
				<div class="post-context">
					<div class="post-context__glyph">
						<Icon size="sm" glyph="retweeted" />
					</div>

					<div class="post-context__content">
						<a dir="auto" class="post-context__user">{{ reason.by.displayName || `@${reason.by.handle}` }}</a>
						<span class="post-context__text"> Reposted</span>
					</div>
				</div>
			</template>
		</div>

		<div class="post-inner">
			<div class="post-inner__side">
				<template v-if="prev && parent">
					<div class="post-connector post-connector--prev"></div>
				</template>

				<img :src="author.avatar.value || DefaultAvatar" class="post-inner__avatar" />

				<template v-if="next">
					<div class="post-connector post-connector--next"></div>
				</template>
			</div>
			<div class="post-inner__content">
				<div class="post-content__header">
					<a class="post-content__author">
						<span dir="auto" class="post-author__name">{{ author.displayName.value }}</span>
						<span class="post-author__handle">@{{ author.handle.value }}</span>
					</a>

					<span class="post-content__separator">·</span>

					<a :title="reltime.formatAbsWithTime(record.createdAt)" class="post-content__timestamp">
						{{ reltime.format(record.createdAt) }}
					</a>

					<div class="post-content__more">
						<button title="More actions" class="post-content__more-btn">
							<Icon size="sm" glyph="caretDownLight" />
						</button>
					</div>
				</div>

				<template v-if="!prev && parent">
					<div class="post-content__reply-to">
						Replying to <a class="post-reply-to__handle">@{{ parent.author.handle.value }}</a>
					</div>
				</template>

				<p class="post-content__body">{{ record.text }}</p>

				<div class="post-actions">
					<button type="button" title="Reply" class="post-action post-action--reply">
						<Icon size="md" glyph="reply" />
						<span class="post-action__count">{{ post.replyCount.value }}</span>
					</button>

					<button
						type="button"
						title="Repost"
						class="post-action post-action--repost"
						:class="{ 'action--self': post.viewer.repost.value }"
					>
						<Icon size="md" glyph="retweet" />
						<span class="post-action__count">{{ post.repostCount.value }}</span>
					</button>

					<button
						type="button"
						title="Like"
						class="post-action post-action--like"
						:class="{ 'action--self': post.viewer.like.value }"
					>
						<Icon size="md" :glyph="post.viewer.like.value ? 'heartBadge' : 'heart'" />
						<span class="post-action__count">{{ post.likeCount.value }}</span>
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
.post {
	position: relative;
	cursor: pointer;
	padding: 9px 12px;
}
.post--end {
	border-bottom: 1px solid #e6ecf0;
}

.post:hover {
	background-color: #f5f8fa;
}

.post-context {
	display: flex;
	align-items: center;
	gap: 10px;
	margin: 0 0 3px 0;
	color: #657786;
	font-size: 0.75rem;
}

.post-context__glyph {
	display: flex;
	flex: 0 1 auto;
	justify-content: end;
	width: 48px;
}
.post-context__glyph :deep(.icon) {
	top: -1px;
	font-size: 0.875rem;
}

.post-context__user:hover {
	color: #1b95e0;
	text-decoration: underline;
}
.post-context__text {
	whitespace: pre;
}

.post-inner {
	display: flex;
	gap: 10px;
}

.post-inner__side {
	display: flex;
	flex: 0 0 auto;
	flex-direction: column;
	align-items: center;
}

.post-connector {
	border-left: 3px solid #a7c7de;
	border-radius: 2px;
}
.post-connector--prev {
	margin: calc(-16.5px - 9px - 4px) 0 4px 0;
	height: calc(16.5px + 9px);
}
.post-connector--next {
	flex: 1 1 auto;
	margin: 4px 0 -9px 0;
}

.post-inner__avatar {
	border-radius: 9999px;
	width: 48px;
	height: 48px;
}

.post-inner__content {
	flex: 1 1 auto;
	min-width: 0px;
}

.post-content__header {
	display: flex;
	align-items: center;
	color: #657786;
}

.post-content__separator {
	padding: 0 4px;
}

.post-content__more {
	margin: 0 0 0 auto;
	padding: 0 0 0 9px;
}
.post-content__more-btn:hover {
	color: #1b95e0;
}
.post-content__more-btn :deep(.icon) {
	vertical-align: -2px;
}

.post-content__timestamp {
	white-space: nowrap;
}
.post-content__timestamp:hover {
	color: #1b95e0;
	text-decoration: underline;
}

.post-content__author {
	display: flex;
	gap: 4px;
}

.post-author__name,
.post-author__handle {
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 1;
	display: -webkit-box;
	overflow: hidden;
	word-break: break-all;
}

.post-author__name {
	color: #14171a;
	font-weight: 700;
}
.post-author__name:empty {
	display: none;
}
.post-content__author:hover .post-author__name {
	color: #1b95e0;
	text-decoration: underline;
}

.post-content__reply-to {
	padding: 4px 0;
	color: #657786;
	line-height: 1.25rem;
}
.post-reply-to__handle {
	color: #1b95e0;
}
.post-reply-to__handle:hover {
	text-decoration: underline;
}

.post-content__body {
	font-size: 0.875rem;
	line-height: 1.25rem;
	white-space: pre-wrap;
	overflow-wrap: break-word;
}

.post-actions {
	display: flex;
	gap: 9px;
	padding: 10px 0 2px 0;
}

.post-action {
	display: flex;
	align-items: center;
	width: 72px;
	color: #657786;
}
.post-action:hover {
	color: #1b95e0;
}
.post-action.post-action--repost:is(:hover, .action--self) {
	color: #17bf63;
}
.post-action.post-action--like:is(:hover, .action--self) {
	color: #e0245e;
}

.post-action .icon {
	top: -2px;
}

.post-action__count {
	margin: 0 0 0 9px;
	font-weight: 700;
	font-size: 0.75rem;
}
</style>
