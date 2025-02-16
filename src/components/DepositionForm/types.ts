export interface DepositionFormData {
  caseName: string;
  caseNumber: string;
  jurisdiction: string;
  date: string;
  startTime: string;
  duration: string;
  location: string;
  locationType: 'remote' | 'in-person' | 'hybrid';
  platform: string;
  meetingLink: string;
  witnessName: string;
  witnessTitle: string;
  witnessEmail: string;
  witnessPhone: string;
  courtReporter: string;
  videographer: string;
  interpreterRequired: boolean;
  interpreterLanguage: string;
  exhibitsExpected: boolean;
  exhibitDeliveryMethod: string;
  courtOrderFilePath: string;
  attorneyName: string;
  attorneyEmail: string;
  attorneyPhone: string;
  lawFirm: string;
  notes: string;
}