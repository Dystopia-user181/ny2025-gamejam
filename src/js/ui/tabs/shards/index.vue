<script setup lang="ts">
import SubtabComponent from "@/components/SubtabComponent.vue";

import LunaSubtab from "./LunaSubtab.vue";
import SolSubtab from "./SolSubtab.vue";
</script>

<template>
	<div class="c-section-shards">
		<SubtabComponent
			:subtabs="[{
				name: 'Sol',
			}, {
				name: 'Luna',
			}]"
		>
			<template #SolTab>
				<SolSubtab />
			</template>
			<template #LunaTab>
				<LunaSubtab />
			</template>
		</SubTabComponent>
	</div>
</template>

<style scoped>
.c-section-shards {
	display: flex;
	flex-direction: column;
	height: 100%;
	width: 100%;
	background: repeating-linear-gradient(135deg, #000, #000 90px, #888 100px, #000 102px, #000 140px, #888 150px);
	animation: repeat-background 2s linear infinite;
	background-size: 2000px 2000px;
	padding: 4px;
}

@keyframes repeat-background {
	0% { background-position: 0px; }
	100% { background-position: -212.1px; }
}
</style>