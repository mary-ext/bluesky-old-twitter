import { Agent, type AtpLoginOptions, type AtpSessionData } from '@externdefs/bluesky-client/agent';
import type { DID } from '@externdefs/bluesky-client/atp-schema';
import { createReactiveLocalStorage } from '~/utils/storage';

export enum MultiagentState {
	PRISTINE,
	UNAUTHORIZED,
	PENDING,
	AUTHORIZED,
}

export interface MultiagentLoginOptions extends AtpLoginOptions {
	service: string;
}

export interface MultiagentProfileData {
	displayName?: string;
	handle: string;
	avatar?: string;
	indexedAt?: string;
}

export interface MultiagentAccountData {
	did: DID;
	service: string;
	session: AtpSessionData;
	profile?: MultiagentProfileData;
}

interface MultiagentStorage {
	version: 1;
	active: DID | undefined;
	accounts: Record<DID, MultiagentAccountData>;
}

export class MultiagentError extends Error {
	constructor(message: string, options?: ErrorOptions) {
		super(message, options);
		this.name = 'MultiagentError';
	}
}

export class Multiagent {
	store: MultiagentStorage;

	#agents: Record<DID, Promise<Agent>> = {};

	constructor(name: string) {
		this.store = createReactiveLocalStorage<MultiagentStorage>(name, (store) => {
			if (store != null) {
				return store;
			} else {
				return {
					version: 1,
					active: undefined,
					accounts: {},
				};
			}
		});
	}

	/**
	 * A record of registered accounts
	 */
	get accounts() {
		return this.store.accounts;
	}

	/**
	 * Active UID set as default
	 */
	get active() {
		return this.store.active;
	}
	set active(next: DID | undefined) {
		this.store.active = next;
	}

	/**
	 * Login with a new account
	 */
	async login({ service, identifier, password }: MultiagentLoginOptions): Promise<DID> {
		const agent = this.#createAgent(service);

		try {
			await agent.login({ identifier, password });

			const session = agent.session!;
			const did = session.did;

			const $store = this.store;
			const $accounts = $store.accounts!;

			$store.active = did;
			$accounts[did] = {
				did: did,
				service: service,
				session: session,
			};

			this.#agents[did] = Promise.resolve(agent);
			return did;
		} catch (err) {
			throw new MultiagentError(`Failed to login`, { cause: err });
		}
	}

	/**
	 * Log out from account
	 */
	logout(did: DID): void {
		if (!(did in this.accounts)) {
			return;
		}

		if (this.active === did) {
			let nextActiveId: DID | undefined;

			for (nextActiveId in this.accounts) {
				if (nextActiveId === did) {
					nextActiveId = undefined;
					continue;
				}

				break;
			}

			this.active = nextActiveId;
		}

		const $accounts = this.store.accounts!;

		delete $accounts[did];
		delete this.#agents[did];
	}

	/**
	 * Retrieve an agent associated with an account
	 */
	connect(did: DID): Promise<Agent> {
		if (did in this.#agents) {
			return this.#agents[did];
		}

		const accounts = this.store.accounts;
		const data = accounts && accounts[did];

		if (!data) {
			return Promise.reject(new MultiagentError(`Invalid account`));
		}

		return (this.#agents[did] = new Promise((resolve, reject) => {
			const agent = this.#createAgent(data.service);

			agent.resumeSession(data.session).then(
				() => {
					resolve(agent);
				},
				(err) => {
					delete this.#agents[did];
					reject(new MultiagentError(`Failed to resume session`, { cause: err }));
				},
			);
		}));
	}

	/**
	 * Create a new agent
	 */
	#createAgent(serviceUri: string) {
		const $accounts = this.store.accounts!;

		const agent = new Agent({
			serviceUri: serviceUri,
		});

		agent.on('sessionUpdate', (session) => {
			const did = session!.did;

			$accounts[did] = {
				...$accounts[did],
				did: session!.did,
				service: serviceUri,
				session: session!,
			};
		});

		return agent;
	}
}
