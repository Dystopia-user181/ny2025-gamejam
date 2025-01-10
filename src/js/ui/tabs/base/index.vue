<script setup lang="ts">
import SolUpgrade from "./SolUpgrade.vue";
import StressMilestone from "./StressMilestone.vue";

import { format } from "@/utils";

import { LearnHandler } from "@/js/work/education";
import { player } from "@/js/player";
import { RebirthHandler } from "@/js/rebirth";
import { RebirthUpgrades } from "@/js/rebirth/upgrades";
import { SolUpgrades } from "@/js/work/solupgrades";
import { StressMilestones } from "@/js/work/stress";
import { WorkHandler } from "@/js/work";
import { WorkState } from "@/js/player-type";
</script>

<template>
	<template v-if="player.work.stress < WorkHandler.maxStress">
		<div class="c-section-work--container">
			<div
				v-if="player.work.maxSolarity > 2 || player.rebirth.maxLunarity"
				class="c-stat"
			>
				Solarity: +{{ format(WorkHandler.solIncrement) }} / work
				<br>
				Work speed: {{ format(WorkHandler.efficiency) }} / s
			</div>
			<div class="c-section-work">
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
					<span v-if="!SolUpgrades.efficiency1.isUnlocked" />
					<SolUpgrade upg-name="dubious" />
					<SolUpgrade upg-name="efficiency1" />
					<SolUpgrade upg-name="efficiency2" />
				</div>
			</div>
			<div
				v-if="LearnHandler.unlocked"
				class="c-section-edu"
			>
				<div class="c-stat2">
					Knowledge: +{{ format(LearnHandler.knowledgeIncrement) }} / learn
					<br>
					Learning Speed: {{ format(LearnHandler.efficiency) }} / s
				</div>
				<div class="c-header">
					<button
						:class="{
							'c-button-unspecified c-work-btn': true,
							'c-work-btn--active': player.work.workState === WorkState.learn,
						}"
						:style="{
							background: `linear-gradient(
								to right,
								rgba(30, 160, 30, 0.6),
								rgba(30, 160, 30, 0.6) ${player.work.learnProgress * 130 - 30}%,
								#6669 ${player.work.learnProgress * 130}%
							)`
						}"
						@click="LearnHandler.toggleLearning()"
					>
						Learn
					</button>
					<span>
						>>> Knowledge: {{ format(player.work.knowledge) }}
					</span>
				</div>
				<div
					v-if="player.society.equalityPath"
					class="c-header"
				>
					<br>
					<template v-if="LearnHandler.canCampaign">
						<button
							:class="{
								'c-button-unspecified c-campaign-btn': true,
								'c-work-btn--active': player.work.workState === WorkState.campaign,
							}"
							:style="{
								background: `linear-gradient(
									to right,
									rgba(30, 160, 30, 0.6),
									rgba(30, 160, 30, 0.6) ${player.work.campaignProgress * 130 - 30}%,
									#6669 ${player.work.campaignProgress * 130}%
								)`
							}"
							@click="LearnHandler.toggleCampaign()"
						>
							{{ format(LearnHandler.campaignCost, 3, 0) }} Knowled.
						</button>
						<span>
							>>> Campaigns: {{ format(player.work.campaigns, 3, 0) }}
						</span>
					</template>
					<template v-else>
						You are not qualified to campaign as a Solsperson.
					</template>
				</div>
				<br>
				Knowledge is gone when you die... But perhaps you can keep knowledge through death with the "Society"
				tab.
			</div>
		</div>
		<div
			v-if="player.work.maxSolarity >= 10 || player.rebirth.maxLunarity"
			class="c-section-stress--container"
		>
			<div class="c-stat">
				Stress: +{{ format(WorkHandler.stressIncrement) }} / work
				<span v-if="LearnHandler.unlocked">
					<br>
					+{{ format(LearnHandler.stressIncrement) }} / learn
					<span v-if="player.society.equalityPath">
						<br>
						+{{ format(LearnHandler.campaignStress) }} / campaign
					</span>
				</span>
			</div>
			<div class="c-section-stress">
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
					class="c-sol-upg-grid2"
				>
					<SolUpgrade upg-name="unstress" />
					<SolUpgrade upg-name="deathWish" />
				</div>
			</div>
		</div>
	</template>
	<template v-else>
		<div class="c-section-prestige">
			<h1>
				Stress: {{ format(player.work.stress) }} / {{ format(WorkHandler.maxStress) }}
				<br><br>
				You died due to excess Stress
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
.c-section-work--container, .c-section-stress--container {
	border: 5px solid #5557;
	font-size: 12px;
	position: relative;
	display: flex;
}

.c-section-work, .c-section-stress, .c-section-edu {
	height: 100%;
	padding: 7px 0;
	display: flex;
	flex-direction: column;
	align-items: center;
	overflow: auto;
	flex-grow: 1;
}

.c-section-edu {
	width: 40%;
}

.c-section-work--container {
	height: 55%;
	background-color: #222;
	color: white;
}

.c-section-stress--container {
	height: 45%;
	background-color: #999;
	color: black;
}

.c-header {
	font-size: 18px;
}

.c-stat {
	position: absolute;
	bottom: 7px;
	left: 7px;
	line-height: 1.2;
}

.c-stat2 {
	position: absolute;
	bottom: 7px;
	right: 7px;
	line-height: 1.2;
}

.c-work-btn {
	width: 100px;
	height: 36px;
	padding: 0;
	border-width: 1px;
}

.c-campaign-btn {
	width: 130px;
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
	grid-template-columns: 1fr 1fr 1fr;
	gap: 10px;
}

.c-sol-upg-grid2 {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 10px;
}

.c-rebirth-btn {
	font-size: 30px;
	padding: 20px;
}
</style>