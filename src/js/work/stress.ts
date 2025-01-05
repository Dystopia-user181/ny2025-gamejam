import { Effect } from "@/utils";

import { player } from "@/js/player";

interface StressMilestoneConfig {
	id: number,
	threshold: number,
	effectName: string,
	description: string,
	effect?: () => number,
	isUnlocked?: () => boolean,
}

export class StressMilestone extends Effect<StressMilestoneConfig> {
	get isUnlocked() {
		return this.config.isUnlocked?.() ?? true;
	}

	get canApply() {
		return player.work.stress >= this.config.threshold && this.isUnlocked;
	}

	get effect() {
		if (!this.config.effect) throw `Effect not defined for Stress Milestone id ${this.config.id}`;
		return this.config.effect();
	}
}

export const StressMilestones = {
	x2Efficiency: new StressMilestone({
		id: 0,
		threshold: 12,
		effectName: "Working speed ×2",
		description: "Stress ain't all bad...",
		effect: () => 2,
	}),
	x15Efficiency: new StressMilestone({
		id: 1,
		threshold: 100,
		effectName: "Working & upgrading speed ×1.5",
		description: "A little bit of pressure gets you going",
		effect: () => 1.5,
	}),
	negativeE: new StressMilestone({
		id: 2,
		threshold: 1e4,
		effectName: "Stress impacts working speed",
		description: "A little too much pressure gets you un-going",
		effect: () => Math.sqrt(player.work.stress / 1e4),
		isUnlocked: () => player.rebirth.maxLunarity > 0 || player.work.stress >= 1e4,
	}),
	negativeS: new StressMilestone({
		id: 3,
		threshold: 5e5,
		effectName: "Stress impacts Solarity gain",
		description: "A big too much pressure gets you very un-going",
		effect: () => player.work.stress / 5e5,
		isUnlocked: () => player.rebirth.maxLunarity > 0 || player.work.stress >= 1e4,
	}),
};