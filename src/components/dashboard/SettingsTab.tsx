import { useState } from 'react';
import { User, Mail, Lock, Bell, Shield, Trash2, CreditCard, BookOpen, Crown, Key, Sparkles, CheckCircle2 } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Badge from '../ui/Badge';
import { useStore } from '../../store';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { getAIConfig, setAIConfig, clearAIConfig } from '../../lib/ai';

const OPENAI_MODELS = [
  { id: 'gpt-4o-mini', name: 'GPT-4o Mini (Fast & Cheap)' },
  { id: 'gpt-4o', name: 'GPT-4o (High Quality)' },
];

const OPENROUTER_MODELS = [
  { id: 'meta-llama/llama-3.3-70b-instruct:free', name: '⭐ Llama 3.3 70B (FREE)' },
  { id: 'qwen/qwen3-coder:free', name: '⭐ Qwen3 Coder (FREE)' },
  { id: 'meta-llama/llama-3.2-3b-instruct:free', name: '⭐ Llama 3.2 3B (FREE)' },
  { id: 'google/gemma-4-31b-it:free', name: '⭐ Gemma 4 31B (FREE)' },
  { id: 'google/gemini-2.5-flash', name: 'Gemini 2.5 Flash (paid)' },
  { id: 'openai/gpt-4o-mini', name: 'GPT-4o Mini via OR (paid)' },
];

