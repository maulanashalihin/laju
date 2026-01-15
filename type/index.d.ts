// Import type augmentation first to extend HyperExpress types
import './hyper-express';

import { Request, Response } from "hyper-express";

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  is_admin: boolean;
  is_verified: boolean;
}

// Re-export Request and Response with our custom types
// These now include the augmented properties (user, share, view, inertia, flash)
export type { Request, Response };
