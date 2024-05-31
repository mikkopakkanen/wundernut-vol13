import globals from "globals"
import pluginJs from "@eslint/js"
import tseslint from "typescript-eslint"

export default [
  {languageOptions: { globals: globals.browser }},
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      "no-unused-vars": "warn",
      "no-undef": "warn",
      "quotes": "error",
      "semi": ["error", "never"],
      "indent": ["error", 2],
      "no-trailing-spaces": "error"
    },
    files: ["src/**/*.ts"],
  }
]