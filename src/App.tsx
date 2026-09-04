import React, { useState, useEffect } from 'react';
import {
  Heart,
  Stethoscope,
  Compass,
  FolderLock,
  Pill,
  HeartHandshake,
  ShieldAlert,
  Calendar,
  Layers,
} from 'lucide-react';
import { Language, UserAccount, UserRole, Facility, Appointment } from './types';
import { translations } from './i18n/translations';
import { storageService } from './services/storageService';

// Component Imports
import { Header } from './components/Header';
import { MitraFloatingBar, MitraModal } from './components/MitraModal';
import { HridayScanModal } from './components/HridayScanModal';
import { DigitalTriageModal } from './components/DigitalTriageModal';
import { SOSModal } from './components/SOSModal';
import { AppointmentsModal } from './components/AppointmentsModal';
import { CalendarSyncModal } from './components/CalendarSyncModal';

// Views
import { PatientDashboard } from './components/PatientDashboard';
import { HealthcareNavigationView } from './components/HealthcareNavigationView';
import { HealthPassportView } from './components/HealthPassportView';
import { MedicinesView } from './components/MedicinesView';
import { FollowUpView } from './components/FollowUpView';
import { DoctorDashboard } from './components/DoctorDashboard';
import { AshaDashboard } from './components/AshaDashboard';
import { GovernmentDashboard } from './components/GovernmentDashboard';
import { AuthView } from './components/AuthView';

