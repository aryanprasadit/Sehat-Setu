import React, { useState } from 'react';
import {
  Building2,
  Users,
  Clock,
  TrendingUp,
  FileSpreadsheet,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Activity,
  Download,
  Eye,
  X,
} from 'lucide-react';
import { Language, UserAccount } from '../types';
import { translations } from '../i18n/translations';
import { storageService } from '../services/storageService';
import { GovernmentCharts } from './GovernmentCharts';

interface GovernmentDashboardProps {
  currentUser: UserAccount | null;
  language: Language;
}

export const GovernmentDashboard: React.FC<GovernmentDashboardProps> = ({ currentUser, language }) => {
  const t = translations[language];

  // Inspect Modal State (Section 61, 101)
  const [inspectModal, setInspectModal] = useState<{ title: string; data: any[] } | null>(null);

  // Provider Verification state (Section 53)
  const [providers, setProviders] = useState([
    {
      id: 'p-1',
      name: 'Dr. Ramesh K. Deshpande',
      qualification: 'MBBS, MS - Orthopedics',
      regNo: 'MMC-2018-91283',
      facility: 'Khandala Community Health Centre',
      status: 'PENDING',
      submittedDate: '01 Sep 2026',
    },
    {
      id: 'p-2',
      name: 'Dr. Sunita V. Joshi',
      qualification: 'BAMS, MD - AYUSH Medicine',
      regNo: 'MCIM-2015-44219',
      facility: 'Shirwal Primary Health Centre',
      status: 'VERIFIED',
      submittedDate: '28 Aug 2026',
    },
    {
      id: 'p-3',
      name: 'Dr. Farhan A. Khan',
      qualification: 'MBBS, DCH - Paediatrics',
      regNo: 'MMC-2020-11048',
      facility: 'Wai Sub-District Hospital',
      status: 'PENDING',
      submittedDate: '02 Sep 2026',
    },
  ]);

  const handleProviderAction = (id: string, newStatus: 'VERIFIED' | 'REJECTED') => {
    setProviders(prev => prev.map(p => (p.id === id ? { ...p, status: newStatus } : p)));
  };

  const handleDownloadMasterExcel = () => {
    storageService.downloadExcelStore();
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#173B3A]/10 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#164E47]">
              {language === 'mr' ? 'सार्वजनिक आरोग्य संनियंत्रण कक्ष' : language === 'hi' ? 'सार्वजनिक स्वास्थ्य निगरानी कक्ष' : 'District Public Health Monitoring Directorate'}
            </h1>
            <span className="text-xs bg-[#164E47]/10 text-[#164E47] font-bold px-2.5 py-0.5 rounded-full">
              Satara District
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#607574] mt-1 font-medium">
            Real-time aggregated health statistics, facility capacity, and provider licensing
          </p>
        </div>

        <button
          onClick={handleDownloadMasterExcel}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2E8B57] hover:bg-[#257347] text-white text-xs font-bold transition shadow-sm"
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Export Master Excel Store</span>
        </button>
      </div>

      {/* Primary KPI Metric Cards (Section 59) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-[#173B3A]/10 shadow-sm">
          <span className="text-[11px] font-bold text-[#607574] uppercase">Total Citizens Registered</span>
          <div className="text-2xl font-black text-[#173B3A] mt-1">1,84,290</div>
          <span className="text-xs text-[#2E8B57] font-semibold mt-1 block">+12.4% this quarter</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#173B3A]/10 shadow-sm">
          <span className="text-[11px] font-bold text-[#607574] uppercase">Daily District OPD Volume</span>
          <div className="text-2xl font-black text-[#164E47] mt-1">3,055</div>
          <span className="text-xs text-[#2E8B57] font-semibold mt-1 block">+4.8% vs previous week</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#173B3A]/10 shadow-sm">
          <span className="text-[11px] font-bold text-[#607574] uppercase">Avg OPD Wait Time</span>
          <div className="text-2xl font-black text-[#F9A01B] mt-1">23.2 mins</div>
          <span className="text-xs text-[#2E8B57] font-semibold mt-1 block">Within target (&lt;25m)</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#173B3A]/10 shadow-sm">
          <span className="text-[11px] font-bold text-[#607574] uppercase">Referral Completion Rate</span>
          <div className="text-2xl font-black text-[#1976D2] mt-1">68.0%</div>
          <span className="text-xs text-[#607574] mt-1 block">382 / 562 followed up</span>
        </div>
      </div>

      {/* 7 RESPONSIVE CHARTS (Section 60) */}
      <div>
        <h2 className="text-base font-extrabold text-[#173B3A] mb-3">
          Epidemiological & Operational Analytics
        </h2>
        <GovernmentCharts
          language={language}
          onInspect={(title, data) => setInspectModal({ title, data })}
        />
      </div>

      {/* PROVIDER CREDENTIAL VERIFICATION CONSOLE (Section 53) */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#173B3A]/10 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-[#164E47]" />
          <div>
            <h2 className="font-extrabold text-base text-[#173B3A]">
              Healthcare Provider Verification Queue
            </h2>
            <p className="text-xs text-[#607574]">
              Verify medical licenses and facility affiliations for trusted Teleconsultations
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F5F2EA] text-[#173B3A] font-bold uppercase tracking-wider">
              <tr>
                <th className="p-3 rounded-l-lg">Practitioner</th>
                <th className="p-3">Degrees & Registration</th>
                <th className="p-3">Designated Centre</th>
                <th className="p-3">Application Date</th>
                <th className="p-3">Status</th>
                <th className="p-3 rounded-r-lg text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {providers.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 transition">
                  <td className="p-3 font-bold text-[#173B3A]">{p.name}</td>
                  <td className="p-3 text-[#607574]">
                    <div>{p.qualification}</div>
                    <div className="text-[10px] font-mono text-[#164E47] font-bold">{p.regNo}</div>
                  </td>
                  <td className="p-3 text-[#173B3A]">{p.facility}</td>
                  <td className="p-3 text-[#607574]">{p.submittedDate}</td>
                  <td className="p-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        p.status === 'VERIFIED'
                          ? 'bg-[#2E8B57]/15 text-[#2E8B57]'
                          : p.status === 'REJECTED'
                          ? 'bg-[#D92D20]/15 text-[#D92D20]'
                          : 'bg-[#F9A01B]/20 text-[#173B3A]'
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    {p.status === 'PENDING' ? (
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleProviderAction(p.id, 'VERIFIED')}
                          className="px-2.5 py-1 rounded-lg bg-[#2E8B57] text-white font-bold text-xs hover:bg-[#257347] transition"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleProviderAction(p.id, 'REJECTED')}
                          className="px-2.5 py-1 rounded-lg bg-[#D92D20] text-white font-bold text-xs hover:bg-[#b52217] transition"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-[11px] text-[#607574] font-medium">Decided</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* INSPECT DATA MODAL (Section 61, 101) */}
      {inspectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-2xl p-5 border border-[#164E47]/20 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-[#164E47]">{inspectModal.title}</h3>
                <p className="text-xs text-[#607574]">Aggregated non-identifiable public health metric records</p>
              </div>
              <button
                onClick={() => setInspectModal(null)}
                className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-[#173B3A]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-[#F5F2EA] rounded-xl p-3 max-h-72 overflow-y-auto">
              <pre className="text-xs text-[#173B3A] font-mono leading-relaxed whitespace-pre-wrap">
                {JSON.stringify(inspectModal.data, null, 2)}
              </pre>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setInspectModal(null)}
                className="px-4 py-1.5 rounded-lg bg-[#164E47] text-white text-xs font-bold"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
