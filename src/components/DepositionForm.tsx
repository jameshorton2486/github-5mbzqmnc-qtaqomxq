import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  FileText, 
  Video, 
  Upload,
  Globe,
  MessageSquare,
  Building,
  Mail,
  Phone
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import { validateDeposition } from '../lib/utils/validation';

interface DepositionFormProps {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function DepositionForm({ onSuccess, onError }: DepositionFormProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [courtOrderFile, setCourtOrderFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
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

  // Auto-populate attorney details from user metadata
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
      // Validate form data
      const validatedData = validateDeposition({
        ...formData,
        duration_hours: parseInt(formData.duration)
      });

      const { error } = await supabase
        .from('depositions')
        .insert([{
          user_id: user?.id,
          case_name: validatedData.case_name,
          case_number: validatedData.case_number,
          jurisdiction: validatedData.jurisdiction,
          scheduled_date: `${formData.date}T${formData.startTime}`,
          duration_hours: parseInt(formData.duration),
          location: validatedData.location,
          location_type: validatedData.location_type,
          platform: formData.platform,
          meeting_link: formData.meetingLink,
          witness_name: validatedData.witness_name,
          witness_title: formData.witnessTitle,
          witness_email: validatedData.witness_email,
          witness_phone: formData.witnessPhone,
          court_reporter: validatedData.court_reporter,
          videographer: formData.videographer,
          interpreter_required: formData.interpreterRequired,
          interpreter_language: formData.interpreterLanguage,
          exhibits_expected: formData.exhibitsExpected,
          exhibit_delivery_method: formData.exhibitDeliveryMethod,
          court_order_file_path: formData.courtOrderFilePath,
          attorney_name: validatedData.attorney_name,
          attorney_email: validatedData.attorney_email,
          attorney_phone: validatedData.attorney_phone,
          law_firm: validatedData.law_firm,
          notes: formData.notes,
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

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Case Information */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Case Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Case Name *"
            name="caseName"
            value={formData.caseName}
            onChange={handleChange}
            required
            placeholder="e.g., Smith vs. Johnson"
            icon={<FileText className="h-5 w-5" />}
          />
          <Input
            label="Case Number *"
            name="caseNumber"
            value={formData.caseNumber}
            onChange={handleChange}
            required
            placeholder="e.g., 2025-CV-12345"
            icon={<FileText className="h-5 w-5" />}
          />
          <Input
            label="Jurisdiction *"
            name="jurisdiction"
            value={formData.jurisdiction}
            onChange={handleChange}
            required
            placeholder="e.g., Southern District of Texas"
            icon={<Globe className="h-5 w-5" />}
          />
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Court Order (if applicable)
            </label>
            <div className="relative">
              <input
                type="file"
                id="courtOrder"
                accept=".pdf,.doc,.docx"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button
                type="button"
                variant="secondary"
                onClick={() => document.getElementById('courtOrder')?.click()}
                disabled={uploadingFile}
                icon={<Upload className="h-5 w-5" />}
                className="w-full"
              >
                {uploadingFile ? 'Uploading...' : courtOrderFile ? courtOrderFile.name : 'Upload Court Order'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Schedule */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Schedule</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Input
            type="date"
            label="Date *"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            icon={<Calendar className="h-5 w-5" />}
          />
          <Input
            type="time"
            label="Start Time *"
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
            required
            icon={<Clock className="h-5 w-5" />}
          />
          <Select
            label="Duration (hours) *"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
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

      {/* Location */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Location</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Select
            label="Location Type *"
            name="locationType"
            value={formData.locationType}
            onChange={handleChange}
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
                onChange={handleChange}
                required
                placeholder="e.g., Zoom, Teams"
                icon={<Video className="h-5 w-5" />}
              />
              <Input
                label="Meeting Link *"
                name="meetingLink"
                value={formData.meetingLink}
                onChange={handleChange}
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
              onChange={handleChange}
              required
              placeholder="Full address"
              icon={<MapPin className="h-5 w-5" />}
            />
          )}
        </div>
      </div>

      {/* Witness Information */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Witness Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Witness Name *"
            name="witnessName"
            value={formData.witnessName}
            onChange={handleChange}
            required
            icon={<Users className="h-5 w-5" />}
          />
          <Input
            label="Witness Title"
            name="witnessTitle"
            value={formData.witnessTitle}
            onChange={handleChange}
            icon={<Users className="h-5 w-5" />}
          />
          <Input
            type="email"
            label="Witness Email *"
            name="witnessEmail"
            value={formData.witnessEmail}
            onChange={handleChange}
            required
            icon={<Mail className="h-5 w-5" />}
          />
          <Input
            type="tel"
            label="Witness Phone"
            name="witnessPhone"
            value={formData.witnessPhone}
            onChange={handleChange}
            icon={<Phone className="h-5 w-5" />}
          />
        </div>
      </div>

      {/* Services */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Services</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Court Reporter *"
            name="courtReporter"
            value={formData.courtReporter}
            onChange={handleChange}
            required
            icon={<FileText className="h-5 w-5" />}
          />
          <Input
            label="Videographer"
            name="videographer"
            value={formData.videographer}
            onChange={handleChange}
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
                onChange={handleChange}
                className="h-4 w-4 text-purple-500 focus:ring-purple-500 border-gray-600 rounded"
              />
              <span className="ml-2 text-sm text-gray-300">Interpreter Required</span>
            </label>
            {formData.interpreterRequired && (
              <Input
                name="interpreterLanguage"
                value={formData.interpreterLanguage}
                onChange={handleChange}
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
                onChange={handleChange}
                className="h-4 w-4 text-purple-500 focus:ring-purple-500 border-gray-600 rounded"
              />
              <span className="ml-2 text-sm text-gray-300">Exhibits Expected</span>
            </label>
            {formData.exhibitsExpected && (
              <Select
                name="exhibitDeliveryMethod"
                value={formData.exhibitDeliveryMethod}
                onChange={handleChange}
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

      {/* Additional Notes */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Additional Notes</h3>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={4}
          className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          placeholder="Any special requirements or additional information..."
        />
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={loading || uploadingFile}
          loading={loading}
          icon={<Calendar className="h-5 w-5" />}
        >
          Schedule Deposition
        </Button>
      </div>
    </form>
  );
}