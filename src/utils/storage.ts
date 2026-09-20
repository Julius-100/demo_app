import { UserProfile, SymptomEntry, MealEntry, HydrationEntry, ReminderItem } from '../types';
import { getTodayDateString, getCurrentTimeString, calculateDueDateFromWeek } from './pregnancyCalculations';

const STORAGE_KEYS = {
  PROFILE: 'pregnancy_wellness_profile_v1',
  SYMPTOMS: 'pregnancy_wellness_symptoms_v1',
  MEALS: 'pregnancy_wellness_meals_v1',
  HYDRATION: 'pregnancy_wellness_hydration_v1',
  REMINDERS: 'pregnancy_wellness_reminders_v1',
};

// In-memory fallback in case localStorage is restricted in iframe sandboxes
const memoryStorage: Record<string, string> = {};

export function safeGetItem(key: string): string | null {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const val = window.localStorage.getItem(key);
      if (val !== null) return val;
    }
  } catch (e) {
    console.warn('localStorage read error, falling back to in-memory store:', e);
  }
  return memoryStorage[key] ?? null;
}

export function safeSetItem(key: string, value: string): void {
  memoryStorage[key] = value;
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, value);
    }
  } catch (e) {
    console.warn('localStorage write error, using in-memory store:', e);
  }
}

export function safeRemoveItem(key: string): void {
  delete memoryStorage[key];
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(key);
    }
  } catch (e) {
    console.warn('localStorage remove error, clearing in-memory store:', e);
  }
}

export function getStoredProfile(): UserProfile | null {
  try {
    const raw = safeGetItem(STORAGE_KEYS.PROFILE);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse user profile', e);
    return null;
  }
}

export function saveStoredProfile(profile: UserProfile): void {
  try {
    safeSetItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  } catch (e) {
    console.error('Failed to save profile', e);
  }
}

export function getStoredSymptoms(): SymptomEntry[] {
  try {
    const raw = safeGetItem(STORAGE_KEYS.SYMPTOMS);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse symptoms', e);
    return [];
  }
}

export function saveStoredSymptom(entry: SymptomEntry): SymptomEntry[] {
  const current = getStoredSymptoms();
  const existingIdx = current.findIndex(s => s.id === entry.id);
  let updated: SymptomEntry[];
  if (existingIdx >= 0) {
    updated = [...current];
    updated[existingIdx] = entry;
  } else {
    updated = [entry, ...current];
  }
  safeSetItem(STORAGE_KEYS.SYMPTOMS, JSON.stringify(updated));
  return updated;
}

export function deleteStoredSymptom(id: string): SymptomEntry[] {
  const current = getStoredSymptoms();
  const updated = current.filter(s => s.id !== id);
  safeSetItem(STORAGE_KEYS.SYMPTOMS, JSON.stringify(updated));
  return updated;
}

export function getStoredMeals(): MealEntry[] {
  try {
    const raw = safeGetItem(STORAGE_KEYS.MEALS);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse meals', e);
    return [];
  }
}

export function saveStoredMeal(entry: MealEntry): MealEntry[] {
  const current = getStoredMeals();
  const existingIdx = current.findIndex(m => m.id === entry.id);
  let updated: MealEntry[];
  if (existingIdx >= 0) {
    updated = [...current];
    updated[existingIdx] = entry;
  } else {
    updated = [entry, ...current];
  }
  safeSetItem(STORAGE_KEYS.MEALS, JSON.stringify(updated));
  return updated;
}

export function deleteStoredMeal(id: string): MealEntry[] {
  const current = getStoredMeals();
  const updated = current.filter(m => m.id !== id);
  safeSetItem(STORAGE_KEYS.MEALS, JSON.stringify(updated));
  return updated;
}

export function getStoredHydration(): HydrationEntry[] {
  try {
    const raw = safeGetItem(STORAGE_KEYS.HYDRATION);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse hydration', e);
    return [];
  }
}

export function addStoredWaterCup(amount: number = 1, dateStr: string = getTodayDateString()): HydrationEntry[] {
  const current = getStoredHydration();
  const newEntry: HydrationEntry = {
    id: 'hyd_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
    userId: 'user_main',
    amount,
    date: dateStr,
    time: getCurrentTimeString(),
  };
  const updated = [newEntry, ...current];
  safeSetItem(STORAGE_KEYS.HYDRATION, JSON.stringify(updated));
  return updated;
}

