import { player } from "@/js/player";
import { SolUpgrades } from "./solupgrades";
import { StressMilestones } from "./stress";
import { WorkState } from "@/js/player-type";

export const WorkHandler = {
	get efficiency() {
		let base = 0.5;
		base *= StressMilestones.x2Efficiency.effectOrDefault(1);
		base *= StressMilestones.x15Efficiency.effectOrDefault(1);
		base *= SolUpgrades.tmpBoost.effect;
		return base;
	},
	get solIncrement() {
		let base = 1;
		base *= SolUpgrades.solarReturns.effect[0];
		base *= SolUpgrades.slow.effect;
		return base;
	},
	get stressIncrement() {
		let base = 1;
		base *= SolUpgrades.solarReturns.effect[1];
		return base;
	},
	startWorking() {
		player.work.workState = WorkState.work;
	},
	tick(dt: number) {
		for (const upg of Object.values(SolUpgrades)) {
			upg.tick(dt);
		}
		SolUpgrades.tmpBoost.amount -= dt / 20;
		SolUpgrades.tmpBoost.amount = Math.max(SolUpgrades.tmpBoost.amount, 0);
		if (player.work.workState === WorkState.work) {
			player.work.progress += dt * this.efficiency;
			if (player.work.progress >= 1) {
				player.work.progress = 0;
				player.work.solarity += this.solIncrement;
				player.work.maxSolarity = Math.max(player.work.maxSolarity, player.work.solarity);
				player.work.stress += this.stressIncrement;
				player.work.workState = WorkState.none;
			}
		}
	},
};