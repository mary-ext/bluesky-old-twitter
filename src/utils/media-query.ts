import { type Ref, ref, onScopeDispose } from 'vue';

interface MediaStore {
	/** State backing */
	r: Ref<boolean>;
	/** Amount of subscriptions */
	n: number;
	/** Cleanup function */
	c: () => void;
}

const map: Record<string, MediaStore> = {};

export const useMediaQuery = (query: string): Readonly<Ref<boolean>> => {
	let media = map[query];

	if (!media) {
		const matcher = window.matchMedia(query);
		const state = ref(matcher.matches);

		const callback = () => (state.value = matcher.matches);

		matcher.addEventListener('change', callback);

		media = map[query] = {
			n: 0,
			r: state,
			c() {
				if (--media.n < 1 && map[query] === media) {
					delete map[query];
				}
			},
		};
	}

	media.n++;
	onScopeDispose(media.c);

	return media.r;
};
