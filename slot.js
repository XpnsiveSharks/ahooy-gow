const DISPLAY = 64;

const reelCanvases = [
  document.getElementById("reel1"),
  document.getElementById("reel2"),
  document.getElementById("reel3"),
];
const reelCtx = reelCanvases.map((c) => c.getContext("2d"));

reelCtx.forEach((ctx) => (ctx.imageSmoothingEnabled = false));

const spinBtn = document.getElementById("spinBtn");
const resultEl = document.getElementById("result");
const slotEl = document.querySelector(".slot");
const confettiEl = document.getElementById("confetti");
const bigWinBannerEl = document.getElementById("bigWinBanner");
const smallWinBannerEl = document.getElementById("smallWinBanner");
const settingsBtn = document.getElementById("settingsBtn");
const settingsCloseBtn = document.getElementById("settingsCloseBtn");
const bgmEl = document.getElementById("bgm");
const spinSoundEl = document.getElementById("spinSound");
const bigWinSoundEl = document.getElementById("bigWinSound");
const smallWinSoundEl = document.getElementById("smallWinSound");
const loseSoundEl = document.getElementById("loseSound");
const bgmVolumeEl = document.getElementById("bgmVolume");
const bgmToggleEl = document.getElementById("bgmToggle");
const bgmToggleOffEl = document.getElementById("bgmToggleOff");
const sfxToggleOnEl = document.getElementById("sfxToggleOn");
const sfxToggleOffEl = document.getElementById("sfxToggleOff");
const audioControlsEl = document.querySelector(".audio-controls");

const pigImg = await loadImage("assets/pig.png");
const multiImg = await loadImage("assets/multichar.png");

/**
 * @typedef {Object} SymbolDef
 * @property {string} id
 * @property {"frame"|"multiFrame"} type
 * @property {HTMLImageElement} img
 * @property {number} frameW
 * @property {number} frameH
 * @property {number} [frameIndex]
 * @property {number} [rowIndex]
 * @property {number} [colIndex]
 */

/** @type {SymbolDef[]} */
const symbols = [
  {
    id: "pig",
    type: "frame",
    img: pigImg,
    frameW: 32,
    frameH: 32,
    frameIndex: 0,
  },
  {
    id: "shirtless",
    type: "multiFrame",
    img: multiImg,
    frameW: 32,
    frameH: 32,
    rowIndex: 0, // row 1
    colIndex: 0, // first frame
  },
  {
    id: "white",
    type: "multiFrame",
    img: multiImg,
    frameW: 32,
    frameH: 32,
    rowIndex: 1, // row 2
    colIndex: 0,
  },
  {
    id: "girl",
    type: "multiFrame",
    img: multiImg,
    frameW: 32,
    frameH: 32,
    rowIndex: 2, // row 3
    colIndex: 0,
  },
  {
    id: "astronaut",
    type: "multiFrame",
    img: multiImg,
    frameW: 32,
    frameH: 32,
    rowIndex: 3, // row 4
    colIndex: 0,
  },
];

let reels = [0, 0, 0];
let spinning = false;
let spinIntervalId = null;
let bgmEnabled = true;
let sfxEnabled = true;

function setAllVolumes(value) {
  const volume = Number(value);
  if (bgmEl) bgmEl.volume = volume;
  if (spinSoundEl) spinSoundEl.volume = volume;
  if (bigWinSoundEl) bigWinSoundEl.volume = volume;
  if (smallWinSoundEl) smallWinSoundEl.volume = volume;
  if (loseSoundEl) loseSoundEl.volume = volume;
  if (volume === 0) {
    if (bgmToggleOffEl) bgmToggleOffEl.checked = true;
    if (bgmToggleEl) bgmToggleEl.checked = false;
    bgmEnabled = false;
    if (bgmEl) bgmEl.pause();
    if (sfxToggleOffEl) sfxToggleOffEl.checked = true;
    if (sfxToggleOnEl) sfxToggleOnEl.checked = false;
    sfxEnabled = false;
  } else {
    if (sfxToggleOnEl) sfxToggleOnEl.checked = true;
    if (sfxToggleOffEl) sfxToggleOffEl.checked = false;
    sfxEnabled = true;
  }
}

