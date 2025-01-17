import mongoose, { InferSchemaType, Schema } from "mongoose";

const chatSchema = new Schema(
  {
    workspaceId: {
      type: Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
    },
    name: { type: String, trim: true, required: true },
    visibility: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },
    chatType: {
      type: String,
      enum: ["group", "dm"],
      default: "group",
    },
    members: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        role: {
          type: String,
          enum: ["owner", "admin", "member"],
          default: "member",
        },
      },
    ],
  },
  { timestamps: true },
);

chatSchema.index({ workspaceId: 1 });

export type Chat = InferSchemaType<typeof chatSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Chat = mongoose.model("Chat", chatSchema);
