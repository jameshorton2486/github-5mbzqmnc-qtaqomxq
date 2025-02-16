import React from 'react';
import { FileText, Video } from 'lucide-react';
import { Input } from '../../ui/Input';
import { Select } from '../../ui/Select';
import type { DepositionFormData } from '../types';

interface ServicesProps {
  formData: DepositionFormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export function Services({ formData, onChange }: ServicesProps) {
  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Services</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Court Reporter *"
          name="courtReporter"
          value={formData.courtReporter}
          onChange={onChange}
          required
          icon={<FileText className="h-5 w-5" />}
        />
        <Input
          label="Videographer"
          name="videographer"
          value={formData.videographer}
          onChange={onChange}
          icon={<Video className="h-5 w-5" />}
        />
      </div>

      <div className="mt-6 space-y-4">
        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              name="interpreterRequired"
              checked={formData.interpreterRequired}
              onChange={onChange}
              className="h-4 w-4 text-purple-500 focus:ring-purple-500 border-gray-600 rounded"
            />
            <span className="ml-2 text-sm text-gray-300">Interpreter Required</span>
          </label>
          {formData.interpreterRequired && (
            <Input
              name="interpreterLanguage"
              value={formData.interpreterLanguage}
              onChange={onChange}
              placeholder="Language required"
              className="mt-2"
            />
          )}
        </div>

        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              name="exhibitsExpected"
              checked={formData.exhibitsExpected}
              onChange={onChange}
              className="h-4 w-4 text-purple-500 focus:ring-purple-500 border-gray-600 rounded"
            />
            <span className="ml-2 text-sm text-gray-300">Exhibits Expected</span>
          </label>
          {formData.exhibitsExpected && (
            <Select
              name="exhibitDeliveryMethod"
              value={formData.exhibitDeliveryMethod}
              onChange={onChange}
              className="mt-2"
              options={[
                { value: '', label: 'Select delivery method' },
                { value: 'electronic', label: 'Electronic Delivery' },
                { value: 'physical', label: 'Physical Delivery' },
                { value: 'both', label: 'Both Electronic and Physical' }
              ]}
            />
          )}
        </div>
      </div>
    </div>
  );
}