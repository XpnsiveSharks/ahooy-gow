export function createAudioController(dom) {
  let bgmEnabled = true;
  let sfxEnabled = true;

  function setAllVolumes(value) {
    const volume = Number(value);
    if (dom.bgmEl) dom.bgmEl.volume = volume;
    if (dom.spinSoundEl) dom.spinSoundEl.volume = volume;
    if (dom.bigWinSoundEl) dom.bigWinSoundEl.volume = volume;
    if (dom.smallWinSoundEl) dom.smallWinSoundEl.volume = volume;
    if (dom.loseSoundEl) dom.loseSoundEl.volume = volume;
    if (volume === 0) {
      if (dom.bgmToggleOffEl) dom.bgmToggleOffEl.checked = true;
      if (dom.bgmToggleEl) dom.bgmToggleEl.checked = false;
      bgmEnabled = false;
      if (dom.bgmEl) dom.bgmEl.pause();
      if (dom.sfxToggleOffEl) dom.sfxToggleOffEl.checked = true;
      if (dom.sfxToggleOnEl) dom.sfxToggleOnEl.checked = false;
      sfxEnabled = false;
    } else {
      if (dom.sfxToggleOnEl) dom.sfxToggleOnEl.checked = true;
      if (dom.sfxToggleOffEl) dom.sfxToggleOffEl.checked = false;
      sfxEnabled = true;
    }
  }

  function initFromSlider() {
    if (dom.bgmVolumeEl) setAllVolumes(dom.bgmVolumeEl.value);
  }

  if (dom.bgmVolumeEl) {
    dom.bgmVolumeEl.addEventListener("input", () => {
      setAllVolumes(dom.bgmVolumeEl.value);
    });
  }

  if (dom.bgmToggleEl && dom.bgmToggleOffEl) {
    dom.bgmToggleEl.addEventListener("change", () => {
      bgmEnabled = dom.bgmToggleEl.checked;
      if (!bgmEnabled && dom.bgmEl) dom.bgmEl.pause();
      if (bgmEnabled && dom.bgmEl) dom.bgmEl.play().catch(() => {});
    });
    dom.bgmToggleOffEl.addEventListener("change", () => {
      bgmEnabled = !dom.bgmToggleOffEl.checked;
      if (!bgmEnabled && dom.bgmEl) dom.bgmEl.pause();
    });
  }

  if (dom.sfxToggleOnEl && dom.sfxToggleOffEl) {
    dom.sfxToggleOnEl.addEventListener("change", () => {
      sfxEnabled = dom.sfxToggleOnEl.checked;
    });
    dom.sfxToggleOffEl.addEventListener("change", () => {
      sfxEnabled = !dom.sfxToggleOffEl.checked;
    });
  }

  function ensureBgmOnSpin() {
    if (dom.bgmEl && bgmEnabled && dom.bgmEl.paused) {
      dom.bgmEl.play().catch(() => {});
    }
  }

  function playSpin() {
    if (dom.spinSoundEl && sfxEnabled) {
      dom.spinSoundEl.currentTime = 0;
      dom.spinSoundEl.play().catch(() => {});
    }
  }

  function playBigWin() {
    if (dom.bigWinSoundEl && sfxEnabled) {
      dom.bigWinSoundEl.currentTime = 0;
      dom.bigWinSoundEl.play().catch(() => {});
    }
  }

  function playSmallWin() {
    if (dom.smallWinSoundEl && sfxEnabled) {
      dom.smallWinSoundEl.currentTime = 0;
      dom.smallWinSoundEl.play().catch(() => {});
    }
  }

  function playLose() {
    if (dom.loseSoundEl && sfxEnabled) {
      dom.loseSoundEl.currentTime = 0;
      dom.loseSoundEl.play().catch(() => {});
    }
  }

  return {
    initFromSlider,
    ensureBgmOnSpin,
    playSpin,
    playBigWin,
    playSmallWin,
    playLose,
  };
}
