import { player } from "@/js/player";

import { SocietyUpgrades } from "@/js/society";
import { StressMilestones } from "./stress";
import { WorkHandler } from ".";
import { WorkState } from "@/js/player-type";

export const LearnHandler = {
	get unlocked() {
		return StressMilestones.learn.canApply;
	},
	get efficiency() {
		let base = 0.4;
		base *= SocietyUpgrades.scrolls.effectOrDefault(1);
		return base;
	},
	get knowledgeIncrement() {
		const base = 0.1;
		return base;
	},
	get stressIncrement() {
		let base = WorkHandler.stressIncrement * 8e9;
		base /= SocietyUpgrades.scrolls.effectOrDefault(1);
		return base;
	},
	startLearning() {
		player.work.workState = WorkState.learn;
	},
	tick(dt: number) {
		if (!this.unlocked || player.work.stress >= WorkHandler.maxStress) return;
		player.society.unlockedKnowledge = true;
		if (player.work.workState === WorkState.learn) {
			player.work.learnProgress += dt * this.efficiency;
			if (player.work.learnProgress >= 1) {
				player.work.learnProgress = 0;
				player.work.knowledge += this.knowledgeIncrement;
				player.work.stress += this.stressIncrement;
				player.work.workState = WorkState.none;
			}
		}
	},
};