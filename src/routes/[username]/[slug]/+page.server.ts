import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/db';

export const load: PageServerLoad = async ({ params }) => {
    const { username, slug } = params;

    // Get the deployed project
    const project = await db.getDeployedProjectByUserAndSlug(username, slug);

    if (!project) {
        throw error(404, 'Project not found or not deployed');
    }

    // Increment view count
    await db.incrementProjectViews(project.id);

    // Get user info for display
    const user = await db.getUserById(project.userId);

    return {
        project: {
            id: project.id,
            name: project.name,
            slug: project.slug,
            files: project.files,
            views: project.views + 1, // Include the incremented view
            createdAt: project.createdAt,
            updatedAt: project.updatedAt
        },
        author: {
            username: user?.username || 'Unknown'
        }
    };
};
