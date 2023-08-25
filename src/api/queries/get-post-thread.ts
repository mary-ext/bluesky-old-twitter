import type { DID, RefOf } from '@intrnl/bluesky-client/atp-schema';
import type { QueryFunctionContext as QC } from '@tanstack/vue-query';

import { multiagent } from '~/globals/agent.ts';

import { createThreadPage } from '../models/thread.ts';

import _getDid from './_did.ts';

export class BlockedThreadError extends Error {
	constructor(public view: RefOf<'app.bsky.feed.defs#blockedPost'>) {
		super();
		this.name = 'BlockedThreadError';
	}
}

export const getPostThreadKey = (uid: DID, actor: string, post: string, depth: number, height: number) => {
	return ['getPostThread', uid, actor, post, depth, height] as const;
};
export const getPostThread = async (ctx: QC<ReturnType<typeof getPostThreadKey>>) => {
	const [, uid, actor, post, depth, height] = ctx.queryKey;
	const signal = ctx.signal;

	const agent = await multiagent.connect(uid);
	const did = await _getDid(agent, actor, signal);

	const uri = `at://${did}/app.bsky.feed.post/${post}`;
	const response = await agent.rpc.get('app.bsky.feed.getPostThread', {
		signal: signal,
		params: {
			uri: uri,
			depth: depth,
			parentHeight: height,
		},
	});

	const data = response.data;

	switch (data.thread.$type) {
		case 'app.bsky.feed.defs#blockedPost':
			throw new BlockedThreadError(data.thread);
		case 'app.bsky.feed.defs#notFoundPost':
			throw new Error(`Post not found`);
		case 'app.bsky.feed.defs#threadViewPost':
			return createThreadPage(uid, data.thread);
	}
};
