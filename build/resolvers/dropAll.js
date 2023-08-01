"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_express_1 = require("apollo-server-express");
const DeviceTokenModel_1 = require("../models/DeviceTokenModel");
const MessageModel_1 = require("../models/MessageModel");
const typeDefs = apollo_server_express_1.gql `
  type Mutation {
    dropAll: Boolean!
  }
`;
const resolvers = {
    Mutation: {
        dropAll: async () => {
            await DeviceTokenModel_1.default.deleteMany({});
            await MessageModel_1.default.deleteMany({});
            return true;
        }
    }
};
exports.default = { typeDefs, resolvers };
//# sourceMappingURL=dropAll.js.map