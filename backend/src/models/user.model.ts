import mongoose, { InferSchemaType, Schema } from "mongoose";
import { generateRandomNumericString } from "../utils/random.utils";

const userSchema = new Schema(
  {
    name: { type: String, trim: true, required: true },
    avatar: { type: String, default: "" },
    username: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      minLength: 3,
      default: () => "user_" + generateRandomNumericString(10),
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      select: false,
    },
    password: { type: String, required: true, select: false },
    lastPasswordChange: { type: Date, default: Date.now, select: false },
  },
  { timestamps: true },
);

export type User = InferSchemaType<typeof userSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const User = mongoose.model("User", userSchema);
