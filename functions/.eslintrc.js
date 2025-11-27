// functions/.eslintrc.js

module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "google",
  ],
  rules: {
    quotes: ["error", "double"],
    // ✅ FIX: This new rule tells ESLint to ignore any unused variables
    // that start with an underscore (_). This will fix the _context error.
    "no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
  },
};