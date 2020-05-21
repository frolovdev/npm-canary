module.exports = {
  // roots: ["<rootDir>/src"],
  transform: {
    "^.+\\.jsx?$": "babel-jest",
    "^.+\\.ts$": "ts-jest"
  },
  preset: "ts-jest",
  testMatch: [
    `<rootDir>/integration/**/*.test.ts`,
    `<rootDir>/integration/**/*.propbased-test.ts`
  ],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  // moduleNameMapper: {
  //   "^@someinterestingtestnamesorrynpmforthisasdsadasdasdasd\\/((?!config)[^\\/]+)":
  //     "<rootDir>/../$1/src"
  // },
  verbose: true
};
