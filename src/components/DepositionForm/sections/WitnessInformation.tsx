import React from 'react';
import { Users, Mail, Phone } from 'lucide-react';
import { Input } from '../../ui/Input';
import type { DepositionFormData } from '../types';

interface WitnessInformationProps {
  formData: DepositionFormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function WitnessInformation({ formData, onChange }: WitnessInformationProps) {
  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Witness Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Witness Name *"
          name="witnessName"
          value={formData.witnessName}
          onChange={onChange}
          required
          icon={<Users className="h-5 w-5" />}
        />
        <Input
          label="Witness Title"
          name="witnessTitle"
          value={formData.witnessTitle}
          onChange={onChange}
          icon={<Users className="h-5 w-5" />}
        />
        <Input
          type="email"
          label="Witness Email *"
          name="witnessEmail"
          value={formData.witnessEmail}
          onChange={onChange}
          required
          icon={<Mail className="h-5 w-5" />}
        />
        <Input
          type="tel"
          label="Witness Phone"
          name="witnessPhone"
          value={formData.witnessPhone}
          onChange={onChange}
          icon={<Phone className="h-5 w-5" />}
        />
      </div>
    </div>
  );
}