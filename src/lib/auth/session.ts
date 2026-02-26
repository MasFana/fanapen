import type { RequestEvent } from '@sveltejs/kit';
import { db } from '$lib/db';

const SESSION_COOKIE_NAME = 'session_id';

/**
 * Get the current user from the session cookie
 */
export async function getCurrentUser(event: RequestEvent) {
    const sessionId = event.cookies.get(SESSION_COOKIE_NAME);
    if (!sessionId) return null;

    const session = await db.getSession(sessionId);
    if (!session) return null;

    const user = await db.getUserById(session.userId);
    return user;
}

/**
 * Create a session and set the cookie
 */
export async function createSession(event: RequestEvent, userId: string) {
    const session = await db.createSession(userId);

    event.cookies.set(SESSION_COOKIE_NAME, session.id, {
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    return session;
}

/**
 * Delete the session and clear the cookie
 */
export async function deleteSession(event: RequestEvent) {
    const sessionId = event.cookies.get(SESSION_COOKIE_NAME);
    if (sessionId) {
        await db.deleteSession(sessionId);
    }

    event.cookies.delete(SESSION_COOKIE_NAME, {
        path: '/'
    });
}
