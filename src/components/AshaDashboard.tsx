import React, { useState } from 'react';
import {
  Users,
  Home,
  CheckCircle2,
  Clock,
  Phone,
  UserCheck,
  Plus,
  AlertCircle,
  FileSpreadsheet,
  Activity,
  Heart,
  Baby,
} from 'lucide-react';
import { Language, UserAccount } from '../types';
import { translations } from '../i18n/translations';
import { storageService } from '../services/storageService';

interface AshaDashboardProps {
  currentUser: UserAccount | null;
  language: Language;
  isOnline: boolean;
}

interface AshaCitizen {
  id: string;
  name: string;
  patientId: string;
  phone: string;
  category: 'ANC / Maternal' | 'Child Immunization' | 'Chronic Hypertension' | 'Elderly Care';
  address: string;
  status: 'VISIT_DUE' | 'COMPLETED' | 'FOLLOW_UP';
  notes: string;
  lastVisit?: string;
}

export const AshaDashboard: React.FC<AshaDashboardProps> = ({ currentUser, language, isOnline }) => {
  const t = translations[language];

  const [citizens, setCitizens] = useState<AshaCitizen[]>([
    {
      id: 'c-1',
      name: 'Pooja Sanjay Shinde',
      patientId: 'SS-9B2M-44L1',
      phone: '+91 98221 44556',
      category: 'ANC / Maternal',
      address: 'House 14, Ward 2, Shirwal Village',
      status: 'VISIT_DUE',
      notes: '7 months pregnant. Iron-folic acid tablets replenishment due.',
      lastVisit: '18 Aug 2026',
    },
    {
      id: 'c-2',
      name: 'Rameshwar Dattatray Patil',
      patientId: 'SS-7K4P-92Q1',
      phone: '+91 98220 12345',
      category: 'Chronic Hypertension',
      address: 'House 42, Main Road, Wai',
      status: 'VISIT_DUE',
      notes: 'Post-MI follow-up. Check Hriday scan reading and BP medication compliance.',
      lastVisit: '24 Aug 2026',
    },
    {
      id: 'c-3',
      name: 'Aarav Sachin Mane (Age 1.5 yrs)',
      patientId: 'SS-4P9W-11K3',
      phone: '+91 98229 88776',
      category: 'Child Immunization',
      address: 'House 08, Ward 4, Wai',
      status: 'FOLLOW_UP',
      notes: 'MR Vaccine (Measles-Rubella) second dose due next week.',
      lastVisit: '10 Aug 2026',
    },
    {
      id: 'c-4',
      name: 'Parvatibai Gokhale (Age 74)',
      patientId: 'SS-3M8N-77X2',
      phone: '+91 98224 33221',
      category: 'Elderly Care',
      address: 'House 61, Near Temple, Bhuinj',
      status: 'COMPLETED',
      notes: 'Joint pain & mobility check completed. Pain relief balm supplied.',
      lastVisit: '01 Sep 2026',
    },
  ]);

  const [filter, setFilter] = useState<'ALL' | 'VISIT_DUE' | 'COMPLETED' | 'FOLLOW_UP'>('ALL');
  const [activeCitizenForNote, setActiveCitizenForNote] = useState<AshaCitizen | null>(null);
  const [fieldNoteText, setFieldNoteText] = useState('');

  const filteredCitizens = citizens.filter(c => filter === 'ALL' || c.status === filter);

  const handleMarkCompleted = (citizenId: string) => {
    setCitizens(prev =>
      prev.map(c =>
        c.id === citizenId
          ? { ...c, status: 'COMPLETED', lastVisit: new Date().toLocaleDateString() }
          : c
      )
    );
  };

  const handleSaveFieldNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCitizenForNote || !fieldNoteText.trim()) return;

    setCitizens(prev =>
      prev.map(c =>
        c.id === activeCitizenForNote.id
          ? {
              ...c,
              notes: `${fieldNoteText} (Logged by ASHA on ${new Date().toLocaleDateString()})`,
              status: 'COMPLETED',
              lastVisit: new Date().toLocaleDateString(),
            }
          : c
      )
    );

    setActiveCitizenForNote(null);
    setFieldNoteText('');
  };

  const totalCitizens = citizens.length;
  const visitsCompleted = citizens.filter(c => c.status === 'COMPLETED').length;
  const visitsDue = citizens.filter(c => c.status === 'VISIT_DUE').length;

  return (
    <div className="space-y-6">
      {/* Header Profile */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#173B3A]/10 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#164E47]">
              {currentUser?.name || 'Sunita Kadam (ASHA Sevika)'}
            </h1>
            <span className="text-xs bg-[#2E8B57]/15 text-[#2E8B57] font-bold px-2 py-0.5 rounded-full">
              Field Ready • Offline First
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#607574] mt-1 font-medium">
            Assigned Ward: Shirwal & Wai Sub-District • Sector 4
          </p>
        </div>

        {/* Sync Status Banner */}
        <div className="flex items-center gap-3">
          <div className="text-right text-xs">
            <div className="font-bold text-[#173B3A]">
              {isOnline ? 'Online Sync Active' : 'Offline Mode (Drafts Saved)'}
            </div>
            <div className="text-[#607574] text-[11px]">
              {isOnline ? 'Data synchronized with PHC portal' : 'Will sync upon network reconnect'}
            </div>
          </div>
        </div>
      </div>

      {/* Field Metric Cards (Section 55) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-[#173B3A]/10 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-[#607574] uppercase">Assigned Citizens</span>
            <div className="text-2xl font-black text-[#173B3A] mt-1">{totalCitizens}</div>
            <span className="text-[11px] text-[#2E8B57] font-semibold">100% Ward Coverage</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#164E47]/10 text-[#164E47] flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#173B3A]/10 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-[#607574] uppercase">Visits Completed</span>
            <div className="text-2xl font-black text-[#2E8B57] mt-1">{visitsCompleted}</div>
            <span className="text-[11px] text-[#607574]">This month</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#2E8B57]/10 text-[#2E8B57] flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#173B3A]/10 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-[#607574] uppercase">Pending Visits</span>
            <div className="text-2xl font-black text-[#F9A01B] mt-1">{visitsDue}</div>
            <span className="text-[11px] text-[#D92D20] font-semibold">Scheduled this week</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#F9A01B]/15 text-[#F9A01B] flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Field Note Modal */}
      {activeCitizenForNote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-2xl p-5 border border-[#164E47]/20 shadow-2xl space-y-4">
            <div>
              <h3 className="font-bold text-base text-[#164E47]">Log Field Visit & Observations</h3>
              <p className="text-xs text-[#607574]">{activeCitizenForNote.name} ({activeCitizenForNote.patientId})</p>
            </div>

            <form onSubmit={handleSaveFieldNote} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[#173B3A] mb-1">ASHA Field Observations</label>
                <textarea
                  rows={3}
                  required
                  value={fieldNoteText}
                  onChange={(e) => setFieldNoteText(e.target.value)}
                  placeholder="Record patient vitals, medication adherence, symptoms, or hospital referral..."
                  className="w-full bg-[#F5F2EA] border border-[#173B3A]/20 rounded-xl p-3 text-xs text-[#173B3A] focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveCitizenForNote(null)}
                  className="px-3 py-1.5 rounded-lg border border-gray-300 text-[#607574] font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#2E8B57] text-white font-bold"
                >
                  Save Field Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Citizens Roster & Care Actions (Section 56) */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#173B3A]/10 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="font-bold text-base text-[#173B3A]">Assigned Citizens & Care Schedules</h2>

          <div className="flex items-center gap-1.5 text-xs font-bold">
            {(['ALL', 'VISIT_DUE', 'FOLLOW_UP', 'COMPLETED'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-3 py-1.5 rounded-lg transition ${
                  filter === tab ? 'bg-[#164E47] text-white' : 'bg-[#F5F2EA] text-[#607574] hover:text-[#173B3A]'
                }`}
              >
                {tab.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {filteredCitizens.map((c) => (
            <div
              key={c.id}
              className="p-4 rounded-xl border border-[#173B3A]/15 bg-[#F5F2EA]/40 flex flex-col md:flex-row md:items-center justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm text-[#173B3A]">{c.name}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white text-[#607574] border border-gray-200">
                    {c.patientId}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      c.category === 'ANC / Maternal'
                        ? 'bg-pink-100 text-pink-700'
                        : c.category === 'Child Immunization'
                        ? 'bg-blue-100 text-blue-700'
                        : c.category === 'Chronic Hypertension'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {c.category}
                  </span>
                </div>

                <div className="text-xs text-[#607574]">{c.address}</div>

                <p className="text-xs text-[#173B3A] bg-white p-2 rounded-lg border border-gray-100">
                  <span className="font-bold text-[#164E47]">Notes: </span>
                  {c.notes}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <a
                  href={`tel:${c.phone}`}
                  className="p-2.5 rounded-xl bg-white border border-[#164E47]/20 text-[#164E47] hover:bg-[#F5F2EA] transition"
                  title="Call Citizen"
                >
                  <Phone className="w-4 h-4" />
                </a>

                <button
                  onClick={() => setActiveCitizenForNote(c)}
                  className="px-3 py-2 rounded-xl bg-[#164E47] hover:bg-[#1F5C54] text-white text-xs font-bold transition shadow-sm"
                >
                  Log Visit
                </button>

                {c.status !== 'COMPLETED' ? (
                  <button
                    onClick={() => handleMarkCompleted(c.id)}
                    className="px-3 py-2 rounded-xl bg-[#2E8B57] hover:bg-[#257347] text-white text-xs font-bold transition shadow-sm"
                  >
                    Mark Done
                  </button>
                ) : (
                  <span className="text-xs font-bold text-[#2E8B57] flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Done
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
