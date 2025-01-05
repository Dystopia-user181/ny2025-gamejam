import { player } from "@/js/player";
import { RebirthUpgrades } from "@/js/rebirth/upgrades";

import BaseTab from "./base/index.vue";
import RebirthTab from "./rebirth/index.vue";
import ShardsTab from "./shards/index.vue";

export const TabTypes = ["base", "rebirth", "shards"] as const;
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
	}),
	"rebirth": new TabState({
		id: "rebirth",
		name: "Rebirth",
		component: RebirthTab,
		isUnlocked: () => player.rebirth.maxLunarity > 0
	}),
	"shards": new TabState({
		id: "shards",
		name: "Shards",
		component: ShardsTab,
		isUnlocked: () => RebirthUpgrades[23].isBought || RebirthUpgrades[32].isBought
	}),
} as Record<TabType, TabState>;

export function Tab(id: TabType | "current") {
	if (id === "current") return Tabs[player.currentTab];
	return Tabs[id];
}