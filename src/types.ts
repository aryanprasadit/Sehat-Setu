export type Language = 'en' | 'hi' | 'mr';

export type UserRole = 'patient' | 'doctor' | 'asha' | 'government';

export interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
}

export interface HealthProfile {
  pastMedicalHistory: string[];
  currentHealthIssue: string;
  diseases: string[];
  previousDiagnoses: string[];
  heartRelatedHistory: boolean;
  previousHeartAttacks: boolean;
  numberOfHeartAttacks: number;
  currentMedicines: string[];
  previousMedicines: string[];
  allergies: string[];
  otherInfo: string;
}

export interface UserPermissions {
  microphone: boolean;
  camera: boolean;
  storage: boolean;
  location: boolean;
}

export interface DoctorProfile {
  registrationNumber: string;
  registrationAuthority: string;
  qualifications: string;
  expertise: string;
  assignedFacility: string;
  verificationStatus: 'PENDING' | 'VERIFIED' | 'NOT_APPROVED';
  submittedDocs: string[];
  submissionDate: string;
}

export interface AshaProfile {
  workerId: string;
  area: string;
  assignedVillage: string;
  centerName: string;
}

export interface UserAccount {
  id: string;
  phoneNumber: string;
  password: string;
  role: UserRole;
  name: string;
  age: number;
  gender: string;
  weight: number;
  district: string;
  patientId: string; // Non-guessable ID, e.g. SS-7K4P-92Q1
  createdAt: string;
  healthProfile: HealthProfile;
  emergencyContacts: EmergencyContact[];
  permissions: UserPermissions;
  doctorProfile?: DoctorProfile;
  ashaProfile?: AshaProfile;
  preferredLanguage: Language;
}

export interface Facility {
  id: string;
  name: string;
  type: 'PHC' | 'CHC' | 'Rural Hospital' | 'District Hospital';
  location: string;
  distanceKm: number;
  travelTimeMins: number;
  isOpen: boolean;
  services: string[];
  diagnosticTests: string[];
  currentServingToken: number;
  totalTokensIssued: number;
  avgWaitMinutes: number;
  latitude: number;
  longitude: number;
  lastUpdated: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  facilityId: string;
  facilityName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  time: string;
  consultationType: 'IN_PERSON' | 'TELECONSULTATION';
  status: 'CONFIRMED' | 'PENDING' | 'CANCELLED' | 'COMPLETED' | 'RESCHEDULED';
  issue: string;
  tokenNumber?: number;
  createdAt: string;
  calendarSynced?: boolean;
  isPendingSync?: boolean;
}

export interface HealthRecord {
  id: string;
  patientId: string;
  title: string;
  type: 'PRESCRIPTION' | 'MEDICAL_RECORD' | 'DIAGNOSTIC_REPORT' | 'HRIDAY_SCAN';
  date: string;
  doctorOrFacility: string;
  notes: string;
  fileData?: string; // image / document data
  fileName?: string;
  readings?: {
    bpm?: number;
    confidence?: string;
    status?: string;
    waveform?: number[];
  };
  isPendingSync?: boolean;
}

export interface RecordAccessRequest {
  id: string;
  patientId: string;
  doctorName: string;
  doctorId: string;
  facilityName: string;
  reason: string;
  requestedOn: string;
  recordsRequested: string[];
  status: 'PENDING' | 'ALLOWED' | 'DENIED';
  respondedOn?: string;
}

export interface MedicineSchedule {
  id: string;
  patientId: string;
  medicineName?: string;
  name?: string; // UI alias
  type?: 'Tablet' | 'Syrup' | 'Capsule' | 'Injection' | 'Ointment';
  dosage: string;
  timing: string;
  specificTime?: string;
  frequency: string;
  instructions: string;
  prescribedBy?: string;
  reminderActive?: boolean;
  isActive?: boolean;
  lastStatus?: 'TAKEN' | 'SKIPPED' | 'REMIND_LATER' | 'DUE';
  lastStatusTimestamp?: string;
  lastTaken?: string;
  startDate?: string;
}

export type Medicine = MedicineSchedule;

export interface FollowUp {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  facilityName: string;
  dueDate: string;
  status: 'PENDING' | 'COMPLETED' | 'OVERDUE';
  feedbackStatus?: 'FINE' | 'NOT_FINE' | 'PENDING';
  feedbackNotes?: string;
  feedbackTimestamp?: string;
  instructions: string;
}

export interface AshaOutreachTask {
  id: string;
  ashaId: string;
  patientId: string;
  citizenName: string;
  phone: string;
  houseNumber: string;
  category: 'Child Immunization' | 'Maternal Care / ANC' | 'Chronic Hypertension' | 'Elderly Care' | 'General';
  task: 'BP Check' | 'Medicine Follow-up' | 'Iron-Folic Acid Tablets' | 'Vaccination Due' | 'Nutrition Check';
  dueDate: string;
  status: 'PENDING' | 'COMPLETED';
  lastContactDate?: string;
  notes?: string;
  isPendingSync?: boolean;
}

export interface SOSAlert {
  id: string;
  patientId: string;
  patientName: string;
  phone: string;
  timestamp: string;
  location: {
    latitude?: number;
    longitude?: number;
    address?: string;
    status: 'Captured' | 'Unavailable';
  };
  smsStatus: 'Sent' | 'Submitted' | 'Failed';
  callStatus: 'Initiated' | 'Requires Confirmation' | 'Failed';
  contactsNotified: { name: string; phone: string; status: string }[];
}

export interface ConsultationMessage {
  id: string;
  senderId: string;
  senderRole: UserRole;
  senderName: string;
  text: string;
  timestamp: string;
}

export interface AuditLog {
  id: string;
  actor: string;
  role: UserRole;
  action: string;
  resource: string;
  timestamp: string;
  result: 'SUCCESS' | 'DENIED' | 'FAILED';
  details?: string;
}

export interface TriageResult {
  symptoms: string;
  urgency: 'ROUTINE' | 'IMMEDIATE' | 'EMERGENCY';
  recommendation: string;
  questionsAnswered: { question: string; answer: string }[];
  timestamp: string;
}
