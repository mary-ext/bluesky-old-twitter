<script setup lang="ts">
defineProps<{ modelValue: string }>();

const emit = defineEmits<{
	(e: 'update:modelValue', next: string): void;
}>();
</script>

<template>
	<input
		type="text"
		class="text-input"
		:value="modelValue"
		@input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
	/>
</template>

<style scoped>
.text-input {
	display: block;
	border: 1px solid #ccd6dd;
	border-radius: 3px;
	padding: 4px;
	font-size: 14px;
	line-height: 20px;
}
.text-input::placeholder {
	opacity: 1;
	color: #657786;
}
.text-input:focus {
	outline: none;
	border-color: rgba(0, 132, 180, 0.5);
}
.text-input:focus::placeholder {
	opacity: 0.6;
}
</style>
