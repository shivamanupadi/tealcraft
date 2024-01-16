/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  plugins: ["unused-imports"],
  extends: ["@repo/eslint-config/library.js"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.lint.json",
  },
  rules: {
    "unused-imports/no-unused-imports": "error",
  },
};
