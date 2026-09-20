import React, { useState } from 'react';
import { UserProfile, ReminderItem, ReminderType } from '../types';
import { 
  User, 
  Settings, 
  Bell, 
  Phone, 
  ShieldCheck, 
  Download, 
  Trash2, 
  Plus, 
  BookOpen, 
  Info, 
  Check, 
  AlertTriangle,
  HeartHandshake
} from 'lucide-react';
import { exportAllDataAsJSON } from '../utils/storage';

interface ProfileViewProps {
  profile: UserProfile;
  reminders: ReminderItem[];
  onUpdateProfile: (updated: UserProfile) => void;
  onSaveReminder: (reminder: ReminderItem) => void;
  onToggleReminder: (id: string, enabled: boolean) => void;
  onDeleteReminder: (id: string) => void;
  onDeleteAllData: () => void;
  onOpenEmergency: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  profile,
  reminders,
  onUpdateProfile,
  onSaveReminder,
  onToggleReminder,
  onDeleteReminder,
  onDeleteAllData,
  onOpenEmergency,
}) => {
  const [activeSubSection, setActiveSubSection] = useState<'profile' | 'reminders' | 'privacy'>('profile');

  // Form states for profile editing
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [name, setName] = useState(profile.name);
  const [age, setAge] = useState<number | ''>(profile.age || '');
  const [pregnancyWeek, setPregnancyWeek] = useState(profile.pregnancyWeek);
  const [dueDate, setDueDate] = useState(profile.dueDate);
  const [pregnancyType, setPregnancyType] = useState(profile.pregnancyType || 'Singleton');
  const [providerName, setProviderName] = useState(profile.providerName || '');
  const [providerPhone, setProviderPhone] = useState(profile.providerPhone || '');
  const [emergencyContactName, setEmergencyContactName] = useState(profile.emergencyContactName || '');
  const [emergencyContactPhone, setEmergencyContactPhone] = useState(profile.emergencyContactPhone || '');
  const [waterUnit, setWaterUnit] = useState<'cups' | 'ml' | 'oz'>(profile.waterUnit || 'cups');
  const [dailyWaterGoalCups, setDailyWaterGoalCups] = useState(profile.dailyWaterGoalCups || 8);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  // Reminder adding modal / form
  const [isAddingReminder, setIsAddingReminder] = useState(false);
  const [reminderType, setReminderType] = useState<ReminderType>('water');
  const [reminderTitle, setReminderTitle] = useState('');
  const [reminderTime, setReminderTime] = useState('10:00');
  const [reminderNotes, setReminderNotes] = useState('');

  // Confirmation dialog for delete all
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserProfile = {
      ...profile,
      name: name.trim() || 'Mama',
      age: typeof age === 'number' ? age : undefined,
      pregnancyWeek,
      dueDate,
      pregnancyType: pregnancyType as any,
      providerName: providerName.trim() || undefined,
      providerPhone: providerPhone.trim() || undefined,
      emergencyContactName: emergencyContactName.trim() || undefined,
      emergencyContactPhone: emergencyContactPhone.trim() || undefined,
      waterUnit,
      dailyWaterGoalCups,
    };

    onUpdateProfile(updated);
    setIsEditingProfile(false);
    setSaveSuccessMsg('Profile updated successfully.');
    setTimeout(() => setSaveSuccessMsg(''), 3000);
  };

  const handleCreateReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reminderTitle.trim()) return;

    const newReminder: ReminderItem = {
      id: 'rem_' + Date.now(),
      userId: profile.id,
      reminderType,
      title: reminderTitle.trim(),
      scheduledTime: reminderTime,
      enabled: true,
      notes: reminderNotes.trim() || undefined,
    };

    onSaveReminder(newReminder);
    setIsAddingReminder(false);
    setReminderTitle('');
    setReminderNotes('');
  };

  const handleExportJSON = () => {
    const dataStr = exportAllDataAsJSON();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `pregnancy_wellness_export_${profile.name.toLowerCase()}_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Header */}
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400">
          Personal Control
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold font-display text-stone-900 dark:text-white tracking-tight">
          Profile & Settings
        </h1>
        <p className="text-sm text-stone-600 dark:text-stone-400 mt-0.5">
          Manage your pregnancy details, reminders, privacy options, and emergency contacts.
        </p>
      </div>

      {saveSuccessMsg && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs rounded-xl flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {/* Sub-navigation tabs */}
      <div className="flex items-center space-x-2 border-b border-stone-200 dark:border-[#272a33]">
        <button
          id="profile-tab-details"
          onClick={() => setActiveSubSection('profile')}
          className={`pb-3 px-3 text-sm font-semibold transition-colors border-b-2 -mb-px cursor-pointer ${
            activeSubSection === 'profile'
              ? 'border-rose-600 text-rose-700 dark:text-rose-400 dark:border-rose-500'
              : 'border-transparent text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
          }`}
        >
          Profile & Care Contacts
        </button>
        <button
          id="profile-tab-reminders"
          onClick={() => setActiveSubSection('reminders')}
          className={`pb-3 px-3 text-sm font-semibold transition-colors border-b-2 -mb-px cursor-pointer ${
            activeSubSection === 'reminders'
              ? 'border-rose-600 text-rose-700 dark:text-rose-400 dark:border-rose-500'
              : 'border-transparent text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
          }`}
        >
          Personal Reminders
        </button>
        <button
          id="profile-tab-privacy"
          onClick={() => setActiveSubSection('privacy')}
          className={`pb-3 px-3 text-sm font-semibold transition-colors border-b-2 -mb-px cursor-pointer ${
            activeSubSection === 'privacy'
              ? 'border-rose-600 text-rose-700 dark:text-rose-400 dark:border-rose-500'
              : 'border-transparent text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
          }`}
        >
          Data, Privacy & Sources
        </button>
      </div>

      {/* SECTION 1: Profile & Contacts */}
      {activeSubSection === 'profile' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-[#16181d] rounded-2xl border border-stone-200 dark:border-[#272a33] p-5 sm:p-6 shadow-xs transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-400 flex items-center justify-center font-bold font-display text-lg">
                  {profile.name ? profile.name.charAt(0).toUpperCase() : 'M'}
                </div>
                <div>
                  <h2 className="text-lg font-bold font-display text-stone-900 dark:text-white">{profile.name}</h2>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    Week {profile.pregnancyWeek} &bull; Estimated Due Date: {profile.dueDate}
                  </p>
                </div>
              </div>

              {!isEditingProfile && (
                <button
                  id="edit-profile-btn"
                  onClick={() => setIsEditingProfile(true)}
                  className="px-3.5 py-1.5 border border-stone-200 dark:border-[#272a33] hover:bg-stone-50 dark:hover:bg-[#222630] text-stone-700 dark:text-stone-200 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  Edit Profile
                </button>
              )}
            </div>

            {/* View or Edit form */}
            {!isEditingProfile ? (
              <div className="space-y-4 pt-2 border-t border-stone-100 dark:border-[#272a33]">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                  <div className="p-3 bg-stone-50 dark:bg-[#1c1f26] rounded-xl border border-stone-100 dark:border-[#272a33]">
                    <span className="text-stone-400 dark:text-stone-500 block text-xs">Current Week</span>
                    <span className="font-semibold text-stone-900 dark:text-stone-100 font-display">Week {profile.pregnancyWeek}</span>
                  </div>
                  <div className="p-3 bg-stone-50 dark:bg-[#1c1f26] rounded-xl border border-stone-100 dark:border-[#272a33]">
                    <span className="text-stone-400 dark:text-stone-500 block text-xs">Estimated Due Date</span>
                    <span className="font-semibold text-stone-900 dark:text-stone-100 font-display">{profile.dueDate || 'Not specified'}</span>
                  </div>
                  <div className="p-3 bg-stone-50 dark:bg-[#1c1f26] rounded-xl border border-stone-100 dark:border-[#272a33]">
                    <span className="text-stone-400 dark:text-stone-500 block text-xs">Pregnancy Type</span>
                    <span className="font-semibold text-stone-900 dark:text-stone-100 font-display">{profile.pregnancyType || 'Singleton'}</span>
                  </div>
                  <div className="p-3 bg-stone-50 dark:bg-[#1c1f26] rounded-xl border border-stone-100 dark:border-[#272a33]">
                    <span className="text-stone-400 dark:text-stone-500 block text-xs">Age</span>
                    <span className="font-semibold text-stone-900 dark:text-stone-100 font-display">{profile.age ? `${profile.age} years` : 'Not provided'}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-2">
                    Designated Care Contacts
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3.5 border border-stone-200 dark:border-[#272a33] rounded-xl bg-white dark:bg-[#1c1f26]">
                      <span className="text-xs text-stone-500 dark:text-stone-400 font-medium block">OB/GYN or Midwife</span>
                      <span className="text-sm font-semibold text-stone-900 dark:text-white block mt-0.5">
                        {profile.providerName || 'Not configured'}
                      </span>
                      {profile.providerPhone && (
                        <a href={`tel:${profile.providerPhone}`} className="text-xs text-rose-700 dark:text-rose-400 font-semibold mt-1 inline-block">
                          {profile.providerPhone}
                        </a>
                      )}
                    </div>

                    <div className="p-3.5 border border-stone-200 dark:border-[#272a33] rounded-xl bg-white dark:bg-[#1c1f26]">
                      <span className="text-xs text-stone-500 dark:text-stone-400 font-medium block">Personal Emergency Contact</span>
                      <span className="text-sm font-semibold text-stone-900 dark:text-white block mt-0.5">
                        {profile.emergencyContactName || 'Not configured'}
                      </span>
                      {profile.emergencyContactPhone && (
                        <a href={`tel:${profile.emergencyContactPhone}`} className="text-xs text-rose-700 dark:text-rose-400 font-semibold mt-1 inline-block">
                          {profile.emergencyContactPhone}
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleProfileSave} className="space-y-4 pt-2 border-t border-stone-100 dark:border-[#272a33]">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-800 dark:text-stone-200 mb-1">Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-[#2e323d] text-stone-900 dark:text-stone-100 bg-white dark:bg-[#1c1f26] text-sm focus:ring-2 focus:ring-rose-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-800 dark:text-stone-200 mb-1">Age</label>
                    <input
                      type="number"
                      value={age}
                      onChange={(e) => setAge(e.target.value ? parseInt(e.target.value) : '')}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-[#2e323d] text-stone-900 dark:text-stone-100 bg-white dark:bg-[#1c1f26] text-sm focus:ring-2 focus:ring-rose-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-800 dark:text-stone-200 mb-1">Pregnancy Week (1–42)</label>
                    <input
                      type="number"
                      min="1"
                      max="42"
                      value={pregnancyWeek}
                      onChange={(e) => setPregnancyWeek(parseInt(e.target.value) || 1)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-[#2e323d] text-stone-900 dark:text-stone-100 bg-white dark:bg-[#1c1f26] text-sm focus:ring-2 focus:ring-rose-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-800 dark:text-stone-200 mb-1">Estimated Due Date</label>
                    <input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-[#2e323d] text-stone-900 dark:text-stone-100 bg-white dark:bg-[#1c1f26] text-sm focus:ring-2 focus:ring-rose-400"
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-stone-100 dark:border-[#272a33]">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-2">Care Provider Contacts</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-stone-800 dark:text-stone-200 mb-1">Doctor / Midwife Name</label>
                      <input
                        type="text"
                        placeholder="e.g., Dr. Sarah Jenkins"
                        value={providerName}
                        onChange={(e) => setProviderName(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-[#2e323d] text-stone-900 dark:text-stone-100 bg-white dark:bg-[#1c1f26] text-sm focus:ring-2 focus:ring-rose-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-800 dark:text-stone-200 mb-1">Provider Phone</label>
                      <input
                        type="tel"
                        placeholder="e.g., (555) 234-8901"
                        value={providerPhone}
                        onChange={(e) => setProviderPhone(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-[#2e323d] text-stone-900 dark:text-stone-100 bg-white dark:bg-[#1c1f26] text-sm focus:ring-2 focus:ring-rose-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-800 dark:text-stone-200 mb-1">Emergency Contact Name</label>
                      <input
                        type="text"
                        placeholder="e.g., Marcus (Partner)"
                        value={emergencyContactName}
                        onChange={(e) => setEmergencyContactName(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-[#2e323d] text-stone-900 dark:text-stone-100 bg-white dark:bg-[#1c1f26] text-sm focus:ring-2 focus:ring-rose-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-800 dark:text-stone-200 mb-1">Emergency Contact Phone</label>
                      <input
                        type="tel"
                        placeholder="e.g., (555) 876-5432"
                        value={emergencyContactPhone}
                        onChange={(e) => setEmergencyContactPhone(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-[#2e323d] text-stone-900 dark:text-stone-100 bg-white dark:bg-[#1c1f26] text-sm focus:ring-2 focus:ring-rose-400"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 justify-end pt-3">
                  <button
                    type="button"
                    onClick={() => setIsEditingProfile(false)}
                    className="px-4 py-2 border border-stone-200 dark:border-[#2e323d] text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-[#222630] rounded-xl text-xs font-medium cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold shadow-2xs cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* SECTION 2: Personalized Reminders (Section 16) */}
      {activeSubSection === 'reminders' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold font-display text-stone-900 dark:text-white">Configured Reminders</h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Personalized notifications for water, symptoms, meals, appointments, or doctor-prescribed supplements.
              </p>
            </div>
            <button
              onClick={() => setIsAddingReminder(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Reminder</span>
            </button>
          </div>

          {/* Explicit Medical Guardrail Callout (Section 16 & 24) */}
          <div className="p-3.5 bg-stone-50 dark:bg-[#16181d] border border-stone-200 dark:border-[#272a33] rounded-xl text-xs text-stone-600 dark:text-stone-400 flex items-start gap-2">
            <Info className="w-4 h-4 text-stone-400 dark:text-stone-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-stone-800 dark:text-stone-200">Prescription Safety Policy: </span>
              This companion only assists you in remembering medications or supplements that your doctor or midwife has already explicitly prescribed for you. The application does not recommend or adjust dosages for any drugs or vitamins.
            </div>
          </div>

          {/* List of Reminders */}
          <div className="space-y-2.5">
            {reminders.map((rem) => (
              <div
                key={rem.id}
                className="bg-white dark:bg-[#16181d] p-4 rounded-xl border border-stone-200 dark:border-[#272a33] flex items-center justify-between gap-3 shadow-2xs"
              >
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    rem.enabled ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400' : 'bg-stone-100 dark:bg-[#222630] text-stone-400 dark:text-stone-500'
                  }`}>
                    <Bell className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className={`text-sm font-semibold font-display ${rem.enabled ? 'text-stone-900 dark:text-white' : 'text-stone-400 dark:text-stone-500'}`}>
                        {rem.title}
                      </h3>
                      <span className="text-xs font-bold text-stone-500 dark:text-stone-400 bg-stone-100 dark:bg-[#222630] px-2 py-0.5 rounded">
                        {rem.scheduledTime}
                      </span>
                    </div>
                    {rem.notes && (
                      <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">{rem.notes}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => onToggleReminder(rem.id, !rem.enabled)}
                    className={`px-3 py-1 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                      rem.enabled
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                        : 'bg-stone-50 dark:bg-[#222630] border-stone-200 dark:border-[#2e323d] text-stone-400 dark:text-stone-500'
                    }`}
                  >
                    {rem.enabled ? 'Active' : 'Off'}
                  </button>
                  <button
                    onClick={() => onDeleteReminder(rem.id)}
                    className="p-1.5 text-stone-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg cursor-pointer"
                    title="Delete reminder"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Modal to add reminder */}
          {isAddingReminder && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 dark:bg-black/75 backdrop-blur-xs p-4 overflow-y-auto">
              <div className="w-full max-w-md bg-white dark:bg-[#16181d] rounded-2xl p-5 border border-stone-200 dark:border-[#272a33] shadow-xl space-y-4">
                <h3 className="text-base font-bold font-display text-stone-900 dark:text-white">New Reminder</h3>

                <form onSubmit={handleCreateReminder} className="space-y-3 text-xs">
                  <div>
                    <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">Category</label>
                    <select
                      value={reminderType}
                      onChange={(e) => setReminderType(e.target.value as any)}
                      className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-[#2e323d] text-stone-800 dark:text-stone-100 bg-white dark:bg-[#1c1f26]"
                    >
                      <option value="water">Drinking Water</option>
                      <option value="symptom">Logging Symptoms</option>
                      <option value="meal">Logging Meals</option>
                      <option value="appointment">Prenatal Appointment</option>
                      <option value="medication_supplement">Prescribed Medication / Supplement</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">Reminder Title</label>
                    <input
                      type="text"
                      placeholder="e.g., Take prescribed prenatal with dinner"
                      value={reminderTitle}
                      onChange={(e) => setReminderTitle(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-[#2e323d] text-stone-800 dark:text-stone-100 bg-white dark:bg-[#1c1f26]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">Scheduled Time</label>
                    <input
                      type="time"
                      value={reminderTime}
                      onChange={(e) => setReminderTime(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-[#2e323d] text-stone-800 dark:text-stone-100 bg-white dark:bg-[#1c1f26]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">Notes (optional)</label>
                    <input
                      type="text"
                      placeholder="e.g., Have a glass of water with it"
                      value={reminderNotes}
                      onChange={(e) => setReminderNotes(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-[#2e323d] text-stone-800 dark:text-stone-100 bg-white dark:bg-[#1c1f26]"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingReminder(false)}
                      className="px-3.5 py-1.5 border border-stone-200 dark:border-[#2e323d] rounded-xl text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-[#222630] cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-xl cursor-pointer shadow-xs"
                    >
                      Add Reminder
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SECTION 3: Privacy, Data Export, Sources & Reset */}
      {activeSubSection === 'privacy' && (
        <div className="space-y-5">
          {/* Data Export & Privacy Protection */}
          <div className="bg-white dark:bg-[#16181d] rounded-2xl border border-stone-200 dark:border-[#272a33] p-5 shadow-xs space-y-3 transition-colors">
            <h2 className="text-base font-bold font-display text-stone-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              Privacy & Local Storage Protection
            </h2>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              Your health and pregnancy records are stored locally and encrypted within this browser session. The application does not transmit or monetize your personal health data. You retain 100% control to export or permanently erase your journal anytime.
            </p>

            <div className="pt-2 flex flex-wrap gap-2">
              <button
                id="export-data-json-btn"
                onClick={handleExportJSON}
                className="inline-flex items-center gap-2 px-4 py-2 bg-stone-800 hover:bg-stone-900 dark:bg-stone-700 dark:hover:bg-stone-600 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Export All Data (JSON)</span>
              </button>
            </div>
          </div>

          {/* Reputable Medical Sources Citations (Section 25) */}
          <div className="bg-white dark:bg-[#16181d] rounded-2xl border border-stone-200 dark:border-[#272a33] p-5 shadow-xs space-y-3 transition-colors">
            <h2 className="text-base font-bold font-display text-stone-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-stone-700 dark:text-stone-400" />
              Clinical Sources & Health Authorities
            </h2>
            <p className="text-xs text-stone-600 dark:text-stone-400">
              Guidance throughout this application references established public-health publications:
            </p>
            <ul className="text-xs text-stone-700 dark:text-stone-300 space-y-2 list-disc list-inside">
              <li>
                <strong className="text-stone-900 dark:text-white">American College of Obstetricians and Gynecologists (ACOG):</strong> Practice Advisory: Nutrition and Food Safety in Pregnancy (Updated 2024).
              </li>
              <li>
                <strong className="text-stone-900 dark:text-white">World Health Organization (WHO):</strong> WHO Recommendations on Antenatal Care for a Positive Pregnancy Experience (Maternal Nutrition Guidelines).
              </li>
              <li>
                <strong className="text-stone-900 dark:text-white">Centers for Disease Control and Prevention (CDC):</strong> Maternal and Infant Health: Food Safety for Pregnant Women & Listeria Prevention.
              </li>
              <li>
                <strong className="text-stone-900 dark:text-white">National Health Service (NHS):</strong> Healthy Eating, Food Warnings and Vitamins in Pregnancy.
              </li>
            </ul>
          </div>

          {/* Delete All Data & Reset Application */}
          <div className="bg-rose-50/50 dark:bg-rose-950/20 rounded-2xl border border-rose-200 dark:border-rose-900/40 p-5 shadow-xs space-y-2 transition-colors">
            <h2 className="text-base font-bold font-display text-rose-900 dark:text-rose-300 flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-rose-600 dark:text-rose-400" />
              Erase Data & Reset Companion
            </h2>
            <p className="text-xs text-rose-800 dark:text-rose-300/80">
              Permanently delete all stored symptoms, meal logs, hydration history, reminders, and profile information from this device.
            </p>

            {!isConfirmingDelete ? (
              <button
                id="reset-all-data-btn"
                onClick={() => setIsConfirmingDelete(true)}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl transition-colors shadow-2xs mt-2 cursor-pointer"
              >
                Delete All Data & Start Fresh
              </button>
            ) : (
              <div className="p-3 bg-white dark:bg-[#1c1f26] rounded-xl border border-rose-300 dark:border-rose-900/60 space-y-2 mt-2">
                <p className="text-xs font-bold text-rose-900 dark:text-rose-300">
                  Are you sure? This action cannot be undone. All logs will be permanently erased.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsConfirmingDelete(false)}
                    className="px-3 py-1.5 border border-stone-200 dark:border-[#2e323d] text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-[#222630] rounded-lg text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    id="confirm-delete-all-btn"
                    onClick={() => {
                      onDeleteAllData();
                      setIsConfirmingDelete(false);
                    }}
                    className="px-4 py-1.5 bg-rose-700 hover:bg-rose-800 text-white rounded-lg text-xs font-bold cursor-pointer"
                  >
                    Confirm Permanent Deletion
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
