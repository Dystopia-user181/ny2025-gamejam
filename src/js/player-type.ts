import { TabType } from "@/js/ui/tabs";

export enum WorkState {
	none,
	work,
	upgrade,
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
	},
	options: {
		autosave: number,
		exportCount: number,
	},
	vitalMarker: string,
	migrations: number,
	currentTab: TabType,
}