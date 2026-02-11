export type JobStatus =
  | 'To Apply'
  | 'Applied'
  | 'Video Interview'
  | 'Assessments'
  | 'Video + Assessments'
  | 'HR Interview'
  | 'Technical Interview'
  | 'Offer'
  | 'Rejected';

export interface JobApplication {
  id: string;
  company: string;
  position: string;
  date: string;
  dueDate?: string;
  status: JobStatus;
  note: string;
}
