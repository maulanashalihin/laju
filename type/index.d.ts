// Import type augmentation first to extend HyperExpress types
import './hyper-express';

import { Request, Response } from "hyper-express";

export interface User {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  avatar: string | null;
  is_verified: number;
  membership_date: number | null;
  is_admin: number;
  password: string;
  remember_me_token: string | null;
  created_at: number;
  updated_at: number;
}

// Re-export Request and Response with our custom types
// These now include the augmented properties (user, share, view, inertia, flash)
export type { Request, Response };
