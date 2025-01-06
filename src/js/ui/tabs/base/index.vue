<script setup lang="ts">
import SolUpgrade from "./SolUpgrade.vue";
import StressMilestone from "./StressMilestone.vue";

import { format } from "@/utils";

import { player } from "@/js/player";
import { RebirthHandler } from "@/js/rebirth";
import { RebirthUpgrades } from "@/js/rebirth/upgrades";
import { StressMilestones } from "@/js/work/stress";
import { WorkHandler } from "@/js/work";
import { WorkState } from "@/js/player-type";
</script>

<template>
	<template v-if="player.work.stress < WorkHandler.maxStress">
		<div class="c-section-work">
			<div
				v-if="player.work.maxSolarity > 2 || player.rebirth.maxLunarity"
				class="c-stat"
			>
				Solarity: +{{ format(WorkHandler.solIncrement) }} / work
				<br>
				Work speed: {{ format(WorkHandler.efficiency) }} / s
			</div>
			<div class="c-header">
				<button
					:class="{
						'c-button-unspecified c-work-btn': true,
						'c-work-btn--active': player.work.workState === WorkState.work,
					}"
					:style="{
						background: WorkHandler.efficiency > 10 && player.work.autoWork
							? 'rgba(30, 160, 30, 0.7)'
							: `linear-gradient(
							to right,
							rgba(30, 160, 30, 0.6),
							rgba(30, 160, 30, 0.6) ${player.work.progress * 130 - 30}%,
							#6669 ${player.work.progress * 130}%
						)`
					}"
					@click="WorkHandler.startWorking()"
				>
					Work
					<span v-if="RebirthUpgrades[11].isBought">
						{{ player.work.autoWork ? "ON" : "OFF" }}
					</span>
				</button>
				<span v-if="player.work.maxSolarity > 2 || player.rebirth.maxLunarity">
					>>> Solarity: {{ format(player.work.solarity) }}
					<span v-if="RebirthUpgrades[11].isBought">
						(+ {{ format(WorkHandler.efficiency * WorkHandler.solIncrement) }}/s)
					</span>
					<span v-if="player.rebirth.maxLunarity">
						(Highest: {{ format(player.work.maxSolarity) }})
					</span>
				</span>
			</div>
			<br>
			<div
				v-if="player.work.maxSolarity >= 24 || player.rebirth.maxLunarity"
				class="c-sol-upg-grid"
			>
				<SolUpgrade upg-name="solarReturns" />
				<SolUpgrade upg-name="slow" />
				<SolUpgrade upg-name="tmpBoost" />
				<SolUpgrade upg-name="dubious" />
				<span />
				<SolUpgrade upg-name="efficiency1" />
				<SolUpgrade upg-name="efficiency2" />
			</div>
		</div>
		<div
			v-if="player.work.maxSolarity >= 10 || player.rebirth.maxLunarity"
			class="c-section-stress"
		>
			<div
				v-if="player.work.maxSolarity > 2 || player.rebirth.maxLunarity"
				class="c-stat"
			>
				Stress: +{{ format(WorkHandler.stressIncrement) }} / work
			</div>
			<div class="c-header">
				Stress: {{ format(player.work.stress) }}
				<span v-if="RebirthUpgrades[11].isBought">
					(+ {{ format(WorkHandler.efficiency * WorkHandler.stressIncrement) }}/s)
				</span>
				<span v-if="StressMilestones.negativeE.canApply || player.rebirth.maxLunarity">
					/ {{ format(WorkHandler.maxStress) }}
				</span>
				<span v-if="StressMilestones.negativeE.canApply">
					>>> / {{ format(StressMilestones.negativeE.effect) }} work speed
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
			<br>
			<div
				v-if="player.work.maxSolarity >= 24 || player.rebirth.maxLunarity"
				class="c-sol-upg-grid"
			>
				<span />
				<SolUpgrade upg-name="unstress" />
				<SolUpgrade upg-name="deathWish" />
			</div>
		</div>
	</template>
	<template v-else>
		<div class="c-section-prestige">
			<h1>
				Stress: {{ format(player.work.stress) }} / {{ format(WorkHandler.maxStress) }}
				<br><br>
				You died due to excess stress
			</h1>
			<button
				class="c-rebirth-btn"
				@click="RebirthHandler.reset()"
			>
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
	position: relative;
}

.c-section-work {
	height: 55%;
	background-color: #222;
	color: white;
}

.c-section-stress {
	height: 45%;
	background-color: #999;
	color: black;
}

.c-header {
	font-size: 18px;
}

.c-stat {
	position: absolute;
	bottom: 10px;
	left: 10px;
	line-height: 1.2;
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
	display: grid;
	grid-template-columns: 1fr 1fr 1fr 1fr;
	gap: 10px;
}

.c-rebirth-btn {
	font-size: 30px;
	padding: 20px;
}
</style>