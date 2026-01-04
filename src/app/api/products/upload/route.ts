import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth-helper';
import { uploadImage } from '@/lib/cloudinary';

/**
 * Check if Cloudinary is properly configured
 */
function isCloudinaryConfigured(): boolean {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  // Check if all required env vars are set and not placeholder values
  return !!(
    cloudName &&
    cloudName !== 'your-cloud-name' &&
    cloudName.trim() !== '' &&
    apiKey &&
    apiKey !== 'your-api-key' &&
    apiKey.trim() !== '' &&
    apiSecret &&
    apiSecret !== 'your-api-secret' &&
    apiSecret.trim() !== ''
  );
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || (session.user as any)?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 });
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size must be less than 5MB' }, { status: 400 });
    }

    // Check if Cloudinary is configured
    if (!isCloudinaryConfigured()) {
      return NextResponse.json(
        {
          error: 'Image upload service not configured. Please set up Cloudinary credentials in your environment variables.',
          details: 'Missing or invalid CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, or CLOUDINARY_API_SECRET',
        },
        { status: 503 }
      );
    }

    // Attempt to upload to Cloudinary
    try {
      const { url, publicId } = await uploadImage(file);
      console.log('Image uploaded successfully to Cloudinary:', { publicId, url: url.substring(0, 50) + '...' });
      return NextResponse.json({ url, publicId }, { status: 200 });
    } catch (error: any) {
      console.error('Cloudinary upload failed:', error);
      
      // Provide detailed error message
      let errorMessage = 'Failed to upload image to Cloudinary';
      if (error.message) {
        errorMessage += `: ${error.message}`;
      }
      
      // Check for common Cloudinary errors
      if (error.http_code === 401) {
        errorMessage = 'Invalid Cloudinary credentials. Please check your API key and secret.';
      } else if (error.http_code === 400) {
        errorMessage = 'Invalid image file or Cloudinary configuration error.';
      }

      return NextResponse.json(
        {
          error: errorMessage,
          details: error.message || 'Unknown error occurred during upload',
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Error in upload endpoint:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to upload image' },
      { status: 500 }
    );
  }
}

