import mongoose, { InferSchemaType, Schema } from "mongoose";

const workspaceSchema = new Schema(
  {
    name: { type: String, trim: true, required: true },
    members: [
      {
        userId: {
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

export type Workspace = InferSchemaType<typeof workspaceSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Workspace = mongoose.model("Workspace", workspaceSchema);
