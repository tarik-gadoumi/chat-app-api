"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const bcrypt_1 = require("bcrypt");
const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
}, { versionKey: false });
schema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt_1.default.hash(this.password, 10);
    }
    next();
});
exports.default = mongoose.model("User", schema);
//# sourceMappingURL=User.js.map