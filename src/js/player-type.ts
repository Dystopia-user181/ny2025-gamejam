import { TabType } from "@/js/ui/tabs";

export enum WorkState {
	none,
	work,
	upgrade,
}

export interface PlayerType {
	work: {
		workState: WorkState,
		progress: number,
		hours: number,
		solarity: number,
		maxSolarity: number,
		stress: number,
		upgrades: {
			investing: number,
			progress: number[],
			amount: number[],
		}
	}
	options: {
		autosave: number,
		exportCount: number,
	},
	vitalMarker: string,
	migrations: number,
	currentTab: TabType,
}