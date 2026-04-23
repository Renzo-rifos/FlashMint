/**
 * FlashcardViewer
 *
 * Props:
 *   flashcards   : Array<{ pregunta: string, respuesta: string }>
 *   tema         : string                  — displayed as context label
 *   currentIndex : number                  — which card we're on
 *   isFlipped    : boolean                 — whether the card is showing its back
 *   onFlip       : () => void              — toggle flip
 *   onNext       : () => void              — advance to next card
 *   onPrev       : () => void              — go to previous card
 *   onReset      : () => void              — clear everything, back to form
 *
 * This component is stateless — it only renders what it receives.
 * All logic lives in useFlashcards.
 */
export default function FlashcardViewer({
  flashcards,
  tema,
  currentIndex,
  isFlipped,
  onFlip,
  onNext,
  onPrev,
  onReset,
}) {
  const card  = flashcards[currentIndex];
  const total = flashcards.length;
  const isFirst = currentIndex === 0;
  const isLast  = currentIndex === total - 1;

  // Navigation is disabled while the card is flipped so the user
  // is forced to see the answer before moving on.
  const navDisabled = isFlipped;

  // Zero-pad numbers for the counter display
  const pad = (n) => String(n).padStart(2, '0');

  return (
    <div className="viewer">
      {/* Meta bar — topic name and reset button */}
      <div className="viewer-meta">
        <span className="viewer-tema" title={tema}>{tema}</span>
        <button
          className="viewer-reset-btn"
          onClick={onReset}
          aria-label="Cambiar de tema"
        >
          ✕ nuevo tema
        </button>
      </div>

      {/*
        THE FLIP CARD
        ─────────────
        .card-scene     → sets up perspective (3D vanishing point)
        .card-inner     → rotates; has transform-style: preserve-3d
          .card-front   → backface-visibility: hidden; starts at 0°
          .card-back    → backface-visibility: hidden; pre-rotated 180°

        When .card-inner gets the .flipped class:
          → rotates to 180°
          → front (0° + 180° = 180°) goes hidden
          → back  (180° + 180° = 360° = 0°) comes into view
      */}
      <div
        className="card-scene"
        onClick={onFlip}
        role="button"
        aria-label={isFlipped ? 'Ocultar respuesta' : 'Revelar respuesta'}
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' || e.key === ' ' ? onFlip() : null}
      >
        <div className={`card-inner${isFlipped ? ' flipped' : ''}`}>
          {/* FRONT — shows the question */}
          <div className="card-face card-front">
            <span className="card-label card-label--front">pregunta</span>
            <p className="card-content">{card.pregunta}</p>
            <span className="card-hint">click para revelar →</span>
          </div>

          {/* BACK — shows the answer */}
          <div className="card-face card-back">
            <span className="card-label card-label--back">respuesta</span>
            <p className="card-content">{card.respuesta}</p>
            <span className="card-hint">click para ocultar ←</span>
          </div>
        </div>
      </div>

      {/* Navigation controls */}
      <div className="viewer-nav" role="navigation" aria-label="Navegación de flashcards">
        <button
          className="nav-btn"
          onClick={onPrev}
          disabled={isFirst || navDisabled}
          aria-label="Flashcard anterior"
          title={navDisabled ? 'Cerrá la card antes de navegar' : 'Anterior'}
        >
          ← ant
        </button>

        <span className="viewer-counter" aria-live="polite" aria-label={`Card ${currentIndex + 1} de ${total}`}>
          {pad(currentIndex + 1)} / {pad(total)}
        </span>

        <button
          className="nav-btn"
          onClick={onNext}
          disabled={isLast || navDisabled}
          aria-label="Siguiente flashcard"
          title={navDisabled ? 'Cerrá la card antes de navegar' : 'Siguiente'}
        >
          sig →
        </button>
      </div>

      {/* Hint visible only when card is flipped and navigation is blocked */}
      {isFlipped && (
        <p className="viewer-flip-warning" aria-live="polite">
          cerrá la card para poder navegar
        </p>
      )}
    </div>
  );
}