export default function App() {
  // Current user & authentication state
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => storageService.getCurrentUser());
  const [currentRole, setCurrentRole] = useState<UserRole>(() => currentUser?.role || 'patient');
  const [language, setLanguage] = useState<Language>(() => currentUser?.language || storageService.getLanguage());

  // Patient Sub-view navigation
  const [patientTab, setPatientTab] = useState<'dashboard' | 'navigation' | 'passport' | 'medicines' | 'followup'>('dashboard');

  // Modals state
  const [isMitraOpen, setIsMitraOpen] = useState(false);
  const [isHridayOpen, setIsHridayOpen] = useState(false);
  const [isTriageOpen, setIsTriageOpen] = useState(false);
  const [isSOSOpen, setIsSOSOpen] = useState(false);
  const [isAppointmentOpen, setIsAppointmentOpen] = useState(false);
  const [selectedFacilityForAppt, setSelectedFacilityForAppt] = useState<Facility | null>(null);
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);

  // Network Online / Offline Detection
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      storageService.setOnline(true);
      storageService.performBackgroundSync();
    };
    const handleOffline = () => {
      setIsOnline(false);
      storageService.setOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleToggleOnline = () => {
    const nextState = !isOnline;
    setIsOnline(nextState);
    storageService.setOnline(nextState);
    if (nextState) {
      storageService.performBackgroundSync();
    }
  };

  const handleLanguageChange = (newLang: Language) => {
    setLanguage(newLang);
    storageService.setLanguage(newLang);
    if (currentUser) {
      currentUser.language = newLang;
      storageService.saveCurrentUser(currentUser);
    }
  };

  const handleRoleChange = (newRole: UserRole) => {
    setCurrentRole(newRole);
    if (currentUser) {
      currentUser.role = newRole;
      storageService.saveCurrentUser(currentUser);
    }
  };

  const handleLogout = () => {
    storageService.logout();
    setCurrentUser(null);
  };

  const handleLoginSuccess = (user: UserAccount) => {
    setCurrentUser(user);
    setCurrentRole(user.role);
    setLanguage(user.preferredLanguage);
  };

  const handleMitraNavigation = (targetView: string) => {
    switch (targetView.toLowerCase()) {
      case 'hriday':
      case 'hridayscan':
      case 'scan':
        setIsHridayOpen(true);
        break;
      case 'triage':
        setIsTriageOpen(true);
        break;
      case 'appointment':
      case 'appointments':
      case 'booking':
        setIsAppointmentOpen(true);
        break;
      case 'navigation':
      case 'hospital':
      case 'phc':
        setCurrentRole('patient');
        setPatientTab('navigation');
        break;
      case 'passport':
      case 'records':
        setCurrentRole('patient');
        setPatientTab('passport');
        break;
      case 'medicines':
      case 'meds':
        setCurrentRole('patient');
        setPatientTab('medicines');
        break;
      case 'followup':
        setCurrentRole('patient');
        setPatientTab('followup');
        break;
      default:
        setCurrentRole('patient');
        setPatientTab('dashboard');
        break;
    }
  };

  const t = translations[language];

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#173B3A] flex flex-col font-sans selection:bg-[#164E47] selection:text-white">
      {/* Top Application Header */}
      <Header
        currentUser={currentUser}
        currentRole={currentRole}
        language={language}
        onLanguageChange={handleLanguageChange}
        onRoleChange={handleRoleChange}
        onOpenSOS={() => setIsSOSOpen(true)}
        onLogout={handleLogout}
        isOnline={isOnline}
        onToggleOnline={handleToggleOnline}
        onOpenCalendarSync={() => setIsCalendarModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {!currentUser ? (
          <AuthView language={language} onLoginSuccess={handleLoginSuccess} />
        ) : (
          <>
            {/* Citizen / Patient Role Views */}
            {currentRole === 'patient' && (
              <div className="space-y-6">
                {/* Secondary Navigation Pill Bar */}
                <div className="flex items-center gap-1.5 sm:gap-2 bg-white p-1.5 rounded-2xl border border-[#173B3A]/10 shadow-sm overflow-x-auto text-xs font-bold">
                  <button
                    onClick={() => setPatientTab('dashboard')}
                    className={`px-3.5 py-2 rounded-xl transition flex items-center gap-2 whitespace-nowrap ${
                      patientTab === 'dashboard'
                        ? 'bg-[#164E47] text-white shadow-sm'
                        : 'text-[#607574] hover:bg-[#F5F2EA] hover:text-[#173B3A]'
                    }`}
                  >
                    <Layers className="w-4 h-4" />
                    <span>Dashboard</span>
                  </button>

                  <button
                    onClick={() => setPatientTab('navigation')}
                    className={`px-3.5 py-2 rounded-xl transition flex items-center gap-2 whitespace-nowrap ${
                      patientTab === 'navigation'
                        ? 'bg-[#164E47] text-white shadow-sm'
                        : 'text-[#607574] hover:bg-[#F5F2EA] hover:text-[#173B3A]'
                    }`}
                  >
                    <Compass className="w-4 h-4 text-[#1976D2]" />
                    <span>{t.healthcareNavigation}</span>
                  </button>

                  <button
                    onClick={() => setPatientTab('passport')}
                    className={`px-3.5 py-2 rounded-xl transition flex items-center gap-2 whitespace-nowrap ${
                      patientTab === 'passport'
                        ? 'bg-[#164E47] text-white shadow-sm'
                        : 'text-[#607574] hover:bg-[#F5F2EA] hover:text-[#173B3A]'
                    }`}
                  >
                    <FolderLock className="w-4 h-4 text-[#F9A01B]" />
                    <span>{t.healthPassport}</span>
                  </button>

                  <button
                    onClick={() => setPatientTab('medicines')}
                    className={`px-3.5 py-2 rounded-xl transition flex items-center gap-2 whitespace-nowrap ${
                      patientTab === 'medicines'
                        ? 'bg-[#164E47] text-white shadow-sm'
                        : 'text-[#607574] hover:bg-[#F5F2EA] hover:text-[#173B3A]'
                    }`}
                  >
                    <Pill className="w-4 h-4 text-[#2E8B57]" />
                    <span>{t.medicines}</span>
                  </button>

                  <button
                    onClick={() => setPatientTab('followup')}
                    className={`px-3.5 py-2 rounded-xl transition flex items-center gap-2 whitespace-nowrap ${
                      patientTab === 'followup'
                        ? 'bg-[#164E47] text-white shadow-sm'
                        : 'text-[#607574] hover:bg-[#F5F2EA] hover:text-[#173B3A]'
                    }`}
                  >
                    <HeartHandshake className="w-4 h-4 text-[#164E47]" />
                    <span>{t.followUp}</span>
                  </button>
                </div>

                {/* Sub-Views */}
                {patientTab === 'dashboard' && (
                  <PatientDashboard
                    currentUser={currentUser}
                    language={language}
                    onOpenTriage={() => setIsTriageOpen(true)}
                    onOpenHridayScan={() => setIsHridayOpen(true)}
                    onNavigateToNav={() => setPatientTab('navigation')}
                    onNavigateToPassport={() => setPatientTab('passport')}
                    onNavigateToMedicines={() => setPatientTab('medicines')}
                    onNavigateToFollowUp={() => setPatientTab('followup')}
                    onBookAppointment={() => {
                      setSelectedFacilityForAppt(null);
                      setIsAppointmentOpen(true);
                    }}
                    onOpenSOS={() => setIsSOSOpen(true)}
                  />
                )}

                {patientTab === 'navigation' && (
                  <HealthcareNavigationView
                    currentUser={currentUser}
                    language={language}
                    isOnline={isOnline}
                    onBookAppointmentForFacility={(facility) => {
                      setSelectedFacilityForAppt(facility);
                      setIsAppointmentOpen(true);
                    }}
                  />
                )}

                {patientTab === 'passport' && (
                  <HealthPassportView
                    currentUser={currentUser}
                    language={language}
                    onOpenHridayScan={() => setIsHridayOpen(true)}
                  />
                )}

                {patientTab === 'medicines' && (
                  <MedicinesView currentUser={currentUser} language={language} />
                )}

                {patientTab === 'followup' && (
                  <FollowUpView
                    currentUser={currentUser}
                    language={language}
                    onBookAppointment={() => {
                      setSelectedFacilityForAppt(null);
                      setIsAppointmentOpen(true);
                    }}
                    onOpenTriage={() => setIsTriageOpen(true)}
                  />
                )}
              </div>
            )}

            {/* Doctor Role View */}
            {currentRole === 'doctor' && (
              <DoctorDashboard currentUser={currentUser} language={language} />
            )}

            {/* ASHA Worker Role View */}
            {currentRole === 'asha' && (
              <AshaDashboard currentUser={currentUser} language={language} isOnline={isOnline} />
            )}

            {/* Government Health Authority View */}
            {currentRole === 'government' && (
              <GovernmentDashboard currentUser={currentUser} language={language} />
            )}
          </>
        )}
      </main>

      {/* Persistent Floating Mitra AI Trigger (Section 31) */}
      {currentUser && (
        <MitraFloatingBar
          onOpen={() => setIsMitraOpen(true)}
          language={language}
        />
      )}

      {/* MODALS */}
      {/* 1. Mitra AI Conversational Companion Modal */}
      <MitraModal
        isOpen={isMitraOpen}
        onClose={() => setIsMitraOpen(false)}
        currentUser={currentUser}
        currentRole={currentRole}
        language={language}
        onNavigate={handleMitraNavigation}
        onTriggerSOS={() => {
          setIsMitraOpen(false);
          setIsSOSOpen(true);
        }}
        isOnline={isOnline}
      />

      {/* 2. Hriday Scan Optical Pulse Modal */}
      <HridayScanModal
        isOpen={isHridayOpen}
        onClose={() => setIsHridayOpen(false)}
        currentUser={currentUser}
        language={language}
        onSavedToPassport={() => {
          setPatientTab('passport');
        }}
      />

      {/* 3. Digital Triage Urgency Modal */}
      <DigitalTriageModal
        isOpen={isTriageOpen}
        onClose={() => setIsTriageOpen(false)}
        currentUser={currentUser}
        language={language}
        onBookAppointment={() => {
          setIsAppointmentOpen(true);
        }}
        onOpenSOS={() => {
          setIsSOSOpen(true);
        }}
      />

      {/* 4. Emergency SOS Modal */}
      <SOSModal
        isOpen={isSOSOpen}
        onClose={() => setIsSOSOpen(false)}
        currentUser={currentUser}
        language={language}
      />

      {/* 5. Appointment Booking Modal */}
      <AppointmentsModal
        isOpen={isAppointmentOpen}
        onClose={() => setIsAppointmentOpen(false)}
        currentUser={currentUser}
        language={language}
        preselectedFacility={selectedFacilityForAppt}
        isOnline={isOnline}
        onAppointmentBooked={(appt) => {
          // updated in storageService
        }}
      />

      {/* 6. Calendar Sync Modal */}
      <CalendarSyncModal
        isOpen={isCalendarModalOpen}
        onClose={() => setIsCalendarModalOpen(false)}
        currentUser={currentUser}
        language={language}
      />

      {/* Accessible Footer */}
      <footer className="mt-auto border-t border-[#173B3A]/10 bg-white py-6 text-center text-xs text-[#607574]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-[#164E47]">SEHATSETU</span>
            <span>• Healthcare Without Barriers</span>
          </div>
          <div className="text-[11px]">
            Designed for Maharashtra Rural Health Ecosystem • Satara District Pilot
          </div>
        </div>
      </footer>
    </div>
  );
}
