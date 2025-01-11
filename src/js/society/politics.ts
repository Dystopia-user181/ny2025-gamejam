import { format, formatPercents, formatX, RebuyableState } from "@/utils";

import { LunaShardHandler, SolShardHandler } from "../shards";
import { EqualityPath } from "@/js/player-type";
import { player } from "@/js/player";

export enum PoliticsUpgType {
	both,
	lune,
	sol,
}

interface PoliticsUpgradeConfig<E> {
	id: number,
	name: string,
	description: string | (() => string) | ((x: number) => string),
	type: PoliticsUpgType,
	maxLevel?: number,
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

	get isCapped() {
		return this.config.maxLevel !== undefined && this.amount >= this.config.maxLevel;
	}

	get canAfford() {
		if (this.config.type === PoliticsUpgType.lune && player.society.isSols) return false;
		if (this.config.type === PoliticsUpgType.sol && !player.society.isSols) return false;
		if (this.isCapped) return false;
		return super.canAfford;
	}

	get cost() {
		return this.config.cost(this.amount);
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

	get currencyAmount() { return player.work.campaigns; }
	set currencyAmount(x) { player.work.campaigns = x; }
}

export const PoliticsUpgrades = {
	scapeGoat: new PoliticsUpgradeState({
		id: 0,
		name: "Scapegoat",
		description: `Increase Solarity gain for Lunespeople, but increase the chance of being born as a Solsperson.`,
		type: PoliticsUpgType.lune,
		cost: x => x + 2,
		maxLevel: 10,
		effect: x => [1.3 ** x, 197 * x / 3e3],
		effectDisplay: x => `${formatX(x[0])} Solarity, +${formatPercents(x[1])} chance`,
		isUnlocked: () => player.society.equalityPath === EqualityPath.luna,
	}),
	labouring: new PoliticsUpgradeState({
		id: 1,
		name: "Labouring",
		description: `Decrease Stress for Lunespeople, but increase Stress for Solspeople.`,
		type: PoliticsUpgType.lune,
		cost: x => x + 2,
		maxLevel: 10,
		effect: x => [0.7 ** x, 1.3 ** x],
		effectDisplay: x => `/${format(1 / x[0])}, ${formatX(x[1])}`,
		isUnlocked: () => player.society.equalityPath === EqualityPath.luna,
	}),
	jealousy: new PoliticsUpgradeState({
		id: 2,
		name: "Jealousy",
		description: `Increase Lunarity gain for Lunespeople, but decrease Lunarity gain for Solspeople.`,
		type: PoliticsUpgType.lune,
		cost: x => x + 2,
		maxLevel: 10,
		effect: x => [1.5 ** x, 0.5 ** x],
		effectDisplay: x => `${formatX(x[0])}, /${format(1 / x[1])}`,
		isUnlocked: () => player.society.equalityPath === EqualityPath.luna,
	}),
	deescalation: new PoliticsUpgradeState({
		id: 3,
		name: "De-escalation",
		description: `Decrease Stress for both Lunespeople and Solspeople.`,
		type: PoliticsUpgType.both,
		cost: x => x + 2,
		maxLevel: 10,
		effect: x => [0.8 ** x, 0.68 ** x],
		effectDisplay: x => `/${format(1 / x[0])}, /${format(1 / x[1])}`,
		isUnlocked: () => player.society.equalityPath === EqualityPath.sol,
	}),
	symbolic: new PoliticsUpgradeState({
		id: 4,
		name: "Symbolics",
		description: `Increase Knowledge gain based on shards; Sol shards for Lunespeople and Luna
			shards for Solspeople. (Can only be initiated by Solspeople!)`,
		type: PoliticsUpgType.sol,
		cost: x => x + 2,
		maxLevel: 5,
		effect: x => [(1 + SolShardHandler.total / 20) ** x, (1 + LunaShardHandler.total / 20) ** x],
		effectDisplay: x => `${formatX(x[0])}, ${formatX(x[1])}`,
		isUnlocked: () => player.society.equalityPath === EqualityPath.sol,
	}),
	exchange: new PoliticsUpgradeState({
		id: 5,
		name: "Exchange",
		description: `Increase Knowledge gain for everyone; Additionally increase Lunarity gain for Lunespeople.`,
		type: PoliticsUpgType.both,
		cost: x => x + 2,
		maxLevel: 10,
		effect: x => [1.2 ** x, 1 + 0.1 * x],
		effectDisplay: x => `${formatX(x[0])} Knowledge, ${formatX(x[1])} Lunarity`,
		isUnlocked: () => player.society.equalityPath === EqualityPath.sol,
	}),
};