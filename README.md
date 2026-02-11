# Technical Event Management System

A full-stack web application for managing technical events with support for Admin, Vendor, and User roles.

## Tech Stack

- **Framework:** Next.js 15 (App Router) with TypeScript
- **Styling:** Tailwind CSS
- **Database:** SQLite (via Prisma ORM)
- **State Management:** Zustand
- **Authentication:** JWT-based

## Project Structure

```
app/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/               # API routes
│   │   ├── admin/             # Admin pages
│   │   ├── vendor/            # Vendor pages
│   │   ├── user/              # User pages
│   │   ├── sign-up/           # Sign-up pages
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Home/Landing page
│   │   └── globals.css        # Global styles
│   ├── components/            # Reusable components
│   ├── lib/                   # Utility functions
│   │   └── auth.ts           # Authentication utilities
│   └── store/                 # Zustand stores
│       └── authStore.ts      # Authentication store
├── prisma/
│   └── schema.prisma         # Database schema
├── package.json
├── tsconfig.json
├── next.config.ts
├── tailwind.config.ts
├── postcss.config.mjs
└── .env.local                 # Environment variables
```

## Database Schema

### Users
- id, email, password_hash, role, name, contact_details

### Vendors
- id, user_id (FK), business_name, category, address

### Products
- id, vendor_id (FK), name, price, image_url, description

### Orders
- id, user_id (FK), vendor_id (FK), status, total_amount, payment_method

### OrderItems
- id, order_id (FK), product_id (FK), quantity, price_at_purchase

## Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up the database:**
   ```bash
   npx prisma migrate dev --name init
   ```

    # Acxiom Project — Technical Event & Marketplace System

   **Acxiom Project** is a full-stack Next.js application that supports Admin, Vendor, and User roles for managing events, vendors, products, and orders. It's built with TypeScript, Prisma ORM, Tailwind CSS, and Zustand for state management. This README is written for evaluators and maintainers — it explains architecture, how to run the project, and how to deploy safely.

   ---

   ## ✨ Key Features

   ### Core Functionality
   - **Role-based system**: Admin, Vendor, and User with dedicated dashboards and permissions.
   - **Product & Order management**: Vendors can create products; users can order and view order history.
   - **Authentication**: Email/password sign-up and login flows (adaptable to NextAuth or JWT).

   ### Admin / Vendor / User
   - **Admin**: Manage users, vendors, and orders via `/admin/dashboard`.
   - **Vendor**: Manage products, view and update orders via `/vendor/dashboard`.
   - **User**: Browse marketplace, manage cart, checkout, and view order history via `user` routes.

   ### Reliability & UX
   - **Tailwind CSS** for responsive UI and consistent design system.
   - **Zustand** for lightweight client state and persistence.
   - **Prisma** for type-safe database access and migrations.

   ---

   ## 🚀 Quick Start (Development)

   ### Prerequisites
   - Node.js 18+
   - npm (or yarn)

   ### Local setup

   1. Clone and install:
   ```bash
   git clone <repo-url>
   cd app
   npm install
   ```

   2. Create a local environment file `.env.local` (example keys):
   ```env
   DATABASE_URL="file:./dev.db"
   # Add other envs: NEXTAUTH_SECRET, SESSION_SECRET, etc.
   ```

   3. Run Prisma (development):
   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```

   4. Start development server:
   ```bash
   npm run dev
   ```

   Open `http://localhost:3000` in your browser.

   ---

   ## 🛠️ Project Structure (high level)

   - `app/` — Next.js App Router pages, layouts, and API routes
   - `src/app/admin/`, `src/app/vendor/`, `src/app/user/` — Role-specific pages
   - `src/components/` — Reusable UI components
   - `src/lib/` — Utilities (authentication helpers, API helpers)
   - `src/store/` — Zustand stores (e.g., `authStore.ts`, `cartStore.ts`)
   - `prisma/` — Prisma schema and migrations
   - `package.json`, `next.config.ts`, `tailwind.config.ts` — project config

   Use the App Router (`app/`) and server components where appropriate.

   ---

   ## 🔧 Tech Stack

   | Layer | Tool / Library | Purpose |
   |-------|----------------|---------|
   | Framework | Next.js (App Router) | Server & client rendering, routing |
   | Language | TypeScript | Type safety and DX |
   | Styling | Tailwind CSS | Utility-first styling |
   | ORM | Prisma | Database schema, migrations, client |
   | DB (dev) | SQLite (dev) | Local development DB (swap for Postgres in prod) |
   | State | Zustand | Client state with persistence |
   | Auth Helpers | `src/lib/auth.ts` | Local auth utilities (adaptable to NextAuth)

   ---

   ## ✅ Production Readiness Checklist

   - Provision a production database (Postgres, Neon, Supabase, PlanetScale).
   - Set environment variables in your host: `DATABASE_URL`, `NEXTAUTH_SECRET`, any OAuth keys.
   - Run Prisma migrations in production: `npx prisma migrate deploy`.
   - Ensure `NODE_ENV=production` and secrets are kept secure.
   - Add monitoring, error reporting, and backups.

   ---

   ## 🔁 Deploying (recommended: Vercel)

   1. Push repository to GitHub.
   2. Connect repository in Vercel dashboard and set Environment Variables (Production):
      - `DATABASE_URL`
      - `NEXTAUTH_SECRET` (generate via `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)
   3. Configure CI step (or Vercel pre-deploy) to run migrations:
   ```bash
   npx prisma generate
   npx prisma migrate deploy
   ```
   4. Vercel will run `npm run build` and deploy the site.

   If you must deploy before provisioning a DB, add defensive checks so server code doesn't throw when `DATABASE_URL` is missing (see `src/lib/prisma` pattern).

   ---

   ## 🧭 Architecture & Data Flow (summary)

   - User interacts with Next.js pages and API routes under `app/api/`.
   - API routes call service functions in `src/lib/` which use Prisma for DB access.
   - Client state (Zustand) persists UI preferences locally.

   ---

   ## 🧾 API Endpoints (examples)

   - `POST /api/auth/login` — authenticate user
   - `POST /api/auth/sign-up/user` — register user
   - `POST /api/auth/sign-up/vendor` — register vendor
   - `GET /api/products` — public product listing
   - `POST /api/orders` — create order

   Refer to the `src/app/api/` folder for concrete implementations.

   ---

   ## 🛠️ Local Development Helpers

   - Run tests (if present): `npm test`
   - Lint & format: `npm run lint`, `npm run format`
   - Build for production: `npm run build`

   ---

   ## 🤝 Contributing

   Contributions, issues, and feature requests are welcome. Please open issues or PRs against the repository.

   ---

   ## 📄 License

   This project is currently private. Add an open-source license (e.g., MIT) if you plan to publish.

   ---

   ## 🙏 Acknowledgements

   - Next.js
   - Tailwind CSS
   - Prisma
   - Zustand

   ---

   Built with ❤️ by Danish Nawaz Ahmed
