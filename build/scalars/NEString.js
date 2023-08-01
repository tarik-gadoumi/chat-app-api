"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const language_1 = require("graphql/language");
const apollo_server_1 = require("apollo-server");
const parse = (v) => {
    if (v === undefined || v === null) {
        throw new Error('field should be String');
    }
    const str = String(v);
    if (str.length) {
        return str.trim();
    }
    throw new Error("field can't be empty");
};
const literal = (ast) => {
    if (ast.kind === language_1.Kind.STRING) {
        return parse(ast.value);
    }
    throw new Error('field should be String');
};
exports.default = {
    declaration: apollo_server_1.gql `
    scalar NEString
  `,
    type: {
        NEString: new graphql_1.GraphQLScalarType({
            name: 'NEString',
            description: 'Alias `Non Empty String`',
            serialize: parse,
            parseValue: parse,
            parseLiteral: literal
        })
    }
};
//# sourceMappingURL=NEString.js.map