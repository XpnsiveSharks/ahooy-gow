import {
  BANNER_BIG_MS,
  BANNER_SMALL_MS,
  CONFETTI_CLEAR_MS,
  CONFETTI_COLORS,
  CONFETTI_COUNT,
} from "./constants.js";

export function setupSettingsPanel(dom) {
  if (dom.settingsBtn && dom.slotEl) {
    dom.settingsBtn.addEventListener("click", () => {
      dom.slotEl.classList.toggle("settings-open");
      const isOpen = dom.slotEl.classList.contains("settings-open");
      dom.settingsBtn.setAttribute("aria-expanded", String(isOpen));
    });
  }

  if (dom.settingsCloseBtn && dom.slotEl && dom.settingsBtn) {
    dom.settingsCloseBtn.addEventListener("click", () => {
      dom.slotEl.classList.remove("settings-open");
      dom.settingsBtn.setAttribute("aria-expanded", "false");
    });
  }

  document.addEventListener("click", (event) => {
    if (!dom.slotEl || !dom.settingsBtn || !dom.audioControlsEl) return;
    if (!dom.slotEl.classList.contains("settings-open")) return;
    const target = event.target;
    if (dom.settingsBtn.contains(target)) return;
    if (dom.audioControlsEl.contains(target)) return;
    dom.slotEl.classList.remove("settings-open");
    dom.settingsBtn.setAttribute("aria-expanded", "false");
  });
}

export function burstConfetti(dom) {
  if (!dom.confettiEl) return;
  dom.confettiEl.innerHTML = "";
  for (let i = 0; i < CONFETTI_COUNT; i++) {
    const piece = document.createElement("span");
    piece.className = "confetti__piece";
    const size = 6 + Math.random() * 6;
    const left = Math.random() * 100;
    const delay = Math.random() * 200;
    const duration = 1200 + Math.random() * 800;
    const hue = CONFETTI_COLORS[i % CONFETTI_COLORS.length];

    piece.style.width = `${size}px`;
    piece.style.height = `${size * 1.6}px`;
    piece.style.left = `${left}vw`;
    piece.style.background = hue;
    piece.style.animationDelay = `${delay}ms`;
    piece.style.animationDuration = `${duration}ms`;
    piece.style.transform = `rotate(${Math.random() * 360}deg)`;
    dom.confettiEl.appendChild(piece);
  }

  setTimeout(() => {
    dom.confettiEl.innerHTML = "";
  }, CONFETTI_CLEAR_MS);
}

export function createBanners(dom) {
  function showBigWinBanner() {
    if (!dom.bigWinBannerEl) return;
    dom.bigWinBannerEl.classList.add("is-active");
    dom.bigWinBannerEl.setAttribute("aria-hidden", "false");
    setTimeout(() => {
      dom.bigWinBannerEl.classList.remove("is-active");
      dom.bigWinBannerEl.setAttribute("aria-hidden", "true");
    }, BANNER_BIG_MS);
  }

  function showSmallWinBanner() {
    if (!dom.smallWinBannerEl) return;
    dom.smallWinBannerEl.classList.add("is-active");
    dom.smallWinBannerEl.setAttribute("aria-hidden", "false");
    setTimeout(() => {
      dom.smallWinBannerEl.classList.remove("is-active");
      dom.smallWinBannerEl.setAttribute("aria-hidden", "true");
    }, BANNER_SMALL_MS);
  }

  return { showBigWinBanner, showSmallWinBanner };
}
