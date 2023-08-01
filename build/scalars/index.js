"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const NEString_1 = require("./NEString");
const Timestamp_1 = require("./Timestamp");
exports.default = {
    declarations: [
        NEString_1.default.declaration,
        Timestamp_1.default.declaration,
    ],
    resolvers: {
        ...NEString_1.default.type,
        ...Timestamp_1.default.type,
    }
};
//# sourceMappingURL=index.js.map