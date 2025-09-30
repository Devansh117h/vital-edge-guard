import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Patient } from '@/types/health';
import { generateMockVitals } from '@/utils/mockData';
import { Save, X } from 'lucide-react';

interface PatientFormModalProps {
  patient: Patient | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (patient: Patient) => void;
  mode: 'add' | 'edit';
}

const PatientFormModal: React.FC<PatientFormModalProps> = ({ 
  patient, 
  isOpen, 
  onClose, 
  onSave, 
  mode 
}) => {
  const [formData, setFormData] = useState({
    name: patient?.name || '',
    age: patient?.age || '',
    roomNumber: patient?.roomNumber || ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  React.useEffect(() => {
    if (patient) {
      setFormData({
        name: patient.name,
        age: patient.age.toString(),
        roomNumber: patient.roomNumber
      });
    } else {
      setFormData({
        name: '',
        age: '',
        roomNumber: ''
      });
    }
    setErrors({});
  }, [patient, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Patient name is required';
    }

    if (!formData.age || isNaN(Number(formData.age)) || Number(formData.age) < 1 || Number(formData.age) > 120) {
      newErrors.age = 'Please enter a valid age (1-120)';
    }

    if (!formData.roomNumber.trim()) {
      newErrors.roomNumber = 'Room number is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    const savedPatient: Patient = {
      id: patient?.id || `P${Date.now()}`,
      name: formData.name.trim(),
      age: Number(formData.age),
      roomNumber: formData.roomNumber.trim(),
      status: patient?.status || 'normal',
      vitals: patient?.vitals || [],
      currentVitals: patient?.currentVitals || generateMockVitals(),
      anomalyDetected: patient?.anomalyDetected || false,
      lastUpdated: new Date()
    };

    onSave(savedPatient);
    onClose();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-surface">
        <DialogHeader className="pb-4 border-b border-border">
          <DialogTitle className="text-xl font-semibold text-foreground">
            {mode === 'add' ? 'Add New Patient' : 'Edit Patient Details'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-foreground">
              Patient Name *
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter patient's full name"
              className={errors.name ? 'border-status-critical' : ''}
            />
            {errors.name && (
              <p className="text-xs text-status-critical">{errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="age" className="text-sm font-medium text-foreground">
              Age *
            </Label>
            <Input
              id="age"
              type="number"
              value={formData.age}
              onChange={(e) => handleInputChange('age', e.target.value)}
              placeholder="Enter patient's age"
              min="1"
              max="120"
              className={errors.age ? 'border-status-critical' : ''}
            />
            {errors.age && (
              <p className="text-xs text-status-critical">{errors.age}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="roomNumber" className="text-sm font-medium text-foreground">
              Room Number *
            </Label>
            <Input
              id="roomNumber"
              value={formData.roomNumber}
              onChange={(e) => handleInputChange('roomNumber', e.target.value)}
              placeholder="e.g., ICU-101, Room-205"
              className={errors.roomNumber ? 'border-status-critical' : ''}
            />
            {errors.roomNumber && (
              <p className="text-xs text-status-critical">{errors.roomNumber}</p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <Button variant="outline" onClick={onClose} className="flex items-center gap-2">
            <X className="w-4 h-4" />
            Cancel
          </Button>
          <Button onClick={handleSave} className="flex items-center gap-2">
            <Save className="w-4 h-4" />
            {mode === 'add' ? 'Add Patient' : 'Save Changes'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PatientFormModal;