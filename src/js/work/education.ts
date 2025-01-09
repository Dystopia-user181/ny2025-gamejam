import { player } from "@/js/player";

import { SocietyHandler, SocietyUpgrades } from "@/js/society";
import { RebirthUpgrades } from "@/js/rebirth/upgrades";
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
		let base = 0.1;
		base *= RebirthUpgrades[24].effectOrDefault(1);
		base *= SocietyHandler.eduEffect;
		return base;
	},
	get stressIncrement() {
		let base = WorkHandler.stressIncrement * 1.6e10;
		base /= SocietyUpgrades.scrolls.effectOrDefault(1);
		return base;
	},
	toggleLearning() {
		if (player.work.workState !== WorkState.learn) player.work.workState = WorkState.learn;
		else player.work.workState = WorkState.none;
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
				if (!RebirthUpgrades[42].isBought) player.work.workState = WorkState.none;
			}
		}
	},
};