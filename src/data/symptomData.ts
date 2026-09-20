export interface PredefinedSymptom {
  name: string;
  category: 'digestive' | 'energy_neurological' | 'musculoskeletal' | 'respiratory_circulatory' | 'emotional_other';
  typicalDescription: string;
  commonContextTriggers: string[];
  safetyNote?: string;
  isRedFlagTrigger?: boolean;
}

export const PREDEFINED_SYMPTOMS: PredefinedSymptom[] = [
  {
    name: 'Nausea',
    category: 'digestive',
    typicalDescription: 'Often called morning sickness, though it can occur at any time of day. Common in the first trimester as hormones rise.',
    commonContextTriggers: ['Empty stomach', 'Strong odors', 'Warm temperature', 'Fatigue', 'After eating'],
  },
  {
    name: 'Vomiting',
    category: 'digestive',
    typicalDescription: 'Expulsion of stomach contents related to pregnancy hormone shifts. Ensure sips of fluids throughout the day.',
    commonContextTriggers: ['Certain foods', 'Empty stomach', 'Morning', 'Motion', 'Specific smells'],
    safetyNote: 'If you are unable to keep any liquids down for 12–24 hours, or notice dark urine or dizziness, contact your healthcare provider promptly to check for dehydration.',
    isRedFlagTrigger: true,
  },
  {
    name: 'Fatigue',
    category: 'energy_neurological',
    typicalDescription: 'Profound tiredness due to increased progesterone, metabolic demands, and increased blood volume.',
    commonContextTriggers: ['Lack of sleep', 'Physical exertion', 'Late afternoon', 'Stress'],
  },
  {
    name: 'Headache',
    category: 'energy_neurological',
    typicalDescription: 'Can occur due to hormonal shifts, dehydration, stress, sinus pressure, or fatigue.',
    commonContextTriggers: ['Dehydration', 'Lack of sleep', 'Skipped meal', 'Screen time', 'Stress'],
    safetyNote: 'A severe, persistent headache—especially if paired with vision spots, right upper abdominal pain, or sudden facial swelling—requires urgent medical assessment to rule out preeclampsia.',
    isRedFlagTrigger: true,
  },
  {
    name: 'Back pain',
    category: 'musculoskeletal',
    typicalDescription: 'Lower back ache or pelvic girdle discomfort caused by shifting center of gravity and the relaxing hormone loosening ligaments.',
    commonContextTriggers: ['Prolonged standing', 'Lifting objects', 'Poor posture', 'End of day'],
  },
  {
    name: 'Heartburn',
    category: 'digestive',
    typicalDescription: 'Burning sensation in chest or throat caused by stomach acid reflux as progesterone relaxes the digestive valve.',
    commonContextTriggers: ['Spicy food', 'Lying down after eating', 'Greasy/acidic meals', 'Large portions'],
  },
  {
    name: 'Constipation',
    category: 'digestive',
    typicalDescription: 'Infrequent or hard bowel movements due to slower intestinal transit time and iron supplements.',
    commonContextTriggers: ['Low fiber intake', 'Inadequate water', 'Iron supplements', 'Lack of movement'],
  },
  {
    name: 'Bloating',
    category: 'digestive',
    typicalDescription: 'Fullness or abdominal gas feeling caused by slowed gastrointestinal digestion.',
    commonContextTriggers: ['Carbonated drinks', 'Heavy meals', 'Cruciferous vegetables', 'Eating quickly'],
  },
  {
    name: 'Dizziness',
    category: 'energy_neurological',
    typicalDescription: 'Lightheaded feeling from blood pressure drops, blood vessel relaxation, or rapid standing.',
    commonContextTriggers: ['Standing up too quickly', 'Warm environment', 'Hunger', 'Crowded spaces'],
    safetyNote: 'Sudden fainting or dizziness accompanied by chest pain, irregular heartbeat, or vaginal bleeding requires urgent medical care.',
    isRedFlagTrigger: true,
  },
  {
    name: 'Swelling',
    category: 'respiratory_circulatory',
    typicalDescription: 'Mild edema in feet, ankles, and legs from increased fluids and venous pressure, common toward end of day.',
    commonContextTriggers: ['Hot weather', 'Prolonged standing', 'Long sitting', 'High sodium meal'],
    safetyNote: 'Sudden, rapid swelling in the face, eyes, or hands, or one leg being noticeably more swollen and tender than the other, should be evaluated promptly.',
    isRedFlagTrigger: true,
  },
  {
    name: 'Leg cramps',
    category: 'musculoskeletal',
    typicalDescription: 'Sudden muscle spasms usually in the calves or feet, frequently occurring at night.',
    commonContextTriggers: ['Nighttime / sleeping', 'Fatigued legs', 'Cold feet', 'Stretching toes downward'],
  },
  {
    name: 'Abdominal discomfort',
    category: 'musculoskeletal',
    typicalDescription: 'Mild twinges or round ligament stretching sensations as the uterus expands. Often brief sharp twinges with movement.',
    commonContextTriggers: ['Sudden movement', 'Coughing or sneezing', 'Rolling over in bed', 'Walking briskly'],
    safetyNote: 'Persistent, severe, or cramping abdominal pain, or any pain accompanied by bleeding, fever, or chills, requires immediate medical evaluation.',
    isRedFlagTrigger: true,
  },
  {
    name: 'Shortness of breath',
    category: 'respiratory_circulatory',
    typicalDescription: 'Mild awareness of breathing deeper as progesterone stimulates respiration and the expanding uterus presses against the diaphragm.',
    commonContextTriggers: ['Climbing stairs', 'Lying flat on back', 'After large meals'],
    safetyNote: 'Sudden severe difficulty breathing, blue lips, chest tightness, or coughing up blood is a medical emergency.',
    isRedFlagTrigger: true,
  },
  {
    name: 'Mood changes',
    category: 'emotional_other',
    typicalDescription: 'Emotional shifts, heightened sensitivity, or anxiety influenced by hormonal changes and pregnancy transitions.',
    commonContextTriggers: ['Fatigue', 'Life stress', 'Physical discomfort', 'Overwhelm'],
  },
];

