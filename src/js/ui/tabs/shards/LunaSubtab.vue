<script setup lang="ts">
import { format, formatInt } from "@/utils";

import { LunaShardHandler, LunaShardUpgrades } from "@/js/shards";
import { player } from "@/js/player";
import { RebirthUpgrades } from "@/js/rebirth/upgrades";
</script>

<template>
	<div
		v-if="RebirthUpgrades[32].isBought"
		class="c-section-luna"
	>
		<span class="c-header">
			You have {{ formatInt(player.shards.luna) }} Luna Shards <i class="fa fa-moon" />
		</span>
		<button
			:class="{
				'c-button-good': LunaShardHandler.canAfford,
				'disabled': !LunaShardHandler.canAfford,
			}"
			@click="LunaShardHandler.buy()"
		>
			Create one with {{ format(LunaShardHandler.lunarThreshold) }} Lunarity
		</button>
		<br>
		<button
			class="c-button-unspecified"
			:disabled="LunaShardHandler.totalInvested <= 0"
			@click="LunaShardHandler.requestRespec()"
		>
			Respec <i class="fa fa-moon" />
		</button>
		<br>
		<div class="c-luna-upgrades">
			<div
				v-for="upgrade in LunaShardUpgrades"
				:key="'lunshardupg' + upgrade.config.id"
				class="c-luna-upgrade"
			>
				<div class="c-luna-upgrade--pedestal">
					<span>{{ upgrade.description }}</span>
					<br>
					<span>Currently: {{ upgrade.effectDisplay }}</span>
				</div>
				<div class="c-luna-upgrade--pedestal-top" />
				<i
					v-for="i in upgrade.amount"
					:key="'moonsymbol' + upgrade.config.description + i"
					:class="{
						'fa fa-moon': true,
						'fa-moon--small': upgrade.amount > 6
					}"
				/>
				<button
					v-if="upgrade.amount < 10"
					:class="{
						'c-add-button': true,
						'c-button-good': upgrade.canAfford,
						'disabled': !upgrade.canAfford
					}"
					@click="upgrade.buy()"
				>
					+
				</button>
			</div>
		</div>
	</div>
	<div
		v-else
		class="c-section-luna c-header"
	>
		<span>Buy <b>32</b> to unlock Sol Shards</span>
	</div>
</template>

<style scoped>
.c-section-luna {
	height: 100%;
	width: 100%;
	padding: 10px;
	font-size: 12px;
	display: inline-flex;
	flex-direction: column;
	align-items: center;
	overflow: auto;
	background-color: #253b49ee;
	line-height: 1.5;
}

.c-header {
	font-size: 18px;
}

.c-section-luna :deep(.fa-moon) {
	color: #7ea1f8;
}

.c-luna-upgrades {
	height: 100%;
	margin-bottom: 30px;
	display: flex;
	align-items: flex-end;
	gap: 40px;
}

.c-luna-upgrade {
	display: flex;
	flex-direction: column-reverse;
	align-items: center;
	width: 200px;
	font-size: 15px;
}

.c-luna-upgrade--pedestal {
	background: #001;
	width: 100%;
	padding: 10px;
}

.c-luna-upgrade--pedestal-top {
	background: #112;
	width: 50%;
	height: 10px;
}

.c-luna-upgrade .fa-moon {
	font-size: 40px;
}

.c-luna-upgrade .fa-moon--small {
	font-size: 30px;
}

.c-add-button {
	height: 38px;
	width: 38px;
	font-size: 20px;
	padding: 0;
	margin-bottom: 3px;
}
</style>