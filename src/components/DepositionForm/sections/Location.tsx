import React from 'react';
import { MapPin, Video } from 'lucide-react';
import { Input } from '../../ui/Input';
import { Select } from '../../ui/Select';
import type { DepositionFormData } from '../types';

interface LocationProps {
  formData: DepositionFormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export function Location({ formData, onChange }: LocationProps) {
  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Location</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Select
          label="Location Type *"
          name="locationType"
          value={formData.locationType}
          onChange={onChange}
          required
          options={[
            { value: 'remote', label: 'Remote' },
            { value: 'in-person', label: 'In-Person' },
            { value: 'hybrid', label: 'Hybrid' }
          ]}
          icon={<MapPin className="h-5 w-5" />}
        />
        {formData.locationType === 'remote' || formData.locationType === 'hybrid' ? (
          <>
            <Input
              label="Video Platform *"
              name="platform"
              value={formData.platform}
              onChange={onChange}
              required
              placeholder="e.g., Zoom, Teams"
              icon={<Video className="h-5 w-5" />}
            />
            <Input
              label="Meeting Link *"
              name="meetingLink"
              value={formData.meetingLink}
              onChange={onChange}
              required
              placeholder="https://..."
              icon={<Video className="h-5 w-5" />}
            />
          </>
        ) : (
          <Input
            label="Address *"
            name="location"
            value={formData.location}
            onChange={onChange}
            required
            placeholder="Full address"
            icon={<MapPin className="h-5 w-5" />}
          />
        )}
      </div>
    </div>
  );
}