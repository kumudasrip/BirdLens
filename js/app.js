
import { Client, handle_file } from "https://cdn.jsdelivr.net/npm/@gradio/client/dist/index.min.js";

// ==========================================
// 1. BIRD UPLOAD + AI ELEMENTS
// ==========================================

const birdPhoto = document.getElementById("birdPhoto");
const uploadZone = document.getElementById("uploadZone");
const previewPanel = document.getElementById("previewPanel");
const photoPreview = document.getElementById("photoPreview");
const photoName = document.getElementById("photoName");
const uploadMessage = document.getElementById("uploadMessage");
const removePhoto = document.getElementById("removePhoto");
const identifyButton = document.getElementById("identifyButton");
const identificationResults = document.getElementById("identificationResults");

// ==========================================
// 2. FIELD JOURNAL ELEMENTS
// ==========================================

const sightingDetails = document.getElementById("sightingDetails");
const saveSightingButton = document.getElementById("saveSightingButton");
const journalMessage = document.getElementById("journalMessage");
const sightingDate = document.getElementById("sightingDate");
const sightingLocation = document.getElementById("sightingLocation");
const sightingNotes = document.getElementById("sightingNotes");
const sightingsCollection = document.getElementById("sightingsCollection");
const emptyJournal = document.getElementById("emptyJournal");
const totalSightings = document.getElementById("totalSightings");
const uniqueSpecies = document.getElementById("uniqueSpecies");

// Create the bird-name field dynamically.
// This means index.html does not need to be changed.
const birdNameField = document.createElement("div");
birdNameField.className = "col-12 d-none";
birdNameField.id = "manualBirdNameField";

birdNameField.innerHTML = `
  <label for="manualBirdName" class="form-label">Bird name</label>
  <input
    type="text"
    id="manualBirdName"
    class="form-control"
    maxlength="100"
    placeholder="e.g. Peacock"
    autocomplete="off"
  >
  <p class="small muted mt-1 mb-0" id="manualBirdHelp">
    Enter or edit the bird name before saving your sighting.
  </p>
`;

const sightingFormGrid = sightingDate.closest(".row");

if (sightingFormGrid) {
  sightingFormGrid.prepend(birdNameField);
}

const manualBirdName = document.getElementById("manualBirdName");

// ==========================================
// 3. CONFIGURATION + STATE
// ==========================================

const SPACE_NAME = "ksri33/birdlens-ai";
const JOURNAL_KEY = "birdlens-sightings-v1";

let previewUrl = null;
let gradioClient = null;
let isIdentifying = false;
let currentPredictions = [];
let currentBirdName = "";
let identificationSource = "ai";

sightingDate.value = getLocalDateString();

function getLocalDateString() {
  const now = new Date();
  const offset = now.getTimezoneOffset();

  return new Date(now.getTime() - offset * 60_000)
    .toISOString()
    .slice(0, 10);
}

// ==========================================
// 4. READ SAVED SIGHTINGS
// ==========================================

function getSightings() {
  try {
    const saved = JSON.parse(
      localStorage.getItem(JOURNAL_KEY) || "[]"
    );

    return Array.isArray(saved) ? saved : [];
  } catch (error) {
    console.error("Could not read the BirdLens journal:", error);
    return [];
  }
}

// ==========================================
// 5. DISPLAY THE JOURNAL + COLLECTION
// ==========================================

