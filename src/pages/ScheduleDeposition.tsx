import React, { useState } from 'react';
import { DepositionForm } from '../components/DepositionForm';
import { Toast } from '../components/ui/Toast';
import { logger } from '../lib/logger';

export function ScheduleDeposition() {
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const handleSuccess = () => {
    logger.info('Deposition scheduled successfully');
    setNotification({
      type: 'success',
      message: 'Deposition scheduled successfully'
    });
  };

  const handleError = (error: Error) => {
    logger.error('Failed to schedule deposition', error);
    setNotification({
      type: 'error',
      message: error.message || 'Failed to schedule deposition'
    });
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">Schedule a Deposition</h1>
          <p className="mt-2 text-muted-foreground">
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