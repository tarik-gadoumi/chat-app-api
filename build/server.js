"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const mongoose = require("mongoose");
const http = require("http");
const apollo_server_express_1 = require("apollo-server-express");
const config_1 = require("./config");
const schema_1 = require("./schema");
const backListedTokenSchema_1 = require("./models/backListedTokenSchema");
const app = express();
const server = new apollo_server_express_1.ApolloServer({
    schema: schema_1.default,
    introspection: true,
    playground: true,
    context: async ({ req, connection }) => {
        if (connection) {
            console.log(connection.context);
            return connection.context;
        }
        else {
            const authHeader = req.headers.authorization || "";
            if (authHeader) {
                const token = authHeader.split(" ")[1];
                const isBlacklisted = await backListedTokenSchema_1.BlacklistedToken.findOne({ token });
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
httpServer.listen(config_1.default.port, () => {
    console.log(`🚀 Server ready at http://127.0.0.1:${config_1.default.port}${server.graphqlPath}`);
    console.log(`🚀 Subscriptions ready at ws://127.0.0.1:${config_1.default.port}${server.subscriptionsPath}`);
    const connectMongoWithRetry = () => {
        mongoose
            .connect(config_1.default.mongoURI, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true
        })
            .then(() => console.log(`🚀 MongoDB connection ready at ${config_1.default.mongoURI}`))
            .catch(err => {
            console.error("MongoDB connection error", err);
            setTimeout(connectMongoWithRetry, 5000);
        });
    };
    connectMongoWithRetry();
});
//# sourceMappingURL=server.js.map