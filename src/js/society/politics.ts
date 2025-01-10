import { RebuyableState } from "@/utils";

import { player } from "@/js/player";

interface PoliticsUpgradeConfig<E> {
	id: number,
	description: string | (() => string) | ((x: number) => string),
	cost: (x: number) => number,
	effect?: (x: number) => E,
	effectDisplay?: (x: E) => string,
	isUnlocked?: () => boolean,
}

export class PoliticsUpgradeState<E = number> extends RebuyableState<PoliticsUpgradeConfig<E>, E> {
	get isUnlocked() {
		return this.config.isUnlocked?.() ?? true;
	}

	get canApply() {
		return this.isUnlocked;
	}

	get cost() {
		return 1;
	}

	get description() {
		return typeof this.config.description === "string"
			? this.config.description
			: this.config.description(this.amount);
	}

	get effect() {
		if (!this.config.effect) throw `Effect not defined for politics Upgrade id ${this.config.id}`;
		return this.config.effect(this.amount);
	}

	get effectDisplay() {
		if (!this.config.effectDisplay) return "";
		return this.config.effectDisplay(this.effect);
	}

	get amount() { return player.society.politics[this.config.id] || 0; }
	set amount(x: number) { player.society.politics[this.config.id] = x; }

	get currencyAmount() { return player.shards.luna; }
	set currencyAmount(x) { player.shards.luna = x; }
}

export {};