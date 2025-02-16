import React from 'react';
import { Calendar, Clock } from 'lucide-react';
import { Input } from '../../ui/Input';
import { Select } from '../../ui/Select';
import type { DepositionFormData } from '../types';

interface ScheduleProps {
  formData: DepositionFormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export function Schedule({ formData, onChange }: ScheduleProps) {
  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Schedule</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Input
          type="date"
          label="Date *"
          name="date"
          value={formData.date}
          onChange={onChange}
          required
          icon={<Calendar className="h-5 w-5" />}
        />
        <Input
          type="time"
          label="Start Time *"
          name="startTime"
          value={formData.startTime}
          onChange={onChange}
          required
          icon={<Clock className="h-5 w-5" />}
        />
        <Select
          label="Duration (hours) *"
          name="duration"
          value={formData.duration}
          onChange={onChange}
          required
          options={[
            { value: '1', label: '1 hour' },
            { value: '2', label: '2 hours' },
            { value: '3', label: '3 hours' },
            { value: '4', label: '4 hours' },
            { value: '5', label: '5 hours' },
            { value: '6', label: '6 hours' },
            { value: '7', label: '7 hours' },
            { value: '8', label: '8 hours' }
          ]}
          icon={<Clock className="h-5 w-5" />}
        />
      </div>
    </div>
  );
}