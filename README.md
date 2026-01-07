# E-Commerce Product Management Dashboard (SSR)

A **production-ready, server-side rendered (SSR) administrative dashboard** for managing products in an e-commerce system.  
Built using **Next.js 15 (App Router)** with a strong focus on **performance, security, and real-world deployment practices**.

The application supports **admin-only authentication**, **product CRUD operations**, **image uploads via Cloudinary**, and is **deployed on Vercel**.

---

## 🚀 Features

- **Server-Side Rendering (SSR)** with Next.js 15 for fast load times and SEO
- **Admin-only Authentication & Authorization** using Auth.js (NextAuth v5)
- **Complete Product Management (CRUD)**
- **Multi-step Product Forms** with validation using Zod
- **Cloudinary Integration** for secure image upload & storage
- **Interactive Dashboard Charts** using Recharts
- **Protected API Routes** (admin-only access)
- **Production-ready build** (passes strict Next.js 15 checks)
- **Deployed on Vercel**

---

## 🧰 Tech Stack

### Frontend & Backend
- Next.js 15 (App Router, SSR)
- TypeScript
- Tailwind CSS

### State & Validation
- TanStack Query (React Query)
- Zod

### Authentication
- Auth.js / NextAuth v5
- Credentials Provider
- JWT-based sessions
- Role-based access control (admin)

### Database & Media
- MongoDB
- Mongoose
- Cloudinary

### Deployment
- Vercel

---

## 📁 Project Structure

```
CDC_dev_project/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/                # API routes
│   │   │   ├── auth/           # NextAuth authentication
│   │   │   ├── products/       # Product CRUD endpoints
│   │   │   └── admin/          # Admin management endpoints
│   │   ├── dashboard/          # Dashboard pages
│   │   ├── login/              # Login page
│   │   └── admin/              # Admin-only pages
│   ├── components/             # React components
│   │   ├── ProductCard.tsx
│   │   ├── ProductCharts.tsx
│   │   └── ProductForm.tsx
│   ├── lib/                    # Utility functions
│   │   ├── auth.ts             # NextAuth configuration
│   │   ├── cloudinary.ts       # Cloudinary integration
│   │   ├── mongodb.ts          # MongoDB connection
│   │   └── validations.ts      # Zod schemas
│   ├── models/                 # Mongoose models
│   │   ├── Product.ts
│   │   └── User.ts
│   └── types/                  # TypeScript type definitions
├── public/                     # Static assets
├── .env.local.example          # Environment variables template
└── README.md
```

## Usage

### Login

1. Navigate to `/login`
2. Enter your admin credentials
3. You'll be redirected to the dashboard upon successful login

### Dashboard

The main dashboard (`/dashboard`) displays:
- Product list with search and filter capabilities
- Interactive charts showing:
  - Top products by sales
  - Top products by stock
  - Products distribution by category
  - Inventory value by category

### Managing Products

#### Create Product

1. Click "Add Product" button
2. Follow the 3-step form:
   - **Step 1**: Basic Information (name, description)
   - **Step 2**: Pricing & Inventory (price, category, stock)
   - **Step 3**: Product Image (upload to Cloudinary)
3. Complete validation at each step
4. Submit to create the product

#### Edit Product

1. Click "Edit" on any product card
2. Modify the product information using the multi-step form
3. Update image if needed
4. Save changes

#### Delete Product

1. Click "Delete" on any product card
2. Confirm deletion
3. The product and its image will be removed from the system

### Admin Management

Only existing admins can create new admin accounts:

1. Click "Add Admin" in the dashboard header
2. Fill in the new admin's details
3. Submit to create the admin account

## API Endpoints

### Authentication
- `POST /api/auth/signin` - User login
- `POST /api/auth/signout` - User logout

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Create a new product
- `GET /api/products/[id]` - Get a specific product
- `PUT /api/products/[id]` - Update a product
- `DELETE /api/products/[id]` - Delete a product
- `POST /api/products/upload` - Upload product image to Cloudinary

### Admin
- `POST /api/admin/onboard` - Create a new admin (admin-only)

All API endpoints require admin authentication.

## Workflow

1. Admin requests the dashboard page
2. Server fetches product data from MongoDB
3. Page is rendered on the server with product data
4. HTML is sent to the browser
5. Admin interacts with product forms and charts
6. Product data is created, updated, or deleted via API
7. UI refreshes by re-fetching the latest data using React Query

## Security Features

- Password hashing using bcrypt
- JWT-based session management
- Protected API routes (admin-only)
- Secure image upload with validation
- Input validation using Zod schemas
- CSRF protection via NextAuth

## Deployment

The application is deployed on **Vercel**.

Steps:
1. Push code to GitHub
2. Import the repository into Vercel
3. Add required environment variables
4. Deploy the project
5. Update `NEXTAUTH_URL` with the generated `.vercel.app` URL
6. Redeploy without cache

The application uses server-side rendering and runs in the Node.js runtime.


## Demo Credentials (For Evaluation)

Link: https://ssr-e-commerce-product-management-d-gamma.vercel.app/dashboard

Email: admin@example.com  
Password: demo@123  
Role: Admin

## Demo Video Link

## Author

Name: Ronak Kumar
Enrollement No: 23113130
Department: Civil Engineering (3rd year)
GitHub: ronak-kumar06