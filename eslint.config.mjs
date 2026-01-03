import eslintPluginAstro from 'eslint-plugin-astro';

const eslintConfig = [
  {
    ignores: [
      'dist/**',
      '.astro/**',
      'node_modules/**',
      '*.config.js',
      '*.config.mjs',
      '*.config.ts',
      'public/**',
    ],
  },
  ...eslintPluginAstro.configs.recommended,
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
      'no-undef': 'off', // TypeScript handles this
      'no-redeclare': 'error',
    },
  },
];

export default eslintConfig;
