/**
 * Validation Service using Zod
 * Provides schema-based validation with TypeScript type inference
 */

import { z, ZodError, ZodSchema } from 'zod';
import { Response } from '../../type';

/**
 * Validation result interface
 */
interface ValidationResult<T> {
  success: boolean;
  data?: T;
  errors?: Record<string, string[]>;
}

/**
 * Validator Service
 */
class ValidatorService {
  /**
   * Validate data against a Zod schema
   * @param schema - Zod schema to validate against
   * @param data - Data to validate
   * @returns Validation result with typed data or errors
   */
  validate<T>(schema: ZodSchema<T>, data: unknown): ValidationResult<T> {
    try {
      const validatedData = schema.parse(data);
      return {
        success: true,
        data: validatedData,
      };
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        const errors: Record<string, string[]> = {};
        
        error.issues.forEach((err) => {
          const path = err.path.join('.');
          if (!errors[path]) {
            errors[path] = [];
          }
          errors[path].push(err.message);
        });

        return {
          success: false,
          errors,
        };
      }
      
      throw error;
    }
  }

  /**
   * Validate and throw error if validation fails
   * @param schema - Zod schema to validate against
   * @param data - Data to validate
   * @returns Validated data
   * @throws ZodError if validation fails
   */
  validateOrThrow<T>(schema: ZodSchema<T>, data: unknown): T {
    return schema.parse(data);
  }

  /**
   * Common validation schemas
   */
  schemas = {
    // Email validation
    email: z.string().email('Invalid email'),

    // Password validation (min 8 chars, at least 1 number)
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[0-9]/, 'Password must contain at least 1 number'),

    // Phone number (Indonesian format)
    phone: z
      .string()
      .regex(/^(\+62|62|0)[0-9]{9,12}$/, 'Invalid phone number'),

    // Required string
    requiredString: (fieldName: string) =>
      z.string().min(1, `${fieldName} is required`),

    // Optional string
    optionalString: z.string().optional(),

    // Positive number
    positiveNumber: z.number().positive('Must be a positive number'),

    // URL validation
    url: z.string().url('Invalid URL'),

    // Date validation
    date: z.string().datetime('Invalid date format'),

    // Boolean
    boolean: z.boolean(),

    // UUID
    uuid: z.string().uuid('Invalid UUID'),
  };
}

export default new ValidatorService();

// Export Zod for custom schemas
export { z };
