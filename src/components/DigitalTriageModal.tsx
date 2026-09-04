import React, { useState } from 'react';
import {
  Stethoscope,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  Calendar,
  X,
  ArrowRight,
  HelpCircle,
} from 'lucide-react';
import { Language, UserAccount } from '../types';
import { translations } from '../i18n/translations';

interface DigitalTriageModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount | null;
  language: Language;
  onBookAppointment: () => void;
  onOpenSOS: () => void;
}

export const DigitalTriageModal: React.FC<DigitalTriageModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  language,
  onBookAppointment,
  onOpenSOS,
}) => {
  const t = translations[language];

  const [symptomsText, setSymptomsText] = useState('');
  const [duration, setDuration] = useState<'1day' | 'fewDays' | 'weekPlus'>('fewDays');
  const [hasChestPain, setHasChestPain] = useState<boolean>(false);
  const [hasBreathingDifficulty, setHasBreathingDifficulty] = useState<boolean>(false);
  const [hasHighFever, setHasHighFever] = useState<boolean>(false);

  const [triageResult, setTriageResult] = useState<{
    urgency: 'ROUTINE' | 'IMMEDIATE' | 'EMERGENCY';
    title: string;
    advice: string;
  } | null>(null);

  const handleEvaluate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptomsText.trim()) return;

    // Critical Red Flags -> Emergency (Section 18, 41)
    if (hasChestPain || (hasBreathingDifficulty && hasHighFever)) {
      setTriageResult({
        urgency: 'EMERGENCY',
        title: t.urgencyEmergency,
        advice: t.emergencyAdvice,
      });
      return;
    }

    // High urgency symptoms
    const immediateKeywords = ['vomiting', 'severe', 'blood', 'dizzy', 'faint', 'fracture', 'burn', 'उल्टी', 'चक्कर', 'रक्त', 'तीव्र'];
    const isImmediate =
      hasBreathingDifficulty ||
      hasHighFever ||
      immediateKeywords.some(k => symptomsText.toLowerCase().includes(k));

    if (isImmediate) {
      setTriageResult({
        urgency: 'IMMEDIATE',
        title: t.urgencyImmediate,
        advice: t.immediateAdvice,
      });
    } else {
      setTriageResult({
        urgency: 'ROUTINE',
        title: t.urgencyRoutine,
        advice: t.routineAdvice,
      });
    }
  };

  const handleReset = () => {
    setTriageResult(null);
    setSymptomsText('');
    setHasChestPain(false);
    setHasBreathingDifficulty(false);
    setHasHighFever(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-[#164E47]/20 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-[#164E47] text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#2E8B57] flex items-center justify-center">
              <Stethoscope className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-extrabold text-base sm:text-lg text-white">{t.triageTitle}</h2>
              <p className="text-[11px] text-[#F5F2EA]/80 font-medium">{t.digitalTriageDesc}</p>
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
          {/* Disclaimer */}
          <div className="bg-[#F5F2EA] rounded-xl p-3 mb-5 border border-[#173B3A]/15 text-xs text-[#607574] leading-relaxed">
            <span className="font-bold text-[#173B3A]">
              {language === 'mr' ? 'वैद्यकीय सूचना: ' : language === 'hi' ? 'चिकित्सीय सूचना: ' : 'Clinical Notice: '}
            </span>
            {language === 'mr'
              ? 'डिजिटल ट्रायज केवळ तात्कालिकतेचे मार्गदर्शन प्रदान करतो, आजाराचे अंतिम निदान नाही. अत्यावश्यक स्थितीत तत्काळ वैद्यकीय मदत घ्या.'
              : language === 'hi'
              ? 'डिजिटल ट्रायज केवल तात्कालिकता का मार्गदर्शन देता है, यह निश्चित चिकित्सीय निदान नहीं है।'
              : 'Digital Triage provides urgency guidance only and does not constitute a definitive medical diagnosis. In critical situations, seek immediate hospital attention.'}
          </div>

          {!triageResult ? (
            <form onSubmit={handleEvaluate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#173B3A] mb-1.5">
                  {language === 'mr' ? 'तुमची लक्षणे सांगा:' : language === 'hi' ? 'अपने लक्षण विस्तार से बताएं:' : 'Describe your current symptoms:'}
                </label>
                <textarea
                  required
                  rows={3}
                  value={symptomsText}
                  onChange={(e) => setSymptomsText(e.target.value)}
                  placeholder={t.symptomsPlaceholder}
                  className="w-full bg-[#F5F2EA]/60 border border-[#173B3A]/20 rounded-xl p-3 text-xs sm:text-sm text-[#173B3A] focus:outline-none focus:ring-2 focus:ring-[#164E47]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#173B3A] mb-1.5">
                  {language === 'mr' ? 'त्रास किती दिवसांपासून आहे?' : language === 'hi' ? 'यह समस्या कब से है?' : 'How long have you had this issue?'}
                </label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setDuration('1day')}
                    className={`py-2 px-3 rounded-xl font-semibold border transition ${
                      duration === '1day' ? 'bg-[#164E47] text-white border-[#164E47]' : 'bg-white text-[#173B3A] border-gray-200'
                    }`}
                  >
                    &lt; 24 {language === 'mr' ? 'तास' : language === 'hi' ? 'घंटे' : 'Hours'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setDuration('fewDays')}
                    className={`py-2 px-3 rounded-xl font-semibold border transition ${
                      duration === 'fewDays' ? 'bg-[#164E47] text-white border-[#164E47]' : 'bg-white text-[#173B3A] border-gray-200'
                    }`}
                  >
                    2–4 {language === 'mr' ? 'दिवस' : language === 'hi' ? 'दिन' : 'Days'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setDuration('weekPlus')}
                    className={`py-2 px-3 rounded-xl font-semibold border transition ${
                      duration === 'weekPlus' ? 'bg-[#164E47] text-white border-[#164E47]' : 'bg-white text-[#173B3A] border-gray-200'
                    }`}
                  >
                    1+ {language === 'mr' ? 'आठवडा' : language === 'hi' ? 'सप्ताह' : 'Week'}
                  </button>
                </div>
              </div>

              {/* Red Flag Checklist */}
              <div className="space-y-2 pt-2">
                <label className="block text-xs font-bold text-[#173B3A]">
                  {language === 'mr' ? 'खालीलपैकी काही जाणवत आहे का?' : language === 'hi' ? 'क्या इनमें से कोई गंभीर लक्षण है?' : 'Do you have any of these critical symptoms?'}
                </label>
                
                <label className="flex items-center gap-2.5 p-2.5 rounded-xl border border-gray-200 hover:bg-[#F5F2EA] cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={hasChestPain}
                    onChange={(e) => setHasChestPain(e.target.checked)}
                    className="w-4 h-4 rounded text-[#D92D20] focus:ring-[#D92D20]"
                  />
                  <span className="font-semibold text-[#173B3A]">
                    {language === 'mr' ? 'छातीत तीव्र वेदना किंवा दाब (Chest Pain)' : language === 'hi' ? 'सीने में दर्द या भारीपन (Chest Pain)' : 'Chest Pain, Tightness, or Radiating Discomfort'}
                  </span>
                </label>

                <label className="flex items-center gap-2.5 p-2.5 rounded-xl border border-gray-200 hover:bg-[#F5F2EA] cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={hasBreathingDifficulty}
                    onChange={(e) => setHasBreathingDifficulty(e.target.checked)}
                    className="w-4 h-4 rounded text-[#164E47] focus:ring-[#164E47]"
                  />
                  <span className="font-medium text-[#173B3A]">
                    {language === 'mr' ? 'श्वास घेण्यास त्रास (Shortness of Breath)' : language === 'hi' ? 'सांस लेने में कठिनाई' : 'Severe Shortness of Breath / Wheezing'}
                  </span>
                </label>

                <label className="flex items-center gap-2.5 p-2.5 rounded-xl border border-gray-200 hover:bg-[#F5F2EA] cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={hasHighFever}
                    onChange={(e) => setHasHighFever(e.target.checked)}
                    className="w-4 h-4 rounded text-[#164E47] focus:ring-[#164E47]"
                  />
                  <span className="font-medium text-[#173B3A]">
                    {language === 'mr' ? 'अति तीव्र ताप (High Fever > 102°F)' : language === 'hi' ? 'तेज बुखार (> 102°F)' : 'High Fever (> 102°F / 39°C)'}
                  </span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-[#F9A01B] hover:bg-[#e69315] text-[#173B3A] font-extrabold text-sm shadow-md transition flex items-center justify-center gap-2 mt-4"
              >
                <span>{t.checkUrgencyBtn}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <div className="space-y-5 animate-in fade-in">
              <div
                className={`p-5 rounded-2xl border ${
                  triageResult.urgency === 'EMERGENCY'
                    ? 'bg-[#D92D20]/10 border-[#D92D20]/40 text-[#D92D20]'
                    : triageResult.urgency === 'IMMEDIATE'
                    ? 'bg-[#F9A01B]/15 border-[#F9A01B]/40 text-[#173B3A]'
                    : 'bg-[#2E8B57]/15 border-[#2E8B57]/40 text-[#164E47]'
                }`}
              >
                <div className="flex items-center gap-2 font-black text-base mb-2">
                  {triageResult.urgency === 'EMERGENCY' ? (
                    <ShieldAlert className="w-6 h-6 text-[#D92D20]" />
                  ) : triageResult.urgency === 'IMMEDIATE' ? (
                    <AlertTriangle className="w-6 h-6 text-[#F9A01B]" />
                  ) : (
                    <CheckCircle2 className="w-6 h-6 text-[#2E8B57]" />
                  )}
                  <span>{triageResult.title}</span>
                </div>
                <p className="text-xs sm:text-sm leading-relaxed font-medium">
                  {triageResult.advice}
                </p>
              </div>

              {/* Action Buttons based on Urgency */}
              <div className="space-y-2.5">
                {triageResult.urgency === 'EMERGENCY' ? (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenSOS();
                    }}
                    className="w-full py-3 px-4 rounded-xl bg-[#D92D20] hover:bg-[#b82216] text-white font-extrabold text-sm shadow-lg flex items-center justify-center gap-2"
                  >
                    <ShieldAlert className="w-5 h-5" />
                    <span>{language === 'mr' ? 'तातडीने आपत्कालीन SOS सुरू करा' : language === 'hi' ? 'तत्काल आपातकालीन SOS शुरू करें' : 'ACTIVATE EMERGENCY SOS NOW'}</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      onClose();
                      onBookAppointment();
                    }}
                    className="w-full py-3 px-4 rounded-xl bg-[#164E47] hover:bg-[#1F5C54] text-white font-extrabold text-sm shadow flex items-center justify-center gap-2"
                  >
                    <Calendar className="w-4 h-4 text-[#F9A01B]" />
                    <span>{t.bookAppointmentBtn}</span>
                  </button>
                )}

                <button
                  onClick={handleReset}
                  className="w-full py-2 px-4 rounded-xl border border-gray-300 text-[#607574] hover:bg-gray-50 text-xs font-bold transition"
                >
                  {language === 'mr' ? 'दुसऱ्या लक्षणांसाठी तपासा' : language === 'hi' ? 'अन्य लक्षणों की जांच करें' : 'Assess Different Symptoms'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
