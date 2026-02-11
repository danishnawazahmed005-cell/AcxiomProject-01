# Environment Variables Setup

## Development Environment

Copy the following to your `.env.local` file:

```
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secret-key-here-change-in-production"
JWT_SECRET="your-jwt-secret-here-change-in-production"
```

## Production Environment

For production deployment:

1. **Database:** Change DATABASE_URL to PostgreSQL:
   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/event_management_db"
   ```

2. **Secrets:** Generate secure random secrets:
   ```bash
   # For NEXTAUTH_SECRET
   openssl rand -base64 32
   
   # For JWT_SECRET
   openssl rand -base64 32
   ```

3. Update `.env.production` with actual values

## Running the Application

### Development Mode
```bash
npm run dev
# or with environment variable
$env:DATABASE_URL = "file:./dev.db"; npm run dev
```

### Database Commands
```bash
# Create or update database schema
npx prisma db push

# Open Prisma Studio (GUI for database management)
npx prisma studio

# Generate Prisma Client after schema changes
npx prisma generate
```

## Default Credentials (for testing)

After running the app, you can test the authentication with these test accounts:

1. **Admin Account** (create for testing):
   - Email: admin@example.com
   - Password: admin123

2. **Vendor Account** (create for testing):
   - Email: vendor@example.com
   - Password: vendor123

3. **User Account** (create for testing):
   - Email: user@example.com
   - Password: user123
