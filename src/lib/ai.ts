// AI Integration Service
// Supports OpenAI API for generating summaries, flashcards, and quizzes

export interface AIConfig {
  apiKey: string;
  provider?: 'openai' | 'openrouter' | 'gemini';
  model?: string;
}

// Always read fresh from localStorage — never cache in memory
export const setAIConfig = (newConfig: AIConfig) => {
  // Persist to localStorage
  localStorage.setItem('clevra_openai_key', newConfig.apiKey);
  if (newConfig.provider) {
    localStorage.setItem('clevra_ai_provider', newConfig.provider);
  } else {
    localStorage.removeItem('clevra_ai_provider');
  }
  if (newConfig.model) {
    localStorage.setItem('clevra_ai_model', newConfig.model);
  } else {
    localStorage.removeItem('clevra_ai_model');
  }
};

export const getAIConfig = (): AIConfig | null => {
  // Always read fresh from localStorage so changes take effect immediately
  const savedKey = localStorage.getItem('clevra_openai_key');
  const savedProvider = localStorage.getItem('clevra_ai_provider') as 'openai' | 'openrouter' | 'gemini' | null;
  const savedModel = localStorage.getItem('clevra_ai_model') || undefined;

  if (savedKey) {
    let provider = savedProvider;
    if (!provider) {
      if (savedKey.startsWith('sk-or-')) provider = 'openrouter';
      else if (savedKey.startsWith('AIza') || savedKey.startsWith('AQ.')) provider = 'gemini';
      else provider = 'openai';
    }
    return { apiKey: savedKey, provider, model: savedModel };
  }
  return null;
};

export const clearAIConfig = () => {
  localStorage.removeItem('clevra_openai_key');
  localStorage.removeItem('clevra_ai_provider');
  localStorage.removeItem('clevra_ai_model');
};

