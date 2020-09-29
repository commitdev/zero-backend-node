module.exports = {
  env: {
    es6: true,
    node: true,
    jest: true,
    jasmine: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:node/recommended",
    "plugin:promise/recommended",
    "plugin:prettier/recommended",
  ],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ["import", "node", "prettier", "promise"],
  rules: {
    "import/order": [
      2,
      {
        groups: [
          ["builtin", "external"],
          ["internal", "parent", "sibling", "index"],
        ],
        "newlines-between": "always",
      },
    ],
    "import/newline-after-import": [2],
    "linebreak-style": ["error", "unix"],
    "no-console": "off",
    quotes: ["error", "double", { avoidEscape: true }],
    semi: ["error", "always"],
  },
};
