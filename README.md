# Ijaz Brothers Electric Store

This is the official repository for the Ijaz Brothers Electric Store website.

## 🚀 Introduction

Welcome to the Ijaz Brothers Electric Store project! This is a modern, responsive e-commerce website built to showcase and sell a wide variety of electrical supplies.

## ✨ Features

*   **Product Catalog:** Browse a comprehensive catalog of electrical products.
*   **Search & Filtering:** Easily find products with powerful search and filtering options.
*   **User Accounts:** Customers can create accounts to manage their orders and personal information.
*   **Shopping Cart:** A fully functional shopping cart for a seamless checkout experience.
*   **Responsive Design:** The website is optimized for all devices, including desktops, tablets, and smartphones.

## 🛠️ Technologies Used

This project is built with a modern tech stack:

*   **Frontend:**
    *   [Vite](https://vitejs.dev/) - A next-generation frontend tooling.
    *   [React](https://reactjs.org/) - A JavaScript library for building user interfaces.
    *   [TypeScript](https://www.typescriptlang.org/) - A typed superset of JavaScript.
    *   [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework.
    *   [shadcn-ui](https://ui.shadcn.com/) - Re-usable components built using Radix UI and Tailwind CSS.
*   **Backend & Database:**
    *   [Supabase](https://supabase.io/) - The open source Firebase alternative.
    *   [Neon](https://neon.tech/) - Serverless Postgres.

## 🏁 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

You need to have [Node.js](https://nodejs.org/en/) and [npm](https://www.npmjs.com/) installed on your machine. It's recommended to use [nvm](https://github.com/nvm-sh/nvm) to manage Node.js versions.

### Installation

1.  **Clone the repo**
    ```sh
    git clone <YOUR_GIT_URL>
    ```
2.  **Navigate to the project directory**
    ```sh
    cd <YOUR_PROJECT_NAME>
    ```
3.  **Install NPM packages**
    ```sh
    npm install
    ```
4.  **Set up environment variables**

    Create a `.env.local` file in the root of the project and add your Supabase credentials:

    ```env
    VITE_SUPABASE_URL=YOUR_SUPABASE_URL
    VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
    ```
5.  **Run the development server**
    ```sh
    npm run dev
    ```
    The application will be available at `http://localhost:5173`.

## 🚀 Deployment

This project can be easily deployed using platforms like [Vercel](https://vercel.com/) or [Netlify](https://www.netlify.com/).

---

<<<<<<< HEAD
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
=======
Happy Coding!
>>>>>>> 38e62bab54f5ea21847fd19ddf0095c76b7ddd3b
