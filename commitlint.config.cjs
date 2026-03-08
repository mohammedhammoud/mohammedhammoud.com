const conventional = require("@commitlint/config-conventional").default;
const conventionalTypes = conventional.rules["type-enum"][2];

module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [2, "always", [...conventionalTypes, "blog"]],
  },
};
