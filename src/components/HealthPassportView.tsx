import React, { useState } from 'react';
import {
  FolderLock,
  Upload,
  Camera,
  Heart,
  FileText,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  User,
  AlertCircle,
  Lock,
  Download,
  Plus,
} from 'lucide-react';
import { HealthRecord, Language, RecordAccessRequest, UserAccount } from '../types';
import { translations } from '../i18n/translations';
import { storageService } from '../services/storageService';

interface HealthPassportProps {
  currentUser: UserAccount | null;
  language: Language;
  onOpenHridayScan: () => void;
}

export const HealthPassportView: React.FC<HealthPassportProps> = ({
  currentUser,
  language,
  onOpenHridayScan,
}) => {
  const t = translations[language];

  const [records, setRecords] = useState<HealthRecord[]>(
    currentUser ? storageService.getHealthRecords(currentUser.patientId) : []
  );
  const [accessRequests, setAccessRequests] = useState<RecordAccessRequest[]>(
    currentUser ? storageService.getRecordAccessRequests(currentUser.patientId) : []
  );
  const [filterType, setFilterType] = useState<string>('ALL');
  const [isUploading, setIsUploading] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<HealthRecord['type']>('LAB_REPORT');
  const [newNotes, setNewNotes] = useState('');

  const filteredRecords = records.filter(r => {
    if (filterType === 'ALL') return true;
    return r.type === filterType;
  });

  const handleManualUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !newTitle.trim()) return;

    const newRec: HealthRecord = {
      id: 'rec-' + Date.now(),
      patientId: currentUser.patientId,
      title: newTitle,
      type: newType,
      date: new Date().toISOString().slice(0, 10),
      doctorOrFacility: 'Citizen Uploaded / Self-Reported',
      notes: newNotes,
    };

    storageService.saveHealthRecord(newRec);
    setRecords(storageService.getHealthRecords(currentUser.patientId));
    setIsUploading(false);
    setNewTitle('');
    setNewNotes('');
  };

  const handleAccessDecision = (reqId: string, status: 'ALLOWED' | 'DENIED') => {
    storageService.updateRecordAccessStatus(reqId, status);
    if (currentUser) {
      setAccessRequests(storageService.getRecordAccessRequests(currentUser.patientId));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#173B3A]/10 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#164E47]">
                {t.healthPassport}
              </h1>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#2E8B57]/15 text-[#2E8B57]">
                Private by Default
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#607574] mt-1 font-medium">
              {t.recordsPrivateByDefault}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsUploading(true)}
              className="flex items-center gap-2 py-2 px-3.5 rounded-xl bg-[#164E47] hover:bg-[#1F5C54] text-white text-xs font-bold transition shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>{t.uploadDocument}</span>
            </button>

            <button
              onClick={onOpenHridayScan}
              className="flex items-center gap-2 py-2 px-3.5 rounded-xl bg-[#F9A01B] hover:bg-[#e08c0f] text-[#173B3A] text-xs font-bold transition shadow-sm"
            >
              <Heart className="w-4 h-4 text-[#173B3A]" />
              <span>Hriday Scan</span>
            </button>
          </div>
        </div>

        {/* Patient Demographic Summary Strip (Section 13, 45) */}
        {currentUser && (
          <div className="mt-5 pt-4 border-t border-gray-100 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-[#F5F2EA] p-3 rounded-xl border border-[#173B3A]/10">
              <span className="text-[10px] text-[#607574] font-bold uppercase block">{t.patientId}</span>
              <span className="font-mono font-black text-[#164E47] text-sm">{currentUser.patientId}</span>
            </div>

            <div className="bg-[#F5F2EA] p-3 rounded-xl border border-[#173B3A]/10">
              <span className="text-[10px] text-[#607574] font-bold uppercase block">Demographics</span>
              <span className="font-bold text-[#173B3A]">
                {currentUser.age} yrs • {currentUser.gender} • {currentUser.weightKg} kg
              </span>
            </div>

            <div className="bg-[#F5F2EA] p-3 rounded-xl border border-[#173B3A]/10">
              <span className="text-[10px] text-[#607574] font-bold uppercase block">District & Ward</span>
              <span className="font-bold text-[#173B3A]">{currentUser.district}</span>
            </div>

            <div className="bg-[#F5F2EA] p-3 rounded-xl border border-[#173B3A]/10">
              <span className="text-[10px] text-[#607574] font-bold uppercase block">Past Medical History</span>
              <span className="font-bold text-[#173B3A] truncate block">
                {currentUser.healthProfile?.heartHistory ? 'Heart Condition' : 'Routine Health Profile'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* RECORD ACCESS REQUESTS MANAGEMENT (Section 44, 80) */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#173B3A]/10 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <ShieldCheck className="w-5 h-5 text-[#2E8B57]" />
          <h2 className="font-bold text-base text-[#173B3A]">{t.accessRequests}</h2>
          <span className="text-xs bg-[#F5F2EA] text-[#607574] font-bold px-2 py-0.5 rounded-full">
            {accessRequests.filter(r => r.status === 'PENDING').length} Pending
          </span>
        </div>
        <p className="text-xs text-[#607574] mb-4">
          {language === 'mr'
            ? 'डॉक्टर किंवा आरोग्य केंद्र केवळ तुमच्या स्पष्ट मंजुरीनंतरच तुमचे वैद्यकीय रेकॉर्ड पाहू शकतात.'
            : language === 'hi'
            ? 'डॉक्टर अथवा अस्पताल केवल आपकी स्पष्ट अनुमति के पश्चात ही आपका स्वास्थ्य रिकॉर्ड देख सकते हैं।'
            : 'Healthcare providers cannot access your records without explicit patient authorization.'}
        </p>

        {accessRequests.length === 0 ? (
          <div className="p-4 bg-[#F5F2EA] rounded-xl text-center text-xs text-[#607574]">
            No pending or recent doctor access requests.
          </div>
        ) : (
          <div className="space-y-3">
            {accessRequests.map((req) => (
              <div
                key={req.id}
                className="p-4 rounded-xl border border-[#173B3A]/15 bg-[#F5F2EA]/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[#173B3A]">{req.doctorName}</span>
                    <span className="text-xs text-[#607574]">({req.facilityName})</span>
                  </div>
                  <div className="text-xs text-[#607574] mt-1">
                    <span className="font-semibold text-[#173B3A]">Reason: </span>
                    {req.reason} • <span className="text-[11px]">{req.timestamp}</span>
                  </div>
                  <div className="text-[11px] text-[#164E47] font-medium mt-0.5">
                    Requested items: {req.recordsRequested.join(', ')}
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {req.status === 'PENDING' ? (
                    <>
                      <button
                        onClick={() => handleAccessDecision(req.id, 'ALLOWED')}
                        className="px-3.5 py-1.5 rounded-lg bg-[#2E8B57] hover:bg-[#257347] text-white text-xs font-bold transition flex items-center gap-1 shadow-sm"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{t.allowAccess}</span>
                      </button>
                      <button
                        onClick={() => handleAccessDecision(req.id, 'DENIED')}
                        className="px-3.5 py-1.5 rounded-lg bg-[#D92D20] hover:bg-[#b52217] text-white text-xs font-bold transition flex items-center gap-1 shadow-sm"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>{t.denyAccess}</span>
                      </button>
                    </>
                  ) : (
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full ${
                        req.status === 'ALLOWED'
                          ? 'bg-[#2E8B57]/15 text-[#2E8B57]'
                          : 'bg-[#D92D20]/15 text-[#D92D20]'
                      }`}
                    >
                      {req.status === 'ALLOWED' ? 'ACCESS GRANTED' : 'ACCESS DENIED'}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upload Document Modal */}
      {isUploading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-2xl p-5 border border-[#164E47]/20 shadow-2xl space-y-4">
            <h3 className="font-bold text-base text-[#164E47]">{t.uploadDocument}</h3>

            <form onSubmit={handleManualUpload} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[#173B3A] mb-1">Document Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="E.g., Blood Sugar Report, ECG Analysis, Discharge Note..."
                  className="w-full bg-[#F5F2EA] border border-[#173B3A]/20 rounded-xl p-2.5 text-xs text-[#173B3A] focus:outline-none focus:ring-2 focus:ring-[#164E47]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#173B3A] mb-1">Record Category</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as any)}
                  className="w-full bg-[#F5F2EA] border border-[#173B3A]/20 rounded-xl p-2.5 text-xs text-[#173B3A]"
                >
                  <option value="LAB_REPORT">Diagnostic / Lab Report</option>
                  <option value="PRESCRIPTION">Prescription Note</option>
                  <option value="CLINICAL_NOTE">Clinical & Hospital Record</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#173B3A] mb-1">Clinical Notes & Observations</label>
                <textarea
                  rows={2}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Doctor remarks, dosage guidelines, test values..."
                  className="w-full bg-[#F5F2EA] border border-[#173B3A]/20 rounded-xl p-2 text-xs text-[#173B3A]"
                />
              </div>

              {/* Mock file picker */}
              <div className="border-2 border-dashed border-[#173B3A]/20 rounded-xl p-4 text-center cursor-pointer hover:bg-[#F5F2EA]">
                <Upload className="w-5 h-5 text-[#164E47] mx-auto mb-1" />
                <span className="text-[11px] text-[#607574] font-medium block">
                  Drag & drop PDF / JPG scan or click to browse
                </span>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsUploading(false)}
                  className="px-3 py-1.5 rounded-lg border border-gray-300 text-[#607574] font-bold"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#164E47] text-white font-bold"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Stored Health Records Grid */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#173B3A]/10 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <h2 className="font-bold text-base text-[#173B3A]">
            {language === 'mr' ? 'आरोग्य नोंदी' : language === 'hi' ? 'स्वास्थ्य रिकॉर्ड्स' : 'Medical Records & Readings'}
          </h2>

          <div className="flex items-center gap-1.5 text-xs font-bold overflow-x-auto">
            {['ALL', 'HRIDAY_SCAN', 'PRESCRIPTION', 'LAB_REPORT', 'CLINICAL_NOTE'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-2.5 py-1 rounded-lg transition whitespace-nowrap ${
                  filterType === type ? 'bg-[#164E47] text-white' : 'bg-[#F5F2EA] text-[#607574] hover:text-[#173B3A]'
                }`}
              >
                {type.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {filteredRecords.length === 0 ? (
          <div className="text-center py-10 text-xs text-[#607574]">
            No records match this category.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredRecords.map((rec) => (
              <div
                key={rec.id}
                className="p-4 rounded-xl border border-[#173B3A]/15 bg-[#F5F2EA]/40 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#164E47]/10 text-[#164E47]">
                      {rec.type.replace('_', ' ')}
                    </span>
                    <span className="text-[11px] text-[#607574]">{rec.date}</span>
                  </div>

                  <h3 className="font-bold text-sm text-[#173B3A]">{rec.title}</h3>
                  <div className="text-xs text-[#607574] mt-0.5">{rec.doctorOrFacility}</div>

                  {rec.readings?.bpm && (
                    <div className="mt-2.5 bg-white p-2.5 rounded-lg border border-[#173B3A]/10 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Heart className="w-4 h-4 text-[#2E8B57] fill-[#2E8B57]" />
                        <span className="text-xs font-extrabold text-[#164E47]">{rec.readings.bpm} BPM</span>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#2E8B57]/10 text-[#2E8B57]">
                        {rec.readings.status}
                      </span>
                    </div>
                  )}

                  {rec.notes && (
                    <p className="text-xs text-[#173B3A] mt-2.5 leading-relaxed bg-white/70 p-2 rounded-lg border border-gray-100">
                      {rec.notes}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
