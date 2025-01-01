import { player } from "@/js/player";
import { StressMilestones } from "./stress";

export const WorkHandler = {
	get efficiency() {
		let base = 0.5;
		base *= StressMilestones.x2Efficiency.effectOrDefault(1);
		return base;
	},
	startWorking() {
		player.work.isWorking = true;
	},
	tick(diff: number) {
		if (!player.work.isWorking) return;
		player.work.progress += diff * this.efficiency;
		if (player.work.progress >= 1) {
			player.work.progress = 0;
			player.work.money++;
			player.work.maxMoney = Math.max(player.work.maxMoney, player.work.money);
			player.work.stress++;
			player.work.isWorking = false;
		}
	},
};