export interface EmergencyRedFlag {
  title: string;
  category: 'Immediate Emergency (911 / ER)' | 'Urgent Provider Assessment (< 24 hrs)';
  description: string;
  recommendedAction: string;
}

export const URGENT_RED_FLAGS: EmergencyRedFlag[] = [
  {
    title: 'Heavy Vaginal Bleeding',
    category: 'Immediate Emergency (911 / ER)',
    description: 'Bright red bleeding soaking through a sanitary pad, or bleeding accompanied by abdominal pain, fever, or dizziness.',
    recommendedAction: 'Seek emergency medical evaluation immediately. Do not wait.',
  },
  {
    title: 'Severe, Continuous Abdominal or Pelvic Pain',
    category: 'Immediate Emergency (911 / ER)',
    description: 'Sharp, relentless pain that does not ease with rest, or feels distinct from mild stretching.',
    recommendedAction: 'Contact your healthcare provider right away or go to the nearest emergency room.',
  },
  {
    title: 'Severe Headache with Vision Distortions or Facial Swelling',
    category: 'Urgent Provider Assessment (< 24 hrs)',
    description: 'Intense headache not relieved by fluids/rest, flashing lights, spots, blurred vision, or sudden puffiness in face and hands.',
    recommendedAction: 'Contact your obstetrician, midwife, or labor & delivery assessment unit immediately to check blood pressure.',
  },
  {
    title: 'Difficulty Breathing or Chest Pain',
    category: 'Immediate Emergency (911 / ER)',
    description: 'Sudden shortness of breath while at rest, chest pressure, rapid heart rate, or feeling faint.',
    recommendedAction: 'Call emergency services (911 / 112 / 999) or proceed to emergency department immediately.',
  },
  {
    title: 'Loss of Consciousness, Severe Fainting, or Seizure',
    category: 'Immediate Emergency (911 / ER)',
    description: 'Blacking out, falling from dizziness, or any convulsive activity.',
    recommendedAction: 'Emergency medical care required immediately.',
  },
  {
    title: 'Severe, Inability to Keep Fluids Down (24+ hours)',
    category: 'Urgent Provider Assessment (< 24 hrs)',
    description: 'Persistent vomiting preventing hydration, dark/infrequent urine, dry mouth, weakness.',
    recommendedAction: 'Call your maternity care provider for assessment and intravenous hydration support.',
  },
  {
    title: 'Noticeable Decrease or Cessation of Fetal Movements',
    category: 'Urgent Provider Assessment (< 24 hrs)',
    description: 'If you are past 24-28 weeks and notice your baby is moving significantly less than usual, or not at all after drinking cold water and resting.',
    recommendedAction: 'Do not wait until the next day. Contact your maternity triage, labor & delivery unit, or doctor immediately.',
  },
  {
    title: 'Sudden Fluid Gush or Continuous Leakage',
    category: 'Urgent Provider Assessment (< 24 hrs)',
    description: 'A sudden flow or persistent trickle of clear or greenish/brown fluid before your term.',
    recommendedAction: 'Contact your maternity provider immediately; your amniotic membranes may have ruptured.',
  },
  {
    title: 'High Fever (> 100.4°F / 38°C) with Chills',
    category: 'Urgent Provider Assessment (< 24 hrs)',
    description: 'Fever that could indicate an underlying maternal or amniotic infection.',
    recommendedAction: 'Call your healthcare provider promptly for diagnostic evaluation.',
  },
];
