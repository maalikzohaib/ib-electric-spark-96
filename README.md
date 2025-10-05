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

Happy Coding!