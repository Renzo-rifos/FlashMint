import { useState, useEffect } from 'react';

// ─── Constants ───────────────────────────────────────────────
const STORAGE_KEY = 'flashcards_data';
const GEMINI_URL =
 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';
// Vite exposes env vars via import.meta.env
// Create a .env file at the project root with: VITE_GEMINI_API_KEY=your_key_here
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// ─── Hook ─────────────────────────────────────────────────────
export function useFlashcards() {
  // ── State ──────────────────────────────────────────────────
  const [flashcards, setFlashcards]     = useState([]);
  const [tema, setTema]                 = useState('');
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped]       = useState(false);

  // ── Restore from localStorage on mount ────────────────────
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;

      const parsed = JSON.parse(raw);

      // Validate structure before restoring
      if (
        parsed &&
        typeof parsed.tema === 'string' &&
        parsed.tema.trim() !== '' &&
        Array.isArray(parsed.flashcards) &&
        parsed.flashcards.length > 0 &&
        parsed.flashcards[0].pregunta &&
        parsed.flashcards[0].respuesta
      ) {
        setFlashcards(parsed.flashcards);
        setTema(parsed.tema);
      }
    } catch {
      // Corrupted storage — silently ignore, show empty form
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  // ── Generate flashcards via Gemini API ────────────────────
  const generateFlashcards = async (inputTema) => {
    if (!API_KEY) {
      setError(
        'No se encontró la API key. Creá un archivo .env en la raíz del proyecto con VITE_GEMINI_API_KEY=tu_key.'
      );
      return;
    }

    setLoading(true);
    setError(null);

    // Random number between 5 and 10, decided before the fetch
    const n = Math.floor(Math.random() * 6) + 5;

    const prompt =
      `Generá ${n} flashcards sobre el tema: ${inputTema}. ` +
      `Respondé ÚNICAMENTE con un array JSON con este formato exacto, ` +
      `sin texto adicional, sin markdown, sin backticks: ` +
      `[{ "pregunta": "...", "respuesta": "..." }]`;

    try {
      const response = await fetch(`${GEMINI_URL}?key=${API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        const message = errorBody?.error?.message || response.statusText;
        throw new Error(`Error de API (${response.status}): ${message}`);
      }

      const data = await response.json();

      // Extract the raw text from Gemini's response shape
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawText) {
        throw new Error('La API no devolvió contenido. Intentá de nuevo.');
      }

      // Strip markdown code fences in case the model adds them despite instructions
      const cleaned = rawText
        .trim()
        .replace(/^```(?:json)?\s*/i, '')
        .replace(/\s*```$/, '')
        .trim();

      // Parse — wrapped in its own try/catch for a clearer error message
      let parsed;
      try {
        parsed = JSON.parse(cleaned);
      } catch {
        throw new Error(
          'La respuesta de la API no es JSON válido. Intentá de nuevo — si el error persiste, simplificá el tema.'
        );
      }

      // Validate: must be a non-empty array with the expected shape
      if (!Array.isArray(parsed) || parsed.length === 0) {
        throw new Error('La API no devolvió flashcards válidas. Probá con otro tema.');
      }

      const validCards = parsed.filter(
        (item) =>
          item &&
          typeof item.pregunta === 'string' &&
          typeof item.respuesta === 'string'
      );

      if (validCards.length === 0) {
        throw new Error(
          'Las flashcards generadas no tienen el formato esperado. Intentá de nuevo.'
        );
      }

      // All good — update state and persist
      setFlashcards(validCards);
      setTema(inputTema);
      setCurrentIndex(0);
      setIsFlipped(false);

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ tema: inputTema, flashcards: validCards })
      );
    } catch (err) {
      setError(err.message || 'Ocurrió un error inesperado. Intentá de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  // ── Navigation ────────────────────────────────────────────
  // Navigation is disabled while the card is flipped (enforced in the component
  // via the disabled prop, but also guarded here defensively).
  const nextCard = () => {
    if (isFlipped) return;
    setCurrentIndex((i) => Math.min(i + 1, flashcards.length - 1));
  };

  const prevCard = () => {
    if (isFlipped) return;
    setCurrentIndex((i) => Math.max(i - 1, 0));
  };

  // ── Flip ──────────────────────────────────────────────────
  const flipCard = () => {
    setIsFlipped((prev) => !prev);
  };

  // ── Reset ─────────────────────────────────────────────────
  const resetAll = () => {
    setFlashcards([]);
    setTema('');
    setCurrentIndex(0);
    setIsFlipped(false);
    setError(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  // ── Public API of the hook ────────────────────────────────
  return {
    // State
    flashcards,
    tema,
    loading,
    error,
    currentIndex,
    isFlipped,
    // Actions
    generateFlashcards,
    nextCard,
    prevCard,
    flipCard,
    resetAll,
  };
}
