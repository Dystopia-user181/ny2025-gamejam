<script setup lang="ts">
import { format } from "@/utils";

import { SolUpgrades } from "@/js/work/solupgrades";

const { upgName } = defineProps<{
	upgName: keyof typeof SolUpgrades
}>();

const upgrade = SolUpgrades[upgName];
</script>

<template>
	<button
		v-if="upgrade.isUnlocked"
		:class="{
			'c-button-unspecified c-sol-upg': true,
			'c-sol-upg--active': upgrade.isSelected,
			'c-sol-upg--unbuyable disabled': !upgrade.isBuyable,
			'c-sol-upg--auto': upgrade.isAuto,
		}"
		:style="{
			background: upgrade.isAuto ? '' : `linear-gradient(
				to right,
				#325886,
				#325886 ${upgrade.progress / upgrade.cost * 130 - 30}%,
				#555b ${upgrade.progress / upgrade.cost * 130}%
			)`
		}"
		@click="upgrade.isSelected ? upgrade.deselect() : upgrade.select()"
	>
		<b>{{ upgrade.config.name }}</b>
		<br>
		{{ upgrade.config.description }}
		<br>
		<span>
			<span v-if="upgrade.isAuto">
				Next at
			</span>
			<span v-else>
				{{ format(upgrade.progress) }} /
			</span>
			{{ format(upgrade.cost) }} Solarity
		</span>
		<template v-if="upgrade.effectDisplay">
			<br>
			Currently: {{ upgrade.effectDisplay }}
		</template>
	</button>
</template>

<style scoped>
.c-sol-upg {
	width: 180px;
	height: 110px;
	padding: 7px;
	border-width: 1px;
	transition: background-color 0.2s, border 0.2s, box-shadow 0.2s, padding 0.2s;
}

.c-sol-upg--active {
	border-width: 4px;
	padding: 4px;
}

.c-sol-upg--unbuyable {
	cursor: default;
}

.c-sol-upg--auto {
	cursor: default;
	color: #f8eb7e;
	border-color: #f8eb7e;
	background-color: #584f1799;
}

b {
	font-size: 14px;
}
</style>