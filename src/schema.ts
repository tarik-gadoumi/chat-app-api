import { makeExecutableSchema } from "graphql-tools";
import merge = require("lodash/merge");
import Scalars from "./scalars";

// Modules
import Messages from "./resolvers/Messages";
import Device from "./resolvers/Device";
import User from "./resolvers/User";
import Room from "./resolvers/Room";

const Modules = {
  typeDefs: [Messages.typeDefs, Device.typeDefs, User.typeDefs, Room.typeDefs],
  resolvers: merge(
    Messages.resolvers,
    Device.resolvers,
    User.resolvers,
    Room.resolvers
  )
};

const schema = makeExecutableSchema({
  typeDefs: [...Scalars.declarations, ...Modules.typeDefs],
  resolvers: {
    ...Scalars.resolvers,
    ...Modules.resolvers
  }
});

export default schema;
