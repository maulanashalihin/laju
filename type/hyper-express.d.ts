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
      is_admin: boolean;
      is_verified: boolean;
    };

    /**
     * Shared data across middlewares and controllers
     * Used to pass data between request handlers
     */
    share?: any;
  }

  interface Response {
    /**
     * Render a view using the template engine
     * @param view - The view/template name
     * @param data - Optional data to pass to the view
     */
    view(view: string, data?: any): void;

    /**
     * Render an Inertia.js page
     * @param component - The Svelte component name
     * @param data - Optional props to pass to the component
     */
    inertia(component: string, data?: any): void;

    /**
     * Set a flash message for the next request
     * @param message - The flash message type/category
     * @param data - The flash message content
     * @returns The Response object for chaining
     */
    flash(message: string, data: any): Response;
  }
}

export {};
