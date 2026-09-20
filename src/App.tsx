import React, { useState, useEffect } from 'react';
import { UserProfile, SymptomEntry, MealEntry, HydrationEntry, ReminderItem, ActiveTab } from './types';
import { 
  getStoredProfile, 
  saveStoredProfile, 
  getStoredSymptoms, 
  saveStoredSymptom, 
  deleteStoredSymptom, 
  getStoredMeals, 
  saveStoredMeal, 
  deleteStoredMeal, 
  getStoredHydration, 
  addStoredWaterCup, 
  removeLastStoredWaterCup, 
  getStoredReminders, 
  saveStoredReminder, 
  deleteStoredReminder, 
  seedInitialDataIfRequested, 
  clearAllStoredData,
  safeGetItem,
  safeSetItem
} from './utils/storage';
import { Navigation } from './components/Navigation';
import { OnboardingModal } from './components/OnboardingModal';
import { EmergencyModal } from './components/EmergencyModal';
import { DashboardView } from './components/DashboardView';
import { SymptomsView } from './components/SymptomsView';
import { NutritionView } from './components/NutritionView';
import { TrendsView } from './components/TrendsView';
import { ProfileView } from './components/ProfileView';

export default function App() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [symptoms, setSymptoms] = useState<SymptomEntry[]>([]);
  const [meals, setMeals] = useState<MealEntry[]>([]);
  const [hydration, setHydration] = useState<HydrationEntry[]>([]);
  const [reminders, setReminders] = useState<ReminderItem[]>([]);
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);
  const [isQuickLogSymptomOpen, setIsQuickLogSymptomOpen] = useState(false);
  const [isQuickLogMealOpen, setIsQuickLogMealOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Dark mode state with persistence and system preference fallback
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      const saved = safeGetItem('pregnancy_wellness_theme_v1');
      if (saved) return saved === 'dark';
      return typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      if (darkMode) {
        document.documentElement.classList.add('dark');
        safeSetItem('pregnancy_wellness_theme_v1', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        safeSetItem('pregnancy_wellness_theme_v1', 'light');
      }
    } catch (e) {
      console.warn('Could not persist theme:', e);
    }
  }, [darkMode]);

  // Load stored data on mount
  useEffect(() => {
    const existingProfile = getStoredProfile();
    if (existingProfile && existingProfile.acknowledgedDisclaimer) {
      setProfile(existingProfile);
      setSymptoms(getStoredSymptoms());
      setMeals(getStoredMeals());
      setHydration(getStoredHydration());
      setReminders(getStoredReminders());
    } else {
      // If first time, seed initial data for Julius demo
      const seeded = seedInitialDataIfRequested();
      setProfile(seeded.profile);
      setSymptoms(seeded.symptoms);
      setMeals(seeded.meals);
      setHydration(seeded.hydration);
      setReminders(getStoredReminders());
    }
    setIsLoading(false);
  }, []);

  const handleCompleteOnboarding = (newProfile: UserProfile) => {
    saveStoredProfile(newProfile);
    setProfile(newProfile);
  };

  const handleSeedDemo = () => {
    const seeded = seedInitialDataIfRequested();
    setProfile(seeded.profile);
    setSymptoms(seeded.symptoms);
    setMeals(seeded.meals);
    setHydration(seeded.hydration);
    setReminders(getStoredReminders());
  };

  const handleSaveSymptom = (entry: SymptomEntry) => {
    const updated = saveStoredSymptom(entry);
    setSymptoms(updated);
    setIsQuickLogSymptomOpen(false);
  };

  const handleDeleteSymptom = (id: string) => {
    const updated = deleteStoredSymptom(id);
    setSymptoms(updated);
  };

  const handleSaveMeal = (entry: MealEntry) => {
    const updated = saveStoredMeal(entry);
    setMeals(updated);
    setIsQuickLogMealOpen(false);
  };

  const handleDeleteMeal = (id: string) => {
    const updated = deleteStoredMeal(id);
    setMeals(updated);
  };

  const handleAddWater = (amount: number = 1) => {
    const updated = addStoredWaterCup(amount);
    setHydration(updated);
  };

  const handleRemoveWater = () => {
    const updated = removeLastStoredWaterCup();
    setHydration(updated);
  };

  const handleUpdateProfile = (updated: UserProfile) => {
    saveStoredProfile(updated);
    setProfile(updated);
  };

  const handleSaveReminder = (item: ReminderItem) => {
    const updated = saveStoredReminder(item);
    setReminders(updated);
  };

  const handleToggleReminder = (id: string, enabled: boolean) => {
    const item = reminders.find(r => r.id === id);
    if (item) {
      const updated = saveStoredReminder({ ...item, enabled });
      setReminders(updated);
    }
  };

  const handleDeleteReminder = (id: string) => {
    const updated = deleteStoredReminder(id);
    setReminders(updated);
  };

  const handleDeleteAllData = () => {
    clearAllStoredData();
    setProfile(null);
    setSymptoms([]);
    setMeals([]);
    setHydration([]);
    setReminders([]);
    setActiveTab('dashboard');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
        <div className="text-center space-y-2">
          <div className="w-10 h-10 border-3 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-medium text-stone-600">Loading your pregnancy companion...</p>
        </div>
      </div>
    );
  }

  // Show onboarding if no profile or not acknowledged
  if (!profile || !profile.acknowledgedDisclaimer) {
    return (
      <OnboardingModal
        onComplete={handleCompleteOnboarding}
        onSeedDemo={handleSeedDemo}
      />
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-[#0f1115] text-stone-100' : 'bg-stone-50/80 text-stone-900'} flex flex-col font-sans selection:bg-rose-500/20 selection:text-rose-500 transition-colors duration-200`}>
      {/* Top Header & Mobile Navigation */}
      <Navigation
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setIsQuickLogSymptomOpen(false);
          setIsQuickLogMealOpen(false);
        }}
        onOpenEmergency={() => setIsEmergencyOpen(true)}
        profile={profile}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode((prev) => !prev)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 pt-5">
        {activeTab === 'dashboard' && (
          <DashboardView
            profile={profile}
            symptoms={symptoms}
            meals={meals}
            hydration={hydration}
            onQuickLogSymptom={() => {
              setActiveTab('symptoms');
              setIsQuickLogSymptomOpen(true);
            }}
            onQuickLogMeal={() => {
              setActiveTab('nutrition');
              setIsQuickLogMealOpen(true);
            }}
            onAddWater={handleAddWater}
            onRemoveWater={handleRemoveWater}
            onNavigateTab={setActiveTab}
            onOpenEmergency={() => setIsEmergencyOpen(true)}
          />
        )}

        {activeTab === 'symptoms' && (
          <SymptomsView
            symptoms={symptoms}
            onSaveSymptom={handleSaveSymptom}
            onDeleteSymptom={handleDeleteSymptom}
            isQuickLogOpenInitially={isQuickLogSymptomOpen}
            onOpenEmergency={() => setIsEmergencyOpen(true)}
          />
        )}

        {activeTab === 'nutrition' && (
          <NutritionView
            profile={profile}
            meals={meals}
            hydration={hydration}
            onSaveMeal={handleSaveMeal}
            onDeleteMeal={handleDeleteMeal}
            onAddWater={handleAddWater}
            onRemoveWater={handleRemoveWater}
            isQuickLogOpenInitially={isQuickLogMealOpen}
          />
        )}

        {activeTab === 'trends' && (
          <TrendsView
            symptoms={symptoms}
            meals={meals}
            hydration={hydration}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileView
            profile={profile}
            reminders={reminders}
            onUpdateProfile={handleUpdateProfile}
            onSaveReminder={handleSaveReminder}
            onToggleReminder={handleToggleReminder}
            onDeleteReminder={handleDeleteReminder}
            onDeleteAllData={handleDeleteAllData}
            onOpenEmergency={() => setIsEmergencyOpen(true)}
          />
        )}
      </main>

      {/* Emergency & Red-Flag Guidance Modal */}
      <EmergencyModal
        isOpen={isEmergencyOpen}
        onClose={() => setIsEmergencyOpen(false)}
        profile={profile}
      />
    </div>
  );
}
