# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/e401f384-194f-4f22-a29d-3fcdd2950f23

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/e401f384-194f-4f22-a29d-3fcdd2950f23) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/e401f384-194f-4f22-a29d-3fcdd2950f23) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

## Environment & Database Setup

This project uses **Supabase** as the PostgreSQL database. You need to set up environment variables for database connection.

### Required Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Supabase Configuration
SUPABASE_URL=https://okbomxxronimfqehcjvz.supabase.co
SUPABASE_SERVICE_KEY=sbp_4106aec120b0aab8f0552ca0d2ef77bfda138378

# Supabase PostgreSQL Connection String
# Get this from: Supabase Dashboard > Project Settings > Database > Connection String (URI)
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.okbomxxronimfqehcjvz.supabase.co:5432/postgres

# For Vite (frontend) - optional
VITE_SUPABASE_URL=https://okbomxxronimfqehcjvz.supabase.co
VITE_SUPABASE_SERVICE_KEY=sbp_4106aec120b0aab8f0552ca0d2ef77bfda138378
VITE_DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.okbomxxronimfqehcjvz.supabase.co:5432/postgres
```

### Getting Your Supabase Credentials

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard/project/okbomxxronimfqehcjvz)
2. Click on **Settings** (gear icon) → **Database**
3. Copy the **Connection String** (URI format) and replace `[YOUR-PASSWORD]` with your actual database password
4. For the API keys, go to **Settings** → **API**

### Running Migrations

Run migrations to set up the database schema:

```bash
npm run migrate
```

This executes `create_missing_tables.sql` and `fix-pages-table.sql` against your Supabase database to create the `pages`, `products`, `categories`, and related tables.
