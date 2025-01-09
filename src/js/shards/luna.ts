import { formatX, RebuyableState } from "@/utils";

import { player } from "@/js/player";
import { RebirthUpgrades } from "@/js/rebirth/upgrades";

interface LunaShardUpgradeConfig<E> {
	id: number,
	description: string | (() => string) | ((x: number) => string),
	effect?: (x: number) => E,
	effectDisplay?: (x: E) => string,
	isUnlocked?: () => boolean,
}

export class LunaShardUpgradeState<E = number> extends RebuyableState<LunaShardUpgradeConfig<E>, E> {
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
		if (!this.config.effect) throw `Effect not defined for Lunashard Upgrade id ${this.config.id}`;
		return this.config.effect(this.amount);
	}

	get effectDisplay() {
		if (!this.config.effectDisplay) return "";
		return this.config.effectDisplay(this.effect);
	}

	get amount() { return player.shards.lunaUpg[this.config.id] || 0; }
	set amount(x: number) { player.shards.lunaUpg[this.config.id] = x; }

	get currencyAmount() { return player.shards.luna; }
	set currencyAmount(x) { player.shards.luna = x; }
}

export const LunaShardUpgrades = {
	solarity: new LunaShardUpgradeState({
		id: 0,
		description: x => `${formatX(2 ** ((x + 1) ** 0.9 - x ** 0.9))} Solarity`,
		effect: x => 2 ** (x ** 0.9),
		effectDisplay: formatX,
	}),
	time: new LunaShardUpgradeState({
		id: 1,
		description: x => `${formatX(2.3 ** ((x + 1) ** 0.9 - x ** 0.9))} work speed`,
		effect: x => 2.3 ** (x ** 0.9),
		effectDisplay: formatX,
	}),
	lune: new LunaShardUpgradeState({
		id: 2,
		description: x => `${formatX(1.7 ** ((x + 1) ** 0.9 - x ** 0.9))} Lunarity`,
		effect: x => 1.7 ** (x ** 0.9),
		effectDisplay: formatX,
	}),
};

export const LunaShardHandler = {
	get lunarThreshold() {
		let base = 10 * 4 ** this.total;
		if (this.total >= 10) base *= 100;
		return base;
	},
	get canAfford() {
		return RebirthUpgrades[32].isBought && player.rebirth.lunarity >= this.lunarThreshold;
	},
	buy() {
		if (!this.canAfford) return;
		player.rebirth.lunarity -= this.lunarThreshold;
		player.shards.luna++;
	},
	requestRespec() {
		player.shards.respecLuna = !player.shards.respecLuna;
	},
	respec() {
		player.shards.luna += this.totalInvested;
		player.shards.lunaUpg = [];
	},
	get totalInvested() {
		return player.shards.lunaUpg.reduce((a, b) => a + b, 0);
	},
	get total() {
		return this.totalInvested + player.shards.luna;
	},
};