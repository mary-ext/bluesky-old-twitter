<script setup lang="ts">
interface Props {
	variant?: 'primary' | 'secondary';
	size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

const props = withDefaults(defineProps<Props>(), {
	variant: 'primary',
	size: 'md',
});
</script>

<template>
	<button type="button" class="button" :class="`variant--${props.variant} size--${props.size}`">
		<slot></slot>
	</button>
</template>

<style scoped>
.button {
	border-radius: 9999px;
	padding: 6px 16px;
	font-weight: 700;
	font-size: 0.875rem;
	line-height: 1.25rem;
}
.button:focus {
	outline: 2px solid #a3d4f2;
	outline-offset: 2px;
}
.button:active {
	outline: 2px solid #48aae6;
	outline-offset: 2px;
}
.button:disabled {
	opacity: 0.3;
	cursor: not-allowed;
}

/** Size */
.size--xs {
	padding: 2px 8px;
	font-size: 0.75rem;
	line-height: 1rem;
}
.size--sm {
	padding: 4px 12px;
	font-size: 0.75rem;
	line-height: 1rem;
}
.size--md {
	padding: 6px 16px;
	font-size: 0.875rem;
	line-height: 1.25rem;
}
.size--lg {
	padding: 12px 20px;
	font-size: 1.125rem;
	line-height: 1.5rem;
}
.size--xl {
	padding: 16px 32px;
	font-size: 1.125rem;
	line-height: 2rem;
}

/** Primary variant */
.variant--primary {
	background-color: rgb(29 161 242);
	color: rgb(255 255 255);
}
.variant--primary:hover,
.variant--primary:active {
	background-color: rgb(0 109 191);
}

/** Secondary variant */
.variant--secondary {
	border: 1px solid #1b95e0;
	color: #1b95e0;
}
.variant--secondary:hover,
.variant--secondary:active {
	background-color: #e8f4fb;
}
</style>
