import { type Ref, markRaw, shallowRef as ref } from 'vue';

import type { DID, Records, RefOf } from '@intrnl/bluesky-client/atp-schema';

import { type SignalizedProfile, mergeSignalizedProfile } from './profiles.ts';
import { assignDequalRef } from '~/utils/refs.ts';

type Post = RefOf<'app.bsky.feed.defs#postView'>;
type FeedPost = RefOf<'app.bsky.feed.defs#feedViewPost'>;

type PostRecord = Records['app.bsky.feed.post'];

export interface SignalizedPost {
	_key?: number;
	uri: Post['uri'];
	cid: Ref<Post['cid']>;
	author: SignalizedProfile;
	record: Ref<PostRecord>;
	embed: Ref<Post['embed']>;
	replyCount: Ref<NonNullable<Post['replyCount']>>;
	repostCount: Ref<NonNullable<Post['repostCount']>>;
	likeCount: Ref<NonNullable<Post['likeCount']>>;
	labels: Ref<Post['labels']>;
	viewer: {
		like: Ref<NonNullable<Post['viewer']>['like']>;
		repost: Ref<NonNullable<Post['viewer']>['repost']>;
	};
}

export const posts: Record<string, WeakRef<SignalizedPost>> = {};

const createSignalizedPost = (uid: DID, post: Post, key?: number): SignalizedPost => {
	return markRaw({
		_key: key,
		uri: post.uri,
		cid: ref(post.cid),
		author: mergeSignalizedProfile(uid, post.author, key),
		record: ref(post.record as PostRecord),
		embed: ref(post.embed),
		replyCount: ref(post.replyCount ?? 0),
		repostCount: ref(post.repostCount ?? 0),
		likeCount: ref(post.likeCount ?? 0),
		labels: ref(post.labels),
		viewer: {
			like: ref(post.viewer?.like),
			repost: ref(post.viewer?.repost),
		},
	});
};

export const mergeSignalizedPost = (uid: DID, post: Post, key?: number) => {
	let id = uid + '|' + post.uri;

	let ref: WeakRef<SignalizedPost> | undefined = posts[id];
	let val: SignalizedPost;

	if (!ref || !(val = ref.deref()!)) {
		val = createSignalizedPost(uid, post, key);
		posts[id] = new WeakRef(val);
	} else if (!key || val._key !== key) {
		val._key = key;

		val.cid.value = post.cid;
		mergeSignalizedProfile(uid, post.author, key);

		assignDequalRef(val.record, post.record);
		assignDequalRef(val.embed, post.embed);
		val.replyCount.value = post.replyCount ?? 0;
		val.repostCount.value = post.repostCount ?? 0;
		val.likeCount.value = post.likeCount ?? 0;
		assignDequalRef(val.labels, post.labels);

		val.viewer.like.value = post.viewer?.like;
		val.viewer.repost.value = post.viewer?.repost;
	}

	return val;
};

export interface SignalizedTimelinePost {
	post: SignalizedPost;
	reply?: {
		root: SignalizedPost;
		parent: SignalizedPost;
	};
	reason: FeedPost['reason'];
}

export const createSignalizedTimelinePost = (
	uid: DID,
	item: FeedPost,
	key?: number,
): SignalizedTimelinePost => {
	const reply = item.reply;

	return {
		post: mergeSignalizedPost(uid, item.post, key),
		reply: reply && {
			root: mergeSignalizedPost(uid, reply.root as Post, key),
			parent: mergeSignalizedPost(uid, reply.parent as Post, key),
		},
		reason: item.reason,
	};
};
