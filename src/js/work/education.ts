import { player } from "@/js/player";

import { CommuneHandler, SocietyHandler, SocietyUpgrades } from "@/js/society";
import { EqualityPath, WorkState } from "@/js/player-type";
import { RebirthUpgrades } from "@/js/rebirth/upgrades";
import { StressMilestones } from "./stress";
import { WorkHandler } from ".";

export const LearnHandler = {
	get unlocked() {
		return StressMilestones.learn.canApply;
	},
	get efficiency() {
		let base = 0.4;
		base *= SocietyUpgrades.scrolls.effectOrDefault(1);
		base *= CommuneHandler.effect;
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
	get campaignStress() {
		let base = 5e6;
		if (player.society.equalityPath === EqualityPath.sol) base *= 2;
		if (SocietyUpgrades.politics3.isBought) base /= 2;
		return base;
	},
	get canCampaign() {
		return SocietyUpgrades.politics2.isBought || !player.society.isSols;
	},
	toggleLearning() {
		if (player.work.workState !== WorkState.learn) player.work.workState = WorkState.learn;
		else player.work.workState = WorkState.none;
	},
	toggleCampaign() {
		if (player.work.workState !== WorkState.campaign) player.work.workState = WorkState.campaign;
		else player.work.workState = WorkState.none;
	},
	get campaignCost() {
		return 10 * (player.work.campaigns + 1);
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
		} else if (player.work.workState === WorkState.campaign) {
			const dc = Math.min(dt / 4, player.work.knowledge / this.campaignCost, 1 - player.work.campaignProgress);
			player.work.knowledge -= dc * this.campaignCost;
			player.work.campaignProgress += dc;
			if (player.work.campaignProgress >= 1 - 1e-14) {
				player.work.campaignProgress = 0;
				player.work.campaigns++;
				player.work.stress += this.campaignStress;
				player.work.workState = WorkState.none;
			}
		}
	},
};