import React, { useState } from 'react';
import { Search, ArrowLeft, Briefcase, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { JobApplication, JobStatus, ApplicationPlatform } from '../Interfaces';
import { useJobContext } from '../Context/JobContext';
import AddJobForm from '../Components/AddJobForm';
import JobCard from '../Components/JobCard';

type FilterStatus = JobStatus | 'All';

const AllJobsPage: React.FC = () => {
    const { applications, addJob, updateJob, deleteJob } = useJobContext();

    // Filters
    const [selectedStatus, setSelectedStatus] = useState<FilterStatus>('All');
    const [selectedCompletion, setSelectedCompletion] = useState<'All' | 'Completed' | 'Waiting'>('All');
    const [selectedPlatform, setSelectedPlatform] = useState<ApplicationPlatform | 'All'>('All');
    const [searchQuery, setSearchQuery] = useState('');

    // UI State
    const [isFormOpen, setIsFormOpen] = useState(false);

    const normalizedQuery = searchQuery.trim().toLowerCase();

    const filteredApplications = applications.filter((job) => {
        const activeStatuses = job.statusPipeline.map((s) => s.name);

        // 1. Status Filter
        const matchesStatus = selectedStatus === 'All' ? true : activeStatuses.includes(selectedStatus as JobStatus);

        // 2. Completion Filter
        const isCompletedOverall = !job.statusPipeline.some(s => !s.isCompleted);
        let matchesCompletion = true;
        if (selectedCompletion === 'Completed') matchesCompletion = isCompletedOverall;
        if (selectedCompletion === 'Waiting') matchesCompletion = !isCompletedOverall;

        // 3. Platform Filter
        const matchesPlatform = selectedPlatform === 'All' ? true : job.platform === selectedPlatform;

        // 4. Search Filter
        const haystack = `${job.position} ${job.company} ${job.note}`.toLowerCase();
        const matchesSearch = !normalizedQuery || haystack.includes(normalizedQuery);

        return matchesStatus && matchesCompletion && matchesPlatform && matchesSearch;
    });

    const statusFilters: FilterStatus[] = [
        'All', 'To Apply', 'Applied', 'English Test', 'General Aptitude Test',
        'Case Study', 'Group Case', 'Video Interview', 'HR Interview',
        'Technical Interview', 'Technical Test', 'Offer', 'Rejected',
    ];

    const platforms: (ApplicationPlatform | 'All')[] = [
        'All', 'LinkedIn', 'Youthall', 'Kariyer.net', 'Indeed', 'Company Website', 'Other'
    ];

    const sortedApplications = filteredApplications.slice().sort((a, b) => {
        const getDueTime = (job: JobApplication) => {
            if (!job.dueDate) return Number.POSITIVE_INFINITY;
            const due = new Date(job.dueDate);
            if (Number.isNaN(due.getTime())) return Number.POSITIVE_INFINITY;
            return due.getTime();
        };

        const isEnded = (job: JobApplication) => {
            if (!job.dueDate) return false;
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const due = new Date(job.dueDate);
            if (Number.isNaN(due.getTime())) return false;
            return due.getTime() < today.getTime();
        };

        const aEnded = isEnded(a);
        const bEnded = isEnded(b);

        if (aEnded !== bEnded) {
            return aEnded ? 1 : -1;
        }

        const aTime = getDueTime(a);
        const bTime = getDueTime(b);

        if (aTime === bTime) return 0;
        return aTime - bTime;
    });

    return (
        <main className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-indigo-200 relative z-0">
            <div className="absolute inset-x-0 top-0 h-[45vh] bg-gradient-to-br from-indigo-900 via-sky-800 to-sky-600 -z-10" />

            <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8">
                <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="flex items-center gap-4 text-white">
                        <Link to="/" className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md shadow-lg text-white hover:bg-white/30 transition-all border border-white/20 hover:-translate-x-1">
                            <ArrowLeft className="h-6 w-6" />
                        </Link>
                        <div>
                            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-2 drop-shadow-md">
                                All Jobs
                            </h1>
                            <p className="text-sky-100 text-lg max-w-xl font-medium drop-shadow">
                                Browse and filter your entire history.
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-sky-100 font-semibold bg-black/20 px-5 py-2.5 rounded-full backdrop-blur-md border border-white/10 shadow-lg">
                        Total Applications: {applications.length}
                    </div>
                </header>

                <div className="w-full mb-8">
                    <div className="bg-white/95 rounded-3xl shadow-xl backdrop-blur-md border border-white overflow-hidden transition-all duration-300">
                        <button
                            onClick={() => setIsFormOpen(!isFormOpen)}
                            className="w-full flex items-center justify-between p-6 bg-slate-50/50 hover:bg-slate-50 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 flex items-center justify-center bg-indigo-100 text-indigo-600 rounded-xl">
                                    <Plus className="h-5 w-5" />
                                </div>
                                <h2 className="text-xl font-bold text-slate-800">Add New Job</h2>
                            </div>
                            <div className="text-slate-400">
                                {isFormOpen ? <ChevronUp className="h-6 w-6" /> : <ChevronDown className="h-6 w-6" />}
                            </div>
                        </button>

                        {isFormOpen && (
                            <div className="p-6 border-t border-slate-100 animate-in slide-in-from-top-4 duration-300">
                                <div className="max-w-4xl mx-auto">
                                    <AddJobForm onAdd={(job) => { addJob(job); setIsFormOpen(false); }} />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex flex-col gap-6">
                    {/* Advanced Filter Section */}
                    <section className="flex flex-col gap-6 rounded-3xl border border-white/20 bg-white/60 p-6 shadow-lg backdrop-blur-xl">

                        <div className="grid lg:grid-cols-3 gap-6">

                            {/* Completion State */}
                            <div className="space-y-2">
                                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">State</h3>
                                <div className="flex bg-slate-100/50 p-1 rounded-xl">
                                    {['All', 'Waiting', 'Completed'].map((state) => (
                                        <button
                                            key={state}
                                            onClick={() => setSelectedCompletion(state as any)}
                                            className={`flex-1 text-sm py-2 px-3 rounded-lg font-bold transition-all ${selectedCompletion === state ? 'bg-white text-indigo-700 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:text-slate-700'}`}
                                        >
                                            {state}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Platform Filter */}
                            <div className="space-y-2">
                                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Platform</h3>
                                <select
                                    value={selectedPlatform}
                                    onChange={(e) => setSelectedPlatform(e.target.value as any)}
                                    className="w-full rounded-xl border border-slate-200 bg-white py-2.5 px-3 text-sm font-bold text-slate-700 shadow-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200/50 transition-all"
                                >
                                    {platforms.map(p => <option key={p} value={p}>{p}</option>)}
                                </select>
                            </div>

                            {/* Search */}
                            <div className="space-y-2">
                                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Search</h3>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search keyword..."
                                        className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm font-bold text-slate-800 shadow-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200/50 transition-all placeholder:text-slate-400 placeholder:font-medium"
                                    />
                                    <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-indigo-400" />
                                </div>
                            </div>

                        </div>

                        {/* Line Break */}
                        <div className="h-px w-full bg-slate-200/80"></div>

                        {/* Status Grid */}
                        <div className="space-y-2">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Application Status</h3>
                            <div className="flex flex-wrap gap-2">
                                {statusFilters.map((status) => (
                                    <button
                                        key={status}
                                        type="button"
                                        onClick={() => setSelectedStatus(status)}
                                        className={`inline-flex items-center rounded-xl border px-3 py-1.5 text-xs font-bold transition-all ${selectedStatus === status
                                            ? 'border-indigo-400 bg-indigo-500 text-white shadow-md'
                                            : 'border-slate-200/50 bg-white/80 text-slate-600 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 shadow-sm'
                                            }`}
                                    >
                                        {status}
                                    </button>
                                ))}
                            </div>
                        </div>

                    </section>

                    {filteredApplications.length === 0 ? (
                        <section className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-white/80 py-20 text-center shadow-sm backdrop-blur-sm mt-4">
                            <div className="flex h-16 w-16 mb-4 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                                <Briefcase className="h-8 w-8" />
                            </div>
                            <p className="text-lg font-bold text-slate-700">
                                {applications.length === 0
                                    ? 'No applications yet'
                                    : 'No results match your filters or search'}
                            </p>
                            <p className="mt-2 max-w-sm text-sm font-medium text-slate-500">
                                {applications.length === 0
                                    ? 'Start by opening "Add New Job" above.'
                                    : 'Try adjusting your filters or search query.'}
                            </p>
                        </section>
                    ) : (
                        <section className="grid gap-6 md:grid-cols-2 mt-4">
                            {sortedApplications.map((job) => (
                                <JobCard
                                    key={job.id}
                                    job={job}
                                    onUpdate={updateJob}
                                    onDelete={deleteJob}
                                />
                            ))}
                        </section>
                    )}
                </div>
            </div>
        </main>
    );
};

export default AllJobsPage;
