import React, { useState, useMemo } from 'react';
import { SymptomEntry, MealEntry, HydrationEntry } from '../types';
import { getSeverityDetails } from '../utils/pregnancyCalculations';
import { 
  TrendingUp, 
  Calendar, 
  Activity, 
  Apple, 
  Droplet, 
  Info, 
  BarChart3, 
  PieChart 
} from 'lucide-react';

interface TrendsViewProps {
  symptoms: SymptomEntry[];
  meals: MealEntry[];
  hydration: HydrationEntry[];
}

export const TrendsView: React.FC<TrendsViewProps> = ({ symptoms, meals, hydration }) => {
  const [timeRange, setTimeRange] = useState<'7days' | '30days' | 'all'>('7days');
  const [activeChartSymptom, setActiveChartSymptom] = useState<string>('all');

  // Filter datasets by selected range
  const now = new Date();
  const filteredSymptoms = useMemo(() => {
    return symptoms.filter((entry) => {
      if (timeRange === 'all') return true;
      const entryDate = new Date(entry.date);
      const daysDiff = Math.floor((now.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));
      return timeRange === '7days' ? daysDiff <= 7 : daysDiff <= 30;
    });
  }, [symptoms, timeRange]);

  const filteredMeals = useMemo(() => {
    return meals.filter((entry) => {
      if (timeRange === 'all') return true;
      const entryDate = new Date(entry.date);
      const daysDiff = Math.floor((now.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));
      return timeRange === '7days' ? daysDiff <= 7 : daysDiff <= 30;
    });
  }, [meals, timeRange]);

  const filteredHydration = useMemo(() => {
    return hydration.filter((entry) => {
      if (timeRange === 'all') return true;
      const entryDate = new Date(entry.date);
      const daysDiff = Math.floor((now.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));
      return timeRange === '7days' ? daysDiff <= 7 : daysDiff <= 30;
    });
  }, [hydration, timeRange]);

  // Symptom frequency aggregation
  const frequencyMap: Record<string, number> = {};
  filteredSymptoms.forEach((s) => {
    frequencyMap[s.symptomName] = (frequencyMap[s.symptomName] || 0) + 1;
  });

  const sortedFrequencies = Object.entries(frequencyMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  const maxFrequency = Math.max(...Object.values(frequencyMap), 1);

  // Severity line data points (sorted chronologically)
  const severityPoints = useMemo(() => {
    const list = activeChartSymptom === 'all'
      ? filteredSymptoms
      : filteredSymptoms.filter((s) => s.symptomName === activeChartSymptom);

    return [...list]
      .sort((a, b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime())
      .slice(-12); // display latest 12 points
  }, [filteredSymptoms, activeChartSymptom]);

  // Weekly descriptive summary
  const distinctDaysWithSymptoms = new Set(filteredSymptoms.map((s) => s.date)).size;
  const topSymptom = sortedFrequencies.length > 0 ? sortedFrequencies[0] : null;

  // Food Group variety counts in period
  const foodGroupCounts: Record<string, number> = {};
  filteredMeals.forEach((meal) => {
    meal.foodGroups?.forEach((fg) => {
      foodGroupCounts[fg] = (foodGroupCounts[fg] || 0) + 1;
    });
  });

  // Daily hydration aggregation for trend
  const dailyHydrationMap: Record<string, number> = {};
  filteredHydration.forEach((h) => {
    dailyHydrationMap[h.date] = (dailyHydrationMap[h.date] || 0) + h.amount;
  });

  const hydrationDays = Object.entries(dailyHydrationMap).sort(
    (a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime()
  );
  const avgHydration = hydrationDays.length > 0
    ? (hydrationDays.reduce((acc, curr) => acc + curr[1], 0) / hydrationDays.length).toFixed(1)
    : '0';

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Header & Range Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400">
            Historical Insights
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-stone-900 dark:text-white tracking-tight">
            Trends & History
          </h1>
          <p className="text-sm text-stone-600 dark:text-stone-400 mt-0.5">
            View visual patterns in your logged symptoms, meals, and hydration habits.
          </p>
        </div>

        {/* Time range buttons */}
        <div className="flex items-center p-1 bg-stone-100 dark:bg-[#1c1f26] rounded-xl self-start sm:self-auto border border-stone-200 dark:border-[#272a33]">
          <button
            id="trend-range-7days"
            onClick={() => setTimeRange('7days')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              timeRange === '7days'
                ? 'bg-white dark:bg-[#272a33] text-stone-900 dark:text-white shadow-2xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            Last 7 Days
          </button>
          <button
            id="trend-range-30days"
            onClick={() => setTimeRange('30days')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              timeRange === '30days'
                ? 'bg-white dark:bg-[#272a33] text-stone-900 dark:text-white shadow-2xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            Last 30 Days
          </button>
          <button
            id="trend-range-all"
            onClick={() => setTimeRange('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              timeRange === 'all'
                ? 'bg-white dark:bg-[#272a33] text-stone-900 dark:text-white shadow-2xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            All Time
          </button>
        </div>
      </div>

      {/* Descriptive Weekly Summary Card (Section 8) */}
      <section 
        className="bg-white dark:bg-[#16181d] rounded-2xl border border-stone-200 dark:border-[#272a33] p-5 shadow-xs transition-colors"
        aria-labelledby="summary-stats-heading"
      >
        <h2 id="summary-stats-heading" className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-3">
          Descriptive Summary ({timeRange === '7days' ? 'Last 7 Days' : timeRange === '30days' ? 'Last 30 Days' : 'Overall Record'})
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3.5 bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/40 rounded-xl">
            <span className="text-xs font-medium text-amber-800 dark:text-amber-300">Symptom Activity</span>
            <div className="text-xl font-bold font-display text-stone-900 dark:text-white mt-1">
              {filteredSymptoms.length} occurrences
            </div>
            <p className="text-xs text-stone-600 dark:text-stone-400 mt-1">
              Recorded across {distinctDaysWithSymptoms} separate {distinctDaysWithSymptoms === 1 ? 'day' : 'days'}.
            </p>
          </div>

          <div className="p-3.5 bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-900/40 rounded-xl">
            <span className="text-xs font-medium text-emerald-800 dark:text-emerald-300">Meal Logging</span>
            <div className="text-xl font-bold font-display text-stone-900 dark:text-white mt-1">
              {filteredMeals.length} meals recorded
            </div>
            <p className="text-xs text-stone-600 dark:text-stone-400 mt-1">
              {Object.keys(foodGroupCounts).length} distinct food groups recorded in this timeframe.
            </p>
          </div>

          <div className="p-3.5 bg-sky-50/70 dark:bg-sky-950/20 border border-sky-200/80 dark:border-sky-900/40 rounded-xl">
            <span className="text-xs font-medium text-sky-800 dark:text-sky-300">Average Hydration</span>
            <div className="text-xl font-bold font-display text-stone-900 dark:text-white mt-1">
              {avgHydration} cups / day
            </div>
            <p className="text-xs text-stone-600 dark:text-stone-400 mt-1">
              Based on {hydrationDays.length} days with logged intake.
            </p>
          </div>
        </div>

        {topSymptom && (
          <div className="mt-3 p-3 bg-stone-50 dark:bg-[#1c1f26] rounded-xl border border-stone-200 dark:border-[#272a33] text-xs text-stone-700 dark:text-stone-300 flex items-center justify-between">
            <span>
              <strong className="font-semibold text-stone-900 dark:text-white">{topSymptom[0]}:</strong> recorded {topSymptom[1]} {topSymptom[1] === 1 ? 'time' : 'times'} in this timeframe.
            </span>
            <span className="text-stone-400 dark:text-stone-500 italic">Descriptive observation</span>
          </div>
        )}
      </section>

      {/* Symptom Frequency Visual Bar Chart */}
      <section 
        className="bg-white dark:bg-[#16181d] rounded-2xl border border-stone-200 dark:border-[#272a33] p-5 sm:p-6 shadow-xs transition-colors"
        aria-labelledby="frequency-chart-heading"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 id="frequency-chart-heading" className="text-base font-bold font-display text-stone-900 dark:text-white">
              Symptom Frequency
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Total number of recorded occurrences per symptom during this period.
            </p>
          </div>
          <BarChart3 className="w-5 h-5 text-stone-400 dark:text-stone-500" />
        </div>

        {sortedFrequencies.length === 0 ? (
          <p className="text-xs text-stone-400 dark:text-stone-500 italic text-center py-6">
            No symptoms logged in this period.
          </p>
        ) : (
          <div className="space-y-3">
            {sortedFrequencies.map(([name, count]) => {
              const widthPct = Math.round((count / maxFrequency) * 100);
              return (
                <div key={name} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-stone-800 dark:text-stone-200">
                    <span>{name}</span>
                    <span className="text-stone-600 dark:text-stone-400 font-medium">
                      {count} {count === 1 ? 'occurrence' : 'occurrences'}
                    </span>
                  </div>
                  <div className="w-full h-3 bg-stone-100 dark:bg-[#222630] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-rose-500 dark:bg-rose-600 rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(8, widthPct)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Severity Trend Over Time (Accessible Line SVG) */}
      <section 
        className="bg-white dark:bg-[#16181d] rounded-2xl border border-stone-200 dark:border-[#272a33] p-5 sm:p-6 shadow-xs transition-colors"
        aria-labelledby="severity-trend-heading"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h2 id="severity-trend-heading" className="text-base font-bold font-display text-stone-900 dark:text-white">
              Severity Trend Over Time
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Severity scale: 1 (Very mild) to 5 (Very severe).
            </p>
          </div>

          {/* Filter by symptom dropdown */}
          <select
            aria-label="Filter severity chart by symptom"
            value={activeChartSymptom}
            onChange={(e) => setActiveChartSymptom(e.target.value)}
            className="text-xs px-2.5 py-1.5 rounded-lg border border-stone-200 dark:border-[#2e323d] bg-stone-50 dark:bg-[#1c1f26] text-stone-800 dark:text-stone-200 focus:outline-none cursor-pointer"
          >
            <option value="all">All Logged Symptoms</option>
            {Object.keys(frequencyMap).map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>

        {severityPoints.length < 2 ? (
          <p className="text-xs text-stone-400 dark:text-stone-500 italic text-center py-8">
            Log at least two symptom entries to view the severity trend line.
          </p>
        ) : (
          <div className="space-y-3">
            {/* SVG Line Chart */}
            <div className="w-full overflow-x-auto">
              <div className="min-w-[420px] h-48 relative pt-4 pb-6">
                <svg className="w-full h-full" viewBox="0 0 400 140" preserveAspectRatio="none">
                  {/* Grid lines for severity 1 to 5 */}
                  {[1, 2, 3, 4, 5].map((lvl) => {
                    const y = 130 - ((lvl - 1) / 4) * 110;
                    return (
                      <g key={lvl}>
                        <line
                          x1="30"
                          y1={y}
                          x2="390"
                          y2={y}
                          className="stroke-stone-200 dark:stroke-[#2e323d]"
                          strokeDasharray="3 3"
                          strokeWidth="1"
                        />
                        <text x="5" y={y + 3} fontSize="9" className="fill-stone-500 dark:fill-stone-400" fontWeight="500">
                          {lvl}
                        </text>
                      </g>
                    );
                  })}

                  {/* Connecting Line */}
                  <polyline
                    fill="none"
                    stroke="#f43f5e"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={severityPoints
                      .map((p, idx) => {
                        const stepX = (360 / (severityPoints.length - 1 || 1));
                        const x = 30 + idx * stepX;
                        const y = 130 - ((p.severity - 1) / 4) * 110;
                        return `${x},${y}`;
                      })
                      .join(' ')}
                  />

                  {/* Circles and Date Points */}
                  {severityPoints.map((p, idx) => {
                    const stepX = (360 / (severityPoints.length - 1 || 1));
                    const x = 30 + idx * stepX;
                    const y = 130 - ((p.severity - 1) / 4) * 110;
                    return (
                      <g key={p.id}>
                        <circle
                          cx={x}
                          cy={y}
                          r="4.5"
                          className="fill-white dark:fill-[#16181d] stroke-rose-500"
                          strokeWidth="2"
                        />
                        {/* Short date label underneath */}
                        <text
                          x={x}
                          y="138"
                          textAnchor="middle"
                          fontSize="8"
                          className="fill-stone-500 dark:fill-stone-400"
                        >
                          {p.date.slice(5)}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>

            {/* Accessible Screen-reader and Detail Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-stone-200 dark:border-[#272a33] rounded-xl overflow-hidden">
                <thead className="bg-stone-50 dark:bg-[#1c1f26] border-b border-stone-200 dark:border-[#272a33] text-stone-600 dark:text-stone-300">
                  <tr>
                    <th className="p-2 font-semibold">Date & Time</th>
                    <th className="p-2 font-semibold">Symptom</th>
                    <th className="p-2 font-semibold">Severity</th>
                    <th className="p-2 font-semibold">Duration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 dark:divide-[#272a33]">
                  {severityPoints.map((p) => (
                    <tr key={p.id} className="hover:bg-stone-50/50 dark:hover:bg-[#1c1f26]/50">
                      <td className="p-2 text-stone-500 dark:text-stone-400 whitespace-nowrap">{p.date} {p.time}</td>
                      <td className="p-2 font-medium text-stone-900 dark:text-stone-100">{p.symptomName}</td>
                      <td className="p-2">
                        <span className="font-semibold text-stone-800 dark:text-stone-200">
                          {p.severity} ({getSeverityDetails(p.severity).badgeText})
                        </span>
                      </td>
                      <td className="p-2 text-stone-500 dark:text-stone-400">{p.duration || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="mt-3 p-3 bg-stone-50 dark:bg-[#1c1f26] rounded-xl border border-stone-200 dark:border-[#272a33] text-xs text-stone-600 dark:text-stone-400 flex items-start gap-2">
          <Info className="w-4 h-4 text-stone-400 dark:text-stone-500 shrink-0 mt-0.5" />
          <span>
            <strong>Non-Diagnostic Notice: </strong>
            These visualizations reflect your subjective personal logs. They do not constitute diagnostic testing, clinical progress assessments, or health predictions.
          </span>
        </div>
      </section>
    </div>
  );
};
