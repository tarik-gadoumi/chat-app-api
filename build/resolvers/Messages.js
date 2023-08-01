"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_express_1 = require("apollo-server-express");
const apollo_server_1 = require("apollo-server");
const Notifications_1 = require("../utils/Notifications");
const MessageModel_1 = require("../models/MessageModel");
const NEW_MESSAGE_EVENT = "NEW_MESSAGE";
const pubsub = new apollo_server_1.PubSub();
const typeDefs = apollo_server_express_1.gql `
  type Message {
    _id: ID!
    sender_id: String!
    senderName: String!
    text: String!
    date: Timestamp!
    roomId: ID!
  }

  input MessageSendInput {
    sender_id: NEString!
    senderName: NEString!
    text: NEString!
    roomId: ID!
  }

  type MessagesMutation {
    send(input: MessageSendInput!): Message!
  }

  type Mutation {
    messages: MessagesMutation!
  }

  type Query {
    messages(offset: Int! = 0, limit: Int! = 20): [Message!]!
  }

  type Subscription {
    message: Message!
  }
`;
const Query = {
    async messages(_, { offset, limit }) {
        const messages = await MessageModel_1.default.find()
            .limit(Math.min(limit, 100))
            .skip(offset)
            .sort({ date: -1 });
        return messages;
    }
};
const MessagesMutation = {
    async send(_, { input }) {
        const message = new MessageModel_1.default(input);
        await message.save();
        pubsub.publish(NEW_MESSAGE_EVENT, { message });
        Notifications_1.sendPushNotification({
            title: input.senderName,
            body: message.text
        });
        return message;
    }
};
const resolvers = {
    Query,
    Mutation: {
        messages: () => ({})
    },
    MessagesMutation,
    Subscription: {
        message: {
            subscribe: () => pubsub.asyncIterator([NEW_MESSAGE_EVENT])
        }
    }
};
exports.default = { typeDefs, resolvers };
//# sourceMappingURL=Messages.js.map