import { Language } from '../types';

export interface TranslationDictionary {
  appName: string;
  tagline: string;
  corePrinciple: string;
  
  // Navigation & Common
  home: string;
  navigation: string;
  passport: string;
  appointments: string;
  medicines: string;
  more: string;
  sos: string;
  emergency: string;
  talkToMitra: string;
  back: string;
  save: string;
  cancel: string;
  confirm: string;
  close: string;
  loading: string;
  search: string;
  online: string;
  offline: string;
  syncing: string;
  syncComplete: string;
  lastUpdated: string;
  logout: string;
  switchRole: string;
  language: string;
  retry: string;
  downloadExcelStore: string;
  viewCalendar: string;
  
  // Roles
  citizenRole: string;
  doctorRole: string;
  ashaRole: string;
  governmentRole: string;

  // Auth & Onboarding
  loginTitle: string;
  loginSub: string;
  createAccount: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  loginBtn: string;
  registerTitle: string;
  registerSub: string;
  personalDetailsTitle: string;
  fullName: string;
  age: string;
  gender: string;
  male: string;
  female: string;
  other: string;
  weight: string;
  district: string;
  healthProfileTitle: string;
  healthProfileSub: string;
  pastMedicalHistory: string;
  currentHealthIssue: string;
  heartRelatedHistory: string;
  previousHeartAttacks: string;
  numberOfHeartAttacks: string;
  currentMedicinesLabel: string;
  allergiesLabel: string;
  emergencyContactsTitle: string;
  emergencyContactsSub: string;
  addEmergencyContact: string;
  contactName: string;
  relationship: string;
  contactPhone: string;
  permissionsTitle: string;
  permissionsSub: string;
  giveAccessNow: string;
  later: string;
  micPermissionDesc: string;
  cameraPermissionDesc: string;
  storagePermissionDesc: string;
  locationPermissionDesc: string;
  
  // Patient Dashboard Features
  digitalTriage: string;
  digitalTriageDesc: string;
  hridayScan: string;
  hridayScanDesc: string;
  healthcareNavigation: string;
  healthcareNavigationDesc: string;
  healthPassport: string;
  healthPassportDesc: string;
  followUpCardTitle: string;
  medicineReminderCardTitle: string;
  upcomingAppointmentCardTitle: string;
  liveQueueCardTitle: string;
  
  // Hriday Scan
  hridayScanTitle: string;
  hridayScanInstruction: string;
  placeFingerInstruction: string;
  hridayDisclaimer: string;
  estimatedBpm: string;
  signalQuality: string;
  signalGood: string;
  signalWeak: string;
  signalDetecting: string;
  retakeScan: string;
  saveToPassport: string;
  shareWithDoctor: string;
  bpmSavedSuccess: string;
  unreliableReadingRejected: string;

  // Digital Triage
  triageTitle: string;
  triageSub: string;
  symptomsPlaceholder: string;
  checkUrgencyBtn: string;
  urgencyRoutine: string;
  urgencyImmediate: string;
  urgencyEmergency: string;
  routineAdvice: string;
  immediateAdvice: string;
  emergencyAdvice: string;

  // Healthcare Navigation & Facility
  findHealthcareTitle: string;
  facilityType: string;
  distance: string;
  approxTravelTime: string;
  openNow: string;
  closed: string;
  servicesOffered: string;
  diagnosticTestsAvailable: string;
  queueStatus: string;
  approxWait: string;
  navigateGoogleMaps: string;
  bookAppointmentBtn: string;
  viewQueueBtn: string;
  nowServing: string;
  yourToken: string;
  peopleAhead: string;
  estimatedWaitTime: string;

  // Appointment Booking
  selectFacility: string;
  selectDoctor: string;
  selectDate: string;
  selectTime: string;
  consultationType: string;
  inPerson: string;
  teleconsultation: string;
  bookNowBtn: string;
  appointmentConfirmed: string;
  appointmentPendingOffline: string;
  addToGoogleCalendar: string;

  // Health Passport & Records
  myRecords: string;
  uploadDocument: string;
  takePhoto: string;
  recordAccessTitle: string;
  recordAccessSub: string;
  doctorRequestedAccess: string;
  reasonForAccess: string;
  allowAccess: string;
  denyAccess: string;
  patientIdLabel: string;
  privateByDefault: string;

  // Medicines & Reminders
  medicinesTitle: string;
  addMedicine: string;
  dosage: string;
  frequency: string;
  timing: string;
  medicineDueNotice: string;
  timeToTakeMedicine: string;
  haveYouTakenMedicine: string;
  taken: string;
  skipped: string;
  remindMeLater: string;

  // Follow-up
  howAreYouFeeling: string;
  feelingFine: string;
  feelingUnwell: string;
  bookFollowupAppointment: string;
  followupLogged: string;

  // Emergency SOS
  sosActivated: string;
  sosAlertSent: string;
  locationStatus: string;
  smsStatus: string;
  callStatus: string;
  callingAmbulanceNotice: string;
  cancelSOS: string;

  // Doctor Dashboard
  doctorDashboardTitle: string;
  todayAppointments: string;
  waitingOutside: string;
  scheduled: string;
  inConsultation: string;
  completed: string;
  joinTeleconsultation: string;
  requestPatientRecords: string;
  enterPrescription: string;
  scheduleFollowUpDoctor: string;
  verificationBadgeVerified: string;
  verificationBadgePending: string;
  verificationNotice: string;

  // ASHA Dashboard
  ashaDashboardTitle: string;
  assignedCitizens: string;
  visitsCompleted: string;
  pendingOutreach: string;
  followupsDueToday: string;
  callCitizen: string;
  visitCitizen: string;
  markTaskComplete: string;
  addOutreachNote: string;

  // Government Dashboard
  govtDashboardTitle: string;
  publicHealthMonitoring: string;
  providerVerification: string;
  facilityUtilization: string;
  dailyDistrictOpd: string;
  opdVsPreviousWeek: string;
  avgOpdWaitTime: string;
  referralCompletion: string;
  serviceUtilization: string;
  verifiedProviders: string;
  reviewCredentials: string;
  approveDoctor: string;
  rejectDoctor: string;
  inspectChartData: string;
  accessibilityNeedsSummary: string;

  // Mitra Companion
  mitraGreeting: string;
  mitraHelpPrompt: string;
  mitraListening: string;
  mitraProcessing: string;
  mitraSpeaking: string;
  mitraOutOfScope: string;
  mitraMedicalDisclaimer: string;
  mitraDirectSosAlert: string;
  wakeWordHint: string;
  endMitraSession: string;
  
  // Status Labels (Color + Icon + Text)
  statusVerified: string;
  statusPending: string;
  statusEmergency: string;
  statusError: string;
  statusInfo: string;
  statusAvailable: string;
}

