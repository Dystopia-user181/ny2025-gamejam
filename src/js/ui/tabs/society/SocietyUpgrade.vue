<script setup lang="ts">
import { format } from "@/utils";

import { SocietyUpgrades } from "@/js/society/upgrades";

const { upgName } = defineProps<{
	upgName: keyof typeof SocietyUpgrades
}>();

const upgrade = SocietyUpgrades[upgName];
</script>

<template>
	<button
		:class="{
			'c-button-unspecified c-society-upg': true,
			'c-society-upg--bought': upgrade.isBought,
			'disabled': !upgrade.canAfford && !upgrade.isBought,
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
		{{ format(upgrade.cost) }} Knowledge
		<template v-if="upgrade.effectDisplay">
			<br>
			Currently: {{ upgrade.effectDisplay }}
		</template>
	</button>
</template>

<style scoped>
.c-society-upg {
	width: 180px;
	height: 110px;
	padding: 7px;
	vertical-align: top;
	margin: 5px;
	border-width: 1px;
	font-size: 12px;
}

.c-society-upg--bought {
	background: radial-gradient(#150b42, #335566);
}

b {
	font-size: 14px;
}
</style>