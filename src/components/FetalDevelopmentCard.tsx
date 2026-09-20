import React, { useState } from 'react';
import { UserProfile } from '../types';
import { calculateTrimester, calculateWeeksRemaining, getBabySizeComparison } from '../utils/pregnancyCalculations';
import { Calendar, ChevronLeft, ChevronRight, RotateCcw, Heart, Sparkles, Compass, ShieldCheck } from 'lucide-react';

interface FetalDevelopmentCardProps {
  profile: UserProfile;
}

interface GestationalMilestone {
  stageName: string;
  crownToHeelCm: number;
  weightGrams: number;
  heartRateBpm: string;
  keyHighlight: string;
  sensoryMilestone: string;
  maternalBodyInsight: string;
  illustrationType: 'embryo' | 'early_fetus' | 'growing_fetus' | 'active_baby' | 'maturing_baby' | 'full_term';
}

const MILESTONES_DATA: Record<number, GestationalMilestone> = {
  4: {
    stageName: 'Blastocyst & Early Embryo',
    crownToHeelCm: 0.1,
    weightGrams: 0.1,
    heartRateBpm: '~100 bpm (initiating)',
    keyHighlight: 'Amniotic sac and placenta are rapidly vascularizing. Primitive streak develops.',
    sensoryMilestone: 'Cellular differentiation into ectoderm, mesoderm, and endoderm.',
    maternalBodyInsight: 'Mild implantation spotting or fatigue may occur as hCG hormones surge.',
    illustrationType: 'embryo',
  },
  8: {
    stageName: 'Embryonic Transition',
    crownToHeelCm: 1.6,
    weightGrams: 1,
    heartRateBpm: '150–170 bpm',
    keyHighlight: 'Webbed fingers, nose tip, and miniature eyelids begin defining the facial structure.',
    sensoryMilestone: 'Neural tube has completely closed; primitive motor reflexes begin firing.',
    maternalBodyInsight: 'Heightened olfactory sensitivity and morning nausea peak around this window.',
    illustrationType: 'embryo',
  },
  12: {
    stageName: 'End of First Trimester',
    crownToHeelCm: 5.4,
    weightGrams: 14,
    heartRateBpm: '140–160 bpm',
    keyHighlight: 'All major organ systems are anatomically formed. Tiny fingernails and toenails sprout.',
    sensoryMilestone: 'Vocal cords develop; kidneys begin producing and excreting amniotic fluid.',
    maternalBodyInsight: 'Placenta takes over primary progesterone synthesis; nausea frequently begins to subside.',
    illustrationType: 'early_fetus',
  },
  16: {
    stageName: 'Second Trimester Growth',
    crownToHeelCm: 11.6,
    weightGrams: 100,
    heartRateBpm: '130–150 bpm',
    keyHighlight: 'Facial muscles practice frowning and squinting. Skeleton is transitioning from cartilage to bone.',
    sensoryMilestone: 'Eyes can make slight movements; ears are positioned closer to their final location.',
    maternalBodyInsight: 'Increased blood circulation can produce the classic "pregnancy glow" and renewed energy.',
    illustrationType: 'growing_fetus',
  },
  20: {
    stageName: 'Halfway Milestone',
    crownToHeelCm: 25.6,
    weightGrams: 300,
    heartRateBpm: '130–150 bpm',
    keyHighlight: 'Vernix caseosa and soft lanugo hair coat delicate skin, protecting against amniotic fluid.',
    sensoryMilestone: 'Fetus clearly hears maternal heartbeat, rushing blood, and external voices.',
    maternalBodyInsight: 'Time for the mid-pregnancy anatomy scan (level II ultrasound) to survey structural development.',
    illustrationType: 'active_baby',
  },
  22: {
    stageName: 'Sensory Awakening',
    crownToHeelCm: 28.0,
    weightGrams: 430,
    heartRateBpm: '120–150 bpm',
    keyHighlight: 'Taste buds are actively discerning flavors transmitted through swallowed amniotic fluid.',
    sensoryMilestone: 'Coordinated hand-to-face touching and thumb sucking frequently seen on sonograms.',
    maternalBodyInsight: 'Fetal kicks (quickening) are distinctly noticeable and becoming rhythmic daily patterns.',
    illustrationType: 'active_baby',
  },
  24: {
    stageName: 'Viability Milestone',
    crownToHeelCm: 30.0,
    weightGrams: 600,
    heartRateBpm: '120–150 bpm',
    keyHighlight: 'Lungs begin producing pulmonary surfactant, essential for keeping air sacs open after birth.',
    sensoryMilestone: 'Inner ear balance structures mature, allowing the fetus to perceive upside-down orientation.',
    maternalBodyInsight: 'Uterus is approximately the size of a soccer ball, centered near the belly button.',
    illustrationType: 'active_baby',
  },
  28: {
    stageName: 'Third Trimester Threshold',
    crownToHeelCm: 37.6,
    weightGrams: 1000,
    heartRateBpm: '120–140 bpm',
    keyHighlight: 'Eyelids can open and close. Active REM (rapid eye movement) sleep patterns are detectable.',
    sensoryMilestone: 'Brain tissue shows rapid dendritic branching and surface cortex folding.',
    maternalBodyInsight: 'Kick counting (feeling 10 discrete movements within 2 hours of rest) begins this trimester.',
    illustrationType: 'maturing_baby',
  },
  32: {
    stageName: 'Rapid Adipose Accumulation',
    crownToHeelCm: 42.4,
    weightGrams: 1700,
    heartRateBpm: '120–140 bpm',
    keyHighlight: 'Baby is accumulating white subcutaneous fat layers to regulate body temperature post-delivery.',
    sensoryMilestone: 'Pupils can dilate and constrict in response to bright light shone on mother’s abdomen.',
    maternalBodyInsight: 'Mild Braxton Hicks contractions (sporadic, painless uterine practice tightenings) may appear.',
    illustrationType: 'maturing_baby',
  },
  36: {
    stageName: 'Late Pre-Term Preparation',
    crownToHeelCm: 47.4,
    weightGrams: 2600,
    heartRateBpm: '110–140 bpm',
    keyHighlight: 'Immune system receives maternal IgG antibodies across the placenta for newborn protection.',
    sensoryMilestone: 'Grasping reflex is firm; musculoskeletal tone is prepared for extrauterine gravity.',
    maternalBodyInsight: 'Baby may drop lower into the pelvis ("lightening"), easing rib pressure but increasing bladder visits.',
    illustrationType: 'full_term',
  },
  40: {
    stageName: 'Full Term Maturation',
    crownToHeelCm: 51.2,
    weightGrams: 3400,
    heartRateBpm: '110–140 bpm',
    keyHighlight: 'Fully developed lungs, mature suck-swallow breathing coordination, ready for birth.',
    sensoryMilestone: 'Recognizes parent voices heard consistently during gestational third trimester.',
    maternalBodyInsight: 'Cervix ripens and softens in anticipation of labor; keep your birth bag and provider contacts handy.',
    illustrationType: 'full_term',
  },
};

