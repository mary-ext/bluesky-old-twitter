import type { Ref } from 'vue';

import type { DID } from '@externdefs/bluesky-client/atp-schema';
import type { QueryFunctionContext as QC } from '@tanstack/vue-query';

import { multiagent } from '~/globals/agent.ts';

import { mergeSignalizedProfile, profiles, type SignalizedProfile } from '../cache/profiles.ts';
import { isDid } from '../utils.ts';

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

export const createInitialProfileData = (uid: Ref<DID>, actor: Ref<string>) => {
	return (): SignalizedProfile | undefined => {
		const $uid = uid.value;
		const $actor = actor.value;

		if ($actor && isDid($actor)) {
			const id = $uid + '|' + $actor;

			const ref = profiles[id];
			const profile = ref?.deref();

			return profile;
		}
	};
};
