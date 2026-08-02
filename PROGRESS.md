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