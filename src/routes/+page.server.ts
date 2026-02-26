import type { PageServerLoad } from './$types';
import { db } from '$lib/db';

export const load: PageServerLoad = async () => {
    // Fetch leaderboards
    const [topProjects, topUsers] = await Promise.all([
        db.getTopProjectsByViews(10),
        db.getTopUsersByTotalViews(10)
    ]);

    // Get user info for each project
    const projectsWithAuthors = await Promise.all(
        topProjects.map(async (project) => {
            const author = await db.getUserById(project.userId);
            return {
                id: project.id,
                name: project.name,
                slug: project.slug,
                views: project.views,
                author: author?.username || 'Unknown'
            };
        })
    );

    return {
        topProjects: projectsWithAuthors,
        topUsers: topUsers.map(({ user, totalViews }) => ({
            username: user.username,
            totalViews
        }))
    };
};
