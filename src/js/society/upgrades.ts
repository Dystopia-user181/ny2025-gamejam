import { BitUpgradeState } from "@/utils";

import { player } from "@/js/player";
import { WorkHandler } from "@/js/work";

interface SocietyUpgradeConfig<E> {
	id: number,
	name: string,
	description: string,
	cost: number,
	effect?: () => E,
	effectDisplay?: (x: E) => string,
	isUnlocked?: () => boolean,
}

export class SocietyUpgradeState<E = number> extends BitUpgradeState<SocietyUpgradeConfig<E>, E> {
	get bits() { return player.society.eduUpgrades; }
	set bits(x) { player.society.eduUpgrades = x; }

	get cost() { return this.config.cost; }

	get canAfford() { return super.canAfford && player.work.stress < WorkHandler.maxStress; }

	get currencyAmount() { return player.work.knowledge + 1e-14; }
	set currencyAmount(x) {
		player.work.knowledge = Math.max(x, 0);
		if (player.work.knowledge < 1e-12) player.work.knowledge = 0;
	}

	get effect() {
		if (!this.config.effect) throw `Effect not defined for Society Upgrade id ${this.config.id}`;
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

export const SocietyUpgrades = {
	scrolls: new SocietyUpgradeState({
		id: 0,
		name: "Scrolls",
		description: "×3 learning speed and /3 stress gain",
		cost: 1,
		effect: () => 3
	}),
	dual: new SocietyUpgradeState({
		id: 1,
		name: "Duals",
		description: "×100 Solarity, ×7 Lunarity",
		cost: 3,
		effect: () => [100, 7]
	}),
	influence: new SocietyUpgradeState({
		id: 2,
		name: "Influence",
		description: "Use Knowledge to influence the world",
		cost: 30,
	}),
	politics: new SocietyUpgradeState({
		id: 3,
		name: "Politics",
		description: "Influence the world in more nefarious ways",
		cost: 100,
	}),
};