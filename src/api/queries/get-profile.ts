import type { DID } from '@intrnl/bluesky-client/atp-schema';
import type { QueryFunctionContext as QC } from '@tanstack/vue-query';

import { multiagent } from '~/globals/agent.ts';
import { mergeSignalizedProfile } from '../cache/profiles';

export const getProfileKey = (uid: DID, actor: string) => {
	return ['getProfile', uid, actor] as const;
};
export const getProfile = async (ctx: QC<ReturnType<typeof getProfileKey>>) => {
	const [, uid, actor] = ctx.queryKey;

	const agent = await multiagent.connect(uid);

	const response = await agent.rpc.get('app.bsky.actor.getProfile', {
		signal: ctx.signal,
		params: {
			actor: actor,
		},
	});

	const data = response.data;
	const profile = mergeSignalizedProfile(uid, data);

	if (data.did === uid) {
		const $accounts = multiagent.store.accounts;
		const $account = $accounts[uid];

		if (!$account.profile || $account.profile.indexedAt !== data.indexedAt) {
			$account.profile = {
				displayName: data.displayName,
				handle: data.handle,
				avatar: data.avatar,
				indexedAt: data.indexedAt,
			};
		}
	}

	return profile;
};
