import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

export default [
  // 1. Next.js の基本設定を互換モードで読み込む
  ...compat.extends("next/core-web-vitals", "prettier"),

  {
    // 2. 対象ファイルを指定
    files: ["src/**/*.{ts,tsx}"],
    rules: {
      "no-unused-vars": "off",
      "no-console": ["warn", { allow: ["warn", "error"] }],
      // 3. import 順序のルール
      "import/order": [
        "error",
        {
          "groups": [
            "builtin",
            "external",
            "internal",
            ["parent", "sibling", "index"],
            "object",
            "type"
          ],
          "pathGroups": [
            { "pattern": "react", "group": "external", "position": "before" },
            { "pattern": "next/**", "group": "external", "position": "before" },
            { "pattern": "@/**", "group": "internal", "position": "after" },
            { "pattern": "**/*.css", "group": "object", "position": "after" }
          ],
          "pathGroupsExcludedImportTypes": ["react", "next"],
          "alphabetize": { "order": "asc", "caseInsensitive": true },
          "newlines-between": "never"
        }
      ]
    }
  }
];