import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

// Import Next.js configs directly (they're already in flat config format)
const nextCoreWebVitals = require('eslint-config-next/core-web-vitals');
const nextTypeScript = require('eslint-config-next/typescript');

const eslintConfig = [
  {
    ignores: [
      '.next/**',
      'out/**',
      'build/**',
      'node_modules/**',
      '.next-env.d.ts',
      'next-env.d.ts',
      '*.config.js',
      '*.config.mjs',
      '*.config.ts',
      'public/**',
    ],
  },
  ...nextCoreWebVitals,
  ...nextTypeScript,
  {
    rules: {
      // Best practices - avoid common mistakes and typos
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-unused-vars': 'off', // TypeScript handles this
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      'prefer-const': 'warn',
      'no-var': 'error',
      'no-duplicate-imports': 'error',
      'no-unused-expressions': 'warn',
      'no-useless-return': 'warn',
      'prefer-arrow-callback': 'warn',
      'prefer-template': 'warn',
      // Help catch typos - disabled for TypeScript projects
      'no-undef': 'off', // TypeScript handles this
      'no-redeclare': 'error',
    },
  },
];

export default eslintConfig;
