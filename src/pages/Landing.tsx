import { Link } from 'react-router-dom';
import {
  Sparkles, FileText, Brain, GraduationCap, Zap, Shield, BarChart3,
  ArrowRight, Star, ChevronRight, Layers
} from 'lucide-react';
import Button from '../components/ui/Button';

const features = [
  { icon: FileText, title: 'PDF Upload & Processing', description: 'Upload any PDF document and our AI will extract, analyze, and organize the content intelligently.' },
  { icon: Sparkles, title: 'AI Summaries', description: 'Get concise, accurate summaries of your documents in seconds. Focus on what matters most.' },
  { icon: Brain, title: 'Smart Flashcards', description: 'Auto-generated flashcards with spaced repetition. Master any subject faster than ever.' },
  { icon: GraduationCap, title: 'Adaptive Quizzes', description: 'AI-powered quizzes that adapt to your knowledge level and help identify weak areas.' },
  { icon: BarChart3, title: 'Progress Tracking', description: 'Detailed analytics and insights into your study patterns and knowledge retention.' },
  { icon: Shield, title: 'Secure & Private', description: 'Your documents and data are encrypted and never shared. Study with confidence.' },
];

const testimonials = [
  { name: 'Sarah Chen', role: 'Medical Student', text: 'StudyAI cut my study time in half. The AI-generated flashcards are incredibly accurate and the quizzes really test my understanding.', rating: 5 },
  { name: 'Marcus Johnson', role: 'Law Student', text: 'I upload my case briefs and get instant summaries and study materials. This is a game-changer for law school.', rating: 5 },
  { name: 'Priya Patel', role: 'PhD Researcher', text: 'The summary feature alone is worth the subscription. It helps me quickly review papers and identify key findings.', rating: 5 },
];

