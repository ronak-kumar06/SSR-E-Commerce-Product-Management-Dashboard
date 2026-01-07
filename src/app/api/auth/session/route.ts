import { auth } from '@/auth';
import { NextResponse } from 'next/server';

/**
 * Session endpoint for NextAuth compatibility
 * Provides session information for client-side access
 */
export async function GET() {
  try {
    const session = await auth();
    
    if (!session) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    return NextResponse.json({
      user: session.user,
      expires: session.expires,
    });
  } catch (error) {
    console.error('Session error:', error);
    return NextResponse.json(
      { error: 'Failed to get session' },
      { status: 500 }
    );
  }
}

