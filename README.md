# ResearchBridge Platform

ResearchBridge is a high-performance academic collaboration platform connecting university students with research supervising professors, publications, active project openings, and an AI research assistant powered by Google Gemini.

## Repository Layout
- **[`backend/`](backend/)**: Complete FastAPI backend, Pydantic schemas, Gemini AI integration, test suites, and Docker deployment configs.
- **[`database/`](database/)**: PostgreSQL SQL migrations for the Supabase SQL Editor.
  - [`database/schema.sql`](database/schema.sql) — Single one-click query for Supabase SQL Editor.
  - [`database/01_schema.sql`](database/01_schema.sql) — Core tables, triggers, ENUMs, indexes.
  - [`database/02_rls_policies.sql`](database/02_rls_policies.sql) — Row Level Security policies.
  - [`database/03_storage.sql`](database/03_storage.sql) — Storage bucket & Realtime publication.
  - [`database/04_seed.sql`](database/04_seed.sql) — Initial institutions and research taxonomy.
- **[`supabase/migrations/`](supabase/migrations/)**: Supabase CLI compatible migration files.

## Running Backend
```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

## Running Tests
- **Automated Pytest Suite (25 Tests)**: `PYTHONPATH=backend pytest backend/app/tests -v`
- **Comprehensive Curl Suite (48 Endpoints)**: `./backend/test_endpoints.sh 8000`