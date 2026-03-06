import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { JobApplication, JobStatus } from '../Interfaces';

const STORAGE_KEY = 'jobnote_applications';

interface JobContextType {
    applications: JobApplication[];
    addJob: (job: JobApplication) => void;
    updateJob: (job: JobApplication) => void;
    deleteJob: (id: string) => void;
}

const JobContext = createContext<JobContextType | undefined>(undefined);

export const JobProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [applications, setApplications] = useState<JobApplication[]>(() => {
        try {
            if (typeof window === 'undefined') return [];
            const raw = window.localStorage.getItem(STORAGE_KEY);
            if (!raw) return [];
            const data = JSON.parse(raw);
            return data.map((job: any): JobApplication => {
                // Migration logic for older items
                if (typeof job.status === 'string') {
                    const statusName = job.status as JobStatus;
                    return {
                        ...job,
                        platform: job.platform || 'Other',
                        url: job.url || '',
                        statusPipeline: [
                            { name: statusName, isCompleted: false, note: '', links: [] }
                        ]
                    };
                }
                return job;
            });
        } catch {
            return [];
        }
    });

    useEffect(() => {
        try {
            if (typeof window !== 'undefined') {
                window.localStorage.setItem(STORAGE_KEY, JSON.stringify(applications));
            }
        } catch {
            // ignore write errors
        }
    }, [applications]);

    const addJob = (job: JobApplication) => {
        setApplications((prev) => [job, ...prev]);
    };

    const updateJob = (updated: JobApplication) => {
        setApplications((prev) =>
            prev.map((job) => (job.id === updated.id ? updated : job)),
        );
    };

    const deleteJob = (id: string) => {
        setApplications((prev) => prev.filter((job) => job.id !== id));
    };

    return (
        <JobContext.Provider value={{ applications, addJob, updateJob, deleteJob }}>
            {children}
        </JobContext.Provider>
    );
};

export const useJobContext = () => {
    const context = useContext(JobContext);
    if (context === undefined) {
        throw new Error('useJobContext must be used within a JobProvider');
    }
    return context;
};
