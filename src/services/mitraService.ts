import { Language, UserRole } from '../types';
import { translations } from '../i18n/translations';

export type MitraActionType =
  | 'NAVIGATE_HOME'
  | 'NAVIGATE_NAVIGATION'
  | 'NAVIGATE_TRIAGE'
  | 'NAVIGATE_HRIDAY_SCAN'
  | 'NAVIGATE_HEALTH_PASSPORT'
  | 'NAVIGATE_APPOINTMENTS'
  | 'NAVIGATE_MEDICINES'
  | 'NAVIGATE_FOLLOWUPS'
  | 'TRIGGER_SOS'
  | 'CHECK_QUEUE'
  | 'READ_MEDICINES'
  | 'OUT_OF_SCOPE'
  | 'MEDICAL_GUARDRAIL'
  | 'END_SESSION'
  | 'GENERAL_HELP';

export interface MitraCommandResult {
  action: MitraActionType;
  targetView?: string;
  spokenText: string;
  visualData?: any;
  confidence: number;
}

export class MitraEngine {
  private currentLanguage: Language = 'en';
  private currentUserRole: UserRole = 'patient';
  private currentUserName: string = '';

  setContext(lang: Language, role: UserRole, name: string) {
    this.currentLanguage = lang;
    this.currentUserRole = role;
    this.currentUserName = name;
  }

  // Detects if text contains emergency trigger
  isEmergencyIntent(input: string): boolean {
    const text = input.toLowerCase();
    const emergencyPatterns = [
      'sos', 'emergency', 'help me', 'save me', 'ambulance', 'call ambulance',
      'मदद करो', 'मुझे बचाओ', 'आपातकाल', 'एम्बुलेंस बुलाओ', 'बचाओ', 'मदद',
      'मदत करा', 'मला वाचवा', 'आपत्कालीन', 'रुग्णवाहिका बोलवा', 'वाचवा', 'मदत',
      'mala vachva', 'mujhe bachao', 'mala madat kara', 'madad karo', 'bachao',
      'rugnavahika bolva', 'ambulance bolva', 'severe pain'
    ];
    return emergencyPatterns.some(p => text.includes(p));
  }

  // Detects if text contains wake word
  isWakeWord(input: string): boolean {
    const text = input.toLowerCase();
    const wakePhrases = [
      'hey mitra', 'mitra', 'namaste mitra', 'hello mitra',
      'हे मित्रा', 'मित्रा', 'नमस्ते मित्रा', 'नमस्कार मित्रा',
      'हाय मित्रा', 'ऐक मित्रा', 'सुनो मित्र'
    ];
    return wakePhrases.some(p => text.includes(p));
  }

  // Detects session end command
  isEndSessionCommand(input: string): boolean {
    const text = input.toLowerCase();
    const endPhrases = [
      'stop', 'close mitra', 'end session', "i'm done", 'goodbye mitra', 'bye mitra',
      'मित्रा बंद करो', 'सत्र बंद करो', 'बस', 'अलविदा मित्रा', 'बंद करो',
      'मित्रा बंद कर', 'मित्रा बंद करा', 'सत्र बंद करा', 'निरोप मित्रा', 'थांब', 'थांबा'
    ];
    return endPhrases.some(p => text.includes(p));
  }

  // Detects out of scope tasks (homework, math, coding, entertainment)
  isOutOfScope(input: string): boolean {
    const text = input.toLowerCase();
    const outOfScopePatterns = [
      'homework', 'maths', 'math', 'calculate 2+', 'solve equation', 'essay',
      'write code', 'javascript', 'python', 'movie', 'joke', 'song',
      'गणित', 'गृहकार्य', 'होमवर्क', 'कविता', 'गाना', 'कोड लिखो',
      'गृहपाठ', 'निबंध', 'गाणे'
    ];
    return outOfScopePatterns.some(p => text.includes(p));
  }

  // Detects requests asking Mitra to diagnose disease or prescribe drugs
  isMedicalDiagnosisRequest(input: string): boolean {
    const text = input.toLowerCase();
    const diagPatterns = [
      'what disease do i have', 'diagnose me', 'which tablet should i take',
      'can i stop my medicine', 'change my dose', 'prescribe me',
      'मुझे कौन सी बीमारी है', 'कौन सी दवाई लूं', 'दवा बंद कर दूं',
      'मला कोणता आजार झाला आहे', 'कोणती गोळी घेऊ', 'औषध बंद करू का'
    ];
    return diagPatterns.some(p => text.includes(p));
  }

