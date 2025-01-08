import { GameUI } from "@/js/ui/game-ui";
import { LogicEvent } from "@/js/database/events";
import { Modals } from "@/js/ui/modals";
import { UIEvent } from "@/js/ui/events";

import { LearnHandler } from "@/js/work/education";
import { SolShardHandler } from "@/js/shards";
import { WorkHandler } from "@/js/work";

let lastTick = Date.now();

export function gameLoop(_dt?: number) {
	let dt: number;
	if (_dt) {
		dt = _dt;
	} else {
		dt = (Date.now() - lastTick) / 1000;
		dt = Math.min(dt, 20);
		lastTick = Date.now();
	}
	LogicEvent.dispatch("GAME_TICK_BEFORE");
	WorkHandler.tick(dt);
	LearnHandler.tick(dt);
	SolShardHandler.tick();
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