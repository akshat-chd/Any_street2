# AnyStreet

AnyStreet is a React + Vite animal support platform focused on:

- adoption discovery
- stray or lost-animal reporting
- local support resources
- profile, favorites, applications, and notifications
- AI-assisted guidance for adoption and rescue-related questions

## Stack

- Frontend: React 19 + Vite
- Auth / Database / Storage: Firebase Auth, Firestore, Firebase Storage
- AI backend: Node + Express + Gemini Developer API

## Local setup

### 1. Frontend

```bash
npm install
npm run dev
```

Optional frontend env file:

```bash
cp .env.example .env
```

If you leave the Firebase env vars blank, the app falls back to the checked-in Firebase config.

### 2. AI backend

```bash
cd server
npm install
cp .env.example .env
npm run dev
```

Required backend env vars:

- `GEMINI_API_KEY`
- `GEMINI_MODEL` defaults to `gemini-2.5-flash`
- `PORT` defaults to `8787`
- `CORS_ORIGIN` defaults to your frontend origin

## Firebase

This repo now includes:

- `firebase.json`
- `firestore.rules`
- `firestore.indexes.json`
- `storage.rules`

You still need to:

1. Enable Firestore in the Firebase console for project `anystreet-38d0c`.
2. Enable Firebase Storage.
3. Deploy the Firestore and Storage rules.

## Features added

- Firestore-backed profile, favorites, applications, notifications, and sightings
- Firebase Storage-backed sighting photo uploads
- route-aware AI assistant with adoption and rescue guidance
- improved dashboard and data continuity across sessions

## Notes

- The AI feature is server-side on purpose so your Gemini key does not ship to the browser.
- Sightings remain publicly reportable, so the Firestore and Storage rules reflect that design choice.
