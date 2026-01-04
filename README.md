# E-commerce Product Management Dashboard

A server-side rendered (SSR) administrative dashboard for managing products in an e-commerce system. Built with Next.js 15, featuring fast page load times, improved SEO performance, and an efficient interface for administrators to manage product data.

## Features

- **Server-Side Rendering (SSR)** using Next.js for improved performance and SEO
- **Complete Product Management** with Create, Read, Update, and Delete (CRUD) operations
- **Multi-step Product Creation Forms** with strong input validation using Zod
- **Interactive Data Visualization** for sales and stock metrics using Recharts
- **Secure Image Upload and Storage** using Cloudinary
- **Authentication and Authorization** ensuring only eligible admins can access the dashboard
- **Secure Admin Onboarding** - only visible to existing admins

## Tech Stack

- **Frontend & Backend**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Data Fetching**: React Query (TanStack Query)
- **Form Validation**: Zod
- **Data Visualization**: Recharts
- **Image Storage**: Cloudinary
- **Database**: MongoDB with Mongoose
- **Authentication**: NextAuth.js v5
- **Styling**: Tailwind CSS

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js 18+ and npm
- MongoDB (local instance or MongoDB Atlas)
- Cloudinary account (free tier available)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd CDC_dev_project
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env.local` file in the root directory:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/ecommerce-dashboard
# Or for MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/ecommerce-dashboard

# NextAuth Configuration
NEXTAUTH_SECRET=your-secret-key-here-generate-a-random-string
NEXTAUTH_URL=http://localhost:3000

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Node Environment
NODE_ENV=development
```

**Important**: 
- Generate a secure random string for `NEXTAUTH_SECRET`. You can use: `openssl rand -base64 32`
- Get your Cloudinary credentials from [Cloudinary Dashboard](https://cloudinary.com/console)

### 4. Set Up MongoDB

Make sure MongoDB is running on your system. If using MongoDB Atlas, use the connection string in `MONGODB_URI`.

### 5. Create Initial Admin User

Run the seed script to create your first admin user:

```bash
npm run seed
```

Or manually create an admin user using MongoDB Compass or the MongoDB shell:

```javascript
use ecommerce-dashboard
db.users.insertOne({
  name: "Admin User",
  email: "admin@example.com",
  password: "$2a$10$...", // bcrypt hashed password
  role: "admin",
  createdAt: new Date(),
  updatedAt: new Date()
})
```

To hash a password, you can use an online bcrypt generator or run this Node.js script:

```javascript
const bcrypt = require('bcryptjs');
const hash = bcrypt.hashSync('your-password', 10);
console.log(hash);
```

### 6. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

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

## Deployment

### Vercel Deployment (Recommended)

1. Push your code to GitHub
2. Import your project in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms

The application can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Railway
- DigitalOcean App Platform

Make sure to set all environment variables in your deployment platform.

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

## Development

### Building for Production

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

## Troubleshooting

### MongoDB Connection Issues

- Ensure MongoDB is running
- Check your `MONGODB_URI` is correct
- Verify network access if using MongoDB Atlas

### Cloudinary Upload Issues

- Verify your Cloudinary credentials
- Check file size limits (max 5MB)
- Ensure file type is an image

### Authentication Issues

- Verify `NEXTAUTH_SECRET` is set
- Check that `NEXTAUTH_URL` matches your deployment URL
- Ensure admin user exists in database with correct role

## License

This project is licensed under the ISC License.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For issues and questions, please open an issue in the GitHub repository.

