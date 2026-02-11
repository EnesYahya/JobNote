## JobNote

JobNote is a small, focused web app for **tracking job applications**.  
You can quickly add roles you’re interested in, record their status, set due dates (for application deadlines or tasks), and keep organized notes for each position in a clean dashboard.

🔗 Live Demo: https://job-note.netlify.app

## Tech stack

- **Frontend**: React + TypeScript  
- **Build tool**: Vite  
- **Styling**: Tailwind CSS  
- **Icons**: lucide-react  
- **Storage**: Browser `localStorage` (no backend required)

## Features

- **Add applications**: Save job title, company, date applied, and notes.
- **Status pipeline**: Track each application with statuses like `To Apply`, `Applied`, `Interview`, `Offer`, and more.
- **Due dates**: Optionally set a due date and see visual indicators for deadlines that are close or have passed.
- **Notes per job**: Keep interview prep, follow‑ups, and contacts tied to each application.
- **Search and filter**: Filter by status and search across role, company, and notes.
- **Persistent storage**: All data is stored in your browser’s localStorage.

## Getting started

### Prerequisites

- Node.js (LTS version recommended)
- npm or yarn

### Installation

```bash
git clone <your-repo-url>
cd JobNote
npm install
```

### Run the app in development

```bash
npm run dev
```

Then open the URL shown in the terminal (usually `http://localhost:5173`).

### Build for production

```bash
npm run build
```

To preview the production build:

```bash
npm run preview
```

## Project structure (high level)

- `src/Components` – Reusable UI components (e.g. `AddJobForm`, `JobCard`).
- `src/Pages` – Top‑level pages (e.g. `Dashboard`).
- `src/Interfaces` – Shared TypeScript interfaces and types.

## Data persistence

JobNote uses `localStorage` under the key `jobnote_applications`.  
Clearing browser storage or using a different browser/device will reset your data.

## License

This project is licensed under the MIT

