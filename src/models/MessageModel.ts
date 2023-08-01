import * as mongoose from "mongoose";

function timestamp() {
  return +new Date();
}

export interface MessageDocument extends mongoose.Document {
  sender_id: string;
  senderName: string;
  text: string;
  date: number;
  roomId: string;
}

const schema = new mongoose.Schema<MessageDocument>(
  {
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
  },
  { versionKey: false }
);

export default mongoose.model<MessageDocument>("Message", schema);
