<script setup lang="ts">
import { format } from "@/utils";

import { player } from "@/js/player";
</script>

<template>
	<div class="c-section-lunarity">
		<div class="c-header">
			{{ format(player.rebirth.lunarity) }} Lunarity
			<br>
			Lunarity is gained whenever you die based on highest Solarity.
		</div>
	</div>
</template>

<style scoped>
.c-section-lunarity {
	height: 100%;
	padding: 10px;
	font-size: 12px;
	display: flex;
	flex-direction: column;
	align-items: center;
	overflow: auto;
	background-color: #202;
}

.c-header {
	font-size: 18px;
}
</style>