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

   This will create the SQLite database and run migrations.

3. **Generate Prisma Client:**
   ```bash
   npx prisma generate
   ```

## Running the Project

### Development Mode

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Production Build

```bash
npm run build
npm start
```

## Features

### Authentication
- **Landing Page:** Entry point with Login and Sign-up options
- **Login:** Email and password-based authentication with role-based redirection
- **Sign-up:** Separate flows for Users and Vendors with specific fields

### User Roles

**Admin:**
- Dashboard at `/admin/dashboard`
- Manage users, vendors, and orders

**Vendor:**
- Dashboard at `/vendor/dashboard`
- Manage products and orders
- View analytics

**User:**
- Home at `/user/home`
- Browse products
- Manage orders
- Edit profile

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/sign-up/user` - User registration
- `POST /api/auth/sign-up/vendor` - Vendor registration

## Color Theme

- **Primary Blue:** `#4A90E2`
- **Light Grey Background:** `#F5F5F5`
- **White Cards:** `#FFFFFF`

## Development Notes

1. **Database:** The project uses SQLite for development. Update `.env.local` to use PostgreSQL in production.

2. **Authentication:** Tokens are stored in localStorage. Implement secure cookie-based storage for production.

3. **Error Handling:** Basic error handling is in place. Enhance with proper logging and monitoring in production.

4. **Environment Variables:** Update `.env.local` with production secrets before deployment.

## Next Steps

1. Implement protected routes middleware
2. Add product listing and filtering
3. Implement shopping cart and checkout
4. Add order management features
5. Set up payment gateway integration
6. Add email notifications
7. Implement admin analytics
8. Add image upload functionality

## License

This project is private and for educational purposes.