const GEMINI_MODELS = [
  { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash' },
  { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro' },
  { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash' },
  { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro' },
];

export default function SettingsTab() {
  const { user, setUser, upgradePlan, openAIKey, setOpenAIKey, generateAIResponse } = useStore();
  const [isTesting, setIsTesting] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [apiKey, setApiKey] = useState(openAIKey || '');
  
  const [provider, setProvider] = useState<'openai' | 'openrouter' | 'gemini'>(() => {
    const savedConfig = getAIConfig();
    if (savedConfig?.provider) return savedConfig.provider;
    if (apiKey.startsWith('sk-or-')) return 'openrouter';
    if (apiKey.startsWith('AIza') || apiKey.startsWith('AQ.')) return 'gemini';
    return 'openai';
  });
  
  const [model, setModel] = useState<string>(() => {
    const savedConfig = getAIConfig();
    if (savedConfig?.model) return savedConfig.model;
    // Default to the free Llama model for OpenRouter
    if (provider === 'openrouter') return 'meta-llama/llama-3.3-70b-instruct:free';
    if (provider === 'gemini') return 'gemini-2.5-flash';
    return 'gpt-4o-mini';
  });

  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    weekly: true,
  });

  const hasAIKey = !!getAIConfig()?.apiKey;

  const handleKeyChange = (val: string) => {
    setApiKey(val);
    let newProvider: 'openai' | 'openrouter' | 'gemini' = 'openai';
    if (val.startsWith('sk-or-')) newProvider = 'openrouter';
    else if (val.startsWith('AIza') || val.startsWith('AQ.')) newProvider = 'gemini';
    
    setProvider(newProvider);
    if (newProvider === 'openrouter') setModel('meta-llama/llama-3.3-70b-instruct:free');
    else if (newProvider === 'gemini') setModel('gemini-2.5-flash');
    else setModel('gpt-4o-mini');
  };

  const saveAPIKey = () => {
    if (apiKey.trim()) {
      let detectedProvider: 'openai' | 'openrouter' | 'gemini' = 'openai';
      if (apiKey.trim().startsWith('sk-or-')) detectedProvider = 'openrouter';
      else if (apiKey.trim().startsWith('AIza') || apiKey.trim().startsWith('AQ.')) detectedProvider = 'gemini';
      
      setAIConfig({
        apiKey: apiKey.trim(),
        provider: detectedProvider,
        model: model
      });
      setOpenAIKey(apiKey.trim());
      toast.success('AI configuration saved!');
    }
  };

  const removeAPIKey = () => {
    clearAIConfig();
    setOpenAIKey(null);
    setApiKey('');
    toast.success('API key removed');
  };

  const handleTestAPI = async () => {
    setIsTesting(true);
    try {
      const res = await generateAIResponse("write a haiku about ai");
      const haiku = res.choices?.[0]?.message?.content || res.output || res.response || JSON.stringify(res).substring(0, 100);
      toast.success(`API Success: ${haiku}`, { duration: 6000 });
      console.log("OpenAI Response:", res);
    } catch (error: any) {
      toast.error(error.message || "Failed to connect to API");
    } finally {
      setIsTesting(false);
    }
  };

  const handleSave = () => {
    if (user) {
      setUser({ ...user, name, email });
      toast.success('Settings saved successfully');
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-surface-900">Settings</h1>
        <p className="text-surface-500 text-sm mt-1">Manage your account and preferences</p>
      </div>

      <div className="max-w-2xl space-y-8">
        {/* Profile Section */}
        <div className="p-6 rounded-xl bg-white border border-surface-200">
          <div className="flex items-center gap-2 mb-6">
            <User size={18} className="text-surface-500" />
            <h3 className="font-semibold text-surface-900">Profile</h3>
          </div>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-400 to-purple-500 flex items-center justify-center text-white text-xl font-bold">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <h4 className="font-medium text-surface-900">{user?.name}</h4>
              <p className="text-sm text-surface-500">{user?.email}</p>
              <div className="mt-1">
                {user?.plan === 'premium' ? (
                  <Badge variant="brand" size="md"><Crown size={12} className="mr-1" />Premium</Badge>
                ) : (
                  <Badge variant="default" size="md">Free Plan</Badge>
                )}
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <Input
              label="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              icon={<User size={16} />}
            />
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail size={16} />}
            />
            <div className="flex justify-end">
              <Button onClick={handleSave}>Save Changes</Button>
            </div>
          </div>
        </div>

        {/* Subscription Section */}
        <div className="p-6 rounded-xl bg-white border border-surface-200">
          <div className="flex items-center gap-2 mb-6">
            <CreditCard size={18} className="text-surface-500" />
            <h3 className="font-semibold text-surface-900">Subscription</h3>
          </div>
          
          {user?.plan === 'premium' ? (
            <div className="p-4 rounded-xl bg-gradient-to-r from-brand-50 to-purple-50 border border-brand-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-brand-100 flex items-center justify-center">
                    <Crown size={18} className="text-brand-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-surface-900">Premium Plan</h4>
                    <p className="text-sm text-surface-500">$12/month · Renews on Jan 15, 2026</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => toast('Manage billing in Stripe Customer Portal')}>
                  Manage
                </Button>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-surface-50 border border-surface-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-surface-200 flex items-center justify-center">
                    <BookOpen size={18} className="text-surface-500" />
                  </div>
                  <div>
                    <h4 className="font-medium text-surface-900">Free Plan</h4>
                    <p className="text-sm text-surface-500">Limited to 5 documents & 10 flashcard sets/month</p>
                  </div>
                </div>
                <Link to="/pricing">
                  <Button size="sm" onClick={() => { upgradePlan(); toast.success('Upgraded to Premium!'); }}>
                    Upgrade
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className="p-6 rounded-xl bg-white border border-surface-200">
          <div className="flex items-center gap-2 mb-6">
            <Bell size={18} className="text-surface-500" />
            <h3 className="font-semibold text-surface-900">Notifications</h3>
          </div>
          <div className="space-y-4">
            {[
              { key: 'email' as const, label: 'Email Notifications', desc: 'Receive email notifications when documents are processed' },
              { key: 'push' as const, label: 'Push Notifications', desc: 'Get push notifications for study reminders' },
              { key: 'weekly' as const, label: 'Weekly Summary', desc: 'Receive a weekly summary of your study progress' },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between py-2">
                <div>
                  <h4 className="text-sm font-medium text-surface-900">{item.label}</h4>
                  <p className="text-xs text-surface-500">{item.desc}</p>
                </div>
                <button
                  onClick={() => setNotifications({ ...notifications, [item.key]: !notifications[item.key] })}
                  className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${
                    notifications[item.key] ? 'bg-brand-600' : 'bg-surface-300'
                  }`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                    notifications[item.key] ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Security */}
        <div className="p-6 rounded-xl bg-white border border-surface-200">
          <div className="flex items-center gap-2 mb-6">
            <Shield size={18} className="text-surface-500" />
            <h3 className="font-semibold text-surface-900">Security</h3>
          </div>
          <div className="space-y-4">
            <Input
              label="Current Password"
              type="password"
              placeholder="••••••••"
              icon={<Lock size={16} />}
            />
            <Input
              label="New Password"
              type="password"
              placeholder="••••••••"
              icon={<Lock size={16} />}
            />
            <div className="flex justify-end">
              <Button variant="outline" onClick={() => toast.success('Password updated (demo)')}>
                Update Password
              </Button>
            </div>
          </div>
        </div>

        {/* AI Configuration */}
        <div className="p-6 rounded-xl bg-white border border-surface-200">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles size={18} className="text-brand-600" />
            <h3 className="font-semibold text-surface-900">AI Configuration</h3>
          </div>
          <div className="space-y-4">
            {hasAIKey ? (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-green-50 border border-green-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                        <CheckCircle2 size={18} className="text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-surface-900">
                          {getAIConfig()?.provider === 'openrouter' ? 'OpenRouter Connected' : getAIConfig()?.provider === 'gemini' ? 'Google Gemini Connected' : 'OpenAI Connected'}
                        </h4>
                        <p className="text-sm text-surface-500">API Key: ••••••••{openAIKey?.slice(-4)}</p>
                        <p className="text-xs text-surface-400 mt-0.5">
                          Model: <code className="bg-green-100/50 px-1 py-0.5 rounded text-green-700 font-mono text-[10px]">{getAIConfig()?.model || (getAIConfig()?.provider === 'openrouter' ? 'google/gemini-2.5-flash' : getAIConfig()?.provider === 'gemini' ? 'gemini-2.5-flash' : 'gpt-4o-mini')}</code>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={handleTestAPI} loading={isTesting}>
                        Test API
                      </Button>
                      <Button variant="outline" size="sm" onClick={removeAPIKey}>
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-surface-500 mb-2">Active Provider</label>
                    <div className="p-3 rounded-lg border border-surface-200 bg-surface-50 text-sm font-medium text-surface-700 capitalize">
                      {getAIConfig()?.provider || 'openai'}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-surface-500 mb-2">Model</label>
                    <select
                      value={model}
                      onChange={(e) => {
                        const newModel = e.target.value;
                        setModel(newModel);
                        if (apiKey) {
                          setAIConfig({
                            apiKey: apiKey.trim(),
                            provider: getAIConfig()?.provider || (apiKey.trim().startsWith('sk-or-') ? 'openrouter' : 'openai'),
                            model: newModel
                          });
                          toast.success(`Switched model to ${newModel}`);
                        }
                      }}
                      className="w-full px-3 py-2.5 rounded-lg border border-surface-200 bg-white text-sm text-surface-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                    >
                      {(getAIConfig()?.provider === 'openrouter' ? OPENROUTER_MODELS : getAIConfig()?.provider === 'gemini' ? GEMINI_MODELS : OPENAI_MODELS).map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-surface-500">
                  Connect your OpenAI or OpenRouter API key to enable AI-powered summaries, flashcards, and quizzes.
                </p>
                
                <div className="grid grid-cols-3 gap-2 p-1 bg-surface-100 rounded-lg">
                  <button
                    type="button"
                    onClick={() => {
                      setProvider('openai');
                      setModel('gpt-4o-mini');
                    }}
                    className={`py-2 text-sm font-medium rounded-md transition-all cursor-pointer ${
                      provider === 'openai'
                        ? 'bg-white text-surface-900 shadow-sm'
                        : 'text-surface-500 hover:text-surface-900'
                    }`}
                  >
                    OpenAI
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setProvider('openrouter');
                      setModel('meta-llama/llama-3.3-70b-instruct:free');
                    }}
                    className={`py-2 text-sm font-medium rounded-md transition-all cursor-pointer ${
                      provider === 'openrouter'
                        ? 'bg-white text-surface-900 shadow-sm'
                        : 'text-surface-500 hover:text-surface-900'
                    }`}
                  >
                    OpenRouter
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setProvider('gemini');
                      setModel('gemini-2.5-flash');
                    }}
                    className={`py-2 text-sm font-medium rounded-md transition-all cursor-pointer ${
                      provider === 'gemini'
                        ? 'bg-white text-surface-900 shadow-sm'
                        : 'text-surface-500 hover:text-surface-900'
                    }`}
                  >
                    Gemini
                  </button>
                </div>

                <Input
                  label={`${provider === 'openrouter' ? 'OpenRouter' : provider === 'gemini' ? 'Google Gemini' : 'OpenAI'} API Key`}
                  type="password"
                  placeholder={provider === 'openrouter' ? 'sk-or-v1-...' : provider === 'gemini' ? 'AIza... or AQ....' : 'sk-...'}
                  value={apiKey}
                  onChange={(e) => handleKeyChange(e.target.value)}
                  icon={<Key size={16} />}
                />

                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-1.5">Select Model</label>
                  <select
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg border border-surface-200 bg-white text-sm text-surface-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  >
                    {(provider === 'openrouter' ? OPENROUTER_MODELS : provider === 'gemini' ? GEMINI_MODELS : OPENAI_MODELS).map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="text-xs text-surface-500">
                  {provider === 'openrouter' ? (
                    <span>
                      Get your API key from{' '}
                      <a href="https://openrouter.ai/keys" target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:underline">
                        OpenRouter Platform →
                      </a>
                    </span>
                  ) : provider === 'gemini' ? (
                    <span>
                      Get your API key from{' '}
                      <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:underline">
                        Google AI Studio →
                      </a>
                    </span>
                  ) : (
                    <span>
                      Get your API key from{' '}
                      <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:underline">
                        OpenAI Platform →
                      </a>
                    </span>
                  )}
                </div>

                <div className="flex justify-end">
                  <Button onClick={saveAPIKey} disabled={!apiKey.trim()}>Save API Configuration</Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Danger Zone */}
        <div className="p-6 rounded-xl bg-white border border-red-200">
          <div className="flex items-center gap-2 mb-4">
            <Trash2 size={18} className="text-red-500" />
            <h3 className="font-semibold text-red-600">Danger Zone</h3>
          </div>
          <p className="text-sm text-surface-500 mb-4">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <Button variant="danger" size="sm" onClick={() => toast.error('Account deletion requires Supabase integration')}>
            Delete Account
          </Button>
        </div>
      </div>
    </div>
  );
}
