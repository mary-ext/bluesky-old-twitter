import type { DID, RefOf } from '@intrnl/bluesky-client/atp-schema';
import type { QueryFunctionContext as QC } from '@tanstack/vue-query';

import { multiagent } from '~/globals/agent.ts';
import { createBatchedFetch } from '~/utils/batch-fetch.ts';

import { mergeSignalizedPost } from '../cache/posts.ts';
import { BSKY_POST_URL_RE, isAppUrl } from '../links.ts';

import _getDid from './_did.ts';

type Post = RefOf<'app.bsky.feed.defs#postView'>;
type Query = [uid: DID, uri: string];

export const fetchPost = createBatchedFetch<Query, string, Post>({
	limit: 25,
	timeout: 0,
	key: (query) => query[0],
	idFromQuery: (query) => query[1],
	idFromData: (data) => data.uri,
	fetch: async (queries) => {
		const uid = queries[0][0];
		const uris = queries.map((query) => query[1]);

		const agent = await multiagent.connect(uid);

		const response = await agent.rpc.get('app.bsky.feed.getPosts', {
			params: {
				uris: uris,
			},
		});

		return response.data.posts;
	},
});

export const getPostKey = (uid: DID, uri: string) => {
	return ['getPost', uid, uri] as const;
};
export const getPost = async (ctx: QC<ReturnType<typeof getPostKey>>) => {
	const [, uid, uri] = ctx.queryKey;

	const bskyMatch = isAppUrl(uri) && BSKY_POST_URL_RE.exec(uri);

	let resolvedUri = uri;
	if (bskyMatch) {
		const agent = await multiagent.connect(uid);

		const repo = await _getDid(agent, bskyMatch[1], ctx.signal);
		const record = bskyMatch[2];

		resolvedUri = `at://${repo}/app.bsky.feed.post/${record}`;
	}

	const post = await fetchPost([uid, resolvedUri]);

	return mergeSignalizedPost(uid, post);
};
