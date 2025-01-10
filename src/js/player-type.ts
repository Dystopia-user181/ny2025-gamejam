import { TabType } from "@/js/ui/tabs";

export enum WorkState {
	none,
	work,
	upgrade,
	learn,
	campaign,
}

export enum EqualityPath {
	none,
	luna,
	sol,
}

export interface PlayerType {
	work: {
		workState: WorkState,
		autoWork: boolean,
		progress: number,
		hours: number,
		solarity: number,
		maxSolarity: number,
		stress: number,
		upgrades: {
			investing: number,
			progress: number[],
			amount: number[],
		},
		learnProgress: number,
		knowledge: number,
		campaignProgress: number,
		campaigns: number,
	},
	rebirth: {
		lunarity: number,
		maxLunarity: number,
		upgrades: number,
	},
	shards: {
		sol: number,
		solUpgAuto: number[],
		luna: number,
		lunaUpg: number[],
		respecSol: boolean,
		respecLuna: boolean,
	},
	society: {
		unlocked: boolean,
		unlockedKnowledge: boolean,
		isSols: boolean,
		eduUpgrades: number,
		solCommune: number,
		lunaCommune: number,
		solSettlement: number,
		lunaSettlement: number,
		equalityPath: EqualityPath,
		politics: number[],
	},
	options: {
		autosave: number,
		exportCount: number,
	},
	vitalMarker: string,
	migrations: number,
	currentTab: TabType,
}