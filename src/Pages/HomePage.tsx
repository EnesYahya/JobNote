import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Calendar as CalendarIcon,
    Clock,
    ArrowRight,
    Briefcase,
    ChevronLeft,
    ChevronRight,
    Plus,
    X
} from 'lucide-react';
import {
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    format,
    isSameDay,
    isSameMonth,
    addMonths,
    subMonths,
    isToday,
    isWithinInterval,
    addDays
} from 'date-fns';
import { useJobContext } from '../Context/JobContext';
import { JobApplication } from '../Interfaces';
import AddJobForm from '../Components/AddJobForm';

const HomePage: React.FC = () => {
    const { applications, addJob } = useJobContext();
    const [currentMonthStart, setCurrentMonthStart] = useState(() => startOfMonth(new Date()));

    // Modal State
    const [isAddJobOpen, setIsAddJobOpen] = useState(false);
    const [prefilledDate, setPrefilledDate] = useState<string | undefined>(undefined);

    const handlePrevMonth = () => setCurrentMonthStart(prev => subMonths(prev, 1));
    const handleNextMonth = () => setCurrentMonthStart(prev => addMonths(prev, 1));
    const handleToday = () => setCurrentMonthStart(startOfMonth(new Date()));

    const calendarDays = useMemo(() => {
        const start = startOfWeek(currentMonthStart, { weekStartsOn: 1 });
        const end = endOfWeek(endOfMonth(currentMonthStart), { weekStartsOn: 1 });
        return eachDayOfInterval({ start, end });
    }, [currentMonthStart]);

    const calendarJobs = applications.filter(j => !!j.dueDate);

    const jobsByDay = useMemo(() => {
        const grouped: Record<string, JobApplication[]> = {};
        calendarDays.forEach(day => {
            grouped[format(day, 'yyyy-MM-dd')] = [];
        });

        calendarJobs.forEach(job => {
            if (job.dueDate) {
                const jobDate = new Date(job.dueDate);
                if (!Number.isNaN(jobDate.getTime())) {
                    const matchingDay = calendarDays.find(day => isSameDay(day, jobDate));
                    if (matchingDay) {
                        grouped[format(matchingDay, 'yyyy-MM-dd')].push(job);
                    }
                }
            }
        });

        return grouped;
    }, [calendarJobs, calendarDays]);

    const approachingDeadlines = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const threeDaysFromNow = addDays(today, 3);

        return applications.filter(job => {
            if (!job.dueDate) return false;
            // Only show jobs that are NOT completed yet
            const isCompletedOverall = job.statusPipeline.length > 0 && !job.statusPipeline.some(s => !s.isCompleted);
            if (isCompletedOverall) return false;

            const dueDate = new Date(job.dueDate);
            if (Number.isNaN(dueDate.getTime())) return false;
            dueDate.setHours(0, 0, 0, 0);
            return isWithinInterval(dueDate, { start: today, end: threeDaysFromNow });
        }).sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime());
    }, [applications]);

    const handleDateClick = (day: Date) => {
        setPrefilledDate(format(day, 'yyyy-MM-dd'));
        setIsAddJobOpen(true);
    };

    const handleQuickAdd = () => {
        setPrefilledDate(undefined);
        setIsAddJobOpen(true);
    };

    const handleAddJobSubmit = (job: JobApplication) => {
        addJob(job);
        setIsAddJobOpen(false);
    };

    return (
        <main className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-indigo-200 relative z-0">
            <div className="absolute inset-x-0 top-0 h-[45vh] bg-gradient-to-br from-indigo-900 via-sky-800 to-sky-600 -z-10" />

            {/* Modal */}
            {isAddJobOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative animate-in zoom-in-95 duration-200">
                        <div className="sticky top-0 bg-white/90 backdrop-blur-md border-b border-slate-100 px-6 py-4 flex items-center justify-between z-10">
                            <h2 className="text-xl font-bold text-slate-800">Add New Job</h2>
                            <button
                                onClick={() => setIsAddJobOpen(false)}
                                className="h-8 w-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                        <div className="p-6">
                            <AddJobForm onAdd={handleAddJobSubmit} defaultDueDate={prefilledDate} />
                        </div>
                    </div>
                </div>
            )}

            <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8">
                <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="text-white">
                        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-2 drop-shadow-md">
                            JobNote
                        </h1>
                        <p className="text-sky-100 text-lg max-w-xl font-medium drop-shadow">
                            Your personal command center for navigating the job market.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <button
                            onClick={handleQuickAdd}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-500 backdrop-blur-md px-5 py-3 text-sm font-bold text-white shadow-lg transition-all hover:bg-indigo-400 hover:-translate-y-0.5"
                        >
                            <Plus className="h-5 w-5" />
                            Quick Add Job
                        </button>
                    </div>
                </header>

                <div className="flex flex-col gap-8">

                    {/* Top Row: Upcoming Deadlines & All Jobs Link */}
                    <section className="bg-white/95 backdrop-blur rounded-3xl p-6 shadow-xl border border-slate-100">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                            <div className="flex items-center gap-3 shrink-0">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 shadow-sm">
                                    <Clock className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-slate-800 leading-none mb-1">Upcoming Deadlines</h3>
                                    <p className="text-sm font-semibold text-slate-500">Action required within 3 days</p>
                                </div>
                            </div>

                            <Link
                                to="/all"
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:bg-slate-800 hover:-translate-y-0.5 shrink-0"
                            >
                                <Briefcase className="h-4 w-4 text-indigo-400" />
                                View All Jobs
                                <ArrowRight className="h-4 w-4 opacity-70 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>

                        {approachingDeadlines.length === 0 ? (
                            <div className="text-center py-10 bg-slate-50/80 rounded-2xl border border-dashed border-slate-200">
                                <div className="inline-flex rounded-full bg-emerald-50 p-3 mb-3">
                                    <Clock className="h-6 w-6 text-emerald-500" />
                                </div>
                                <p className="text-slate-600 font-medium text-sm">No approaching deadlines!</p>
                                <p className="text-xs text-slate-400 mt-1">You're caught up for the next 3 days on your active applications.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                {approachingDeadlines.map(job => (
                                    <Link
                                        key={job.id}
                                        to={`/job/${job.id}`}
                                        className="group flex flex-col gap-2 p-5 rounded-2xl border border-rose-100/60 bg-gradient-to-br from-white to-rose-50/30 hover:to-rose-50 hover:border-rose-200 transition-all text-left shadow-sm hover:shadow-md"
                                    >
                                        <div className="flex justify-between items-start w-full gap-2">
                                            <div>
                                                <h4 className="font-bold text-slate-800 text-lg group-hover:text-rose-600 transition-colors line-clamp-1">{job.position}</h4>
                                                <p className="text-sm text-slate-500 font-medium">{job.company}</p>
                                            </div>
                                            <span className="text-xs font-bold text-white bg-rose-500 shadow-sm px-2.5 py-1 rounded-lg ml-auto whitespace-nowrap">
                                                {isToday(new Date(job.dueDate!)) ? 'Today' : `Due: ${format(new Date(job.dueDate!), 'MMM d')}`}
                                            </span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </section>

                    {/* Bottom Row: Monthly Calendar Full Width */}
                    <section className="bg-white rounded-3xl p-6 lg:p-8 shadow-xl border border-slate-100">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                            <div className="flex items-center gap-3">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 shadow-inner">
                                    <CalendarIcon className="h-6 w-6" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600 leading-tight">
                                        {format(currentMonthStart, 'MMMM yyyy')}
                                    </h2>
                                    <p className="text-sm font-medium text-slate-500">Click a date to quickly add a job posting</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
                                <button
                                    onClick={handlePrevMonth}
                                    className="p-2 rounded-lg hover:bg-white hover:shadow-sm transition-all text-slate-600"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={handleToday}
                                    className="px-4 py-1.5 rounded-lg hover:bg-white hover:shadow-sm transition-all text-sm font-semibold text-slate-700"
                                >
                                    Today
                                </button>
                                <button
                                    onClick={handleNextMonth}
                                    className="p-2 rounded-lg hover:bg-white hover:shadow-sm transition-all text-slate-600"
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-7 gap-px bg-slate-200 rounded-2xl overflow-hidden border border-slate-200 shadow-inner">
                            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                                <div key={day} className="bg-slate-50 py-4 text-center text-sm font-bold text-slate-500 uppercase tracking-wider">
                                    {day}
                                </div>
                            ))}

                            {calendarDays.map((day) => {
                                const dateStr = format(day, 'yyyy-MM-dd');
                                const jobs = jobsByDay[dateStr] || [];
                                const isCurrentMonth = isSameMonth(day, currentMonthStart);
                                const isDayToday = isToday(day);

                                // Check if this day has an urgent uncompleted job
                                const hasUrgentUncompleted = jobs.some(job => {
                                    const isCompletedOverall = job.statusPipeline.length > 0 && !job.statusPipeline.some(s => !s.isCompleted);
                                    if (isCompletedOverall) return false;

                                    const today = new Date();
                                    today.setHours(0, 0, 0, 0);
                                    const threeDaysFromNow = addDays(today, 3);
                                    return isWithinInterval(day, { start: today, end: threeDaysFromNow });
                                });

                                return (
                                    <div
                                        key={dateStr}
                                        onClick={() => handleDateClick(day)}
                                        className={`group min-h-[160px] bg-white p-3 transition-all cursor-pointer hover:bg-indigo-50/50 
                                            ${!isCurrentMonth ? 'opacity-50 bg-slate-50/50' : ''} 
                                            ${isDayToday ? 'ring-2 ring-inset ring-indigo-400 bg-indigo-50/20' : ''}
                                            ${hasUrgentUncompleted ? 'bg-rose-50/30' : ''}
                                        `}
                                    >
                                        <div className={`flex items-center justify-between mb-2`}>
                                            <span className={`font-bold text-base flex items-center justify-center h-8 w-8 rounded-full ${isDayToday ? 'bg-indigo-600 text-white shadow-sm' : hasUrgentUncompleted ? 'text-rose-600 bg-rose-100' : 'text-slate-600 group-hover:bg-slate-100'}`}>
                                                {format(day, 'd')}
                                            </span>
                                            {hasUrgentUncompleted && (
                                                <div className="h-2 w-2 rounded-full bg-rose-500 animate-pulse shadow-sm shadow-rose-500/50" title="Urgent Action Required"></div>
                                            )}
                                        </div>
                                        <div className="flex flex-col gap-2 overflow-y-auto max-h-[110px] custom-scrollbar pr-1">
                                            {jobs.map(job => {
                                                const isCompleted = job.statusPipeline.length > 0 && !job.statusPipeline.some(s => !s.isCompleted);

                                                return (
                                                    <Link
                                                        key={job.id}
                                                        to={`/job/${job.id}`}
                                                        onClick={(e) => e.stopPropagation()} // Prevent trigger DateClick
                                                        className={`block rounded-lg border p-2 transition-all ${isCompleted ? 'bg-emerald-50 border-emerald-100 hover:bg-emerald-100' : hasUrgentUncompleted ? 'bg-white border-rose-200 shadow-sm hover:border-rose-300' : 'bg-indigo-50 border-indigo-100 hover:bg-indigo-100 hover:border-indigo-200'}`}
                                                    >
                                                        <div className={`text-xs font-bold leading-tight truncate px-0.5 ${isCompleted ? 'text-emerald-700' : 'text-slate-800'}`}>
                                                            {job.position}
                                                        </div>
                                                        <div className="text-[10px] text-slate-500 truncate mt-0.5 px-0.5 font-medium">
                                                            {job.company}
                                                        </div>
                                                    </Link>
                                                )
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                </div>
            </div>

            <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 3px;
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

export default HomePage;
