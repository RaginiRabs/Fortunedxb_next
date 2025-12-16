import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { query } from '@/lib/db';
import { getSessionId } from '@/lib/session';

export async function POST() {
  try {
    const sessionId = await getSessionId();

    // Update session - mark as logged out (don't delete)
    if (sessionId) {
      await query(
        'UPDATE sessions SET logged_out_at = NOW() WHERE session_id = ?',
        [sessionId]
      );
    }

    // Clear cookie only
    const cookieStore = await cookies();
    cookieStore.delete('admin_session');

    return NextResponse.json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}