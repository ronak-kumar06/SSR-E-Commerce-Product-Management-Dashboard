# Local Development & Run Instructions  
## E-Commerce Product Management Dashboard (SSR)

This document explains how to run the project locally for development, testing, and evaluation.

---

## Project Overview

This is a server-side rendered (SSR) admin dashboard built using Next.js 15 (App Router).  
It supports admin-only authentication, product CRUD operations, image uploads via Cloudinary, and uses MongoDB Atlas as the database.

---

## Prerequisites

Ensure the following are installed:

- Node.js (v18 or later)
- npm
- MongoDB Atlas account
- Cloudinary account
- Internet connection

---

## Clone the Repository

```bash
git clone <your-github-repository-url>
cd CDC_dev_project
```

```bash
npm install
```

---

## Environment Variables Setup(.env file)

Create a file named .env.local in the project root.

# MongoDB (Atlas)
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/ecommerce-dashboard

# Authentication
NEXTAUTH_SECRET=your_secure_random_secret
NEXTAUTH_URL=http://localhost:3000

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

Use MongoDB Atlas for both local and production.
Keep NEXTAUTH_URL as http://localhost:3000 for local runs.
Do not commit .env.local to GitHub.
Generate a secure secret using:

```bash
openssl rand -base64 
```

---

## Admin User Setup (Required)

The dashboard is admin-only, so at least one admin user must exist in the database.

Insert an admin user into the users collection using MongoDB Atlas or MongoDB Compass:

{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "<bcrypt-hashed-password>",
  "role": "admin"
}

Generate bcrypt hash locally:

const bcrypt = require("bcryptjs");
bcrypt.hashSync("demo@123", 10);

Paste the generated hash into the database.

```bash
npm run dev
```

## Open in browser: 
http://localhost:3000/login

Login using admin credentials.