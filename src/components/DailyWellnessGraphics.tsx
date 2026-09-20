import React from 'react';
import { MealEntry, HydrationEntry, UserProfile } from '../types';
import { Droplet, Plus, Minus, Check, Apple, Sparkles, Award } from 'lucide-react';

interface DailyWellnessGraphicsProps {
  profile: UserProfile;
  meals: MealEntry[];
  hydration: HydrationEntry[];
  onAddWater: (amount?: number) => void;
  onRemoveWater?: () => void;
}

export const DailyWellnessGraphics: React.FC<DailyWellnessGraphicsProps> = ({
  profile,
  meals,
  hydration,
  onAddWater,
  onRemoveWater,
}) => {
  const goalCups = profile.dailyWaterGoalCups || 8;
  const currentCups = hydration.reduce((acc, curr) => acc + curr.amount, 0);
  const hydrationPct = Math.min(100, Math.round((currentCups / goalCups) * 100));

  // Pregnancy Essential 6 Core Food Groups
  const CORE_FOOD_GROUPS = [
    { name: 'Protein', color: '#f43f5e', desc: 'Cell building & placenta growth' },
    { name: 'Iron/Folate-rich', color: '#10b981', desc: 'RBCs & neural support' },
    { name: 'Calcium-rich', color: '#0ea5e9', desc: 'Fetal bone ossification' },
    { name: 'Whole grains', color: '#f59e0b', desc: 'Sustained B-vitamins & energy' },
    { name: 'Healthy fats', color: '#8b5cf6', desc: 'Fetal brain & eye lipids' },
    { name: 'Vegetables', color: '#14b8a6', desc: 'Fiber & micronutrients' },
  ];

  // Check which food groups were eaten today
  const eatenGroups = new Set<string>();
  meals.forEach((m) => {
    m.foodGroups?.forEach((g) => eatenGroups.add(g));
  });

  const coreGroupsCovered = CORE_FOOD_GROUPS.filter(g => eatenGroups.has(g.name)).length;
  const nutritionScorePct = Math.round((coreGroupsCovered / CORE_FOOD_GROUPS.length) * 100);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Hydration Circular Wave Gauge Card */}
      <div 
        id="hydration-gauge-card"
        className="bg-white dark:bg-[#16181d] rounded-2xl border border-stone-200/90 dark:border-[#272a33] p-5 shadow-xs transition-colors"
      >
        <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-sky-700 dark:text-sky-400 font-display flex items-center gap-1.5">
              <Droplet className="w-3.5 h-3.5 fill-sky-500 text-sky-500" />
              Daily Fluid Intake
            </span>
            <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 mt-0.5">
              {currentCups} of {goalCups} Cups Logged
            </h3>
          </div>
          <span className="px-2.5 py-1 bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border border-sky-100 dark:border-sky-900/50 rounded-lg text-xs font-semibold">
            {hydrationPct}% Goal
          </span>
        </div>

        <div className="py-4 flex flex-col sm:flex-row items-center justify-between gap-5">
          {/* Circular SVG Gauge with Water Level Effect */}
          <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                className="text-stone-100 dark:text-stone-800"
              />
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="url(#skyGradient)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 42}`}
                strokeDashoffset={`${2 * Math.PI * 42 * (1 - hydrationPct / 100)}`}
                className="transition-all duration-700 ease-out"
              />
              <defs>
                <linearGradient id="skyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="100%" stopColor="#0284c7" />
                </linearGradient>
              </defs>
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-xl font-extrabold text-stone-900 dark:text-stone-100 font-display">
                {currentCups}
              </span>
              <span className="text-[10px] uppercase font-bold text-stone-400 dark:text-stone-500">
                cups
              </span>
            </div>
          </div>

          {/* Quick Increment/Decrement Controls & Status */}
          <div className="flex-1 space-y-3 w-full">
            <div className="grid grid-cols-8 gap-1">
              {Array.from({ length: Math.max(goalCups, 8) }).map((_, idx) => {
                const isFilled = idx < currentCups;
                return (
                  <button
                    key={idx}
                    onClick={() => onAddWater(1)}
                    title={`Cup ${idx + 1}`}
                    className={`h-7 rounded-md flex items-center justify-center text-[10px] transition-all cursor-pointer ${
                      isFilled
                        ? 'bg-sky-500 text-white shadow-2xs hover:bg-sky-600'
                        : 'bg-stone-100 dark:bg-stone-800 text-stone-400 dark:text-stone-600 hover:bg-stone-200 dark:hover:bg-stone-700'
                    }`}
                  >
                    <Droplet className={`w-3 h-3 ${isFilled ? 'fill-white' : ''}`} />
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onAddWater(1)}
                className="flex-1 py-2 px-3 bg-sky-50 dark:bg-sky-950/40 hover:bg-sky-100 dark:hover:bg-sky-900/60 text-sky-800 dark:text-sky-300 font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 border border-sky-200/80 dark:border-sky-800/60 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add 1 Glass</span>
              </button>
              {onRemoveWater && currentCups > 0 && (
                <button
                  onClick={onRemoveWater}
                  className="py-2 px-3 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-600 dark:text-stone-300 font-medium rounded-xl text-xs flex items-center justify-center gap-1 transition-colors cursor-pointer"
                  title="Remove 1 glass"
                  aria-label="Remove 1 glass"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        <p className="text-[11px] text-stone-500 dark:text-stone-400 pt-2 border-t border-stone-100 dark:border-stone-800">
          Target ~8–10 cups (approx. 2–2.5 L) daily to sustain maternal blood plasma expansion and healthy amniotic fluid renewal.
        </p>
      </div>

      {/* Maternal Dietary Variety Wheel Card */}
      <div 
        id="nutrition-balance-card"
        className="bg-white dark:bg-[#16181d] rounded-2xl border border-stone-200/90 dark:border-[#272a33] p-5 shadow-xs transition-colors"
      >
        <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 font-display flex items-center gap-1.5">
              <Apple className="w-3.5 h-3.5 text-emerald-500" />
              Nutritional Diversity
            </span>
            <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 mt-0.5">
              {coreGroupsCovered} of {CORE_FOOD_GROUPS.length} Key Groups Eaten
            </h3>
          </div>
          <span className="px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-900/50 rounded-lg text-xs font-semibold">
            {nutritionScorePct}% Diversity
          </span>
        </div>

        <div className="py-3.5 space-y-2">
          {/* Food Group Status Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {CORE_FOOD_GROUPS.map((group) => {
              const hasEaten = eatenGroups.has(group.name);
              return (
                <div
                  key={group.name}
                  className={`p-2 rounded-xl border text-xs transition-all flex items-center justify-between ${
                    hasEaten
                      ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/50 text-emerald-900 dark:text-emerald-200'
                      : 'bg-stone-50/60 dark:bg-stone-900/40 border-stone-200/80 dark:border-stone-800 text-stone-500 dark:text-stone-400 opacity-75'
                  }`}
                >
                  <div className="truncate mr-1">
                    <span className="font-semibold block truncate">{group.name}</span>
                    <span className="text-[10px] text-stone-400 dark:text-stone-400 block truncate">{group.desc}</span>
                  </div>
                  {hasEaten ? (
                    <span className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5" />
                    </span>
                  ) : (
                    <span className="w-4 h-4 rounded-full border border-stone-300 dark:border-stone-700 shrink-0" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400">
          <span>{meals.length} meals or snacks logged today</span>
          <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
            <Sparkles className="w-3 h-3" />
            General dietary reference
          </span>
        </div>
      </div>
    </div>
  );
};
