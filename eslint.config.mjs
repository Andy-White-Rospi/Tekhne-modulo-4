import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import playwright from 'eslint-plugin-playwright';
import prettier from 'eslint-config-prettier';

export default tseslint.config(
    {
        ignores: [
            'node_modules/',
            'test-results/',
            'playwright-report/',
            'blob-report/',
            'coverage/',
            'dist/',
            'allure-results/',
            'allure-report/',
        ],
    },

    js.configs.recommended,

    ...tseslint.configs.recommended,

    {
        files: ['**/*.ts'],

        rules: {
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                    caughtErrorsIgnorePattern: '^_',
                },
            ],

            '@typescript-eslint/no-explicit-any': 'warn',

            '@typescript-eslint/naming-convention': [
                'error',
                {
                    selector: 'variable',
                    format: ['camelCase', 'UPPER_CASE'],
                },
                {
                    selector: 'function',
                    format: ['camelCase'],
                },
                {
                    selector: 'method',
                    format: ['camelCase'],
                },
                {
                    selector: 'property',
                    format: ['camelCase', 'snake_case'],
                },
                {
                    selector: 'typeLike',
                    format: ['PascalCase'],
                },
            ],

            '@typescript-eslint/no-inferrable-types': 'error',

            '@typescript-eslint/consistent-type-definitions': [
                'error',
                'interface',
            ],
        },
    },

    {
        files: ['tests/**/*.ts'],

        ...playwright.configs['flat/recommended'],

        rules: {
            'playwright/no-focused-test': 'error',
            'playwright/no-skipped-test': 'warn',
            'playwright/no-wait-for-timeout': 'warn',
            'playwright/prefer-web-first-assertions': 'warn',
            'playwright/expect-expect': 'warn',
            'playwright/prefer-locator': 'warn',
            'playwright/no-raw-locators': 'off',
        },
    },

    // Desactiva reglas de ESLint que puedan entrar
    // en conflicto con Prettier.
    prettier,
);