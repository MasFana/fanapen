import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { db } from '$lib/db';
import { hashPassword, validatePassword, validateUsername } from '$lib/auth/password';
import { createSession } from '$lib/auth/session';

export const actions: Actions = {
    default: async (event) => {
        const formData = await event.request.formData();
        const username = formData.get('username')?.toString();
        const password = formData.get('password')?.toString();

        if (!username || !password) {
            return fail(400, { error: 'Username and password are required' });
        }

        // Validate username
        const usernameValidation = validateUsername(username);
        if (!usernameValidation.valid) {
            return fail(400, { error: usernameValidation.error });
        }

        // Validate password
        const passwordValidation = validatePassword(password);
        if (!passwordValidation.valid) {
            return fail(400, { error: passwordValidation.error });
        }

        // Check if user exists
        const existingUser = await db.getUserByUsername(username);
        if (existingUser) {
            return fail(400, { error: 'Username already taken' });
        }

        // Create user
        const passwordHash = await hashPassword(password);
        const user = await db.createUser(username, passwordHash);

        // Create session
        await createSession(event, user.id);

        throw redirect(303, '/dashboard');
    }
};
