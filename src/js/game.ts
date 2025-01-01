import { GameUI } from "@/js/ui/game-ui";
import { LogicEvent } from "@/js/database/events";
import { Modals } from "@/js/ui/modals";
import { UIEvent } from "@/js/ui/events";

import { WorkHandler } from "@/js/work";

let lastTick = Date.now();

export function gameLoop(_diff?: number) {
	let diff: number;
	if (_diff) {
		diff = _diff;
	} else {
		diff = (Date.now() - lastTick) / 1000;
		lastTick = Date.now();
	}
	WorkHandler.tick(diff);
	LogicEvent.dispatch("GAME_TICK_BEFORE");
	GameUI.update();
	LogicEvent.dispatch("GAME_TICK_AFTER");
}

window.gameLoopInterval = setInterval(() => gameLoop(), 30);

function render() {
	GameUI.render();
}

window.renderInterval = setInterval(() => render(), 16);

UIEvent.on(0, "ERROR", x => {
	Modals.message.showText(x);
	clearInterval(gameLoopInterval);
	clearInterval(saveInterval);
});