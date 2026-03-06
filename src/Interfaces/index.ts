export type ApplicationPlatform =
  | 'LinkedIn'
  | 'Youthall'
  | 'Kariyer.net'
  | 'Indeed'
  | 'Company Website'
  | 'Other';

export type JobStatus =
  | 'To Apply'
  | 'Applied'
  | 'English Test'
  | 'General Aptitude Test'
  | 'Case Study'
  | 'Group Case'
  | 'Video Interview'
  | 'HR Interview'
  | 'Technical Interview'
  | 'Technical Test'
  | 'Rejected'
  | 'Offer';

export interface StatusDetail {
  name: JobStatus;
  isCompleted: boolean;
  note: string;
  links: string[];
}

export interface JobApplication {
  id: string;
  company: string;
  position: string;
  date: string;
  isProcessingDate?: boolean;
  dueDate?: string;
  statusPipeline: StatusDetail[];
  platform: ApplicationPlatform;
  url: string;
  note: string;
}
