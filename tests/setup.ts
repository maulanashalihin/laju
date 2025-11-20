/**
 * Test Setup File
 * Runs before all tests to configure the testing environment
 */

import { beforeAll, afterAll, afterEach } from 'vitest';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load test environment variables
dotenv.config({ path: '.env.test' });

// Set test database path
const TEST_DB_PATH = './data/test.sqlite3';

beforeAll(() => {
  console.log('🧪 Setting up test environment...');
  
  // Ensure data directory exists
  const dataDir = path.dirname(TEST_DB_PATH);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  // Set environment to test
  process.env.NODE_ENV = 'test';
  process.env.DB_CONNECTION = 'test';
});

afterEach(() => {
  // Clear any mocks after each test
  // vi.clearAllMocks();
});

afterAll(() => {
  console.log('🧹 Cleaning up test environment...');
  
  // Optional: Remove test database after all tests
  // if (fs.existsSync(TEST_DB_PATH)) {
  //   fs.unlinkSync(TEST_DB_PATH);
  // }
});
