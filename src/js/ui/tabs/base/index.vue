<script setup lang="ts">
import SolUpgrade from "./SolUpgrade.vue";
import StressMilestone from "./StressMilestone.vue";

import { format } from "@/utils";

import { player } from "@/js/player";
import { SolUpgrades } from "@/js/work/solupgrades";
import { StressMilestones } from "@/js/work/stress";
import { WorkHandler } from "@/js/work";
import { WorkState } from "@/js/player-type";
</script>

<template>
	<div class="c-section-work">
		<div class="c-header">
			<button
				:class="{
					'c-button-unspecified c-work-btn': true,
					'c-work-btn--active': player.work.workState === WorkState.work,
				}"
				:style="{
					background: `linear-gradient(
						to right,
						rgba(30, 140, 30, 0.6),
						rgba(30, 140, 30, 0.6) ${player.work.progress * 130 - 30}%,
						rgba(255, 255, 255, 0.2) ${player.work.progress * 130}%
					)`
				}"
				@click="WorkHandler.startWorking()"
			>
				Work
			</button>
			<span v-if="player.work.maxSolarity > 2">
				>>> Solarity: {{ format(player.work.solarity, 3, 2) }}
			</span>
		</div>
		<br>
		<div
			v-if="player.work.maxSolarity >= 24"
			class="c-sol-upg-grid"
		>
			<SolUpgrade
				v-for="(_, upg) in SolUpgrades"
				:key="'solupg' + _.config.id"
				:upg-name="upg"
			/>
		</div>
	</div>
	<div
		v-if="player.work.maxSolarity >= 10"
		class="c-section-stress"
	>
		<div class="c-header">
			Stress: {{ format(player.work.stress, 3, 2) }}
		</div>
		<StressMilestone
			v-for="(_, milestone) in StressMilestones"
			:key="'stressmstn' + _.config.id"
			:upg-name="milestone"
		/>
	</div>
</template>

<style scoped>
.c-section-work, .c-section-stress {
	height: 50%;
	padding: 10px;
	font-size: 12px;
	display: flex;
	flex-direction: column;
	align-items: center;
	overflow: auto;
}

.c-section-work {
	background-color: #222;
	color: white;
}

.c-section-stress {
	background-color: #999;
	color: black;
}

.c-header {
	font-size: 16px;
}

.c-work-btn {
	width: 100px;
	height: 34px;
	padding: 0;
	border-width: 1px;
	transition: box-shadow border-width 0.2s;
}

.c-work-btn--active {
	cursor: default;
	border-width: 4px;
}

.c-sol-upg-grid {
	display: flex;
	gap: 10px;
}
</style>