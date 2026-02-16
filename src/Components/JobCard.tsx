import React, { useState } from 'react';
import {
  AlertTriangle,
  AlertCircle,
  Briefcase,
  Calendar,
  StickyNote,
  Trash2,
  Pencil,
} from 'lucide-react';
import { JobApplication, JobStatus } from '../Interfaces';

interface JobCardProps {
  job: JobApplication;
  onUpdate: (updated: JobApplication) => void;
  onDelete: (id: string) => void;
}

const statusColors: Record<JobStatus, string> = {
  'To Apply': 'bg-slate-100 text-slate-700 border-slate-200',
  Applied: 'bg-blue-100 text-blue-700 border-blue-200',
  'Video Interview': 'bg-yellow-100 text-yellow-700 border-yellow-200',
  Assessments: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  'Video + Assessments': 'bg-purple-100 text-purple-700 border-purple-200',
  'HR Interview': 'bg-amber-100 text-amber-700 border-amber-200',
  'Technical Interview': 'bg-orange-100 text-orange-700 border-orange-200',
  Offer: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  Rejected: 'bg-red-100 text-red-700 border-red-200',
};

type DueStatus = 'none' | 'soon' | 'ended';

const getDueStatus = (dueDate?: string): DueStatus => {
  if (!dueDate) return 'none';

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const due = new Date(dueDate);
  if (Number.isNaN(due.getTime())) return 'none';

  const diffMs = due.getTime() - today.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) return 'ended';
  if (diffDays <= 3) return 'soon';

  return 'none';
};


const JobCard: React.FC<JobCardProps> = ({ job, onUpdate, onDelete }) => {
  const [editMode, setEditMode] = useState(false);
  const [status, setStatus] = useState<JobStatus>(job.status);
  const [note, setNote] = useState(job.note);
  const [dueDate, setDueDate] = useState(job.dueDate || '');

  const handleSave = () => {
    if (
      status !== job.status ||
      note !== job.note ||
      dueDate !== (job.dueDate || '')
    ) {
      onUpdate({ ...job, status, note, dueDate: dueDate || undefined });
    }
    setEditMode(false);
  };

  const handleCancel = () => {
    setStatus(job.status);
    setNote(job.note);
    setDueDate(job.dueDate || '');
    setEditMode(false);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatus(e.target.value as JobStatus);
  };

  const dueStatus = getDueStatus(job.dueDate);

  return (
    <div className="flex min-h-[160px] flex-col gap-4 rounded-xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
            <Briefcase className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h3 className="break-words text-base font-semibold text-slate-900">
              {job.position}
            </h3>
            <p className="break-words text-sm text-slate-500">
              {job.company}
            </p>
          </div>
        </div>

        <div className="flex flex-shrink-0 items-center gap-2">
          <span
            className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium ${statusColors[status]}`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            {status}
          </span>

          <button
            type="button"
            onClick={() => setEditMode((prev) => !prev)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-700"
          >
            <Pencil className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => onDelete(job.id)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-red-100 bg-red-50 text-red-500 hover:bg-red-100"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-2.5 py-1">
          <Calendar className="h-3.5 w-3.5" />
          <span>Applied on {job.date || 'N/A'}</span>
        </div>
            {job.dueDate && (
            <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-2.5 py-1">
            <Calendar className="h-3.5 w-3.5" />
            <span>

              {`Due by ${job.dueDate}`}
            </span>
            </div>
            )}
        {!job.dueDate && (
          <button
            type="button"
            onClick={() => setEditMode(true)}
            className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-slate-300 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-600 hover:border-sky-300 hover:text-sky-700 hover:bg-sky-50"
          >
            <Calendar className="h-3 w-3" />
            <span>Set due date</span>
          </button>
        )}
      </div>
      <div className="mt-auto flex items-end justify-between">
        <div>
          {dueStatus === 'soon' && (
            <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs text-amber-700">
              <AlertTriangle className="h-3.5 w-3.5" />
              <span>Ending soon</span>
            </div>
          )}

          {dueStatus === 'ended' && (
            <div className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-xs text-red-700">
              <AlertCircle className="h-3.5 w-3.5" />
              <span>Ended</span>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => setEditMode(true)}
          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium transition ${
            job.note && job.note.trim()
              ? 'border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-100'
              : 'border-dashed border-slate-300 bg-white text-slate-600 hover:border-sky-300 hover:text-sky-700 hover:bg-sky-50'
          }`}
        >
          <StickyNote className="h-3.5 w-3.5" />
          <span>{job.note && job.note.trim() ? 'View notes' : 'Add notes'}</span>
        </button>
      </div>

      {editMode && (
        <div className="mt-1 space-y-3 rounded-lg bg-slate-50/80 p-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-600">
                Status
              </label>
              <select
                value={status}
                onChange={handleStatusChange}
                className="w-full rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-800 shadow-sm outline-none ring-0 focus:border-sky-400 focus:ring-1 focus:ring-sky-200"
              >
                <option value="To Apply">To Apply</option>
                <option value="Applied">Applied</option>
                <option value="Video Interview">Video Interview</option>
                <option value="Assessments">Assessments</option>
                <option value="Video + Assessments">Video + Assessments</option>
                <option value="HR Interview">HR Interview</option>
                <option value="Technical Interview">Technical Interview</option>
                <option value="Offer">Offer</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-600">
                Due date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-800 shadow-sm outline-none ring-0 focus:border-sky-400 focus:ring-1 focus:ring-sky-200"
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <label className="block text-xs font-medium text-slate-600">
                Notes
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
                className="w-full resize-none rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-800 shadow-sm outline-none ring-0 focus:border-sky-400 focus:ring-1 focus:ring-sky-200"
                placeholder="Add notes about this application: contact person, interview prep, follow-up dates..."
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={handleCancel}
              className="inline-flex items-center justify-center rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center justify-center rounded-md bg-sky-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-sky-700"
            >
              Save changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobCard;


