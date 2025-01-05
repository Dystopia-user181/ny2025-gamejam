import { player } from "@/js/player";
import { RebirthUpgrades } from "@/js/rebirth/upgrades";

export const SolShardHandler = {
	get stressThreshold() {
		return 1e3;
	},
	get solThreshold() {
		return 1e3 * 10 ** player.shards.sol;
	},
	tick() {
		if (!RebirthUpgrades[23].isBought || player.work.stress >= this.stressThreshold) return;
		while (player.work.solarity >= this.solThreshold) {
			player.shards.sol++;
		}
	}
};