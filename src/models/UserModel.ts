import * as mongoose from "mongoose";
import * as bcrypt from "bcrypt";

enum Status {
  ONLINE = "ONLINE",
  OFFLINE = "OFFLINE"
}

export interface UserDocument extends mongoose.Document {
  name: string;
  password: string;
  status: Status;
  rooms: mongoose.Types.ObjectId[];
}

const schema = new mongoose.Schema<UserDocument>(
  {
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
  },

  { versionKey: false }
);

schema.pre<UserDocument>("save", async function(next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

export default mongoose.model<UserDocument>("User", schema);
