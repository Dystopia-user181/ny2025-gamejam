import { reactive, toRaw } from "vue";

import { PlayerType, WorkState } from "@/js/player-type";

import { migrations } from "@/js/migrations";
import { Modals } from "@/js/ui/modals";

import { deepAssign, downloadAsFile, isArray, isObject } from "@/utils";

// https://github.com/microsoft/TypeScript/issues/31816#issuecomment-593069149
type FileEventTarget = EventTarget & { files: FileList };
type FileEvent = Event & { target: FileEventTarget };

export const Player = {
	defaultStart(): PlayerType {
		return {
			work: {
				workState: WorkState.none,
				autoWork: false,
				progress: 0,
				hours: 0,
				solarity: 0,
				maxSolarity: 0,
				stress: 0,
				upgrades: {
					investing: -1,
					progress: [],
					amount: [],
				},
				learnProgress: 0,
				knowledge: 0,
				campaignProgress: 0,
				campaigns: 0,
			},
			rebirth: {
				lunarity: 0,
				maxLunarity: 0,
				upgrades: 0,
			},
			shards: {
				sol: 0,
				solUpgAuto: [0, 0, 0, 0, 0, 0, 0, 0],
				luna: 0,
				lunaUpg: [],
				respecSol: false,
				respecLuna: false,
			},
			society: {
				unlocked: false,
				unlockedKnowledge: false,
				isSols: false,
				eduUpgrades: 0,
				solCommune: 0,
				lunaCommune: 0,
				solSettlement: 0,
				lunaSettlement: 0,
				equalityPath: 0,
				politics: [],
			},
			options: {
				autosave: 1,
				exportCount: 0,
			},
			currentTab: "base",
			vitalMarker: Player.storageKey,
			migrations: migrations.length
		};
	},
	storageKey: "igj2025-scarlet-newyear-lifegame",
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	load(playerObj?: any) {
		Object.assign(player, Player.defaultStart());
		if (playerObj) {
			this.loadAndMigrateSave(playerObj);
		}
	},
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	loadAndMigrateSave(playerObj: any) {
		deepAssign(player, playerObj);
		for (; player.migrations < migrations.length; player.migrations++) {
			migrations[player.migrations](player);
		}
	},
	loadSave() {
		try {
			const save = localStorage.getItem(this.storageKey);
			this.load(save ? JSON.parse(save) : undefined);
		} catch {
			this.load();
			Modals.message.showText(`
			The game is unable to save, possibly because you are in incognito. Please export your save
			manually before closing the game.
			`);
		}
	},
	hasNaN(obj: Record<string, unknown> | unknown[] = player) {
		if (isObject(obj)) {
			for (const i in obj) {
				const prop = obj[i];
				if (typeof prop === "number" && Number.isNaN(prop)) return true;
				if ((isObject(prop) || isArray(prop)) && this.hasNaN(prop)) return true;
			}
		} else {
			for (const prop of obj) {
				if (typeof prop === "number" && Number.isNaN(prop)) return true;
				if ((isObject(prop) || isArray(prop)) && this.hasNaN(prop)) return true;
			}
		}
		return false;
	},
	savePlayer() {
		if (player.vitalMarker !== Player.storageKey) return;
		if (this.hasNaN()) {
			// eslint-disable-next-line no-console
			console.error("Has NaN, didn't save");
			return;
		}
		localStorage.setItem(this.storageKey, JSON.stringify(toRaw(player)));
	},
	reset() {
		Player.load();
		Player.savePlayer();
	},
	exportSave() {
		const dateString = `${new Date(Date.now() - (new Date().getTimezoneOffset() * 60 * 1000))
			.toISOString().split("T")[0]} ${new Date().toLocaleTimeString(undefined, { hour12: false })}`;
		player.options.exportCount++;
		downloadAsFile(
			`IGJ2025_stress Save #${player.options.exportCount} (${dateString})`,
			window.btoa(JSON.stringify(toRaw(player)))
		);
	},
	importSave(event: FileEvent) {
		// This happens if the file dialog is canceled instead of a file being selected
		if (event.target.files.length === 0) return;

		const reader = new FileReader();
		reader.onload = function() {
			let text = reader.result;
			if (typeof text !== "string") {
				Modals.message.showText("Invalid savefile format.");
				return;
			}
			try {
				text = window.atob(text);
			} catch {
				Modals.message.showText("Invalid savefile format.");
				return;
			}
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			const playerObj = JSON.parse(text);
			// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
			if (typeof playerObj !== "object" || playerObj.vitalMarker !== Player.storageKey) {
				Modals.message.showText("Invalid savefile format.");
				return;
			}
			Player.load(playerObj);
			Player.savePlayer();
		};
		reader.readAsText(event.target.files[0]);
	}
};

export const player = reactive<PlayerType>({} as PlayerType);

setTimeout(() => Player.loadSave(), 0);

window.saveInterval = setInterval(() => {
	if (player.options.autosave) Player.savePlayer();
}, 10000);

// @ts-ignore
window.player = player;