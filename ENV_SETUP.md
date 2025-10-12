# Environment Variables Setup

This document explains how to set up your environment variables for the Supabase database integration.

## Required Environment Variables

Create a `.env` file in the root directory of the project with the following variables:

```env
# Supabase Configuration
# Project URL - your Supabase project URL
SUPABASE_URL=https://okbomxxronimfqehcjvz.supabase.co

# Service Role Key - for server-side operations (keep this secret!)
SUPABASE_SERVICE_KEY=sbp_4106aec120b0aab8f0552ca0d2ef77bfda138378

# Supabase PostgreSQL Connection String
# Format: postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
# Get this from: Supabase Dashboard > Project Settings > Database > Connection String (URI)
# Replace [YOUR-PASSWORD] with your actual database password
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.okbomxxronimfqehcjvz.supabase.co:5432/postgres

# Alternative environment variable name for Supabase database URL (optional)
SUPABASE_DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.okbomxxronimfqehcjvz.supabase.co:5432/postgres

# Vite Environment Variables (for frontend)
# These must be prefixed with VITE_ to be accessible in the browser
VITE_SUPABASE_URL=https://okbomxxronimfqehcjvz.supabase.co
VITE_SUPABASE_SERVICE_KEY=sbp_4106aec120b0aab8f0552ca0d2ef77bfda138378
VITE_DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.okbomxxronimfqehcjvz.supabase.co:5432/postgres
```

## How to Get Your Credentials

### Step 1: Get Database Connection String

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard/project/okbomxxronimfqehcjvz)
2. Click on **Settings** (gear icon) in the left sidebar
3. Navigate to **Database** section
4. Scroll down to **Connection String**
5. Select **URI** format
6. Copy the connection string
7. Replace `[YOUR-PASSWORD]` with your actual database password

### Step 2: Get API Keys

1. In the same Supabase Dashboard
2. Go to **Settings** → **API**
3. Copy your **service_role** key (this is the `SUPABASE_SERVICE_KEY`)
4. Copy your **Project URL** (this is the `SUPABASE_URL`)

## Important Notes

- **Never commit the `.env` file** - it's already in `.gitignore`
- The `service_role` key has full access to your database - keep it secret!
- Use the `anon` public key for client-side operations if needed
- The database password is set when you create your Supabase project

## Vercel/Production Deployment

When deploying to Vercel or other platforms, add these environment variables in your deployment settings:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_KEY`
- `DATABASE_URL`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_SERVICE_KEY`
- `VITE_DATABASE_URL`

## Testing Your Setup

After setting up your `.env` file, you can test the database connection by running:

```bash
npm run migrate
```

This will run the migration scripts and create the necessary database tables if the connection is successful.

