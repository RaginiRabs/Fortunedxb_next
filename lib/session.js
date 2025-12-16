import { query } from './db';
import { cookies } from 'next/headers';
import crypto from 'crypto';

const SESSION_COOKIE_NAME = 'admin_session';
const SESSION_EXPIRY_DAYS = 7;

/**
 * Generate unique session ID
 */
function generateSessionId() {
  return crypto.randomUUID();
}

/**
 * Create new session in database and set cookie
 */
export async function createSession(userId, email, role) {
  const sessionId = generateSessionId();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + SESSION_EXPIRY_DAYS);

  // Insert session into database
  await query(
    `INSERT INTO sessions (session_id, user_id, user_email, user_role, expires_at) 
     VALUES (?, ?, ?, ?, ?)`,
    [sessionId, userId, email, role, expiresAt]
  );

  // Set HTTP-only cookie
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: expiresAt,
    path: '/',
  });

  return sessionId;
}

/**
 * Verify session from database
 */
export async function verifySession(sessionId) {
  if (!sessionId) return null;

  const sessions = await query(
    `SELECT s.*, u.user_name 
     FROM sessions s 
     JOIN users u ON s.user_id = u.user_id 
     WHERE s.session_id = ? AND s.expires_at > NOW()`,
    [sessionId]
  );

  if (sessions.length === 0) return null;

  return {
    userId: sessions[0].user_id,
    email: sessions[0].user_email,
    name: sessions[0].user_name,
    role: sessions[0].user_role,
  };
}

/**
 * Delete session from database and clear cookie
 */
export async function deleteSession(sessionId) {
  if (sessionId) {
    await query('DELETE FROM sessions WHERE session_id = ?', [sessionId]);
  }

  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

/**
 * Get session ID from cookie
 */
export async function getSessionId() {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE_NAME)?.value || null;
}

/**
 * Get current user from session
 */
export async function getCurrentUser() {
  const sessionId = await getSessionId();
  if (!sessionId) return null;
  return verifySession(sessionId);
}

/**
 * Clean up expired sessions (optional - run periodically)
 */
export async function cleanupExpiredSessions() {
  await query('DELETE FROM sessions WHERE expires_at < NOW()');
}