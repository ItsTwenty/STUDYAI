import { Link } from 'react-router-dom';
import { Check, Brain, ArrowRight, Sparkles } from 'lucide-react';
import Button from '../components/ui/Button';
import { useStore } from '../store';
import toast from 'react-hot-toast';

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for getting started with AI-powered studying.',
    features: [
      '5 document uploads per month',
      'Basic AI summaries',
      '10 flashcard sets per month',
      '5 quizzes per month',
      'Community support',
    ],
    limitations: [
      'No priority processing',
      'Limited AI model access',
    ],
    cta: 'Get Started Free',
    popular: false,
  },
  {
    name: 'Premium',
    price: '$12',
    period: '/month',
    description: 'Unlimited access to all AI study tools and features.',
    features: [
      'Unlimited document uploads',
      'Advanced AI summaries with key insights',
      'Unlimited flashcard sets',
      'Unlimited adaptive quizzes',
      'Priority AI processing',
      'Advanced analytics & progress tracking',
      'Export flashcards & quizzes',
      'Priority email support',
      'Early access to new features',
    ],
    limitations: [],
    cta: 'Start Premium Trial',
    popular: true,
  },
  {
    name: 'Team',
    price: '$29',
    period: '/month',
    description: 'For study groups and educational institutions.',
    features: [
      'Everything in Premium',
      'Up to 10 team members',
      'Shared document library',
      'Collaborative flashcard sets',
      'Team progress dashboard',
      'Admin controls',
      'SSO integration',
      'Dedicated support',
    ],
    limitations: [],
    cta: 'Contact Sales',
    popular: false,
  },
];

export default function PricingPage() {
  const { isAuthenticated, upgradePlan } = useStore();

  const handleUpgrade = (planName: string) => {
    if (planName === 'Premium') {
      if (isAuthenticated) {
        upgradePlan();
        toast.success('Upgraded to Premium! (Demo mode)');
      } else {
        toast('Sign up to get started!');
      }
    } else if (planName === 'Team') {
      toast('Team plan - Contact sales@clevra.com');
    }
  };

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
              <span className="text-lg font-bold text-surface-900">Clevra</span>
            </Link>
            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                <Link to="/dashboard">
                  <Button size="sm">Dashboard</Button>
                </Link>
              ) : (
                <>
                  <Link to="/login"><Button variant="ghost" size="sm">Log in</Button></Link>
                  <Link to="/signup"><Button size="sm">Get Started</Button></Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 text-brand-700 text-sm font-medium mb-6">
            <Sparkles size={14} />
            Simple Pricing
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-surface-900 mb-4">
            Choose the perfect plan for your studies
          </h1>
          <p className="text-lg text-surface-500 max-w-2xl mx-auto">
            Start free and upgrade when you need more. All plans include our core AI features.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl p-8 ${
                plan.popular
                  ? 'bg-surface-900 text-white border-2 border-brand-500 shadow-2xl shadow-brand-500/10 scale-105'
                  : 'bg-white border border-surface-200'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="px-4 py-1.5 rounded-full bg-brand-600 text-white text-xs font-semibold shadow-lg">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="mb-6">
                <h3 className={`text-lg font-semibold mb-2 ${plan.popular ? 'text-white' : 'text-surface-900'}`}>
                  {plan.name}
                </h3>
                <div className="flex items-baseline gap-1">
                  <span className={`text-4xl font-bold ${plan.popular ? 'text-white' : 'text-surface-900'}`}>
                    {plan.price}
                  </span>
                  <span className={`text-sm ${plan.popular ? 'text-white/60' : 'text-surface-400'}`}>
                    {plan.period}
                  </span>
                </div>
                <p className={`mt-3 text-sm ${plan.popular ? 'text-white/70' : 'text-surface-500'}`}>
                  {plan.description}
                </p>
              </div>

              {plan.name === 'Free' ? (
                <Link to="/signup">
                  <Button
                    variant={plan.popular ? 'primary' : 'outline'}
                    size="lg"
                    className={`w-full mb-8 ${plan.popular ? 'bg-brand-600 hover:bg-brand-500' : ''}`}
                  >
                    {plan.cta} <ArrowRight size={16} />
                  </Button>
                </Link>
              ) : (
                <Button
                  variant={plan.popular ? 'primary' : 'outline'}
                  size="lg"
                  className={`w-full mb-8 ${plan.popular ? 'bg-brand-600 hover:bg-brand-500' : ''}`}
                  onClick={() => handleUpgrade(plan.name)}
                >
                  {plan.cta} <ArrowRight size={16} />
                </Button>
              )}

              <div className="space-y-3">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-3">
                    <Check size={16} className={`mt-0.5 flex-shrink-0 ${plan.popular ? 'text-brand-400' : 'text-green-500'}`} />
                    <span className={`text-sm ${plan.popular ? 'text-white/80' : 'text-surface-600'}`}>
                      {feature}
                    </span>
                  </div>
                ))}
                {plan.limitations.map((limitation) => (
                  <div key={limitation} className="flex items-start gap-3 opacity-50">
                    <span className={`mt-0.5 flex-shrink-0 w-4 h-4 flex items-center justify-center text-xs ${plan.popular ? 'text-white/40' : 'text-surface-300'}`}>
                      ✕
                    </span>
                    <span className={`text-sm ${plan.popular ? 'text-white/40' : 'text-surface-400'}`}>
                      {limitation}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-surface-50 border-t border-surface-100">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-surface-900 text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {[
              { q: 'Can I cancel my subscription anytime?', a: 'Yes, you can cancel your subscription at any time. You will continue to have access to Premium features until the end of your billing period.' },
              { q: 'What file formats are supported?', a: 'We currently support PDF files up to 50MB. Support for DOCX, PPTX, and EPUB is coming soon.' },
              { q: 'How accurate are the AI-generated materials?', a: 'Our AI uses state-of-the-art language models to generate highly accurate study materials. We recommend reviewing generated content for critical studies.' },
              { q: 'Is my data secure?', a: 'Yes. All documents are encrypted at rest and in transit. We never share your data with third parties. You can delete your data at any time.' },
            ].map((faq) => (
              <div key={faq.q} className="p-6 rounded-xl bg-white border border-surface-200">
                <h3 className="font-semibold text-surface-900 mb-2">{faq.q}</h3>
                <p className="text-surface-500 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-surface-100 py-8 px-4 text-center text-sm text-surface-400">
        © 2025 Clevra. All rights reserved.
      </footer>
    </div>
  );
}
