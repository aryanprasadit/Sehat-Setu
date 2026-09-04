import React, { useState } from 'react';
import {
  Users,
  Video,
  FileText,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Clock,
  Send,
  Plus,
  Search,
  ShieldCheck,
  Stethoscope,
  Heart,
  MessageSquare,
  Mic,
  MicOff,
  VideoOff,
  PhoneOff,
} from 'lucide-react';
import { Appointment, HealthRecord, Language, UserAccount } from '../types';
import { translations } from '../i18n/translations';
import { storageService } from '../services/storageService';

interface DoctorDashboardProps {
  currentUser: UserAccount | null;
  language: Language;
}

export const DoctorDashboard: React.FC<DoctorDashboardProps> = ({ currentUser, language }) => {
  const t = translations[language];

  const [activeTab, setActiveTab] = useState<'queue' | 'teleconsult' | 'access' | 'prescription'>('queue');
  const [appointments, setAppointments] = useState<Appointment[]>(storageService.getAppointments());
  const [selectedAppt, setSelectedAppt] = useState<Appointment | null>(appointments[0] || null);

  // Verification status banner state (Section 52, 93)
  const isVerified = currentUser?.doctorProfile?.verificationStatus === 'VERIFIED';

  // Teleconsultation state (Section 54)
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [teleChatMessages, setTeleChatMessages] = useState<{ sender: string; text: string; time: string }[]>([
    { sender: 'System', text: 'Encrypted Teleconsultation session initiated.', time: '10:30 AM' },
    { sender: 'Patient', text: 'Namaste Doctor, I am feeling mild chest discomfort.', time: '10:31 AM' },
  ]);
  const [chatInput, setChatInput] = useState('');

  // Record Access Request Form state (Section 80)
  const [reqPatientId, setReqPatientId] = useState('');
  const [reqReason, setReqReason] = useState('Evaluation of persistent symptoms');
  const [reqSentSuccess, setReqSentSuccess] = useState(false);

  // Prescription Writer state (Section 51)
  const [rxPatientId, setRxPatientId] = useState(selectedAppt?.patientId || 'SS-7K4P-92Q1');
  const [rxMedName, setRxMedName] = useState('');
  const [rxDosage, setRxDosage] = useState('');
  const [rxTiming, setRxTiming] = useState('After food');
  const [rxInstructions, setRxInstructions] = useState('');
  const [rxSuccess, setRxSuccess] = useState(false);

  const handleUpdateApptStatus = (apptId: string, status: Appointment['status']) => {
    const updated = appointments.map(a => (a.id === apptId ? { ...a, status } : a));
    setAppointments(updated);
    const target = updated.find(a => a.id === apptId);
    if (target) {
      storageService.saveAppointment(target);
    }
  };

  const handleSendTeleMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setTeleChatMessages(prev => [
      ...prev,
      {
        sender: 'Doctor',
        text: chatInput,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setChatInput('');
  };

  const handleRequestRecordAccess = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reqPatientId.trim()) return;

    storageService.createRecordAccessRequest({
      id: 'req-' + Date.now(),
      patientId: reqPatientId.trim(),
      doctorId: currentUser?.id || 'doc-101',
      doctorName: currentUser?.name || 'Dr. Anand Deshmukh',
      facilityName: 'Wai Sub-District Hospital',
      reason: reqReason,
      recordsRequested: ['Hriday Scan Readings', 'Diagnostic Lab Reports', 'Medication History'],
      status: 'PENDING',
      requestedOn: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });

    setReqSentSuccess(true);
    setTimeout(() => setReqSentSuccess(false), 4000);
    setReqPatientId('');
  };

  const handleSavePrescription = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rxMedName.trim()) return;

    storageService.saveMedicine({
      id: 'med-' + Date.now(),
      patientId: rxPatientId,
      medicineName: rxMedName,
      type: 'Tablet',
      dosage: rxDosage || '1 tablet',
      frequency: 'Twice daily',
      timing: 'Morning',
      instructions: rxInstructions || `Prescribed by ${currentUser?.name || 'Attending Medical Officer'} - ${rxTiming}`,
      reminderActive: true,
    });

    setRxSuccess(true);
    setTimeout(() => setRxSuccess(false), 3000);
    setRxMedName('');
    setRxDosage('');
    setRxInstructions('');
  };

  return (
    <div className="space-y-6">
      {/* Doctor Verification Status Banner (Section 52, 93) */}
      <div
        className={`p-4 rounded-2xl border flex items-center justify-between gap-4 ${
          isVerified
            ? 'bg-[#2E8B57]/10 border-[#2E8B57]/30 text-[#164E47]'
            : 'bg-[#F9A01B]/15 border-[#F9A01B]/30 text-[#173B3A]'
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
              isVerified ? 'bg-[#2E8B57] text-white' : 'bg-[#F9A01B] text-white'
            }`}
          >
            <Stethoscope className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-extrabold text-sm sm:text-base">
                {currentUser?.name || 'Dr. Anand Deshmukh, MD'}
              </h2>
              <span
                className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                  isVerified ? 'bg-[#2E8B57] text-white' : 'bg-[#F9A01B] text-white'
                }`}
              >
                {isVerified ? 'VERIFIED PROVIDER' : 'CREDENTIAL REVIEW PENDING'}
              </span>
            </div>
            <p className="text-xs text-[#607574]">
              {currentUser?.doctorProfile?.specialization || 'General Medicine'} • Reg No:{' '}
              {currentUser?.doctorProfile?.registrationNumber || 'MMC-2016-89421'} • Wai Sub-District Hospital
            </p>
          </div>
        </div>

        <div className="text-right hidden sm:block">
          <div className="text-xs font-bold text-[#173B3A]">OPD Today</div>
          <div className="text-xl font-black text-[#164E47]">{appointments.length} Consultations</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#173B3A]/10 pb-2 overflow-x-auto text-xs font-bold">
        <button
          onClick={() => setActiveTab('queue')}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'queue' ? 'bg-[#164E47] text-white shadow-sm' : 'bg-white text-[#607574] hover:bg-[#F5F2EA]'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Live Queue & Appointments ({appointments.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('teleconsult')}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'teleconsult' ? 'bg-[#164E47] text-white shadow-sm' : 'bg-white text-[#607574] hover:bg-[#F5F2EA]'
          }`}
        >
          <Video className="w-4 h-4 text-[#F9A01B]" />
          <span>Teleconsultation Room</span>
        </button>

        <button
          onClick={() => setActiveTab('access')}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'access' ? 'bg-[#164E47] text-white shadow-sm' : 'bg-white text-[#607574] hover:bg-[#F5F2EA]'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Request Record Access</span>
        </button>

        <button
          onClick={() => setActiveTab('prescription')}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'prescription' ? 'bg-[#164E47] text-white shadow-sm' : 'bg-white text-[#607574] hover:bg-[#F5F2EA]'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Prescription Writer</span>
        </button>
      </div>

      {/* TAB 1: LIVE QUEUE & APPOINTMENTS (Section 51) */}
      {activeTab === 'queue' && (
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#173B3A]/10 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-extrabold text-base text-[#164E47]">Today's OPD Queue</h3>
              <p className="text-xs text-[#607574]">Manage patient intake and consultation transitions</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F5F2EA] text-[#173B3A] font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-3 rounded-l-lg">Token</th>
                  <th className="p-3">Patient ID & Name</th>
                  <th className="p-3">Time Slot</th>
                  <th className="p-3">Mode</th>
                  <th className="p-3">Clinical Issue</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 rounded-r-lg text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {appointments.map((appt) => (
                  <tr key={appt.id} className="hover:bg-gray-50 transition">
                    <td className="p-3 font-black text-[#F9A01B] text-sm">#{appt.tokenNumber}</td>
                    <td className="p-3">
                      <div className="font-bold text-[#173B3A]">{appt.patientName}</div>
                      <div className="text-[10px] font-mono text-[#607574]">{appt.patientId}</div>
                    </td>
                    <td className="p-3 font-semibold text-[#607574]">{appt.time}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          appt.consultationType === 'TELECONSULTATION'
                            ? 'bg-[#1976D2]/15 text-[#1976D2]'
                            : 'bg-[#164E47]/15 text-[#164E47]'
                        }`}
                      >
                        {appt.consultationType}
                      </span>
                    </td>
                    <td className="p-3 max-w-[200px] truncate text-[#173B3A]">{appt.issue}</td>
                    <td className="p-3">
                      <select
                        value={appt.status}
                        onChange={(e) => handleUpdateApptStatus(appt.id, e.target.value as any)}
                        className="bg-[#F5F2EA] border border-[#173B3A]/15 rounded-lg px-2 py-1 text-xs font-bold text-[#173B3A] focus:outline-none"
                      >
                        <option value="WAITING_OUTSIDE">Waiting Outside</option>
                        <option value="IN_CONSULTATION">In Consultation</option>
                        <option value="CONFIRMED">Confirmed / Scheduled</option>
                        <option value="COMPLETED">Completed</option>
                      </select>
                    </td>
                    <td className="p-3 text-right">
                      {appt.consultationType === 'TELECONSULTATION' ? (
                        <button
                          onClick={() => {
                            setSelectedAppt(appt);
                            setActiveTab('teleconsult');
                          }}
                          className="px-2.5 py-1 rounded-lg bg-[#1976D2] hover:bg-[#1565c0] text-white font-bold text-xs inline-flex items-center gap-1 shadow-sm"
                        >
                          <Video className="w-3.5 h-3.5" />
                          <span>Start Call</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setRxPatientId(appt.patientId);
                            setActiveTab('prescription');
                          }}
                          className="px-2.5 py-1 rounded-lg bg-[#164E47] hover:bg-[#1F5C54] text-white font-bold text-xs inline-flex items-center gap-1 shadow-sm"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>Prescribe</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: TELECONSULTATION ROOM (Section 54) */}
      {activeTab === 'teleconsult' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Video Screen */}
          <div className="lg:col-span-2 bg-black rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between h-[520px] relative border-4 border-[#164E47]">
            {/* Top Bar */}
            <div className="p-4 bg-gradient-to-b from-black/80 to-transparent flex items-center justify-between text-white z-10">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-600 animate-pulse" />
                <span className="font-extrabold text-sm">
                  Encrypted Teleconsultation • {selectedAppt?.patientName || 'Aryan Patil'} ({selectedAppt?.patientId || 'SS-7K4P-92Q1'})
                </span>
              </div>
              <span className="text-xs bg-white/20 px-2.5 py-0.5 rounded-full font-mono">
                HD Audio/Video
              </span>
            </div>

            {/* Video Viewport Simulated Visual */}
            <div className="flex-1 flex items-center justify-center text-white/60 flex-col gap-3">
              {isVideoOn ? (
                <div className="relative w-full h-full bg-[#173B3A]/40 flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center mx-auto text-white">
                      <Stethoscope className="w-12 h-12 text-[#F9A01B]" />
                    </div>
                    <div className="font-bold text-white text-base">
                      Connected with {selectedAppt?.patientName || 'Aryan Patil'}
                    </div>
                    <div className="text-xs text-white/70">
                      Audio Stream Quality: Excellent (Latency 34ms)
                    </div>
                  </div>

                  {/* Doctor Self-Preview in Corner */}
                  <div className="absolute bottom-4 right-4 w-36 h-28 bg-[#1F5C54] rounded-xl border-2 border-white shadow-lg overflow-hidden flex items-center justify-center text-xs text-white font-bold">
                    Doctor Camera
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <VideoOff className="w-16 h-16" />
                  <span className="text-sm font-semibold">Camera is Turned Off</span>
                </div>
              )}
            </div>

            {/* Bottom Call Controls */}
            <div className="p-4 bg-gradient-to-t from-black/90 to-transparent flex items-center justify-center gap-4 z-10">
              <button
                onClick={() => setIsMicOn(!isMicOn)}
                className={`p-3 rounded-full ${isMicOn ? 'bg-white/20 hover:bg-white/30 text-white' : 'bg-red-600 text-white'}`}
                title="Toggle Mic"
              >
                {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
              </button>

              <button
                onClick={() => setIsVideoOn(!isVideoOn)}
                className={`p-3 rounded-full ${isVideoOn ? 'bg-white/20 hover:bg-white/30 text-white' : 'bg-red-600 text-white'}`}
                title="Toggle Video"
              >
                {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
              </button>

              <button
                onClick={() => setActiveTab('queue')}
                className="p-3 rounded-full bg-[#D92D20] hover:bg-[#b52217] text-white shadow-lg"
                title="End Teleconsultation"
              >
                <PhoneOff className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Right Col: Consultation Chat & Vitals Quick View */}
          <div className="bg-white rounded-3xl border border-[#173B3A]/10 p-5 shadow-sm flex flex-col justify-between h-[520px]">
            <div>
              <h4 className="font-extrabold text-sm text-[#164E47] mb-3 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#F9A01B]" />
                <span>Consultation Live Chat</span>
              </h4>

              {/* Patient Vitals Snippet */}
              <div className="bg-[#F5F2EA] rounded-xl p-3 mb-3 border border-[#173B3A]/10 text-xs space-y-1">
                <div className="flex justify-between font-bold text-[#173B3A]">
                  <span>Last Hriday Scan:</span>
                  <span className="text-[#2E8B57] font-black">74 BPM</span>
                </div>
                <div className="text-[11px] text-[#607574]">
                  Chief Complaint: {selectedAppt?.issue || 'Routine follow-up'}
                </div>
              </div>

              {/* Chat Log */}
              <div className="h-64 overflow-y-auto space-y-2 text-xs pr-1">
                {teleChatMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`p-2.5 rounded-xl ${
                      msg.sender === 'Doctor'
                        ? 'bg-[#164E47] text-white ml-6'
                        : msg.sender === 'System'
                        ? 'bg-gray-100 text-[#607574] text-center text-[10px]'
                        : 'bg-[#F5F2EA] text-[#173B3A] mr-6 border border-gray-200'
                    }`}
                  >
                    <div className="font-bold text-[10px] opacity-70 mb-0.5">{msg.sender} • {msg.time}</div>
                    <div className="leading-snug">{msg.text}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendTeleMessage} className="flex items-center gap-2 pt-3 border-t border-gray-100">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Type clinical advice..."
                className="flex-1 bg-[#F5F2EA] border border-[#173B3A]/15 rounded-xl px-3 py-2 text-xs text-[#173B3A] focus:outline-none"
              />
              <button
                type="submit"
                className="p-2 rounded-xl bg-[#164E47] hover:bg-[#1F5C54] text-white font-bold"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TAB 3: REQUEST RECORD ACCESS (Section 80) */}
      {activeTab === 'access' && (
        <div className="max-w-xl mx-auto bg-white rounded-2xl p-6 border border-[#173B3A]/10 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-[#2E8B57]" />
            <div>
              <h3 className="font-bold text-base text-[#173B3A]">Request Patient Health Passport Access</h3>
              <p className="text-xs text-[#607574]">Patient must explicitly approve access in their portal</p>
            </div>
          </div>

          {reqSentSuccess && (
            <div className="p-3 bg-[#2E8B57]/15 border border-[#2E8B57]/30 rounded-xl text-xs font-bold text-[#2E8B57] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Access request dispatched to citizen. Awaiting patient approval.</span>
            </div>
          )}

          <form onSubmit={handleRequestRecordAccess} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-[#173B3A] mb-1">Target Patient ID</label>
              <input
                type="text"
                required
                value={reqPatientId}
                onChange={(e) => setReqPatientId(e.target.value)}
                placeholder="E.g., SS-7K4P-92Q1"
                className="w-full bg-[#F5F2EA] border border-[#173B3A]/20 rounded-xl p-2.5 font-mono text-xs text-[#173B3A]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#173B3A] mb-1">Clinical Consultation Purpose</label>
              <input
                type="text"
                required
                value={reqReason}
                onChange={(e) => setReqReason(e.target.value)}
                placeholder="E.g., Investigation of hypertension & cardiac history"
                className="w-full bg-[#F5F2EA] border border-[#173B3A]/20 rounded-xl p-2.5 text-xs text-[#173B3A]"
              />
            </div>

            <div className="p-3 bg-[#F5F2EA] rounded-xl border border-[#173B3A]/10 text-[11px] text-[#607574]">
              Requested items will include: Past Hriday Scan vitals, uploaded hospital summaries, and medication logs.
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-[#164E47] hover:bg-[#1F5C54] text-white font-bold text-xs shadow-md transition"
            >
              Send Access Request to Patient
            </button>
          </form>
        </div>
      )}

      {/* TAB 4: PRESCRIPTION WRITER (Section 51) */}
      {activeTab === 'prescription' && (
        <div className="max-w-xl mx-auto bg-white rounded-2xl p-6 border border-[#173B3A]/10 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <FileText className="w-6 h-6 text-[#164E47]" />
            <div>
              <h3 className="font-bold text-base text-[#173B3A]">Digital Prescription Writer</h3>
              <p className="text-xs text-[#607574]">Prescription links directly to patient's active medicine schedule</p>
            </div>
          </div>

          {rxSuccess && (
            <div className="p-3 bg-[#2E8B57]/15 border border-[#2E8B57]/30 rounded-xl text-xs font-bold text-[#2E8B57] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Prescription saved to patient's active medication schedule and Health Passport!</span>
            </div>
          )}

          <form onSubmit={handleSavePrescription} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-[#173B3A] mb-1">Patient ID</label>
              <input
                type="text"
                required
                value={rxPatientId}
                onChange={(e) => setRxPatientId(e.target.value)}
                className="w-full bg-[#F5F2EA] border border-[#173B3A]/20 rounded-xl p-2.5 font-mono text-xs text-[#173B3A]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-[#173B3A] mb-1">Medicine Name</label>
                <input
                  type="text"
                  required
                  value={rxMedName}
                  onChange={(e) => setRxMedName(e.target.value)}
                  placeholder="E.g., Telmisartan"
                  className="w-full bg-[#F5F2EA] border border-[#173B3A]/20 rounded-xl p-2.5 text-xs text-[#173B3A]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#173B3A] mb-1">Dosage</label>
                <input
                  type="text"
                  required
                  value={rxDosage}
                  onChange={(e) => setRxDosage(e.target.value)}
                  placeholder="E.g., 40mg once daily"
                  className="w-full bg-[#F5F2EA] border border-[#173B3A]/20 rounded-xl p-2.5 text-xs text-[#173B3A]"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-[#173B3A] mb-1">Meal Timing</label>
              <select
                value={rxTiming}
                onChange={(e) => setRxTiming(e.target.value)}
                className="w-full bg-[#F5F2EA] border border-[#173B3A]/20 rounded-xl p-2.5 text-xs text-[#173B3A]"
              >
                <option value="After food">After food (जेवणानंतर / भोजन के बाद)</option>
                <option value="Before food">Before food (जेवणापूर्वी / भोजन से पहले)</option>
                <option value="At bedtime">At bedtime (झोपताना / रात को)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-[#173B3A] mb-1">Doctor Remarks / Instructions</label>
              <textarea
                rows={2}
                value={rxInstructions}
                onChange={(e) => setRxInstructions(e.target.value)}
                placeholder="Take with warm water. Repeat BP check in 14 days."
                className="w-full bg-[#F5F2EA] border border-[#173B3A]/20 rounded-xl p-2.5 text-xs text-[#173B3A]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-[#2E8B57] hover:bg-[#257347] text-white font-bold text-xs shadow-md transition"
            >
              Sign & Issue Prescription
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
