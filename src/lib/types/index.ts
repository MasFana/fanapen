// User types
export interface User {
    id: string;
    username: string;
    passwordHash: string;
    createdAt: Date;
}

export interface UserSession {
    id: string;
    userId: string;
    expiresAt: Date;
}

// Project types
export interface Project {
    id: string;
    userId: string;
    name: string;
    slug: string;  // Unique slug per user for shareable URL
    files: ProjectFiles;
    isDeployed: boolean;  // Whether the project is publicly accessible
    views: number;  // Total view count
    createdAt: Date;
    updatedAt: Date;
}

export interface ProjectFiles {
    html: string;
    css: string;
    js: string;
}

export type FileType = 'html' | 'css' | 'js';

export interface ProjectCreate {
    userId: string;
    name: string;
    files?: Partial<ProjectFiles>;
}

export interface ProjectUpdate {
    name?: string;
    slug?: string;
    isDeployed?: boolean;
    files?: Partial<ProjectFiles>;
}

// Auth types
export interface LoginCredentials {
    username: string;
    password: string;
}

export interface RegisterData {
    username: string;
    password: string;
    // Can add more fields later like email
}

export interface AuthResponse {
    success: boolean;
    user?: {
        id: string;
        username: string;
    };
    sessionId?: string;
    error?: string;
}
