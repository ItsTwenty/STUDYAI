import { create } from 'zustand';
import type { User, Document, FlashcardSet, Quiz } from '../types';

interface AppState {
  // AI Config
  openAIKey: string | null;
  // Auth
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Documents
  documents: Document[];
  selectedDocument: Document | null;

  // Flashcards
  flashcardSets: FlashcardSet[];

  // Quizzes
  quizzes: Quiz[];

  // UI
  sidebarOpen: boolean;
  activeTab: string;

  // Actions
  setUser: (user: User | null) => void;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  setDocuments: (docs: Document[]) => void;
  addDocument: (doc: Document) => void;
  updateDocument: (id: string, updates: Partial<Document>) => void;
  removeDocument: (id: string) => void;
  setSelectedDocument: (doc: Document | null) => void;
  addFlashcardSet: (set: FlashcardSet) => void;
  updateFlashcardSet: (id: string, updates: Partial<FlashcardSet>) => void;
  addQuiz: (quiz: Quiz) => void;
  updateQuiz: (id: string, updates: Partial<Quiz>) => void;
  setSidebarOpen: (open: boolean) => void;
  setActiveTab: (tab: string) => void;
  upgradePlan: () => void;
  setOpenAIKey: (key: string | null) => void;
  generateAIResponse: (input: string) => Promise<any>;
}

// Simulated data generation
const generateId = () => Math.random().toString(36).substring(2, 15);

const sampleFlashcards = (docTitle: string) => [
  { id: generateId(), documentId: '', question: `What is the main thesis of "${docTitle}"?`, answer: 'The main thesis explores the fundamental concepts and their practical applications in modern contexts, establishing a framework for understanding complex relationships.', difficulty: 'medium' as const, mastered: false },
  { id: generateId(), documentId: '', question: 'Define the key terminology introduced in Chapter 1.', answer: 'The key terms include: paradigm shift, cognitive framework, empirical methodology, and systematic analysis — each representing a cornerstone of the theoretical model presented.', difficulty: 'easy' as const, mastered: false },
  { id: generateId(), documentId: '', question: 'How do the concepts in Section 2 relate to real-world applications?', answer: 'Section 2 bridges theory and practice by demonstrating three case studies where the framework was successfully applied to solve complex organizational challenges.', difficulty: 'hard' as const, mastered: false },
  { id: generateId(), documentId: '', question: 'What are the three pillars of the methodology described?', answer: '1) Data collection through structured observation, 2) Qualitative analysis using thematic coding, 3) Quantitative validation through statistical modeling.', difficulty: 'medium' as const, mastered: false },
  { id: generateId(), documentId: '', question: 'Summarize the conclusion and future research directions.', answer: 'The conclusion affirms the hypothesis with strong evidence and suggests three avenues for future research: longitudinal studies, cross-cultural comparisons, and technology integration.', difficulty: 'easy' as const, mastered: false },
  { id: generateId(), documentId: '', question: 'What limitations does the author acknowledge?', answer: 'The author acknowledges sample size constraints, potential selection bias, limited geographic diversity, and the challenge of controlling for external variables in field studies.', difficulty: 'hard' as const, mastered: false },
];

const sampleQuizQuestions = (docTitle: string): import('../types').QuizQuestion[] => [
  { id: generateId(), question: `What is the primary purpose of "${docTitle}"?`, options: ['To introduce a new theoretical framework', 'To critique existing methodologies', 'To provide a historical overview', 'To propose policy changes'], correctAnswer: 0, explanation: 'The document primarily aims to introduce and validate a new theoretical framework based on empirical research.' },
  { id: generateId(), question: 'Which methodology is primarily used in the research?', options: ['Purely quantitative analysis', 'Mixed-methods approach', 'Case study only', 'Literature review'], correctAnswer: 1, explanation: 'The research employs a mixed-methods approach, combining both qualitative and quantitative techniques for comprehensive analysis.' },
  { id: generateId(), question: 'How many case studies are presented in the document?', options: ['One', 'Two', 'Three', 'Four'], correctAnswer: 2, explanation: 'Three distinct case studies are presented, each demonstrating different applications of the theoretical framework.' },
  { id: generateId(), question: 'What is the significance of the findings in Chapter 3?', options: ['They contradict previous research', 'They validate the proposed model', 'They are inconclusive', 'They suggest abandoning the approach'], correctAnswer: 1, explanation: 'Chapter 3 findings provide strong empirical validation for the proposed model, with statistical significance across all measures.' },
  { id: generateId(), question: 'Which of the following is NOT a limitation mentioned?', options: ['Sample size', 'Geographic diversity', 'Funding constraints', 'Selection bias'], correctAnswer: 2, explanation: 'While sample size, geographic diversity, and selection bias are acknowledged as limitations, funding constraints are not specifically mentioned.' },
];

