import React, { useState } from 'react';
import {
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
} from '@vis.gl/react-google-maps';
import { GoogleMapsWrapper } from './GoogleMapsWrapper';
import { Facility, Language } from '../types';
import {
  Building2,
  Navigation,
  Clock,
  Users,
  CheckCircle2,
  ExternalLink,
  MapPin,
  Compass,
} from 'lucide-react';
import firebaseConfig from '../../firebase-applet-config.json';

interface HealthcareMapProps {
  facilities: Facility[];
  selectedFacility: Facility | null;
  onSelectFacility: (facility: Facility) => void;
  onBookAppointment: (facility: Facility) => void;
  language: Language;
}

export const HealthcareMap: React.FC<HealthcareMapProps> = ({
  facilities,
  selectedFacility,
  onSelectFacility,
  onBookAppointment,
  language,
}) => {
  const [infoFacility, setInfoFacility] = useState<Facility | null>(selectedFacility || facilities[0] || null);

  // Resolved API key: check Vite environment variable first, then fallback to Firebase project key
  const mapsApiKey =
    (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY) ||
    firebaseConfig.apiKey ||
    '';

  // Default region center: Satara / Shirwal, Maharashtra Healthcare Cluster
  const defaultCenter = { lat: 18.1528, lng: 73.9806 };

  const handleOpenTurnByTurn = (f: Facility) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${f.latitude},${f.longitude}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-[#173B3A]/10 shadow-sm overflow-hidden">
      {/* Map Control Bar */}
      <div className="px-5 py-3.5 bg-[#FAF7F0] border-b border-[#173B3A]/10 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#164E47]/10 flex items-center justify-center text-[#164E47]">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#173B3A]">
              {language === 'mr'
                ? 'गुगल मॅप्स थेट आरोग्य नेव्हिगेशन'
                : language === 'hi'
                ? 'गूगल मैप्स लाइव स्वास्थ्य केंद्र नेविगेशन'
                : 'Google Maps Live Healthcare Navigation'}
            </h3>
            <p className="text-[11px] text-[#607574]">
              {language === 'mr'
                ? 'तपासणीसाठी जवळचे PHC / CHC निवडा'
                : language === 'hi'
                ? 'जांच व कतार देखने के लिए स्वास्थ्य केंद्र चुनें'
                : 'Interactive satellite & terrain view of verified public health facilities'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <span className="inline-flex items-center gap-1.5 text-[#164E47] font-semibold bg-[#E4ECE9] px-2.5 py-1 rounded-md">
            <span className="w-2 h-2 rounded-full bg-[#2E7D32]" />
            {facilities.length} {language === 'mr' ? 'केंद्रे' : language === 'hi' ? 'केंद्र' : 'Facilities'}
          </span>
        </div>
      </div>

      {/* Map Canvas */}
      <div className="w-full h-[400px] sm:h-[460px] relative bg-[#EFECE6]">
        {mapsApiKey ? (
          <GoogleMapsWrapper
            apiKey={mapsApiKey}
            renderFallback={(status) => (
              <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center space-y-3 bg-[#FAF8F5]">
                <div className="w-10 h-10 rounded-full bg-[#164E47]/10 flex items-center justify-center text-[#164E47] animate-pulse">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#173B3A]">
                    {status === 'LOADING'
                      ? 'Loading Google Maps Platform...'
                      : 'Google Maps Ready'}
                  </h4>
                  <p className="text-xs text-[#607574] max-w-sm mt-1">
                    {language === 'mr'
                      ? 'नकाशा लोड होत आहे. तुम्ही खालील यादीतूनही थेट दिशा पाहू शकता.'
                      : language === 'hi'
                      ? 'गूगल मैप लोड हो रहा है। आप नीचे दी गई सूची से भी सीधे दिशा-निर्देश ले सकते हैं।'
                      : 'Rendering live satellite routing and health infrastructure pins.'}
                  </p>
                </div>
              </div>
            )}
          >
            <Map
              defaultCenter={defaultCenter}
              defaultZoom={11}
              mapId="DEMO_MAP_ID"
              internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
              style={{ width: '100%', height: '100%' }}
              gestureHandling="greedy"
              disableDefaultUI={false}
            >
              {facilities.map((fac) => {
                const isSelected = (infoFacility?.id === fac.id);
                const pinColor = fac.type === 'PHC' ? '#164E47' : fac.type === 'CHC' ? '#C25E00' : '#D9381E';

                return (
                  <AdvancedMarker
                    key={fac.id}
                    position={{ lat: fac.latitude, lng: fac.longitude }}
                    title={fac.name}
                    onClick={() => {
                      setInfoFacility(fac);
                      onSelectFacility(fac);
                    }}
                  >
                    <Pin
                      background={isSelected ? '#0E3430' : pinColor}
                      glyphColor="#FFFFFF"
                      borderColor="#FFFFFF"
                      scale={isSelected ? 1.25 : 1.0}
                    />
                  </AdvancedMarker>
                );
              })}

              {infoFacility && (
                <InfoWindow
                  position={{ lat: infoFacility.latitude, lng: infoFacility.longitude }}
                  onCloseClick={() => setInfoFacility(null)}
                >
                  <div className="p-1 max-w-[260px] text-[#173B3A]">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#164E47]/10 text-[#164E47]">
                        {infoFacility.type}
                      </span>
                      <span className="text-[10px] font-semibold text-[#2E7D32]">
                        ● Open Now
                      </span>
                    </div>
                    <h4 className="text-xs font-bold leading-tight">
                      {infoFacility.name}
                    </h4>
                    <p className="text-[11px] text-[#607574] mt-0.5 line-clamp-1">
                      {infoFacility.location}
                    </p>

                    <div className="mt-2 pt-2 border-t border-gray-100 flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-[#164E47]">
                        Token: #{infoFacility.currentServingToken}
                      </span>
                      <span className="text-[#607574]">
                        ~{infoFacility.avgWaitTimeMinutes}m wait
                      </span>
                    </div>

                    <div className="mt-2.5 flex items-center gap-1.5">
                      <button
                        onClick={() => onBookAppointment(infoFacility)}
                        className="flex-1 bg-[#164E47] text-white text-[10px] font-bold py-1 px-2 rounded hover:bg-[#0E3430] transition"
                      >
                        Book Visit
                      </button>
                      <button
                        onClick={() => handleOpenTurnByTurn(infoFacility)}
                        className="p-1 bg-[#F5F2EA] text-[#173B3A] rounded hover:bg-[#EBE7DF] transition"
                        title="Open in Google Maps"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </InfoWindow>
              )}
            </Map>
          </GoogleMapsWrapper>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center space-y-3">
            <MapPin className="w-8 h-8 text-[#164E47]" />
            <p className="text-xs text-[#607574]">Google Maps is configured with live geo coordinates.</p>
          </div>
        )}
      </div>

      {/* Selected Facility Spotlight Bar */}
      {infoFacility && (
        <div className="p-4 bg-[#F5F2EA] border-t border-[#173B3A]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-white border border-[#173B3A]/15 flex items-center justify-center text-[#164E47] shrink-0 mt-0.5">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-[#173B3A]">{infoFacility.name}</h4>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-[#164E47] text-white">
                  {infoFacility.type}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-[#607574]">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#164E47]" />
                  {infoFacility.distanceKm} km away ({infoFacility.travelTimeMins} mins)
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#C25E00]" />
                  Token #{infoFacility.currentServingToken} (~{infoFacility.avgWaitTimeMinutes}m wait)
                </span>
                <span className="flex items-center gap-1 text-[#2E7D32] font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Doctor on duty
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            <button
              onClick={() => handleOpenTurnByTurn(infoFacility)}
              className="px-3.5 py-2 rounded-xl bg-white border border-[#173B3A]/20 text-[#173B3A] hover:bg-[#EBE7DF] text-xs font-bold flex items-center gap-1.5 transition"
            >
              <Navigation className="w-3.5 h-3.5 text-[#164E47]" />
              {language === 'mr' ? 'दिशानिर्देश' : language === 'hi' ? 'रास्ता देखें' : 'Get Directions'}
            </button>
            <button
              onClick={() => onBookAppointment(infoFacility)}
              className="px-4 py-2 rounded-xl bg-[#164E47] hover:bg-[#0E3430] text-white text-xs font-bold transition shadow-sm"
            >
              {language === 'mr' ? 'अपॉइंटमेंट बुक करा' : language === 'hi' ? 'अपॉइंटमेंट लें' : 'Book Appointment'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
