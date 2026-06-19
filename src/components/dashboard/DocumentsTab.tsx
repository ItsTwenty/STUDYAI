import { useState, useCallback, useRef, useEffect, memo } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Upload, FileText, Sparkles, Brain, GraduationCap,
  MoreHorizontal, Trash2, Clock, CheckCircle2, Loader2,
  Search, Plus, AlertCircle,
} from 'lucide-react';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import Modal from '../ui/Modal';
import { useStore, generateId, sampleFlashcards, sampleQuizQuestions } from '../../store';
import type { Document } from '../../types';
import toast from 'react-hot-toast';
import { extractTextFromPDF, generateSummary, generateFlashcards as generateFlashcardsAI, generateQuiz as generateQuizAI, getAIConfig } from '../../lib/ai';

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

async function processFile(
  file: File,
  doc: Document,
  addDocument: (doc: Document) => void,
  updateDocument: (id: string, updates: Partial<Document>) => void,
) {
  addDocument(doc);

  try {
    updateDocument(doc.id, { status: 'processing' });
    const extractedText = await extractTextFromPDF(file);

    if (getAIConfig()?.apiKey && extractedText.length > 100) {
      try {
        const summary = await generateSummary(extractedText, doc.title);
        updateDocument(doc.id, { status: 'ready', summary, content: extractedText });
        toast.success(`✨ "${doc.title}" processed with AI!`);
      } catch (error: any) {
        updateDocument(doc.id, {
          status: 'ready',
          content: extractedText,
          summary: `⚠️ AI Summary failed: ${error.message}. Try again by clicking the document.`
        });
        toast.error(`AI Error: ${error.message}`);
      }
    } else if (!getAIConfig()?.apiKey) {
      updateDocument(doc.id, {
        status: 'ready',
        content: extractedText,
        summary: `📄 Document has ${extractedText.split(' ').length} words. Click "Add API Key" to enable AI features.`
      });
      toast(`"${doc.title}" ready - Add API key for AI features`, { icon: '📄' });
    } else {
      updateDocument(doc.id, {
        status: 'ready',
        content: extractedText,
        summary: `Document processed. Text: ${extractedText.length} characters.`
      });
      toast.success(`"${doc.title}" is ready!`);
    }
  } catch (error: any) {
    console.error('Error processing PDF:', error);
    updateDocument(doc.id, { status: 'error' });
    toast.error(`Failed to process "${doc.title}": ${error.message}`);
  }
}