if (bgmVolumeEl) setAllVolumes(bgmVolumeEl.value);

if (settingsBtn && slotEl) {
  settingsBtn.addEventListener("click", () => {
    slotEl.classList.toggle("settings-open");
    const isOpen = slotEl.classList.contains("settings-open");
    settingsBtn.setAttribute("aria-expanded", String(isOpen));
  });
}

if (settingsCloseBtn && slotEl && settingsBtn) {
  settingsCloseBtn.addEventListener("click", () => {
    slotEl.classList.remove("settings-open");
    settingsBtn.setAttribute("aria-expanded", "false");
  });
}

document.addEventListener("click", (event) => {
  if (!slotEl || !settingsBtn || !audioControlsEl) return;
  if (!slotEl.classList.contains("settings-open")) return;
  const target = event.target;
  if (settingsBtn.contains(target)) return;
  if (audioControlsEl.contains(target)) return;
  slotEl.classList.remove("settings-open");
  settingsBtn.setAttribute("aria-expanded", "false");
});

if (bgmVolumeEl) {
  bgmVolumeEl.addEventListener("input", () => {
    setAllVolumes(bgmVolumeEl.value);
  });
}

if (bgmToggleEl && bgmToggleOffEl) {
  bgmToggleEl.addEventListener("change", () => {
    bgmEnabled = bgmToggleEl.checked;
    if (!bgmEnabled && bgmEl) bgmEl.pause();
    if (bgmEnabled && bgmEl) bgmEl.play().catch(() => {});
  });
  bgmToggleOffEl.addEventListener("change", () => {
    bgmEnabled = !bgmToggleOffEl.checked;
    if (!bgmEnabled && bgmEl) bgmEl.pause();
  });
}

if (sfxToggleOnEl && sfxToggleOffEl) {
  sfxToggleOnEl.addEventListener("change", () => {
    sfxEnabled = sfxToggleOnEl.checked;
  });
  sfxToggleOffEl.addEventListener("change", () => {
    sfxEnabled = !sfxToggleOffEl.checked;
  });
}

/**
 * Draw a single symbol into a reel canvas.
 * @param {CanvasRenderingContext2D} ctx
 * @param {SymbolDef} sym
 */
function drawSymbol(ctx, sym) {
  ctx.clearRect(0, 0, DISPLAY, DISPLAY);
  if (sym.type === "frame") {
    const sx = sym.frameIndex * sym.frameW;
    const sy = 0;

    ctx.drawImage(
      sym.img,
      sx,
      sy,
      sym.frameW,
      sym.frameH,
      0,
      0,
      DISPLAY,
      DISPLAY,
    );
    return;
  }

  if (sym.type === "multiFrame") {
    const COLUMNS = 5;
    const sx = sym.colIndex * sym.frameW;
    const sy = sym.rowIndex * sym.frameH;

    ctx.drawImage(
      sym.img,
      sx,
      sy,
      sym.frameW,
      sym.frameH,
      0,
      0,
      DISPLAY,
      DISPLAY,
    );
    return;
  }

  ctx.fillStyle = sym.color;
  ctx.fillRect(0, 0, DISPLAY, DISPLAY);
}

/**
 * Render the current reels to the canvases.
 */
function render() {
  for (let i = 0; i < 3; i++) {
    drawSymbol(reelCtx[i], symbols[reels[i]]);
  }
}

/**
 * Pick a random symbol index.
 * @returns {number}
 */
function randSymbolIndex() {
  return Math.floor(Math.random() * symbols.length);
}

