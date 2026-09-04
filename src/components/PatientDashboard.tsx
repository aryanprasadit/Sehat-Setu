import React from 'react';
import {
  Stethoscope,
  Heart,
  Compass,
  FolderLock,
  Calendar,
  Pill,
  HeartHandshake,
  Clock,
  ShieldAlert,
  ArrowRight,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { Language, UserAccount } from '../types';
import { translations, getPersonalizedGreeting } from '../i18n/translations';
import { storageService } from '../services/storageService';

interface PatientDashboardProps {
  currentUser: UserAccount | null;
  language: Language;
  onOpenTriage: () => void;
  onOpenHridayScan: () => void;
  onNavigateToNav: () => void;
  onNavigateToPassport: () => void;
  onNavigateToMedicines: () => void;
  onNavigateToFollowUp: () => void;
  onBookAppointment: () => void;
  onOpenSOS: () => void;
}

export const PatientDashboard: React.FC<PatientDashboardProps> = ({
  currentUser,
  language,
  onOpenTriage,
  onOpenHridayScan,
  onNavigateToNav,
  onNavigateToPassport,
  onNavigateToMedicines,
  onNavigateToFollowUp,
  onBookAppointment,
  onOpenSOS,
}) => {
  const t = translations[language];
  const greeting = getPersonalizedGreeting(currentUser?.name || '', currentUser?.role || 'patient', language);

  const appointments = currentUser ? storageService.getAppointments(currentUser.patientId) : [];
  const latestAppt = appointments[0];
  const medicines = currentUser ? storageService.getMedicines(currentUser.patientId) : [];
  const activeMeds = medicines.filter(m => m.isActive !== false);

  return (
    <div className="space-y-6">
      {/* Time-Aware Personalized Greeting Banner (Section 12) */}
      <div className="bg-gradient-to-r from-[#164E47] to-[#1F5C54] text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white/90 text-xs font-semibold mb-3 border border-white/15">
            <Sparkles className="w-3.5 h-3.5 text-[#F9A01B]" />
            <span>SehatSetu Care Dashboard</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-snug">
            {greeting}
          </h1>

          <p className="text-xs sm:text-sm text-[#F5F2EA]/85 mt-2 font-medium leading-relaxed">
            {language === 'mr'
              ? 'तुमचे आरोग्य, तपासण्या व स्थानिक सरकारी आरोग्य केंद्र सेवा एकाच ठिकाणी उपलब्ध आहेत.'
              : language === 'hi'
              ? 'आपका स्वास्थ्य, परीक्षण व स्थानीय सरकारी स्वास्थ्य केंद्र सेवाएं एक ही स्थान पर उपलब्ध हैं।'
              : 'Empowering you with barrier-free healthcare access, emergency triage, and smart vitals.'}
          </p>

          {currentUser && (
            <div className="mt-4 flex items-center gap-2 text-xs font-mono bg-black/20 w-fit px-3 py-1 rounded-lg border border-white/10">
              <span className="text-[#F9A01B] font-bold">{t.patientId}:</span>
              <span>{currentUser.patientId}</span>
            </div>
          )}
        </div>

        {/* Subtle Decorative Background Wave */}
        <div className="absolute right-0 bottom-0 translate-x-10 translate-y-10 opacity-10 pointer-events-none">
          <Heart className="w-64 h-64 text-white" />
        </div>
      </div>

      {/* CORE 4 QUICK ACTION CARDS (Section 17) */}
      <div>
        <h2 className="text-sm font-extrabold uppercase tracking-wider text-[#607574] mb-3">
          {language === 'mr' ? 'प्रमुख आरोग्य सेवा' : language === 'hi' ? 'प्रमुख स्वास्थ्य सेवाएं' : 'Core Healthcare Actions'}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: DIGITAL TRIAGE */}
          <button
            onClick={onOpenTriage}
            className="group text-left bg-white rounded-2xl p-5 border border-[#173B3A]/10 shadow-sm hover:shadow-md hover:border-[#164E47] transition flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#2E8B57]/15 text-[#2E8B57] flex items-center justify-center mb-4 group-hover:scale-105 transition">
                <Stethoscope className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-base text-[#173B3A] group-hover:text-[#164E47] transition">
                {t.digitalTriage}
              </h3>
              <p className="text-xs text-[#607574] mt-1.5 leading-relaxed font-medium">
                {t.digitalTriageDesc}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-[#164E47]">
              <span>Check Symptoms</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </button>

          {/* Card 2: HRIDAY SCAN */}
          <button
            onClick={onOpenHridayScan}
            className="group text-left bg-white rounded-2xl p-5 border border-[#173B3A]/10 shadow-sm hover:shadow-md hover:border-[#164E47] transition flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#D92D20]/15 text-[#D92D20] flex items-center justify-center mb-4 group-hover:scale-105 transition">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-base text-[#173B3A] group-hover:text-[#164E47] transition">
                {t.hridayScan}
              </h3>
              <p className="text-xs text-[#607574] mt-1.5 leading-relaxed font-medium">
                {t.hridayScanDesc}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-[#164E47]">
              <span>Measure Pulse</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </button>

          {/* Card 3: HEALTHCARE NAVIGATION */}
          <button
            onClick={onNavigateToNav}
            className="group text-left bg-white rounded-2xl p-5 border border-[#173B3A]/10 shadow-sm hover:shadow-md hover:border-[#164E47] transition flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#1976D2]/15 text-[#1976D2] flex items-center justify-center mb-4 group-hover:scale-105 transition">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-base text-[#173B3A] group-hover:text-[#164E47] transition">
                {t.healthcareNavigation}
              </h3>
              <p className="text-xs text-[#607574] mt-1.5 leading-relaxed font-medium">
                {t.healthcareNavDesc}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-[#164E47]">
              <span>Find Facilities</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </button>

          {/* Card 4: HEALTH PASSPORT */}
          <button
            onClick={onNavigateToPassport}
            className="group text-left bg-white rounded-2xl p-5 border border-[#173B3A]/10 shadow-sm hover:shadow-md hover:border-[#164E47] transition flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#F9A01B]/20 text-[#173B3A] flex items-center justify-center mb-4 group-hover:scale-105 transition">
                <FolderLock className="w-6 h-6 text-[#173B3A]" />
              </div>
              <h3 className="font-extrabold text-base text-[#173B3A] group-hover:text-[#164E47] transition">
                {t.healthPassport}
              </h3>
              <p className="text-xs text-[#607574] mt-1.5 leading-relaxed font-medium">
                {t.healthPassportDesc}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-[#164E47]">
              <span>Manage Records</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </button>
        </div>
      </div>

      {/* ADAPTIVE ACTIVITY & STATUS STRIP (Section 64) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Next Appointment & Queue Token */}
        <div className="bg-white rounded-2xl p-5 border border-[#173B3A]/10 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-[#607574] uppercase tracking-wider">
                Upcoming Appointment
              </span>
              <Calendar className="w-4 h-4 text-[#164E47]" />
            </div>

            {latestAppt ? (
              <div className="space-y-1.5">
                <div className="font-bold text-sm text-[#173B3A]">{latestAppt.facilityName}</div>
                <div className="text-xs text-[#607574]">
                  {latestAppt.doctorName} • {latestAppt.date} at {latestAppt.time}
                </div>
                <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#F9A01B]/20 text-[#173B3A] text-xs font-black">
                  <span>Token #{latestAppt.tokenNumber}</span>
                  <span className="text-[10px] font-semibold text-[#607574]">({latestAppt.status})</span>
                </div>
              </div>
            ) : (
              <div className="py-3 text-xs text-[#607574]">
                No appointments booked today.
              </div>
            )}
          </div>

          <button
            onClick={onBookAppointment}
            className="mt-4 text-xs font-bold text-[#164E47] hover:underline flex items-center gap-1"
          >
            <span>Book New Appointment</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Medicines Schedule */}
        <div className="bg-white rounded-2xl p-5 border border-[#173B3A]/10 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-[#607574] uppercase tracking-wider">
                Daily Medications
              </span>
              <Pill className="w-4 h-4 text-[#2E8B57]" />
            </div>

            {activeMeds.length > 0 ? (
              <div className="space-y-1.5">
                <div className="font-bold text-sm text-[#173B3A]">
                  {activeMeds[0].medicineName || activeMeds[0].name} ({activeMeds[0].dosage})
                </div>
                <div className="text-xs text-[#607574]">
                  {activeMeds[0].frequency} • {activeMeds[0].timing}
                </div>
                <div className="text-[11px] text-[#2E8B57] font-semibold mt-1">
                  {activeMeds[0].lastTaken ? `Taken today at ${activeMeds[0].lastTaken}` : 'Pending dose'}
                </div>
              </div>
            ) : (
              <div className="py-3 text-xs text-[#607574]">
                No active medicine prescriptions logged.
              </div>
            )}
          </div>

          <button
            onClick={onNavigateToMedicines}
            className="mt-4 text-xs font-bold text-[#164E47] hover:underline flex items-center gap-1"
          >
            <span>View All Medicines ({activeMeds.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Daily Recovery Check-in */}
        <div className="bg-white rounded-2xl p-5 border border-[#173B3A]/10 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-[#607574] uppercase tracking-wider">
                Daily Recovery Check-in
              </span>
              <HeartHandshake className="w-4 h-4 text-[#1976D2]" />
            </div>

            <p className="text-xs text-[#173B3A] font-medium leading-relaxed">
              How are you feeling after your recent consultation? Log your symptom progress.
            </p>
          </div>

          <button
            onClick={onNavigateToFollowUp}
            className="mt-4 py-2 px-3 rounded-xl bg-[#F5F2EA] hover:bg-[#164E47] hover:text-white text-xs font-bold text-[#173B3A] transition flex items-center justify-between"
          >
            <span>Log Check-in</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
