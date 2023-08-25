import { effect, reactive } from 'vue';

export type Store = Record<PropertyKey, any>;

const parse = (raw: string | null) => {
	if (raw === null) {
		return raw;
	}

	try {
		const persisted = JSON.parse(raw);
		return persisted;
	} catch {
		return null;
	}
};

export const createReactiveLocalStorage = <T extends Store>(name: string, produce: (value: any) => T) => {
	const initialValue = produce(parse(localStorage.getItem(name)));
	const mutable = reactive(initialValue);

	let changed = false;

	effect(() => {
		const json = JSON.stringify(mutable);

		if (changed) {
			localStorage.setItem(name, json);
		}

		changed = true;
	});

	window.addEventListener('storage', (ev) => {
		if (ev.key === name) {
			// Prevent our own persist effect from running as we're reconciling what's been persisted
			changed = false;
			Object.assign(mutable, produce(parse(ev.newValue)));
		}
	});

	return mutable;
};
