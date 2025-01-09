<script setup lang="ts">
import { format, formatInt } from "@/utils";

import { player } from "@/js/player";
import { RebirthUpgrades } from "@/js/rebirth/upgrades";
import { SolShardHandler } from "@/js/shards";
import { SolUpgrades } from "@/js/work/solupgrades";
</script>

<template>
	<div
		v-if="RebirthUpgrades[23].isBought"
		class="c-section-sol"
	>
		<span class="c-header">
			You have {{ formatInt(player.shards.sol) }} Sol Shards <i class="fa fa-sun" />
		</span>
		Reach {{ format(SolShardHandler.solThreshold) }} Solarity while under
		{{ format(SolShardHandler.stressThreshold) }} Stress for the next
		<br>
		<br>
		<span>
			Invest <i class="fa fa-sun" /> into upgrades to make them automatically gain levels
			when you have enough solarity.
		</span>
		<button
			:class="{
				'c-button-unspecified': !player.shards.respecSol,
				'c-button-good': player.shards.respecSol
			}"
			:disabled="SolShardHandler.totalInvested <= 0"
			@click="SolShardHandler.requestRespec()"
		>
			Respec <i class="fa fa-sun" /> next life
		</button>
		<br>
		<div class="c-auto-grid">
			<div
				v-for="(upgrade, upgName) in SolUpgrades"
				:key="'autosol' + upgName"
				class="c-auto-item"
			>
				<span class="c-header">{{ upgrade.config.name }}</span>
				<i />
				<button
					:class="{
						'c-add-button': true,
						'c-button-good': player.shards.sol,
						'disabled': !player.shards.sol || upgrade.isAuto
					}"
					@click="SolShardHandler.investUpg(upgrade.config.id)"
				>
					+
				</button>
				<i
					:class="{
						'fa fa-sun': true,
						'fa-incomplete': !upgrade.isAuto
					}"
				/>
			</div>
		</div>
	</div>
	<div
		v-else
		class="c-section-sol c-header"
	>
		<span>Buy <b>23</b> to unlock Sol Shards</span>
	</div>
</template>

<style scoped>
.c-section-sol {
	height: 100%;
	width: 100%;
	padding: 10px;
	font-size: 12px;
	display: inline-flex;
	flex-direction: column;
	align-items: center;
	overflow: auto;
	background-color: #685e1bee;
	line-height: 1.5;
}

.c-header {
	font-size: 18px;
}

.c-section-sol :deep(.fa-sun) {
	color: #f8eb7e;
}

.c-auto-grid {
	display: flex;
	flex-direction: column;
	gap: 10px;
}

.c-auto-item {
	height: 60px;
	display: grid;
	grid-template-columns: 200px 30px 40px 60px;
	align-items: center;
	border-radius: 8px;
	border: 2px solid #f8eb7e;
	background-color: #0003;
}

.c-add-button {
	height: 40px;
	width: 40px;
	font-size: 20px;
	padding: 0;
}

.c-auto-item .fa {
	font-size: 30px;
	text-shadow: 0 0 2px black;
}

.fa-sun.fa-incomplete {
	color: black;
	text-shadow: 0 0 2px white;
}
</style>