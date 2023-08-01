"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ENV = {
    development: {
        port: 5000,
        mongoURI: "mongodb+srv://solotariksbs:7i5t4HD42OD5ZRoa@cluster0-papotage-parad.htfjoda.mongodb.net/"
    },
    production: {
        port: 5000,
        mongoURI: "mongodb+srv://solotariksbs:7i5t4HD42OD5ZRoa@cluster0-papotage-parad.htfjoda.mongodb.net/"
    },
    staging: {
        port: 5000,
        mongoURI: "mongodb+srv://solotariksbs:7i5t4HD42OD5ZRoa@cluster0-papotage-parad.htfjoda.mongodb.net/"
    }
};
function getEnvVars(env) {
    const config = ENV[env];
    if (config) {
        return config;
    }
    console.log(config);
    return ENV.development;
}
exports.__DEV__ = process.env.NODE_ENV === "development";
exports.default = getEnvVars(process.env.NODE_ENV);
//# sourceMappingURL=config.js.map