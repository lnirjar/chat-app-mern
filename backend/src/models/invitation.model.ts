import mongoose, { InferSchemaType, Schema } from "mongoose";

const invitationSchema = new Schema(
  {
    workspaceId: {
      type: Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
    },
    inviteType: {
      type: String,
      enum: ["public", "private"],
      default: "private",
    },
    expiresAt: {
      type: Date,
    },
    invitees: [{ type: String, required: true }],
  },
  { timestamps: true },
);

invitationSchema.index({ workspaceId: 1 });

export type Invitation = InferSchemaType<typeof invitationSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Invitation = mongoose.model("Invitation", invitationSchema);
