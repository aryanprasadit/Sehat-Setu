import React, { useState } from 'react';
import {
  HeartHandshake,
  Smile,
  Meh,
  Frown,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';
import { Language, UserAccount } from '../types';
import { translations } from '../i18n/translations';
import { storageService } from '../services/storageService';

interface FollowUpViewProps {
  currentUser: UserAccount | null;
  language: Language;
  onBookAppointment: () => void;
  onOpenTriage: () => void;
}

export const FollowUpView: React.FC<FollowUpViewProps> = ({
  currentUser,
  language,
  onBookAppointment,
  onOpenTriage,
}) => {
  const t = translations[language];
  const [selectedFeeling, setSelectedFeeling] = useState<'BETTER' | 'SAME' | 'UNWELL' | null>(null);
  const [notes, setNotes] = useState('');
  const [isLogged, setIsLogged] = useState(false);

  const handleLogFollowUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFeeling || !currentUser) return;

    storageService.saveHealthRecord({
      id: 'rec-' + Date.now(),
      patientId: currentUser.patientId,
      title: `Daily Recovery Check-in (${selectedFeeling})`,
      type: 'MEDICAL_RECORD',
      date: new Date().toISOString().slice(0, 10),
      doctorOrFacility: 'Citizen Self-Check-in',
      notes: notes || `Patient reported feeling: ${selectedFeeling}`,
    });

    setIsLogged(true);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#173B3A]/10 shadow-sm text-center">
        <div className="w-14 h-14 rounded-2xl bg-[#2E8B57]/15 text-[#2E8B57] flex items-center justify-center mx-auto mb-3">
          <HeartHandshake className="w-7 h-7" />
        </div>

        <h1 className="text-xl sm:text-2xl font-black text-[#173B3A]">
          {t.howAreYouFeeling}
        </h1>
        <p className="text-xs sm:text-sm text-[#607574] mt-1 max-w-md mx-auto">
          {language === 'mr'
            ? 'तुमच्या उपचारांनंतर आज तुमची प्रकृती कशी आहे? कृपया नोंदवा.'
            : language === 'hi'
            ? 'इलाज के बाद आज आपकी तबीयत कैसी है? कृपया दर्ज करें।'
            : 'Track your recovery after clinical treatment or routine medication.'}
        </p>

        {!isLogged ? (
          <form onSubmit={handleLogFollowUp} className="mt-8 space-y-6">
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setSelectedFeeling('BETTER')}
                className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition ${
                  selectedFeeling === 'BETTER'
                    ? 'border-[#2E8B57] bg-[#2E8B57]/10 text-[#2E8B57] shadow-sm'
                    : 'border-gray-200 bg-[#F5F2EA]/40 text-[#607574] hover:bg-[#F5F2EA]'
                }`}
              >
                <Smile className="w-8 h-8" />
                <span className="text-xs font-bold">{t.feelingBetter}</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedFeeling('SAME')}
                className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition ${
                  selectedFeeling === 'SAME'
                    ? 'border-[#F9A01B] bg-[#F9A01B]/10 text-[#173B3A] shadow-sm'
                    : 'border-gray-200 bg-[#F5F2EA]/40 text-[#607574] hover:bg-[#F5F2EA]'
                }`}
              >
                <Meh className="w-8 h-8" />
                <span className="text-xs font-bold">{t.feelingSame}</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedFeeling('UNWELL')}
                className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition ${
                  selectedFeeling === 'UNWELL'
                    ? 'border-[#D92D20] bg-[#D92D20]/10 text-[#D92D20] shadow-sm'
                    : 'border-gray-200 bg-[#F5F2EA]/40 text-[#607574] hover:bg-[#F5F2EA]'
                }`}
              >
                <Frown className="w-8 h-8" />
                <span className="text-xs font-bold">{t.feelingUnwell}</span>
              </button>
            </div>

            <div>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any specific symptoms or comments for your doctor..."
                className="w-full bg-[#F5F2EA] border border-[#173B3A]/15 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[#173B3A] focus:outline-none focus:ring-2 focus:ring-[#164E47]"
              />
            </div>

            <button
              type="submit"
              disabled={!selectedFeeling}
              className="w-full py-3 px-4 rounded-xl bg-[#164E47] hover:bg-[#1F5C54] text-white font-extrabold text-sm shadow-md transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {t.logFollowUp}
            </button>
          </form>
        ) : (
          <div className="mt-6 space-y-5 animate-in fade-in">
            <div className="p-4 rounded-2xl bg-[#2E8B57]/15 border border-[#2E8B57]/30 text-[#164E47] flex items-center justify-center gap-2 text-sm font-bold">
              <CheckCircle2 className="w-5 h-5 text-[#2E8B57]" />
              <span>{t.followUpRecorded}</span>
            </div>

            {selectedFeeling === 'UNWELL' && (
              <div className="bg-[#D92D20]/10 border border-[#D92D20]/30 rounded-2xl p-5 text-left space-y-3">
                <div className="flex items-center gap-2 text-[#D92D20] font-bold text-sm">
                  <AlertTriangle className="w-5 h-5" />
                  <span>
                    {language === 'mr'
                      ? 'लक्षणे कायम असल्यास डॉक्टरांचा तातडीने सल्ला घ्या'
                      : language === 'hi'
                      ? 'यदि लक्षण बने रहें तो तत्काल परामर्श लें'
                      : 'Attention Recommended: Symptoms Persisting'}
                  </span>
                </div>
                <p className="text-xs text-[#173B3A] leading-relaxed font-medium">
                  {language === 'mr'
                    ? 'तुमची प्रकृती अस्वस्थ नोंदवली गेली आहे. तुम्ही त्वरित डिजिटल ट्रायज तपासू शकता किंवा डॉक्टरकडे पुन्हा अपॉइंटमेंट घेऊ शकता.'
                    : language === 'hi'
                    ? 'कृपया अपने स्वास्थ्य की डिजिटल जांच करें या पुनः डॉक्टर से परामर्श बुक करें।'
                    : 'Since you reported feeling unwell, we recommend booking an immediate doctor follow-up consultation or evaluating your symptoms via Digital Triage.'}
                </p>

                <div className="flex flex-col sm:flex-row gap-2 pt-1">
                  <button
                    onClick={onBookAppointment}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-[#164E47] text-white text-xs font-bold shadow flex items-center justify-center gap-1.5"
                  >
                    <Calendar className="w-4 h-4 text-[#F9A01B]" />
                    <span>Re-Book Doctor Consultation</span>
                  </button>

                  <button
                    onClick={onOpenTriage}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-white border border-[#164E47] text-[#164E47] text-xs font-bold hover:bg-[#F5F2EA] flex items-center justify-center gap-1.5"
                  >
                    <span>Check Digital Triage</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            <button
              onClick={() => {
                setIsLogged(false);
                setSelectedFeeling(null);
                setNotes('');
              }}
              className="text-xs font-bold text-[#607574] underline hover:text-[#173B3A]"
            >
              Log Another Check-in
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
