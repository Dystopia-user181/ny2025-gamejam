import { player } from "@/js/player";
import { RebirthUpgrades } from "@/js/rebirth/upgrades";
import { SolUpgrades } from "./solupgrades";
import { StressMilestones } from "./stress";
import { WorkState } from "@/js/player-type";

export const WorkHandler = {
	get efficiency() {
		let base = 0.5;
		base *= StressMilestones.x2Efficiency.effectOrDefault(1);
		base *= StressMilestones.x15Efficiency.effectOrDefault(1);
		base *= SolUpgrades.tmpBoost.effect;
		base /= StressMilestones.negativeE.effectOrDefault(1);
		base *= SolUpgrades.efficiency1.effect;
		base *= RebirthUpgrades[11].effectOrDefault(1);
		base *= RebirthUpgrades[22].effectOrDefault(1);
		return base;
	},
	get solIncrement() {
		let base = 1;
		base *= SolUpgrades.solarReturns.effect[0];
		base *= SolUpgrades.slow.effect;
		base *= SolUpgrades.dubious.effect[0];
		base /= StressMilestones.negativeS.effectOrDefault(1);
		return base;
	},
	get stressIncrement() {
		let base = 1;
		base *= SolUpgrades.solarReturns.effect[1];
		base *= SolUpgrades.dubious.effect[1];
		base *= SolUpgrades.unstress.effect;
		base *= SolUpgrades.deathWish.effect;
		return base;
	},
	get maxStress() {
		return 1e6;
	},
	startWorking() {
		if (RebirthUpgrades[11].isBought) return;
		player.work.workState = WorkState.work;
	},
	tick(dt: number) {
		if (player.work.stress >= this.maxStress) return;
		for (const upg of Object.values(SolUpgrades)) {
			upg.tick(dt);
		}
		SolUpgrades.tmpBoost.amount -= dt / 20;
		SolUpgrades.tmpBoost.amount = Math.max(SolUpgrades.tmpBoost.amount, 0);
		if (player.work.workState === WorkState.work || RebirthUpgrades[11].isBought) {
			player.work.progress += dt * this.efficiency;
			if (player.work.progress >= 1) {
				if (RebirthUpgrades[11].isBought) {
					const w = Math.floor(player.work.progress);
					player.work.solarity += w * this.solIncrement;
					player.work.stress += w * this.stressIncrement;
					player.work.progress -= w;
				} else {
					player.work.progress = 0;
					player.work.solarity += this.solIncrement;
					player.work.stress += this.stressIncrement;
					player.work.workState = WorkState.none;
				}
				player.work.maxSolarity = Math.max(player.work.maxSolarity, player.work.solarity);
			}
		}
	},
};