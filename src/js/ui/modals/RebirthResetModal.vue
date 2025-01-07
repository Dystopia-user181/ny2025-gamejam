<script setup lang="ts">
import ModalWrapperConfirm from "./ModalWrapperConfirm.vue";

import { RebirthHandler } from "@/js/rebirth";

import { Modals } from ".";

const { afterReset, actionText } = defineProps<{
	afterReset:() => void,
	actionText: string,
}>();
</script>

<template>
	<modal-wrapper-confirm
		@confirm="
			afterReset();
			RebirthHandler.resetNoReward();
			Modals.hide();
		"
	>
		<template #header>
			Rebirth reset
		</template>
		Are you sure you want to {{ actionText }}?
		<br>
		Doing so will reset your work progress and give no Lunarity.
	</modal-wrapper-confirm>
</template>