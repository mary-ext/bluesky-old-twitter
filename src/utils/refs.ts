import type { Ref } from 'vue';
import { pauseTracking, resetTracking } from '@vue/reactivity';

import { dequal } from './dequal.ts';

export const assignDequalRef = <T>(ref: Ref<T>, next: T) => {
	if (!dequal(ref.value, next)) {
		ref.value = next;
	}
};

export const peek = <T>(ref: Ref<T>): T => {
	let value: T;

	pauseTracking();
	value = ref.value;
	resetTracking();

	return value;
};

export const untrack = <T>(callback: () => T): T => {
	try {
		pauseTracking();
		return callback();
	} finally {
		resetTracking();
	}
};
