/**
 * Type augmentation for HyperExpress
 * Extends the native Request and Response types with custom properties
 */

import 'hyper-express';

declare module 'hyper-express' {
  interface Request {
    /**
     * Authenticated user object
     * Populated by Auth middleware when user is logged in
     */
    user?: {
      id: string;
      name: string;
      email: string;
      phone?: string;
      avatar?: string;
      is_admin: boolean;
      is_verified: boolean;
    };

    /**
     * Shared data across middlewares and controllers
     * Used to pass data between request handlers
     */
    share?: Record<string, unknown>;
  }

  interface Response {
    /**
     * Render a view using the template engine
     * @param view - The view/template name
     * @param data - Optional data to pass to the view
     */
    view(view: string, data?: Record<string, unknown>): void;

    /**
     * Render an Inertia.js page
     * @param component - The Svelte component name
     * @param inertiaProps - Optional props to pass to the component
     * @param viewProps - Optional view props to pass to the template
     */
    inertia(component: string, inertiaProps?: Record<string, unknown>, viewProps?: Record<string, unknown>): Promise<unknown>;

    /**
     * Set a flash message for the next request
     * @param type - The flash message type (e.g., 'error', 'success', 'info', 'warning')
     * @param message - The flash message content
     * @param ttl - Time to live in milliseconds (default: 3000)
     * @returns The Response object for chaining
     */
    flash(type: string, message: string, ttl?: number): Response;

    /**
     * Redirect to a URL with optional custom status code
     * @param url - The URL to redirect to
     * @param status - The HTTP status code (default: 302)
     * @returns The Response object for chaining
     */
    redirect(url: string, status?: number): Response;
  }
}

export {};
