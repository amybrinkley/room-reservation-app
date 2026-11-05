# Room Reservation & Usage Analytics System

A front-desk study room scheduling and usage analytics web application designed for academic libraries and student resource centers. Built with React, Tailwind CSS, Lucide Icons, and Recharts, with a Google Sheets + Apps Script backend database.

## Features

- **Interactive Room Schedule Matrix**: 30-minute time slots (8:00 AM – 8:00 PM) for Rooms 31 (Pink), 33 (Blue), 34 (Yellow), and 59 (Green).
- **This Week / Next Week Navigation**: Simple tab toggle between current and upcoming week's schedule.
- **Status Lifecycle Tracking**: `Scheduled`, `Checked-In`, `Completed`, `Overdue`, and `Vacant` room slots.
- **Barcode & W# ID Quick Lookup**: Front-desk barcode scanning input for fast student check-in/out.
- **Turn-Away Counter**: One-click logging for unfulfilled room demand.
- **Usage Trends & Analytics**: Live Recharts dashboards tracking room utilization by day of week, hourly peak heatmaps, and turn-away rates.
- **Google Sheets Backend**: Direct integration via Google Apps Script web API.

## Project Structure

```
room-reservation-app/
├── backend/
│   └── Code.gs               # Google Apps Script API code
├── src/
│   ├── App.jsx               # Main React Application
│   ├── main.jsx              # Application Entry Point
│   └── index.css             # Tailwind CSS Directives
├── .gitignore
├── package.json
├── index.html
├── vite.config.js
└── README.md
```

## Quick Start

### 1. Front-End Setup (React + Vite)

```bash
# Clone the repository
git clone https://github.com/your-org/room-reservation-app.git
cd room-reservation-app

# Install dependencies
npm install

# Start development server
npm run dev
```

### 2. Back-End Setup (Google Sheets + Apps Script)

1. Upload `Room_Reservation_Backend_Database.xlsx` to your Google Drive and convert it to **Google Sheets** (`File > Save as Google Sheets`).
2. Go to **Extensions > Apps Script** in your Google Sheet.
3. Paste the contents of `backend/Code.gs` into the script editor.
4. Click **Deploy > New deployment**.
5. Select **Web app**, set access to **Anyone** (or domain-restricted), and click **Deploy**.
6. Copy the Web App URL and update `GOOGLE_SCRIPT_URL` in `src/App.jsx`.

## License

MIT License
