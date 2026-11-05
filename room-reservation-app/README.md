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
├── .github/
│   └── workflows/
│       └── deploy.yml        # GitHub Actions workflow for GitHub Pages
├── .gitignore
├── package.json              # Updated with GitHub Pages homepage script
├── index.html                # Corrected <!DOCTYPE html> doctype
├── vite.config.js            # Configured base path for GitHub Pages
└── README.md
```

## Quick Start & Deployment

### GitHub Pages Deployment (Free Hosting)

1. Push this repository to GitHub (`amybrinkley/room-reservation-app`).
2. Go to **Settings > Pages** on your GitHub repository.
3. Under **Build and deployment**, set **Source** to **GitHub Actions**.
4. GitHub Actions will automatically build and publish your app at:
   `https://amybrinkley.github.io/room-reservation-app/`

### Vercel Deployment

1. Import your GitHub repository (`amybrinkley/room-reservation-app`) on [Vercel](https://vercel.com).
2. Click **Deploy**. Vercel will automatically detect Vite and publish the site.

## License

MIT License
