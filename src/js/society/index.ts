import { LunaShardHandler, SolShardHandler } from "@/js/shards";
import { EqualityPath } from "@/js/player-type";
import { player } from "@/js/player";
import { PoliticsUpgrades } from "./politics";
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
		return 1 / 3 + PoliticsUpgrades.scapeGoat.effect[1];
	},
	get unlockedDual() {
		return SocietyUpgrades.influence.isBought;
	},
	get stressDual() {
		if (!this.unlockedDual) return [1, 1];
		const base = [0.8, 4];
		base[0] *= PoliticsUpgrades.labouring.effect[0];
		base[1] *= PoliticsUpgrades.labouring.effect[1];
		base[0] *= PoliticsUpgrades.deescalation.effect[0];
		base[1] *= PoliticsUpgrades.deescalation.effect[1];
		return base;
	},
	get stressEffect() {
		return this.stressDual[Number(player.society.isSols)];
	},
	get eduDual() {
		if (!this.unlockedDual) return [1, 1];
		const base = [1.1, 0.5];
		base[0] *= PoliticsUpgrades.exchange.effect[0];
		base[1] *= PoliticsUpgrades.exchange.effect[0];
		base[0] *= PoliticsUpgrades.symbolic.effect[0];
		base[1] *= PoliticsUpgrades.symbolic.effect[1];
		return base;
	},
	get eduEffect() {
		return this.eduDual[Number(player.society.isSols)];
	},
	get rebirthDual() {
		if (!this.unlockedDual) return [1, 1];
		const base = [1, 2];
		base[0] *= PoliticsUpgrades.jealousy.effect[0];
		base[1] *= PoliticsUpgrades.jealousy.effect[1];
		return base;
	},
	get rebirthEffect() {
		return this.rebirthDual[Number(player.society.isSols)];
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
	chooseLuna() {
		Modals.choosePath.show({
			afterChoice() {
				player.society.equalityPath = EqualityPath.luna;
			},
			actionText: "take the path of favouring lunespeople",
		});
	},
	chooseSol() {
		Modals.choosePath.show({
			afterChoice() {
				player.society.equalityPath = EqualityPath.sol;
			},
			actionText: "take the path of increased equality",
		});
	},
};

export const CommuneHandler = {
	get solCommuneCost() {
		return (player.society.solCommune + 1) * 3;
	},
	get solMaxed() {
		return player.society.solCommune >= 10;
	},
	get canAffordSol() {
		return player.society.isSols && player.work.knowledge >= this.solCommuneCost && !this.solMaxed;
	},
	buySol() {
		if (!this.canAffordSol) return;
		player.work.knowledge -= this.solCommuneCost;
		player.society.solCommune++;
	},
	get solCommuneEffect() {
		return 1 + player.society.solCommune * 0.4;
	},
	get lunaCommuneCost() {
		return (player.society.lunaCommune + 1) * 3;
	},
	get lunaMaxed() {
		return player.society.lunaCommune >= 10;
	},
	get canAffordLuna() {
		return !player.society.isSols && player.work.knowledge >= this.lunaCommuneCost && !this.lunaMaxed;
	},
	buyLuna() {
		if (!this.canAffordLuna) return;
		player.work.knowledge -= this.lunaCommuneCost;
		player.society.lunaCommune++;
	},
	get lunaCommuneEffect() {
		return 1 + player.society.lunaCommune * 0.4;
	},
	get effect() {
		return player.society.isSols ? this.solCommuneEffect : this.lunaCommuneEffect;
	},
	decay() {
		if (Math.random() > 0.4) return;
		if (player.society.isSols) {
			player.society.solCommune = Math.max(player.society.solCommune - 1, 0);
		} else {
			player.society.lunaCommune = Math.max(player.society.lunaCommune - 1, 0);
		}
	}
};

export const SettlementHandler = {
	get solCost() {
		return (player.society.solSettlement + 2) * 5;
	},
	get solMaxed() {
		return player.society.solSettlement >= 20;
	},
	get canAffordSol() {
		return player.society.isSols && player.work.knowledge >= this.solCost && !this.solMaxed;
	},
	buySol() {
		if (!this.canAffordSol) return;
		player.work.knowledge -= this.solCost;
		player.society.solSettlement++;
	},
	get solEffect() {
		return 1.35 ** player.society.solSettlement;
	},
	get lunaCost() {
		return (player.society.lunaSettlement + 2) * 5;
	},
	get lunaMaxed() {
		return player.society.lunaSettlement >= 20;
	},
	get canAffordLuna() {
		return !player.society.isSols && player.work.knowledge >= this.lunaCost && !this.lunaMaxed;
	},
	buyLuna() {
		if (!this.canAffordLuna) return;
		player.work.knowledge -= this.lunaCost;
		player.society.lunaSettlement++;
	},
	get lunaEffect() {
		return 1.35 ** player.society.lunaSettlement;
	},
	get effect() {
		return player.society.isSols ? this.solEffect : this.lunaEffect;
	},
	decay() {
		if (Math.random() > 0.4) return;
		if (player.society.isSols) {
			player.society.solSettlement = Math.max(player.society.solSettlement - 1, 0);
		} else {
			player.society.lunaSettlement = Math.max(player.society.lunaSettlement - 1, 0);
		}
	}
};

export * from "./upgrades";
export * from "./politics";