
import { Client, handle_file } from "https://cdn.jsdelivr.net/npm/@gradio/client/dist/index.min.js";

const birdPhoto = document.getElementById("birdPhoto");
const uploadZone = document.getElementById("uploadZone");
const previewPanel = document.getElementById("previewPanel");
const photoPreview = document.getElementById("photoPreview");
const photoName = document.getElementById("photoName");
const uploadMessage = document.getElementById("uploadMessage");
const removePhoto = document.getElementById("removePhoto");
const identifyButton = document.getElementById("identifyButton");
const identificationResults = document.getElementById("identificationResults");

const SPACE_NAME = "ksri33/birdlens-ai";

let previewUrl = null;
let gradioClient = null;
let isIdentifying = false;

birdPhoto.addEventListener("change", () => {
  const file = birdPhoto.files[0];

  uploadMessage.textContent = "";
  uploadMessage.className = "small mt-3 mb-0";
  identificationResults.replaceChildren();

  if (!file) return;

  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp"
  ];

  if (!allowedTypes.includes(file.type)) {
    uploadMessage.textContent =
      "Please choose a JPG, PNG, or WEBP image.";
    uploadMessage.classList.add("text-danger");
    birdPhoto.value = "";
    return;
  }

  if (file.size > 10 * 1024 * 1024) {
    uploadMessage.textContent =
      "That image is too large. Please choose one under 10 MB.";
    uploadMessage.classList.add("text-danger");
    birdPhoto.value = "";
    return;
  }

  if (previewUrl) URL.revokeObjectURL(previewUrl);

  previewUrl = URL.createObjectURL(file);
  photoPreview.src = previewUrl;
  photoName.textContent = file.name;

  previewPanel.classList.remove("d-none");
  uploadZone.classList.add("d-none");

  uploadMessage.textContent =
    "Photo selected! Ready to discover your bird.";
  uploadMessage.classList.add("text-success");
});

identifyButton.addEventListener("click", async () => {
  const file = birdPhoto.files[0];

  if (!file || isIdentifying) return;

  isIdentifying = true;
  identifyButton.disabled = true;
  identifyButton.textContent = "Identifying your bird...";
  identificationResults.textContent =
    "Connecting to BirdLens AI. The first request may take a little while.";

  try {
    if (!gradioClient) {
      gradioClient = await Client.connect(SPACE_NAME);
    }

    const result = await gradioClient.predict("/identify_bird", [
      handle_file(file)
    ]);

    const predictionText = result.data?.[0];

    if (typeof predictionText !== "string" || !predictionText.trim()) {
      throw new Error("The AI returned an empty result.");
    }

    // Render the model's Markdown as text, not executable HTML.
    identificationResults.replaceChildren();

    const heading = document.createElement("h3");
    heading.className = "h5";
    heading.textContent = "Possible bird species";
    identificationResults.appendChild(heading);

    const lines = predictionText
      .split("\n")
      .filter(line => line.trim() && !line.startsWith("#"));

    const list = document.createElement("ul");
    list.className = "mt-3";

    lines.forEach(line => {
      const item = document.createElement("li");
      item.className = "mb-2";
      item.textContent = line.replace(/^\s*-\s*/, "")
        .replace(/\*\*/g, "");
      list.appendChild(item);
    });

    identificationResults.appendChild(list);

    uploadMessage.textContent =
      "Identification complete! Predictions may be incorrect.";
    uploadMessage.className = "small mt-3 mb-0 text-success";

  } catch (error) {
    console.error("BirdLens identification error:", error);

    identificationResults.textContent =
      "We couldn't identify this photo right now. Please try again in a moment.";

    uploadMessage.textContent =
      "Check your internet connection or try again shortly.";
    uploadMessage.className = "small mt-3 mb-0 text-danger";
  } finally {
    isIdentifying = false;
    identifyButton.disabled = false;
    identifyButton.textContent = "Identify this bird ↗";
  }
});

removePhoto.addEventListener("click", () => {
  if (isIdentifying) return;

  birdPhoto.value = "";

  if (previewUrl) {
    URL.revokeObjectURL(previewUrl);
    previewUrl = null;
  }

  photoPreview.removeAttribute("src");
  previewPanel.classList.add("d-none");
  uploadZone.classList.remove("d-none");
  uploadMessage.textContent = "";
  identificationResults.replaceChildren();
});

const quests = [
  "Find a quiet spot and observe three birds. Notice how each one moves.",
  "Listen carefully for two minutes. Can you distinguish different bird calls?",
  "Look for a bird perched at different heights. Where does it prefer to rest?",
  "Observe how a bird searches for food without approaching or disturbing it.",
  "Find a safe place to watch the sky. Notice the different ways birds fly."
];

let lastQuestIndex = -1;

document.getElementById("newQuest").addEventListener("click", () => {
  let index;

  do {
    index = Math.floor(Math.random() * quests.length);
  } while (quests.length > 1 && index === lastQuestIndex);

  lastQuestIndex = index;
  document.querySelector(".quest-text").textContent = quests[index];
});