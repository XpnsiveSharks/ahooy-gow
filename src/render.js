export function drawSymbol(ctx, sym, displaySize) {
  ctx.clearRect(0, 0, displaySize, displaySize);
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
      displaySize,
      displaySize,
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
      displaySize,
      displaySize,
    );
    return;
  }

  ctx.fillStyle = sym.color;
  ctx.fillRect(0, 0, displaySize, displaySize);
}

export function renderReels(reelCtx, symbols, reels, displaySize) {
  for (let i = 0; i < 3; i++) {
    if (reelCtx[i]) drawSymbol(reelCtx[i], symbols[reels[i]], displaySize);
  }
}
