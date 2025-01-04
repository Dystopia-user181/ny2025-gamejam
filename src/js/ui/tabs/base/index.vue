<script setup lang="ts">
import SolUpgrade from "./SolUpgrade.vue";
import StressMilestone from "./StressMilestone.vue";

import { format } from "@/utils";

import { player } from "@/js/player";
import { RebirthHandler } from "@/js/rebirth";
import { SolUpgrades } from "@/js/work/solupgrades";
import { StressMilestones } from "@/js/work/stress";
import { WorkHandler } from "@/js/work";
import { WorkState } from "@/js/player-type";
</script>

<template>
	<template v-if="player.work.stress < WorkHandler.maxStress">
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
							rgba(30, 160, 30, 0.6),
							rgba(30, 160, 30, 0.6) ${player.work.progress * 130 - 30}%,
							rgba(255, 255, 255, 0.2) ${player.work.progress * 130}%
						)`
					}"
					@click="WorkHandler.startWorking()"
				>
					Work
				</button>
				<span v-if="player.work.maxSolarity > 2 || player.rebirth.maxLunarity">
					>>> Solarity: {{ format(player.work.solarity, 3, 2) }}
					<span v-if="player.rebirth.maxLunarity">
						(Highest: {{ format(player.work.maxSolarity, 3, 2) }})
					</span>
				</span>
			</div>
			<br>
			<div
				v-if="player.work.maxSolarity >= 24 || player.rebirth.maxLunarity"
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
			v-if="player.work.maxSolarity >= 10 || player.rebirth.maxLunarity"
			class="c-section-stress"
		>
			<div class="c-header">
				Stress: {{ format(player.work.stress, 3, 2) }}
				<span v-if="StressMilestones.negativeE.canApply || player.rebirth.maxLunarity">
					/ {{ format(WorkHandler.maxStress, 3, 2) }} >>>
				</span>
				<span v-if="StressMilestones.negativeE.canApply">
					/ {{ format(StressMilestones.negativeE.effect) }} working speed
				</span>
				<span v-if="StressMilestones.negativeS.canApply">
					& / {{ format(StressMilestones.negativeS.effect) }} Solarity
				</span>
			</div>
			<StressMilestone
				v-for="(_, milestone) in StressMilestones"
				:key="'stressmstn' + _.config.id"
				:upg-name="milestone"
			/>
		</div>
	</template>
	<template v-else>
		<div class="c-section-prestige">
			<h1>
				Stress: {{ format(player.work.stress, 3, 2) }} / {{ format(WorkHandler.maxStress, 3, 2) }}
				<br><br>
				You died due to excess stress
			</h1>
			<button @click="RebirthHandler.reset()">
				Rebirth
			</button>
		</div>
	</template>
</template>

<style scoped>
.c-section-work, .c-section-stress {
	padding: 10px;
	font-size: 12px;
	display: flex;
	flex-direction: column;
	align-items: center;
	overflow: auto;
}

.c-section-work {
	height: 60%;
	background-color: #222;
	color: white;
}

.c-section-stress {
	height: 40%;
	background-color: #999;
	color: black;
}

.c-header {
	font-size: 18px;
}

.c-work-btn {
	width: 100px;
	height: 36px;
	padding: 0;
	border-width: 1px;
}

.c-work-btn--active {
	cursor: default;
	border-width: 4px;
}

.c-sol-upg-grid {
	max-width: 760px;
	margin: -5px;
}
</style>