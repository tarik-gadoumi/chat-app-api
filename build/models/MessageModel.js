"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
function timestamp() {
    return +new Date();
}
const schema = new mongoose.Schema({
    sender_id: {
        type: String,
        required: true
    },
    senderName: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Room",
        required: true
    },
    date: {
        type: Number,
        default: timestamp
    }
}, { versionKey: false });
exports.default = mongoose.model("Message", schema);
//# sourceMappingURL=MessageModel.js.map