# 📊 Daily Life Tracking System (DLT)

A premium, interactive desktop cockpit application designed to track habits, study logs, fitness metrics, personal budget, savings goals, anime watchlists, and upcoming events. Built with a sleek glassmorphic theme and time-aware dynamic elements.

---

## 🎨 Key Features

*   **🌅 Dynamic Time-of-Day Gradients**: The main dashboard dynamically transitions its background color palette through 5 distinct watercolor gradients (Night, Dawn, Morning, Afternoon, Evening) depending on the time of day.
*   **🫧 Glassmorphic Cockpit**: Summary cards, focus area inputs, and quick-action widgets feature a premium frosted-glass design with subtle micro-animations and drop shadows.
*   **📈 Interactive Analytics**: Integrated tabbed charts powered by Chart.js displaying:
    *   Savings Growth
    *   Monthly Expenses by Category
    *   Savings Goals Progress
    *   Calories Burned Trends
*   **🎯 Today's Focus Widget**: A simple, editable task area that saves your daily priority to local storage.
*   **🗂️ Dedicated Tracking Modules**:
    *   🏃 **Fitness Tracker**: Steps count & calorie logging.
    *   💰 **Expenses Manager**: Budget tracker.
    *   🏦 **Savings Goals**: Milestone tracker for savings.
    *   📚 **Study & Book Logs**: Book tracking and reading session logging.
    *   🎬 **Anime Watchlist**: Keep tabs on currently watching and completed shows.
    *   📅 **Events Calendar**: Simple scheduler.
    *   🎯 **Goals Board**: Setting long-term milestones.
    *   💧 **Water Intake**: Daily hydration counter.
*   **🔒 Offline-First**: All data is persisted locally in the application's secure `localStorage` sandbox. No internet required.

---

## 🛠️ Technology Stack

*   **Framework**: [Electron](https://www.electronjs.org/) (for packaging HTML/JS as a desktop application)
*   **Frontend**: HTML5, Vanilla CSS3 (Custom Variables & Gradients)
*   **Logic**: Vanilla JavaScript (ES6+)
*   **Data Visualization**: [Chart.js](https://www.chartjs.org/)
*   **Typography**: Google Fonts (*Playfair Display* & *Plus Jakarta Sans*)

---

## 🚀 Installation & Running

Ensure you have [Node.js](https://nodejs.org/) installed on your computer.

1. **Clone this repository** to your local machine.
2. **Install dependencies** using your terminal:
   ```bash
   npm install
   ```
3. **Launch the application**:
   ```bash
   npm start
   ```

---

## 📁 Repository Structure

```
├── home.html           # Main dashboard UI
├── dashboard.html      # Legacy dashboard view
├── sidebar.html        # Shared navigation menu
├── style.css           # Global design system & style properties
├── script.js           # Shared app data handlers & charting logic
├── main.js             # Electron window setup and lifecycle
└── pages/              # Module tracker pages
    ├── fitness.html
    ├── finance.html
    ├── saving.html
    ...
```
