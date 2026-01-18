# Waikato Alumni Connect

Waikato Alumni Connect is a full-stack mentoring platform that connects Waikato University students with alumni mentors.

## Documentation

- **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** - Project overview and key features
- **[SETUP_GUIDE.md](SETUP_GUIDE.md)** - Setup and installation instructions
- **[TECHNICAL_STACK.md](TECHNICAL_STACK.md)** - Technology stack and architecture
- **[WORKFLOW_GUIDE.md](WORKFLOW_GUIDE.md)** - User workflows and business processes
- **[BACKEND_API_DOCUMENTATION.md](frontend/BACKEND_API_DOCUMENTATION.md)** - Complete API reference

## Quick Start

1. Install dependencies: `npm install` in both `backend/` and `frontend/`
2. Configure database: Create `.env` in `backend/` with `DATABASE_URL`
3. Run migrations: `npx prisma migrate deploy`
4. Generate Prisma client: `npx prisma generate`
5. Start backend: `npm run dev` in `backend/`
6. Start frontend: `npm run dev` in `frontend/`

See [SETUP_GUIDE.md](SETUP_GUIDE.md) for detailed instructions.

