import { player } from "@/js/player";

import BaseTab from "./base/index.vue";

export const TabTypes = ["base"] as const;
export type TabType = typeof TabTypes[number];

interface TabStateConfig {
	id: TabType,
	name: string,
	component: Component,
	isUnlocked?: () => boolean,
}

export class TabState {
	readonly config: TabStateConfig;
	constructor(config: TabStateConfig) {
		this.config = config;
	}

	get id() { return this.config.id; }
	get name() { return this.config.name; }
	get component() { return this.config.component; }

	get isUnlocked() {
		return this.config.isUnlocked?.() ?? true;
	}

	get isCurrent() {
		return player.currentTab === this.id;
	}

	setCurrent() {
		if (!this.isUnlocked) return;
		player.currentTab = this.id;
	}
}

export const Tabs = {
	"base": new TabState({
		id: "base",
		name: "Work",
		component: BaseTab,
	})
} as Record<TabType, TabState>;

export function Tab(id: TabType | "current") {
	// No, player.currentTab isn't `any` you bimbo
	// @typescript-eslint/no-unsafe-member-access
	if (id === "current") return Tabs[player.currentTab];
	return Tabs[id];
}