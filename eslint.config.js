import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";

/** CI-friendly lint: parse TS/TSX without strict type-aware rules on legacy demo code. */
export default tseslint.config(
  {
    ignores: [
      "dist/**",
      "node_modules/**",
      "src/app/components/ui/**",
      "**/*.test.tsx",
    ],
  },
  {
    files: ["src/**/*.{ts,tsx}"],
    extends: [js.configs.recommended],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
      parser: tseslint.parser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    rules: {
      "no-unused-vars": "off",
      "no-undef": "off",
      "no-empty": "warn",
      "no-case-declarations": "off",
    },
  },
);
