<script lang="ts">
let checked = false;

const getScrollbarSize = (document: Document) => {
	const documentWidth = document.documentElement.clientWidth;
	return Math.abs(window.innerWidth - documentWidth);
};
</script>

<script setup lang="ts">
import { effect, shallowRef } from 'vue';

const emit = defineEmits<{
	(e: 'close'): void;
}>();

const props = defineProps<{
	open?: boolean;
}>();

const dialogRef = shallowRef<HTMLDialogElement>();

effect(() => {
	const node = dialogRef.value;

	if (!node) {
		return;
	}

	if (props.open) {
		if (node.open) {
			// we're already open, bail out
			return;
		}

		// handle accidental opening of modals when the parent container has a
		// display: none set on it, this shall be dev only.
		if (import.meta.env.DEV) {
			const style = getComputedStyle(node.parentElement!);

			if (style.display === 'none') {
				console.error('A dialog is being opened while its parent container is hidden');
				node.close();
				return;
			}
		}

		const body = document.body;

		if (
			!checked &&
			(body.scrollHeight > body.clientHeight || getComputedStyle(body).overflowY === 'scroll')
		) {
			const scrollbarSize = getScrollbarSize(document);

			checked = true;
			document.documentElement.style.setProperty('--sb-width', `${scrollbarSize}px`);
		}

		node.returnValue = '';
		node.showModal();
	} else if (node.open) {
		node.close();
	}
});

const handleClick = (ev: MouseEvent) => {
	if (ev.target === ev.currentTarget) {
		emit('close');
	}
};

const handleCancel = (ev: Event) => {
	ev.preventDefault();
	emit('close');
};
</script>

<template>
	<dialog ref="dialogRef" @click="handleClick" @cancel="handleCancel" class="dialog" data-modal>
		<template v-if="props.open">
			<slot></slot>
		</template>
	</dialog>
</template>

<style scoped>
.dialog {
	flex-direction: column;
	align-items: center;
	margin: 0px;
	background-color: transparent;
	padding: 0px;
	width: 100%;
	max-width: none;
	height: 100%;
	max-height: none;
	overflow: visible;
}
.dialog:modal {
	display: flex;
}
.dialog::backdrop {
	background-color: rgb(0 0 0 / 0.5);
}
</style>
