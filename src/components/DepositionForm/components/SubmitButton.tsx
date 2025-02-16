import React from 'react';
import { Calendar } from 'lucide-react';
import { Button } from '../../ui/Button';

interface SubmitButtonProps {
  loading: boolean;
  disabled: boolean;
}

export function SubmitButton({ loading, disabled }: SubmitButtonProps) {
  return (
    <div className="flex justify-end">
      <Button
        type="submit"
        disabled={disabled}
        loading={loading}
        icon={<Calendar className="h-5 w-5" />}
      >
        Schedule Deposition
      </Button>
    </div>
  );
}