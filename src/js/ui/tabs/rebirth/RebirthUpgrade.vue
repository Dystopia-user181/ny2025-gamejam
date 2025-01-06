<script setup lang="ts">
import { format } from "@/utils";

import { RebirthUpgrades } from "@/js/rebirth/upgrades";

const { upgName } = defineProps<{
	upgName: keyof typeof RebirthUpgrades
}>();

const upgrade = RebirthUpgrades[upgName];
</script>

<template>
	<button
		:class="{
			'c-button-unspecified c-rebirth-upg': true,
			'c-rebirth-upg--bought': upgrade.isBought,
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
		{{ format(upgrade.cost) }} Lunarity
		<template v-if="upgrade.effectDisplay">
			<br>
			Currently: {{ upgrade.effectDisplay }}
		</template>
	</button>
</template>

<style scoped>
.c-rebirth-upg {
	width: 180px;
	height: 110px;
	padding: 7px;
	vertical-align: top;
	margin: 5px;
	border-width: 1px;
}

.c-rebirth-upg--bought {
	background-color: #6636b3;
}

b {
	font-size: 14px;
}
</style>