import { FileText, Brain, GraduationCap, Trophy, TrendingUp, BarChart3, Clock, Target } from 'lucide-react';
import { useStore } from '../../store';

export default function AnalyticsTab() {
  const { documents, flashcardSets, quizzes } = useStore();

  const totalCards = flashcardSets.reduce((sum, set) => sum + set.cards.length, 0);
  const masteredCards = flashcardSets.reduce((sum, set) => sum + set.cards.filter(c => c.mastered).length, 0);
  const completedQuizzes = quizzes.filter(q => q.score !== undefined);
  const avgScore = completedQuizzes.length > 0
    ? Math.round(completedQuizzes.reduce((sum, q) => sum + (q.score || 0), 0) / completedQuizzes.length)
    : 0;

  const stats = [
    { label: 'Documents', value: documents.length, icon: FileText, color: 'from-blue-500 to-blue-600', bg: 'bg-blue-50' },
    { label: 'Flashcard Sets', value: flashcardSets.length, icon: Brain, color: 'from-brand-500 to-brand-600', bg: 'bg-brand-50' },
    { label: 'Total Cards', value: totalCards, icon: Target, color: 'from-purple-500 to-purple-600', bg: 'bg-purple-50' },
    { label: 'Quizzes', value: quizzes.length, icon: GraduationCap, color: 'from-green-500 to-green-600', bg: 'bg-green-50' },
  ];

  // Simulate weekly activity
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const activity = weekDays.map(() => Math.floor(Math.random() * 100));
  const maxActivity = Math.max(...activity, 1);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-surface-900">Analytics</h1>
        <p className="text-surface-500 text-sm mt-1">Track your study progress and performance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="p-5 rounded-xl bg-white border border-surface-200">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center`}>
                <stat.icon size={18} className="text-brand-600" />
              </div>
              <TrendingUp size={14} className="text-green-500" />
            </div>
            <div className="text-2xl font-bold text-surface-900">{stat.value}</div>
            <div className="text-xs text-surface-500 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Study Progress */}
        <div className="p-6 rounded-xl bg-white border border-surface-200">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 size={18} className="text-brand-600" />
            <h3 className="font-semibold text-surface-900">Weekly Activity</h3>
          </div>
          <div className="flex items-end gap-3 h-40">
            {weekDays.map((day, i) => (
              <div key={day} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full relative" style={{ height: '120px' }}>
                  <div
                    className="absolute bottom-0 w-full rounded-lg bg-gradient-to-t from-brand-500 to-brand-400 transition-all duration-700"
                    style={{ height: `${(activity[i] / maxActivity) * 100}%`, minHeight: '8px' }}
                  />
                </div>
                <span className="text-xs text-surface-400">{day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Mastery Progress */}
        <div className="p-6 rounded-xl bg-white border border-surface-200">
          <div className="flex items-center gap-2 mb-6">
            <Trophy size={18} className="text-amber-500" />
            <h3 className="font-semibold text-surface-900">Mastery Overview</h3>
          </div>
          
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-surface-600">Flashcard Mastery</span>
                <span className="text-sm font-semibold text-surface-900">
                  {totalCards > 0 ? Math.round((masteredCards / totalCards) * 100) : 0}%
                </span>
              </div>
              <div className="h-3 rounded-full bg-surface-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-brand-500 to-purple-500 transition-all duration-700"
                  style={{ width: `${totalCards > 0 ? (masteredCards / totalCards) * 100 : 0}%` }}
                />
              </div>
              <p className="text-xs text-surface-400 mt-1">{masteredCards} of {totalCards} cards mastered</p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-surface-600">Average Quiz Score</span>
                <span className="text-sm font-semibold text-surface-900">{avgScore}%</span>
              </div>
              <div className="h-3 rounded-full bg-surface-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-700"
                  style={{ width: `${avgScore}%` }}
                />
              </div>
              <p className="text-xs text-surface-400 mt-1">{completedQuizzes.length} quiz{completedQuizzes.length !== 1 ? 'zes' : ''} completed</p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-surface-600">Documents Processed</span>
                <span className="text-sm font-semibold text-surface-900">
                  {documents.filter(d => d.status === 'ready').length}/{documents.length}
                </span>
              </div>
              <div className="h-3 rounded-full bg-surface-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-700"
                  style={{ width: `${documents.length > 0 ? (documents.filter(d => d.status === 'ready').length / documents.length) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="p-6 rounded-xl bg-white border border-surface-200 lg:col-span-2">
          <div className="flex items-center gap-2 mb-6">
            <Clock size={18} className="text-surface-500" />
            <h3 className="font-semibold text-surface-900">Recent Activity</h3>
          </div>
          {documents.length === 0 && quizzes.length === 0 ? (
            <p className="text-sm text-surface-400 text-center py-8">No activity yet. Upload a document to get started!</p>
          ) : (
            <div className="space-y-3">
              {documents.slice(0, 3).map((doc) => (
                <div key={doc.id} className="flex items-center gap-3 p-3 rounded-lg bg-surface-50">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                    <FileText size={14} className="text-blue-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-sm text-surface-700">Uploaded <strong>{doc.title}</strong></span>
                  </div>
                  <span className="text-xs text-surface-400">Recently</span>
                </div>
              ))}
              {completedQuizzes.slice(0, 2).map((quiz) => (
                <div key={quiz.id} className="flex items-center gap-3 p-3 rounded-lg bg-surface-50">
                  <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
                    <GraduationCap size={14} className="text-green-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-sm text-surface-700">Completed <strong>{quiz.title}</strong> with <strong>{quiz.score}%</strong></span>
                  </div>
                  <span className="text-xs text-surface-400">Recently</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
