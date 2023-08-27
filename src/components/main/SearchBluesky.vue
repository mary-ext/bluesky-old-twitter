<template>
	<input class="input" placeholder="Search Bluesky" />
</template>

<style scoped>
.input {
	box-sizing: border-box;
	border: 1px solid #e6ecf0;
	border-radius: 9999px;
	background-color: #f5f8fa;
	padding: 8px 32px 8px 12px;
	width: 221px;
	height: 32px;
	color: #14171a;
	font-size: 12px;
	line-height: 16px;
}
.input:focus {
	outline: 2px solid #1b95e0;
	outline-offset: -1px;
	background-color: #fff;
}

.input::placeholder {
	opacity: 1;
	color: #657786;
}
</style>
