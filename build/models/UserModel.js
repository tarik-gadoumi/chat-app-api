"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
var Status;
(function (Status) {
    Status["ONLINE"] = "ONLINE";
    Status["OFFLINE"] = "OFFLINE";
})(Status || (Status = {}));
const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    status: { type: String, required: true, default: Status.OFFLINE },
    rooms: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Room"
        }
    ]
}, { versionKey: false });
schema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});
exports.default = mongoose.model("User", schema);
//# sourceMappingURL=UserModel.js.map