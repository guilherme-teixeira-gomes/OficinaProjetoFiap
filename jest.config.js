module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    collectCoverage: true,
    collectCoverageFrom: [
      "src/services/**/*.ts"
    ],
    coverageDirectory: "coverage",
    coverageReporters: ["lcov", "text", "html"],
    testMatch: ["**/*.spec.ts", "**/*.test.ts"],
};