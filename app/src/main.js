import { getPalettes, initPalettesIfEmpty } from "./local-storage";
import "./style.css";
import { createNewPalette, handleClicks } from "./dom-helpers";

import { v4 as generateUUID } from "uuid";

const main = () => {
  const newPaletteID = generateUUID();

  // Ordinarily, you'd add these elements to index.html
  const uuidButton = document.createElement("button");
  const uuidText = document.createElement("p");
  document.body.append(uuidButton, uuidText);
  // queueMicrotask;

  uuidButton.textContent = "Generate UUID";

  uuidButton.addEventListener("click", () => {
    const newUUID = generateUUID();
    uuidText.textContent = `your new uuid is: ${newUUID}`;
  });

  uuidButton.remove();
  initPalettesIfEmpty();
  const palettes = getPalettes();
  console.log(palettes);

  Object.values(palettes).forEach(createNewPalette);
};

main();
