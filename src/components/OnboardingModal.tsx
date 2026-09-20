import React, { useState } from 'react';
import { UserProfile } from '../types';
import { calculateTrimester, calculateDueDateFromWeek } from '../utils/pregnancyCalculations';
import { HeartHandshake, ShieldAlert, Baby, Calendar, ArrowRight, CheckCircle2 } from 'lucide-react';

interface OnboardingModalProps {
  onComplete: (profile: UserProfile) => void;
  onSeedDemo: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ onComplete, onSeedDemo }) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [name, setName] = useState('Julius');
  const [age, setAge] = useState<number | ''>(28);
  const [pregnancyStatus, setPregnancyStatus] = useState('Currently pregnant');
  const [pregnancyWeek, setPregnancyWeek] = useState<number>(22);
  const [dueDate, setDueDate] = useState<string>(calculateDueDateFromWeek(22));
  const [pregnancyType, setPregnancyType] = useState<'Singleton' | 'Twins' | 'Multiples' | 'Prefer not to say'>('Singleton');
  const [acknowledged, setAcknowledged] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const estimatedTrimester = calculateTrimester(pregnancyWeek);

  const handleWeekChange = (newWeek: number) => {
    const validWeek = Math.max(1, Math.min(42, newWeek));
    setPregnancyWeek(validWeek);
    setDueDate(calculateDueDateFromWeek(validWeek));
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your first name so we can personalize your experience.');
      return;
    }
    setError('');
    setStep(2);
  };

  const handleFinalize = () => {
    if (!acknowledged) {
      setError('Please read and acknowledge the health disclaimer before continuing.');
      return;
    }

    const newProfile: UserProfile = {
      id: 'user_' + Date.now(),
      name: name.trim(),
      age: typeof age === 'number' ? age : undefined,
      pregnancyStatus,
      pregnancyWeek,
      dueDate,
      pregnancyType,
      createdAt: new Date().toISOString(),
      acknowledgedDisclaimer: true,
      waterUnit: 'cups',
      dailyWaterGoalCups: 8,
    };

    onComplete(newProfile);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 dark:bg-black/80 backdrop-blur-xs p-4 overflow-y-auto">
      <div 
        id="onboarding-modal-card"
        className="w-full max-w-lg bg-white dark:bg-[#16181d] rounded-2xl shadow-xl border border-stone-200 dark:border-[#272a33] overflow-hidden my-6 transition-all"
      >
        {/* Header */}
        <div className="bg-stone-50 dark:bg-[#1c1f26] border-b border-stone-100 dark:border-[#272a33] p-6">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 flex items-center justify-center">
              <Baby className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold font-display text-stone-900 dark:text-white tracking-tight">Welcome to Pregnancy Wellness</h1>
              <p className="text-xs text-stone-500 dark:text-stone-400 font-medium">Your supportive, evidence-based pregnancy companion</p>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-4">
            <div className={`h-1.5 flex-1 rounded-full ${step >= 1 ? 'bg-rose-500' : 'bg-stone-200 dark:bg-[#272a33]'}`} />
            <div className={`h-1.5 flex-1 rounded-full ${step >= 2 ? 'bg-rose-500' : 'bg-stone-200 dark:bg-[#272a33]'}`} />
          </div>
        </div>

        {/* Step 1: Profile Information */}
        {step === 1 && (
          <form onSubmit={handleNext} className="p-6 space-y-5">
            <div>
              <h2 className="text-lg font-bold font-display text-stone-900 dark:text-white">Personalize Your Companion</h2>
              <p className="text-sm text-stone-600 dark:text-stone-400 mt-1">
                Share a few basic details so we can organize your symptoms, nutrition suggestions, and progress milestones.
              </p>
            </div>

            {error && (
              <div className="p-3 text-sm text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-xl">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="user-first-name" className="block text-sm font-semibold text-stone-800 dark:text-stone-200 mb-1">
                  First Name <span className="text-rose-500">*</span>
                </label>
                <input
                  id="user-first-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Julius"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-[#2e323d] text-stone-900 dark:text-stone-100 bg-white dark:bg-[#1c1f26] focus:outline-none focus:ring-2 focus:ring-rose-400 text-base"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="user-age" className="block text-sm font-semibold text-stone-800 dark:text-stone-200 mb-1">
                    Age <span className="text-xs text-stone-400 font-normal">(optional)</span>
                  </label>
                  <input
                    id="user-age"
                    type="number"
                    min="14"
                    max="65"
                    value={age}
                    onChange={(e) => setAge(e.target.value ? parseInt(e.target.value) : '')}
                    placeholder="e.g., 28"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-[#2e323d] text-stone-900 dark:text-stone-100 bg-white dark:bg-[#1c1f26] focus:outline-none focus:ring-2 focus:ring-rose-400 text-base"
                  />
                </div>

                <div>
                  <label htmlFor="user-pregnancy-week" className="block text-sm font-semibold text-stone-800 dark:text-stone-200 mb-1">
                    Pregnancy Week <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="user-pregnancy-week"
                    type="number"
                    min="1"
                    max="42"
                    value={pregnancyWeek}
                    onChange={(e) => handleWeekChange(parseInt(e.target.value) || 1)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-[#2e323d] text-stone-900 dark:text-stone-100 bg-white dark:bg-[#1c1f26] focus:outline-none focus:ring-2 focus:ring-rose-400 text-base"
                    required
                  />
                </div>
              </div>

              {/* Calculated stage card */}
              <div className="p-3.5 bg-rose-50/70 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-rose-800 dark:text-rose-300">Estimated Stage</span>
                  <div className="text-base font-semibold font-display text-stone-900 dark:text-white">
                    Week {pregnancyWeek} &bull; {estimatedTrimester}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-stone-500 dark:text-stone-400">Approx. Due Date</span>
                  <div className="text-sm font-semibold text-stone-800 dark:text-stone-200">{dueDate}</div>
                </div>
              </div>

              <div>
                <label htmlFor="user-due-date" className="block text-sm font-semibold text-stone-800 dark:text-stone-200 mb-1">
                  Estimated Due Date <span className="text-xs text-stone-400 font-normal">(optional, adjust if known)</span>
                </label>
                <div className="relative">
                  <input
                    id="user-due-date"
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-[#2e323d] text-stone-900 dark:text-stone-100 bg-white dark:bg-[#1c1f26] focus:outline-none focus:ring-2 focus:ring-rose-400 text-base"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="user-pregnancy-type" className="block text-sm font-semibold text-stone-800 dark:text-stone-200 mb-1">
                  Pregnancy Type <span className="text-xs text-stone-400 font-normal">(optional)</span>
                </label>
                <select
                  id="user-pregnancy-type"
                  value={pregnancyType}
                  onChange={(e) => setPregnancyType(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-[#2e323d] text-stone-900 dark:text-stone-100 bg-white dark:bg-[#1c1f26] focus:outline-none focus:ring-2 focus:ring-rose-400 text-base"
                >
                  <option value="Singleton">Singleton (one baby)</option>
                  <option value="Twins">Twins</option>
                  <option value="Multiples">Multiples</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                id="onboarding-next-btn"
                type="submit"
                className="flex-1 py-3 px-5 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors text-base cursor-pointer"
              >
                <span>Continue to Health Notice</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="text-center pt-1 border-t border-stone-100 dark:border-[#272a33]">
              <button
                type="button"
                id="onboarding-demo-seed-btn"
                onClick={onSeedDemo}
                className="text-xs text-rose-700 dark:text-rose-400 hover:text-rose-800 underline font-medium py-1 cursor-pointer"
              >
                Or quick-start with Julius's pre-loaded sample week (Week 22, 2 logged symptoms, 3 meals)
              </button>
            </div>
          </form>
        )}

        {/* Step 2: Essential Medical Disclaimer */}
        {step === 2 && (
          <div className="p-6 space-y-5">
            <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-xl">
              <ShieldAlert className="w-6 h-6 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold font-display text-amber-900 dark:text-amber-200 text-base">Important Health Notice</h3>
                <p className="text-sm text-amber-800 dark:text-amber-300 mt-1 leading-relaxed">
                  This app provides general pregnancy wellness and nutrition information. It does not replace care from a qualified healthcare professional. If you have concerning symptoms or an emergency, contact your healthcare provider or local emergency service.
                </p>
              </div>
            </div>

            <div className="space-y-2 text-sm text-stone-600 dark:text-stone-400 bg-stone-50 dark:bg-[#1c1f26] p-4 rounded-xl border border-stone-200 dark:border-[#272a33]">
              <div className="font-semibold text-stone-900 dark:text-white mb-1">By using this wellness companion, you understand:</div>
              <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm text-stone-700 dark:text-stone-300">
                <li>This tool does not provide medical diagnoses or replace prenatal appointments.</li>
                <li>Severity scales and trends are for your personal record-keeping only.</li>
                <li>Red-flag symptoms (such as heavy bleeding or severe pain) require immediate healthcare evaluation.</li>
                <li>Your health entries remain stored privately on this device.</li>
              </ul>
            </div>

            {error && (
              <div className="p-3 text-sm text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-xl">
                {error}
              </div>
            )}

            <div className="pt-1">
              <label 
                htmlFor="disclaimer-checkbox"
                className="flex items-start gap-3 p-3 rounded-xl border border-stone-300 dark:border-[#2e323d] hover:border-rose-300 dark:hover:border-rose-700 bg-white dark:bg-[#1c1f26] cursor-pointer select-none transition-colors"
              >
                <input
                  id="disclaimer-checkbox"
                  type="checkbox"
                  checked={acknowledged}
                  onChange={(e) => {
                    setAcknowledged(e.target.checked);
                    if (e.target.checked) setError('');
                  }}
                  className="w-5 h-5 mt-0.5 rounded border-stone-300 dark:border-[#2e323d] text-rose-600 focus:ring-rose-500 cursor-pointer"
                />
                <span className="text-sm text-stone-800 dark:text-stone-200 font-medium">
                  I acknowledge that this application is an informational wellness companion, not a clinical diagnostic tool or emergency service.
                </span>
              </label>
            </div>

            <div className="pt-2 flex gap-3">
              <button
                type="button"
                id="onboarding-back-btn"
                onClick={() => setStep(1)}
                className="py-3 px-4 border border-stone-300 dark:border-[#2e323d] text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-[#222630] font-medium rounded-xl text-base cursor-pointer"
              >
                Back
              </button>
              <button
                type="button"
                id="onboarding-finalize-btn"
                onClick={handleFinalize}
                disabled={!acknowledged}
                className={`flex-1 py-3 px-5 font-semibold rounded-xl flex items-center justify-center gap-2 shadow-xs text-base transition-colors ${
                  acknowledged 
                    ? 'bg-rose-600 hover:bg-rose-700 text-white cursor-pointer' 
                    : 'bg-stone-200 dark:bg-[#272a33] text-stone-400 dark:text-stone-600 cursor-not-allowed'
                }`}
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>Begin Your Companion</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
