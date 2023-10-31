import { type Ref, markRaw, shallowRef as ref } from 'vue';

import type { DID, RefOf } from '@externdefs/bluesky-client/atp-schema';

import { assignDequalRef } from '~/utils/refs.ts';

type Profile = RefOf<'app.bsky.actor.defs#profileView'>;
type ProfileBasic = RefOf<'app.bsky.actor.defs#profileViewBasic'>;
type ProfileDetailed = RefOf<'app.bsky.actor.defs#profileViewDetailed'>;

export interface SignalizedProfile {
	_key?: number;
	did: ProfileDetailed['did'];
	handle: Ref<ProfileDetailed['handle']>;
	displayName: Ref<ProfileDetailed['displayName']>;
	description: Ref<ProfileDetailed['description']>;
	avatar: Ref<ProfileDetailed['avatar']>;
	banner: Ref<ProfileDetailed['banner']>;
	followersCount: Ref<NonNullable<ProfileDetailed['followersCount']>>;
	followsCount: Ref<NonNullable<ProfileDetailed['followsCount']>>;
	postsCount: Ref<NonNullable<ProfileDetailed['postsCount']>>;
	labels: Ref<ProfileDetailed['labels']>;
	viewer: {
		muted: Ref<NonNullable<ProfileDetailed['viewer']>['muted']>;
		mutedByList: Ref<NonNullable<ProfileDetailed['viewer']>['mutedByList']>;
		blockedBy: Ref<NonNullable<ProfileDetailed['viewer']>['blockedBy']>;
		blocking: Ref<NonNullable<ProfileDetailed['viewer']>['blocking']>;
		following: Ref<NonNullable<ProfileDetailed['viewer']>['following']>;
		followedBy: Ref<NonNullable<ProfileDetailed['viewer']>['followedBy']>;
	};
}

export const profiles: Record<string, WeakRef<SignalizedProfile>> = {};

const createSignalizedProfile = (
	_uid: DID,
	profile: Profile | ProfileBasic | ProfileDetailed,
	key?: number,
) => {
	const isProfile = 'description' in profile;
	const isDetailed = 'postsCount' in profile;

	return markRaw({
		_key: key,
		did: profile.did,
		handle: ref(profile.handle),
		displayName: ref(profile.displayName),
		description: ref(isProfile ? profile.description : ''),
		avatar: ref(profile.avatar),
		banner: ref(isDetailed ? profile.banner : ''),
		followersCount: ref((isDetailed && profile.followersCount) || 0),
		followsCount: ref((isDetailed && profile.followsCount) || 0),
		postsCount: ref((isDetailed && profile.postsCount) || 0),
		labels: ref(profile.labels),
		viewer: {
			muted: ref(profile.viewer?.muted),
			mutedByList: ref(profile.viewer?.mutedByList),
			blockedBy: ref(profile.viewer?.blockedBy),
			blocking: ref(profile.viewer?.blocking),
			following: ref(profile.viewer?.following),
			followedBy: ref(profile.viewer?.followedBy),
		},
	});
};

export const mergeSignalizedProfile = (
	uid: DID,
	profile: Profile | ProfileBasic | ProfileDetailed,
	key?: number,
) => {
	let id = uid + '|' + profile.did;

	let ref: WeakRef<SignalizedProfile> | undefined = profiles[id];
	let val: SignalizedProfile;

	if (!ref || !(val = ref.deref()!)) {
		val = createSignalizedProfile(uid, profile, key);
		profiles[id] = new WeakRef(val);
	} else if (!key || val._key !== key) {
		val._key = key;

		val.handle.value = profile.handle;
		val.displayName.value = profile.displayName;
		val.avatar.value = profile.avatar;
		assignDequalRef(val.labels, profile.labels);

		val.viewer.muted.value = profile.viewer?.muted;
		val.viewer.mutedByList.value = profile.viewer?.mutedByList;
		val.viewer.blocking.value = profile.viewer?.blocking;
		val.viewer.blockedBy.value = profile.viewer?.blockedBy;
		val.viewer.following.value = profile.viewer?.following;
		val.viewer.followedBy.value = profile.viewer?.followedBy;

		if ('description' in profile) {
			val.description.value = profile.description;
		}

		if ('postsCount' in profile) {
			val.banner.value = profile.banner;
			val.followersCount.value = profile.followersCount ?? 0;
			val.followsCount.value = profile.followsCount ?? 0;
			val.postsCount.value = profile.postsCount ?? 0;
		}
	}

	return val;
};
