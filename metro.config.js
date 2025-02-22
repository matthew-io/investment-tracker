const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

// Get the default Expo Metro config
const config = getDefaultConfig(__dirname);

// 1. Set up SVG handling
//    - Remove "svg" from assetExts
//    - Add "svg" to sourceExts
const { assetExts, sourceExts } = config.resolver;
config.resolver.assetExts = assetExts.filter((ext) => ext !== "svg");
config.resolver.sourceExts = [...sourceExts, "svg"];

// 2. Use the react-native-svg-transformer for .svg files
config.transformer.babelTransformerPath = require.resolve("react-native-svg-transformer");

// 3. Wrap the config with NativeWind so it can process global.css
module.exports = withNativeWind(config, { input: "./global.css" });
