import type { LayoutServerLoad } from './$types';
import { getCurrentUser } from '$lib/auth/session';

export const load: LayoutServerLoad = async (event) => {
    const user = await getCurrentUser(event);
    return {
        user: user ? { id: user.id, username: user.username } : null
    };
};
