import React, { useState } from 'react';
import { SymptomEntry, SeverityScale } from '../types';
import { PREDEFINED_SYMPTOMS } from '../data/symptomData';
import { 
  getSeverityDetails, 
  getTodayDateString, 
  getCurrentTimeString 
} from '../utils/pregnancyCalculations';
import { 
  Activity, 
  Plus, 
  Filter, 
  Trash2, 
  Edit3, 
  AlertCircle, 
  Clock, 
  Calendar, 
  X, 
  Check, 
  ShieldAlert,
  Search,
  Sparkles
} from 'lucide-react';

interface SymptomsViewProps {
  symptoms: SymptomEntry[];
  onSaveSymptom: (entry: SymptomEntry) => void;
  onDeleteSymptom: (id: string) => void;
  isQuickLogOpenInitially?: boolean;
  onOpenEmergency: () => void;
}

export const SymptomsView: React.FC<SymptomsViewProps> = ({
  symptoms,
  onSaveSymptom,
  onDeleteSymptom,
  isQuickLogOpenInitially = false,
  onOpenEmergency,
}) => {
  const [isFormOpen, setIsFormOpen] = useState(isQuickLogOpenInitially);
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);

  // Form states
  const [selectedSymptom, setSelectedSymptom] = useState<string>('Nausea');
  const [customSymptom, setCustomSymptom] = useState<string>('');
  const [severity, setSeverity] = useState<SeverityScale>(2);
  const [date, setDate] = useState<string>(getTodayDateString());
  const [time, setTime] = useState<string>(getCurrentTimeString());
  const [duration, setDuration] = useState<string>('1-2 hours');
  const [trigger, setTrigger] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [formError, setFormError] = useState<string>('');

  // Filter states
  const [filterSymptom, setFilterSymptom] = useState<string>('all');
  const [filterDateRange, setFilterDateRange] = useState<'all' | '7days' | '30days'>('all');
  const [filterSeverity, setFilterSeverity] = useState<string>('all');

  const durationOptions = [
    '< 30 minutes',
    '30–60 minutes',
    '1–2 hours',
    'Half the day',
    'All day / Constant',
    'Intermittent / Comes & goes',
  ];

  const commonTriggers = [
    'Empty stomach',
    'After eating',
    'Morning upon waking',
    'Physical exertion',
    'Prolonged standing',
    'Lack of sleep',
    'Stress / Anxiety',
    'Hot weather / Heat',
    'Strong odor',
  ];

  // Active symptom details if predefined
  const currentPredefined = PREDEFINED_SYMPTOMS.find(
    (s) => s.name.toLowerCase() === selectedSymptom.toLowerCase()
  );

  const isSevereLevel = severity >= 4;
  const isConcerningPredefined = currentPredefined?.isRedFlagTrigger;

  const handleOpenNewForm = () => {
    setEditingEntryId(null);
    setSelectedSymptom('Nausea');
    setCustomSymptom('');
    setSeverity(2);
    setDate(getTodayDateString());
    setTime(getCurrentTimeString());
    setDuration('1-2 hours');
    setTrigger('');
    setNotes('');
    setFormError('');
    setIsFormOpen(true);
  };

  const handleEdit = (entry: SymptomEntry) => {
    setEditingEntryId(entry.id);
    const matched = PREDEFINED_SYMPTOMS.find(
      (s) => s.name.toLowerCase() === entry.symptomName.toLowerCase()
    );
    if (matched) {
      setSelectedSymptom(matched.name);
      setCustomSymptom('');
    } else {
      setSelectedSymptom('Other');
      setCustomSymptom(entry.symptomName);
    }
    setSeverity(entry.severity);
    setDate(entry.date);
    setTime(entry.time);
    setDuration(entry.duration || '1-2 hours');
    setTrigger(entry.trigger || '');
    setNotes(entry.notes || '');
    setFormError('');
    setIsFormOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = selectedSymptom === 'Other' ? customSymptom.trim() : selectedSymptom;
    if (!finalName) {
      setFormError('Please specify or select a symptom name.');
      return;
    }

    const entryToSave: SymptomEntry = {
      id: editingEntryId || 'sym_' + Date.now(),
      userId: 'user_main',
      symptomName: finalName,
      severity,
      duration,
      date,
      time,
      trigger: trigger.trim() || undefined,
      notes: notes.trim() || undefined,
      isCustom: selectedSymptom === 'Other',
    };

    onSaveSymptom(entryToSave);
    setIsFormOpen(false);
    setEditingEntryId(null);
  };

  // Filtering calculation
  const filteredSymptoms = symptoms.filter((entry) => {
    if (filterSymptom !== 'all' && entry.symptomName.toLowerCase() !== filterSymptom.toLowerCase()) {
      return false;
    }
    if (filterSeverity !== 'all' && entry.severity.toString() !== filterSeverity) {
      return false;
    }
    if (filterDateRange === '7days') {
      const entryDate = new Date(entry.date);
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      if (entryDate < sevenDaysAgo) return false;
    } else if (filterDateRange === '30days') {
      const entryDate = new Date(entry.date);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      if (entryDate < thirtyDaysAgo) return false;
    }
    return true;
  });

  const uniqueSymptomNames = Array.from(new Set(symptoms.map((s) => s.symptomName)));

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
            Observation Journal
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-stone-900 dark:text-white tracking-tight">
            Symptom Tracker
          </h1>
          <p className="text-sm text-stone-600 dark:text-stone-400 mt-0.5">
            Log your daily symptoms to observe personal patterns over time.
          </p>
        </div>

        <button
          id="log-new-symptom-btn"
          onClick={handleOpenNewForm}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 dark:bg-rose-600 dark:hover:bg-rose-500 text-white font-medium rounded-xl text-sm transition-colors shadow-xs self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Log a Symptom</span>
        </button>
      </div>

      {/* Non-Diagnostic Disclaimer Card */}
      <div className="p-3.5 bg-stone-50 dark:bg-[#16181d] border border-stone-200 dark:border-[#272a33] rounded-xl text-xs text-stone-600 dark:text-stone-400 flex items-start gap-2.5 transition-colors">
        <AlertCircle className="w-4 h-4 text-stone-500 dark:text-stone-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-stone-800 dark:text-stone-200">Observation Notice: </span>
          This tracker is for personal journaling and memory support. It does not evaluate causes or provide medical diagnoses. Always discuss persistent or severe symptoms directly with your doctor or midwife.
        </div>
      </div>

      {/* Modal / Inline Form for Logging */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 dark:bg-black/75 backdrop-blur-xs p-4 overflow-y-auto">
          <div 
            id="symptom-entry-modal"
            className="w-full max-w-lg bg-white dark:bg-[#16181d] rounded-2xl shadow-xl border border-stone-200 dark:border-[#272a33] overflow-hidden my-6 transition-all"
          >
            <div className="bg-stone-50 dark:bg-[#1c1f26] border-b border-stone-200 dark:border-[#272a33] p-4 sm:p-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 flex items-center justify-center">
                  <Activity className="w-4 h-4" />
                </div>
                <h2 className="text-lg font-bold font-display text-stone-900 dark:text-white">
                  {editingEntryId ? 'Edit Symptom Entry' : 'Log a Symptom'}
                </h2>
              </div>
              <button
                onClick={() => setIsFormOpen(false)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-[#272a33] transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
              {formError && (
                <div className="p-3 text-xs text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 rounded-lg">
                  {formError}
                </div>
              )}

              {/* Symptom Selection */}
              <div>
                <label htmlFor="symptom-name-select" className="block text-xs font-semibold text-stone-800 dark:text-stone-200 uppercase tracking-wide mb-1.5">
                  Symptom <span className="text-rose-500">*</span>
                </label>
                <select
                  id="symptom-name-select"
                  value={selectedSymptom}
                  onChange={(e) => setSelectedSymptom(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-[#2e323d] text-stone-900 dark:text-stone-100 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 bg-white dark:bg-[#1c1f26]"
                >
                  {PREDEFINED_SYMPTOMS.map((sym) => (
                    <option key={sym.name} value={sym.name} className="dark:bg-[#1c1f26]">
                      {sym.name}
                    </option>
                  ))}
                  <option value="Other" className="dark:bg-[#1c1f26]">Other (Custom Symptom)</option>
                </select>

                {selectedSymptom === 'Other' && (
                  <div className="mt-2">
                    <input
                      type="text"
                      placeholder="Enter custom symptom name..."
                      value={customSymptom}
                      onChange={(e) => setCustomSymptom(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-300 dark:border-[#2e323d] text-stone-900 dark:text-stone-100 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 bg-white dark:bg-[#1c1f26]"
                      required
                    />
                  </div>
                )}

                {currentPredefined && (
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-1.5 bg-stone-50 dark:bg-[#1c1f26] p-2.5 rounded-lg border border-stone-100 dark:border-[#272a33]">
                    <span className="font-medium text-stone-700 dark:text-stone-300">General Note: </span>
                    {currentPredefined.typicalDescription}
                  </p>
                )}
              </div>

              {/* Severity Scale 1 - 5 */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-stone-800 dark:text-stone-200 uppercase tracking-wide">
                    Severity Scale <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-xs font-bold text-stone-700 dark:text-stone-300">
                    {getSeverityDetails(severity).label}
                  </span>
                </div>

                {/* 5-step interactive button group */}
                <div className="grid grid-cols-5 gap-1.5" role="radiogroup" aria-label="Severity rating">
                  {([1, 2, 3, 4, 5] as SeverityScale[]).map((level) => {
                    const isSelected = severity === level;
                    const details = getSeverityDetails(level);
                    return (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setSeverity(level)}
                        className={`py-2.5 px-1 rounded-xl flex flex-col items-center justify-center text-xs font-semibold border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-rose-600 dark:bg-rose-600 text-white border-rose-600 shadow-xs'
                            : 'bg-stone-50 dark:bg-[#1c1f26] text-stone-700 dark:text-stone-300 border-stone-200 dark:border-[#272a33] hover:bg-stone-100 dark:hover:bg-[#222630]'
                        }`}
                        role="radio"
                        aria-checked={isSelected}
                      >
                        <span className="text-base font-bold">{level}</span>
                        <span className="text-[10px] text-center leading-tight truncate w-full px-0.5">
                          {details.badgeText}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1.5 italic">
                  {getSeverityDetails(severity).description}
                </p>
              </div>

              {/* Immediate Safety Warning if concerning symptom or severe severity */}
              {(isSevereLevel || isConcerningPredefined) && (
                <div className="p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 rounded-xl space-y-1.5">
                  <div className="flex items-center gap-1.5 text-rose-900 dark:text-rose-300 font-semibold text-xs">
                    <ShieldAlert className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                    <span>Clinical Caution & Safety Guidance</span>
                  </div>
                  <p className="text-xs text-rose-800 dark:text-rose-200 leading-relaxed">
                    {currentPredefined?.safetyNote ||
                      'You selected a severe rating (Level 4–5). Severe or rapidly worsening symptoms during pregnancy should always be evaluated by your doctor, midwife, or maternity emergency unit.'}
                  </p>
                  <button
                    type="button"
                    onClick={onOpenEmergency}
                    className="text-xs text-rose-800 dark:text-rose-300 font-bold underline hover:text-rose-900 dark:hover:text-rose-200 pt-0.5 cursor-pointer"
                  >
                    View emergency guidelines & call resources &rarr;
                  </button>
                </div>
              )}

              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="symptom-date-input" className="block text-xs font-semibold text-stone-800 dark:text-stone-200 uppercase tracking-wide mb-1">
                    Date <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="symptom-date-input"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-[#2e323d] text-stone-900 dark:text-stone-100 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 bg-white dark:bg-[#1c1f26]"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="symptom-time-input" className="block text-xs font-semibold text-stone-800 dark:text-stone-200 uppercase tracking-wide mb-1">
                    Time <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="symptom-time-input"
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-[#2e323d] text-stone-900 dark:text-stone-100 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 bg-white dark:bg-[#1c1f26]"
                    required
                  />
                </div>
              </div>

              {/* Duration */}
              <div>
                <label htmlFor="symptom-duration-select" className="block text-xs font-semibold text-stone-800 dark:text-stone-200 uppercase tracking-wide mb-1">
                  Duration
                </label>
                <select
                  id="symptom-duration-select"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-[#2e323d] text-stone-900 dark:text-stone-100 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 bg-white dark:bg-[#1c1f26]"
                >
                  {durationOptions.map((opt) => (
                    <option key={opt} value={opt} className="dark:bg-[#1c1f26]">
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              {/* Optional Context / Trigger */}
              <div>
                <label htmlFor="symptom-trigger-input" className="block text-xs font-semibold text-stone-800 dark:text-stone-200 uppercase tracking-wide mb-1">
                  Optional Trigger / Context
                </label>
                <input
                  id="symptom-trigger-input"
                  type="text"
                  placeholder="e.g., After walking, Morning sickness, Skipped water"
                  value={trigger}
                  onChange={(e) => setTrigger(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 dark:border-[#2e323d] text-stone-900 dark:text-stone-100 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 bg-white dark:bg-[#1c1f26]"
                />
                {/* Quick trigger chips */}
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {commonTriggers.slice(0, 5).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTrigger(t)}
                      className="text-[11px] px-2 py-0.5 bg-stone-100 dark:bg-[#222630] hover:bg-stone-200 dark:hover:bg-[#2b303d] text-stone-700 dark:text-stone-300 rounded-md transition-colors cursor-pointer"
                    >
                      +{t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label htmlFor="symptom-notes-input" className="block text-xs font-semibold text-stone-800 dark:text-stone-200 uppercase tracking-wide mb-1">
                  Notes & Details <span className="text-xs font-normal text-stone-400">(optional)</span>
                </label>
                <textarea
                  id="symptom-notes-input"
                  rows={2}
                  placeholder="Describe what relieved it, any sensations, or questions for your provider..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 dark:border-[#2e323d] text-stone-900 dark:text-stone-100 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 bg-white dark:bg-[#1c1f26] resize-none"
                />
              </div>

              {/* Buttons */}
              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="py-2.5 px-4 border border-stone-300 dark:border-[#2e323d] text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-[#222630] font-medium rounded-xl text-sm transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  id="save-symptom-entry-btn"
                  type="submit"
                  className="flex-1 py-2.5 px-5 bg-rose-600 hover:bg-rose-700 text-white font-medium rounded-xl text-sm transition-colors shadow-xs cursor-pointer"
                >
                  {editingEntryId ? 'Update Symptom' : 'Save Symptom'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Symptom History & Filters Section */}
      <section aria-labelledby="symptom-history-heading" className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-[#16181d] p-4 rounded-xl border border-stone-200 dark:border-[#272a33] shadow-2xs transition-colors">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-stone-500 dark:text-stone-400" />
            <h2 id="symptom-history-heading" className="text-sm font-bold font-display text-stone-900 dark:text-white">
              Filter Logged Entries ({filteredSymptoms.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
            {/* Symptom filter */}
            <select
              id="filter-symptom-select"
              aria-label="Filter by symptom"
              value={filterSymptom}
              onChange={(e) => setFilterSymptom(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-stone-200 dark:border-[#272a33] text-stone-800 dark:text-stone-200 bg-stone-50 dark:bg-[#1c1f26] focus:outline-none"
            >
              <option value="all">All Symptoms</option>
              {uniqueSymptomNames.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>

            {/* Date range filter */}
            <select
              id="filter-date-select"
              aria-label="Filter by date range"
              value={filterDateRange}
              onChange={(e) => setFilterDateRange(e.target.value as any)}
              className="px-2.5 py-1.5 rounded-lg border border-stone-200 dark:border-[#272a33] text-stone-800 dark:text-stone-200 bg-stone-50 dark:bg-[#1c1f26] focus:outline-none"
            >
              <option value="all">All Dates</option>
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
            </select>

            {/* Severity filter */}
            <select
              id="filter-severity-select"
              aria-label="Filter by severity level"
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-stone-200 dark:border-[#272a33] text-stone-800 dark:text-stone-200 bg-stone-50 dark:bg-[#1c1f26] focus:outline-none"
            >
              <option value="all">All Severities</option>
              <option value="1">1 — Very mild</option>
              <option value="2">2 — Mild</option>
              <option value="3">3 — Moderate</option>
              <option value="4">4 — Severe</option>
              <option value="5">5 — Very severe</option>
            </select>
          </div>
        </div>

        {/* List of Symptoms or Empty State */}
        {filteredSymptoms.length === 0 ? (
          <div 
            id="symptoms-empty-state" 
            className="p-8 sm:p-12 text-center bg-white dark:bg-[#16181d] rounded-2xl border border-stone-200 dark:border-[#272a33] shadow-2xs space-y-3 transition-colors"
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 flex items-center justify-center mx-auto">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-semibold font-display text-stone-900 dark:text-white">
                {symptoms.length === 0 ? 'No symptoms logged yet.' : 'No matching entries found.'}
              </h3>
              <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 max-w-sm mx-auto mt-1">
                {symptoms.length === 0
                  ? 'Track how you are feeling to build your personal symptom history and identify patterns.'
                  : 'Try adjusting your filters above to view your recorded history.'}
              </p>
            </div>
            <button
              id="empty-state-log-symptom-btn"
              onClick={handleOpenNewForm}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-medium rounded-xl text-sm transition-colors shadow-2xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Log your first symptom</span>
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredSymptoms.map((entry) => {
              const severityDetails = getSeverityDetails(entry.severity);
              return (
                <div
                  key={entry.id}
                  id={`symptom-card-${entry.id}`}
                  className="bg-white dark:bg-[#16181d] rounded-xl border border-stone-200 dark:border-[#272a33] p-4 shadow-2xs hover:border-stone-300 dark:hover:border-stone-700 transition-all"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-base font-bold font-display text-stone-900 dark:text-white">
                          {entry.symptomName}
                        </h3>
                        {/* Both number and text to satisfy accessibility guidelines */}
                        <span 
                          className={`text-xs font-semibold px-2 py-0.5 rounded-md border ${severityDetails.badgeBg} dark:bg-opacity-20`}
                        >
                          Severity: {entry.severity} — {severityDetails.badgeText}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-stone-500 dark:text-stone-400 mt-1 flex-wrap">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {entry.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {entry.time}
                        </span>
                        {entry.duration && (
                          <span className="bg-stone-100 dark:bg-[#222630] text-stone-700 dark:text-stone-300 px-2 py-0.5 rounded">
                            {entry.duration}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleEdit(entry)}
                        className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-[#222630] rounded-lg transition-colors cursor-pointer"
                        title="Edit entry"
                        aria-label={`Edit ${entry.symptomName}`}
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteSymptom(entry.id)}
                        className="p-1.5 text-stone-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
                        title="Delete entry"
                        aria-label={`Delete ${entry.symptomName}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {entry.trigger && (
                    <div className="mt-2.5 text-xs text-stone-600 dark:text-stone-400 bg-stone-50 dark:bg-[#1c1f26] p-2 rounded-lg border border-stone-100 dark:border-[#272a33]">
                      <span className="font-semibold text-stone-700 dark:text-stone-300">Trigger / Context: </span>
                      {entry.trigger}
                    </div>
                  )}

                  {entry.notes && (
                    <p className="mt-2 text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
                      {entry.notes}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};
