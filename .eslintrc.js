module.exports = {
  extends: ["expo", "prettier"],
  ignorePatterns: ["/dist/*", "expo-env.d.ts"],
  plugins: ["prettier"],
  rules: {
    "prettier/prettier": "error",
  },
};
