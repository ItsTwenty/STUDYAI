import { useState } from 'react';
import { Brain, RotateCcw, ChevronLeft, ChevronRight, CheckCircle2, Sparkles, Layers } from 'lucide-react';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { useStore } from '../../store';
import { cn } from '../../utils/cn';

export default function FlashcardsTab() {
  const { flashcardSets, updateFlashcardSet } = useStore();
  const [activeSetId, setActiveSetId] = useState<string | null>(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const activeSet = flashcardSets.find(s => s.id === activeSetId);
  const currentCard = activeSet?.cards[currentCardIndex];

  const handleNext = () => {
    if (activeSet && currentCardIndex < activeSet.cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setFlipped(false);
    }
  };

  const handlePrev = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      setFlipped(false);
    }
  };

  const toggleMastered = () => {
    if (activeSet && currentCard) {
      const updatedCards = activeSet.cards.map(c =>
        c.id === currentCard.id ? { ...c, mastered: !c.mastered } : c
      );
      updateFlashcardSet(activeSet.id, { cards: updatedCards });
    }
  };

  const masteredCount = activeSet?.cards.filter(c => c.mastered).length || 0;

  if (flashcardSets.length === 0) {
    return (
      <div>
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-surface-900">Flashcards</h1>
          <p className="text-surface-500 text-sm mt-1">AI-generated flashcards from your documents</p>
        </div>
        <div className="text-center py-20">
          <div className="w-16 h-16 rounded-2xl bg-surface-100 flex items-center justify-center mx-auto mb-4">
            <Brain size={28} className="text-surface-400" />
          </div>
          <h3 className="text-lg font-semibold text-surface-900 mb-2">No flashcard sets yet</h3>
          <p className="text-surface-500 text-sm max-w-sm mx-auto">Upload a document and click the flashcard icon to generate AI-powered flashcards.</p>
        </div>
      </div>
    );
  }

  if (!activeSet) {
    return (
      <div>
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-surface-900">Flashcards</h1>
          <p className="text-surface-500 text-sm mt-1">{flashcardSets.length} flashcard set{flashcardSets.length !== 1 ? 's' : ''} available</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {flashcardSets.map((set) => {
            const mastered = set.cards.filter(c => c.mastered).length;
            const progress = Math.round((mastered / set.cards.length) * 100);
            return (
              <button
                key={set.id}
                onClick={() => { setActiveSetId(set.id); setCurrentCardIndex(0); setFlipped(false); }}
                className="p-5 rounded-xl border border-surface-200 bg-white hover:border-brand-200 hover:shadow-md transition-all text-left cursor-pointer group"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-50 to-purple-50 flex items-center justify-center group-hover:from-brand-100 group-hover:to-purple-100 transition-colors">
                    <Layers size={18} className="text-brand-600" />
                  </div>
                  <Badge variant="brand">{set.cards.length} cards</Badge>
                </div>
                <h3 className="text-sm font-semibold text-surface-900 mb-2 line-clamp-2">{set.title}</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-surface-500">
                    <span>{mastered} of {set.cards.length} mastered</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-surface-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-brand-500 to-purple-500 transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <button
            onClick={() => { setActiveSetId(null); setCurrentCardIndex(0); setFlipped(false); }}
            className="p-2 rounded-lg hover:bg-surface-100 text-surface-400 hover:text-surface-600 transition-colors cursor-pointer"
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-surface-900">{activeSet.title}</h1>
            <p className="text-surface-500 text-sm">
              {masteredCount} of {activeSet.cards.length} mastered
            </p>
          </div>
        </div>
        <Badge variant="brand" size="md">
          <Sparkles size={12} className="mr-1" />
          AI Generated
        </Badge>
      </div>

      {/* Progress */}
      <div className="mb-8">
        <div className="h-2 rounded-full bg-surface-100 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-brand-500 to-purple-500 transition-all duration-500"
            style={{ width: `${(masteredCount / activeSet.cards.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Card */}
      {currentCard && (
        <div className="max-w-2xl mx-auto">
          <div
            onClick={() => setFlipped(!flipped)}
            className={cn(
              'relative min-h-[300px] rounded-2xl border-2 p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300',
              flipped
                ? 'border-brand-200 bg-brand-50/50'
                : 'border-surface-200 bg-white hover:border-surface-300',
              currentCard.mastered && 'ring-2 ring-green-200'
            )}
          >
            <div className="absolute top-4 left-4">
              <Badge variant={currentCard.difficulty === 'easy' ? 'success' : currentCard.difficulty === 'medium' ? 'warning' : 'error'}>
                {currentCard.difficulty}
              </Badge>
            </div>
            <div className="absolute top-4 right-4 text-xs text-surface-400">
              {currentCardIndex + 1} / {activeSet.cards.length}
            </div>
            
            <p className="text-xs uppercase tracking-wider text-surface-400 mb-4">
              {flipped ? 'Answer' : 'Question'}
            </p>
            <p className={cn(
              'text-lg leading-relaxed max-w-lg',
              flipped ? 'text-brand-800 font-medium' : 'text-surface-900 font-semibold'
            )}>
              {flipped ? currentCard.answer : currentCard.question}
            </p>
            <p className="absolute bottom-4 text-xs text-surface-400">
              Click to {flipped ? 'see question' : 'reveal answer'}
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between mt-6">
            <Button
              variant="outline"
              size="md"
              onClick={handlePrev}
              disabled={currentCardIndex === 0}
              icon={<ChevronLeft size={16} />}
            >
              Previous
            </Button>

            <div className="flex items-center gap-2">
              <Button
                variant={currentCard.mastered ? 'primary' : 'ghost'}
                size="md"
                onClick={toggleMastered}
                icon={<CheckCircle2 size={16} />}
              >
                {currentCard.mastered ? 'Mastered' : 'Mark Mastered'}
              </Button>
              <Button
                variant="ghost"
                size="md"
                onClick={() => { setCurrentCardIndex(0); setFlipped(false); }}
                icon={<RotateCcw size={16} />}
              >
                Reset
              </Button>
            </div>

            <Button
              variant="outline"
              size="md"
              onClick={handleNext}
              disabled={currentCardIndex === activeSet.cards.length - 1}
            >
              Next <ChevronRight size={16} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
