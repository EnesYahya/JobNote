import React, { useEffect, useState } from 'react';
import { ClipboardList, Search } from 'lucide-react';
import { JobApplication, JobStatus } from '../Interfaces';
import AddJobForm from '../Components/AddJobForm';
import JobCard from '../Components/JobCard';

const STORAGE_KEY = 'jobnote_applications';

type FilterStatus = JobStatus | 'All';

const Dashboard: React.FC = () => {
  const [applications, setApplications] = useState<JobApplication[]>(() => {
    try {
      if (typeof window === 'undefined') return [];
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      return JSON.parse(raw) as JobApplication[];
    } catch {
      return [];
    }
  });
  const [selectedStatus, setSelectedStatus] = useState<FilterStatus>('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(applications));
      }
    } catch {
      // ignore write errors
    }
  }, [applications]);

  const handleAdd = (job: JobApplication) => {
    setApplications((prev) => [job, ...prev]);
  };

  const handleUpdate = (updated: JobApplication) => {
    setApplications((prev) =>
      prev.map((job) => (job.id === updated.id ? updated : job)),
    );
  };

  const handleDelete = (id: string) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this job application?',
    );
    if (!confirmed) return;

    setApplications((prev) => prev.filter((job) => job.id !== id));
  };

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredApplications = applications.filter((job) => {
    const matchesStatus =
      selectedStatus === 'All' ? true : job.status === selectedStatus;

    if (!normalizedQuery) {
      return matchesStatus;
    }

    const haystack =
      `${job.position} ${job.company} ${job.note}`.toLowerCase();

    const matchesSearch = haystack.includes(normalizedQuery);

    return matchesStatus && matchesSearch;
  });

  const statusFilters: FilterStatus[] = [
    'All',
    'To Apply',
    'Applied',
    'Video Interview',
    'Assessments',
    'Video + Assessments',
    'HR Interview',
    'Technical Interview',
    'Offer',
    'Rejected',
  ];

  const sortedApplications = filteredApplications.slice().sort((a, b) => {
    const getDueTime = (job: JobApplication) => {
      if (!job.dueDate) return Number.POSITIVE_INFINITY;
      const due = new Date(job.dueDate);
      if (Number.isNaN(due.getTime())) return Number.POSITIVE_INFINITY;
      return due.getTime();
    };

    const aTime = getDueTime(a);
    const bTime = getDueTime(b);

    if (aTime === bTime) return 0;

    return aTime - bTime;
  });

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-600 text-white shadow-sm">
              <ClipboardList className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-slate-900">
                JobNote
              </h1>
              <p className="text-xs text-slate-500">
                Track your job applications, statuses, and notes in one clean dashboard.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
            <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-700">
              Total applications: {applications.length}
            </span>
          </div>
        </header>

        <AddJobForm onAdd={handleAdd} />

        <section className="mb-4 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white/80 p-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            {statusFilters.map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setSelectedStatus(status)}
                className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium transition ${
                  selectedStatus === status
                    ? 'border-sky-500 bg-sky-50 text-sky-700'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
          <div className="relative mt-2 w-full sm:mt-0 sm:w-64">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by role, company, or notes"
              className="w-full rounded-md border border-slate-200 bg-white py-1.5 pl-8 pr-3 text-xs text-slate-900 shadow-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-200"
            />
            <Search className="pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          </div>
        </section>

        {filteredApplications.length === 0 ? (
          <section className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white/80 py-12 text-center text-sm text-slate-500">
            <ClipboardList className="mb-3 h-8 w-8 text-slate-300" />
            <p className="font-medium text-slate-600">
              {applications.length === 0
                ? 'No applications yet'
                : 'No results match your filters or search'}
            </p>
            <p className="mt-1 max-w-sm text-xs text-slate-500">
              Start by adding your first job application using the form above, then use filters and search to focus your pipeline.
            </p>
          </section>
        ) : (
          <section className="grid gap-4 md:grid-cols-2">
            {sortedApplications.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
              />
            ))}
          </section>
        )}
      </div>
    </main>
  );
};

export default Dashboard;


