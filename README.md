# 📊 Daily Life Tracking System (DLT)

[![Vercel Deployment](https://img.shields.io/badge/Vercel-Deployed-black?logo=vercel&logoColor=white)](https://dailylife-trackingsystem.vercel.app/)

A premium, interactive personal dashboard application designed to track habits, study logs, fitness metrics, personal budget, savings goals, anime watchlists, and upcoming events. Built as a dual-runtime application that functions as an **Electron desktop application** with local Python analytics, and compiles seamlessly into a responsive web application hosted on Vercel.

**🔗 Live Web App Demo:** [https://dailylife-trackingsystem.vercel.app/](https://dailylife-trackingsystem.vercel.app/)

---

## 🎨 Key Features

*   **🕰️ 3D Split-Flap Clock**: An elegant 3D flip clock header that displays the current time with rotating digit animations and a staggered character-flip loading effect for the current date.
*   **⏱️ Header Time Tracker**: An ultra-modern glassmorphic clock-in/out controller embedded in the header. Features active duration ticking, customizable note tagging, and live pulse micro-animations.
*   **🐍 Python-Powered Analytics**: Connects Vue state data to a local Python daemon (`src/processor.py`) via Electron IPC to run math aggregation on work log durations, compute active workdays, and compile task-note distributions.
*   **🌐 Browser-Safe Fallback**: Fully optimized for web deployment. If run outside Electron (e.g. on Vercel), it safely degrades to a client-side JavaScript engine to compute analytics, keeping the interface fully functional online.
*   **🎯 SDLC Project Importer**: A recommended projects shelf on the Goals Board displaying template repositories structured into SDLC phases (Blog/CMS, Kanban board, Crypto tracker) with one-click cloning onto your goals board.
*   **🌅 Dynamic Time-of-Day Gradients**: The main dashboard dynamically transitions its background color palette through 5 distinct watercolor gradients (Night, Dawn, Morning, Afternoon, Evening) depending on the time of day.
*   **📈 Interactive Analytics**: Integrated tabbed charts powered by Chart.js displaying Savings Growth, Expenses by Category, Savings Goals Progress, and Calories Burned Trends.
*   **🗂️ Dedicated Tracking Modules**:
    *   🏃 **Fitness Tracker**: Steps count & calorie logging.
    *   💰 **Expenses Manager**: Budget tracker.
    *   🏦 **Savings Goals**: Milestone tracker for savings.
    *   📚 **Study & Book Logs**: Book tracking and reading session logging.
    *   🎬 **Anime Watchlist**: Keep tabs on currently watching and completed shows.
    *   📅 **Events Calendar**: Simple scheduler.
    *   🎯 **Goals Board**: Setting long-term milestones with clean delete triggers.
    *   💧 **Water Intake**: Daily hydration counter.

---

## 🛠️ Technology Stack

*   **Desktop Shell**: [Electron](https://www.electronjs.org/) (for local native process communication)
*   **Frontend**: [Vue.js 3](https://vuejs.org/) (Composition API, Pinia State Store, Vue Router)
*   **Build System**: [Vite](https://vite.dev/) (for fast client bundle building)
*   **Scripting Engine**: [Python 3](https://www.python.org/) (Data processing & log statistics)
*   **Data Visualization**: [Chart.js](https://www.chartjs.org/)
*   **Typography**: Google Fonts (*Playfair Display*, *Plus Jakarta Sans*, & *Inter*)

---

## 🚀 Getting Started

### Local Desktop Run (Electron + Python)
Ensure you have [Node.js](https://nodejs.org/) and [Python 3](https://www.python.org/) installed.

1. **Clone this repository** to your local machine.
2. **Install npm dependencies**:
   ```bash
   npm install
   ```
3. **Launch the application**:
   ```bash
   npm start
   ```

### Local Web Run (Vite Development Server)
To run and hot-reload the application in your local web browser:
```bash
npm run dev
```

---

## 📁 Repository Structure

```
├── dist/                # Compiled client environment for production
├── src/                 # Application source files
│   ├── components/      # Shared Vue components (FlipDigit.vue, Header.vue, Sidebar.vue)
│   ├── stores/          # Pinia state stores (appStore.js)
│   ├── views/           # Routed view pages (HomeView.vue, GoalsView.vue, etc.)
│   ├── processor.py     # Python analytical backend script
│   ├── App.vue          # Root Vue layout container
│   ├── main.js          # Vue frontend bootstrapper
│   └── index.css        # Global CSS design system and custom properties
├── package.json         # Project metadata and dependencies
├── main.js              # Electron main process controller & IPC pipe
└── vite.config.js       # Vite bundle bundler options
```
