import { player } from "@/js/player";
import { RebirthUpgrades } from "@/js/rebirth/upgrades";

export const SolShardHandler = {
	get stressThreshold() {
		return 1e3;
	},
	get solThreshold() {
		return 2e4 * 25 ** (player.shards.sol + this.totalInvested);
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
		player.shards.respecSol = !player.shards.respecSol;
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
	get total() {
		return this.totalInvested + player.shards.sol;
	},
};