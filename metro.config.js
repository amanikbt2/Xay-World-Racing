const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);
config.resolver.sourceExts.push('mjs');
config.resolver.assetExts.push('glb', 'gltf', 'bin', 'obj', 'mtl');

module.exports = config;
