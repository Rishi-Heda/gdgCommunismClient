# Connect to Real MongoDB and Replace Placeholders

We will transition the application from using static placeholders in `src/data/mock.js` to fetching real, live data from the MongoDB database defined by your schema. Since the Vite/React application runs in the browser, direct connections to a MongoDB Cluster are insecure and usually fail due to lacking Node core modules. Therefore, we will architect this cleanly by:

1. Connecting your **Python FastAPI Backend** (`main.py`) to MongoDB using the `motor` async driver.
2. Exposing the required data via **REST API endpoints**.
3. Updating your **React Contexts & Components** to fetch from these new endpoints.

## User Review Required

> [!IMPORTANT]
> - Is there a specific `userID` we should use for the local node to fetch `mind_credits` and `hive_coins`? Currently, your config exposes a `NODE_UUID` (e.g. `"node-demo-001"`). We'll assume this acts as the primary `userID` for the local dashboard session. Is this correct?
> - Your `jobs` schema only defined `id` and `assigned_node_id`. Since the UI requires extra info (like `name`, `status`, `progress`, `submitter`), we will extend the schema in our MongoDB queries to pull these fields as well.
> - The application will expect the MongoDB to have at least *some* records to look beautiful, otherwise it will be empty. If you'd like, I can write a small script during execution to inject initial realistic data into your MongoDB cluster. Would you like me to do that?

## Proposed Changes

### Backend (Python FastAPI)

#### [MODIFY] `requirements.txt`
- Add `motor` (the async python MongoDB driver) to securely connect to the database.

#### [MODIFY] `src/core/config.py`
- Add `MONGODB_URL: str = os.getenv("MONGODB_URL", "")` to load your connection string properly from the `.env` file.

#### [NEW] `src/storage/db.py`
- Create a reusable mongodb client instance (`AsyncIOMotorClient`).
- Create standard getter functions for reading the 4 collections (`users`, `system_specs`, `node_insights`, `jobs`).

#### [MODIFY] `src/api/routes.py`
Add new endpoints:
- `GET /api/wealth` -> Checks the `users` collection for `mind_credits` and `hive_coins`.
- `GET /api/jobs` -> Returns active and historical tasks from the `jobs` collection.
- `GET /api/nodes` -> Joins `users`, `system_specs`, and `node_insights` to format node statuses for the dashboard.
- `GET /api/activity` -> Computes mock or real network activity based on `node_insights` and completed jobs.

---

### Frontend (React / Vite)

#### [MODIFY] `src/context/WealthContext.jsx`
- Replace `mockWealth` usage.
- Add `useEffect` to fetch real wealth balances from `/api/wealth` on mount and set up a state parameter for live polling.

#### [MODIFY] `src/pages/Dashboard.jsx`
- Add `useState` and `useEffect` blocks to fetch Jobs and Active Compute Nodes from `/api/jobs` and `/api/nodes`.
- Replace instances of `mockJobs` and `mockNodes` with the fetched state.
- Handle loading and empty states cleanly.

#### [MODIFY] `src/pages/JobsList.jsx` & `src/pages/JobDetails.jsx`
- Replace `mockJobs` entirely.
- Add `fetch` calls to `/api/jobs` so the detailed list accurately reflects the database.

#### [MODIFY] `src/pages/Contributors.jsx` (If Applicable)
- Use data from `users` + `node_insights` to retrieve network contributors.

## Open Questions

> [!WARNING]
> By default, `Dashboard.jsx`, etc., are querying the local Python API running on `http://127.0.0.1:8001`. Is this local backend always expected to be running when the user opens the React dashboard, or do you have a remote server deployment planned for the dashboard data?

## Verification Plan

### Automated Tests
- Running the `main.py` FastApi server and ensuring MongoDB connection doesn't throw `ServerSelectionTimeoutError`.

### Manual Verification
1. Open the Vite React frontend.
2. Verify that network calls (`F12 -> Network`) successfully hit the `/api/...` endpoints and return standard JSON instead of crashing.
3. Verify the Dashboard Populates with Data originating from your MongoDB instance.
