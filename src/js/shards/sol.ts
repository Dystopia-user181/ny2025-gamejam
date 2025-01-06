import { player } from "@/js/player";
import { RebirthUpgrades } from "@/js/rebirth/upgrades";

import { Modals } from "@/js/ui/modals";

export const SolShardHandler = {
	get stressThreshold() {
		return 1e3;
	},
	get solThreshold() {
		return 2e4 * 30 ** (player.shards.sol + this.totalInvested);
	},
	tick() {
		if (!RebirthUpgrades[23].isBought || player.work.stress >= this.stressThreshold) return;
		while (player.work.solarity >= this.solThreshold) {
			player.shards.sol++;
		}
	},
	investUpg(id: number) {
		if (!player.shards.sol) return;
		player.shards.sol--;
		player.shards.solUpgAuto[id]++;
	},
	requestRespec() {
		Modals.rebirthReset.show({
			afterReset: () => this.respec(),
			actionText: "redistribute your sol shards",
		});
	},
	respec() {
		player.shards.sol += this.totalInvested;
		player.shards.solUpgAuto.fill(0);
	},
	get totalInvested() {
		let u = 0;
		for (const k of player.shards.solUpgAuto) u += k;
		return u;
	},
};