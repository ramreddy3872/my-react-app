# NovaTask Pro • Modern Full-Stack Agile Project & Task Management Suite

> **NovaTask Pro** is a modern, responsive, full-stack web application designed for engineering, design, and product management teams. It empowers organizations to organize sprints, prioritize deliverables, track real-time progress KPIs, and collaborate seamlessly across devices.

---

## 🌟 Highlights & Key Features

### 1. 🎨 Modern & Responsive UI/UX
- **Design System**: Hand-crafted CSS custom token architecture with smooth transitions, responsive typography, and glassmorphism.
- **Light & Dark Mode**: Persistent theme switcher using CSS custom properties with automatic system and localStorage synchronization.
- **Responsive Navigation**: Sticky navbar with branding, navigation pills, quick-create modal shortcut, dark mode toggle, user profile avatar, and animated mobile hamburger drawer.
- **Modern Landing Page**: High-converting hero section with dynamic metric counters, preview showcase banner, capability cards, social proof testimonials, and newsletter subscription.

### 2. 📊 Rich Project Dashboard & KPIs
- **Real-Time KPI Metric Cards**:
  - Total Pipeline Deliverables
  - In Progress Tasks & Review Phase counts
  - Completed Deliverables & Overall Progress %
  - Urgent & High Priority items
- **Hybrid Data Synchronization**:
  - Live indicator showing connection status: **Express REST API Connected (Port 5000)** or **Client LocalStorage Sync**.

### 3. 🔍 Search, Filter, and Sort Controls
- **Instant Search**: Millisecond search queries filtering task titles, descriptions, assignee names, and hashtag tags (`#Security`, `#React`, etc.).
- **Category Filter Pills**: Fast 1-click filtering by `Development`, `Design`, `Marketing`, `DevOps`, `Research`, and `Security`.
- **Status Filter**: Filter by `Pending`, `In Progress`, `In Review`, and `Completed`.
- **Priority Filter**: Filter by `Urgent`, `High`, `Medium`, and `Low`.
- **Dynamic Sorting**: Sort by Due Date, Priority Severity, Progress Percentage, or Title (A-Z).
- **Dual View Modes**:
  - **Cards Grid View**: Rich visual card layout with progress bars, due-date urgency warning badges, and tag chips.
  - **Responsive Data Table**: Dense tabular view with sortable columns, quick-status dropdown selector, and action buttons.

### 4. ⚡ Complete CRUD Operations
- **Create (Add)**: Modal form with validation (title, description, category, priority, status, assignee, due date, estimated hours, subtasks checklist).
- **Read (View)**: Dedicated full specification modal with checklist toggles, metadata grid, and progress tracking.
- **Update (Edit)**: Pre-populated modal form with real-time field validation.
- **Delete**: Accessible confirmation dialog (`ConfirmDialog`) preventing accidental deletions with toast notifications.
- **Inline Status Quick-Update**: Change status directly from the table or view modal with automatic progress adjustment.

### 5. 🔐 Authentication & Demo Accounts
- **Zero-Friction 1-Click Demo Login**:
  - **Demo Admin** (`sarah.jenkins@novatask.dev`)
  - **Demo Member** (`alex.rivera@novatask.dev`)
- **User Registration**: Form with full validation (name, corporate email, role title, department, password strength, matching passwords, and terms agreement).
- **Session Persistence**: Authentication state persists across browser reloads.

---

## 🛠️ Technology Stack

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | React 19 + Vite 8 | Ultra-fast build tool and modern component tree |
| **Language** | JavaScript (ES6+ / ESM) | Modern modular syntax with async/await |
| **Routing** | React Router DOM v7 | Client-side routing with deep link support |
| **Icons** | React Icons (`react-icons/fi`) | Feather icon set for clean UI indicators |
| **Styling** | Modern CSS3 + Tokens | Responsive Flexbox/Grid, Dark/Light modes, Animations |
| **Backend** | Node.js & Express.js | REST API server with JSON file persistence |
| **State / Storage** | React Context + LocalStorage | Offline-first sync with graceful fallback |

---

## 📁 Project Structure

