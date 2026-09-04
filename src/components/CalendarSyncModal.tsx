import React from 'react';
import { Calendar, CheckCircle2, ExternalLink, X, Clock, ShieldCheck } from 'lucide-react';
import { Language, UserAccount } from '../types';
import { translations } from '../i18n/translations';
import { storageService } from '../services/storageService';

interface CalendarSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount | null;
  language: Language;
}

export const CalendarSyncModal: React.FC<CalendarSyncModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  language,
}) => {
  const t = translations[language];
  const appointments = currentUser ? storageService.getAppointments(currentUser.patientId) : [];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-2xl p-6 border border-[#164E47]/20 shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#1976D2]/15 text-[#1976D2] flex items-center justify-center font-bold">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-[#173B3A]">Google Calendar Sync</h3>
              <p className="text-xs text-[#607574]">Synchronize appointments & OPD reminders</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-[#173B3A]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="bg-[#F5F2EA] p-3.5 rounded-xl border border-[#173B3A]/10 text-xs text-[#173B3A] space-y-2">
          <div className="flex items-center gap-2 font-bold text-[#164E47]">
            <ShieldCheck className="w-4 h-4 text-[#2E8B57]" />
            <span>Calendar Integration Active</span>
          </div>
          <p className="text-[11px] text-[#607574] leading-relaxed">
            Appointments booked on SehatSetu feature single-click sync to your Google Calendar with facility address, token numbers, and clinical reminders.
          </p>
        </div>

        <div className="space-y-2">
          <div className="text-xs font-bold text-[#173B3A]">Your Scheduled Consultations:</div>
          {appointments.length === 0 ? (
            <div className="text-xs text-[#607574] text-center py-4 bg-gray-50 rounded-xl">
              No appointments to sync. Book an appointment from the navigation view.
            </div>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {appointments.map((appt) => (
                <div
                  key={appt.id}
                  className="p-3 rounded-xl border border-gray-200 bg-white flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-bold text-[#173B3A]">{appt.doctorName}</div>
                    <div className="text-[11px] text-[#607574]">
                      {appt.date} at {appt.time} • Token #{appt.tokenNumber}
                    </div>
                  </div>
                  <a
                    href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
                      `SehatSetu: ${appt.doctorName}`
                    )}&details=${encodeURIComponent(
                      `Facility: ${appt.facilityName}\nToken: ${appt.tokenNumber}`
                    )}&location=${encodeURIComponent(appt.facilityName)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-lg bg-[#1976D2]/10 hover:bg-[#1976D2]/20 text-[#1976D2] font-bold inline-flex items-center gap-1"
                  >
                    <span>Sync</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#164E47] text-white font-bold text-xs shadow"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
