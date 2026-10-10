# BirdLens — Look Closer. Discover More.

> A little window into the world of birds. Discover the birds around you, learn their stories, and turn your outdoor moments into meaningful discoveries.

**BirdLens** is a nature-focused web application that helps people explore birdlife through AI-assisted bird identification, a personal field journal, and outdoor discovery challenges.

Built for **Hacktoberfest 2026 — DEV Challenge, Week 1: Touch Grass**.

<p align="center">
  <a href="https://birdlens-7vm7.onrender.com/">
    <strong>🌿 Explore the Live Demo</strong>
  </a>
  &nbsp; · &nbsp;
  <a href="https://github.com/kumudasrip/BirdLens">
    <strong>💻 View on GitHub</strong>
  </a>
</p>

---

## 🌱 About BirdLens

Birdwatching is a simple way to connect with nature, but identifying an unfamiliar bird can be challenging for beginners.

BirdLens makes that first step easier. Upload a bird photograph, explore the AI's possible species matches, and save your discovery in a personal field journal.

The goal is simple: use technology to encourage curiosity about the natural world, spend more time observing your surroundings, and turn everyday outdoor moments into meaningful discoveries.

## ✨ Features

### 🔍 AI-Powered Bird Identification
- Upload a bird photograph in JPG, PNG, or WebP format.
- Receive up to five possible bird species matches with model scores.
- View the identification results directly on the website.
- Edit the bird name before saving a sighting.
- Enter a bird name manually if AI identification is temporarily unavailable.

### 📖 Personal Field Journal
- Save bird sightings with a photograph, bird name, and date.
- Add an optional location and personal field notes.
- View saved sightings in a responsive card-based layout.
- Track the total number of sightings and different species.
- Remove sightings when they are no longer needed.

Journal entries are stored in the browser using local storage. No account or database is required.

### 🌿 Nature Quests
- Explore short, beginner-friendly outdoor challenges.
- Generate another quest whenever you want a fresh activity.
- Use the prompts to notice bird behaviour, habitats, sounds, and movement.

### 📱 Responsive Interface
- A clean, nature-inspired visual design.
- Responsive layouts for desktop, tablet, and mobile screens.
- Image previews before identification.
- File-type and file-size validation.
- Graceful error handling and a manual-entry fallback.

---

## 🖥️ Live Demo

**Try BirdLens:** https://birdlens-7vm7.onrender.com/

The live application is deployed on Render. AI identification depends on the availability and usage limits of the Hugging Face Space, so predictions may occasionally be unavailable.

## 📸 Screenshots

<img width="2270" height="1208" alt="image" src="https://github.com/user-attachments/assets/56ff66cb-694a-4e40-957e-b6ba26c43e5b" />
<img width="2184" height="1214" alt="image" src="https://github.com/user-attachments/assets/35547824-44d6-4866-8d6f-9af57e4574ca" />
<img width="2264" height="1248" alt="image" src="https://github.com/user-attachments/assets/1311b352-558d-4ffa-98c8-5387e52611b7" />
<img width="2142" height="1248" alt="image" src="https://github.com/user-attachments/assets/e9829f99-5814-478e-b17b-971de7c9cfbf" />
<img width="2176" height="1242" alt="image" src="https://github.com/user-attachments/assets/6d9db935-0649-4d9c-aac6-dfb141b35808" />


---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| HTML5 | Website structure |
| CSS3 | Styling, responsive layouts, and visual design |
| JavaScript | Frontend interactions and journal functionality |
| Bootstrap 5 | Responsive layout utilities and components |
| Python | Backend development |
| Flask | Website serving and API endpoints |
| Gradio Client | Communication with the hosted AI model |
| Hugging Face Spaces | Hosted bird-identification inference |
| Browser local storage | Persistent sightings in the current browser |
| Render | Web application deployment |

### AI Model

BirdLens currently uses the following image-classification model:

