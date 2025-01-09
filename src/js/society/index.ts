import { LunaShardHandler, SolShardHandler } from "@/js/shards";
import { player } from "@/js/player";

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
	}
};

export * from "./upgrades";