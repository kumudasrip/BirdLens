# BirdLens — Look Closer. Discover More.

> A little window into the world of birds. Discover the birds around you, learn their stories, and turn your outdoor moments into meaningful discoveries.

BirdLens is a nature-focused web application designed to help people explore birdlife through AI-assisted identification, educational bird facts, a personal sighting journal, and outdoor discovery challenges.

Built for the **Hacktoberfest 2026 DEV Challenge — Week 1: Touch Grass**.

**Current status:** 🚧 Under active development

---

## 🌿 About the Project

Birdwatching can be a wonderful way to connect with nature, but identifying unfamiliar birds can be difficult for beginners.

BirdLens aims to make that experience more accessible by combining AI-assisted bird identification with simple educational tools and outdoor activities.

The idea is simple: spend less time scrolling, pay more attention to the world around you, and learn something new about the birds you encounter.

## ✨ Planned Features

- **AI Bird Identification** — Upload a bird photograph and receive possible species matches with confidence scores.
- **Bird Facts** — Learn about a bird's common name, scientific name, habitat, diet, and interesting characteristics.
- **Personal Field Journal** — Keep a collection of bird sightings, photographs, dates, and personal notes.
- **Nature Quests** — Explore your surroundings through short, beginner-friendly birdwatching challenges.
- **Responsive Interface** — Enjoy a clean, accessible experience on desktop, tablet, and mobile.
- **Privacy-Conscious Design** — Avoid unnecessary accounts, tracking, and data collection.

Features are being developed incrementally. See the current implementation status below.

## 🛠️ Tech Stack

### Frontend
- HTML5
- CSS3
- JavaScript
- Bootstrap 5

### Planned AI and Data Components
- An open-weight AI model for bird identification
- A curated bird-facts dataset
- Browser local storage for personal sightings

The final model and inference provider will be documented after evaluation and integration.

## 📍 Current Implementation Status

| Feature | Status |
|---|---|
| Responsive homepage | ✅ Initial version |
| Navigation and page sections | ✅ Implemented |
| Bird photo upload and preview | ✅ Implemented |
| Image type and file-size validation | ✅ Implemented |
| Random nature quests | ✅ Initial version |
| AI-powered bird identification | 🚧 Planned |
| Bird species information | 🚧 Planned |
| Personal field journal | 🚧 Planned |
| Persistent sighting history | 🚧 Planned |
| AI evaluation and testing | 🚧 Planned |

**Important:** The current version previews uploaded photographs but does not yet identify bird species. AI identification will be added in a future iteration.

## 🚀 Getting Started

### Prerequisites

- A modern web browser
- [Git](https://git-scm.com/)
- [Visual Studio Code](https://code.visualstudio.com/) (recommended)

### 1. Clone the repository

```bash
git clone https://github.com/kumudasrip/BirdLens
cd birdlens
```

Replace the placeholder with the actual URL of your GitHub repository.

### 2. Run the website

You can open `index.html` directly in your browser.

For a better development experience, use the Live Server extension in VS Code, or run a simple local server with Node.js:

```bash
npx --yes http-server . -p 5500
```

Open [http://localhost:5500](http://localhost:5500) in your browser.

Stop the server with `Ctrl + C`.

No database or build process is required for the current frontend prototype.

## 📁 Project Structure

```text
birdlens/
├── index.html
├── README.md
├── .gitignore
├── assets/
│   └── images/
├── css/
│   └── styles.css
└── js/
    └── app.js
```

- `index.html` — Main website structure and content.
- `css/styles.css` — Visual design, layout, and responsive styling.
- `js/app.js` — Photo preview, upload validation, and nature quest interactions.
- `assets/images/` — Project-owned visual assets.

The structure will evolve as AI integration and additional features are implemented.

## 🤖 Open-Source AI

BirdLens is being developed around the idea that open-weight AI can make nature discovery more accessible and give developers greater flexibility over the tools they build with.

The planned AI component will be evaluated for identification quality, inference performance, model licensing, and ease of integration.

The final implementation will document:

- The selected model and its license
- How inference is performed
- Whether photographs are sent to a hosted service
- Any associated usage limits or costs
- Known limitations and evaluation results

BirdLens does not currently include an AI inference integration. Claims about identification accuracy, offline operation, or local processing will only be made after they have been implemented and tested.

## 🌳 Why Touch Grass?

Technology can help us understand the world, but it can also keep us looking at screens for longer than we intend.

BirdLens is designed to make the screen a starting point rather than the destination: identify a bird, learn something interesting, and head back outside to notice more.

The goal is not to replace the experience of birdwatching. It is to encourage more people to try it.

## 🗺️ Roadmap

- [x] Create the initial website layout
- [x] Add photo selection and preview
- [x] Add interactive nature quests
- [ ] Evaluate and integrate an open-weight bird identification model
- [ ] Display identification results and bird facts
- [ ] Build a personal sighting journal
- [ ] Add local persistence for saved observations
- [ ] Test identification quality and error handling
- [ ] Improve accessibility and responsive behavior
- [ ] Publish a working demo and document the complete implementation

## 🤝 Contributing

BirdLens is being built as an open-source learning project.

Ideas, bug reports, and constructive feedback are welcome. Once the repository's contribution guidelines are available, please review them before submitting changes.

## 🔒 Privacy

The current prototype does not require an account and does not intentionally upload photographs to an AI service.

The planned identification feature may use hosted inference. Before that feature is released, its data flow and privacy implications will be documented clearly.

## 📜 License

The project's license will be specified in the repository before public release. The licenses of third-party models, datasets, libraries, and visual assets will be documented separately where applicable.

## Project Details

- **Project:** BirdLens
- **Challenge:** Hacktoberfest 2026 — Open-Source AI Challenge, Week 1
- **Theme:** Touch Grass
- **Primary goal:** Encourage outdoor discovery through AI-assisted bird learning

---

*Look closer. Discover more.* 🌿