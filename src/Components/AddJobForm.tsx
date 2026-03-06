import React, { useState } from 'react';
import { Plus, Calendar } from 'lucide-react';
import { JobApplication, JobStatus, ApplicationPlatform } from '../Interfaces';

interface AddJobFormProps {
  onAdd: (job: JobApplication) => void;
}

const defaultStatus: JobStatus = 'To Apply';

const createEmptyJob = () => ({
  company: '',
  position: '',
  date: '',
  dueDate: '',
  status: defaultStatus as JobStatus,
  platform: 'Other' as ApplicationPlatform,
  url: '',
  note: '',
});

const AddJobForm: React.FC<AddJobFormProps> = ({ onAdd }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [form, setForm] = useState(createEmptyJob());
  const [errors, setErrors] = useState<{ company?: string; position?: string }>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validate = () => {
    const newErrors: { company?: string; position?: string } = {};
    if (!form.company.trim()) newErrors.company = 'Company name is required.';
    if (!form.position.trim()) newErrors.position = 'Position is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const now = new Date().toISOString().slice(0, 10);
    const isProcessingDate = !form.date;
    const finalDate = form.date || now;

    const { status, ...restForm } = form;

    const newJob: JobApplication = {
      id:
        typeof crypto !== 'undefined' && 'randomUUID' in crypto
          ? crypto.randomUUID()
          : Math.random().toString(36).slice(2),
      ...restForm,
      date: finalDate,
      isProcessingDate,
      statusPipeline: [
        { name: status, isCompleted: false, note: '', links: [] },
      ],
    };

    onAdd(newJob);
    setForm(createEmptyJob());
  };

  return (
    <section className="mb-6 rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm backdrop-blur-sm">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex w-full items-center justify-between gap-3 rounded-xl bg-slate-50 px-4 py-3 text-left text-sm font-medium text-slate-800 hover:bg-slate-100"
      >
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-100 text-sky-600">
            <Plus className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-semibold">Add new job application</p>
            <p className="text-xs text-slate-500">
              Quickly log a new role you&apos;ve applied for.
            </p>
          </div>
        </div>
        <span className="text-xs text-slate-500">
          {isOpen ? 'Hide form' : 'Show form'}
        </span>
      </button>

      {isOpen && (
        <form
          onSubmit={handleSubmit}
          className="mt-4 grid gap-4 md:grid-cols-2"
        >
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-700">
              Company Name
            </label>
            <input
              type="text"
              name="company"
              value={form.company}
              onChange={handleChange}
              placeholder="e.g. Microsoft"
              className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-200"
            />
            {errors.company && (
              <p className="text-xs text-red-500">{errors.company}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-700">
              Position
            </label>
            <input
              type="text"
              name="position"
              value={form.position}
              onChange={handleChange}
              placeholder="e.g. Frontend Engineer"
              className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-200"
            />
            {errors.position && (
              <p className="text-xs text-red-500">{errors.position}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-700">
              {form.status === 'Applied' ? 'Application Date' : 'Log Date'} (Optional)
            </label>
            <div className="relative">
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 pr-9 text-sm text-slate-900 shadow-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-200"
              />
              <Calendar className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-700">
              Due Date
            </label>
            <div className="relative">
              <input
                type="date"
                name="dueDate"
                value={form.dueDate || ''}
                onChange={handleChange}
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 pr-9 text-sm text-slate-900 shadow-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-200"
              />
              <Calendar className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-700">
              Platform
            </label>
            <select
              name="platform"
              value={form.platform}
              onChange={handleChange}
              className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-200"
            >
              <option value="LinkedIn">LinkedIn</option>
              <option value="Youthall">Youthall</option>
              <option value="Kariyer.net">Kariyer.net</option>
              <option value="Indeed">Indeed</option>
              <option value="Company Website">Company Website</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-700">
              Listing URL
            </label>
            <input
              type="url"
              name="url"
              value={form.url}
              onChange={handleChange}
              placeholder="https://..."
              className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-200"
            />
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <label className="block text-xs font-medium text-slate-700">
              Status
            </label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-200"
            >
              <option value="To Apply">To Apply</option>
              <option value="Applied">Applied</option>
              <option value="English Test">English Test</option>
              <option value="General Aptitude Test">General Aptitude Test</option>
              <option value="Case Study">Case Study</option>
              <option value="Group Case">Group Case</option>
              <option value="Video Interview">Video Interview</option>
              <option value="HR Interview">HR Interview</option>
              <option value="Technical Interview">Technical Interview</option>
              <option value="Technical Test">Technical Test</option>
              <option value="Offer">Offer</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <label className="block text-xs font-medium text-slate-700">
              Notes
            </label>
            <textarea
              name="note"
              value={form.note}
              onChange={handleChange}
              rows={3}
              placeholder="Add extra details: recruiter name, next steps, interview prep, links, etc."
              className="w-full resize-none rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-200"
            />
          </div>

          <div className="md:col-span-2 flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-md bg-sky-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-sky-700"
            >
              <Plus className="h-4 w-4" />
              Add job
            </button>
          </div>
        </form>
      )}
    </section>
  );
};

export default AddJobForm;


