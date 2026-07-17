import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
	test: {
		globals: true,
		environment: "node",
		setupFiles: ["./tests/setup.ts"],
		include: ["tests/**/*.test.ts"],
		exclude: [
			"node_modules/**",
			"dist/**",
			"build/**",
			"tests/e2e/**",
			"**/*.d.ts",
			"**/*.config.*",
			"**/mockData/**",
		],
		coverage: {
			provider: "v8",
			reporter: ["text", "json", "html"],
			exclude: [
				"node_modules/**",
				"dist/**",
				"build/**",
				"tests/**",
				"**/*.d.ts",
				"**/*.config.*",
				"**/mockData/**",
			],
		},
		testTimeout: 10000,
	},
	resolve: {
		alias: {
			app: path.resolve(__dirname, "./app"),
			routes: path.resolve(__dirname, "./routes"),
			type: path.resolve(__dirname, "./type"),
		},
	},
});
