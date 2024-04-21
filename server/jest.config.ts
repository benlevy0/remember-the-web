import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  preset: "ts-jest/presets/default-esm", // Opt for the ESM preset
  testEnvironment: "node",
  transform: {}, // Essential for TS project; might adjust for JS or mixed content
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1", // Helps Jest correctly map JS imports in a TS context
    // Your additional mappers here, especially if dealing with ESM modules directly
  },
  extensionsToTreatAsEsm: [".ts"],
  globals: {
    "ts-jest": {
      useESM: true, // Instruct ts-jest to use ESM
      tsconfig: "tsconfig.json", // Confirm this points to your TS config file
    },
  },
  // Use this if node-fetch or other ESM modules cause issues
  transformIgnorePatterns: ["node_modules/(?!(node-fetch)/)"], // Adjust based on the packages causing issues
};

export default config;
