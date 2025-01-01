<script setup>
import StressMilestone from "./StressMilestone.vue";

import { format } from "@/utils";

import { player } from "@/js/player";
import { StressMilestones } from "@/js/work/stress";
import { WorkHandler } from "@/js/work";
</script>

<template>
	<div class="c-section-work">
		<div class="c-header">
			<button
				class="c-work-btn"
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
			<span v-if="player.work.maxMoney > 2">
				>>> Solarity: {{ format(player.work.money, 3, 2) }}
			</span>
		</div>
	</div>
	<div
		v-if="player.work.maxMoney >= 10"
		class="c-section-stress"
	>
		<div class="c-header">
			Stress: {{ format(player.work.stress, 3, 2) }}
		</div>
		<StressMilestone
			v-for="(_, milestone) in StressMilestones"
			:key="_.id"
			:upg-name="milestone"
		/>
	</div>
</template>

<style scoped>
.c-section-work {
	background-color: #222;
	color: white;
	height: 50%;
	padding: 10px;
	font-size: 14px;
	text-align: center;
}

.c-section-stress {
	background-color: #999;
	color: black;
	height: 50%;
	padding: 10px;
	font-size: 14px;
	display: flex;
	flex-direction: column;
	align-items: center;
}

.c-header {
	font-size: 16px;
}

.c-work-btn {
	width: 100px;
	padding: 7px;
}
</style>