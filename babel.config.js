module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      "babel-preset-expo",
      [
        "@babel/preset-env",
        {
          loose: true,
          shippedProposals: true,
        },
      ],
      "module:metro-react-native-babel-preset",
    ],
    plugins: [
      "module:react-native-dotenv",
      ["@babel/plugin-transform-private-property-in-object", { loose: true }],
      "nativewind/babel",
      "react-native-reanimated/plugin",
    ],
  };
};
