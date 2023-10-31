import type { Agent } from '@externdefs/bluesky-client/agent';
import type { DID, Records, RefOf, ResponseOf } from '@externdefs/bluesky-client/atp-schema';
import type { QueryFunctionContext as QC } from '@tanstack/vue-query';

import { multiagent } from '~/globals/agent.ts';
import { assert } from '~/utils/misc.ts';

import {
	type PostFilter,
	type SliceFilter,
	type TimelineSlice,
	createTimelineSlices,
	createUnjoinedSlices,
} from '../models/timeline.ts';

import { fetchPost } from './get-post.ts';

export interface HomeTimelineParams {
	type: 'home';
	algorithm: 'reverse-chronological' | (string & {});
}

export interface FeedTimelineParams {
	type: 'feed';
	uri: string;
}

export interface ListTimelineParams {
	type: 'list';
	uri: string;
}

export interface ProfileTimelineParams {
	type: 'profile';
	actor: DID;
	tab: 'posts' | 'replies' | 'likes' | 'media';
}

export interface SearchTimelineParams {
	type: 'search';
	query: string;
}

export type TimelineParams =
	| FeedTimelineParams
	| HomeTimelineParams
	| ListTimelineParams
	| ProfileTimelineParams
	| SearchTimelineParams;

export interface FeedPageCursor {
	key: string | null;
	remaining: TimelineSlice[];
}

export interface FeedPage {
	cursor?: FeedPageCursor;
	cid?: string;
	slices: TimelineSlice[];
}

export interface FeedLatestResult {
	cid: string | undefined;
}

type TimelineResponse = ResponseOf<'app.bsky.feed.getTimeline'>;

type Post = RefOf<'app.bsky.feed.defs#postView'>;

// type PostRecord = Records['app.bsky.feed.post'];
type LikeRecord = Records['app.bsky.feed.like'];

//// Feed query
// How many attempts it should try looking for more items before it gives up on empty pages.
const MAX_EMPTY = 3;

const MAX_POSTS = 20;

const countPosts = (slices: TimelineSlice[], limit?: number) => {
	let count = 0;

	let idx = 0;
	let len = slices.length;

	for (; idx < len; idx++) {
		const slice = slices[idx];
		count += slice.items.length;

		if (limit !== undefined && count >= limit) {
			return idx;
		}
	}

	if (limit !== undefined) {
		return len;
	}

	return count;
};

export const getTimelineKey = (uid: DID, params: TimelineParams, limit = MAX_POSTS) => {
	return ['getFeed', uid, params, limit] as const;
};
export const getTimeline = async (ctx: QC<ReturnType<typeof getTimelineKey>, FeedPageCursor>) => {
	const [, uid, params, limit] = ctx.queryKey;
	const pageParam = ctx.pageParam;
	const signal = ctx.signal;

	const type = params.type;

	const agent = await multiagent.connect(uid);

	let empty = 0;
	let cid: string | undefined;

	let cursor: string | null | undefined;
	let items: TimelineSlice[] = [];
	let count = 0;

	let sliceFilter: SliceFilter | undefined | null;
	let postFilter: PostFilter | undefined;

	if (pageParam) {
		cursor = pageParam.key;
		items = pageParam.remaining;
		count = countPosts(items);
	}

	if (type === 'home') {
		// sliceFilter = createHomeSliceFilter(uid);
		// postFilter = combine([
		// 	createHiddenRepostFilter(uid),
		// 	createDuplicatePostFilter(items),
		// 	createLabelPostFilter(uid),
		// 	createTempMutePostFilter(uid),
		// ]);
	} else if (type === 'feed' || type === 'list') {
		// sliceFilter = createFeedSliceFilter();
		// postFilter = combine([
		// 	createDuplicatePostFilter(items),
		// 	createLanguagePostFilter(uid),
		// 	createLabelPostFilter(uid),
		// 	createTempMutePostFilter(uid),
		// ]);
	} else if (type === 'profile') {
		// postFilter = createLabelPostFilter(uid);

		if (params.tab === 'likes' || params.tab === 'media') {
			sliceFilter = null;
		}
	} else {
		// postFilter = createLabelPostFilter(uid);
	}

	while (cursor !== null && count < limit) {
		const timeline = await fetchPage(agent, params, limit, cursor, signal);

		const feed = timeline.feed;
		const result =
			sliceFilter !== null
				? createTimelineSlices(uid, feed, sliceFilter, postFilter)
				: createUnjoinedSlices(uid, feed, postFilter);

		cursor = timeline.cursor || null;
		empty = result.length > 0 ? 0 : empty + 1;
		items = items.concat(result);

		count += countPosts(result);

		cid ||= feed.length > 0 ? feed[0].post.cid : undefined;

		if (empty >= MAX_EMPTY) {
			break;
		}
	}

	// we're still slicing by the amount of slices and not amount of posts
	const spliced = countPosts(items, limit) + 1;

	const slices = items.slice(0, spliced);
	const remaining = items.slice(spliced);

	const page: FeedPage = {
		cursor: cursor || remaining.length > 0 ? { key: cursor || null, remaining: remaining } : undefined,
		cid: cid,
		slices: slices,
	};

	return page;
};