export function removeLastStoredWaterCup(dateStr: string = getTodayDateString()): HydrationEntry[] {
  const current = getStoredHydration();
  // Find the most recent entry for this date
  const targetIdx = current.findIndex(h => h.date === dateStr);
  if (targetIdx === -1) return current;
  const updated = [...current];
  updated.splice(targetIdx, 1);
  safeSetItem(STORAGE_KEYS.HYDRATION, JSON.stringify(updated));
  return updated;
}

export function getStoredReminders(): ReminderItem[] {
  try {
    const raw = safeGetItem(STORAGE_KEYS.REMINDERS);
    if (!raw) return getDefaultReminders();
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse reminders', e);
    return getDefaultReminders();
  }
}

export function saveStoredReminder(item: ReminderItem): ReminderItem[] {
  const current = getStoredReminders();
  const existingIdx = current.findIndex(r => r.id === item.id);
  let updated: ReminderItem[];
  if (existingIdx >= 0) {
    updated = [...current];
    updated[existingIdx] = item;
  } else {
    updated = [...current, item];
  }
  safeSetItem(STORAGE_KEYS.REMINDERS, JSON.stringify(updated));
  return updated;
}

export function deleteStoredReminder(id: string): ReminderItem[] {
  const current = getStoredReminders();
  const updated = current.filter(r => r.id !== id);
  safeSetItem(STORAGE_KEYS.REMINDERS, JSON.stringify(updated));
  return updated;
}

export function getDefaultReminders(): ReminderItem[] {
  return [
    {
      id: 'rem_1',
      userId: 'user_main',
      reminderType: 'water',
      title: 'Hydration check-in (have a cool glass of water)',
      scheduledTime: '10:30',
      enabled: true,
      notes: 'General fluid reminder for comfort and blood volume.',
    },
    {
      id: 'rem_2',
      userId: 'user_main',
      reminderType: 'meal',
      title: 'Midday nourishing meal & snack',
      scheduledTime: '12:30',
      enabled: true,
      notes: 'Include protein and whole grains.',
    },
    {
      id: 'rem_3',
      userId: 'user_main',
      reminderType: 'medication_supplement',
      title: 'Doctor-prescribed prenatal vitamin with food',
      scheduledTime: '19:00',
      enabled: true,
      notes: 'Only take supplements explicitly directed by your healthcare team.',
    },
    {
      id: 'rem_4',
      userId: 'user_main',
      reminderType: 'symptom',
      title: 'Evening wellness & symptom reflection',
      scheduledTime: '20:30',
      enabled: true,
      notes: 'Log any changes, rest your legs, and unwind.',
    },
  ];
}

