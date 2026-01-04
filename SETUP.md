# Quick Setup Guide

## 1. Install Dependencies

```bash
npm install
```

## 2. Configure Environment Variables

Copy `.env.local.example` to `.env.local` and fill in your values:

```bash
# Create .env.local file
MONGODB_URI=mongodb://localhost:27017/ecommerce-dashboard
NEXTAUTH_SECRET=generate-a-random-string-here
NEXTAUTH_URL=http://localhost:3000
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

**Generate NEXTAUTH_SECRET:**
```bash
# On Linux/Mac:
openssl rand -base64 32

# On Windows (PowerShell):
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

## 3. Set Up MongoDB

- **Local**: Install MongoDB and ensure it's running
- **Cloud**: Use MongoDB Atlas and update `MONGODB_URI` with your connection string

## 4. Create First Admin User

Run the seed script:

```bash
npm run seed
```

Or manually specify email/password:

```bash
node scripts/seed-admin.js admin@example.com yourpassword "Admin Name"
```

## 5. Start Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) and login with your admin credentials.

## 6. Cloudinary Setup (for Image Upload)

1. Sign up at [cloudinary.com](https://cloudinary.com) (free tier available)
2. Go to Dashboard → Settings
3. Copy your Cloud Name, API Key, and API Secret
4. Add them to `.env.local`

## Troubleshooting

- **MongoDB Connection Error**: Ensure MongoDB is running and `MONGODB_URI` is correct
- **Authentication Error**: Check `NEXTAUTH_SECRET` is set and matches in all environments
- **Image Upload Fails**: Verify Cloudinary credentials and file size (< 5MB)

For detailed documentation, see [README.md](README.md)

