import { Player, player } from "@/js/player";

import { LunaShardUpgrades } from "@/js/shards";

export const RebirthHandler = {
	get projectedLunarityGain() {
		if (player.work.maxSolarity < 1e6) return 0;
		let base = Math.sqrt(player.work.maxSolarity / 1e7);
		base *= LunaShardUpgrades.lune.effect;
		return base;
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