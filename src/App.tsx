import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { JobProvider } from './Context/JobContext';
import HomePage from './Pages/HomePage';
import AllJobsPage from './Pages/AllJobsPage';
import JobDetailsPage from './Pages/JobDetailsPage';

const App: React.FC = () => {
  return (
    <JobProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/all" element={<AllJobsPage />} />
          <Route path="/job/:id" element={<JobDetailsPage />} />
        </Routes>
      </BrowserRouter>
    </JobProvider>
  );
};

export default App;


