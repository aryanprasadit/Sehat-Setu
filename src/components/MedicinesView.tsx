import React, { useState } from 'react';
import {
  Pill,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  Bell,
  Check,
  X,
  RotateCw,
} from 'lucide-react';
import { Language, Medicine, UserAccount } from '../types';
import { translations } from '../i18n/translations';
import { storageService } from '../services/storageService';

interface MedicinesViewProps {
  currentUser: UserAccount | null;
  language: Language;
}

export const MedicinesView: React.FC<MedicinesViewProps> = ({ currentUser, language }) => {
  const t = translations[language];
  const [medicines, setMedicines] = useState<Medicine[]>(
    currentUser ? storageService.getMedicines(currentUser.patientId) : []
  );

  const [activeAlertMedicine, setActiveAlertMedicine] = useState<Medicine | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('Once daily (Morning)');
  const [timing, setTiming] = useState('After food');
  const [instructions, setInstructions] = useState('');

  const handleAddMedicine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !name.trim()) return;

    const newMed: Medicine = {
      id: 'med-' + Date.now(),
      patientId: currentUser.patientId,
      name,
      dosage,
      frequency,
      timing,
      instructions,
      startDate: new Date().toISOString().slice(0, 10),
      isActive: true,
      lastTaken: undefined,
    };

    storageService.saveMedicine(newMed);
    setMedicines(storageService.getMedicines(currentUser.patientId));
    setIsAdding(false);
    setName('');
    setDosage('');
    setInstructions('');
  };

  const handleReminderAction = (med: Medicine, action: 'TAKEN' | 'SKIPPED' | 'LATER') => {
    if (action === 'TAKEN') {
      med.lastTaken = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      storageService.saveMedicine(med);
      if (currentUser) {
        setMedicines(storageService.getMedicines(currentUser.patientId));
      }
    }
    setActiveAlertMedicine(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#173B3A]/10 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#164E47]">{t.medicines}</h1>
            <span className="text-xs bg-[#2E8B57]/15 text-[#2E8B57] font-bold px-2 py-0.5 rounded-full">
              {medicines.filter(m => m.isActive).length} Active
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#607574] mt-1 font-medium">
            {t.medicineSchedule}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {medicines.length > 0 && (
            <button
              onClick={() => setActiveAlertMedicine(medicines[0])}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#F9A01B]/20 hover:bg-[#F9A01B]/30 text-[#173B3A] text-xs font-bold transition border border-[#F9A01B]/40"
            >
              <Bell className="w-4 h-4 text-[#F9A01B]" />
              <span>Simulate Reminder</span>
            </button>
          )}

          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#164E47] hover:bg-[#1F5C54] text-white text-xs font-bold transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Medicine</span>
          </button>
        </div>
      </div>

      {/* ACTIVE MEDICINE REMINDER BANNER (Section 48) */}
      {activeAlertMedicine && (
        <div className="bg-[#F9A01B]/15 border-2 border-[#F9A01B] rounded-2xl p-5 shadow-lg animate-in zoom-in-95 duration-150">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-[#F9A01B] flex items-center justify-center text-white flex-shrink-0 animate-bounce">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#164E47]">
                  {t.medicineDueReminder}
                </span>
                <h3 className="text-lg font-black text-[#173B3A]">
                  {activeAlertMedicine.name} ({activeAlertMedicine.dosage})
                </h3>
                <p className="text-xs text-[#607574]">
                  {activeAlertMedicine.timing} • {activeAlertMedicine.instructions}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleReminderAction(activeAlertMedicine, 'TAKEN')}
                className="px-4 py-2 rounded-xl bg-[#2E8B57] hover:bg-[#257347] text-white text-xs font-bold transition flex items-center gap-1 shadow-sm"
              >
                <Check className="w-4 h-4" />
                <span>{t.taken}</span>
              </button>

              <button
                onClick={() => handleReminderAction(activeAlertMedicine, 'LATER')}
                className="px-3 py-2 rounded-xl bg-white border border-[#173B3A]/20 text-[#173B3A] text-xs font-bold hover:bg-gray-50 transition flex items-center gap-1"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>{t.remindMeLater}</span>
              </button>

              <button
                onClick={() => handleReminderAction(activeAlertMedicine, 'SKIPPED')}
                className="px-3 py-2 rounded-xl bg-[#D92D20]/15 text-[#D92D20] text-xs font-bold hover:bg-[#D92D20]/25 transition"
              >
                {t.skipped}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Medicine Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-2xl p-5 border border-[#164E47]/20 shadow-2xl space-y-4">
            <h3 className="font-bold text-base text-[#164E47]">Add Prescribed Medicine</h3>

            <form onSubmit={handleAddMedicine} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[#173B3A] mb-1">Medicine Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="E.g., Amlodipine, Metformin, Paracetamol..."
                  className="w-full bg-[#F5F2EA] border border-[#173B3A]/20 rounded-xl p-2.5 text-xs text-[#173B3A]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-[#173B3A] mb-1">Dosage</label>
                  <input
                    type="text"
                    required
                    value={dosage}
                    onChange={(e) => setDosage(e.target.value)}
                    placeholder="E.g., 5mg, 500mg, 1 tablet"
                    className="w-full bg-[#F5F2EA] border border-[#173B3A]/20 rounded-xl p-2.5 text-xs text-[#173B3A]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#173B3A] mb-1">Frequency</label>
                  <select
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value)}
                    className="w-full bg-[#F5F2EA] border border-[#173B3A]/20 rounded-xl p-2.5 text-xs text-[#173B3A]"
                  >
                    <option value="Once daily (Morning)">Once daily (Morning)</option>
                    <option value="Once daily (Night)">Once daily (Night)</option>
                    <option value="Twice daily (Morning & Night)">Twice daily</option>
                    <option value="Thrice daily">Thrice daily</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#173B3A] mb-1">Meal Timing</label>
                <select
                  value={timing}
                  onChange={(e) => setTiming(e.target.value)}
                  className="w-full bg-[#F5F2EA] border border-[#173B3A]/20 rounded-xl p-2.5 text-xs text-[#173B3A]"
                >
                  <option value="After food">After food (जेवणानंतर / भोजन के बाद)</option>
                  <option value="Before food">Before food (जेवणापूर्वी / भोजन से पहले)</option>
                  <option value="With warm water">With warm water</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#173B3A] mb-1">Instructions / Prescribing Doctor</label>
                <input
                  type="text"
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="E.g., Prescribed by Dr. Anand Deshmukh for BP control"
                  className="w-full bg-[#F5F2EA] border border-[#173B3A]/20 rounded-xl p-2.5 text-xs text-[#173B3A]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-3 py-1.5 rounded-lg border border-gray-300 text-[#607574] font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#164E47] text-white font-bold"
                >
                  Add Medicine
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Medicines List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {medicines.map((med) => (
          <div
            key={med.id}
            className="bg-white rounded-2xl border border-[#173B3A]/10 shadow-sm p-5 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#2E8B57]/15 flex items-center justify-center text-[#2E8B57]">
                    <Pill className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-[#173B3A]">{med.name}</h3>
                    <span className="text-xs font-semibold text-[#607574]">{med.dosage}</span>
                  </div>
                </div>

                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#2E8B57]/10 text-[#2E8B57]">
                  Active
                </span>
              </div>

              <div className="mt-4 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-[#607574]">
                  <Clock className="w-4 h-4 text-[#164E47]" />
                  <span className="font-semibold text-[#173B3A]">{med.frequency}</span>
                  <span>• {med.timing}</span>
                </div>

                {med.instructions && (
                  <p className="text-[#607574] bg-[#F5F2EA] p-2.5 rounded-xl border border-[#173B3A]/10">
                    {med.instructions}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
              <span className="text-[11px] text-[#607574]">
                {med.lastTaken ? `Last taken: Today, ${med.lastTaken}` : 'Not logged today'}
              </span>

              <button
                onClick={() => {
                  med.lastTaken = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                  storageService.saveMedicine(med);
                  if (currentUser) setMedicines([...storageService.getMedicines(currentUser.patientId)]);
                }}
                className="px-3 py-1 rounded-lg bg-[#2E8B57]/10 hover:bg-[#2E8B57]/20 text-[#2E8B57] font-bold transition flex items-center gap-1"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Mark Taken</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
