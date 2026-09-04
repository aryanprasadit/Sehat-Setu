import React, { useState } from 'react';
import {
  MapPin,
  Clock,
  Users,
  Navigation as NavigationIcon,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Search,
  Building2,
  Activity,
  ArrowUpRight,
  Map as MapIcon,
  List as ListIcon,
} from 'lucide-react';
import { Facility, Language, UserAccount } from '../types';
import { translations } from '../i18n/translations';
import { storageService } from '../services/storageService';
import { HealthcareMap } from './HealthcareMap';

interface HealthcareNavProps {
  currentUser: UserAccount | null;
  language: Language;
  isOnline: boolean;
  onBookAppointmentForFacility: (facility: Facility) => void;
}

export const HealthcareNavigationView: React.FC<HealthcareNavProps> = ({
  currentUser,
  language,
  isOnline,
  onBookAppointmentForFacility,
}) => {
  const t = translations[language];
  const [facilities, setFacilities] = useState<Facility[]>(storageService.getFacilities());
  const [filterType, setFilterType] = useState<'ALL' | 'PHC' | 'CHC' | 'Rural Hospital'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [displayMode, setDisplayMode] = useState<'both' | 'map' | 'list'>('both');

  // User appointment token if already booked
  const appointments = currentUser ? storageService.getAppointments(currentUser.patientId) : [];

  const filteredFacilities = facilities.filter(f => {
    const matchesType = filterType === 'ALL' || f.type === filterType;
    const matchesSearch =
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.services.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesType && matchesSearch;
  });

  const handleOpenGoogleMaps = (f: Facility) => {
    // Google Maps Platform Integration Point (Section 22, 119)
    const mapUrl = `https://www.google.com/maps/dir/?api=1&destination=${f.latitude},${f.longitude}`;
    window.open(mapUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-6">
      {/* Top Header and Filters */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#173B3A]/10 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#164E47]">
              {t.healthcareNavigation}
            </h1>
            <p className="text-xs sm:text-sm text-[#607574] mt-1 font-medium">
              {language === 'mr'
                ? 'तुमच्या परिसरातील प्राथमिक आरोग्य केंद्रे (PHC), ग्रामीण रुग्णालये व थेट टोकन रांग'
                : language === 'hi'
                ? 'निकटतम प्राथमिक स्वास्थ्य केंद्र (पीएचसी), सीएचसी व अस्पताल टोकन कतार'
                : 'Locate verified public healthcare centres, emergency availability, and queue tokens'}
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-[#607574] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.search}
              className="w-full bg-[#F5F2EA] border border-[#173B3A]/15 rounded-xl pl-9 pr-4 py-2.5 text-xs sm:text-sm text-[#173B3A] focus:outline-none focus:ring-2 focus:ring-[#164E47]"
            />
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 mt-4 overflow-x-auto pt-2 text-xs font-bold">
          <button
            onClick={() => setFilterType('ALL')}
            className={`px-3 py-1.5 rounded-lg transition ${
              filterType === 'ALL' ? 'bg-[#164E47] text-white' : 'bg-[#F5F2EA] text-[#607574] hover:text-[#173B3A]'
            }`}
          >
            All Facilities
          </button>
          <button
            onClick={() => setFilterType('PHC')}
            className={`px-3 py-1.5 rounded-lg transition ${
              filterType === 'PHC' ? 'bg-[#164E47] text-white' : 'bg-[#F5F2EA] text-[#607574] hover:text-[#173B3A]'
            }`}
          >
            PHC (Primary Centres)
          </button>
          <button
            onClick={() => setFilterType('CHC')}
            className={`px-3 py-1.5 rounded-lg transition ${
              filterType === 'CHC' ? 'bg-[#164E47] text-white' : 'bg-[#F5F2EA] text-[#607574] hover:text-[#173B3A]'
            }`}
          >
            CHC (Community Centres)
          </button>
          <button
            onClick={() => setFilterType('Rural Hospital')}
            className={`px-3 py-1.5 rounded-lg transition ${
              filterType === 'Rural Hospital' ? 'bg-[#164E47] text-white' : 'bg-[#F5F2EA] text-[#607574] hover:text-[#173B3A]'
            }`}
          >
            Rural & Sub-District Hospitals
          </button>
        </div>

        {/* View mode toggle: Both / Map only / List only */}
        <div className="flex items-center justify-between pt-4 mt-4 border-t border-[#173B3A]/10">
          <p className="text-xs text-[#607574] font-medium">
            Showing <strong className="text-[#173B3A]">{filteredFacilities.length}</strong> facilities
          </p>
          <div className="flex items-center gap-1 bg-[#F5F2EA] p-1 rounded-xl">
            <button
              onClick={() => setDisplayMode('both')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                displayMode === 'both' ? 'bg-white text-[#164E47] shadow-xs' : 'text-[#607574]'
              }`}
            >
              Split View
            </button>
            <button
              onClick={() => setDisplayMode('map')}
              className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition ${
                displayMode === 'map' ? 'bg-white text-[#164E47] shadow-xs' : 'text-[#607574]'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" />
              Interactive Map
            </button>
            <button
              onClick={() => setDisplayMode('list')}
              className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition ${
                displayMode === 'list' ? 'bg-white text-[#164E47] shadow-xs' : 'text-[#607574]'
              }`}
            >
              <ListIcon className="w-3.5 h-3.5" />
              List
            </button>
          </div>
        </div>
      </div>

      {/* Google Maps View */}
      {(displayMode === 'both' || displayMode === 'map') && (
        <HealthcareMap
          facilities={filteredFacilities}
          selectedFacility={selectedFacility}
          onSelectFacility={(fac) => setSelectedFacility(fac)}
          onBookAppointment={(fac) => onBookAppointmentForFacility(fac)}
          language={language}
        />
      )}

      {/* Facilities Grid */}
      {(displayMode === 'both' || displayMode === 'list') && (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredFacilities.map((facility) => {
          const userAppt = appointments.find(a => a.facilityId === facility.id && a.status === 'CONFIRMED');
          const peopleAhead = userAppt?.tokenNumber
            ? Math.max(0, userAppt.tokenNumber - facility.currentServingToken)
            : Math.max(0, facility.totalTokensIssued - facility.currentServingToken);

          return (
            <div
              key={facility.id}
              className="bg-white rounded-2xl border border-[#173B3A]/10 shadow-sm p-5 flex flex-col justify-between hover:shadow-md transition"
            >
              <div>
                {/* Facility Header */}
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#164E47]/10 text-[#164E47]">
                      {facility.type}
                    </span>
                    <h2 className="text-base sm:text-lg font-bold text-[#173B3A] mt-1 leading-snug">
                      {facility.name}
                    </h2>
                    <div className="flex items-center gap-1.5 text-xs text-[#607574] mt-1">
                      <MapPin className="w-3.5 h-3.5 text-[#164E47] flex-shrink-0" />
                      <span>{facility.location}</span>
                    </div>
                  </div>

                  {/* Status Indicator */}
                  <div className="flex flex-col items-end flex-shrink-0">
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 ${
                        facility.isOpen
                          ? 'bg-[#2E8B57]/15 text-[#2E8B57]'
                          : 'bg-[#607574]/15 text-[#607574]'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${facility.isOpen ? 'bg-[#2E8B57]' : 'bg-[#607574]'}`} />
                      {facility.isOpen ? t.openNow : t.closed}
                    </span>
                    <span className="text-[11px] text-[#607574] mt-1 font-semibold">
                      {facility.distanceKm} km • ~{facility.travelTimeMins} mins
                    </span>
                  </div>
                </div>

                {/* Services & Diagnostics Chips */}
                <div className="mt-4 space-y-2">
                  <div className="text-[11px] font-bold text-[#607574] uppercase tracking-wide">
                    {t.servicesOffered}:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {facility.services.map((svc, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] font-medium bg-[#F5F2EA] text-[#173B3A] px-2.5 py-1 rounded-md"
                      >
                        {svc}
                      </span>
                    ))}
                  </div>

                  <div className="text-[11px] font-bold text-[#607574] uppercase tracking-wide pt-1">
                    {t.diagnosticTestsAvailable}:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {facility.diagnosticTests.map((test, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] font-medium bg-[#1976D2]/10 text-[#1976D2] px-2.5 py-0.5 rounded-md"
                      >
                        {test}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Queue / Token Display Box (Section 24, 74) */}
                <div className="mt-5 bg-[#F5F2EA] rounded-xl p-3.5 border border-[#173B3A]/10">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#164E47]">
                      <Users className="w-4 h-4" />
                      <span>{t.queueStatus}</span>
                    </div>
                    <span className="text-[10px] font-semibold text-[#607574]">
                      {isOnline
                        ? `Live • Updated ${facility.lastUpdated}`
                        : `Offline cached • ${facility.lastUpdated}`}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                    <div className="bg-white p-2 rounded-lg border border-[#173B3A]/10">
                      <div className="text-[10px] font-bold text-[#607574] uppercase">{t.nowServing}</div>
                      <div className="text-xl font-black text-[#164E47]">
                        {facility.currentServingToken > 0 ? facility.currentServingToken : '—'}
                      </div>
                    </div>

                    <div className="bg-white p-2 rounded-lg border border-[#173B3A]/10">
                      <div className="text-[10px] font-bold text-[#607574] uppercase">{t.yourToken}</div>
                      <div className="text-xl font-black text-[#F9A01B]">
                        {userAppt?.tokenNumber || '—'}
                      </div>
                    </div>

                    <div className="bg-white p-2 rounded-lg border border-[#173B3A]/10">
                      <div className="text-[10px] font-bold text-[#607574] uppercase">{t.peopleAhead}</div>
                      <div className="text-xl font-black text-[#173B3A]">{peopleAhead}</div>
                    </div>

                    <div className="bg-white p-2 rounded-lg border border-[#173B3A]/10">
                      <div className="text-[10px] font-bold text-[#607574] uppercase">{t.estimatedWaitTime}</div>
                      <div className="text-sm font-black text-[#2E8B57] mt-1">
                        ~{facility.avgWaitMinutes} mins
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons (Section 23) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5 pt-3 border-t border-gray-100">
                <button
                  onClick={() => handleOpenGoogleMaps(facility)}
                  className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-white border border-[#164E47] text-[#164E47] hover:bg-[#F5F2EA] text-xs font-bold transition shadow-sm"
                >
                  <NavigationIcon className="w-4 h-4" />
                  <span>{t.navigateGoogleMaps}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
                </button>

                <button
                  onClick={() => onBookAppointmentForFacility(facility)}
                  className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[#F9A01B] hover:bg-[#e89416] text-[#173B3A] text-xs font-extrabold transition shadow-sm"
                >
                  <Calendar className="w-4 h-4" />
                  <span>{t.bookAppointmentBtn}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
      )}
    </div>
  );
};
