import { LunaShardHandler, SolShardHandler } from "@/js/shards";
import { player } from "@/js/player";
import { SocietyUpgrades } from "./upgrades";

import { Modals } from "@/js/ui/modals";

export const SocietyHandler = {
	get meetRequirement() {
		return SolShardHandler.total >= 5 && LunaShardHandler.total >= 5;
	},
	unlock() {
		if (!this.meetRequirement) return;
		player.society.unlocked = true;
	},
	get solsChance() {
		return 1 / 3;
	},
	get unlockedDual() {
		return SocietyUpgrades.influence.isBought;
	},
	get stressDual() {
		if (!this.unlockedDual) return [1, 1];
		const base = [0.8, 4];
		return base;
	},
	get stressEffect() {
		return this.stressDual[Number(player.society.isSols)];
	},
	get eduDual() {
		if (!this.unlockedDual) return [1, 1];
		const base = [1.1, 0.5];
		return base;
	},
	get eduEffect() {
		return this.eduDual[Number(player.society.isSols)];
	},
	showChangesModal() {
		Modals.message.showText(`
		<b>There are two classes of beings; Solspeople and Lunespeople.
		<br>
		Lunespeople are superior, Solspeople inferior.</b>
		<br><br>
		You will be reborn either as a lunesperson or a solsperson.
		<br>
		Also, you can hold a hundred times more stress before dying.
		<br>
		In turn, you can go beyond creating solarity.
		`);
	},
};

export const CommuneHandler = {
	get solCommuneCost() {
		return (player.society.solCommune + 1) * 3;
	},
	get solMaxed() {
		return player.society.solCommune >= 10;
	},
	get canAffordSolCommune() {
		return player.society.isSols && player.work.knowledge >= this.solCommuneCost && !this.solMaxed;
	},
	buySolCommune() {
		if (!this.canAffordSolCommune) return;
		player.work.knowledge -= this.solCommuneCost;
		player.society.solCommune++;
	},
	get solCommuneEffect() {
		return 1 + player.society.solCommune * 0.3;
	},
	get lunaCommuneCost() {
		return (player.society.lunaCommune + 1) * 3;
	},
	get lunaMaxed() {
		return player.society.lunaCommune >= 10;
	},
	get canAffordLunaCommune() {
		return !player.society.isSols && player.work.knowledge >= this.lunaCommuneCost && !this.lunaMaxed;
	},
	buyLunaCommune() {
		if (!this.canAffordLunaCommune) return;
		player.work.knowledge -= this.lunaCommuneCost;
		player.society.lunaCommune++;
	},
	get lunaCommuneEffect() {
		return 1 + player.society.lunaCommune * 0.3;
	},
	get effect() {
		return player.society.isSols ? this.solCommuneEffect : this.lunaCommuneEffect;
	},
	decayCommune() {
		if (player.society.isSols) {
			player.society.solCommune = Math.max(player.society.solCommune - 1, 0);
		} else {
			player.society.lunaCommune = Math.max(player.society.lunaCommune - 1, 0);
		}
	}
};

export * from "./upgrades";