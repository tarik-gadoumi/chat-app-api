import * as express from "express";
import * as mongoose from "mongoose";
import * as http from "http";

import { ApolloServer } from "apollo-server-express";

import config from "./config";
import schema from "./schema";
import { BlacklistedToken } from "./models/backListedTokenSchema";

const app = express();
const server = new ApolloServer({
  schema,
  introspection: true,
  playground: true,
  context: async ({ req, connection }) => {
    if (connection) {
      console.log(connection.context);
      return connection.context;
    } else {
      const authHeader = req.headers.authorization || "";
      if (authHeader) {
        const token = authHeader.split(" ")[1];
        const isBlacklisted = await BlacklistedToken.findOne({ token });
        if (isBlacklisted) {
          throw new Error("Token is blacklisted. Please login again.");
        }
      }
    }
  }
});

server.applyMiddleware({ app });

const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

httpServer.listen(config.port, () => {
  console.log(
    `🚀 Server ready at http://127.0.0.1:${config.port}${server.graphqlPath}`
  );
  console.log(
    `🚀 Subscriptions ready at ws://127.0.0.1:${config.port}${server.subscriptionsPath}`
  );

  const connectMongoWithRetry = () => {
    mongoose
      .connect(config.mongoURI, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true
      })
      .then(() =>
        console.log(`🚀 MongoDB connection ready at ${config.mongoURI}`)
      )
      .catch(err => {
        console.error("MongoDB connection error", err);
        setTimeout(connectMongoWithRetry, 5000);
      });
  };

  connectMongoWithRetry();
});