```
pulseflow-app/
├── index.html                      # Main HTML template with SEO meta & SVG favicon
├── package.json                    # Dependencies & npm run scripts
├── vite.config.js                  # Vite bundler configuration
│
├── server/                         # Backend Node.js & Express.js REST API
│   ├── index.js                    # Express server with CRUD & Auth endpoints
│   └── data/
│       ├── tasks.json              # Persistent mock tasks data storage
│       └── users.json              # Persistent user accounts data storage
│
└── src/
    ├── main.jsx                    # React entry point with StrictMode
    ├── App.jsx                     # Route definitions, contexts, and global toasts
    ├── assets/                     # Static media & SVG assets
    │
    ├── context/                    # Global React State Contexts
    │   ├── AuthContext.jsx         # User authentication, demo logins & sessions
    │   └── ThemeContext.jsx        # Dark/Light theme state and HTML attributes
    │
    ├── services/                   # API & Data Abstraction Layer
    │   ├── apiService.js           # Hybrid API client (Express API with LocalStorage fallback)
    │   └── initialData.js          # Seed dataset with realistic engineering tasks & team members
    │
    ├── components/                 # Reusable UI Primitives
    │   ├── Navbar.jsx              # Responsive header with theme toggle & user menu
    │   ├── Footer.jsx              # Footer with links, social icons & newsletter
    │   ├── StatCard.jsx            # KPI metric card with icon & percentage trends
    │   ├── TaskCard.jsx            # Grid view task card with progress & actions
    │   ├── TaskTable.jsx           # Responsive data table with inline status dropdown
    │   ├── TaskModal.jsx           # Comprehensive Add/Edit modal form with validation
    │   ├── ViewDetailsModal.jsx    # Full task detail modal with interactive subtasks
    │   ├── ConfirmDialog.jsx       # Delete action confirmation modal
    │   └── Toast.jsx               # Floating toast notifications stack
    │
    ├── pages/                      # Application Route Views
    │   ├── HomePage.jsx            # Landing page with hero, metrics, features & CTA
    │   ├── DashboardPage.jsx       # Main task workspace, table/card toggle & filters
    │   ├── LoginPage.jsx           # Sign in page with 1-click demo login buttons
    │   ├── RegisterPage.jsx        # User signup page with multi-field validation
    │   └── NotFoundPage.jsx        # Custom 404 error page
    │
    └── styles/                     # Modular CSS Design System
        ├── index.css               # Design tokens, variables, reset & utilities
        ├── navbar.css              # Header, drawer & footer styling
        ├── home.css                # Landing page hero, preview card & testimonials
        ├── dashboard.css           # Workspace grid, tables, search toolbar & pills
        ├── auth.css                # Auth cards, inputs & validation error alerts
        └── modals.css              # Dialog backdrops, form layout & toast badges
```

---

## 🚀 Step-by-Step Installation & Running Guide

### Prerequisites
Make sure you have **Node.js** (v18 or higher) and **npm** installed on your system.

To check your versions:
```bash
node -v
npm -v
```

---

### Step 1: Navigate to the Project Directory
Open your terminal / PowerShell and navigate to the project directory:

```bash
cd "C:\Users\Arjun\.gemini\antigravity\scratch\pulseflow-app"
```

---

### Step 2: Install Dependencies
Dependencies are already installed. If running on a fresh clone or new machine:

```bash
npm install
```

---

### Step 3: Run the Application

You have two convenient options to run the application:

#### Option A: Run Frontend (Standalone Mode)
The frontend includes a smart fallback that operates seamlessly using `localStorage` pre-seeded with rich sample tasks. No database or backend server needed!

```bash
npm run dev
```

- Open your browser at: **`http://localhost:5173`**

---

#### Option B: Run Full-Stack (Express REST API Backend + React Frontend)

1. **Terminal 1 — Start the Express Backend Server:**
   ```bash
   npm run server
   ```
   *Express REST API starts on `http://localhost:5000` with endpoints for tasks, stats, and auth.*

2. **Terminal 2 — Start the React Frontend:**
   ```bash
   npm run dev
   ```
   *React Vite application starts on `http://localhost:5173` and automatically detects the live Express backend!*

---

### Step 4: Production Build & Preview
To create an optimized production build:

```bash
npm run build
```

To preview the built production bundle:
```bash
npm run preview
```

---

## 🔑 Demo Login Credentials

For quick evaluation without manual signup:

| Account | Email | Password | Role |
| :--- | :--- | :--- | :--- |
| **Lead Architect (Admin)** | `sarah.jenkins@novatask.dev` | `Password123!` | Lead Architect & Admin |
| **Principal Designer** | `alex.rivera@novatask.dev` | `Password123!` | Principal UI/UX Designer |

> **Pro-Tip**: On the `/login` screen, you can also simply click the **"Demo Admin"** or **"Demo Member"** buttons to log in with 1 click!

---

## 📡 REST API Reference (Node.js & Express)

When running `npm run server` (Port `5000`):

| Method | Endpoint | Description | Query Parameters |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | API operational status check | - |
| `GET` | `/api/tasks` | Get all tasks | `search`, `category`, `status`, `priority`, `sortBy` |
| `GET` | `/api/tasks/:id` | Get single task by ID | - |
| `POST` | `/api/tasks` | Create a new task | Body: `{ title, description, category, priority, status, dueDate, ... }` |
| `PUT` | `/api/tasks/:id` | Update an existing task | Body: Updated task fields |
| `DELETE` | `/api/tasks/:id` | Permanently remove task | - |
| `GET` | `/api/stats` | KPI summary statistics | - |
| `POST` | `/api/auth/login` | Authenticate user | Body: `{ email, password }` |
| `POST` | `/api/auth/register`| Register new account | Body: `{ name, email, password, department, role }` |

---

## 💻 Validation Rules & Error Handling

- **Task Creation & Editing**:
  - `Title`: Required, minimum 4 characters.
  - `Description`: Required, minimum 10 characters.
  - `Due Date`: Required, valid date format.
  - `Estimated Hours`: Positive number greater than 0.
  - `Checklist / Subtasks`: Dynamic addition, deletion, and completion toggles.
- **Authentication**:
  - `Email`: RFC compliant email format check.
  - `Password`: Minimum 6 characters.
  - `Confirm Password`: Must match password identically.
  - `Terms Agreement`: Required to complete registration.
- **Delete Confirmation**:
  - Modal prompt explicitly requiring user confirmation to prevent accidental data loss.
- **Feedback Alerts**:
  - Animated non-blocking toast notifications for all operations (Create, Edit, Delete, Filter Reset, Auth events).
