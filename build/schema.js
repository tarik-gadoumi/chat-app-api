"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_tools_1 = require("graphql-tools");
const merge = require("lodash/merge");
const scalars_1 = require("./scalars");
const Messages_1 = require("./resolvers/Messages");
const Device_1 = require("./resolvers/Device");
const User_1 = require("./resolvers/User");
const Room_1 = require("./resolvers/Room");
const Modules = {
    typeDefs: [Messages_1.default.typeDefs, Device_1.default.typeDefs, User_1.default.typeDefs, Room_1.default.typeDefs],
    resolvers: merge(Messages_1.default.resolvers, Device_1.default.resolvers, User_1.default.resolvers, Room_1.default.resolvers)
};
const schema = graphql_tools_1.makeExecutableSchema({
    typeDefs: [...scalars_1.default.declarations, ...Modules.typeDefs],
    resolvers: {
        ...scalars_1.default.resolvers,
        ...Modules.resolvers
    }
});
exports.default = schema;
//# sourceMappingURL=schema.js.map