# RECLAIM: Take Back Your Time

**RECLAIM: Take Back Your Time** is a mobile-first digital wellbeing web application designed to help individuals regain control over mindless scrolling and empower families to build healthier, sustainable digital habits together.

---

## Core Features

1. **Welcome Screen**: Choose between **Personal Mode** and **Family Shield**, with clear privacy transparency (`Powered by Gemini`).
2. **Personal Mode**: Set a daily scrolling goal in minutes and manually log scrolling sessions with an accessible progress bar. All self-reported usage is saved in `localStorage` and clearly labelled **"Entered by you"**.
3. **Pause and Reflect (3 Steps)**:
   - **Step 1**: Identify how you are feeling right now (*Bored, Stressed, Lonely, Tired, Just habit*).
   - **Step 2**: Receive a short, kind reflection from Gemini tailored to your mood, time of day, and daily goal progress.
   - **Step 3**: Choose to *Continue*, *Take a 5-minute break* (with an interactive breathing timer), or *Try an activity*. Mood triggers are logged to power the dashboard chart.
4. **AI Activity Coach**: Server-side Gemini generates structured JSON suggestions (`activity`, `duration_minutes`, `why`) based on your goal and available time, complete with a **Regenerate** button and a built-in fallback list of 10 offline activities if Gemini is unreachable.
5. **Voice Nudges (On-Device IndexedDB)**: Record up to 30-second voice reminders from *Mom, Dad, Friend, Teacher,* or *Me* using `MediaRecorder`. Play back, re-record, rename, or delete recordings. When logged time passes your daily goal or when you tap *Pause and Reflect*, a voice nudge card (*"A message from Mom"*) appears with a Play button and speaker selector. Voice recordings stay strictly on your device in `IndexedDB` and are never uploaded or sent to AI.
6. **13 Languages**: Built-in interface translations for **English, Tamil, Hindi, Kannada, Telugu, and Malayalam**, plus server-side Gemini translation for **Spanish, Italian, German, Korean, Chinese, Japanese, and Filipino** (and dynamic reflections/coach cards), with automatic English fallback.
7. **Progress Dashboard**: Track time reclaimed, breaks completed, daily goal status, a 7-day **Weekly Summary** card, and the **"What triggers my scrolling"** mood bar chart. Includes **Load demo data** (clearly labelled *"Sample data"*) and **Clear all data**.
8. **Family Shield**: Includes a parent-friendly **Google Family Link** setup checklist and an interactive **Family Pact** builder where parents and children choose shared boundaries together. Clearly states that RECLAIM does not block, monitor, or control other apps.

---

## Privacy & Trust Architecture

- **Server-Side API Key Security**: Every Gemini API call runs on the Node/Express server (`server.ts`). `GEMINI_API_KEY` is read exclusively from `process.env.GEMINI_API_KEY` on the server and is never exposed in client code.
- **On-Device Storage**: Scrolling logs, preferences, and family pacts stay in browser `localStorage`. Voice recordings stay in browser `IndexedDB` and are never uploaded or sent to AI. Only mood, goal text, and translation strings are sent to Gemini through the server.

---

## Local Development

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment variables**:
   Copy `.env.example` to `.env` and set your `GEMINI_API_KEY`:
   ```bash
   cp .env.example .env
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

---

## Deploying to Google Cloud Run

### Prerequisites
- [Google Cloud SDK (`gcloud`)](https://cloud.google.com/sdk/docs/install) installed and initialized.
- A Google Cloud Project with billing enabled.
- A Gemini API Key from Google AI Studio.

### Exact Cloud Run Deployment Steps

1. **Authenticate and select your Google Cloud project**:
   ```bash
   gcloud auth login
   gcloud config set project YOUR_PROJECT_ID
   ```

2. **Enable required Google Cloud APIs**:
   ```bash
   gcloud services enable run.googleapis.com cloudbuild.googleapis.com artifactregistry.googleapis.com
   ```

3. **Build and deploy directly from source to Cloud Run**:
   ```bash
   gcloud run deploy reclaim-web-app \
     --source . \
     --region us-central1 \
     --platform managed \
     --allow-unauthenticated \
     --set-env-vars="GEMINI_API_KEY=YOUR_ACTUAL_GEMINI_API_KEY,NODE_ENV=production"
   ```

4. **Access your deployed web app**:
   Once complete, `gcloud` prints your live HTTPS service URL (`https://reclaim-web-app-xxxx.a.run.app`). Open it on any Android or desktop browser.
