export function assert(condition: any, message = 'Assertion failed'): asserts condition {
	if (import.meta.env.DEV && !condition) {
		throw new Error(message);
	}
}

export type VoidFunction = (...args: any[]) => void;

export const debounce = <F extends VoidFunction>(fn: F, delay: number) => {
	let timeout: any;

	return (...args: Parameters<F>) => {
		clearTimeout(timeout);
		timeout = setTimeout(() => fn(...args), delay);
	};
};

export const INTERACTIVE_MEDIA_TAGS = ['a', 'button', 'img', 'video', 'dialog'];
export const INTERACTION_TAGS = ['a', 'button'];

export const isElementClicked = (
	ev: MouseEvent | KeyboardEvent,
	excludedTags: string[] = INTERACTIVE_MEDIA_TAGS,
) => {
	const target = ev.currentTarget as HTMLElement;
	const path = ev.composedPath() as HTMLElement[];

	if (
		!path.includes(target) ||
		(ev.type === 'keydown' && (ev as KeyboardEvent).key !== 'Enter') ||
		(ev.type === 'auxclick' && (ev as MouseEvent).button !== 1)
	) {
		return false;
	}

	for (let idx = 0, len = path.length; idx < len; idx++) {
		const node = path[idx];
		const tag = node.localName;

		if (node == target) {
			break;
		}

		if (excludedTags.includes(tag)) {
			return false;
		}
	}

	if (window.getSelection()?.toString()) {
		return false;
	}

	return true;
};

export const isElementAltClicked = (ev: MouseEvent | KeyboardEvent) => {
	return ev.type === 'auxclick' || ev.ctrlKey;
};
