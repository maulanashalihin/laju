/**
 * Type augmentation for HyperExpress
 * Extends the native Request type with custom properties
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
	}
}
