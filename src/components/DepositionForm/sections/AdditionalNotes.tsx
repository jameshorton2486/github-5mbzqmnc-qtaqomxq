import React from 'react';
import type { DepositionFormData } from '../types';

interface AdditionalNotesProps {
  formData: DepositionFormData;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export function AdditionalNotes({ formData, onChange }: AdditionalNotesProps) {
  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Additional Notes</h3>
      <textarea
        name="notes"
        value={formData.notes}
        onChange={onChange}
        rows={4}
        className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        placeholder="Any special requirements or additional information..."
      />
    </div>
  );
}