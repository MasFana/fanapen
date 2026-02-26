import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { db } from '$lib/db';
import { verifyPassword } from '$lib/auth/password';
import { createSession } from '$lib/auth/session';

export const actions: Actions = {
    default: async (event) => {
        const formData = await event.request.formData();
        const username = formData.get('username')?.toString();
        const password = formData.get('password')?.toString();

        if (!username || !password) {
            return fail(400, { error: 'Username and password are required' });
        }

        const user = await db.getUserByUsername(username);
        if (!user) {
            return fail(401, { error: 'Invalid username or password' });
        }

        const valid = await verifyPassword(password, user.passwordHash);
        if (!valid) {
            return fail(401, { error: 'Invalid username or password' });
        }

        await createSession(event, user.id);
        throw redirect(303, '/dashboard');
    }
};
