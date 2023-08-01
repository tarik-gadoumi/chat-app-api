"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_express_1 = require("apollo-server-express");
const DeviceTokenModel_1 = require("../models/DeviceTokenModel");
const typeDefs = apollo_server_express_1.gql `
  enum DevicePlatform {
    IOS
    ANDROID
  }

  input DeviceRegisterInput {
    user_id: NEString!
    token: NEString!
    devicePlatform: DevicePlatform!
    deviceYear: String
    systemVersion: String
    deviceName: String
  }

  type DeviceMutation {
    register(input: DeviceRegisterInput!): Boolean!
    unregister(token: NEString!): Boolean!
  }

  extend type Mutation {
    device: DeviceMutation!
  }
`;
const DeviceMutation = {
    async register(_, { input }) {
        const exisingToken = await DeviceTokenModel_1.default.findOne({
            token: input.token,
            user_id: input.user_id
        });
        if (!exisingToken) {
            const deviceToken = new DeviceTokenModel_1.default(input);
            await deviceToken.save();
        }
        return true;
    },
    async unregister(_, { token }) {
        const deviceToken = await DeviceTokenModel_1.default.findOne({ token });
        if (deviceToken) {
            await deviceToken.remove();
            return true;
        }
        return false;
    }
};
const resolvers = {
    Mutation: {
        device: () => ({})
    },
    DeviceMutation
};
exports.default = { typeDefs, resolvers };
//# sourceMappingURL=Device.js.map