export function seedInitialDataIfRequested(): {
  profile: UserProfile;
  symptoms: SymptomEntry[];
  meals: MealEntry[];
  hydration: HydrationEntry[];
} {
  const today = getTodayDateString();
  const defaultDueDate = calculateDueDateFromWeek(22);
  
  const defaultProfile: UserProfile = {
    id: 'user_julius',
    name: 'Julius',
    age: 28,
    pregnancyStatus: 'Currently pregnant',
    pregnancyWeek: 22,
    dueDate: defaultDueDate,
    pregnancyType: 'Singleton',
    createdAt: new Date().toISOString(),
    acknowledgedDisclaimer: true,
    providerName: 'Dr. Sarah Jenkins, OB/GYN',
    providerPhone: '(555) 234-8901',
    emergencyContactName: 'Marcus (Partner)',
    emergencyContactPhone: '(555) 876-5432',
    waterUnit: 'cups',
    dailyWaterGoalCups: 8,
  };

  const sampleSymptoms: SymptomEntry[] = [
    {
      id: 'sym_demo_1',
      userId: 'user_julius',
      symptomName: 'Fatigue',
      severity: 2,
      duration: 'Half day',
      date: today,
      time: '14:15',
      notes: 'Felt energy dip after morning walk; took a 20-minute rest.',
      trigger: 'Physical exertion',
    },
    {
      id: 'sym_demo_2',
      userId: 'user_julius',
      symptomName: 'Heartburn',
      severity: 2,
      duration: '< 30 mins',
      date: today,
      time: '19:40',
      notes: 'Mild burning after dinner, improved after sitting upright and drinking water.',
      trigger: 'After eating',
    },
    {
      id: 'sym_demo_3',
      userId: 'user_julius',
      symptomName: 'Headache',
      severity: 2,
      duration: '1-2 hours',
      date: getOffsetDateString(-2),
      time: '11:00',
      notes: 'Mild tension headache, resolved after a tall glass of water and quiet rest.',
      trigger: 'Dehydration',
    },
    {
      id: 'sym_demo_4',
      userId: 'user_julius',
      symptomName: 'Back pain',
      severity: 3,
      duration: '1-2 hours',
      date: getOffsetDateString(-4),
      time: '18:30',
      notes: 'Lower back ache after standing in kitchen. Used a warm compress.',
      trigger: 'Prolonged standing',
    },
  ];

  const sampleMeals: MealEntry[] = [
    {
      id: 'meal_demo_1',
      userId: 'user_julius',
      mealType: 'Breakfast',
      foodName: 'Steel-cut oatmeal with sliced banana, chia seeds, and pasteurized whole milk',
      quantity: '1 bowl',
      date: today,
      time: '08:30',
      foodGroups: ['Whole grains', 'Fruit', 'Calcium-rich', 'Healthy fats'],
      notes: 'Gentle on the stomach and filling.',
    },
    {
      id: 'meal_demo_2',
      userId: 'user_julius',
      mealType: 'Lunch',
      foodName: 'Grilled lemon chicken bowl with quinoa, steamed broccoli, and avocado slices',
      quantity: '1 medium plate',
      date: today,
      time: '12:45',
      foodGroups: ['Protein', 'Whole grains', 'Vegetables', 'Healthy fats'],
      notes: 'Full of iron, folate, and protein.',
    },
    {
      id: 'meal_demo_3',
      userId: 'user_julius',
      mealType: 'Snack',
      foodName: 'Pasteurized Greek yogurt with fresh blueberries and a handful of walnuts',
      quantity: '1 cup',
      date: today,
      time: '16:00',
      foodGroups: ['Protein', 'Fruit', 'Calcium-rich', 'Healthy fats'],
      notes: 'Refreshing afternoon boost.',
    },
  ];

  const sampleHydration: HydrationEntry[] = [
    { id: 'hyd_demo_1', userId: 'user_julius', amount: 1, date: today, time: '08:15' },
    { id: 'hyd_demo_2', userId: 'user_julius', amount: 1, date: today, time: '10:00' },
    { id: 'hyd_demo_3', userId: 'user_julius', amount: 1, date: today, time: '12:30' },
    { id: 'hyd_demo_4', userId: 'user_julius', amount: 1, date: today, time: '14:45' },
    { id: 'hyd_demo_5', userId: 'user_julius', amount: 1, date: today, time: '17:15' },
  ];

  saveStoredProfile(defaultProfile);
  safeSetItem(STORAGE_KEYS.SYMPTOMS, JSON.stringify(sampleSymptoms));
  safeSetItem(STORAGE_KEYS.MEALS, JSON.stringify(sampleMeals));
  safeSetItem(STORAGE_KEYS.HYDRATION, JSON.stringify(sampleHydration));
  safeSetItem(STORAGE_KEYS.REMINDERS, JSON.stringify(getDefaultReminders()));

  return {
    profile: defaultProfile,
    symptoms: sampleSymptoms,
    meals: sampleMeals,
    hydration: sampleHydration,
  };
}

export function clearAllStoredData(): void {
  safeRemoveItem(STORAGE_KEYS.PROFILE);
  safeRemoveItem(STORAGE_KEYS.SYMPTOMS);
  safeRemoveItem(STORAGE_KEYS.MEALS);
  safeRemoveItem(STORAGE_KEYS.HYDRATION);
  safeRemoveItem(STORAGE_KEYS.REMINDERS);
}

export function exportAllDataAsJSON(): string {
  const data = {
    exportDate: new Date().toISOString(),
    profile: getStoredProfile(),
    symptoms: getStoredSymptoms(),
    meals: getStoredMeals(),
    hydration: getStoredHydration(),
    reminders: getStoredReminders(),
  };
  return JSON.stringify(data, null, 2);
}

function getOffsetDateString(daysOffset: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}
