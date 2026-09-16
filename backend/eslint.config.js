import js from "@eslint/js";

export default [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: "module",
      globals: {
        process: "readonly",
        console: "readonly",
        Buffer: "readonly"
      }
    },
    rules: {
      // Force use of camelcase
      "camelcase": ["error", { properties: "always" }],
      // Advert a variable is declared and never used
      "no-unused-vars": "warn",
      // Use console.log due to the ausence of advanced system logs.
      "no-console": "off"
    }
  }
];