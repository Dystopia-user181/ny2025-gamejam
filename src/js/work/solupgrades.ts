import { Effect, format, formatX } from "@/utils";

import { player } from "@/js/player";
import { RebirthUpgrades } from "@/js/rebirth/upgrades";
import { StressMilestones } from "./stress";
import { WorkState } from "@/js/player-type";

interface SolUpgradeConfig<E> {
	id: number,
	name: string,
	description: string | (() => string),
	speed: number | (() => number),
	cost: (x: number) => number,
	effect?: (x: number) => E,
	effectDisplay?: (x: E) => string,
	isUnlocked?: () => boolean,
	isBuyable?: () => boolean,
}

export class SolUpgradeState<E = number> extends Effect<SolUpgradeConfig<E>, E> {
	get isUnlocked() {
		return this.config.isUnlocked?.() ?? true;
	}

	get isBuyable() {
		return this.config.isBuyable?.() ?? true;
	}

	get canApply() {
		return this.isUnlocked;
	}

	get speed() {
		let speed = typeof this.config.speed === "function" ? this.config.speed() : this.config.speed;
		speed *= StressMilestones.x15Efficiency.effectOrDefault(1);
		return speed;
	}

	get cost() {
		return this.config.cost(this.amount);
	}

	get effect() {
		if (!this.config.effect) throw `Effect not defined for Sol Upgrade id ${this.config.id}`;
		return this.config.effect(this.amount);
	}

	get effectDisplay() {
		if (!this.config.effectDisplay) return "";
		return this.config.effectDisplay(this.effect);
	}

	get amount() { return player.work.upgrades.amount[this.config.id] || 0; }
	set amount(x: number) { player.work.upgrades.amount[this.config.id] = x; }

	get progress() { return player.work.upgrades.progress[this.config.id] || 0; }
	set progress(x: number) { player.work.upgrades.progress[this.config.id] = x; }

	get isSelected() {
		return player.work.workState === WorkState.upgrade && player.work.upgrades.investing === this.config.id;
	}

	select() {
		if (!this.isBuyable) return;
		player.work.workState = WorkState.upgrade;
		player.work.upgrades.investing = this.config.id;
	}

	deselect() {
		player.work.workState = WorkState.none;
		player.work.upgrades.investing = -1;
	}

	tick(dt: number) {
		if (!this.isSelected || !this.isBuyable) return;
		const ds = Math.min(
			(this.cost - this.progress) * (1 + 1e-14),
			player.work.solarity,
			this.cost * dt * this.speed
		);
		player.work.solarity -= ds;
		this.progress += ds;
		if (this.progress >= this.cost) {
			this.amount++;
			this.progress = 0;
			player.work.workState = WorkState.none;
			player.work.upgrades.investing = -1;
		}
		if (player.work.solarity <= 0) {
			player.work.workState = WorkState.none;
			player.work.upgrades.investing = -1;
		}
	}
}

export const SolUpgrades = {
	solarReturns: new SolUpgradeState({
		id: 0,
		name: "Solar return",
		description: "+50% Solarity, +40% Stress",
		speed: 0.15,
		effect: x => [1 + x * 0.5, 1 + x * 0.4],
		effectDisplay: x => `${formatX(x[0])} sol, ${formatX(x[1])} stress`,
		cost: x => 20 + 2 * x + x * x * x / 8 + 1.5 ** x / 400,
	}),
	slow: new SolUpgradeState({
		id: 1,
		name: "Slow and steady",
		description: "+20% Solarity",
		speed: 0.15,
		effect: x => 1 + x * 0.2,
		effectDisplay: formatX,
		cost: x => 30 + 5 * x + x * x * x + 1.5 ** x / 500,
		isUnlocked: () => player.rebirth.maxLunarity > 0 || player.work.upgrades.amount[0] > 1
	}),
	tmpBoost: new SolUpgradeState({
		id: 2,
		name: "Flare",
		description: "Double work speed for 20s",
		speed: 0.2,
		effect: x => (x > 0 ? 2 : 1),
		effectDisplay: formatX,
		cost: x => 150 + 1e300 * x,
		isUnlocked: () => player.rebirth.maxLunarity > 0 || player.work.upgrades.amount[1] > 1,
		isBuyable: () => player.work.upgrades.amount[2] <= 0,
	}),
	dubious: new SolUpgradeState<[number, number]>({
		id: 3,
		name: "Dubious",
		get description() {
			if (RebirthUpgrades[21].isBought) return "×4.2 Solarity, ×10 Stress";
			return "×3 Solarity, ×10 Stress";
		},
		speed: 0.05,
		effect: x => [RebirthUpgrades[21].effectOrDefault(3) ** x, 10 ** x],
		effectDisplay: x => `${formatX(x[0])} sol, ${formatX(x[1])} stress`,
		isUnlocked: () => player.rebirth.maxLunarity > 0 || player.work.upgrades.amount[1] > 1,
		cost: x => 1e3 * 8 ** (x ** 1.05),
	}),
	efficiency1: new SolUpgradeState({
		id: 4,
		name: "Quick",
		description: "+30% work speed",
		speed: 0.2,
		effect: x => 1 + 0.3 * x,
		effectDisplay: formatX,
		cost: x => 600 + 48 * x + x * x * x * 2 + 1.5 ** x / 100,
		isUnlocked: () => player.rebirth.maxLunarity > 0 || StressMilestones.negativeE.canApply,
	}),
	efficiency2: new SolUpgradeState({
		id: 5,
		name: "Swift",
		description: "+30% upgrading speed to 1-4",
		speed: 0.1,
		effect: x => 1 + 0.3 * x,
		effectDisplay: formatX,
		cost: x => 1e4 + 230 * x + x * x * x * 20 + 1.5 ** x / 50,
		isUnlocked: () => player.rebirth.maxLunarity > 0 || StressMilestones.negativeE.canApply,
	}),
	unstress: new SolUpgradeState({
		id: 6,
		name: "Destress",
		get description() {
			if (RebirthUpgrades[12].isBought) return "×0.65 Stress gain";
			return "×0.75 Stress gain";
		},
		speed: 0.1,
		effect: x => RebirthUpgrades[12].effectOrDefault(0.75) ** x,
		effectDisplay: x => `/ ${format(1 / x)}`,
		cost: x => 600 + 40 * x + x * x * x * 10 + 3 ** (x ** 1.05) / 4,
		isUnlocked: () => player.rebirth.maxLunarity > 0,
	}),
	deathWish: new SolUpgradeState({
		id: 7,
		name: "Death wish",
		description: "×2 Stress gain",
		speed: 0.1,
		effect: x => 2 ** x,
		effectDisplay: formatX,
		cost: x => 600 + 40 * x + x * x * x * 10,
		isUnlocked: () => player.rebirth.maxLunarity > 0,
	}),
};

SolUpgrades.solarReturns.config.speed = () => 0.15 * SolUpgrades.efficiency2.effect;
SolUpgrades.slow.config.speed = () => 0.15 * SolUpgrades.efficiency2.effect;
SolUpgrades.tmpBoost.config.speed = () => 0.2 * SolUpgrades.efficiency2.effect;
SolUpgrades.dubious.config.speed = () => 0.05 * SolUpgrades.efficiency2.effect;