function renderJournal() {
  const sightings = getSightings();

  totalSightings.textContent = String(sightings.length);

  const species = new Set(
    sightings
      .map((sighting) =>
        String(sighting.birdName || "")
          .trim()
          .toLocaleLowerCase()
      )
      .filter(Boolean)
  );

  uniqueSpecies.textContent = String(species.size);

  emptyJournal.classList.toggle(
    "d-none",
    sightings.length > 0
  );

  sightingsCollection.replaceChildren();

  // Show the newest sightings first.
  [...sightings].reverse().forEach((sighting) => {
    const card = document.createElement("article");
    card.className = "sighting-card";

    // Photo.
    const image = document.createElement("img");
    image.src = sighting.photo;
    image.alt = `Saved sighting of ${sighting.birdName || "a bird"}`;
    image.loading = "lazy";

    card.appendChild(image);

    const body = document.createElement("div");
    body.className = "sighting-card-body";

    // Bird name.
    const title = document.createElement("h3");
    title.textContent = sighting.birdName || "Unknown bird";

    body.appendChild(title);

    // Date.
    const date = document.createElement("p");
    date.className = "sighting-meta";

    date.textContent = sighting.date
      ? new Date(`${sighting.date}T12:00:00`).toLocaleDateString()
      : "Date not recorded";

    body.appendChild(date);

    // Optional location.
    if (sighting.location) {
      const location = document.createElement("p");
      location.className = "sighting-meta";
      location.textContent = `📍 ${sighting.location}`;

      body.appendChild(location);
    }

    // Optional field notes.
    if (sighting.notes) {
      const notes = document.createElement("p");
      notes.className = "sighting-notes";
      notes.textContent = sighting.notes;

      body.appendChild(notes);
    }

    // Distinguish manual entries from AI predictions.
    if (sighting.identificationSource === "manual") {
      const manualNote = document.createElement("p");
      manualNote.className = "sighting-meta";
      manualNote.textContent = "Bird name entered manually";

      body.appendChild(manualNote);
    } else if (
      Array.isArray(sighting.predictions) &&
      sighting.predictions.length > 1
    ) {
      const alternatives = document.createElement("p");
      alternatives.className = "sighting-meta";

      alternatives.textContent =
        `Other possibilities: ${sighting.predictions
          .slice(1, 3)
          .join(", ")}`;

      body.appendChild(alternatives);
    }

    // Delete sighting.
    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.className =
      "btn btn-sm btn-outline-forest sighting-delete";
    removeButton.textContent = "Remove sighting";

    removeButton.setAttribute(
      "aria-label",
      `Remove sighting of ${sighting.birdName || "bird"}`
    );

    removeButton.addEventListener("click", () => {
      const updated = getSightings().filter(
        (item) => item.id !== sighting.id
      );

      try {
        localStorage.setItem(
          JOURNAL_KEY,
          JSON.stringify(updated)
        );

        renderJournal();
      } catch (error) {
        console.error("Could not update the journal:", error);

        journalMessage.textContent =
          "Couldn't remove this sighting. Please try again.";

        journalMessage.className =
          "small mt-2 mb-0 text-danger";
      }
    });

    body.appendChild(removeButton);
    card.appendChild(body);
    sightingsCollection.appendChild(card);
  });
}

// ==========================================
// 6. COMPRESS PHOTOS BEFORE SAVING
// ==========================================

function compressPhoto(image, maxSize = 800, quality = 0.68) {
  if (
    !image.complete ||
    !image.naturalWidth ||
    !image.naturalHeight
  ) {
    throw new Error("The photo preview has not finished loading.");
  }

  const scale = Math.min(
    1,
    maxSize / Math.max(image.naturalWidth, image.naturalHeight)
  );

  const canvas = document.createElement("canvas");

  canvas.width = Math.max(
    1,
    Math.round(image.naturalWidth * scale)
  );

  canvas.height = Math.max(
    1,
    Math.round(image.naturalHeight * scale)
  );

  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Could not process this photo.");
  }

  context.drawImage(
    image,
    0,
    0,
    canvas.width,
    canvas.height
  );

  return canvas.toDataURL("image/jpeg", quality);
}

// ==========================================
// 7. RESET IDENTIFICATION STATE
// ==========================================

function resetCurrentIdentification() {
  currentPredictions = [];
  currentBirdName = "";
  identificationSource = "ai";

  sightingDetails.classList.add("d-none");
  birdNameField.classList.add("d-none");

  manualBirdName.value = "";
  manualBirdName.required = false;

  journalMessage.textContent = "";
  journalMessage.className = "small mt-2 mb-0";
}

