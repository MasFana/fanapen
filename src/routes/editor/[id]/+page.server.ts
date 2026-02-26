import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { getCurrentUser } from '$lib/auth/session';
import { db } from '$lib/db';

export const load: PageServerLoad = async (event) => {
    const { user } = await event.parent();
    if (!user) {
        throw redirect(303, '/login');
    }

    const project = await db.getProject(event.params.id);
    if (!project) {
        throw error(404, 'Project not found');
    }

    if (project.userId !== user.id) {
        throw error(403, 'Access denied');
    }

    return {
        project
    };
};

export const actions: Actions = {
    save: async (event) => {
        const user = await getCurrentUser(event);
        if (!user) {
            throw redirect(303, '/login');
        }

        const project = await db.getProject(event.params.id);
        if (!project) {
            throw error(404, 'Project not found');
        }

        if (project.userId !== user.id) {
            throw error(403, 'Access denied');
        }

        const formData = await event.request.formData();
        const html = formData.get('html')?.toString();
        const css = formData.get('css')?.toString();
        const js = formData.get('js')?.toString();
        const name = formData.get('name')?.toString();

        await db.updateProject(event.params.id, {
            name,
            files: {
                html,
                css,
                js
            }
        });

        return { success: true };
    },

    delete: async (event) => {
        const user = await getCurrentUser(event);
        if (!user) {
            throw redirect(303, '/login');
        }

        const project = await db.getProject(event.params.id);
        if (!project) {
            throw error(404, 'Project not found');
        }

        if (project.userId !== user.id) {
            throw error(403, 'Access denied');
        }

        await db.deleteProject(event.params.id);
        throw redirect(303, '/dashboard');
    }
};
