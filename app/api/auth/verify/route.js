import { NextResponse } from 'next/server';
import { getSessionId, verifySession } from '@/lib/session';

export async function GET() {
  try {
    const sessionId = await getSessionId();
    
    if (!sessionId) {
      return NextResponse.json(
        { success: false, valid: false, message: 'No session found' },
        { status: 401 }
      );
    }

    const user = await verifySession(sessionId);

    if (!user) {
      return NextResponse.json(
        { success: false, valid: false, message: 'Invalid or expired session' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      valid: true,
      user,
    });
  } catch (error) {
    console.error('Session verify error:', error);
    return NextResponse.json(
      { success: false, valid: false, message: 'Server error' },
      { status: 500 }
    );
  }
}