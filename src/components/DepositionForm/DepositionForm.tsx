import React from 'react';
import { CaseInformation } from './sections/CaseInformation';
import { Schedule } from './sections/Schedule';
import { Location } from './sections/Location';
import { WitnessInformation } from './sections/WitnessInformation';
import { Services } from './sections/Services';
import { AdditionalNotes } from './sections/AdditionalNotes';
import { SubmitButton } from './components/SubmitButton';
import { useDepositionForm } from './hooks/useDepositionForm';

interface DepositionFormProps {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function DepositionForm({ onSuccess, onError }: DepositionFormProps) {
  const {
    formData,
    loading,
    uploadingFile,
    handleSubmit,
    handleChange,
    handleFileUpload
  } = useDepositionForm({ onSuccess, onError });

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <CaseInformation
        formData={formData}
        onChange={handleChange}
        onFileUpload={handleFileUpload}
        uploadingFile={uploadingFile}
      />

      <Schedule
        formData={formData}
        onChange={handleChange}
      />

      <Location
        formData={formData}
        onChange={handleChange}
      />

      <WitnessInformation
        formData={formData}
        onChange={handleChange}
      />

      <Services
        formData={formData}
        onChange={handleChange}
      />

      <AdditionalNotes
        formData={formData}
        onChange={handleChange}
      />

      <SubmitButton
        loading={loading}
        disabled={loading || uploadingFile}
      />
    </form>
  );
}