  // Process user speech or text input with role-aware and multilingual intent engine
  processIntent(rawInput: string, offlineContext?: { currentToken?: number; userToken?: number; waitMins?: number; lastUpdated?: string }): MitraCommandResult {
    const text = rawInput.trim();
    const t = translations[this.currentLanguage];
    const safeName = this.currentUserName ? ` ${this.currentUserName}` : '';

    // 1. Direct Emergency SOS check (Section 76 & Emergency Override)
    if (this.isEmergencyIntent(text)) {
      const responses = {
        en: "Emergency assistance is being activated. I'm getting your location.",
        hi: "आपातकालीन मदद शुरू कर रही हूँ। आपकी लोकेशन प्राप्त कर रही हूँ।",
        mr: "आपत्कालीन मदत सुरू करत आहे. तुमचे लोकेशन घेत आहे.",
      };
      return {
        action: 'TRIGGER_SOS',
        targetView: 'sos',
        spokenText: responses[this.currentLanguage],
        confidence: 0.99,
      };
    }

    // 2. End session check (Section 34)
    if (this.isEndSessionCommand(text)) {
      const responses = {
        en: `Goodbye${safeName}. Tap anytime if you need health assistance.`,
        hi: `अलविदा${safeName}। आवश्यकता होने पर मित्र को कभी भी पुकारें।`,
        mr: `निरोप${safeName}. आरोग्य मदतीसाठी मला कधीही हाक मारा.`,
      };
      return {
        action: 'END_SESSION',
        spokenText: responses[this.currentLanguage],
        confidence: 0.95,
      };
    }

    // 3. Out-of-scope guardrail (Section 40)
    if (this.isOutOfScope(text)) {
      const outOfScopeResponses = {
        en: "I'm here to help with healthcare and SehatSetu. I can't do homework or unrelated assignments, but I can help you with your healthcare needs.",
        hi: "मैं SehatSetu और स्वास्थ्य संबंधी मदद के लिए हूँ। मैं homework या दूसरे असंबंधित assignments नहीं कर सकता, लेकिन मैं आपकी healthcare से जुड़ी मदद ज़रूर कर सकता हूँ।",
        mr: "मी SehatSetu आणि आरोग्याशी संबंधित मदतीसाठी आहे. मी homework किंवा इतर असंबंधित assignments करू शकत नाही, पण आरोग्याशी संबंधित मदत नक्की करू शकतो.",
      };
      return {
        action: 'OUT_OF_SCOPE',
        spokenText: outOfScopeResponses[this.currentLanguage],
        confidence: 0.95,
      };
    }

    // 4. Chest pain safety guardrail
    const chestPainPatterns = [
      'chest pain', 'chest hurt', 'pain in chest', 'heart pain',
      'सीने में दर्द', 'छाती में दर्द', 'दिल में दर्द',
      'छातीत दुखत आहे', 'छातीत कळ', 'हृदयात दुखत आहे'
    ];
    if (chestPainPatterns.some(p => text.toLowerCase().includes(p))) {
      const chestResponses = {
        en: "Chest pain can have different causes, and I can't diagnose the cause. If the pain is severe, sudden, or accompanied by breathing difficulty, sweating, dizziness or pain spreading to the arm or jaw, please seek emergency medical help immediately. I can also start SOS or help you with digital triage.",
        hi: "सीने में दर्द के कई कारण हो सकते हैं, और मैं इसका निदान नहीं कर सकता। अगर दर्द तेज़, अचानक है, या सांस लेने में तकलीफ़, पसीना, चक्कर या हाथ-जबड़े में दर्द हो रहा है, तो तुरंत आपातकालीन मदद लें। मैं SOS शुरू कर सकता हूँ या डिजिटल ट्रायज में मदद कर सकता हूँ।",
        mr: "छातीत दुखण्याची विविध कारणे असू शकतात आणि मी याचे निदान करू शकत नाही. जर वेदना तीव्र, अचानक असेल, किंवा श्वास घेण्यास त्रास, घाम येणे, चक्कर किंवा हाताकडे दुखणे पसरत असेल, तर कृपया ताबडतोब आपत्कालीन मदत घ्या. मी SOS सुरू करू शकतो किंवा डिजिटल ट्रायज उघडू शकतो.",
      };
      return {
        action: 'MEDICAL_GUARDRAIL',
        targetView: 'triage',
        spokenText: chestResponses[this.currentLanguage],
        confidence: 0.98,
      };
    }

    // 5. Medical diagnosis guardrail (Section 41)
    if (this.isMedicalDiagnosisRequest(text)) {
      const guidance = {
        en: "I am an AI Care Companion and cannot diagnose illnesses or alter medication. Opening Digital Triage to assess check-up urgency.",
        hi: "मैं एक एआई साथी हूँ और रोग निदान या दवा तय नहीं कर सकता। चिकित्सीय मार्गदर्शन के लिए डिजिटल ट्रायज खोला जा रहा है।",
        mr: "मी एआई केअर साथीदार आहे, आजाराचे निदान किंवा औषध बदलू शकत नाही. तपासणीच्या सल्ल्यासाठी डिजिटल ट्रायज उघडत आहे.",
      };
      return {
        action: 'NAVIGATE_TRIAGE',
        targetView: 'triage',
        spokenText: guidance[this.currentLanguage],
        confidence: 0.95,
      };
    }

    const lower = text.toLowerCase();

    // 5. Hriday Scan Navigation (Section 21)
    const hridayKeywords = [
      'heart rate', 'hriday', 'rhiday', 'pulse', 'vitals', 'bpm',
      'हार्ट रेट', 'धड़कन', 'वाइटल्स', 'हृदय स्कैन',
      'हार्ट रेट चेक कर', 'नाडी तपास', 'नाडी', 'व्हायटल्स',
      'hriday scan', 'dhadkan check', 'heart rate check'
    ];
    if (hridayKeywords.some(k => lower.includes(k))) {
      const responses = {
        en: "Opening Hriday Scan. Please place your index finger gently over the rear camera to measure estimated heart rate.",
        hi: "हृदय स्कैन खोला जा रहा है। कृपया अनुमानित हृदय गति मापने के लिए कैमरे पर उंगली रखें।",
        mr: "हृदय स्कॅन उघडत आहे. अंदाजित हृदय गती मोजण्यासाठी कृपया कॅमेऱ्यावर बोट ठेवा.",
      };
      return {
        action: 'NAVIGATE_HRIDAY_SCAN',
        targetView: 'hriday',
        spokenText: responses[this.currentLanguage],
        confidence: 0.98,
      };
    }

    // 6. Healthcare Navigation (Section 22, 35)
    const navKeywords = [
      'hospital', 'phc', 'chc', 'clinic', 'facility', 'nearby', 'find hospital',
      'अस्पताल', 'दवाखाना', 'पीएचसी', 'सीएचसी', 'अस्पताल खोजो', 'रास्ता दिखाओ',
      'रुग्णालय', 'आरोग्य केंद्र', 'दवाखाना शोध', 'जवळचे रुग्णालय',
      'take me to healthcare', 'mala healthcare madhye gheun ja', 'mujhe healthcare par le jao',
      'hospital shodhun de', 'hospital dakhva', 'हॉस्पिटल दाखवा', 'हॉस्पिटल शोधून दे',
      'नक्की. तुमच्या जवळची हॉस्पिटल्स'
    ];
    if (navKeywords.some(k => lower.includes(k))) {
      const responses = {
        en: "Definitely. Finding nearby health facilities and navigation for you.",
        hi: "ज़रूर। आपके निकटतम अस्पताल, पीएचसी और स्वास्थ्य केंद्र खोजे जा रहे हैं।",
        mr: "नक्की. तुमच्या जवळची हॉस्पिटल्स, पीएचसी आणि आरोग्य केंद्र शोधत आहे.",
      };
      return {
        action: 'NAVIGATE_NAVIGATION',
        targetView: 'navigation',
        spokenText: responses[this.currentLanguage],
        confidence: 0.96,
      };
    }

    // 7. Health Passport & Prescriptions (Section 38, 42)
    const passportKeywords = [
      'health passport', 'passport', 'prescription', 'record', 'reports', 'lab test',
      'स्वास्थ्य पासपोर्ट', 'पासपोर्ट', 'पर्ची', 'दस्तावेज़', 'रिपोर्ट',
      'आरोग्य पासपोर्ट', 'प्रिस्क्रिप्शन', 'कागदपत्रे', 'तपासणी रिपोर्ट',
      'mazha health passport ughad', 'mera health passport dikhao',
      'माझं health passport उघड', 'आरोग्य पासपोर्ट उघडा', 'health passport'
    ];
    if (passportKeywords.some(k => lower.includes(k))) {
      const responses = {
        en: "Opening your Health Passport. You have full private control over your prescriptions, reports, and doctor access.",
        hi: "आपका स्वास्थ्य पासपोर्ट खोला जा रहा है। आपकी पर्चियों और रिपोर्ट पर केवल आपका नियंत्रण है।",
        mr: "तुमचा आरोग्य पासपोर्ट उघडत आहे. तुमच्या प्रिस्क्रिप्शन आणि रिपोर्टवर केवळ तुमचे नियंत्रण आहे.",
      };
      return {
        action: 'NAVIGATE_HEALTH_PASSPORT',
        targetView: 'passport',
        spokenText: responses[this.currentLanguage],
        confidence: 0.96,
      };
    }

    // 8. Appointments (Section 36)
    const apptKeywords = [
      'appointment', 'book doctor', 'schedule', 'doctor visit',
      'अपॉइंटमेंट', 'डॉक्टर को दिखाना है', 'अपॉइंटमेंट बुक करो', 'तारीख',
      'अपॉइंटमेंट', 'डॉक्टरांची भेट', 'भेट बुक कर', 'वेळ',
      'mala doctor la bhetaycha aahe', 'mujhe doctor ki appointment chahiye',
      'majhya appointments dakhva', 'माझ्या appointments दाखव',
      'teleconsultation', 'video call', 'video consultation'
    ];
    if (apptKeywords.some(k => lower.includes(k))) {
      const responses = {
        en: "Opening your Appointments. You can book an in-person clinic visit or a teleconsultation.",
        hi: "आपके अपॉइंटमेंट खोले जा रहे हैं। आप व्यक्तिगत परामर्श या टेलीकंसल्टेशन बुक कर सकते हैं।",
        mr: "तुमच्या भेटींचे वेळापत्रक उघडत आहे. तुम्ही क्लिनिक भेट किंवा टेलिकन्सल्टेशन बुक करू शकता.",
      };
      return {
        action: 'NAVIGATE_APPOINTMENTS',
        targetView: 'appointments',
        spokenText: responses[this.currentLanguage],
        confidence: 0.94,
      };
    }

    // 9. Queue & Token Query (Section 37)
    const queueKeywords = [
      'token', 'queue', 'serving', 'how many people', 'waiting time', 'wait time',
      'टोकन', 'कतार', 'कितने लोग आगे हैं', 'कितना समय लगेगा',
      'टोकन काय सुरू आहे', 'रांग', 'किती वेळ लागेल', 'माझ्या आधी किती लोक आहेत',
      'token kay suru aahe', 'kitna time lagega'
    ];
    if (queueKeywords.some(k => lower.includes(k))) {
      const serving = offlineContext?.currentToken ?? 14;
      const userTok = offlineContext?.userToken;
      const wait = offlineContext?.waitMins ?? 18;
      const updated = offlineContext?.lastUpdated ?? '11:42 AM';

      let spoken = '';
      if (this.currentLanguage === 'en') {
        spoken = userTok
          ? `Now serving token ${serving}. Your token is ${userTok} with approximately ${wait} minutes estimated wait. Information as of ${updated}.`
          : `Now serving token ${serving} with an estimated wait time of ${wait} minutes. Synchronized at ${updated}.`;
      } else if (this.currentLanguage === 'hi') {
        spoken = userTok
          ? `वर्तमान टोकन ${serving} चल रहा है। आपका टोकन ${userTok} है, अनुमानित प्रतीक्षा ${wait} मिनट है। समय: ${updated}।`
          : `वर्तमान में टोकन ${serving} चल रहा है। अनुमानित प्रतीक्षा समय लगभग ${wait} मिनट है। अपडेट: ${updated}।`;
      } else {
        spoken = userTok
          ? `सध्या टोकन ${serving} सुरू आहे. तुमचा टोकन ${userTok} असून अंदाजित प्रतीक्षा ${wait} मिनिटे आहे. वेळ: ${updated}.`
          : `सध्या टोकन ${serving} सुरू आहे. अंदाजित प्रतीक्षा वेळ सुमारे ${wait} मिनिटे आहे. माहिती: ${updated}.`;
      }

      return {
        action: 'CHECK_QUEUE',
        targetView: 'navigation',
        spokenText: spoken,
        confidence: 0.95,
      };
    }

    // 10. Medicines & Reminders (Section 39, 47)
    const medKeywords = [
      'medicine', 'medicines', 'tablet', 'dosage', 'reminder', 'remind me',
      'दवाई', 'दवाइयां', 'गोली', 'खुराक', 'याद दिलाओ',
      'औषधे', 'औषध', 'गोळ्या', 'मात्रा', 'आठवण करा'
    ];
    if (medKeywords.some(k => lower.includes(k))) {
      const responses = {
        en: "Opening your Medicines Schedule. You can review scheduled doses or set alerts.",
        hi: "आपकी दवाइयों की समय-सारिणी खोली जा रही है। आप खुराक देख सकते हैं व अनुस्मारक सेट कर सकते हैं।",
        mr: "तुमचे औषधांचे वेळापत्रक उघडत आहे. तुम्ही वेळा आणि आठवण तपासू शकता.",
      };
      return {
        action: 'NAVIGATE_MEDICINES',
        targetView: 'medicines',
        spokenText: responses[this.currentLanguage],
        confidence: 0.94,
      };
    }

    // 11. Digital Triage (Section 18)
    const triageKeywords = [
      'triage', 'symptom', 'fever', 'cough', 'cold', 'pain', 'sick', 'unwell',
      'ट्रायज', 'लक्षण', 'बुखार', 'खांसी', 'दर्द', 'तबीयत खराब',
      'ट्रायज', 'लक्षणे', 'ताप', 'खोकला', 'वेदना', 'बरे वाटत नाही'
    ];
    if (triageKeywords.some(k => lower.includes(k))) {
      const responses = {
        en: "Opening Digital Triage. Please describe your symptoms for routine versus immediate check-up guidance.",
        hi: "डिजिटल ट्रायज खोला जा रहा है। अपने लक्षण बताएं ताकि सामान्य या तत्काल जांच का मार्गदर्शन मिल सके।",
        mr: "डिजिटल ट्रायज उघडत आहे. कृपया लक्षणे सांगा जेणेकरून नियमित की तातडीच्या तपासणीची गरज आहे ते समजेल.",
      };
      return {
        action: 'NAVIGATE_TRIAGE',
        targetView: 'triage',
        spokenText: responses[this.currentLanguage],
        confidence: 0.93,
      };
    }

    // 12. Identity Query (Section 116)
    if (lower.includes('who are you') || lower.includes('तुम कौन हो') || lower.includes('तू कोण आहेस')) {
      const identityResponses = {
        en: "I'm Mitra, SehatSetu's AI care companion. I help you navigate SehatSetu and access healthcare-related services.",
        hi: "मैं मित्र हूँ, SehatSetu का AI care companion। मैं आपको SehatSetu और स्वास्थ्य संबंधी सेवाओं का उपयोग करने में मदद करता हूँ।",
        mr: "मी मित्र आहे, SehatSetu चा AI care companion. मी तुम्हाला SehatSetu आणि आरोग्याशी संबंधित सेवांचा वापर करण्यात मदत करतो.",
      };
      return {
        action: 'GENERAL_HELP',
        spokenText: identityResponses[this.currentLanguage],
        confidence: 0.98,
      };
    }

    // Default friendly assistance prompt
    const defaultHelp = {
      en: `I am here to help,${safeName}. You can ask to check queue tokens, find nearby hospitals, open Health Passport, measure heart rate in Hriday Scan, or trigger emergency SOS.`,
      hi: `मैं आपकी सेवा में उपस्थित हूँ,${safeName}। आप टोकन कतार पूछ सकते हैं, अस्पताल खोज सकते हैं, स्वास्थ्य पासपोर्ट खोल सकते हैं, Hriday Scan में धड़कन माप सकते हैं या SOS सक्रिय कर सकते हैं।`,
      mr: `मी तुमच्या मदतीसाठी सदैव तयार आहे,${safeName}. तुम्ही टोकन रांग विचारू शकता, रुग्णालय शोधू शकता, आरोग्य पासपोर्ट उघडू शकता, Hriday Scan मध्ये नाडी तपासू शकता किंवा SOS सुरू करू शकता.`,
    };

    return {
      action: 'GENERAL_HELP',
      spokenText: defaultHelp[this.currentLanguage],
      confidence: 0.8,
    };
  }

  // Text-To-Speech helper
  speak(text: string, onEnd?: () => void) {
    if (!('speechSynthesis' in window)) {
      if (onEnd) onEnd();
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Choose appropriate language code
    if (this.currentLanguage === 'hi') {
      utterance.lang = 'hi-IN';
    } else if (this.currentLanguage === 'mr') {
      utterance.lang = 'mr-IN';
    } else {
      utterance.lang = 'en-IN';
    }

    // Rate and pitch tuned for calm, compassionate healthcare tone
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    utterance.onend = () => {
      if (onEnd) onEnd();
    };

    utterance.onerror = () => {
      if (onEnd) onEnd();
    };

    window.speechSynthesis.speak(utterance);
  }

  stopSpeaking() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
}

export const mitraEngine = new MitraEngine();
