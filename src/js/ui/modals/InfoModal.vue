<script setup>
import ModalWrapper from "./ModalWrapper.vue";
</script>

<template>
	<ModalWrapper class="c-info">
		<template #header>
			Info
		</template>
		<br>
		<span class="c-info__body">
			If you want to contribute to this game, you may visit its github page below. Joining
			the discord for more in depth discussion of development work is also recommended.
			<br>
			<br>
			Credits:<br>
			Dystopia181: Main dev
		</span>
		<br>
		<br>
		<a
			href="https://discord.gg/DVy4XjB"
			target="_blank"
			class="fa-brands fa-discord"
			title="Discord"
		/>
		<a
			href="https://github.com/Dystopia-user181/ny2025-gamejam"
			target="_blank"
			class="fa-brands fa-github"
			title="Contribute"
		/>
		<a
			href="https://buymeacoffee.com/s.composer"
			target="_blank"
			class="fas fa-dollar-sign"
			title="Donate"
		/>
	</ModalWrapper>
</template>

<style scoped>
.c-info {
	width: 600px;
}

.c-info__body {
	font-size: 16px;
}

.fa-brands, .fas {
	font-size: 60px;
	margin: 3px 20px;
}
</style>