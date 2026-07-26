/** @type {import('jest').Config} */
module.exports = {
    testEnvironment: "node",

    transform: {
        "^.+\\.(t|j)sx?$": "@swc/jest",
    },

    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/src/$1",
        "^@config/(.*)$": "<rootDir>/src/config/$1",
        "^@modules/(.*)$": "<rootDir>/src/modules/$1",
        "^@utils/(.*)$": "<rootDir>/src/shared/utils/$1",
        "^@constants/(.*)$": "<rootDir>/src/shared/constants/$1",
        "^@errors/(.*)$": "<rootDir>/src/shared/errors/$1",
    },
};
