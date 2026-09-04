import React from 'react';
import {
  ShieldAlert,
  Wifi,
  WifiOff,
  RefreshCw,
  FileSpreadsheet,
  Globe,
  UserCheck,
  LogOut,
  Sparkles,
  Calendar,
} from 'lucide-react';
import { Language, UserAccount, UserRole } from '../types';
import { translations } from '../i18n/translations';
import { storageService } from '../services/storageService';

interface HeaderProps {
  currentUser: UserAccount | null;
  currentRole: UserRole;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onRoleChange: (role: UserRole) => void;
  onOpenSOS: () => void;
  onLogout: () => void;
  isOnline: boolean;
  onToggleOnline: () => void;
  onOpenCalendarSync: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  currentRole,
  language,
  onLanguageChange,
  onRoleChange,
  onOpenSOS,
  onLogout,
  isOnline,
  onToggleOnline,
  onOpenCalendarSync,
}) => {
  const t = translations[language];
  const [syncing, setSyncing] = React.useState(false);
  const [syncDoneMessage, setSyncDoneMessage] = React.useState<string | null>(null);
  const pendingSyncCount = storageService.getPendingSyncCount();

  const handleSyncNow = async () => {
    if (!isOnline) {
      alert(language === 'mr' ? 'ऑफलाइन असताना मध्यवर्ती सिंक शक्य नाही.' : language === 'hi' ? 'ऑफ़लाइन होने पर सिंक संभव नहीं है।' : 'Cannot sync while offline. Changes remain saved locally.');
      return;
    }
    setSyncing(true);
    const res = await storageService.performBackgroundSync();
    setSyncing(false);
    setSyncDoneMessage(`${res.syncedCount} records synced`);
    setTimeout(() => setSyncDoneMessage(null), 3000);
  };

  const handleDownloadExcel = () => {
    storageService.downloadExcelStore();
  };

  return (
    <header className="sticky top-0 z-40 bg-[#164E47] text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20 gap-2">
          {/* Logo & Product Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white flex items-center justify-center shadow-md p-1.5 flex-shrink-0">
              <div className="w-full h-full rounded-lg bg-[#164E47] flex items-center justify-center font-black text-white text-lg tracking-wider">
                SS
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg md:text-xl tracking-wide text-white">
                  SEHATSETU
                </span>
                <span className="hidden sm:inline-block text-xs font-semibold px-2 py-0.5 rounded-full bg-[#2E8B57] text-white">
                  Sehat Setu
                </span>
              </div>
              <p className="text-[11px] md:text-xs text-[#F5F2EA]/80 font-medium tracking-tight truncate max-w-[220px] sm:max-w-none">
                {t.tagline}
              </p>
            </div>
          </div>

          {/* Right Action Cluster */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Selector */}
            <div className="relative flex items-center bg-[#1F5C54] rounded-lg px-2 py-1 border border-white/15">
              <Globe className="w-3.5 h-3.5 text-[#F9A01B] mr-1.5 flex-shrink-0" />
              <select
                value={language}
                onChange={(e) => onLanguageChange(e.target.value as Language)}
                className="bg-transparent text-xs font-semibold text-white focus:outline-none cursor-pointer pr-1"
                aria-label="Select Language"
              >
                <option value="en" className="bg-[#164E47] text-white">English</option>
                <option value="hi" className="bg-[#164E47] text-white">हिन्दी</option>
                <option value="mr" className="bg-[#164E47] text-white">मराठी</option>
              </select>
            </div>

            {/* Online/Offline Status Pill */}
            <button
              onClick={onToggleOnline}
              title={isOnline ? 'Online mode. Click to simulate offline' : 'Offline mode. Click to go online'}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition border ${
                isOnline
                  ? 'bg-[#2E8B57]/25 text-[#7bf1ac] border-[#2E8B57]/50 hover:bg-[#2E8B57]/40'
                  : 'bg-[#D92D20]/25 text-[#ff9f97] border-[#D92D20]/50 hover:bg-[#D92D20]/40'
              }`}
            >
              {isOnline ? <Wifi className="w-3.5 h-3.5 text-[#7bf1ac]" /> : <WifiOff className="w-3.5 h-3.5 text-[#ff9f97]" />}
              <span className="hidden md:inline">{isOnline ? t.online : t.offline}</span>
            </button>

            {/* Sync Status / Trigger */}
            <button
              onClick={handleSyncNow}
              disabled={syncing}
              title="Data Sync Engine"
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#1F5C54] hover:bg-[#1F5C54]/80 text-xs font-semibold border border-white/10 text-white"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#F9A01B] ${syncing ? 'animate-spin' : ''}`} />
              <span>
                {syncing
                  ? t.syncing
                  : syncDoneMessage
                  ? t.syncComplete
                  : pendingSyncCount > 0
                  ? `${pendingSyncCount} Pending Sync`
                  : t.syncComplete}
              </span>
            </button>

            {/* Google Calendar Sync Integration Button */}
            <button
              onClick={onOpenCalendarSync}
              title="Google Calendar Integration Point"
              className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#1F5C54] hover:bg-[#1F5C54]/80 text-xs font-semibold border border-white/10 text-[#F5F2EA]"
            >
              <Calendar className="w-3.5 h-3.5 text-[#1976D2]" />
              <span>Calendar</span>
            </button>

            {/* Excel Store Download (Section 82) */}
            <button
              onClick={handleDownloadExcel}
              title="Download Master Excel Prototype Data Store"
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#2E8B57] hover:bg-[#2E8B57]/90 text-xs font-bold text-white shadow-sm"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Excel Store</span>
            </button>

            {/* Role Switcher */}
            <div className="flex items-center bg-[#1F5C54] rounded-lg px-2 py-1 border border-white/15">
              <UserCheck className="w-3.5 h-3.5 text-[#2E8B57] mr-1.5 flex-shrink-0" />
              <select
                value={currentRole}
                onChange={(e) => onRoleChange(e.target.value as UserRole)}
                className="bg-transparent text-xs font-semibold text-white focus:outline-none cursor-pointer"
                aria-label="Switch Role"
              >
                <option value="patient" className="bg-[#164E47] text-white">Patient / Citizen</option>
                <option value="doctor" className="bg-[#164E47] text-white">Doctor / Clinic</option>
                <option value="asha" className="bg-[#164E47] text-white">ASHA Worker</option>
                <option value="government" className="bg-[#164E47] text-white">Government Authority</option>
              </select>
            </div>

            {/* EMERGENCY SOS TRIGGER (Prominent High-Priority) */}
            <button
              onClick={onOpenSOS}
              id="sos-button"
              className="flex items-center gap-1.5 px-3 py-1.5 md:px-4 md:py-2 rounded-lg bg-[#D92D20] hover:bg-[#b52217] text-white text-xs md:text-sm font-black tracking-wider shadow-lg animate-pulse transition active:scale-95"
              aria-label="Emergency SOS"
            >
              <ShieldAlert className="w-4 h-4 md:w-5 md:h-5 text-white" />
              <span>SOS</span>
            </button>

            {/* User Details & Logout */}
            {currentUser && (
              <div className="flex items-center gap-2 pl-1 border-l border-white/15">
                <div className="hidden 2xl:block text-right">
                  <div className="text-xs font-bold leading-none truncate max-w-[100px]">{currentUser.name}</div>
                  <div className="text-[10px] text-[#F5F2EA]/70 font-mono">{currentUser.patientId}</div>
                </div>
                <button
                  onClick={onLogout}
                  title={t.logout}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
