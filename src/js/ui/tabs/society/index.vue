<script setup lang="ts">
import SocietyUpgrade from "./SocietyUpgrade.vue";

import { format, formatPercents, formatX } from "@/utils";

import { CommuneHandler, SettlementHandler, SocietyHandler, SocietyUpgrades } from "@/js/society";
import { EqualityPath } from "@/js/player-type";
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
		v-else-if="SocietyUpgrades.politics.isBought && !player.society.equalityPath"
		class="c-section-society"
	>
		<div class="c-header">
			<b>Politics; You must make a choice.</b>
			<br>
			This choice is <b>irreversible</b>. Make sure you export your save if you want to play both sides.
		</div>
		<br>
		<div>
			<button
				class="c-button-unspecified"
				@click="SocietyHandler.chooseLuna()"
			>
				Favour Lunespeople
			</button>
			OR
			<button
				class="c-button-unspecified"
				@click="SocietyHandler.chooseSol()"
			>
				Fight for Equality
			</button>
		</div>
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
			<div v-if="player.society.unlockedKnowledge">
				{{ format(player.work.knowledge) }} Knowledge
				<span v-if="player.society.equalityPath">
					& {{ format(player.work.campaigns, 3, 0) }} Campaigns
				</span>
				<br>
				<SocietyUpgrade
					v-for="(upg, upgName) in SocietyUpgrades"
					:key="'socupg' + upg.config.id"
					:upg-name="upgName"
				/>
			</div>
			<template v-if="player.society.equalityPath">
				You are {{ player.society.equalityPath === EqualityPath.sol
					? "Fighting for equality"
					: "Favouring Lunespeople" }}.
				This is the end of balanced content, but you can still play if you wish.
			</template>
		</div>
		<br>
		<div class="c-comparison">
			<i class="fa fa-moon" />
			<i class="fa fa-sun" />
			<template v-if="SocietyHandler.unlockedDual">
				<span>{{ formatPercents(1 - SocietyHandler.solsChance) }} chance to be born as a Lunesperson</span>
				<span>{{ formatPercents(SocietyHandler.solsChance) }} chance to be born as a Solsperson</span>
				<span>{{ formatX(SocietyHandler.stressDual[0]) }} Stress</span>
				<span>{{ formatX(SocietyHandler.stressDual[1]) }} Stress</span>
				<span>{{ formatX(SocietyHandler.eduDual[0]) }} Knowledge</span>
				<span>{{ formatX(SocietyHandler.eduDual[1]) }} Knowledge</span>
				<span>{{ formatX(SocietyHandler.rebirthDual[0]) }} Lunarity</span>
				<span>{{ formatX(SocietyHandler.rebirthDual[1]) }} Lunarity</span>
				<button
					:class="{
						'c-commune-button': true,
						'c-button-good': CommuneHandler.lunaMaxed,
						'c-button-unspecified': CommuneHandler.canAffordLuna,
						'disabled': !CommuneHandler.canAffordLuna && !CommuneHandler.lunaMaxed
					}"
					@click="CommuneHandler.buyLuna()"
				>
					<b>Form a luna commune for +40% work and learning speed to all lunespeople.</b>
					<br>
					It decays upon dying as a lunesperson if not maintained.
					<br>
					Currently: {{ formatX(CommuneHandler.lunaCommuneEffect) }}
					<br>
					Cost: {{ format(CommuneHandler.lunaCommuneCost) }} Knowledge
				</button>
				<button
					:class="{
						'c-commune-button': true,
						'c-button-good': CommuneHandler.solMaxed,
						'c-button-unspecified': CommuneHandler.canAffordSol,
						'disabled': !CommuneHandler.canAffordSol && !CommuneHandler.solMaxed
					}"
					@click="CommuneHandler.buySol()"
				>
					<b>Form a sol commune for +40% work and learning speed to all solspeople.</b>
					<br>
					It decays upon dying as a solsperson if not maintained.
					<br>
					Currently: {{ formatX(CommuneHandler.solCommuneEffect) }}
					<br>
					Cost: {{ format(CommuneHandler.solCommuneCost) }} Knowledge
				</button>
				<button
					:class="{
						'c-commune-button': true,
						'c-button-good': SettlementHandler.lunaMaxed,
						'c-button-unspecified': SettlementHandler.canAffordLuna,
						'disabled': !SettlementHandler.canAffordLuna && !SettlementHandler.lunaMaxed
					}"
					@click="SettlementHandler.buyLuna()"
				>
					<b>Build a luna settlement for ×1.35 Lunarity to all lunespeople.</b>
					<br>
					It decays upon dying as a lunesperson if not maintained.
					<br>
					Currently: {{ formatX(SettlementHandler.lunaEffect) }}
					<br>
					Cost: {{ format(SettlementHandler.lunaCost) }} Knowledge
				</button>
				<button
					:class="{
						'c-commune-button': true,
						'c-button-good': SettlementHandler.solMaxed,
						'c-button-unspecified': SettlementHandler.canAffordSol,
						'disabled': !SettlementHandler.canAffordSol && !SettlementHandler.solMaxed
					}"
					@click="SettlementHandler.buySol()"
				>
					<b>Build a sol settlement for ×1.35 Lunarity to all solspeople.</b>
					<br>
					It decays upon dying as a solsperson if not maintained.
					<br>
					Currently: {{ formatX(SettlementHandler.solEffect) }}
					<br>
					Cost: {{ format(SettlementHandler.solCost) }} Knowledge
				</button>
			</template>
			<template v-else>
				<span>???</span>
				<span>???</span>
			</template>
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

.c-commune-button {
	justify-self: center;
	width: 290px;
}

.c-commune-button b {
	font-size: 13px;
}

.c-button-good {
	cursor: default;
}
</style>