spinBtn.addEventListener("click", () => {
  if (spinning) return;
  spinning = true;
  resultEl.textContent = "here we go";
  spinBtn.disabled = true;
  if (slotEl) slotEl.classList.add("spinning");
  if (bgmEl && bgmEnabled && bgmEl.paused) bgmEl.play().catch(() => {});
  if (spinSoundEl && sfxEnabled) {
    spinSoundEl.currentTime = 0;
    spinSoundEl.play().catch(() => {});
  }

  spinIntervalId = setInterval(() => {
    reels = [randSymbolIndex(), randSymbolIndex(), randSymbolIndex()];
    render();
  }, 100);

  setTimeout(() => {
    clearInterval(spinIntervalId);
    spinIntervalId = null;
    reels = [randSymbolIndex(), randSymbolIndex(), randSymbolIndex()];
    render();
    const [a, b, c] = reels;
    if (a === b && b === c) {
      resultEl.textContent = "BIG WIN!";
      showBigWinBanner();
      burstConfetti();
      if (bigWinSoundEl && sfxEnabled) {
        bigWinSoundEl.currentTime = 0;
        bigWinSoundEl.play().catch(() => {});
      }
    }
    else if (a === b || a === c || b === c) {
      resultEl.textContent = "SMALL WIN!";
      showSmallWinBanner();
      if (smallWinSoundEl && sfxEnabled) {
        smallWinSoundEl.currentTime = 0;
        smallWinSoundEl.play().catch(() => {});
      }
    }
    else {
      resultEl.textContent = "TRY AGAIN";
      if (loseSoundEl && sfxEnabled) {
        loseSoundEl.currentTime = 0;
        loseSoundEl.play().catch(() => {});
      }
    }
    spinning = false;
    spinBtn.disabled = false;
    if (slotEl) slotEl.classList.remove("spinning");
  }, 3500);
});

render();

/**
 * Create a confetti burst for a big win.
 */
function burstConfetti() {
  if (!confettiEl) return;
  confettiEl.innerHTML = "";
  const colors = ["#00f0ff", "#ff3df2", "#57ff7c", "#ffe66b", "#7ef9ff"];
  const count = 60;
  for (let i = 0; i < count; i++) {
    const piece = document.createElement("span");
    piece.className = "confetti__piece";
    const size = 6 + Math.random() * 6;
    const left = Math.random() * 100;
    const delay = Math.random() * 200;
    const duration = 1200 + Math.random() * 800;
    const hue = colors[i % colors.length];

    piece.style.width = `${size}px`;
    piece.style.height = `${size * 1.6}px`;
    piece.style.left = `${left}vw`;
    piece.style.background = hue;
    piece.style.animationDelay = `${delay}ms`;
    piece.style.animationDuration = `${duration}ms`;
    piece.style.transform = `rotate(${Math.random() * 360}deg)`;
    confettiEl.appendChild(piece);
  }

  setTimeout(() => {
    confettiEl.innerHTML = "";
  }, 2200);
}

/**
 * Show the big win banner briefly.
 */
function showBigWinBanner() {
  if (!bigWinBannerEl) return;
  bigWinBannerEl.classList.add("is-active");
  bigWinBannerEl.setAttribute("aria-hidden", "false");
  setTimeout(() => {
    bigWinBannerEl.classList.remove("is-active");
    bigWinBannerEl.setAttribute("aria-hidden", "true");
  }, 1600);
}

/**
 * Show the small win banner briefly.
 */
function showSmallWinBanner() {
  if (!smallWinBannerEl) return;
  smallWinBannerEl.classList.add("is-active");
  smallWinBannerEl.setAttribute("aria-hidden", "false");
  setTimeout(() => {
    smallWinBannerEl.classList.remove("is-active");
    smallWinBannerEl.setAttribute("aria-hidden", "true");
  }, 1200);
}

/**
 * Load an image and resolve when it is ready.
 * @param {string} src
 * @returns {Promise<HTMLImageElement>}
 */
function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = src;
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
  });
}