export const FetalDevelopmentCard: React.FC<FetalDevelopmentCardProps> = ({ profile }) => {
  const currentActualWeek = Math.min(40, Math.max(4, profile.pregnancyWeek || 22));
  const [selectedWeek, setSelectedWeek] = useState<number>(currentActualWeek);

  // Find closest milestone data
  const milestoneKeys = [4, 8, 12, 16, 20, 22, 24, 28, 32, 36, 40];
  const closestWeek = milestoneKeys.reduce((prev, curr) => 
    Math.abs(curr - selectedWeek) < Math.abs(prev - selectedWeek) ? curr : prev
  );
  const milestone = MILESTONES_DATA[closestWeek] || MILESTONES_DATA[22];

  const sizeComp = getBabySizeComparison(selectedWeek);
  const trimester = calculateTrimester(selectedWeek);
  const weeksRemaining = calculateWeeksRemaining(profile.dueDate, selectedWeek);
  const progressPercent = Math.min(100, Math.round((selectedWeek / 40) * 100));

  const isViewingCurrent = selectedWeek === currentActualWeek;

  return (
    <div 
      id="fetal-development-card"
      className="bg-white dark:bg-[#16181d] rounded-2xl border border-stone-200/90 dark:border-[#272a33] p-5 sm:p-6 shadow-xs transition-colors"
    >
      {/* Top Header: Trimester + Week Navigator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100 dark:border-stone-800">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-rose-600 dark:bg-rose-500 text-white text-xs font-bold rounded-lg tracking-wide shadow-2xs font-display">
            Week {selectedWeek}
          </span>
          <span className="px-2.5 py-1 bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs font-medium rounded-lg">
            {trimester}
          </span>
          {!isViewingCurrent && (
            <button
              onClick={() => setSelectedWeek(currentActualWeek)}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded-md hover:underline cursor-pointer"
              title="Reset to your current gestational week"
            >
              <RotateCcw className="w-3 h-3" />
              Reset to Week {currentActualWeek}
            </button>
          )}
        </div>

        {/* Stepper Navigator */}
        <div className="flex items-center space-x-1.5 self-start sm:self-auto">
          <button
            onClick={() => setSelectedWeek(w => Math.max(4, w - 1))}
            disabled={selectedWeek <= 4}
            className="p-1.5 rounded-lg border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            aria-label="Previous gestational week"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-semibold text-stone-700 dark:text-stone-300 px-2 min-w-[70px] text-center">
            {selectedWeek} of 40 wk
          </span>
          <button
            onClick={() => setSelectedWeek(w => Math.min(40, w + 1))}
            disabled={selectedWeek >= 40}
            className="p-1.5 rounded-lg border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            aria-label="Next gestational week"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Graphical Presentation Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pt-5 items-center">
        {/* Left Visual Illustration Stage (SVG Medical Graphical Diagram) */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-5 bg-gradient-to-b from-rose-50/50 via-stone-50/30 to-amber-50/20 dark:from-[#1b1c24] dark:via-[#16171d] dark:to-[#1a171d] rounded-2xl border border-rose-100 dark:border-[#2d2a35] relative overflow-hidden">
          {/* Subtle anatomical amniotic contour effect */}
          <div className="relative w-44 h-44 sm:w-48 sm:h-48 flex items-center justify-center">
            <svg viewBox="0 0 200 200" className="w-full h-full transform transition-transform duration-700 hover:scale-105" aria-hidden="true">
              <defs>
                <radialGradient id="amnioticGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#fda4af" stopOpacity="0.45" />
                  <stop offset="60%" stopColor="#f43f5e" stopOpacity="0.12" />
                  <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.0" />
                </radialGradient>
                <linearGradient id="fetusGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fb7185" />
                  <stop offset="100%" stopColor="#e11d48" />
                </linearGradient>
              </defs>

              {/* Uterine & Gestational Sac Boundary */}
              <circle cx="100" cy="100" r="90" fill="url(#amnioticGlow)" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
              <circle cx="100" cy="100" r="76" fill="none" stroke="#fb7185" strokeWidth="1" opacity="0.3" />

              {/* Fetal Silhouette Shape based on gestation */}
              {selectedWeek < 12 ? (
                /* Early Embryonic Curvature */
                <g transform="translate(100, 100) scale(0.65) translate(-100, -100)">
                  <path
                    d="M 100 45 C 130 45, 145 70, 140 100 C 135 125, 115 145, 95 150 C 75 155, 60 140, 65 120 C 70 100, 75 90, 85 85 C 95 80, 85 60, 100 45 Z"
                    fill="url(#fetusGrad)"
                    opacity="0.9"
                  />
                  <circle cx="120" cy="72" r="3.5" fill="#fff" opacity="0.9" />
                </g>
              ) : selectedWeek < 26 ? (
                /* Mid-trimester Flexed Position */
                <g transform="translate(100, 100) scale(0.85) translate(-100, -100)">
                  {/* Fetal Head */}
                  <circle cx="102" cy="62" r="28" fill="url(#fetusGrad)" />
                  {/* Eye spot */}
                  <circle cx="116" cy="58" r="3" fill="#ffffff" opacity="0.85" />
                  {/* Curled spine & body */}
                  <path
                    d="M 90 75 C 65 90, 60 130, 85 152 C 105 168, 135 155, 138 135 C 140 115, 118 105, 108 100"
                    fill="none"
                    stroke="url(#fetusGrad)"
                    strokeWidth="24"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {/* Tucked leg / foot */}
                  <ellipse cx="122" cy="132" rx="14" ry="9" fill="url(#fetusGrad)" transform="rotate(-20 122 132)" />
                  {/* Gentle arm bringing hand to face */}
                  <path
                    d="M 95 95 Q 112 98 116 80"
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="5"
                    strokeLinecap="round"
                    opacity="0.8"
                  />
                </g>
              ) : (
                /* Third Trimester Full Fetal Presentation (Cephalic Vertex Orientation) */
                <g transform="translate(100, 100) scale(0.95) translate(-100, -100)">
                  {/* Head lower or curled */}
                  <circle cx="100" cy="136" r="32" fill="url(#fetusGrad)" />
                  {/* Eye lid closed */}
                  <path d="M 112 134 Q 118 138 122 135" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
                  {/* Back curled upwards against uterine wall */}
                  <path
                    d="M 85 120 C 60 95, 65 55, 102 46 C 132 40, 148 68, 142 95 C 136 115, 122 120, 115 118"
                    fill="none"
                    stroke="url(#fetusGrad)"
                    strokeWidth="30"
                    strokeLinecap="round"
                  />
                  {/* Folded arms and legs */}
                  <ellipse cx="112" cy="85" rx="16" ry="11" fill="url(#fetusGrad)" transform="rotate(30 112 85)" />
                </g>
              )}

              {/* Heart Rhythm Pulse Ring Indicator */}
              <circle cx="95" cy="98" r="7" fill="#ffe4e6" stroke="#e11d48" strokeWidth="1.5" className="animate-ping" style={{ animationDuration: '1.2s' }} />
              <circle cx="95" cy="98" r="4" fill="#e11d48" />
            </svg>
          </div>

          <div className="mt-2 text-center">
            <span className="text-xs font-semibold text-rose-800 dark:text-rose-300 font-display flex items-center justify-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-rose-500" />
              {milestone.stageName}
            </span>
            <span className="text-[11px] text-stone-500 dark:text-stone-400 block mt-0.5">
              Approx. size of a <strong className="text-stone-800 dark:text-stone-200">{sizeComp.fruit}</strong>
            </span>
          </div>
        </div>

        {/* Right Details & Biometric Data */}
        <div className="lg:col-span-7 space-y-4">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-stone-900 dark:text-stone-100 font-display tracking-tight">
              {sizeComp.fruit} Size &bull; Week {selectedWeek}
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 mt-1 leading-relaxed">
              {milestone.keyHighlight}
            </p>
          </div>

          {/* Biometrics 3-Metric Cards Grid */}
          <div className="grid grid-cols-3 gap-2.5">
            <div className="p-3 bg-stone-50 dark:bg-[#1f2129] rounded-xl border border-stone-200/80 dark:border-[#2f323d] text-center">
              <span className="text-[10px] uppercase font-bold text-stone-500 dark:text-stone-400 tracking-wider block">
                Crown-To-Heel
              </span>
              <span className="text-sm sm:text-base font-bold text-stone-900 dark:text-stone-100 block mt-0.5">
                {sizeComp.length}
              </span>
              <span className="text-[10px] text-stone-400 dark:text-stone-400 block">
                ~{milestone.crownToHeelCm} cm
              </span>
            </div>

            <div className="p-3 bg-stone-50 dark:bg-[#1f2129] rounded-xl border border-stone-200/80 dark:border-[#2f323d] text-center">
              <span className="text-[10px] uppercase font-bold text-stone-500 dark:text-stone-400 tracking-wider block">
                Est. Weight
              </span>
              <span className="text-sm sm:text-base font-bold text-stone-900 dark:text-stone-100 block mt-0.5">
                {sizeComp.weight}
              </span>
              <span className="text-[10px] text-stone-400 dark:text-stone-400 block">
                ~{milestone.weightGrams >= 1000 ? `${(milestone.weightGrams / 1000).toFixed(1)} kg` : `${milestone.weightGrams} g`}
              </span>
            </div>

            <div className="p-3 bg-rose-50/70 dark:bg-rose-950/30 rounded-xl border border-rose-100 dark:border-rose-900/40 text-center">
              <span className="text-[10px] uppercase font-bold text-rose-700 dark:text-rose-300 tracking-wider block flex items-center justify-center gap-1">
                <Heart className="w-2.5 h-2.5 fill-rose-500 text-rose-500" />
                Heart Rate
              </span>
              <span className="text-xs sm:text-sm font-bold text-rose-900 dark:text-rose-200 block mt-1">
                {milestone.heartRateBpm}
              </span>
              <span className="text-[10px] text-rose-600/80 dark:text-rose-400/80 block">
                Fetal range
              </span>
            </div>
          </div>

          {/* Development Insights */}
          <div className="space-y-2 text-xs">
            <div className="p-3 rounded-xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/70 dark:border-amber-900/30">
              <span className="font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5 mb-0.5">
                <Compass className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                Sensory & Neurological Development
              </span>
              <p className="text-stone-700 dark:text-stone-300 leading-relaxed">
                {milestone.sensoryMilestone}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-stone-50 dark:bg-[#1a1c22] border border-stone-200/70 dark:border-[#2b2e38]">
              <span className="font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1.5 mb-0.5">
                <Calendar className="w-3.5 h-3.5 text-rose-500" />
                Maternal Changes & Clinical Context
              </span>
              <p className="text-stone-600 dark:text-stone-300 leading-relaxed">
                {milestone.maternalBodyInsight}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Gestational 40-Week Timeline Progress */}
      <div className="mt-6 pt-5 border-t border-stone-100 dark:border-stone-800 space-y-2">
        <div className="flex justify-between items-center text-xs font-semibold text-stone-600 dark:text-stone-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" />
            Week 1–13 (First)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
            Week 14–27 (Second)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
            Week 28–40 (Third)
          </span>
        </div>

        {/* Interactive gestational track */}
        <div className="relative w-full h-3.5 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden p-0.5 border border-stone-200/80 dark:border-stone-700">
          <div 
            className="h-full bg-gradient-to-r from-rose-500 via-rose-400 to-amber-500 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="flex justify-between items-center text-[11px] text-stone-500 dark:text-stone-400 pt-1">
          <span>{progressPercent}% of full 40-week term completed</span>
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
            Approx. {weeksRemaining} {weeksRemaining === 1 ? 'week' : 'weeks'} remaining
          </span>
        </div>
      </div>
    </div>
  );
};
