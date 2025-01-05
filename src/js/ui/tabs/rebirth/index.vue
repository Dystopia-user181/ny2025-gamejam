<script setup lang="ts">
import RebirthUpgrade from "./RebirthUpgrade.vue";

import { format } from "@/utils";

import { player } from "@/js/player";
import { RebirthHandler } from "@/js/rebirth";
import { RebirthUpgrades } from "@/js/rebirth/upgrades";
</script>

<template>
	<div class="c-section-lunarity">
		<div class="c-header">
			{{ format(player.rebirth.lunarity) }} Lunarity
			<br>
			Lunarity is gained whenever you die based on highest Solarity.
			<br>
			Gain on death: {{ format(RebirthHandler.projectedLunarityGain) }}
			<span v-if="RebirthHandler.projectedLunarityGain <= 0">
				(Requires 2.000e6 Solarity)
			</span>
		</div>
		<br>
		<div class="c-rebirth-upg-grid">
			<RebirthUpgrade
				v-for="(_, upg) in RebirthUpgrades"
				:key="'rebirthupg' + _.config.id"
				:upg-name="upg"
			/>
		</div>
	</div>
</template>

<style scoped>
.c-section-lunarity {
	height: 100%;
	padding: 10px;
	font-size: 12px;
	display: flex;
	flex-direction: column;
	align-items: center;
	overflow: auto;
	background-color: #202;
	transition: background-color 0.2s, border 0.2s, box-shadow 0.2s, padding 0.2s;
}

.c-header {
	font-size: 18px;
}

.c-rebirth-upg-grid {
	display: grid;
	grid-template-columns: 1fr 1fr 1fr 1fr;
}
</style>