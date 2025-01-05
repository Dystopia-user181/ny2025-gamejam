<script setup lang="ts">
import { format, formatInt } from "@/utils";

import { player } from "@/js/player";
import { SolShardHandler } from "@/js/shards";
</script>

<template>
	<div class="c-section-sol">
		<h2>
			You have {{ formatInt(player.shards.sol) }} Sol Shards <i class="fa fa-sun" />.
		</h2>
		Reach {{ format(SolShardHandler.solThreshold) }} Solarity while under
		{{ format(SolShardHandler.stressThreshold) }} Stress for the next
	</div>
</template>

<style scoped>
.c-section-sol {
	height: 100%;
	width: 50%;
	padding: 10px;
	font-size: 12px;
	display: inline-flex;
	flex-direction: column;
	align-items: center;
	overflow: auto;
	background-color: #584f17;
}
</style>