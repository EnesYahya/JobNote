import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft, Briefcase, Calendar, StickyNote, Globe,
    Linkedin, Monitor, Building2, Share2, Plus, X, Link as LinkIcon, CheckCircle2, Circle, Trash2, Edit2, Check
} from 'lucide-react';
import { useJobContext } from '../Context/JobContext';
import { JobStatus, StatusDetail, ApplicationPlatform, JobApplication } from '../Interfaces';

const AVAILABLE_STATUSES: JobStatus[] = [
    'To Apply', 'Applied', 'English Test', 'General Aptitude Test',
    'Case Study', 'Group Case', 'Video Interview', 'HR Interview',
    'Technical Interview', 'Technical Test', 'Offer', 'Rejected'
];

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

const JobDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { applications, updateJob } = useJobContext();
    const [isEditingNote, setIsEditingNote] = useState(false);
    const [isEditingDetails, setIsEditingDetails] = useState(false);
    const [showStatusMenu, setShowStatusMenu] = useState(false);

    const [editForm, setEditForm] = useState<Partial<JobApplication>>({});

    // For new links in status cards
    const [newLinkInputs, setNewLinkInputs] = useState<Record<number, string>>({});

    const job = applications.find(app => app.id === id);

    if (!job) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4">
                <div className="text-center bg-white p-8 rounded-3xl shadow-lg border border-slate-100 max-w-sm">
                    <h1 className="mb-4 text-2xl font-bold text-slate-800">Job Not Found</h1>
                    <button
                        onClick={() => navigate('/all')}
                        className="rounded-xl bg-indigo-600 px-6 py-2.5 font-medium text-white shadow-md hover:shadow-lg hover:bg-indigo-700 transition-all"
                    >
                        Back to Postings
                    </button>
                </div>
            </div>
        );
    }

    const { statusPipeline = [] } = job;

    const handleUpdateJob = (updates: Partial<JobApplication>) => {
        updateJob({ ...job, ...updates });
    };

    const handleAddStatus = (statusName: JobStatus) => {
        const newPipeline = [...statusPipeline, { name: statusName, isCompleted: false, note: '', links: [] }];
        handleUpdateJob({ statusPipeline: newPipeline });
        setShowStatusMenu(false);
    };

    const handleRemoveStatus = (index: number) => {
        const newPipeline = [...statusPipeline];
        newPipeline.splice(index, 1);
        handleUpdateJob({ statusPipeline: newPipeline });
    };

    const handleUpdateStatus = (index: number, updates: Partial<StatusDetail>) => {
        const newPipeline = [...statusPipeline];
        newPipeline[index] = { ...newPipeline[index], ...updates };
        handleUpdateJob({ statusPipeline: newPipeline });
    };

    const handleAddLink = (index: number) => {
        const link = newLinkInputs[index]?.trim();
        if (!link) return;
        const currentLinks = statusPipeline[index].links || [];
        handleUpdateStatus(index, { links: [...currentLinks, link] });
        setNewLinkInputs(prev => ({ ...prev, [index]: '' }));
    };

    const handleRemoveLink = (statusIndex: number, linkIndex: number) => {
        const currentLinks = [...(statusPipeline[statusIndex].links || [])];
        currentLinks.splice(linkIndex, 1);
        handleUpdateStatus(statusIndex, { links: currentLinks });
    };

    const startEditingDetails = () => {
        setEditForm({
            company: job.company,
            position: job.position,
            date: job.date,
            dueDate: job.dueDate || '',
            url: job.url || '',
            platform: job.platform
        });
        setIsEditingDetails(true);
    };

    const saveEditingDetails = () => {
        handleUpdateJob(editForm as Partial<JobApplication>);
        setIsEditingDetails(false);
    };

    const cancelEditingDetails = () => {
        setIsEditingDetails(false);
        setEditForm({});
    };

    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setEditForm(prev => ({ ...prev, [name]: value }));
    };

    return (
        <main className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-indigo-200 relative z-0">
            <div className="absolute inset-x-0 top-0 h-[45vh] bg-gradient-to-br from-indigo-900 via-sky-800 to-sky-600 -z-10" />

            <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8 flex flex-col h-full">
                {/* Header Actions */}
                <header className="mb-8 flex items-center justify-between">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center justify-center gap-2 rounded-2xl bg-white/10 backdrop-blur-md px-5 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:bg-white/20 border border-white/20 hover:-translate-x-1"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back
                    </button>
                </header>

                <div className="flex flex-col gap-6">
                    {/* Top Row: Global Details */}
                    <section className="bg-white/95 rounded-3xl p-6 shadow-xl backdrop-blur-md border border-white relative">
                        {!isEditingDetails ? (
                            <div className="flex flex-col lg:flex-row gap-6 lg:items-center justify-between">
                                <div className="flex items-center gap-5 flex-1 min-w-0 pr-12 lg:pr-0">
                                    <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-white border border-slate-100 text-slate-600 shadow-sm overflow-hidden p-3 shrink-0">
                                        <PlatformIcon platform={job.platform} className="h-10 w-10" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 leading-tight mb-1 break-words">{job.position}</h1>
                                        <p className="text-lg font-medium text-slate-500 break-words">{job.company}</p>
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center gap-6 lg:gap-8 border-t lg:border-t-0 lg:border-l border-slate-100 pt-6 lg:pt-0 lg:pl-8">
                                    <div className="flex items-center gap-3">
                                        <div className="rounded-xl bg-sky-50 p-2 text-sky-500 shrink-0">
                                            <Calendar className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{job.isProcessingDate ? 'Processing Date' : 'Application Date'}</h3>
                                            <p className="text-sm font-semibold text-slate-800">{Number.isNaN(new Date(job.date).getTime()) ? job.date || 'Not set' : new Date(job.date).toLocaleDateString()}</p>
                                        </div>
                                    </div>

                                    {job.dueDate && (
                                        <div className="flex items-center gap-3">
                                            <div className="rounded-xl bg-rose-50 p-2 text-rose-500 shrink-0">
                                                <Calendar className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Due Date</h3>
                                                <p className="text-sm font-semibold text-slate-800">{Number.isNaN(new Date(job.dueDate).getTime()) ? job.dueDate || 'Not set' : new Date(job.dueDate).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex items-center gap-3">
                                        <div className="rounded-xl bg-indigo-50 p-2 text-indigo-500 shrink-0">
                                            <PlatformIcon platform={job.platform} className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Platform</h3>
                                            <p className="text-sm font-semibold text-slate-800">{job.platform}</p>
                                        </div>
                                    </div>

                                    {job.url && (
                                        <div className="flex items-center gap-3">
                                            <div className="rounded-xl bg-indigo-50 p-2 text-indigo-500 shrink-0">
                                                <LinkIcon className="h-5 w-5" />
                                            </div>
                                            <div className="truncate">
                                                <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Listing URL</h3>
                                                <a href={job.url} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-indigo-600 hover:underline truncate block">
                                                    Open Listing &nearr;
                                                </a>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <button onClick={startEditingDetails} className="absolute top-6 right-6 lg:static p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors shrink-0" title="Edit Job Details">
                                    <Edit2 className="h-4 w-4" />
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-4 animate-in fade-in zoom-in duration-200">
                                <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-2">
                                    <h3 className="text-lg font-bold text-indigo-700">Edit Details</h3>
                                    <div className="flex items-center gap-2">
                                        <button onClick={saveEditingDetails} className="bg-emerald-100 text-emerald-600 p-2 rounded-xl hover:bg-emerald-200 transition-colors">
                                            <Check className="h-4 w-4" />
                                        </button>
                                        <button onClick={cancelEditingDetails} className="bg-slate-100 text-slate-500 p-2 rounded-xl hover:bg-slate-200 transition-colors">
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <div className="lg:col-span-2">
                                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 ml-1">Position</label>
                                        <input type="text" name="position" value={editForm.position || ''} onChange={handleEditChange} className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-400 text-sm font-bold text-slate-800" />
                                    </div>

                                    <div className="lg:col-span-2">
                                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 ml-1">Company</label>
                                        <input type="text" name="company" value={editForm.company || ''} onChange={handleEditChange} className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-400 text-sm text-slate-800" />
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 ml-1">Log Date</label>
                                        <input type="date" name="date" value={editForm.date || ''} onChange={handleEditChange} className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-400 text-xs text-slate-800" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 ml-1">Due Date</label>
                                        <input type="date" name="dueDate" value={editForm.dueDate || ''} onChange={handleEditChange} className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-400 text-xs text-slate-800" />
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 ml-1">Platform</label>
                                        <select name="platform" value={editForm.platform || 'Other'} onChange={handleEditChange} className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-400 text-sm text-slate-800">
                                            <option value="LinkedIn">LinkedIn</option>
                                            <option value="Youthall">Youthall</option>
                                            <option value="Kariyer.net">Kariyer.net</option>
                                            <option value="Indeed">Indeed</option>
                                            <option value="Company Website">Company Website</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 ml-1">Listing URL</label>
                                        <input type="url" name="url" value={editForm.url || ''} onChange={handleEditChange} className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-400 text-sm text-slate-800" placeholder="https://..." />
                                    </div>
                                </div>
                            </div>
                        )}
                    </section>

                    {/* General Notes */}
                    <section className="bg-white/95 rounded-3xl p-6 shadow-xl backdrop-blur-md border border-white">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2 text-amber-500">
                                <StickyNote className="h-4 w-4" />
                                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">General Notes</h3>
                            </div>
                            <button
                                onClick={() => setIsEditingNote(!isEditingNote)}
                                className="text-xs font-bold bg-slate-100 px-3 py-1.5 rounded-lg text-slate-500 hover:bg-slate-200"
                            >
                                {isEditingNote ? 'Done' : 'Edit'}
                            </button>
                        </div>
                        {isEditingNote ? (
                            <textarea
                                value={job.note}
                                onChange={(e) => handleUpdateJob({ note: e.target.value })}
                                className="w-full h-32 p-4 text-sm rounded-xl bg-amber-50/50 border border-amber-200 outline-none focus:ring-2 focus:ring-amber-300 resize-none whitespace-pre-wrap break-words"
                                placeholder="Add general notes here..."
                            />
                        ) : (
                            <div className="text-sm text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-100 whitespace-pre-wrap break-words min-h-[60px]">
                                {job.note || <span className="text-slate-400 italic">No general notes added.</span>}
                            </div>
                        )}
                    </section>

                    {/* Kanban Status Pipeline */}
                    <div className="w-full min-w-0">
                        <section className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/50 min-h-[600px] flex flex-col">

                            <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
                                <div>
                                    <h2 className="text-3xl font-extrabold text-slate-900 drop-shadow-sm flex items-center gap-3">
                                        Status Pipeline
                                        <span className="text-sm font-bold bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full border border-indigo-200 shadow-sm align-middle">
                                            {statusPipeline.filter(s => s.isCompleted).length} / {statusPipeline.length} Completed
                                        </span>
                                    </h2>
                                    <p className="text-slate-500 font-medium mt-1">Track your progress and keep detailed notes for every step.</p>
                                </div>

                                <div className="relative">
                                    <button
                                        onClick={() => setShowStatusMenu(!showStatusMenu)}
                                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-5 rounded-xl shadow-md transition-all active:scale-95"
                                    >
                                        <Plus className="h-5 w-5" />
                                        Add Status
                                    </button>

                                    {showStatusMenu && (
                                        <>
                                            <div className="fixed inset-0 z-10" onClick={() => setShowStatusMenu(false)} />
                                            <div className="absolute right-0 top-14 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 z-20 overflow-hidden text-sm font-medium py-2">
                                                <div className="px-4 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-50 mb-1">
                                                    Available Statuses
                                                </div>
                                                <div className="max-h-[300px] overflow-y-auto">
                                                    {AVAILABLE_STATUSES.map(s => (
                                                        <button
                                                            key={s}
                                                            onClick={() => handleAddStatus(s)}
                                                            className="w-full text-left px-4 py-2 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
                                                        >
                                                            {s}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Horizontal Scrolling Kanban */}
                            <div className="flex gap-6 overflow-x-auto pb-6 custom-scrollbar flex-1 items-start">
                                {statusPipeline.length === 0 ? (
                                    <div className="w-full flex flex-col items-center justify-center p-12 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-300">
                                        <div className="h-16 w-16 bg-slate-100 text-slate-300 rounded-full flex items-center justify-center mb-4">
                                            <Plus className="h-8 w-8" />
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-600">No active statuses</h3>
                                        <p className="text-slate-400 max-w-sm mt-1">Add a status to start building your application pipeline. You can add as many concurrent statuses as you need.</p>
                                    </div>
                                ) : (
                                    statusPipeline.map((status, index) => (
                                        <div key={index} className="flex items-center">
                                            {index > 0 && <div className="h-0.5 w-8 bg-slate-200 mx-2 shrink-0 rounded-full"></div>}
                                            <div className="w-[320px] shrink-0 bg-slate-50 border border-slate-200 rounded-3xl p-5 shadow-sm transition-all hover:shadow-md hover:border-indigo-200 flex flex-col gap-4">

                                                {/* Card Header */}
                                                <div className="flex items-start justify-between gap-2">
                                                    <h3 className="text-lg font-bold text-slate-800 leading-snug">{status.name}</h3>
                                                    <div className="flex items-center gap-1 shrink-0">
                                                        <button
                                                            onClick={() => handleRemoveStatus(index)}
                                                            className="h-8 w-8 flex items-center justify-center rounded-full text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                                                            title="Remove Status"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Completed Toggle */}
                                                <button
                                                    onClick={() => handleUpdateStatus(index, { isCompleted: !status.isCompleted })}
                                                    className={`flex items-center justify-center gap-2 w-full py-2.5 rounded-xl font-bold text-sm transition-all border ${status.isCompleted
                                                        ? 'bg-emerald-50 border-emerald-200 text-emerald-700 shadow-sm'
                                                        : 'bg-white border-amber-200 text-amber-600 hover:bg-amber-50 shadow-sm'
                                                        }`}
                                                >
                                                    {status.isCompleted ? (
                                                        <><CheckCircle2 className="h-5 w-5" /> Completed</>
                                                    ) : (
                                                        <><Circle className="h-5 w-5 animate-pulse" /> Waiting</>
                                                    )}
                                                </button>

                                                {/* Notes Area */}
                                                <div className="flex flex-col gap-1.5 flex-1">
                                                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Notes</label>
                                                    <textarea
                                                        value={status.note}
                                                        onChange={(e) => handleUpdateStatus(index, { note: e.target.value })}
                                                        placeholder={`Notes for ${status.name}...`}
                                                        className="w-full flex-1 min-h-[120px] rounded-xl border border-slate-200 p-3 text-sm bg-white shadow-inner outline-none focus:ring-2 focus:ring-indigo-300 resize-none"
                                                    />
                                                </div>

                                                {/* Links Area */}
                                                <div className="flex flex-col gap-2">
                                                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Links</label>
                                                    {status.links && status.links.map((link, lIndex) => (
                                                        <div key={lIndex} className="flex items-center gap-2 bg-indigo-50 border border-indigo-100 p-2 rounded-lg group">
                                                            <LinkIcon className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                                                            <a href={link} target="_blank" rel="noopener noreferrer" className="flex-1 truncate text-xs font-bold text-indigo-700 hover:underline">
                                                                {link}
                                                            </a>
                                                            <button
                                                                onClick={() => handleRemoveLink(index, lIndex)}
                                                                className="opacity-0 group-hover:opacity-100 text-indigo-400 hover:text-red-500 transition-all p-1"
                                                            >
                                                                <X className="h-3.5 w-3.5" />
                                                            </button>
                                                        </div>
                                                    ))}
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <input
                                                            type="url"
                                                            value={newLinkInputs[index] || ''}
                                                            onChange={(e) => setNewLinkInputs(prev => ({ ...prev, [index]: e.target.value }))}
                                                            onKeyDown={(e) => e.key === 'Enter' && handleAddLink(index)}
                                                            placeholder="Add URL..."
                                                            className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-indigo-400"
                                                        />
                                                        <button
                                                            onClick={() => handleAddLink(index)}
                                                            className="h-8 w-8 flex items-center justify-center shrink-0 bg-slate-100 text-slate-600 hover:bg-indigo-600 hover:text-white rounded-lg transition-colors border border-slate-200 hover:border-indigo-600"
                                                        >
                                                            <Plus className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                        </section>
                    </div>
                </div>
            </div>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    height: 8px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background-color: #cbd5e1;
                    border-radius: 20px;
                }
                .custom-scrollbar:hover::-webkit-scrollbar-thumb {
                    background-color: #94a3b8;
                }
            `}</style>
        </main>
    );
};

export default JobDetailsPage;
