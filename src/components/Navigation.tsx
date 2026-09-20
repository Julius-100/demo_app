import React from 'react';
import { ActiveTab, UserProfile } from '../types';
import { Home, Activity, Apple, TrendingUp, User, ShieldAlert, Baby, Sun, Moon } from 'lucide-react';

interface NavigationProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenEmergency: () => void;
  profile: UserProfile | null;
  darkMode?: boolean;
  onToggleDarkMode?: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  setActiveTab,
  onOpenEmergency,
  profile,
  darkMode = false,
  onToggleDarkMode,
}) => {
  const navItems: { id: ActiveTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'symptoms', label: 'Symptoms', icon: Activity },
    { id: 'nutrition', label: 'Nutrition', icon: Apple },
    { id: 'trends', label: 'Trends', icon: TrendingUp },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <>
      {/* Top Header Bar for both Mobile & Desktop */}
      <header className="sticky top-0 z-30 bg-white/95 dark:bg-[#121419]/95 backdrop-blur-md border-b border-stone-200/90 dark:border-[#22252e] shadow-2xs transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center space-x-2.5 text-left group cursor-pointer focus:outline-none"
              aria-label="Go to Dashboard"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-500 to-rose-400 text-white flex items-center justify-center shadow-xs">
                <Baby className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-stone-900 dark:text-stone-100 text-base tracking-tight block font-display">
                  Pregnancy Wellness
                </span>
                {profile && (
                  <span className="text-[11px] font-medium text-stone-500 dark:text-stone-400 block leading-tight">
                    Week {profile.pregnancyWeek} &bull; {profile.pregnancyStatus}
                  </span>
                )}
              </div>
            </button>
          </div>

          {/* Desktop Horizontal Navigation */}
          <nav className="hidden md:flex items-center space-x-1" aria-label="Main Navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`desktop-nav-${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 font-semibold shadow-2xs'
                      : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-[#1d2028]'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-rose-600 dark:text-rose-400' : 'text-stone-500 dark:text-stone-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Header Controls: Dark Mode Toggle & Emergency button */}
          <div className="flex items-center space-x-2">
            {onToggleDarkMode && (
              <button
                id="theme-toggle-btn"
                onClick={onToggleDarkMode}
                className="p-2 rounded-xl border border-stone-200 dark:border-stone-700/80 bg-stone-50 dark:bg-[#1a1c23] text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-[#232732] transition-colors cursor-pointer"
                title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                aria-label={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {darkMode ? (
                  <Sun className="w-4 h-4 text-amber-400" />
                ) : (
                  <Moon className="w-4 h-4 text-stone-600" />
                )}
              </button>
            )}

            <button
              id="top-emergency-help-btn"
              onClick={onOpenEmergency}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 border border-rose-200 dark:border-rose-900/50 text-rose-800 dark:text-rose-300 text-xs sm:text-sm font-semibold rounded-xl transition-colors shadow-2xs focus:outline-none focus:ring-2 focus:ring-rose-400 cursor-pointer"
              title="Medical Safety & Emergency Resources"
            >
              <ShieldAlert className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
              <span className="hidden sm:inline">Emergency Help</span>
              <span className="sm:hidden">Help</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Persistent Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#121419]/95 backdrop-blur-md border-t border-stone-200/90 dark:border-[#22252e] shadow-lg safe-area-bottom transition-colors">
        <nav className="grid grid-cols-5 h-16" aria-label="Mobile Bottom Navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`mobile-nav-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center justify-center py-1 transition-colors min-h-[44px] cursor-pointer ${
                  isActive 
                    ? 'text-rose-600 dark:text-rose-400 font-semibold' 
                    : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                <div className={`p-1 rounded-lg ${isActive ? 'bg-rose-50 dark:bg-rose-950/50' : ''}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[11px] leading-tight mt-0.5">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </>
  );
};