export const translations: Record<Language, TranslationDictionary> = {
  en: {
    appName: "SEHATSETU",
    tagline: "Healthcare Without Barriers.",
    corePrinciple: "SehatSetu adapts to the user, not the other way around.",
    
    home: "Home",
    navigation: "Navigation",
    passport: "Health Passport",
    appointments: "Appointments",
    medicines: "Medicines",
    more: "More",
    sos: "SOS",
    emergency: "EMERGENCY SOS",
    talkToMitra: "Talk to Mitra",
    back: "Back",
    save: "Save",
    cancel: "Cancel",
    confirm: "Confirm",
    close: "Close",
    loading: "Loading...",
    search: "Search facilities, doctors, records...",
    online: "Online",
    offline: "Offline Mode",
    syncing: "Syncing...",
    syncComplete: "Sync Complete",
    lastUpdated: "Last updated",
    logout: "Log Out",
    switchRole: "Switch Role",
    language: "Language",
    retry: "Try Again",
    downloadExcelStore: "Download Excel Prototype Store",
    viewCalendar: "Google Calendar Sync",

    citizenRole: "Citizen / Patient",
    doctorRole: "Doctor / Healthcare Facility",
    ashaRole: "ASHA / Frontline Worker",
    governmentRole: "Government Health Authority",

    loginTitle: "Log In to SehatSetu",
    loginSub: "Enter your phone number and password to access your healthcare portal",
    createAccount: "Create New Account",
    phoneNumber: "Phone Number",
    password: "Password",
    confirmPassword: "Confirm Password",
    loginBtn: "Log In",
    registerTitle: "New Citizen Registration",
    registerSub: "Create your secure healthcare account. No demo accounts.",
    personalDetailsTitle: "Personal Details",
    fullName: "Full Name",
    age: "Age",
    gender: "Gender",
    male: "Male",
    female: "Female",
    other: "Other",
    weight: "Weight (kg)",
    district: "District / City",
    healthProfileTitle: "Personal Health Profile",
    healthProfileSub: "Help SehatSetu adapt healthcare services to your medical background",
    pastMedicalHistory: "Past Medical History (e.g. Diabetes, Asthma)",
    currentHealthIssue: "Current Health Issue or Symptoms",
    heartRelatedHistory: "Any history of heart issues?",
    previousHeartAttacks: "Have you ever had a heart attack?",
    numberOfHeartAttacks: "Number of previous heart attacks",
    currentMedicinesLabel: "Current Medicines (comma separated)",
    allergiesLabel: "Known Allergies (comma separated)",
    emergencyContactsTitle: "Emergency Contacts",
    emergencyContactsSub: "Add family, friends or doctors who can be contacted in case of an emergency.",
    addEmergencyContact: "Add Emergency Contact",
    contactName: "Contact Name",
    relationship: "Relationship (e.g., Son, Sister, Doctor)",
    contactPhone: "Phone Number",
    permissionsTitle: "Device Access Permissions",
    permissionsSub: "Enable device capabilities to unlock voice navigation, Hriday Scan, and medical document scanning",
    giveAccessNow: "GIVE ACCESS NOW",
    later: "LATER",
    micPermissionDesc: "Required for Mitra Voice Care Companion",
    cameraPermissionDesc: "Required for Hriday Scan and Document Capture",
    storagePermissionDesc: "Required for storing your private Health Passport documents",
    locationPermissionDesc: "Required for Google Maps and Healthcare Navigation",

    digitalTriage: "Digital Triage",
    digitalTriageDesc: "Describe symptoms to get immediate vs routine check-up guidance",
    hridayScan: "Hriday Scan",
    hridayScanDesc: "Camera-based estimated heart-rate measurement and vitals assessment",
    healthcareNavigation: "Healthcare Navigation",
    healthcareNavigationDesc: "Locate nearby PHC, CHC, and Rural Hospitals with live queue times",
    healthPassport: "Health Passport",
    healthPassportDesc: "Patient-controlled secure digital prescriptions, reports, and doctor access",
    followUpCardTitle: "Next Follow-up",
    medicineReminderCardTitle: "Medicine Reminder",
    upcomingAppointmentCardTitle: "Upcoming Appointment",
    liveQueueCardTitle: "Live Facility Queue",

    hridayScanTitle: "Hriday Scan",
    hridayScanInstruction: "Place your index finger gently over the rear camera lens until the frame turns red.",
    placeFingerInstruction: "Measuring blood volume pulse variation via camera sensor...",
    hridayDisclaimer: "Hriday Scan provides an estimated heart-rate reading and is not a substitute for clinical measurement. Measurement is an estimate and should not be treated as a medical diagnosis.",
    estimatedBpm: "Estimated Heart Rate",
    signalQuality: "Signal Quality",
    signalGood: "Good Signal",
    signalWeak: "Weak Signal",
    signalDetecting: "Detecting Pulse...",
    retakeScan: "Retake Scan",
    saveToPassport: "Save to Health Passport",
    shareWithDoctor: "Share with Doctor",
    bpmSavedSuccess: "Heart rate reading successfully saved to your Health Passport.",
    unreliableReadingRejected: "Reading was unstable and rejected to prevent inaccurate vital recording. Please try again with steady finger contact.",

    triageTitle: "Digital Health Triage",
    triageSub: "Answer questions about your symptoms to determine urgency guidance.",
    symptomsPlaceholder: "E.g., I have had a severe cough and mild fever for 2 days...",
    checkUrgencyBtn: "Assess Urgency Guidance",
    urgencyRoutine: "Routine Check-up Recommended",
    urgencyImmediate: "Immediate Medical Check-up Recommended",
    urgencyEmergency: "EMERGENCY: Immediate Hospital Visit or SOS Required",
    routineAdvice: "Your symptoms indicate a routine condition. Schedule an appointment at your local PHC or CHC within 1-2 days.",
    immediateAdvice: "Your symptoms indicate prompt clinical attention is advised. Please visit the nearest healthcare facility or start a teleconsultation today.",
    emergencyAdvice: "Critical warning signs detected. Please activate Emergency SOS or proceed to the nearest emergency department immediately.",

    findHealthcareTitle: "Nearby Healthcare Facilities",
    facilityType: "Facility Type",
    distance: "Distance",
    approxTravelTime: "Est. Travel Time",
    openNow: "Open Now",
    closed: "Currently Closed",
    servicesOffered: "Available Services",
    diagnosticTestsAvailable: "Diagnostic Tests",
    queueStatus: "Live Queue Status",
    approxWait: "Approx. Wait",
    navigateGoogleMaps: "Open in Google Maps",
    bookAppointmentBtn: "Book Appointment",
    viewQueueBtn: "View Token Queue",
    nowServing: "NOW SERVING",
    yourToken: "YOUR TOKEN",
    peopleAhead: "PEOPLE AHEAD",
    estimatedWaitTime: "ESTIMATED WAIT",

    selectFacility: "Select Healthcare Facility",
    selectDoctor: "Select Doctor / Specialist",
    selectDate: "Select Date",
    selectTime: "Select Slot",
    consultationType: "Consultation Type",
    inPerson: "In-Person Clinic Visit",
    teleconsultation: "Teleconsultation (Video/Audio/Chat)",
    bookNowBtn: "Confirm Appointment Booking",
    appointmentConfirmed: "Appointment Confirmed",
    appointmentPendingOffline: "Saved Locally - Pending Online Confirmation",
    addToGoogleCalendar: "Sync to Google Calendar",

    myRecords: "My Medical Records",
    uploadDocument: "Upload Document",
    takePhoto: "Take Camera Photo",
    recordAccessTitle: "Doctor & Facility Record Access",
    recordAccessSub: "You have complete control over who can view your medical records.",
    doctorRequestedAccess: "Doctor requested access to your records",
    reasonForAccess: "Consultation Reason",
    allowAccess: "ALLOW ACCESS",
    denyAccess: "DENY ACCESS",
    patientIdLabel: "Unique Patient ID",
    privateByDefault: "Private by default. Only you can grant access.",

    medicinesTitle: "Medicines & Schedule",
    addMedicine: "Add Medicine",
    dosage: "Dosage",
    frequency: "Frequency",
    timing: "Timing",
    medicineDueNotice: "Your medicine is due in 5 minutes.",
    timeToTakeMedicine: "It is time to take your scheduled medicine.",
    haveYouTakenMedicine: "Have you taken your medicine?",
    taken: "TAKEN",
    skipped: "SKIPPED",
    remindMeLater: "REMIND ME LATER",

    howAreYouFeeling: "How are you feeling today?",
    feelingFine: "I am feeling better / Fine",
    feelingUnwell: "I am still unwell / Need Doctor",
    bookFollowupAppointment: "Schedule Follow-up Consultation",
    followupLogged: "Health response logged successfully.",

    sosActivated: "EMERGENCY SOS ACTIVATED",
    sosAlertSent: "Emergency alert dispatched to saved emergency contacts and local dispatch.",
    locationStatus: "GPS Coordinates",
    smsStatus: "Emergency SMS Alert",
    callStatus: "Emergency Dispatch Call",
    callingAmbulanceNotice: "Dialing 108 Emergency Medical Services...",
    cancelSOS: "Cancel Emergency Alarm",

    doctorDashboardTitle: "Doctor & Facility Clinical Console",
    todayAppointments: "Today's Appointments",
    waitingOutside: "Waiting Outside",
    scheduled: "Scheduled",
    inConsultation: "In Consultation",
    completed: "Completed",
    joinTeleconsultation: "Start Teleconsultation",
    requestPatientRecords: "Request Patient Health Records",
    enterPrescription: "Write Digital Prescription",
    scheduleFollowUpDoctor: "Order Patient Follow-Up",
    verificationBadgeVerified: "Government Verified Provider",
    verificationBadgePending: "Credential Review Pending",
    verificationNotice: "Only government-approved verified practitioners receive full clinical authority.",

    ashaDashboardTitle: "ASHA / Frontline Health Portal",
    assignedCitizens: "Assigned Citizens",
    visitsCompleted: "Home Visits Done",
    pendingOutreach: "Pending Outreach",
    followupsDueToday: "Follow-ups Due Today",
    callCitizen: "Call Citizen",
    visitCitizen: "Mark Visit",
    markTaskComplete: "Mark Task Complete",
    addOutreachNote: "Add Field Outreach Note",

    govtDashboardTitle: "Government Public Health Surveillance Console",
    publicHealthMonitoring: "Public Health Monitoring",
    providerVerification: "Provider Credential Verification",
    facilityUtilization: "District Facility Utilization",
    dailyDistrictOpd: "Daily District OPD Volume",
    opdVsPreviousWeek: "OPD Volume vs. Previous Week",
    avgOpdWaitTime: "Average OPD Wait Time (Minutes)",
    referralCompletion: "Referral Continuity & Completion",
    serviceUtilization: "Clinical Service Utilization Breakdown",
    verifiedProviders: "Doctor & Practitioner Verification Status",
    reviewCredentials: "Review Credentials & Certificate",
    approveDoctor: "Approve Credentials",
    rejectDoctor: "Reject Credentials",
    inspectChartData: "Inspect Aggregated Dataset",
    accessibilityNeedsSummary: "Accessibility & Resource Demand",

    mitraGreeting: "How are you doing? How can I help you today?",
    mitraHelpPrompt: "I can check queue tokens, guide you to nearby PHCs, book appointments, open your Health Passport, or check your heart rate.",
    mitraListening: "Mitra is listening...",
    mitraProcessing: "Mitra is processing...",
    mitraSpeaking: "Mitra is speaking...",
    mitraOutOfScope: "I'm designed to help with SehatSetu and healthcare-related needs, so I can't help with that.",
    mitraMedicalDisclaimer: "I am an AI Care Companion and not a doctor. I provide guidance and navigation, but cannot diagnose or prescribe medicines.",
    mitraDirectSosAlert: "Emergency assistance has been activated.",
    wakeWordHint: "Speak 'Hey Mitra', 'Mitra', or tap the microphone.",
    endMitraSession: "End Session",

    statusVerified: "Verified",
    statusPending: "Pending",
    statusEmergency: "Emergency",
    statusError: "Error",
    statusInfo: "Information",
    statusAvailable: "Available",
  },
  hi: {
    appName: "SEHATSETU",
    tagline: "बाधाओं के बिना स्वास्थ्य सेवा।",
    corePrinciple: "SehatSetu उपयोगकर्ता के अनुसार ढलता है, उपयोगकर्ता इसके अनुसार नहीं।",

    home: "मुख्य पृष्ठ",
    navigation: "अस्पताल खोजें",
    passport: "स्वास्थ्य पासपोर्ट",
    appointments: "अपॉइंटमेंट",
    medicines: "दवाइयाँ",
    more: "अन्य",
    sos: "आपातकालीन SOS",
    emergency: "आपातकालीन SOS",
    talkToMitra: "मित्र से बात करें",
    back: "वापस",
    save: "सुरक्षित करें",
    cancel: "रद्द करें",
    confirm: "पुष्टि करें",
    close: "बंद करें",
    loading: "लोड हो रहा है...",
    search: "अस्पताल, डॉक्टर या रिपोर्ट खोजें...",
    online: "ऑनलाइन",
    offline: "ऑफ़लाइन मोड",
    syncing: "सिंक हो रहा है...",
    syncComplete: "सिंक संपन्न",
    lastUpdated: "अंतिम अपडेट",
    logout: "लॉग आउट",
    switchRole: "भूमिका बदलें",
    language: "भाषा (Language)",
    retry: "पुनः प्रयास करें",
    downloadExcelStore: "एक्सेल डेटा स्टोर डाउनलोड करें",
    viewCalendar: "गूगल कैलेंडर सिंक",

    citizenRole: "नागरिक / मरीज़",
    doctorRole: "डॉक्टर / स्वास्थ्य केंद्र",
    ashaRole: "आशा / स्वास्थ्य कार्यकर्ता",
    governmentRole: "सरकारी स्वास्थ्य प्राधिकरण",

    loginTitle: "SehatSetu में लॉग इन करें",
    loginSub: "अपने स्वास्थ्य पोर्टल तक पहुँचने के लिए अपना फ़ोन नंबर और पासवर्ड दर्ज करें",
    createAccount: "नया खाता बनाएं",
    phoneNumber: "फ़ोन नंबर",
    password: "पासवर्ड",
    confirmPassword: "पासवर्ड की पुष्टि करें",
    loginBtn: "लॉग इन करें",
    registerTitle: "नया नागरिक पंजीकरण",
    registerSub: "अपना सुरक्षित स्वास्थ्य खाता बनाएं। कोई डेमो खाता नहीं।",
    personalDetailsTitle: "व्यक्तिगत विवरण",
    fullName: "पूरा नाम",
    age: "उम्र",
    gender: "लिंग",
    male: "पुरुष",
    female: "महिला",
    other: "अन्य",
    weight: "वजन (किग्रा)",
    district: "जिला / शहर",
    healthProfileTitle: "व्यक्तिगत स्वास्थ्य प्रोफ़ाइल",
    healthProfileSub: "SehatSetu को आपकी स्वास्थ्य पृष्ठभूमि के अनुसार सेवाएं देने में मदद करें",
    pastMedicalHistory: "पिछला चिकित्सीय इतिहास (उदा. मधुमेह, अस्थमा)",
    currentHealthIssue: "वर्तमान स्वास्थ्य समस्या या लक्षण",
    heartRelatedHistory: "क्या हृदय संबंधी कोई समस्या रही है?",
    previousHeartAttacks: "क्या कभी दिल का दौरा पड़ा है?",
    numberOfHeartAttacks: "पूर्व में पड़े दिल के दौरों की संख्या",
    currentMedicinesLabel: "वर्तमान दवाइयां (अल्पविराम से अलग करें)",
    allergiesLabel: "ज्ञात एलर्जी (अल्पविराम से अलग करें)",
    emergencyContactsTitle: "आपातकालीन संपर्क",
    emergencyContactsSub: "परिवार, दोस्तों या डॉक्टरों को जोड़ें जिन्हें आपात स्थिति में संपर्क किया जा सके।",
    addEmergencyContact: "आपातकालीन संपर्क जोड़ें",
    contactName: "संपर्क का नाम",
    relationship: "संबंध (उदा. बेटा, बहन, डॉक्टर)",
    contactPhone: "फ़ोन नंबर",
    permissionsTitle: "डिवाइस अनुमति सेटअप",
    permissionsSub: "वॉइस नेविगेशन, हृदय स्कैन और दस्तावेज़ कैप्चर के लिए अनुमतियाँ सक्षम करें",
    giveAccessNow: "अभी अनुमति दें",
    later: "बाद में",
    micPermissionDesc: "मित्र वॉइस केयर कंपेनियन के लिए आवश्यक",
    cameraPermissionDesc: "हृदय स्कैन और दस्तावेज़ कैप्चर के लिए आवश्यक",
    storagePermissionDesc: "आपके निजी स्वास्थ्य पासपोर्ट के सुरक्षित भंडारण के लिए आवश्यक",
    locationPermissionDesc: "गूगल मैप्स और स्वास्थ्य केंद्र नेविगेशन के लिए आवश्यक",

    digitalTriage: "डिजिटल ट्रायज",
    digitalTriageDesc: "लक्षण बताएं और जानें कि सामान्य या तत्काल जांच की आवश्यकता है",
    hridayScan: "Hriday Scan",
    hridayScanDesc: "कैमरा-आधारित अनुमानित हृदय गति माप और वाइटल्स जांच",
    healthcareNavigation: "स्वास्थ्य केंद्र नेविगेशन",
    healthcareNavigationDesc: "निकटतम पीएचसी, सीएचसी व अस्पतालों की दूरी व टोकन कतार देखें",
    healthPassport: "स्वास्थ्य पासपोर्ट",
    healthPassportDesc: "मरीज़-नियंत्रित सुरक्षित डिजिटल पर्चियां, रिपोर्ट और डॉक्टर अनुमति",
    followUpCardTitle: "अगला फॉलो-अप",
    medicineReminderCardTitle: "दवा अनुस्मारक",
    upcomingAppointmentCardTitle: "आगामी अपॉइंटमेंट",
    liveQueueCardTitle: "अस्पताल लाइव कतार",

    hridayScanTitle: "Hriday Scan",
    hridayScanInstruction: "अपनी तर्जनी उंगली को पीछे के कैमरा लेंस पर हल्के से रखें जब तक स्क्रीन लाल न हो जाए।",
    placeFingerInstruction: "कैमरा सेंसर द्वारा पल्स तरंगों का मापन किया जा रहा है...",
    hridayDisclaimer: "Rhiday Scan provides an estimated heart-rate reading and is not a substitute for clinical measurement. Measurement is an estimate and should not be treated as a medical diagnosis.",
    estimatedBpm: "अनुमानित हृदय गति",
    signalQuality: "सिग्नल गुणवत्ता",
    signalGood: "अच्छा सिग्नल",
    signalWeak: "कमज़ोर सिग्नल",
    signalDetecting: "धड़कन खोजी जा रही है...",
    retakeScan: "पुनः स्कैन करें",
    saveToPassport: "स्वास्थ्य पासपोर्ट में सहेजें",
    shareWithDoctor: "डॉक्टर के साथ साझा करें",
    bpmSavedSuccess: "हृदय गति आपके स्वास्थ्य पासपोर्ट में सुरक्षित रूप से दर्ज कर ली गई है।",
    unreliableReadingRejected: "गलत रीडिंग से बचने के लिए अस्थिर सिग्नल को अस्वीकार कर दिया गया। कृपया उंगली स्थिर रखकर पुनः प्रयास करें।",

    triageTitle: "डिजिटल स्वास्थ्य ट्रायज",
    triageSub: "लक्षणों के आधार पर तात्कालिकता मार्गदर्शन प्राप्त करें।",
    symptomsPlaceholder: "उदा., मुझे 2 दिन से तेज़ खाँसी और हल्का बुखार है...",
    checkUrgencyBtn: "तात्कालिकता मार्गदर्शन प्राप्त करें",
    urgencyRoutine: "सामान्य जांच की अनुशंसा",
    urgencyImmediate: "तत्काल चिकित्सीय जांच आवश्यक",
    urgencyEmergency: "आपातकाल: तुरंत अस्पताल जाएं या SOS दबाएं",
    routineAdvice: "आपके लक्षण सामान्य स्थिति दर्शाते हैं। अगले 1-2 दिनों में नजदीकी पीएचसी/सीएचसी में अपॉइंटमेंट लें।",
    immediateAdvice: "लक्षणों पर शीघ्र ध्यान देने की आवश्यकता है। कृपया आज ही नजदीकी केंद्र पर जाएं या टेलीकंसल्टेशन लें।",
    emergencyAdvice: "गंभीर चेतावनी संकेत पाए गए हैं। तुरंत आपातकालीन SOS सक्रिय करें या निकटतम आपातकालीन कक्ष में जाएं।",

    findHealthcareTitle: "निकटतम स्वास्थ्य केंद्र",
    facilityType: "केंद्र का प्रकार",
    distance: "दूरी",
    approxTravelTime: "अनुमानित यात्रा समय",
    openNow: "खुला है",
    closed: "बंद है",
    servicesOffered: "उपलब्ध सेवाएं",
    diagnosticTestsAvailable: "जांच सुविधाएं",
    queueStatus: "लाइव कतार स्थिति",
    approxWait: "अनुमानित प्रतीक्षा",
    navigateGoogleMaps: "गूगल मैप्स में खोलें",
    bookAppointmentBtn: "अपॉइंटमेंट बुक करें",
    viewQueueBtn: "टोकन कतार देखें",
    nowServing: "वर्तमान टोकन",
    yourToken: "आपका टोकन",
    peopleAhead: "आगे लोग",
    estimatedWaitTime: "अनुमानित प्रतीक्षा समय",

    selectFacility: "स्वास्थ्य केंद्र चुनें",
    selectDoctor: "डॉक्टर / विशेषज्ञ चुनें",
    selectDate: "तारीख चुनें",
    selectTime: "समय स्लॉट चुनें",
    consultationType: "परामर्श प्रकार",
    inPerson: "व्यक्तिगत क्लिनिक परामर्श",
    teleconsultation: "टेलीकंसल्टेशन (वीडियो/ऑडियो/चैट)",
    bookNowBtn: "अपॉइंटमेंट की पुष्टि करें",
    appointmentConfirmed: "अपॉइंटमेंट कन्फर्म हो गया",
    appointmentPendingOffline: "ऑफ़लाइन सहेजा गया - ऑनलाइन पुष्टि प्रतीक्षित",
    addToGoogleCalendar: "गूगल कैलेंडर में जोड़ें",

    myRecords: "मेरे मेडिकल रिकॉर्ड",
    uploadDocument: "दस्तावेज़ अपलोड करें",
    takePhoto: "कैमरा से फोटो लें",
    recordAccessTitle: "डॉक्टर और केंद्र रिकॉर्ड अनुमति",
    recordAccessSub: "आपके मेडिकल रिकॉर्ड केवल आपके नियंत्रण में हैं।",
    doctorRequestedAccess: "डॉक्टर ने आपके रिकॉर्ड देखने का अनुरोध किया है",
    reasonForAccess: "परामर्श का कारण",
    allowAccess: "अनुमति दें (ALLOW)",
    denyAccess: "अस्वीकार करें (DENY)",
    patientIdLabel: "विशिष्ट मरीज़ पहचान संख्या (Patient ID)",
    privateByDefault: "डिफ़ॉल्ट रूप से पूर्णतः निजी। केवल आपकी अनुमति से साझा होगा।",

    medicinesTitle: "दवाइयाँ और समय सारिणी",
    addMedicine: "दवा जोड़ें",
    dosage: "खुराक",
    frequency: "आवृत्ति",
    timing: "समय",
    medicineDueNotice: "आपकी दवा का समय 5 मिनट में होने वाला है।",
    timeToTakeMedicine: "आपकी निर्धारित दवा लेने का समय हो गया है।",
    haveYouTakenMedicine: "क्या आपने अपनी दवा ले ली है?",
    taken: "ले ली (TAKEN)",
    skipped: "छूट गई (SKIPPED)",
    remindMeLater: "बाद में याद दिलाएं",

    howAreYouFeeling: "आज आप कैसा महसूस कर रहे हैं?",
    feelingFine: "मैं बेहतर महसूस कर रहा हूँ / ठीक हूँ",
    feelingUnwell: "अभी भी तबीयत खराब है / डॉक्टर चाहिए",
    bookFollowupAppointment: "फॉलो-अप परामर्श बुक करें",
    followupLogged: "स्वास्थ्य प्रतिक्रिया सफलतापूर्वक दर्ज की गई।",

    sosActivated: "आपातकालीन SOS सक्रिय हो गया",
    sosAlertSent: "आपके आपातकालीन संपर्कों और एम्बुलेंस सेवा को अलर्ट संदेश भेजा गया।",
    locationStatus: "जीपीएस स्थान",
    smsStatus: "आपातकालीन एसएमएस संदेश",
    callStatus: "आपातकालीन डिस्पैच कॉल",
    callingAmbulanceNotice: "108 आपातकालीन एम्बुलेंस सेवा से संपर्क किया जा रहा है...",
    cancelSOS: "आपातकालीन अलार्म बंद करें",

    doctorDashboardTitle: "डॉक्टर और स्वास्थ्य केंद्र क्लिनिकल कंसोल",
    todayAppointments: "आज के अपॉइंटमेंट",
    waitingOutside: "बाहर प्रतीक्षा में",
    scheduled: "निर्धारित",
    inConsultation: "परामर्श जारी",
    completed: "संपन्न",
    joinTeleconsultation: "टेलीकंसल्टेशन शुरू करें",
    requestPatientRecords: "मरीज़ के रिकॉर्ड का अनुरोध करें",
    enterPrescription: "डिजिटल पर्ची लिखें",
    scheduleFollowUpDoctor: "मरीज़ का फॉलो-अप तय करें",
    verificationBadgeVerified: "सरकार द्वारा सत्यापित चिकित्सक",
    verificationBadgePending: "दस्तावेज़ सत्यापन प्रतीक्षित",
    verificationNotice: "केवल सरकारी रूप से सत्यापित डॉक्टरों को ही पूर्ण क्लिनिकल अधिकार दिए जाते हैं।",

    ashaDashboardTitle: "आशा / फ्रंटलाइन स्वास्थ्य कार्यकर्ता पोर्टल",
    assignedCitizens: "सौंपे गए नागरिक",
    visitsCompleted: "गृह भेंट संपन्न",
    pendingOutreach: "लंबित संपर्क",
    followupsDueToday: "आज देय फॉलो-अप",
    callCitizen: "नागरिक को कॉल करें",
    visitCitizen: "भेंट दर्ज करें",
    markTaskComplete: "कार्य पूर्ण चिह्नित करें",
    addOutreachNote: "क्षेत्रीय कार्य नोट जोड़ें",

    govtDashboardTitle: "सरकारी सार्वजनिक स्वास्थ्य निगरानी कंसोल",
    publicHealthMonitoring: "सार्वजनिक स्वास्थ्य निगरानी",
    providerVerification: "चिकित्सक प्रमाण-पत्र सत्यापन",
    facilityUtilization: "जिला केंद्र उपयोग दर",
    dailyDistrictOpd: "दैनिक जिला ओपीडी संख्या",
    opdVsPreviousWeek: "पिछले सप्ताह की तुलना में ओपीडी",
    avgOpdWaitTime: "औसत ओपीडी प्रतीक्षा समय (मिनट)",
    referralCompletion: "रेफ़रल पूर्णता दर",
    serviceUtilization: "चिकित्सीय सेवा उपयोग विश्लेषण",
    verifiedProviders: "चिकित्सक सत्यापन स्थिति",
    reviewCredentials: "प्रमाण-पत्र व डिग्री की समीक्षा करें",
    approveDoctor: "प्रमाण-पत्र स्वीकृत करें",
    rejectDoctor: "प्रमाण-पत्र अस्वीकार करें",
    inspectChartData: "विस्तृत डेटासेट देखें",
    accessibilityNeedsSummary: "सुलभता एवं संसाधन आवश्यकताएं",

    mitraGreeting: "आप कैसे हैं? मैं आज आपकी कैसे मदद करूँ?",
    mitraHelpPrompt: "मैं कतार टोकन जांच सकता हूँ, पीएचसी का रास्ता बता सकता हूँ, अपॉइंटमेंट बुक कर सकता हूँ, स्वास्थ्य पासपोर्ट खोल सकता हूँ या हृदय गति माप सकता हूँ।",
    mitraListening: "मित्र सुन रहा है...",
    mitraProcessing: "मित्र प्रक्रिया कर रहा है...",
    mitraSpeaking: "मित्र बोल रहा है...",
    mitraOutOfScope: "मैं SehatSetu और स्वास्थ्य संबंधी सहायता के लिए बनाया गया हूँ, इसलिए मैं इसमें मदद नहीं कर सकता।",
    mitraMedicalDisclaimer: "मैं एक एआई केयर कंपेनियन हूँ, डॉक्टर नहीं। मैं आपको मार्गदर्शन और नेविगेशन देता हूँ, किंतु रोग निदान या दवा नहीं दे सकता।",
    mitraDirectSosAlert: "आपातकालीन मदद शुरू कर दी गई है।",
    wakeWordHint: "'हे मित्रा', 'नमस्ते मित्रा' बोलें या माइक दबाएं।",
    endMitraSession: "सत्र समाप्त करें",

    statusVerified: "सत्यापित",
    statusPending: "प्रतीक्षारत",
    statusEmergency: "आपातकाल",
    statusError: "त्रुटि",
    statusInfo: "जानकारी",
    statusAvailable: "उपलब्ध",
  },
  mr: {
    appName: "SEHATSETU",
    tagline: "अडथळ्यांविना आरोग्यसेवा.",
    corePrinciple: "SehatSetu वापरकर्त्यानुसार अनुकूल होतो, वापरकर्ता ॲपनुसार नाही.",

    home: "मुख्य",
    navigation: "रुग्णालय शोध",
    passport: "आरोग्य पासपोर्ट",
    appointments: "भेटी (अपॉइंटमेंट्स)",
    medicines: "औषधे",
    more: "अधिक",
    sos: "आपत्कालीन SOS",
    emergency: "आपत्कालीन SOS",
    talkToMitra: "मित्राशी बोला",
    back: "मागे",
    save: "जतन करा",
    cancel: "रद्द करा",
    confirm: "खात्री करा",
    close: "बंद करा",
    loading: "लोड होत आहे...",
    search: "रुग्णालय, डॉक्टर किंवा तपासणी शोधा...",
    online: "ऑनलाइन",
    offline: "ऑफलाइन मोड",
    syncing: "सिंक होत आहे...",
    syncComplete: "सिंक पूर्ण",
    lastUpdated: "शेवटचे अपडेट",
    logout: "बाहेर पडा (लॉग आउट)",
    switchRole: "भूमिका बदला",
    language: "भाषा (Language)",
    retry: "पुन्हा प्रयत्न करा",
    downloadExcelStore: "एक्सेल डेटा स्टोअर डाउनलोड करा",
    viewCalendar: "गुगल कॅलेंडर सिंक",

    citizenRole: "नागरिक / रुग्ण",
    doctorRole: "डॉक्टर / रुग्णालय केंद्र",
    ashaRole: "आशा / आरोग्य सेविका",
    governmentRole: "शासकीय आरोग्य प्राधिकरण",

    loginTitle: "SehatSetu मध्ये लॉगिन करा",
    loginSub: "तुमच्या आरोग्य खात्यात प्रवेश करण्यासाठी फोन नंबर व पासवर्ड टाका",
    createAccount: "नवीन खाते तयार करा",
    phoneNumber: "फोन नंबर",
    password: "पासवर्ड",
    confirmPassword: "पासवर्डची खात्री करा",
    loginBtn: "लॉगिन करा",
    registerTitle: "नवीन नागरिक नोंदणी",
    registerSub: "तुमचे सुरक्षित आरोग्य खाते तयार करा. कोणतेही बनावट खाते नाही.",
    personalDetailsTitle: "वैयक्तिक माहिती",
    fullName: "पूर्ण नाव",
    age: "वय",
    gender: "लिंग",
    male: "पुरुष",
    female: "स्त्री",
    other: "इतर",
    weight: "वजन (किलो)",
    district: "जिल्हा / शहर",
    healthProfileTitle: "वैयक्तिक आरोग्य प्रोफाइल",
    healthProfileSub: "तुमच्या आरोग्य पार्श्वभूमीनुसार योग्य सेवा देण्यासाठी SehatSetu ला मदत करा",
    pastMedicalHistory: "मागील आजारांचा इतिहास (उदा. मधुमेह, दमा)",
    currentHealthIssue: "सध्याचा त्रास किंवा लक्षणे",
    heartRelatedHistory: "हृदयविकाराचा काही इतिहास आहे का?",
    previousHeartAttacks: "कधी हृदयविकाराचा झटका आला होता का?",
    numberOfHeartAttacks: "मागील हृदयविकाराच्या झटक्यांची संख्या",
    currentMedicinesLabel: "सध्या सुरू असलेली औषधे (स्वल्पविरामाने वेगळी करा)",
    allergiesLabel: "माहित असलेली ॲलर्जी (स्वल्पविरामाने वेगळी करा)",
    emergencyContactsTitle: "आपत्कालीन संपर्क",
    emergencyContactsSub: "कुटुंब, मित्र किंवा डॉक्टरांचे नंबर जोडा ज्यांच्याशी आपत्कालीन परिस्थितीत संपर्क साधता येईल.",
    addEmergencyContact: "आपत्कालीन संपर्क जोडा",
    contactName: "व्यक्तीचे नाव",
    relationship: "नाते (उदा. मुलगा, बहीण, डॉक्टर)",
    contactPhone: "फोन नंबर",
    permissionsTitle: "डिव्हाइस परवानग्या",
    permissionsSub: "व्हॉइस नेव्हिगेशन, हृदय स्कॅन आणि कागदपत्रे स्कॅन करण्यासाठी परवानग्या द्या",
    giveAccessNow: "आता परवानगी द्या",
    later: "नंतर",
    micPermissionDesc: "मित्रा व्हॉइस केअर साथीदारासाठी आवश्यक",
    cameraPermissionDesc: "हृदय स्कॅन आणि कागदपत्रे स्कॅन करण्यासाठी आवश्यक",
    storagePermissionDesc: "तुमच्या खाजगी आरोग्य पासपोर्ट दस्तऐवजांच्या सुरक्षित साठवणुकीसाठी आवश्यक",
    locationPermissionDesc: "गुगल मॅप्स आणि आरोग्य केंद्र नेव्हिगेशनसाठी आवश्यक",

    digitalTriage: "डिजिटल ट्रायज",
    digitalTriageDesc: "लक्षणे सांगा आणि नियमित की तातडीच्या तपासणीची गरज आहे ते जाणून घ्या",
    hridayScan: "Hriday Scan",
    hridayScanDesc: "कॅमेरा-आधारित अंदाजित हृदय गती मापन आणि व्हायटल्स तपासणी",
    healthcareNavigation: "आरोग्य केंद्र नेव्हिगेशन",
    healthcareNavigationDesc: "जवळचे प्राथमिक आरोग्य केंद्र, ग्रामीण रुग्णालय आणि टोकन रांग पहा",
    healthPassport: "आरोग्य पासपोर्ट",
    healthPassportDesc: "रुग्ण-नियंत्रित सुरक्षित डिजिटल प्रिस्क्रिप्शन, रिपोर्ट आणि डॉक्टर परवानगी",
    followUpCardTitle: "पुढील पाठपुरावा (फॉलो-अप)",
    medicineReminderCardTitle: "औषध आठवण",
    upcomingAppointmentCardTitle: "आगामी भेट (अपॉइंटमेंट)",
    liveQueueCardTitle: "थेट टोकन रांग",

    hridayScanTitle: "Hriday Scan",
    hridayScanInstruction: "तुमचे तर्जनी बोट मागील कॅमेरा लेन्सवर हलकेच ठेवा जोपर्यंत स्क्रीन लाल होत नाही.",
    placeFingerInstruction: "कॅमेरा सेन्सरद्वारे रक्तप्रवाहाच्या स्पंदनांची मोजणी सुरू आहे...",
    hridayDisclaimer: "Rhiday Scan provides an estimated heart-rate reading and is not a substitute for clinical measurement. Measurement is an estimate and should not be treated as a medical diagnosis.",
    estimatedBpm: "अंदाजित हृदय गती",
    signalQuality: "सिग्नल गुणवत्ता",
    signalGood: "उत्कृष्ट सिग्नल",
    signalWeak: "कमकुवत सिग्नल",
    signalDetecting: "नाडी शोधत आहे...",
    retakeScan: "पुन्हा स्कॅन करा",
    saveToPassport: "आरोग्य पासपोर्टमध्ये जतन करा",
    shareWithDoctor: "डॉक्टरांशी शेअर करा",
    bpmSavedSuccess: "हृदय गती यशस्वीरित्या तुमच्या आरोग्य पासपोर्टमध्ये जतन करण्यात आली.",
    unreliableReadingRejected: "चुकीचे मोजमाप टाळण्यासाठी अस्थिर वाचन नाकारण्यात आले. कृपया बोट स्थिर ठेवून पुन्हा प्रयत्न करा.",

    triageTitle: "डिजिटल आरोग्य ट्रायज",
    triageSub: "लक्षणे सांगून तातडीच्या वैद्यकीय सल्ल्याचे मार्गदर्शन मिळवा.",
    symptomsPlaceholder: "उदा., मला २ दिवसांपासून तीव्र खोकला आणि थोडा ताप आहे...",
    checkUrgencyBtn: "तातडीचे मार्गदर्शन तपासा",
    urgencyRoutine: "नियमित तपासणीची शिफारस",
    urgencyImmediate: "तातडीने वैद्यकीय तपासणी आवश्यक",
    urgencyEmergency: "आपत्कालीन: लगेच रुग्णालयात जा किंवा SOS दाबा",
    routineAdvice: "तुमची लक्षणे सामान्य स्वरूपाची आहेत. पुढील १-२ दिवसांत जवळच्या प्राथमिक आरोग्य केंद्रात भेट द्या.",
    immediateAdvice: "लक्षणे पाहता त्वरित तपासणी आवश्यक आहे. कृपया आजच जवळच्या आरोग्य केंद्रात जा किंवा टेलिकन्सल्टेशन घ्या.",
    emergencyAdvice: "गंभीर धोक्याचे संकेत आढळले आहेत. कृपया लगेच आपत्कालीन SOS सुरू करा किंवा तातडीच्या विभागात जा.",

    findHealthcareTitle: "जवळची आरोग्य केंद्रे",
    facilityType: "केंद्राचा प्रकार",
    distance: "अंतर",
    approxTravelTime: "अंदाजित प्रवास वेळ",
    openNow: "सध्या सुरू आहे",
    closed: "सध्या बंद आहे",
    servicesOffered: "उपलब्ध सेवा",
    diagnosticTestsAvailable: "तपासणी चाचण्या",
    queueStatus: "थेट रांग स्थिती",
    approxWait: "अंदाजित प्रतीक्षा वेळ",
    navigateGoogleMaps: "गुगल मॅप्सवर दिशा पहा",
    bookAppointmentBtn: "भेट निश्चित करा",
    viewQueueBtn: "टोकन रांग पहा",
    nowServing: "सध्या सुरू असलेला टोकन",
    yourToken: "तुमचा टोकन",
    peopleAhead: "तुमच्या आधी रुग्ण",
    estimatedWaitTime: "अंदाजित प्रतीक्षा वेळ",

    selectFacility: "आरोग्य केंद्र निवडा",
    selectDoctor: "डॉक्टर निवडा",
    selectDate: "तारीख निवडा",
    selectTime: "वेळ निवडा",
    consultationType: "सल्लामसलत प्रकार",
    inPerson: "क्लिनिकमध्ये प्रत्यक्ष भेट",
    teleconsultation: "टेलिकन्सल्टेशन (व्हिडिओ/ऑडिओ/चॅट)",
    bookNowBtn: "भेट निश्चित करा",
    appointmentConfirmed: "भेट निश्चित झाली",
    appointmentPendingOffline: "ऑफलाइन जतन केले - ऑनलाइन पुष्टी प्रतीक्षेत",
    addToGoogleCalendar: "गुगल कॅलेंडरमध्ये जोडा",

    myRecords: "माझे वैद्यकीय रेकॉर्ड्स",
    uploadDocument: "कागदपत्र अपलोड करा",
    takePhoto: "कॅमेऱ्याने फोटो घ्या",
    recordAccessTitle: "डॉक्टर व रुग्णालय प्रवेश परवानगी",
    recordAccessSub: "तुमच्या वैद्यकीय कागदपत्रांवर केवळ तुमचे पूर्ण नियंत्रण आहे.",
    doctorRequestedAccess: "डॉक्टरांनी तुमचे रेकॉर्ड्स पाहण्याची परवानगी मागितली आहे",
    reasonForAccess: "तपासणीचे कारण",
    allowAccess: "परवानगी द्या (ALLOW)",
    denyAccess: "नाकारा (DENY)",
    patientIdLabel: "खास रुग्ण आयडी (Patient ID)",
    privateByDefault: "पूर्णपणे खाजगी. फक्त तुमच्या संमतीनेच पाहिले जाऊ शकते.",

    medicinesTitle: "औषधे आणि वेळापत्रक",
    addMedicine: "औषध जोडा",
    dosage: "मात्रा (डोस)",
    frequency: "वारंवारता",
    timing: "वेळ",
    medicineDueNotice: "तुमच्या औषधाची वेळ ५ मिनिटांत होणार आहे.",
    timeToTakeMedicine: "तुमचे नियमित औषध घेण्याची वेळ झाली आहे.",
    haveYouTakenMedicine: "तुम्ही तुमचे औषध घेतले का?",
    taken: "घेतले (TAKEN)",
    skipped: "राहून गेले (SKIPPED)",
    remindMeLater: "नंतर आठवण करा",

    howAreYouFeeling: "आज तुम्हाला कसे वाटत आहे?",
    feelingFine: "मला बरे वाटत आहे / ठीक आहे",
    feelingUnwell: "अजूनही बरे वाटत नाही / डॉक्टर हवेत",
    bookFollowupAppointment: "फॉलो-अप भेट निश्चित करा",
    followupLogged: "आरोग्य प्रतिसाद यशस्वीरित्या नोंदवला गेला.",

    sosActivated: "आपत्कालीन SOS सुरू करण्यात आला",
    sosAlertSent: "तुमच्या आपत्कालीन संपर्कांना आणि रुग्णवाहिका सेवेला संदेश पाठवला गेला.",
    locationStatus: "जीपीएस स्थान",
    smsStatus: "आपत्कालीन एसएमएस संदेश",
    callStatus: "आपत्कालीन डिस्पॅच कॉल",
    callingAmbulanceNotice: "१०८ आपत्कालीन रुग्णवाहिका सेवेशी संपर्क साधत आहे...",
    cancelSOS: "आपत्कालीन अलार्म बंद करा",

    doctorDashboardTitle: "डॉक्टर आणि रुग्णालय क्लिनिकल कन्सोल",
    todayAppointments: "आजच्या भेटी",
    waitingOutside: "बाहेर प्रतीक्षेत",
    scheduled: "नियोजित",
    inConsultation: "सल्लामसलत सुरू",
    completed: "पूर्ण",
    joinTeleconsultation: "टेलिकन्सल्टेशन सुरू करा",
    requestPatientRecords: "रुग्णाच्या रेकॉर्ड्सची विनंती करा",
    enterPrescription: "डिजिटल प्रिस्क्रिप्शन लिहा",
    scheduleFollowUpDoctor: "रुग्णाचा पाठपुरावा निश्चित करा",
    verificationBadgeVerified: "शासकीय मान्यताप्राप्त डॉक्टर",
    verificationBadgePending: "कागदपत्र पडताळणी प्रलंबित",
    verificationNotice: "केवळ शासकीय पडताळणी पूर्ण झालेल्या डॉक्टरांनाच पूर्ण वैद्यकीय अधिकार मिळतात.",

    ashaDashboardTitle: "आशा / आरोग्यसेविका पोर्टल",
    assignedCitizens: "नेमून दिलेले नागरिक",
    visitsCompleted: "गृहभेटी पूर्ण",
    pendingOutreach: "प्रलंबित संपर्क",
    followupsDueToday: "आजचे पाठपुरावे",
    callCitizen: "नागरिकाला फोन करा",
    visitCitizen: "भेट नोंदवा",
    markTaskComplete: "काम पूर्ण झाल्याची नोंद करा",
    addOutreachNote: "क्षेत्रीय कामाची नोंद जोडा",

    govtDashboardTitle: "शासकीय सार्वजनिक आरोग्य सनियंत्रण कन्सोल",
    publicHealthMonitoring: "सार्वजनिक आरोग्य सनियंत्रण",
    providerVerification: "वैद्यकीय व्यावसायिक पडताळणी",
    facilityUtilization: "जिल्हा आरोग्य केंद्र वापर दर",
    dailyDistrictOpd: "दैनंदिन जिल्हा ओपीडी संख्या",
    opdVsPreviousWeek: "मागील आठवड्याच्या तुलनेत ओपीडी",
    avgOpdWaitTime: "सरासरी ओपीडी प्रतीक्षा वेळ (मिनिटे)",
    referralCompletion: "रेफरल पूर्णता दर",
    serviceUtilization: "वैद्यकीय सेवा वापर विश्लेषण",
    verifiedProviders: "डॉक्टर पडताळणी स्थिती",
    reviewCredentials: "प्रमाणपत्रे आणि पदवी तपासा",
    approveDoctor: "प्रमाणपत्रे मंजूर करा",
    rejectDoctor: "प्रमाणपत्रे नाकारा",
    inspectChartData: "सविस्तर डेटा तपासा",
    accessibilityNeedsSummary: "सुलभता आणि संसाधनांची मागणी",

    mitraGreeting: "तुम्ही कसे आहात? मी आज तुमची कशी मदत करू?",
    mitraHelpPrompt: "मी टोकन रांग तपासू शकतो, जवळचे आरोग्य केंद्र शोधू शकतो, भेट बुक करू शकतो, आरोग्य पासपोर्ट उघडू शकतो किंवा नाडी तपासू शकतो.",
    mitraListening: "मित्र ऐकत आहे...",
    mitraProcessing: "मित्र प्रक्रिया करत आहे...",
    mitraSpeaking: "मित्र बोलत आहे...",
    mitraOutOfScope: "मी SehatSetu आणि आरोग्याशी संबंधित मदतीसाठी तयार केला आहे, म्हणून मी यामध्ये मदत करू शकत नाही.",
    mitraMedicalDisclaimer: "मी एक एआय केअर साथीदार आहे, डॉक्टर नाही. मी केवळ मार्गदर्शन आणि नेव्हिगेशन देऊ शकतो, आजाराचे निदान किंवा औषधे देऊ शकत नाही.",
    mitraDirectSosAlert: "आपत्कालीन मदत सुरू केली आहे.",
    wakeWordHint: "'हे मित्रा', 'नमस्कार मित्रा' बोला किंवा माइक टॅप करा.",
    endMitraSession: "सत्र संपवा",

    statusVerified: "पडताळणी पूर्ण",
    statusPending: "प्रलंबित",
    statusEmergency: "आपत्कालीन",
    statusError: "त्रुटी",
    statusInfo: "माहिती",
    statusAvailable: "उपलब्ध",
  }
};

