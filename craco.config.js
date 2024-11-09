module.exports = {
  style: {
    postcss: {
      plugins: [ require("autoprefixer")],
    },
  },
  babel: {
    "plugins": [
      ["@babel/plugin-proposal-class-properties", {loose: true}],
      ["@babel/plugin-proposal-private-methods", {loose: true}],
      ["@babel/plugin-proposal-optional-chaining", {loose: true}],
      ["@babel/plugin-proposal-nullish-coalescing-operator", {loose: true}],
    ]
  }
};
