import React, { useState } from 'react';
import { DepositionForm } from '../components/DepositionForm';
import { Toast } from '../components/ui/Toast';

export function ScheduleDeposition() {
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const handleSuccess = () => {
    setNotification({
      type: 'success',
      message: 'Deposition scheduled successfully'
    });
  };

  const handleError = (error: Error) => {
    setNotification({
      type: 'error',
      message: error.message || 'Failed to schedule deposition'
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">Schedule a Deposition</h1>
          <p className="mt-2 text-gray-400">
            Fill out the form below to schedule a new deposition. All fields marked with an asterisk (*) are required.
          </p>
        </div>

        <DepositionForm
          onSuccess={handleSuccess}
          onError={handleError}
        />

        {notification && (
          <Toast
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification(null)}
          />
        )}
      </div>
    </div>
  );
}