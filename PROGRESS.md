# FinSight — Build Log

## Day 1
- Installed PostgreSQL 18.4, created `finsight` database
- Installed Node.js
- Set up Express server, connected to PostgreSQL using `pg` and connection pooling
## Day 2
- Created `users` table (id, name, email, password, created_at)
- Built signup route — hashes password with bcrypt, inserts into DB
- Built login route — verifies password, issues JWT token (7 day expiry)
- Tested both routes in Postman
## Day 3
- Built JWT auth middleware to protect routes
- Created `categories` and `transactions` tables (linked to `users` via foreign key)
- Built protected POST /api/transactions route — creates transaction tied to logged-in user
- Tested end-to-end in Postman
## Day 4
- Built GET /api/transactions — fetches all transactions for logged-in user, joined with category name
- Built PUT /api/transactions/:id — updates a transaction (only if it belongs to the logged-in user)
- Built DELETE /api/transactions/:id — deletes a transaction (only if it belongs to the logged-in user)
- Tested full CRUD cycle in Postman — all working correctly
## Day 5
- Added input validation using Zod — rejects malformed requests with clear error messages before they touch the database
- Built `budgets` table with a UNIQUE constraint (one budget per user/category/month)
- Built POST /api/budgets — create a budget
- Built GET /api/budgets/status — joins budgets with transactions to compute spent-vs-limit per category in a single SQL query
- Added pagination (limit/offset) to GET /api/transactions, with a total count and page metadata in the response
## Day 6
- Set up React frontend with Vite, installed axios and react-router-dom
- Built centralized API helper (axios instance with baseURL)
- Built Signup page — form connects to POST /api/auth/signup
- Built Login page — form connects to POST /api/auth/login, stores JWT token in localStorage
- Set up routing (Login, Signup, Dashboard pages) with React Router
- Confirmed full auth flow working end-to-end: signup → login → redirect to dashboard
## Day 7
- Built ProtectedRoute component — redirects unauthenticated users away from Dashboard
- Added axios interceptor to auto-attach JWT token to every API request
- Built real Dashboard — fetches transactions from backend and displays them
- Confirmed full data flow working: PostgreSQL → Express API → React frontend, authenticated end-to-end
## Day 8
- Built AddTransactionForm component — reusable, communicates with parent via callback prop
- Updated Dashboard to fetch transactions and budget status together (Promise.all)
- New transactions appear instantly in UI, budget status updates automatically after adding
- Added visual "over budget" warning when spending exceeds monthly limit
## Day 9
- Set up Python virtual environment for ML component
- Generated a synthetic labeled dataset (~230 examples across 7 categories) for transaction categorization
- Trained a text classifier (TF-IDF + Logistic Regression) using scikit-learn
- Identified and understood a data-leakage issue in initial evaluation; validated real performance (75%) using manual unseen-data testing
- Wrapped the model in a Flask API (/predict-category) with confidence scoring
- Connected Node backend to Flask ML service — transactions without a manually chosen category are now auto-categorized by the trained model
- Confirmed full pipeline working end-to-end: React → Node → Flask ML → PostgreSQL
## Day 10
- Seeded 6 months of realistic historical transaction data for forecasting
- Built GET /api/transactions/history/:categoryId — aggregates monthly spending using SQL DATE_TRUNC
- Built Flask /forecast endpoint using Linear Regression to predict next month's spend, with confidence bounds and trend direction
- Connected Node → Flask for forecasting, fully wired end-to-end
- Identified and fixed a data quality bug: excluded incomplete current month from forecast calculation to avoid skewed trend
## Day 11
- Seeded transaction data including a deliberate outlier for testing
- Built Flask /detect-anomaly endpoint — initially used IsolationForest, found it unreliable on small datasets, switched to Z-score statistical method (more appropriate and interpretable for this data size)
- Connected Node → Flask for anomaly detection — POST /api/transactions/check-anomaly pulls user's real transaction history and flags unusual amounts
- Confirmed end-to-end: real anomaly correctly detected using live database history
## Day 12
- Set up Gemini API integration (gemini-3.6-flash)
- Built AI Financial Assistant using RAG pattern: retrieves real transactions + budgets from PostgreSQL, injects as context into prompt, LLM answers using only that real data
- Prompt engineered to explicitly prevent hallucination — model instructed to only use provided data and admit when data is insufficient
- Tested end-to-end: assistant correctly summarized and totaled real spending data across multiple months
## Day 13
- Built GET /api/assistant/monthly-insight — auto-generated natural language summary comparing current month vs previous month spending by category
- Reused the RAG pattern from Day 12 (real DB data → context → Gemini → grounded summary)
- Tested end-to-end: correctly summarized real spending changes across categories with accurate numbers
## Day 14
- Added Food spending forecast display to Dashboard (predicted amount, range, trend)
- Built AssistantChat component — connects to /api/assistant/ask
- Wired AI assistant into Dashboard — users can now ask natural language questions and get real, data-grounded answers directly in the UI
- Confirmed full RAG pipeline working visually end-to-end
## Day 14
- Added Food spending forecast display to Dashboard
- Built AssistantChat component — AI assistant now usable directly in the UI
- Added monthly insight summary display, auto-fetched on dashboard load
- Added anomaly detection warning when adding transactions — flags unusually large amounts before/alongside creation
- Confirmed all 4 AI/ML features (categorization, forecasting, anomaly detection, RAG assistant) fully wired and visible in the frontend
## Day 15
- Set up Tailwind CSS + Framer Motion in the frontend
- Designed and integrated a custom logo
- Built reusable AnimatedBackground component (glowing, drifting gradient orbs)
- Completely redesigned Login and Signup pages: glass-morphic card, staggered entrance animations, icon-enhanced inputs with focus glow, gradient CTA buttons with hover glow
- Established emerald/teal as the app's core color theme, matching the logo
## Day 16
- Built Navbar component with logo and logout, sticky glass header
- Completely redesigned Dashboard: stat cards with icons, animated budget progress bars, color-coded trend badges, staggered transaction list entrance
- Restyled AddTransactionForm to match theme — icon inputs, glowing Add button, animated anomaly warning
- Restyled AssistantChat — glass card, glowing send button, spinning loader state, highlighted answer box
- Added consistent hover interactions (lift + glow) across all dashboard cards and transaction rows
## Day 18
- Installed Recharts, built custom-styled animated area chart for spending trends (glass tooltip, gradient fill, self-drawing animation)
- Built AnimatedNumber component — numbers count up smoothly from 0 using Framer Motion's useMotionValue
- Added GET /api/transactions/history-overview backend endpoint — aggregates total monthly spending across all categories
- Applied consistent hover glow effect across all dashboard cards (previously inconsistent)
- Wired chart and animated forecast number into Dashboard
## Day 19
- Built Feature 1: Smart Financial Goal Planner & "What-If" Spending Cut Simulator (0 LLM API calls, 100% deterministic math & SQL)
- Auto-initialized `goals` PostgreSQL table on server startup (`initDb.js`)
- Added Zod validators (`goalValidator.js`) and REST endpoints (`GET /api/goals`, `POST /api/goals`, `PUT /api/goals/:id`, `DELETE /api/goals/:id`)
- Built `/api/goals/simulate` endpoint to compute projected goal completion date acceleration based on category cut percentages
- Created `GoalPlanner.jsx` UI component with glassmorphic cards, goal progress bars, quick savings deposit, and real-time interactive What-If cut sliders
- Integrated `GoalPlanner` into main Dashboard UI
## Day 20
- Built Feature 2: Automated Subscription & Recurring Bill Detector (0 LLM API calls, algorithmic interval matching)
- Auto-initialized `subscriptions` PostgreSQL table on server startup (`initDb.js`)
- Added Zod validator (`subscriptionValidator.js`) and REST endpoints (`GET /api/subscriptions`, `POST /api/subscriptions`, `DELETE /api/subscriptions/:id`, `POST /api/subscriptions/dismiss`)
- Built algorithmic pattern detection analyzing merchant name normalization, inter-transaction day delta ($\Delta t \approx 30$ days / $365$ days), and price hike detection (>8% variance)
- Created `SubscriptionTracker.jsx` UI component displaying total monthly/annual recurring costs, 7-day upcoming renewal alerts, price hike badges, delete/dismiss actions for all items, and manual subscription tracking
- Integrated `SubscriptionTracker` into Dashboard UI
## Day 21
- Built Feature 5: Financial Health Score & Gamified Micro-Habits (0 LLM API calls, 100% rule-based math & SQL)
- Built `healthScoreRoutes.js` (`GET /api/health-score`) evaluating Budget Adherence (35 pts), Goal Progress (30 pts), Spending Stability Buffer (20 pts), and Subscription Efficiency (15 pts) into a single 0-100 composite score
- Algorithmically generated actionable weekly micro-habits based on live PostgreSQL metrics
- Built `HealthScoreCard.jsx` UI component featuring animated count-up score gauge, sub-score breakdown bars, and interactive habit completion checkboxes
- Integrated `HealthScoreCard` into Dashboard UI
## Day 20 (Testing)
- Set up Jest + Supertest for backend API testing
- Created isolated `finsight_test` database, separate `.env.test` config
- Restructured server.js to export the Express app without auto-starting the server (enables testing without port conflicts)
- Wrote first test suite: auth routes — signup success, duplicate email rejection, login success, wrong password rejection
- All 4 tests passing
## Day 20 (Testing, continued)
- Wrote transaction route test suite: auth rejection, creation, validation rejection, read, update, delete, and post-delete verification
- Full lifecycle tested end-to-end using a single transaction ID across sequential tests
- Total: 11 passing tests across 2 test suites (auth + transactions)
## Day 21 (Deployment)
- Created production PostgreSQL database on Render, recreated schema via psql
- Deployed Node backend to Render as a web service, connected to environment variables for DB credentials, JWT secret, and Gemini API key
- Confirmed live backend successfully connects to live database (GET /api/test working in production)
## Day 21 (Deployment, continued)
- Deployed Flask ML service to Render (finsight-ml), added requirements.txt and gunicorn for production
- Connected Node backend to live Flask service via ML_SERVICE_URL environment variable
- Debugged and resolved: hardcoded localhost URL not updated in committed code, then a 502 error caused by Flask's free-tier cold start (service sleeping after inactivity)
- Confirmed full production pipeline working: React (local) → Node (Render) → Flask (Render) → PostgreSQL (Render), auto-categorization working end-to-end in production
## Day 21 (Deployment, continued)
- Increased axios timeout to 60s on all ML service calls (predict-category, forecast, detect-anomaly) to handle Render free-tier cold starts gracefully
- Added loading state with spinner to AddTransactionForm during ML categorization wait
- Verified: transaction correctly auto-categorized even after a genuine cold start (Flask waking from sleep)