export function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = src;
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
  });
}

export async function loadSymbols() {
  const pigImg = await loadImage("assets/pig.png");
  const multiImg = await loadImage("assets/multichar.png");

  return [
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
      rowIndex: 0,
      colIndex: 0,
    },
    {
      id: "white",
      type: "multiFrame",
      img: multiImg,
      frameW: 32,
      frameH: 32,
      rowIndex: 1,
      colIndex: 0,
    },
    {
      id: "girl",
      type: "multiFrame",
      img: multiImg,
      frameW: 32,
      frameH: 32,
      rowIndex: 2,
      colIndex: 0,
    },
    {
      id: "astronaut",
      type: "multiFrame",
      img: multiImg,
      frameW: 32,
      frameH: 32,
      rowIndex: 3,
      colIndex: 0,
    },
  ];
}
