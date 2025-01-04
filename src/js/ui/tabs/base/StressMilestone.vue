<script setup lang="ts">
import { format } from "@/utils";

import { StressMilestones } from "@/js/work/stress";

const { upgName } = defineProps<{
	upgName: keyof typeof StressMilestones
}>();

const milestone = StressMilestones[upgName];
</script>

<template>
	<div
		v-if="milestone.isUnlocked"
		:class="{
			'c-stress-milestone': true,
			'c-stress-milestone--unlocked': milestone.canApply
		}"
	>
		<span>{{ format(milestone.config.threshold, 3, 0) }} stress</span>
		<span>{{ milestone.config.effectName }}</span>
		<i>{{ milestone.config.description }}</i>
	</div>
</template>

<style scoped>
.c-stress-milestone {
	display: grid;
	opacity: 0.5;
	grid-template-columns: 100px 200px 300px;
	text-align: left;
	max-width: 600px;
}

.c-stress-milestone--unlocked {
	opacity: 1;
	background-color: #fff5;
}
</style>