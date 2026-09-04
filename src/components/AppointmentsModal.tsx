import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  Video,
  User,
  Building2,
  CheckCircle2,
  AlertCircle,
  X,
  Share2,
} from 'lucide-react';
import { Appointment, Facility, Language, UserAccount } from '../types';
import { translations } from '../i18n/translations';
import { storageService } from '../services/storageService';

interface AppointmentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount | null;
  language: Language;
  preselectedFacility?: Facility | null;
  isOnline: boolean;
  onAppointmentBooked: (appt: Appointment) => void;
}

export const AppointmentsModal: React.FC<AppointmentsModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  language,
  preselectedFacility,
  isOnline,
  onAppointmentBooked,
}) => {
  const t = translations[language];
  const facilities = storageService.getFacilities();

  const [selectedFacilityId, setSelectedFacilityId] = useState(preselectedFacility?.id || facilities[0]?.id || '');
  const [selectedDoctor, setSelectedDoctor] = useState('Dr. Anand Deshmukh (MBBS, MD - General Medicine)');
  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().slice(0, 10);
  });
  const [selectedTime, setSelectedTime] = useState('10:30 AM');
  const [consultType, setConsultType] = useState<'IN_PERSON' | 'TELECONSULTATION'>('IN_PERSON');
  const [issueNotes, setIssueNotes] = useState('');
  const [bookedAppt, setBookedAppt] = useState<Appointment | null>(null);

  const availableDoctors = [
    'Dr. Anand Deshmukh (MBBS, MD - General Medicine)',
    'Dr. Sunita Kadam (MBBS, DGO - Maternal & Child Health)',
    'Dr. Rajesh Patil (MD - Cardiology / Hriday Consultant)',
    'Dr. Meera Joshi (BAMS - AYUSH & Preventive Care)',
  ];

  const timeSlots = [
    '09:30 AM', '10:30 AM', '11:30 AM', '02:00 PM', '03:30 PM', '04:30 PM',
  ];

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    const fac = facilities.find(f => f.id === selectedFacilityId) || facilities[0];
    const token = Math.floor(Math.random() * 15) + 15;

    const newAppt: Appointment = {
      id: 'apt-' + Date.now(),
      patientId: currentUser.patientId,
      patientName: currentUser.name,
      facilityId: fac.id,
      facilityName: fac.name,
      doctorId: 'doc-' + Math.floor(Math.random() * 100),
      doctorName: selectedDoctor,
      date: selectedDate,
      time: selectedTime,
      consultationType: consultType,
      status: isOnline ? 'CONFIRMED' : 'PENDING', // Section 110
      issue: issueNotes || 'Routine consultation and check-up',
      tokenNumber: token,
      createdAt: new Date().toISOString(),
      calendarSynced: false,
      isPendingSync: !isOnline,
    };

    storageService.saveAppointment(newAppt);
    setBookedAppt(newAppt);
    onAppointmentBooked(newAppt);
  };

  const handleSyncToGoogleCalendar = () => {
    if (!bookedAppt) return;
    // Google Calendar Integration Point (Section 26, 120)
    const title = encodeURIComponent(`SehatSetu Appointment: ${bookedAppt.doctorName}`);
    const details = encodeURIComponent(
      `Facility: ${bookedAppt.facilityName}\nToken: ${bookedAppt.tokenNumber}\nType: ${bookedAppt.consultationType}\nPatient: ${bookedAppt.patientName} (${bookedAppt.patientId})`
    );
    const location = encodeURIComponent(bookedAppt.facilityName);
    const calUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}`;
    
    bookedAppt.calendarSynced = true;
    storageService.saveAppointment(bookedAppt);
    window.open(calUrl, '_blank', 'noopener,noreferrer');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-[#164E47]/20 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-[#164E47] text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#F9A01B] flex items-center justify-center text-[#173B3A]">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-base sm:text-lg text-white">{t.bookAppointmentBtn}</h2>
              <p className="text-[11px] text-[#F5F2EA]/80 font-medium">
                {consultType === 'IN_PERSON' ? t.inPerson : t.teleconsultation}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 sm:p-6 overflow-y-auto max-h-[75vh]">
          {!bookedAppt ? (
            <form onSubmit={handleBooking} className="space-y-4">
              {/* Facility Picker */}
              <div>
                <label className="block text-xs font-bold text-[#173B3A] mb-1">
                  {t.selectFacility}
                </label>
                <select
                  value={selectedFacilityId}
                  onChange={(e) => setSelectedFacilityId(e.target.value)}
                  className="w-full bg-[#F5F2EA] border border-[#173B3A]/20 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-[#173B3A] focus:outline-none focus:ring-2 focus:ring-[#164E47]"
                >
                  {facilities.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name} ({f.distanceKm} km)
                    </option>
                  ))}
                </select>
              </div>

              {/* Doctor Picker */}
              <div>
                <label className="block text-xs font-bold text-[#173B3A] mb-1">
                  {t.selectDoctor}
                </label>
                <select
                  value={selectedDoctor}
                  onChange={(e) => setSelectedDoctor(e.target.value)}
                  className="w-full bg-[#F5F2EA] border border-[#173B3A]/20 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-[#173B3A] focus:outline-none focus:ring-2 focus:ring-[#164E47]"
                >
                  {availableDoctors.map((doc, idx) => (
                    <option key={idx} value={doc}>{doc}</option>
                  ))}
                </select>
              </div>

              {/* Consultation Type Radio Buttons (Section 25) */}
              <div>
                <label className="block text-xs font-bold text-[#173B3A] mb-1.5">
                  {t.consultationType}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setConsultType('IN_PERSON')}
                    className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition ${
                      consultType === 'IN_PERSON'
                        ? 'bg-[#164E47] text-white border-[#164E47] shadow-sm'
                        : 'bg-white text-[#173B3A] border-gray-200 hover:bg-[#F5F2EA]'
                    }`}
                  >
                    <Building2 className="w-4 h-4" />
                    <span>{t.inPerson}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setConsultType('TELECONSULTATION')}
                    className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition ${
                      consultType === 'TELECONSULTATION'
                        ? 'bg-[#164E47] text-white border-[#164E47] shadow-sm'
                        : 'bg-white text-[#173B3A] border-gray-200 hover:bg-[#F5F2EA]'
                    }`}
                  >
                    <Video className="w-4 h-4" />
                    <span>{t.teleconsultation}</span>
                  </button>
                </div>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#173B3A] mb-1">
                    {t.selectDate}
                  </label>
                  <input
                    type="date"
                    required
                    value={selectedDate}
                    min={new Date().toISOString().slice(0, 10)}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full bg-[#F5F2EA] border border-[#173B3A]/20 rounded-xl px-3 py-2 text-xs sm:text-sm text-[#173B3A] focus:outline-none focus:ring-2 focus:ring-[#164E47]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#173B3A] mb-1">
                    {t.selectTime}
                  </label>
                  <select
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="w-full bg-[#F5F2EA] border border-[#173B3A]/20 rounded-xl px-3 py-2 text-xs sm:text-sm text-[#173B3A] focus:outline-none focus:ring-2 focus:ring-[#164E47]"
                  >
                    {timeSlots.map((slot, idx) => (
                      <option key={idx} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Symptom notes */}
              <div>
                <label className="block text-xs font-bold text-[#173B3A] mb-1">
                  {language === 'mr' ? 'आरोग्य तक्रार / कारण:' : language === 'hi' ? 'स्वास्थ्य समस्या / परामर्श का कारण:' : 'Reason for Consultation:'}
                </label>
                <input
                  type="text"
                  value={issueNotes}
                  onChange={(e) => setIssueNotes(e.target.value)}
                  placeholder="E.g., High blood pressure check, fever, follow-up..."
                  className="w-full bg-[#F5F2EA] border border-[#173B3A]/20 rounded-xl px-3 py-2 text-xs sm:text-sm text-[#173B3A] focus:outline-none focus:ring-2 focus:ring-[#164E47]"
                />
              </div>

              {/* Online/Offline Booking Transparency Note (Section 108, 110) */}
              <div className="text-[11px] text-[#607574] bg-[#F5F2EA] p-2.5 rounded-lg border border-[#173B3A]/10">
                {isOnline ? (
                  <span className="text-[#2E8B57] font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Instant online confirmation with live token assignment
                  </span>
                ) : (
                  <span className="text-[#F9A01B] font-semibold flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> You are offline. Appointment will be prepared and saved locally as PENDING until connectivity returns.
                  </span>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-[#F9A01B] hover:bg-[#e08c0f] text-[#173B3A] font-extrabold text-sm shadow-md transition"
              >
                {t.bookNowBtn}
              </button>
            </form>
          ) : (
            <div className="space-y-4 text-center animate-in fade-in">
              <div className="w-12 h-12 rounded-full bg-[#2E8B57]/15 text-[#2E8B57] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-lg font-black text-[#173B3A]">
                  {bookedAppt.status === 'CONFIRMED' ? t.appointmentConfirmed : t.appointmentPendingOffline}
                </h3>
                <p className="text-xs text-[#607574] mt-1">
                  {bookedAppt.status === 'CONFIRMED'
                    ? 'Your healthcare consultation has been officially scheduled'
                    : 'Saved to your offline record. Will synchronize automatically.'}
                </p>
              </div>

              {/* Booking Summary Card */}
              <div className="bg-[#F5F2EA] rounded-xl p-4 border border-[#173B3A]/15 text-left text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-[#607574]">Patient ID:</span>
                  <span className="font-bold text-[#173B3A] font-mono">{bookedAppt.patientId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#607574]">Assigned Token:</span>
                  <span className="font-extrabold text-[#F9A01B] text-sm">#{bookedAppt.tokenNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#607574]">Facility:</span>
                  <span className="font-semibold text-[#173B3A]">{bookedAppt.facilityName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#607574]">Doctor:</span>
                  <span className="font-semibold text-[#173B3A]">{bookedAppt.doctorName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#607574]">Date & Slot:</span>
                  <span className="font-semibold text-[#173B3A]">{bookedAppt.date} at {bookedAppt.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#607574]">Mode:</span>
                  <span className="font-bold text-[#164E47]">
                    {bookedAppt.consultationType === 'IN_PERSON' ? t.inPerson : t.teleconsultation}
                  </span>
                </div>
              </div>

              {/* Google Calendar Integration Button (Section 26, 120) */}
              <button
                onClick={handleSyncToGoogleCalendar}
                className="w-full py-2.5 px-4 rounded-xl bg-[#1976D2] hover:bg-[#1565C0] text-white font-bold text-xs shadow flex items-center justify-center gap-2 transition"
              >
                <CalendarIcon className="w-4 h-4" />
                <span>{t.addToGoogleCalendar}</span>
              </button>

              <button
                onClick={onClose}
                className="w-full py-2 px-4 rounded-xl border border-gray-300 text-[#607574] text-xs font-bold hover:bg-gray-50 transition"
              >
                {t.close}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
