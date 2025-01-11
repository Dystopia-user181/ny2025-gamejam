<script setup lang="ts">
import { formatInt } from "@/utils";

import { PoliticsUpgrades } from "@/js/society";

const { upgName } = defineProps<{
	upgName: keyof typeof PoliticsUpgrades
}>();

const upgrade = PoliticsUpgrades[upgName];
</script>

<template>
	<button
		v-if="upgrade.isUnlocked"
		:class="{
			'c-button-unspecified c-campaign-upg': true,
			'c-campaign-upg--maxed': upgrade.isCapped,
			'disabled': !upgrade.canAfford && !upgrade.isCapped,
		}"
		:style="{
			visibility: upgrade.isUnlocked ? 'visible' : 'hidden'
		}"
		@click="upgrade.buy()"
	>
		<b>{{ upgrade.config.name }}</b>
		<br>
		{{ upgrade.config.description }}
		<br>
		Cost: {{ formatInt(upgrade.cost) }} Campaigns
		<template v-if="upgrade.effectDisplay">
			<br>
			Currently: {{ upgrade.effectDisplay }}
		</template>
	</button>
</template>

<style scoped>
.c-campaign-upg {
	grid-column-start: 1;
	grid-column-end: 3;
	padding: 7px;
	vertical-align: top;
	margin-bottom: 5px;
	width: 500px;
	border-width: 1px;
	font-size: 12px;
	justify-self: center;
}

.c-campaign-upg--bought {
	background: radial-gradient(#150b42, #335566);
}

b {
	font-size: 14px;
}
</style>