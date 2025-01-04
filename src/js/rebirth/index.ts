import { Player, player } from "@/js/player";

export const RebirthHandler = {
	reset() {
		if (player.rebirth.maxLunarity === 0) {
			player.rebirth.lunarity++;
		}
		player.work = Player.defaultStart().work;
		player.rebirth.maxLunarity = Math.max(player.rebirth.maxLunarity, player.rebirth.lunarity);
	}
};