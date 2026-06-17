import { useState } from 'react';
import { GraduationCap, ChevronLeft, CheckCircle2, XCircle, Trophy, RotateCcw, Sparkles, Clock } from 'lucide-react';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { useStore } from '../../store';
import { cn } from '../../utils/cn';
import toast from 'react-hot-toast';

export default function QuizzesTab() {
  const { quizzes, updateQuiz } = useStore();
  const [activeQuizId, setActiveQuizId] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [quizCompleted, setQuizCompleted] = useState(false);

  const activeQuiz = quizzes.find(q => q.id === activeQuizId);
  const question = activeQuiz?.questions[currentQuestion];

  const handleAnswer = (answerIndex: number) => {
    if (showExplanation) return;
    setSelectedAnswer(answerIndex);
    setShowExplanation(true);
    setAnswers({ ...answers, [currentQuestion]: answerIndex });
  };

  const handleNext = () => {
    if (activeQuiz && currentQuestion < activeQuiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      // Quiz complete
      const correct = Object.entries(answers).filter(
        ([qIdx, aIdx]) => activeQuiz?.questions[Number(qIdx)]?.correctAnswer === aIdx
      ).length;
      // Count current question too if answered correctly
      const lastCorrect = selectedAnswer === question?.correctAnswer ? 1 : 0;
      const totalCorrect = correct + (answers[currentQuestion] !== undefined ? 0 : lastCorrect);
      const score = Math.round((totalCorrect / (activeQuiz?.questions.length || 1)) * 100);
      
      updateQuiz(activeQuiz!.id, { score, completedAt: new Date().toISOString() });
      setQuizCompleted(true);
      toast.success(`Quiz completed! Score: ${score}%`);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setAnswers({});
    setQuizCompleted(false);
  };

  const startQuiz = (id: string) => {
    setActiveQuizId(id);
    resetQuiz();
  };

  if (quizzes.length === 0) {
    return (
      <div>
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-surface-900">Quizzes</h1>
          <p className="text-surface-500 text-sm mt-1">AI-generated quizzes to test your knowledge</p>
        </div>
        <div className="text-center py-20">
          <div className="w-16 h-16 rounded-2xl bg-surface-100 flex items-center justify-center mx-auto mb-4">
            <GraduationCap size={28} className="text-surface-400" />
          </div>
          <h3 className="text-lg font-semibold text-surface-900 mb-2">No quizzes yet</h3>
          <p className="text-surface-500 text-sm max-w-sm mx-auto">Upload a document and click the quiz icon to generate AI-powered quizzes.</p>
        </div>
      </div>
    );
  }

  if (!activeQuiz) {
    return (
      <div>
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-surface-900">Quizzes</h1>
          <p className="text-surface-500 text-sm mt-1">{quizzes.length} quiz{quizzes.length !== 1 ? 'zes' : ''} available</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quizzes.map((quiz) => (
            <button
              key={quiz.id}
              onClick={() => startQuiz(quiz.id)}
              className="p-5 rounded-xl border border-surface-200 bg-white hover:border-brand-200 hover:shadow-md transition-all text-left cursor-pointer group"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center group-hover:from-green-100 group-hover:to-emerald-100 transition-colors">
                  <GraduationCap size={18} className="text-green-600" />
                </div>
                <Badge variant="default">{quiz.questions.length} questions</Badge>
              </div>
              <h3 className="text-sm font-semibold text-surface-900 mb-2 line-clamp-2">{quiz.title}</h3>
              {quiz.score !== undefined ? (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <Trophy size={14} className={quiz.score >= 70 ? 'text-amber-500' : 'text-surface-400'} />
                    <span className={cn('text-sm font-semibold', quiz.score >= 70 ? 'text-green-600' : 'text-red-500')}>
                      {quiz.score}%
                    </span>
                  </div>
                  <span className="text-xs text-surface-400">•</span>
                  <span className="text-xs text-surface-400 flex items-center gap-1">
                    <Clock size={10} />
                    Completed
                  </span>
                </div>
              ) : (
                <span className="text-xs text-surface-400">Not attempted yet</span>
              )}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Quiz completed view
  if (quizCompleted) {
    const score = activeQuiz.score || 0;
    return (
      <div>
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => { setActiveQuizId(null); resetQuiz(); }}
            className="p-2 rounded-lg hover:bg-surface-100 text-surface-400 hover:text-surface-600 transition-colors cursor-pointer"
          >
            <ChevronLeft size={20} />
          </button>
          <h1 className="text-xl font-bold text-surface-900">Quiz Results</h1>
        </div>

        <div className="max-w-md mx-auto text-center py-12">
          <div className={cn(
            'w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6',
            score >= 70 ? 'bg-green-50' : 'bg-red-50'
          )}>
            <Trophy size={40} className={score >= 70 ? 'text-green-500' : 'text-red-400'} />
          </div>
          <h2 className="text-3xl font-bold text-surface-900 mb-2">{score}%</h2>
          <p className="text-surface-500 mb-2">
            {score >= 90 ? 'Excellent! You\'ve mastered this material!' :
             score >= 70 ? 'Great job! Keep up the good work!' :
             score >= 50 ? 'Good effort! Review the material and try again.' :
             'Keep studying! Review the material and try again.'}
          </p>
          <p className="text-sm text-surface-400 mb-8">
            {Object.values(answers).filter((a, i) => activeQuiz.questions[i]?.correctAnswer === a).length} of {activeQuiz.questions.length} correct
          </p>
          <div className="flex items-center justify-center gap-3">
            <Button variant="outline" onClick={resetQuiz} icon={<RotateCcw size={16} />}>
              Retry Quiz
            </Button>
            <Button onClick={() => { setActiveQuizId(null); resetQuiz(); }}>
              Back to Quizzes
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <button
            onClick={() => { setActiveQuizId(null); resetQuiz(); }}
            className="p-2 rounded-lg hover:bg-surface-100 text-surface-400 hover:text-surface-600 transition-colors cursor-pointer"
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-surface-900">{activeQuiz.title}</h1>
            <p className="text-surface-500 text-sm">Question {currentQuestion + 1} of {activeQuiz.questions.length}</p>
          </div>
        </div>
        <Badge variant="brand" size="md">
          <Sparkles size={12} className="mr-1" />
          AI Generated
        </Badge>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="h-2 rounded-full bg-surface-100 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-brand-500 to-purple-500 transition-all duration-500"
            style={{ width: `${((currentQuestion + (showExplanation ? 1 : 0)) / activeQuiz.questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      {question && (
        <div className="max-w-2xl mx-auto">
          <h2 className="text-lg font-semibold text-surface-900 mb-6">{question.question}</h2>

          <div className="space-y-3 mb-6">
            {question.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrect = question.correctAnswer === index;
              const showResult = showExplanation;

              return (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  disabled={showExplanation}
                  className={cn(
                    'w-full p-4 rounded-xl border-2 text-left transition-all cursor-pointer',
                    showResult && isCorrect
                      ? 'border-green-300 bg-green-50'
                      : showResult && isSelected && !isCorrect
                      ? 'border-red-300 bg-red-50'
                      : isSelected
                      ? 'border-brand-300 bg-brand-50'
                      : 'border-surface-200 hover:border-surface-300 bg-white',
                    showExplanation && 'cursor-default'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0',
                      showResult && isCorrect
                        ? 'bg-green-500 text-white'
                        : showResult && isSelected && !isCorrect
                        ? 'bg-red-500 text-white'
                        : 'bg-surface-100 text-surface-600'
                    )}>
                      {showResult && isCorrect ? <CheckCircle2 size={16} /> :
                       showResult && isSelected && !isCorrect ? <XCircle size={16} /> :
                       String.fromCharCode(65 + index)}
                    </div>
                    <span className={cn(
                      'text-sm',
                      showResult && isCorrect ? 'text-green-800 font-medium' :
                      showResult && isSelected && !isCorrect ? 'text-red-800' :
                      'text-surface-700'
                    )}>
                      {option}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {showExplanation && (
            <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 mb-6 animate-fade-in">
              <h4 className="text-sm font-semibold text-blue-900 mb-1">Explanation</h4>
              <p className="text-sm text-blue-700">{question.explanation}</p>
            </div>
          )}

          {/* Next Button */}
          {showExplanation && (
            <div className="flex justify-end">
              <Button onClick={handleNext} size="lg">
                {currentQuestion < activeQuiz.questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
