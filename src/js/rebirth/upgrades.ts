import { BitUpgradeState } from "@/utils";

import { player } from "@/js/player";

interface RebirthUpgradeConfig<E> {
	id: number,
	name: string,
	description: string,
	cost: number,
	effect: () => E,
	effectDisplay?: (x: E) => string,
	isUnlocked?: () => boolean,
	isBuyable?: () => boolean,
}

export class RebirthUpgradeState<E = number> extends BitUpgradeState<RebirthUpgradeConfig<E>, E> {
	get bits() { return player.rebirth.upgrades; }
	set bits(x) { player.rebirth.upgrades = x; }

	get cost() { return this.config.cost; }

	get currencyAmount() { return player.rebirth.lunarity; }
	set currencyAmount(x) { player.rebirth.lunarity = x; }

	get effect() { return this.config.effect(); }

	get effectDisplay() {
		if (!this.config.effectDisplay) return "";
		return this.config.effectDisplay(this.effect);
	}
}

export const RebirthUpgrades = {};