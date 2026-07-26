import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import prettier from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";
import importPlugin from "eslint-plugin-import";

export default tseslint.config(
    {
        ignores: ["dist/**", "coverage/**", "node_modules/**"],
    },

    js.configs.recommended,

    ...tseslint.configs.recommended,

    {
        files: ["**/*.ts"],

        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",

            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },

            globals: {
                ...globals.node,
            },
        },

        plugins: {
            prettier,
            import: importPlugin,
        },

        settings: {
            "import/resolver": {
                typescript: {
                    project: "./tsconfig.json",
                },
            },
        },

        rules: {
            /**
             * Prettier
             */
            "prettier/prettier": "error",

            /**
             * Typescript
             */
            "@typescript-eslint/no-explicit-any": "warn",

            "@typescript-eslint/no-unused-vars": [
                "warn",
                {
                    argsIgnorePattern: "^_",
                    varsIgnorePattern: "^_",
                    caughtErrorsIgnorePattern: "^_",
                },
            ],

            "@typescript-eslint/consistent-type-imports": [
                "error",
                {
                    prefer: "type-imports",
                },
            ],

            /**
             * Imports
             */
            "import/order": [
                "error",
                {
                    groups: [
                        "builtin",
                        "external",
                        "internal",
                        "parent",
                        "sibling",
                        "index",
                        "object",
                        "type",
                    ],
                    pathGroups: [
                        {
                            pattern: "@/**",
                            group: "internal",
                        },
                    ],
                    pathGroupsExcludedImportTypes: ["builtin"],
                    alphabetize: {
                        order: "asc",
                        caseInsensitive: true,
                    },
                    "newlines-between": "always",
                },
            ],

            /**
             * JS
             */
            "prefer-const": "error",
            "no-var": "error",
            "no-console": "off",
        },
    },

    prettierConfig,
);
