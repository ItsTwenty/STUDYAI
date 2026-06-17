import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { useStore } from '../store';
import Sidebar from '../components/dashboard/Sidebar';
import DocumentsTab from '../components/dashboard/DocumentsTab';
import FlashcardsTab from '../components/dashboard/FlashcardsTab';
import QuizzesTab from '../components/dashboard/QuizzesTab';
import AnalyticsTab from '../components/dashboard/AnalyticsTab';
import SettingsTab from '../components/dashboard/SettingsTab';

export default function Dashboard() {
  const { isAuthenticated, activeTab, sidebarOpen } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const renderTab = () => {
    switch (activeTab) {
      case 'documents':
        return <DocumentsTab />;
      case 'flashcards':
        return <FlashcardsTab />;
      case 'quizzes':
        return <QuizzesTab />;
      case 'analytics':
        return <AnalyticsTab />;
      case 'settings':
        return <SettingsTab />;
      default:
        return <DocumentsTab />;
    }
  };

  return (
    <div className="flex h-screen bg-surface-50 overflow-hidden">
      {/* Desktop Sidebar */}
      {sidebarOpen && (
        <div className="hidden lg:block w-64 flex-shrink-0">
          <Sidebar />
        </div>
      )}

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <div className="relative w-72 h-full animate-fade-in">
            <Sidebar mobile onClose={() => setMobileMenuOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Bar */}
        <div className="flex items-center gap-4 px-4 sm:px-6 lg:px-8 h-16 bg-white border-b border-surface-100 flex-shrink-0">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-surface-100 text-surface-500 cursor-pointer"
          >
            <Menu size={20} />
          </button>
          {!sidebarOpen && (
            <button
              onClick={() => useStore.getState().setSidebarOpen(true)}
              className="hidden lg:block p-2 rounded-lg hover:bg-surface-100 text-surface-500 cursor-pointer"
            >
              <Menu size={20} />
            </button>
          )}
          <div className="flex-1" />
          <div className="text-xs text-surface-400 hidden sm:block">
            Press <kbd className="px-1.5 py-0.5 rounded bg-surface-100 border border-surface-200 font-mono text-surface-500">⌘K</kbd> to search
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto">
            {renderTab()}
          </div>
        </div>
      </div>
    </div>
  );
}
