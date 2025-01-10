import { BitUpgradeState, formatX } from "@/utils";

import { player } from "@/js/player";
import { SolUpgrades } from "@/js/work/solupgrades";

interface RebirthUpgradeConfig<E> {
	id: number,
	name: string,
	description: string,
	cost: number,
	effect?: () => E,
	effectDisplay?: (x: E) => string,
	isUnlocked?: () => boolean,
}

export class RebirthUpgradeState<E = number> extends BitUpgradeState<RebirthUpgradeConfig<E>, E> {
	get bits() { return player.rebirth.upgrades; }
	set bits(x) { player.rebirth.upgrades = x; }

	get cost() { return this.config.cost; }

	get currencyAmount() { return player.rebirth.lunarity; }
	set currencyAmount(x) { player.rebirth.lunarity = x; }

	get effect() {
		if (!this.config.effect) throw `Effect not defined for Rebirth Upgrade id ${this.config.id}`;
		return this.config.effect();
	}

	get effectDisplay() {
		if (!this.config.effectDisplay) return "";
		return this.config.effectDisplay(this.effect);
	}

	get isUnlocked() {
		return this.config.isUnlocked?.() ?? true;
	}
}

export const RebirthUpgrades: Record<number, RebirthUpgradeState> = {
	11: new RebirthUpgradeState({
		id: 0,
		name: "11",
		description: "×3 work speed, work is done automatically",
		cost: 1,
		effect: () => 3
	}),
	12: new RebirthUpgradeState({
		id: 1,
		name: "12",
		description: "'Destress' now gives ×0.65 Stress",
		cost: 0.75,
		effect: () => 0.65
	}),
	13: new RebirthUpgradeState({
		id: 2,
		name: "13",
		description: "×3 upgrading speed",
		cost: 16,
		effect: () => 3,
	}),
	14: new RebirthUpgradeState({
		id: 3,
		name: "14",
		description: "Stress affects work speed less",
		cost: 2e6,
	}),
	21: new RebirthUpgradeState({
		id: 4,
		name: "21",
		description: "'Dubious' now gives ×4.2 Solarity",
		cost: 0.75,
		effect: () => 4.2
	}),
	22: new RebirthUpgradeState({
		id: 5,
		name: "22",
		description: "Increase work speed based on levels of 'slow and steady'",
		cost: 3,
		effect: () => 1.15 ** (SolUpgrades.slow.amount ** 0.85),
		effectDisplay: formatX
	}),
	23: new RebirthUpgradeState({
		id: 6,
		name: "23",
		description: "Unlock Sol shards",
		cost: 100,
	}),
	24: new RebirthUpgradeState({
		id: 7,
		name: "24",
		description: "×1.2 Knowledge",
		cost: 2e7,
		effect: () => 1.2,
	}),
	31: new RebirthUpgradeState({
		id: 8,
		name: "31",
		description: "Increase Solarity gain based on Solarity",
		cost: 16,
		effect: () => Math.log10(player.work.solarity + 10 ** 2.5) / 2.5,
		effectDisplay: formatX,
	}),
	32: new RebirthUpgradeState({
		id: 9,
		name: "32",
		description: "Unlock Luna shards",
		cost: 100,
	}),
	33: new RebirthUpgradeState({
		id: 10,
		name: "33",
		description: "Build Society.",
		cost: 5000,
	}),
	34: new RebirthUpgradeState({
		id: 11,
		name: "34",
		description: "???",
		cost: 1e300,
	}),
	41: new RebirthUpgradeState({
		id: 12,
		name: "41",
		description: "Stress affects Solarity less",
		cost: 2e6,
	}),
	42: new RebirthUpgradeState({
		id: 13,
		name: "42",
		description: "Continue learning after gaining Knowledge once",
		cost: 2e7,
	}),
	43: new RebirthUpgradeState({
		id: 14,
		name: "43",
		description: "???",
		cost: 1e300,
	}),
	44: new RebirthUpgradeState({
		id: 15,
		name: "44",
		description: "???",
		cost: 1e300,
	}),
};

for (let i = 1; i < 5; i++) {
	for (let j = 1; j < 5; j++) {
		if (i === 1 && j === 1) continue;
		const u = i * 10 + j;
		if (RebirthUpgrades[u]) {
			RebirthUpgrades[u].config.isUnlocked = function() {
				return (RebirthUpgrades[u - 10]?.isBought ?? true) && (RebirthUpgrades[u - 1]?.isBought ?? true);
			};
		}
	}
}