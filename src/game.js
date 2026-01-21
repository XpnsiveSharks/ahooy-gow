export function createSlotGame({ dom, symbols, render, rng, audio, ui, banners, constants }) {
  let reels = [0, 0, 0];
  let spinning = false;
  let spinIntervalId = null;

  function startSpin() {
    if (spinning) return;
    spinning = true;
    if (dom.resultEl) dom.resultEl.textContent = "here we go";
    if (dom.spinBtn) dom.spinBtn.disabled = true;
    if (dom.slotEl) dom.slotEl.classList.add("spinning");
    audio.ensureBgmOnSpin();
    audio.playSpin();

    spinIntervalId = setInterval(() => {
      reels = [
        rng(symbols.length),
        rng(symbols.length),
        rng(symbols.length),
      ];
      render(reels);
    }, constants.SPIN_TICK_MS);

    setTimeout(() => {
      clearInterval(spinIntervalId);
      spinIntervalId = null;
      reels = [
        rng(symbols.length),
        rng(symbols.length),
        rng(symbols.length),
      ];
      render(reels);
      const [a, b, c] = reels;
      if (a === b && b === c) {
        if (dom.resultEl) dom.resultEl.textContent = "BIG WIN!";
        banners.showBigWinBanner();
        ui.burstConfetti();
        audio.playBigWin();
      } else if (a === b || a === c || b === c) {
        if (dom.resultEl) dom.resultEl.textContent = "SMALL WIN!";
        banners.showSmallWinBanner();
        audio.playSmallWin();
      } else {
        if (dom.resultEl) dom.resultEl.textContent = "TRY AGAIN";
        audio.playLose();
      }
      spinning = false;
      if (dom.spinBtn) dom.spinBtn.disabled = false;
      if (dom.slotEl) dom.slotEl.classList.remove("spinning");
    }, constants.SPIN_DURATION_MS);
  }

  function renderInitial() {
    render(reels);
  }

  function start() {
    if (dom.spinBtn) dom.spinBtn.addEventListener("click", startSpin);
  }

  return { start, renderInitial };
}
