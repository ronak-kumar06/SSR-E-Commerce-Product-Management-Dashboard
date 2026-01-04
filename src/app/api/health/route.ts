import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';

/**
 * Health check endpoint for test infrastructure validation
 * Returns the status of the application and its dependencies
 */
export async function GET() {
  try {
    // Check MongoDB connection
    let dbStatus = 'disconnected';
    try {
      await connectDB();
      dbStatus = 'connected';
    } catch (error) {
      dbStatus = 'error';
    }

    // Check environment variables
    const envStatus = {
      mongodb: !!process.env.MONGODB_URI,
      nextauth: !!process.env.NEXTAUTH_SECRET && !!process.env.NEXTAUTH_URL,
      cloudinary: !!(
        process.env.CLOUDINARY_CLOUD_NAME &&
        process.env.CLOUDINARY_API_KEY &&
        process.env.CLOUDINARY_API_SECRET
      ),
    };

    const isHealthy =
      dbStatus === 'connected' && envStatus.mongodb && envStatus.nextauth;

    return NextResponse.json(
      {
        status: isHealthy ? 'healthy' : 'degraded',
        timestamp: new Date().toISOString(),
        services: {
          database: dbStatus,
          environment: envStatus,
        },
      },
      { status: isHealthy ? 200 : 503 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 503 }
    );
  }
}

