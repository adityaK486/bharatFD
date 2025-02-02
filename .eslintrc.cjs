module.exports = {
  env: {
    node: true,
    es2021: true,
    mocha: true,
  },
  extends: "airbnb-base",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  rules: {
    "import/extensions": ["error", "always"],
    "no-console": "off",
    "no-underscore-dangle": ["error", { allow: ["_id"] }],
    "linebreak-style": "off",
    quotes: ["error", "single", { avoidEscape: true }],
    "no-unused-expressions": [
      "error",
      { allowShortCircuit: true, allowTernary: true },
    ],
    "arrow-body-style": "off",
    "no-await-in-loop": "off",
    "prefer-destructuring": "off",
    "guard-for-in": "off",
    "no-restricted-syntax": "off",
    "no-return-await": "off",
  },
};
