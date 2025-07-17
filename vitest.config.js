import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.js'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        'dist/',
        '**/*.config.js',
        'src/main.jsx',
        'src/components/DatabaseTest.jsx',
        'src/components/DebugProgressFix.jsx',
        'src/components/FirebaseDataInspector.jsx'
      ],
      thresholds: {
        global: {
          branches: 90,
          functions: 90,
          lines: 95,
          statements: 95
        }
      }
    }
  },
});