export function getGreeting(name: string, lang: Language): string {
  const hour = new Date().getHours();
  const safeName = name ? ` ${name}` : '';
  
  if (lang === 'en') {
    if (hour < 12) return `Good morning,${safeName}`;
    if (hour < 17) return `Good afternoon,${safeName}`;
    if (hour < 21) return `Good evening,${safeName}`;
    return `Good night,${safeName}`;
  } else if (lang === 'hi') {
    if (hour < 12) return `शुभ प्रभात,${safeName}`;
    if (hour < 17) return `शुभ दोपहर,${safeName}`;
    if (hour < 21) return `शुभ संध्या,${safeName}`;
    return `शुभ रात्रि,${safeName}`;
  } else {
    // mr
    if (hour < 12) return `शुभ प्रभात,${safeName}`;
    if (hour < 17) return `शुभ दुपार,${safeName}`;
    if (hour < 21) return `शुभ संध्याकाळ,${safeName}`;
    return `शुभ रात्री,${safeName}`;
  }
}

export const getPersonalizedGreeting = (name: string, role: string, lang: Language) => getGreeting(name, lang);


export function getMitraWakeGreeting(name: string, lang: Language): string {
  const safeName = name ? ` ${name}` : '';
  const rand = Math.random() > 0.5;

  if (lang === 'en') {
    return rand
      ? `Hello${safeName}! I'm Mitra. How can I help you?`
      : `Hi${safeName}! I'm Mitra. What would you like help with?`;
  } else if (lang === 'hi') {
    return rand
      ? `नमस्ते${safeName}! मैं मित्र हूँ। मैं आपकी कैसे मदद करूँ?`
      : `नमस्ते${safeName}! मित्र यहाँ हूँ। आपको किस चीज़ में मदद चाहिए?`;
  } else {
    return rand
      ? `नमस्कार${safeName}! मी मित्र आहे. मी तुमची कशी मदत करू?`
      : `नमस्कार${safeName}! मित्र इथे आहे. तुम्हाला कशात मदत हवी आहे?`;
  }
}
