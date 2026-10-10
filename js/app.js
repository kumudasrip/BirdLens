
const birdPhoto = document.getElementById("birdPhoto");
const uploadZone = document.getElementById("uploadZone");
const previewPanel = document.getElementById("previewPanel");
const photoPreview = document.getElementById("photoPreview");
const photoName = document.getElementById("photoName");
const uploadMessage = document.getElementById("uploadMessage");
const removePhoto = document.getElementById("removePhoto");

let previewUrl = null;

birdPhoto.addEventListener("change", () => {
  const file = birdPhoto.files[0];

  uploadMessage.textContent = "";
  uploadMessage.className = "small mt-3 mb-0";

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
    "Photo selected! AI identification will be added next.";
  uploadMessage.classList.add("text-success");
});

removePhoto.addEventListener("click", () => {
  birdPhoto.value = "";

  if (previewUrl) {
    URL.revokeObjectURL(previewUrl);
    previewUrl = null;
  }

  photoPreview.removeAttribute("src");
  previewPanel.classList.add("d-none");
  uploadZone.classList.remove("d-none");
  uploadMessage.textContent = "";
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
