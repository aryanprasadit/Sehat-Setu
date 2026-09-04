import React, { useState } from 'react';
import {
  Lock,
  Phone,
  User,
  ShieldCheck,
  Heart,
  Camera,
  Mic,
  MapPin,
  FolderLock,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';
import { EmergencyContact, Language, UserAccount, UserRole } from '../types';
import { translations } from '../i18n/translations';
import { storageService } from '../services/storageService';

interface AuthViewProps {
  language: Language;
  onLoginSuccess: (user: UserAccount) => void;
}

export const AuthView: React.FC<AuthViewProps> = ({ language, onLoginSuccess }) => {
  const t = translations[language];

  const [authMode, setAuthMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');

  // Login form state
  const [loginPhone, setLoginPhone] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);

  // Registration multi-step state
  const [regStep, setRegStep] = useState<number>(1);
  const [role, setRole] = useState<UserRole>('patient');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState<number>(38);
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [weightKg, setWeightKg] = useState<number>(68);
  const [district, setDistrict] = useState('Satara District, Maharashtra');

  // Health Profile (Section 13)
  const [heartHistory, setHeartHistory] = useState(false);
  const [priorHeartAttacks, setPriorHeartAttacks] = useState<number>(0);
  const [pastConditions, setPastConditions] = useState('Mild hypertension managed with low sodium diet');
  const [allergies, setAllergies] = useState('No known drug allergies');

  // Emergency Contacts (5-6 contacts) (Section 15)
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([
    { id: '1', name: 'Sanjay Shinde (Spouse)', relationship: 'Family', phone: '+91 98220 12345' },
    { id: '2', name: 'Dr. Anand Deshmukh (PHC MO)', relationship: 'Doctor', phone: '+91 98220 67890' },
    { id: '3', name: 'Sunita Kadam (ASHA Worker)', relationship: 'Community Health', phone: '+91 98221 44556' },
  ]);
  const [newContactName, setNewContactName] = useState('');
  const [newContactRel, setNewContactRel] = useState('Family');
  const [newContactPhone, setNewContactPhone] = useState('');

  // Permissions setup (Section 16)
  const [micGranted, setMicGranted] = useState(false);
  const [camGranted, setCamGranted] = useState(false);
  const [locGranted, setLocGranted] = useState(false);
  const [storeGranted, setStoreGranted] = useState(true);

  // Handle Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    const user = storageService.authenticateUser(loginPhone.trim(), loginPassword);
    if (user) {
      onLoginSuccess(user);
    } else {
      setLoginError(
        language === 'mr'
          ? 'अवैध फोन नंबर किंवा पासवर्ड. कृपया योग्य माहिती भरा किंवा नवीन खाते उघडा.'
          : language === 'hi'
          ? 'गलत फोन नंबर या पासवर्ड। कृपया विवरण जांचें या नया खाता बनाएं।'
          : 'Invalid phone number or password. Please check your credentials or register.'
      );
    }
  };

  const handleAddEmergencyContact = () => {
    if (!newContactName.trim() || !newContactPhone.trim()) return;
    setEmergencyContacts(prev => [
      ...prev,
      {
        id: 'ec-' + Date.now(),
        name: newContactName.trim(),
        relationship: newContactRel,
        phone: newContactPhone.trim(),
      },
    ]);
    setNewContactName('');
    setNewContactPhone('');
  };

  const handleRemoveContact = (id: string) => {
    setEmergencyContacts(prev => prev.filter(c => c.id !== id));
  };

  // Request actual browser permissions (Section 16)
  const handleRequestHardwarePermissions = async () => {
    try {
      if (navigator.mediaDevices) {
        await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
        setMicGranted(true);
        setCamGranted(true);
      }
    } catch (e) {
      // ignore
    }

    try {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          () => setLocGranted(true),
          () => setLocGranted(false)
        );
      }
    } catch (e) {
      // ignore
    }
  };

  // Complete Registration
  const handleCompleteRegistration = () => {
    if (password !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    const patientId = storageService.generatePatientId();

    const newUser: UserAccount = {
      id: 'usr-' + Date.now(),
      patientId,
      name,
      phoneNumber: phone,
      password,
      role,
      preferredLanguage: language,
      age,
      gender,
      weight: weightKg,
      district,
      healthProfile: {
        pastMedicalHistory: pastConditions.split(',').map(s => s.trim()),
        currentHealthIssue: 'Routine registration check-in',
        diseases: [],
        previousDiagnoses: [],
        heartRelatedHistory: heartHistory,
        previousHeartAttacks: priorHeartAttacks > 0,
        numberOfHeartAttacks: priorHeartAttacks,
        currentMedicines: [],
        previousMedicines: [],
        allergies: allergies.split(',').map(s => s.trim()),
        otherInfo: '',
      },
      emergencyContacts,
      permissions: {
        microphone: micGranted,
        camera: camGranted,
        storage: storeGranted,
        location: locGranted,
      },
      createdAt: new Date().toISOString(),
    };

    storageService.registerUser(newUser);
    onLoginSuccess(newUser);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-xl border border-[#164E47]/20 overflow-hidden">
        {/* Banner */}
        <div className="bg-[#164E47] text-white p-6 text-center relative">
          <div className="w-12 h-12 rounded-2xl bg-white text-[#164E47] flex items-center justify-center font-black text-xl mx-auto mb-2 shadow-md">
            SS
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-wide">SEHATSETU</h1>
          <p className="text-xs text-[#F5F2EA]/85 font-medium mt-0.5">{t.tagline}</p>

          {/* Mode Switch Tabs */}
          <div className="flex bg-[#1F5C54] rounded-xl p-1 max-w-xs mx-auto mt-4 text-xs font-bold">
            <button
              onClick={() => setAuthMode('LOGIN')}
              className={`flex-1 py-1.5 rounded-lg transition ${
                authMode === 'LOGIN' ? 'bg-white text-[#164E47] shadow-sm' : 'text-white'
              }`}
            >
              {t.login}
            </button>
            <button
              onClick={() => setAuthMode('REGISTER')}
              className={`flex-1 py-1.5 rounded-lg transition ${
                authMode === 'REGISTER' ? 'bg-white text-[#164E47] shadow-sm' : 'text-white'
              }`}
            >
              {t.register}
            </button>
          </div>
        </div>

        {/* LOGIN FORM (Section 10) */}
        {authMode === 'LOGIN' ? (
          <div className="p-6 sm:p-8 space-y-4">
            {loginError && (
              <div className="p-3 bg-[#D92D20]/10 border border-[#D92D20]/30 rounded-xl text-xs font-semibold text-[#D92D20] flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#173B3A] mb-1">{t.phone}</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#607574] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={loginPhone}
                    onChange={(e) => setLoginPhone(e.target.value)}
                    placeholder="+91 98220 12345"
                    className="w-full bg-[#F5F2EA] border border-[#173B3A]/20 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-[#173B3A] focus:outline-none focus:ring-2 focus:ring-[#164E47]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#173B3A] mb-1">{t.password}</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#607574] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#F5F2EA] border border-[#173B3A]/20 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-[#173B3A] focus:outline-none focus:ring-2 focus:ring-[#164E47]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-[#164E47] hover:bg-[#1F5C54] text-white font-extrabold text-sm shadow-md transition mt-2"
              >
                {t.login}
              </button>
            </form>

            <div className="text-center pt-2">
              <button
                onClick={() => setAuthMode('REGISTER')}
                className="text-xs font-bold text-[#164E47] hover:underline"
              >
                Don't have an account? Create a SehatSetu profile →
              </button>
            </div>
          </div>
        ) : (
          /* MULTI-STEP REGISTRATION & HEALTH PROFILE ONBOARDING (Section 11, 13, 14, 15, 16) */
          <div className="p-6 sm:p-8 space-y-5">
            {/* Step Indicators */}
            <div className="flex items-center justify-between text-xs font-bold text-[#607574] pb-2 border-b border-gray-100">
              <span className={regStep >= 1 ? 'text-[#164E47]' : ''}>1. Account</span>
              <span className={regStep >= 2 ? 'text-[#164E47]' : ''}>2. Demographics</span>
              <span className={regStep >= 3 ? 'text-[#164E47]' : ''}>3. Health</span>
              <span className={regStep >= 4 ? 'text-[#164E47]' : ''}>4. Contacts</span>
              <span className={regStep >= 5 ? 'text-[#164E47]' : ''}>5. Permissions</span>
            </div>

            {/* STEP 1: ACCOUNT & ROLE */}
            {regStep === 1 && (
              <div className="space-y-4 text-xs">
                <h3 className="font-bold text-sm text-[#173B3A]">Role & Credentials</h3>

                <div>
                  <label className="block font-bold text-[#173B3A] mb-1">Choose Account Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="w-full bg-[#F5F2EA] border border-[#173B3A]/20 rounded-xl p-2.5 text-xs text-[#173B3A]"
                  >
                    <option value="patient">Citizen / Patient</option>
                    <option value="doctor">Doctor / Medical Officer</option>
                    <option value="asha">ASHA Worker</option>
                    <option value="government">Government Health Authority</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#173B3A] mb-1">{t.phone}</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98220 99887"
                    className="w-full bg-[#F5F2EA] border border-[#173B3A]/20 rounded-xl p-2.5 text-xs text-[#173B3A]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-[#173B3A] mb-1">{t.password}</label>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-[#F5F2EA] border border-[#173B3A]/20 rounded-xl p-2.5 text-xs text-[#173B3A]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-[#173B3A] mb-1">{t.confirmPassword}</label>
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-[#F5F2EA] border border-[#173B3A]/20 rounded-xl p-2.5 text-xs text-[#173B3A]"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  disabled={!phone || !password || password !== confirmPassword}
                  onClick={() => setRegStep(2)}
                  className="w-full py-2.5 rounded-xl bg-[#164E47] text-white font-bold text-xs shadow disabled:opacity-40"
                >
                  Continue to Personal Details →
                </button>
              </div>
            )}

            {/* STEP 2: PERSONAL DETAILS */}
            {regStep === 2 && (
              <div className="space-y-4 text-xs">
                <h3 className="font-bold text-sm text-[#173B3A]">Personal & Demographic Information</h3>

                <div>
                  <label className="block font-bold text-[#173B3A] mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="E.g., Aryan Sanjay Patil"
                    className="w-full bg-[#F5F2EA] border border-[#173B3A]/20 rounded-xl p-2.5 text-xs text-[#173B3A]"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block font-bold text-[#173B3A] mb-1">Age</label>
                    <input
                      type="number"
                      value={age}
                      onChange={(e) => setAge(parseInt(e.target.value) || 0)}
                      className="w-full bg-[#F5F2EA] border border-[#173B3A]/20 rounded-xl p-2 text-xs text-[#173B3A]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-[#173B3A] mb-1">Gender</label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value as any)}
                      className="w-full bg-[#F5F2EA] border border-[#173B3A]/20 rounded-xl p-2 text-xs text-[#173B3A]"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-[#173B3A] mb-1">Weight (kg)</label>
                    <input
                      type="number"
                      value={weightKg}
                      onChange={(e) => setWeightKg(parseInt(e.target.value) || 0)}
                      className="w-full bg-[#F5F2EA] border border-[#173B3A]/20 rounded-xl p-2 text-xs text-[#173B3A]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-[#173B3A] mb-1">District / Rural Location</label>
                  <input
                    type="text"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full bg-[#F5F2EA] border border-[#173B3A]/20 rounded-xl p-2.5 text-xs text-[#173B3A]"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setRegStep(1)}
                    className="flex-1 py-2.5 rounded-xl border border-gray-300 font-bold"
                  >
                    ← Back
                  </button>
                  <button
                    type="button"
                    disabled={!name.trim()}
                    onClick={() => setRegStep(3)}
                    className="flex-1 py-2.5 rounded-xl bg-[#164E47] text-white font-bold disabled:opacity-40"
                  >
                    Health Profile →
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: HEALTH PROFILE (Section 13) */}
            {regStep === 3 && (
              <div className="space-y-4 text-xs">
                <h3 className="font-bold text-sm text-[#173B3A]">Health & Cardiac History</h3>

                <label className="flex items-center gap-2.5 p-3 rounded-xl border border-gray-200 bg-[#F5F2EA]/40 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={heartHistory}
                    onChange={(e) => setHeartHistory(e.target.checked)}
                    className="w-4 h-4 rounded text-[#164E47]"
                  />
                  <div>
                    <div className="font-bold text-[#173B3A]">History of Heart Disease or Hypertension</div>
                    <div className="text-[11px] text-[#607574]">Enables targeted Hriday Scan baselines</div>
                  </div>
                </label>

                {heartHistory && (
                  <div>
                    <label className="block font-bold text-[#173B3A] mb-1">Prior Heart Attacks / Cardiac Events</label>
                    <input
                      type="number"
                      min={0}
                      value={priorHeartAttacks}
                      onChange={(e) => setPriorHeartAttacks(parseInt(e.target.value) || 0)}
                      className="w-full bg-[#F5F2EA] border border-[#173B3A]/20 rounded-xl p-2 text-xs text-[#173B3A]"
                    />
                  </div>
                )}

                <div>
                  <label className="block font-bold text-[#173B3A] mb-1">Past Medical Conditions</label>
                  <input
                    type="text"
                    value={pastConditions}
                    onChange={(e) => setPastConditions(e.target.value)}
                    placeholder="E.g., Diabetes, Asthma, Thyroid..."
                    className="w-full bg-[#F5F2EA] border border-[#173B3A]/20 rounded-xl p-2.5 text-xs text-[#173B3A]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#173B3A] mb-1">Known Allergies</label>
                  <input
                    type="text"
                    value={allergies}
                    onChange={(e) => setAllergies(e.target.value)}
                    placeholder="E.g., Penicillin, Peanuts, Sulfa drugs..."
                    className="w-full bg-[#F5F2EA] border border-[#173B3A]/20 rounded-xl p-2.5 text-xs text-[#173B3A]"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setRegStep(2)}
                    className="flex-1 py-2.5 rounded-xl border border-gray-300 font-bold"
                  >
                    ← Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setRegStep(4)}
                    className="flex-1 py-2.5 rounded-xl bg-[#164E47] text-white font-bold"
                  >
                    Emergency Contacts →
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: EMERGENCY CONTACTS (Section 15) */}
            {regStep === 4 && (
              <div className="space-y-4 text-xs">
                <div>
                  <h3 className="font-bold text-sm text-[#173B3A]">Emergency SOS Contacts</h3>
                  <p className="text-[#607574] text-[11px]">
                    Alerted with GPS coordinates during voice or button SOS activation
                  </p>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {emergencyContacts.map((c) => (
                    <div
                      key={c.id}
                      className="p-2.5 rounded-xl bg-[#F5F2EA] border border-[#173B3A]/10 flex items-center justify-between"
                    >
                      <div>
                        <div className="font-bold text-[#173B3A]">{c.name}</div>
                        <div className="text-[11px] text-[#607574]">{c.relationship} • {c.phone}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveContact(c.id)}
                        className="text-[#D92D20] p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add Contact */}
                <div className="p-3 rounded-xl border border-dashed border-[#173B3A]/20 space-y-2">
                  <div className="font-bold text-[#164E47] text-[11px]">+ Add Contact</div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Name"
                      value={newContactName}
                      onChange={(e) => setNewContactName(e.target.value)}
                      className="bg-white border rounded-lg p-2 text-xs"
                    />
                    <input
                      type="tel"
                      placeholder="Phone"
                      value={newContactPhone}
                      onChange={(e) => setNewContactPhone(e.target.value)}
                      className="bg-white border rounded-lg p-2 text-xs"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleAddEmergencyContact}
                    disabled={!newContactName || !newContactPhone}
                    className="w-full py-1.5 bg-[#164E47] text-white rounded-lg font-bold text-xs disabled:opacity-40"
                  >
                    Add to Emergency List
                  </button>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setRegStep(3)}
                    className="flex-1 py-2.5 rounded-xl border border-gray-300 font-bold"
                  >
                    ← Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setRegStep(5)}
                    className="flex-1 py-2.5 rounded-xl bg-[#164E47] text-white font-bold"
                  >
                    Permissions Setup →
                  </button>
                </div>
              </div>
            )}

            {/* STEP 5: PERMISSIONS SETUP (Section 16) */}
            {regStep === 5 && (
              <div className="space-y-4 text-xs">
                <div>
                  <h3 className="font-bold text-sm text-[#173B3A]">System Permissions Setup</h3>
                  <p className="text-[#607574] text-[11px]">
                    Required for Mitra AI voice conversation, Hriday Scan pulse measurement, and SOS dispatch
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="p-3 rounded-xl border border-[#173B3A]/15 bg-[#F5F2EA]/40 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <Mic className="w-4 h-4 text-[#164E47]" />
                      <div>
                        <div className="font-bold text-[#173B3A]">Microphone Access</div>
                        <div className="text-[10px] text-[#607574]">Voice-first Mitra AI dialogue</div>
                      </div>
                    </div>
                    <span className="font-bold text-[#2E8B57]">{micGranted ? 'Enabled' : 'Ready'}</span>
                  </div>

                  <div className="p-3 rounded-xl border border-[#173B3A]/15 bg-[#F5F2EA]/40 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <Camera className="w-4 h-4 text-[#D92D20]" />
                      <div>
                        <div className="font-bold text-[#173B3A]">Camera Access</div>
                        <div className="text-[10px] text-[#607574]">Hriday Scan optical heart pulse detection</div>
                      </div>
                    </div>
                    <span className="font-bold text-[#2E8B57]">{camGranted ? 'Enabled' : 'Ready'}</span>
                  </div>

                  <div className="p-3 rounded-xl border border-[#173B3A]/15 bg-[#F5F2EA]/40 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <MapPin className="w-4 h-4 text-[#1976D2]" />
                      <div>
                        <div className="font-bold text-[#173B3A]">Location Access</div>
                        <div className="text-[10px] text-[#607574]">Emergency SOS & nearest PHC navigation</div>
                      </div>
                    </div>
                    <span className="font-bold text-[#2E8B57]">{locGranted ? 'Enabled' : 'Ready'}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleRequestHardwarePermissions}
                  className="w-full py-2.5 rounded-xl border-2 border-[#164E47] text-[#164E47] hover:bg-[#F5F2EA] font-extrabold text-xs transition"
                >
                  {t.giveAccessNow}
                </button>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setRegStep(4)}
                    className="flex-1 py-2.5 rounded-xl border border-gray-300 font-bold"
                  >
                    ← Back
                  </button>
                  <button
                    type="button"
                    onClick={handleCompleteRegistration}
                    className="flex-1 py-2.5 rounded-xl bg-[#2E8B57] hover:bg-[#257347] text-white font-extrabold text-xs shadow-md"
                  >
                    Complete & Enter SehatSetu
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
