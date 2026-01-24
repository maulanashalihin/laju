/**
 * Unit Tests for Validator Service
 * Testing Zod-based validation logic
 */

import { describe, it, expect } from 'vitest';
import Validator from '../../../app/services/Validator';
import { z } from 'zod';

describe('Validator Service', () => {
  describe('validate()', () => {
    it('should return success with validated data for valid input', () => {
      const schema = z.object({
        email: z.string().email(),
        password: z.string().min(8)
      });

      const data = {
        email: 'test@example.com',
        password: 'password123'
      };

      const result = Validator.validate(schema, data);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(data);
      expect(result.errors).toBeUndefined();
    });

    it('should return errors for invalid input', () => {
      const schema = z.object({
        email: z.string().email(),
        password: z.string().min(8)
      });

      const data = {
        email: 'invalid-email',
        password: 'short'
      };

      const result = Validator.validate(schema, data);

      expect(result.success).toBe(false);
      expect(result.data).toBeUndefined();
      expect(result.errors).toBeDefined();
      expect(Object.keys(result.errors || {})).toHaveLength(2);
    });

    it('should handle nested object validation', () => {
      const schema = z.object({
        user: z.object({
          name: z.string().min(1),
          age: z.number().positive()
        })
      });

      const data = {
        user: {
          name: 'John Doe',
          age: 25
        }
      };

      const result = Validator.validate(schema, data);

      expect(result.success).toBe(true);
      expect(result.data?.user.name).toBe('John Doe');
      expect(result.data?.user.age).toBe(25);
    });

    it('should handle array validation', () => {
      const schema = z.object({
        tags: z.array(z.string()).min(1)
      });

      const data = {
        tags: ['typescript', 'testing', 'vitest']
      };

      const result = Validator.validate(schema, data);

      expect(result.success).toBe(true);
      expect(result.data?.tags).toHaveLength(3);
    });

    it('should return proper error path for nested fields', () => {
      const schema = z.object({
        user: z.object({
          profile: z.object({
            bio: z.string().min(10)
          })
        })
      });

      const data = {
        user: {
          profile: {
            bio: 'short'
          }
        }
      };

      const result = Validator.validate(schema, data);

      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors?.['user.profile.bio']).toBeDefined();
    });

    it('should handle optional fields', () => {
      const schema = z.object({
        name: z.string(),
        nickname: z.string().optional()
      });

      const data = {
        name: 'John Doe'
      };

      const result = Validator.validate(schema, data);

      expect(result.success).toBe(true);
      expect(result.data?.name).toBe('John Doe');
      expect(result.data?.nickname).toBeUndefined();
    });
  });

  describe('validateOrThrow()', () => {
    it('should return validated data for valid input', () => {
      const schema = z.object({
        email: z.string().email()
      });

      const data = { email: 'test@example.com' };

      const result = Validator.validateOrThrow(schema, data);

      expect(result).toEqual(data);
    });

    it('should throw ZodError for invalid input', () => {
      const schema = z.object({
        email: z.string().email()
      });

      const data = { email: 'invalid-email' };

      expect(() => {
        Validator.validateOrThrow(schema, data);
      }).toThrow();
    });

    it('should provide type inference', () => {
      const schema = z.object({
        count: z.number(),
        name: z.string()
      });

      const data = { count: 42, name: 'Test' };

      const result = Validator.validateOrThrow(schema, data);

      // Type check - result should have count as number and name as string
      expect(typeof result.count).toBe('number');
      expect(typeof result.name).toBe('string');
    });
  });

  describe('Built-in Schemas', () => {
    it('should validate email correctly', () => {
      const validEmail = Validator.validate(Validator.schemas.email, 'test@example.com');
      expect(validEmail.success).toBe(true);

      const invalidEmail = Validator.validate(Validator.schemas.email, 'not-an-email');
      expect(invalidEmail.success).toBe(false);
    });

    it('should validate password correctly', () => {
      const validPassword = Validator.validate(Validator.schemas.password, 'password123');
      expect(validPassword.success).toBe(true);

      const tooShort = Validator.validate(Validator.schemas.password, 'short1');
      expect(tooShort.success).toBe(false);

      const noNumber = Validator.validate(Validator.schemas.password, 'nopassword');
      expect(noNumber.success).toBe(false);
    });

    it('should validate Indonesian phone numbers', () => {
      const validPhones = [
        '+628123456789',
        '628123456789',
        '08123456789'
      ];

      validPhones.forEach(phone => {
        const result = Validator.validate(Validator.schemas.phone, phone);
        expect(result.success).toBe(true);
      });

      const invalidPhone = Validator.validate(Validator.schemas.phone, '12345');
      expect(invalidPhone.success).toBe(false);
    });

    it('should validate URLs', () => {
      const validUrl = Validator.validate(Validator.schemas.url, 'https://example.com');
      expect(validUrl.success).toBe(true);

      const invalidUrl = Validator.validate(Validator.schemas.url, 'not-a-url');
      expect(invalidUrl.success).toBe(false);
    });

    it('should validate dates', () => {
      const validDate = Validator.validate(Validator.schemas.date, '2024-01-15T10:30:00Z');
      expect(validDate.success).toBe(true);

      const invalidDate = Validator.validate(Validator.schemas.date, 'not-a-date');
      expect(invalidDate.success).toBe(false);
    });

    it('should validate UUIDs', () => {
      // Valid UUID v4 format
      const validUuid = Validator.validate(Validator.schemas.uuid, '123e4567-e89b-12d3-a456-426614174000');
      expect(validUuid.success).toBe(true);

      const invalidUuid = Validator.validate(Validator.schemas.uuid, 'not-a-uuid');
      expect(invalidUuid.success).toBe(false);
    });

    it('should validate positive numbers', () => {
      const valid = Validator.validate(Validator.schemas.positiveNumber, 42);
      expect(valid.success).toBe(true);

      const invalid = Validator.validate(Validator.schemas.positiveNumber, -5);
      expect(invalid.success).toBe(false);
    });

    it('should validate booleans', () => {
      const validTrue = Validator.validate(Validator.schemas.boolean, true);
      expect(validTrue.success).toBe(true);

      const validFalse = Validator.validate(Validator.schemas.boolean, false);
      expect(validFalse.success).toBe(true);

      const invalid = Validator.validate(Validator.schemas.boolean, 'true');
      expect(invalid.success).toBe(false);
    });
  });

  describe('requiredString()', () => {
    it('should create schema for required string field', () => {
      const nameSchema = Validator.schemas.requiredString('Name');

      const valid = Validator.validate(nameSchema, 'John Doe');
      expect(valid.success).toBe(true);

      const invalid = Validator.validate(nameSchema, '');
      expect(invalid.success).toBe(false);
      expect(invalid.errors?.['']).toContain('Name is required');
    });
  });

  describe('Error Messages', () => {
    it('should include custom error messages', () => {
      const schema = z.object({
        age: z.number().positive('Age must be greater than zero')
      });

      const result = Validator.validate(schema, { age: -5 });

      expect(result.success).toBe(false);
      expect(result.errors?.['age']).toContain('Age must be greater than zero');
    });

    it('should collect multiple errors for same field', () => {
      const schema = z.object({
        password: z.string()
          .min(8, 'Password too short')
          .regex(/[0-9]/, 'Password must contain a number')
          .regex(/[A-Z]/, 'Password must contain uppercase')
      });

      const result = Validator.validate(schema, { password: 'abc' });

      expect(result.success).toBe(false);
      expect(result.errors?.['password']).toBeDefined();
      expect(result.errors?.['password'].length).toBeGreaterThan(0);
    });
  });

  describe('Edge Cases', () => {
    it('should handle null and undefined', () => {
      const schema = z.object({
        field: z.string().optional()
      });

      const nullResult = Validator.validate(schema, { field: null });
      expect(nullResult.success).toBe(false);

      const undefinedResult = Validator.validate(schema, { field: undefined });
      expect(undefinedResult.success).toBe(true);

      const missingResult = Validator.validate(schema, {});
      expect(missingResult.success).toBe(true);
    });

    it('should handle empty objects and arrays', () => {
      const objectSchema = z.object({
        items: z.array(z.string()).min(1, 'Array cannot be empty')
      });

      const emptyArray = Validator.validate(objectSchema, { items: [] });
      expect(emptyArray.success).toBe(false);
    });

    it('should handle extra fields (strip by default)', () => {
      const schema = z.object({
        name: z.string()
      });

      const data = {
        name: 'Test',
        extra: 'field'
      };

      const result = Validator.validate(schema, data);

      expect(result.success).toBe(true);
      // Zod strips extra fields by default
      expect(result.data).not.toHaveProperty('extra');
    });
  });
});
