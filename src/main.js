import { DISPLAY, SPIN_TICK_MS, SPIN_DURATION_MS } from "./constants.js";
import { getDom } from "./dom.js";
import { loadSymbols } from "./assets.js";
import { renderReels } from "./render.js";
import { randSymbolIndex } from "./random.js";
import { createAudioController } from "./audio.js";
import { burstConfetti, createBanners, setupSettingsPanel } from "./ui.js";
import { createSlotGame } from "./game.js";

const dom = getDom();
const symbols = await loadSymbols();

setupSettingsPanel(dom);

const audio = createAudioController(dom);
audio.initFromSlider();

const banners = createBanners(dom);

const render = (reels) => renderReels(dom.reelCtx, symbols, reels, DISPLAY);

const game = createSlotGame({
  dom,
  symbols,
  render,
  rng: randSymbolIndex,
  audio,
  ui: { burstConfetti },
  banners,
  constants: { SPIN_TICK_MS, SPIN_DURATION_MS },
});

game.renderInitial();
game.start();
