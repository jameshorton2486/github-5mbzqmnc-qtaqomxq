import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../hooks/useAuth';
import { validateDeposition } from '../../../lib/utils/validation';
import type { DepositionFormData } from '../types';

interface UseDepositionFormOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useDepositionForm({ onSuccess, onError }: UseDepositionFormOptions) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [courtOrderFile, setCourtOrderFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<DepositionFormData>({
    caseName: '',
    caseNumber: '',
    jurisdiction: '',
    date: '',
    startTime: '',
    duration: '1',
    location: '',
    locationType: 'remote',
    platform: '',
    meetingLink: '',
    witnessName: '',
    witnessTitle: '',
    witnessEmail: '',
    witnessPhone: '',
    courtReporter: '',
    videographer: '',
    interpreterRequired: false,
    interpreterLanguage: '',
    exhibitsExpected: false,
    exhibitDeliveryMethod: '',
    courtOrderFilePath: '',
    attorneyName: '',
    attorneyEmail: '',
    attorneyPhone: '',
    lawFirm: '',
    notes: ''
  });

  useEffect(() => {
    if (user?.user_metadata) {
      setFormData(prev => ({
        ...prev,
        attorneyName: user.user_metadata.full_name || '',
        attorneyEmail: user.email || '',
        attorneyPhone: user.user_metadata.phone || '',
        lawFirm: user.user_metadata.law_firm || ''
      }));
    }
  }, [user]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingFile(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `court-orders/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('deposition-files')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      setCourtOrderFile(file);
      setFormData(prev => ({
        ...prev,
        courtOrderFilePath: filePath
      }));
    } catch (error) {
      console.error('Error uploading file:', error);
      onError?.(error instanceof Error ? error : new Error('Failed to upload file'));
    } finally {
      setUploadingFile(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const validatedData = validateDeposition({
        ...formData,
        duration_hours: parseInt(formData.duration)
      });

      const { error } = await supabase
        .from('depositions')
        .insert([{
          user_id: user?.id,
          ...validatedData,
          scheduled_date: `${formData.date}T${formData.startTime}`,
          status: 'scheduled'
        }]);

      if (error) throw error;
      onSuccess?.();
      
      // Reset form
      setFormData({
        caseName: '',
        caseNumber: '',
        jurisdiction: '',
        date: '',
        startTime: '',
        duration: '1',
        location: '',
        locationType: 'remote',
        platform: '',
        meetingLink: '',
        witnessName: '',
        witnessTitle: '',
        witnessEmail: '',
        witnessPhone: '',
        courtReporter: '',
        videographer: '',
        interpreterRequired: false,
        interpreterLanguage: '',
        exhibitsExpected: false,
        exhibitDeliveryMethod: '',
        courtOrderFilePath: '',
        attorneyName: user?.user_metadata?.full_name || '',
        attorneyEmail: user?.email || '',
        attorneyPhone: user?.user_metadata?.phone || '',
        lawFirm: user?.user_metadata?.law_firm || '',
        notes: ''
      });
      setCourtOrderFile(null);
    } catch (error) {
      console.error('Error scheduling deposition:', error);
      onError?.(error instanceof Error ? error : new Error('Failed to schedule deposition'));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  return {
    formData,
    loading,
    uploadingFile,
    courtOrderFile,
    handleSubmit,
    handleChange,
    handleFileUpload
  };
}