import { useFlashcards } from './hooks/useFlashcards';
import FlashcardForm from './components/FlashcardForm';
import FlashcardViewer from './components/FlashcardViewer';
import './App.css';

/**
 * App
 *
 * The single orchestrator. It:
 *   1. Calls useFlashcards() to get all state and actions.
 *   2. Decides what to render:
 *        flashcards.length > 0 → FlashcardViewer (study mode)
 *        otherwise             → FlashcardForm   (input mode)
 *   3. Passes down only the props each child needs — no prop drilling beyond one level.
 *
 * App itself has no state. It's a pure composition layer.
 */
export default function App() {
  const {
    flashcards,
    tema,
    loading,
    error,
    currentIndex,
    isFlipped,
    generateFlashcards,
    nextCard,
    prevCard,
    flipCard,
    resetAll,
  } = useFlashcards();

  const hasCards = flashcards.length > 0;

  return (
    <div className="app">
      {/* Header — always visible */}
      <header className="app-header">
        <span className="app-logo" aria-hidden="true">◈</span>
        <h1 className="app-title">FlashMint</h1>
        <span className="app-subtitle">generador de flashcards</span>
      </header>

      {/* Main content — switches between form and viewer */}
      <main className="app-main">
        {hasCards ? (
          <FlashcardViewer
            flashcards={flashcards}
            tema={tema}
            currentIndex={currentIndex}
            isFlipped={isFlipped}
            onFlip={flipCard}
            onNext={nextCard}
            onPrev={prevCard}
            onReset={resetAll}
          />
        ) : (
          <FlashcardForm
            onGenerate={generateFlashcards}
            loading={loading}
            error={error}
          />
        )}
      </main>
    </div>
  );
}
