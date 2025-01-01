import { TabType } from "@/js/ui/tabs";

export interface PlayerType {
	work: {
		isWorking: boolean,
		progress: number,
		hours: number,
		money: number,
		maxMoney: number,
		stress: number,
	}
	options: {
		autosave: number,
		exportCount: number,
	},
	vitalMarker: string,
	migrations: number,
	currentTab: TabType,
}