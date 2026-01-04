# Quick Start Guide - How to Run

Follow these steps to get the application running:

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Create Environment Variables File

Create a file named `.env.local` in the root directory with the following content:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/ecommerce-dashboard

# NextAuth Configuration  
NEXTAUTH_SECRET=your-random-secret-key-here-change-this
NEXTAUTH_URL=http://localhost:3000

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### Generate NEXTAUTH_SECRET:

**On Windows (PowerShell):**
```powershell
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | % {[char]$_})
```

Or use this online generator: https://generate-secret.vercel.app/32

**On Linux/Mac:**
```bash
openssl rand -base64 32
```

### Get Cloudinary Credentials:
1. Sign up at https://cloudinary.com (free account)
2. Go to Dashboard
3. Copy your Cloud Name, API Key, and API Secret
4. Paste them into `.env.local`

## Step 3: Set Up MongoDB

### Option A: Local MongoDB
1. Install MongoDB from https://www.mongodb.com/try/download/community
2. Start MongoDB service
3. Your `MONGODB_URI` should be: `mongodb://localhost:27017/ecommerce-dashboard`

### Option B: MongoDB Atlas (Cloud)
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get connection string and update `MONGODB_URI`:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/ecommerce-dashboard
   ```

## Step 4: Create First Admin User

Run the seed script to create your first admin:

```bash
npm run seed
```

This creates a default admin:
- Email: `admin@example.com`
- Password: `admin123`

**Or create a custom admin:**
```bash
node scripts/seed-admin.js your-email@example.com yourpassword "Your Name"
```

## Step 5: Start the Development Server

```bash
npm run dev
```

The application will start at: **http://localhost:3000**

## Step 6: Login

1. Open http://localhost:3000 in your browser
2. You'll be redirected to the login page
3. Enter your admin credentials (from Step 4)
4. Click "Sign in"

## That's it! 🎉

You should now see the dashboard with:
- Product management interface
- Charts and analytics
- Add/Edit/Delete product functionality
- Admin onboarding option

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running: `mongod` (if local)
- Check your `MONGODB_URI` is correct
- For Atlas, check IP whitelist allows your IP

### Authentication Error
- Verify `NEXTAUTH_SECRET` is set in `.env.local`
- Make sure you created an admin user with `npm run seed`

### Image Upload Not Working
- Verify Cloudinary credentials in `.env.local`
- Check file size is under 5MB
- Ensure file is an image format

### Port Already in Use
If port 3000 is busy, Next.js will automatically use the next available port (3001, 3002, etc.)

## Production Build

To build for production:

```bash
npm run build
npm start
```

