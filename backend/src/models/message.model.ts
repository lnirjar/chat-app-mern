import mongoose, { InferSchemaType, Schema } from "mongoose";

const messageSchema = new Schema(
  {
    chatId: { type: Schema.Types.ObjectId, ref: "Chat", required: true },
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, maxLength: 2000, default: "" },
    attachment: { type: String },
  },
  { timestamps: true },
);

messageSchema.index({ chatId: 1 });

export type Message = InferSchemaType<typeof messageSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Message = mongoose.model("Message", messageSchema);