async function callOpenAI(prompt: string, systemPrompt: string): Promise<string> {
  const currentConfig = getAIConfig();
  if (!currentConfig?.apiKey) {
    throw new Error('No API key configured. Go to Settings to add your key.');
  }

  let provider = currentConfig.provider;
  if (!provider) {
    if (currentConfig.apiKey.startsWith('sk-or-')) provider = 'openrouter';
    else if (currentConfig.apiKey.startsWith('AIza') || currentConfig.apiKey.startsWith('AQ.')) provider = 'gemini';
    else provider = 'openai';
  }

  let defaultModel = 'gpt-4o-mini';
  if (provider === 'openrouter') defaultModel = 'meta-llama/llama-3.3-70b-instruct:free';
  if (provider === 'gemini') defaultModel = 'gemini-2.5-flash';
  
  const model = currentConfig.model || defaultModel;

  console.log(`Calling ${provider} API with key ending in:`, currentConfig.apiKey.slice(-4));
  console.log('Model:', model);

  if (provider === 'gemini') {
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${currentConfig.apiKey}`;
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemPrompt }] },
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2000,
        }
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      console.error('Gemini error:', error);
      if (response.status === 400 && error.error?.message?.includes('API key not valid')) {
        throw new Error('Invalid Gemini API key.');
      }
      throw new Error(error.error?.message || `API error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    console.log('Gemini response:', content.substring(0, 100));
    return content;
  }

  const apiUrl = provider === 'openrouter'
    ? 'https://openrouter.ai/api/v1/chat/completions'
    : 'https://api.openai.com/v1/chat/completions';

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${currentConfig.apiKey}`,
  };

  if (provider === 'openrouter') {
    headers['HTTP-Referer'] = window.location.origin || 'http://localhost:5173';
    headers['X-Title'] = 'Clevra';
  }

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    }),
  });

  console.log(`${provider} response status:`, response.status);
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    console.error(`${provider} error:`, error);

    if (response.status === 401) {
      throw new Error(`Invalid API key. Please check your ${provider === 'openrouter' ? 'OpenRouter' : 'OpenAI'} API key.`);
    } else if (response.status === 429) {
      throw new Error('Rate limited. Please wait a moment and try again.');
    } else if (response.status === 402) {
      throw new Error('Insufficient credits. Please add credits to your account.');
    }

    throw new Error(error.error?.message || `API error ${response.status}: ${response.statusText}`);
  }
  const data = await response.json();
  console.log(`${provider} response:`, data.choices?.[0]?.message?.content?.substring(0, 100));
  return data.choices?.[0]?.message?.content || '';
}

export async function generateSummary(documentText: string, title: string): Promise<string> {
  const systemPrompt = `You are an expert academic summarizer. Create concise, informative summaries that capture the key concepts, main arguments, and important details from documents. Write in clear, accessible language.`;

  const prompt = `Please summarize the following document titled "${title}". Provide a comprehensive summary that covers:
- Main thesis or purpose
- Key concepts and definitions
- Important findings or arguments
- Practical implications

Document content:
${documentText.slice(0, 8000)}

Provide a summary in 2-3 paragraphs.`;

  return callOpenAI(prompt, systemPrompt);
}

export interface GeneratedFlashcard {
  question: string;
  answer: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export async function generateFlashcards(documentText: string, title: string, count: number = 6): Promise<GeneratedFlashcard[]> {
  const systemPrompt = `You are an expert educator creating study flashcards. Create flashcards that test understanding of key concepts, not just memorization. Each flashcard should have a clear question and comprehensive answer.`;

  const prompt = `Based on the following document titled "${title}", create ${count} study flashcards.

Document content:
${documentText.slice(0, 8000)}

Return ONLY a JSON array with this exact format (no markdown, no code blocks):
[
  {"question": "...", "answer": "...", "difficulty": "easy"},
  {"question": "...", "answer": "...", "difficulty": "medium"},
  {"question": "...", "answer": "...", "difficulty": "hard"}
]

Mix difficulties: 2 easy, 2 medium, 2 hard. Make questions thought-provoking and answers detailed.`;

  const response = await callOpenAI(prompt, systemPrompt);

  try {
    // Extract JSON array using regex
    const match = response.match(/\[[\s\S]*\]/);
    if (!match) {
      throw new Error('No JSON array found in response');
    }
    const parsed = JSON.parse(match[0]);
    return parsed.map((card: any) => ({
      question: card.question,
      answer: card.answer,
      difficulty: card.difficulty || 'medium',
    }));
  } catch (e) {
    console.error('Failed to parse flashcards:', e, '\nRaw response:', response);
    throw new Error('Failed to parse AI response. Please try again.');
  }
}

export interface GeneratedQuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export async function generateQuiz(documentText: string, title: string, count: number = 5): Promise<GeneratedQuizQuestion[]> {
  const systemPrompt = `You are an expert educator creating multiple-choice quiz questions. Create questions that test deep understanding. Each question should have 4 options with only one correct answer. Provide clear explanations for why the correct answer is right.`;

  const prompt = `Based on the following document titled "${title}", create ${count} multiple-choice quiz questions.

Document content:
${documentText.slice(0, 8000)}

Return ONLY a JSON array with this exact format (no markdown, no code blocks):
[
  {
    "question": "What is...?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 0,
    "explanation": "The correct answer is A because..."
  }
]

correctAnswer is the index (0-3) of the correct option. Make questions progressively harder.`;

  const response = await callOpenAI(prompt, systemPrompt);

  try {
    // Extract JSON array using regex
    const match = response.match(/\[[\s\S]*\]/);
    if (!match) {
      throw new Error('No JSON array found in response');
    }
    const parsed = JSON.parse(match[0]);
    return parsed.map((q: any) => ({
      question: q.question,
      options: q.options,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
    }));
  } catch (e) {
    console.error('Failed to parse quiz:', e, '\nRaw response:', response);
    throw new Error('Failed to parse AI response. Please try again.');
  }
}

import * as pdfjsLib from 'pdfjs-dist';

// Initialize PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.8.69/pdf.worker.min.mjs';

// Extract text from PDF using PDF.js with parallel page processing
export async function extractTextFromPDF(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const totalPages = pdf.numPages;

  const pageTexts: string[] = new Array(totalPages);

  const CONCURRENCY = 4;
  for (let start = 1; start <= totalPages; start += CONCURRENCY) {
    const end = Math.min(start + CONCURRENCY - 1, totalPages);
    const batch = [];
    for (let i = start; i <= end; i++) {
      batch.push(
        pdf.getPage(i).then(async (page: any) => {
          const textContent = await page.getTextContent();
          return textContent.items
            .map((item: any) => item.str || '')
            .join(' ');
        })
      );
    }
    const results = await Promise.all(batch);
    for (let i = 0; i < results.length; i++) {
      pageTexts[start - 1 + i] = results[i];
    }
  }

  return pageTexts.filter(Boolean).join('\n\n').trim();
}