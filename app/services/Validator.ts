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
    } catch (error: any) {
      if (error instanceof ZodError) {
        const errors: Record<string, string[]> = {};
        
        error.issues.forEach((err: any) => {
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
   * Validate and return data or send error response
   * @param schema - Zod schema to validate against
   * @param data - Data to validate
   * @param response - HyperExpress response object
   * @returns Validated data or null if validation fails
   */
  validateOrFail<T>(
    schema: ZodSchema<T>,
    data: unknown,
    response: Response
  ): T | null {
    const result = this.validate(schema, data);

    if (!result.success) {
      response.status(422).json({
        success: false,
        message: 'Validation failed',
        errors: result.errors,
      });
      return null;
    }

    return result.data!;
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
    email: z.string().email('Email tidak valid'),

    // Password validation (min 8 chars, at least 1 number)
    password: z
      .string()
      .min(8, 'Password minimal 8 karakter')
      .regex(/[0-9]/, 'Password harus mengandung minimal 1 angka'),

    // Phone number (Indonesian format)
    phone: z
      .string()
      .regex(/^(\+62|62|0)[0-9]{9,12}$/, 'Nomor telepon tidak valid'),

    // Required string
    requiredString: (fieldName: string) =>
      z.string().min(1, `${fieldName} wajib diisi`),

    // Optional string
    optionalString: z.string().optional(),

    // Positive number
    positiveNumber: z.number().positive('Harus berupa angka positif'),

    // URL validation
    url: z.string().url('URL tidak valid'),

    // Date validation
    date: z.string().datetime('Format tanggal tidak valid'),

    // Boolean
    boolean: z.boolean(),

    // UUID
    uuid: z.string().uuid('UUID tidak valid'),
  };
}

export default new ValidatorService();

// Export Zod for custom schemas
export { z };