// Show the save form when AI identification fails.
// Users must provide their own bird name in this case.
function showManualSaveOption(message) {
  currentPredictions = [];
  currentBirdName = "";
  identificationSource = "manual";

  birdNameField.classList.remove("d-none");

  manualBirdName.required = true;
  manualBirdName.value = "";

  sightingDetails.classList.remove("d-none");

  journalMessage.textContent = message;
  journalMessage.className =
    "small mt-2 mb-0 text-danger";
}

// ==========================================
// 8. DISPLAY AI PREDICTIONS
// ==========================================

function showPredictions(predictionText) {
  identificationResults.replaceChildren();

  const heading = document.createElement("h3");
  heading.className = "h5";
  heading.textContent = "Possible bird species";

  identificationResults.appendChild(heading);

  const lines = predictionText
    .split("\n")
    .filter(
      (line) =>
        line.trim() &&
        !line.trim().startsWith("#")
    );

  currentPredictions = lines
    .map((line) =>
      line
        .replace(/^\s*-\s*/, "")
        .replace(/\*\*/g, "")
        .trim()
    )
    .filter(Boolean);

  currentBirdName =
    currentPredictions[0]
      ?.replace(/\s+[—–-]\s+.*$/, "")
      .trim() || "";

  if (!currentBirdName) {
    throw new Error("No bird prediction was found.");
  }

  identificationSource = "ai";

  // Prefill the name so the user can edit it if necessary.
  manualBirdName.value = currentBirdName;
  manualBirdName.required = false;

  birdNameField.classList.remove("d-none");

  const list = document.createElement("ul");
  list.className = "mt-3";

  currentPredictions.forEach((prediction) => {
    const item = document.createElement("li");
    item.className = "mb-2";
    item.textContent = prediction;

    list.appendChild(item);
  });

  identificationResults.appendChild(list);

  sightingDetails.classList.remove("d-none");

  journalMessage.textContent =
    "You can edit the suggested bird name before saving.";

  journalMessage.className =
    "small mt-2 mb-0 text-success";
}

// ==========================================
// 9. HANDLE PHOTO UPLOAD
// ==========================================

birdPhoto.addEventListener("change", () => {
  const file = birdPhoto.files[0];

  uploadMessage.textContent = "";
  uploadMessage.className = "small mt-3 mb-0";

  identificationResults.replaceChildren();
  resetCurrentIdentification();

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

  if (previewUrl) {
    URL.revokeObjectURL(previewUrl);
  }

  previewUrl = URL.createObjectURL(file);

  photoPreview.src = previewUrl;
  photoName.textContent = file.name;

  previewPanel.classList.remove("d-none");
  uploadZone.classList.add("d-none");

  uploadMessage.textContent =
    "Photo selected! Ready to discover your bird.";

  uploadMessage.classList.add("text-success");
});

// ==========================================
// 10. IDENTIFY THE BIRD USING HUGGING FACE
// ==========================================

identifyButton.addEventListener("click", async () => {
  const file = birdPhoto.files[0];

  if (!file || isIdentifying) return;

  resetCurrentIdentification();

  identificationResults.textContent =
    "Connecting to BirdLens AI. The first request may take a little while.";

  isIdentifying = true;
  identifyButton.disabled = true;
  identifyButton.textContent = "Identifying your bird...";

  try {
    if (!gradioClient) {
      gradioClient = await Client.connect(SPACE_NAME);
    }

    const result = await gradioClient.predict(
      "/identify_bird",
      [handle_file(file)]
    );

    const predictionText = result.data?.[0];

    if (
      typeof predictionText !== "string" ||
      !predictionText.trim()
    ) {
      throw new Error("The AI returned an empty result.");
    }

    showPredictions(predictionText);

    uploadMessage.textContent =
      "Identification complete! Predictions may be incorrect.";

    uploadMessage.className =
      "small mt-3 mb-0 text-success";

  } catch (error) {
    console.error("BirdLens identification error:", error);

    const errorText =
      String(error?.message || error).toLowerCase();

    if (
      errorText.includes("zerogpu") ||
      errorText.includes("quota") ||
      errorText.includes("runs limit")
    ) {
      identificationResults.textContent =
        "Our AI has temporarily reached its free usage limit.";

      showManualSaveOption(
        "AI identification is temporarily unavailable. If you know the bird's name, you can still save this sighting manually."
      );
    } else {
      identificationResults.textContent =
        "We couldn't identify this photo right now. Please check your connection and try again, or save the sighting with a bird name you know.";

      showManualSaveOption(
        "AI identification didn't complete. You can enter a bird name yourself to save this sighting."
      );
    }

    uploadMessage.textContent =
      "Your photo is still selected. Your sighting can be saved without an AI prediction.";

    uploadMessage.className =
      "small mt-3 mb-0 text-danger";

  } finally {
    isIdentifying = false;
    identifyButton.disabled = false;
    identifyButton.textContent = "Identify this bird ↗";
  }
});

