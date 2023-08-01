const ENV = {
  development: {
    port: 5000,
    mongoURI:
      "mongodb+srv://solotariksbs:7i5t4HD42OD5ZRoa@cluster0-papotage-parad.htfjoda.mongodb.net/"
  },
  production: {
    port: 5000,
    mongoURI:
      "mongodb+srv://solotariksbs:7i5t4HD42OD5ZRoa@cluster0-papotage-parad.htfjoda.mongodb.net/"
  },
  staging: {
    port: 5000,
    mongoURI:
      "mongodb+srv://solotariksbs:7i5t4HD42OD5ZRoa@cluster0-papotage-parad.htfjoda.mongodb.net/"
  }
};
// const ENV = {
//   development: {
//     port: 5000,
//     mongoURI: "mongodb://127.0.0.1:27017/chat-app"
//   },
//   production: {
//     port: 5000,
//     mongoURI: "mongodb://127.0.0.1:27017/chat-app"
//   },
//   staging: {
//     port: 5000,
//     mongoURI: "mongodb://127.0.0.1:27017/chat-app"
//   }
// };
//mongodb://127.0.0.1:27017/chat-app
type ENV = "development" | "staging" | "production";

function getEnvVars(env: ENV) {
  const config = ENV[env];

  if (config) {
    return config;
  }

  console.log(config);

  return ENV.development;
}

export const __DEV__ = process.env.NODE_ENV === "development";

export default getEnvVars(process.env.NODE_ENV as ENV);
