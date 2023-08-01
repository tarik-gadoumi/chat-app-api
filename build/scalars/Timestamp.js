"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const language_1 = require("graphql/language");
const apollo_server_1 = require("apollo-server");
const parse = (v) => {
    if (v === undefined || v === null) {
        throw new Error('field should be String');
    }
    return v;
};
const literal = (ast) => {
    if (ast.kind === language_1.Kind.INT) {
        return parse(ast.value);
    }
    throw new Error('field should be String');
};
exports.default = {
    declaration: apollo_server_1.gql `
    scalar Timestamp
  `,
    type: {
        Timestamp: new graphql_1.GraphQLScalarType({
            name: 'Timestamp',
            description: 'Timestamp format',
            serialize: parse,
            parseValue: parse,
            parseLiteral: literal
        }),
    }
};
//# sourceMappingURL=Timestamp.js.map