const DocumentCard = memo(function DocumentCard({
  doc,
  selected,
  generating,
  menuOpen,
  onSelect,
  onGenerateFlashcards,
  onGenerateQuiz,
  onToggleMenu,
  onDelete,
}: {
  doc: Document;
  selected: boolean;
  generating: string | null;
  menuOpen: string | null;
  onSelect: (doc: Document) => void;
  onGenerateFlashcards: (doc: Document) => void;
  onGenerateQuiz: (doc: Document) => void;
  onToggleMenu: (id: string | null) => void;
  onDelete: (id: string) => void;
}) {
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div
      className={`group p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
        selected
          ? 'border-brand-200 bg-brand-50/50 shadow-sm'
          : 'border-surface-200 bg-white hover:border-surface-300 hover:shadow-sm'
      }`}
      onClick={() => onSelect(doc)}
    >
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center flex-shrink-0">
          <FileText size={18} className="text-red-500" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-sm font-semibold text-surface-900 truncate">{doc.title}</h3>
            <Badge variant={doc.status === 'ready' ? 'success' : doc.status === 'processing' ? 'warning' : doc.status === 'error' ? 'error' : 'default'}>
              {doc.status === 'ready' && <CheckCircle2 size={10} className="mr-1" />}
              {doc.status === 'processing' && <Loader2 size={10} className="mr-1 animate-spin" />}
              {doc.status === 'uploading' && <Loader2 size={10} className="mr-1 animate-spin" />}
              {doc.status === 'error' && <AlertCircle size={10} className="mr-1" />}
              {doc.status}
            </Badge>
          </div>
          <div className="flex items-center gap-3 text-xs text-surface-400">
            <span>{formatFileSize(doc.fileSize)}</span>
            <span>•</span>
            <span className="flex items-center gap-1"><Clock size={10} />{formatDate(doc.createdAt)}</span>
          </div>
          {doc.summary && selected && (
            <div className="mt-3 p-3 rounded-lg bg-surface-50 border border-surface-100">
              <div className="flex items-center gap-1.5 text-xs font-medium text-brand-600 mb-1.5">
                <Sparkles size={12} />
                AI Summary
              </div>
              <p className="text-sm text-surface-600 leading-relaxed">{doc.summary}</p>
            </div>
          )}
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          {doc.status === 'ready' && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); onGenerateFlashcards(doc); }}
                disabled={generating === `flashcards-${doc.id}`}
                className="p-2 rounded-lg hover:bg-surface-100 text-surface-400 hover:text-brand-600 transition-colors disabled:opacity-50 cursor-pointer"
                title="Generate Flashcards"
              >
                {generating === `flashcards-${doc.id}` ? <Loader2 size={16} className="animate-spin" /> : <Brain size={16} />}
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onGenerateQuiz(doc); }}
                disabled={generating === `quiz-${doc.id}`}
                className="p-2 rounded-lg hover:bg-surface-100 text-surface-400 hover:text-brand-600 transition-colors disabled:opacity-50 cursor-pointer"
                title="Generate Quiz"
              >
                {generating === `quiz-${doc.id}` ? <Loader2 size={16} className="animate-spin" /> : <GraduationCap size={16} />}
              </button>
            </>
          )}
          <div className="relative">
            <button
              onClick={(e) => { e.stopPropagation(); onToggleMenu(menuOpen === doc.id ? null : doc.id); }}
              className="p-2 rounded-lg hover:bg-surface-100 text-surface-400 hover:text-surface-600 transition-colors cursor-pointer"
            >
              <MoreHorizontal size={16} />
            </button>
            {menuOpen === doc.id && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl border border-surface-200 shadow-lg py-1 z-10">
                <button
                  onClick={(e) => { e.stopPropagation(); onDelete(doc.id); }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer"
                >
                  <Trash2 size={14} />
                  Delete Document
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

export default function DocumentsTab() {
  const documents = useStore(s => s.documents);
  const addDocument = useStore(s => s.addDocument);
  const updateDocument = useStore(s => s.updateDocument);
  const removeDocument = useStore(s => s.removeDocument);
  const selectedDocument = useStore(s => s.selectedDocument);
  const setSelectedDocument = useStore(s => s.setSelectedDocument);
  const addFlashcardSet = useStore(s => s.addFlashcardSet);
  const addQuiz = useStore(s => s.addQuiz);
  const user = useStore(s => s.user);
  const [showUpload, setShowUpload] = useState(false);
  const [generating, setGenerating] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const mountedRef = useRef(true);

  useEffect(() => {
    return () => { mountedRef.current = false; };
  }, []);

  const debouncedSearch = useDebounce(searchQuery, 200);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setShowUpload(false);
    (async () => {
      for (const file of acceptedFiles) {
        if (!mountedRef.current) return;
        const doc: Document = {
          id: generateId(),
          userId: user?.id || '',
          title: file.name.replace('.pdf', ''),
          fileName: file.name,
          fileSize: file.size,
          status: 'uploading',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        await processFile(file, doc, addDocument, updateDocument);
      }
    })();
  }, [addDocument, updateDocument, user]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxSize: 52428800,
  });

  const generateFlashcards = async (doc: Document) => {
    setGenerating(`flashcards-${doc.id}`);
    try {
      let cards;
      if (getAIConfig()?.apiKey && doc.content) {
        toast.loading('Generating AI Flashcards...', { id: 'ai-gen' });
        cards = await generateFlashcardsAI(doc.content, doc.title);
        toast.dismiss('ai-gen');
      } else {
        await new Promise((r) => setTimeout(r, 1500));
        cards = sampleFlashcards(doc.title);
      }
      
      const set = {
        id: generateId(),
        documentId: doc.id,
        userId: user?.id || '',
        title: `${doc.title} - Flashcards`,
        cards: cards.map(c => ({
          id: generateId(),
          documentId: doc.id,
          question: c.question,
          answer: c.answer,
          difficulty: c.difficulty || 'medium',
          mastered: false
        })),
        createdAt: new Date().toISOString(),
      };
      addFlashcardSet(set);
      toast.success('Flashcards generated!');
    } catch (error: any) {
      toast.dismiss('ai-gen');
      console.error(error);
      toast.error(`Failed to generate flashcards: ${error.message}`);
    } finally {
      setGenerating(null);
    }
  };

  const generateQuiz = async (doc: Document) => {
    setGenerating(`quiz-${doc.id}`);
    try {
      let questions;
      if (getAIConfig()?.apiKey && doc.content) {
        toast.loading('Generating AI Quiz...', { id: 'ai-gen' });
        questions = await generateQuizAI(doc.content, doc.title);
        toast.dismiss('ai-gen');
      } else {
        await new Promise((r) => setTimeout(r, 1500));
        questions = sampleQuizQuestions(doc.title);
      }
      
      const quiz = {
        id: generateId(),
        documentId: doc.id,
        userId: user?.id || '',
        title: `${doc.title} - Quiz`,
        questions: questions.map(q => ({
          id: generateId(),
          question: q.question,
          options: q.options,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation || ''
        })),
        createdAt: new Date().toISOString(),
      };
      addQuiz(quiz);
      toast.success('Quiz generated!');
    } catch (error: any) {
      toast.dismiss('ai-gen');
      console.error(error);
      toast.error(`Failed to generate quiz: ${error.message}`);
    } finally {
      setGenerating(null);
    }
  };

  const filteredDocs = documents.filter(d =>
    d.title.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Documents</h1>
          <p className="text-surface-500 text-sm mt-1">{documents.length} document{documents.length !== 1 ? 's' : ''} uploaded</p>
        </div>
        <Button onClick={() => setShowUpload(true)} icon={<Plus size={16} />}>
          Upload PDF
        </Button>
      </div>

      {/* Search */}
      {documents.length > 0 && (
        <div className="relative mb-6">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
          <input
            type="text"
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-surface-200 bg-white text-sm text-surface-900 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
          />
        </div>
      )}

      {/* Document List */}
      {filteredDocs.length === 0 && documents.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 rounded-2xl bg-surface-100 flex items-center justify-center mx-auto mb-4">
            <FileText size={28} className="text-surface-400" />
          </div>
          <h3 className="text-lg font-semibold text-surface-900 mb-2">No documents yet</h3>
          <p className="text-surface-500 text-sm mb-6 max-w-sm mx-auto">Upload your first PDF to get started with AI-powered summaries, flashcards, and quizzes.</p>
          <Button onClick={() => setShowUpload(true)} icon={<Upload size={16} />}>Upload Your First PDF</Button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredDocs.map((doc) => (
            <DocumentCard
              key={doc.id}
              doc={doc}
              selected={selectedDocument?.id === doc.id}
              generating={generating}
              menuOpen={menuOpen}
              onSelect={setSelectedDocument}
              onGenerateFlashcards={generateFlashcards}
              onGenerateQuiz={generateQuiz}
              onToggleMenu={setMenuOpen}
              onDelete={(id) => { removeDocument(id); setMenuOpen(null); toast.success('Document deleted'); }}
            />
          ))}
        </div>
      )}

      {/* Upload Modal */}
      <Modal isOpen={showUpload} onClose={() => setShowUpload(false)} title="Upload Document" size="lg">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-12 text-center transition-all cursor-pointer ${
            isDragActive
              ? 'border-brand-400 bg-brand-50'
              : 'border-surface-200 hover:border-brand-300 hover:bg-surface-50'
          }`}
        >
          <input {...getInputProps()} />
          <div className="w-14 h-14 rounded-2xl bg-brand-50 flex items-center justify-center mx-auto mb-4">
            <Upload size={24} className="text-brand-600" />
          </div>
          <h3 className="text-lg font-semibold text-surface-900 mb-2">
            {isDragActive ? 'Drop your file here' : 'Drag & drop your PDF'}
          </h3>
          <p className="text-sm text-surface-500 mb-4">or click to browse files</p>
          <p className="text-xs text-surface-400">Supports PDF files up to 50MB</p>
        </div>
      </Modal>
    </div>
  );
}
