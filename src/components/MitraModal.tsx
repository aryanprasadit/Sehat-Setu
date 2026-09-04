import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  X,
  Send,
  Sparkles,
  ShieldAlert,
  Compass,
  HeartPulse,
  FolderLock,
  Calendar,
  Pill,
  HelpCircle,
  Activity,
} from 'lucide-react';
import { Language, UserAccount, UserRole } from '../types';
import { translations, getMitraWakeGreeting } from '../i18n/translations';
import { mitraEngine, MitraCommandResult } from '../services/mitraService';
import { storageService } from '../services/storageService';

interface MitraModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount | null;
  currentRole: UserRole;
  language: Language;
  onNavigate: (view: string) => void;
  onTriggerSOS: () => void;
  isOnline: boolean;
}

interface Message {
  sender: 'user' | 'mitra';
  text: string;
  timestamp: string;
  actionResult?: MitraCommandResult;
}

export const MitraModal: React.FC<MitraModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  currentRole,
  language,
  onNavigate,
  onTriggerSOS,
  isOnline,
}) => {
  const t = translations[language];
  const [micState, setMicState] = useState<'IDLE' | 'LISTENING' | 'PROCESSING' | 'SPEAKING'>('IDLE');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isSpeechSupported, setIsSpeechSupported] = useState(true);
  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isContinuousActive = useRef<boolean>(false);

  useEffect(() => {
    mitraEngine.setContext(language, currentRole, currentUser?.name || '');
  }, [language, currentRole, currentUser]);

  // Initial greeting when opened
  useEffect(() => {
    if (isOpen) {
      isContinuousActive.current = true;
      const initialGreeting = getMitraWakeGreeting(currentUser?.name || '', language);
      setMessages([
        {
          sender: 'mitra',
          text: initialGreeting,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);

      // Speak greeting and start continuous listen
      setMicState('SPEAKING');
      mitraEngine.speak(initialGreeting, () => {
        if (isContinuousActive.current) {
          startListening();
        } else {
          setMicState('IDLE');
        }
      });
    } else {
      isContinuousActive.current = false;
      mitraEngine.stopSpeaking();
      stopListening();
      setMicState('IDLE');
    }

    return () => {
      isContinuousActive.current = false;
      mitraEngine.stopSpeaking();
      stopListening();
    };
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, micState]);

  // Initialize Web Speech Recognition
  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSpeechSupported(false);
      setMicState('IDLE');
      return;
    }

    try {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }

      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.continuous = false;
      recognition.interimResults = false;

      if (language === 'hi') {
        recognition.lang = 'hi-IN';
      } else if (language === 'mr') {
        recognition.lang = 'mr-IN';
      } else {
        recognition.lang = 'en-IN';
      }

      recognition.onstart = () => {
        setMicState('LISTENING');
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          handleUserInput(transcript);
        }
      };

      recognition.onerror = () => {
        setMicState('IDLE');
      };

      recognition.onend = () => {
        // Handled in handleUserInput loop or idle
      };

      recognition.start();
    } catch (e) {
      setMicState('IDLE');
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch (e) {
        // ignore
      }
      recognitionRef.current = null;
    }
  };

  const handleUserInput = (text: string) => {
    stopListening();
    setMicState('PROCESSING');

    // Add user message
    const userMsg: Message = {
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);

    // Gather live or offline context for queue info
    const facilities = storageService.getFacilities();
    const activeFac = facilities[0];
    const appointments = currentUser ? storageService.getAppointments(currentUser.patientId) : [];
    const latestAppt = appointments[0];

    const offlineContext = {
      currentToken: activeFac?.currentServingToken || 14,
      userToken: latestAppt?.tokenNumber,
      waitMins: activeFac?.avgWaitMinutes || 18,
      lastUpdated: activeFac?.lastUpdated || '11:42 AM',
    };

    // Process Intent through Mitra Engine
    const result = mitraEngine.processIntent(text, offlineContext);

    // Prepare Mitra message
    const mitraMsg: Message = {
      sender: 'mitra',
      text: result.spokenText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      actionResult: result,
    };

    setMessages(prev => [...prev, mitraMsg]);

    // Handle Actions (Section 35, 76)
    if (result.action === 'TRIGGER_SOS') {
      onTriggerSOS();
    } else if (result.targetView) {
      onNavigate(result.targetView);
    }

    if (result.action === 'END_SESSION') {
      isContinuousActive.current = false;
      setMicState('SPEAKING');
      mitraEngine.speak(result.spokenText, () => {
        setMicState('IDLE');
        onClose();
      });
      return;
    }

    // Continuous Loop: Mitra speaks -> When Mitra finishes, Mic automatically turns back ON! (Section 30)
    setMicState('SPEAKING');
    mitraEngine.speak(result.spokenText, () => {
      if (isContinuousActive.current) {
        setMicState('LISTENING');
        startListening();
      } else {
        setMicState('IDLE');
      }
    });
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    const query = inputText;
    setInputText('');
    handleUserInput(query);
  };

  const handleEndSession = () => {
    isContinuousActive.current = false;
    mitraEngine.stopSpeaking();
    stopListening();
    setMicState('IDLE');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-[#164E47]/20 flex flex-col h-[85vh] max-h-[720px] overflow-hidden">
        {/* Modal Header */}
        <div className="bg-[#164E47] text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-[#F9A01B] flex items-center justify-center text-[#173B3A] font-black text-lg shadow-inner">
                म
              </div>
              {micState === 'LISTENING' && (
                <span className="absolute -inset-1 rounded-full border-2 border-white animate-ping opacity-75" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-lg text-white">Mitra / मित्र</h2>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#2E8B57] text-white font-semibold">
                  AI Care Companion
                </span>
              </div>
              <p className="text-xs text-[#F5F2EA]/80 font-medium">
                {language === 'mr' ? 'आरोग्य नेव्हिगेशन व व्हॉइस साथीदार' : language === 'hi' ? 'स्वास्थ्य नेविगेशन व वॉइस साथी' : 'Voice-First Healthcare Navigator'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleEndSession}
              className="px-3 py-1.5 rounded-lg bg-[#D92D20]/20 hover:bg-[#D92D20]/40 text-[#ff9f97] text-xs font-bold transition border border-[#D92D20]/40"
            >
              {t.endMitraSession}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition"
              aria-label="Close Mitra"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* State Indicator Banner */}
        <div className="px-5 py-2.5 bg-[#F5F2EA] border-b border-[#173B3A]/10 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 font-bold">
            {micState === 'LISTENING' && (
              <span className="flex items-center gap-1.5 text-[#2E8B57]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#2E8B57] animate-ping" />
                {t.mitraListening}
              </span>
            )}
            {micState === 'PROCESSING' && (
              <span className="flex items-center gap-1.5 text-[#1976D2]">
                <Activity className="w-4 h-4 animate-spin text-[#1976D2]" />
                {t.mitraProcessing}
              </span>
            )}
            {micState === 'SPEAKING' && (
              <span className="flex items-center gap-1.5 text-[#F9A01B]">
                <Volume2 className="w-4 h-4 animate-bounce text-[#F9A01B]" />
                {t.mitraSpeaking}
              </span>
            )}
            {micState === 'IDLE' && (
              <span className="text-[#607574]">
                {language === 'mr' ? 'माइक सुरू करण्यासाठी खालील बटण दाबा' : language === 'hi' ? 'माइक चालू करने के लिए नीचे बटन दबाएं' : 'Continuous listening paused'}
              </span>
            )}
          </div>
          <span className="text-[11px] text-[#607574] hidden sm:inline">
            {t.wakeWordHint}
          </span>
        </div>

        {/* Conversation Message List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-gradient-to-b from-[#F5F2EA]/40 to-white">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                  msg.sender === 'user'
                    ? 'bg-[#164E47] text-white rounded-br-none'
                    : 'bg-white text-[#173B3A] border border-[#173B3A]/10 rounded-bl-none'
                }`}
              >
                <div className="leading-relaxed whitespace-pre-wrap">{msg.text}</div>
                <div
                  className={`text-[10px] mt-1.5 flex items-center justify-end gap-1 ${
                    msg.sender === 'user' ? 'text-white/70' : 'text-[#607574]'
                  }`}
                >
                  <span>{msg.timestamp}</span>
                </div>
              </div>

              {/* Visual Action Confirmation Card (Section 29) */}
              {msg.actionResult?.targetView && (
                <div className="mt-2 bg-white border border-[#2E8B57]/30 rounded-xl p-2.5 text-xs text-[#173B3A] flex items-center gap-2 max-w-[85%] shadow-sm">
                  <Sparkles className="w-4 h-4 text-[#2E8B57] flex-shrink-0" />
                  <span className="font-semibold">
                    {language === 'mr' ? 'नेव्हिगेशन उघडले: ' : language === 'hi' ? 'नेविगेशन खोला गया: ' : 'Navigated: '}
                    {msg.actionResult.targetView.toUpperCase()}
                  </span>
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Voice Prompt Suggestions */}
        <div className="px-4 py-2 bg-[#F5F2EA]/60 border-t border-[#173B3A]/10 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="font-bold text-[#607574] text-[11px] whitespace-nowrap">
            {language === 'mr' ? 'सुचवलेले:' : language === 'hi' ? 'सुझाव:' : 'Quick:'}
          </span>
          <button
            onClick={() => handleUserInput(language === 'mr' ? 'टोकन काय सुरू आहे?' : language === 'hi' ? 'टोकन क्या चल रहा है?' : 'What token is going on?')}
            className="px-2.5 py-1 rounded-full bg-white border border-[#173B3A]/15 text-[#173B3A] hover:bg-[#164E47] hover:text-white transition whitespace-nowrap font-medium"
          >
            {language === 'mr' ? 'टोकन काय सुरू आहे?' : language === 'hi' ? 'टोकन क्या चल रहा है?' : 'Check Token'}
          </button>
          <button
            onClick={() => handleUserInput(language === 'mr' ? 'माझा heart rate check कर' : language === 'hi' ? 'मेरा हार्ट रेट चेक करो' : 'Check my heart rate')}
            className="px-2.5 py-1 rounded-full bg-white border border-[#173B3A]/15 text-[#173B3A] hover:bg-[#164E47] hover:text-white transition whitespace-nowrap font-medium"
          >
            {language === 'mr' ? 'हार्ट रेट तपास' : language === 'hi' ? 'हार्ट रेट चेक' : 'Hriday Scan'}
          </button>
          <button
            onClick={() => handleUserInput(language === 'mr' ? 'आरोग्य पासपोर्ट उघड' : language === 'hi' ? 'स्वास्थ्य पासपोर्ट खोलो' : 'Open Health Passport')}
            className="px-2.5 py-1 rounded-full bg-white border border-[#173B3A]/15 text-[#173B3A] hover:bg-[#164E47] hover:text-white transition whitespace-nowrap font-medium"
          >
            {language === 'mr' ? 'आरोग्य पासपोर्ट' : language === 'hi' ? 'स्वास्थ्य पासपोर्ट' : 'Health Passport'}
          </button>
          <button
            onClick={() => handleUserInput(language === 'mr' ? 'जवळचे रुग्णालय शोधून दे' : language === 'hi' ? 'नजदीकी अस्पताल बताओ' : 'Find nearby hospital')}
            className="px-2.5 py-1 rounded-full bg-white border border-[#173B3A]/15 text-[#173B3A] hover:bg-[#164E47] hover:text-white transition whitespace-nowrap font-medium"
          >
            {language === 'mr' ? 'जवळचे रुग्णालय' : language === 'hi' ? 'नजदीकी अस्पताल' : 'Find Hospital'}
          </button>
        </div>

        {/* Input Bar & Continuous Mic Controller */}
        <div className="p-3 sm:p-4 bg-white border-t border-[#173B3A]/15 flex items-center gap-2">
          {/* Continuous Mic Toggle Button */}
          <button
            onClick={() => {
              if (micState === 'LISTENING') {
                isContinuousActive.current = false;
                stopListening();
                setMicState('IDLE');
              } else {
                isContinuousActive.current = true;
                startListening();
              }
            }}
            className={`p-3 rounded-xl transition flex items-center justify-center ${
              micState === 'LISTENING'
                ? 'bg-[#D92D20] text-white shadow-lg animate-pulse'
                : 'bg-[#164E47] hover:bg-[#1F5C54] text-white shadow-md'
            }`}
            title={micState === 'LISTENING' ? 'Mute Microphone' : 'Start Speaking to Mitra'}
            aria-label="Microphone"
          >
            {micState === 'LISTENING' ? <Mic className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* Text Input Fallback */}
          <form onSubmit={handleManualSubmit} className="flex-1 flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                language === 'mr'
                  ? 'मित्राला काहीही विचारा किंवा बोला...'
                  : language === 'hi'
                  ? 'मित्र से कुछ भी पूछें या बोलें...'
                  : 'Ask Mitra anything or type your healthcare query...'
              }
              className="flex-1 bg-[#F5F2EA] border border-[#173B3A]/15 rounded-xl px-4 py-2.5 text-sm text-[#173B3A] placeholder-[#607574] focus:outline-none focus:ring-2 focus:ring-[#164E47]"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2.5 rounded-xl bg-[#F9A01B] hover:bg-[#e08c0f] text-[#173B3A] font-bold transition disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Send Message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export const MitraFloatingBar: React.FC<{
  onOpen: () => void;
  language: Language;
}> = ({ onOpen, language }) => {
  const t = translations[language];

  return (
    <div className="fixed bottom-6 right-6 z-30 flex items-center">
      <button
        onClick={onOpen}
        id="talk-to-mitra-floating-btn"
        className="flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-[#164E47] hover:bg-[#1F5C54] text-white font-extrabold text-sm sm:text-base shadow-2xl border-2 border-[#F9A01B] transition-transform active:scale-95 group"
      >
        <div className="w-7 h-7 rounded-full bg-[#F9A01B] text-[#173B3A] flex items-center justify-center font-black text-sm group-hover:rotate-12 transition">
          🎙️
        </div>
        <div className="text-left">
          <div className="leading-tight">{t.talkToMitra}</div>
          <div className="text-[10px] text-[#F5F2EA]/80 font-normal">
            {language === 'mr' ? 'मित्रा व्हॉइस साथीदार' : language === 'hi' ? 'मित्र वॉइस साथी' : 'Voice Care Companion'}
          </div>
        </div>
      </button>
    </div>
  );
};
