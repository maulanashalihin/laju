/**
 * Type augmentation for HyperExpress
 * Extends the native Request and Response types with custom properties
 */

import "hyper-express";

declare module "hyper-express" {
	interface Request {
		/**
		 * Authenticated user object
		 * Populated by Auth middleware when user is logged in
		 */
		user?: {
			id: string;
			name: string | null;
			email: string;
			phone: string | null;
			avatar: string | null;
			is_admin: number;
			is_verified: number;
		};

		/**
		 * Shared data across middlewares and handlers
		 * Used to pass data between request handlers
		 */
		share?: Record<string, unknown>;
	}

	interface Response {
		/**
		 * Render a view using the template engine
		 */
		view(view: string, data?: Record<string, unknown>): void;

		/**
		 * Render an Inertia page — JSON for XHR, HTML for initial load.
		 * Attached by hyper-express-inertia middleware.
		 */
		inertia(
			component: string,
			inertiaProps?: Record<string, unknown>,
		): Promise<unknown>;

		/**
		 * Set a flash message cookie (one-time read).
		 * Attached by hyper-express-inertia middleware.
		 */
		flash(type: string, message: string, ttl?: number): Response;
	}
}
