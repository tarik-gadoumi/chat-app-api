import * as dotenv from "dotenv";
import { gql } from "apollo-server-express";
import {
  Status,
  UserMutationResolvers,
  UserResolvers
} from "../generated/graphql";
import UserModel from "../models/UserModel";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { BlacklistedToken } from "../models/backListedTokenSchema";

dotenv.config();

const { JWT_SECRET_KEY } = process.env;

const typeDefs = gql`
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

const UserQuery: UserResolvers = {
  async users() {
    const allUsers = await UserModel.find({});
    return allUsers.map(user => ({
      _id: user._id,
      name: user.name,
      token: "",
      status: user.status
    }));
  }
};

const UserMutation: UserMutationResolvers = {
  async signup(_, { input }) {
    console.log("input", input);
    const existingUser = await UserModel.findOne({ name: input.name });

    if (existingUser) {
      throw new Error("User already exists");
    }

    const user = new UserModel({ ...input, status: "ONLINE" });
    await user.save();
    console.log("user", user);
    const token = jwt.sign({ userId: user.id }, JWT_SECRET_KEY as string, {
      expiresIn: "1h"
    });

    return { _id: user._id, name: user.name, token, status: user.status };
  },
  async login(_, { input }) {
    const user = await UserModel.findOne({ name: input.name });

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isPasswordValid = await bcrypt.compare(
      input.password,
      user!.password
    );

    if (!user || !isPasswordValid) {
      throw new Error("Invalid credentials");
    }

    user.status = Status.ONLINE;
    await user.save();
    console.log("user in login", user);
    const token = jwt.sign({ userId: user.id }, JWT_SECRET_KEY as string, {
      expiresIn: "1h"
    });

    return { _id: user._id, name: user.name, token, status: user.status };
  },
  async logout(_, { name, token }) {
    const user = await UserModel.findOne({ name });
    if (!user) {
      throw new Error("User not found");
    }

    user.status = Status.OFFLINE;
    await user.save();

    const blacklistedToken = new BlacklistedToken({ token });
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

export default { typeDefs, resolvers };
