# FlashMint ⚡

AI-powered flashcard generator. Enter any topic and get a set of study cards generated instantly by Gemini — flip them to reveal answers, and pick up right where you left off on your next visit.

![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=flat&logo=vite&logoColor=white)
![CSS](https://img.shields.io/badge/CSS-Vanilla-1572B6?style=flat&logo=css3&logoColor=white)
![Gemini](https://img.shields.io/badge/Gemini-2.5%20Flash-4285F4?style=flat&logo=google&logoColor=white)

## Features

- **AI generation** — sends a prompt to Gemini 2.5 Flash and gets back a JSON array of question/answer pairs
- **3D flip animation** — pure CSS `transform: rotateY()` with `perspective` and `backface-visibility`, no libraries
- **Session persistence** — cards survive page reloads via localStorage, with corruption validation on restore
- **Dynamic card count** — generates between 5 and 10 cards per request to keep sessions varied

## Tech stack

| Layer | Choice |
|---|---|
| Framework | React 19 + Vite |
| Styling | CSS vanilla (no UI library) |
| AI | Gemini 2.5 Flash REST API |
| Persistence | localStorage |
| Deploy | — |

## Architecture

```
src/
├── hooks/
│   └── useFlashcards.js   # All state, API calls, localStorage logic
├── components/
│   ├── FlashcardForm.jsx  # Topic input
│   └── FlashcardViewer.jsx # Card render + flip interaction
└── App.jsx
```

The `useFlashcards` hook centralizes everything: fetching from the API, validating the response structure, persisting to localStorage, and exposing `flip`, `reset`, and `generate` actions to the components.

## Getting started

```bash
git clone https://github.com/Renzo-rifos/FlashMint.git
cd FlashMint
npm install
```

Create a `.env` file in the root:

```
VITE_GEMINI_API_KEY=your_key_here
```

Get a free key at [aistudio.google.com](https://aistudio.google.com) → Create API key in new project.

```bash
npm run dev
```

## Notes

- The `.env` file is gitignored — never commit your API key
- If the API returns a 404, make sure the model string in the hook is exactly `gemini-2.5-flash`
- Vite requires a full restart (`Ctrl+C` + `npm run dev`) to pick up `.env` changes

---

Made by [Ezequiel Rifos](https://linkedin.com/in/rifos-ezequiel)
