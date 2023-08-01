"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const schema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true
    },
    token: {
        type: String,
        required: true
    },
    devicePlatform: {
        type: String
    },
    deviceName: {
        type: String
    },
    deviceYear: {
        type: String
    },
    systemVersion: {
        type: String
    }
}, { versionKey: false });
schema.index({ user_id: 1 });
exports.default = mongoose.model("DeviceToken", schema);
//# sourceMappingURL=DeviceTokenModel.js.map