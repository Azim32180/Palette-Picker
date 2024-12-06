import { v4 as generateUUID } from "uuid";
import { getPalettes, setPalettes } from "./local-storage";

// Function to create new palettes
const createNewPalette = (palette) => {
  // console.log(palette);

  // Creating individual (li) for each palette
  const li = document.createElement("li");
  li.classList.add("palette");

  // li.textContent = palette.title;
  li.dataset.uuid = palette.uuid;

  // Palette container
  const paletteContainer = document.createElement("div");
  paletteContainer.classList.add("paletteContainer");

  // Palette Title
  const paletteTitle = document.createElement("h2");
  paletteTitle.classList.add("title");
  paletteTitle.textContent = palette.title;

  // Creating Color Blocks
  const colorContainers = document.createElement("div");
  colorContainers.classList.add("three-colors");

  // Using .forEach to loop through each color
  palette.colors.forEach((color) => {
    const colorWrapper = document.createElement("div");
    colorWrapper.classList.add("color-button-wrapper");

    const copyButton = document.createElement("button");
    copyButton.classList.add("copy-button");
    copyButton.textContent = `Copy ${color}`;
    copyButton.dataset.color = color;

    const colorBorder = document.createElement("div");
    colorBorder.classList.add("black-white-border");

    const colorExample = document.createElement("div");
    colorExample.classList.add("color-example");
    colorExample.style.backgroundColor = color;

    const colorText = document.createElement("div");
    colorText.classList.add("color-text");
    colorText.innerHTML = `<span style="color: white;">Text </span><span style="color: black;">Example</span>`;

    colorExample.append(colorText);
    colorBorder.append(colorExample);
    colorWrapper.append(colorBorder);
    colorContainers.append(colorWrapper);
    colorContainers.append(copyButton);
    colorWrapper.append(copyButton);
  });

  paletteContainer.append(paletteTitle);
  paletteContainer.append(colorContainers);

  const ul = document.querySelector("#palette-list");

  const deleteButton = document.createElement("button");
  deleteButton.classList.add("delete-button");
  deleteButton.textContent = `Delete Palette`;
  deleteButton.dataset.uuid = palette.uuid;
  paletteContainer.append(deleteButton);
  li.append(paletteContainer);

  const temperature = document.createElement("div");
  temperature.classList.add("color-temperature");
  temperature.textContent = `${palette.temperature}`;
  if (palette.temperature === "neutral") {
    temperature.style.backgroundColor = "grey";
  } else if (palette.temperature === "warm") {
    temperature.style.background = "darkred";
  } else if (palette.temperature === "cool") {
    temperature.style.backgroundColor = "blue";
  }
  li.append(temperature);
  ul.append(li);
};

const handleClicks = async (event) => {
  if (event.target.matches(".copy-button")) {
    const button = event.target;
    const colorHex = button.dataset.color;
    if (!navigator.clipboard) {
      console.error("Clipboard API is NOT available.");
      return;
    }
    try {
      await navigator.clipboard.writeText(colorHex);
      const prevText = button.textContent;
      button.textContent = "Copied hex!";
      setTimeout(() => {
        button.textContent = prevText;
      }, 1000);
    } catch (err) {
      console.error("Failed to copy!", err);
    }
  }
  if (event.target.matches(".delete-button")) {
    console.log(event.target.dataset.uuid);
    removePalette(event.target.dataset.uuid);
  }
};

const removePalette = (uuid) => {
  const palettes = getPalettes();

  if (!palettes || typeof palettes !== "object") {
    console.error("Palettes is not a valid object:", palettes);
    return;
  }

  if (!palettes[uuid]) {
    console.error(`Palette with UUID ${uuid} not found.`);
    return;
  }

  // Remove the palette and save to localSorage
  delete palettes[uuid];
  setPalettes(palettes);

  // Clear and re-render the DOM
  const ul = document.querySelector("#palette-list");
  ul.innerHTML = "";
  Object.values(palettes).forEach(createNewPalette);
};
// Add event listener to the list
document.querySelector("ul").addEventListener("click", handleClicks);

// Adding an event listener for form submission:
const form = document.querySelector("#palette-picker-form");

const createPalette = (event) => {
  event.preventDefault();

  // Getting value from the form inputs
  const paletteTitle = form.querySelector("#palette-title").value;
  const color1 = form.querySelector("#color1").value;
  const color2 = form.querySelector("#color2").value;
  const color3 = form.querySelector("#color3").value;
  const temperatureSetting = form.querySelector(
    'input[name="temperatureSetting"]:checked'
  ).value;

  // Creating a new palette object
  const newPalette = {
    uuid: generateUUID(),
    title: paletteTitle,
    colors: [color1, color2, color3],
    temperature: temperatureSetting,
  };

  // Getting the current palettes from the localStorage
  const storedPalettes = getPalettes() || {};

  // Adding the new palette to the stored palettes object
  storedPalettes[newPalette.uuid] = newPalette;

  // Saving the updated palettes back to localStorage
  setPalettes(storedPalettes);

  // Calling the function tp update the UI with the newly generated palettes
  createNewPalette(newPalette);
};

form.addEventListener("submit", createPalette);

// Export function
export { createNewPalette, handleClicks };
