<<<<<<< HEAD
import js from '@eslint/js'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import globals from 'globals'

export default [
  {
    ignores: ['dist', 'node_modules'],
  },

  {
    files: ['**/*.{ts,tsx}'],

    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
        project: './tsconfig.json',
      },

      globals: {
        ...globals.browser, // window, document, fetch, etc
        ...globals.node,    // __dirname, require, process
        React: 'readonly',  // React 17+ JSX transform
      },
    },

    settings: {
      react: {
        version: 'detect',
      },
    },

    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      '@typescript-eslint': tseslint,
    },

    rules: {
      ...js.configs.recommended.rules,
      ...tseslint.configs.recommended.rules,

      // React 17+ JSX transform (NO need to import React)
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',

      // Hooks rules
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // Vite fast refresh
      'react-refresh/only-export-components': 'warn',

      // Console allowed
      'no-console': 'off',

      // Let TS handle unused vars
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['warn'],
      
      // Allow any type (can be made stricter later)
      '@typescript-eslint/no-explicit-any': 'warn',
      
      // Fix no-undef for TypeScript types
      'no-undef': 'off', // TypeScript handles this
    },
  },
]
=======
const tseslint = require("@typescript-eslint/eslint-plugin");
const tsParser = require("@typescript-eslint/parser");

/** @type {import("eslint").FlatConfig[]} */
module.exports = [
  {
    ignores: ["node_modules/**", "dist/**", "build/**", ".env", "*.log"],
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: "latest",
      sourceType: "module",
    },
    plugins: {
      "@typescript-eslint": tseslint,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-explicit-any": "off"
    },
  },
];
>>>>>>> eee8da5 (Initial commit)
