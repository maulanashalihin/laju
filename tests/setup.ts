/**
 * Test Setup File
 * Runs before all tests to configure the testing environment.
 */

import { beforeAll, afterAll } from "vitest";

beforeAll(() => {
	// Set test environment
	process.env.NODE_ENV = "test";
	process.env.DB_CONNECTION = "test";
	process.env.APP_URL = "http://localhost:5555";
});

afterAll(() => {
	// Cleanup if needed
});
