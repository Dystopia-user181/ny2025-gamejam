<script setup lang="ts">
import ModalWrapperConfirm from "./ModalWrapperConfirm.vue";

import { Modals } from ".";

const { afterChoice, actionText } = defineProps<{
	afterChoice:() => void,
	actionText: string,
}>();
</script>

<template>
	<modal-wrapper-confirm
		@confirm="
			afterChoice();
			Modals.hide();
		"
	>
		<template #header>
			Choice
		</template>
		Are you sure you want to {{ actionText }}?
		<br>
		Doing so is <b>irreversible</b>!
	</modal-wrapper-confirm>
</template>