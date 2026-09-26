// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require("eslint-config-expo/flat");

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ["dist/*"],
  },
  {
    // React Three Fiber uses a custom JSX reconciler — standard HTML prop rules
    // don't apply to Three.js elements (mesh, group, pointLight, etc.).
    files: ["**/*.tsx", "**/*.ts"],
    rules: {
      "react/no-unknown-property": [
        "warn",
        {
          ignore: [
            // Three.js object props
            "position", "rotation", "scale", "up", "quaternion",
            // Geometry & material args
            "args", "attach", "geometry",
            // Shadow props
            "castShadow", "receiveShadow",
            // Material props
            "color", "roughness", "metalness", "emissive", "emissiveIntensity",
            "transparent", "opacity", "wireframe", "side", "depthWrite",
            // Light props
            "intensity", "distance", "decay", "angle", "penumbra",
            "shadow-mapSize-width", "shadow-mapSize-height",
            "shadow-camera-near", "shadow-camera-far",
            "shadow-camera-left", "shadow-camera-right",
            "shadow-camera-top", "shadow-camera-bottom",
            // Fog / color attach
            "fog",
          ],
        },
      ],
    },
  },
]);
