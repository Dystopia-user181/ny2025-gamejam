import { Player, player } from "@/js/player";

export const RebirthHandler = {
	get projectedLunarityGain() {
		if (player.work.maxSolarity < 1e6) return 0;
		return Math.sqrt(player.work.maxSolarity / 1e7);
	},
	resetNoReward() {
		player.work = Player.defaultStart().work;
	},
	reset() {
		if (player.rebirth.maxLunarity === 0) {
			player.rebirth.lunarity++;
		} else {
			player.rebirth.lunarity += this.projectedLunarityGain;
		}
		player.rebirth.maxLunarity = Math.max(player.rebirth.maxLunarity, player.rebirth.lunarity);
		this.resetNoReward();
	},
};