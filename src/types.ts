export type Trimester = 'First Trimester' | 'Second Trimester' | 'Third Trimester';

export interface UserProfile {
  id: string;
  name: string;
  age?: number;
  pregnancyStatus: string;
  pregnancyWeek: number;
  dueDate: string; // YYYY-MM-DD
  pregnancyType?: 'Singleton' | 'Twins' | 'Multiples' | 'Prefer not to say';
  createdAt: string;
  acknowledgedDisclaimer: boolean;
  providerName?: string;
  providerPhone?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  waterUnit: 'cups' | 'ml' | 'oz';
  dailyWaterGoalCups: number;
}

export type SeverityScale = 1 | 2 | 3 | 4 | 5;

export interface SymptomEntry {
  id: string;
  userId: string;
  symptomName: string;
  severity: SeverityScale;
  duration: string; // e.g., "< 30 mins", "1-2 hours", "Half day", "All day", "Intermittent"
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  notes?: string;
  trigger?: string; // e.g., "After eating", "Morning", "Stress", "Fatigue", "Heat"
  isCustom?: boolean;
}

export type MealCategory = 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';

export type FoodGroup = 
  | 'Protein' 
  | 'Fruit' 
  | 'Vegetables' 
  | 'Whole grains' 
  | 'Calcium-rich' 
  | 'Healthy fats'
  | 'Iron/Folate-rich';

export interface MealEntry {
  id: string;
  userId: string;
  mealType: MealCategory;
  foodName: string;
  quantity: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  foodGroups: FoodGroup[];
  notes?: string;
}

export interface HydrationEntry {
  id: string;
  userId: string;
  amount: number; // in cups
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
}

export type ReminderType = 'water' | 'symptom' | 'meal' | 'appointment' | 'medication_supplement';

export interface ReminderItem {
  id: string;
  userId: string;
  reminderType: ReminderType;
  title: string;
  scheduledTime: string; // HH:mm
  enabled: boolean;
  notes?: string;
}

export interface NutritionTopic {
  id: string;
  title: string;
  category: 'nutrient' | 'food_safety' | 'foods_to_limit';
  shortExplanation: string;
  whyItMatters: string;
  foodSources: string[];
  safetyNotes: string;
  citations: {
    source: string; // e.g. "American College of Obstetricians and Gynecologists (ACOG)"
    reviewedDate: string;
    urlOrDoc: string;
  }[];
}

export interface SafetyAlert {
  id: string;
  symptom: string;
  urgency: 'urgent' | 'emergency';
  notice: string;
  guidance: string;
}

export type ActiveTab = 'dashboard' | 'symptoms' | 'nutrition' | 'trends' | 'profile';
