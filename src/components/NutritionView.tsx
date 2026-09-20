import React, { useState } from 'react';
import { MealEntry, HydrationEntry, FoodGroup, MealCategory, UserProfile } from '../types';
import { NUTRITION_TOPICS } from '../data/educationData';
import { getTodayDateString, getCurrentTimeString } from '../utils/pregnancyCalculations';
import { 
  Apple, 
  Droplet, 
  Plus, 
  Minus, 
  Trash2, 
  Check, 
  AlertTriangle, 
  BookOpen, 
  ShieldCheck, 
  ExternalLink,
  ChevronDown,
  ChevronUp,
  X,
  Sparkles,
  Info
} from 'lucide-react';

interface NutritionViewProps {
  profile: UserProfile;
  meals: MealEntry[];
  hydration: HydrationEntry[];
  onSaveMeal: (entry: MealEntry) => void;
  onDeleteMeal: (id: string) => void;
  onAddWater: (amount?: number) => void;
  onRemoveWater: () => void;
  isQuickLogOpenInitially?: boolean;
}

export const NutritionView: React.FC<NutritionViewProps> = ({
  profile,
  meals,
  hydration,
  onSaveMeal,
  onDeleteMeal,
  onAddWater,
  onRemoveWater,
  isQuickLogOpenInitially = false,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'tracker' | 'education' | 'safety'>('tracker');
  const [isMealModalOpen, setIsMealModalOpen] = useState(isQuickLogOpenInitially);

  // Meal Form States
  const [mealType, setMealType] = useState<MealCategory>('Breakfast');
  const [foodName, setFoodName] = useState('');
  const [quantity, setQuantity] = useState('1 serving');
  const [date, setDate] = useState(getTodayDateString());
  const [time, setTime] = useState(getCurrentTimeString());
  const [selectedFoodGroups, setSelectedFoodGroups] = useState<FoodGroup[]>([]);
  const [notes, setNotes] = useState('');
  const [formError, setFormError] = useState('');

  // Expanded topic in library
  const [expandedTopicId, setExpandedTopicId] = useState<string | null>('protein');

  const todayStr = getTodayDateString();
  const todaysMeals = meals.filter((m) => m.date === todayStr);
  const todaysHydration = hydration.filter((h) => h.date === todayStr);
  const totalWaterCups = todaysHydration.reduce((sum, h) => sum + h.amount, 0);

  const allFoodGroups: FoodGroup[] = [
    'Protein',
    'Fruit',
    'Vegetables',
    'Whole grains',
    'Calcium-rich',
    'Healthy fats',
    'Iron/Folate-rich',
  ];

  // Calculate covered food groups for today
  const coveredFoodGroups = new Set<FoodGroup>();
  todaysMeals.forEach((meal) => {
    meal.foodGroups.forEach((fg) => coveredFoodGroups.add(fg));
  });

  const handleToggleFoodGroup = (fg: FoodGroup) => {
    setSelectedFoodGroups((prev) =>
      prev.includes(fg) ? prev.filter((item) => item !== fg) : [...prev, fg]
    );
  };

  const handleMealSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!foodName.trim()) {
      setFormError('Please enter a food or meal description.');
      return;
    }

    const newMeal: MealEntry = {
      id: 'meal_' + Date.now(),
      userId: 'user_main',
      mealType,
      foodName: foodName.trim(),
      quantity: quantity.trim() || '1 serving',
      date,
      time,
      foodGroups: selectedFoodGroups,
      notes: notes.trim() || undefined,
    };

    onSaveMeal(newMeal);
    setIsMealModalOpen(false);
    setFoodName('');
    setNotes('');
    setSelectedFoodGroups([]);
    setFormError('');
  };

  // Weekly Hydration calculation (last 7 days)
  const last7Days: { dateStr: string; label: string; cups: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const dayLabel = d.toLocaleDateString('en-US', { weekday: 'narrow' });
    const dayCups = hydration
      .filter((h) => h.date === dateStr)
      .reduce((sum, item) => sum + item.amount, 0);
    last7Days.push({ dateStr, label: dayLabel, cups: dayCups });
  }

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
            Nourishment & Hydration
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-stone-900 dark:text-white tracking-tight">
            Nutrition Companion
          </h1>
          <p className="text-sm text-stone-600 dark:text-stone-400 mt-0.5">
            Record daily meals, track hydration, and explore evidence-based nutrition guidelines.
          </p>
        </div>

        <button
          id="open-log-meal-modal-btn"
          onClick={() => setIsMealModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl text-sm transition-colors shadow-xs self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Log a Meal</span>
        </button>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center space-x-2 border-b border-stone-200 dark:border-[#272a33]">
        <button
          id="subtab-tracker-btn"
          onClick={() => setActiveSubTab('tracker')}
          className={`pb-3 px-3 text-sm font-semibold transition-colors border-b-2 -mb-px cursor-pointer ${
            activeSubTab === 'tracker'
              ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400 dark:border-emerald-500'
              : 'border-transparent text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
          }`}
        >
          Daily Log & Water
        </button>
        <button
          id="subtab-education-btn"
          onClick={() => setActiveSubTab('education')}
          className={`pb-3 px-3 text-sm font-semibold transition-colors border-b-2 -mb-px cursor-pointer ${
            activeSubTab === 'education'
              ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400 dark:border-emerald-500'
              : 'border-transparent text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
          }`}
        >
          Nutrient Library
        </button>
        <button
          id="subtab-safety-btn"
          onClick={() => setActiveSubTab('safety')}
          className={`pb-3 px-3 text-sm font-semibold transition-colors border-b-2 -mb-px cursor-pointer ${
            activeSubTab === 'safety'
              ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400 dark:border-emerald-500'
              : 'border-transparent text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
          }`}
        >
          Food Safety & Restrictions
        </button>
      </div>

      {/* TAB 1: Daily Log & Water */}
      {activeSubTab === 'tracker' && (
        <div className="space-y-6">
          {/* Hydration Tracker Card */}
          <section 
            id="hydration-tracker-card"
            className="bg-white dark:bg-[#16181d] rounded-2xl border border-stone-200 dark:border-[#272a33] p-5 sm:p-6 shadow-xs transition-colors"
            aria-labelledby="water-tracker-title"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400 flex items-center justify-center">
                  <Droplet className="w-6 h-6" />
                </div>
                <div>
                  <h2 id="water-tracker-title" className="text-lg font-bold font-display text-stone-900 dark:text-white">
                    Daily Water Tracker
                  </h2>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    Sip fluids consistently throughout the day for circulation and comfort.
                  </p>
                </div>
              </div>

              {/* Water Control Buttons */}
              <div className="flex items-center gap-2">
                <button
                  id="water-minus-btn"
                  onClick={onRemoveWater}
                  disabled={totalWaterCups === 0}
                  className="p-2.5 rounded-xl border border-stone-200 dark:border-[#272a33] text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-[#222630] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  title="Remove one cup"
                  aria-label="Remove one cup of water"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <button
                  id="water-add-btn"
                  onClick={() => onAddWater(1)}
                  className="px-4 py-2.5 bg-sky-600 hover:bg-sky-700 dark:bg-sky-600 dark:hover:bg-sky-500 text-white rounded-xl text-sm font-semibold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>+1 Cup</span>
                </button>
              </div>
            </div>

            {/* Total and Visual Indicators */}
            <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4 items-center pt-4 border-t border-stone-100 dark:border-[#272a33]">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold font-display text-stone-900 dark:text-white">{totalWaterCups}</span>
                  <span className="text-sm font-medium text-stone-500 dark:text-stone-400">
                    cups logged today (~{totalWaterCups * 240} ml)
                  </span>
                </div>

                <div className="w-full bg-stone-100 dark:bg-[#222630] h-3 rounded-full mt-2 overflow-hidden">
                  <div
                    className="bg-sky-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, (totalWaterCups / profile.dailyWaterGoalCups) * 100)}%` }}
                  />
                </div>
                <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1.5 leading-relaxed">
                  Notice: Individual fluid needs vary based on climate, physical activity, and medical conditions. Healthcare professionals may recommend different amounts.
                </p>
              </div>

              {/* Weekly Mini Bar History */}
              <div className="bg-stone-50 dark:bg-[#1c1f26] p-3.5 rounded-xl border border-stone-100 dark:border-[#272a33]">
                <span className="text-xs font-semibold text-stone-700 dark:text-stone-300 block mb-2">
                  7-Day Hydration History
                </span>
                <div className="flex items-end justify-between gap-2 h-16 pt-2">
                  {last7Days.map((item, idx) => {
                    const barHeight = Math.min(100, Math.round((item.cups / 10) * 100));
                    const isToday = item.dateStr === todayStr;
                    return (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                        <div className="w-full bg-stone-200 dark:bg-[#272a33] rounded-t h-12 flex items-end overflow-hidden">
                          <div
                            className={`w-full transition-all ${
                              isToday ? 'bg-sky-600 dark:bg-sky-500' : 'bg-sky-400 dark:bg-sky-700'
                            }`}
                            style={{ height: `${barHeight}%` }}
                            title={`${item.dateStr}: ${item.cups} cups`}
                          />
                        </div>
                        <span className={`text-[10px] font-semibold ${isToday ? 'text-sky-700 dark:text-sky-400 font-bold' : 'text-stone-500 dark:text-stone-400'}`}>
                          {item.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>

          {/* Daily Food Group Summary Checklist (Section 12) */}
          <section 
            className="bg-white dark:bg-[#16181d] rounded-2xl border border-stone-200 dark:border-[#272a33] p-5 sm:p-6 shadow-xs transition-colors"
            aria-labelledby="food-groups-summary-heading"
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 id="food-groups-summary-heading" className="text-base font-bold font-display text-stone-900 dark:text-white">
                  Today's Food Groups Variety
                </h2>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Broad reminder checklist of nutrient-dense food groups represented in your meals today.
                </p>
              </div>
              <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800/40">
                {coveredFoodGroups.size} of {allFoodGroups.length} logged
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-4">
              {allFoodGroups.map((group) => {
                const isLogged = coveredFoodGroups.has(group);
                return (
                  <div
                    key={group}
                    className={`p-3 rounded-xl border flex items-center gap-2.5 transition-all ${
                      isLogged
                        ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/50 text-emerald-950 dark:text-emerald-200 font-medium'
                        : 'bg-stone-50/70 dark:bg-[#1c1f26] border-stone-200 dark:border-[#272a33] text-stone-400 dark:text-stone-500'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                        isLogged
                          ? 'bg-emerald-600 text-white'
                          : 'border border-stone-300 dark:border-stone-600 text-stone-300 dark:text-stone-600'
                      }`}
                    >
                      {isLogged ? <Check className="w-3.5 h-3.5" /> : '○'}
                    </div>
                    <span className="text-xs sm:text-sm">{group}</span>
                  </div>
                );
              })}
            </div>

            <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-3 italic flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 shrink-0" />
              General wellness suggestion: This is a supportive food group reminder, not a personalized clinical diet prescription.
            </p>
          </section>

          {/* Meals Logged Timeline / Empty State */}
          <section aria-labelledby="meals-history-heading">
            <div className="flex items-center justify-between mb-3">
              <h2 id="meals-history-heading" className="text-sm font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400">
                Today's Meals ({todaysMeals.length})
              </h2>
            </div>

            {todaysMeals.length === 0 ? (
              <div 
                id="meals-empty-state"
                className="p-8 sm:p-10 text-center bg-white dark:bg-[#16181d] rounded-2xl border border-stone-200 dark:border-[#272a33] shadow-2xs space-y-3 transition-colors"
              >
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 flex items-center justify-center mx-auto">
                  <Apple className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-semibold font-display text-stone-900 dark:text-white">
                    No meals logged today.
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400 max-w-sm mx-auto mt-1">
                    Record your breakfast, lunch, dinner, or nourishing snacks to keep a gentle record of your eating habits.
                  </p>
                </div>
                <button
                  id="empty-state-log-meal-btn"
                  onClick={() => setIsMealModalOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl text-sm transition-colors shadow-2xs cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Log a meal</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {todaysMeals.map((meal) => (
                  <div
                    key={meal.id}
                    id={`meal-card-${meal.id}`}
                    className="bg-white dark:bg-[#16181d] rounded-xl border border-stone-200 dark:border-[#272a33] p-4 shadow-2xs hover:border-stone-300 dark:hover:border-stone-700 transition-all"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold uppercase px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 rounded-md">
                            {meal.mealType}
                          </span>
                          <span className="text-xs text-stone-400 font-medium">
                            {meal.time}
                          </span>
                        </div>
                        <h3 className="text-base font-semibold font-display text-stone-900 dark:text-white mt-1">
                          {meal.foodName}
                        </h3>
                        <span className="text-xs text-stone-500 dark:text-stone-400">
                          Serving: {meal.quantity}
                        </span>
                      </div>

                      <button
                        onClick={() => onDeleteMeal(meal.id)}
                        className="p-1.5 text-stone-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
                        title="Delete meal entry"
                        aria-label={`Delete ${meal.foodName}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {meal.foodGroups && meal.foodGroups.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2.5">
                        {meal.foodGroups.map((fg) => (
                          <span
                            key={fg}
                            className="text-[11px] px-2 py-0.5 bg-stone-100 dark:bg-[#222630] text-stone-700 dark:text-stone-300 rounded-md border border-stone-200 dark:border-[#272a33] font-medium"
                          >
                            ✓ {fg}
                          </span>
                        ))}
                      </div>
                    )}

                    {meal.notes && (
                      <p className="mt-2 text-xs text-stone-600 dark:text-stone-400 bg-stone-50 dark:bg-[#1c1f26] p-2 rounded-lg border border-stone-100 dark:border-[#272a33]">
                        {meal.notes}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      )}

      {/* TAB 2: Educational Nutrient Library (Section 14) */}
      {activeSubTab === 'education' && (
        <div className="space-y-4">
          <div className="p-4 bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 rounded-2xl flex items-start gap-3 transition-colors">
            <BookOpen className="w-5 h-5 text-emerald-700 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
              <span className="font-bold text-emerald-900 dark:text-emerald-200 block mb-0.5">Evidence-Based Pregnancy Nutrition</span>
              Each nutrient topic provides reputable guidance derived from public-health bodies (ACOG, WHO, CDC, NHS). Review these concepts to help you build balanced everyday eating habits.
            </div>
          </div>

          <div className="space-y-3">
            {NUTRITION_TOPICS.filter((t) => t.category === 'nutrient').map((topic) => {
              const isExpanded = expandedTopicId === topic.id;
              return (
                <div
                  key={topic.id}
                  id={`topic-card-${topic.id}`}
                  className="bg-white dark:bg-[#16181d] rounded-xl border border-stone-200 dark:border-[#272a33] shadow-2xs overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setExpandedTopicId(isExpanded ? null : topic.id)}
                    className="w-full p-4 flex items-center justify-between text-left hover:bg-stone-50 dark:hover:bg-[#1c1f26] transition-colors cursor-pointer"
                  >
                    <div>
                      <h3 className="text-base font-bold font-display text-stone-900 dark:text-white">{topic.title}</h3>
                      <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">{topic.shortExplanation}</p>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-stone-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-stone-400 shrink-0" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="p-4 pt-0 border-t border-stone-100 dark:border-[#272a33] space-y-3 text-xs sm:text-sm text-stone-700 dark:text-stone-300">
                      <div>
                        <h4 className="font-semibold text-stone-900 dark:text-white mb-1">Why it matters in pregnancy</h4>
                        <p className="leading-relaxed text-stone-700 dark:text-stone-300">{topic.whyItMatters}</p>
                      </div>

                      <div className="bg-stone-50 dark:bg-[#1c1f26] p-3 rounded-xl border border-stone-200 dark:border-[#272a33]">
                        <h4 className="font-semibold text-stone-900 dark:text-white mb-1.5">Nutrient-Dense Food Sources</h4>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs text-stone-800 dark:text-stone-200 list-disc list-inside">
                          {topic.foodSources.map((source, sIdx) => (
                            <li key={sIdx}>{source}</li>
                          ))}
                        </ul>
                      </div>

                      {topic.safetyNotes && (
                        <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-900/50 text-amber-900 dark:text-amber-200 text-xs">
                          <span className="font-semibold">Safety & Preparation Note: </span>
                          {topic.safetyNotes}
                        </div>
                      )}

                      {/* Source Citations */}
                      <div className="pt-2 border-t border-stone-100 dark:border-[#272a33] text-[11px] text-stone-500 dark:text-stone-400">
                        <span className="font-semibold text-stone-700 dark:text-stone-300">Medical Sources & Citations:</span>
                        <div className="mt-1 space-y-0.5">
                          {topic.citations.map((cite, cIdx) => (
                            <div key={cIdx} className="flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-stone-300 dark:bg-stone-600" />
                              <span className="font-medium text-stone-700 dark:text-stone-300">{cite.source}</span>
                              <span>&bull; {cite.urlOrDoc}</span>
                              <span className="text-stone-400 dark:text-stone-500">({cite.reviewedDate})</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: Food Safety & Restrictions (Section 15) */}
      {activeSubTab === 'safety' && (
        <div className="space-y-4">
          <div className="p-4 bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 rounded-2xl flex items-start gap-3 transition-colors">
            <ShieldCheck className="w-5 h-5 text-rose-700 dark:text-rose-400 shrink-0 mt-0.5" />
            <div className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
              <span className="font-bold text-rose-900 dark:text-rose-200 block mb-0.5">
                Foodborne Illness Prevention During Pregnancy
              </span>
              Maternal hormonal shifts alter immune function, creating higher vulnerability to foodborne pathogens like Listeria, Salmonella, and Toxoplasma. Simple hygienic habits drastically reduce risk.
            </div>
          </div>

          <div className="space-y-4">
            {NUTRITION_TOPICS.filter((t) => t.category !== 'nutrient').map((topic) => (
              <div
                key={topic.id}
                className="bg-white dark:bg-[#16181d] rounded-2xl border border-stone-200 dark:border-[#272a33] p-5 shadow-xs space-y-3 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold font-display text-stone-900 dark:text-white">{topic.title}</h3>
                  <span className="text-xs px-2.5 py-0.5 rounded-md font-semibold bg-stone-100 dark:bg-[#222630] text-stone-700 dark:text-stone-300">
                    ACOG & CDC Grounded
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
                  {topic.shortExplanation}
                </p>

                <div className="p-3.5 bg-stone-50 dark:bg-[#1c1f26] rounded-xl border border-stone-200 dark:border-[#272a33]">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800 dark:text-stone-200 mb-2">
                    Key Guidelines & Practical Precautions
                  </h4>
                  <ul className="space-y-1.5 text-xs text-stone-800 dark:text-stone-200">
                    {topic.foodSources.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-stone-400 dark:text-stone-500 mt-0.5">&bull;</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="text-[11px] text-stone-500 dark:text-stone-400 pt-2 border-t border-stone-100 dark:border-[#272a33]">
                  <span className="font-medium text-stone-700 dark:text-stone-300">Authoritative References: </span>
                  {topic.citations.map((c, i) => (
                    <span key={i} className="mr-2">
                      {c.source} ({c.reviewedDate})
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Log Meal Modal */}
      {isMealModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 dark:bg-black/75 backdrop-blur-xs p-4 overflow-y-auto">
          <div 
            id="meal-entry-modal"
            className="w-full max-w-lg bg-white dark:bg-[#16181d] rounded-2xl shadow-xl border border-stone-200 dark:border-[#272a33] overflow-hidden my-6 transition-all"
          >
            <div className="bg-stone-50 dark:bg-[#1c1f26] border-b border-stone-200 dark:border-[#272a33] p-4 sm:p-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 flex items-center justify-center">
                  <Apple className="w-4 h-4" />
                </div>
                <h2 className="text-lg font-bold font-display text-stone-900 dark:text-white">Record a Meal</h2>
              </div>
              <button
                onClick={() => setIsMealModalOpen(false)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-[#272a33] transition-colors cursor-pointer"
                aria-label="Close meal modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleMealSubmit} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
              {formError && (
                <div className="p-3 text-xs text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 rounded-lg">
                  {formError}
                </div>
              )}

              {/* Meal Category */}
              <div>
                <label className="block text-xs font-semibold text-stone-800 dark:text-stone-200 uppercase tracking-wide mb-1.5">
                  Meal Category <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(['Breakfast', 'Lunch', 'Dinner', 'Snack'] as MealCategory[]).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setMealType(cat)}
                      className={`py-2 px-1 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        mealType === cat
                          ? 'bg-emerald-600 dark:bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                          : 'bg-stone-50 dark:bg-[#1c1f26] text-stone-700 dark:text-stone-300 border-stone-200 dark:border-[#272a33] hover:bg-stone-100 dark:hover:bg-[#222630]'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Food Name */}
              <div>
                <label htmlFor="food-name-input" className="block text-xs font-semibold text-stone-800 dark:text-stone-200 uppercase tracking-wide mb-1">
                  Food / Dishes <span className="text-rose-500">*</span>
                </label>
                <input
                  id="food-name-input"
                  type="text"
                  placeholder="e.g., Oatmeal with banana and milk"
                  value={foodName}
                  onChange={(e) => setFoodName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-[#2e323d] text-stone-900 dark:text-stone-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-white dark:bg-[#1c1f26]"
                  required
                />
              </div>

              {/* Serving Quantity */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="food-quantity-input" className="block text-xs font-semibold text-stone-800 dark:text-stone-200 uppercase tracking-wide mb-1">
                    Serving Size
                  </label>
                  <input
                    id="food-quantity-input"
                    type="text"
                    placeholder="e.g., 1 bowl / 1 plate"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 dark:border-[#2e323d] text-stone-900 dark:text-stone-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-white dark:bg-[#1c1f26]"
                  />
                </div>

                <div>
                  <label htmlFor="meal-time-input" className="block text-xs font-semibold text-stone-800 dark:text-stone-200 uppercase tracking-wide mb-1">
                    Time
                  </label>
                  <input
                    id="meal-time-input"
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 dark:border-[#2e323d] text-stone-900 dark:text-stone-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-white dark:bg-[#1c1f26]"
                  />
                </div>
              </div>

              {/* Food Groups Checklist */}
              <div>
                <label className="block text-xs font-semibold text-stone-800 dark:text-stone-200 uppercase tracking-wide mb-1.5">
                  Food Groups Included <span className="text-stone-400 dark:text-stone-500 font-normal">(select all that apply)</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {allFoodGroups.map((fg) => {
                    const isChecked = selectedFoodGroups.includes(fg);
                    return (
                      <button
                        key={fg}
                        type="button"
                        onClick={() => handleToggleFoodGroup(fg)}
                        className={`p-2.5 rounded-xl border text-xs text-left flex items-center justify-between transition-colors cursor-pointer ${
                          isChecked
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-200 font-semibold'
                            : 'bg-stone-50 dark:bg-[#1c1f26] border-stone-200 dark:border-[#272a33] text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-[#222630]'
                        }`}
                      >
                        <span>{fg}</span>
                        {isChecked && <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label htmlFor="meal-notes-input" className="block text-xs font-semibold text-stone-800 dark:text-stone-200 uppercase tracking-wide mb-1">
                  Notes <span className="text-stone-400 dark:text-stone-500 font-normal">(optional)</span>
                </label>
                <textarea
                  id="meal-notes-input"
                  rows={2}
                  placeholder="e.g., Felt satisfied, drank water alongside, tasted great"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 dark:border-[#2e323d] text-stone-900 dark:text-stone-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-white dark:bg-[#1c1f26] resize-none"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsMealModalOpen(false)}
                  className="py-2.5 px-4 border border-stone-300 dark:border-[#2e323d] text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-[#222630] font-medium rounded-xl text-sm transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  id="submit-meal-entry-btn"
                  type="submit"
                  className="flex-1 py-2.5 px-5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl text-sm transition-colors shadow-xs cursor-pointer"
                >
                  Save Meal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
