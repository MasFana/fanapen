import { redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { getCurrentUser, deleteSession } from '$lib/auth/session';
import { db } from '$lib/db';

export const load: PageServerLoad = async (event) => {
    const { user } = await event.parent();
    if (!user) {
        throw redirect(303, '/login');
    }

    const projects = await db.getProjectsByUserId(user.id);

    return {
        projects
    };
};

export const actions: Actions = {
    logout: async (event) => {
        await deleteSession(event);
        throw redirect(303, '/login');
    },

    createProject: async (event) => {
        const user = await getCurrentUser(event);
        if (!user) {
            throw redirect(303, '/login');
        }

        const formData = await event.request.formData();
        const name = formData.get('name')?.toString() || 'Untitled Project';

        const project = await db.createProject({
            userId: user.id,
            name
        });

        throw redirect(303, `/editor/${project.id}`);
    },

    toggleDeploy: async (event) => {
        const user = await getCurrentUser(event);
        if (!user) {
            throw redirect(303, '/login');
        }

        const formData = await event.request.formData();
        const projectId = formData.get('projectId')?.toString();
        const isDeployed = formData.get('isDeployed') === 'true';

        if (!projectId) {
            return { success: false, error: 'Project ID is required' };
        }

        // Verify the project belongs to the user
        const project = await db.getProject(projectId);
        if (!project || project.userId !== user.id) {
            return { success: false, error: 'Project not found' };
        }

        await db.updateProject(projectId, { isDeployed });

        return { success: true };
    },

    updateSlug: async (event) => {
        const user = await getCurrentUser(event);
        if (!user) {
            throw redirect(303, '/login');
        }

        const formData = await event.request.formData();
        const projectId = formData.get('projectId')?.toString();
        const slug = formData.get('slug')?.toString();

        if (!projectId || !slug) {
            return { success: false, error: 'Project ID and slug are required' };
        }

        // Verify the project belongs to the user
        const project = await db.getProject(projectId);
        if (!project || project.userId !== user.id) {
            return { success: false, error: 'Project not found' };
        }

        // Check if slug is already taken by another project of the same user
        const existingProject = await db.getProjectBySlug(user.id, slug);
        if (existingProject && existingProject.id !== projectId) {
            return { success: false, error: 'Slug already taken' };
        }

        await db.updateProject(projectId, { slug });

        return { success: true };
    }
};
