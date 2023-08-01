"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_express_1 = require("apollo-server-express");
const apollo_server_1 = require("apollo-server");
const RoomModel_1 = require("../models/RoomModel");
const UserModel_1 = require("../models/UserModel");
const MessageModel_1 = require("../models/MessageModel");
const Notifications_1 = require("../utils/Notifications");
const NEW_MESSAGE_EVENT = "NEW_MESSAGE";
const ROOM_UPDATED_EVENT = "ROOM_UPDATED";
const ROOM_DELETED_EVENT = "ROOM_DELETED";
const pubsub = new apollo_server_1.PubSub();
const typeDefs = apollo_server_express_1.gql `
  extend type Query {
    rooms(offset: Int!, limit: Int!): [Room!]!
    room(id: ID!): Room
  }

  type Room {
    _id: ID!
    name: String!
    users: [User!]!
    messages(offset: Int! = 0, limit: Int! = 20): [Message!]!
    creator: RoomCreator
  }

  input RoomCreatorInput {
    _id: ID!
    name: String!
  }

  input RoomCreateInput {
    name: String!
    userIds: [ID!]!
    creator: RoomCreatorInput
  }

  type RoomCreator {
    _id: ID!
    name: String!
  }

  type RoomMutation {
    create(input: RoomCreateInput!): Room!
    delete(id: ID!): ID!
    sendMessage(input: MessageSendInput!, roomId: ID!): Message!
  }

  extend type Mutation {
    room: RoomMutation!
  }

  extend type Subscription {
    newMessage(roomId: ID!): Message
    roomUpdated: Room
    roomDeleted: ID!
  }
`;
const resolvers = {
    Query: {
        rooms: async (_, { offset, limit }) => {
            const rooms = await RoomModel_1.default.find({})
                .limit(Math.min(limit, 100))
                .skip(offset)
                .sort({ updatedAt: -1 });
            return rooms;
        },
        room: async (_, { id }) => {
            return await RoomModel_1.default.findById(id);
        }
    },
    Mutation: {
        room: () => ({})
    },
    RoomMutation: {
        create: async (_, { input }) => {
            const room = new RoomModel_1.default({
                users: input.userIds,
                name: input.name,
                creator: {
                    _id: input.creator._id,
                    name: input.creator.name
                }
            });
            const savedRoom = await room.save();
            await UserModel_1.default.updateMany({ _id: { $in: input.userIds } }, { $push: { rooms: savedRoom._id } });
            pubsub.publish(ROOM_UPDATED_EVENT, { roomUpdated: savedRoom });
            return savedRoom;
        },
        delete: async (_, { id }) => {
            const room = await RoomModel_1.default.findByIdAndDelete(id);
            if (!room) {
                throw new Error("Room not found");
            }
            await UserModel_1.default.updateMany({}, { $pull: { rooms: room._id } });
            await MessageModel_1.default.deleteMany({ roomId: room._id.toString() });
            pubsub.publish(ROOM_DELETED_EVENT, { roomDeleted: room._id });
            return room._id;
        },
        sendMessage: async (_, { input, roomId }) => {
            const message = new MessageModel_1.default({ ...input, roomId });
            await message.save();
            const room = await RoomModel_1.default.findById(roomId);
            if (room) {
                room.messages.push(message._id);
                await room.save();
            }
            pubsub.publish(NEW_MESSAGE_EVENT, { newMessage: message, roomId });
            pubsub.publish(ROOM_UPDATED_EVENT, { roomUpdated: room });
            Notifications_1.sendPushNotification({
                title: input.senderName,
                body: message.text
            });
            return message;
        }
    },
    Room: {
        users: async (room) => {
            return await UserModel_1.default.find({ _id: { $in: room.users } });
        },
        creator: async (room) => {
            const user = await UserModel_1.default.findById(room.creator);
            return {
                _id: user?._id,
                name: user?.name
            };
        },
        messages: async (room, { offset, limit }) => {
            const messages = await MessageModel_1.default.find({ roomId: room._id })
                .skip(offset)
                .limit(limit)
                .sort({ date: -1 });
            return messages;
        }
    },
    Subscription: {
        newMessage: {
            subscribe: apollo_server_express_1.withFilter(() => pubsub.asyncIterator([NEW_MESSAGE_EVENT]), (payload, variables) => {
                return payload.roomId === variables.roomId;
            })
        },
        roomUpdated: {
            subscribe: () => pubsub.asyncIterator([ROOM_UPDATED_EVENT])
        },
        roomDeleted: {
            subscribe: () => pubsub.asyncIterator([ROOM_DELETED_EVENT])
        }
    }
};
exports.default = { typeDefs, resolvers };
//# sourceMappingURL=Room.js.map