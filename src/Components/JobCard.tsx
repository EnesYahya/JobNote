import React, { useState } from 'react';
import {
  AlertTriangle,
  AlertCircle,
  Briefcase,
  Calendar,
  Trash2,
  ExternalLink,
  Globe,
  Linkedin,
  Monitor,
  Building2,
  Share2,
  Edit2,
  Check,
  X
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { JobApplication, JobStatus, ApplicationPlatform } from '../Interfaces';

interface JobCardProps {
  job: JobApplication;
  onUpdate: (updated: JobApplication) => void;
  onDelete: (id: string) => void;
}

const statusColors: Record<JobStatus, string> = {
  'To Apply': 'bg-slate-100 text-slate-700 border-slate-200',
  'Applied': 'bg-blue-100 text-blue-700 border-blue-200',
  'English Test': 'bg-indigo-100 text-indigo-700 border-indigo-200',
  'General Aptitude Test': 'bg-violet-100 text-violet-700 border-violet-200',
  'Case Study': 'bg-fuchsia-100 text-fuchsia-700 border-fuchsia-200',
  'Group Case': 'bg-fuchsia-100 text-fuchsia-700 border-fuchsia-200',
  'Video Interview': 'bg-yellow-100 text-yellow-700 border-yellow-200',
  'HR Interview': 'bg-amber-100 text-amber-700 border-amber-200',
  'Technical Interview': 'bg-orange-100 text-orange-700 border-orange-200',
  'Technical Test': 'bg-rose-100 text-rose-700 border-rose-200',
  'Offer': 'bg-emerald-100 text-emerald-700 border-emerald-200',
  'Rejected': 'bg-red-100 text-red-700 border-red-200',
};

const PlatformIcon: React.FC<{ platform: ApplicationPlatform, className?: string }> = ({ platform, className }) => {
  switch (platform) {
    case 'LinkedIn': return <img src="/logo_linkedin.png" alt="LinkedIn" className={`object-contain ${className}`} />;
    case 'Youthall': return <img src="/logo_youthall.png" alt="Youthall" className={`object-contain ${className}`} />;
    case 'Kariyer.net': return <img src="/logo_kariyernet.png" alt="Kariyer.net" className={`object-contain ${className}`} />;
    case 'Indeed': return <img src="/logo_indeed.jpg" alt="Indeed" className={`object-contain rounded-[4px] ${className}`} />;
    case 'Company Website': return <Building2 className={className} />;
    default: return <Share2 className={className} />;
  }
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
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    company: job.company,
    position: job.position,
    date: job.date,
    dueDate: job.dueDate || '',
    platform: job.platform,
    url: job.url || ''
  });

  const dueStatus = getDueStatus(job.dueDate);

  // Group statuses
  const activeStatuses = job.statusPipeline && job.statusPipeline.length > 0
    ? job.statusPipeline
    : [{ name: 'To Apply' as JobStatus, isCompleted: false, note: '', links: [] }];

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const confirmed = window.confirm('Are you sure you want to delete this job application?');
    if (confirmed) onDelete(job.id);
  };

  const handleLinkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onUpdate({
      ...job,
      ...editForm
    });
    setIsEditing(false);
  };

  const cancelEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setEditForm({
      company: job.company,
      position: job.position,
      date: job.date,
      dueDate: job.dueDate || '',
      platform: job.platform,
      url: job.url || ''
    });
    setIsEditing(false);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  if (isEditing) {
    return (
      <div className="flex min-h-[160px] flex-col gap-3 rounded-3xl border border-indigo-300 bg-white/95 p-5 shadow-xl backdrop-blur-md transition-all">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-bold text-indigo-700 uppercase tracking-wider">Edit Job Posting</h3>
          <div className="flex gap-2">
            <button onClick={handleSave} className="p-1.5 bg-emerald-100 text-emerald-600 hover:bg-emerald-200 rounded-lg"><Check className="h-4 w-4" /></button>
            <button onClick={cancelEdit} className="p-1.5 bg-slate-100 text-slate-500 hover:bg-slate-200 rounded-lg"><X className="h-4 w-4" /></button>
          </div>
        </div>
        <input type="text" name="position" value={editForm.position} onChange={handleEditChange} placeholder="Position Name" className="w-full text-sm border-b border-slate-200 px-2 py-1 outline-none focus:border-indigo-400 font-bold" />
        <input type="text" name="company" value={editForm.company} onChange={handleEditChange} placeholder="Company Name" className="w-full text-sm border-b border-slate-200 px-2 py-1 outline-none focus:border-indigo-400" />
        <div className="grid grid-cols-2 gap-2 mt-2">
          <select name="platform" value={editForm.platform} onChange={handleEditChange} className="w-full text-xs border border-slate-200 rounded px-2 py-1 outline-none focus:border-indigo-400">
            <option value="LinkedIn">LinkedIn</option>
            <option value="Youthall">Youthall</option>
            <option value="Kariyer.net">Kariyer.net</option>
            <option value="Indeed">Indeed</option>
            <option value="Company Website">Company Website</option>
            <option value="Other">Other</option>
          </select>
          <input type="url" name="url" value={editForm.url} onChange={handleEditChange} placeholder="URL" className="w-full text-xs border border-slate-200 rounded px-2 py-1 outline-none focus:border-indigo-400" />
        </div>
        <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
          <div>
            <label className="block text-slate-500 mb-1">Log Date</label>
            <input type="date" name="date" value={editForm.date} onChange={handleEditChange} className="w-full border border-slate-200 rounded px-2 py-1 outline-none focus:border-indigo-400" />
          </div>
          <div>
            <label className="block text-slate-500 mb-1">Due Date</label>
            <input type="date" name="dueDate" value={editForm.dueDate} onChange={handleEditChange} className="w-full border border-slate-200 rounded px-2 py-1 outline-none focus:border-indigo-400" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative flex min-h-[160px] flex-col gap-4 rounded-3xl border border-slate-200 bg-white/95 p-5 shadow-lg backdrop-blur-md transition-all hover:-translate-y-1 hover:shadow-xl hover:border-indigo-200">

      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-1 items-start gap-4">
          <div className="flex flex-col items-center gap-1">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white border border-slate-100 text-slate-600 shadow-sm group-hover:border-indigo-200 transition-colors overflow-hidden p-2">
              <PlatformIcon platform={job.platform} className="h-8 w-8" />
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <Link to={`/job/${job.id}`} className="hover:underline flex-1 truncate">
                <h3 className="truncate text-lg font-bold text-slate-900 group-hover:text-indigo-700 transition-colors">
                  {job.position}
                </h3>
              </Link>
              {job.url && (
                <a
                  href={job.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleLinkClick}
                  className="text-slate-400 hover:text-indigo-600 transition-colors shrink-0"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
            </div>
            <p className="truncate text-sm font-medium text-slate-500">
              {job.company}
            </p>
          </div>
        </div>

        <div className="flex flex-shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsEditing(true); }}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-500 opacity-0 group-hover:opacity-100 transition-all hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200"
            title="Edit Details"
          >
            <Edit2 className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-red-100 bg-red-50 text-red-500 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-100"
            title="Delete Posting"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 mt-1">
        {activeStatuses.map((status, index) => (
          <React.Fragment key={index}>
            <span
              className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1 text-[11px] font-bold shadow-sm ${statusColors[status.name]}`}
            >
              {status.isCompleted ? (
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              ) : (
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
              )}
              {status.name}
            </span>
          </React.Fragment>
        ))}
        {/* Waiting / Completed indicator overall */}
        {activeStatuses.some(s => !s.isCompleted) ? (
          <span className="ml-auto text-[10px] font-bold uppercase tracking-wider text-amber-500 bg-amber-50 px-2 py-0.5 rounded border border-amber-100/50">
            Waiting
          </span>
        ) : (
          <span className="ml-auto text-[10px] font-bold uppercase tracking-wider text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100/50">
            Completed
          </span>
        )}
      </div>

      <div className="mt-auto flex flex-wrap items-end justify-between gap-3 pt-3 border-t border-slate-100/80">
        <div className="flex flex-wrap gap-2 text-xs text-slate-500">
          <div className="inline-flex items-center gap-1.5 rounded-lg bg-slate-50 px-2 py-1 font-medium">
            <Calendar className="h-3.5 w-3.5 text-slate-400" />
            <span>{job.isProcessingDate ? 'Processing Date:' : 'Applied on'} {job.date || 'N/A'}</span>
          </div>
          {job.dueDate && (
            <div className={`inline-flex items-center gap-1.5 rounded-lg px-2 py-1 font-medium ${dueStatus === 'ended' ? 'bg-red-50 text-red-600' : dueStatus === 'soon' ? 'bg-amber-50 text-amber-600' : 'bg-slate-50 text-slate-500'}`}>
              <Calendar className={`h-3.5 w-3.5 ${dueStatus === 'ended' ? 'text-red-500' : dueStatus === 'soon' ? 'text-amber-500' : 'text-slate-400'}`} />
              <span>Due by {job.dueDate}</span>
            </div>
          )}
        </div>

        <Link
          to={`/job/${job.id}`}
          className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-md transition-all hover:bg-indigo-600 hover:shadow-lg active:scale-95 ml-auto"
        >
          View Details
        </Link>
      </div>

      {dueStatus === 'soon' && (
        <div className="absolute -top-3 -right-3 flex items-center gap-1.5 rounded-full bg-rose-500 px-3 py-1 shadow-lg border-2 border-white">
          <AlertTriangle className="h-3 w-3 text-white" />
          <span className="text-[10px] font-bold text-white uppercase tracking-wider">Ending soon</span>
        </div>
      )}

      {dueStatus === 'ended' && (
        <div className="absolute -top-3 -right-3 flex items-center gap-1.5 rounded-full bg-slate-600 px-3 py-1 shadow-lg border-2 border-white">
          <AlertCircle className="h-3 w-3 text-white" />
          <span className="text-[10px] font-bold text-white uppercase tracking-wider">Ended</span>
        </div>
      )}

    </div>
  );
};

export default JobCard;
