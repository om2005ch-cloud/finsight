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