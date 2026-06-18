import { Link, useNavigate } from 'react-router-dom';
import {
  FileText, Brain, GraduationCap, BarChart3,
  Settings, LogOut, CreditCard, ChevronLeft, Sparkles, X,
} from 'lucide-react';
import { useStore } from '../../store';
import Badge from '../ui/Badge';
import { cn } from '../../utils/cn';

interface SidebarProps {
  mobile?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ mobile, onClose }: SidebarProps) {
  const { user, activeTab, setActiveTab, logout, sidebarOpen, setSidebarOpen } = useStore();
  const navigate = useNavigate();

  const menuItems = [
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'flashcards', label: 'Flashcards', icon: Brain },
    { id: 'quizzes', label: 'Quizzes', icon: GraduationCap },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const content = (
    <div className="flex flex-col h-full bg-white border-r border-surface-100">
      {/* Logo */}
      <div className="flex items-center justify-between px-4 h-16 border-b border-surface-100">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-brand-700 rounded-lg flex items-center justify-center">
            <Brain size={16} className="text-white" />
          </div>
          <span className="text-lg font-bold text-surface-900">Clevra</span>
        </Link>
        {mobile ? (
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-surface-100 text-surface-400 cursor-pointer">
            <X size={18} />
          </button>
        ) : (
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1.5 rounded-lg hover:bg-surface-100 text-surface-400 cursor-pointer">
            <ChevronLeft size={18} />
          </button>
        )}
      </div>

      {/* Menu */}
      <div className="flex-1 py-4 px-3 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => { setActiveTab(item.id); onClose?.(); }}
            className={cn(
              'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer',
              activeTab === item.id
                ? 'bg-brand-50 text-brand-700'
                : 'text-surface-500 hover:bg-surface-50 hover:text-surface-700'
            )}
          >
            <item.icon size={18} />
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      {/* Upgrade Card */}
      {user?.plan === 'free' && (
        <div className="mx-3 mb-4 p-4 rounded-xl bg-gradient-to-br from-brand-50 to-purple-50 border border-brand-100">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={16} className="text-brand-600" />
            <span className="text-sm font-semibold text-brand-900">Upgrade to Premium</span>
          </div>
          <p className="text-xs text-brand-700/70 mb-3">Unlock unlimited AI features and priority processing.</p>
          <Link to="/pricing" onClick={onClose}>
            <button className="w-full px-3 py-2 rounded-lg bg-brand-600 text-white text-xs font-medium hover:bg-brand-700 transition-colors cursor-pointer">
              View Plans
            </button>
          </Link>
        </div>
      )}

      {/* Bottom Menu */}
      <div className="border-t border-surface-100 py-3 px-3 space-y-1">
        <Link to="/pricing" onClick={onClose}>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-surface-500 hover:bg-surface-50 hover:text-surface-700 transition-colors cursor-pointer">
            <CreditCard size={18} />
            <span>Billing</span>
            {user?.plan === 'premium' && <Badge variant="brand">PRO</Badge>}
          </button>
        </Link>
        <button
          onClick={() => { setActiveTab('settings'); onClose?.(); }}
          className={cn(
            'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors cursor-pointer',
            activeTab === 'settings'
              ? 'bg-brand-50 text-brand-700 font-medium'
              : 'text-surface-500 hover:bg-surface-50 hover:text-surface-700'
          )}
        >
          <Settings size={18} />
          <span>Settings</span>
        </button>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-surface-500 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
        >
          <LogOut size={18} />
          <span>Log Out</span>
        </button>
      </div>

      {/* User */}
      <div className="border-t border-surface-100 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-purple-500 flex items-center justify-center text-white text-sm font-medium">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-surface-900 truncate">{user?.name}</div>
            <div className="text-xs text-surface-400 truncate">{user?.email}</div>
          </div>
        </div>
      </div>
    </div>
  );

  return content;
}
