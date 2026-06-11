module.exports = {
  projects: [
    {
      displayName: "unit",
      preset: "ts-jest",
      testEnvironment: "node",
      roots: ["<rootDir>/src"],
      moduleDirectories: ["node_modules", "src"],
      testMatch: ["**/*.spec.ts"],
      setupFiles: ["dotenv/config"],
    },
    {
      displayName: "integration",
      preset: "ts-jest",
      testEnvironment: "node",
      roots: ["<rootDir>/src"],
      moduleDirectories: ["node_modules", "src"],
      testMatch: ["**/*.test.ts"],
      setupFiles: ["dotenv/config"],
    }
  ],
  collectCoverage: true,
  collectCoverageFrom: [
    "src/**/*.ts",
    "!src/**/*.spec.ts",
    "!src/**/*.test.ts"
  ],
  coverageDirectory: "coverage",
  coverageReporters: ["lcov", "text", "html"],
};