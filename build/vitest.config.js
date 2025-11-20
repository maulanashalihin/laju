"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("vitest/config");
const path_1 = __importDefault(require("path"));
exports.default = (0, config_1.defineConfig)({
    test: {
        globals: true,
        environment: 'node',
        setupFiles: ['./tests/setup.ts'],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
            exclude: [
                'node_modules/**',
                'dist/**',
                'build/**',
                'tests/**',
                '**/*.d.ts',
                '**/*.config.*',
                '**/mockData/**'
            ]
        },
        testTimeout: 10000,
    },
    resolve: {
        alias: {
            'app': path_1.default.resolve(__dirname, './app'),
            'routes': path_1.default.resolve(__dirname, './routes'),
            'type': path_1.default.resolve(__dirname, './type'),
        }
    }
});
//# sourceMappingURL=vitest.config.js.map