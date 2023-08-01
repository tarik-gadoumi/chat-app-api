"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const blacklistedTokenSchema = new mongoose.Schema({
    token: String,
    createdAt: { type: Date, default: Date.now }
});
exports.BlacklistedToken = mongoose.model("BlacklistedToken", blacklistedTokenSchema);
//# sourceMappingURL=backListedTokenSchema.js.map