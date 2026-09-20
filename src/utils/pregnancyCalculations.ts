import { Trimester, SeverityScale } from '../types';

export function calculateTrimester(week: number): Trimester {
  if (week <= 13) {
    return 'First Trimester';
  } else if (week <= 27) {
    return 'Second Trimester';
  } else {
    return 'Third Trimester';
  }
}

export function calculateWeeksRemaining(dueDateStr: string, currentWeek: number): number {
  if (dueDateStr) {
    const due = new Date(dueDateStr);
    const now = new Date();
    const diffTime = due.getTime() - now.getTime();
    const diffWeeks = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7));
    if (!isNaN(diffWeeks) && diffWeeks >= 0) {
      return diffWeeks;
    }
  }
  return Math.max(0, 40 - currentWeek);
}

export function calculateDueDateFromWeek(week: number): string {
  const remainingWeeks = Math.max(0, 40 - week);
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + remainingWeeks * 7);
  return targetDate.toISOString().split('T')[0];
}

export function getBabySizeComparison(week: number): { fruit: string; length: string; weight: string; note: string } {
  const comparisons: Record<number, { fruit: string; length: string; weight: string; note: string }> = {
    4: { fruit: 'Poppy Seed', length: '~0.04 in', weight: '< 0.04 oz', note: 'Cellular division and early implantation.' },
    8: { fruit: 'Raspberry', length: '~0.6 in', weight: '~0.04 oz', note: 'Webbed fingers and facial features forming.' },
    12: { fruit: 'Lime', length: '~2.1 in', weight: '~0.5 oz', note: 'Reflexes developing and organs actively functioning.' },
    16: { fruit: 'Avocado', length: '~4.6 in', weight: '~3.5 oz', note: 'Tiny fingernails, facial muscles can make expressions.' },
    20: { fruit: 'Banana', length: '~6.5 in', weight: '~10.6 oz', note: 'Halfway milestone! Hearing sounds and movement kicks.' },
    22: { fruit: 'Papaya', length: '~11 in (crown-to-heel)', weight: '~1 lb', note: 'Taste buds maturing, soft lanugo hair developing.' },
    24: { fruit: 'Ear of Corn', length: '~11.8 in', weight: '~1.3 lb', note: 'Lungs producing surfactant, rapid brain growth.' },
    28: { fruit: 'Eggplant', length: '~14.8 in', weight: '~2.2 lb', note: 'Eyelids can open, active dream (REM) brain cycles.' },
    32: { fruit: 'Squash', length: '~16.7 in', weight: '~3.8 lb', note: 'Bones hardening, practicing breathing motions.' },
    36: { fruit: 'Honeydew Melon', length: '~18.7 in', weight: '~5.8 lb', note: 'Gaining fat layers for temperature regulation.' },
    40: { fruit: 'Small Pumpkin / Watermelon', length: '~20 in', weight: '~7.5 lb', note: 'Fully developed and ready for birth soon!' },
  };

  const weeks = [4, 8, 12, 16, 20, 22, 24, 28, 32, 36, 40];
  let closest = weeks[0];
  for (const w of weeks) {
    if (Math.abs(w - week) <= Math.abs(closest - week)) {
      closest = w;
    }
  }
  return comparisons[closest];
}

export function getSeverityDetails(severity: SeverityScale): {
  label: string;
  description: string;
  badgeBg: string;
  badgeText: string;
  borderClass: string;
} {
  switch (severity) {
    case 1:
      return {
        label: '1 — Very mild',
        description: 'Hardly noticeable, does not interfere with daily routine',
        badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        badgeText: 'Very mild',
        borderClass: 'border-l-emerald-500',
      };
    case 2:
      return {
        label: '2 — Mild',
        description: 'Noticeable but easily tolerated with minimal interruption',
        badgeBg: 'bg-teal-50 text-teal-800 border-teal-200',
        badgeText: 'Mild',
        borderClass: 'border-l-teal-500',
      };
    case 3:
      return {
        label: '3 — Moderate',
        description: 'Uncomfortable, somewhat disrupts tasks or sleep',
        badgeBg: 'bg-amber-50 text-amber-800 border-amber-200',
        badgeText: 'Moderate',
        borderClass: 'border-l-amber-500',
      };
    case 4:
      return {
        label: '4 — Severe',
        description: 'Significantly disrupts activity; requires rest or attention',
        badgeBg: 'bg-orange-50 text-orange-800 border-orange-200',
        badgeText: 'Severe',
        borderClass: 'border-l-orange-500',
      };
    case 5:
      return {
        label: '5 — Very severe',
        description: 'Incapacitating or intense; seek professional advice',
        badgeBg: 'bg-rose-50 text-rose-800 border-rose-200',
        badgeText: 'Very severe',
        borderClass: 'border-l-rose-500',
      };
  }
}

export function getTodayDateString(): string {
  const today = new Date();
  const y = today.getFullYear();
  const m = String(today.getMonth() + 1).padStart(2, '0');
  const d = String(today.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function getCurrentTimeString(): string {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, '0');
  const min = String(now.getMinutes()).padStart(2, '0');
  return `${h}:${min}`;
}

export function getGreeting(name: string): string {
  const hour = new Date().getHours();
  let timeGreeting = 'Good morning';
  if (hour >= 12 && hour < 17) {
    timeGreeting = 'Good afternoon';
  } else if (hour >= 17) {
    timeGreeting = 'Good evening';
  }
  return `${timeGreeting}${name ? `, ${name.trim()}` : ''}`;
}
