import React from 'react';
import { Language } from '../types';

interface ChartProps {
  language: Language;
  onInspect: (title: string, data: any[]) => void;
}

export const GovernmentCharts: React.FC<ChartProps> = ({ language, onInspect }) => {
  const [opdRange, setOpdRange] = React.useState<'7d' | '30d'>('7d');

  // Chart 1: Daily District OPD (Line chart)
  const opd7d = [
    { label: 'Mon', date: '28 Aug', count: 420 },
    { label: 'Tue', date: '29 Aug', count: 480 },
    { label: 'Wed', date: '30 Aug', count: 510 },
    { label: 'Thu', date: '31 Aug', count: 465 },
    { label: 'Fri', date: '01 Sep', count: 530 },
    { label: 'Sat', date: '02 Sep', count: 390 },
    { label: 'Sun', date: '03 Sep', count: 260 },
  ];

  const opd30d = [
    { label: 'W1', date: 'Week 1', count: 3100 },
    { label: 'W2', date: 'Week 2', count: 3340 },
    { label: 'W3', date: 'Week 3', count: 3480 },
    { label: 'W4', date: 'Week 4', count: 3260 },
  ];

  const activeOpdData = opdRange === '7d' ? opd7d : opd30d;
  const maxOpd = Math.max(...activeOpdData.map(d => d.count));

  // Chart 2: OPD vs Previous Week (Comparison bar)
  const comparisonData = [
    { day: 'Mon', thisWeek: 420, lastWeek: 390 },
    { day: 'Tue', thisWeek: 480, lastWeek: 450 },
    { day: 'Wed', thisWeek: 510, lastWeek: 470 },
    { day: 'Thu', thisWeek: 465, lastWeek: 490 },
    { day: 'Fri', thisWeek: 530, lastWeek: 500 },
    { day: 'Sat', thisWeek: 390, lastWeek: 380 },
    { day: 'Sun', thisWeek: 260, lastWeek: 240 },
  ];

  // Chart 3: Average OPD Wait Time (mins)
  const waitData = [
    { day: 'Mon', mins: 28 },
    { day: 'Tue', mins: 24 },
    { day: 'Wed', mins: 26 },
    { day: 'Thu', mins: 21 },
    { day: 'Fri', mins: 29 },
    { day: 'Sat', mins: 19 },
    { day: 'Sun', mins: 14 },
  ];

  // Chart 4: Referral Completion
  const referralData = [
    { status: 'Completed', count: 382, pct: 68, color: '#2E8B57' },
    { status: 'In Progress', count: 112, pct: 20, color: '#1976D2' },
    { status: 'Pending Follow-up', count: 68, pct: 12, color: '#F9A01B' },
  ];

  // Chart 5: Facility Utilization (Horizontal Bar)
  const facilityUtilizationData = [
    { name: 'Wai Sub-District Hospital', visits: 1420, capPct: 92 },
    { name: 'Khandala CHC', visits: 980, capPct: 78 },
    { name: 'Shirwal PHC', visits: 640, capPct: 64 },
    { name: 'Bhuinj Primary Unit', visits: 310, capPct: 45 },
  ];

  // Chart 6: Service Utilization
  const serviceData = [
    { service: 'General OPD', visits: 1840 },
    { service: 'Maternal Care / ANC', visits: 620 },
    { service: 'Cardiology / Hriday', visits: 490 },
    { service: 'Child Health', visits: 410 },
    { service: 'Eye Checkup', visits: 330 },
    { service: 'Lab Diagnostics', visits: 890 },
  ];
  const maxService = Math.max(...serviceData.map(d => d.visits));

  // Chart 7: Verified Providers
  const providerData = [
    { status: 'Verified', count: 48, pct: 80, color: '#2E8B57' },
    { status: 'Pending Review', count: 9, pct: 15, color: '#F9A01B' },
    { status: 'Rejected / Disqualified', count: 3, pct: 5, color: '#D92D20' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {/* CHART 1: DAILY DISTRICT OPD */}
      <div className="bg-white rounded-xl border border-[#173B3A]/10 p-5 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-[#173B3A] text-base">
              {language === 'mr' ? 'दैनिक जिल्हा ओपीडी संख्या' : language === 'hi' ? 'दैनिक जिला ओपीडी संख्या' : 'Daily District OPD Volume'}
            </h3>
            <div className="flex bg-[#F5F2EA] rounded-lg p-0.5 text-xs font-semibold">
              <button
                onClick={() => setOpdRange('7d')}
                className={`px-2.5 py-1 rounded-md transition ${opdRange === '7d' ? 'bg-[#164E47] text-white' : 'text-[#607574]'}`}
              >
                7D
              </button>
              <button
                onClick={() => setOpdRange('30d')}
                className={`px-2.5 py-1 rounded-md transition ${opdRange === '30d' ? 'bg-[#164E47] text-white' : 'text-[#607574]'}`}
              >
                30D
              </button>
            </div>
          </div>
          <p className="text-xs text-[#607574] mb-4">
            Unit: Patients visited | Updated today at 11:42 AM
          </p>
          
          {/* SVG Line Chart */}
          <div className="h-44 w-full flex items-end justify-between pt-4 pb-2 px-2">
            {activeOpdData.map((d, i) => {
              const hPct = Math.round((d.count / maxOpd) * 85);
              return (
                <div key={i} className="flex flex-col items-center flex-1 group">
                  <span className="text-[10px] font-bold text-[#164E47] opacity-0 group-hover:opacity-100 transition">
                    {d.count}
                  </span>
                  <div className="w-full max-w-[24px] bg-[#164E47]/10 rounded-t-sm relative h-32 flex items-end justify-center">
                    <div
                      style={{ height: `${hPct}%` }}
                      className="w-full bg-[#164E47] rounded-t-md transition-all duration-500 group-hover:bg-[#2E8B57]"
                    />
                  </div>
                  <span className="text-[11px] font-medium text-[#607574] mt-2">
                    {d.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
        <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
          <span className="text-xs text-[#607574]">Total: {activeOpdData.reduce((a, b) => a + b.count, 0)} OPD visits</span>
          <button
            onClick={() => onInspect('Daily District OPD', activeOpdData)}
            className="text-xs font-bold text-[#164E47] hover:underline"
          >
            Inspect Data →
          </button>
        </div>
      </div>

      {/* CHART 2: OPD VS PREVIOUS WEEK */}
      <div className="bg-white rounded-xl border border-[#173B3A]/10 p-5 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-[#173B3A] text-base">
              {language === 'mr' ? 'मागील आठवड्याशी तुलना' : language === 'hi' ? 'पिछले सप्ताह से तुलना' : 'OPD vs. Previous Week'}
            </h3>
            <div className="flex items-center gap-3 text-[11px]">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#164E47]" /> This Week
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#F9A01B]" /> Last Week
              </span>
            </div>
          </div>
          <p className="text-xs text-[#607574] mb-4">
            Comparison bar chart | +4.8% district-wide growth
          </p>

          <div className="h-44 w-full flex items-end justify-between pt-4 pb-2 px-1">
            {comparisonData.map((d, i) => {
              const hThis = Math.round((d.thisWeek / 550) * 85);
              const hLast = Math.round((d.lastWeek / 550) * 85);
              return (
                <div key={i} className="flex flex-col items-center flex-1">
                  <div className="flex items-end gap-1 h-32">
                    <div
                      style={{ height: `${hThis}%` }}
                      className="w-3 bg-[#164E47] rounded-t-sm"
                      title={`This week: ${d.thisWeek}`}
                    />
                    <div
                      style={{ height: `${hLast}%` }}
                      className="w-3 bg-[#F9A01B] rounded-t-sm"
                      title={`Last week: ${d.lastWeek}`}
                    />
                  </div>
                  <span className="text-[11px] font-medium text-[#607574] mt-2">
                    {d.day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
        <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
          <span className="text-xs text-[#2E8B57] font-semibold">Trend: Consistent Upward Flow</span>
          <button
            onClick={() => onInspect('OPD vs Previous Week', comparisonData)}
            className="text-xs font-bold text-[#164E47] hover:underline"
          >
            Inspect Data →
          </button>
        </div>
      </div>

      {/* CHART 3: AVERAGE OPD WAIT TIME */}
      <div className="bg-white rounded-xl border border-[#173B3A]/10 p-5 shadow-sm flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-[#173B3A] text-base mb-1">
            {language === 'mr' ? 'सरासरी ओपीडी प्रतीक्षा वेळ' : language === 'hi' ? 'औसत ओपीडी प्रतीक्षा समय' : 'Average OPD Wait Time'}
          </h3>
          <p className="text-xs text-[#607574] mb-4">
            Unit: Minutes | Target: Under 25 mins
          </p>

          <div className="h-44 w-full flex items-end justify-between pt-4 pb-2 px-2">
            {waitData.map((d, i) => {
              const hPct = Math.round((d.mins / 35) * 85);
              const isOver = d.mins > 25;
              return (
                <div key={i} className="flex flex-col items-center flex-1 group">
                  <span className="text-[10px] font-bold text-[#173B3A] mb-1">
                    {d.mins}m
                  </span>
                  <div className="w-full max-w-[20px] bg-gray-100 rounded-t-sm h-28 flex items-end justify-center">
                    <div
                      style={{ height: `${hPct}%` }}
                      className={`w-full rounded-t-sm ${isOver ? 'bg-[#F9A01B]' : 'bg-[#2E8B57]'}`}
                    />
                  </div>
                  <span className="text-[11px] font-medium text-[#607574] mt-2">
                    {d.day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
        <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
          <span className="text-xs text-[#607574]">Weekly Avg: 23.2 minutes</span>
          <button
            onClick={() => onInspect('Average OPD Wait Time', waitData)}
            className="text-xs font-bold text-[#164E47] hover:underline"
          >
            Inspect Data →
          </button>
        </div>
      </div>

      {/* CHART 4: REFERRAL COMPLETION */}
      <div className="bg-white rounded-xl border border-[#173B3A]/10 p-5 shadow-sm flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-[#173B3A] text-base mb-1">
            {language === 'mr' ? 'रेफरल पूर्णता दर' : language === 'hi' ? 'रेफ़रल पूर्णता दर' : 'Referral Completion Rate'}
          </h3>
          <p className="text-xs text-[#607574] mb-4">
            PHC to CHC / Sub-district hospital continuity
          </p>

          {/* Segmented Bar */}
          <div className="py-4">
            <div className="w-full h-8 bg-gray-100 rounded-lg overflow-hidden flex shadow-inner">
              {referralData.map((d, i) => (
                <div
                  key={i}
                  style={{ width: `${d.pct}%`, backgroundColor: d.color }}
                  className="h-full flex items-center justify-center text-white text-xs font-bold"
                  title={`${d.status}: ${d.count} (${d.pct}%)`}
                >
                  {d.pct}%
                </div>
              ))}
            </div>

            <div className="mt-5 space-y-2">
              {referralData.map((d, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: d.color }} />
                    <span className="font-medium text-[#173B3A]">{d.status}</span>
                  </div>
                  <span className="font-bold text-[#607574]">{d.count} cases ({d.pct}%)</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
          <span className="text-xs text-[#2E8B57] font-semibold">Total: 562 Referrals</span>
          <button
            onClick={() => onInspect('Referral Completion', referralData)}
            className="text-xs font-bold text-[#164E47] hover:underline"
          >
            Inspect Data →
          </button>
        </div>
      </div>

      {/* CHART 5: FACILITY UTILIZATION */}
      <div className="bg-white rounded-xl border border-[#173B3A]/10 p-5 shadow-sm flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-[#173B3A] text-base mb-1">
            {language === 'mr' ? 'आरोग्य केंद्र वापर दर' : language === 'hi' ? 'स्वास्थ्य केंद्र उपयोग दर' : 'Facility Capacity Utilization'}
          </h3>
          <p className="text-xs text-[#607574] mb-4">
            Sorted highest utilization first
          </p>

          <div className="space-y-3.5 py-1">
            {facilityUtilizationData.map((f, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-[#173B3A] truncate max-w-[200px]">{f.name}</span>
                  <span className="font-bold text-[#164E47]">{f.capPct}% ({f.visits})</span>
                </div>
                <div className="w-full bg-[#F5F2EA] h-2.5 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${f.capPct}%` }}
                    className={`h-full rounded-full ${f.capPct > 90 ? 'bg-[#F9A01B]' : 'bg-[#164E47]'}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
          <span className="text-xs text-[#607574]">Capacity balanced across district</span>
          <button
            onClick={() => onInspect('Facility Utilization', facilityUtilizationData)}
            className="text-xs font-bold text-[#164E47] hover:underline"
          >
            Inspect Data →
          </button>
        </div>
      </div>

      {/* CHART 6: SERVICE UTILIZATION */}
      <div className="bg-white rounded-xl border border-[#173B3A]/10 p-5 shadow-sm flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-[#173B3A] text-base mb-1">
            {language === 'mr' ? 'वैद्यकीय सेवा वापर' : language === 'hi' ? 'चिकित्सीय सेवा उपयोग' : 'Service Utilization Breakdown'}
          </h3>
          <p className="text-xs text-[#607574] mb-4">
            Total visits by clinical department
          </p>

          <div className="space-y-2.5 py-1">
            {serviceData.map((s, i) => {
              const pct = Math.round((s.visits / maxService) * 100);
              return (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-[#173B3A]">{s.service}</span>
                    <span className="font-bold text-[#607574]">{s.visits}</span>
                  </div>
                  <div className="w-full bg-[#F5F2EA] h-2 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${pct}%` }}
                      className="h-full bg-[#1976D2] rounded-full"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
          <span className="text-xs text-[#607574]">High demand in Lab & Cardiology</span>
          <button
            onClick={() => onInspect('Service Utilization', serviceData)}
            className="text-xs font-bold text-[#164E47] hover:underline"
          >
            Inspect Data →
          </button>
        </div>
      </div>

      {/* CHART 7: VERIFIED PROVIDERS */}
      <div className="bg-white rounded-xl border border-[#173B3A]/10 p-5 shadow-sm flex flex-col justify-between md:col-span-2 xl:col-span-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="font-bold text-[#173B3A] text-base mb-1">
              {language === 'mr' ? 'डॉक्टर व केंद्र पडताळणी स्थिती' : language === 'hi' ? 'चिकित्सक व केंद्र सत्यापन स्थिति' : 'Doctor & Facility Verification Status'}
            </h3>
            <p className="text-xs text-[#607574]">
              Government credential verification status across Satara District
            </p>
          </div>
          <div className="flex items-center gap-6">
            {providerData.map((p, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: p.color }} />
                <div>
                  <div className="text-xs font-bold text-[#173B3A]">{p.count}</div>
                  <div className="text-[11px] text-[#607574]">{p.status}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Progress Bar Representation */}
        <div className="w-full h-5 bg-gray-100 rounded-lg overflow-hidden flex shadow-inner mb-4">
          {providerData.map((p, i) => (
            <div
              key={i}
              style={{ width: `${p.pct}%`, backgroundColor: p.color }}
              className="h-full"
              title={`${p.status}: ${p.count} (${p.pct}%)`}
            />
          ))}
        </div>

        <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
          <span className="text-xs text-[#607574]">Total registered healthcare providers: 60</span>
          <button
            onClick={() => onInspect('Verified Providers Status', providerData)}
            className="text-xs font-bold text-[#164E47] hover:underline"
          >
            Inspect Data →
          </button>
        </div>
      </div>
    </div>
  );
};
