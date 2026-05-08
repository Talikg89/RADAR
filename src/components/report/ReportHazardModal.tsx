import { useState } from 'react';
import { X } from 'lucide-react';
import type { HazardType } from '../../types/hazard';

const hazardTypes: HazardType[] = [
  'accident',
  'road works',
  'pothole',
  'traffic jam',
  'vehicle stopped',
  'dangerous curve',
];

interface ReportHazardModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (type: HazardType, description: string) => void;
}

export function ReportHazardModal({ open, onClose, onSubmit }: ReportHazardModalProps) {
  const [selectedType, setSelectedType] = useState<HazardType>('accident');
  const [description, setDescription] = useState('');

  if (!open) {
    return null;
  }

  const handleSubmit = () => {
    onSubmit(selectedType, description.trim());
    setDescription('');
    setSelectedType('accident');
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <div className="modal glass-card" onClick={(event) => event.stopPropagation()} role="dialog" aria-modal="true">
        <button type="button" className="modal__close" onClick={onClose} aria-label="Close report modal">
          <X size={18} />
        </button>

        <p className="eyebrow">Community reporting</p>
        <h3>Report a hazard</h3>
        <p className="modal__copy">Submit a quick road alert. Reports are stored in local state for this demo build.</p>

        <label className="field">
          <span>Hazard type</span>
          <select value={selectedType} onChange={(event) => setSelectedType(event.target.value as HazardType)}>
            {hazardTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>Description</span>
          <textarea
            rows={4}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Example: Large debris near exit ramp, drivers braking abruptly."
          />
        </label>

        <button type="button" className="primary-button" onClick={handleSubmit}>
          Add report
        </button>
      </div>
    </div>
  );
}
