"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require("dotenv");
const apollo_server_express_1 = require("apollo-server-express");
const graphql_1 = require("../generated/graphql");
const UserModel_1 = require("../models/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const backListedTokenSchema_1 = require("../models/backListedTokenSchema");
dotenv.config();
const { JWT_SECRET_KEY } = process.env;
const typeDefs = apollo_server_express_1.gql `
  enum Status {
    ONLINE
    OFFLINE
  }
  extend type Query {
    users: [User!]!
  }
  input SignupInput {
    name: NEString!
    password: NEString!
  }

  input LoginInput {
    name: NEString!
    password: NEString!
  }

  type User {
    _id: ID!
    name: NEString!
    token: String!
    status: Status!
  }

  type UserMutation {
    signup(input: SignupInput!): User!
    login(input: LoginInput!): User!
    logout(name: NEString!, token: String!): Boolean!
  }

  extend type Mutation {
    user: UserMutation!
  }
`;
const UserQuery = {
    async users() {
        const allUsers = await UserModel_1.default.find({});
        return allUsers.map(user => ({
            _id: user._id,
            name: user.name,
            token: "",
            status: user.status
        }));
    }
};
const UserMutation = {
    async signup(_, { input }) {
        console.log("input", input);
        const existingUser = await UserModel_1.default.findOne({ name: input.name });
        if (existingUser) {
            throw new Error("User already exists");
        }
        const user = new UserModel_1.default({ ...input, status: "ONLINE" });
        await user.save();
        console.log("user", user);
        const token = jwt.sign({ userId: user.id }, JWT_SECRET_KEY, {
            expiresIn: "1h"
        });
        return { _id: user._id, name: user.name, token, status: user.status };
    },
    async login(_, { input }) {
        const user = await UserModel_1.default.findOne({ name: input.name });
        if (!user) {
            throw new Error("Invalid credentials");
        }
        const isPasswordValid = await bcrypt.compare(input.password, user.password);
        if (!user || !isPasswordValid) {
            throw new Error("Invalid credentials");
        }
        user.status = graphql_1.Status.ONLINE;
        await user.save();
        console.log("user in login", user);
        const token = jwt.sign({ userId: user.id }, JWT_SECRET_KEY, {
            expiresIn: "1h"
        });
        return { _id: user._id, name: user.name, token, status: user.status };
    },
    async logout(_, { name, token }) {
        const user = await UserModel_1.default.findOne({ name });
        if (!user) {
            throw new Error("User not found");
        }
        user.status = graphql_1.Status.OFFLINE;
        await user.save();
        const blacklistedToken = new backListedTokenSchema_1.BlacklistedToken({ token });
        await blacklistedToken.save();
        return true;
    }
};
const resolvers = {
    Query: {
        users: UserQuery.users
    },
    Mutation: {
        user: () => ({})
    },
    UserMutation
};
exports.default = { typeDefs, resolvers };
//# sourceMappingURL=User.js.map