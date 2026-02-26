import type { IDatabase } from './interface';
import { SurrealDatabase } from './surreal-db';

/**
 * Database instance
 * Change this to switch between database implementations
 */
export const db: IDatabase = new SurrealDatabase();

// Export types
export type { IDatabase } from './interface';
