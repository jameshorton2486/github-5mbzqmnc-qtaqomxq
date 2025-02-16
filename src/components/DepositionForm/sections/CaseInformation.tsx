import React from 'react';
import { FileText, Globe, Upload } from 'lucide-react';
import { Input } from '../../ui/Input';
import { Button } from '../../ui/Button';
import type { DepositionFormData } from '../types';

interface CaseInformationProps {
  formData: DepositionFormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  uploadingFile: boolean;
}

export function CaseInformation({ formData, onChange, onFileUpload, uploadingFile }: CaseInformationProps) {
  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Case Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Case Name *"
          name="caseName"
          value={formData.caseName}
          onChange={onChange}
          required
          placeholder="e.g., Smith vs. Johnson"
          icon={<FileText className="h-5 w-5" />}
        />
        <Input
          label="Case Number *"
          name="caseNumber"
          value={formData.caseNumber}
          onChange={onChange}
          required
          placeholder="e.g., 2025-CV-12345"
          icon={<FileText className="h-5 w-5" />}
        />
        <Input
          label="Jurisdiction *"
          name="jurisdiction"
          value={formData.jurisdiction}
          onChange={onChange}
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
              onChange={onFileUpload}
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
              {uploadingFile ? 'Uploading...' : 'Upload Court Order'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}