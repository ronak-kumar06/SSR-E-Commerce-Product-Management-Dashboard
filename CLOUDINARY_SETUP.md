# Cloudinary Image Upload Setup Guide

## Issue: Random Images Instead of Uploaded Images

If you're seeing random placeholder images instead of your uploaded images, it means Cloudinary is not properly configured. This guide will help you set it up correctly.

## Problem

The application was falling back to random placeholder images from `picsum.photos` when:
- Cloudinary credentials are missing
- Cloudinary credentials are invalid
- Cloudinary upload fails

## Solution: Configure Cloudinary

### Step 1: Create a Cloudinary Account

1. Go to [https://cloudinary.com](https://cloudinary.com)
2. Sign up for a free account (no credit card required)
3. Verify your email address

### Step 2: Get Your Cloudinary Credentials

1. After logging in, go to your **Dashboard**
2. You'll see your account details:
   - **Cloud Name** (e.g., `your-cloud-name`)
   - **API Key** (e.g., `123456789012345`)
   - **API Secret** (e.g., `abcdefghijklmnopqrstuvwxyz123456`)

### Step 3: Add Credentials to Environment Variables

1. Open your `.env.local` file in the root directory
2. Add or update these variables:

```env
CLOUDINARY_CLOUD_NAME=your-actual-cloud-name
CLOUDINARY_API_KEY=your-actual-api-key
CLOUDINARY_API_SECRET=your-actual-api-secret
```

**Important:** 
- Replace `your-actual-cloud-name`, `your-actual-api-key`, and `your-actual-api-secret` with your actual values from Cloudinary dashboard
- Do NOT use placeholder values like `your-cloud-name` or `your-api-key`
- Make sure there are no spaces or quotes around the values

### Step 4: Restart Your Development Server

After updating `.env.local`:

```bash
# Stop the current server (Ctrl+C)
# Then restart it
npm run dev
```

### Step 5: Verify Configuration

1. Try uploading an image when creating a new product
2. Check the browser console for any errors
3. The image should now upload to Cloudinary and display correctly

## Troubleshooting

### Issue: Still seeing random images

**Check 1: Environment Variables**
- Verify `.env.local` exists in the root directory
- Check that all three Cloudinary variables are set
- Make sure values don't have quotes or spaces
- Restart the development server after changes

**Check 2: Cloudinary Dashboard**
- Log into Cloudinary dashboard
- Go to "Media Library" to see if images are uploading
- If images appear in Cloudinary but not in the app, check the image URLs

**Check 3: Browser Console**
- Open browser DevTools (F12)
- Check Console tab for error messages
- Look for messages like "Cloudinary upload failed" or "Image upload service not configured"

**Check 4: Server Logs**
- Check your terminal where `npm run dev` is running
- Look for error messages related to Cloudinary
- Common errors:
  - `Invalid API key or secret` - Check your credentials
  - `Cloud name not found` - Verify cloud name is correct
  - `Unauthorized` - API key/secret mismatch

### Issue: "Image upload service not configured" error

This means the environment variables are not set correctly. 

**Solution:**
1. Double-check `.env.local` file exists
2. Verify all three variables are present:
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
3. Make sure values are actual credentials, not placeholders
4. Restart the development server

### Issue: Images upload but don't display

**Possible causes:**
1. **Next.js Image domain not configured** - Already fixed in `next.config.ts`
2. **CORS issues** - Cloudinary should handle this automatically
3. **Invalid image URL** - Check the URL format in database

**Solution:**
- Check browser console for image loading errors
- Verify image URLs in database start with `https://res.cloudinary.com/`
- Check Network tab in DevTools to see if image requests are failing

## Testing Your Setup

1. **Create a new product** with an image
2. **Check Cloudinary Dashboard** → Media Library to see if image appears
3. **Verify image displays** correctly in the product card
4. **Edit the product** and verify image persists
5. **Delete the product** and verify image is removed from Cloudinary

## What Changed in the Code

### Before (Problem)
- Silently fell back to random placeholder images
- No error messages when Cloudinary wasn't configured
- Users didn't know why their images weren't uploading

### After (Fixed)
- Returns clear error messages when Cloudinary isn't configured
- Validates Cloudinary credentials before attempting upload
- Shows detailed error messages to help diagnose issues
- Prevents using placeholder images when real upload fails
- Better error handling and logging

## Additional Notes

- **Free Tier Limits:** Cloudinary free tier includes:
  - 25 GB storage
  - 25 GB monthly bandwidth
  - 25,000 monthly transformations
  - This should be sufficient for development and small projects

- **Image Optimization:** Images are automatically optimized:
  - Max dimensions: 800x800px
  - Auto quality optimization
  - Stored in `ecommerce-products` folder

- **Security:** Never commit `.env.local` to version control
- The file is already in `.gitignore` for your protection

## Need Help?

If you're still experiencing issues:
1. Check the server logs for detailed error messages
2. Verify your Cloudinary account is active
3. Test your credentials using Cloudinary's API explorer
4. Check the browser console for client-side errors

