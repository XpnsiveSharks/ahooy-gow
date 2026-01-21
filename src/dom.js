export function getDom() {
  const reelCanvases = [
    document.getElementById("reel1"),
    document.getElementById("reel2"),
    document.getElementById("reel3"),
  ];
  const reelCtx = reelCanvases.map((c) => (c ? c.getContext("2d") : null));
  reelCtx.forEach((ctx) => {
    if (ctx) ctx.imageSmoothingEnabled = false;
  });

  return {
    reelCanvases,
    reelCtx,
    spinBtn: document.getElementById("spinBtn"),
    resultEl: document.getElementById("result"),
    slotEl: document.querySelector(".slot"),
    confettiEl: document.getElementById("confetti"),
    bigWinBannerEl: document.getElementById("bigWinBanner"),
    smallWinBannerEl: document.getElementById("smallWinBanner"),
    settingsBtn: document.getElementById("settingsBtn"),
    settingsCloseBtn: document.getElementById("settingsCloseBtn"),
    audioControlsEl: document.querySelector(".audio-controls"),
    bgmEl: document.getElementById("bgm"),
    spinSoundEl: document.getElementById("spinSound"),
    bigWinSoundEl: document.getElementById("bigWinSound"),
    smallWinSoundEl: document.getElementById("smallWinSound"),
    loseSoundEl: document.getElementById("loseSound"),
    bgmVolumeEl: document.getElementById("bgmVolume"),
    bgmToggleEl: document.getElementById("bgmToggle"),
    bgmToggleOffEl: document.getElementById("bgmToggleOff"),
    sfxToggleOnEl: document.getElementById("sfxToggleOn"),
    sfxToggleOffEl: document.getElementById("sfxToggleOff"),
  };
}
