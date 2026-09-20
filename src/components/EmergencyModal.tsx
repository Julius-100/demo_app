import React from 'react';
import { UserProfile } from '../types';
import { URGENT_RED_FLAGS } from '../data/symptomData';
import { PhoneCall, AlertTriangle, X, ShieldAlert, HeartPulse, Hospital } from 'lucide-react';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile | null;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({ isOpen, onClose, profile }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/70 backdrop-blur-xs p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="emergency-modal-title"
    >
      <div 
        id="emergency-guidance-card"
        className="w-full max-w-2xl bg-white dark:bg-[#16181d] rounded-2xl shadow-2xl border border-stone-200 dark:border-[#272a33] overflow-hidden my-6 transition-all"
      >
        {/* Banner */}
        <div className="bg-rose-700 dark:bg-rose-800 text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-rose-800 dark:bg-rose-900 rounded-xl text-rose-100">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h2 id="emergency-modal-title" className="text-xl font-bold font-display tracking-tight">
                Pregnancy Safety & Urgent Support
              </h2>
              <p className="text-xs text-rose-100">
                Medical evaluation guidance & emergency contacts
              </p>
            </div>
          </div>
          <button
            id="close-emergency-modal-btn"
            onClick={onClose}
            aria-label="Close emergency modal"
            className="p-2 rounded-lg bg-rose-800/80 hover:bg-rose-800 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Top critical callout */}
          <div className="p-4 bg-rose-50 dark:bg-rose-950/30 border-l-4 border-rose-600 rounded-r-xl">
            <h3 className="text-base font-semibold text-rose-900 dark:text-rose-200 flex items-center gap-2 font-display">
              <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
              If you believe you are experiencing a medical emergency:
            </h3>
            <p className="text-sm text-rose-800 dark:text-rose-300 mt-1 font-medium leading-relaxed">
              Do not wait to log symptoms or check online advice. Immediately call emergency services or proceed to the nearest emergency department or maternity triage unit.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <a
                href="tel:911"
                id="emergency-call-911-btn"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-rose-700 hover:bg-rose-800 text-white font-semibold rounded-xl text-sm transition-colors shadow-xs"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Call 911 (US / Emergency)</span>
              </a>
              <a
                href="tel:112"
                className="inline-flex items-center gap-2 px-3.5 py-2.5 bg-stone-800 hover:bg-stone-900 dark:bg-stone-700 dark:hover:bg-stone-600 text-white font-medium rounded-xl text-sm transition-colors"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Call 112 (EU/Global)</span>
              </a>
              <a
                href="tel:999"
                className="inline-flex items-center gap-2 px-3.5 py-2.5 bg-stone-800 hover:bg-stone-900 dark:bg-stone-700 dark:hover:bg-stone-600 text-white font-medium rounded-xl text-sm transition-colors"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Call 999 (UK)</span>
              </a>
            </div>
          </div>

          {/* User's personal healthcare contacts */}
          <div className="bg-stone-50 dark:bg-[#1c1f26] border border-stone-200 dark:border-[#272a33] rounded-xl p-4">
            <h3 className="text-sm font-semibold font-display text-stone-900 dark:text-white uppercase tracking-wider mb-3 flex items-center gap-2">
              <Hospital className="w-4 h-4 text-stone-600 dark:text-stone-400" />
              Your Designated Care Contacts
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 bg-white dark:bg-[#16181d] rounded-lg border border-stone-200 dark:border-[#272a33]">
                <span className="text-xs text-stone-500 dark:text-stone-400 font-medium block">OB/GYN or Midwife</span>
                <span className="text-sm font-semibold text-stone-900 dark:text-stone-100 block mt-0.5">
                  {profile?.providerName || 'Not configured yet'}
                </span>
                {profile?.providerPhone ? (
                  <a
                    href={`tel:${profile.providerPhone}`}
                    className="inline-flex items-center gap-1.5 text-xs text-rose-700 dark:text-rose-400 font-semibold mt-1 hover:underline"
                  >
                    <PhoneCall className="w-3 h-3" />
                    {profile.providerPhone}
                  </a>
                ) : (
                  <span className="text-xs text-stone-400 dark:text-stone-500 block mt-1">Add phone in Profile tab</span>
                )}
              </div>

              <div className="p-3 bg-white dark:bg-[#16181d] rounded-lg border border-stone-200 dark:border-[#272a33]">
                <span className="text-xs text-stone-500 dark:text-stone-400 font-medium block">Personal Emergency Contact</span>
                <span className="text-sm font-semibold text-stone-900 dark:text-stone-100 block mt-0.5">
                  {profile?.emergencyContactName || 'Not configured yet'}
                </span>
                {profile?.emergencyContactPhone ? (
                  <a
                    href={`tel:${profile.emergencyContactPhone}`}
                    className="inline-flex items-center gap-1.5 text-xs text-rose-700 dark:text-rose-400 font-semibold mt-1 hover:underline"
                  >
                    <PhoneCall className="w-3 h-3" />
                    {profile.emergencyContactPhone}
                  </a>
                ) : (
                  <span className="text-xs text-stone-400 dark:text-stone-500 block mt-1">Add phone in Profile tab</span>
                )}
              </div>
            </div>

            {/* Maternal Mental Health Line */}
            <div className="mt-3 p-3 bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-900/40 rounded-lg flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-teal-900 dark:text-teal-200 block">National Maternal Mental Health Hotline (US)</span>
                <span className="text-xs text-teal-800 dark:text-teal-300">Free, confidential 24/7 support for pregnant & new moms</span>
              </div>
              <a
                href="tel:18338526262"
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-semibold shrink-0"
              >
                <PhoneCall className="w-3 h-3" />
                1-833-TLC-MAMA
              </a>
            </div>
          </div>

          {/* Red Flag Symptoms to Know */}
          <div>
            <div className="mb-3">
              <h3 className="text-base font-semibold font-display text-stone-900 dark:text-white">
                Symptoms That Always Require Medical Assessment
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                The application does not diagnose causes. If you experience any of these, contact your maternity unit immediately:
              </p>
            </div>

            <div className="space-y-3">
              {URGENT_RED_FLAGS.map((flag, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl border border-stone-200 dark:border-[#272a33] bg-white dark:bg-[#1c1f26] hover:border-rose-300 dark:hover:border-rose-800 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="font-semibold text-stone-900 dark:text-stone-100 text-sm">{flag.title}</div>
                    <span 
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-md whitespace-nowrap ${
                        flag.category.includes('Emergency')
                          ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-900/60'
                          : 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-900/60'
                      }`}
                    >
                      {flag.category.includes('Emergency') ? 'Immediate Emergency' : 'Prompt Assessment'}
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 dark:text-stone-400 mt-1.5 leading-relaxed">
                    {flag.description}
                  </p>
                  <div className="mt-2 text-xs font-medium text-rose-800 dark:text-rose-300 bg-rose-50/60 dark:bg-rose-950/30 p-2 rounded-lg border border-rose-100 dark:border-rose-900/40">
                    <span className="font-semibold">Action: </span>{flag.recommendedAction}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-stone-50 dark:bg-[#1c1f26] p-4 border-t border-stone-200 dark:border-[#272a33] flex justify-end">
          <button
            id="emergency-modal-understood-btn"
            onClick={onClose}
            className="px-5 py-2.5 bg-stone-800 hover:bg-stone-900 dark:bg-stone-700 dark:hover:bg-stone-600 text-white font-medium text-sm rounded-xl transition-colors cursor-pointer"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};
