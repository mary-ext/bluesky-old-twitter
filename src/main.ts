import { createApp } from 'vue';

import { VueQueryPlugin } from '@tanstack/vue-query';

import './styles/preflight.css';
import './styles/main.css';
import App from './App.vue';

import { router } from './router.ts';

const app = createApp(App);

app.use(router);
app.use(VueQueryPlugin, {
	queryClientConfig: {
		defaultOptions: {
			queries: {
				refetchOnWindowFocus: false,
			},
		},
	},
});

app.mount('#app');
