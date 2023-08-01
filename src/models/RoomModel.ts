import * as mongoose from "mongoose";

export interface RoomDocument extends mongoose.Document {
  name: string;
  description?: string;
  messages: mongoose.Types.ObjectId[];
  creator: {
    _id: mongoose.Types.ObjectId;
    name: string;
  };
  users: mongoose.Types.ObjectId[];
}

const RoomSchema = new mongoose.Schema<RoomDocument>(
  {
    name: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    messages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
        default: []
      }
    ],
    creator: {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
      },
      name: {
        type: String,
        required: true
      }
    },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: []
      }
    ]
  },
  { timestamps: true, versionKey: false }
);

export default mongoose.model<RoomDocument>("Room", RoomSchema);
