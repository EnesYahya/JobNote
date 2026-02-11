export type JobStatus = 'To Apply' | 'Applied' | 'Interview' | 'Offer' | 'Rejected';

export interface JobApplication {
  id: string;
  company: string;
  position: string;
  date: string;
  status: JobStatus;
  note: string;
}
