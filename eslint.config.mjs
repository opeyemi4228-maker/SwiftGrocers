import js from '@eslint/js';
import nextPlugin from 'eslint-plugin-next';

export default [
  {
    ignores: ['.next/**', 'node_modules/**', '.vercel/**'],
  },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: {
        console: 'readonly',
        process: 'readonly',
      },
    },
    rules: {
      'react/no-unescaped-entities': 'warn',
    },
  },
];
