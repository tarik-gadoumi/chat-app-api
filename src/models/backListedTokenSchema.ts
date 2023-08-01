import * as mongoose from "mongoose";

export interface BlacklistedTokenDocument extends mongoose.Document {
  token: string;
}

const blacklistedTokenSchema = new mongoose.Schema<BlacklistedTokenDocument>({
  token: String,
  createdAt: { type: Date, default: Date.now }
});

export const BlacklistedToken = mongoose.model(
  "BlacklistedToken",
  blacklistedTokenSchema
);
