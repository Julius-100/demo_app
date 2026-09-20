import React, { useState } from 'react';
import { UserProfile, SymptomEntry, MealEntry, HydrationEntry, ActiveTab } from '../types';
import { getGreeting, getTodayDateString } from '../utils/pregnancyCalculations';
import { DAILY_WELLNESS_MESSAGES } from '../data/educationData';
import { FetalDevelopmentCard } from './FetalDevelopmentCard';
import { DailyWellnessGraphics } from './DailyWellnessGraphics';
import { 
  Activity, 
  Apple, 
  Droplet, 
  BookOpen, 
  Plus, 
  ShieldAlert, 
  Sparkles, 
  ChevronRight,
  Info
} from 'lucide-react';

interface DashboardViewProps {
  profile: UserProfile;
  symptoms: SymptomEntry[];
  meals: MealEntry[];
  hydration: HydrationEntry[];
  onQuickLogSymptom: () => void;
  onQuickLogMeal: () => void;
  onAddWater: (amount?: number) => void;
  onRemoveWater?: () => void;
  onNavigateTab: (tab: ActiveTab) => void;
  onOpenEmergency: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  profile,
  symptoms,
  meals,
  hydration,
  onQuickLogSymptom,
  onQuickLogMeal,
  onAddWater,
  onRemoveWater,
  onNavigateTab,
  onOpenEmergency,
}) => {
  const [wellnessTipIndex, setWellnessTipIndex] = useState(0);

  const todayStr = getTodayDateString();
  const todaysSymptoms = symptoms.filter((s) => s.date === todayStr);
  const todaysMeals = meals.filter((m) => m.date === todayStr);
  const todaysHydration = hydration.filter((h) => h.date === todayStr);
  const todayWaterCups = todaysHydration.reduce((acc, curr) => acc + curr.amount, 0);

  // Count unique food groups logged today
  const todaysFoodGroups = new Set<string>();
  todaysMeals.forEach((meal) => {
    meal.foodGroups?.forEach((fg) => todaysFoodGroups.add(fg));
  });

  const nextTip = () => {
    setWellnessTipIndex((prev) => (prev + 1) % DAILY_WELLNESS_MESSAGES.length);
  };

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Header Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400 font-display">
            Daily Wellness Overview
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight font-display">
            {getGreeting(profile.name)}
          </h1>
          <p className="text-sm text-stone-600 dark:text-stone-300 mt-0.5">
            Your supportive gestational companion for Week {profile.pregnancyWeek}.
          </p>
        </div>

        <button
          onClick={onOpenEmergency}
          className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3.5 py-2 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-900/50 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
        >
          <ShieldAlert className="w-4 h-4 text-rose-600 dark:text-rose-400" />
          <span>Safety & Triage Guide</span>
        </button>
      </div>

      {/* High-End Fetal Development & Biometric Progression Card */}
      <FetalDevelopmentCard profile={profile} />

      {/* Quick Action Buttons (Large, Accessible, 44px+ touch targets) */}
      <section aria-label="Quick Actions">
        <h2 className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-2.5 font-display">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            id="quick-action-log-symptom"
            onClick={onQuickLogSymptom}
            className="p-4 bg-white dark:bg-[#16181d] hover:bg-stone-50 dark:hover:bg-[#1e2028] border border-stone-200/90 dark:border-[#272a33] rounded-xl flex flex-col items-center justify-center text-center transition-all shadow-2xs group min-h-[88px] cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <Activity className="w-5 h-5" />
            </div>
            <span className="text-sm font-semibold text-stone-900 dark:text-stone-100 font-display">Log Symptom</span>
            <span className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">Severity & triggers</span>
          </button>

          <button
            id="quick-action-log-meal"
            onClick={onQuickLogMeal}
            className="p-4 bg-white dark:bg-[#16181d] hover:bg-stone-50 dark:hover:bg-[#1e2028] border border-stone-200/90 dark:border-[#272a33] rounded-xl flex flex-col items-center justify-center text-center transition-all shadow-2xs group min-h-[88px] cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <Apple className="w-5 h-5" />
            </div>
            <span className="text-sm font-semibold text-stone-900 dark:text-stone-100 font-display">Log Meal</span>
            <span className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">Food group tracking</span>
          </button>

          <button
            id="quick-action-log-water"
            onClick={() => onAddWater(1)}
            className="p-4 bg-white dark:bg-[#16181d] hover:bg-stone-50 dark:hover:bg-[#1e2028] border border-stone-200/90 dark:border-[#272a33] rounded-xl flex flex-col items-center justify-center text-center transition-all shadow-2xs group min-h-[88px] cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-400 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <Droplet className="w-5 h-5" />
            </div>
            <span className="text-sm font-semibold text-stone-900 dark:text-stone-100 font-display">+1 Cup Water</span>
            <span className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">Instant fluid tap</span>
          </button>

          <button
            id="quick-action-view-guidance"
            onClick={() => onNavigateTab('nutrition')}
            className="p-4 bg-white dark:bg-[#16181d] hover:bg-stone-50 dark:hover:bg-[#1e2028] border border-stone-200/90 dark:border-[#272a33] rounded-xl flex flex-col items-center justify-center text-center transition-all shadow-2xs group min-h-[88px] cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="text-sm font-semibold text-stone-900 dark:text-stone-100 font-display">Guidance</span>
            <span className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">Food safety & nutrients</span>
          </button>
        </div>
      </section>

      {/* Daily Wellness Visual Graphics: Fluid Intake & Nutrition Balance */}
      <DailyWellnessGraphics
        profile={profile}
        meals={todaysMeals}
        hydration={todaysHydration}
        onAddWater={onAddWater}
        onRemoveWater={onRemoveWater}
      />

      {/* Today's Overview Grid */}
      <section aria-label="Today's Wellness Overview">
        <div className="flex items-center justify-between mb-2.5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 font-display">
            Activity Summary
          </h2>
          <span className="text-xs text-stone-400 dark:text-stone-500 font-medium">
            {todayStr}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {/* Symptoms logged today */}
          <div 
            onClick={() => onNavigateTab('symptoms')}
            className="p-4 bg-white dark:bg-[#16181d] border border-stone-200/90 dark:border-[#272a33] rounded-xl shadow-2xs hover:border-stone-300 dark:hover:border-stone-700 cursor-pointer transition-all flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-stone-600 dark:text-stone-300 uppercase tracking-wide">Symptoms</span>
              <Activity className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="my-2">
              <div className="text-2xl font-bold text-stone-900 dark:text-stone-100 font-display">
                {todaysSymptoms.length} <span className="text-sm font-normal text-stone-500 dark:text-stone-400">logged today</span>
              </div>
              {todaysSymptoms.length > 0 ? (
                <div className="flex flex-wrap gap-1 mt-2">
                  {todaysSymptoms.slice(0, 3).map((sym) => (
                    <span key={sym.id} className="text-[11px] px-2 py-0.5 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 rounded-md border border-amber-200 dark:border-amber-900/50 font-medium">
                      {sym.symptomName} (lvl {sym.severity})
                    </span>
                  ))}
                  {todaysSymptoms.length > 3 && (
                    <span className="text-[11px] text-stone-500 dark:text-stone-400">+{todaysSymptoms.length - 3} more</span>
                  )}
                </div>
              ) : (
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">No symptoms logged today. Feeling steady?</p>
              )}
            </div>
            <div className="text-xs font-semibold text-rose-700 dark:text-rose-400 flex items-center gap-1 pt-2 border-t border-stone-100 dark:border-stone-800">
              <span>View symptom log</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Meals logged today */}
          <div 
            onClick={() => onNavigateTab('nutrition')}
            className="p-4 bg-white dark:bg-[#16181d] border border-stone-200/90 dark:border-[#272a33] rounded-xl shadow-2xs hover:border-stone-300 dark:hover:border-stone-700 cursor-pointer transition-all flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-stone-600 dark:text-stone-300 uppercase tracking-wide">Nutrition</span>
              <Apple className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="my-2">
              <div className="text-2xl font-bold text-stone-900 dark:text-stone-100 font-display">
                {todaysMeals.length} <span className="text-sm font-normal text-stone-500 dark:text-stone-400">meals logged</span>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-2">
                <span className="text-[11px] text-stone-600 dark:text-stone-300 font-medium">
                  {todaysFoodGroups.size} food groups represented
                </span>
              </div>
              {todaysMeals.length === 0 && (
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">Log breakfast, lunch, dinner, or snacks.</p>
              )}
            </div>
            <div className="text-xs font-semibold text-rose-700 dark:text-rose-400 flex items-center gap-1 pt-2 border-t border-stone-100 dark:border-stone-800">
              <span>View meals & food groups</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Hydration logged today */}
          <div className="p-4 bg-white dark:bg-[#16181d] border border-stone-200/90 dark:border-[#272a33] rounded-xl shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-stone-600 dark:text-stone-300 uppercase tracking-wide">Hydration</span>
              <Droplet className="w-4 h-4 text-sky-600 dark:text-sky-400" />
            </div>
            <div className="my-2">
              <div className="text-2xl font-bold text-stone-900 dark:text-stone-100 font-display">
                {todayWaterCups} <span className="text-sm font-normal text-stone-500 dark:text-stone-400">{profile.waterUnit} logged</span>
              </div>
              <div className="w-full bg-stone-100 dark:bg-stone-800 h-2 rounded-full mt-2 overflow-hidden">
                <div 
                  className="bg-sky-500 h-full rounded-full transition-all"
                  style={{ width: `${Math.min(100, (todayWaterCups / profile.dailyWaterGoalCups) * 100)}%` }}
                />
              </div>
              <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1.5">
                Target ~{profile.dailyWaterGoalCups} cups daily
              </p>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-stone-100 dark:border-stone-800">
              <button
                onClick={() => onAddWater(1)}
                className="text-xs font-semibold text-sky-700 dark:text-sky-400 hover:text-sky-800 dark:hover:text-sky-300 flex items-center gap-1 py-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add 1 cup</span>
              </button>
              <button
                onClick={() => onNavigateTab('nutrition')}
                className="text-xs text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-300 cursor-pointer"
              >
                Tracker history
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Daily Wellness Suggestion Card */}
      <section 
        className="p-4 sm:p-5 bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/90 dark:border-amber-900/30 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs transition-colors"
        aria-labelledby="wellness-tip-title"
      >
        <div className="flex items-start gap-3">
          <div className="p-2 bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 rounded-xl shrink-0 mt-0.5">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 id="wellness-tip-title" className="text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-300 font-display">
              Daily Maternal Wellness Reflection
            </h3>
            <p className="text-sm text-stone-800 dark:text-stone-200 font-medium mt-0.5 leading-relaxed">
              "{DAILY_WELLNESS_MESSAGES[wellnessTipIndex]}"
            </p>
            <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1">
              General supportive encouragement; not personalized clinical advice.
            </p>
          </div>
        </div>

        <button
          onClick={nextTip}
          className="self-end sm:self-center px-3 py-1.5 bg-white dark:bg-[#1f2129] hover:bg-amber-50 dark:hover:bg-[#252833] text-stone-700 dark:text-stone-200 border border-amber-300 dark:border-amber-800/60 rounded-lg text-xs font-medium shrink-0 transition-colors shadow-2xs cursor-pointer"
        >
          Next suggestion
        </button>
      </section>

      {/* Reassuring Medical Safety Notice Banner */}
      <section 
        className="p-4 bg-stone-50 dark:bg-[#16181d] border border-stone-200 dark:border-[#272a33] rounded-2xl flex items-start gap-3 text-xs text-stone-600 dark:text-stone-400 leading-relaxed transition-colors"
        aria-label="Safety Notice"
      >
        <Info className="w-5 h-5 text-stone-500 dark:text-stone-400 shrink-0 mt-0.5" />
        <div className="flex-1">
          <span className="font-semibold text-stone-800 dark:text-stone-200">Healthcare Boundary Notice: </span>
          This app provides general pregnancy wellness and nutrition information. It does not replace care from a qualified healthcare professional. If you experience concerning symptoms such as heavy bleeding, severe abdominal pain, or reduced fetal movement, contact your healthcare provider or local emergency services immediately.
        </div>
        <button
          onClick={onOpenEmergency}
          className="text-xs font-semibold text-rose-700 dark:text-rose-400 hover:underline shrink-0 cursor-pointer"
        >
          View red flags
        </button>
      </section>
      {/* Reassuring Medical Safety Notice Banner */}
      <section 
        className="p-4 bg-stone-50 dark:bg-[#16181d] border border-stone-200 dark:border-[#272a33] rounded-2xl flex items-start gap-3 text-xs text-stone-600 dark:text-stone-400 leading-relaxed transition-colors"
        aria-label="Safety Notice"
      >
        <Info className="w-5 h-5 text-stone-500 dark:text-stone-400 shrink-0 mt-0.5" />
        <div className="flex-1">
          <span className="font-semibold text-stone-800 dark:text-stone-200">Healthcare Boundary Notice: </span>
          This app provides general pregnancy wellness and nutrition information. It does not replace care from a qualified healthcare professional. If you experience concerning symptoms such as heavy bleeding, severe abdominal pain, or reduced fetal movement, contact your healthcare provider or local emergency services immediately.
        </div>
        <button
          onClick={onOpenEmergency}
          className="text-xs font-semibold text-rose-700 dark:text-rose-400 hover:underline shrink-0 cursor-pointer"
        >
          View red flags
        </button>
      </section>
    </div>
  );
};