const stats = [
  { value: '50K+', label: 'Active Students' },
  { value: '2M+', label: 'Documents Processed' },
  { value: '10M+', label: 'Flashcards Generated' },
  { value: '98%', label: 'Satisfaction Rate' },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-surface-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-brand-700 rounded-lg flex items-center justify-center">
                <Brain size={16} className="text-white" />
              </div>
              <span className="text-lg font-bold text-surface-900">StudyAI</span>
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-surface-500 hover:text-surface-900 transition-colors">Features</a>
              <a href="#testimonials" className="text-sm text-surface-500 hover:text-surface-900 transition-colors">Testimonials</a>
              <Link to="/pricing" className="text-sm text-surface-500 hover:text-surface-900 transition-colors">Pricing</Link>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/login">
                <Button variant="ghost" size="sm">Log in</Button>
              </Link>
              <Link to="/signup">
                <Button size="sm">Get Started <ArrowRight size={14} /></Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-50/50 to-transparent" />
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-brand-200/30 rounded-full blur-3xl" />
        <div className="absolute top-40 right-1/4 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl" />
        
        <div className="max-w-7xl mx-auto relative grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-left lg:pr-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 border border-brand-100 text-brand-700 text-sm font-medium mb-8">
              <Zap size={14} />
              <span>AI-Powered Study Revolution</span>
              <ChevronRight size={14} />
            </div>
            
            <h1 className="text-5xl sm:text-6xl font-bold text-surface-950 tracking-tight leading-[1.1] mb-6">
              Study smarter with
              <span className="bg-gradient-to-r from-brand-600 to-purple-600 bg-clip-text text-transparent"> artificial intelligence</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-surface-500 max-w-xl mb-10 leading-relaxed">
              Upload your documents and let AI generate summaries, flashcards, and quizzes. 
              The most efficient way to learn, retain, and master any subject.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center sm:justify-start justify-center gap-4 mb-16">
              <Link to="/signup">
                <Button size="lg" className="min-w-[200px]">
                  Start for Free <ArrowRight size={16} />
                </Button>
              </Link>
              <a href="#features">
                <Button variant="outline" size="lg" className="min-w-[200px]">
                  See How It Works
                </Button>
              </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat) => (
                <div key={stat.label} className="text-left">
                  <div className="text-2xl sm:text-3xl font-bold text-surface-900">{stat.value}</div>
                  <div className="text-sm text-surface-500 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-surface-200 mt-12 lg:mt-0 aspect-[4/3]">
            <img src="/hero.jpg" alt="Student studying online" className="w-full h-full object-cover absolute inset-0" />
          </div>
        </div>

        {/* App Preview */}
        <div className="max-w-5xl mx-auto mt-20 relative">
          <div className="bg-surface-900 rounded-2xl shadow-2xl shadow-surface-900/20 overflow-hidden border border-surface-800">
            <div className="flex items-center gap-2 px-4 py-3 bg-surface-800/50 border-b border-surface-700">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="px-4 py-1 rounded-md bg-surface-700/50 text-surface-400 text-xs">app.studyai.com/dashboard</div>
              </div>
            </div>
            <div className="p-6 sm:p-8">
              <div className="grid grid-cols-12 gap-4">
                {/* Sidebar mock */}
                <div className="col-span-3 space-y-3 hidden md:block">
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-brand-600/20 text-brand-400 text-sm">
                    <Layers size={14} />
                    <span>Documents</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2 text-surface-500 text-sm">
                    <Brain size={14} />
                    <span>Flashcards</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2 text-surface-500 text-sm">
                    <GraduationCap size={14} />
                    <span>Quizzes</span>
                  </div>
                </div>
                {/* Content mock */}
                <div className="col-span-12 md:col-span-9 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-white font-semibold">Recent Documents</h3>
                    <div className="px-3 py-1.5 rounded-lg bg-brand-600 text-white text-xs font-medium">+ Upload PDF</div>
                  </div>
                  {['Organic Chemistry Ch.4', 'Machine Learning Basics', 'World History Notes'].map((title, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-surface-800/50 border border-surface-700/50">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-500/20 to-purple-500/20 flex items-center justify-center">
                        <FileText size={16} className="text-brand-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-white text-sm font-medium">{title}</div>
                        <div className="text-surface-500 text-xs">
                          {i === 0 ? '3 flashcard sets · 2 quizzes' : i === 1 ? '1 summary · 5 flashcard sets' : '2 summaries · 1 quiz'}
                        </div>
                      </div>
                      <div className={`px-2 py-1 rounded text-xs font-medium ${i === 0 ? 'bg-green-500/20 text-green-400' : i === 1 ? 'bg-brand-500/20 text-brand-400' : 'bg-amber-500/20 text-amber-400'}`}>
                        {i === 0 ? 'Ready' : i === 1 ? 'Processing' : 'New'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="absolute -inset-4 bg-gradient-to-t from-white via-transparent to-transparent pointer-events-none" />
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 bg-surface-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 text-brand-700 text-sm font-medium mb-4">
              <Sparkles size={14} />
              Features
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-surface-900 mb-4">Everything you need to ace your studies</h2>
            <p className="text-surface-500 text-lg max-w-2xl mx-auto">Powerful AI tools designed to transform how you learn, study, and retain information.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div key={feature.title} className="group p-6 rounded-2xl bg-white border border-surface-200 hover:border-brand-200 hover:shadow-lg hover:shadow-brand-500/5 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center mb-4 group-hover:bg-brand-100 transition-colors">
                  <feature.icon size={22} className="text-brand-600" />
                </div>
                <h3 className="text-lg font-semibold text-surface-900 mb-2">{feature.title}</h3>
                <p className="text-surface-500 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-surface-900 mb-4">How it works</h2>
            <p className="text-surface-500 text-lg">Three simple steps to supercharge your learning</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Upload Document', description: 'Drag and drop your PDF files. We support documents up to 50MB with instant processing.', icon: FileText },
              { step: '02', title: 'AI Analysis', description: 'Our AI reads and analyzes your document, extracting key concepts, definitions, and relationships.', icon: Sparkles },
              { step: '03', title: 'Study & Learn', description: 'Use generated summaries, flashcards, and quizzes to study efficiently and track your progress.', icon: GraduationCap },
            ].map((item) => (
              <div key={item.step} className="relative text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white text-xl font-bold mb-6 shadow-lg shadow-brand-500/20">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-surface-900 mb-3">{item.title}</h3>
                <p className="text-surface-500 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 px-4 sm:px-6 lg:px-8 bg-surface-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-surface-900 mb-4">Loved by students worldwide</h2>
            <p className="text-surface-500 text-lg">See what our users are saying about StudyAI</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <div key={testimonial.name} className="p-6 rounded-2xl bg-white border border-surface-200">
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} size={16} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-surface-600 mb-6 leading-relaxed">"{testimonial.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-400 to-purple-500 flex items-center justify-center text-white font-semibold text-sm">
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-surface-900">{testimonial.name}</div>
                    <div className="text-xs text-surface-500">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="rounded-3xl bg-gradient-to-br from-brand-600 to-purple-700 relative overflow-hidden flex flex-col md:flex-row items-center shadow-2xl">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
            
            <div className="relative p-12 md:w-1/2 text-left">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Ready to transform your studying?</h2>
              <p className="text-white/80 text-lg mb-8 max-w-xl">Join thousands of students who are already studying smarter with AI. Start for free today.</p>
              <Link to="/signup">
                <Button size="lg" className="bg-white text-brand-700 hover:bg-surface-50 min-w-[200px] shadow-xl">
                  Get Started Free <ArrowRight size={16} />
                </Button>
              </Link>
            </div>
            
            <div className="relative md:w-1/2 h-full min-h-[300px] md:min-h-[400px]">
              <img src="/collaborating.jpg" alt="Students collaborating" className="absolute inset-0 w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-surface-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-brand-700 rounded-lg flex items-center justify-center">
                <Brain size={16} className="text-white" />
              </div>
              <span className="text-lg font-bold text-surface-900">StudyAI</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-surface-500">
              <a href="#features" className="hover:text-surface-900 transition-colors">Features</a>
              <Link to="/pricing" className="hover:text-surface-900 transition-colors">Pricing</Link>
              <a href="#" className="hover:text-surface-900 transition-colors">Privacy</a>
              <a href="#" className="hover:text-surface-900 transition-colors">Terms</a>
            </div>
            <p className="text-sm text-surface-400">© 2025 StudyAI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
