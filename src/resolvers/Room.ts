import { gql, withFilter } from "apollo-server-express";
import { PubSub } from "apollo-server";

import {
  RoomMutationResolvers,
  RoomMutationCreateArgs,
  ResolversTypes
} from "../generated/graphql";
import RoomModel from "../models/RoomModel";
import UserModel from "../models/UserModel";
import MessageModel from "../models/MessageModel";
import { sendPushNotification } from "../utils/Notifications";

const NEW_MESSAGE_EVENT = "NEW_MESSAGE";
const ROOM_UPDATED_EVENT = "ROOM_UPDATED";
const ROOM_DELETED_EVENT = "ROOM_DELETED";

const pubsub = new PubSub();

const typeDefs = gql`
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
      const rooms = await RoomModel.find({})
        .limit(Math.min(limit, 100))
        .skip(offset)
        .sort({ updatedAt: -1 });

      return rooms;
    },
    room: async (_, { id }) => {
      return await RoomModel.findById(id);
    }
  },
  Mutation: {
    room: () => ({})
  },
  RoomMutation: {
    create: async (_, { input }) => {
      const room = new RoomModel({
        users: input.userIds,
        name: input.name,
        creator: {
          _id: input.creator._id,
          name: input.creator.name
        }
      });

      const savedRoom = await room.save();

      // Update all users with the new room
      await UserModel.updateMany(
        { _id: { $in: input.userIds } },
        { $push: { rooms: savedRoom._id } }
      );

      pubsub.publish(ROOM_UPDATED_EVENT, { roomUpdated: savedRoom });

      return savedRoom;
    },
    delete: async (_, { id }) => {
      // Delete room by ID
      const room = await RoomModel.findByIdAndDelete(id);

      // Check if room exists
      if (!room) {
        throw new Error("Room not found");
      }

      // Remove room from all users
      await UserModel.updateMany({}, { $pull: { rooms: room._id } });

      // Remove all messages associated with the room
      await MessageModel.deleteMany({ roomId: room._id.toString() });

      pubsub.publish(ROOM_DELETED_EVENT, { roomDeleted: room._id });

      // Return deleted room ID
      return room._id;
    },
    sendMessage: async (_, { input, roomId }) => {
      // Create a new message and associate it with the room
      const message = new MessageModel({ ...input, roomId });
      await message.save();

      // Find the room and add the message to it
      const room = await RoomModel.findById(roomId);
      if (room) {
        room.messages.push(message._id);

        await room.save();
      }

      pubsub.publish(NEW_MESSAGE_EVENT, { newMessage: message, roomId });
      // Publish roomUpdated event with the updated room data
      pubsub.publish(ROOM_UPDATED_EVENT, { roomUpdated: room });

      sendPushNotification({
        title: input.senderName,
        body: message.text
      });

      return message;
    }
  },
  Room: {
    users: async room => {
      return await UserModel.find({ _id: { $in: room.users } });
    },
    creator: async room => {
      const user = await UserModel.findById(room.creator);

      return {
        _id: user?._id,
        name: user?.name
      };
    },
    messages: async (room, { offset, limit }) => {
      const messages = await MessageModel.find({ roomId: room._id })
        .skip(offset)
        .limit(limit)
        .sort({ date: -1 });

      return messages;
    }
  },
  Subscription: {
    newMessage: {
      subscribe: withFilter(
        () => pubsub.asyncIterator([NEW_MESSAGE_EVENT]),
        (payload, variables) => {
          return payload.roomId === variables.roomId;
        }
      )
    },
    roomUpdated: {
      subscribe: () => pubsub.asyncIterator([ROOM_UPDATED_EVENT])
    },
    roomDeleted: {
      subscribe: () => pubsub.asyncIterator([ROOM_DELETED_EVENT])
    }
  }
};

export default { typeDefs, resolvers };
