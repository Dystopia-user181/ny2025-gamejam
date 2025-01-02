import { Effect, formatX } from "@/utils";

import { player } from "@/js/player";
import { StressMilestones } from "./stress";
import { WorkState } from "@/js/player-type";

interface SolUpgradeConfig<E> {
	id: number,
	name: string,
	description: string,
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
		}
		if (player.work.solarity <= 0) {
			player.work.workState = WorkState.none;
		}
	}
}

export const SolUpgrades = {
	solarReturns: new SolUpgradeState<[number, number]>({
		id: 0,
		name: "Solar return",
		description: "+50% Solarity, +40% Stress",
		speed: 0.1,
		effect: x => [1 + x * 0.5, 1 + x * 0.4],
		effectDisplay: x => `${formatX(x[0])} sol, ${formatX(x[1])} stress`,
		cost: x => 20 + 2 * x + x * x * x / 8,
	}),
	slow: new SolUpgradeState({
		id: 1,
		name: "Slow and steady",
		description: "+10% Solarity",
		speed: 0.1,
		effect: x => 1 + x * 0.1,
		effectDisplay: x => `${formatX(x)} sol`,
		cost: x => 30 + 5 * x + x * x * x,
	}),
	tmpBoost: new SolUpgradeState({
		id: 2,
		name: "Flare",
		description: "Double work speed for 20s",
		speed: 0.2,
		effect: x => (x > 0 ? 2 : 1),
		effectDisplay: x => `${formatX(x)} work speed`,
		cost: x => 150 + 1e300 * x,
		isBuyable: () => player.work.upgrades.amount[2] <= 0,
	}),
};