**[`prithivMLmods/Bird-Species-Classifier-526`](https://huggingface.co/prithivMLmods/Bird-Species-Classifier-526)**

The model is accessed through the public Hugging Face Space:

**[`ksri33/birdlens-ai`](https://huggingface.co/spaces/ksri33/birdlens-ai)**

The model returns possible species matches and associated scores. These scores should not be interpreted as guaranteed probabilities of correct identification.

---

## ⚙️ How It Works

1. **Upload:** The user selects a bird photograph.
2. **Send:** The frontend sends the image to the Flask backend.
3. **Identify:** The backend forwards the image to the Hugging Face Space using the Gradio Client.
4. **Display:** The backend returns the model's results to the frontend.
5. **Save:** The user saves the sighting, including its bird name, date, location, and notes.
6. **Remember:** The journal stores sightings in the browser's local storage.

```text
User uploads a bird photo
          │
          ▼
    BirdLens Frontend
     HTML / CSS / JS
          │
          ▼
      Flask Backend
       /api/identify
          │
          ▼
   Hugging Face Space
     Bird Classifier
          │
          ▼
    Model Predictions
          │
          ▼
   Results displayed
          │
          ▼
  Optional journal entry
     Browser storage
```

The AI integration uses a backend so the Hugging Face token can be configured as a private server-side environment variable rather than embedded in frontend JavaScript.

---

## 🚀 Getting Started

### Prerequisites

- Python 3.10 or a compatible Python version
- Git
- A modern web browser
- A Hugging Face account and token if authentication is required for your inference usage

### 1. Clone the repository

```bash
git clone https://github.com/kumudasrip/BirdLens.git
cd BirdLens
```

### 2. Create a virtual environment

**Windows:**

```bash
python -m venv venv
venv\Scripts\activate
```

**macOS / Linux:**

```bash
python -m venv venv
source venv/bin/activate
```

### 3. Install dependencies

```bash
python -m pip install -r requirements.txt
```

### 4. Configure Hugging Face authentication

If you need authenticated inference, create a token in your [Hugging Face token settings](https://huggingface.co/settings/tokens).

Set it as an environment variable. Do not put the token in `app.js`, `index.html`, or a committed file.

**Windows Command Prompt:**

```cmd
set HF_TOKEN=hf_your_token_here
```

**PowerShell:**

```powershell
$env:HF_TOKEN="hf_your_token_here"
```

**macOS / Linux:**

```bash
export HF_TOKEN=hf_your_token_here
```

Replace the example value with your actual token. These commands configure the variable for the current terminal session.

### 5. Run the application

```bash
python app.py
```

Open the local website:

**http://127.0.0.1:5000/**

To check whether the backend is running, visit:

**http://127.0.0.1:5000/api/health**

The health endpoint should return a JSON response indicating that the backend is running.

Press `Ctrl + C` in the terminal to stop the development server.

---

## 📁 Project Structure

```text
BirdLens/
├── app.py
├── requirements.txt
├── render.yaml
├── index.html
├── README.md
├── .gitignore
├── assets/
│   └── images/
│       └── logo.png
├── css/
│   └── styles.css
├── js/
│   └── app.js
└── 
```

- `app.py` — Flask application, API endpoints, and Hugging Face inference requests.
- `requirements.txt` — Python dependencies.
- `render.yaml` — Render deployment configuration.
- `index.html` — Main website structure and content.
- `css/styles.css` — Styling, responsive layouts, and visual design.
- `js/app.js` — Photo upload, identification interactions, journal management, and nature quests.
- `assets/images/` — Project logo and other visual assets.

---

## 🔒 Privacy and Data Handling

BirdLens does not require users to create an account.

- **Photographs:** Images selected for identification are sent to the BirdLens backend and forwarded to the hosted Hugging Face Space for inference.
- **Field journal:** Saved sightings, including compressed photographs, are stored in browser local storage on the current device.
- **No cloud journal sync:** Journal entries are not automatically synchronized between browsers or devices.
- **Authentication:** The Hugging Face token is intended to remain server-side as an environment variable.
- **Third-party services:** Identification depends on the availability and policies of the hosted inference service.

Avoid uploading photographs containing sensitive information. Clearing browser storage or changing devices may make locally saved sightings unavailable.

---

## ⚠️ Limitations

- AI predictions may be incorrect, especially for blurry photographs, unusual angles, or visually similar species.
- Model scores are not guarantees of identification accuracy.
- Hugging Face inference may be affected by usage quotas, rate limits, cold starts, or temporary service failures.
- The manual-entry fallback allows a sighting to be saved even when identification fails.
- Saved journal entries are local to the current browser and device.
- Bird facts and additional educational content may be expanded in future versions.

---

## 🗺️ Roadmap

- [x] Build the responsive website and navigation.
- [x] Add bird-photo selection, preview, and validation.
- [x] Integrate AI-powered bird identification.
- [x] Connect the frontend to a Flask backend.
- [x] Add graceful AI error handling and manual-entry fallback.
- [x] Build the personal field journal using browser local storage.
- [x] Add sighting counts and species counts.
- [x] Add interactive nature quests.
- [x] Deploy the application on Render.
- [x] Add a responsive card layout for saved sightings.
- [ ] Expand bird facts and educational species information.
- [ ] Evaluate identification quality across a wider variety of birds.
- [ ] Improve accessibility and continue refining the mobile experience.

---

## 🌳 Why Touch Grass?

Technology can help us understand the world, but it can also keep us looking at screens for longer than we intend.

BirdLens makes the screen a starting point rather than the destination: identify a bird, learn something interesting, and head back outside to notice more.

The goal is not to replace birdwatching. It is to encourage more people to experience it.

---

## 📜 License

BirdLens is licensed under the [MIT License](LICENSE).

You are free to use, modify, and distribute the project's code under the terms of the license.

**Note:** This license applies to BirdLens's own code. Third-party models, libraries, datasets, fonts, and visual assets may have separate license terms. Please review their respective licenses before using or redistributing them.

---

## Project Details

- **Project:** BirdLens
- **Challenge:** Hacktoberfest 2026 — DEV Challenge, Week 1
- **Theme:** Touch Grass
- **Live demo:** https://birdlens-7vm7.onrender.com/
- **Repository:** https://github.com/kumudasrip/BirdLens/

---

*Look closer. Discover more.* 🌿
