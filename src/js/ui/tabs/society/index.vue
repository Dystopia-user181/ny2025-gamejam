<script setup lang="ts">
import SocietyUpgrade from "./SocietyUpgrade.vue";

import { SocietyHandler, SocietyUpgrades } from "@/js/society";
import { player } from "@/js/player";
</script>

<template>
	<div
		v-if="!player.society.unlocked"
		class="c-section-society"
	>
		<button
			:class="{
				'c-button-unlock': true,
				'c-button-good': SocietyHandler.meetRequirement,
				'disabled': !SocietyHandler.meetRequirement,
			}"
			@click="SocietyHandler.unlock()"
		>
			Rebuild society
			<br>
			Requires:
			5 total Sol Shards, 5 total Luna Shards
		</button>
	</div>
	<div
		v-else
		class="c-section-society"
	>
		<div class="c-header">
			<button
				class="c-button-unspecified"
				@click="SocietyHandler.showChangesModal()"
			>
				?
			</button>
			What's changed?
			<br>
			<br>
			<div v-if="player.society.unlockedKnowledge">
				<SocietyUpgrade
					v-for="(upg, upgName) in SocietyUpgrades"
					:key="'socupg' + upg.config.id"
					:upg-name="upgName"
				/>
			</div>
			<br>
			You are a
			<b v-if="player.society.isSols">
				Solsperson <i class="fa fa-sun" />
			</b>
			<b v-else>
				Lunesperson <i class="fa fa-moon" />
			</b>
			in this life
		</div>
		<br>
		<div class="c-comparison">
			<i class="fa fa-moon" />
			<i class="fa fa-sun" />
			<span>Insert good thing</span>
			<span>Insert bad thing</span>
		</div>
	</div>
</template>

<style scoped>
.c-section-society {
	display: flex;
	flex-direction: column;
	align-items: center;
	height: 100%;
	width: 100%;
	padding: 5px;
	background-image: url(images/graph.png);
	background-position: center;
	font-size: 12px;
}

.c-button-unlock {
	width: 240px;
	font-size: 16px;
}

.c-header {
	font-size: 16px;
}

.c-comparison {
	display: grid;
	grid-template-columns: 300px 300px;
	gap: 3px 20px;
	text-align: center;
}

.c-comparison .fa {
	font-size: 30px;
}
</style>