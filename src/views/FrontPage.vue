<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

import { multiagent } from '~/globals/agent.ts';

import Button from '~/components/Button.vue';
import TextInput from '~/components/TextInput.vue';

import FrontBackground from '~/assets/front-bg.jpg';

const attributions = {
	author_name: 'Marek Piwnicki',
	author_url: 'https://unsplash.com/@marekpiwnicki',
	site_name: 'Unsplash',
	site_url: 'https://unsplash.com/photos/a-view-of-a-mountain-range-at-sunset-htqzuJF0tps',
};

const source = 'https://github.com/intrnl/bluesky-old-twitter';

const router = useRouter();

const mutating = ref(false);
const error = ref<string>();

const identifier = ref('');
const password = ref('');

const handleSubmit = (ev: Event) => {
	ev.preventDefault();

	if (mutating.value) {
		return;
	}

	mutating.value = true;
	error.value = undefined;

	const $service = 'https://bsky.social';
	const $identifier = identifier.value;
	const $password = password.value;

	multiagent.login({ service: $service, identifier: $identifier, password: $password }).then(
		(uid) => {
			router.push(`/u/${uid}`);
		},
		(err) => {
			const msg = err.cause ? err.cause.message : err.message || '' + err;
			error.value = msg;
		},
	);
};
</script>

<template>
	<div class="page-container">
		<div class="background">
			<img :src="FrontBackground" width="1920" height="1080" />
		</div>

		<main class="front">
			<div class="front__main">
				<div class="welcome">
					<h1>Welcome to <span class="welcome__lol">Twitter</span> Bluesky.</h1>
					<p>
						Connect with your friends — and other fascinating people. Get in-the-moment updates on the things
						that interest you. And watch events unfold, in real time, from every angle.
					</p>
				</div>

				<small>
					Photo by <a :href="attributions.author_url">{{ attributions.author_name }}</a> on
					<a :href="attributions.site_url">{{ attributions.site_name }}</a>
				</small>
			</div>

			<div class="front__side">
				<form @submit="handleSubmit" class="login-card">
					<div class="login-card__main">
						<TextInput
							v-model="identifier"
							required
							autocomplete="username"
							placeholder="Email or username"
						/>
						<TextInput
							v-model="password"
							required
							type="password"
							autocomplete="current-password"
							placeholder="Password"
						/>

						<template v-if="error">
							<span class="login-card__error">{{ error }}</span>
						</template>

						<div class="login-card__actions">
							<Button type="submit" variant="primary">Login</Button>

							<a href="https://bsky.app" target="_blank">Forgot password?</a>
						</div>
					</div>

					<div class="login-card__footer">
						<p>New to Bluesky? <a href="https://bsky.app" target="_blank">Sign up now »</a></p>
					</div>
				</form>
			</div>
		</main>

		<footer class="footer">
			<span>This project is <a :href="source" target="_blank">open source</a>.</span>
		</footer>
	</div>
</template>

<style scoped>
.page-container {
	display: flex;
	position: relative;
	flex-direction: column;
	align-items: center;
	align-items: center;
	min-height: 100vh;
	padding-top: 116px;
	gap: 119px;
	background-color: #000;
}

/* Background */
.background {
	z-index: 0;
	position: fixed;
	inset: 0;
}

.background img {
	width: 100%;
	height: 100%;
	object-fit: cover;
	opacity: 0.28;
}

/* Card */
.front {
	display: flex;
	z-index: 1;
	justify-content: space-between;
	width: 838px;
	height: 410px;
	gap: 18px;
}

.front__main {
	width: 470px;
	color: #fff;
}

.front__main a {
	color: inherit;
}

/* Welcome */
.welcome {
	height: 328px;
}

.welcome__lol {
	text-decoration: line-through;
	text-decoration-style: wavy;
	text-decoration-color: #e0245e;
}

.welcome h1 {
	margin-top: 0;
	margin-bottom: 30px;
	font-weight: 700;
	font-size: 38px;
	line-height: 44px;
}

.welcome p {
	margin: 0;
	font-size: 21px;
	line-height: 31px;
}

/* Side */
.front__side {
	flex-shrink: 0;
	width: 300px;
}

/* Login card */
.login-card {
	padding: 12px;
	border: 1px solid rgb(0 0 0 / 0.1);
	border-radius: 4px;
	background-color: #fff;
	font-size: 14px;
}

.login-card a {
	color: #1c94e0;
	text-decoration: none;
}
.login-card a:hover {
	text-decoration: underline;
}

.login-card__main {
	display: flex;
	flex-direction: column;
	gap: 12px;
}

.login-card__error {
	color: #e0245e;
}

.login-card__actions {
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.login-card__footer {
	margin: 12px -12px -12px;
	padding: 12px;
	background-color: #f5f8fa;
	color: #657786;
}

.login-card__footer p {
	margin: 0;
}

/* Footer */
.footer {
	z-index: 1;
	width: 838px;
	color: #fff;
	font-size: 12px;
	text-align: center;
}

.footer a {
	color: inherit;
}
</style>