export const useStore = create<AppState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  openAIKey: (() => {
    return localStorage.getItem('clevra_openai_key') || null;
  })(),
  documents: [],
  selectedDocument: null,
  flashcardSets: [],
  quizzes: [],
  sidebarOpen: true,
  activeTab: 'documents',

  setUser: (user) => set({ user, isAuthenticated: !!user }),

  login: async (email: string, _password: string) => {
    set({ isLoading: true });
    await new Promise((r) => setTimeout(r, 1200));
    const user: User = {
      id: generateId(),
      email,
      name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
      plan: 'free',
      createdAt: new Date().toISOString(),
    };
    set({ user, isAuthenticated: true, isLoading: false });
  },

  signup: async (email: string, _password: string, name: string) => {
    set({ isLoading: true });
    await new Promise((r) => setTimeout(r, 1200));
    const user: User = {
      id: generateId(),
      email,
      name,
      plan: 'free',
      createdAt: new Date().toISOString(),
    };
    set({ user, isAuthenticated: true, isLoading: false });
  },

  logout: () => set({ user: null, isAuthenticated: false, documents: [], flashcardSets: [], quizzes: [], selectedDocument: null }),

  setDocuments: (documents) => set({ documents }),
  addDocument: (doc) => set((state) => ({ documents: [doc, ...state.documents] })),
  updateDocument: (id, updates) =>
    set((state) => ({
      documents: state.documents.map((d) => (d.id === id ? { ...d, ...updates } : d)),
      selectedDocument: state.selectedDocument?.id === id ? { ...state.selectedDocument, ...updates } : state.selectedDocument,
    })),
  removeDocument: (id) =>
    set((state) => ({
      documents: state.documents.filter((d) => d.id !== id),
      selectedDocument: state.selectedDocument?.id === id ? null : state.selectedDocument,
    })),
  setSelectedDocument: (doc) => set({ selectedDocument: doc }),

  addFlashcardSet: (flashcardSet) => set((state) => ({ flashcardSets: [flashcardSet, ...state.flashcardSets] })),
  updateFlashcardSet: (id, updates) =>
    set((state) => ({
      flashcardSets: state.flashcardSets.map((f) => (f.id === id ? { ...f, ...updates } : f)),
    })),

  addQuiz: (quiz) => set((state) => ({ quizzes: [quiz, ...state.quizzes] })),
  updateQuiz: (id, updates) =>
    set((state) => ({
      quizzes: state.quizzes.map((q) => (q.id === id ? { ...q, ...updates } : q)),
    })),

  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
  setActiveTab: (activeTab) => set({ activeTab }),
  upgradePlan: () => set((state) => ({ user: state.user ? { ...state.user, plan: 'premium' } : null })),
  setOpenAIKey: (key) => {
    if (key) {
      localStorage.setItem('clevra_openai_key', key);
    } else {
      localStorage.removeItem('clevra_openai_key');
    }
    set({ openAIKey: key });
  },

  generateAIResponse: async (input: string) => {
    const { openAIKey } = get();
    if (!openAIKey) {
      throw new Error("API key is not set. Please add it in your settings.");
    }

    let provider = 'openai';
    if (openAIKey.startsWith('sk-or-')) provider = 'openrouter';
    else if (openAIKey.startsWith('AIza') || openAIKey.startsWith('AQ.')) provider = 'gemini';

    const savedModel = localStorage.getItem('clevra_ai_model');
    let defaultModel = 'gpt-4o-mini';
    if (provider === 'openrouter') defaultModel = 'meta-llama/llama-3.3-70b-instruct:free';
    if (provider === 'gemini') defaultModel = 'gemini-2.5-flash';
    
    const model = savedModel || defaultModel;

    try {
      if (provider === 'gemini') {
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${openAIKey}`;
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ role: "user", parts: [{ text: input }] }],
            generationConfig: { temperature: 0.7 }
          })
        });

        if (!response.ok) {
          const error = await response.json().catch(() => ({}));
          if (response.status === 400 && error.error?.message?.includes('API key not valid')) {
            throw new Error('Invalid Gemini API key.');
          }
          throw new Error(error.error?.message || `API error: ${response.statusText}`);
        }

        const data = await response.json();
        return {
          choices: [{ message: { content: data.candidates?.[0]?.content?.parts?.[0]?.text || '' } }]
        };
      }

      const apiUrl = provider === 'openrouter'
        ? 'https://openrouter.ai/api/v1/chat/completions'
        : 'https://api.openai.com/v1/chat/completions';

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${openAIKey}`
      };

      if (provider === 'openrouter') {
        headers['HTTP-Referer'] = window.location.origin || 'http://localhost:5173';
        headers['X-Title'] = 'Clevra';
      }

      const response = await fetch(apiUrl, {
        method: "POST",
        headers,
        body: JSON.stringify({
          model,
          messages: [
            { role: "user", content: input }
          ],
          temperature: 0.7,
        })
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.error?.message || `API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error calling ${provider} API:`, error);
      throw error;
    }
  },
}));

export { generateId, sampleFlashcards, sampleQuizQuestions };
