import { useState } from 'react';

/**
 * FlashcardForm
 *
 * Props:
 *   onGenerate : (tema: string) => void  — called when the user submits a topic
 *   loading    : boolean                 — disables input + button during fetch
 *   error      : string | null           — shows an error message if present
 *
 * Local state: only the controlled input value.
 * All business logic lives in useFlashcards.
 */
export default function FlashcardForm({ onGenerate, loading, error }) {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = () => {
    const trimmed = inputValue.trim();
    if (!trimmed || loading) return;
    onGenerate(trimmed);
  };

  // Allow submitting with Enter key
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSubmit();
  };

  const canSubmit = inputValue.trim().length > 0 && !loading;

  return (
    <div className="form-container">
      {/* Animated prompt line */}
      <div className="form-prompt">
        <span className="form-prompt-cursor">_</span>
        <p className="form-prompt-text">¿Qué querés aprender hoy?</p>
      </div>

      {/* Input + button */}
      <div className="form-input-group">
        <input
          className="form-input"
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="ej: Segunda Guerra Mundial, fotosíntesis, álgebra lineal..."
          disabled={loading}
          autoFocus
          autoComplete="off"
          spellCheck="false"
        />

        <button
          className="form-button"
          onClick={handleSubmit}
          disabled={!canSubmit}
          aria-label="Generar flashcards"
        >
          {loading ? (
            <span className="button-loading-inner">
              <span className="loading-dots" aria-hidden="true">
                <span />
                <span />
                <span />
              </span>
              generando...
            </span>
          ) : (
            'generar flashcards →'
          )}
        </button>
      </div>

      {/* Error message */}
      {error && (
        <div className="form-error" role="alert">
          <span className="form-error-icon" aria-hidden="true">⚠</span>
          <span>{error}</span>
        </div>
      )}

      {/* Subtle hint */}
      <p className="form-hint">
        se generan entre 5 y 10 flashcards automáticamente
      </p>
    </div>
  );
}