// ==========================================
// 11. SAVE A SIGHTING TO THE FIELD JOURNAL
// ==========================================

saveSightingButton.addEventListener("click", () => {
  const enteredName = manualBirdName.value.trim();
  const birdName = enteredName || currentBirdName;

  if (!birdPhoto.files[0]) {
    journalMessage.textContent =
      "Please select a bird photo first.";

    journalMessage.className =
      "small mt-2 mb-0 text-danger";

    return;
  }

  if (!birdName) {
    birdNameField.classList.remove("d-none");
    manualBirdName.required = true;
    manualBirdName.focus();

    journalMessage.textContent =
      "Please enter a bird name before saving.";

    journalMessage.className =
      "small mt-2 mb-0 text-danger";

    return;
  }

  if (!sightingDate.value) {
    journalMessage.textContent =
      "Please select the date you spotted the bird.";

    journalMessage.className =
      "small mt-2 mb-0 text-danger";

    return;
  }

  try {
    const photo = compressPhoto(photoPreview);
    const sightings = getSightings();

    // If the user edits the AI's suggested name, record that honestly.
    const nameWasEdited =
      identificationSource === "ai" &&
      enteredName &&
      enteredName.toLocaleLowerCase() !==
        currentBirdName.toLocaleLowerCase();

    const savedSource =
      identificationSource === "manual" || nameWasEdited
        ? "manual"
        : "ai";

    const sighting = {
      id:
        (crypto.randomUUID && crypto.randomUUID()) ||
        `${Date.now()}-${Math.random().toString(16).slice(2)}`,

      birdName,

      predictions:
        savedSource === "ai"
          ? [...currentPredictions]
          : [],

      identificationSource: savedSource,
      date: sightingDate.value,
      location: sightingLocation.value.trim(),
      notes: sightingNotes.value.trim(),
      photo,
      savedAt: new Date().toISOString()
    };

    sightings.push(sighting);

    localStorage.setItem(
      JOURNAL_KEY,
      JSON.stringify(sightings)
    );

    renderJournal();

    journalMessage.textContent =
      "Your discovery has been saved! 🌿";

    journalMessage.className =
      "small mt-2 mb-0 text-success";

    document.getElementById("journal").scrollIntoView({
      behavior: "smooth",
      block: "start"
    });

  } catch (error) {
    console.error("Could not save sighting:", error);

    journalMessage.textContent =
      "Couldn't save this sighting. Your browser storage may be full. Try a smaller photo or remove older sightings.";

    journalMessage.className =
      "small mt-2 mb-0 text-danger";
  }
});

// ==========================================
// 12. REMOVE THE CURRENT PHOTO
// ==========================================

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

  resetCurrentIdentification();
});

// ==========================================
// 13. NATURE QUESTS
// ==========================================

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
  } while (
    quests.length > 1 &&
    index === lastQuestIndex
  );

  lastQuestIndex = index;

  document.querySelector(".quest-text").textContent =
    quests[index];
});

// ==========================================
// 14. INITIALIZE THE JOURNAL
// ==========================================

renderJournal();