/// Latest feed query
export const getTimelineLatestKey = (uid: DID, params: TimelineParams) => {
	return ['getFeedLatest', uid, params] as const;
};
export const getTimelineLatest = async (ctx: QC<ReturnType<typeof getTimelineLatestKey>>) => {
	const [, uid, params] = ctx.queryKey;

	const agent = await multiagent.connect(uid);

	const timeline = await fetchPage(agent, params, 1, undefined, ctx.signal);
	const feed = timeline.feed;

	return { cid: feed.length > 0 ? feed[0].post.cid : undefined };
};

//// Raw fetch
type SearchResult = PostSearchView[];

interface PostSearchView {
	tid: string;
	cid: string;
	user: {
		did: DID;
		handle: string;
	};
	post: {
		createdAt: number;
		text: string;
		user: string;
	};
}

const fetchPage = async (
	agent: Agent,
	params: TimelineParams,
	limit: number,
	cursor: string | undefined,
	signal?: AbortSignal,
): Promise<TimelineResponse> => {
	const type = params.type;

	if (type === 'home') {
		const response = await agent.rpc.get('app.bsky.feed.getTimeline', {
			signal: signal,
			params: {
				algorithm: params.algorithm,
				cursor: cursor,
				limit: limit,
			},
		});

		return response.data;
	} else if (type === 'feed') {
		const response = await agent.rpc.get('app.bsky.feed.getFeed', {
			signal: signal,
			params: {
				feed: params.uri,
				cursor: cursor,
				limit: limit,
			},
		});

		return response.data;
	} else if (type === 'list') {
		const response = await agent.rpc.get('app.bsky.feed.getListFeed', {
			signal: signal,
			params: {
				list: params.uri,
				cursor: cursor,
				limit: limit,
			},
		});

		return response.data;
	} else if (type === 'profile') {
		if (params.tab === 'likes') {
			const uid = agent.session!.did;

			const recordsResponse = await agent.rpc.get('com.atproto.repo.listRecords', {
				signal: signal,
				params: {
					repo: params.actor,
					collection: 'app.bsky.feed.like',
					cursor: cursor,
					limit: limit,
				},
			});

			const recordsData = recordsResponse.data;
			const recordsCursor = recordsData.cursor;

			const queries = await Promise.allSettled(
				recordsData.records.map((rec) => fetchPost([uid, (rec.value as LikeRecord).subject.uri])),
			);

			return {
				cursor: recordsCursor,
				feed: queries
					.filter((result): result is PromiseFulfilledResult<Post> => result.status === 'fulfilled')
					.map((result) => ({ post: result.value })),
			};
		} else {
			const response = await agent.rpc.get('app.bsky.feed.getAuthorFeed', {
				signal: signal,
				params: {
					actor: params.actor,
					cursor: cursor,
					limit: limit,
					filter:
						params.tab === 'media'
							? 'posts_with_media'
							: params.tab === 'replies'
							? 'posts_with_replies'
							: 'posts_no_replies',
				},
			});

			return response.data;
		}
	} else if (type === 'search') {
		const offset = cursor ? +cursor : 0;
		const searchUri =
			`https://search.bsky.social/search/posts` +
			`?count=${limit}` +
			`&offset=${offset}` +
			`&q=${encodeURIComponent(params.query)}`;

		const searchResponse = await fetch(searchUri, { signal: signal });

		if (!searchResponse.ok) {
			throw new Error(`Response error ${searchResponse.status}`);
		}

		const searchResults = (await searchResponse.json()) as SearchResult;

		const uid = agent.session!.did;
		const queries = await Promise.allSettled(
			searchResults.map((view) => fetchPost([uid, `at://${view.user.did}/${view.tid}`])),
		);

		const posts = queries
			.filter((result): result is PromiseFulfilledResult<Post> => result.status === 'fulfilled')
			.map((result) => ({ post: result.value }));

		return {
			cursor: '' + (offset + searchResults.length),
			feed: posts,
		};
	} else {
		assert(false, `Unknown type: ${type}`);
	}
};
